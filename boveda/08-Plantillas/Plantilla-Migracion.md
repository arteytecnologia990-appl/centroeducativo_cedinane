---
tipo: plantilla
actualizado: 2026-10-03
tags:
  - plantilla
---

# Plantilla — Migración (Supabase)

- **Nombre de archivo:** `YYYYMMDDHHMMSS_descripcion_snake_case.sql` en `supabase/migrations/`.
- **Idioma:** objetos en español `snake_case`.
- **Reglas:** PK UUID; FK `<singular>_id`; `sede_id` en tablas de negocio; `timestamptz` para instantes; `bigint` para PYG; `created_at/updated_at` por defecto; baja lógica `deleted_at`; nada se borra.

```sql
-- descripcion de la migracion
create table if not exists public.xxx (
  id uuid primary key default gen_random_uuid(),
  sede_id uuid not null references public.sedes(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.xxx enable row level security;

-- política por sede (completar según RBAC)
-- create policy "..." on public.xxx for select using ( ... );
```

## Checklist

- [ ] Índices únicos donde corresponda (CI `unique` en personas)
- [ ] `enable row level security` + políticas
- [ ] `grant`/permisos si se usan roles de Postgres
- [ ] Probar con `supabase db reset` (requiere Docker → [[Entorno-Local]])
