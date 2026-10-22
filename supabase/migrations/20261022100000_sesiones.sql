-- Definiciones: tipos de sesión (parámetros para el pago semanal a profesionales)
create table if not exists public.sesiones (
  id uuid primary key default gen_random_uuid(),
  descripcion text not null,
  porc_profesional numeric(5,2) not null default 0,
  porc_instituto numeric(5,2) not null default 0,
  monto numeric(14,2) not null default 0,
  tiempo_sesion integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sesiones enable row level security;

drop policy if exists sesiones_all on public.sesiones;
create policy sesiones_all on public.sesiones for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
