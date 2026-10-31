'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { actualizarPersona, crearPersona } from '@/features/personas/actions/persona'
import {
  ETIQUETA_ROL,
  FORMACION_ACADEMICA,
  ROLES_NEGOCIO,
  SECTORES,
  TURNOS,
} from '@/features/personas/schemas/persona'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PersonalEditable = {
  cargo?: string | null
  programa?: string | null
  formacion_academica?: string | null
  turno?: string | null
  sector?: string | null
  experiencia_cargo?: string | null
  antiguedad_institucion?: string | null
  fecha_ingreso?: string | null
  registro_profesional?: string | null
  logo?: string | null
  sueldo?: number | null
  modalidad_salarial?: string | null
  jornada_tipo?: string | null
  regimen?: string | null
  caja_ahorro?: string | null
  programa_id?: string | null
  superior_id?: string | null
  tiene_ci?: boolean | null
  tiene_cv?: boolean | null
  tiene_cd?: boolean | null
}

type PersonaEditable = {
  id?: string
  nombres?: string | null
  apellidos?: string | null
  ci?: string | null
  fecha_nacimiento?: string | null
  sexo?: string | null
  email?: string | null
  telefono?: string | null
  direccion?: string | null
  observaciones?: string | null
  personal?: PersonalEditable | null
  alumnos?: {
    nacionalidad?: string | null
    turno?: string | null
    rue?: boolean | null
    beca?: number | null
    presupuesto_ingreso?: number | null
    matricula?: number | null
  } | null
  persona_roles?: { rol_negocio: string }[] | null
  persona_programas?: { programa_id: string }[] | null
}

const claseSelect =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

/** Edad en años y meses desde una fecha de nacimiento (YYYY-MM-DD). */
function calcularEdad(fecha: string): string {
  if (!fecha) return '—'
  const nace = new Date(`${fecha}T00:00:00`)
  if (Number.isNaN(nace.getTime())) return '—'

  const hoy = new Date()
  let anios = hoy.getFullYear() - nace.getFullYear()
  let meses = hoy.getMonth() - nace.getMonth()
  if (hoy.getDate() < nace.getDate()) meses -= 1
  if (meses < 0) {
    anios -= 1
    meses += 12
  }
  if (anios < 0) return '—'
  if (anios === 0) {
    if (meses === 0) return 'Menos de 1 mes'
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  }
  return `${anios} ${anios === 1 ? 'año' : 'años'}${meses > 0 ? `, ${meses} ${meses === 1 ? 'mes' : 'meses'}` : ''}`
}

/** Antigüedad en años y meses desde una fecha (YYYY-MM-DD). */
function calcularAntiguedad(fecha: string): string {
  if (!fecha) return '—'
  const desde = new Date(`${fecha}T00:00:00`)
  if (Number.isNaN(desde.getTime())) return '—'

  const hoy = new Date()
  let anios = hoy.getFullYear() - desde.getFullYear()
  let meses = hoy.getMonth() - desde.getMonth()
  if (hoy.getDate() < desde.getDate()) meses -= 1
  if (meses < 0) {
    anios -= 1
    meses += 12
  }
  if (anios < 0) return '—'
  if (anios === 0 && meses === 0) return 'Menos de 1 mes'

  const partes: string[] = []
  if (anios > 0) partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`)
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`)
  return partes.join(', ')
}

