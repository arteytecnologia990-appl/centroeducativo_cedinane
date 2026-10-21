'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calcularLiquidacion, type EmpleadoSalario, type NovedadesSalario } from './engine'
import { listarEmpleadosSalario, listarNovedades, obtenerParametros } from './queries'

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

  for (const e of empleados) {
    const sueldo = Number(e.personal?.sueldo ?? 0)
    if (!sueldo || sueldo <= 0) continue

    const emp: EmpleadoSalario = {
      personaId: e.id,
      nombre: `${e.apellidos}, ${e.nombres}`,
      sueldo,
      modalidad: (e.personal?.modalidad_salarial ?? 'mensual') as EmpleadoSalario['modalidad'],
      jornada: (e.personal?.jornada_tipo ?? 'diurna') as EmpleadoSalario['jornada'],
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
