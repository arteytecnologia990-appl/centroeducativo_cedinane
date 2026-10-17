import { PersonaForm } from '@/features/personas/components/persona-form'

export default function NuevaPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Nueva persona</h1>
        <p className="text-sm text-muted-foreground">
          Cargá los datos básicos. Después podés agregar roles y vínculos.
        </p>
      </div>
      <PersonaForm />
    </div>
  )
}
