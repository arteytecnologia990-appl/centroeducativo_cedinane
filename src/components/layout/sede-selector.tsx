'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SEDES = [
  { id: 'SEDE-1', nombre: 'Sede 1' },
  { id: 'SEDE-2', nombre: 'Sede 2' },
] as const

/** Selector de sede (contexto de trabajo). En producción leerá las sedes de la BD. */
export function SedeSelector() {
  const [sede, setSede] = useState<string>('SEDE-1')

  return (
    <Select value={sede} onValueChange={(v) => setSede(v as string)}>
      <SelectTrigger aria-label="Seleccionar sede" className="gap-1.5">
        <Building2 className="size-4 text-muted-foreground" />
        <SelectValue>
          {(value: string | null) => SEDES.find((s) => s.id === value)?.nombre ?? 'Sede'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SEDES.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
