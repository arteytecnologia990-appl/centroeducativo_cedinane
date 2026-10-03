import type { EstiloId } from './estilos'

// Nombre de la cookie que guarda el estilo activo (a|b|c|d).
export const ESTILO_COOKIE = 'estilo'

// Estilo por defecto cuando no hay cookie ni preferencia guardada.
export const ESTILO_DEFAULT: EstiloId = 'a'

// Guarda el estilo en cookie (lado cliente). Expira en 1 año.
export function guardarEstiloCookie(estilo: EstiloId) {
  if (typeof document === 'undefined') return
  document.cookie = `${ESTILO_COOKIE}=${estilo}; path=/; max-age=31536000; samesite=lax`
}
