-- Programas por persona (muchos a muchos, no solo empleados)
create table if not exists public.persona_programas (
  persona_id uuid not null references public.personas(id) on delete cascade,
  programa_id uuid not null references public.programas(id) on delete cascade,
  primary key (persona_id, programa_id)
);

-- Migrar lo que ya estaba en personal.programa_id
insert into public.persona_programas (persona_id, programa_id)
select persona_id, programa_id from public.personal where programa_id is not null
on conflict do nothing;

alter table public.persona_programas enable row level security;

drop policy if exists persona_programas_all on public.persona_programas;
create policy persona_programas_all on public.persona_programas for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
