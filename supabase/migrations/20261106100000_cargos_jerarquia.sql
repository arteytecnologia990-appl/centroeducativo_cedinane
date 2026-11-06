-- Jerarquía de cargos (niveles)
alter table public.cargos add column if not exists parent_id uuid references public.cargos(id) on delete set null;
alter table public.cargos add column if not exists orden int not null default 0;

create index if not exists cargos_parent_idx on public.cargos (parent_id);
