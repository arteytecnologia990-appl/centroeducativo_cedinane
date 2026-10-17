import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obtenerPersona } from '@/features/personas/queries/personas'
import { listarHorarios } from '@/features/horarios/queries'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const DIAS_LARGOS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const COLUMNAS = [
  'DÍA',
  'FECHA',
  'HORA ENTRADA',
  'FIRMA',
  'OBSERVACIÓN',
  'HORA SALIDA',
  'FIRMA',
  'OBSERVACIÓN',
]

export default async function ImprimirAsistenciaPage({
  params,
  searchParams,
}: {
  params: Promise<{ persona_id: string }>
  searchParams: Promise<{ mes?: string }>
}) {
  const { persona_id } = await params
  const sp = await searchParams

  const persona = await obtenerPersona(persona_id)
  if (!persona) notFound()

  const horarios = await listarHorarios(persona_id)

  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mes = /^\d{4}-\d{2}$/.test(sp.mes ?? '') ? sp.mes! : mesActual
  const [anio, mesNum] = mes.split('-').map(Number)

  const totalDias = new Date(anio, mesNum, 0).getDate()
  const fmtDia = new Intl.DateTimeFormat('es-PY', { weekday: 'short' })
  const fmtFecha = new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const dias = Array.from({ length: totalDias }, (_, i) => {
    const fecha = new Date(anio, mesNum - 1, i + 1)
    return {
      dia: `${fmtDia.format(fecha).replace('.', '').toUpperCase()}.`,
      fechaTexto: fmtFecha.format(fecha),
    }
  })

  const personal = (persona as { personal?: { cargo?: string | null; turno?: string | null } | null })
    .personal
  const horarioTexto = horarios.length
    ? horarios
        .map((h) => `${h.hora_inicio.slice(0, 5)} a ${h.hora_fin.slice(0, 5)} - ${DIAS_LARGOS[h.dia_semana - 1]}`)
        .join(' · ')
    : personal?.turno
      ? `Turno ${personal.turno}`
      : '—'

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-6 text-black">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <Link href={`/dashboard/personas/${persona_id}`} className="text-sm text-primary hover:underline">
          ← Volver a la ficha
        </Link>
        <form method="get" className="flex items-end gap-2">
          <input
            type="month"
            name="mes"
            defaultValue={mes}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-black outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ver
          </button>
        </form>
        <BotonImprimir />
      </div>

      <h1 className="mb-4 text-center text-lg font-bold uppercase tracking-wide">
        Asistencia del personal — {MESES[mesNum - 1]} {anio}
      </h1>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <th className="w-[32%] border border-black px-2 py-1 text-left">Funcionario</th>
            <td className="border border-black px-2 py-1">
              {persona.apellidos}, {persona.nombres}
            </td>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 text-left">Cédula de identidad Nº</th>
            <td className="border border-black px-2 py-1">{persona.ci ?? '—'}</td>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 text-left">Horario s/Manual Convivencia</th>
            <td className="border border-black px-2 py-1">{horarioTexto}</td>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 text-left">Departamento</th>
            <td className="border border-black px-2 py-1">{personal?.cargo ?? '—'}</td>
          </tr>
        </tbody>
      </table>

      <table className="mt-3 w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {COLUMNAS.map((h, i) => (
              <th key={`${h}-${i}`} className="border border-black px-1 py-1 text-center font-bold uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dias.map((d) => (
            <tr key={d.fechaTexto}>
              <td className="border border-black px-1 py-[3px] text-center">{d.dia}</td>
              <td className="border border-black px-1 py-[3px] text-center tabular-nums">{d.fechaTexto}</td>
              <td className="h-6 border border-black px-1" />
              <td className="border border-black px-1" />
              <td className="border border-black px-1" />
              <td className="border border-black px-1" />
              <td className="border border-black px-1" />
              <td className="border border-black px-1" />
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-6 text-xs">
        Firma del funcionario: ______________________________ &nbsp;&nbsp;&nbsp; Aclaración:{' '}
        ______________________________
      </p>
    </div>
  )
}
