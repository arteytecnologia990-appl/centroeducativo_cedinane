'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type Cargo = {
  id: string
  nombre: string
  descripcion: string | null
  programa_id: string | null
  parent_id: string | null
  orden: number
  activo: boolean
}

export async function listarCargos(): Promise<Cargo[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cargos')
    .select('id, nombre, descripcion, programa_id, parent_id, orden, activo')
    .order('orden')
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

/** Mueve un cargo a un programa y, opcionalmente, lo anida bajo otro cargo (parent_id). */
export async function moverCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const programaId = String(formData.get('programa_id') ?? '').trim() || null
  const parentId = String(formData.get('parent_id') ?? '').trim() || null
  if (!id || id === parentId) return

  const supabase = await createClient()
  await supabase.from('cargos').update({ programa_id: programaId, parent_id: parentId }).eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function toggleCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  const { data } = await supabase.from('cargos').select('activo').eq('id', id).maybeSingle()
  if (!data) return
  await supabase.from('cargos').update({ activo: !data.activo }).eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}

export async function eliminarCargo(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('cargos').delete().eq('id', id)
  revalidatePath('/dashboard/definiciones/cargos')
}
