'use client'

import { useState } from 'react'
import { CobroForm } from '@/features/facturacion/components/cobro-form'

type Cuenta = { id: string; numero: string; tipo: string }
type Banco = { id: string; nombre: string; cuentas: Cuenta[] }

export function CobroModal({
  documento,
  bancos,
  hoy,
  habilitado,
  facturaCdc,
}: {
  documento: string
  bancos: Banco[]
  hoy: string
  habilitado: boolean
  facturaCdc: string | null
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        disabled={!habilitado}
        title={habilitado ? 'Agregar pago' : 'Vinculá la factura XML para habilitar el pago'}
        className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Agregar pago
      </button>

      {abierto ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4"
          onClick={() => setAbierto(false)}
        >
          <div
            className="mt-10 w-full max-w-2xl rounded-xl border border-border bg-background p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">Agregar pago</h3>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="text-lg text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <CobroForm
              documento={documento}
              bancos={bancos}
              hoy={hoy}
              next="/dashboard/ingresos"
              facturaCdc={facturaCdc}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
