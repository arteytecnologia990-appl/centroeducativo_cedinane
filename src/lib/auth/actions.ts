'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, recuperarSchema } from './schemas'

export type AuthResult = { error?: string; ok?: string }

const EMAIL_COOKIE = 'recordarme_email'
const MES = 60 * 60 * 24 * 30
const JORNADA = 60 * 60 * 8

type ErrorAuth = { status?: number; code?: string; name?: string; message?: string }

function mensajeDeError(error: ErrorAuth): string {
  const { status, code, name, message } = error

  if (code === 'invalid_credentials' || code === 'invalid_grant' || status === 400) {
    return 'Correo o contraseña incorrectos.'
  }
  if (code === 'email_not_confirmed') {
    return 'Tenés que confirmar tu correo antes de entrar.'
  }
  if (status === 429 || code === 'over_request_rate_limit') {
    return 'Demasiados intentos. Esperá un momento y volvé a intentar.'
  }

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

// Solo rutas internas relativas (evita redirecciones abiertas).
function rutaSegura(next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next
  return '/dashboard'
}

export async function login(formData: FormData): Promise<AuthResult> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisá los datos.' }
  }

  const { email, password } = parsed.data
  const recordarme = formData.get('recordarme') === 'on'
  const next = rutaSegura(String(formData.get('next') ?? ''))

  let fallo: string | null = null

  try {
    const supabase = await createClient({ maxAge: recordarme ? MES : JORNADA })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) fallo = mensajeDeError(error)
  } catch {
    fallo = 'No pudimos conectar con el servidor. Revisá tu conexión o avisá a administración.'
  }

  if (fallo) return { error: fallo }

  // Recordar el correo para la próxima vez (solo si lo pidió).
  const store = await cookies()
  if (recordarme) {
    store.set(EMAIL_COOKIE, email, { path: '/', maxAge: MES, httpOnly: false, sameSite: 'lax' })
  } else {
    store.delete(EMAIL_COOKIE)
  }

  // redirect() lanza una excepción especial: debe quedar fuera del try/catch.
  redirect(next)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function recuperarPassword(formData: FormData): Promise<AuthResult> {
  const parsed = recuperarSchema.safeParse({ email: String(formData.get('email') ?? '') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisá el correo.' }
  }

  try {
    const supabase = await createClient()
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${base}/auth/callback?next=/restablecer-clave`,
    })
  } catch {
    // No se revela si el correo existe.
  }

  return { ok: 'Si el correo está registrado, te enviamos un enlace para restablecer la contraseña.' }
}
