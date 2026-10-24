import { ImportarDtesForm } from '@/features/facturacion/components/importar-dtes-form'
import { Volver } from '@/components/layout/volver'

export default function ImportarDtesPage() {
  return (
    <div className="space-y-6">
      <Volver href="/dashboard/facturacion" label="Facturación" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Importar DTEs</h1>
        <p className="text-sm text-muted-foreground">
          Subí el Excel de DTEs emitidos. Se valida por <strong>CDC</strong>: si ya existe, se omite y te avisa.
        </p>
      </div>

      <ImportarDtesForm />
    </div>
  )
}
