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
  const bancoId = String(formData.get('banco_id') ?? '') || null
  const cuentaId = String(formData.get('cuenta_id') ?? '') || null
  const nroTransferencia = String(formData.get('nro_transferencia') ?? '').trim() || null
  if (!documento || !Number.isFinite(monto) || monto <= 0) return

  const supabase = await createClient()
  await supabase.from('cobros').insert({
    documento_receptor: documento,
    monto,
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : new Date().toISOString().slice(0, 10),
    forma_pago: formaPago,
    referencia: String(formData.get('referencia') ?? '').trim() || null,
    banco_id: bancoId,
    cuenta_id: cuentaId,
    nro_transferencia: nroTransferencia,
  })

  revalidatePath('/dashboard/facturacion')
}

const limpiarXml = (v: string | null): string | null => {
  if (v === null) return null
  const s = v.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
  return s || null
}

const etiquetaXml = (xml: string, nombre: string): string | null => {
  const m = xml.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`))
  return m ? limpiarXml(m[1]) : null
}

export type DteXml = {
  cdc: string | null
  fecha: string | null
  nombre: string | null
  documento: string | null
  tipoIdentificacion: string | null
  timbrado: string | null
  numero: string | null
  total: number
  gravado10: number
  iva10: number
  gravado5: number
  iva5: number
  exento: number
}

function parsearXmlDte(xml: string): DteXml {
  const cdc = xml.match(/<DE\s+Id="(\d{44})"/)?.[1] ?? null
  const fecha = etiquetaXml(xml, 'dFeEmiDE')
  const nomRec = etiquetaXml(xml, 'dNomRec')
  const rucRec = etiquetaXml(xml, 'dRucRec')
  const dvRec = etiquetaXml(xml, 'dDVRec')
  const numIdRec = etiquetaXml(xml, 'dNumIDRec')
  const dEst = etiquetaXml(xml, 'dEst')
  const dPunExp = etiquetaXml(xml, 'dPunExp')
  const dNumDoc = etiquetaXml(xml, 'dNumDoc')
  const timbrado = etiquetaXml(xml, 'dNumTim')
  const numero = (v: string | null) => Number(v) || 0

  return {
    cdc,
    fecha: fecha ? fecha.slice(0, 10) : null,
    nombre: nomRec,
    documento: rucRec ? `${rucRec}-${dvRec ?? ''}` : numIdRec,
    tipoIdentificacion: rucRec ? 'RUC' : 'CEDULA',
    timbrado,
    numero: dEst && dPunExp && dNumDoc ? `${dEst}-${dPunExp}-${dNumDoc}` : null,
    total: numero(etiquetaXml(xml, 'dTotGralOpe')),
    gravado10: numero(etiquetaXml(xml, 'dSub10')),
    iva10: numero(etiquetaXml(xml, 'dIVA10')),
    gravado5: numero(etiquetaXml(xml, 'dSub5')),
    iva5: numero(etiquetaXml(xml, 'dIVA5')),
    exento: numero(etiquetaXml(xml, 'dSubExe')) + numero(etiquetaXml(xml, 'dSubExo')),
  }
}

export type XmlImportResult = {
  importadas: number
  omitidas: number
  errores: string[]
  detalle: { cdc: string; nombre: string | null; total: number }[]
  clientes: number
}

const normDoc = (d: string | null) => (d ?? '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase()

/** Da de alta como persona con rol "cliente" a los receptores que no existan. */
async function asegurarClientes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  receptores: { nombre: string | null; documento: string; tipo: string | null }[]
): Promise<number> {
  if (receptores.length === 0) return 0

  const { data: personas } = await supabase.from('personas').select('id, ci').is('deleted_at', null)
  const existentes = new Set((personas ?? []).map((p) => normDoc(p.ci)))
  const vistos = new Set<string>()
  let creadas = 0

  for (const r of receptores) {
    const base = normDoc(r.documento.split('-')[0])
    if (!base || existentes.has(base) || vistos.has(base)) continue
    vistos.add(base)

    const palabras = (r.nombre ?? '').trim().split(/\s+/).filter(Boolean)
    const apellidos = palabras.length >= 3 ? palabras.slice(-2).join(' ') : palabras.join(' ')
    const nombres = palabras.length >= 3 ? palabras.slice(0, -2).join(' ') : ''

    const { data: creada } = await supabase
      .from('personas')
      .insert({
        ci: base,
        nombres: nombres || apellidos || 'Cliente',
        apellidos,
        observaciones: `Alta automática desde XML (${r.tipo ?? 'doc'} ${r.documento})`,
      })
      .select('id')
      .single()

    if (!creada) continue

    await supabase.from('persona_roles').insert({
      persona_id: creada.id,
      rol_negocio: 'cliente',
      activo: true,
      vigencia_desde: new Date().toISOString().slice(0, 10),
    })
    creadas += 1
  }

  return creadas
}

export async function importarXmlDtes(formData: FormData): Promise<XmlImportResult> {
  const archivos = formData.getAll('archivos').filter((f): f is File => f instanceof File)
  if (archivos.length === 0) {
    return { importadas: 0, omitidas: 0, errores: ['No se enviaron archivos XML.'], detalle: [], clientes: 0 }
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
    tipo_registro: string
    tipo_comprobante: string
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
  const detalle: { cdc: string; nombre: string | null; total: number }[] = []
  let omitidas = 0

  for (const archivo of archivos) {
    const xml = await archivo.text()
    const d = parsearXmlDte(xml)
    if (!d.cdc) {
      errores.push(`${archivo.name}: no se encontró el CDC.`)
      continue
    }
    if (vistos.has(d.cdc)) {
      omitidas += 1
      continue
    }
    if (!d.documento) {
      errores.push(`${archivo.name}: sin documento del receptor.`)
      continue
    }

    vistos.add(d.cdc)
    nuevas.push({
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
    })
    detalle.push({ cdc: d.cdc, nombre: d.nombre, total: d.total })
  }

  if (nuevas.length > 0) {
    const { error } = await supabase.from('facturas').insert(nuevas)
    if (error) {
      return { importadas: 0, omitidas, errores: [...errores, error.message], detalle: [], clientes: 0 }
    }
  }

  const receptores = new Map<string, { nombre: string | null; documento: string; tipo: string | null }>()
  for (const n of nuevas) {
    receptores.set(n.documento_receptor, {
      nombre: n.nombre_informado,
      documento: n.documento_receptor,
      tipo: n.tipo_identificacion,
    })
  }
  const clientesCreados = await asegurarClientes(supabase, [...receptores.values()])

  revalidatePath('/dashboard/facturacion')
  return { importadas: nuevas.length, omitidas, errores, detalle, clientes: clientesCreados }
}
