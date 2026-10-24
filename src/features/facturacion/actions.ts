'use server'

import ExcelJS from 'exceljs'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ImportResult = {
  importadas: number
  omitidas: number
  canceladas: number
  errores: string[]
}

const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

function parseFecha(valor: unknown): string | null {
  if (valor instanceof Date) return valor.toISOString()
  const s = String(valor ?? '').trim()
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (m) return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]))).toISOString()
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function parsePeriodo(valor: unknown, fecha: string | null): string | null {
  const s = String(valor ?? '').trim()
  const m = s.match(/^(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  if (/^\d{4}-\d{2}$/.test(s)) return s
  return fecha ? fecha.slice(0, 7) : null
}

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export async function importarDtes(formData: FormData): Promise<ImportResult> {
  const archivo = formData.get('archivo')
  if (!(archivo instanceof File)) {
    return { importadas: 0, omitidas: 0, canceladas: 0, errores: ['No se envió ningún archivo.'] }
  }

  const wb = new ExcelJS.Workbook()
  const bytes = await archivo.arrayBuffer()
  await wb.xlsx.load(Buffer.from(bytes) as unknown as Parameters<typeof wb.xlsx.load>[0])
  const hoja = wb.worksheets[0]
  if (!hoja) {
    return { importadas: 0, omitidas: 0, canceladas: 0, errores: ['El archivo no tiene hojas.'] }
  }

  const cols: Record<string, number> = {}
  hoja.getRow(1).eachCell((cell, n) => {
    const k = norm(cell.value)
    if (k) cols[k] = n
  })
  const buscar = (patron: string, excluir?: string) => {
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

  if (!cCdc || !cDoc) {
    return {
      importadas: 0,
      omitidas: 0,
      canceladas: 0,
      errores: ['No se encontraron las columnas CDC / Documento. ¿Es el Excel "DetalleComprobantesRegistrados"?'],
    }
  }

  const supabase = await createClient()
  const { data: existentes } = await supabase.from('facturas').select('cdc')
  const vistos = new Set((existentes ?? []).map((f) => f.cdc))

  const nuevas: {
    cdc: string
    estado: string
    documento_receptor: string
    nombre_informado: string | null
    tipo_identificacion: string | null
    tipo_registro: string | null
    tipo_comprobante: string | null
    condicion: string | null
    timbrado: string | null
    numero_documento: string | null
    fecha_emision: string | null
    periodo: string | null
    monto_total: number
    monto_gravado_10: number
    iva_10: number
    monto_gravado_5: number
    iva_5: number
    exento: number
  }[] = []
  const errores: string[] = []
  let omitidas = 0

  hoja.eachRow((row, idx) => {
    if (idx === 1) return

    const valor = (col: number | null) => (col ? row.getCell(col).value : null)
    const cdc = String(valor(cCdc) ?? '').trim()
    if (!/^\d{44}$/.test(cdc)) {
      errores.push(`Fila ${idx}: CDC inválido (${cdc || 'vacío'}).`)
      return
    }
    if (vistos.has(cdc)) {
      omitidas += 1
      return
    }

    const documento = String(valor(cDoc) ?? '').trim()
    if (!documento) {
      errores.push(`Fila ${idx}: sin documento del informado.`)
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
      return { importadas: 0, omitidas, canceladas: 0, errores: [...errores, error.message] }
    }
  }

  revalidatePath('/dashboard/facturacion')
  return { importadas: nuevas.length, omitidas, canceladas: 0, errores }
}

export async function crearCobro(formData: FormData): Promise<void> {
  const documento = String(formData.get('documento') ?? '').trim()
  const monto = Number(formData.get('monto') ?? 0)
  const fecha = String(formData.get('fecha') ?? '')
  const formaPago = String(formData.get('forma_pago') ?? 'efectivo')
  if (!documento || !Number.isFinite(monto) || monto <= 0) return

  const supabase = await createClient()
  await supabase.from('cobros').insert({
    documento_receptor: documento,
    monto,
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : new Date().toISOString().slice(0, 10),
    forma_pago: formaPago,
    referencia: String(formData.get('referencia') ?? '').trim() || null,
  })

  revalidatePath('/dashboard/facturacion')
}
