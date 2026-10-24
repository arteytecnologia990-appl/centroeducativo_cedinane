import { createClient } from '@/lib/supabase/server'
import { normalizarDocumento } from '@/features/facturacion/queries'

export type Compromiso = {
  id: string
  usuario: string
  documento: string | null
  terapia: string
  profesional: string | null
  precio_unitario: number
  cantidad: number
  total: number
  met_pago: string | null
  factura_cdc: string | null
  estado: string
}

export async function listarCompromisos(): Promise<Compromiso[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('compromisos').select('*').order('created_at', { ascending: false })
  return (data ?? []).map((c) => ({
    id: c.id,
    usuario: c.usuario,
    documento: c.documento,
    terapia: c.terapia,
    profesional: c.profesional,
    precio_unitario: Number(c.precio_unitario),
    cantidad: Number(c.cantidad),
    total: Number(c.total),
    met_pago: c.met_pago,
    factura_cdc: c.factura_cdc,
    estado: c.estado,
  }))
}

export type ClienteConFacturas = {
  documento: string
  nombre: string
  facturas: { cdc: string; numero: string | null; monto: number }[]
}

export async function listarClientesConFacturas(): Promise<ClienteConFacturas[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('facturas')
    .select('documento_receptor, nombre_informado, cdc, numero_documento, monto_total')
    .order('fecha_emision', { ascending: false })

  const mapa = new Map<string, ClienteConFacturas>()
  for (const f of data ?? []) {
    const k = normalizarDocumento(f.documento_receptor)
    const acc = mapa.get(k) ?? {
      documento: f.documento_receptor,
      nombre: f.nombre_informado ?? f.documento_receptor,
      facturas: [],
    }
    acc.facturas.push({ cdc: f.cdc, numero: f.numero_documento, monto: Number(f.monto_total) })
    if (f.nombre_informado && (!acc.nombre || acc.nombre === acc.documento)) acc.nombre = f.nombre_informado
    mapa.set(k, acc)
  }
  return [...mapa.values()]
}
