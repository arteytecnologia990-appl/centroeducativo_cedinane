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
