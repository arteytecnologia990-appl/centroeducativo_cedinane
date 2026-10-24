-- Alumno / paciente que recibe el servicio (el cliente es quien factura)
alter table public.ingresos add column if not exists alumno_paciente text;
