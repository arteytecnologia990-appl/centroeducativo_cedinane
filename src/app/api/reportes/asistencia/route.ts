import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { obtenerPersona } from '@/features/personas/queries/personas'
import { generarExcel, respuestaExcel } from '@/lib/reportes/excel'

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('No autorizado', { status: 401 })

  const { searchParams } = new URL(request.url)
  const personaId = searchParams.get('persona_id') ?? ''
  if (!personaId) return new NextResponse('Falta persona_id', { status: 400 })

  const persona = await obtenerPersona(personaId)
  if (!persona) return new NextResponse('No encontrada', { status: 404 })

  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mesParam = searchParams.get('mes') ?? ''
  const mes = /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : mesActual
  const [anio, mesNum] = mes.split('-').map(Number)

  const totalDias = new Date(anio, mesNum, 0).getDate()
  const fmtDia = new Intl.DateTimeFormat('es-PY', { weekday: 'short' })
  const fmtFecha = new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const filas = Array.from({ length: totalDias }, (_, i) => {
    const fecha = new Date(anio, mesNum - 1, i + 1)
    return {
      n: i + 1,
      dia: `${fmtDia.format(fecha).replace('.', '').toUpperCase()}.`,
      fecha: fmtFecha.format(fecha),
      entrada: '',
      firma1: '',
      obs1: '',
      salida: '',
      firma2: '',
      obs2: '',
    }
  })

  const buffer = await generarExcel({
    hoja: 'Asistencia',
    columnas: [
      { header: 'N°', key: 'n', width: 6 },
      { header: 'DÍA', key: 'dia', width: 8 },
      { header: 'FECHA', key: 'fecha', width: 12 },
      { header: 'HORA ENTRADA', key: 'entrada', width: 14 },
      { header: 'FIRMA', key: 'firma1', width: 12 },
      { header: 'OBSERVACIÓN', key: 'obs1', width: 18 },
      { header: 'HORA SALIDA', key: 'salida', width: 14 },
      { header: 'FIRMA', key: 'firma2', width: 12 },
      { header: 'OBSERVACIÓN', key: 'obs2', width: 18 },
    ],
    filas,
  })

  const nombreArchivo = `asistencia-${persona.apellidos}-${persona.nombres}-${mes}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')

  return respuestaExcel(buffer, nombreArchivo)
}
