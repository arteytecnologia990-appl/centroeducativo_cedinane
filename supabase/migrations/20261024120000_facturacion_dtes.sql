-- Facturación: DTEs importados y cobros por cliente
create table if not exists public.facturas (
  id uuid primary key default gen_random_uuid(),
  cdc text not null unique,
  estado text not null default 'Aprobado',
  numero_documento text,
  documento_receptor text not null,
  fecha_emision timestamptz,
  fecha_aprobacion timestamptz,
  monto_total numeric(14,2) not null default 0,
  periodo text,
  created_at timestamptz not null default now()
);

create index if not exists facturas_documento_idx on public.facturas (documento_receptor);

create table if not exists public.cobros (
  id uuid primary key default gen_random_uuid(),
  documento_receptor text not null,
  fecha date not null default current_date,
  monto numeric(14,2) not null,
  forma_pago text not null default 'efectivo',
  referencia text,
  created_at timestamptz not null default now()
);

create index if not exists cobros_documento_idx on public.cobros (documento_receptor);

alter table public.facturas enable row level security;
alter table public.cobros enable row level security;

drop policy if exists facturas_all on public.facturas;
create policy facturas_all on public.facturas for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists cobros_all on public.cobros;
create policy cobros_all on public.cobros for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
