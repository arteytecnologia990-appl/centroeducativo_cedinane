import { listarParametrosLegales } from '@/features/salarios/queries'
import { crearParametro, eliminarParametro } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const numero = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string) => {
  const d = new Date(`${f}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function ParametrosPage() {
  const parametros = await listarParametrosLegales()

  return (
    <div className="space-y-8">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Parámetros legales</h1>
        <p className="text-sm text-muted-foreground">
          Valores de la base (`parametros_legales`). Podés cargar o actualizar uno nuevo por vigencia.
        </p>
      </div>

      <form action={crearParametro} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="codigo">Código</Label>
          <Input id="codigo" name="codigo" required placeholder="ej.: salario_minimo_mensual" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required placeholder="Salario mínimo mensual" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="valor">Valor</Label>
          <Input id="valor" name="valor" type="number" step="0.0001" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unidad">Unidad</Label>
          <select id="unidad" name="unidad" className={claseInput}>
            <option value="gs">Gs</option>
            <option value="porcentaje">%</option>
            <option value="horas">Horas</option>
            <option value="dias">Días</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vigencia_desde">Vigencia desde</Label>
          <Input id="vigencia_desde" name="vigencia_desde" type="date" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="norma">Norma</Label>
          <Input id="norma" name="norma" placeholder="Res. MTESS 670/2026" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="fuente">Fuente</Label>
          <Input id="fuente" name="fuente" placeholder="MTESS / IPS / DNIT" />
        </div>
        <div className="sm:col-span-6">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar / actualizar parámetro
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Norma</TableHead>
              <TableHead>Validado</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {parametros.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell className="text-right tabular-nums">{numero(Number(p.valor))}</TableCell>
                <TableCell className="text-muted-foreground">{p.unidad}</TableCell>
                <TableCell className="tabular-nums">{fmtFecha(p.vigencia_desde)}</TableCell>
                <TableCell className="text-muted-foreground">{p.norma ?? '—'}</TableCell>
                <TableCell>{p.validado ? 'Sí' : 'Pendiente'}</TableCell>
                <TableCell>
                  <form action={eliminarParametro}>
                    <input type="hidden" name="id" value={p.id} />
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
            {parametros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-16 text-center text-sm text-muted-foreground">
                  Sin parámetros.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
