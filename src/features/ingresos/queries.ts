import { createClient } from '@/lib/supabase/server'
import { normalizarDocumento } from '@/features/facturacion/queries'

export type Ingreso = {
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
  alumno_paciente: string | null
  cobrado: number
  saldo: number
}

export async function listarIngresos(): Promise<Ingreso[]> {
  const supabase = await createClient()
  const [{ data }, { data: cobros }] = await Promise.all([
    supabase.from('ingresos').select('*').order('created_at', { ascending: false }),
    supabase.from('cobros').select('factura_cdc, monto').not('factura_cdc', 'is', null),
  ])

  const cobradoPorFactura = new Map<string, number>()
  for (const c of cobros ?? []) {
    if (!c.factura_cdc) continue
    cobradoPorFactura.set(c.factura_cdc, (cobradoPorFactura.get(c.factura_cdc) ?? 0) + Number(c.monto))
  }

  return (data ?? []).map((c) => {
    const total = Number(c.total)
    const cobrado = c.factura_cdc ? (cobradoPorFactura.get(c.factura_cdc) ?? 0) : 0
    return {
      id: c.id,
      usuario: c.usuario,
      documento: c.documento,
      terapia: c.terapia,
      profesional: c.profesional,
      precio_unitario: Number(c.precio_unitario),
      cantidad: Number(c.cantidad),
      total,
      met_pago: c.met_pago,
      factura_cdc: c.factura_cdc,
      estado: c.estado,
      alumno_paciente: c.alumno_paciente,
      cobrado,
      saldo: total - cobrado,
    }
  })
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

export type IngresoItem = {
  id: string
  terapia: string
  profesional: string | null
  precio_unitario: number
  cantidad: number
  total: number
}

export async function obtenerIngreso(id: string) {
  const supabase = await createClient()
  const [{ data: ingreso }, { data: items }] = await Promise.all([
    supabase.from('ingresos').select('*').eq('id', id).maybeSingle(),
    supabase.from('ingreso_items').select('*').eq('ingreso_id', id).order('id', { ascending: true }),
  ])
  if (!ingreso) return null
  return {
    ...ingreso,
    items: (items ?? []).map((i) => ({
      id: i.id,
      terapia: i.terapia,
      profesional: i.profesional,
      precio_unitario: Number(i.precio_unitario),
      cantidad: Number(i.cantidad),
      total: Number(i.total),
    })) as IngresoItem[],
  }
}

export async function listarAlumnosPacientes(): Promise<{ id: string; nombre: string }[]> {
  const supabase = await createClient()
  const { data: roles } = await supabase
    .from('persona_roles')
    .select('persona_id')
    .in('rol_negocio', ['alumno', 'paciente'])
  const ids = [...new Set((roles ?? []).map((r) => r.persona_id))]
  if (ids.length === 0) return []
  const { data } = await supabase
    .from('personas')
    .select('id, nombres, apellidos')
    .in('id', ids)
    .is('deleted_at', null)
    .order('nombres', { ascending: true })
  return (data ?? []).map((p) => ({ id: p.id, nombre: `${p.nombres} ${p.apellidos}` }))
}

export async function listarFacturasCliente(documento: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('facturas')
    .select('cdc, numero_documento, monto_total')
    .eq('documento_receptor', documento)
    .order('fecha_emision', { ascending: false })
  return data ?? []
}
