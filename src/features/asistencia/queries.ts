import { createClient } from '@/lib/supabase/server'

export type AsistenciaDia = {
  id: string
  persona_id: string
  persona: string
  hora_entrada: string | null
  hora_salida: string | null
  origen: string
}

export async function listarAsistenciasDia(fecha: string): Promise<AsistenciaDia[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('asistencias')
    .select('id, persona_id, hora_entrada, hora_salida, origen, personas(nombres, apellidos)')
    .eq('fecha', fecha)
    .order('hora_entrada', { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((a) => {
    const persona = a.personas as { nombres: string; apellidos: string } | null
    return {
      id: a.id,
      persona_id: a.persona_id,
      persona: persona ? `${persona.apellidos}, ${persona.nombres}` : '—',
      hora_entrada: a.hora_entrada,
      hora_salida: a.hora_salida,
      origen: a.origen,
    }
  })
}

export async function listarPersonasParaAsistencia() {
  const supabase = await createClient()
  const { data: roles } = await supabase
    .from('persona_roles')
    .select('persona_id')
    .in('rol_negocio', ['empleado', 'profesional'])

  const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
  if (ids.length === 0) return []

  const { data } = await supabase
    .from('personas')
    .select('id, nombres, apellidos')
    .in('id', ids)
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  return data ?? []
}
