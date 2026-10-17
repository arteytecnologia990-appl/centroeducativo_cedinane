-- Fase 1 · Horarios: bloques semanales por persona (día + franja horaria)
create table if not exists public.horarios (
  id             uuid primary key default gen_random_uuid(),
  sede_id        uuid not null references public.sedes(id),
  persona_id     uuid not null references public.personas(id) on delete cascade,
  dia_semana     smallint not null check (dia_semana between 1 and 7),
  hora_inicio    time not null,
  hora_fin       time not null,
  actividad      text,
  aula           text,
  vigente_desde  date,
  vigente_hasta  date,
  activo         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  constraint horario_horas_validas check (hora_fin > hora_inicio)
);
comment on table public.horarios is 'Bloques de horario semanales por persona (día + franja horaria).';

create index if not exists horarios_persona_idx on public.horarios (persona_id, dia_semana, hora_inicio);
create index if not exists horarios_sede_idx on public.horarios (sede_id, dia_semana, hora_inicio);

drop trigger if exists horarios_updated_at on public.horarios;
create trigger horarios_updated_at before update on public.horarios
  for each row execute function public.tocar_updated_at();

alter table public.horarios enable row level security;

drop policy if exists horarios_select on public.horarios;
create policy horarios_select on public.horarios for select to authenticated
  using (public.puede('horarios','asignaciones','consultar'));

drop policy if exists horarios_insert on public.horarios;
create policy horarios_insert on public.horarios for insert to authenticated
  with check (
    public.puede('horarios','asignaciones','crear')
    and sede_id in (select public.sedes_permitidas())
  );

drop policy if exists horarios_update on public.horarios;
create policy horarios_update on public.horarios for update to authenticated
  using (public.puede('horarios','asignaciones','actualizar'))
  with check (
    public.puede('horarios','asignaciones','actualizar')
    and sede_id in (select public.sedes_permitidas())
  );

drop policy if exists horarios_delete on public.horarios;
create policy horarios_delete on public.horarios for delete to authenticated
  using (public.puede('horarios','asignaciones','eliminar'));
