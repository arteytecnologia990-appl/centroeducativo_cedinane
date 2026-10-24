import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const normDoc = (d) => (d ?? '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase()

const { data: facturas } = await supabase
  .from('facturas')
  .select('documento_receptor, nombre_informado, tipo_identificacion')
const { data: personas } = await supabase.from('personas').select('id, ci').is('deleted_at', null)

const existentes = new Set((personas ?? []).map((p) => normDoc(p.ci)))
const vistos = new Set()
const creadas = []

for (const f of facturas ?? []) {
  const base = normDoc(String(f.documento_receptor).split('-')[0])
  if (!base || existentes.has(base) || vistos.has(base)) continue
  vistos.add(base)

  const palabras = String(f.nombre_informado ?? '').trim().split(/\s+/).filter(Boolean)
  const apellidos = palabras.length >= 3 ? palabras.slice(-2).join(' ') : palabras.join(' ')
  const nombres = palabras.length >= 3 ? palabras.slice(0, -2).join(' ') : ''

  const { data: creada, error } = await supabase
    .from('personas')
    .insert({
      ci: base,
      nombres: nombres || apellidos || 'Cliente',
      apellidos,
      observaciones: `Alta automática desde XML (${f.tipo_identificacion ?? 'doc'} ${f.documento_receptor})`,
    })
    .select('id')
    .single()

  if (error || !creada) {
    console.error('ERROR persona:', f.nombre_informado, error?.message)
    continue
  }

  await supabase.from('persona_roles').insert({
    persona_id: creada.id,
    rol_negocio: 'cliente',
    activo: true,
    vigencia_desde: new Date().toISOString().slice(0, 10),
  })
  creadas.push({ ci: base, nombre: f.nombre_informado, persona_id: creada.id })
}

console.log(JSON.stringify({ clientesCreados: creadas.length, creadas }, null, 2))
