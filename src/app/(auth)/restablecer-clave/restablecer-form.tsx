'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/auth/password-input'

export function RestablecerForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [guardado, setGuardado] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const password = String(new FormData(e.currentTarget).get('password') ?? '')
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      setPending(false)
      return
    }
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) setError('No se pudo actualizar la contraseña. Intentá de nuevo.')
    else setGuardado(true)
    setPending(false)
  }

  if (guardado) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Contraseña actualizada</h1>
        <p className="text-sm text-muted-foreground">Ya podés iniciar sesión con tu nueva contraseña.</p>
        <Link
          href="/login"
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Nueva contraseña</h1>
        <p className="text-sm text-muted-foreground">Elegí una contraseña de al menos 8 caracteres.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <PasswordInput id="password" name="password" autoComplete="new-password" />
      </div>

      {error ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Guardando…
          </>
        ) : (
          'Guardar contraseña'
        )}
      </Button>
    </form>
  )
}
