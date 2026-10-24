'use client'

import { useState } from 'react'
import { vincularFactura } from '@/features/ingresos/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Factura = {
  cdc: string
  numero_documento: string | null
  nombre_informado: string | null
  monto_total: number
}

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)
const etiqueta = (f: Factura) =>
  `${f.numero_documento ?? 's/n'} — ${f.nombre_informado ?? ''} — ${guaranies(Number(f.monto_total))}`

export function VincularFacturaForm({ ingresoId, facturas }: { ingresoId: string; facturas: Factura[] }) {
  const [texto, setTexto] = useState('')
  const [cdc, setCdc] = useState('')

  const cambia = (valor: string) => {
    setTexto(valor)
    const f = facturas.find((x) => etiqueta(x) === valor)
    setCdc(f?.cdc ?? '')
  }

  return (
    <form action={vincularFactura} className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-4">
      <input type="hidden" name="id" value={ingresoId} />
      <input type="hidden" name="factura_cdc" value={cdc} />
      <datalist id="facturas-disponibles">
        {facturas.map((f) => (
          <option key={f.cdc} value={etiqueta(f)} />
        ))}
      </datalist>
      <div className="min-w-72 space-y-1.5">
        <Label htmlFor="factura_texto">Agregar factura XML</Label>
        <Input
          id="factura_texto"
          list="facturas-disponibles"
          value={texto}
          onChange={(e) => cambia(e.target.value)}
          placeholder="Escribí N° de factura, cliente o monto..."
        />
      </div>
      <button
        type="submit"
        disabled={!cdc}
        className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        Vincular factura
      </button>
      {facturas.length === 0 ? (
        <p className="text-xs text-warning">
          No hay facturas disponibles (ya vinculadas o de monto mayor al ingreso).
        </p>
      ) : null}
    </form>
  )
}
