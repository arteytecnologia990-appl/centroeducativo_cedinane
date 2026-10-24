'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function crearIngreso(formData: FormData): Promise<void> {
  const documento = String(formData.get('documento') ?? '').trim()
  const usuario = String(formData.get('usuario') ?? '').trim()
  const metPago = String(formData.get('met_pago') ?? '').trim() || null
  const facturaCdc = String(formData.get('factura_cdc') ?? '').trim() || null

  const terapias = formData.getAll('terapia').map((v) => String(v).trim())
  const profesionales = formData.getAll('profesional').map((v) => String(v).trim())
  const precios = formData.getAll('precio_unitario').map((v) => Number(v) || 0)
  const cantidades = formData.getAll('cantidad').map((v) => Number(v) || 1)

  const items: {
    terapia: string
    profesional: string | null
    precio_unitario: number
    cantidad: number
    total: number
  }[] = []
  let total = 0

  for (let i = 0; i < terapias.length; i++) {
    if (!terapias[i]) continue
    const precio = precios[i] ?? 0
    const cantidad = cantidades[i] ?? 1
    const subtotal = precio * cantidad
    total += subtotal
    items.push({
      terapia: terapias[i],
      profesional: profesionales[i] || null,
      precio_unitario: precio,
      cantidad,
      total: subtotal,
    })
  }

  if (items.length === 0) return

  const supabase = await createClient()
  const { data: ingreso, error } = await supabase
    .from('ingresos')
    .insert({
      usuario: usuario || documento || '—',
      documento: documento || null,
      terapia: items.map((i) => i.terapia).join(' + '),
      profesional: items[0].profesional,
      precio_unitario: items[0].precio_unitario,
      cantidad: items.reduce((s, i) => s + i.cantidad, 0),
      total,
      met_pago: metPago,
      factura_cdc: facturaCdc,
    })
    .select('id')
    .single()

  if (error || !ingreso) return

  await supabase.from('ingreso_items').insert(items.map((i) => ({ ...i, ingreso_id: ingreso.id })))

  revalidatePath('/dashboard/ingresos')
}

export async function eliminarIngreso(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('ingresos').delete().eq('id', id)
  revalidatePath('/dashboard/ingresos')
}
