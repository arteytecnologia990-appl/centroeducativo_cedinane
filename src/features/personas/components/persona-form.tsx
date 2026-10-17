'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { actualizarPersona, crearPersona } from '@/features/personas/actions/persona'
import {
  ETIQUETA_ROL,
  FORMACION_ACADEMICA,
  ROLES_NEGOCIO,
  SECTORES,
  TURNOS,
} from '@/features/personas/schemas/persona'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PersonalEditable = {
  cargo?: string | null
  programa?: string | null
  formacion_academica?: string | null
  turno?: string | null
  sector?: string | null
  experiencia_cargo?: string | null
  antiguedad_institucion?: string | null
  registro_profesional?: string | null
  tiene_ci?: boolean | null
  tiene_cv?: boolean | null
  tiene_cd?: boolean | null
}

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
  personal?: PersonalEditable | null
}

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function PersonaForm({ persona }: { persona?: PersonaEditable }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const esEdicion = Boolean(persona?.id)
  const p = persona?.personal ?? null

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

      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-medium text-foreground">Datos laborales</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" name="cargo" defaultValue={p?.cargo ?? ''} placeholder="Ej.: Docente Titular - Sede 1" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="programa">Programa</Label>
            <Input id="programa" name="programa" defaultValue={p?.programa ?? ''} placeholder="Ej.: TOI, HPA…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="formacion_academica">Formación académica</Label>
            <select
              id="formacion_academica"
              name="formacion_academica"
              defaultValue={p?.formacion_academica ?? ''}
              className={claseSelect}
            >
              <option value="">Sin especificar</option>
              {FORMACION_ACADEMICA.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turno">Turno</Label>
            <select id="turno" name="turno" defaultValue={p?.turno ?? ''} className={claseSelect}>
              <option value="">Sin especificar</option>
              {TURNOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <select id="sector" name="sector" defaultValue={p?.sector ?? ''} className={claseSelect}>
              <option value="">Sin especificar</option>
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s === 'privado' ? 'Privado' : 'Público'}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experiencia_cargo">Experiencia en cargo</Label>
            <Input id="experiencia_cargo" name="experiencia_cargo" defaultValue={p?.experiencia_cargo ?? ''} placeholder="Ej.: 5 años" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="antiguedad_institucion">Antigüedad en la institución</Label>
            <Input id="antiguedad_institucion" name="antiguedad_institucion" defaultValue={p?.antiguedad_institucion ?? ''} placeholder="Ej.: 11 años" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registro_profesional">Registro / Matrícula</Label>
            <Input id="registro_profesional" name="registro_profesional" defaultValue={p?.registro_profesional ?? ''} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_ci" defaultChecked={Boolean(p?.tiene_ci)} className="size-4 rounded border-input accent-primary" /> CI
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_cv" defaultChecked={Boolean(p?.tiene_cv)} className="size-4 rounded border-input accent-primary" /> CV
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_cd" defaultChecked={Boolean(p?.tiene_cd)} className="size-4 rounded border-input accent-primary" /> CD
          </label>
          <span className="text-xs text-muted-foreground">Documentos presentados</span>
        </div>
      </fieldset>

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
          href="/dashboard/personas"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
