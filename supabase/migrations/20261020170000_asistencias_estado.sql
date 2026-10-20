-- Estado de asistencia para la carga manual por calendario
alter table public.asistencias add column if not exists estado text;

alter table public.asistencias drop constraint if exists asistencias_estado_check;
alter table public.asistencias add constraint asistencias_estado_check
  check (estado in ('presente', 'ausente', 'tarde'));
