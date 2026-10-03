import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Cliente con la clave service_role. SOLO en el servidor: nunca importar desde
// un componente de cliente (el paquete `server-only` lo impide en build).
// Uso: tareas administrativas que requieren saltarse RLS (migraciones de datos,
// alta de usuarios, etc.).
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
