-- Logo que se imprime en la hoja de asistencia (1 por persona)
alter table public.personal add column if not exists logo text;

alter table public.personal drop constraint if exists personal_logo_check;
alter table public.personal add constraint personal_logo_check check (logo in ('aso', 'incluyeme'));
