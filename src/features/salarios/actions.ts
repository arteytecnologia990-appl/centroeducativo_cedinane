'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calcularLiquidacion, type EmpleadoSalario, type NovedadesSalario } from './engine'
import {
  horasFeriadoPorAsistencia,
  listarAdelantosPeriodo,
  listarAusenciasAsistencia,
  listarEmpleadosSalario,
  listarNovedades,
  obtenerParametros,
} from './queries'

export async function calcularPeriodo(formData: FormData): Promise<void> {
  const periodo = String(formData.get('periodo') ?? '')
  if (!/^\d{4}-\d{2}$/.test(periodo)) return

  const supabase = await createClient()
  const params = await obtenerParametros(periodo)
  if (Object.keys(params).length === 0) return

  const empleados = await listarEmpleadosSalario()
  const novedades = await listarNovedades(periodo)

  const porPersona = new Map<string, NovedadesSalario>()
  for (const n of novedades) {
    const acc =
      porPersona.get(n.persona_id) ??
      ({ horasExtra: 0, horasNocturnas: 0, horasFeriado: 0, ausenciasDias: 0, adelanto: 0 } as NovedadesSalario)
    const cant = Number(n.cantidad) || 0
    if (n.tipo === 'horas_extra') acc.horasExtra += cant
    else if (n.tipo === 'horas_nocturnas') acc.horasNocturnas += cant
    else if (n.tipo === 'horas_feriado') acc.horasFeriado += cant
    else if (n.tipo === 'ausencia') acc.ausenciasDias += cant
    else if (n.tipo === 'adelanto') acc.adelanto += cant
    porPersona.set(n.persona_id, acc)
  }

  // Ausencias marcadas en Asistencia (calendario) también cuentan.
  const ausenciasAsistencia = await listarAusenciasAsistencia(periodo)
  for (const [personaId, dias] of Object.entries(ausenciasAsistencia)) {
    const acc =
      porPersona.get(personaId) ??
      ({ horasExtra: 0, horasNocturnas: 0, horasFeriado: 0, ausenciasDias: 0, adelanto: 0 } as NovedadesSalario)
    acc.ausenciasDias += dias
    porPersona.set(personaId, acc)
  }

  // Horas trabajadas en feriados (asistencia presente) → se pagan ×2.
  const horasFeriado = await horasFeriadoPorAsistencia(periodo)
  for (const [personaId, horas] of Object.entries(horasFeriado)) {
    const acc =
      porPersona.get(personaId) ??
      ({ horasExtra: 0, horasNocturnas: 0, horasFeriado: 0, ausenciasDias: 0, adelanto: 0 } as NovedadesSalario)
    acc.horasFeriado += horas
    porPersona.set(personaId, acc)
  }

  // Adelantos de salario del período (se descuentan del neto).
  const adelantos = await listarAdelantosPeriodo(periodo)
  for (const a of adelantos) {
    const acc =
      porPersona.get(a.persona_id) ??
      ({ horasExtra: 0, horasNocturnas: 0, horasFeriado: 0, ausenciasDias: 0, adelanto: 0 } as NovedadesSalario)
    const monto = Number(a.monto) || 0
    acc.adelanto += monto
    acc.adelantosDetalle = [...(acc.adelantosDetalle ?? []), { fecha: a.fecha, monto }]
    porPersona.set(a.persona_id, acc)
  }

  for (const e of empleados) {
    const sueldo = Number(e.personal?.sueldo ?? 0)
    if (!sueldo || sueldo <= 0) continue

    const emp: EmpleadoSalario = {
      personaId: e.id,
      nombre: `${e.apellidos}, ${e.nombres}`,
      sueldo,
      modalidad: (e.personal?.modalidad_salarial ?? 'mensual') as EmpleadoSalario['modalidad'],
      jornada: (e.personal?.jornada_tipo ?? 'diurna') as EmpleadoSalario['jornada'],
      regimen: (e.personal?.regimen ?? 'dependencia') as EmpleadoSalario['regimen'],
    }

    const nov =
      porPersona.get(e.id) ??
      ({ horasExtra: 0, horasNocturnas: 0, horasFeriado: 0, ausenciasDias: 0, adelanto: 0 } as NovedadesSalario)

    const r = calcularLiquidacion(emp, nov, params)

    const { data: liq, error } = await supabase
      .from('liquidaciones')
      .upsert(
        {
          persona_id: e.id,
          periodo,
          version: 1,
          total_haberes: r.totalHaberes,
          total_descuentos: r.totalDescuentos,
          neto_pagar: r.neto,
          total_aportes_patronales: r.ipsPatronal,
          estado: 'calculada',
        },
        { onConflict: 'persona_id,periodo,version' }
      )
      .select('id')
      .single()

    if (error || !liq) continue

    await supabase.from('liquidacion_detalle').delete().eq('liquidacion_id', liq.id)
    await supabase.from('liquidacion_detalle').insert(
      r.detalle.map((d) => ({
        liquidacion_id: liq.id,
        concepto_codigo: d.codigo,
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        base_calculo: d.base,
        tasa: d.tasa,
        importe: d.importe,
        orden: d.orden,
      }))
    )
  }

  revalidatePath('/dashboard/salarios')
}

