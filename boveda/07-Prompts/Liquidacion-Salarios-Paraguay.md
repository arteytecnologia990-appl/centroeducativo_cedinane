---
tipo: prompt
rol: liquidacion-salarios
actualizado: 2026-10-20
tags:
  - prompt
  - salarios
  - paraguay
---

# Liquidación de salarios (Paraguay) — datos que necesito

Prompt para juntar los parámetros y conceptos legales antes de implementar el cálculo de **haber y debe** (bruto → descuentos → neto).

## Objetivo

Implementar en el sistema el cálculo de la liquidación mensual de salarios según la ley paraguaya, con **conceptos de pago** (haber) y **descuentos** (debe), y que el resultado se pueda revisar, imprimir y exportar.

## Qué necesito que investigues

Para cada punto: **valor**, **base de cálculo**, **si es obligatorio**, **vigencia (2026)** y **fuente** (ley / artículo / resolución).

### A. Jornada y tiempo
1. Horas semanales legales (ejemplo: 48).
2. Horas diarias y distribución (¿lunes a viernes 8 h y sábado 4 h?).
3. Jornada nocturna: franja horaria y recargo.
4. Descanso semanal / domingo.
5. Horas extras: recargo por tipo de día (hábil, sábado, domingo, feriado, nocturna) y tope.
6. Ausencias: ¿cómo se descuenta? (día = sueldo / 30; hora = sueldo / 240 u otra base).

### B. Haberes (pagos)
7. **Salario mínimo legal vigente 2026** (mensual y por hora).
8. Composición del salario (base, bonificaciones, comisiones, gratificaciones).
9. **Aguinaldo**: base de cálculo, proporcionalidad, fecha límite de pago.
10. **Vacaciones**: días según antigüedad, pago, proporcional.
11. **Feriados nacionales 2026** (lista) y cómo se pagan.
12. **Licencias**: maternidad, paternidad, enfermedad, duelo, matrimonio, examen (duración y pago).
13. **Asignación familiar** (si existe): monto, requisitos, base.
14. Indemnización por despido (si aplica al cálculo).
15. Conceptos **no remunerativos** (viáticos, etc.) que no integran la base.

### C. Descuentos (debe)
16. **IPS obrero**: porcentaje, base imponible, tope máximo, conceptos incluidos/excluidos.
17. **IPS patronal**: porcentaje (costo del empleador).
18. **IRP (Impuesto a la Renta Personal)**: tramos, tasas, mínimo no imponible, deducciones admitidas y cómo se retiene mensualmente.
19. Adelantos y préstamos: cómo se registran y descuentan.
20. Embargos / sindicato / cooperativa / seguro: porcentajes y límites.
21. Otros descuentos habituales en Paraguay.

### D. Aportes patronales
22. IPS patronal y otros aportes obligatorios del empleador.
23. Provisiones (aguinaldo, vacaciones) si se quieren calcular.

## Formato en que me los pasás

| Concepto | Valor | Base de cálculo | Obligatorio | Vigencia | Fuente (ley/artículo) |
| --- | --- | --- | --- | --- | --- |
| Ej.: IPS obrero | 9 % | Salario bruto | Sí | 2026 | Ley … |

Y para las listas (feriados, tramos IRP, licencias), una tabla aparte.

## Fuentes sugeridas

- **Código Laboral** (Ley 213/93) y sus modificaciones.
- **MTESS** (Ministerio de Trabajo) — salario mínimo y resoluciones.
- **IPS** — aportes y topes.
- **SET / DNIT** — IRP (tramos, deducciones, formulario).
- Leyes de presupuesto / mínimo vigente 2026.

## Modelo de datos propuesto (para que sepas dónde va cada dato)

- `conceptos_salario`: código, nombre, tipo (`haber` | `debe`), base (`bruto` | `minimo` | `fijo`), fórmula/porcentaje, vigencia.
- `novedades`: por persona y período (horas extras, ausencias, feriados, licencias, adelantos).
- `liquidaciones`: período, persona, total haberes, total descuentos, neto, estado (borrador/confirmada).
- `liquidacion_detalle`: concepto + monto (para imprimir el recibo).

## Reglas de negocio a confirmar

- ¿El sueldo es **mensual fijo**, **por hora** o **jornal**?
- ¿Las horas extras se cargan desde asistencia u horario?
- ¿El descuento por ausencia es por **día** o por **hora**?
- ¿Se liquida **quincenal** o **mensual**?
- ¿Quién firma/valida la liquidación?

---

> Con esos datos armo el motor de cálculo, el recibo imprimible y el reporte Excel/PDF, respetando la regla de reportes de Talento Humano.
