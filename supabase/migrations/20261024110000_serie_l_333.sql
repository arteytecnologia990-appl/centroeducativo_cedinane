-- Serie L: renumerar desde 333
with ordenados as (
  select id, row_number() over (order by created_at, id) as rn
  from public.liquidaciones
)
update public.liquidaciones l
set numero = 332 + o.rn
from ordenados o
where l.id = o.id;

select setval(
  'public.liquidaciones_numero_seq',
  coalesce((select max(numero) from public.liquidaciones), 332),
  true
);
