'use client'

import { useMemo, useState } from 'react'
import { crearAdelantoSesionesMulti } from '@/features/salarios/actions'
import { Label } from '@/components/ui/label'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

type SesionOpt = { id: string; descripcion: string; monto: number; porc_profesional: number }
type PersonaOpt = { id: string; nombres: string; apellidos: string; regimen: string }

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export function AdelantoSesionesForm({
  personas,
  sesiones,
  periodo,
  fecha,
  porcIps,
  porcIva,
}: {
  personas: PersonaOpt[]
  sesiones: SesionOpt[]
  periodo: string
  fecha: string
  porcIps: number
  porcIva: number
}) {
  const [personaId, setPersonaId] = useState('')
  const [lineas, setLineas] = useState<{ sesionId: string; cantidad: number }[]>([{ sesionId: '', cantidad: 1 }])

  const persona = personas.find((p) => p.id === personaId)
  const porc = persona?.regimen === 'honorarios' ? porcIva : porcIps

  const bruto = useMemo(
    () =>
      lineas.reduce((suma, l) => {
        const s = sesiones.find((x) => x.id === l.sesionId)
        return suma + (s ? s.monto * (s.porc_profesional / 100) * (l.cantidad || 0) : 0)
      }, 0),
    [lineas, sesiones]
  )
  const descuento = bruto * (porc / 100)
  const neto = bruto - descuento

  const cambia = (i: number, parche: Partial<{ sesionId: string; cantidad: number }>) =>
    setLineas((prev) => prev.map((l, j) => (j === i ? { ...l, ...parche } : l)))
  const quita = (i: number) => setLineas((prev) => prev.filter((_, j) => j !== i))
  const agrega = () => setLineas((prev) => [...prev, { sesionId: '', cantidad: 1 }])

  return (
    <form action={crearAdelantoSesionesMulti} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="persona_id_multi">Profesional</Label>
          <select
            id="persona_id_multi"
            name="persona_id"
            required
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
            className={claseInput}
          >
            <option value="">Elegí...</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha_multi">Fecha</Label>
          <input id="fecha_multi" type="date" name="fecha" defaultValue={fecha} className={claseInput} />
        </div>
      </div>

      <div className="space-y-2">
        {lineas.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_110px_40px] items-end gap-2">
            <div className="space-y-1.5">
              {i === 0 ? <Label>Tipo de sesión</Label> : null}
              <select
                name="sesion_id"
                value={l.sesionId}
                onChange={(e) => cambia(i, { sesionId: e.target.value })}
                className={claseInput}
              >
                <option value="">Elegí...</option>
                {sesiones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.descripcion} · {guaranies(s.monto)} · {s.porc_profesional}%
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              {i === 0 ? <Label>Cantidad</Label> : null}
              <input
                type="number"
                name="cantidad"
                min="1"
                step="1"
                value={l.cantidad}
                onChange={(e) => cambia(i, { cantidad: Number(e.target.value) })}
                className={claseInput}
              />
            </div>
            <button
              type="button"
              onClick={() => quita(i)}
              disabled={lineas.length === 1}
              className="h-8 rounded-md border border-input text-sm text-muted-foreground disabled:opacity-40"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={agrega} className="text-sm text-primary hover:underline">
        + Agregar concepto
      </button>

      <input type="hidden" name="periodo" value={periodo} />

      <div className="flex flex-wrap gap-4 border-t border-border pt-2 text-sm">
        <span>
          Bruto: <strong className="tabular-nums">{guaranies(bruto)}</strong>
        </span>
        <span>
          Descuento ({porc}%): <strong className="tabular-nums">{guaranies(descuento)}</strong>
        </span>
        <span>
          Neto: <strong className="tabular-nums">{guaranies(neto)}</strong>
        </span>
      </div>

      <button
        type="submit"
        className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Registrar adelanto
      </button>
    </form>
  )
}
