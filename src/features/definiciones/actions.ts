'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const numero = (formData: FormData, campo: string) => Number(formData.get(campo) ?? 0) || 0

export async function crearSesion(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const descripcion = String(formData.get('descripcion') ?? '').trim()
  if (!descripcion) return

  const supabase = await createClient()
  const datos = {
    descripcion,
    porc_profesional: numero(formData, 'porc_profesional'),
    porc_instituto: numero(formData, 'porc_instituto'),
    monto: numero(formData, 'monto'),
    tiempo_sesion: Math.round(numero(formData, 'tiempo_sesion')),
    activo: formData.get('activo') === 'on',
    updated_at: new Date().toISOString(),
  }

  if (id) {
    await supabase.from('sesiones').update(datos).eq('id', id)
  } else {
    await supabase.from('sesiones').insert(datos)
  }

  revalidatePath('/dashboard/definiciones/sesiones')
}

export async function eliminarSesion(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('sesiones').delete().eq('id', id)

  revalidatePath('/dashboard/definiciones/sesiones')
}
