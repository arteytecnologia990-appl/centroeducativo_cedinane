import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { createClient } from '@/lib/supabase/server'
import { listarPersonasReporte } from '@/features/personas/queries/personas'

export const dynamic = 'force-dynamic'

function texto(v: string | null | undefined): string {
  return v && v.trim() !== '' ? v : ''
}

function fecha(v: string | null): string {
  if (!v) return ''
  const d = new Date(`${v}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

function sector(v: string | null | undefined): string {
  if (v === 'privado') return 'Privado'
  if (v === 'publico') return 'Público'
  return ''
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('No autorizado', { status: 401 })

  const personas = await listarPersonasReporte({ rol: 'empleado' })

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Centro Educativo'
  const ws = wb.addWorksheet('Datos del Personal')

  ws.columns = [
    { header: 'N°', key: 'n', width: 5 },
    { header: 'Nombre y Apellidos', key: 'nombre', width: 34 },
    { header: 'Número de C.I', key: 'ci', width: 13 },
    { header: 'Fecha de Nacimiento', key: 'fnac', width: 16 },
    { header: 'Dirección', key: 'dir', width: 36 },
    { header: 'Teléfono', key: 'tel', width: 15 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Formación académica', key: 'form', width: 22 },
    { header: 'Cargo', key: 'cargo', width: 26 },
    { header: 'Experiencia laboral en cargo', key: 'exp', width: 18 },
    { header: 'Antigüedad en la Institución', key: 'ant', width: 18 },
    { header: 'Turno', key: 'turno', width: 9 },
    { header: 'Sector', key: 'sector', width: 11 },
    { header: 'Programa', key: 'prog', width: 20 },
    { header: 'CI', key: 'tci', width: 5 },
    { header: 'CV', key: 'tcv', width: 5 },
    { header: 'CD', key: 'tcd', width: 5 },
    { header: 'Registro ó Matrícula', key: 'reg', width: 18 },
  ]

  personas.forEach((p, i) => {
    ws.addRow({
      n: i + 1,
      nombre: `${p.apellidos}, ${p.nombres}`,
      ci: p.ci ?? '',
      fnac: fecha(p.fecha_nacimiento),
      dir: texto(p.direccion),
      tel: texto(p.telefono),
      email: texto(p.email),
      form: texto(p.personal?.formacion_academica),
      cargo: texto(p.personal?.cargo),
      exp: texto(p.personal?.experiencia_cargo),
      ant: texto(p.personal?.antiguedad_institucion),
      turno: texto(p.personal?.turno),
      sector: sector(p.personal?.sector),
      prog: texto(p.personal?.programa),
      tci: p.personal?.tiene_ci ? 'X' : '',
      tcv: p.personal?.tiene_cv ? 'X' : '',
      tcd: p.personal?.tiene_cd ? 'X' : '',
      reg: texto(p.personal?.registro_profesional),
    })
  })

  const cabecera = ws.getRow(1)
  cabecera.font = { bold: true }
  cabecera.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  ws.views = [{ state: 'frozen', ySplit: 1 }]

  ws.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { vertical: 'middle', wrapText: true }
    }
  })

  const buffer = await wb.xlsx.writeBuffer()

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="datos-del-personal.xlsx"',
    },
  })
}
