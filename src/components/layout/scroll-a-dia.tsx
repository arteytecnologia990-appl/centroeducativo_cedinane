'use client'

import { useEffect } from 'react'

/** Centra el día de hoy dentro de la franja horizontal. */
export function ScrollADia() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById('dia-hoy')
      const cont = el?.parentElement
      if (!el || !cont) return
      const elRect = el.getBoundingClientRect()
      const contRect = cont.getBoundingClientRect()
      cont.scrollLeft += elRect.left - contRect.left - cont.clientWidth / 2 + elRect.width / 2
    })
    return () => cancelAnimationFrame(raf)
  }, [])
  return null
}
