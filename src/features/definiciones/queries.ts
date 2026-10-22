import { createClient } from '@/lib/supabase/server'

export type Sesion = {
  id: string
  descripcion: string
  porc_profesional: number
  porc_instituto: number
  monto: number
  tiempo_sesion: number
  activo: boolean
  updated_at: string
}

export async function listarSesiones(): Promise<Sesion[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('sesiones').select('*').order('descripcion', { ascending: true })
  return (data ?? []) as Sesion[]
}
