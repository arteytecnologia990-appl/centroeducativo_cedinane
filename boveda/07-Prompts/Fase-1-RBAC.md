---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · RBAC y permisos

**Adjuntar:** [[RBAC-y-RLS]] · [[Multisede]] · [[Seguridad-y-Datos]]

```text
# TAREA
Implementar RBAC dinámico: migración de tablas (roles, modulos_pantallas, permisos_rol),
políticas RLS por sede en las tablas sensibles, y el control de acceso en Server Actions
(consultar/crear/actualizar/eliminar; es_admin_general omite permisos).

# CONTEXTO
Permisos = (rol × pantalla × sede). Un usuario puede tener permisos distintos por sede.
RLS filtra por las sedes a las que el usuario tiene acceso.

# ENTREGABLE
- Migraciones SQL (español snake_case) en supabase/migrations/
- tests/rls (pgTAP) del aislamiento por sede
- helper src/lib/auth para evaluar permisos en el servidor

# NO HACER
- No confiar en ocultar botones en la UI; la autoridad es servidor + RLS.
```
