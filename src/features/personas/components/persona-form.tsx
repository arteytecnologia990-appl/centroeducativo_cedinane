'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { actualizarPersona, crearPersona } from '@/features/personas/actions/persona'
import { ETIQUETA_ROL, ROLES_NEGOCIO } from '@/features/personas/schemas/persona'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PersonaEditable = {
  id?: string
  nombres?: string | null
  apellidos?: string | null
  ci?: string | null
  fecha_nacimiento?: string | null
  sexo?: string | null
  email?: string | null
  telefono?: string | null
  direccion?: string | null
  observaciones?: string | null
}

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function PersonaForm({ persona }: { persona?: PersonaEditable }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const esEdicion = Boolean(persona?.id)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = esEdicion ? await actualizarPersona(formData) : await crearPersona(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4" noValidate>
      {esEdicion ? <input type="hidden" name="id" value={persona!.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nombres">Nombres *</Label>
          <Input id="nombres" name="nombres" defaultValue={persona?.nombres ?? ''} required autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apellidos">Apellidos *</Label>
          <Input id="apellidos" name="apellidos" defaultValue={persona?.apellidos ?? ''} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ci">Cédula</Label>
          <Input id="ci" name="ci" inputMode="numeric" defaultValue={persona?.ci ?? ''} placeholder="Sin puntos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
          <Input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            defaultValue={persona?.fecha_nacimiento ?? ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sexo">Sexo</Label>
          <select id="sexo" name="sexo" defaultValue={persona?.sexo ?? ''} className={claseSelect}>
            <option value="">Sin especificar</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
            <option value="X">No binario</option>
          </select>
        </div>
        {!esEdicion ? (
          <div className="space-y-1.5">
            <Label htmlFor="rol_negocio">Rol</Label>
            <select id="rol_negocio" name="rol_negocio" defaultValue="" className={claseSelect}>
              <option value="">Sin rol</option>
              {ROLES_NEGOCIO.map((r) => (
                <option key={r} value={r}>
                  {ETIQUETA_ROL[r]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" defaultValue={persona?.email ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={persona?.telefono ?? ''} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="direccion">Dirección</Label>
        <Input id="direccion" name="direccion" defaultValue={persona?.direccion ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea id="observaciones" name="observaciones" rows={3} defaultValue={persona?.observaciones ?? ''} />
      </div>

      {error ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Guardando…
            </>
          ) : esEdicion ? (
            'Guardar cambios'
          ) : (
            'Crear persona'
          )}
        </Button>
        <Link
          href="/personas"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
