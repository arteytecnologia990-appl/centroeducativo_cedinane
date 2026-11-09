-- Ítems de la factura (detalle del XML)
create table if not exists public.factura_items (
  id uuid primary key default gen_random_uuid(),
  factura_cdc text not null references public.facturas(cdc) on delete cascade,
  descripcion text not null,
  cantidad numeric(12,2) not null default 0,
  precio_unitario numeric(14,2) not null default 0,
  base_gravada numeric(14,2) not null default 0,
  iva numeric(14,2) not null default 0,
  orden int not null default 0
);

create index if not exists factura_items_cdc_idx on public.factura_items (factura_cdc);

alter table public.factura_items enable row level security;

drop policy if exists factura_items_all on public.factura_items;
create policy factura_items_all on public.factura_items for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
