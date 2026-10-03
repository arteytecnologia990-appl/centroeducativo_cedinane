---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · Horas pagables

**Adjuntar:** [[Horas-Pagables]] · [[Modelo-de-Datos]] · [[Zona-Horaria-y-Moneda]]

```text
# TAREA
Implementar horas pagables: modalidades (salario fijo / por hora), tarifas_hora y
configuraciones con vigencia, y el service de cálculo (horas × tarifa, redondeo y
tolerancias configurables) en src/features/horas-pagables/services/.

# CONTEXTO
Todo importe en bigint PYG. Reglas nunca hardcodeadas: viven en tablas con vigencia.
El cálculo es dominio puro: se prueba sin base de datos.

# ENTREGABLE
- Migración de modalidades, tarifas_hora y configuraciones
- Service de cálculo + tests Vitest (casos de redondeo y tolerancias)
- Pantalla de consulta/liquidación (solo lectura inicial)

# NO HACER
- No usar float para dinero; no hardcodear tolerancias ni redondeos.
```
