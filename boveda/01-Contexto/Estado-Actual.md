---
tipo: estado
actualizado: 2026-10-03
tags:
  - estado
---

# Estado actual y preguntas abiertas

> [!danger] Regla vigente · Coste cero obligatorio
> **Solo planes gratuitos durante el desarrollo** (Supabase Free, GitHub Free, Vercel **Hobby**) → [[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]].
> Prohibido activar planes de pago o añadir métodos de pago. Si algo amenaza con costar, se detiene y se consulta.

> [!note] Regla de oro
> Este archivo se actualiza **al final de cada sesión**. Si está desactualizado, la siguiente sesión empieza ciega.

**Última actualización:** 2026-10-03 (sesión 4: primera migración aplicada)
**Fase del producto:** 1 — base, RBAC, personas, horarios, asistencia, horas pagables.
**Momento:** base de la aplicación **aplicada** (clientes Supabase, sesión en proxy, login, layouts) ✅ — falta el primer usuario administrador.

## Hecho

- **Bóveda** migrada a `boveda/` (60 notas, enlaces resueltos); legado en `90-Archivo/`.
- **Scaffold Next.js 16.3.8** + shadcn/ui (23 componentes) + Supabase/TanStack/Zod/Vitest.
- **Verificado**: `typecheck` ✅, `lint` ✅, `test` ✅, `build` ✅.
- **GitHub**: sincronizado; push funcionando.
- **Supabase**: enlazado.
- **Primera migración aplicada** (`20261003120000_crear_nucleo_personas_seguridad.sql`):
  - Tablas: `sedes`, `personas`, `persona_roles`, `persona_relaciones`, `roles`, `modulos_pantallas`, `usuarios`, `usuario_roles`, `permisos_rol`.
  - Helpers: `usuario_actual_id()`, `es_admin_general()`, `sedes_permitidas()`, `puede(modulo, pantalla, accion, sede)`.
  - **RLS activo** en las 9 tablas, con políticas por pantalla y por sede.
  - Catálogos sembrados: **2 sedes · 5 roles · 15 pantallas · 63 permisos**.
- **Tipos regenerados**: `src/types/database.ts` (608 líneas, 9 tablas) — sin Docker.
- **Verificado contra la API real** con `service_role`: sedes, roles, pantallas y permisos responden.

## Servicios y costo (verificado)

| Servicio | Plan | Costo | Uso |
| --- | --- | --- | --- |
| Supabase | Free | 0 | ✅ Base de datos, Auth, RLS |
| GitHub | Free | 0 | ✅ Repositorio |
| GitHub Actions | Free (cupo) | 0 | ✅ CI |
| Vercel | Team `centroeducativo-cedinane` → **hobby** | 0 | ✅ Conectado; previews gratis |
| Pro / add-ons | — | 💰 | 🚫 Prohibido ([[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]]) |

## Pendiente

| Qué | Estado |
| --- | --- |
| Clientes de Supabase (`src/lib/supabase/*`) + auth | ⏳ siguiente |
| Seed de **personas y usuario admin** ficticios | ⏳ después de auth |
| `usuario_roles` / `personas`: 0 filas (aún sin usuarios) | esperado |

## Siguiente paso (próxima sesión)

1. **Base de la aplicación** ([[Fase-1-Base]]): clientes Supabase (browser/server/admin), `src/proxy.ts` con refresco de sesión, route groups y providers de TanStack Query.
2. **Primer usuario admin**: crear la persona + usuario con `es_admin_general` y su rol (vía panel de Supabase Auth o API admin).
3. `seed.sql` con datos ficticios (personas, docentes, grupos).
4. Pruebas de RLS con pgTAP (requiere Docker → [[Entorno-Local]] E-004).

## Preguntas abiertas (fase 1)

- 🟡 **Q-02** Kiosco: ¿PIN por persona o compartido por sede? ¿sin conexión (IndexedDB)?
- 🟡 **Q-03** ¿El reloj ZKTime existe ya o es a futuro?
- 🟡 **Q-04** ¿Facturación Ekuatia'i/DNIT-SET en fase 2 o 3?
- 🟡 **Q-05** ¿Modalidades de pago del personal: solo fijo + por hora, o mixtas/por paciente?
- ✅ **Q-01** Supabase sin Docker → resuelto.

## Nota para quien retome

Abrir Obsidian apuntando a `boveda/`. Entorno y problemas conocidos → [[Entorno-Local]]. Esquema de datos → [[Modelo-de-Datos]].
