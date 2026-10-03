'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_CI = 10
const MAX_PIN = 6

const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-PY', { timeZone: 'America/Asuncion', ...o })

/**
 * Kiosco de marcación (demo de UI): reloj grande (America/Asuncion), campo de
 * cédula, teclado numérico en pantalla, indicador de PIN de 6 puntos y botón
 * "Marcar". La lógica real (validar CI+PIN contra la BD) es de la fase 1.
 */
export function Kiosco() {
  const [ahora, setAhora] = useState(() => new Date())
  const [cedula, setCedula] = useState('')
  const [pin, setPin] = useState('')
  const [estado, setEstado] = useState<'idle' | 'exito' | 'error'>('idle')

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hora = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(ahora)
  const fecha = fmt({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(ahora)

  function tecla(digito: string) {
    setEstado('idle')
    if (cedula.length < MAX_CI) setCedula((c) => c + digito)
    else if (pin.length < MAX_PIN) setPin((p) => p + digito)
  }

  function borrar() {
    setEstado('idle')
    if (pin.length > 0) setPin((p) => p.slice(0, -1))
    else setCedula((c) => c.slice(0, -1))
  }

  function limpiar() {
    setEstado('idle')
    setCedula('')
    setPin('')
  }

  function marcar() {
    if (cedula.length < 5 || pin.length < MAX_PIN) {
      setEstado('error')
      return
    }
    setEstado('exito')
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      <div className="text-center">
        <div className="font-heading text-5xl font-semibold tabular-nums">{hora}</div>
        <div className="mt-1 text-sm text-muted-foreground tabular-nums">{fecha}</div>
      </div>

      <div className="text-center font-medium text-foreground">Ingresá tu cédula y luego el PIN</div>

      <div className="rounded-lg border border-input bg-card px-4 py-3 text-center font-heading text-2xl tabular-nums tracking-widest text-card-foreground">
        {cedula || <span className="text-muted-foreground">0.000.000</span>}
      </div>

      <div className="flex justify-center gap-2" aria-label="PIN">
        {Array.from({ length: MAX_PIN }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'size-3.5 rounded-full border border-input transition-colors',
              i < pin.length ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
          <Button key={k} variant="outline" className="h-14 text-xl" onClick={() => tecla(k)}>
            {k}
          </Button>
        ))}
        <Button variant="outline" className="h-14 text-base" onClick={limpiar}>
          Limpiar
        </Button>
        <Button variant="outline" className="h-14 text-xl" onClick={() => tecla('0')}>
          0
        </Button>
        <Button variant="outline" className="h-14 text-base" onClick={borrar}>
          Borrar
        </Button>
      </div>

      <Button size="lg" className="h-14 w-full text-lg" onClick={marcar}>
        Marcar
      </Button>

      {estado === 'exito' ? (
        <div role="status" className="rounded-md bg-success-soft px-3 py-2 text-sm text-success">
          Marcación registrada. ¡Buen día!
        </div>
      ) : null}
      {estado === 'error' ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          Falta la cédula o el PIN. Revisá e intentá de nuevo.
        </div>
      ) : null}
    </div>
  )
}
