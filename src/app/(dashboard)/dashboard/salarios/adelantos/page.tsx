import Link from 'next/link'
import { listarAdelantos, listarPersonasConRegimen, obtenerParametros } from '@/features/salarios/queries'
import { crearAdelanto, eliminarAdelanto } from '@/features/salarios/actions'
import { listarSesiones } from '@/features/definiciones/queries'
import { AdelantoSesionesForm } from '@/features/salarios/components/adelanto-sesiones-form'
import { Volver } from '@/components/layout/volver'
import { SeccionColapsable } from '@/components/layout/seccion-colapsable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string) => {
  const d = new Date(`${f}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function AdelantosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const periodo = /^\d{4}-\d{2}$/.test(params.periodo ?? '') ? params.periodo! : periodoActual
  const hoyStr = hoy.toISOString().slice(0, 10)

  const [personas, sesiones, adelantos, parametros] = await Promise.all([
    listarPersonasConRegimen(),
    listarSesiones(),
    listarAdelantos(periodo),
    obtenerParametros(periodo),
  ])

  const total = adelantos.reduce((s, a) => s + a.monto, 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Adelantos de salario</h1>
        <p className="text-sm text-muted-foreground">
          Se registran como recibo (Art. 236) y se <strong>descuentan</strong> del neto al liquidar el período.
        </p>
      </div>

      <form method="get" action="/dashboard/salarios/adelantos" className="flex items-end gap-2">
        <div className="space-y-1.5">
          <label htmlFor="periodo" className="text-sm font-medium text-foreground">
            Período
          </label>
          <input id="periodo" type="month" name="periodo" defaultValue={periodo} className={claseInput} />
        </div>
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Ver
        </button>
      </form>

      <SeccionColapsable titulo="Adelanto por sesiones" descripcion="evaluación, psicología, etc.">
        <AdelantoSesionesForm
          personas={personas}
          sesiones={sesiones.map((s) => ({
            id: s.id,
            descripcion: s.descripcion,
            monto: Number(s.monto),
            porc_profesional: Number(s.porc_profesional),
          }))}
          periodo={periodo}
          fecha={hoyStr}
          porcIps={parametros.ips_obrero ?? 9}
          porcIva={parametros.iva ?? 10}
        />
      </SeccionColapsable>

      <SeccionColapsable titulo="Adelanto manual" descripcion="monto fijo">
      <form action={crearAdelanto} className="grid gap-3 sm:grid-cols-6">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="persona_id">Persona</Label>
          <select id="persona_id" name="persona_id" required className={claseInput}>
            <option value="">Elegí...</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.apellidos}, {p.nombres}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" name="fecha" type="date" defaultValue={hoyStr} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monto">Monto (Gs)</Label>
          <Input id="monto" name="monto" type="number" min="0" step="1" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="concepto">Concepto</Label>
          <Input id="concepto" name="concepto" placeholder="Adelanto de salario" />
        </div>
        <input type="hidden" name="periodo" value={periodo} />
        <div className="sm:col-span-6">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Registrar adelanto
          </button>
        </div>
      </form>
      </SeccionColapsable>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° recibo</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-16" />
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {adelantos.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="tabular-nums">A-{a.numero}</TableCell>
                <TableCell className="font-medium">{a.persona}</TableCell>
                <TableCell className="tabular-nums">{fmtFecha(a.fecha)}</TableCell>
                <TableCell className="text-muted-foreground">{a.concepto}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(a.monto)}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/salarios/adelantos/${a.id}/editar`}
                    className="mr-2 text-sm text-primary hover:underline"
                  >
                    Editar
                  </Link>
                  <Link href={`/imprimir/adelanto/${a.id}`} className="text-sm text-primary hover:underline">
                    Recibo
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={eliminarAdelanto}>
                    <input type="hidden" name="id" value={a.id} />
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
            {adelantos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-20 text-center text-sm text-muted-foreground">
                  Sin adelantos para el período.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <p className="text-right text-sm">
        Total adelantos: <strong className="tabular-nums">{guaranies(total)}</strong>
      </p>
    </div>
  )
}
