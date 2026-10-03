import { TriangleAlert } from 'lucide-react'

/** Estado de error: qué pasó y qué hacer (sin disculpas). */
export function ErrorState({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string
  descripcion: string
  accion?: React.ReactNode
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-12 text-center"
    >
      <TriangleAlert className="size-8 text-destructive" />
      <div className="font-medium text-foreground">{titulo}</div>
      <p className="max-w-sm text-sm text-muted-foreground">{descripcion}</p>
      {accion}
    </div>
  )
}
