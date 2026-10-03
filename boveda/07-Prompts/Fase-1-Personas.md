---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · Personas

**Adjuntar:** [[Modelo-de-Datos]] · [[Reglas-Paraguay]] · [[Glosario]]

```text
# TAREA
Construir el núcleo de identidad: tablas personas, persona_roles y persona_relaciones,
con validación de CI paraguaya (src/lib/validation/ci.ts), y el módulo src/features/personas
(lista, alta, ficha, vínculos).

# CONTEXTO
Una persona acumula roles de negocio (profesional, empleado, alumno, paciente, tutor,
proveedor, cliente) y se relaciona con otras (tutor ↔ alumno/paciente).
CI UNIQUE, no PK; PK UUID. Nada se borra (deleted_at).

# ENTREGABLE
- Migración de personas + persona_roles + persona_relaciones
- Esquemas Zod y Server Actions de alta/edición
- Pantallas (dashboard)/personas

# NO HACER
- No usar la CI como clave primaria ni guardarla con formato.
```
