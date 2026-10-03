---
tipo: prompt
actualizado: 2026-10-03
tags:
  - prompt
---

# Plantilla de prompt por tarea

> Objetivo: **cargar poco contexto**. Se pega el encabezado y se adjuntan solo las notas de la tabla "tarea → notas" de [[00-Inicio]].

## Encabezado estándar

```text
# ROL
Actúa como [Lead Software Architect / Senior Full-Stack Developer].

# TAREA
[Una frase: qué construir o corregir, y dónde.]

# CONTEXTO (adjuntar estas notas)
- [Nota 1] → [qué aporta]
- [Nota 2] → [qué aporta]

# REGLAS QUE NO SE PUEDEN VIOLAR
- Stack: Next.js 16 (App Router, Server Actions) + TS estricto + Tailwind/shadcn + Supabase + TanStack Query + Zod.
- Antes de escribir código Next, leer la guía en node_modules/next/dist/docs/ (ver AGENTS.md).
- BD en español snake_case; código en camelCase; PK UUID; CI UNIQUE no PK; sede_id en toda tabla de negocio.
- UTC en BD, America/Asuncion en presentación; PYG en bigint; nada hardcodeado (tablas con vigencia).
- Zod antes de tocar la BD; lógica pura en services/; permisos en servidor + RLS.

# ENTREGABLE
[Exactamente qué archivos y qué resultado.]

# NO HACER
- No escribir lógica fuera del alcance de esta tarea.
- No inventar tecnologías fuera del stack.
```

## Cuándo crear un prompt nuevo

Cuando una fase o tarea se repita (misma tarea en otro módulo, o arranque de fase), se crea su nota en `07-Prompts/` para no reescribir el contexto cada vez.
