import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Cliente Supabase para el navegador (anon key, sujeto a RLS).
// Usar solo en componentes del lado cliente; para el servidor usar server.ts/admin.ts.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
