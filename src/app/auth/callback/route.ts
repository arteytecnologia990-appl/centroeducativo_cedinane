import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Recibe el enlace de recuperación y cambia el código por una sesión.
// Patrón oficial de Supabase para Next.js (exchangeCodeForSession en el servidor).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const destino = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${destino}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
