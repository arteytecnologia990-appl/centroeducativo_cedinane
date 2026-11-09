import Link from 'next/link'
import { Banknote, Eye, FileText } from 'lucide-react'
import { listarCobros, listarFacturas, listarSaldos, normalizarDocumento } from '@/features/facturacion/queries'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string | null) => {
  if (!f) return '—'
  const d = new Date(f)
  return Number.isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

const TABS = [
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'cobradas', label: 'Cobradas' },
  { id: 'saldos', label: 'Saldos por cliente' },
] as const

export default async function FacturacionPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const tab = TABS.some((t) => t.id === params.tab) ? (params.tab as string) : 'pendientes'

  const [saldos, facturas, cobros] = await Promise.all([listarSaldos(), listarFacturas(), listarCobros()])
  const totalSaldo = saldos.reduce((s, c) => s + c.saldo, 0)
  const pendientes = facturas.filter((f) => f.saldo > 0)
  const cobradas = facturas.filter((f) => f.saldo <= 0)
  const totalPendiente = pendientes.reduce((s, f) => s + f.saldo, 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Facturación</h1>
          <p className="text-sm text-muted-foreground">
            {facturas.length} DTE(s) · {pendientes.length} pendiente(s) por {guaranies(totalPendiente)} · saldo total{' '}
            {guaranies(totalSaldo)}
          </p>
        </div>
        <Link
          href="/dashboard/facturacion/importar"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Importar DTEs
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => {
          const activo = t.id === tab
          const cant = t.id === 'pendientes' ? pendientes.length : t.id === 'cobradas' ? cobradas.length : saldos.length
          return (
            <Link
              key={t.id}
              href={`/dashboard/facturacion?tab=${t.id}`}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                activo
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                {cant}
              </span>
            </Link>
          )
        })}
      </div>

      {tab === 'pendientes' ? (
        <section className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Cobrado</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendientes.map((f) => (
                  <TableRow key={f.cdc}>
                    <TableCell className="tabular-nums">{f.numero_documento ?? '—'}</TableCell>
                    <TableCell className="font-medium">{f.nombre_informado ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">{f.documento_receptor}</TableCell>
                    <TableCell className="tabular-nums">{fmtFecha(f.fecha_emision)}</TableCell>
                    <TableCell className="text-right tabular-nums">{guaranies(Number(f.monto_total))}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {guaranies(f.cobrado)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-warning">
                      {guaranies(f.saldo)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/facturacion/clientes/${normalizarDocumento(f.documento_receptor)}#cobro`}
                          className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          <Banknote className="size-3.5" />
                          Cobrar
                        </Link>
                        <Link
                          href={`/imprimir/factura/${f.cdc}`}
                          title="Ver / imprimir factura"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <FileText className="size-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pendientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-20 text-center text-sm text-muted-foreground">
                      No hay facturas pendientes. 🎉
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      {tab === 'cobradas' ? (
        <section className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Cobrado</TableHead>
                  <TableHead className="w-16">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobradas.map((f) => (
                  <TableRow key={f.cdc}>
                    <TableCell className="tabular-nums">{f.numero_documento ?? '—'}</TableCell>
                    <TableCell className="font-medium">{f.nombre_informado ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">{f.documento_receptor}</TableCell>
                    <TableCell className="tabular-nums">{fmtFecha(f.fecha_emision)}</TableCell>
                    <TableCell className="text-right tabular-nums">{guaranies(Number(f.monto_total))}</TableCell>
                    <TableCell className="text-right tabular-nums text-success">{guaranies(f.cobrado)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/imprimir/factura/${f.cdc}`}
                        title="Ver / imprimir factura"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <FileText className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {cobradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-20 text-center text-sm text-muted-foreground">
                      Todavía no hay facturas cobradas.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      {tab === 'saldos' ? (
        <section className="space-y-3">
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
                  <TableHead className="w-24">Acciones</TableHead>
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
                    <TableCell className="text-right font-medium tabular-nums">{guaranies(s.saldo)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/facturacion/clientes/${s.documento}#cobro`}
                          title="Registrar cobro"
                          className="text-primary transition-opacity hover:opacity-70"
                        >
                          <Banknote className="size-4" />
                        </Link>
                        <Link
                          href={`/dashboard/facturacion/clientes/${s.documento}`}
                          title="Ver facturas del cliente"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {saldos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-20 text-center text-sm text-muted-foreground">
                      Sin DTEs importados. Usá “Importar DTEs”.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

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
    </div>
  )
}
