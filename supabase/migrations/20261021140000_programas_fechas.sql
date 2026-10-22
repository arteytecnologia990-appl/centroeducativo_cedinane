-- Fechas del programa
alter table public.programas add column if not exists fecha_inicio date;
alter table public.programas add column if not exists fecha_vencimiento date;
