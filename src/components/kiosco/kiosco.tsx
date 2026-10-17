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

/** Kiosco de marcación: cédula + PIN, registra entrada/salida del día. */
export function Kiosco() {
  const [ahora, setAhora] = useState(() => new Date())
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
    if (cedula.length < MAX_CI) setCedula((c) => c + digito)
    else if (pin.length < MAX_PIN) setPin((p) => p + digito)
  }

  function borrar() {
    setResultado(null)
    if (pin.length > 0) setPin((p) => p.slice(0, -1))
    else setCedula((c) => c.slice(0, -1))
  }

  function limpiar() {
    setResultado(null)
    setCedula('')
    setPin('')
  }

  async function marcar() {
    if (cedula.length < 5 || pin.length < 4) {
      setResultado({ error: 'Faltan la cédula o el PIN.' })
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
    }
    setPending(false)
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

      <Button size="lg" className="h-14 w-full text-lg" onClick={marcar} disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" /> Registrando…
          </>
        ) : (
          'Marcar'
        )}
      </Button>

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
