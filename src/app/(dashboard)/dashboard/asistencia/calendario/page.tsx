import { cookies } from 'next/headers'
import { listarAsistenciasMes, listarPersonasParaAsistencia } from '@/features/asistencia/queries'
import { listarHorarios } from '@/features/horarios/queries'
import { CalendarioAsistencia } from '@/features/asistencia/components/calendario-asistencia'
import { Volver } from '@/components/layout/volver'

export default async function CalendarioAsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ persona_id?: string; mes?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mes = /^\d{4}-\d{2}$/.test(params.mes ?? '') ? params.mes! : mesActual

  const personas = await listarPersonasParaAsistencia()
  const cookieStore = await cookies()
  const guardada = cookieStore.get('calendario_persona')?.value ?? ''
  const personaId = params.persona_id ?? (guardada || personas[0]?.id || '')

  const [anio, mesNum] = mes.split('-').map(Number)
  const desde = `${anio}-${String(mesNum).padStart(2, '0')}-01`
  const ultimo = new Date(anio, mesNum, 0).getDate()
  const hasta = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimo).padStart(2, '0')}`

  const marcas = personaId ? await listarAsistenciasMes(personaId, desde, hasta) : []
  const inicial: Record<string, 'presente' | 'ausente'> = {}
  for (const m of marcas) {
    if (m.estado === 'presente' || m.estado === 'ausente') inicial[m.fecha] = m.estado
  }

  const horarios = personaId ? await listarHorarios(personaId) : []
  const horariosPorDia: Record<number, { inicio: string; fin: string }> = {}
  for (const h of horarios) {
    const prev = horariosPorDia[h.dia_semana]
    if (!prev) {
      horariosPorDia[h.dia_semana] = { inicio: h.hora_inicio, fin: h.hora_fin }
    } else {
      horariosPorDia[h.dia_semana] = {
        inicio: prev.inicio < h.hora_inicio ? prev.inicio : h.hora_inicio,
        fin: prev.fin > h.hora_fin ? prev.fin : h.hora_fin,
      }
    }
  }

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/asistencia" label="Asistencia" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Calendario de asistencia</h1>
        <p className="text-sm text-muted-foreground">
          Marcá cada día: verde = vino, rojo = no vino, gris = sin marcar. Guardá al final.
        </p>
      </div>

      <CalendarioAsistencia
        key={`${personaId}-${mes}`}
        personas={personas}
        personaId={personaId}
        mes={mes}
        inicial={inicial}
        horariosPorDia={horariosPorDia}
      />
    </div>
  )
}
