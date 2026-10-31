import { listarCargos } from '@/features/cargos/cargos'
import { CargosKanban } from '@/features/cargos/components/cargos-kanban'
import { listarProgramas } from '@/features/programas/queries'
import { Volver } from '@/components/layout/volver'

export default async function CargosPage() {
  const [cargos, programas] = await Promise.all([listarCargos(), listarProgramas()])

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Cargos por programa</h1>
        <p className="text-sm text-muted-foreground">
          Cada cargo pertenece a un programa. Usá el menú <span className="font-medium">⋮</span> para mover, editar o
          eliminar.
        </p>
      </div>

      <CargosKanban cargos={cargos} programas={programas.map((p) => ({ id: p.id, nombre: p.nombre }))} />
    </div>
  )
}
