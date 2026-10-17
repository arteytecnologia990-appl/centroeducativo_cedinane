import 'server-only'
import { createHash } from 'node:crypto'

const PEPPER = process.env.KIOSCO_PEPPER ?? 'cedinane-kiosco'

/** Hash del PIN de kiosco (sha256 + pepper). No se guarda el PIN en claro. */
export function hashearPin(pin: string): string {
  return createHash('sha256').update(`${pin}:${PEPPER}`).digest('hex')
}

export function pinValido(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}
