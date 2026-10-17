#!/usr/bin/env node
// Carga personas de ejemplo (ficticias) para probar el módulo.
// Uso: node scripts/seed-personas.mjs
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

const PERSONAS = [
  { nombres: 'Laura', apellidos: 'Benítez', ci: '3456789', fecha_nacimiento: '1990-05-12', sexo: 'F', email: 'laura.benitez@ejemplo.com', telefono: '0981 123 456', rol: 'profesional' },
  { nombres: 'Marcos', apellidos: 'Rojas', ci: '4123456', fecha_nacimiento: '1985-11-03', sexo: 'M', email: 'marcos.rojas@ejemplo.com', telefono: '0982 234 567', rol: 'profesional' },
  { nombres: 'Ana', apellidos: 'Giménez', ci: '2987654', fecha_nacimiento: '1993-02-20', sexo: 'F', email: 'ana.gimenez@ejemplo.com', telefono: '0983 345 678', rol: 'empleado' },
  { nombres: 'Jorge', apellidos: 'Duarte', ci: '5210111', fecha_nacimiento: '1978-08-30', sexo: 'M', email: 'jorge.duarte@ejemplo.com', telefono: '0984 456 789', rol: 'tutor' },
  { nombres: 'Carla', apellidos: 'Ayala', ci: '1654320', fecha_nacimiento: '2015-04-15', sexo: 'F', email: null, telefono: null, rol: 'alumno' },
  { nombres: 'Diego', apellidos: 'Insfrán', ci: '6789012', fecha_nacimiento: '2014-09-08', sexo: 'M', email: null, telefono: null, rol: 'paciente' },
]

for (const p of PERSONAS) {
  const { data: existente } = await admin.from('personas').select('id').eq('ci', p.ci).maybeSingle()
  if (existente) {
    console.log('ya existe:', p.ci, p.nombres, p.apellidos)
    continue
  }
  const { data: persona, error } = await admin
    .from('personas')
    .insert({
      nombres: p.nombres,
      apellidos: p.apellidos,
      ci: p.ci,
      fecha_nacimiento: p.fecha_nacimiento,
      sexo: p.sexo,
      email: p.email,
      telefono: p.telefono,
    })
    .select('id')
    .single()

  if (error) {
    console.error('error', p.ci, error.message)
    continue
  }
  if (p.rol) {
    await admin.from('persona_roles').insert({ persona_id: persona.id, rol_negocio: p.rol })
  }
  console.log('creada:', p.nombres, p.apellidos, `(${p.rol})`)
}

console.log('Listo.')
