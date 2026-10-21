-- Feriados nacionales (con traslados) + pantalla de parámetros
create table if not exists public.feriados (
  fecha date primary key,
  nombre text not null,
  tipo text not null default 'nacional',
  trasladado_de date,
  nota text,
  fuente text,
  validado boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.feriados (fecha, nombre, tipo, trasladado_de, nota, fuente, validado) values
 ('2026-01-01','Año Nuevo','nacional',null,null,'Calendario 2026',false),
 ('2026-02-03','San Blas','nacional',null,'Confirmar si corresponde como feriado nacional','Calendario 2026',false),
 ('2026-03-02','Día de los Héroes de la Patria','nacional','2026-03-01','Trasladado del domingo 1/3','La Nación 02/01/2026',false),
 ('2026-04-02','Jueves Santo','nacional',null,null,'La Nación 02/01/2026',false),
 ('2026-04-03','Viernes Santo','nacional',null,null,'La Nación 02/01/2026',false),
 ('2026-05-01','Día de los Trabajadores','nacional',null,null,'La Nación 02/01/2026',false),
 ('2026-05-14','Día de la Independencia Nacional','nacional',null,null,'La Nación 02/01/2026',false),
 ('2026-05-15','Día de la Independencia Nacional','nacional',null,null,'La Nación 02/01/2026',false),
 ('2026-06-12','Día de la Paz del Chaco','nacional',null,'Fecha movible','La Nación 02/01/2026',false),
 ('2026-06-22','Jura de la Constitución Nacional','nacional','2026-06-20','Trasladado del sábado 20/6','La Nación 02/01/2026',false),
 ('2026-08-15','Fundación de Asunción','nacional',null,'Fecha inamovible','La Nación 02/01/2026',false),
 ('2026-09-28','Batalla de Boquerón','nacional','2026-09-29','Adelantado del martes 29/9','La Nación 02/01/2026',false),
 ('2026-12-08','Virgen de Caacupé','nacional',null,'Fecha inamovible','La Nación 02/01/2026',false),
 ('2026-12-25','Navidad','nacional',null,null,'La Nación 02/01/2026',false)
on conflict (fecha) do nothing;

alter table public.feriados enable row level security;

drop policy if exists feriados_all on public.feriados;
create policy feriados_all on public.feriados for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
