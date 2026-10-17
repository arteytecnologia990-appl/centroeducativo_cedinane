import { createClient } from '@/lib/supabase/server'

export type PersonaListado = {
  id: string
  nombres: string
  apellidos: string
  ci: string | null
  email: string | null
  telefono: string | null
  persona_roles: { rol_negocio: string }[] | null
}

export async function listarPersonas({
  q,
  rol,
  page = 1,
  porPagina = 10,
}: {
  q?: string
  rol?: string
  page?: number
  porPagina?: number
}) {
  const supabase = await createClient()
  let query = supabase
    .from('personas')
    .select('id, nombres, apellidos, ci, email, telefono, persona_roles(rol_negocio)', { count: 'exact' })
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  if (rol) {
    const { data: roles } = await supabase.from('persona_roles').select('persona_id').eq('rol_negocio', rol)
    const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
    if (ids.length === 0) return { personas: [], total: 0 }
    query = query.in('id', ids)
  }

  if (q) {
    query = query.or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%,ci.ilike.%${q}%`)
  }

  const desde = (page - 1) * porPagina
  const { data, count, error } = await query.range(desde, desde + porPagina - 1)

  if (error) throw new Error(error.message)

  return { personas: (data ?? []) as PersonaListado[], total: count ?? 0 }
}

export async function obtenerPersona(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('personas')
    .select('*, personal(*), alumnos(*), persona_roles(id, rol_negocio, sede_id)')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) return null
  return data
}

export type PersonaReporte = {
  id: string
  nombres: string
  apellidos: string
  ci: string | null
  fecha_nacimiento: string | null
  direccion: string | null
  email: string | null
  telefono: string | null
  personal: {
    formacion_academica: string | null
    cargo: string | null
    experiencia_cargo: string | null
    antiguedad_institucion: string | null
    turno: string | null
    sector: string | null
    programa: string | null
    registro_profesional: string | null
    tiene_ci: boolean | null
    tiene_cv: boolean | null
    tiene_cd: boolean | null
  } | null
  persona_roles: { rol_negocio: string }[] | null
}

export async function listarPersonasReporte({ rol }: { rol?: string }): Promise<PersonaReporte[]> {
  const supabase = await createClient()
  let query = supabase
    .from('personas')
    .select(
      'id, nombres, apellidos, ci, fecha_nacimiento, direccion, email, telefono, personal(formacion_academica, cargo, experiencia_cargo, antiguedad_institucion, turno, sector, programa, registro_profesional, tiene_ci, tiene_cv, tiene_cd), persona_roles(rol_negocio)'
    )
    .is('deleted_at', null)
    .order('apellidos', { ascending: true })

  if (rol) {
    const { data: roles } = await supabase.from('persona_roles').select('persona_id').eq('rol_negocio', rol)
    const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
    if (ids.length === 0) return []
    query = query.in('id', ids)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as PersonaReporte[]
}
