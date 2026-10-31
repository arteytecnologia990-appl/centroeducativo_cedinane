'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type Cargo = {
  id: string
  nombre: string
  descripcion: string | null
  programa_id: string | null
  activo: boolean
}

export async function listarCargos(): Promise<Cargo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cargos')
    .select('id, nombre, descripcion, programa_id, activo')
    .order('nombre')
  return (data ?? []) as Cargo[]
}

export async function crearCargo(formData: FormData): Promise<void> {
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!nombre) return
  const descripcion = String(formData.get('descripcion') ?? '').trim() || null
  const programaId = String(formData.get('programa_id') ?? '').trim() || null

  const supabase = await createClient()
  await supabase.from('cargos').insert({ nombre, descripcion, programa_id: programaId })
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function editarCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!id || !nombre) return
  const descripcion = String(formData.get('descripcion') ?? '').trim() || null

  const supabase = await createClient()
  await supabase.from('cargos').update({ nombre, descripcion }).eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function moverCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const programaId = String(formData.get('programa_id') ?? '').trim() || null
  if (!id) return

  const supabase = await createClient()
  await supabase.from('cargos').update({ programa_id: programaId }).eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function eliminarCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('cargos').delete().eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}
