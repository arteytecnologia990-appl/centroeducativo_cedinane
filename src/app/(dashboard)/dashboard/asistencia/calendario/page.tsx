import { listarAsistenciasMes, listarPersonasParaAsistencia } from '@/features/asistencia/queries'
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
  const personaId = params.persona_id ?? personas[0]?.id ?? ''

  const [anio, mesNum] = mes.split('-').map(Number)
  const desde = `${anio}-${String(mesNum).padStart(2, '0')}-01`
  const ultimo = new Date(anio, mesNum, 0).getDate()
  const hasta = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimo).padStart(2, '0')}`

  const marcas = personaId ? await listarAsistenciasMes(personaId, desde, hasta) : []
  const inicial: Record<string, 'presente' | 'ausente'> = {}
  for (const m of marcas) {
    if (m.estado === 'presente' || m.estado === 'ausente') inicial[m.fecha] = m.estado
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

      <CalendarioAsistencia personas={personas} personaId={personaId} mes={mes} inicial={inicial} />
    </div>
  )
}
