import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obtenerAdelanto } from '@/features/salarios/queries'
import { numeroALetras } from '@/features/salarios/numero-a-letras'
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

const fmtFecha = (f: string) => {
  const d = new Date(`${f}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function ReciboAdelantoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const a = await obtenerAdelanto(id)
  if (!a) notFound()

  const persona = a.personas as {
    nombres: string
    apellidos: string
    ci: string | null
    personal: {
      cargo: string | null
      caja_ahorro: string | null
      programas: { nombre: string; logo: string; caja_ahorro: string | null } | null
    } | null
  } | null

  const programa = persona?.personal?.programas ?? null

  const monto = Number(a.monto)
  const [anio, mes] = a.periodo.split('-').map(Number)

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-6 text-black">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/dashboard/salarios/adelantos" className="text-sm text-primary hover:underline">
          ← Volver a Adelantos
        </Link>
        <BotonImprimir />
      </div>

      <div className="flex items-start gap-3">
        <Image src={programa?.logo ?? '/logos/cedinane.png'} alt="Logo" width={70} height={61} className="h-[58px] w-auto" />
        <div className="flex-1 text-center text-[10px] leading-tight">
          <p>
            Asociación Civil sin Fines de Lucro con Capacidad Restringida, “Centro de Desarrollo Integral para niños
            y adolescentes con necesidades educativas especiales” CEDINANE
          </p>
          <p>Registro Patronal M.T.E.S.S. N°: 145628 · RUC: 80049699-0</p>
        </div>
        <div className="w-[70px]" />
      </div>

      <div className="mt-3 flex justify-between text-sm font-bold">
        <span>N° RECIBO: {a.numero}</span>
        <span>MES: {String(mes).padStart(2, '0')}/{anio}</span>
      </div>

      <h1 className="mt-2 text-center text-base font-bold">RECIBO DE ADELANTO DE SALARIO</h1>
      <p className="text-center text-xs">(Art. 236 del Código del Trabajo)</p>

      <table className="mt-4 w-full border-collapse text-sm">
        <tbody>
          <tr>
            <th className="w-[18%] border border-black px-2 py-1 text-left">EMPLEADO</th>
            <td className="border border-black px-2 py-1" colSpan={3}>
              {persona?.apellidos}, {persona?.nombres}
            </td>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 text-left">C.I. N°</th>
            <td className="border border-black px-2 py-1">{persona?.ci ?? '—'}</td>
            <th className="w-[15%] border border-black px-2 py-1 text-left">FECHA</th>
            <td className="border border-black px-2 py-1">{fmtFecha(a.fecha)}</td>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 text-left">CARGO</th>
            <td className="border border-black px-2 py-1">{persona?.personal?.cargo ?? '—'}</td>
            <th className="border border-black px-2 py-1 text-left">Caja de Ahorro</th>
            <td className="border border-black px-2 py-1">
              {programa?.caja_ahorro ?? persona?.personal?.caja_ahorro ?? '—'}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1 text-left font-bold">CONCEPTO</th>
            <th className="border border-black px-2 py-1 text-right font-bold">HABERES</th>
            <th className="border border-black px-2 py-1 text-right font-bold">DEDUCCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1">{a.concepto}</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(monto)}</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">—</td>
          </tr>
          <tr className="font-bold">
            <td className="border border-black px-2 py-1 text-right">SUB TOTAL</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">{guaranies(monto)}</td>
            <td className="border border-black px-2 py-1 text-right tabular-nums">—</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-4 text-xs">
        Declaro haber recibido el monto neto consignado en concepto de adelanto de salario, el cual será descontado
        del salario correspondiente al mes de {MESES[mes - 1]} de {anio}.
      </p>

      <p className="mt-3 text-right text-base font-bold">NETO A COBRAR: {guaranies(monto)}</p>
      <p className="mt-1 text-xs">Guaraníes: {numeroALetras(monto)}.</p>

      <div className="mt-12 flex justify-between text-xs">
        <span>Firma del Empleador</span>
        <span>Firma del Empleado/a</span>
      </div>
    </div>
  )
}
