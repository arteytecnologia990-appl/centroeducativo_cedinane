'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { personaSchema, type PersonaInput } from '../schemas/persona'

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

  await guardarPersonal(supabase, persona.id, v)

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
  const { error } = await supabase
    .from('personas')
    .update({
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
    .eq('id', id)

  if (error) return { error: mensajeDeError(error) }

  await guardarPersonal(supabase, id, v)

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
