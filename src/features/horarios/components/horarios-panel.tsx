'use client'

import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { crearHorario, eliminarHorario } from '@/features/horarios/actions'
import { DIAS } from '@/features/horarios/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type PersonaOpcion = { id: string; nombres: string; apellidos: string }
type Sede = { id: string; codigo: string; nombre: string }
type Horario = {
  id: string
  persona_id: string
  sede_id: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  actividad: string | null
  aula: string | null
}

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const etiquetaDia = (d: number) => DIAS.find((x) => Number(x.valor) === d)?.etiqueta ?? `Día ${d}`
const hora = (v: string) => v.slice(0, 5)

export function HorariosPanel({
  initialHorarios,
  personas,
  sedes,
  personaIdInicial,
}: {
  initialHorarios: Horario[]
  personas: PersonaOpcion[]
  sedes: Sede[]
  personaIdInicial: string
}) {
  const [horarios, setHorarios] = useState<Horario[]>(initialHorarios)
  const [personaId, setPersonaId] = useState(personaIdInicial)
  const [diasSel, setDiasSel] = useState<string[]>(['1'])
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const visibles = useMemo(
    () => (personaId ? horarios.filter((h) => h.persona_id === personaId) : horarios),
    [horarios, personaId]
  )
  const nombrePersona = useMemo(
    () => new Map(personas.map((p) => [p.id, `${p.nombres} ${p.apellidos}`])),
    [personas]
  )

  function toggleDia(valor: string) {
    setDiasSel((prev) => (prev.includes(valor) ? prev.filter((d) => d !== valor) : [...prev, valor]))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (diasSel.length === 0) {
      setError('Elegí al menos un día.')
      return
    }
    setPending(true)
    setError(null)

    const form = e.currentTarget
    const base = new FormData(form)
    const creados: Horario[] = []

    for (const dia of diasSel) {
      base.set('dia_semana', dia)
      const result = await crearHorario(base)
      if (result?.error) {
        setError(result.error)
        break
      }
      if (result?.horario) creados.push(result.horario)
    }

    if (creados.length > 0) {
      setHorarios((prev) => [...prev, ...creados])
      form.reset()
      setDiasSel(['1'])
    }
    setPending(false)
  }

  async function onDelete(h: Horario) {
    setHorarios((prev) => prev.filter((x) => x.id !== h.id))
    const result = await eliminarHorario(h.id)
    if (result?.error) {
      setError(result.error)
      setHorarios((prev) => [...prev, h])
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        <div className="max-w-md space-y-1.5">
          <Label htmlFor="filtro-persona">Ver horarios de</Label>
          <select
            id="filtro-persona"
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
            className={claseSelect}
          >
            <option value="">Todas las personas</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {!personaId ? <th className="px-3 py-2 text-left font-medium">Persona</th> : null}
                <th className="px-3 py-2 text-left font-medium">Día</th>
                <th className="px-3 py-2 text-left font-medium">Hora</th>
                <th className="px-3 py-2 text-left font-medium">Actividad</th>
                <th className="px-3 py-2 text-left font-medium">Aula</th>
                <th className="w-10 px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibles.map((h) => (
                <tr key={h.id}>
                  {!personaId ? (
                    <td className="px-3 py-2 font-medium">{nombrePersona.get(h.persona_id) ?? '—'}</td>
                  ) : null}
                  <td className="px-3 py-2">{etiquetaDia(h.dia_semana)}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {hora(h.hora_inicio)}–{hora(h.hora_fin)}
                  </td>
                  <td className="px-3 py-2">{h.actividad ?? '—'}</td>
                  <td className="px-3 py-2">{h.aula ?? '—'}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(h)}
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={personaId ? 5 : 6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No hay horarios cargados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border p-4" noValidate>
        <h2 className="font-heading text-lg font-semibold text-foreground">Agregar horario</h2>

        <div className="space-y-1.5">
          <Label htmlFor="persona_id">Persona</Label>
          <select id="persona_id" name="persona_id" defaultValue={personaId} required className={claseSelect}>
            <option value="">Elegí una persona</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
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
            <Label htmlFor="hora_inicio">Desde</Label>
            <Input id="hora_inicio" name="hora_inicio" type="time" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hora_fin">Hasta</Label>
            <Input id="hora_fin" name="hora_fin" type="time" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Días (podés elegir varios)</Label>
          <div className="flex flex-wrap gap-2">
            {DIAS.map((d) => (
              <label key={d.valor} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={diasSel.includes(d.valor)}
                  onChange={() => toggleDia(d.valor)}
                  className="size-4 rounded border-input accent-primary"
                />
                {d.etiqueta.slice(0, 3)}
              </label>
            ))}
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
            `Agregar${diasSel.length > 1 ? ` (${diasSel.length} días)` : ''}`
          )}
        </Button>
      </form>
    </div>
  )
}
