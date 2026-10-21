import { listarFeriados, listarParametrosLegales } from '@/features/salarios/queries'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const numero = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string) => {
  const d = new Date(`${f}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function ParametrosPage() {
  const [parametros, feriados] = await Promise.all([listarParametrosLegales(), listarFeriados()])

  return (
    <div className="space-y-8">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Parámetros legales y feriados</h1>
        <p className="text-sm text-muted-foreground">
          Lo que hay cargado en la base (`parametros_legales` y `feriados`). Valores **pendientes de validación
          legal/contable**.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Parámetros</h2>
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
                </TableRow>
              ))}
              {parametros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-sm text-muted-foreground">
                    Sin parámetros.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Feriados 2026</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Validado</TableHead>
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
                </TableRow>
              ))}
              {feriados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-sm text-muted-foreground">
                    Sin feriados.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          Fuente: La Nación (02/01/2026) y calendario oficial. Los traslados pueden variar por decreto; verificá
          antes de liquidar.
        </p>
      </section>
    </div>
  )
}
