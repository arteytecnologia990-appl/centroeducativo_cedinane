# Migraciones — Supabase

## Convención

- Nombre: `YYYYMMDDHHMMSS_descripcion_snake_case.sql`.
- SQL en **español `snake_case`**; tablas en plural.
- PK `id` UUID; FK `<singular>_id`; `sede_id` en toda tabla de negocio.
- `timestamptz` (UTC) para instantes; `bigint` para PYG.
- `created_at`/`updated_at` por defecto; baja lógica con `deleted_at`.
- `enable row level security` + políticas por sede/rol en toda tabla sensible.

Guía completa: `boveda/03-Tecnico/Modelo-de-Datos.md` y `boveda/08-Plantillas/Plantilla-Migracion.md`.

## Comandos (requieren Docker local o token de Supabase)

```powershell
corepack pnpm dlx supabase migration new <descripcion>   # crea archivo nuevo
corepack pnpm db:reset                                    # aplica migraciones + seed (Docker)
corepack pnpm db:types                                    # regenera src/types/database.ts (linked)
```
