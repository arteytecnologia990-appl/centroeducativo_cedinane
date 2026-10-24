import { notFound } from 'next/navigation'
import { obtenerAdelanto } from '@/features/salarios/queries'
import { actualizarAdelanto } from '@/features/salarios/actions'
import { Volver } from '@/components/layout/volver'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function EditarAdelantoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ad = await obtenerAdelanto(id)
  if (!ad) notFound()

  const persona = ad.personas as { nombres: string; apellidos: string } | null
  const items = (ad.adelanto_items ?? []) as { descripcion: string; cantidad: number }[]

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Volver href="/dashboard/salarios/adelantos" label="Adelantos" />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Editar recibo A-{ad.numero}</h1>
        <p className="text-sm text-muted-foreground">
          {persona ? `${persona.apellidos}, ${persona.nombres}` : '—'}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Conceptos del recibo:</p>
          <ul className="mt-1 list-inside list-disc">
            {items.map((it, i) => (
              <li key={i}>
                {Number(it.cantidad)} × {it.descripcion}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            El monto es el neto ya calculado. Si cambia el monto, los conceptos quedan como referencia.
          </p>
        </div>
      ) : null}

      <form action={actualizarAdelanto} className="space-y-3">
        <input type="hidden" name="id" value={ad.id} />
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" name="fecha" type="date" defaultValue={ad.fecha} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monto">Monto neto (Gs)</Label>
          <Input id="monto" name="monto" type="number" min="1" step="1" defaultValue={String(ad.monto)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="concepto">Concepto</Label>
          <Input id="concepto" name="concepto" defaultValue={ad.concepto} />
        </div>
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
