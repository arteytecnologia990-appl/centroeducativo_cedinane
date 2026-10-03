import { Inbox } from 'lucide-react'

/** Estado vacío: qué pasa y qué hacer (sin disculpas). */
export function EmptyState({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string
  descripcion: string
  accion?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <div className="font-medium text-foreground">{titulo}</div>
      <p className="max-w-sm text-sm text-muted-foreground">{descripcion}</p>
      {accion}
    </div>
  )
}
