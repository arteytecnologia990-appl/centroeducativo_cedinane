-- Compromisos: ingresos por servicio antes de tener la factura XML
create table if not exists public.compromisos (
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

create index if not exists compromisos_documento_idx on public.compromisos (documento);

alter table public.compromisos enable row level security;

drop policy if exists compromisos_all on public.compromisos;
create policy compromisos_all on public.compromisos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
