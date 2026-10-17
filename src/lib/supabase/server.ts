import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Cliente Supabase para Server Components y Server Actions.
// Crear un cliente nuevo por petición; nunca reutilizarlo entre peticiones.
// `maxAge` (segundos) controla la duración de la cookie de sesión ("recordarme").
export async function createClient(opciones?: { maxAge?: number }) {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(opciones?.maxAge ? { cookieOptions: { maxAge: opciones.maxAge } } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // En Server Components no se pueden escribir cookies; el proxy las refresca.
          }
        },
      },
    }
  )
}
