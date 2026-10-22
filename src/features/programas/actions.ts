'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function crearPrograma(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const nombre = String(formData.get('nombre') ?? '').trim()
  if (!nombre) return

  const fecha = (campo: string) => {
    const valor = String(formData.get(campo) ?? '')
    return /^\d{4}-\d{2}-\d{2}$/.test(valor) ? valor : null
  }

  const supabase = await createClient()
  const datos = {
    nombre,
    caja_ahorro: String(formData.get('caja_ahorro') ?? '').trim() || null,
    logo: String(formData.get('logo') ?? '/logos/cedinane.png'),
    ruc: String(formData.get('ruc') ?? '').trim() || null,
    rtp: String(formData.get('rtp') ?? '').trim() || null,
    resolucion: String(formData.get('resolucion') ?? '').trim() || null,
    fecha_inicio: fecha('fecha_inicio'),
    fecha_vencimiento: fecha('fecha_vencimiento'),
    activo: formData.get('activo') === 'on',
    updated_at: new Date().toISOString(),
  }

  if (id) {
    await supabase.from('programas').update(datos).eq('id', id)
  } else {
    await supabase.from('programas').insert(datos)
  }

  revalidatePath('/dashboard/programas')
}

export async function eliminarPrograma(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('programas').delete().eq('id', id)

  revalidatePath('/dashboard/programas')
}
