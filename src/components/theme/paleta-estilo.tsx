import { ESTILOS } from '@/lib/tema/estilos'
import { cn } from '@/lib/utils'

/**
 * Mini-muestra de la paleta de un estilo (para el selector de temas).
 * Los colores son DATOS del catálogo (ESTILOS), no estilos del componente.
 */
export function PaletaEstilo({ id, className }: { id: string; className?: string }) {
  const estilo = ESTILOS.find((e) => e.id === id)
  if (!estilo) return null

  const colores = [
    estilo.colores.primary,
    estilo.colores.background,
    estilo.colores.surface,
    estilo.colores.text,
  ]

  return (
    <span aria-hidden="true" className={cn('inline-flex shrink-0 items-center gap-0.5', className)}>
      {colores.map((color, i) => (
        <span
          key={i}
          className="size-3 rounded-full ring-1 ring-border ring-inset"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  )
}
