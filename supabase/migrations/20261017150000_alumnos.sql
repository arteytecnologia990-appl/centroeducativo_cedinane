-- Fase 1 · Datos del alumno (1:1 con personas)
create table if not exists public.alumnos (
  id                    uuid primary key default gen_random_uuid(),
  persona_id            uuid not null unique references public.personas(id) on delete cascade,
  sede_id               uuid references public.sedes(id),
  nacionalidad          text,
  turno                 text,
  rue                   boolean not null default false,
  beca                  numeric(5, 3),
  presupuesto_ingreso   numeric(14, 2),
  matricula             numeric(14, 2),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz
);
comment on table public.alumnos is 'Datos del alumno, 1:1 con personas (matriculación, beca, RUE, etc.).';

create index if not exists alumnos_sede_idx on public.alumnos (sede_id);

drop trigger if exists alumnos_updated_at on public.alumnos;
create trigger alumnos_updated_at before update on public.alumnos
  for each row execute function public.tocar_updated_at();

alter table public.alumnos enable row level security;

drop policy if exists alumnos_select on public.alumnos;
create policy alumnos_select on public.alumnos for select to authenticated
  using (public.puede('personas','ficha','consultar'));

drop policy if exists alumnos_insert on public.alumnos;
create policy alumnos_insert on public.alumnos for insert to authenticated
  with check (public.puede('personas','ficha','crear'));

drop policy if exists alumnos_update on public.alumnos;
create policy alumnos_update on public.alumnos for update to authenticated
  using (public.puede('personas','ficha','actualizar'))
  with check (public.puede('personas','ficha','actualizar'));

drop policy if exists alumnos_delete on public.alumnos;
create policy alumnos_delete on public.alumnos for delete to authenticated
  using (public.puede('personas','ficha','eliminar'));
