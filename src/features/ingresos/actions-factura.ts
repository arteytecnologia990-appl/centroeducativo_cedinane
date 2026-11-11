'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Crea el ingreso de un DTE que todavía no tiene uno
 * (factura importada del XML sin servicio cargado).
 */
export async function crearIngresoDesdeFactura(formData: FormData): Promise<void> {
  const cdc = String(formData.get('cdc') ?? '').trim()
  if (!cdc) return

  const supabase = await createClient()

  const { data: factura } = await supabase
    .from('facturas')
    .select('cdc, documento_receptor, nombre_informado, monto_total')
    .eq('cdc', cdc)
    .maybeSingle()
  if (!factura) return

  const { data: existente } = await supabase
    .from('ingresos')
    .select('id')
    .eq('factura_cdc', cdc)
    .limit(1)
    .maybeSingle()
  if (existente) {
    revalidatePath('/dashboard/ingresos')
    return
  }

  const { data: ingreso } = await supabase
    .from('ingresos')
    .insert({
      usuario: factura.nombre_informado ?? factura.documento_receptor ?? '—',
      documento: factura.documento_receptor,
      terapia: 'Servicios facturados (DTE)',
      total: Number(factura.monto_total ?? 0),
      factura_cdc: cdc,
    })
    .select('id')
    .single()
  if (!ingreso) return

  await supabase
    .from('ingreso_facturas')
    .upsert(
      { ingreso_id: ingreso.id, factura_cdc: cdc },
      { onConflict: 'ingreso_id,factura_cdc', ignoreDuplicates: true }
    )

  const { data: items } = await supabase
    .from('factura_items')
    .select('*')
    .eq('factura_cdc', cdc)
    .order('orden')

  if (items && items.length > 0) {
    await supabase.from('ingreso_items').insert(
      items.map((i) => ({
        ingreso_id: ingreso.id,
        terapia: i.descripcion,
        precio_unitario: Number(i.precio_unitario),
        cantidad: Number(i.cantidad),
        total: Number(i.base_gravada) + Number(i.iva),
      }))
    )
  }

  revalidatePath('/dashboard/ingresos')
}
