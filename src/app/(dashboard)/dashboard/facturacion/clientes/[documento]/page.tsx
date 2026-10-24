import { notFound } from 'next/navigation'
import { obtenerCliente } from '@/features/facturacion/queries'
import { CobroForm } from '@/features/facturacion/components/cobro-form'
import { listarBancos } from '@/features/bancos/queries'
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

export default async function ClientePage({ params }: { params: Promise<{ documento: string }> }) {
  const { documento } = await params
  const cliente = await obtenerCliente(decodeURIComponent(documento))
  if (cliente.facturas.length === 0 && cliente.cobros.length === 0) notFound()

  const bancos = await listarBancos()
  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/facturacion" label="Facturación" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{cliente.nombre ?? 'Cliente'}</h1>
          <p className="text-sm text-muted-foreground">
            Documento {cliente.documento} · {cliente.facturas.length} factura(s)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Saldo a cobrar</p>
          <p className="font-heading text-2xl font-semibold text-foreground">{guaranies(cliente.saldo)}</p>
        </div>
      </div>

      <section id="cobro" className="space-y-3 scroll-mt-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">Registrar cobro</h2>
        <CobroForm documento={cliente.documento} bancos={bancos} hoy={hoy} />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Facturas</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>CDC</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cliente.facturas.map((f) => (
                <TableRow key={f.cdc}>
                  <TableCell className="tabular-nums">{f.numero_documento ?? '—'}</TableCell>
                  <TableCell className="tabular-nums">{fmtFecha(f.fecha_emision)}</TableCell>
                  <TableCell>{f.estado}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{f.cdc.slice(0, 16)}…</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(f.monto_total)}</TableCell>
                </TableRow>
              ))}
              {cliente.facturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-sm text-muted-foreground">
                    Sin facturas.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Cobros</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Forma</TableHead>
                <TableHead>Banco / Cuenta</TableHead>
                <TableHead>N° transf.</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cliente.cobros.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="tabular-nums">{fmtFecha(c.fecha)}</TableCell>
                  <TableCell className="capitalize">{c.forma_pago}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.banco ? `${c.banco}${c.cuenta ? ` · ${c.cuenta}` : ''}` : '—'}
                  </TableCell>
                  <TableCell className="tabular-nums">{c.nro_transferencia ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{c.referencia ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(c.monto)}</TableCell>
                </TableRow>
              ))}
              {cliente.cobros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-16 text-center text-sm text-muted-foreground">
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
