import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RestablecerForm } from './restablecer-form'

export default async function RestablecerClavePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/recuperar-clave')

  return <RestablecerForm />
}
