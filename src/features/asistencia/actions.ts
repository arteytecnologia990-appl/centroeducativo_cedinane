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
