---
tipo: tecnico
actualizado: 2026-10-03
tags:
  - tecnico
  - seguridad
---

# RBAC y RLS

Control de acceso en dos niveles: **aplicación** (qué pantallas y botones se ven) y **base de datos** (qué filas se pueden leer/escribir). La aplicación orienta; la BD es la que manda.

## Dos conceptos de "rol" (no confundir)

| Concepto | Tabla | Significado |
| --- | --- | --- |
| Rol de **negocio** | `persona_roles` | Qué es una persona: profesional, empleado, alumno, paciente, tutor, proveedor, cliente. No otorga permisos. |
| Rol de **acceso** (RBAC) | `roles` | Qué puede hacer un **usuario** en el sistema. Otorga permisos. |

Un usuario (persona que inicia sesión) tiene **uno o más roles de acceso**; su rol de negocio es independiente.

## RBAC dinámico

- `roles` — roles de acceso (admin, secretaría, profesional, etc.).
- `modulos_pantallas` — catálogo de módulos y pantallas.
- `permisos_rol` — cruce `(rol × pantalla)` con acciones: **consultar / crear / actualizar / eliminar**.
- `es_admin_general` (flag en el usuario) **omite** la evaluación de permisos: puede todo en todas las sedes.

**Regla:** los permisos se evalúan **acotados por sede**: `(rol × pantalla × sede)`. Un usuario puede tener permisos distintos en cada sede → [[Multisede]].

## RLS (Supabase / PostgreSQL)

- Habilitada en **todas** las tablas con datos de negocio.
- Políticas que filtran por las sedes a las que el usuario tiene acceso (vía JWT con los `sede_id` permitidos o una consulta a `permisos_rol`).
- El cliente **browser** usa `anon key` (siempre limitada por RLS); `service_role` solo en servidor (`src/lib/supabase/admin.ts`, marcado `server-only`) y nunca se expone al navegador.

## Middleware / proxy de Next.js

- A nivel de aplicación, un middleware (en Next 16 verificar si se llama `middleware.ts` o `proxy.ts` — consultar `node_modules/next/dist/docs/`) valida la sesión y redirige según el rol; el **filtrado real de datos** lo hace RLS, no el middleware.

## Reglas

1. Los permisos se comprueban **en el servidor** en cada Server Action; ocultar un botón en la UI no es seguridad.
2. `es_admin_general` es la única vía para saltarse permisos; se audita su uso.
3. Todo cambio de permisos o roles queda en auditoría → [[Seguridad-y-Datos]].

## Relacionado

- [[Seguridad-y-Datos]] · [[Multisede]] · [[Modelo-de-Datos]] · [[Pruebas]]
