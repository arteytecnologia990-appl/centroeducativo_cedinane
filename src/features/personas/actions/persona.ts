'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { personaSchema, type PersonaInput } from '../schemas/persona'
import { hashearPin } from '@/features/asistencia/pin'

export type PersonaResult = { error?: string }

type Cliente = Awaited<ReturnType<typeof createClient>>

function aNull(valor: string): string | null {
  const t = valor.trim()
  return t === '' ? null : t
}

function datosDesdeFormData(formData: FormData): PersonaInput {
  return {
    nombres: String(formData.get('nombres') ?? ''),
    apellidos: String(formData.get('apellidos') ?? ''),
    ci: String(formData.get('ci') ?? ''),
    fecha_nacimiento: String(formData.get('fecha_nacimiento') ?? ''),
    sexo: String(formData.get('sexo') ?? ''),
    email: String(formData.get('email') ?? ''),
    telefono: String(formData.get('telefono') ?? ''),
    direccion: String(formData.get('direccion') ?? ''),
    observaciones: String(formData.get('observaciones') ?? ''),
    rol_negocio: String(formData.get('rol_negocio') ?? ''),
    cargo: String(formData.get('cargo') ?? ''),
    programa: String(formData.get('programa') ?? ''),
    formacion_academica: String(formData.get('formacion_academica') ?? ''),
    turno: String(formData.get('turno') ?? ''),
    sector: String(formData.get('sector') ?? ''),
    experiencia_cargo: String(formData.get('experiencia_cargo') ?? ''),
    antiguedad_institucion: String(formData.get('antiguedad_institucion') ?? ''),
    fecha_ingreso: String(formData.get('fecha_ingreso') ?? ''),
    registro_profesional: String(formData.get('registro_profesional') ?? ''),
    logo: String(formData.get('logo') ?? ''),
    sueldo: String(formData.get('sueldo') ?? ''),
    modalidad_salarial: String(formData.get('modalidad_salarial') ?? ''),
    jornada_tipo: String(formData.get('jornada_tipo') ?? ''),
    regimen: String(formData.get('regimen') ?? ''),
    caja_ahorro: String(formData.get('caja_ahorro') ?? ''),
    pin: String(formData.get('pin') ?? ''),
    nacionalidad: String(formData.get('nacionalidad') ?? ''),
    turno_alumno: String(formData.get('turno_alumno') ?? ''),
    rue: formData.get('rue') === 'on',
    beca: String(formData.get('beca') ?? ''),
    presupuesto_ingreso: String(formData.get('presupuesto_ingreso') ?? ''),
    matricula: String(formData.get('matricula') ?? ''),
    tiene_ci: formData.get('tiene_ci') === 'on',
    tiene_cv: formData.get('tiene_cv') === 'on',
    tiene_cd: formData.get('tiene_cd') === 'on',
  }
}

function mensajeDeError(error: { code?: string; message?: string }): string {
  if (error.code === '23505') return 'Ya existe una persona con esa cédula.'
  if (error.code === '23514') return 'Revisá los datos: hay un valor fuera de rango.'
  return 'No se pudo guardar. Intentá de nuevo.'
}

/** Inserta o actualiza los datos laborales (1:1 con la persona). */
async function guardarPersonal(supabase: Cliente, personaId: string, v: PersonaInput) {
  const sueldo = v.sueldo === '' ? null : Number(v.sueldo)

  const datos = {
    cargo: aNull(v.cargo),
    programa: aNull(v.programa),
    formacion_academica: aNull(v.formacion_academica),
    turno: aNull(v.turno),
    sector: aNull(v.sector),
    experiencia_cargo: aNull(v.experiencia_cargo),
    antiguedad_institucion: aNull(v.antiguedad_institucion),
    fecha_ingreso: aNull(v.fecha_ingreso),
    registro_profesional: aNull(v.registro_profesional),
    logo: aNull(v.logo),
    sueldo: Number.isFinite(sueldo) ? sueldo : null,
    modalidad_salarial: aNull(v.modalidad_salarial) ?? 'mensual',
    jornada_tipo: aNull(v.jornada_tipo) ?? 'diurna',
    regimen: aNull(v.regimen) ?? 'dependencia',
    caja_ahorro: aNull(v.caja_ahorro),
    tiene_ci: v.tiene_ci,
    tiene_cv: v.tiene_cv,
    tiene_cd: v.tiene_cd,
  }

  const hayDatos =
    [
      datos.cargo,
      datos.programa,
      datos.formacion_academica,
      datos.turno,
      datos.sector,
      datos.experiencia_cargo,
      datos.antiguedad_institucion,
      datos.registro_profesional,
      datos.sueldo,
    ].some((x) => x !== null) ||
    datos.tiene_ci ||
    datos.tiene_cv ||
    datos.tiene_cd

  const { data: existente } = await supabase
    .from('personal')
    .select('id')
    .eq('persona_id', personaId)
    .maybeSingle()

  if (existente) {
    await supabase.from('personal').update(datos).eq('id', existente.id)
  } else if (hayDatos) {
    await supabase.from('personal').insert({ persona_id: personaId, ...datos })
  }
}

