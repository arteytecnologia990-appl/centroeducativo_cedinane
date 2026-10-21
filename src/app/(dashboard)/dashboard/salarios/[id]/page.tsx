import { notFound } from 'next/navigation'
import { obtenerLiquidacion } from '@/features/salarios/queries'
import { aprobarLiquidacion, anularLiquidacion } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

type Linea = {
  id: string
  concepto_codigo: string
  descripcion: string | null
  cantidad: number | null
  base_calculo: number | null
  tasa: number | null
  importe: number
  orden: number
}

export default async function ReciboPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const liq = await obtenerLiquidacion(id)
  if (!liq) notFound()

  const persona = liq.personas as {
    nombres: string
    apellidos: string
    ci: string | null
    personal: { sueldo: number | null; modalidad_salarial: string | null; jornada_tipo: string | null } | null
  } | null

  const detalle = ((liq.liquidacion_detalle ?? []) as Linea[]).sort((a, b) => a.orden - b.orden)
  const haberes = detalle.filter((d) => d.importe > 0)
  const descuentos = detalle.filter((d) => d.importe < 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/salarios" label="Liquidaciones" />

      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex flex-wrap gap-2">
          <form action={aprobarLiquidacion}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Aprobar
            </button>
          </form>
          <form action={anularLiquidacion}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Anular
            </button>
          </form>
        </div>
        <BotonImprimir />
      </div>

      <div className="mx-auto max-w-[210mm] bg-white p-6 text-black">
        <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide">Recibo de salario</h1>
        <p className="mb-4 text-center text-xs">Período {liq.periodo} · Estado: {liq.estado}</p>

        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr>
              <th className="w-1/4 border border-black px-2 py-1 text-left">Trabajador</th>
              <td className="border border-black px-2 py-1">
                {persona?.apellidos}, {persona?.nombres}
              </td>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-left">Cédula</th>
              <td className="border border-black px-2 py-1">{persona?.ci ?? '—'}</td>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-left">Modalidad</th>
              <td className="border border-black px-2 py-1">
                {persona?.personal?.modalidad_salarial ?? 'mensual'} · jornada{' '}
                {persona?.personal?.jornada_tipo ?? 'diurna'}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-4 mb-1 text-sm font-bold uppercase">Haberes</h2>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left font-bold">Concepto</th>
              <th className="border border-black px-2 py-1 text-right font-bold">Cant.</th>
              <th className="border border-black px-2 py-1 text-right font-bold">Base</th>
              <th className="border border-black px-2 py-1 text-right font-bold">Tasa</th>
              <th className="border border-black px-2 py-1 text-right font-bold">Importe</th>
            </tr>
          </thead>
          <tbody>
            {haberes.map((d) => (
              <tr key={d.id}>
                <td className="border border-black px-2 py-[3px]">{d.descripcion ?? d.concepto_codigo}</td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">{Number(d.cantidad ?? 0)}</td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                  {d.base_calculo != null ? guaranies(Number(d.base_calculo)) : '—'}
                </td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                  {d.tasa ? `${Number(d.tasa)}%` : '—'}
                </td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">{guaranies(Number(d.importe))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="border border-black px-2 py-1" colSpan={4}>
                Total haberes
              </td>
              <td className="border border-black px-2 py-1 text-right tabular-nums">
                {guaranies(Number(liq.total_haberes))}
              </td>
            </tr>
          </tfoot>
        </table>

        <h2 className="mt-4 mb-1 text-sm font-bold uppercase">Descuentos</h2>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {descuentos.map((d) => (
              <tr key={d.id}>
                <td className="border border-black px-2 py-[3px]">{d.descripcion ?? d.concepto_codigo}</td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">{guaranies(Number(d.importe))}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="border border-black px-2 py-1">Total descuentos</td>
              <td className="border border-black px-2 py-1 text-right tabular-nums">
                {guaranies(-Number(liq.total_descuentos))}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 text-right text-base font-bold">Neto a pagar: {guaranies(Number(liq.neto_pagar))}</p>

        <p className="mt-8 text-xs">
          Recibí conforme: ______________________________ &nbsp;&nbsp;&nbsp; Firma del empleador:
          ______________________________
        </p>
        <p className="mt-2 text-[10px] text-black/70">
          Cálculo preliminar (Fase 1), pendiente de validación legal/contable.
        </p>
      </div>
    </div>
  )
}
