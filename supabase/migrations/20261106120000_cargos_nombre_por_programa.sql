-- Un cargo puede repetir nombre en distintos programas (ej.: "Coordinadora" en CT y en Comunitario)
alter table public.cargos drop constraint if exists cargos_nombre_key;
