'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthResult = { error?: string }

type ErrorAuth = { status?: number; code?: string; name?: string; message?: string }

function mensajeDeError(error: ErrorAuth): string {
  const { status, code, name, message } = error

  // Credenciales inválidas
  if (code === 'invalid_credentials' || code === 'invalid_grant' || status === 400) {
    return 'Correo o contraseña incorrectos.'
  }
  // Correo sin confirmar
  if (code === 'email_not_confirmed') {
    return 'Tenés que confirmar tu correo antes de entrar.'
  }
  // Demasiados intentos
  if (status === 429 || code === 'over_request_rate_limit') {
    return 'Demasiados intentos. Esperá un momento y volvé a intentar.'
  }

  // Problema de red o servidor caído (p. ej. proyecto de Supabase pausado)
  const esProblemaDeRed =
    status === 0 ||
    status === undefined ||
    (typeof status === 'number' && status >= 500) ||
    name === 'AuthRetryableFetchError' ||
    /fetch|network|ENOTFOUND|ECONNREFUSED|ECONNRESET|timeout/i.test(message ?? '')

  if (esProblemaDeRed) {
    return 'No pudimos conectar con el servidor. Revisá tu conexión o avisá a administración.'
  }

  return 'No se pudo iniciar sesión. Intentá de nuevo.'
}

export async function login(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Ingresá el correo y la contraseña.' }
  }

  let fallo: string | null = null

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) fallo = mensajeDeError(error)
  } catch {
    fallo = 'No pudimos conectar con el servidor. Revisá tu conexión o avisá a administración.'
  }

  if (fallo) return { error: fallo }

  // redirect() lanza una excepción especial: debe quedar fuera del try/catch.
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
