import Link from 'next/link'
import { listarLiquidaciones } from '@/features/salarios/queries'
import { calcularPeriodo } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const estadoTexto: Record<string, string> = {
  calculada: 'Calculada',
  aprobada: 'Aprobada',
  anulada: 'Anulada',
}

export default async function SalariosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const periodo = /^\d{4}-\d{2}$/.test(params.periodo ?? '') ? params.periodo! : periodoActual

  const liquidaciones = await listarLiquidaciones(periodo)
  const totalNeto = liquidaciones.reduce((s, l) => s + l.neto_pagar, 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Liquidaciones de salario</h1>
          <p className="text-sm text-muted-foreground">
            Período {periodo} · {liquidaciones.length} empleado(s) · total neto {guaranies(totalNeto)}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <form method="get" action="/dashboard/salarios" className="flex items-end gap-2">
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

          <form action={calcularPeriodo}>
            <input type="hidden" name="periodo" value={periodo} />
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Calcular período
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead className="text-right">Haberes</TableHead>
              <TableHead className="text-right">Descuentos</TableHead>
              <TableHead className="text-right">Neto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {liquidaciones.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.persona}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(l.total_haberes)}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(l.total_descuentos)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{guaranies(l.neto_pagar)}</TableCell>
                <TableCell>{estadoTexto[l.estado] ?? l.estado}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/salarios/${l.id}`} className="text-sm text-primary hover:underline">
                    Recibo
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {liquidaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  No hay liquidaciones para el período. Usá “Calcular período”.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Cálculo preliminar (Fase 1): reglas generales del Código del Trabajo y parámetros 2026, pendiente de
        validación legal/contable.
      </p>
    </div>
  )
}
