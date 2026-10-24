import { listarBancos } from '@/features/bancos/queries'
import { crearBanco, crearCuenta, eliminarBanco, eliminarCuenta } from '@/features/bancos/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const claseInput =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

const tipoTexto: Record<string, string> = {
  caja_ahorro: 'Caja de ahorro',
  cuenta_corriente: 'Cuenta corriente',
}

const MONEDAS = [
  { valor: 'PYG', etiqueta: 'Guaraníes (PYG)' },
  { valor: 'USD', etiqueta: 'Dólares (USD)' },
  { valor: 'EUR', etiqueta: 'Euros (EUR)' },
  { valor: 'BRL', etiqueta: 'Reales (BRL)' },
  { valor: 'ARS', etiqueta: 'Pesos arg. (ARS)' },
]

export default async function BancosPage() {
  const bancos = await listarBancos()

  return (
    <div className="space-y-8">
      <Volver href="/dashboard" label="Inicio" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Bancos</h1>
        <p className="text-sm text-muted-foreground">
          Cargá los bancos y sus cuentas. Se usan al registrar un cobro por transferencia.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Nuevo banco</h2>
        <form action={crearBanco} className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre del banco</Label>
            <Input id="nombre" name="nombre" required placeholder="Ej.: Banco Itaú" />
          </div>
          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agregar banco
          </button>
        </form>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banco</TableHead>
                <TableHead>Cuentas</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bancos.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.cuentas.length === 0 ? '—' : b.cuentas.map((c) => c.numero).join(' · ')}
                  </TableCell>
                  <TableCell>
                    <form action={eliminarBanco}>
                      <input type="hidden" name="id" value={b.id} />
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
              {bancos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-16 text-center text-sm text-muted-foreground">
                    Sin bancos.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Nueva cuenta</h2>
        <form action={crearCuenta} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-6">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="banco_id">Banco</Label>
            <select id="banco_id" name="banco_id" required className={claseInput}>
              <option value="">Elegí...</option>
              {bancos.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="numero">N° de cuenta</Label>
            <Input id="numero" name="numero" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tipo">Tipo</Label>
            <select id="tipo" name="tipo" className={claseInput}>
              <option value="caja_ahorro">Caja de ahorro</option>
              <option value="cuenta_corriente">Cuenta corriente</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="moneda">Moneda</Label>
            <select id="moneda" name="moneda" defaultValue="PYG" className={claseInput}>
              {MONEDAS.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="titular">Titular</Label>
            <Input id="titular" name="titular" placeholder="Opcional" />
          </div>
          <div className="sm:col-span-6">
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Agregar cuenta
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banco</TableHead>
                <TableHead>N° cuenta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead>Titular</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bancos.flatMap((b) =>
                b.cuentas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{b.nombre}</TableCell>
                    <TableCell className="tabular-nums">{c.numero}</TableCell>
                    <TableCell className="text-muted-foreground">{tipoTexto[c.tipo] ?? c.tipo}</TableCell>
                    <TableCell className="text-muted-foreground">{c.moneda}</TableCell>
                    <TableCell className="text-muted-foreground">{c.titular ?? '—'}</TableCell>
                    <TableCell>
                      <form action={eliminarCuenta}>
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
                ))
              )}
              {bancos.every((b) => b.cuentas.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-16 text-center text-sm text-muted-foreground">
                    Sin cuentas.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
