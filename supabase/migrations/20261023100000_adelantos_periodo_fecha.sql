-- Normalizar el período de los adelantos según su fecha
update public.adelantos
set periodo = to_char(fecha, 'YYYY-MM')
where periodo is distinct from to_char(fecha, 'YYYY-MM');
