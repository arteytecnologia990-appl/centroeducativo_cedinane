---
tipo: operacion
actualizado: 2026-10-03
tags:
  - operacion
  - pruebas
---

# Pruebas

Qué se prueba y con qué. Sin pruebas, el aislamiento por sede (RLS) y el cálculo de horas se rompen en silencio.

## Niveles

| Nivel | Herramienta | Qué cubre |
| --- | --- | --- |
| Lógica de dominio | **Vitest** | `src/features/*/services/`: cálculo de horas, redondeos, tolerancias, validación de CI |
| Base de datos / RLS | **pgTAP** | `supabase/tests/rls/`: que un usuario de una sede no vea datos de otra |
| Componentes (opcional) | Testing Library + Vitest | UI crítica (kiosco, tabla de asistencia) |

## Reglas

1. La lógica de negocio vive en `services/` **sin tocar la BD**, para poder probarla sin infraestructura.
2. Cada regla configurable tiene un test con los casos límite (p. ej. redondeo exacto en el cambio de hora).
3. Los tests de RLS se ejecutan contra una base local (`supabase db reset` + `supabase test db`) → requiere **Docker** (pendiente → [[Entorno-Local]]).
4. **Datos ficticios siempre**: nada de datos reales de alumnos/pacientes en pruebas ni en seeds.
5. El CI (`ci.yml`) corre: lint + typecheck + Vitest. El workflow `supabase.yml` valida migraciones y, cuando haya Docker, los tests de RLS.

## Pendiente

- [ ] Configurar `vitest.config.ts` y el script `test` en `package.json`.
- [ ] Primer test de ejemplo en `horas-pagables/services/` cuando exista el servicio.
- [ ] Tests pgTAP cuando Docker esté disponible o se enlace el proyecto.

## Relacionado

- [[RBAC-y-RLS]] · [[Entornos-y-Despliegue]] · [[Estructura-Carpetas]]
