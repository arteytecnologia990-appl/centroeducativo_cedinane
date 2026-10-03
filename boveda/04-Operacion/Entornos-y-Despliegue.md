---
tipo: operacion
actualizado: 2026-10-03
tags:
  - operacion
---

# Entornos y despliegue

## Entornos

| Entorno | Para qué | Datos | Infraestructura |
| --- | --- | --- | --- |
| **Local** | Desarrollar y probar | Ficticios (seed) | Next dev + Supabase local (Docker, pendiente) |
| **Preview** | Revisar PRs | Ficticios | Vercel preview + Supabase de desarrollo |
| **Producción** | Uso real | Reales | Vercel + Supabase producción |

> [!danger] Regla dura
> **Nunca** datos reales de alumnos/pacientes en local, preview ni en esta bóveda. Para probar, datos inventados; si hace falta realismo, anonimizar de forma irreversible.

## Servicios gestionados

- **Supabase** (PostgreSQL + Auth + Storage): base de datos y autenticación.
- **Vercel**: hosting del frontend (Next.js) y previews por PR.
- **GitHub**: repositorio y CI.

## Copias de seguridad

1. Supabase tiene respaldo gestionado, pero **no sustituye** un plan de restauración propio.
2. Antes de cada migración destructiva: `pg_dump` o exportación de Supabase.
3. Una copia que nunca se restauró **no es una copia**: probar la restauración.
4. Los datos de producción nunca se exportan a local → [[Seguridad-y-Datos]].

## Despliegue (checklist)

- [ ] `corepack pnpm build` pasa en CI (lint + typecheck + tests)
- [ ] Migraciones aplicadas en el entorno de destino
- [ ] Variables de entorno cargadas (Vercel / Supabase)
- [ ] Copia de seguridad previa verificada
- [ ] Probar un flujo real de punta a punta (entrar, ver un alumno/paciente, registrar algo)
- [ ] Anotar versión y fecha abajo

## Registro de despliegues

| Fecha | Versión | Entorno | Cambios | Quién |
| --- | --- | --- | --- | --- |
| — | — | — | *sin despliegues* | — |

## Pendiente

- [ ] `corepack pnpm dlx vercel link` (team `centroeducativo-cedinane`) — requiere CLI y login.
- [ ] `supabase link` con token o Docker → [[Estado-Actual]] Q-01.

## Relacionado

- [[Entorno-Local]] · [[Seguridad-y-Datos]] · [[Pruebas]]
