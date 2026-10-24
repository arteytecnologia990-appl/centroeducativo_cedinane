import fs from 'node:fs'
import ExcelJS from 'exceljs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

function parseFecha(valor) {
  if (valor instanceof Date) return valor.toISOString()
  const s = String(valor ?? '').trim()
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (m) return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]))).toISOString()
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function parsePeriodo(valor, fecha) {
  const s = String(valor ?? '').trim()
  const m = s.match(/^(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  if (/^\d{4}-\d{2}$/.test(s)) return s
  return fecha ? fecha.slice(0, 7) : null
}

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const ruta = process.argv[2] ?? 'C:/Users/SISTEMA ERP/Downloads/DetalleComprobantesRegistrados.xlsx'
const wb = new ExcelJS.Workbook()
await wb.xlsx.readFile(ruta)
const hoja = wb.worksheets[0]

const cols = {}
hoja.getRow(1).eachCell((cell, n) => {
  const k = norm(cell.value)
  if (k) cols[k] = n
})
const buscar = (patron, excluir) => {
  const key = Object.keys(cols).find((k) => k.includes(patron) && (!excluir || !k.includes(excluir)))
  return key ? cols[key] : null
}

const cCdc = buscar('cdc')
const cNombre = buscar('nombre o razon social del informado')
const cTipoId = buscar('tipo de identificacion del informado')
const cDoc = buscar('identificacion del informado', 'tipo')
const cFecha = buscar('fecha de emision')
const cPeriodo = buscar('periodo')
const cNumero = buscar('numero de comprobante', 'asociado')
const cTimbrado = buscar('timbrado del comprobante', 'asociado')
const cTotal = buscar('total comprobante')
const cGrav10 = buscar('monto gravado 10')
const cIva10 = buscar('iva 10')
const cGrav5 = buscar('monto gravado 5')
const cIva5 = buscar('iva 5')
const cExento = buscar('monto no gravado')
const cTipoComp = buscar('tipo de comprobante')
const cTipoReg = buscar('tipo de registro')
const cCond = buscar('condicion de la operacion')

const { data: existentes } = await supabase.from('facturas').select('cdc')
const vistos = new Set((existentes ?? []).map((f) => f.cdc))
const nuevas = []
const errores = []
let omitidas = 0

hoja.eachRow((row, idx) => {
  if (idx === 1) return
  const valor = (col) => (col ? row.getCell(col).value : null)
  const cdc = String(valor(cCdc) ?? '').trim()
  if (!/^\d{44}$/.test(cdc)) {
    errores.push(`Fila ${idx}: CDC inválido`)
    return
  }
  if (vistos.has(cdc)) {
    omitidas += 1
    return
  }
  const documento = String(valor(cDoc) ?? '').trim()
  if (!documento) {
    errores.push(`Fila ${idx}: sin documento`)
    return
  }
  const fecha = parseFecha(valor(cFecha))
  vistos.add(cdc)
  nuevas.push({
    cdc,
    estado: 'Registrado',
    documento_receptor: documento,
    nombre_informado: String(valor(cNombre) ?? '').trim() || null,
    tipo_identificacion: String(valor(cTipoId) ?? '').trim() || null,
    tipo_registro: String(valor(cTipoReg) ?? '').trim() || null,
    tipo_comprobante: String(valor(cTipoComp) ?? '').trim() || null,
    condicion: String(valor(cCond) ?? '').trim() || null,
    timbrado: String(valor(cTimbrado) ?? '').trim() || null,
    numero_documento: String(valor(cNumero) ?? '').trim() || null,
    fecha_emision: fecha,
    periodo: parsePeriodo(valor(cPeriodo), fecha),
    monto_total: num(valor(cTotal)),
    monto_gravado_10: num(valor(cGrav10)),
    iva_10: num(valor(cIva10)),
    monto_gravado_5: num(valor(cGrav5)),
    iva_5: num(valor(cIva5)),
    exento: num(valor(cExento)),
  })
})

if (nuevas.length > 0) {
  const { error } = await supabase.from('facturas').insert(nuevas)
  if (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  }
}

console.log(
  JSON.stringify(
    {
      filas: nuevas.length + omitidas + errores.length,
      importadas: nuevas.length,
      omitidas,
      errores: errores.slice(0, 10),
      montoTotal: nuevas.reduce((s, n) => s + n.monto_total, 0),
      iva10: nuevas.reduce((s, n) => s + n.iva_10, 0),
      periodos: [...new Set(nuevas.map((n) => n.periodo))],
    },
    null,
    2
  )
)
