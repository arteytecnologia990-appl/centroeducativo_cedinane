-- Revertir compromisos (se usa Ingresos)
drop table if exists public.compromisos;

-- Ingresos: servicios cobrados antes de la factura XML
create table if not exists public.ingresos (
  id uuid primary key default gen_random_uuid(),
  usuario text not null,
  documento text,
  terapia text not null,
  profesional text,
  precio_unitario numeric(14,2) not null default 0,
  cantidad numeric(10,2) not null default 1,
  total numeric(14,2) not null default 0,
  met_pago text,
  factura_cdc text references public.facturas(cdc) on delete set null,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create index if not exists ingresos_documento_idx on public.ingresos (documento);

alter table public.ingresos enable row level security;

drop policy if exists ingresos_all on public.ingresos;
create policy ingresos_all on public.ingresos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
