import { listarHorarios, listarPersonasParaHorario, listarSedes } from '@/features/horarios/queries'
import { HorarioForm } from '@/features/horarios/components/horario-form'
import { HorariosTabla } from '@/features/horarios/components/horarios-tabla'

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

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
          Cargá los bloques semanales por persona (día y franja horaria).
        </p>
      </div>

      <form method="get" action="/dashboard/horarios" className="flex max-w-md items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="persona_id" className="text-sm font-medium text-foreground">
            Ver horarios de
          </label>
          <select id="persona_id" name="persona_id" defaultValue={personaId} className={claseSelect}>
            <option value="">Todas las personas</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.apellidos}, {p.nombres}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <HorariosTabla horarios={horarios} personas={personas} mostrarPersona={!personaId} />
        <HorarioForm personas={personas} sedes={sedes} personaId={personaId} />
      </div>
    </div>
  )
}
