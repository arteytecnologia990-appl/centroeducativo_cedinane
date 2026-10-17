import { listarHorarios, listarPersonasParaHorario, listarSedes } from '@/features/horarios/queries'
import { HorariosPanel } from '@/features/horarios/components/horarios-panel'

export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ persona_id?: string }>
}) {
  const params = await searchParams
  const personaId = params.persona_id ?? ''

  const [personas, sedes, horarios] = await Promise.all([
    listarPersonasParaHorario(),
    listarSedes(),
    listarHorarios(personaId || undefined),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Horarios</h1>
        <p className="text-sm text-muted-foreground">
          Cargá bloques por persona y varios días a la vez. Se agregan al instante.
        </p>
      </div>

      <HorariosPanel
        initialHorarios={horarios}
        personas={personas}
        sedes={sedes}
        personaIdInicial={personaId}
      />
    </div>
  )
}
