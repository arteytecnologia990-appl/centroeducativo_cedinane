import fs from 'node:fs'
import ExcelJS from 'exceljs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

function parseMonto(valor) {
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor
  const limpio = String(valor ?? '')
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  if (!limpio) return null
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

function parseFecha(valor) {
  if (valor instanceof Date) return valor.toISOString()
  const d = new Date(String(valor ?? ''))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

const wb = new ExcelJS.Workbook()
await wb.xlsx.readFile('C:/Users/SISTEMA ERP/Downloads/dte-emitidos.xlsx')
const ws = wb.worksheets[0]

const { data: existentes } = await supabase.from('facturas').select('cdc')
const vistos = new Set((existentes ?? []).map((f) => f.cdc))

const nuevas = []
const errores = []
let omitidas = 0
let canceladas = 0

ws.eachRow((row, idx) => {
  if (idx === 1) return
  const cdc = String(row.getCell(1).value ?? '').trim()
  if (!/^\d{44}$/.test(cdc)) {
    errores.push(`Fila ${idx}: CDC inválido (${cdc || 'vacío'})`)
    return
  }
  if (vistos.has(cdc)) {
    omitidas += 1
    return
  }
  const estado = String(row.getCell(2).value ?? '').trim() || 'Aprobado'
  const numero = String(row.getCell(3).value ?? '').trim()
  const documento = String(row.getCell(4).value ?? '').trim()
  if (!documento) {
    errores.push(`Fila ${idx}: sin documento receptor`)
    return
  }
  const monto = parseMonto(row.getCell(7).value)
  if (monto === null) {
    errores.push(`Fila ${idx}: monto inválido`)
    return
  }
  const fecha = parseFecha(row.getCell(5).value)
  if (estado.toLowerCase() === 'cancelado') canceladas += 1
  vistos.add(cdc)
  nuevas.push({
    cdc,
    estado,
    numero_documento: numero || null,
    documento_receptor: documento,
    fecha_emision: fecha,
    monto_total: monto,
    periodo: fecha ? fecha.slice(0, 7) : null,
  })
})

if (nuevas.length > 0) {
  const { error } = await supabase.from('facturas').insert(nuevas)
  if (error) {
    console.error('ERROR INSERT:', error.message)
    process.exit(1)
  }
}

console.log(
  JSON.stringify(
    {
      importadas: nuevas.length,
      omitidas,
      canceladas,
      errores: errores.length,
      detalleErrores: errores.slice(0, 10),
      totalPeriodos: [...new Set(nuevas.map((n) => n.periodo))],
      montoTotal: nuevas.reduce((s, n) => s + n.monto_total, 0),
    },
    null,
    2
  )
)
