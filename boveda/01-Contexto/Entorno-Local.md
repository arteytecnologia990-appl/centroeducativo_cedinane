---
tipo: entorno
actualizado: 2026-10-03
tags:
  - entorno
  - operacion
---

# Entorno local y comandos

Comandos **verificados** y problemas conocidos. Cuando un comando funcione, se anota aquí literal; no se improvisa dos veces.

## Herramientas

| Herramienta | Estado | Ruta / versión |
| --- | --- | --- |
| Node.js | ✅ | `C:\Program Files\nodejs\node.exe` — v24.21.0 |
| pnpm | ✅ vía corepack | `corepack pnpm` — 12.8.1 (no hay binario global) |
| npm | ✅ | v11.19.0 |
| Git | ⚠️ fuera del PATH | `%LOCALAPPDATA%\Programs\Git\cmd\git.exe` — 2.56.0 |
| Docker | ❌ no instalado | bloquea `supabase start` / `db pull` local |
| gh (GitHub CLI) | ❌ no instalado | — |
| Vercel CLI | ❌ no instalado | se usa con `corepack pnpm dlx vercel` |
| Supabase CLI | ❌ no instalado | se usa con `corepack pnpm dlx supabase` |
| Python (sistema) | ❌ alias roto de la Store | no usar |
| Obsidian | ✅ | `C:\Program Files\Obsidian` — bóveda en `boveda/` |

## Comandos del proyecto

```powershell
# gestor de paquetes (sin corepack enable, que da EPERM en C:\Program Files\nodejs)
corepack pnpm install
corepack pnpm add <paquete>
corepack pnpm dlx <paquete>

# desarrollo / build / lint
corepack pnpm dev
corepack pnpm build
corepack pnpm lint

# git (ruta completa)
& "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe" <args>

# supabase CLI (sin instalación global)
corepack pnpm dlx supabase <cmd>

# vercel CLI
corepack pnpm dlx vercel <cmd>
```

## Problemas conocidos

**E-001 · `python` abre Microsoft Store.** El alias de `WindowsApps` no es un intérprete. No usar; para datos/documentos usar el Python del harness.

**E-002 · `git` no se reconoce.** Está instalado fuera del `PATH`. Usar la ruta completa de arriba o añadir `%LOCALAPPDATA%\Programs\Git\cmd` al `PATH` del usuario.

**E-003 · `pnpm` no se reconoce.** No hay binario global. `corepack enable` da `EPERM` (no se puede escribir en `C:\Program Files\nodejs` sin administrador). **Solución:** usar `corepack pnpm …` siempre; corepack descarga pnpm 12.8.1 y lo cachea.

**E-004 · Docker ausente.** `supabase start`, `db pull` y `gen types --local` no funcionan. Alternativas: `supabase gen types --project-ref <ref>` con `SUPABASE_ACCESS_TOKEN`, o instalar Docker. Hasta entonces las migraciones se escriben a mano en `supabase/migrations/`.

**E-005 · La bóveda de Obsidian cambió de ruta.** Ahora está en `boveda/`. Hay que reabrir Obsidian apuntando a esa carpeta (no a la raíz del repo). `Ctrl+R` recarga la bóveda.

**E-006 · Next.js 16 tiene cambios de ruptura.** Antes de escribir código, leer la guía en `node_modules/next/dist/docs/` (lo exige `AGENTS.md`). Ejemplo ya visto: `next lint` fue retirado; el script usa `eslint` directo.

**E-007 · El CLI de Supabase ignora los `.md` dentro de `supabase/migrations/`.** Síntoma: *"Skipping migration README.md... (file name must match pattern)"*. Solución: la documentación de migraciones vive en `supabase/README.md`, no dentro de `migrations/`.

**E-008 · Contar filas de la API con `@(...).Count` da un falso 1.** `@(Invoke-RestMethod ...).Count` devuelve 1 aunque haya N filas. Solución: `($resp | Measure-Object).Count`.
