'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { horarioSchema } from './schemas'

export type HorarioCreado = {
  id: string
  persona_id: string
  sede_id: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  actividad: string | null
  aula: string | null
}

export type HorarioResult = { error?: string; horario?: HorarioCreado }

function mensajeDeError(error: { code?: string; message?: string }): string {
  if (error.code === '23514') return 'Revisá las horas: la de fin debe ser mayor que la de inicio.'
  if (error.code === '23503') return 'La persona o la sede no existen.'
  return 'No se pudo guardar el horario. Intentá de nuevo.'
}

export async function crearHorario(formData: FormData): Promise<HorarioResult> {
  const parsed = horarioSchema.safeParse({
    persona_id: String(formData.get('persona_id') ?? ''),
    sede_id: String(formData.get('sede_id') ?? ''),
    dia_semana: formData.get('dia_semana'),
    hora_inicio: String(formData.get('hora_inicio') ?? ''),
    hora_fin: String(formData.get('hora_fin') ?? ''),
    actividad: String(formData.get('actividad') ?? ''),
    aula: String(formData.get('aula') ?? ''),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisá los datos.' }
  }
  const v = parsed.data

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('horarios')
    .insert({
      persona_id: v.persona_id,
      sede_id: v.sede_id,
      dia_semana: v.dia_semana,
      hora_inicio: v.hora_inicio,
      hora_fin: v.hora_fin,
      actividad: v.actividad || null,
      aula: v.aula || null,
    })
    .select('id, persona_id, sede_id, dia_semana, hora_inicio, hora_fin, actividad, aula')
    .single()

  if (error) return { error: mensajeDeError(error) }

  revalidatePath('/dashboard/horarios')
  return { horario: data as HorarioCreado }
}

export async function eliminarHorario(id: string): Promise<{ error?: string }> {
  if (!id) return { error: 'Falta el identificador.' }

  const supabase = await createClient()
  const { error } = await supabase.from('horarios').delete().eq('id', id)
  if (error) return { error: 'No se pudo eliminar el horario.' }

  revalidatePath('/dashboard/horarios')
  return {}
}
