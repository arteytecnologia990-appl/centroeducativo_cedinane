import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Proxy de Next.js 16 (sustituye al antiguo "middleware.ts").
// Refresca la sesión de Supabase en cada petición.
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  // Excluir estáticos para que el proxy solo corra en rutas de la aplicación.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