/** Inserta o actualiza los datos del alumno (1:1 con la persona). */
async function guardarAlumno(supabase: Cliente, personaId: string, v: PersonaInput) {
  const beca = v.beca === '' ? null : Number(v.beca) / 100
  const presupuesto = v.presupuesto_ingreso === '' ? null : Number(v.presupuesto_ingreso)
  const matricula = v.matricula === '' ? null : Number(v.matricula)

  const datos = {
    nacionalidad: aNull(v.nacionalidad),
    turno: aNull(v.turno_alumno),
    rue: v.rue,
    beca: Number.isFinite(beca) ? beca : null,
    presupuesto_ingreso: Number.isFinite(presupuesto) ? presupuesto : null,
    matricula: Number.isFinite(matricula) ? matricula : null,
  }

  const hayDatos =
    datos.nacionalidad !== null ||
    datos.turno !== null ||
    datos.rue ||
    datos.beca !== null ||
    datos.presupuesto_ingreso !== null ||
    datos.matricula !== null

  const { data: existente } = await supabase
    .from('alumnos')
    .select('id')
    .eq('persona_id', personaId)
    .maybeSingle()

  if (existente) {
    await supabase.from('alumnos').update(datos).eq('id', existente.id)
  } else if (hayDatos) {
    await supabase.from('alumnos').insert({ persona_id: personaId, ...datos })
  }
}

export async function crearPersona(formData: FormData): Promise<PersonaResult> {
  const parsed = personaSchema.safeParse(datosDesdeFormData(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisá los datos.' }
  }
  const v = parsed.data

  const supabase = await createClient()
  const { data: persona, error } = await supabase
    .from('personas')
    .insert({
      nombres: v.nombres,
      apellidos: v.apellidos,
      ci: aNull(v.ci),
      fecha_nacimiento: aNull(v.fecha_nacimiento),
      sexo: aNull(v.sexo),
      email: aNull(v.email),
      telefono: aNull(v.telefono),
      direccion: aNull(v.direccion),
      observaciones: aNull(v.observaciones),
    })
    .select('id')
    .single()

  if (error) return { error: mensajeDeError(error) }

  if (v.rol_negocio) {
    await supabase.from('persona_roles').insert({
      persona_id: persona.id,
      rol_negocio: v.rol_negocio,
    })
  }

  if (v.pin) {
    await supabase.from('personas').update({ pin_hash: hashearPin(v.pin) }).eq('id', persona.id)
  }

  await guardarPersonal(supabase, persona.id, v)
  await guardarAlumno(supabase, persona.id, v)

  revalidatePath('/dashboard/personas')
  redirect('/dashboard/personas')
}

export async function actualizarPersona(formData: FormData): Promise<PersonaResult> {
  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Falta el identificador de la persona.' }

  const parsed = personaSchema.safeParse(datosDesdeFormData(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisá los datos.' }
  }
  const v = parsed.data

  const supabase = await createClient()
  const base = {
    nombres: v.nombres,
    apellidos: v.apellidos,
    ci: aNull(v.ci),
    fecha_nacimiento: aNull(v.fecha_nacimiento),
    sexo: aNull(v.sexo),
    email: aNull(v.email),
    telefono: aNull(v.telefono),
    direccion: aNull(v.direccion),
    observaciones: aNull(v.observaciones),
  }
  const cambios = v.pin ? { ...base, pin_hash: hashearPin(v.pin) } : base
  const { error } = await supabase.from('personas').update(cambios).eq('id', id)

  if (error) return { error: mensajeDeError(error) }

  await guardarPersonal(supabase, id, v)
  await guardarAlumno(supabase, id, v)

  revalidatePath('/dashboard/personas')
  revalidatePath(`/dashboard/personas/${id}`)
  redirect(`/dashboard/personas/${id}`)
}

export async function archivarPersona(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('personas').update({ deleted_at: new Date().toISOString() }).eq('id', id)

  revalidatePath('/dashboard/personas')
  redirect('/dashboard/personas')
}

export async function agregarRol(formData: FormData) {
  const personaId = String(formData.get('persona_id') ?? '')
  const rolNegocio = String(formData.get('rol_negocio') ?? '')
  if (!personaId || !rolNegocio) return

  const supabase = await createClient()
  const { data: existente } = await supabase
    .from('persona_roles')
    .select('id')
    .eq('persona_id', personaId)
    .eq('rol_negocio', rolNegocio)
    .maybeSingle()

  if (existente) return

  await supabase.from('persona_roles').insert({ persona_id: personaId, rol_negocio: rolNegocio })

  revalidatePath(`/dashboard/personas/${personaId}`)
  revalidatePath('/dashboard/personas')
}

export async function quitarRol(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const personaId = String(formData.get('persona_id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('persona_roles').delete().eq('id', id)

  if (personaId) revalidatePath(`/dashboard/personas/${personaId}`)
  revalidatePath('/dashboard/personas')
}
