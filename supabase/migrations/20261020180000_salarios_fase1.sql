-- Fase 1 · Liquidación de salarios (Paraguay) — modelo base

-- Jornadas
create table if not exists public.jornadas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null,
  tipo text not null check (tipo in ('diurna','nocturna','mixta')),
  horas_diarias numeric(5,2) not null,
  horas_semanales numeric(5,2) not null,
  created_at timestamptz not null default now()
);

insert into public.jornadas (codigo, nombre, tipo, horas_diarias, horas_semanales)
values ('diurna','Jornada diurna','diurna',8,48),
       ('nocturna','Jornada nocturna','nocturna',7,42),
       ('mixta','Jornada mixta','mixta',7.5,45)
on conflict (codigo) do nothing;

-- Parámetros legales (con vigencia)
create table if not exists public.parametros_legales (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nombre text not null,
  valor numeric(14,4) not null,
  unidad text not null default 'gs',
  vigencia_desde date not null,
  vigencia_hasta date,
  norma text,
  articulo text,
  fuente text,
  validado boolean not null default false,
  created_at timestamptz not null default now(),
  unique (codigo, vigencia_desde)
);

insert into public.parametros_legales (codigo, nombre, valor, unidad, vigencia_desde, norma, fuente, validado)
values
 ('salario_minimo_mensual','Salario mínimo mensual diurno',3044000,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('jornal_minimo','Jornal mínimo diurno',117077,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('diaria_mensualizado','Remuneración diaria del mensualizado',101467,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('hora_diurna','Hora de referencia diurna',12683,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('salario_minimo_nocturno','Salario mínimo mensual nocturno',3957200,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('hora_nocturna','Hora de referencia nocturna',18844,'gs','2026-07-01','Res. MTESS 670/2026','MTESS',false),
 ('ips_obrero','Aporte IPS obrero',9,'porcentaje','2026-07-01','Normativa IPS','IPS',false),
 ('ips_patronal','Aporte IPS patronal',16.5,'porcentaje','2026-07-01','Normativa IPS','IPS',false),
 ('recargo_nocturnidad','Recargo por nocturnidad',30,'porcentaje','2026-07-01','Código del Trabajo','CT',false),
 ('recargo_extra_diurna','Recargo hora extra diurna',50,'porcentaje','2026-07-01','Código del Trabajo','CT',false),
 ('recargo_extra_nocturna','Recargo hora extra nocturna',100,'porcentaje','2026-07-01','Código del Trabajo','CT',false),
 ('recargo_feriado','Recargo hora feriado',100,'porcentaje','2026-07-01','Código del Trabajo','CT',false),
 ('base_dias_mes','Días base del mes',30,'dias','2026-07-01','Uso interno','—',false),
 ('base_dias_jornal','Días base jornal',26,'dias','2026-07-01','Uso interno','—',false),
 ('base_horas_diurna','Horas base mensual diurna',240,'horas','2026-07-01','Uso interno','—',false),
 ('base_horas_nocturna','Horas base mensual nocturna',210,'horas','2026-07-01','Uso interno','—',false)
on conflict (codigo, vigencia_desde) do nothing;

-- Conceptos de salario
create table if not exists public.conceptos_salario (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null,
  tipo text not null check (tipo in ('haber','descuento','costo_patronal')),
  remunerativo boolean not null default true,
  incluye_base_ips boolean not null default true,
  incluye_base_aguinaldo boolean not null default true,
  incluye_base_vacaciones boolean not null default true,
  orden integer not null default 0,
  activo boolean not null default true
);

insert into public.conceptos_salario (codigo, nombre, tipo, orden) values
 ('sueldo','Sueldo básico','haber',10),
 ('horas_extra','Horas extras','haber',20),
 ('nocturnidad','Nocturnidad','haber',30),
 ('feriado','Horas en feriado','haber',40),
 ('ausencia','Ausencias','descuento',50),
 ('ips_obrero','IPS obrero','descuento',60),
 ('adelanto','Adelanto / préstamo','descuento',70),
 ('ips_patronal','IPS patronal','costo_patronal',80)
on conflict (codigo) do nothing;

-- Modalidad y jornada en los datos laborales
alter table public.personal add column if not exists modalidad_salarial text default 'mensual';
alter table public.personal add column if not exists jornada_tipo text default 'diurna';

alter table public.personal drop constraint if exists personal_modalidad_check;
alter table public.personal add constraint personal_modalidad_check
  check (modalidad_salarial in ('mensual','jornal','hora'));

alter table public.personal drop constraint if exists personal_jornada_check;
alter table public.personal add constraint personal_jornada_check
  check (jornada_tipo in ('diurna','nocturna','mixta'));

-- Novedades del período
create table if not exists public.novedades (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references public.personas(id) on delete cascade,
  periodo text not null,
  tipo text not null,
  cantidad numeric(10,2) not null default 0,
  unidad text not null default 'horas',
  fecha_desde date,
  fecha_hasta date,
  justificacion text,
  tratamiento text,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists novedades_persona_periodo_idx on public.novedades (persona_id, periodo);

-- Liquidaciones
create table if not exists public.liquidaciones (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references public.personas(id) on delete cascade,
  periodo text not null,
  version integer not null default 1,
  total_haberes numeric(14,2) not null default 0,
  total_descuentos numeric(14,2) not null default 0,
  neto_pagar numeric(14,2) not null default 0,
  total_aportes_patronales numeric(14,2) not null default 0,
  estado text not null default 'calculada',
  calculado_por uuid,
  aprobado_por uuid,
  fecha_aprobacion timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (persona_id, periodo, version)
);

create index if not exists liquidaciones_periodo_idx on public.liquidaciones (periodo);

-- Detalle de la liquidación
create table if not exists public.liquidacion_detalle (
  id uuid primary key default gen_random_uuid(),
  liquidacion_id uuid not null references public.liquidaciones(id) on delete cascade,
  concepto_codigo text not null,
  descripcion text,
  cantidad numeric(10,2),
  base_calculo numeric(14,2),
  tasa numeric(10,4),
  importe numeric(14,2) not null,
  orden integer not null default 0
);

create index if not exists liquidacion_detalle_liquidacion_idx on public.liquidacion_detalle (liquidacion_id);

-- Auditoría
create table if not exists public.auditoria_liquidacion (
  id uuid primary key default gen_random_uuid(),
  liquidacion_id uuid references public.liquidaciones(id) on delete cascade,
  usuario uuid,
  accion text not null,
  detalle jsonb,
  created_at timestamptz not null default now()
);

-- RLS: datos sensibles, solo admin general
alter table public.jornadas enable row level security;
alter table public.parametros_legales enable row level security;
alter table public.conceptos_salario enable row level security;
alter table public.novedades enable row level security;
alter table public.liquidaciones enable row level security;
alter table public.liquidacion_detalle enable row level security;
alter table public.auditoria_liquidacion enable row level security;

drop policy if exists jornadas_all on public.jornadas;
create policy jornadas_all on public.jornadas for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists parametros_all on public.parametros_legales;
create policy parametros_all on public.parametros_legales for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists conceptos_all on public.conceptos_salario;
create policy conceptos_all on public.conceptos_salario for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists novedades_all on public.novedades;
create policy novedades_all on public.novedades for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists liquidaciones_all on public.liquidaciones;
create policy liquidaciones_all on public.liquidaciones for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists liquidacion_detalle_all on public.liquidacion_detalle;
create policy liquidacion_detalle_all on public.liquidacion_detalle for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());

drop policy if exists auditoria_all on public.auditoria_liquidacion;
create policy auditoria_all on public.auditoria_liquidacion for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
