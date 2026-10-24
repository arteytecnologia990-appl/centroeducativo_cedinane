import { ImportarDtesForm } from '@/features/facturacion/components/importar-dtes-form'
import { ImportarXmlForm } from '@/features/facturacion/components/importar-xml-form'
import { Volver } from '@/components/layout/volver'
import { SeccionColapsable } from '@/components/layout/seccion-colapsable'

export default function ImportarDtesPage() {
  return (
    <div className="space-y-6">
      <Volver href="/dashboard/facturacion" label="Facturación" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Importar comprobantes</h1>
        <p className="text-sm text-muted-foreground">
          Se valida por <strong>CDC</strong>: si ya existe, se omite y te avisa. Recomendado: <strong>XML</strong>{' '}
          (trae nombre, RUC, IVA, timbrado).
        </p>
      </div>

      <SeccionColapsable titulo="Importar XML (uno o varios)" abierto>
        <ImportarXmlForm />
      </SeccionColapsable>

      <SeccionColapsable titulo="Importar Excel (DetalleComprobantesRegistrados)">
        <ImportarDtesForm />
      </SeccionColapsable>
    </div>
  )
}
