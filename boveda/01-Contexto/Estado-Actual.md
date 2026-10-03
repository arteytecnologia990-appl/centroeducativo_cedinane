---
tipo: estado
actualizado: 2026-10-03
tags:
  - estado
---

# Estado actual y preguntas abiertas

> [!note] Regla de oro
> Se actualiza **al final de cada sesión**. Si está desactualizado, la siguiente sesión empieza ciega.

**Última actualización:** 2026-10-03 (fin de sesión 3: servicios conectados)
**Fase del producto:** 1 — base, RBAC, personas, horarios, asistencia, horas pagables.
**Momento:** repositorio materializado **y conectado** ✅ — listo para la primera migración.

## Hecho

- **Bóveda** migrada a `boveda/` (58 notas, enlaces resueltos); legado en `90-Archivo/`.
- **Scaffold Next.js 16.3.8** (App Router, TS estricto, Tailwind v4) + shadcn/ui (23 componentes) + Supabase/TanStack/Zod/Vitest.
- **Verificado**: `typecheck` ✅, `lint` ✅, `test` ✅, `build` ✅.
- **GitHub**: 3 commits en `main`, sincronizado con `origin` (`fff4a70`, `7b4a8df`, `3d754c0`). Push funcionando.
- **Supabase**: sesión iniciada, proyecto **enlazado** (`znknfjujmhbgwywpuzyq`) y `src/types/database.ts` **generado** (sin Docker).
- **`.env.local`** completo: URL + anon + service_role (gitignorado).
- **Vercel**: proyecto `centroeducativo` (team `centroeducativo-cedinane`) enlazado localmente (`.vercel/project.json`).

## Pendiente

| Qué | Estado | Cómo se resuelve |
| --- | --- | --- |
| Vercel ↔ GitHub (auto-deploy) | ❌ falló la conexión | Ver "Arreglo de Vercel" abajo |
| Claves de Supabase en Vercel | ⏳ pendiente | Cargarlas en el dashboard (Production/Preview) |
| Primera migración + auth | ⏳ siguiente paso | Ver abajo |
| `VERCEL_OIDC_TOKEN` en `.env.local` | perdido (lo sobrescribió el `Copy-Item`) | opcional: `vercel env pull` |

### Arreglo de Vercel ↔ GitHub

Vercel no pudo conectar `arteytecnologia990-appl/centroeducativo_cedinane`. Causa típica: la **app de GitHub de Vercel** no tiene permiso sobre ese repositorio/organización. Solución:

1. Autorizar la app: <https://github.com/apps/vercel> → *Configure* → dar acceso a `arteytecnologia990-appl/centroeducativo_cedinane` (o a la organización).
2. Luego, en Vercel: proyecto `centroeducativo` → **Settings → Git → Connect Git Repository** → elegir el repo.
3. Cargar en Vercel (Settings → Environment Variables) las mismas claves de `.env.local` (URL, anon, service_role) para Production y Preview.

## Siguiente paso (próxima sesión)

1. Primera migración en `supabase/migrations/`: `sedes`, `personas`, `persona_roles`, `persona_relaciones`, `usuarios`, `roles`, `modulos_pantallas`, `permisos_rol` + RLS por sede → [[Modelo-de-Datos]], [[RBAC-y-RLS]].
2. Aplicarla y regenerar tipos: `pnpm db:push` + `pnpm db:types` (o `db:reset` cuando haya Docker).
3. Autenticación + clientes Supabase (`src/lib/supabase/*`) → prompt [[Fase-1-Base]].
4. `seed.sql` con datos ficticios: 2 sedes, módulos/pantallas, roles y permisos.

## Preguntas abiertas (fase 1)

- 🟡 **Q-02** Kiosco: ¿PIN por persona o compartido por sede? ¿sin conexión (IndexedDB)?
- 🟡 **Q-03** ¿El reloj ZKTime existe ya o es a futuro?
- 🟡 **Q-04** ¿Facturación Ekuatia'i/DNIT-SET en fase 2 o 3?
- 🟡 **Q-05** ¿Modalidades de pago del personal: solo fijo + por hora, o mixtas/por paciente?
- ✅ **Q-01** Token/Docker para Supabase → resuelto (login + link + gen types funcionan sin Docker).

## Nota para quien retome

Abrir Obsidian apuntando a `boveda/` (no a la raíz del repo). Entorno y problemas conocidos → [[Entorno-Local]].
