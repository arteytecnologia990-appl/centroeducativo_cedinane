'use client'

import { useState } from 'react'
import { crearIngreso } from '@/features/ingresos/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ClienteConFacturas } from '@/features/ingresos/queries'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

type Linea = { terapia: string; profesional: string; precio: string; cantidad: string }
type SesionOpcion = { id: string; descripcion: string; monto: number }
type Opcion = { id: string; nombre: string }

export function IngresoForm({
  clientes,
  sesiones,
  profesionales,
  alumnos,
}: {
  clientes: ClienteConFacturas[]
  sesiones: SesionOpcion[]
  profesionales: Opcion[]
  alumnos: Opcion[]
}) {
  const [documento, setDocumento] = useState('')
  const [factura, setFactura] = useState('')
  const [metPago, setMetPago] = useState('')
  const [lineas, setLineas] = useState<Linea[]>([{ terapia: '', profesional: '', precio: '0', cantidad: '1' }])

  const cliente = clientes.find((c) => c.documento === documento)
  const subtotal = (l: Linea) => (Number(l.precio) || 0) * (Number(l.cantidad) || 0)
  const total = lineas.reduce((s, l) => s + subtotal(l), 0)

  const cambia = (i: number, parche: Partial<Linea>) =>
    setLineas((prev) => prev.map((l, j) => (j === i ? { ...l, ...parche } : l)))
  const cambiaTerapia = (i: number, valor: string) => {
    const sesion = sesiones.find((s) => s.descripcion === valor)
    cambia(i, sesion ? { terapia: valor, precio: String(sesion.monto) } : { terapia: valor })
  }
  const quita = (i: number) => setLineas((prev) => prev.filter((_, j) => j !== i))
  const agrega = () => setLineas((prev) => [...prev, { terapia: '', profesional: '', precio: '0', cantidad: '1' }])

  return (
    <form action={crearIngreso} className="space-y-3 rounded-lg border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-6">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="documento">Cliente</Label>
          <select
            id="documento"
            name="documento"
            value={documento}
            onChange={(e) => {
              setDocumento(e.target.value)
              setFactura('')
            }}
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
          <Label htmlFor="alumno_paciente">Alumno / Paciente</Label>
          <select id="alumno_paciente" name="alumno_paciente" className={claseInput}>
            <option value="">—</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.nombre}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="factura_cdc">Factura (XML)</Label>
          <select
            id="factura_cdc"
            name="factura_cdc"
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            disabled={!cliente}
            className={claseInput}
          >
            <option value="">Sin factura (pendiente)</option>
            {(cliente?.facturas ?? []).map((f) => (
              <option key={f.cdc} value={f.cdc}>
                {f.numero ?? f.cdc.slice(0, 12)} · {guaranies(f.monto)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="met_pago">Met. Pago</Label>
          <select
            id="met_pago"
            name="met_pago"
            value={metPago}
            onChange={(e) => setMetPago(e.target.value)}
            className={claseInput}
          >
            <option value="">—</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="cheque">Cheque</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
      </div>

      <datalist id="sesiones-list">
        {sesiones.map((s) => (
          <option key={s.id} value={s.descripcion}>
            {guaranies(s.monto)}
          </option>
        ))}
      </datalist>

      <div className="space-y-2">
        {lineas.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_110px_90px_100px_36px] items-end gap-2">
            <div className="space-y-1.5">
              {i === 0 ? <Label>Profesional</Label> : null}
              <select
                name="profesional"
                value={l.profesional}
                onChange={(e) => cambia(i, { profesional: e.target.value })}
                className={claseInput}
              >
                <option value="">—</option>
                {profesionales.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              {i === 0 ? <Label>Terapia / servicio</Label> : null}
              <Input
                name="terapia"
                value={l.terapia}
                list="sesiones-list"
                onChange={(e) => cambiaTerapia(i, e.target.value)}
                placeholder="Escribí o elegí de Sesiones"
              />
            </div>
            <div className="space-y-1.5">
              {i === 0 ? <Label>Precio</Label> : null}
              <Input
                name="precio_unitario"
                type="number"
                min="0"
                step="1"
                value={l.precio}
                onChange={(e) => cambia(i, { precio: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              {i === 0 ? <Label>Cant.</Label> : null}
              <Input
                name="cantidad"
                type="number"
                min="0"
                step="0.01"
                value={l.cantidad}
                onChange={(e) => cambia(i, { cantidad: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              {i === 0 ? <Label>Subtotal</Label> : null}
              <div className="flex h-8 items-center justify-end text-sm tabular-nums">{guaranies(subtotal(l))}</div>
            </div>
            <button
              type="button"
              onClick={() => quita(i)}
              disabled={lineas.length === 1}
              className="h-8 rounded-md border border-input text-sm text-muted-foreground disabled:opacity-40"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={agrega} className="text-sm text-primary hover:underline">
        + Agregar línea
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-sm">
          Total: <strong className="tabular-nums">{guaranies(total)}</strong>
        </span>
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
