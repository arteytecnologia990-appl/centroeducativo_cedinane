import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Layout de impresión: sin sidebar ni header, fondo blanco para imprimir.
export default async function ImprimirLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <div className="min-h-svh bg-white text-black">{children}</div>
}
