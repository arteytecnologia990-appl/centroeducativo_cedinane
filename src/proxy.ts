import { NextResponse } from 'next/server'

// Proxy de Next.js 16 (sustituye al antiguo "middleware.ts").
// Corre antes de renderizar la ruta. Aquí irá el refresco de sesión de Supabase
// y el control de acceso por rol.
// Ver: boveda/03-Tecnico/RBAC-y-RLS.md y node_modules/next/dist/docs (proxy).

export function proxy() {
  // TODO(fase-1-base): refrescar sesión Supabase y redirigir según rol.
  return NextResponse.next()
}

export const config = {
  // Excluir estáticos para que el proxy solo corra en rutas de la aplicación.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
