import { Landmark } from 'lucide-react'
import { crearCargo, eliminarCargo, listarCargos, moverCargo, type Cargo } from '@/features/cargos/cargos'
import { listarProgramas } from '@/features/programas/queries'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

function CargoFila({ cargo, programas }: { cargo: Cargo; programas: { id: string; nombre: string }[] }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/40 p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{cargo.nombre}</p>
          {cargo.descripcion ? <p className="truncate text-xs text-muted-foreground">{cargo.descripcion}</p> : null}
        </div>
        <form action={eliminarCargo}>
          <input type="hidden" name="id" value={cargo.id} />
          <button
            type="submit"
            title="Eliminar cargo"
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            ×
          </button>
        </form>
      </div>
      <form action={moverCargo} className="mt-2 flex items-center gap-1.5">
        <input type="hidden" name="id" value={cargo.id} />
        <select
          name="programa_id"
          defaultValue={cargo.programa_id ?? ''}
          className="h-7 w-full rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring dark:bg-input/30"
        >
          <option value="">Sin programa</option>
          {programas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-primary/60 px-2 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
        >
          Mover
        </button>
      </form>
    </div>
  )
}

export default async function CargosPage() {
  const [cargos, programas] = await Promise.all([listarCargos(), listarProgramas()])
  const opciones = programas.map((p) => ({ id: p.id, nombre: p.nombre }))
  const sinPrograma = cargos.filter((c) => !c.programa_id)
  const grupos = programas.map((p) => ({ ...p, cargos: cargos.filter((c) => c.programa_id === p.id) }))

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Cargos por programa</h1>
        <p className="text-sm text-muted-foreground">
          Cada cargo pertenece a un programa. Movelo con el selector y agregá cargos nuevos.
        </p>
      </div>

      <form action={crearCargo} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required placeholder="Ej.: Coordinadora del Prog. CEI" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="descripcion">Descripción</Label>
          <Input id="descripcion" name="descripcion" placeholder="Opcional" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="programa_id">Programa</Label>
          <select id="programa_id" name="programa_id" className={claseSelect} defaultValue="">
            <option value="">Sin programa</option>
            {opciones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar cargo
          </button>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {grupos.map((g) => (
          <section key={g.id} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
              <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                <Landmark className="size-4" />
              </span>
              <h2 className="truncate font-heading font-semibold text-foreground">{g.nombre}</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {g.cargos.length}
              </span>
            </div>
            <ul className="space-y-2">
              {g.cargos.map((c) => (
                <li key={c.id}>
                  <CargoFila cargo={c} programas={opciones} />
                </li>
              ))}
              {g.cargos.length === 0 ? <li className="text-sm text-muted-foreground">Sin cargos.</li> : null}
            </ul>
          </section>
        ))}

        <section className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-border/60 pb-2">
            <span className="rounded-md bg-muted p-1.5 text-muted-foreground">
              <Landmark className="size-4" />
            </span>
            <h2 className="truncate font-heading font-semibold text-muted-foreground">Sin programa</h2>
            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {sinPrograma.length}
            </span>
          </div>
          <ul className="space-y-2">
            {sinPrograma.map((c) => (
              <li key={c.id}>
                <CargoFila cargo={c} programas={opciones} />
              </li>
            ))}
            {sinPrograma.length === 0 ? <li className="text-sm text-muted-foreground">Todo asignado.</li> : null}
          </ul>
        </section>
      </div>
    </div>
  )
}
