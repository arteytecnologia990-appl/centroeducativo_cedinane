import Link from 'next/link'
import { FileSpreadsheet, Printer } from 'lucide-react'

/** Botones estándar de reporte: Excel (descarga) + PDF/Imprimir (página de impresión). */
export function BotonesReporte({ excelHref, imprimirHref }: { excelHref: string; imprimirHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={excelHref}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <FileSpreadsheet className="size-4" /> Excel
      </a>
      <Link
        href={imprimirHref}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Printer className="size-4" /> PDF / Imprimir
      </Link>
    </div>
  )
}
