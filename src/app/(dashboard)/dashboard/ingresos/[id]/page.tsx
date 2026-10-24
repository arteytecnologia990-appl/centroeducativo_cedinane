import { notFound } from 'next/navigation'
import { listarFacturasCliente, obtenerIngreso } from '@/features/ingresos/queries'
import { vincularFactura } from '@/features/ingresos/actions'
import { CobroForm } from '@/features/facturacion/components/cobro-form'
import { listarBancos } from '@/features/bancos/queries'
import { Volver } from '@/components/layout/volver'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function IngresoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ cobrado?: string; duplicado?: string }>
}) {
  const { id } = await params
  const filtros = await searchParams
  const ingreso = await obtenerIngreso(id)
  if (!ingreso) notFound()

  const bancos = await listarBancos()
  const facturas = ingreso.documento ? await listarFacturasCliente(ingreso.documento) : []
  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/ingresos" label="Ingresos" />

      {filtros.cobrado ? (
        <p className="rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
          ✔ Cobro registrado correctamente.
        </p>
      ) : null}
      {filtros.duplicado ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm text-warning">
          Este comprobante ya tiene un cobro registrado. No se duplicó.
        </p>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{ingreso.usuario}</h1>
          <p className="text-sm text-muted-foreground">
            Documento {ingreso.documento ?? '—'} · {ingreso.met_pago ?? 'sin forma de pago'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-heading text-2xl font-semibold text-foreground">{guaranies(Number(ingreso.total))}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Detalle</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Terapia</TableHead>
                <TableHead>Profesional</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingreso.items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.terapia}</TableCell>
                  <TableCell className="text-muted-foreground">{i.profesional ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(i.precio_unitario)}</TableCell>
                  <TableCell className="text-right tabular-nums">{i.cantidad}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(i.total)}</TableCell>
                </TableRow>
              ))}
              {ingreso.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-sm text-muted-foreground">
                    Sin detalle.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Cobro</h2>
        {ingreso.factura_cdc ? (
          <>
            <p className="text-sm text-muted-foreground">
              Factura vinculada: <span className="font-mono text-xs">{ingreso.factura_cdc.slice(0, 16)}…</span>
            </p>
            <CobroForm
              documento={ingreso.documento ?? ''}
              bancos={bancos}
              hoy={hoy}
              next={`/dashboard/ingresos/${ingreso.id}`}
              facturaCdc={ingreso.factura_cdc}
            />
          </>
        ) : (
          <form
            action={vincularFactura}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-4"
          >
            <input type="hidden" name="id" value={ingreso.id} />
            <div className="space-y-1.5">
              <Label htmlFor="factura_cdc">Vincular factura XML</Label>
              <select
                id="factura_cdc"
                name="factura_cdc"
                required
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">Elegí...</option>
                {facturas.map((f) => (
                  <option key={f.cdc} value={f.cdc}>
                    {f.numero_documento ?? f.cdc.slice(0, 12)} · {guaranies(Number(f.monto_total))}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Vincular factura
            </button>
            {facturas.length === 0 ? (
              <p className="text-xs text-warning">
                No hay facturas XML de este cliente. Importalas en Facturación.
              </p>
            ) : null}
          </form>
        )}
      </section>
    </div>
  )
}
