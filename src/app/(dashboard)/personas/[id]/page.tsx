import { notFound } from 'next/navigation'
import { obtenerPersona } from '@/features/personas/queries/personas'
import { PersonaForm } from '@/features/personas/components/persona-form'
import { archivarPersona } from '@/features/personas/actions/persona'
import { ETIQUETA_ROL, type RolNegocio } from '@/features/personas/schemas/persona'
import { Badge } from '@/components/ui/badge'

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
          <div className="mt-1 flex flex-wrap gap-1">
            {roles.length > 0 ? (
              roles.map((r) => (
                <Badge key={r.id} variant="secondary">
                  {ETIQUETA_ROL[r.rol_negocio as RolNegocio] ?? r.rol_negocio}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Sin roles asignados</span>
            )}
          </div>
        </div>
        <form action={archivarPersona}>
          <input type="hidden" name="id" value={persona.id} />
          <button type="submit" className="text-sm text-muted-foreground transition-colors hover:text-destructive">
            Archivar
          </button>
        </form>
      </div>

      <PersonaForm persona={persona} />
    </div>
  )
}
