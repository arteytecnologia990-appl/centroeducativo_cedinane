'use client'

import { useSyncExternalStore } from 'react'

function suscribir(cb: () => void) {
  const t = setInterval(cb, 60000)
  return () => clearInterval(t)
}

/** Snapshot: el minuto actual (string estable durante ese minuto). */
const obten = () => new Date().toISOString().slice(0, 16)
const servidor = () => ''

/** Saludo con la fecha y hora actuales (calculado en el navegador, sin desfase de hidratación). */
export function Saludo() {
  const minuto = useSyncExternalStore(suscribir, obten, servidor)

  if (!minuto) {
    return <p className="truncate text-sm text-muted-foreground">¡Hola! Bienvenido/a.</p>
  }

  const ahora = new Date(minuto)
  const fecha = ahora.toLocaleDateString('es-PY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const hora = ahora.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })

  return (
    <p className="truncate text-sm text-muted-foreground">
      <span className="font-heading font-semibold text-foreground">¡Hola!</span>{' '}
      <span className="capitalize">{fecha}</span> · <span className="tabular-nums">{hora}</span>
    </p>
  )
}