export async function aprobarLiquidacion(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase
    .from('liquidaciones')
    .update({ estado: 'aprobada', fecha_aprobacion: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/dashboard/salarios')
  revalidatePath(`/dashboard/salarios/${id}`)
}

export async function anularLiquidacion(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('liquidaciones').update({ estado: 'anulada' }).eq('id', id)

  revalidatePath('/dashboard/salarios')
  revalidatePath(`/dashboard/salarios/${id}`)
}

const UNIDAD_POR_TIPO: Record<string, string> = {
  horas_extra: 'horas',
  horas_nocturnas: 'horas',
  horas_feriado: 'horas',
  ausencia: 'dias',
  adelanto: 'gs',
}

export async function crearNovedad(formData: FormData): Promise<void> {
  const personaId = String(formData.get('persona_id') ?? '')
  const periodo = String(formData.get('periodo') ?? '')
  const tipo = String(formData.get('tipo') ?? '')
  const cantidad = Number(formData.get('cantidad') ?? 0)

  if (!personaId || !/^\d{4}-\d{2}$/.test(periodo) || !tipo || !Number.isFinite(cantidad) || cantidad <= 0) return

  const supabase = await createClient()
  await supabase.from('novedades').insert({
    persona_id: personaId,
    periodo,
    tipo,
    cantidad,
    unidad: UNIDAD_POR_TIPO[tipo] ?? 'horas',
    justificacion: String(formData.get('justificacion') ?? '').trim() || null,
    estado: 'aprobada',
  })

  revalidatePath('/dashboard/salarios/novedades')
  revalidatePath('/dashboard/salarios')
}

export async function eliminarNovedad(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('novedades').delete().eq('id', id)

  revalidatePath('/dashboard/salarios/novedades')
  revalidatePath('/dashboard/salarios')
}

export async function eliminarLiquidacion(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('liquidaciones').delete().eq('id', id)

  revalidatePath('/dashboard/salarios')
  redirect('/dashboard/salarios')
}

export async function crearParametro(formData: FormData): Promise<void> {
  const codigo = String(formData.get('codigo') ?? '').trim()
  const nombre = String(formData.get('nombre') ?? '').trim()
  const valor = Number(formData.get('valor') ?? 0)
  const unidad = String(formData.get('unidad') ?? 'gs')
  const vigencia = String(formData.get('vigencia_desde') ?? '')

  if (!codigo || !nombre || !Number.isFinite(valor) || !/^\d{4}-\d{2}-\d{2}$/.test(vigencia)) return

  const supabase = await createClient()
  await supabase.from('parametros_legales').upsert(
    {
      codigo,
      nombre,
      valor,
      unidad,
      vigencia_desde: vigencia,
      norma: String(formData.get('norma') ?? '').trim() || null,
      fuente: String(formData.get('fuente') ?? '').trim() || null,
      validado: false,
    },
    { onConflict: 'codigo,vigencia_desde' }
  )

  revalidatePath('/dashboard/salarios/parametros')
}

export async function eliminarParametro(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('parametros_legales').delete().eq('id', id)
  revalidatePath('/dashboard/salarios/parametros')
}

export async function crearFeriado(formData: FormData): Promise<void> {
  const fecha = String(formData.get('fecha') ?? '')
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !nombre) return

  const fechaOriginal = String(formData.get('fecha_original') ?? '')
  const movilidad = String(formData.get('movilidad') ?? 'fijo')
  const estado = String(formData.get('estado_validacion') ?? 'pendiente')

  const supabase = await createClient()
  await supabase.from('feriados').upsert(
    {
      fecha,
      nombre,
      tipo: String(formData.get('tipo') ?? 'nacional'),
      pais: 'PY',
      fecha_original: /^\d{4}-\d{2}-\d{2}$/.test(fechaOriginal) ? fechaOriginal : fecha,
      movilidad: movilidad === 'movil' ? 'movil' : 'fijo',
      estado_validacion: ['pendiente', 'verificado', 'revisar'].includes(estado) ? estado : 'pendiente',
      norma: String(formData.get('norma') ?? '').trim() || null,
      nota: String(formData.get('nota') ?? '').trim() || null,
      validado: estado === 'verificado',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'fecha' }
  )

  revalidatePath('/dashboard/salarios/feriados')
}

export async function eliminarFeriado(formData: FormData): Promise<void> {
  const fecha = String(formData.get('fecha') ?? '')
  if (!fecha) return

  const supabase = await createClient()
  await supabase.from('feriados').delete().eq('fecha', fecha)
  revalidatePath('/dashboard/salarios/feriados')
}

export async function crearAdelanto(formData: FormData): Promise<void> {
  const personaId = String(formData.get('persona_id') ?? '')
  const periodo = String(formData.get('periodo') ?? '')
  const fecha = String(formData.get('fecha') ?? '')
  const monto = Number(formData.get('monto') ?? 0)
  if (!personaId || !/^\d{4}-\d{2}$/.test(periodo) || !Number.isFinite(monto) || monto <= 0) return

  const supabase = await createClient()
  await supabase.from('adelantos').insert({
    persona_id: personaId,
    periodo,
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : new Date().toISOString().slice(0, 10),
    monto,
    concepto: String(formData.get('concepto') ?? '').trim() || 'Adelanto de salario',
  })

  revalidatePath('/dashboard/salarios/adelantos')
  revalidatePath('/dashboard/salarios')
}

export async function eliminarAdelanto(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('adelantos').delete().eq('id', id)

  revalidatePath('/dashboard/salarios/adelantos')
  revalidatePath('/dashboard/salarios')
}
