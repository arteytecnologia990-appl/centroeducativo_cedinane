import Link from 'next/link'
import { listarPersonas } from '@/features/personas/queries/personas'
import { PersonasTabla } from '@/features/personas/components/personas-tabla'

const POR_PAGINA = 10

const FILTROS = [
  { valor: '', etiqueta: 'Todos' },
  { valor: 'empleado', etiqueta: 'Empleados' },
  { valor: 'alumno', etiqueta: 'Alumnos' },
  { valor: 'paciente', etiqueta: 'Pacientes' },
  { valor: 'tutor', etiqueta: 'Tutores' },
  { valor: 'proveedor', etiqueta: 'Proveedores' },
  { valor: 'cliente', etiqueta: 'Clientes' },
]

const claseBoton =
  'inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent'
const claseBotonInactivo =
  'inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-muted-foreground opacity-50'

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rol?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  const rol = params.rol?.trim() ?? ''
  const page = Math.max(1, Number(params.page) || 1)

  const { personas, total } = await listarPersonas({ q, rol, page, porPagina: POR_PAGINA })
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  const hrefPagina = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (rol) sp.set('rol', rol)
    sp.set('page', String(p))
    return `/dashboard/personas?${sp.toString()}`
  }

  const hrefFiltro = (valor: string) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (valor) sp.set('rol', valor)
    const s = sp.toString()
    return s ? `/dashboard/personas?${s}` : '/dashboard/personas'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Personas</h1>
          <p className="text-sm text-muted-foreground tabular-nums">{total} en total</p>
        </div>
        <Link
          href="/dashboard/personas/nueva"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Nueva persona
        </Link>
      </div>

      {/* Filtros por rol (Empleados, Alumnos, Pacientes…) */}
      <div className="flex flex-wrap gap-1.5">
        {FILTROS.map((f) => {
          const activo = rol === f.valor
          return (
            <Link
              key={f.valor || 'todos'}
              href={hrefFiltro(f.valor)}
              className={
                activo
                  ? 'inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground'
                  : claseBoton
              }
            >
              {f.etiqueta}
            </Link>
          )
        })}
      </div>

      <form method="get" action="/dashboard/personas" className="max-w-sm">
        {rol ? <input type="hidden" name="rol" value={rol} /> : null}
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
            <Link href={hrefPagina(page - 1)} className={claseBoton}>
              Anterior
            </Link>
          ) : (
            <span className={claseBotonInactivo}>Anterior</span>
          )}
          {page < totalPaginas ? (
            <Link href={hrefPagina(page + 1)} className={claseBoton}>
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
