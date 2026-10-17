import { PersonaForm } from '@/features/personas/components/persona-form'
import { Volver } from '@/components/layout/volver'

export default async function NuevaPersonaPage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>
}) {
  const { rol } = await searchParams

  return (
    <div className="space-y-6">
      <Volver href="/dashboard/personas" label="Personas" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Nueva persona</h1>
        <p className="text-sm text-muted-foreground">
          Cargá los datos básicos. Elegí el rol (empleado, alumno, paciente…) y después podés agregar vínculos.
        </p>
      </div>
      <PersonaForm rolInicial={rol} />
    </div>
  )
}
