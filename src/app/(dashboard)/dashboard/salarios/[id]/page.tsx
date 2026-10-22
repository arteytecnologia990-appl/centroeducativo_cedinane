import Image from 'next/image'
import { notFound } from 'next/navigation'
import { aprobarLiquidacion, anularLiquidacion, eliminarLiquidacion } from '@/features/salarios/actions'
import { obtenerLiquidacion } from '@/features/salarios/queries'
import { numeroALetras } from '@/features/salarios/numero-a-letras'
import { Volver } from '@/components/layout/volver'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const MESES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

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
    personal: {
      sueldo: number | null
      modalidad_salarial: string | null
      jornada_tipo: string | null
      cargo: string | null
      programa: string | null
      caja_ahorro: string | null
    } | null
  } | null

  const detalle = ((liq.liquidacion_detalle ?? []) as Linea[]).sort((a, b) => a.orden - b.orden)
  const totalHaberes = Number(liq.total_haberes)
  const totalDescuentos = Number(liq.total_descuentos)
  const neto = Number(liq.neto_pagar)
  const [anio, mes] = liq.periodo.split('-').map(Number)
  const ultimoDia = new Date(anio, mes, 0).getDate()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Volver href="/dashboard/salarios" label="Liquidaciones" />
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
          <form action={eliminarLiquidacion}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md border border-destructive/40 bg-background px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive-soft"
            >
              Eliminar
            </button>
          </form>
          <BotonImprimir />
        </div>
      </div>

      <div className="mx-auto max-w-[210mm] bg-white p-6 text-black">
        <div className="flex items-start gap-3">
          <Image src="/logos/cedinane.png" alt="ASO CEDINANE" width={70} height={61} className="h-[58px] w-auto" />
          <div className="flex-1 text-center text-[10px] leading-tight">
            <p>
              Asociación Civil sin Fines de Lucro con Capacidad Restringida, “Centro de Desarrollo Integral para
              niños y adolescentes con necesidades educativas especiales” CEDINANE
            </p>
            <p>Registro Patronal M.T.E.S.S. N°: 145628 · RUC: 80049699-0</p>
          </div>
          <div className="w-[70px]" />
        </div>

        <div className="mt-2 flex justify-between text-sm font-bold">
          <span>N° RECIBO: {liq.numero}</span>
          <span>MES: {String(mes).padStart(2, '0')}/{anio}</span>
        </div>

        <h1 className="mt-1 text-center text-base font-bold">LIQUIDACION DE SALARIO</h1>
        <p className="text-center text-xs">(Art. 236 del Código del Trabajo)</p>

        <table className="mt-3 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <th className="w-[20%] border border-black px-2 py-1 text-left">EMPLEADO</th>
              <td className="border border-black px-2 py-1" colSpan={3}>
                {persona?.apellidos}, {persona?.nombres}
              </td>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-left">C.I. N°</th>
              <td className="border border-black px-2 py-1">{persona?.ci ?? '—'}</td>
              <th className="w-[14%] border border-black px-2 py-1 text-left">CARGO</th>
              <td className="border border-black px-2 py-1">{persona?.personal?.cargo ?? '—'}</td>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-left">AREA</th>
              <td className="border border-black px-2 py-1">{persona?.personal?.programa ?? '—'}</td>
              <th className="border border-black px-2 py-1 text-left">PERIODO DE PAGO</th>
              <td className="border border-black px-2 py-1">
                01 al {ultimoDia} {MESES[mes - 1]}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left font-bold">CONCEPTO</th>
              <th className="w-[10%] border border-black px-2 py-1 text-right font-bold">CANTIDAD</th>
              <th className="w-[18%] border border-black px-2 py-1 text-right font-bold">HABERES</th>
              <th className="w-[18%] border border-black px-2 py-1 text-right font-bold">DEDUCCIONES</th>
            </tr>
          </thead>
          <tbody>
            {detalle.map((d) => (
              <tr key={d.id}>
                <td className="border border-black px-2 py-[3px]">{d.descripcion ?? d.concepto_codigo}</td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                  {Number(d.cantidad ?? 0) > 0 ? Number(d.cantidad) : ''}
                </td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                  {d.importe > 0 ? guaranies(Number(d.importe)) : ''}
                </td>
                <td className="border border-black px-2 py-[3px] text-right tabular-nums">
                  {d.importe < 0 ? guaranies(-Number(d.importe)) : ''}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="border border-black px-2 py-1 text-right" colSpan={2}>
                SUB TOTAL
              </td>
              <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(totalHaberes)}</td>
              <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(totalDescuentos)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-3 flex items-end justify-between">
          <p className="text-xs">Recibí conforme el importe neto de la presente liquidación</p>
          <p className="text-base font-bold">NETO A COBRAR: {guaranies(neto)}</p>
        </div>
        <p className="mt-1 text-xs">Guaraníes: {numeroALetras(neto)}.</p>

        <div className="mt-12 flex justify-between text-xs">
          <span>Firma del Empleador</span>
          <span>Firma del empleado</span>
        </div>
      </div>
    </div>
  )
}
