// Catálogo de estilos del sistema de temas.
// Los hex de `colores` son DATOS (para el mini-paleta del selector), no estilos de
// componentes: los componentes usan exclusivamente tokens (variables CSS).

export type EstiloId = 'a' | 'b' | 'c' | 'd'

export type EstiloInfo = {
  id: EstiloId
  nombre: string
  colores: { primary: string; background: string; surface: string; text: string }
}

export const ESTILOS: EstiloInfo[] = [
  { id: 'a', nombre: 'Cian', colores: { primary: '#0E7C86', background: '#F3F7F9', surface: '#FFFFFF', text: '#10283A' } },
  { id: 'b', nombre: 'Violeta', colores: { primary: '#6A4CE0', background: '#F6F2FD', surface: '#FFFFFF', text: '#2A2152' } },
  { id: 'c', nombre: 'Azul', colores: { primary: '#1D6FE0', background: '#F1F5FA', surface: '#FFFFFF', text: '#0F2038' } },
  { id: 'd', nombre: 'Verde', colores: { primary: '#46745A', background: '#EFF3EC', surface: '#FAFCF8', text: '#22332A' } },
]

const IDS = ESTILOS.map((e) => e.id) as string[]

export function esEstiloId(v: unknown): v is EstiloId {
  return typeof v === 'string' && IDS.includes(v)
}
