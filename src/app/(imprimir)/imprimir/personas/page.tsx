import Link from 'next/link'
import { listarPersonasReporte } from '@/features/personas/queries/personas'
import { ETIQUETA_ROL, type RolNegocio } from '@/features/personas/schemas/persona'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const TITULOS: Record<string, string> = {
  '': 'Listado de Personas',
  empleado: 'Listado de Empleados',
  profesional: 'Listado de Profesionales',
  alumno: 'Listado de Alumnos',
  usuario: 'Listado de Usuarios',
  participante: 'Listado de Participantes',
  tutor: 'Listado de Tutores',
  proveedor: 'Listado de Proveedores',
  cliente: 'Listado de Clientes',
}

export default async function ImprimirPersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>
}) {
  const { rol } = await searchParams
  const filtro = rol ?? ''

  const personas = await listarPersonasReporte({ rol: filtro || undefined })
  const hoy = new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-6 text-black">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/personas" className="text-sm text-primary hover:underline">
          ← Volver a Personas
        </Link>
        <BotonImprimir />
      </div>

      <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide">
        {TITULOS[filtro] ?? 'Listado de Personas'}
      </h1>
      <p className="mb-4 text-center text-xs">
        Total: {personas.length} · Generado el {hoy}
      </p>

      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {['N°', 'APELLIDOS Y NOMBRES', 'C.I.', 'ROL', 'CARGO', 'TURNO', 'TELÉFONO', 'CORREO'].map((h, i) => (
              <th
                key={`${h}-${i}`}
                className="border border-black px-1 py-1 text-left font-bold uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personas.map((p, i) => (
            <tr key={p.id} className={i % 2 === 1 ? 'bg-neutral-50' : undefined}>
              <td className="border border-black px-1 py-[3px] text-center tabular-nums">{i + 1}</td>
              <td className="border border-black px-1 py-[3px]">
                {p.apellidos}, {p.nombres}
              </td>
              <td className="border border-black px-1 py-[3px] tabular-nums">{p.ci ?? '—'}</td>
              <td className="border border-black px-1 py-[3px]">
                {(p.persona_roles ?? [])
                  .map((r) => ETIQUETA_ROL[r.rol_negocio as RolNegocio] ?? r.rol_negocio)
                  .join(', ') || '—'}
              </td>
              <td className="border border-black px-1 py-[3px]">{p.personal?.cargo ?? '—'}</td>
              <td className="border border-black px-1 py-[3px]">{p.personal?.turno ?? '—'}</td>
              <td className="border border-black px-1 py-[3px]">{p.telefono ?? '—'}</td>
              <td className="border border-black px-1 py-[3px]">{p.email ?? '—'}</td>
            </tr>
          ))}
          {personas.length === 0 ? (
            <tr>
              <td colSpan={8} className="border border-black px-2 py-6 text-center">
                Sin personas para este filtro.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
