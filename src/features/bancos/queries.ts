import { createClient } from '@/lib/supabase/server'

export type Cuenta = {
  id: string
  banco_id: string
  numero: string
  tipo: string
  titular: string | null
  moneda: string
  activo: boolean
}

export type Banco = {
  id: string
  nombre: string
  activo: boolean
  cuentas: Cuenta[]
}

export async function listarBancos(): Promise<Banco[]> {
  const supabase = await createClient()
  const [{ data: bancos }, { data: cuentas }] = await Promise.all([
    supabase.from('bancos').select('*').order('nombre', { ascending: true }),
    supabase.from('cuentas_bancarias').select('*').order('numero', { ascending: true }),
  ])

  return (bancos ?? []).map((b) => ({
    id: b.id,
    nombre: b.nombre,
    activo: b.activo,
    cuentas: (cuentas ?? []).filter((c) => c.banco_id === b.id) as Cuenta[],
  }))
}
