'use client'

import { useState } from 'react'
import { importarDtes, type ImportResult } from '@/features/facturacion/actions'
import { Label } from '@/components/ui/label'

export function ImportarDtesForm() {
  const [resultado, setResultado] = useState<ImportResult | null>(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setResultado(null)
    const fd = new FormData(e.currentTarget)
    const res = await importarDtes(fd)
    setResultado(res)
    setCargando(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={enviar} className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-4">
        <div className="space-y-1.5">
          <Label htmlFor="archivo">Archivo Excel (.xlsx)</Label>
          <input
            id="archivo"
            name="archivo"
            type="file"
            accept=".xlsx"
            required
            className="block text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {cargando ? 'Importando…' : 'Importar DTEs'}
        </button>
      </form>

      {resultado ? (
        <div className="space-y-2 rounded-lg border border-border p-4">
          <p className="text-sm font-medium text-foreground">Resultado de la importación</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">{resultado.importadas}</strong> importadas
            </li>
            <li>
              <strong className="text-foreground">{resultado.omitidas}</strong> omitidas (CDC ya existente)
            </li>
            <li>
              <strong className="text-foreground">{resultado.canceladas}</strong> canceladas
            </li>
          </ul>
          {resultado.omitidas > 0 ? (
            <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
              Se omitieron {resultado.omitidas} comprobantes porque su <strong>CDC ya está cargado</strong> (no se
              duplican).
            </p>
          ) : null}
          {resultado.errores.length > 0 ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <p className="font-medium">Errores ({resultado.errores.length}):</p>
              <ul className="mt-1 list-inside list-disc">
                {resultado.errores.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
