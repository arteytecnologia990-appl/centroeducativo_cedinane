-- Detalle multi-línea del ingreso (varias terapias/profesionales)
create table if not exists public.ingreso_items (
  id uuid primary key default gen_random_uuid(),
  ingreso_id uuid not null references public.ingresos(id) on delete cascade,
  terapia text not null,
  profesional text,
  precio_unitario numeric(14,2) not null default 0,
  cantidad numeric(10,2) not null default 1,
  total numeric(14,2) not null default 0
);

create index if not exists ingreso_items_ingreso_idx on public.ingreso_items (ingreso_id);

alter table public.ingreso_items enable row level security;

drop policy if exists ingreso_items_all on public.ingreso_items;
create policy ingreso_items_all on public.ingreso_items for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
