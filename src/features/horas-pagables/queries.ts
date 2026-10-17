import { createClient } from '@/lib/supabase/server'

export type FilaHorasPagables = {
  persona_id: string
  persona: string
  dias: number
  horas: number
  sueldo: number | null
}

function aMinutos(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export async function listarHorasPagables({
  desde,
  hasta,
}: {
  desde: string
  hasta: string
}): Promise<FilaHorasPagables[]> {
  const supabase = await createClient()

  const { data: asistencias } = await supabase
    .from('asistencias')
    .select('persona_id, fecha, hora_entrada, hora_salida')
    .gte('fecha', desde)
    .lte('fecha', hasta)

  const { data: roles } = await supabase
    .from('persona_roles')
    .select('persona_id')
    .in('rol_negocio', ['empleado', 'profesional'])

  const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
  if (ids.length === 0) return []

  const { data: personas } = await supabase
    .from('personas')
    .select('id, nombres, apellidos, personal(sueldo)')
    .in('id', ids)
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  const acumulado = new Map<string, { dias: Set<string>; minutos: number }>()
  for (const a of asistencias ?? []) {
    if (!a.hora_entrada || !a.hora_salida) continue
    const diff = aMinutos(a.hora_salida) - aMinutos(a.hora_entrada)
    if (diff <= 0) continue
    const acc = acumulado.get(a.persona_id) ?? { dias: new Set<string>(), minutos: 0 }
    acc.dias.add(a.fecha)
    acc.minutos += diff
    acumulado.set(a.persona_id, acc)
  }

  return (personas ?? []).map((p) => {
    const acc = acumulado.get(p.id)
    const personal = p.personal as { sueldo: number | null } | null
    return {
      persona_id: p.id,
      persona: `${p.apellidos}, ${p.nombres}`,
      dias: acc?.dias.size ?? 0,
      horas: acc ? Math.round((acc.minutos / 60) * 100) / 100 : 0,
      sueldo: personal?.sueldo ?? null,
    }
  })
}
