-- Cada cargo pertenece a un programa
alter table public.cargos
  add column if not exists programa_id uuid references public.programas(id) on delete set null;

create index if not exists cargos_programa_idx on public.cargos (programa_id);
