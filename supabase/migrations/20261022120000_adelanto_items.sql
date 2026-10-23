-- Detalle de conceptos de un adelanto (varias sesiones en la misma semana)
create table if not exists public.adelanto_items (
  id uuid primary key default gen_random_uuid(),
  adelanto_id uuid not null references public.adelantos(id) on delete cascade,
  sesion_id uuid references public.sesiones(id) on delete set null,
  descripcion text not null,
  cantidad numeric(10,2) not null default 0,
  monto_unitario numeric(14,2) not null default 0,
  porc_profesional numeric(5,2) not null default 0,
  bruto numeric(14,2) not null default 0
);

create index if not exists adelanto_items_adelanto_idx on public.adelanto_items (adelanto_id);

alter table public.adelanto_items enable row level security;

drop policy if exists adelanto_items_all on public.adelanto_items;
create policy adelanto_items_all on public.adelanto_items for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
