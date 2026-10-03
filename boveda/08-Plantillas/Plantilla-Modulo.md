---
tipo: plantilla
actualizado: 2026-10-03
tags:
  - plantilla
---

# Plantilla — Módulo nuevo (`src/features/<modulo>/`)

Al añadir un módulo, crear esta forma y rellenar `index.ts` como única superficie pública.

```
features/<modulo>/
├─ components/     # UI propia del módulo
├─ actions/        # Server Actions ('use server'), validan con Zod
├─ schemas/        # esquemas Zod compartidos cliente/servidor
├─ queries/        # lectura tipada desde Supabase
├─ services/       # dominio puro y testeable
├─ hooks/          # hooks TanStack Query
├─ types.ts        # tipos del módulo
└─ index.ts        # superficie pública (evita imports profundos)
```

## Checklist

- [ ] Migración en `supabase/migrations/` si el módulo añade tablas
- [ ] `sede_id` en toda tabla de negocio
- [ ] Zod en toda entrada de Server Action
- [ ] Lógica de cálculo en `services/` con tests
- [ ] RLS y políticas de sede
- [ ] Nota del dominio actualizada en `02-Negocio/` si cambian reglas
- [ ] Pantalla registrada en `modulos_pantallas` (RBAC)
