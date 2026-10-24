import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const limpiar = (v) => (v === null ? null : v.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || null)
const etiqueta = (xml, nombre) => {
  const m = xml.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`))
  return m ? limpiar(m[1]) : null
}

function parsear(xml) {
  const cdc = xml.match(/<DE\s+Id="(\d{44})"/)?.[1] ?? null
  const fecha = etiqueta(xml, 'dFeEmiDE')
  const nomRec = etiqueta(xml, 'dNomRec')
  const rucRec = etiqueta(xml, 'dRucRec')
  const dvRec = etiqueta(xml, 'dDVRec')
  const numIdRec = etiqueta(xml, 'dNumIDRec')
  const dEst = etiqueta(xml, 'dEst')
  const dPunExp = etiqueta(xml, 'dPunExp')
  const dNumDoc = etiqueta(xml, 'dNumDoc')
  const timbrado = etiqueta(xml, 'dNumTim')
  const n = (v) => Number(v) || 0
  return {
    cdc,
    fecha: fecha ? fecha.slice(0, 10) : null,
    nombre: nomRec,
    documento: rucRec ? `${rucRec}-${dvRec ?? ''}` : numIdRec,
    tipoIdentificacion: rucRec ? 'RUC' : 'CEDULA',
    timbrado,
    numero: dEst && dPunExp && dNumDoc ? `${dEst}-${dPunExp}-${dNumDoc}` : null,
    total: n(etiqueta(xml, 'dTotGralOpe')),
    gravado10: n(etiqueta(xml, 'dSub10')),
    iva10: n(etiqueta(xml, 'dIVA10')),
    gravado5: n(etiqueta(xml, 'dSub5')),
    iva5: n(etiqueta(xml, 'dIVA5')),
    exento: n(etiqueta(xml, 'dSubExe')) + n(etiqueta(xml, 'dSubExo')),
  }
}

const { data: existentes } = await supabase.from('facturas').select('cdc')
const vistos = new Set((existentes ?? []).map((f) => f.cdc))
const nuevas = []
const detalle = []
let omitidas = 0

for (const ruta of process.argv.slice(2)) {
  const xml = fs.readFileSync(ruta, 'utf8')
  const d = parsear(xml)
  if (!d.cdc || !d.documento) {
    console.error('Sin CDC/documento:', ruta)
    continue
  }
  if (vistos.has(d.cdc)) {
    omitidas += 1
    continue
  }
  vistos.add(d.cdc)
  const fila = {
    cdc: d.cdc,
    estado: 'Registrado',
    documento_receptor: d.documento,
    nombre_informado: d.nombre,
    tipo_identificacion: d.tipoIdentificacion,
    tipo_registro: 'VENTAS',
    tipo_comprobante: 'FACTURA',
    timbrado: d.timbrado,
    numero_documento: d.numero,
    fecha_emision: d.fecha ? new Date(`${d.fecha}T00:00:00`).toISOString() : null,
    periodo: d.fecha ? d.fecha.slice(0, 7) : null,
    monto_total: d.total,
    monto_gravado_10: d.gravado10,
    iva_10: d.iva10,
    monto_gravado_5: d.gravado5,
    iva_5: d.iva5,
    exento: d.exento,
  }
  nuevas.push(fila)
  detalle.push({ cdc: d.cdc, nombre: d.nombre, documento: d.documento, total: d.total, iva10: d.iva10 })
}

if (nuevas.length > 0) {
  const { error } = await supabase.from('facturas').insert(nuevas)
  if (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  }
}

console.log(JSON.stringify({ importadas: nuevas.length, omitidas, detalle }, null, 2))
