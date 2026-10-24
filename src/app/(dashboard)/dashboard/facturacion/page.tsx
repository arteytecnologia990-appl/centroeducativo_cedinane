import Link from 'next/link'
import { listarCobros, listarFacturas, listarSaldos } from '@/features/facturacion/queries'
import { crearCobro } from '@/features/facturacion/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string | null) => {
  if (!f) return '—'
  const d = new Date(f)
  return Number.isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function FacturacionPage() {
  const [saldos, facturas, cobros] = await Promise.all([listarSaldos(), listarFacturas(), listarCobros()])
  const totalSaldo = saldos.reduce((s, c) => s + c.saldo, 0)
  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Facturación</h1>
          <p className="text-sm text-muted-foreground">
            {facturas.length} DTE(s) · saldo total por cobrar {guaranies(totalSaldo)}
          </p>
        </div>
        <Link
          href="/dashboard/facturacion/importar"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Importar DTEs
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Saldos por cliente</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Facturas</TableHead>
                <TableHead className="text-right">Facturado</TableHead>
                <TableHead className="text-right">Cobrado</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saldos.map((s) => (
                <TableRow key={s.documento}>
                  <TableCell className="tabular-nums">{s.documento}</TableCell>
                  <TableCell className="font-medium">{s.nombre ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.cantidad}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(s.facturado)}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(s.cobrado)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{guaranies(s.saldo)}</TableCell>
                </TableRow>
              ))}
              {saldos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-sm text-muted-foreground">
                    Sin DTEs importados. Usá “Importar DTEs”.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Registrar cobro</h2>
        <form action={crearCobro} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="documento">Cliente</Label>
            <select id="documento" name="documento" required className={claseInput}>
              <option value="">Elegí...</option>
              {saldos.map((s) => (
                <option key={s.documento} value={s.documento}>
                  {s.documento} · {s.nombre ?? 's/n'} · saldo {guaranies(s.saldo)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="monto">Monto (Gs)</Label>
            <Input id="monto" name="monto" type="number" min="1" step="1" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha">Fecha</Label>
            <Input id="fecha" name="fecha" type="date" defaultValue={hoy} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="forma_pago">Forma de pago</Label>
            <select id="forma_pago" name="forma_pago" className={claseInput}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="referencia">Referencia</Label>
            <Input id="referencia" name="referencia" placeholder="Opcional" />
          </div>
          <div className="sm:col-span-6">
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Registrar cobro
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Últimos cobros</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Forma</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cobros.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="tabular-nums">{fmtFecha(c.fecha)}</TableCell>
                  <TableCell className="tabular-nums">{c.documento_receptor}</TableCell>
                  <TableCell className="capitalize">{c.forma_pago}</TableCell>
                  <TableCell className="text-muted-foreground">{c.referencia ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(Number(c.monto))}</TableCell>
                </TableRow>
              ))}
              {cobros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-sm text-muted-foreground">
                    Sin cobros registrados.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Últimas facturas (DTE)</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((f) => (
                <TableRow key={f.cdc}>
                  <TableCell className="tabular-nums">{f.numero_documento ?? '—'}</TableCell>
                  <TableCell className="font-medium">{f.nombre_informado ?? '—'}</TableCell>
                  <TableCell className="tabular-nums">{f.documento_receptor}</TableCell>
                  <TableCell className="tabular-nums">{fmtFecha(f.fecha_emision)}</TableCell>
                  <TableCell>{f.estado}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(Number(f.monto_total))}</TableCell>
                </TableRow>
              ))}
              {facturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-16 text-center text-sm text-muted-foreground">
                    Sin facturas.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
