-- Catálogo de cargos (Nombre + Descripción)
create table if not exists public.cargos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Cargar los cargos ya usados en las fichas de personal
insert into public.cargos (nombre)
select distinct trim(cargo) from public.personal
where cargo is not null and trim(cargo) <> ''
on conflict (nombre) do nothing;

alter table public.cargos enable row level security;

drop policy if exists cargos_all on public.cargos;
create policy cargos_all on public.cargos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
