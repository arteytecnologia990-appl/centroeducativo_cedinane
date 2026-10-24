'use client'

import { useState } from 'react'
import { crearCobro } from '@/features/facturacion/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

type Cuenta = { id: string; numero: string; tipo: string }
type Banco = { id: string; nombre: string; cuentas: Cuenta[] }

const tipoTexto: Record<string, string> = {
  caja_ahorro: 'Caja de ahorro',
  cuenta_corriente: 'Cta. corriente',
}

export function CobroForm({ documento, bancos, hoy }: { documento: string; bancos: Banco[]; hoy: string }) {
  const [forma, setForma] = useState('efectivo')
  const [bancoId, setBancoId] = useState('')

  const banco = bancos.find((b) => b.id === bancoId)
  const esTransferencia = forma === 'transferencia'

  return (
    <form action={crearCobro} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
      <input type="hidden" name="documento" value={documento} />

      <div className="space-y-1.5">
        <Label htmlFor="monto">Monto (Gs)</Label>
        <Input id="monto" name="monto" type="number" min="1" step="1" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" defaultValue={hoy} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="forma_pago">Forma de pago</Label>
        <select
          id="forma_pago"
          name="forma_pago"
          value={forma}
          onChange={(e) => setForma(e.target.value)}
          className={claseInput}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="cheque">Cheque</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>

      {esTransferencia ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="banco_id">Banco</Label>
            <select
              id="banco_id"
              name="banco_id"
              required
              value={bancoId}
              onChange={(e) => setBancoId(e.target.value)}
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
            <Label htmlFor="cuenta_id">Cuenta</Label>
            <select id="cuenta_id" name="cuenta_id" required disabled={!banco} className={claseInput}>
              <option value="">{banco ? 'Elegí...' : 'Elegí un banco'}</option>
              {(banco?.cuentas ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.numero} ({tipoTexto[c.tipo] ?? c.tipo})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nro_transferencia">N° transferencia</Label>
            <Input id="nro_transferencia" name="nro_transferencia" required />
          </div>
        </>
      ) : null}

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="referencia">Referencia</Label>
        <Input id="referencia" name="referencia" placeholder="Opcional" />
      </div>
      <div className="flex items-end sm:col-span-6">
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
