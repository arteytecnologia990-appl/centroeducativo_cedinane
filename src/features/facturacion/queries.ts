import { createClient } from '@/lib/supabase/server'

export const normalizarDocumento = (d: string | null | undefined) =>
  (d ?? '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase()

export type ClienteSaldo = {
  documento: string
  nombre: string | null
  facturado: number
  cobrado: number
  saldo: number
  cantidad: number
}

export async function listarSaldos(): Promise<ClienteSaldo[]> {
  const supabase = await createClient()
  const [{ data: facturas }, { data: cobros }, { data: personas }] = await Promise.all([
    supabase.from('facturas').select('documento_receptor, monto_total, estado, nombre_informado'),
    supabase.from('cobros').select('documento_receptor, monto'),
    supabase.from('personas').select('ci, nombres, apellidos').is('deleted_at', null),
  ])

  const acumulado = new Map<string, { facturado: number; cobrado: number; cantidad: number }>()
  const nombrePorDocumento = new Map<string, string>()

  for (const f of facturas ?? []) {
    if (String(f.estado).toLowerCase() === 'cancelado') continue
    const k = normalizarDocumento(f.documento_receptor)
    const acc = acumulado.get(k) ?? { facturado: 0, cobrado: 0, cantidad: 0 }
    acc.facturado += Number(f.monto_total)
    acc.cantidad += 1
    acumulado.set(k, acc)
    if (f.nombre_informado) nombrePorDocumento.set(k, f.nombre_informado)
  }

  for (const c of cobros ?? []) {
    const k = normalizarDocumento(c.documento_receptor)
    const acc = acumulado.get(k) ?? { facturado: 0, cobrado: 0, cantidad: 0 }
    acc.cobrado += Number(c.monto)
    acumulado.set(k, acc)
  }

  for (const p of personas ?? []) {
    const k = normalizarDocumento(p.ci)
    if (k && !nombrePorDocumento.has(k)) nombrePorDocumento.set(k, `${p.apellidos}, ${p.nombres}`)
  }

  return [...acumulado.entries()]
    .map(([documento, acc]) => ({
      documento,
      nombre: nombrePorDocumento.get(documento) ?? null,
      facturado: acc.facturado,
      cobrado: acc.cobrado,
      saldo: acc.facturado - acc.cobrado,
      cantidad: acc.cantidad,
    }))
    .sort((a, b) => b.saldo - a.saldo)
}

export async function listarFacturas() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('facturas')
    .select('*')
    .order('fecha_emision', { ascending: false })
    .limit(200)
  return data ?? []
}

export async function listarCobros() {
  const supabase = await createClient()
  const { data } = await supabase.from('cobros').select('*').order('fecha', { ascending: false }).limit(100)
  return data ?? []
}

export type ClienteDetalle = {
  documento: string
  nombre: string | null
  facturas: {
    id: string
    cdc: string
    numero_documento: string | null
    fecha_emision: string | null
    monto_total: number
    estado: string
  }[]
  cobros: { id: string; fecha: string; monto: number; forma_pago: string; referencia: string | null }[]
  facturado: number
  cobrado: number
  saldo: number
}

export async function obtenerCliente(documento: string): Promise<ClienteDetalle> {
  const supabase = await createClient()
  const [{ data: facturas }, { data: cobros }] = await Promise.all([
    supabase.from('facturas').select('*').order('fecha_emision', { ascending: false }),
    supabase.from('cobros').select('*').order('fecha', { ascending: false }),
  ])

  const norm = normalizarDocumento(documento)
  const propias = (facturas ?? []).filter((f) => normalizarDocumento(f.documento_receptor) === norm)
  const cobrosPropios = (cobros ?? []).filter((c) => normalizarDocumento(c.documento_receptor) === norm)
  const facturado = propias.reduce((s, f) => s + Number(f.monto_total), 0)
  const cobrado = cobrosPropios.reduce((s, c) => s + Number(c.monto), 0)

  return {
    documento: propias[0]?.documento_receptor ?? documento,
    nombre: propias.find((f) => f.nombre_informado)?.nombre_informado ?? null,
    facturas: propias.map((f) => ({
      id: f.id,
      cdc: f.cdc,
      numero_documento: f.numero_documento,
      fecha_emision: f.fecha_emision,
      monto_total: Number(f.monto_total),
      estado: f.estado,
    })),
    cobros: cobrosPropios.map((c) => ({
      id: c.id,
      fecha: c.fecha,
      monto: Number(c.monto),
      forma_pago: c.forma_pago,
      referencia: c.referencia,
    })),
    facturado,
    cobrado,
    saldo: facturado - cobrado,
  }
}
