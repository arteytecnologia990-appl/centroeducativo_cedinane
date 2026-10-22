import { createClient } from '@/lib/supabase/server'

export type Programa = {
  id: string
  nombre: string
  caja_ahorro: string | null
  logo: string
  ruc: string | null
  rtp: string | null
  resolucion: string | null
  activo: boolean
}

export async function listarProgramas(): Promise<Programa[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('programas').select('*').order('nombre', { ascending: true })
  return (data ?? []) as Programa[]
}
