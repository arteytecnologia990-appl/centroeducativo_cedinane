import { z } from 'zod'

const ciRegex = /^[0-9]{5,9}$/
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const ROLES_NEGOCIO = [
  'profesional',
  'empleado',
  'alumno',
  'paciente',
  'tutor',
  'proveedor',
  'cliente',
] as const

export type RolNegocio = (typeof ROLES_NEGOCIO)[number]

export const ETIQUETA_ROL: Record<RolNegocio, string> = {
  profesional: 'Profesional',
  empleado: 'Empleado',
  alumno: 'Alumno',
  paciente: 'Paciente',
  tutor: 'Tutor',
  proveedor: 'Proveedor',
  cliente: 'Cliente',
}

export const FORMACION_ACADEMICA = [
  'Grado Concluido',
  'Estudiante Universitario',
  'Posgrado',
  'Formación Técnica',
  'Educación Media',
] as const

export const TURNOS = ['M', 'T', 'M/T'] as const

export const SECTORES = ['privado', 'publico'] as const

export const personaSchema = z.object({
  nombres: z.string().trim().min(1, 'Ingresá el nombre.').max(120),
  apellidos: z.string().trim().min(1, 'Ingresá el apellido.').max(120),
  ci: z.string().trim().refine((v) => v === '' || ciRegex.test(v), 'La CI debe tener entre 5 y 9 dígitos.'),
  fecha_nacimiento: z.string().trim(),
  sexo: z.string().trim(),
  email: z.string().trim().refine((v) => v === '' || emailRegex.test(v), 'Correo inválido.'),
  telefono: z.string().trim().max(30),
  direccion: z.string().trim().max(200),
  observaciones: z.string().trim().max(500),
  rol_negocio: z.string().trim(),
  // Datos laborales (tabla personal)
  cargo: z.string().trim().max(120),
  programa: z.string().trim().max(120),
  formacion_academica: z.string().trim(),
  turno: z.string().trim(),
  sector: z.string().trim(),
  experiencia_cargo: z.string().trim().max(60),
  antiguedad_institucion: z.string().trim().max(60),
  fecha_ingreso: z.string().trim(),
  registro_profesional: z.string().trim().max(60),
  logo: z.string().trim(),
  sueldo: z.string().trim(),
  pin: z.string().trim(),
  // Datos del alumno (tabla alumnos)
  nacionalidad: z.string().trim().max(60),
  turno_alumno: z.string().trim().max(40),
  rue: z.boolean(),
  beca: z.string().trim(),
  presupuesto_ingreso: z.string().trim(),
  matricula: z.string().trim(),
  tiene_ci: z.boolean(),
  tiene_cv: z.boolean(),
  tiene_cd: z.boolean(),
})

export type PersonaInput = z.infer<typeof personaSchema>
