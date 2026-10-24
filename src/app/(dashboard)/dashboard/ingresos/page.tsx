import { listarClientesConFacturas, listarIngresos } from '@/features/ingresos/queries'
import { listarSesiones } from '@/features/definiciones/queries'
import { listarEmpleadosSalario } from '@/features/salarios/queries'
import Link from 'next/link'
import { eliminarIngreso } from '@/features/ingresos/actions'
import { IngresoForm } from '@/features/ingresos/components/ingreso-form'
import { Volver } from '@/components/layout/volver'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function IngresosPage() {
  const [ingresos, clientes, sesiones, empleados] = await Promise.all([
    listarIngresos(),
    listarClientesConFacturas(),
    listarSesiones(),
    listarEmpleadosSalario(),
  ])
  const profesionales = empleados.map((e) => ({ id: e.id, nombre: `${e.apellidos}, ${e.nombres}` }))
  const total = ingresos.reduce((s, i) => s + i.total, 0)

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Ingresos</h1>
        <p className="text-sm text-muted-foreground">
          Servicios cobrados <strong>antes</strong> de la factura XML. Cuando llega el XML, se engancha la factura
          del cliente. Total registrado: <strong>{guaranies(total)}</strong>
        </p>
      </div>

      <IngresoForm
        clientes={clientes}
        sesiones={sesiones.map((s) => ({ id: s.id, descripcion: s.descripcion, monto: Number(s.monto) }))}
        profesionales={profesionales}
      />

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
            {ingresos.map((c) => (
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
                  <Link href={`/dashboard/ingresos/${c.id}`} className="mr-2 text-sm text-primary hover:underline">
                    Detalle
                  </Link>
                  <form action={eliminarIngreso} className="inline">
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
            {ingresos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-20 text-center text-sm text-muted-foreground">
                  Sin ingresos cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
