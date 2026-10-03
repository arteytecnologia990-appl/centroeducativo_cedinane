'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { EstiloId } from './estilos'
import { ESTILO_COOKIE, ESTILO_DEFAULT, guardarEstiloCookie } from './cookie'

type EstiloContextValue = {
  estilo: EstiloId
  setEstilo: (estilo: EstiloId) => void
}

const EstiloContext = createContext<EstiloContextValue | null>(null)

/**
 * Provee el estilo activo (a|b|c|d). El valor inicial llega del servidor
 * (layout.tsx lee la cookie), así el primer render no parpadea.
 */
export function EstiloProvider({
  children,
  estiloInicial = ESTILO_DEFAULT,
}: {
  children: React.ReactNode
  estiloInicial?: EstiloId
}) {
  const [estilo, setEstiloState] = useState<EstiloId>(estiloInicial)

  const setEstilo = useCallback((nuevo: EstiloId) => {
    setEstiloState(nuevo)
    document.documentElement.setAttribute('data-estilo', nuevo)
    guardarEstiloCookie(nuevo)
    try {
      localStorage.setItem(ESTILO_COOKIE, nuevo)
    } catch {
      // almacenamiento no disponible: la cookie alcanza
    }
  }, [])

  const value = useMemo(() => ({ estilo, setEstilo }), [estilo, setEstilo])

  return <EstiloContext.Provider value={value}>{children}</EstiloContext.Provider>
}

export function useEstilo(): EstiloContextValue {
  const ctx = useContext(EstiloContext)
  if (!ctx) throw new Error('useEstilo debe usarse dentro de <EstiloProvider>')
  return ctx
}
