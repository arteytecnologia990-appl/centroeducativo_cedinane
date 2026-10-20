import 'server-only'
import ExcelJS from 'exceljs'

export type ColumnaReporte = { header: string; key: string; width?: number }

/** Genera un .xlsx en memoria a partir de columnas y filas. */
export async function generarExcel({
  hoja,
  columnas,
  filas,
}: {
  hoja: string
  columnas: ColumnaReporte[]
  filas: Record<string, unknown>[]
}): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Centro Educativo'
  const ws = wb.addWorksheet(hoja)

  ws.columns = columnas.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 18 }))
  filas.forEach((f) => ws.addRow(f))

  const cabecera = ws.getRow(1)
  cabecera.font = { bold: true }
  cabecera.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  ws.eachRow((row, n) => {
    if (n > 1) row.alignment = { vertical: 'middle', wrapText: true }
  })

  return new Uint8Array(await wb.xlsx.writeBuffer())
}

export function respuestaExcel(buffer: Uint8Array, nombre: string): Response {
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${nombre}.xlsx"`,
    },
  })
}
