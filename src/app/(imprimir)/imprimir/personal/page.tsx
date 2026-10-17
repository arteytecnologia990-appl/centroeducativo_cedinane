import Link from 'next/link'
import { listarPersonasReporte } from '@/features/personas/queries/personas'
import { BotonImprimir } from '@/components/asistencia/boton-imprimir'

const COLUMNAS = [
  'N°',
  'Nombre y Apellidos',
  'Número de C.I',
  'Fecha de Nacimiento',
  'Dirección',
  'Teléfono',
  'Email',
  'Formación académica',
  'Cargo',
  'Experiencia laboral en cargo',
  'Antigüedad en la Institución',
  'Turno',
  'Sector',
  'Programa',
  'CI',
  'CV',
  'CD',
  'Registro ó Matrícula',
]

function texto(v: string | null | undefined): string {
  return v && v.trim() !== '' ? v : '—'
}

function fecha(v: string | null): string {
  if (!v) return '—'
  const d = new Date(`${v}T00:00:00`)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

function sector(v: string | null | undefined): string {
  if (v === 'privado') return 'Privado'
  if (v === 'publico') return 'Público'
  return '—'
}

export default async function ImprimirPersonalPage() {
  const personas = await listarPersonasReporte({ rol: 'empleado' })

  return (
    <div className="bg-white p-4 text-black">
      <style>{`@media print { @page { size: A4 landscape; margin: 8mm; } }`}</style>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/personas?rol=empleado" className="text-sm text-primary hover:underline">
          ← Volver a Personas
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/api/reportes/personal"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Descargar Excel
          </a>
          <BotonImprimir />
        </div>
      </div>

      <h1 className="text-center text-base font-bold uppercase tracking-wide">
        Datos del Personal — Plantel
      </h1>
      <p className="mb-3 text-center text-[10px]">Total: {personas.length}</p>

      <table className="w-full border-collapse text-[8px]">
        <thead>
          <tr>
            {COLUMNAS.map((h, i) => (
              <th key={`${h}-${i}`} className="border border-black px-1 py-1 text-center font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personas.map((p, i) => (
            <tr key={p.id} className={i % 2 === 1 ? 'bg-neutral-50' : undefined}>
              <td className="border border-black px-1 py-[2px] text-center tabular-nums">{i + 1}</td>
              <td className="border border-black px-1 py-[2px]">
                {p.apellidos}, {p.nombres}
              </td>
              <td className="border border-black px-1 py-[2px] text-center tabular-nums">{p.ci ?? '—'}</td>
              <td className="border border-black px-1 py-[2px] text-center tabular-nums">
                {fecha(p.fecha_nacimiento)}
              </td>
              <td className="border border-black px-1 py-[2px]">{texto(p.direccion)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.telefono)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.email)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.formacion_academica)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.cargo)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.experiencia_cargo)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.antiguedad_institucion)}</td>
              <td className="border border-black px-1 py-[2px] text-center">{texto(p.personal?.turno)}</td>
              <td className="border border-black px-1 py-[2px] text-center">{sector(p.personal?.sector)}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.programa)}</td>
              <td className="border border-black px-1 py-[2px] text-center">{p.personal?.tiene_ci ? 'X' : ''}</td>
              <td className="border border-black px-1 py-[2px] text-center">{p.personal?.tiene_cv ? 'X' : ''}</td>
              <td className="border border-black px-1 py-[2px] text-center">{p.personal?.tiene_cd ? 'X' : ''}</td>
              <td className="border border-black px-1 py-[2px]">{texto(p.personal?.registro_profesional)}</td>
            </tr>
          ))}
          {personas.length === 0 ? (
            <tr>
              <td colSpan={18} className="border border-black px-2 py-6 text-center">
                No hay empleados cargados.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
