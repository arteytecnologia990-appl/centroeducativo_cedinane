import Link from 'next/link'
import { Banknote, CalendarDays, Eye, FileText } from 'lucide-react'
import { listarCobros, listarFacturas, listarSaldos, normalizarDocumento } from '@/features/facturacion/queries'
import { Volver } from '@/components/layout/volver'
import { ScrollADia } from '@/components/layout/scroll-a-dia'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string | null) => {
  if (!f) return '—'
  const d = new Date(f)
  return Number.isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function FacturacionPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>
}) {
  const params = await searchParams
  const hoyISO = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Asuncion' })
  const dia = params.dia && /^\d{4}-\d{2}-\d{2}$/.test(params.dia) ? params.dia : hoyISO

  const [saldos, facturas, cobros] = await Promise.all([listarSaldos(), listarFacturas(), listarCobros()])
  const totalSaldo = saldos.reduce((s, c) => s + c.saldo, 0)
  const totalFacturado = facturas.reduce((s, f) => s + Number(f.monto_total), 0)

  const [anioDia, mesDia] = dia.split('-').map(Number)
  const mesAnterior = new Date(Date.UTC(anioDia, mesDia - 2, 1, 12)).toISOString().slice(0, 7)
  const mesSiguiente = new Date(Date.UTC(anioDia, mesDia, 1, 12)).toISOString().slice(0, 7)
  const nombreMes = new Date(`${dia}T12:00:00Z`).toLocaleDateString('es-PY', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const dias = Array.from({ length: 31 }, (_, i) => {
    const d = new Date(`${dia}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() + i - 15)
    const iso = d.toISOString().slice(0, 10)
    const semana = d.toLocaleDateString('es-PY', { weekday: 'short', timeZone: 'UTC' }).replace('.', '')
    return { iso, label: semana.charAt(0).toUpperCase() + semana.slice(1), num: d.getUTCDate() }
  })
  const fechaDia = (f: string | null) => (f ?? '').slice(0, 10)
  const facturasDelDia = facturas.filter((f) => fechaDia(f.fecha_emision) === dia)
  const facturasPorDia = new Map<string, number>()
  for (const f of facturas) {
    const k = fechaDia(f.fecha_emision)
    if (k) facturasPorDia.set(k, (facturasPorDia.get(k) ?? 0) + Number(f.monto_total))
  }
  const totalDia = facturasDelDia.reduce((s, f) => s + Number(f.monto_total), 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Facturación</h1>
          <p className="text-sm text-muted-foreground">
            {facturas.length} DTE(s) · facturado {guaranies(totalFacturado)} · saldo por cobrar {guaranies(totalSaldo)}
          </p>
        </div>
        <Link
          href="/dashboard/facturacion/importar"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Importar DTEs
        </Link>
      </div>

      <section className="rounded-lg border border-border bg-card p-3">
        <ScrollADia dia={dia} />
        <div className="mb-2 flex items-center gap-2">
          <Link
            href={`/dashboard/facturacion?dia=${mesAnterior}-01`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Mes anterior"
          >
            −
          </Link>
          <p className="flex-1 text-center text-sm font-semibold capitalize text-foreground">{nombreMes}</p>
          <Link
            href={`/dashboard/facturacion?dia=${mesSiguiente}-01`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Mes siguiente"
          >
            +
          </Link>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {dias.map((d) => {
            const activo = d.iso === dia
            const esHoy = d.iso === hoyISO
            const monto = facturasPorDia.get(d.iso) ?? 0
            return (
              <Link
                key={d.iso}
                id={esHoy ? 'dia-hoy' : undefined}
                href={`/dashboard/facturacion?dia=${d.iso}`}
                className={`relative flex min-w-[76px] shrink-0 flex-col items-center rounded-md border px-1.5 py-1 text-center transition-colors ${
                  activo
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : esHoy
                      ? 'border-primary/60 text-primary hover:bg-primary/10'
                      : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <span className="text-[10px] font-medium uppercase">{d.label}</span>
                <span className="text-sm font-semibold tabular-nums">{d.num}</span>
                <span className={`text-[10px] tabular-nums ${monto > 0 ? 'font-medium' : 'opacity-50'}`}>
                  {monto > 0 ? guaranies(monto) : '—'}
                </span>
              </Link>
            )
          })}
        </div>
        <div className="mt-2 flex justify-center">
          <Link
            href={`/dashboard/facturacion?dia=${hoyISO}`}
            title="Ir a hoy"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-primary/60 px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <CalendarDays className="size-3.5" />
            Ir a hoy
          </Link>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {facturasDelDia.length} DTE(s) del día · Total:{' '}
          <strong className="text-foreground">{guaranies(totalDia)}</strong>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Facturas (DTE) del día</h2>
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
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturasDelDia.map((f) => (
                <TableRow key={f.cdc}>
                  <TableCell className="tabular-nums">{f.numero_documento ?? '—'}</TableCell>
                  <TableCell className="font-medium">{f.nombre_informado ?? '—'}</TableCell>
                  <TableCell className="tabular-nums">{f.documento_receptor}</TableCell>
                  <TableCell className="tabular-nums">{fmtFecha(f.fecha_emision)}</TableCell>
                  <TableCell>{f.estado}</TableCell>
                  <TableCell className="text-right tabular-nums">{guaranies(Number(f.monto_total))}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/facturacion/clientes/${normalizarDocumento(f.documento_receptor)}#cobro`}
                        title="Registrar cobro"
                        aria-label="Registrar cobro"
                        className="text-primary transition-opacity hover:opacity-70"
                      >
                        <Banknote className="size-4" />
                      </Link>
                      <Link
                        href={`/dashboard/facturacion/clientes/${normalizarDocumento(f.documento_receptor)}`}
                        title="Ver facturas del cliente"
                        aria-label="Ver facturas del cliente"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        href={`/imprimir/factura/${f.cdc}`}
                        title="Ver / imprimir factura"
                        aria-label="Ver / imprimir factura"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <FileText className="size-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {facturasDelDia.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-sm text-muted-foreground">
                    Sin facturas para este día.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

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
                  <TableCell className="text-right tabular-nums font-medium">{guaranies(s.saldo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/facturacion/clientes/${s.documento}#cobro`}
                        title="Registrar cobro"
                        aria-label="Registrar cobro"
                        className="text-primary transition-opacity hover:opacity-70"
                      >
                        <Banknote className="size-4" />
                      </Link>
                      <Link
                        href={`/dashboard/facturacion/clientes/${s.documento}`}
                        title="Ver facturas del cliente"
                        aria-label="Ver facturas del cliente"
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
