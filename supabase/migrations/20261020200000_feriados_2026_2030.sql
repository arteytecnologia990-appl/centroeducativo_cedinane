-- Feriados nacionales Paraguay 2026-2030 (Ley 7544/2025)

alter table public.feriados add column if not exists pais text not null default 'PY';
alter table public.feriados add column if not exists fecha_original date;
alter table public.feriados add column if not exists movilidad text not null default 'fijo';
alter table public.feriados add column if not exists norma text;
alter table public.feriados add column if not exists estado_validacion text not null default 'pendiente';
alter table public.feriados add column if not exists updated_at timestamptz not null default now();

alter table public.feriados drop constraint if exists feriados_movilidad_check;
alter table public.feriados add constraint feriados_movilidad_check check (movilidad in ('fijo','movil'));

alter table public.feriados drop constraint if exists feriados_estado_check;
alter table public.feriados add constraint feriados_estado_check check (estado_validacion in ('pendiente','verificado','revisar'));

-- Backfill de registros existentes
update public.feriados set fecha_original = coalesce(trasladado_de, fecha) where fecha_original is null;
update public.feriados set norma = 'Ley 7544/2025' where norma is null;
update public.feriados set estado_validacion = case when validado then 'verificado' else 'pendiente' end where estado_validacion = 'pendiente';
update public.feriados set movilidad = 'movil'
  where nombre ilike '%Héroes%' or nombre ilike '%Paz del Chaco%'
     or nombre ilike '%Constitución%' or nombre ilike '%Boquerón%';

-- San Blas no figura en la Ley 7544/2025
delete from public.feriados where fecha = '2026-02-03' and nombre = 'San Blas';

-- Carga idempotente 2026-2030
insert into public.feriados
  (fecha, nombre, tipo, pais, fecha_original, movilidad, norma, estado_validacion, nota)
