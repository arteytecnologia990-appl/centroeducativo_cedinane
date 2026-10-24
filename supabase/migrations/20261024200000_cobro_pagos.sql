-- Detalle de medios de pago de un cobro (mixto)
create table if not exists public.cobro_pagos (
  id uuid primary key default gen_random_uuid(),
  cobro_id uuid not null references public.cobros(id) on delete cascade,
  forma_pago text not null,
  monto numeric(14,2) not null default 0,
  banco_id uuid references public.bancos(id) on delete set null,
  cuenta_id uuid references public.cuentas_bancarias(id) on delete set null,
  nro_transferencia text
);

create index if not exists cobro_pagos_cobro_idx on public.cobro_pagos (cobro_id);

alter table public.cobro_pagos enable row level security;

drop policy if exists cobro_pagos_all on public.cobro_pagos;
create policy cobro_pagos_all on public.cobro_pagos for all to authenticated
  using (public.es_admin_general()) with check (public.es_admin_general());
