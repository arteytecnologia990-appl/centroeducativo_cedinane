'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function FiltroAsistencia({
  modoInicial,
  diaInicial,
  mesInicial,
  desdeInicial,
  hastaInicial,
}: {
  modoInicial: string
  diaInicial: string
  mesInicial: string
  desdeInicial: string
  hastaInicial: string
}) {
  const [modo, setModo] = useState(modoInicial)

  return (
    <form method="get" action="/dashboard/asistencia" className="flex flex-wrap items-end gap-2">
      <div className="space-y-1.5">
        <Label htmlFor="modo">Ver</Label>
        <select id="modo" name="modo" value={modo} onChange={(e) => setModo(e.target.value)} className={claseSelect}>
          <option value="dia">Por día</option>
          <option value="mes">Por mes</option>
          <option value="rango">Por rango</option>
        </select>
      </div>

      {modo === 'dia' ? (
        <div className="space-y-1.5">
          <Label htmlFor="dia">Día</Label>
          <Input id="dia" type="date" name="dia" defaultValue={diaInicial} className="h-8" />
        </div>
      ) : null}

      {modo === 'mes' ? (
        <div className="space-y-1.5">
          <Label htmlFor="mes">Mes</Label>
          <Input id="mes" type="month" name="mes" defaultValue={mesInicial} className="h-8" />
        </div>
      ) : null}

      {modo === 'rango' ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="desde">Desde</Label>
            <Input id="desde" type="date" name="desde" defaultValue={desdeInicial} className="h-8" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hasta">Hasta</Label>
            <Input id="hasta" type="date" name="hasta" defaultValue={hastaInicial} className="h-8" />
          </div>
        </>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ver
      </button>
    </form>
  )
}
