'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { recuperarPassword } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RecuperarForm() {
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setOk(null)
    const result = await recuperarPassword(new FormData(e.currentTarget))
    if (result?.error) setError(result.error)
    if (result?.ok) setOk(result.ok)
    setPending(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Recuperar contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Ingresá tu correo y te enviamos un enlace para restablecerla.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          autoFocus
        />
      </div>

      {error ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {ok ? (
        <div role="status" className="rounded-md bg-success-soft px-3 py-2 text-sm text-success">
          {ok}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Enviando…
          </>
        ) : (
          'Enviar enlace'
        )}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver a iniciar sesión
      </Link>
    </form>
  )
}
