import Link from 'next/link'
import { listarHorasPagables } from '@/features/horas-pagables/queries'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

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

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function ImprimirHorasPagablesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>
}) {
  const params = await searchParams
  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  const mes = /^\d{4}-\d{2}$/.test(params.mes ?? '') ? params.mes! : mesActual
  const [anio, mesNum] = mes.split('-').map(Number)

  const desde = `${anio}-${String(mesNum).padStart(2, '0')}-01`
  const ultimoDia = new Date(anio, mesNum, 0).getDate()
  const hasta = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`

  const filas = await listarHorasPagables({ desde, hasta })
  const totalHoras = filas.reduce((s, f) => s + f.horas, 0)
  const totalSueldos = filas.reduce((s, f) => s + (f.sueldo ?? 0), 0)

  return (
    <div className="bg-white p-6 text-black">
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } }`}</style>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/horas-pagables" className="text-sm text-primary hover:underline">
          ← Volver a Horas pagables
        </Link>
        <BotonImprimir />
      </div>

      <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide">
        Horas pagables — {MESES[mesNum - 1]} {anio}
      </h1>
      <p className="mb-3 text-center text-xs">Total de empleados: {filas.length}</p>

      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {['Persona', 'Días', 'Horas', 'Sueldo mensual', 'Total a pagar'].map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={`border border-black px-2 py-1 font-bold ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.persona_id}>
              <td className="border border-black px-2 py-[3px]">{f.persona}</td>
              <td className="border border-black px-2 py-[3px] text-right tabular-nums">{f.dias}</td>
              <td className="border border-black px-2 py-[3px] text-right tabular-nums">{f.horas.toFixed(2)}</td>
              <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                {f.sueldo != null ? guaranies(f.sueldo) : '—'}
              </td>
              <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                {f.sueldo != null ? guaranies(f.sueldo) : '—'}
              </td>
            </tr>
          ))}
          {filas.length === 0 ? (
            <tr>
              <td colSpan={5} className="border border-black px-2 py-6 text-center">
                Sin empleados para el período.
              </td>
            </tr>
          ) : null}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border border-black px-2 py-1">Totales</td>
            <td className="border border-black px-2 py-1" />
            <td className="border border-black px-2 py-1 text-right tabular-nums">{totalHoras.toFixed(2)}</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(totalSueldos)}</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(totalSueldos)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
