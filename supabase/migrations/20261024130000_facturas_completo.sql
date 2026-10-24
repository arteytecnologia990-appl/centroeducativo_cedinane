-- Nuevo formato "DetalleComprobantesRegistrados": campos completos
alter table public.facturas add column if not exists nombre_informado text;
alter table public.facturas add column if not exists tipo_identificacion text;
alter table public.facturas add column if not exists tipo_registro text;
alter table public.facturas add column if not exists tipo_comprobante text;
alter table public.facturas add column if not exists condicion text;
alter table public.facturas add column if not exists timbrado text;
alter table public.facturas add column if not exists monto_gravado_10 numeric(14,2) not null default 0;
alter table public.facturas add column if not exists iva_10 numeric(14,2) not null default 0;
alter table public.facturas add column if not exists monto_gravado_5 numeric(14,2) not null default 0;
alter table public.facturas add column if not exists iva_5 numeric(14,2) not null default 0;
alter table public.facturas add column if not exists exento numeric(14,2) not null default 0;

-- Revertir la carga anterior (dte-emitidos.xlsx)
delete from public.facturas;
