import { notFound } from 'next/navigation'
import { obtenerIngreso } from '@/features/ingresos/queries'
import { CobroForm } from '@/features/facturacion/components/cobro-form'
import { listarBancos } from '@/features/bancos/queries'
import { Volver } from '@/components/layout/volver'
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
          <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            Vinculá una <strong>factura XML</strong> a este ingreso para habilitar el cobro.
          </p>
        )}
      </section>
    </div>
  )
}
