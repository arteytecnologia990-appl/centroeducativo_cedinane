import { listarAlumnosPacientes, listarClientesConFacturas, listarIngresos } from '@/features/ingresos/queries'
import { listarSesiones } from '@/features/definiciones/queries'
import { listarEmpleadosSalario } from '@/features/salarios/queries'
import Link from 'next/link'
import { eliminarIngreso } from '@/features/ingresos/actions'
import { IngresoForm } from '@/features/ingresos/components/ingreso-form'
import { CobroModal } from '@/features/ingresos/components/cobro-modal'
import { listarBancos } from '@/features/bancos/queries'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function IngresosPage({
  searchParams,
}: {
  searchParams: Promise<{ cobrado?: string; duplicado?: string; dia?: string; mes?: string }>
}) {
  const params = await searchParams
  const [ingresos, clientes, sesiones, empleados, alumnos, bancos] = await Promise.all([
    listarIngresos(),
    listarClientesConFacturas(),
    listarSesiones(),
    listarEmpleadosSalario(),
    listarAlumnosPacientes(),
    listarBancos(),
  ])
  const profesionales = empleados.map((e) => ({ id: e.id, nombre: `${e.nombres} ${e.apellidos}` }))
  const total = ingresos.reduce((s, i) => s + i.total, 0)
  const hoy = new Date().toISOString().slice(0, 10)
  const hoyISO = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Asuncion' })
  const mes =
    params.mes && /^\d{4}-\d{2}$/.test(params.mes) ? params.mes : hoyISO.slice(0, 7)
  const dia = params.dia ?? (mes === hoyISO.slice(0, 7) ? hoyISO : `${mes}-01`)
  const [anioMes, nroMes] = mes.split('-').map(Number)
  const primerDia = new Date(Date.UTC(anioMes, nroMes - 1, 1, 12))
  const diasEnMes = new Date(Date.UTC(anioMes, nroMes, 0, 12)).getUTCDate()
  const primerWeekday = (primerDia.getUTCDay() + 6) % 7
  const celdas: (number | null)[] = [
    ...Array.from({ length: primerWeekday }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ]
  const nombreMes = primerDia.toLocaleDateString('es-PY', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const mesAnterior = new Date(Date.UTC(anioMes, nroMes - 2, 1, 12)).toISOString().slice(0, 7)
  const mesSiguiente = new Date(Date.UTC(anioMes, nroMes, 1, 12)).toISOString().slice(0, 7)
  const fechaLocal = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Asuncion' })
  const ingresosDelDia = ingresos.filter((i) => fechaLocal(i.created_at) === dia)
  const totalDelDia = ingresosDelDia.reduce((s, i) => s + i.total, 0)
  const ingresosPorDia = new Map<string, number>()
  for (const i of ingresos) {
    const k = fechaLocal(i.created_at)
    ingresosPorDia.set(k, (ingresosPorDia.get(k) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Ingresos</h1>
        <p className="text-sm text-muted-foreground">
          Servicios cobrados <strong>antes</strong> de la factura XML. Cuando llega el XML, se engancha la factura
          del cliente. Total registrado: <strong>{guaranies(total)}</strong>
        </p>
      </div>

      {params.cobrado ? (
        <p className="rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
          ✔ Cobro registrado correctamente.
        </p>
      ) : null}
      {params.duplicado ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm text-warning">
          Este comprobante ya tiene un cobro registrado. No se duplicó.
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href={`/dashboard/ingresos?mes=${mesAnterior}`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Mes anterior"
          >
            ◀
          </Link>
          <p className="text-sm font-semibold capitalize text-foreground">{nombreMes}</p>
          <Link
            href={`/dashboard/ingresos?mes=${mesSiguiente}`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Mes siguiente"
          >
            ▶
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {celdas.map((n, i) => {
            if (n === null) return <div key={`b-${i}`} />
            const iso = `${mes}-${String(n).padStart(2, '0')}`
            const activo = iso === dia
            const esHoy = iso === hoyISO
            const cant = ingresosPorDia.get(iso) ?? 0
            return (
              <Link
                key={iso}
                href={`/dashboard/ingresos?mes=${mes}&dia=${iso}`}
                className={`relative flex h-9 items-center justify-center rounded-md text-sm transition-colors ${
                  activo
                    ? 'bg-primary font-semibold text-primary-foreground shadow-sm'
                    : esHoy
                      ? 'font-semibold text-primary ring-1 ring-primary/60 hover:bg-primary/10'
                      : 'text-foreground hover:bg-accent'
                }`}
              >
                {n}
                {cant > 0 ? (
                  <span
                    className={`absolute bottom-1 size-1 rounded-full ${activo ? 'bg-primary-foreground' : 'bg-primary'}`}
                  />
                ) : null}
              </Link>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {ingresosDelDia.length} ingreso(s) · Total del día:{' '}
          <strong className="text-foreground">{guaranies(totalDelDia)}</strong>
        </p>
      </section>

      <details className="rounded-lg border border-border bg-card">
        <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-foreground">
          + Nuevo ingreso
        </summary>
        <div className="border-t border-border p-4">
          <IngresoForm
            clientes={clientes}
            sesiones={sesiones.map((s) => ({ id: s.id, descripcion: s.descripcion, monto: Number(s.monto) }))}
            profesionales={profesionales}
            alumnos={alumnos}
          />
        </div>
      </details>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Terapia</TableHead>
              <TableHead>Profesional</TableHead>
              <TableHead className="text-right">Precio Unitario</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Cobrado</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead>Met. Pago</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingresosDelDia.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {c.usuario}
                  {c.alumno_paciente ? (
                    <div className="text-xs font-normal text-muted-foreground">{c.alumno_paciente}</div>
                  ) : null}
                </TableCell>
                <TableCell>{c.terapia}</TableCell>
                <TableCell className="text-muted-foreground">{c.profesional ?? '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(c.precio_unitario)}</TableCell>
                <TableCell className="text-right tabular-nums">{c.cantidad}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{guaranies(c.total)}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(c.cobrado)}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(c.saldo)}</TableCell>
                <TableCell className="capitalize text-muted-foreground">{c.met_pago ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.factura_cdc ? `${c.factura_cdc.slice(0, 12)}…` : 'Pendiente'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CobroModal
                      documento={c.documento ?? ''}
                      bancos={bancos}
                      hoy={hoy}
                      habilitado={Boolean(c.factura_cdc)}
                      facturaCdc={c.factura_cdc}
                    />
                    <Link href={`/dashboard/ingresos/${c.id}`} className="text-sm text-primary hover:underline">
                      Detalle
                    </Link>
                    <form action={eliminarIngreso} className="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {ingresosDelDia.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-20 text-center text-sm text-muted-foreground">
                  Sin ingresos cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
