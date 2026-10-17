#!/usr/bin/env node
// Importa los alumnos desde docs/_alumnos.json (hoja CUOTA 2026 de ALUMNOS.xlsx).
// Crea persona + persona_roles (alumno) + alumnos. Idempotente por CI/nombre.
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

const alumnos = JSON.parse(readFileSync('docs/_alumnos.json', 'utf8'))

const { data: sedes } = await admin.from('sedes').select('id, codigo')
const sedePorCodigo = new Map((sedes ?? []).map((s) => [s.codigo, s.id]))

function ciValida(v) {
  if (!v) return null
  const s = String(v).replace(/\D/g, '')
  return /^\d{5,9}$/.test(s) ? s : null
}

function sexo(v) {
  const s = String(v ?? '').trim().toUpperCase()
  if (s === 'V') return 'M'
  if (s === 'M') return 'F'
  return null
}

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function sedeDe(v) {
  if (v === '1') return sedePorCodigo.get('SEDE-1') ?? null
  if (v === '2') return sedePorCodigo.get('SEDE-2') ?? null
  return null
}

let creados = 0
let saltados = 0

for (const a of alumnos) {
  const ci = ciValida(a.ci)

  let existente = null
  if (ci) {
    const { data } = await admin.from('personas').select('id').eq('ci', ci).maybeSingle()
    existente = data
  } else {
    const { data } = await admin
      .from('personas')
      .select('id')
      .eq('nombres', a.nombres)
      .eq('apellidos', a.apellidos ?? '')
      .maybeSingle()
    existente = data
  }

  if (existente) {
    saltados++
    console.log('ya existe:', a.nombres, a.apellidos ?? '')
    continue
  }

  const { data: persona, error } = await admin
    .from('personas')
    .insert({
      nombres: a.nombres,
      apellidos: a.apellidos ?? '',
      ci,
      fecha_nacimiento: a.nacimiento,
      sexo: sexo(a.sexo),
    })
    .select('id')
    .single()

  if (error) {
    console.error('error en persona', a.nombres, '->', error.message)
    continue
  }

  const sedeId = sedeDe(a.sede)
  await admin.from('persona_roles').insert({ persona_id: persona.id, rol_negocio: 'alumno', sede_id: sedeId })
  const { error: err } = await admin.from('alumnos').insert({
    persona_id: persona.id,
    sede_id: sedeId,
    nacionalidad: a.nacionalidad,
    turno: a.turno,
    rue: String(a.rue ?? '').trim().toUpperCase() === 'SI',
    beca: num(a.beca),
    presupuesto_ingreso: num(a.presupuesto),
    matricula: num(a.matricula),
  })
  if (err) console.error('error en alumnos', a.nombres, '->', err.message)

  creados++
}

console.log(`Listo. creados=${creados} saltados=${saltados}`)
