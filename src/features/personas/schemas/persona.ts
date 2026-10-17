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
})

export type PersonaInput = z.infer<typeof personaSchema>
