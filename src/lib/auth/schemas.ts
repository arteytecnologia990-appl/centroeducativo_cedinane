import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu correo.').email('Ingresá un correo válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

export const recuperarSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu correo.').email('Ingresá un correo válido.'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RecuperarInput = z.infer<typeof recuperarSchema>
