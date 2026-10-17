import { notFound } from 'next/navigation'
import { obtenerPersona } from '@/features/personas/queries/personas'
import { PersonaForm } from '@/features/personas/components/persona-form'
import { RolesEditor } from '@/features/personas/components/roles-editor'
import { archivarPersona } from '@/features/personas/actions/persona'

export default async function PersonaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const persona = await obtenerPersona(id)

  if (!persona) notFound()

  const roles = (persona.persona_roles ?? []) as { id: string; rol_negocio: string }[]

  return (
    <div className="space-y-6">
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
            Archivar
          </button>
        </form>
      </div>

      {/* key: remonta el formulario cuando cambian los datos, para que los inputs
          no controlados reciban su defaultValue una sola vez (evita el warning de Base UI). */}
      <PersonaForm key={persona.updated_at} persona={persona} />
    </div>
  )
}
