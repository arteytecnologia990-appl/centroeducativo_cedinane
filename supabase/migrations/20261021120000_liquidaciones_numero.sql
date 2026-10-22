-- Número de recibo para la liquidación de salario
alter table public.liquidaciones add column if not exists numero serial;
