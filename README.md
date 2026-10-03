# Centro Educativo — Sistema de Gestión Integral

Sistema de gestión para un centro **educativo y terapéutico** en Paraguay, construido por fases.

- **Stack:** Next.js 16 (App Router) + TypeScript · Tailwind CSS + shadcn/ui · Supabase (PostgreSQL, Auth, RLS) · TanStack Query · Zod · Vercel + GitHub.
- **Fase 1:** base del sistema, RBAC granular, personas, horarios, asistencia y horas pagables.
- **Segundo cerebro:** abrir `boveda/` como bóveda en Obsidian y empezar por `boveda/00-Inicio.md`.

## Arranque

```powershell
corepack pnpm install   # pnpm vía corepack (ver boveda/01-Contexto/Entorno-Local.md)
corepack pnpm dev       # http://localhost:3000
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/app/` | Rutas: route groups `(auth)`, `(kiosco)`, `(dashboard)` y API |
| `src/features/` | Módulos por funcionalidad (`personas`, `seguridad`, `horarios`, `asistencia`, `horas-pagables`…) |
| `src/lib/` | `supabase`, `auth`, `tz`, `format`, `validation`, `constants`, `errors` |
| `src/types/` | `database.ts` (generado por Supabase CLI) |
| `supabase/` | `migrations/`, `seed.sql`, `tests/rls/` |
| `boveda/` | segundo cerebro (Obsidian) |
| `.github/` | CI y plantilla de PR |

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar las claves de Supabase. **Nunca** versionar secretos.

## Notas (Next.js 16)

- `src/proxy.ts` reemplaza al antiguo `middleware.ts`.
- Antes de escribir código, consultar `node_modules/next/dist/docs/` (lo exige `AGENTS.md`).
