-- Adelantos de salario (recibo Art. 236)
create sequence if not exists public.adelantos_numero_seq;

create table if not exists public.adelantos (
  id uuid primary key default gen_random_uuid(),
  numero integer not null default nextval('public.adelantos_numero_seq'),
  persona_id uuid not null references public.personas(id) on delete cascade,
  periodo text not null,
  fecha date not null default current_date,
  monto numeric(14,2) not null,
  concepto text not null default 'Adelanto de salario',
  caja_ahorro text,
  estado text not null default 'entregado',
  created_at timestamptz not null default now()
);

create index if not exists adelantos_persona_periodo_idx on public.adelantos (persona_id, periodo);

alter table public.adelantos enable row level security;

drop policy if exists adelantos_all on public.adelantos;
create policy adelantos_all on public.adelantos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

-- Caja de ahorro del empleado (para el recibo)
alter table public.personal add column if not exists caja_ahorro text;
