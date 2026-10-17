import { Badge } from '@/components/ui/badge'
import { agregarRol, quitarRol } from '@/features/personas/actions/persona'
import { ETIQUETA_ROL, ROLES_NEGOCIO, type RolNegocio } from '@/features/personas/schemas/persona'

const claseSelect =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

/** Muestra los roles de la persona y permite agregar/quitar (una persona puede tener varios). */
export function RolesEditor({
  personaId,
  roles,
}: {
  personaId: string
  roles: { id: string; rol_negocio: string }[]
}) {
  const actuales = new Set(roles.map((r) => r.rol_negocio))
  const disponibles = ROLES_NEGOCIO.filter((r) => !actuales.has(r))

  return (
    <div className="flex flex-wrap items-center gap-2">
      {roles.length === 0 ? <span className="text-sm text-muted-foreground">Sin roles</span> : null}

      {roles.map((r) => (
        <form
          key={r.id}
          action={quitarRol}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5"
        >
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="persona_id" value={personaId} />
          <Badge variant="secondary">{ETIQUETA_ROL[r.rol_negocio as RolNegocio] ?? r.rol_negocio}</Badge>
          <button
            type="submit"
            aria-label={`Quitar ${r.rol_negocio}`}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            ×
          </button>
        </form>
      ))}

      {disponibles.length > 0 ? (
        <form action={agregarRol} className="inline-flex items-center gap-1">
          <input type="hidden" name="persona_id" value={personaId} />
          <select name="rol_negocio" defaultValue={disponibles[0]} className={claseSelect}>
            {disponibles.map((r) => (
              <option key={r} value={r}>
                {ETIQUETA_ROL[r]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            + Rol
          </button>
        </form>
      ) : null}
    </div>
  )
}
