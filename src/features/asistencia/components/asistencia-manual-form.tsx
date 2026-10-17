'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { registrarManual } from '@/features/asistencia/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Persona = { id: string; nombres: string; apellidos: string }

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function AsistenciaManualForm({ personas, fecha }: { personas: Persona[]; fecha: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const form = e.currentTarget
    const result = await registrarManual(new FormData(form))
    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }
    form.reset()
    router.refresh()
    setPending(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border p-4" noValidate>
      <h2 className="font-heading text-lg font-semibold text-foreground">Registrar marcación</h2>

      <div className="space-y-1.5">
        <Label htmlFor="persona_id">Persona</Label>
        <select id="persona_id" name="persona_id" required className={claseSelect}>
          <option value="">Elegí una persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellidos}, {p.nombres}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" name="fecha" type="date" defaultValue={fecha} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hora">Hora</Label>
          <Input id="hora" name="hora" type="time" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tipo">Tipo</Label>
        <select id="tipo" name="tipo" className={claseSelect}>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
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
          'Registrar'
        )}
      </Button>
    </form>
  )
}
