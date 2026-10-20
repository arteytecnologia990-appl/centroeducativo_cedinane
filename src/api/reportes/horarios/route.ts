import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listarHorariosReporte } from '@/features/horarios/queries'
import { DIAS } from '@/features/horarios/schemas'
import { generarExcel, respuestaExcel } from '@/lib/reportes/excel'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('No autorizado', { status: 401 })

  const horarios = await listarHorariosReporte()

  const buffer = await generarExcel({
    hoja: 'Horarios',
    columnas: [
      { header: 'Persona', key: 'persona', width: 34 },
      { header: 'Sede', key: 'sede', width: 10 },
      { header: 'Día', key: 'dia', width: 14 },
      { header: 'Hora', key: 'hora', width: 14 },
      { header: 'Actividad', key: 'actividad', width: 28 },
      { header: 'Aula', key: 'aula', width: 14 },
    ],
    filas: horarios.map((h) => ({
      persona: h.persona,
      sede: h.sede,
      dia: DIAS.find((x) => Number(x.valor) === h.dia_semana)?.etiqueta ?? String(h.dia_semana),
      hora: `${h.hora_inicio.slice(0, 5)}–${h.hora_fin.slice(0, 5)}`,
      actividad: h.actividad ?? '',
      aula: h.aula ?? '',
    })),
  })

  return respuestaExcel(buffer, 'horarios')
}
