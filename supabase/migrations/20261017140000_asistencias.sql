-- Fase 1 · Asistencia (kiosco + registro manual)
create table if not exists public.asistencias (
  id             uuid primary key default gen_random_uuid(),
  persona_id     uuid not null references public.personas(id) on delete cascade,
  sede_id        uuid references public.sedes(id),
  fecha          date not null default (now() at time zone 'America/Asuncion')::date,
  hora_entrada   time,
  hora_salida    time,
  observacion    text,
  registrado_por uuid,
  origen         text not null default 'manual' check (origen in ('kiosco','manual')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.asistencias is 'Marcaciones de asistencia (entrada/salida) por persona y día.';

create index if not exists asistencias_persona_idx on public.asistencias (persona_id, fecha);
create index if not exists asistencias_fecha_idx on public.asistencias (fecha);

drop trigger if exists asistencias_updated_at on public.asistencias;
create trigger asistencias_updated_at before update on public.asistencias
  for each row execute function public.tocar_updated_at();

alter table public.asistencias enable row level security;

drop policy if exists asistencias_select on public.asistencias;
create policy asistencias_select on public.asistencias for select to authenticated
  using (public.puede('asistencia','marcaciones','consultar'));

drop policy if exists asistencias_insert on public.asistencias;
create policy asistencias_insert on public.asistencias for insert to authenticated
  with check (public.puede('asistencia','marcaciones','crear'));

drop policy if exists asistencias_update on public.asistencias;
create policy asistencias_update on public.asistencias for update to authenticated
  using (public.puede('asistencia','marcaciones','actualizar'))
  with check (public.puede('asistencia','marcaciones','actualizar'));

drop policy if exists asistencias_delete on public.asistencias;
create policy asistencias_delete on public.asistencias for delete to authenticated
  using (public.puede('asistencia','marcaciones','eliminar'));

-- PIN de kiosco (hash) por persona
alter table public.personas add column if not exists pin_hash text;
