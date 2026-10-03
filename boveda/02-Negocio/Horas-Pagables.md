---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
---

# Horas pagables

Cálculo de cuánto se le paga al personal, a partir de la asistencia y de reglas **configurables** (nunca hardcodeadas).

## Modalidades de personal

| Modalidad | Cálculo |
| --- | --- |
| **Salario fijo mensual** | Importe mensual acordado; la asistencia alimenta control/descuentos |
| **Por hora trabajada** | `horas × tarifa`, con reglas de redondeo y tolerancias |

## Reglas (configurables, con vigencia)

1. **Tarifa por hora** vive en una tabla con **vigencia** (`tarifas_hora`): si cambia, no altera periodos ya liquidados.
2. **Tolerancias**: minutos de gracia al inicio/fin antes de contar como llegada tarde o salida anticipada.
3. **Redondeo**: regla explícita (al minuto, a 5, 15 o 30 minutos) y cómo se redondea (arriba/abajo/más cercano).
4. **Feriados y horas extra**: política configurable → [[Reglas-Paraguay]].
5. Todo importe en **`bigint` PYG** → [[Zona-Horaria-y-Moneda]].

## Relación con el resto

- Las horas se obtienen de `asistencias_diarias` ([[Asistencia]]), comparadas con el horario esperado ([[Horarios]]).
- La liquidación es una operación **de dominio puro**: vive en `src/features/horas-pagables/services/` y se prueba sin base de datos → [[Pruebas]].
- Nada de la regla va en el componente ni en el Server Action: va en tablas de configuración con vigencia → [[Modelo-de-Datos]].

## Preguntas

- [ ] ¿Hay modalidad mixta o pago por paciente atendido? → [[Estado-Actual]] Q-05
- [ ] ¿Periodo de liquidación: semanal, quincenal o mensual?
- [ ] ¿Se descuentan tardanzas o solo se informan?
- [ ] ¿Quién aprueba la liquidación antes de pagar?
