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
    .select('id, nombres, apellidos, personal(sueldo, modalidad_salarial, jornada_tipo)')
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
      '*, personas(nombres, apellidos, ci, personal(sueldo, modalidad_salarial, jornada_tipo)), liquidacion_detalle(*)'
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
