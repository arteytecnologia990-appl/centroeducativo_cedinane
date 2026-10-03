---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · Asistencia

**Adjuntar:** [[Asistencia]] · [[Zona-Horaria-y-Moneda]] · [[Multisede]]

```text
# TAREA
Implementar asistencia: migración de marcaciones / asistencias_diarias / correcciones_asistencia,
el kiosco público /kiosco-asistencia (CI + PIN, Server Action protegida), el registro manual
para pacientes/alumnos y el cálculo del día (asistencias_diarias) desde las marcaciones.

# CONTEXTO
Origen de marcación: kiosco_web | manual | zkteco | importacion. El "día" se define en
America/Asuncion. Nada se edita en su lugar: correcciones = fila nueva con auditoría.

# ENTREGABLE
- Migraciones + políticas RLS por sede
- Kiosco (pantalla sin sesión, teclado numérico, confirmación)
- Service src/features/asistencia/services/ que calcula el día (testeable)

# NO HACER
- No reescribir marcaciones originales; no asumir 0 en faltas de datos.
```
