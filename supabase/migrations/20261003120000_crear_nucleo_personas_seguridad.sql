-- =============================================================================
-- Fase 1 · Núcleo: sedes, personas y seguridad (RBAC)
-- -----------------------------------------------------------------------------
-- Convenciones (boveda/03-Tecnico/Modelo-de-Datos.md):
--   · español snake_case, tablas en plural
--   · PK uuid · FK <singular>_id · timestamptz (UTC) · bigint para PYG
--   · baja lógica con deleted_at · parámetros con vigencia
--   · CI paraguaya UNIQUE pero NO PK · sede_id en tablas de negocio
-- Seguridad (boveda/03-Tecnico/RBAC-y-RLS.md):
--   · roles de ACCESO != persona_roles (rol de negocio)
--   · permisos = (rol × pantalla × sede) con CRUD
--   · es_admin_general omite la evaluación de permisos
--   · RLS en todas las tablas
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1 · Sedes
-- -----------------------------------------------------------------------------
create table if not exists public.sedes (
  id          uuid primary key default gen_random_uuid(),
  codigo      text not null unique,
  nombre      text not null,
  direccion   text,
  telefono    text,
  activa      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
comment on table public.sedes is 'Sedes del centro. Toda tabla de negocio referencia sede_id.';

-- -----------------------------------------------------------------------------
-- 2 · Personas (núcleo de identidad)
-- -----------------------------------------------------------------------------
create table if not exists public.personas (
  id                uuid primary key default gen_random_uuid(),
  ci                text unique,
  nombres           text not null,
  apellidos         text not null,
  fecha_nacimiento  date,
  sexo              text check (sexo in ('M','F','X')),
  email             text,
  telefono          text,
  direccion         text,
  observaciones     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  updated_by        uuid,
  deleted_at        timestamptz,
  constraint personas_ci_formato check (ci is null or ci ~ '^[0-9]{5,9}$')
);
comment on table public.personas is 'Identidad central. CI única pero la PK es uuid.';

create index if not exists personas_nombre_idx on public.personas (apellidos, nombres);
create index if not exists personas_activas_idx on public.personas (deleted_at) where deleted_at is null;

-- -----------------------------------------------------------------------------
-- 3 · Roles de negocio de una persona (no otorgan permisos de sistema)
-- -----------------------------------------------------------------------------
create table if not exists public.persona_roles (
  id              uuid primary key default gen_random_uuid(),
  persona_id      uuid not null references public.personas(id) on delete cascade,
  rol_negocio     text not null check (rol_negocio in
                    ('profesional','empleado','alumno','paciente','tutor','proveedor','cliente')),
  sede_id         uuid references public.sedes(id),
  vigencia_desde  date not null default current_date,
  vigencia_hasta  date,
  activo          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,
  constraint persona_roles_vigencia check (vigencia_hasta is null or vigencia_hasta >= vigencia_desde)
);
comment on table public.persona_roles is 'Qué es una persona. sede_id null = todas las sedes.';
create index if not exists persona_roles_persona_idx on public.persona_roles (persona_id);

-- -----------------------------------------------------------------------------
-- 4 · Relaciones entre personas (tutor <-> alumno/paciente, etc.)
-- -----------------------------------------------------------------------------
create table if not exists public.persona_relaciones (
  id                   uuid primary key default gen_random_uuid(),
  persona_id           uuid not null references public.personas(id) on delete cascade,
  relacionada_id       uuid not null references public.personas(id) on delete cascade,
  tipo                 text not null,
  es_responsable_pago  boolean not null default false,
  vigencia_desde       date not null default current_date,
  vigencia_hasta       date,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  constraint persona_relaciones_distintas check (persona_id <> relacionada_id),
  constraint persona_relaciones_vigencia check (vigencia_hasta is null or vigencia_hasta >= vigencia_desde)
);
create index if not exists persona_relaciones_persona_idx on public.persona_relaciones (persona_id);
create index if not exists persona_relaciones_relacionada_idx on public.persona_relaciones (relacionada_id);

-- -----------------------------------------------------------------------------
-- 5 · Seguridad: roles de acceso, pantallas, permisos, usuarios
-- -----------------------------------------------------------------------------
create table if not exists public.roles (
  id           uuid primary key default gen_random_uuid(),
  codigo       text not null unique,
  nombre       text not null,
  descripcion  text,
  es_sistema   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
comment on table public.roles is 'Roles de ACCESO (RBAC), distintos de persona_roles.';

create table if not exists public.modulos_pantallas (
  id          uuid primary key default gen_random_uuid(),
  modulo      text not null,
  pantalla    text not null,
  nombre      text,
  ruta        text,
  orden       integer not null default 100,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (modulo, pantalla)
);
comment on table public.modulos_pantallas is 'Catálogo de módulos y pantallas permisables.';

create table if not exists public.usuarios (
  id                uuid primary key default gen_random_uuid(),
  persona_id        uuid not null unique references public.personas(id),
  auth_user_id      uuid unique references auth.users(id) on delete set null,
  email             text not null unique,
  es_admin_general  boolean not null default false,
  activo            boolean not null default true,
  ultimo_acceso     timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,
  deleted_at        timestamptz
);
comment on table public.usuarios is 'Cuenta de acceso vinculada a una persona. es_admin_general omite permisos.';

create table if not exists public.usuario_roles (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references public.usuarios(id) on delete cascade,
  rol_id      uuid not null references public.roles(id) on delete cascade,
  sede_id     uuid references public.sedes(id) on delete cascade,
  created_at  timestamptz not null default now()
);
comment on table public.usuario_roles is 'Rol de acceso de un usuario, acotado por sede (null = todas).';
create unique index if not exists usuario_roles_unico_idx
  on public.usuario_roles (usuario_id, rol_id, coalesce(sede_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table if not exists public.permisos_rol (
  id                uuid primary key default gen_random_uuid(),
  rol_id            uuid not null references public.roles(id) on delete cascade,
  pantalla_id       uuid not null references public.modulos_pantallas(id) on delete cascade,
  sede_id           uuid references public.sedes(id) on delete cascade,
  puede_consultar   boolean not null default false,
  puede_crear       boolean not null default false,
  puede_actualizar  boolean not null default false,
  puede_eliminar    boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
comment on table public.permisos_rol is 'Permisos (rol x pantalla x sede). sede_id null = todas las sedes.';
create unique index if not exists permisos_rol_unico_idx
  on public.permisos_rol (rol_id, pantalla_id, coalesce(sede_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- -----------------------------------------------------------------------------
-- 6 · updated_at automático
-- -----------------------------------------------------------------------------
create or replace function public.tocar_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'sedes','personas','persona_roles','persona_relaciones','roles',
    'modulos_pantallas','usuarios','permisos_rol'
  ] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.tocar_updated_at()',
      t || '_updated_at', t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- 7 · Helpers de seguridad (SECURITY DEFINER: evitan recursión de RLS)
-- -----------------------------------------------------------------------------
create or replace function public.usuario_actual_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select u.id from public.usuarios u
  where u.auth_user_id = auth.uid() and u.activo and u.deleted_at is null
  limit 1;
$$;

create or replace function public.es_admin_general()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((
    select u.es_admin_general from public.usuarios u
    where u.auth_user_id = auth.uid() and u.activo and u.deleted_at is null
    limit 1
  ), false);
$$;

create or replace function public.sedes_permitidas()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select s.id
  from public.sedes s
  where s.deleted_at is null
    and (
      public.es_admin_general()
      or exists (
        select 1 from public.usuario_roles ur
        where ur.usuario_id = public.usuario_actual_id()
          and (ur.sede_id is null or ur.sede_id = s.id)
      )
    );
$$;

create or replace function public.puede(
  p_modulo text, p_pantalla text, p_accion text, p_sede uuid default null
)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when auth.uid() is null then false
    when public.es_admin_general() then true
    else exists (
      select 1
      from public.usuario_roles ur
      join public.permisos_rol pr on pr.rol_id = ur.rol_id
      join public.modulos_pantallas mp on mp.id = pr.pantalla_id
      where ur.usuario_id = public.usuario_actual_id()
        and mp.modulo = p_modulo
        and mp.pantalla = p_pantalla
        and (ur.sede_id is null or p_sede is null or ur.sede_id = p_sede)
        and (pr.sede_id is null or p_sede is null or pr.sede_id = p_sede)
        and case p_accion
              when 'consultar'  then pr.puede_consultar
              when 'crear'      then pr.puede_crear
              when 'actualizar' then pr.puede_actualizar
              when 'eliminar'   then pr.puede_eliminar
              else false
            end
    )
  end;
$$;

-- -----------------------------------------------------------------------------
-- 8 · RLS
-- -----------------------------------------------------------------------------
alter table public.sedes              enable row level security;
alter table public.personas           enable row level security;
alter table public.persona_roles      enable row level security;
alter table public.persona_relaciones enable row level security;
alter table public.roles              enable row level security;
alter table public.modulos_pantallas  enable row level security;
alter table public.usuarios           enable row level security;
alter table public.usuario_roles      enable row level security;
alter table public.permisos_rol       enable row level security;

-- Sedes
drop policy if exists sedes_select on public.sedes;
create policy sedes_select on public.sedes for select to authenticated
  using (id in (select public.sedes_permitidas()));

drop policy if exists sedes_insert on public.sedes;
create policy sedes_insert on public.sedes for insert to authenticated
  with check (public.puede('configuracion','sedes','crear'));

drop policy if exists sedes_update on public.sedes;
create policy sedes_update on public.sedes for update to authenticated
  using (public.puede('configuracion','sedes','actualizar', id))
  with check (public.puede('configuracion','sedes','actualizar', id));

drop policy if exists sedes_delete on public.sedes;
create policy sedes_delete on public.sedes for delete to authenticated
  using (public.puede('configuracion','sedes','eliminar', id));

-- Personas
drop policy if exists personas_select on public.personas;
create policy personas_select on public.personas for select to authenticated
  using (public.puede('personas','listado','consultar'));

drop policy if exists personas_insert on public.personas;
create policy personas_insert on public.personas for insert to authenticated
  with check (public.puede('personas','listado','crear'));

drop policy if exists personas_update on public.personas;
create policy personas_update on public.personas for update to authenticated
  using (public.puede('personas','listado','actualizar'))
  with check (public.puede('personas','listado','actualizar'));

drop policy if exists personas_delete on public.personas;
create policy personas_delete on public.personas for delete to authenticated
  using (public.puede('personas','listado','eliminar'));

-- persona_roles
drop policy if exists persona_roles_select on public.persona_roles;
create policy persona_roles_select on public.persona_roles for select to authenticated
  using (public.puede('personas','listado','consultar'));

drop policy if exists persona_roles_insert on public.persona_roles;
create policy persona_roles_insert on public.persona_roles for insert to authenticated
  with check (public.puede('personas','listado','crear')
              and (sede_id is null or sede_id in (select public.sedes_permitidas())));

drop policy if exists persona_roles_update on public.persona_roles;
create policy persona_roles_update on public.persona_roles for update to authenticated
  using (public.puede('personas','listado','actualizar'))
  with check (public.puede('personas','listado','actualizar'));

drop policy if exists persona_roles_delete on public.persona_roles;
create policy persona_roles_delete on public.persona_roles for delete to authenticated
  using (public.puede('personas','listado','eliminar'));

-- persona_relaciones
drop policy if exists persona_relaciones_select on public.persona_relaciones;
create policy persona_relaciones_select on public.persona_relaciones for select to authenticated
  using (public.puede('personas','listado','consultar'));

drop policy if exists persona_relaciones_insert on public.persona_relaciones;
create policy persona_relaciones_insert on public.persona_relaciones for insert to authenticated
  with check (public.puede('personas','listado','crear'));

drop policy if exists persona_relaciones_update on public.persona_relaciones;
create policy persona_relaciones_update on public.persona_relaciones for update to authenticated
  using (public.puede('personas','listado','actualizar'))
  with check (public.puede('personas','listado','actualizar'));

drop policy if exists persona_relaciones_delete on public.persona_relaciones;
create policy persona_relaciones_delete on public.persona_relaciones for delete to authenticated
  using (public.puede('personas','listado','eliminar'));

-- Catálogos de seguridad
drop policy if exists roles_select on public.roles;
create policy roles_select on public.roles for select to authenticated using (true);

drop policy if exists roles_insert on public.roles;
create policy roles_insert on public.roles for insert to authenticated
  with check (public.puede('seguridad','roles','crear'));

drop policy if exists roles_update on public.roles;
create policy roles_update on public.roles for update to authenticated
  using (public.puede('seguridad','roles','actualizar'))
  with check (public.puede('seguridad','roles','actualizar'));

drop policy if exists roles_delete on public.roles;
create policy roles_delete on public.roles for delete to authenticated
  using (public.puede('seguridad','roles','eliminar'));

drop policy if exists modulos_pantallas_select on public.modulos_pantallas;
create policy modulos_pantallas_select on public.modulos_pantallas for select to authenticated using (true);

drop policy if exists modulos_pantallas_insert on public.modulos_pantallas;
create policy modulos_pantallas_insert on public.modulos_pantallas for insert to authenticated
  with check (public.puede('seguridad','pantallas','crear'));

drop policy if exists modulos_pantallas_update on public.modulos_pantallas;
create policy modulos_pantallas_update on public.modulos_pantallas for update to authenticated
  using (public.puede('seguridad','pantallas','actualizar'))
  with check (public.puede('seguridad','pantallas','actualizar'));

drop policy if exists modulos_pantallas_delete on public.modulos_pantallas;
create policy modulos_pantallas_delete on public.modulos_pantallas for delete to authenticated
  using (public.puede('seguridad','pantallas','eliminar'));

-- Usuarios
drop policy if exists usuarios_select on public.usuarios;
create policy usuarios_select on public.usuarios for select to authenticated
  using (auth_user_id = auth.uid() or public.puede('seguridad','usuarios','consultar'));

drop policy if exists usuarios_insert on public.usuarios;
create policy usuarios_insert on public.usuarios for insert to authenticated
  with check (public.puede('seguridad','usuarios','crear'));

drop policy if exists usuarios_update on public.usuarios;
create policy usuarios_update on public.usuarios for update to authenticated
  using (auth_user_id = auth.uid() or public.puede('seguridad','usuarios','actualizar'))
  with check (auth_user_id = auth.uid() or public.puede('seguridad','usuarios','actualizar'));

drop policy if exists usuarios_delete on public.usuarios;
create policy usuarios_delete on public.usuarios for delete to authenticated
  using (public.puede('seguridad','usuarios','eliminar'));

-- usuario_roles
drop policy if exists usuario_roles_select on public.usuario_roles;
create policy usuario_roles_select on public.usuario_roles for select to authenticated
  using (usuario_id = public.usuario_actual_id() or public.puede('seguridad','usuarios','consultar'));

drop policy if exists usuario_roles_insert on public.usuario_roles;
create policy usuario_roles_insert on public.usuario_roles for insert to authenticated
  with check (public.puede('seguridad','usuarios','crear'));

drop policy if exists usuario_roles_update on public.usuario_roles;
create policy usuario_roles_update on public.usuario_roles for update to authenticated
  using (public.puede('seguridad','usuarios','actualizar'))
  with check (public.puede('seguridad','usuarios','actualizar'));

drop policy if exists usuario_roles_delete on public.usuario_roles;
create policy usuario_roles_delete on public.usuario_roles for delete to authenticated
  using (public.puede('seguridad','usuarios','eliminar'));

-- permisos_rol
drop policy if exists permisos_rol_select on public.permisos_rol;
create policy permisos_rol_select on public.permisos_rol for select to authenticated
  using (public.puede('seguridad','roles','consultar'));

drop policy if exists permisos_rol_insert on public.permisos_rol;
create policy permisos_rol_insert on public.permisos_rol for insert to authenticated
  with check (public.puede('seguridad','roles','crear'));

drop policy if exists permisos_rol_update on public.permisos_rol;
create policy permisos_rol_update on public.permisos_rol for update to authenticated
  using (public.puede('seguridad','roles','actualizar'))
  with check (public.puede('seguridad','roles','actualizar'));

drop policy if exists permisos_rol_delete on public.permisos_rol;
create policy permisos_rol_delete on public.permisos_rol for delete to authenticated
  using (public.puede('seguridad','roles','eliminar'));

-- -----------------------------------------------------------------------------
-- 9 · Catálogos iniciales (idempotentes)
-- -----------------------------------------------------------------------------
insert into public.roles (codigo, nombre, descripcion, es_sistema) values
  ('admin_general','Administrador general','Acceso total; omite permisos (es_admin_general)', true),
  ('direccion','Dirección','Gestión académica y administrativa completa', true),
  ('secretaria','Secretaría','Personas, asistencia y cobros', true),
  ('profesional','Profesional / docente','Asistencia y sus propios horarios', true),
  ('consulta','Solo consulta','Lectura sin modificaciones', true)
on conflict (codigo) do nothing;

insert into public.modulos_pantallas (modulo, pantalla, nombre, ruta, orden) values
  ('personas','listado','Personas','/dashboard/personas',10),
  ('personas','ficha','Ficha de persona',null,11),
  ('seguridad','usuarios','Usuarios','/dashboard/seguridad',20),
  ('seguridad','roles','Roles y permisos','/dashboard/seguridad',21),
  ('seguridad','pantallas','Pantallas',null,22),
  ('configuracion','sedes','Sedes','/dashboard/configuracion',30),
  ('configuracion','parametros','Parámetros','/dashboard/configuracion',31),
  ('horarios','plantillas','Plantillas de horario','/dashboard/horarios',40),
  ('horarios','asignaciones','Asignaciones de horario',null,41),
  ('asistencia','marcaciones','Marcaciones','/dashboard/asistencia',50),
  ('asistencia','diarias','Asistencias diarias',null,51),
  ('asistencia','correcciones','Correcciones',null,52),
  ('horas_pagables','tarifas','Tarifas por hora','/dashboard/horas-pagables',60),
  ('horas_pagables','liquidacion','Liquidación',null,61),
  ('auditoria','registro','Registro de auditoría','/dashboard/auditoria',70)
on conflict (modulo, pantalla) do nothing;

-- admin_general y direccion: todo
insert into public.permisos_rol (rol_id, pantalla_id, puede_consultar, puede_crear, puede_actualizar, puede_eliminar)
select r.id, mp.id, true, true, true, true
from public.roles r cross join public.modulos_pantallas mp
where r.codigo in ('admin_general','direccion')
on conflict do nothing;

-- secretaria: personas y asistencia (todo), resto lectura
insert into public.permisos_rol (rol_id, pantalla_id, puede_consultar, puede_crear, puede_actualizar, puede_eliminar)
select r.id, mp.id, true,
       (mp.modulo in ('personas','asistencia')),
       (mp.modulo in ('personas','asistencia')),
       false
from public.roles r cross join public.modulos_pantallas mp
where r.codigo = 'secretaria'
  and mp.modulo in ('personas','asistencia','horarios','horas_pagables','configuracion')
on conflict do nothing;

-- profesional: asistencia (crear/actualizar), horarios y personas (lectura)
insert into public.permisos_rol (rol_id, pantalla_id, puede_consultar, puede_crear, puede_actualizar, puede_eliminar)
select r.id, mp.id, true,
       (mp.modulo = 'asistencia'),
       (mp.modulo = 'asistencia'),
       false
from public.roles r cross join public.modulos_pantallas mp
where r.codigo = 'profesional'
  and mp.modulo in ('asistencia','horarios','personas')
on conflict do nothing;

-- consulta: solo lectura
insert into public.permisos_rol (rol_id, pantalla_id, puede_consultar, puede_crear, puede_actualizar, puede_eliminar)
select r.id, mp.id, true, false, false, false
from public.roles r cross join public.modulos_pantallas mp
where r.codigo = 'consulta'
on conflict do nothing;

-- Sedes iniciales (2, según el alcance actual)
insert into public.sedes (codigo, nombre) values
  ('SEDE-1','Sede 1'),
  ('SEDE-2','Sede 2')
on conflict (codigo) do nothing;
