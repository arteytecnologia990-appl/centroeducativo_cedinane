'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { crearHorario } from '@/features/horarios/actions'
import { DIAS } from '@/features/horarios/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type PersonaOpcion = { id: string; nombres: string; apellidos: string }
type Sede = { id: string; codigo: string; nombre: string }

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function HorarioForm({
  personas,
  sedes,
  personaId,
}: {
  personas: PersonaOpcion[]
  sedes: Sede[]
  personaId: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const form = e.currentTarget
    const result = await crearHorario(new FormData(form))
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
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border p-4" noValidate>
      <h2 className="font-heading text-lg font-semibold text-foreground">Agregar horario</h2>

      <div className="space-y-1.5">
        <Label htmlFor="persona_id">Persona</Label>
        <select id="persona_id" name="persona_id" defaultValue={personaId} required className={claseSelect}>
          <option value="">Elegí una persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellidos}, {p.nombres}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sede_id">Sede</Label>
          <select id="sede_id" name="sede_id" defaultValue={sedes[0]?.id ?? ''} required className={claseSelect}>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.codigo} · {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dia_semana">Día</Label>
          <select id="dia_semana" name="dia_semana" defaultValue="1" className={claseSelect}>
            {DIAS.map((d) => (
              <option key={d.valor} value={d.valor}>
                {d.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hora_inicio">Desde</Label>
          <Input id="hora_inicio" name="hora_inicio" type="time" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hora_fin">Hasta</Label>
          <Input id="hora_fin" name="hora_fin" type="time" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="actividad">Actividad / materia</Label>
        <Input id="actividad" name="actividad" placeholder="Ej.: TOI - Sala 3" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="aula">Aula</Label>
        <Input id="aula" name="aula" placeholder="Ej.: Aula 2" />
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
          'Agregar horario'
        )}
      </Button>
    </form>
  )
}
