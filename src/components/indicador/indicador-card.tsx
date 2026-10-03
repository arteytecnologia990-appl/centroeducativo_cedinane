import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IndicadorCardProps = {
  titulo: string
  valor: string
  detalle?: string
  Icon?: LucideIcon
  className?: string
}

/** Tarjeta de indicador (p. ej. "Presentes ahora 18 de 24"). */
export function IndicadorCard({ titulo, valor, detalle, Icon, className }: IndicadorCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 text-card-foreground shadow-card', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{titulo}</span>
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      </div>
      <div className="mt-2 font-heading text-2xl font-semibold tabular-nums">{valor}</div>
      {detalle ? <div className="mt-1 text-xs text-muted-foreground">{detalle}</div> : null}
    </div>
  )
}
