-- Series de recibos: A (adelantos) desde 79, L (liquidaciones) desde 317

with ordenados as (
  select id, row_number() over (order by created_at, id) as rn
  from public.adelantos
)
update public.adelantos a
set numero = 78 + o.rn
from ordenados o
where a.id = o.id;

with ordenados as (
  select id, row_number() over (order by created_at, id) as rn
  from public.liquidaciones
)
update public.liquidaciones l
set numero = 316 + o.rn
from ordenados o
where l.id = o.id;

select setval(
  'public.adelantos_numero_seq',
  coalesce((select max(numero) from public.adelantos), 78),
  true
);

select setval(
  'public.liquidaciones_numero_seq',
  coalesce((select max(numero) from public.liquidaciones), 316),
  true
);
