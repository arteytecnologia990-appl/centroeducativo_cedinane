import Link from 'next/link'
import { listarPersonas } from '@/features/personas/queries/personas'
import { PersonasTabla } from '@/features/personas/components/personas-tabla'

const POR_PAGINA = 10

const claseBoton =
  'inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent'
const claseBotonInactivo =
  'inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-muted-foreground opacity-50'

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  const page = Math.max(1, Number(params.page) || 1)

  const { personas, total } = await listarPersonas({ q, page, porPagina: POR_PAGINA })
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  const href = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    sp.set('page', String(p))
    return `/personas?${sp.toString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Personas</h1>
          <p className="text-sm text-muted-foreground tabular-nums">{total} en total</p>
        </div>
        <Link
          href="/personas/nueva"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Nueva persona
        </Link>
      </div>

      <form method="get" action="/personas" className="max-w-sm">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, apellido o cédula"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </form>

      <PersonasTabla personas={personas} />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground tabular-nums">
          Página {page} de {totalPaginas}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={href(page - 1)} className={claseBoton}>
              Anterior
            </Link>
          ) : (
            <span className={claseBotonInactivo}>Anterior</span>
          )}
          {page < totalPaginas ? (
            <Link href={href(page + 1)} className={claseBoton}>
              Siguiente
            </Link>
          ) : (
            <span className={claseBotonInactivo}>Siguiente</span>
          )}
        </div>
      </div>
    </div>
  )
}
