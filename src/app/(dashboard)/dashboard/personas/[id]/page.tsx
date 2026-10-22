import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obtenerPersona } from '@/features/personas/queries/personas'
import { listarHorarios } from '@/features/horarios/queries'
import { listarProgramas } from '@/features/programas/queries'
import { DIAS } from '@/features/horarios/schemas'
import { PersonaForm } from '@/features/personas/components/persona-form'
import { RolesEditor } from '@/features/personas/components/roles-editor'
import { archivarPersona } from '@/features/personas/actions/persona'
import { Volver } from '@/components/layout/volver'

export default async function PersonaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const persona = await obtenerPersona(id)

  if (!persona) notFound()

  const roles = (persona.persona_roles ?? []) as { id: string; rol_negocio: string }[]
  const horarios = await listarHorarios(id)
  const programas = await listarProgramas()
  const etiquetaDia = (d: number) => DIAS.find((x) => Number(x.valor) === d)?.etiqueta ?? `Día ${d}`

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/personas" label="Personas" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {persona.apellidos}, {persona.nombres}
          </h1>
          <div className="mt-2">
            <RolesEditor personaId={persona.id} roles={roles} />
          </div>
        </div>
        <form action={archivarPersona}>
          <input type="hidden" name="id" value={persona.id} />
          <button type="submit" className="text-sm text-muted-foreground transition-colors hover:text-destructive">
            Inactivar
          </button>
        </form>
      </div>

      {/* key: remonta el formulario cuando cambian los datos, para que los inputs
          no controlados reciban su defaultValue una sola vez (evita el warning de Base UI). */}
      <PersonaForm key={persona.updated_at} persona={persona} programas={programas} />

      <section className="max-w-2xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Horarios</h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/horarios?persona_id=${persona.id}`}
              className="text-sm text-primary hover:underline"
            >
              Gestionar horarios
            </Link>
            <Link
              href={`/imprimir/asistencia/${persona.id}`}
              className="text-sm text-primary hover:underline"
            >
              Imprimir asistencia
            </Link>
          </div>
        </div>
        {horarios.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin horarios cargados.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {horarios.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                <span className="font-medium">{etiquetaDia(h.dia_semana)}</span>
                <span className="tabular-nums text-muted-foreground">
                  {h.hora_inicio.slice(0, 5)}–{h.hora_fin.slice(0, 5)}
                </span>
                <span className="text-muted-foreground">
                  {h.actividad ?? '—'}
                  {h.aula ? ` · ${h.aula}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
