import { listarAsistenciasDia, listarPersonasParaAsistencia } from '@/features/asistencia/queries'
import { AsistenciaManualForm } from '@/features/asistencia/components/asistencia-manual-form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const hora = (v: string | null) => (v ? v.slice(0, 5) : '—')

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>
}) {
  const params = await searchParams
  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Asuncion',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(params.fecha ?? '') ? params.fecha! : hoy

  const [asistencias, personas] = await Promise.all([
    listarAsistenciasDia(fecha),
    listarPersonasParaAsistencia(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Asistencia</h1>
        <p className="text-sm text-muted-foreground">
          Marcaciones del día (kiosco y manual). El kiosco está en <code>/kiosco-asistencia</code>.
        </p>
      </div>

      <form method="get" action="/dashboard/asistencia" className="flex items-end gap-2">
        <div className="space-y-1.5">
          <label htmlFor="fecha" className="text-sm font-medium text-foreground">
            Fecha
          </label>
          <input id="fecha" type="date" name="fecha" defaultValue={fecha} className={claseInput} />
        </div>
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Persona</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Origen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asistencias.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.persona}</TableCell>
                  <TableCell className="tabular-nums">{hora(a.hora_entrada)}</TableCell>
                  <TableCell className="tabular-nums">{hora(a.hora_salida)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.origen === 'kiosco' ? 'Kiosco' : 'Manual'}
                  </TableCell>
                </TableRow>
              ))}
              {asistencias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                    Sin marcaciones para esta fecha.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <AsistenciaManualForm personas={personas} fecha={fecha} />
      </div>
    </div>
  )
}
