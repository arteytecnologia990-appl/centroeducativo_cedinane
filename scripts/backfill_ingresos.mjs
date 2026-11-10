// Backfill: crea el ingreso de cada factura que ya tiene cobros
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const cfg = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => /^\s*[A-Za-z_][A-Za-z0-9_]*=/.test(l))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const supabase = createClient(cfg.NEXT_PUBLIC_SUPABASE_URL, cfg.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const { data: cobros } = await supabase
  .from('cobros')
  .select('factura_cdc, forma_pago')
  .not('factura_cdc', 'is', null)

const cdcs = [...new Set((cobros ?? []).map((c) => c.factura_cdc))]
console.log('facturas con cobros:', cdcs.length)

for (const cdc of cdcs) {
  const { data: factura } = await supabase
    .from('facturas')
    .select('cdc, documento_receptor, nombre_informado, monto_total')
    .eq('cdc', cdc)
    .maybeSingle()
  if (!factura) continue

  const { data: existente } = await supabase
    .from('ingresos')
    .select('id')
    .eq('factura_cdc', cdc)
    .limit(1)
    .maybeSingle()

  if (existente) {
    console.log(`ya tiene ingreso: ${cdc.slice(0, 12)}…`)
    continue
  }

  const forma = cobros.find((c) => c.factura_cdc === cdc)?.forma_pago ?? 'efectivo'
  const { data: ingreso, error } = await supabase
    .from('ingresos')
    .insert({
      usuario: factura.nombre_informado ?? factura.documento_receptor ?? '—',
      documento: factura.documento_receptor,
      terapia: 'Servicios facturados (DTE)',
      total: Number(factura.monto_total ?? 0),
      met_pago: forma,
      factura_cdc: cdc,
    })
    .select('id')
    .single()

  if (error || !ingreso) {
    console.log(`error ${cdc.slice(0, 12)}…:`, error?.message)
    continue
  }

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

  console.log(`ingreso creado: ${factura.nombre_informado ?? factura.documento_receptor} (${items?.length ?? 0} item/s)`)
}
