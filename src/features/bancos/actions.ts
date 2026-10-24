'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function crearBanco(formData: FormData): Promise<void> {
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!nombre) return

  const supabase = await createClient()
  await supabase.from('bancos').insert({ nombre })
  revalidatePath('/dashboard/bancos')
}

export async function eliminarBanco(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('bancos').delete().eq('id', id)
  revalidatePath('/dashboard/bancos')
}

export async function crearCuenta(formData: FormData): Promise<void> {
  const bancoId = String(formData.get('banco_id') ?? '')
  const numero = String(formData.get('numero') ?? '').trim()
  if (!bancoId || !numero) return

  const supabase = await createClient()
  await supabase.from('cuentas_bancarias').insert({
    banco_id: bancoId,
    numero,
    tipo: String(formData.get('tipo') ?? 'caja_ahorro'),
    titular: String(formData.get('titular') ?? '').trim() || null,
  })
  revalidatePath('/dashboard/bancos')
}

export async function eliminarCuenta(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('cuentas_bancarias').delete().eq('id', id)
  revalidatePath('/dashboard/bancos')
}
