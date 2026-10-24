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

function parseMonto(valor: unknown): number | null {
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor
  const limpio = String(valor ?? '')
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  if (!limpio) return null
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

function parseFecha(valor: unknown): string | null {
  if (valor instanceof Date) return valor.toISOString()
  const d = new Date(String(valor ?? ''))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export async function importarDtes(formData: FormData): Promise<ImportResult> {
  const archivo = formData.get('archivo')
  if (!(archivo instanceof File)) {
    return { importadas: 0, omitidas: 0, canceladas: 0, errores: ['No se envió ningún archivo.'] }
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(Buffer.from(await archivo.arrayBuffer()) as unknown as Buffer)
  const hoja = workbook.worksheets[0]
  if (!hoja) {
    return { importadas: 0, omitidas: 0, canceladas: 0, errores: ['El archivo no tiene hojas.'] }
  }

  const supabase = await createClient()
  const { data: existentes } = await supabase.from('facturas').select('cdc')
  const vistos = new Set((existentes ?? []).map((f) => f.cdc))

  const nuevas: {
    cdc: string
    estado: string
    numero_documento: string | null
    documento_receptor: string
    fecha_emision: string | null
    monto_total: number
    periodo: string | null
  }[] = []
  const errores: string[] = []
  let omitidas = 0
  let canceladas = 0

  hoja.eachRow((row, idx) => {
    if (idx === 1) return

    const cdc = String(row.getCell(1).value ?? '').trim()
    if (!/^\d{44}$/.test(cdc)) {
      errores.push(`Fila ${idx}: CDC inválido (${cdc || 'vacío'}).`)
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
      errores.push(`Fila ${idx}: sin documento receptor (CDC ${cdc.slice(0, 12)}…).`)
      return
    }

    const monto = parseMonto(row.getCell(7).value)
    if (monto === null) {
      errores.push(`Fila ${idx}: monto inválido.`)
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
      return { importadas: 0, omitidas, canceladas, errores: [...errores, error.message] }
    }
  }

  revalidatePath('/dashboard/facturacion')
  return { importadas: nuevas.length, omitidas, canceladas, errores }
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
