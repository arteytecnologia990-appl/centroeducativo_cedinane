---
tipo: tecnico
actualizado: 2026-10-20
tags:
  - tecnico
  - salarios
  - paraguay
---

# Especificación · Liquidación de salarios 2026 (Paraguay)

Resumen técnico de la especificación funcional (texto completo en la conversación). Estado: **preliminar, pendiente de validación legal/contable**.

## Parámetros de referencia (Resolución MTESS 670/2026, desde 2026-07-01)

| Parámetro | Valor |
| --- | ---: |
| Salario mínimo mensual diurno | G. 3.044.000 |
| Jornal mínimo diurno | G. 117.077 |
| Remuneración diaria del mensualizado | G. 101.467 |
| Hora de referencia del mensualizado diurno | G. 12.683 |
| Salario mínimo mensual nocturno | G. 3.957.200 |
| Hora de referencia nocturna | G. 18.844 |

Bases derivadas (verificadas): jornal = mensual/26; diaria = mensual/30; hora diurna = mensual/240; hora nocturna = mensual nocturno/210.

## Jornada (Código del Trabajo)

| Jornada | Diaria | Semanal | Franja |
| --- | ---: | ---: | --- |
| Diurna | 8 h | 48 h | 06:00–20:00 |
| Nocturna | 7 h | 42 h | 20:00–06:00 |
| Mixta | 7,5 h | 45 h | — |

## Recargos

- Hora extra diurna: ordinaria × 1,5 (mínimo).
- Nocturnidad ordinaria: +30 % sobre la ordinaria diurna.
- Hora extra nocturna: nocturna ordinaria × 2 (mínimo).
- Hora en feriado: ordinaria de día hábil × 2.

## Aguinaldo y vacaciones

- **Aguinaldo** (art. 243): remuneraciones computables del año ÷ 12; pago antes del 31/12 o al cese.
- **Vacaciones** (art. 218): hasta 5 años 12 días; >5 a 10 años 18 días; >10 años 30 días.

## Aportes

| Concepto | Tasa | Nota |
| --- | ---: | --- |
| IPS obrero | 9 % | base imponible configurable |
| IPS patronal | 16,5 % | costo empleador |

- **IRP**: no es un % fijo; requiere reglas DNIT (tramos, deducciones, retención).
- **Anticipos** (art. 242): límite 30 % de la remuneración mensual para deudas con el empleador.
- **Embargos** (art. 245): límites según naturaleza.

## Fórmulas de cierre

- Total haberes = ordinario + adicionales + comisiones + extras + otros.
- Total descuentos = descuentos válidos (con límites).
- Neto = haberes − descuentos.
- Costo patronal = haberes + aportes patronales + provisiones.

## Modelo de datos

- `empleados`, `contratos_salariales`, `conceptos_salario`, `parametros_legales`, `jornadas`, `asistencia`, `novedades`, `liquidaciones`, `liquidacion_detalle`, `auditoria_liquidacion`.
- Parámetros con **vigencia histórica** (no sobrescribir).
- Conceptos con banderas: remunerativo, incluye base IPS / aguinaldo / vacaciones (sí / no / pendiente).

## Estados de liquidación

Borrador → Calculada → Pendiente de aprobación → (Observada) → Aprobada → Cerrada. Anulada.

## Pendientes de validación

1. Mínimos diferenciados por actividad.
2. Bases imponibles y exclusiones IPS.
3. Fórmula de ausencias por modalidad.
4. Límites/excepciones de horas extras y concurrencia nocturna/feriado.
5. Feriados 2026 y traslados.
6. Licencias (maternidad, paternidad, enfermedad, etc.).
7. Asignación familiar.
8. Bases de aguinaldo y vacaciones.
9. Descuentos autorizados y límites.
10. IRP.
11. Aportes patronales adicionales.
12. Provisiones contables.
13. Terminación e indemnizaciones.
14. Requisitos del recibo.
