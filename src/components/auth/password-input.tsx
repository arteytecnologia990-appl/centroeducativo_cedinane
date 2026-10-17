'use client'

import { useState } from 'react'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { Input } from '@/components/ui/input'

type PasswordInputProps = {
  id: string
  name: string
  autoComplete?: string
  placeholder?: string
  autoFocus?: boolean
  ariaInvalid?: boolean
  ariaDescribedBy?: string
}

/** Campo de contraseña con mostrar/ocultar y aviso de Bloq Mayús. */
export function PasswordInput({
  id,
  name,
  autoComplete = 'current-password',
  placeholder,
  autoFocus,
  ariaInvalid,
  ariaDescribedBy,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const [caps, setCaps] = useState(false)

  function detectarCaps(e: React.KeyboardEvent<HTMLInputElement>) {
    if (typeof e.getModifierState === 'function') setCaps(e.getModifierState('CapsLock'))
  }

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          onKeyDown={detectarCaps}
          onKeyUp={detectarCaps}
          onBlur={() => setCaps(false)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {caps ? (
        <p className="flex items-center gap-1 text-xs text-warning">
          <TriangleAlert className="size-3.5" />
          Bloq Mayús está activado.
        </p>
      ) : null}
    </div>
  )
}
