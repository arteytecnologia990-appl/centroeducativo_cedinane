import { CircleCheck, CircleDashed, Clock, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type EstadoAsistencia = 'a_tiempo' | 'atraso' | 'turno_completo' | 'sin_marcar'

const CONFIG: Record<EstadoAsistencia, { label: string; Icon: LucideIcon; className: string }> = {
  a_tiempo: { label: 'A tiempo', Icon: CircleCheck, className: 'bg-success-soft text-success' },
  atraso: { label: 'Atraso', Icon: Clock, className: 'bg-warning-soft text-warning' },
  turno_completo: { label: 'Turno completo', Icon: Timer, className: 'bg-accent text-accent-foreground' },
  sin_marcar: { label: 'Sin marcar', Icon: CircleDashed, className: 'bg-muted text-muted-foreground' },
}

/** Badge de estado con icono + texto (nunca solo color). */
export function StatusBadge({ estado, minutos }: { estado: EstadoAsistencia; minutos?: number }) {
  const cfg = CONFIG[estado]
  const label = estado === 'atraso' && minutos != null ? `Atraso de ${minutos} min` : cfg.label
  const Icon = cfg.Icon
  return (
    <Badge variant="outline" className={cn('gap-1 border-transparent', cfg.className)}>
      <Icon />
      {label}
    </Badge>
  )
}
