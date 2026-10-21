import { listarAsistenciasPeriodo, listarPersonasParaAsistencia } from '@/features/asistencia/queries'
import { AsistenciaManualForm } from '@/features/asistencia/components/asistencia-manual-form'
import { FiltroAsistencia } from '@/features/asistencia/components/filtro-asistencia'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const hoyStr = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Asuncion',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

const esFecha = (v?: string) => /^\d{4}-\d{2}-\d{2}$/.test(v ?? '')
const esMes = (v?: string) => /^\d{4}-\d{2}$/.test(v ?? '')

const hora = (v: string | null) => (v ? v.slice(0, 5) : '—')
const estadoTexto = (e: string | null) =>
  e === 'presente' ? 'Presente' : e === 'ausente' ? 'Ausente' : '—'

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string; dia?: string; mes?: string; desde?: string; hasta?: string }>
}) {
  const params = await searchParams
  const hoy = hoyStr()
  const mesActual = hoy.slice(0, 7)
  const modo = ['dia', 'mes', 'rango'].includes(params.modo ?? '') ? params.modo! : 'dia'

  let desde = hoy
  let hasta = hoy

  if (modo === 'mes') {
    const mes = esMes(params.mes) ? params.mes! : mesActual
    const [y, m] = mes.split('-').map(Number)
    desde = `${mes}-01`
    hasta = `${mes}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`
  } else if (modo === 'rango') {
    desde = esFecha(params.desde) ? params.desde! : hoy
    hasta = esFecha(params.hasta) ? params.hasta! : desde
  } else {
    desde = esFecha(params.dia) ? params.dia! : hoy
    hasta = desde
  }

  const [asistencias, personas] = await Promise.all([
    listarAsistenciasPeriodo(desde, hasta),
    listarPersonasParaAsistencia(),
  ])

  const fmtFecha = (f: string) => {
    const d = new Date(`${f}T00:00:00`)
    return Number.isNaN(d.getTime())
      ? f
      : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  }

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Asistencia</h1>
          <p className="text-sm text-muted-foreground">
            {asistencias.length} marcaciones · {fmtFecha(desde)}
            {desde !== hasta ? ` a ${fmtFecha(hasta)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/dashboard/asistencia/calendario"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Calendario
          </a>
          <a
            href="/kiosco-asistencia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Abrir kiosco ↗
          </a>
        </div>
      </div>

      <FiltroAsistencia
        modoInicial={modo}
        diaInicial={esFecha(params.dia) ? params.dia! : hoy}
        mesInicial={esMes(params.mes) ? params.mes! : mesActual}
        desdeInicial={esFecha(params.desde) ? params.desde! : hoy}
        hastaInicial={esFecha(params.hasta) ? params.hasta! : hoy}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Origen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asistencias.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="tabular-nums">{fmtFecha(a.fecha)}</TableCell>
                  <TableCell className="font-medium">{a.persona}</TableCell>
                  <TableCell className="tabular-nums">{hora(a.hora_entrada)}</TableCell>
                  <TableCell className="tabular-nums">{hora(a.hora_salida)}</TableCell>
                  <TableCell>{estadoTexto(a.estado)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.origen === 'kiosco' ? 'Kiosco' : 'Manual'}
                  </TableCell>
                </TableRow>
              ))}
              {asistencias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    Sin marcaciones para el período.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <AsistenciaManualForm personas={personas} fecha={hasta} />
      </div>
    </div>
  )
}
