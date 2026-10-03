#!/usr/bin/env node
// Crea el primer usuario administrador: auth.user + persona + usuario (es_admin_general) + rol.
// Uso: node scripts/crear-admin.mjs <email> <password> <nombres> <apellidos> [ci]
// Requiere: .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
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

const [email, password, nombres, apellidos, ci] = process.argv.slice(2)
if (!email || !password || !nombres || !apellidos) {
  console.error('Uso: node scripts/crear-admin.mjs <email> <password> <nombres> <apellidos> [ci]')
  process.exit(1)
}

const env = cargarEnv()
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// 1. usuario de autenticación
const { data: authData, error: authErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})
if (authErr) {
  console.error('Error creando el usuario de autenticación:', authErr.message)
  process.exit(1)
}
console.log('auth.user creado:', authData.user.id)

// 2. persona
const { data: persona, error: perErr } = await admin
  .from('personas')
  .insert({ nombres, apellidos, ci: ci || null })
  .select('id')
  .single()
if (perErr) {
  console.error('Error creando la persona:', perErr.message)
  process.exit(1)
}
console.log('persona creada:', persona.id)

// 3. usuario del sistema (es_admin_general)
const { error: usuErr } = await admin.from('usuarios').insert({
  persona_id: persona.id,
  auth_user_id: authData.user.id,
  email,
  es_admin_general: true,
})
if (usuErr) {
  console.error('Error creando el usuario del sistema:', usuErr.message)
  process.exit(1)
}

// 4. rol admin_general (todas las sedes)
const { data: rol } = await admin.from('roles').select('id').eq('codigo', 'admin_general').single()
if (rol) {
  const { data: usuario } = await admin
    .from('usuarios')
    .select('id')
    .eq('auth_user_id', authData.user.id)
    .single()
  await admin.from('usuario_roles').insert({ usuario_id: usuario.id, rol_id: rol.id })
}

console.log('Administrador creado y vinculado:', email)
