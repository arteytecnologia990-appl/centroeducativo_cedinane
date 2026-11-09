import { createClient } from '@/lib/supabase/server'

export type FacturaDetalle = {
  cdc: string
  numero_documento: string | null
  documento_receptor: string | null
  nombre_informado: string | null
  condicion: string | null
  timbrado: string | null
  fecha_emision: string | null
  monto_total: number | null
  monto_gravado_10: number | null
  iva_10: number | null
  monto_gravado_5: number | null
  iva_5: number | null
  exento: number | null
}

export async function obtenerFactura(cdc: string): Promise<FacturaDetalle | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('facturas').select('*').eq('cdc', cdc).maybeSingle()
  return (data as FacturaDetalle | null) ?? null
}
