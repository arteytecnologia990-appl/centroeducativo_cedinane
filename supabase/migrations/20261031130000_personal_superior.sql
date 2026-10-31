-- Superior inmediato (debe ser otro empleado)
alter table public.personal
  add column if not exists superior_id uuid references public.personas(id) on delete set null;
