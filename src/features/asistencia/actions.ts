'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashearPin } from './pin'

export type KioscoResult = {
  ok?: boolean
  tipo?: 'entrada' | 'salida'
  hora?: string
  persona?: string
  error?: string
}

function fechaHoy(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Asuncion',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function horaAhora(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Asuncion',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

/** Marcación desde el kiosco (sin sesión): valida CI + PIN y registra entrada/salida. */
export async function registrarKiosco(formData: FormData): Promise<KioscoResult> {
  const ci = String(formData.get('ci') ?? '').replace(/\D/g, '')
  const pin = String(formData.get('pin') ?? '')
  if (!ci || !pin) return { error: 'Ingresá tu cédula y PIN.' }

  const admin = createAdminClient()
  const { data: persona } = await admin
    .from('personas')
    .select('id, nombres, apellidos, pin_hash')
    .eq('ci', ci)
    .is('deleted_at', null)
    .maybeSingle()

  if (!persona || !persona.pin_hash || persona.pin_hash !== hashearPin(pin)) {
    return { error: 'Cédula o PIN incorrectos.' }
  }

  const fecha = fechaHoy()
  const hora = horaAhora()

  const { data: abierta } = await admin
    .from('asistencias')
    .select('id')
    .eq('persona_id', persona.id)
    .eq('fecha', fecha)
    .is('hora_salida', null)
    .order('hora_entrada', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (abierta) {
    await admin.from('asistencias').update({ hora_salida: hora, origen: 'kiosco' }).eq('id', abierta.id)
    return {
      ok: true,
      tipo: 'salida',
      hora: hora.slice(0, 5),
      persona: `${persona.nombres} ${persona.apellidos}`,
    }
  }

  const { error } = await admin.from('asistencias').insert({
    persona_id: persona.id,
    fecha,
    hora_entrada: hora,
    origen: 'kiosco',
  })
  if (error) return { error: 'No se pudo registrar. Intentá de nuevo.' }

  return {
    ok: true,
    tipo: 'entrada',
    hora: hora.slice(0, 5),
    persona: `${persona.nombres} ${persona.apellidos}`,
  }
}

export type ManualResult = { ok?: boolean; error?: string }

/** Registro manual desde el panel (con sesión). */
export async function registrarManual(formData: FormData): Promise<ManualResult> {
  const personaId = String(formData.get('persona_id') ?? '')
  const fecha = String(formData.get('fecha') ?? '')
  const hora = String(formData.get('hora') ?? '')
  const tipo = String(formData.get('tipo') ?? 'entrada')
  if (!personaId || !fecha || !hora) return { error: 'Completá persona, fecha y hora.' }

  const supabase = await createClient()
  const { data: existente } = await supabase
    .from('asistencias')
    .select('id')
    .eq('persona_id', personaId)
    .eq('fecha', fecha)
    .maybeSingle()

  if (tipo === 'entrada') {
    const { error } = existente
      ? await supabase.from('asistencias').update({ hora_entrada: hora, origen: 'manual' }).eq('id', existente.id)
      : await supabase
          .from('asistencias')
          .insert({ persona_id: personaId, fecha, hora_entrada: hora, origen: 'manual' })
    if (error) return { error: 'No se pudo guardar.' }
  } else {
    if (!existente) return { error: 'Primero registrá la entrada de esa persona.' }
    const { error } = await supabase
      .from('asistencias')
      .update({ hora_salida: hora, origen: 'manual' })
      .eq('id', existente.id)
    if (error) return { error: 'No se pudo guardar.' }
  }

  revalidatePath('/dashboard/asistencia')
  return { ok: true }
}

export async function guardarCalendario(
  formData: FormData
): Promise<{ ok?: boolean; error?: string; sinHorario?: number }> {
  const personaId = String(formData.get('persona_id') ?? '')
  if (!personaId) return { error: 'Falta la persona.' }

  let marcas: { fecha: string; estado: string | null }[]
  try {
    marcas = JSON.parse(String(formData.get('marcas') ?? '[]'))
  } catch {
    return { error: 'Datos inválidos.' }
  }

  const supabase = await createClient()

  // Horario asignado por día de la semana (ISO: 1 = lunes … 7 = domingo)
  const { data: horarios } = await supabase
    .from('horarios')
    .select('dia_semana, hora_inicio, hora_fin')
    .eq('persona_id', personaId)
    .eq('activo', true)
    .is('deleted_at', null)

  const spanPorDia = new Map<number, { inicio: string; fin: string }>()
  for (const h of horarios ?? []) {
    const prev = spanPorDia.get(h.dia_semana)
    if (!prev) {
      spanPorDia.set(h.dia_semana, { inicio: h.hora_inicio, fin: h.hora_fin })
    } else {
      spanPorDia.set(h.dia_semana, {
        inicio: prev.inicio < h.hora_inicio ? prev.inicio : h.hora_inicio,
        fin: prev.fin > h.hora_fin ? prev.fin : h.hora_fin,
      })
    }
  }

  let sinHorario = 0

  for (const m of marcas) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.fecha)) continue
    const estado = m.estado === 'presente' || m.estado === 'ausente' ? m.estado : null

    const diaIso = ((new Date(`${m.fecha}T00:00:00`).getDay() + 6) % 7) + 1
    const span = spanPorDia.get(diaIso) ?? null
    if (estado === 'presente' && !span) sinHorario += 1

    const { data: existente } = await supabase
      .from('asistencias')
      .select('id, hora_entrada, hora_salida')
      .eq('persona_id', personaId)
      .eq('fecha', m.fecha)
      .maybeSingle()

    if (existente) {
      const sinHoras = !existente.hora_entrada && !existente.hora_salida

      if (estado === null) {
        if (sinHoras) {
          await supabase.from('asistencias').delete().eq('id', existente.id)
        } else {
          await supabase.from('asistencias').update({ estado: null }).eq('id', existente.id)
        }
      } else if (estado === 'ausente') {
        await supabase
          .from('asistencias')
          .update({ estado: 'ausente', hora_entrada: null, hora_salida: null })
          .eq('id', existente.id)
      } else {
        // presente: si la fila no tiene horas (kiosco), usar el horario asignado
        await supabase
          .from('asistencias')
          .update({
            estado: 'presente',
            ...(existente.hora_entrada
              ? {}
              : { hora_entrada: span?.inicio ?? null, hora_salida: span?.fin ?? null }),
          })
          .eq('id', existente.id)
      }
    } else if (estado) {
      await supabase.from('asistencias').insert({
        persona_id: personaId,
        fecha: m.fecha,
        estado,
        hora_entrada: estado === 'presente' ? (span?.inicio ?? null) : null,
        hora_salida: estado === 'presente' ? (span?.fin ?? null) : null,
        origen: 'manual',
      })
    }
  }

  revalidatePath('/dashboard/asistencia/calendario')
  revalidatePath('/dashboard/asistencia')
  return { ok: true, sinHorario }
}
