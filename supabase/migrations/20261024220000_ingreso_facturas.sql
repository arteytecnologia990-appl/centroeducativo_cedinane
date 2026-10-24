-- Varias facturas por ingreso
create table if not exists public.ingreso_facturas (
  id uuid primary key default gen_random_uuid(),
  ingreso_id uuid not null references public.ingresos(id) on delete cascade,
  factura_cdc text not null references public.facturas(cdc) on delete cascade,
  created_at timestamptz not null default now(),
  unique (ingreso_id, factura_cdc)
);

create index if not exists ingreso_facturas_ingreso_idx on public.ingreso_facturas (ingreso_id);

alter table public.ingreso_facturas enable row level security;

drop policy if exists ingreso_facturas_all on public.ingreso_facturas;
create policy ingreso_facturas_all on public.ingreso_facturas for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
