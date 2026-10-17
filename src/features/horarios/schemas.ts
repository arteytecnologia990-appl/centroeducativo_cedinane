import { z } from 'zod'

export const DIAS = [
  { valor: '1', etiqueta: 'Lunes' },
  { valor: '2', etiqueta: 'Martes' },
  { valor: '3', etiqueta: 'Miércoles' },
  { valor: '4', etiqueta: 'Jueves' },
  { valor: '5', etiqueta: 'Viernes' },
  { valor: '6', etiqueta: 'Sábado' },
  { valor: '7', etiqueta: 'Domingo' },
] as const

export const horarioSchema = z
  .object({
    persona_id: z.string().min(1, 'Elegí una persona.'),
    sede_id: z.string().min(1, 'Elegí una sede.'),
    dia_semana: z.coerce.number().int().min(1).max(7),
    hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de inicio inválida.'),
    hora_fin: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de fin inválida.'),
    actividad: z.string().trim().max(120),
    aula: z.string().trim().max(80),
  })
  .refine((v) => v.hora_fin > v.hora_inicio, {
    message: 'La hora de fin debe ser mayor que la de inicio.',
    path: ['hora_fin'],
  })

export type HorarioInput = z.infer<typeof horarioSchema>
