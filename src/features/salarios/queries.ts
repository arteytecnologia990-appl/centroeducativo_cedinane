import { createClient } from '@/lib/supabase/server'

export async function obtenerParametros(periodo: string): Promise<Record<string, number>> {
  const supabase = await createClient()
  const fecha = `${periodo}-01`
  const { data } = await supabase
    .from('parametros_legales')
    .select('codigo, valor')
    .lte('vigencia_desde', fecha)
    .or(`vigencia_hasta.is.null,vigencia_hasta.gte.${fecha}`)

  const params: Record<string, number> = {}
  for (const p of data ?? []) params[p.codigo] = Number(p.valor)
  return params
}

export type EmpleadoFila = {
  id: string
  nombres: string
  apellidos: string
  personal: {
    sueldo: number | null
    modalidad_salarial: string | null
    jornada_tipo: string | null
    regimen: string | null
  } | null
}

export async function listarEmpleadosSalario(): Promise<EmpleadoFila[]> {
  const supabase = await createClient()
  const { data: roles } = await supabase
    .from('persona_roles')
    .select('persona_id')
    .in('rol_negocio', ['empleado', 'profesional'])

  const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
  if (ids.length === 0) return []

  const { data } = await supabase
    .from('personas')
    .select('id, nombres, apellidos, personal(sueldo, modalidad_salarial, jornada_tipo, regimen)')
    .in('id', ids)
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  return (data ?? []) as EmpleadoFila[]
}

export type NovedadFila = { persona_id: string; tipo: string; cantidad: number; unidad: string }

export async function listarNovedades(periodo: string): Promise<NovedadFila[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('novedades')
    .select('persona_id, tipo, cantidad, unidad')
    .eq('periodo', periodo)
  return (data ?? []) as NovedadFila[]
}

export type LiquidacionFila = {
  id: string
  persona_id: string
  persona: string
  total_haberes: number
  total_descuentos: number
  neto_pagar: number
  estado: string
}

export async function listarLiquidaciones(periodo: string): Promise<LiquidacionFila[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('liquidaciones')
    .select('id, persona_id, total_haberes, total_descuentos, neto_pagar, estado, personas(nombres, apellidos)')
    .eq('periodo', periodo)
    .order('created_at', { ascending: true })

  return (data ?? []).map((l) => {
    const persona = l.personas as { nombres: string; apellidos: string } | null
    return {
      id: l.id,
      persona_id: l.persona_id,
      persona: persona ? `${persona.apellidos}, ${persona.nombres}` : '—',
      total_haberes: Number(l.total_haberes),
      total_descuentos: Number(l.total_descuentos),
      neto_pagar: Number(l.neto_pagar),
      estado: l.estado,
    }
  })
}

export async function obtenerLiquidacion(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('liquidaciones')
    .select(
      '*, personas(nombres, apellidos, ci, personal(sueldo, modalidad_salarial, jornada_tipo, cargo, programa, caja_ahorro, programas(nombre, logo, caja_ahorro, ruc, rtp))), liquidacion_detalle(*)'
    )
    .eq('id', id)
    .maybeSingle()
  return data ?? null
}

export type NovedadDetalle = {
  id: string
  persona_id: string
  persona: string
  tipo: string
  cantidad: number
  unidad: string
  justificacion: string | null
}

export async function listarNovedadesPeriodo(periodo: string): Promise<NovedadDetalle[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('novedades')
    .select('id, persona_id, tipo, cantidad, unidad, justificacion, personas(nombres, apellidos)')
    .eq('periodo', periodo)
    .order('created_at', { ascending: true })

  return (data ?? []).map((n) => {
    const persona = n.personas as { nombres: string; apellidos: string } | null
    return {
      id: n.id,
      persona_id: n.persona_id,
      persona: persona ? `${persona.apellidos}, ${persona.nombres}` : '—',
      tipo: n.tipo,
      cantidad: Number(n.cantidad),
      unidad: n.unidad,
      justificacion: n.justificacion,
    }
  })
}

/** Días ausentes por persona según la asistencia (calendario) del período. */
export async function listarAusenciasAsistencia(periodo: string): Promise<Record<string, number>> {
  const supabase = await createClient()
  const [anio, mes] = periodo.split('-').map(Number)
  const desde = `${periodo}-01`
  const ultimo = new Date(anio, mes, 0).getDate()
  const hasta = `${periodo}-${String(ultimo).padStart(2, '0')}`

  const { data } = await supabase
    .from('asistencias')
    .select('persona_id')
    .eq('estado', 'ausente')
    .gte('fecha', desde)
    .lte('fecha', hasta)

  const acc: Record<string, number> = {}
  for (const a of data ?? []) acc[a.persona_id] = (acc[a.persona_id] ?? 0) + 1
  return acc
}

export async function listarParametrosLegales() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('parametros_legales')
    .select('*')
    .order('codigo', { ascending: true })
    .order('vigencia_desde', { ascending: false })
  return data ?? []
}

