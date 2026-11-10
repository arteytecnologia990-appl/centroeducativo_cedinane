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

type DiaInfo = { total: number; pendiente: number; cobrado: number }

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

  const [anioDia, mesDia] = dia.split('-').map(Number)
  const mesAnterior = new Date(Date.UTC(anioDia, mesDia - 2, 1, 12)).toISOString().slice(0, 7)
  const mesSiguiente = new Date(Date.UTC(anioDia, mesDia, 1, 12)).toISOString().slice(0, 7)
  const nombreMes = new Date(`${dia}T12:00:00Z`).toLocaleDateString('es-PY', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const fechaDia = (f: string | null) => (f ?? '').slice(0, 10)

  const facturasDelDia = facturas.filter((f) => fechaDia(f.fecha_emision) === dia)
  const pendientes = facturasDelDia.filter((f) => f.saldo > 0)
  const cobradas = facturasDelDia.filter((f) => f.saldo <= 0)

  const totalPendiente = pendientes.reduce((s, f) => s + f.saldo, 0)
  const totalCobrado = cobradas.reduce((s, f) => s + Number(f.monto_total), 0)
  const totalDia = facturasDelDia.reduce((s, f) => s + Number(f.monto_total), 0)

  const infoPorDia = new Map<string, DiaInfo>()
  for (const f of facturas) {
    const k = fechaDia(f.fecha_emision)
    if (!k) continue
    const acc = infoPorDia.get(k) ?? { total: 0, pendiente: 0, cobrado: 0 }
    acc.total += Number(f.monto_total)
    if (f.saldo > 0) acc.pendiente += 1
    else acc.cobrado += 1
    infoPorDia.set(k, acc)
  }

  // Mostrar todos los días que tienen facturas + hoy + el día seleccionado
  const dias = Array.from(new Set([...infoPorDia.keys(), hoyISO, dia]))
    .sort()
    .map((iso) => {
      const d = new Date(`${iso}T12:00:00Z`)
      const semana = d.toLocaleDateString('es-PY', { weekday: 'short', timeZone: 'UTC' }).replace('.', '')
      return { iso, label: semana.charAt(0).toUpperCase() + semana.slice(1), num: d.getUTCDate() }
    })

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Facturación</h1>
          <p className="text-sm text-muted-foreground">
            {facturasDelDia.length} DTE(s) del día · pendiente {guaranies(totalPendiente)} · cobrado{' '}
            {guaranies(totalCobrado)} · saldo total {guaranies(totalSaldo)}
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
            const info = infoPorDia.get(d.iso)
            const activo = d.iso === dia
            const esHoy = d.iso === hoyISO
            const tienePendiente = (info?.pendiente ?? 0) > 0
            const todoCobrado = Boolean(info) && !tienePendiente
            const color = tienePendiente ? 'text-destructive' : todoCobrado ? 'text-success' : ''
            return (
              <Link
                key={d.iso}
                id={esHoy ? 'dia-hoy' : undefined}
                href={`/dashboard/facturacion?dia=${d.iso}`}
                className={`relative flex min-w-[76px] shrink-0 flex-col items-center rounded-md border px-1.5 py-1 text-center transition-colors ${
                  activo
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : esHoy
                      ? 'border-primary/60 hover:bg-primary/10'
                      : 'border-border hover:bg-accent'
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase ${activo ? '' : color || 'text-muted-foreground'}`}>
                  {d.label}
                </span>
                <span className={`text-sm font-bold tabular-nums ${activo ? '' : color || 'text-muted-foreground'}`}>
                  {d.num}
                </span>
                <span className={`text-[10px] tabular-nums ${activo ? '' : color || 'text-muted-foreground/70'}`}>
                  {info ? guaranies(info.total) : '—'}
                </span>
              </Link>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 text-destructive">
            <span className="size-2 rounded-full bg-destructive" /> Con pendientes
          </span>
          <span className="inline-flex items-center gap-1 text-success">
            <span className="size-2 rounded-full bg-success" /> Todo cobrado
          </span>
          <Link
            href={`/dashboard/facturacion?dia=${hoyISO}`}
            title="Ir a hoy"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-primary/60 px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <CalendarDays className="size-3.5" />
            Ir a hoy
          </Link>
        </div>
      </section>

      {/* PENDIENTES (rojo) */}
      <section className="overflow-hidden rounded-xl border border-destructive/40 bg-destructive/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-destructive/30 px-4 py-2">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-destructive">
            <span className="size-2.5 rounded-full bg-destructive" />
            Facturas pendientes de cobro
            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium tabular-nums">
              {pendientes.length}
            </span>
          </h2>
          <p className="text-sm text-destructive">
            Total pendiente: <strong className="tabular-nums">{guaranies(totalPendiente)}</strong>
          </p>
        </div>
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
                <TableCell className="text-right tabular-nums text-muted-foreground">{guaranies(f.cobrado)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-destructive">
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
                <TableCell colSpan={8} className="h-16 text-center text-sm text-muted-foreground">
                  Sin facturas pendientes para este día. 🎉
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <div className="flex justify-end border-t border-destructive/30 px-4 py-2 text-sm">
          <span className="text-destructive">
            TOTAL PENDIENTE: <strong className="text-base tabular-nums">{guaranies(totalPendiente)}</strong>
          </span>
        </div>
      </section>

      {/* COBRADAS (verde) */}
      <section className="overflow-hidden rounded-xl border border-success/40 bg-success/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/30 px-4 py-2">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-success">
            <span className="size-2.5 rounded-full bg-success" />
            Facturas cobradas
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium tabular-nums">
              {cobradas.length}
            </span>
          </h2>
          <p className="text-sm text-success">
            Total cobrado: <strong className="tabular-nums">{guaranies(totalCobrado)}</strong>
          </p>
        </div>
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
                <TableCell className="text-right font-semibold tabular-nums text-success">
                  {guaranies(f.cobrado)}
                </TableCell>
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
                <TableCell colSpan={7} className="h-16 text-center text-sm text-muted-foreground">
                  Todavía no hay facturas cobradas para este día.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <div className="flex justify-end border-t border-success/30 px-4 py-2 text-sm">
          <span className="text-success">
            TOTAL COBRADO: <strong className="text-base tabular-nums">{guaranies(totalCobrado)}</strong>
          </span>
        </div>
      </section>

      <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
        <span className="text-muted-foreground">Total facturado del día:</span>{' '}
        <strong className="tabular-nums text-foreground">{guaranies(totalDia)}</strong>
        <span className="mx-2 text-border">·</span>
        <span className="text-destructive">pendiente {guaranies(totalPendiente)}</span>
        <span className="mx-2 text-border">·</span>
        <span className="text-success">cobrado {guaranies(totalCobrado)}</span>
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
