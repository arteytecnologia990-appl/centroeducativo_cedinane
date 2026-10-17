-- Sueldo mensual del empleado
alter table public.personal add column if not exists sueldo numeric(14, 2);
