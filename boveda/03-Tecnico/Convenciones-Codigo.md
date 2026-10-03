---
tipo: convenciones
actualizado: 2026-10-03
tags:
  - tecnico
  - convenciones
---

# Convenciones de código

## Idioma

- **Notas, documentación, commits, UI y mensajes de error:** español.
- **Código** (variables, funciones, clases, tablas en TypeScript): **inglés**, nombres explícitos, sin spanglish (`getStudent`, no `getAlumno`).
- El puente entre ambos es [[Glosario]].

## Nombres de archivos y carpetas

- Carpetas y archivos **kebab-case**, sin acentos ni `ñ` (`horas-pagables/`, `registrar-marcacion.ts`).
- Componentes React: archivo kebab-case, export **PascalCase** (`selector-sede.tsx` → `SelectorSede`).
- Hooks: `use-*.ts` (`use-asistencias.ts`).
- Server Actions: verbo + sustantivo en camelCase (`registrarMarcacion`, `corregirAsistencia`).
- Esquemas Zod: PascalCase + sufijo `Schema` (`PersonaSchema`).

## Estructura por funcionalidad

Cada módulo en `src/features/<modulo>/` sigue la forma fija: `components/` · `actions/` · `schemas/` · `queries/` · `services/` · `hooks/` · `types.ts` · `index.ts`. Detalle → [[Estructura-Carpetas]].

## Reglas de escritura

1. **Zod antes de tocar la BD**: toda Server Action valida su entrada.
2. **Lógica de dominio en `services/`** (pura, testeable), **acceso a datos en `queries/`**.
3. **Zona horaria y moneda** solo vía `src/lib/tz` y `src/lib/format` → [[Zona-Horaria-y-Moneda]].
4. **Permisos en el servidor**; RLS en la BD → [[RBAC-y-RLS]].
5. **Nada hardcodeado**: tolerancias, tarifas y reglas en tablas con vigencia → [[Modelo-de-Datos]].
6. **Next.js 16**: antes de escribir, leer la guía en `node_modules/next/dist/docs/` (ver `AGENTS.md`). Heed deprecations (`next lint` ya no existe).

## Definición de "terminado"

1. Funciona y se probó (salida real, no supuesta).
2. Documentado en la bóveda si cambia comportamiento o arquitectura.
3. Sin `#pendiente` sin dueño.
4. Si tocó una decisión previa, hay ADR nuevo en `05-Decisiones/`.

## Ramas y commits

- Ramas: `tipo/kebab-case` → `feat/rbac-permisos-por-sede`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`.
- Commits convencionales en español, scope = módulo: `feat(asistencia): registrar marcación desde kiosco`.
- Un commit = un cambio coherente.

## Relacionado

- [[Estructura-Carpetas]] · [[Glosario]] · [[Zona-Horaria-y-Moneda]]
