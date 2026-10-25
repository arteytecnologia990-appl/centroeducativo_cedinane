'use client'

import { useEffect } from 'react'

/** Desplaza la franja de días para centrar el día de hoy. */
export function ScrollADia() {
  useEffect(() => {
    document.getElementById('dia-hoy')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])
  return null
}
