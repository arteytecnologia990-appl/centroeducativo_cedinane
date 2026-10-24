import type { ReactNode } from 'react'

export function SeccionColapsable({
  titulo,
  descripcion,
  abierto,
  children,
}: {
  titulo: string
  descripcion?: string
  abierto?: boolean
  children: ReactNode
}) {
  return (
    <details open={abierto} className="group rounded-lg border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium text-foreground">
          {titulo}
          {descripcion ? (
            <span className="ml-2 font-normal text-muted-foreground">{descripcion}</span>
          ) : null}
        </span>
        <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="border-t border-border p-4">{children}</div>
    </details>
  )
}
