import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// La raíz redirige según haya sesión o no (antes mostraba la portada de create-next-app).
export default async function HomePage() {
  let autenticado = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    autenticado = Boolean(user)
  } catch {
    autenticado = false
  }

  redirect(autenticado ? '/dashboard' : '/login')
}
