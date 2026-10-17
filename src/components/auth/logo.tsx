import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Marca del proyecto: marcador + nombre. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-5" />
      </span>
      <span className="font-heading text-base font-semibold text-foreground">Centro Educativo</span>
    </div>
  )
}
