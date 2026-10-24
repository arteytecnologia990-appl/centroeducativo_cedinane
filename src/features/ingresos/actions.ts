'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function crearIngreso(formData: FormData): Promise<void> {
  const documento = String(formData.get('documento') ?? '').trim()
  const usuario = String(formData.get('usuario') ?? '').trim()
  const terapia = String(formData.get('terapia') ?? '').trim()
  const precio = Number(formData.get('precio_unitario') ?? 0) || 0
  const cantidad = Number(formData.get('cantidad') ?? 1) || 1
  const total = Number(formData.get('total') ?? 0) || precio * cantidad

  if (!terapia) return

  const supabase = await createClient()
  await supabase.from('ingresos').insert({
    usuario: usuario || documento || '—',
    documento: documento || null,
    terapia,
    profesional: String(formData.get('profesional') ?? '').trim() || null,
    precio_unitario: precio,
    cantidad,
    total,
    met_pago: String(formData.get('met_pago') ?? '').trim() || null,
    factura_cdc: String(formData.get('factura_cdc') ?? '').trim() || null,
  })

  revalidatePath('/dashboard/ingresos')
}

export async function eliminarIngreso(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('ingresos').delete().eq('id', id)
  revalidatePath('/dashboard/ingresos')
}
