import { createClient } from '@/lib/supabase/client'
import type { EstiloId } from './estilos'

// Persiste la preferencia en Supabase. Es "best-effort": si no hay sesión,
// no hay usuario vinculado o falla la red, no lanza y se ignora.
export async function sincronizarPreferencia(estilo: EstiloId, modo: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', user.id)
      .limit(1)
    const usuarioId = data?.[0]?.id
    if (!usuarioId) return

    await supabase
      .from('preferencias_usuario')
      .upsert({ usuario_id: usuarioId, estilo, modo }, { onConflict: 'usuario_id' })
  } catch {
    // sin sesión o sin conexión: se omite
  }
}
