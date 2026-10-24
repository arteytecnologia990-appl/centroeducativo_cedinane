import { listarClientesConFacturas, listarCompromisos } from '@/features/compromisos/queries'
import { eliminarCompromiso } from '@/features/compromisos/actions'
import { CompromisoForm } from '@/features/compromisos/components/compromiso-form'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function CompromisosPage() {
  const [compromisos, clientes] = await Promise.all([listarCompromisos(), listarClientesConFacturas()])

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Compromisos</h1>
        <p className="text-sm text-muted-foreground">
          Ingresos por servicio <strong>antes</strong> de tener la factura. Cuando llega el XML, se engancha la
          factura del cliente.
        </p>
      </div>

      <CompromisoForm clientes={clientes} />

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Terapia</TableHead>
              <TableHead>Profesional</TableHead>
              <TableHead className="text-right">Precio Unitario</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Met. Pago</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {compromisos.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.usuario}</TableCell>
                <TableCell>{c.terapia}</TableCell>
                <TableCell className="text-muted-foreground">{c.profesional ?? '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(c.precio_unitario)}</TableCell>
                <TableCell className="text-right tabular-nums">{c.cantidad}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{guaranies(c.total)}</TableCell>
                <TableCell className="capitalize text-muted-foreground">{c.met_pago ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.factura_cdc ? `${c.factura_cdc.slice(0, 12)}…` : 'Pendiente'}
                </TableCell>
                <TableCell>
                  <form action={eliminarCompromiso}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Eliminar
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {compromisos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-20 text-center text-sm text-muted-foreground">
                  Sin compromisos cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
