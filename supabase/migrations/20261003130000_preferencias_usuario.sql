-- Fase 1 · Preferencias de tema por usuario (estilo y modo)
create table if not exists public.preferencias_usuario (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null unique references public.usuarios(id) on delete cascade,
  estilo      text not null default 'a' check (estilo in ('a','b','c','d')),
  modo        text not null default 'system' check (modo in ('light','dark','system')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.preferencias_usuario is 'Estilo y modo de tema elegidos por cada usuario.';

drop trigger if exists preferencias_usuario_updated_at on public.preferencias_usuario;
create trigger preferencias_usuario_updated_at before update on public.preferencias_usuario
  for each row execute function public.tocar_updated_at();

alter table public.preferencias_usuario enable row level security;

-- cada usuario solo lee y edita su propia fila
drop policy if exists preferencias_usuario_select on public.preferencias_usuario;
create policy preferencias_usuario_select on public.preferencias_usuario for select to authenticated
  using (usuario_id in (select id from public.usuarios where auth_user_id = auth.uid()));

drop policy if exists preferencias_usuario_insert on public.preferencias_usuario;
create policy preferencias_usuario_insert on public.preferencias_usuario for insert to authenticated
  with check (usuario_id in (select id from public.usuarios where auth_user_id = auth.uid()));

drop policy if exists preferencias_usuario_update on public.preferencias_usuario;
create policy preferencias_usuario_update on public.preferencias_usuario for update to authenticated
  using (usuario_id in (select id from public.usuarios where auth_user_id = auth.uid()))
  with check (usuario_id in (select id from public.usuarios where auth_user_id = auth.uid()));

drop policy if exists preferencias_usuario_delete on public.preferencias_usuario;
create policy preferencias_usuario_delete on public.preferencias_usuario for delete to authenticated
  using (usuario_id in (select id from public.usuarios where auth_user_id = auth.uid()));
