import { crearCargo, eliminarCargo, listarCargos } from '@/features/cargos/cargos'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function CargosPage() {
  const cargos = await listarCargos()

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Cargos</h1>
        <p className="text-sm text-muted-foreground">
          Catálogo de cargos (nombre y descripción) que se eligen en los datos laborales del personal.
        </p>
      </div>

      <form action={crearCargo} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required placeholder="Ej.: Coordinadora del Prog. CEI" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Input id="descripcion" name="descripcion" placeholder="Opcional" />
        </div>
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar cargo
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargos.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{c.descripcion ?? '—'}</TableCell>
                <TableCell>
                  <form action={eliminarCargo}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Eliminar
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {cargos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-16 text-center text-sm text-muted-foreground">
                  Sin cargos cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
