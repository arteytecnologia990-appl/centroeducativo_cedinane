import { Fragment } from 'react'
import { cn } from '@/lib/utils'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00']

// bloques ocupados (demo): clave "dia-hora"
const OCUPADOS = new Set(['0-0', '0-1', '1-2', '1-3', '2-0', '3-1', '4-4'])

/** Grilla semanal de horarios por hora (bloques seleccionables, por sede). */
export function GrillaSemanal() {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[560px] grid-cols-[3.5rem_repeat(5,1fr)] gap-1">
        <div />
        {DIAS.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {HORAS.map((h, hi) => (
          <Fragment key={h}>
            <div className="py-1 pr-2 text-right text-xs text-muted-foreground tabular-nums">{h}</div>
            {DIAS.map((_, di) => {
              const ocupado = OCUPADOS.has(`${di}-${hi}`)
              return (
                <div
                  key={di}
                  className={cn(
                    'h-9 rounded-md border transition-colors',
                    ocupado
                      ? 'border-primary/40 bg-primary/15'
                      : 'border-border bg-muted/40 hover:bg-accent/60'
                  )}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
