-- Un cobro por factura (evita duplicados)
alter table public.cobros add column if not exists factura_cdc text;
