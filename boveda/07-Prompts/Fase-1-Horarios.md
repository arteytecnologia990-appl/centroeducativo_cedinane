---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · Horarios

**Adjuntar:** [[Horarios]] · [[Modelo-de-Datos]] · [[Multisede]]

```text
# TAREA
Implementar horarios: tablas plantillas_horario, bloques_horario y asignaciones_horario
(creables por sede, asignables a cualquier persona, con vigencia), y el módulo
src/features/horarios con el editor de bloques.

# CONTEXTO
Bloques = día de la semana + hora local (America/Asuncion). Vigencia desde/hasta.
Solapamientos se avisan, no bloquean (salvo que se configure).

# ENTREGABLE
- Migración de horarios
- Editor de plantilla y bloques (shadcn)
- Validación Zod de bloques y solapamientos

# NO HACER
- No guardar horas como instantes UTC sin zona para el patrón semanal.
```
