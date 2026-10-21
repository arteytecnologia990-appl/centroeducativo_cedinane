import { listarFeriados } from '@/features/salarios/queries'
import { crearFeriado, eliminarFeriado } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const fmtFecha = (f: string) => {
  const d = new Date(`${f}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function FeriadosPage() {
  const feriados = await listarFeriados()

  return (
    <div className="space-y-8">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Feriados</h1>
        <p className="text-sm text-muted-foreground">
          Cargá los feriados del año (fecha observada). Quedan como “Pendiente” hasta validarlos.
        </p>
      </div>

      <form action={crearFeriado} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" name="fecha" type="date" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required placeholder="Ej.: Día de los Héroes" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tipo">Tipo</Label>
          <select id="tipo" name="tipo" className={claseInput}>
            <option value="nacional">Nacional</option>
            <option value="asueto">Asueto</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nota">Nota</Label>
          <Input id="nota" name="nota" placeholder="Opcional" />
        </div>
        <div className="sm:col-span-5">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar / actualizar feriado
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Validado</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {feriados.map((f) => (
              <TableRow key={f.fecha}>
                <TableCell className="tabular-nums">{fmtFecha(f.fecha)}</TableCell>
                <TableCell className="font-medium">{f.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{f.tipo}</TableCell>
                <TableCell className="text-muted-foreground">{f.nota ?? '—'}</TableCell>
                <TableCell>{f.validado ? 'Sí' : 'Pendiente'}</TableCell>
                <TableCell>
                  <form action={eliminarFeriado}>
                    <input type="hidden" name="fecha" value={f.fecha} />
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
            {feriados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-16 text-center text-sm text-muted-foreground">
                  Sin feriados cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
