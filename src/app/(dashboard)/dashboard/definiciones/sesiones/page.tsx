import Link from 'next/link'
import { listarSesiones } from '@/features/definiciones/queries'
import { crearSesion, eliminarSesion } from '@/features/definiciones/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const guaranies = (n: number) => new Intl.NumberFormat('es-PY').format(n)

export default async function SesionesPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>
}) {
  const params = await searchParams
  const sesiones = await listarSesiones()
  const editando = params.editar ? sesiones.find((s) => s.id === params.editar) : null

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Sesiones</h1>
        <p className="text-sm text-muted-foreground">
          Parámetros de cada tipo de sesión. De acá sale el pago semanal al profesional (como adelanto de salario).
        </p>
      </div>

      <form
        key={editando?.updated_at ?? 'nuevo'}
        action={crearSesion}
        className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6"
      >
        {editando ? <input type="hidden" name="id" value={editando.id} /> : null}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Input
            id="descripcion"
            name="descripcion"
            required
            defaultValue={editando?.descripcion ?? ''}
            placeholder="Ej.: Sesión de 45 minutos"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="porc_profesional">% Profesional</Label>
          <Input
            id="porc_profesional"
            name="porc_profesional"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={
              editando ? String(editando.porc_profesional) : '0'
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="porc_instituto">% Instituto</Label>
          <Input
            id="porc_instituto"
            name="porc_instituto"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={editando ? String(editando.porc_instituto) : '0'}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monto">Monto (Gs)</Label>
          <Input
            id="monto"
            name="monto"
            type="number"
            min="0"
            step="1"
            defaultValue={editando ? String(editando.monto) : '0'}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tiempo_sesion">Tiempo (min)</Label>
          <Input
            id="tiempo_sesion"
            name="tiempo_sesion"
            type="number"
            min="0"
            step="1"
            defaultValue={editando ? String(editando.tiempo_sesion) : '0'}
          />
        </div>
        <label className="flex items-end gap-2 pb-1 text-sm text-foreground">
          <input type="checkbox" name="activo" defaultChecked={editando?.activo ?? true} className="size-4" />
          Activo
        </label>
        <div className="sm:col-span-6">
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {editando ? 'Guardar cambios' : 'Agregar sesión'}
          </button>
          {editando ? (
            <Link href="/dashboard/definiciones/sesiones" className="ml-2 text-sm text-muted-foreground hover:underline">
              Cancelar
            </Link>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">% Prof.</TableHead>
              <TableHead className="text-right">% Instituto</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Tiempo</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="w-16" />
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sesiones.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.descripcion}</TableCell>
                <TableCell className="text-right tabular-nums">{Number(s.porc_profesional)}%</TableCell>
                <TableCell className="text-right tabular-nums">{Number(s.porc_instituto)}%</TableCell>
                <TableCell className="text-right tabular-nums">{guaranies(Number(s.monto))}</TableCell>
                <TableCell className="text-right tabular-nums">{s.tiempo_sesion} min</TableCell>
                <TableCell>{s.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/definiciones/sesiones?editar=${s.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={eliminarSesion}>
                    <input type="hidden" name="id" value={s.id} />
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
            {sesiones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-16 text-center text-sm text-muted-foreground">
                  Sin sesiones definidas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
