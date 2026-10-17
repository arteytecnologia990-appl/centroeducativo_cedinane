'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { personaSchema } from '../schemas/persona'

export type PersonaResult = { error?: string }

function aNull(valor: string): string | null {
  const t = valor.trim()
  return t === '' ? null : t
}

function datosDesdeFormData(formData: FormData) {
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
  }
}

function mensajeDeError(error: { code?: string; message?: string }): string {
  if (error.code === '23505') return 'Ya existe una persona con esa cédula.'
  if (error.code === '23514') return 'Revisá los datos: hay un valor fuera de rango.'
  return 'No se pudo guardar. Intentá de nuevo.'
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

  revalidatePath('/personas')
  redirect('/personas')
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

  revalidatePath('/personas')
  revalidatePath(`/personas/${id}`)
  redirect(`/personas/${id}`)
}

export async function archivarPersona(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('personas').update({ deleted_at: new Date().toISOString() }).eq('id', id)

  revalidatePath('/personas')
  redirect('/personas')
}
