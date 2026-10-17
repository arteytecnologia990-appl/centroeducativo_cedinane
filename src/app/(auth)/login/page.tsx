import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  const params = await searchParams
  const next = params.next ?? ''

  const cookieStore = await cookies()
  const emailInicial = cookieStore.get('recordarme_email')?.value ?? ''

  return <LoginForm next={next} emailInicial={emailInicial} />
}
