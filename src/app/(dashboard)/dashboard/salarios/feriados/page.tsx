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

const estadoTexto: Record<string, string> = {
  pendiente: 'Pendiente',
  verificado: 'Verificado',
  revisar: 'Revisar',
}

export default async function FeriadosPage() {
  const feriados = await listarFeriados()

  return (
    <div className="space-y-8">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Feriados</h1>
        <p className="text-sm text-muted-foreground">
          Base: <strong>Ley 7544/2025</strong>. La <em>fecha</em> es la efectiva; la <em>original</em> es la legal.
          Los móviles (1/3, 12/6, 20/6, 29/9) se trasladan a lunes por decreto anual.
        </p>
      </div>

      <form action={crearFeriado} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha efectiva</Label>
          <Input id="fecha" name="fecha" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha_original">Fecha original</Label>
          <Input id="fecha_original" name="fecha_original" type="date" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="movilidad">Movilidad</Label>
          <select id="movilidad" name="movilidad" className={claseInput}>
            <option value="fijo">Fijo</option>
            <option value="movil">Móvil</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="estado_validacion">Estado</Label>
          <select id="estado_validacion" name="estado_validacion" className={claseInput}>
            <option value="pendiente">Pendiente</option>
            <option value="verificado">Verificado</option>
            <option value="revisar">Revisar</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="tipo">Tipo</Label>
          <select id="tipo" name="tipo" className={claseInput}>
            <option value="nacional">Nacional</option>
            <option value="asueto">Asueto</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="norma">Norma</Label>
          <Input id="norma" name="norma" defaultValue="Ley 7544/2025" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nota">Nota</Label>
          <Input id="nota" name="nota" placeholder="Opcional" />
        </div>
        <div className="sm:col-span-6">
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
              <TableHead>Fecha efectiva</TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Movilidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {feriados.map((f) => (
              <TableRow key={f.fecha}>
                <TableCell className="tabular-nums">{fmtFecha(f.fecha)}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {f.fecha_original ? fmtFecha(f.fecha_original) : '—'}
                </TableCell>
                <TableCell className="font-medium">{f.nombre}</TableCell>
                <TableCell>{f.movilidad === 'movil' ? 'Móvil' : 'Fijo'}</TableCell>
                <TableCell>{estadoTexto[f.estado_validacion] ?? f.estado_validacion}</TableCell>
                <TableCell className="text-muted-foreground">{f.nota ?? '—'}</TableCell>
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
                <TableCell colSpan={7} className="h-16 text-center text-sm text-muted-foreground">
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
