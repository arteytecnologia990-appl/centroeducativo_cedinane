import Image from 'next/image'
import Link from 'next/link'
import { listarProgramas } from '@/features/programas/queries'
import { crearPrograma, eliminarPrograma } from '@/features/programas/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const LOGOS = [
  { valor: '/logos/cedinane.png', etiqueta: 'ASO CEDINANE' },
  { valor: '/logos/incluyeme.jpg', etiqueta: 'Inclúyeme' },
  { valor: '/logos/aso.jpg', etiqueta: 'ASO' },
]

export default async function ProgramasPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>
}) {
  const params = await searchParams
  const programas = await listarProgramas()
  const editando = params.editar ? programas.find((p) => p.id === params.editar) : null

  return (
    <div className="space-y-6">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Programas</h1>
        <p className="text-sm text-muted-foreground">
          Cada programa (proyecto) tiene su nombre, caja de ahorro y logo. El logo se usa en los recibos.
        </p>
      </div>

      <form action={crearPrograma} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
        {editando ? <input type="hidden" name="id" value={editando.id} /> : null}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required defaultValue={editando?.nombre ?? ''} placeholder="Ej.: Inclúyeme" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="caja_ahorro">Caja de ahorro</Label>
          <Input id="caja_ahorro" name="caja_ahorro" defaultValue={editando?.caja_ahorro ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="logo">Logo</Label>
          <select id="logo" name="logo" className={claseInput} defaultValue={editando?.logo ?? LOGOS[0].valor}>
            {LOGOS.map((l) => (
              <option key={l.valor} value={l.valor}>
                {l.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ruc">RUC</Label>
          <Input id="ruc" name="ruc" defaultValue={editando?.ruc ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rtp">RTP MTESS</Label>
          <Input id="rtp" name="rtp" defaultValue={editando?.rtp ?? ''} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="resolucion">Resolución</Label>
          <Input id="resolucion" name="resolucion" defaultValue={editando?.resolucion ?? ''} />
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
            {editando ? 'Guardar cambios' : 'Agregar programa'}
          </button>
          {editando ? (
            <Link href="/dashboard/programas" className="ml-2 text-sm text-muted-foreground hover:underline">
              Cancelar
            </Link>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Caja de ahorro</TableHead>
              <TableHead>RUC / RTP</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="w-16" />
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {programas.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Image src={p.logo} alt={p.nombre} width={56} height={48} className="h-9 w-auto" />
                </TableCell>
                <TableCell className="font-medium">{p.nombre}</TableCell>
                <TableCell className="tabular-nums">{p.caja_ahorro ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {p.ruc ?? '—'} / {p.rtp ?? '—'}
                </TableCell>
                <TableCell>{p.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/programas?editar=${p.id}`} className="text-sm text-primary hover:underline">
                    Editar
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={eliminarPrograma}>
                    <input type="hidden" name="id" value={p.id} />
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
            {programas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-16 text-center text-sm text-muted-foreground">
                  Sin programas cargados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
