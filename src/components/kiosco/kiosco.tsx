'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { registrarKiosco, type KioscoResult } from '@/features/asistencia/actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_CI = 10
const MAX_PIN = 6

const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-PY', { timeZone: 'America/Asuncion', ...o })

/** Kiosco de marcación en 2 pasos: cédula → PIN. Acepta teclado en pantalla o físico. */
export function Kiosco() {
  const [ahora, setAhora] = useState(() => new Date())
  const [paso, setPaso] = useState<'ci' | 'pin'>('ci')
  const [cedula, setCedula] = useState('')
  const [pin, setPin] = useState('')
  const [resultado, setResultado] = useState<KioscoResult | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hora = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(ahora)
  const fecha = fmt({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(ahora)

  function tecla(digito: string) {
    setResultado(null)
    if (paso === 'ci') {
      if (cedula.length < MAX_CI) setCedula((c) => c + digito)
    } else if (pin.length < MAX_PIN) {
      setPin((p) => p + digito)
    }
  }

  function borrar() {
    setResultado(null)
    if (paso === 'ci') setCedula((c) => c.slice(0, -1))
    else setPin((p) => p.slice(0, -1))
  }

  function limpiar() {
    setResultado(null)
    setCedula('')
    setPin('')
    setPaso('ci')
  }

  function continuar() {
    if (cedula.length < 5) {
      setResultado({ error: 'Ingresá tu cédula.' })
      return
    }
    setResultado(null)
    setPaso('pin')
  }

  async function marcar() {
    if (pin.length < 4) {
      setResultado({ error: 'Ingresá tu PIN (4 a 6 dígitos).' })
      return
    }
    setPending(true)
    setResultado(null)

    const fd = new FormData()
    fd.set('ci', cedula)
    fd.set('pin', pin)
    const r = await registrarKiosco(fd)
    setResultado(r)
    if (r.ok) {
      setCedula('')
      setPin('')
      setPaso('ci')
    }
    setPending(false)
  }

  // Teclado físico (opcional): dígitos, Backspace y Enter.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (/^\d$/.test(e.key)) {
        tecla(e.key)
      } else if (e.key === 'Backspace') {
        borrar()
      } else if (e.key === 'Enter') {
        if (paso === 'ci') continuar()
        else void marcar()
      } else if (e.key === 'Escape') {
        limpiar()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso, cedula, pin, pending])

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      <div className="text-center">
        <div className="font-heading text-5xl font-semibold tabular-nums">{hora}</div>
        <div className="mt-1 text-sm text-muted-foreground tabular-nums">{fecha}</div>
      </div>

      {paso === 'ci' ? (
        <>
          <div className="text-center font-medium text-foreground">Paso 1 de 2 · Ingresá tu cédula</div>
          <div
            className={cn(
              'rounded-lg border bg-card px-4 py-3 text-center font-heading text-2xl tracking-widest text-card-foreground tabular-nums',
              cedula ? 'border-primary' : 'border-input'
            )}
          >
            {cedula || <span className="text-muted-foreground">0.000.000</span>}
          </div>
        </>
      ) : (
        <>
          <div className="text-center font-medium text-foreground">Paso 2 de 2 · Ingresá tu PIN</div>
          <div className="text-center text-sm text-muted-foreground tabular-nums">C.I. {cedula}</div>
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
        </>
      )}

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

      {paso === 'ci' ? (
        <Button size="lg" className="h-14 w-full text-lg" onClick={continuar}>
          Continuar
        </Button>
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <Button
            variant="outline"
            className="h-14 px-4"
            onClick={() => {
              setPaso('ci')
              setPin('')
              setResultado(null)
            }}
          >
            ← Volver
          </Button>
          <Button size="lg" className="h-14 text-lg" onClick={marcar} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" /> Registrando…
              </>
            ) : (
              'Marcar'
            )}
          </Button>
        </div>
      )}

      {resultado?.ok ? (
        <div role="status" className="rounded-md bg-success-soft px-3 py-2 text-sm text-success">
          <div className="font-medium">
            {resultado.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada · {resultado.hora}
          </div>
          <div>{resultado.persona}</div>
        </div>
      ) : null}
      {resultado?.error ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {resultado.error}
        </div>
      ) : null}
    </div>
  )
}
