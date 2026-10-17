-- Fase 1 · Datos laborales del personal (plantel de empleados)
-- 1:1 con personas. Separado de la identidad para no ensuciar alumnos/pacientes.
create table if not exists public.personal (
  id                      uuid primary key default gen_random_uuid(),
  persona_id              uuid not null unique references public.personas(id) on delete cascade,
  sede_id                 uuid references public.sedes(id),
  cargo                   text,
  programa                text,
  formacion_academica     text,
  turno                   text,
  sector                  text check (sector in ('privado','publico')),
  experiencia_cargo       text,
  antiguedad_institucion  text,
  fecha_ingreso           date,
  registro_profesional    text,
  tiene_ci                boolean not null default false,
  tiene_cv                boolean not null default false,
  tiene_cd                boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  deleted_at              timestamptz
);
comment on table public.personal is 'Datos laborales del personal, 1:1 con personas.';

create index if not exists personal_sede_idx on public.personal (sede_id);

drop trigger if exists personal_updated_at on public.personal;
create trigger personal_updated_at before update on public.personal
  for each row execute function public.tocar_updated_at();

alter table public.personal enable row level security;

-- Se gestiona con los permisos de la ficha de personas
drop policy if exists personal_select on public.personal;
create policy personal_select on public.personal for select to authenticated
  using (public.puede('personas','ficha','consultar'));

drop policy if exists personal_insert on public.personal;
create policy personal_insert on public.personal for insert to authenticated
  with check (public.puede('personas','ficha','crear'));

drop policy if exists personal_update on public.personal;
create policy personal_update on public.personal for update to authenticated
  using (public.puede('personas','ficha','actualizar'))
  with check (public.puede('personas','ficha','actualizar'));

drop policy if exists personal_delete on public.personal;
create policy personal_delete on public.personal for delete to authenticated
  using (public.puede('personas','ficha','eliminar'));
