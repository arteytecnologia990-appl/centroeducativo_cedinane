#!/usr/bin/env node
// Borra un administrador por email: auth.user + usuario + persona (+ usuario_roles por cascade).
// Uso: node scripts/borrar-admin.mjs <email>
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

function cargarEnv() {
  const txt = readFileSync('.env.local', 'utf8')
  const env = {}
  for (const linea of txt.split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

const [email] = process.argv.slice(2)
if (!email) {
  console.error('Uso: node scripts/borrar-admin.mjs <email>')
  process.exit(1)
}

const env = cargarEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const { data: usuarios, error } = await admin
  .from('usuarios')
  .select('id, persona_id, auth_user_id')
  .eq('email', email)
if (error) {
  console.error('Error buscando el usuario:', error.message)
  process.exit(1)
}
if (!usuarios?.length) {
  console.log('No existe un usuario con ese correo:', email)
  process.exit(0)
}

const u = usuarios[0]

// 1. usuario del sistema (cascade borra usuario_roles)
await admin.from('usuarios').delete().eq('id', u.id)
// 2. persona vinculada
if (u.persona_id) await admin.from('personas').delete().eq('id', u.persona_id)
// 3. usuario de autenticación
if (u.auth_user_id) {
  const { error: ae } = await admin.auth.admin.deleteUser(u.auth_user_id)
  if (ae) console.error('Aviso: no se pudo borrar el auth.user:', ae.message)
}

console.log('Administrador borrado:', email)
