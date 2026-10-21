-- Régimen de pago: dependencia (IPS) u honorarios (IVA)
alter table public.personal add column if not exists regimen text not null default 'dependencia';

alter table public.personal drop constraint if exists personal_regimen_check;
alter table public.personal add constraint personal_regimen_check
  check (regimen in ('dependencia','honorarios'));

insert into public.parametros_legales (codigo, nombre, valor, unidad, vigencia_desde, norma, fuente, validado)
values ('iva','IVA general',10,'porcentaje','2026-07-01','Ley 6380/2019','DNIT',false)
on conflict (codigo, vigencia_desde) do nothing;

insert into public.conceptos_salario (codigo, nombre, tipo, orden)
values ('iva','IVA','haber',45)
on conflict (codigo) do nothing;
