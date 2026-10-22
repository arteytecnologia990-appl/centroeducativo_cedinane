-- Adelanto por sesiones: detalle del cálculo
alter table public.adelantos add column if not exists sesion_id uuid references public.sesiones(id) on delete set null;
alter table public.adelantos add column if not exists cantidad_sesiones integer;
alter table public.adelantos add column if not exists monto_bruto numeric(14,2);
alter table public.adelantos add column if not exists porc_descuento numeric(5,2);
alter table public.adelantos add column if not exists monto_descuento numeric(14,2);
