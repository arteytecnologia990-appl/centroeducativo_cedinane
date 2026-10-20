import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listarHorasPagables } from '@/features/horas-pagables/queries'
import { generarExcel, respuestaExcel } from '@/lib/reportes/excel'

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('No autorizado', { status: 401 })

  const { searchParams } = new URL(request.url)
  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mesParam = searchParams.get('mes') ?? ''
  const mes = /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : mesActual
  const [anio, mesNum] = mes.split('-').map(Number)

  const desde = `${anio}-${String(mesNum).padStart(2, '0')}-01`
  const ultimoDia = new Date(anio, mesNum, 0).getDate()
  const hasta = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`

  const filas = await listarHorasPagables({ desde, hasta })

  const buffer = await generarExcel({
    hoja: `Horas ${MESES[mesNum - 1]} ${anio}`,
    columnas: [
      { header: 'Persona', key: 'persona', width: 34 },
      { header: 'Días', key: 'dias', width: 8 },
      { header: 'Horas', key: 'horas', width: 10 },
      { header: 'Sueldo mensual', key: 'sueldo', width: 16 },
      { header: 'Total a pagar', key: 'total', width: 16 },
    ],
    filas: filas.map((f) => ({
      persona: f.persona,
      dias: f.dias,
      horas: f.horas,
      sueldo: f.sueldo ?? '',
      total: f.sueldo ?? '',
    })),
  })

  return respuestaExcel(buffer, `horas-pagables-${mes}`)
}
