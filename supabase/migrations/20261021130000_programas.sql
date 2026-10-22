-- Programas (proyectos) con logo y caja de ahorro
create table if not exists public.programas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  caja_ahorro text,
  logo text not null default '/logos/cedinane.png',
  ruc text,
  rtp text,
  resolucion text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.programas (nombre, logo, ruc, rtp, resolucion)
values
  ('Inclúyeme', '/logos/incluyeme.jpg', '80049699-0', '145628', 'Res. N° 006/2012'),
  ('CEDINANE', '/logos/cedinane.png', '80049699-0', '145628', null)
on conflict (nombre) do nothing;

alter table public.programas enable row level security;

drop policy if exists programas_all on public.programas;
create policy programas_all on public.programas for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

-- Programa asignado al empleado
alter table public.personal add column if not exists programa_id uuid references public.programas(id) on delete set null;
