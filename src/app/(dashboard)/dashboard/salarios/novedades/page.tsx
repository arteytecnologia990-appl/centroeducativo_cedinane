import { listarPersonasParaAsistencia } from '@/features/asistencia/queries'
import { listarNovedadesPeriodo } from '@/features/salarios/queries'
import { crearNovedad, eliminarNovedad } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const TIPOS = [
  { valor: 'horas_extra', etiqueta: 'Horas extras (horas)' },
  { valor: 'horas_nocturnas', etiqueta: 'Horas nocturnas (horas)' },
  { valor: 'horas_feriado', etiqueta: 'Horas en feriado (horas)' },
  { valor: 'ausencia', etiqueta: 'Ausencia (días)' },
  { valor: 'adelanto', etiqueta: 'Adelanto / préstamo (Gs)' },
]

const etiquetaTipo: Record<string, string> = {
  horas_extra: 'Horas extras',
  horas_nocturnas: 'Horas nocturnas',
  horas_feriado: 'Horas en feriado',
  ausencia: 'Ausencia',
  adelanto: 'Adelanto',
}

export default async function NovedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const periodo = /^\d{4}-\d{2}$/.test(params.periodo ?? '') ? params.periodo! : periodoActual

  const [personas, novedades] = await Promise.all([
    listarPersonasParaAsistencia(),
    listarNovedadesPeriodo(periodo),
  ])

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Novedades del período</h1>
        <p className="text-sm text-muted-foreground">
          Cargá horas extras (ej. sábado trabajado), ausencias y adelantos. Después recalculá el período en
          Liquidaciones.
        </p>
      </div>

      <form method="get" action="/dashboard/salarios/novedades" className="flex items-end gap-2">
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

      <form action={crearNovedad} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="persona_id" className="text-sm font-medium text-foreground">
            Persona
          </label>
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
          <label htmlFor="tipo" className="text-sm font-medium text-foreground">
            Tipo
          </label>
          <select id="tipo" name="tipo" className={claseInput}>
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cantidad" className="text-sm font-medium text-foreground">
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            name="cantidad"
            step="0.01"
            min="0"
            required
            className={claseInput}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="justificacion" className="text-sm font-medium text-foreground">
            Justificación
          </label>
          <input id="justificacion" name="justificacion" className={claseInput} placeholder="Opcional" />
        </div>
        <input type="hidden" name="periodo" value={periodo} />
        <div className="sm:col-span-6">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar novedad
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Justificación</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {novedades.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.persona}</TableCell>
                <TableCell>{etiquetaTipo[n.tipo] ?? n.tipo}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {new Intl.NumberFormat('es-PY').format(n.cantidad)}
                </TableCell>
                <TableCell className="text-muted-foreground">{n.unidad}</TableCell>
                <TableCell className="text-muted-foreground">{n.justificacion ?? '—'}</TableCell>
                <TableCell>
                  <form action={eliminarNovedad}>
                    <input type="hidden" name="id" value={n.id} />
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
            {novedades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-sm text-muted-foreground">
                  Sin novedades para el período.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
