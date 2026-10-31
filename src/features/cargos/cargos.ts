'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type Cargo = { id: string; nombre: string; descripcion: string | null; activo: boolean }

export async function listarCargos(): Promise<Cargo[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('cargos').select('id, nombre, descripcion, activo').order('nombre')
  return (data ?? []) as Cargo[]
}

export async function crearCargo(formData: FormData): Promise<void> {
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!nombre) return
  const descripcion = String(formData.get('descripcion') ?? '').trim() || null

  const supabase = await createClient()
  await supabase.from('cargos').insert({ nombre, descripcion })
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function eliminarCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('cargos').delete().eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}
