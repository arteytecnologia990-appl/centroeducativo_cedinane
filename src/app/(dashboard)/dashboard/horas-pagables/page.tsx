import { listarHorasPagables } from '@/features/horas-pagables/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function HorasPagablesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mes = /^\d{4}-\d{2}$/.test(params.mes ?? '') ? params.mes! : mesActual
  const [anio, mesNum] = mes.split('-').map(Number)

  const desde = `${anio}-${String(mesNum).padStart(2, '0')}-01`
  const ultimoDia = new Date(anio, mesNum, 0).getDate()
  const hasta = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`

  const filas = await listarHorasPagables({ desde, hasta })
  const totalHoras = filas.reduce((s, f) => s + f.horas, 0)
  const totalSueldos = filas.reduce((s, f) => s + (f.sueldo ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Horas pagables</h1>
          <p className="text-sm text-muted-foreground">
            {MESES[mesNum - 1]} {anio} · horas trabajadas (asistencia) y sueldo por empleado.
          </p>
        </div>
        <form method="get" action="/dashboard/horas-pagables" className="flex items-end gap-2">
          <div className="space-y-1.5">
            <label htmlFor="mes" className="text-sm font-medium text-foreground">
              Período
            </label>
            <input id="mes" type="month" name="mes" defaultValue={mes} className={claseInput} />
          </div>
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead className="text-right">Días</TableHead>
              <TableHead className="text-right">Horas</TableHead>
              <TableHead className="text-right">Sueldo mensual</TableHead>
              <TableHead className="text-right">Total a pagar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((f) => (
              <TableRow key={f.persona_id}>
                <TableCell className="font-medium">{f.persona}</TableCell>
                <TableCell className="text-right tabular-nums">{f.dias}</TableCell>
                <TableCell className="text-right tabular-nums">{f.horas.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {f.sueldo != null ? guaranies(f.sueldo) : '—'}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {f.sueldo != null ? guaranies(f.sueldo) : '—'}
                </TableCell>
              </TableRow>
            ))}
            {filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                  Sin empleados para este período.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap justify-end gap-6 text-sm">
        <span className="text-muted-foreground">
          Horas totales: <strong className="text-foreground tabular-nums">{totalHoras.toFixed(2)}</strong>
        </span>
        <span className="text-muted-foreground">
          Sueldos: <strong className="text-foreground tabular-nums">{guaranies(totalSueldos)}</strong>
        </span>
      </div>
    </div>
  )
}
