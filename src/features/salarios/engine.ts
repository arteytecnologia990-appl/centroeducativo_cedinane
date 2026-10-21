export type Parametros = Record<string, number>

export type EmpleadoSalario = {
  personaId: string
  nombre: string
  sueldo: number
  modalidad: 'mensual' | 'jornal' | 'hora'
  jornada: 'diurna' | 'nocturna' | 'mixta'
  regimen: 'dependencia' | 'honorarios'
}

export type NovedadesSalario = {
  horasExtra: number
  horasNocturnas: number
  horasFeriado: number
  ausenciasDias: number
  adelanto: number
}

export type LineaDetalle = {
  codigo: string
  descripcion: string
  cantidad: number
  base: number
  tasa: number
  importe: number
  orden: number
}

export type ResultadoLiquidacion = {
  detalle: LineaDetalle[]
  totalHaberes: number
  totalDescuentos: number
  neto: number
  ipsPatronal: number
}

const r2 = (n: number) => Math.round(n * 100) / 100

/**
 * Motor preliminar (Fase 1). Reglas generales del Código del Trabajo y
 * parámetros 2026. Pendiente de validación legal/contable.
 */
export function calcularLiquidacion(
  emp: EmpleadoSalario,
  nov: NovedadesSalario,
  p: Parametros
): ResultadoLiquidacion {
  const horasBase = emp.jornada === 'nocturna' ? (p.base_horas_nocturna ?? 210) : (p.base_horas_diurna ?? 240)
  const diasMes = p.base_dias_mes ?? 30
  const diasJornal = p.base_dias_jornal ?? 26

  let valorHora: number
  let sueldoOrdinario: number
  let cantidadBase: number

  if (emp.modalidad === 'mensual') {
    valorHora = emp.sueldo / horasBase
    sueldoOrdinario = emp.sueldo
    cantidadBase = diasMes
  } else if (emp.modalidad === 'jornal') {
    valorHora = emp.sueldo / 8
    sueldoOrdinario = emp.sueldo * diasJornal
    cantidadBase = diasJornal
  } else {
    valorHora = emp.sueldo
    sueldoOrdinario = emp.sueldo * horasBase
    cantidadBase = horasBase
  }

  const detalle: LineaDetalle[] = []
  let orden = 10

  detalle.push({
    codigo: 'sueldo',
    descripcion: 'Sueldo básico',
    cantidad: cantidadBase,
    base: r2(emp.modalidad === 'mensual' ? emp.sueldo : valorHora),
    tasa: 0,
    importe: r2(sueldoOrdinario),
    orden,
  })
  orden += 10

  const extra = nov.horasExtra * valorHora * (1 + (p.recargo_extra_diurna ?? 50) / 100)
  if (extra > 0) {
    detalle.push({
      codigo: 'horas_extra',
      descripcion: 'Horas extras',
      cantidad: nov.horasExtra,
      base: r2(valorHora),
      tasa: p.recargo_extra_diurna ?? 50,
      importe: r2(extra),
      orden,
    })
    orden += 10
  }

  const nocturnidad = nov.horasNocturnas * valorHora * ((p.recargo_nocturnidad ?? 30) / 100)
  if (nocturnidad > 0) {
    detalle.push({
      codigo: 'nocturnidad',
      descripcion: 'Nocturnidad',
      cantidad: nov.horasNocturnas,
      base: r2(valorHora),
      tasa: p.recargo_nocturnidad ?? 30,
      importe: r2(nocturnidad),
      orden,
    })
    orden += 10
  }

  const feriado = nov.horasFeriado * valorHora * (1 + (p.recargo_feriado ?? 100) / 100)
  if (feriado > 0) {
    detalle.push({
      codigo: 'feriado',
      descripcion: 'Horas en feriado',
      cantidad: nov.horasFeriado,
      base: r2(valorHora),
      tasa: p.recargo_feriado ?? 100,
      importe: r2(feriado),
      orden,
    })
    orden += 10
  }

  const totalHaberes = r2(sueldoOrdinario + extra + nocturnidad + feriado)

  const ausencia = nov.ausenciasDias * (sueldoOrdinario / diasMes)
  if (ausencia > 0) {
    detalle.push({
      codigo: 'ausencia',
      descripcion: 'Ausencias',
      cantidad: nov.ausenciasDias,
      base: r2(sueldoOrdinario / diasMes),
      tasa: 0,
      importe: r2(-ausencia),
      orden,
    })
    orden += 10
  }

  const esHonorarios = emp.regimen === 'honorarios'

  let ips = 0
  if (!esHonorarios) {
    ips = totalHaberes * ((p.ips_obrero ?? 9) / 100)
    detalle.push({
      codigo: 'ips_obrero',
      descripcion: 'IPS obrero',
      cantidad: 0,
      base: totalHaberes,
      tasa: p.ips_obrero ?? 9,
      importe: r2(-ips),
      orden,
    })
    orden += 10
  }

  let iva = 0
  if (esHonorarios) {
    iva = totalHaberes * ((p.iva ?? 10) / 100)
    detalle.push({
      codigo: 'iva',
      descripcion: 'IVA 10%',
      cantidad: 0,
      base: totalHaberes,
      tasa: p.iva ?? 10,
      importe: r2(iva),
      orden,
    })
    orden += 10
  }

  if (nov.adelanto > 0) {
    detalle.push({
      codigo: 'adelanto',
      descripcion: 'Adelanto / préstamo',
      cantidad: 0,
      base: nov.adelanto,
      tasa: 0,
      importe: r2(-nov.adelanto),
      orden,
    })
    orden += 10
  }

  const totalDescuentos = r2(ausencia + ips + nov.adelanto)
  const neto = r2(totalHaberes - totalDescuentos + iva)
  const ipsPatronal = esHonorarios ? 0 : r2(totalHaberes * ((p.ips_patronal ?? 16.5) / 100))

  return { detalle, totalHaberes, totalDescuentos, neto, ipsPatronal }
}
