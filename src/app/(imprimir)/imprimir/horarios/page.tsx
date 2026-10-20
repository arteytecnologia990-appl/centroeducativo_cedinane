import Link from 'next/link'
import { listarHorariosReporte } from '@/features/horarios/queries'
import { DIAS } from '@/features/horarios/schemas'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const etiquetaDia = (d: number) => DIAS.find((x) => Number(x.valor) === d)?.etiqueta ?? `Día ${d}`
const hora = (v: string) => v.slice(0, 5)

export default async function ImprimirHorariosPage() {
  const horarios = await listarHorariosReporte()

  return (
    <div className="bg-white p-6 text-black">
      <style>{`@media print { @page { size: A4 landscape; margin: 10mm; } }`}</style>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/horarios" className="text-sm text-primary hover:underline">
          ← Volver a Horarios
        </Link>
        <BotonImprimir />
      </div>

      <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide">Horarios del personal</h1>
      <p className="mb-3 text-center text-xs">Total: {horarios.length}</p>

      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {['Persona', 'Sede', 'Día', 'Hora', 'Actividad', 'Aula'].map((h, i) => (
              <th key={`${h}-${i}`} className="border border-black px-2 py-1 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((h) => (
            <tr key={h.id} className={h.dia_semana >= 6 ? 'bg-neutral-100' : undefined}>
              <td className="border border-black px-2 py-[3px]">{h.persona}</td>
              <td className="border border-black px-2 py-[3px]">{h.sede}</td>
              <td className="border border-black px-2 py-[3px]">{etiquetaDia(h.dia_semana)}</td>
              <td className="border border-black px-2 py-[3px] tabular-nums">
                {hora(h.hora_inicio)}–{hora(h.hora_fin)}
              </td>
              <td className="border border-black px-2 py-[3px]">{h.actividad ?? '—'}</td>
              <td className="border border-black px-2 py-[3px]">{h.aula ?? '—'}</td>
            </tr>
          ))}
          {horarios.length === 0 ? (
            <tr>
              <td colSpan={6} className="border border-black px-2 py-6 text-center">
                Sin horarios cargados.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
