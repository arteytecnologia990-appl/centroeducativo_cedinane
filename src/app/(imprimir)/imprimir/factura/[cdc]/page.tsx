import Image from 'next/image'
import { notFound } from 'next/navigation'
import { obtenerFactura } from '@/features/facturacion/factura-detalle'
import { Volver } from '@/components/layout/volver'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

const fmtFecha = (f: string | null) => {
  if (!f) return '—'
  const d = new Date(f)
  return Number.isNaN(d.getTime())
    ? f
    : new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function FacturaPreviewPage({ params }: { params: Promise<{ cdc: string }> }) {
  const { cdc } = await params
  const f = await obtenerFactura(decodeURIComponent(cdc))
  if (!f) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <Volver href="/dashboard/facturacion" label="Facturación" />

      <div className="rounded-xl border border-border bg-white p-6 text-slate-900 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/logos/cedinane.png" alt="CEDINANE" width={56} height={48} className="h-12 w-auto" />
            <div>
              <p className="text-lg font-bold leading-tight">ASOCEDINANE</p>
              <p className="text-xs text-slate-600">RUC 80049699-0 · Timbrado 145628</p>
              <p className="text-xs text-slate-600">Paraguay</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">FACTURA</p>
            <p className="text-sm tabular-nums">N° {f.numero_documento ?? '—'}</p>
            <p className="text-xs text-slate-600">{fmtFecha(f.fecha_emision)}</p>
          </div>
        </div>

        <div className="grid gap-2 py-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Cliente</p>
            <p className="font-medium">{f.nombre_informado ?? '—'}</p>
            <p className="tabular-nums text-slate-700">{f.documento_receptor ?? '—'}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Condición</p>
            <p className="capitalize">{f.condicion ?? '—'}</p>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Timbrado</p>
            <p className="tabular-nums">{f.timbrado ?? '145628'}</p>
          </div>
        </div>

        <table className="w-full border-t border-slate-300 text-sm">
          <tbody>
            <tr>
              <td className="py-1.5 text-slate-600">Gravado 10 %</td>
              <td className="py-1.5 text-right tabular-nums">{guaranies(Number(f.monto_gravado_10 ?? 0))}</td>
            </tr>
            <tr>
              <td className="py-1.5 text-slate-600">IVA 10 %</td>
              <td className="py-1.5 text-right tabular-nums">{guaranies(Number(f.iva_10 ?? 0))}</td>
            </tr>
            {Number(f.monto_gravado_5 ?? 0) > 0 ? (
              <tr>
                <td className="py-1.5 text-slate-600">Gravado 5 %</td>
                <td className="py-1.5 text-right tabular-nums">{guaranies(Number(f.monto_gravado_5 ?? 0))}</td>
              </tr>
            ) : null}
            {Number(f.iva_5 ?? 0) > 0 ? (
              <tr>
                <td className="py-1.5 text-slate-600">IVA 5 %</td>
                <td className="py-1.5 text-right tabular-nums">{guaranies(Number(f.iva_5 ?? 0))}</td>
              </tr>
            ) : null}
            {Number(f.exento ?? 0) > 0 ? (
              <tr>
                <td className="py-1.5 text-slate-600">Exento</td>
                <td className="py-1.5 text-right tabular-nums">{guaranies(Number(f.exento ?? 0))}</td>
              </tr>
            ) : null}
            <tr className="border-t border-slate-300">
              <td className="py-2 text-base font-bold">TOTAL</td>
              <td className="py-2 text-right text-base font-bold tabular-nums">
                Gs {guaranies(Number(f.monto_total ?? 0))}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 border-t border-slate-300 pt-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">CDC</p>
          <p className="break-all font-mono text-[10px] leading-relaxed text-slate-700">{f.cdc}</p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground print:hidden">
        Para guardar como PDF: <strong>Ctrl+P</strong> → “Guardar como PDF”.
      </p>
    </div>
  )
}
