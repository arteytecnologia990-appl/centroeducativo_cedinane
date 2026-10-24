'use client'

import { useState } from 'react'
import { crearIngreso } from '@/features/ingresos/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ClienteConFacturas } from '@/features/ingresos/queries'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export function IngresoForm({ clientes }: { clientes: ClienteConFacturas[] }) {
  const [documento, setDocumento] = useState('')
  const [precio, setPrecio] = useState('0')
  const [cantidad, setCantidad] = useState('1')

  const cliente = clientes.find((c) => c.documento === documento)
  const total = (Number(precio) || 0) * (Number(cantidad) || 0)

  return (
    <form action={crearIngreso} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="documento">Usuario</Label>
        <select
          id="documento"
          name="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className={claseInput}
        >
          <option value="">Sin cliente (sin factura)</option>
          {clientes.map((c) => (
            <option key={c.documento} value={c.documento}>
              {c.nombre} · {c.documento}
            </option>
          ))}
        </select>
        <input type="hidden" name="usuario" value={cliente?.nombre ?? ''} />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="factura_cdc">Factura (XML)</Label>
        <select id="factura_cdc" name="factura_cdc" disabled={!cliente} className={claseInput}>
          <option value="">Sin factura (pendiente)</option>
          {(cliente?.facturas ?? []).map((f) => (
            <option key={f.cdc} value={f.cdc}>
              {f.numero ?? f.cdc.slice(0, 12)} · {guaranies(f.monto)}
            </option>
          ))}
        </select>
        {!cliente ? (
          <p className="text-[11px] text-muted-foreground">Elegí un usuario para ver sus facturas con saldo.</p>
        ) : null}
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="terapia">Terapia / servicio</Label>
        <Input id="terapia" name="terapia" required placeholder="Ej.: Sesión de psicología" />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="profesional">Profesional</Label>
        <Input id="profesional" name="profesional" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="precio_unitario">Precio unitario</Label>
        <Input
          id="precio_unitario"
          name="precio_unitario"
          type="number"
          min="0"
          step="1"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input
          id="cantidad"
          name="cantidad"
          type="number"
          min="0"
          step="0.01"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="total">Total</Label>
        <Input id="total" name="total" readOnly value={String(total)} className="tabular-nums" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="met_pago">Met. Pago</Label>
        <select id="met_pago" name="met_pago" className={claseInput}>
          <option value="">—</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="cheque">Cheque</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>

      <div className="flex items-end sm:col-span-6">
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Registrar ingreso
        </button>
      </div>
    </form>
  )
}
