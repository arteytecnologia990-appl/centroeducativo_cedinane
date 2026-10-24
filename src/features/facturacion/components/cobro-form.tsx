'use client'

import { useState } from 'react'
import { crearCobro } from '@/features/facturacion/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

type Cuenta = { id: string; numero: string; tipo: string }
type Banco = { id: string; nombre: string; cuentas: Cuenta[] }
type Pago = { forma: string; monto: string; bancoId: string; cuentaId: string; nro: string }

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)
const tipoTexto: Record<string, string> = { caja_ahorro: 'Caja de ahorro', cuenta_corriente: 'Cta. corriente' }
const FORMASPAGO = ['efectivo', 'transferencia', 'cheque', 'tarjeta']

export function CobroForm({
  documento,
  bancos,
  hoy,
  next,
}: {
  documento: string
  bancos: Banco[]
  hoy: string
  next?: string
}) {
  const [referencia, setReferencia] = useState('')
  const [pagos, setPagos] = useState<Pago[]>([{ forma: 'efectivo', monto: '', bancoId: '', cuentaId: '', nro: '' }])

  const total = pagos.reduce((s, p) => s + (Number(p.monto) || 0), 0)
  const cambia = (i: number, parche: Partial<Pago>) =>
    setPagos((prev) => prev.map((p, j) => (j === i ? { ...p, ...parche } : p)))
  const quita = (i: number) => setPagos((prev) => prev.filter((_, j) => j !== i))
  const agrega = () =>
    setPagos((prev) => [...prev, { forma: 'efectivo', monto: '', bancoId: '', cuentaId: '', nro: '' }])

  return (
    <form action={crearCobro} className="space-y-3 rounded-lg border border-border p-4">
      <input type="hidden" name="documento" value={documento} />
      <input type="hidden" name="next" value={next ?? ''} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" name="fecha" type="date" defaultValue={hoy} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="referencia">Referencia</Label>
          <Input
            id="referencia"
            name="referencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="space-y-2">
        {pagos.map((p, i) => {
          const banco = bancos.find((b) => b.id === p.bancoId)
          const esTransfer = p.forma === 'transferencia'
          return (
            <div key={i} className="space-y-2 rounded-md border border-border p-2">
              <div className="grid grid-cols-[170px_130px_1fr_36px] items-end gap-2">
                <div className="space-y-1.5">
                  {i === 0 ? <Label>Medio</Label> : null}
                  <select
                    name="forma_pago"
                    value={p.forma}
                    onChange={(e) => cambia(i, { forma: e.target.value })}
                    className={claseInput}
                  >
                    {FORMASPAGO.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  {i === 0 ? <Label>Monto</Label> : null}
                  <Input
                    name="monto_pago"
                    type="number"
                    min="0"
                    step="1"
                    value={p.monto}
                    onChange={(e) => cambia(i, { monto: e.target.value })}
                  />
                </div>
                <div />
                <button
                  type="button"
                  onClick={() => quita(i)}
                  disabled={pagos.length === 1}
                  className="h-8 rounded-md border border-input text-sm text-muted-foreground disabled:opacity-40"
                >
                  ×
                </button>
              </div>

              {esTransfer ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>Banco</Label>
                    <select
                      name="banco_id"
                      required
                      value={p.bancoId}
                      onChange={(e) => cambia(i, { bancoId: e.target.value, cuentaId: '' })}
                      className={claseInput}
                    >
                      <option value="">Elegí...</option>
                      {bancos.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cuenta</Label>
                    <select
                      name="cuenta_id"
                      required
                      disabled={!banco}
                      value={p.cuentaId}
                      onChange={(e) => cambia(i, { cuentaId: e.target.value })}
                      className={claseInput}
                    >
                      <option value="">{banco ? 'Elegí...' : 'Elegí un banco'}</option>
                      {(banco?.cuentas ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.numero} ({tipoTexto[c.tipo] ?? c.tipo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>N° transferencia</Label>
                    <Input
                      name="nro_transferencia"
                      required
                      value={p.nro}
                      onChange={(e) => cambia(i, { nro: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <input type="hidden" name="banco_id" value="" />
                  <input type="hidden" name="cuenta_id" value="" />
                  <input type="hidden" name="nro_transferencia" value="" />
                </>
              )}
            </div>
          )
        })}
      </div>

      <button type="button" onClick={agrega} className="text-sm text-primary hover:underline">
        + Agregar medio de pago
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-sm">
          Total cobrado: <strong className="tabular-nums">{guaranies(total)}</strong>
        </span>
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Registrar cobro
        </button>
      </div>
    </form>
  )
}
