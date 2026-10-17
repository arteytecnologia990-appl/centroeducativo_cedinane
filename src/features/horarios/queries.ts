import { createClient } from '@/lib/supabase/server'

export type Horario = {
  id: string
  persona_id: string
  sede_id: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  actividad: string | null
  aula: string | null
}

export type PersonaOpcion = { id: string; nombres: string; apellidos: string }

export async function listarPersonasParaHorario(): Promise<PersonaOpcion[]> {
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

  return (data ?? []) as PersonaOpcion[]
}

export async function listarSedes() {
  const supabase = await createClient()
  const { data } = await supabase.from('sedes').select('id, codigo, nombre').order('codigo')
  return data ?? []
}

export async function listarHorarios(personaId?: string): Promise<Horario[]> {
  const supabase = await createClient()
  let query = supabase
    .from('horarios')
    .select('id, persona_id, sede_id, dia_semana, hora_inicio, hora_fin, actividad, aula')
    .eq('activo', true)
    .is('deleted_at', null)
    .order('dia_semana', { ascending: true })
    .order('hora_inicio', { ascending: true })

  if (personaId) query = query.eq('persona_id', personaId)

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data ?? []) as Horario[]
}
