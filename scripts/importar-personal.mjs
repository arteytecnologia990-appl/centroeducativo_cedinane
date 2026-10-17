#!/usr/bin/env node
// Importa el plantel de empleados desde la hoja "Datos del Personal" (COLABORADORES.xlsx).
// Crea persona + persona_roles (empleado) + personal por cada fila. Idempotente por CI/nombre.
// Uso: node scripts/importar-personal.mjs
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

const env = cargarEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const data = JSON.parse(readFileSync('docs/_inspect_datos.json', 'utf8'))
const filas = data.filas

const { data: sedes } = await admin.from('sedes').select('id, codigo')
const sedePorCodigo = new Map((sedes ?? []).map((s) => [s.codigo, s.id]))

function txt(v) {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

function splitNombre(full) {
  const toks = String(full).replace(/\s+/g, ' ').trim().split(' ')
  if (toks.length >= 4) return { nombres: toks.slice(0, -2).join(' '), apellidos: toks.slice(-2).join(' ') }
  if (toks.length === 3) return { nombres: toks.slice(0, 2).join(' '), apellidos: toks[2] }
  if (toks.length === 2) return { nombres: toks[0], apellidos: toks[1] }
  return { nombres: toks[0] ?? '', apellidos: '' }
}

function fecha(v) {
  if (!v) return null
  const s = String(v).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

function esX(v) {
  return String(v ?? '').trim().toUpperCase() === 'X'
}

function normalizarSector(v) {
  const s = String(v ?? '').trim().toLowerCase()
  return s === 'privado' || s === 'publico' ? s : null
}

function sedeDeCargo(cargo) {
  const m = String(cargo ?? '').match(/Sede\s*([12])/i)
  return m ? (sedePorCodigo.get(`SEDE-${m[1]}`) ?? null) : null
}

let creadas = 0
let saltadas = 0

for (const r of filas) {
  const nombreCompleto = String(r['Nombre y Apellidos:'] ?? '').trim()
  if (!nombreCompleto) continue

  const ci = txt(r['Número de C.I'])
  const { nombres, apellidos } = splitNombre(nombreCompleto)

  let existente = null
  if (ci) {
    const { data } = await admin.from('personas').select('id').eq('ci', ci).maybeSingle()
    existente = data
  } else {
    const { data } = await admin
      .from('personas')
      .select('id')
      .eq('nombres', nombres)
      .eq('apellidos', apellidos)
      .maybeSingle()
    existente = data
  }
  if (existente) {
    saltadas++
    console.log('ya existe:', nombreCompleto)
    continue
  }

  const { data: persona, error } = await admin
    .from('personas')
    .insert({
      nombres,
      apellidos,
      ci,
      fecha_nacimiento: fecha(r['Fecha de Nacimiento']),
      email: txt(r['Email:']),
      telefono: txt(r['Teléfono']),
      direccion: txt(r['Dirección']),
    })
    .select('id')
    .single()

  if (error) {
    console.error('error en persona', nombreCompleto, '->', error.message)
    continue
  }

  const sedeId = sedeDeCargo(r['Cargo'])
  await admin.from('persona_roles').insert({ persona_id: persona.id, rol_negocio: 'empleado', sede_id: sedeId })
  const { error: pErr } = await admin.from('personal').insert({
    persona_id: persona.id,
    sede_id: sedeId,
    cargo: txt(r['Cargo']),
    programa: txt(r['Programa']),
    formacion_academica: txt(r['Formación académica']),
    turno: txt(r['Turno']),
    sector: normalizarSector(r['Sector']),
    experiencia_cargo: txt(r['Experiencia laboral en cargo']),
    antiguedad_institucion: txt(r['Antigüedad en la Institución']),
    registro_profesional: txt(r['Registro ó Matricula']),
    tiene_ci: esX(r['CI']),
    tiene_cv: esX(r['CV']),
    tiene_cd: esX(r['CD']),
  })
  if (pErr) console.error('error en personal', nombreCompleto, '->', pErr.message)

  creadas++
  console.log('creada:', nombreCompleto)
}

console.log(`Listo. creadas=${creadas} saltadas=${saltadas}`)
