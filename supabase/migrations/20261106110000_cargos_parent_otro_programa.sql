-- Corregir cargos cuyo padre pertenece a otro programa (quedaban ocultos)
update public.cargos c
set parent_id = null
where c.parent_id is not null
  and not exists (
    select 1
    from public.cargos p
    where p.id = c.parent_id
      and p.programa_id is not distinct from c.programa_id
  );