values
  ('2026-01-01','Año Nuevo','nacional','PY','2026-01-01','fijo','Ley 7544/2025','verificado',null),
  ('2026-05-01','Día de los Trabajadores','nacional','PY','2026-05-01','fijo','Ley 7544/2025','verificado',null),
  ('2026-05-14','Día de la Independencia Nacional','nacional','PY','2026-05-14','fijo','Ley 7544/2025','verificado',null),
  ('2026-05-15','Día de la Independencia Nacional','nacional','PY','2026-05-15','fijo','Ley 7544/2025','verificado',null),
  ('2026-08-15','Fundación de Asunción','nacional','PY','2026-08-15','fijo','Ley 7544/2025','verificado',null),
  ('2026-12-08','Virgen de Caacupé','nacional','PY','2026-12-08','fijo','Ley 7544/2025','verificado',null),
  ('2026-12-25','Navidad','nacional','PY','2026-12-25','fijo','Ley 7544/2025','verificado',null),
  ('2026-04-02','Jueves Santo','nacional','PY','2026-04-02','fijo','Ley 7544/2025','verificado',null),
  ('2026-04-03','Viernes Santo','nacional','PY','2026-04-03','fijo','Ley 7544/2025','verificado',null),
  ('2026-03-02','Día de los Héroes de la Patria','nacional','PY','2026-03-01','movil','Ley 7544/2025','pendiente','Traslado 2026 reportado; verificar decreto'),
  ('2026-06-12','Día de la Paz del Chaco','nacional','PY','2026-06-12','movil','Ley 7544/2025','pendiente',null),
  ('2026-06-22','Día de la Jura de la Constitución Nacional','nacional','PY','2026-06-20','movil','Ley 7544/2025','pendiente','Traslado 2026 reportado; verificar decreto'),
  ('2026-09-28','Día de la Batalla de Boquerón','nacional','PY','2026-09-29','movil','Ley 7544/2025','pendiente','Traslado 2026 reportado; verificar decreto'),
  ('2027-01-01','Año Nuevo','nacional','PY','2027-01-01','fijo','Ley 7544/2025','verificado',null),
  ('2027-05-01','Día de los Trabajadores','nacional','PY','2027-05-01','fijo','Ley 7544/2025','verificado',null),
  ('2027-05-14','Día de la Independencia Nacional','nacional','PY','2027-05-14','fijo','Ley 7544/2025','verificado',null),
  ('2027-05-15','Día de la Independencia Nacional','nacional','PY','2027-05-15','fijo','Ley 7544/2025','verificado',null),
  ('2027-08-15','Fundación de Asunción','nacional','PY','2027-08-15','fijo','Ley 7544/2025','verificado',null),
  ('2027-12-08','Virgen de Caacupé','nacional','PY','2027-12-08','fijo','Ley 7544/2025','verificado',null),
  ('2027-12-25','Navidad','nacional','PY','2027-12-25','fijo','Ley 7544/2025','verificado',null),
  ('2027-03-25','Jueves Santo','nacional','PY','2027-03-25','fijo','Ley 7544/2025','verificado',null),
  ('2027-03-26','Viernes Santo','nacional','PY','2027-03-26','fijo','Ley 7544/2025','verificado',null),
  ('2027-03-01','Día de los Héroes de la Patria','nacional','PY','2027-03-01','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2027-06-12','Día de la Paz del Chaco','nacional','PY','2027-06-12','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2027-06-20','Día de la Jura de la Constitución Nacional','nacional','PY','2027-06-20','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2027-09-29','Día de la Batalla de Boquerón','nacional','PY','2027-09-29','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2028-01-01','Año Nuevo','nacional','PY','2028-01-01','fijo','Ley 7544/2025','verificado',null),
  ('2028-05-01','Día de los Trabajadores','nacional','PY','2028-05-01','fijo','Ley 7544/2025','verificado',null),
  ('2028-05-14','Día de la Independencia Nacional','nacional','PY','2028-05-14','fijo','Ley 7544/2025','verificado',null),
  ('2028-05-15','Día de la Independencia Nacional','nacional','PY','2028-05-15','fijo','Ley 7544/2025','verificado',null),
  ('2028-08-15','Fundación de Asunción','nacional','PY','2028-08-15','fijo','Ley 7544/2025','verificado',null),
  ('2028-12-08','Virgen de Caacupé','nacional','PY','2028-12-08','fijo','Ley 7544/2025','verificado',null),
  ('2028-12-25','Navidad','nacional','PY','2028-12-25','fijo','Ley 7544/2025','verificado',null),
  ('2028-04-13','Jueves Santo','nacional','PY','2028-04-13','fijo','Ley 7544/2025','verificado',null),
  ('2028-04-14','Viernes Santo','nacional','PY','2028-04-14','fijo','Ley 7544/2025','verificado',null),
  ('2028-03-01','Día de los Héroes de la Patria','nacional','PY','2028-03-01','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2028-06-12','Día de la Paz del Chaco','nacional','PY','2028-06-12','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2028-06-20','Día de la Jura de la Constitución Nacional','nacional','PY','2028-06-20','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2028-09-29','Día de la Batalla de Boquerón','nacional','PY','2028-09-29','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2029-01-01','Año Nuevo','nacional','PY','2029-01-01','fijo','Ley 7544/2025','verificado',null),
  ('2029-05-01','Día de los Trabajadores','nacional','PY','2029-05-01','fijo','Ley 7544/2025','verificado',null),
  ('2029-05-14','Día de la Independencia Nacional','nacional','PY','2029-05-14','fijo','Ley 7544/2025','verificado',null),
  ('2029-05-15','Día de la Independencia Nacional','nacional','PY','2029-05-15','fijo','Ley 7544/2025','verificado',null),
  ('2029-08-15','Fundación de Asunción','nacional','PY','2029-08-15','fijo','Ley 7544/2025','verificado',null),
  ('2029-12-08','Virgen de Caacupé','nacional','PY','2029-12-08','fijo','Ley 7544/2025','verificado',null),
  ('2029-12-25','Navidad','nacional','PY','2029-12-25','fijo','Ley 7544/2025','verificado',null),
  ('2029-03-29','Jueves Santo','nacional','PY','2029-03-29','fijo','Ley 7544/2025','verificado',null),
  ('2029-03-30','Viernes Santo','nacional','PY','2029-03-30','fijo','Ley 7544/2025','verificado',null),
  ('2029-03-01','Día de los Héroes de la Patria','nacional','PY','2029-03-01','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2029-06-12','Día de la Paz del Chaco','nacional','PY','2029-06-12','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2029-06-20','Día de la Jura de la Constitución Nacional','nacional','PY','2029-06-20','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2029-09-29','Día de la Batalla de Boquerón','nacional','PY','2029-09-29','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2030-01-01','Año Nuevo','nacional','PY','2030-01-01','fijo','Ley 7544/2025','verificado',null),
  ('2030-05-01','Día de los Trabajadores','nacional','PY','2030-05-01','fijo','Ley 7544/2025','verificado',null),
  ('2030-05-14','Día de la Independencia Nacional','nacional','PY','2030-05-14','fijo','Ley 7544/2025','verificado',null),
  ('2030-05-15','Día de la Independencia Nacional','nacional','PY','2030-05-15','fijo','Ley 7544/2025','verificado',null),
  ('2030-08-15','Fundación de Asunción','nacional','PY','2030-08-15','fijo','Ley 7544/2025','verificado',null),
  ('2030-12-08','Virgen de Caacupé','nacional','PY','2030-12-08','fijo','Ley 7544/2025','verificado',null),
  ('2030-12-25','Navidad','nacional','PY','2030-12-25','fijo','Ley 7544/2025','verificado',null),
  ('2030-04-18','Jueves Santo','nacional','PY','2030-04-18','fijo','Ley 7544/2025','verificado',null),
  ('2030-04-19','Viernes Santo','nacional','PY','2030-04-19','fijo','Ley 7544/2025','verificado',null),
  ('2030-03-01','Día de los Héroes de la Patria','nacional','PY','2030-03-01','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2030-06-12','Día de la Paz del Chaco','nacional','PY','2030-06-12','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2030-06-20','Día de la Jura de la Constitución Nacional','nacional','PY','2030-06-20','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto'),
  ('2030-09-29','Día de la Batalla de Boquerón','nacional','PY','2030-09-29','movil','Ley 7544/2025','pendiente','Traslado a lunes pendiente de decreto')

on conflict (fecha) do nothing;

-- Los fijos quedan verificados
update public.feriados set estado_validacion = 'verificado' where movilidad = 'fijo';
