---
tipo: estado
actualizado: 2026-10-03
tags:
  - estado
---

# Estado actual y preguntas abiertas

> [!danger] Regla vigente · Coste cero obligatorio
> **Solo planes gratuitos durante el desarrollo** (Supabase Free, GitHub Free, Vercel **Hobby**) → [[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]].
> Prohibido activar planes de pago o añadir métodos de pago. Si algo amenaza con costar, se detiene y se consulta.

> [!note] Regla de oro
> Este archivo se actualiza **al final de cada sesión**. Si está desactualizado, la siguiente sesión empieza ciega.

**Última actualización:** 2026-10-03 (sesión 3: servicios conectados + regla de coste cero)
**Fase del producto:** 1 — base, RBAC, personas, horarios, asistencia, horas pagables.
**Momento:** repositorio materializado y **todo conectado** ✅ — listo para la primera migración.

## Hecho

- **Bóveda** migrada a `boveda/` (59 notas, enlaces resueltos); legado en `90-Archivo/`.
- **Scaffold Next.js 16.3.8** + shadcn/ui (23 componentes) + Supabase/TanStack/Zod/Vitest.
- **Verificado**: `typecheck` ✅, `lint` ✅, `test` ✅, `build` ✅.
- **GitHub**: repositorio sincronizado, push funcionando.
- **Supabase**: proyecto enlazado, `src/types/database.ts` generado, `.env.local` completo (sin Docker).
- **Vercel**: proyecto `centroeducativo` enlazado **y Git conectado** (`> Connected`), team en plan **Hobby**.

## Servicios y costo (verificado 2026-10-03)

| Servicio | Plan | Costo | Uso |
| --- | --- | --- | --- |
| Supabase | Free | 0 | ✅ Base de datos, Auth, RLS (se pausa por inactividad; se reactiva) |
| GitHub | Free | 0 | ✅ Repositorio |
| GitHub Actions | Free (cupo) | 0 | ✅ CI (lint/typecheck/test) |
| Vercel | Team `centroeducativo-cedinane` → **hobby** | 0 | ✅ Permitido (previews). ⚠️ Hobby es *no comercial*: al publicar habrá que revisar licencia |
| Vercel Pro / Supabase Pro | — | 💰 | 🚫 Prohibido ([[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]]) |

## Pendiente

| Qué | Estado | Nota |
| --- | --- | --- |
| Primera migración + auth | ⏳ siguiente paso | Ver abajo |
| Revisar licencia Hobby al publicar | 🔮 futuro | Solo si se explota comercialmente |

## Siguiente paso (próxima sesión)

1. Primera migración en `supabase/migrations/`: `sedes`, `personas`, `persona_roles`, `persona_relaciones`, `usuarios`, `roles`, `modulos_pantallas`, `permisos_rol` + RLS por sede → [[Modelo-de-Datos]], [[RBAC-y-RLS]].
2. Aplicarla (`pnpm db:push`) y regenerar tipos (`pnpm db:types`).
3. Autenticación + clientes Supabase (`src/lib/supabase/*`) → prompt [[Fase-1-Base]].
4. `seed.sql` con datos ficticios: 2 sedes, módulos/pantallas, roles y permisos.

## Preguntas abiertas (fase 1)

- 🟡 **Q-02** Kiosco: ¿PIN por persona o compartido por sede? ¿sin conexión (IndexedDB)?
- 🟡 **Q-03** ¿El reloj ZKTime existe ya o es a futuro?
- 🟡 **Q-04** ¿Facturación Ekuatia'i/DNIT-SET en fase 2 o 3?
- 🟡 **Q-05** ¿Modalidades de pago del personal: solo fijo + por hora, o mixtas/por paciente?
- ✅ **Q-01** Supabase sin Docker → resuelto (login + link + gen types funcionan).

## Nota para quien retome

Abrir Obsidian apuntando a `boveda/` (no a la raíz del repo). Entorno y problemas conocidos → [[Entorno-Local]].
