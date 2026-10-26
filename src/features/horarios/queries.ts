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
    .order('nombres', { ascending: true })

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

export type HorarioReporte = {
  id: string
  persona: string
  sede: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  actividad: string | null
  aula: string | null
}

export async function listarHorariosReporte(): Promise<HorarioReporte[]> {
  const supabase = await createClient()

  const { data: horarios } = await supabase
    .from('horarios')
    .select('id, persona_id, sede_id, dia_semana, hora_inicio, hora_fin, actividad, aula')
    .eq('activo', true)
    .is('deleted_at', null)
    .order('dia_semana', { ascending: true })
    .order('hora_inicio', { ascending: true })

  const { data: personas } = await supabase.from('personas').select('id, nombres, apellidos')
  const { data: sedes } = await supabase.from('sedes').select('id, codigo')

  const nombre = new Map((personas ?? []).map((p) => [p.id, `${p.nombres} ${p.apellidos}`]))
  const sede = new Map((sedes ?? []).map((s) => [s.id, s.codigo]))

  return (horarios ?? []).map((h) => ({
    id: h.id,
    persona: nombre.get(h.persona_id) ?? '—',
    sede: sede.get(h.sede_id) ?? '—',
    dia_semana: h.dia_semana,
    hora_inicio: h.hora_inicio,
    hora_fin: h.hora_fin,
    actividad: h.actividad,
    aula: h.aula,
  }))
}
