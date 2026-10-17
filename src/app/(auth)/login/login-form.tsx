'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { login } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/auth/password-input'
import { LoginFooter } from '@/components/auth/login-footer'

export function LoginForm({ next = '', emailInicial = '' }: { next?: string; emailInicial?: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) setError(result.error)
    setPending(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">Ingresá con tu correo y contraseña.</p>
      </div>

      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          defaultValue={emailInicial}
          required
          autoFocus
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'login-error' : undefined}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link href="/recuperar-clave" className="text-xs text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          ariaInvalid={Boolean(error)}
          ariaDescribedBy={error ? 'login-error' : undefined}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="recordarme"
          defaultChecked
          className="size-4 rounded border-input accent-primary"
        />
        Recordarme
      </label>

      {error ? (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Entrando…
          </>
        ) : (
          'Entrar'
        )}
      </Button>

      <LoginFooter />
    </form>
  )
}
