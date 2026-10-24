-- Bancos y cuentas bancarias + datos de transferencia en cobros
create table if not exists public.bancos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cuentas_bancarias (
  id uuid primary key default gen_random_uuid(),
  banco_id uuid not null references public.bancos(id) on delete cascade,
  numero text not null,
  tipo text not null default 'caja_ahorro',
  titular text,
  moneda text not null default 'PYG',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists cuentas_bancarias_banco_idx on public.cuentas_bancarias (banco_id);

alter table public.cobros add column if not exists banco_id uuid references public.bancos(id) on delete set null;
alter table public.cobros add column if not exists cuenta_id uuid references public.cuentas_bancarias(id) on delete set null;
alter table public.cobros add column if not exists nro_transferencia text;

alter table public.bancos enable row level security;
alter table public.cuentas_bancarias enable row level security;

drop policy if exists bancos_all on public.bancos;
create policy bancos_all on public.bancos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists cuentas_bancarias_all on public.cuentas_bancarias;
create policy cuentas_bancarias_all on public.cuentas_bancarias for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