export async function listarFeriados() {
  const supabase = await createClient()
  const { data } = await supabase.from('feriados').select('*').order('fecha', { ascending: true })
  return data ?? []
}

export async function listarFeriadosMes(desde: string, hasta: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('feriados')
    .select('fecha, nombre')
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha', { ascending: true })
  return data ?? []
}

/** Horas trabajadas en feriado (según asistencia presente + horario asignado). */
export async function horasFeriadoPorAsistencia(periodo: string): Promise<Record<string, number>> {
  const supabase = await createClient()
  const [anio, mes] = periodo.split('-').map(Number)
  const desde = `${periodo}-01`
  const hasta = `${periodo}-${String(new Date(anio, mes, 0).getDate()).padStart(2, '0')}`

  const { data: feriados } = await supabase
    .from('feriados')
    .select('fecha')
    .gte('fecha', desde)
    .lte('fecha', hasta)
  const fechasFeriado = new Set((feriados ?? []).map((f) => f.fecha))
  if (fechasFeriado.size === 0) return {}

  const { data: presentes } = await supabase
    .from('asistencias')
    .select('persona_id, fecha')
    .eq('estado', 'presente')
    .gte('fecha', desde)
    .lte('fecha', hasta)

  const { data: horarios } = await supabase
    .from('horarios')
    .select('persona_id, dia_semana, hora_inicio, hora_fin')
    .eq('activo', true)
    .is('deleted_at', null)

  const span = new Map<string, Map<number, { inicio: string; fin: string }>>()
  for (const h of horarios ?? []) {
    const m = span.get(h.persona_id) ?? new Map<number, { inicio: string; fin: string }>()
    const prev = m.get(h.dia_semana)
    if (!prev) {
      m.set(h.dia_semana, { inicio: h.hora_inicio, fin: h.hora_fin })
    } else {
      m.set(h.dia_semana, {
        inicio: prev.inicio < h.hora_inicio ? prev.inicio : h.hora_inicio,
        fin: prev.fin > h.hora_fin ? prev.fin : h.hora_fin,
      })
    }
    span.set(h.persona_id, m)
  }

  const horas: Record<string, number> = {}
  for (const p of presentes ?? []) {
    if (!fechasFeriado.has(p.fecha)) continue
    const iso = ((new Date(`${p.fecha}T00:00:00`).getDay() + 6) % 7) + 1
    const s = span.get(p.persona_id)?.get(iso)
    let h = 8
    if (s) {
      const [hi, mi] = s.inicio.split(':').map(Number)
      const [hf, mf] = s.fin.split(':').map(Number)
      const calc = (hf * 60 + mf - (hi * 60 + mi)) / 60
      if (calc > 0) h = calc
    }
    horas[p.persona_id] = (horas[p.persona_id] ?? 0) + h
  }
  return horas
}

export type AdelantoFila = {
  id: string
  numero: number
  persona_id: string
  persona: string
  periodo: string
  fecha: string
  monto: number
  concepto: string
  caja_ahorro: string | null
}

export async function listarAdelantos(periodo: string): Promise<AdelantoFila[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('adelantos')
    .select('id, numero, persona_id, periodo, fecha, monto, concepto, caja_ahorro, personas(nombres, apellidos)')
    .eq('periodo', periodo)
    .order('numero', { ascending: false })

  return (data ?? []).map((a) => {
    const persona = a.personas as { nombres: string; apellidos: string } | null
    return {
      id: a.id,
      numero: a.numero,
      persona_id: a.persona_id,
      persona: persona ? `${persona.apellidos}, ${persona.nombres}` : '—',
      periodo: a.periodo,
      fecha: a.fecha,
      monto: Number(a.monto),
      concepto: a.concepto,
      caja_ahorro: a.caja_ahorro,
    }
  })
}

export async function listarAdelantosPeriodo(periodo: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('adelantos')
    .select('persona_id, monto, fecha')
    .eq('periodo', periodo)
    .order('fecha', { ascending: true })
  return data ?? []
}

export async function obtenerAdelanto(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('adelantos')
    .select(
      '*, adelanto_items(*), personas(nombres, apellidos, ci, personal(cargo, caja_ahorro, programas(nombre, logo, caja_ahorro)))'
    )
    .eq('id', id)
    .maybeSingle()
  return data ?? null
}

export type PersonaRegimen = { id: string; nombres: string; apellidos: string; regimen: string }

export async function listarPersonasConRegimen(): Promise<PersonaRegimen[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('personas')
    .select('id, nombres, apellidos, personal(regimen)')
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  return (data ?? []).map((p) => {
    const personal = p.personal as { regimen: string | null } | null
    return { id: p.id, nombres: p.nombres, apellidos: p.apellidos, regimen: personal?.regimen ?? 'dependencia' }
  })
}
