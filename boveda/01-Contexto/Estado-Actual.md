---
tipo: estado
actualizado: 2026-10-03
tags:
  - estado
---

# Estado actual y preguntas abiertas

> [!note] Regla de oro
> Se actualiza **al final de cada sesión**. Si está desactualizado, la siguiente sesión empieza ciega.

**Última actualización:** 2026-10-03 (fin de sesión 2)
**Fase del producto:** 1 — base, RBAC, personas, horarios, asistencia, horas pagables.
**Momento:** repositorio materializado ✅ — falta conectar Supabase/remoto (requiere credenciales).

## Hecho (repositorio materializado)

- **Bóveda** migrada a `boveda/` con la estructura nueva (58 notas, enlaces resueltos); legado en `90-Archivo/`.
- **Scaffold Next.js 16.3.8** (App Router, TS estricto, Tailwind v4) en la raíz; `src/proxy.ts` (Next 16 renombró `middleware` → `proxy`).
- **pnpm 12.8.1** vía `corepack pnpm` + shim `%LOCALAPPDATA%\pnpm-bin\pnpm.cmd`.
- **Dependencias**: Supabase (js + ssr), TanStack Query, Zod 4, React Hook Form, Lucide, date-fns(-tz); dev: Vitest 5, Prettier, Testing Library, supabase CLI.
- **shadcn/ui** iniciado (Tailwind v4, `@base-ui/react`) con 23 componentes.
- **Árbol** `src/features` (9 módulos × 6 subcarpetas), `src/lib` (supabase/auth/tz/format/validation/constants/errors), `src/types`, route groups `(auth)/(kiosco)/(dashboard)` + API prevista.
- **supabase/**: config.toml, migrations/, seed.sql, tests/rls/, functions/.
- **CI**: `.github/workflows/ci.yml` (lint+typecheck+test) y `supabase.yml`; plantilla de PR; `.env.example`; `.prettierrc`; `vitest.config.mts`; scripts npm.
- **Verificado**: `typecheck` ✅, `lint` ✅ (0 problemas), `test` ✅ (passWithNoTests), `build` ✅ (compila y registra Proxy).
- **Git**: primer commit `fff4a70` en `main` (216 archivos), remote `origin` apuntando a `arteytecnologia990-appl/centroeducativo_cedinane`.

## Pendientes que requieren credenciales (no bloquean el código)

| Paso | Qué falta | Cómo se resuelve |
| --- | --- | --- |
| 🔴 `git push` | Autenticación de GitHub | `gh auth login`, o credenciales en Git Credential Manager, o un PAT |
| 🔴 `supabase link` + `gen types` | `SUPABASE_ACCESS_TOKEN` o Docker | Token personal (Dashboard > Access Tokens) o instalar Docker |
| 🟡 `vercel link` | Login de Vercel CLI | `corepack pnpm dlx vercel login` (team `centroeducativo-cedinane`) |

## Siguiente paso (próxima sesión)

1. Con token/Docker: `supabase link --project-ref znknfjujmhbgwywpuzyq` y `pnpm db:types`.
2. Primera migración: `personas`, `persona_roles`, `persona_relaciones`, `sedes`, `roles`, `modulos_pantallas`, `permisos_rol`, `usuarios` + RLS.
3. Fase 1 base: autenticación + clientes Supabase (`src/lib/supabase/*`) → prompt [[Fase-1-Base]].

## Preguntas abiertas (fase 1)

- 🔴 **Q-01** Token de Supabase o Docker (arriba).
- 🟡 **Q-02** Kiosco: ¿PIN por persona o compartido por sede? ¿sin conexión (IndexedDB)?
- 🟡 **Q-03** ¿El reloj ZKTime existe ya o es a futuro?
- 🟡 **Q-04** ¿Facturación Ekuatia'i/DNIT-SET en fase 2 o 3?
- 🟡 **Q-05** ¿Modalidades de pago del personal: solo fijo + por hora, o mixtas/por paciente?

## Nota para quien retome

Al abrir Obsidian, apuntar la bóveda a `boveda/` (no a la raíz del repo). Entorno y problemas conocidos → [[Entorno-Local]].