export function PersonaForm({
  persona,
  rolInicial,
  programas,
  empleados,
  cargos,
}: {
  persona?: PersonaEditable
  rolInicial?: string
  programas?: { id: string; nombre: string }[]
  empleados?: { id: string; nombre: string }[]
  cargos?: { id: string; nombre: string }[]
}) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const esEdicion = Boolean(persona?.id)
  const p = persona?.personal ?? null
  const al = persona?.alumnos ?? null
  const [fechaIngreso, setFechaIngreso] = useState(p?.fecha_ingreso ?? '')
  const antiguedad = calcularAntiguedad(fechaIngreso)
  const [fechaNacimiento, setFechaNacimiento] = useState(persona?.fecha_nacimiento ?? '')
  const edad = calcularEdad(fechaNacimiento)
  const [rolSeleccionado, setRolSeleccionado] = useState(rolInicial ?? '')

  // Los datos laborales solo aplican a personal (empleado/profesional).
  const rolesActuales = (persona?.persona_roles ?? []).map((r) => r.rol_negocio)
  const esPersonal =
    rolesActuales.includes('empleado') ||
    rolesActuales.includes('profesional') ||
    rolSeleccionado === 'empleado' ||
    rolSeleccionado === 'profesional'

  const esAlumno = rolesActuales.includes('alumno') || rolSeleccionado === 'alumno'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = esEdicion ? await actualizarPersona(formData) : await crearPersona(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4" noValidate>
      {esEdicion ? <input type="hidden" name="id" value={persona!.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nombres">Nombres *</Label>
          <Input id="nombres" name="nombres" defaultValue={persona?.nombres ?? ''} required autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apellidos">Apellidos *</Label>
          <Input id="apellidos" name="apellidos" defaultValue={persona?.apellidos ?? ''} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ci">Cédula</Label>
          <Input id="ci" name="ci" inputMode="numeric" defaultValue={persona?.ci ?? ''} placeholder="Sin puntos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
          <Input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Edad: {edad}</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sexo">Sexo</Label>
          <select id="sexo" name="sexo" defaultValue={persona?.sexo ?? ''} className={claseSelect}>
            <option value="">Sin especificar</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
            <option value="X">No binario</option>
          </select>
        </div>
        {!esEdicion ? (
          <div className="space-y-1.5">
            <Label htmlFor="rol_negocio">Rol</Label>
            <select
              id="rol_negocio"
              name="rol_negocio"
              value={rolSeleccionado}
              onChange={(e) => setRolSeleccionado(e.target.value)}
              className={claseSelect}
            >
              <option value="">Sin rol</option>
              {ROLES_NEGOCIO.map((r) => (
                <option key={r} value={r}>
                  {ETIQUETA_ROL[r]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" defaultValue={persona?.email ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={persona?.telefono ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pin">PIN de kiosco</Label>
          <Input id="pin" name="pin" inputMode="numeric" placeholder="4-6 dígitos (vacío = no cambiar)" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="direccion">Dirección</Label>
        <Input id="direccion" name="direccion" defaultValue={persona?.direccion ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea id="observaciones" name="observaciones" rows={3} defaultValue={persona?.observaciones ?? ''} />
      </div>

      <div className="space-y-1.5">
        <Label>Programa(s)</Label>
        <div className="flex flex-wrap gap-4 rounded-lg border border-border p-3">
          {(programas ?? []).map((pr) => (
            <label key={pr.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="programa_ids"
                value={pr.id}
                defaultChecked={(persona?.persona_programas ?? []).some((x) => x.programa_id === pr.id)}
                className="size-4 rounded border-input accent-primary"
              />
              {pr.nombre}
            </label>
          ))}
          {(programas ?? []).length === 0 ? (
            <span className="text-sm text-muted-foreground">Sin programas cargados.</span>
          ) : null}
        </div>
      </div>

      {esPersonal ? (
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-medium text-foreground">Datos laborales</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cargo">Cargo</Label>
            <select id="cargo" name="cargo" defaultValue={p?.cargo ?? ''} className={claseSelect}>
              <option value="">—</option>
              {(cargos ?? []).map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="formacion_academica">Formación académica</Label>
            <select
              id="formacion_academica"
              name="formacion_academica"
              defaultValue={p?.formacion_academica ?? ''}
              className={claseSelect}
            >
              <option value="">Sin especificar</option>
              {FORMACION_ACADEMICA.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turno">Turno</Label>
            <select id="turno" name="turno" defaultValue={p?.turno ?? ''} className={claseSelect}>
              <option value="">Sin especificar</option>
              {TURNOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <select id="sector" name="sector" defaultValue={p?.sector ?? ''} className={claseSelect}>
              <option value="">Sin especificar</option>
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s === 'privado' ? 'Privado' : 'Público'}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experiencia_cargo">Experiencia en cargo</Label>
            <Input id="experiencia_cargo" name="experiencia_cargo" defaultValue={p?.experiencia_cargo ?? ''} placeholder="Ej.: 5 años" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha_ingreso">Fecha de ingreso</Label>
            <Input
              id="fecha_ingreso"
              name="fecha_ingreso"
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sueldo">Sueldo mensual</Label>
            <Input
              id="sueldo"
              name="sueldo"
              type="number"
              min="0"
              step="1"
              defaultValue={p?.sueldo != null ? String(p.sueldo) : ''}
              placeholder="Ej.: 3.000.000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="modalidad_salarial">Modalidad salarial</Label>
            <select
              id="modalidad_salarial"
              name="modalidad_salarial"
              defaultValue={p?.modalidad_salarial ?? 'mensual'}
              className={claseSelect}
            >
              <option value="mensual">Mensual</option>
              <option value="jornal">Jornal</option>
              <option value="hora">Por hora</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jornada_tipo">Jornada</Label>
            <select
              id="jornada_tipo"
              name="jornada_tipo"
              defaultValue={p?.jornada_tipo ?? 'diurna'}
              className={claseSelect}
            >
              <option value="diurna">Diurna (8 h / 48 h)</option>
              <option value="nocturna">Nocturna (7 h / 42 h)</option>
              <option value="mixta">Mixta (7,5 h / 45 h)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="regimen">Régimen</Label>
            <select id="regimen" name="regimen" defaultValue={p?.regimen ?? 'dependencia'} className={claseSelect}>
              <option value="dependencia">Dependencia (IPS)</option>
              <option value="honorarios">Honorarios (IVA)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caja_ahorro">Caja de ahorro</Label>
            <Input id="caja_ahorro" name="caja_ahorro" defaultValue={p?.caja_ahorro ?? ''} />
          </div>
          <div className="space-y-1.5">
            <Label>Antigüedad en la institución</Label>
            <div className="flex h-8 items-center rounded-lg border border-input bg-muted/40 px-2.5 text-sm text-muted-foreground">
              {antiguedad}
            </div>
            <input type="hidden" name="antiguedad_institucion" value={antiguedad === '—' ? '' : antiguedad} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="superior_id">Superior inmediato</Label>
            <select id="superior_id" name="superior_id" defaultValue={p?.superior_id ?? ''} className={claseSelect}>
              <option value="">—</option>
              {(empleados ?? [])
                .filter((e) => e.id !== persona?.id)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registro_profesional">Registro / Matrícula</Label>
            <Input id="registro_profesional" name="registro_profesional" defaultValue={p?.registro_profesional ?? ''} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo">Logo del reporte</Label>
            <select id="logo" name="logo" defaultValue={p?.logo ?? 'aso'} className={claseSelect}>
              <option value="aso">ASO CEDINANE</option>
              <option value="incluyeme">INCLÚYEME</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_ci" defaultChecked={Boolean(p?.tiene_ci)} className="size-4 rounded border-input accent-primary" /> CI
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_cv" defaultChecked={Boolean(p?.tiene_cv)} className="size-4 rounded border-input accent-primary" /> CV
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tiene_cd" defaultChecked={Boolean(p?.tiene_cd)} className="size-4 rounded border-input accent-primary" /> CD
          </label>
          <span className="text-xs text-muted-foreground">Documentos presentados</span>
        </div>
      </fieldset>
      ) : null}

      {esAlumno ? (
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-medium text-foreground">Datos del alumno</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nacionalidad">Nacionalidad</Label>
              <Input id="nacionalidad" name="nacionalidad" defaultValue={al?.nacionalidad ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="turno_alumno">Turno</Label>
              <Input id="turno_alumno" name="turno_alumno" defaultValue={al?.turno ?? ''} placeholder="Ej.: TM, TC, TT" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="beca">Beca (%)</Label>
              <Input
                id="beca"
                name="beca"
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue={al?.beca != null ? String(al.beca * 100) : ''}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="presupuesto_ingreso">Presupuesto ingreso</Label>
              <Input
                id="presupuesto_ingreso"
                name="presupuesto_ingreso"
                type="number"
                step="1"
                defaultValue={al?.presupuesto_ingreso != null ? String(al.presupuesto_ingreso) : ''}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                name="matricula"
                type="number"
                step="1"
                defaultValue={al?.matricula != null ? String(al.matricula) : ''}
              />
            </div>
            <div className="flex items-center gap-2 self-end pb-1">
              <input
                type="checkbox"
                name="rue"
                defaultChecked={Boolean(al?.rue)}
                className="size-4 rounded border-input accent-primary"
              />
              <Label htmlFor="rue">Tiene RUE</Label>
            </div>
          </div>
        </fieldset>
      ) : null}

      {error ? (
        <div role="alert" className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Guardando…
            </>
          ) : esEdicion ? (
            'Guardar cambios'
          ) : (
            'Crear persona'
          )}
        </Button>
        <Link
          href="/dashboard/personas"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
