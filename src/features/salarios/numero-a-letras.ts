const UNIDADES = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']
const ESPECIALES = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
const DECENAS = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const CENTENAS = [
  '',
  'ciento',
  'doscientos',
  'trescientos',
  'cuatrocientos',
  'quinientos',
  'seiscientos',
  'setecientos',
  'ochocientos',
  'novecientos',
]

function hasta999(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'cien'
  const c = Math.floor(n / 100)
  const r = n % 100
  let s = CENTENAS[c]
  if (r > 0) {
    let palabra: string
    if (r < 10) palabra = UNIDADES[r]
    else if (r < 20) palabra = ESPECIALES[r - 10]
    else if (r === 20) palabra = 'veinte'
    else if (r < 30) palabra = `veinti${UNIDADES[r - 20]}`
    else palabra = DECENAS[Math.floor(r / 10)] + (r % 10 ? ` y ${UNIDADES[r % 10]}` : '')
    s += (s ? ' ' : '') + palabra
  }
  return s
}

/** Número entero a letras en español (para el recibo de adelanto). */
export function numeroALetras(valor: number): string {
  const n = Math.floor(Math.abs(valor))
  if (n === 0) return 'cero'

  const millones = Math.floor(n / 1_000_000)
  const miles = Math.floor((n % 1_000_000) / 1000)
  const resto = n % 1000

  const partes: string[] = []
  if (millones > 0) partes.push(millones === 1 ? 'un millón' : `${hasta999(millones)} millones`)
  if (miles > 0) partes.push(miles === 1 ? 'mil' : `${hasta999(miles)} mil`)
  if (resto > 0) partes.push(hasta999(resto))

  return partes.join(' ')
}
