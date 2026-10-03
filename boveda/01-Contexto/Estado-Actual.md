---
tipo: estado
actualizado: 2026-10-03
tags:
  - estado
---

# Estado actual y preguntas abiertas

> [!note] Regla de oro
> Se actualiza **al final de cada sesión**. Si está desactualizado, la siguiente sesión empieza ciega.

**Última actualización:** 2026-10-03 (sesión 2: materialización del repositorio)
**Fase del producto:** 1 — base, RBAC, personas, horarios, asistencia, horas pagables.
**Momento:** materializando el repositorio (scaffold Next.js 16 + estructura + bóveda).

## Hecho

- Bóveda migrada a `boveda/` con la estructura nueva; contenido conservado en `90-Archivo/`.
- Scaffold **Next.js 16.3.8** (App Router, TS estricto, Tailwind v4) integrado en la raíz.
- Gestor de paquetes **pnpm 12.8.1** vía `corepack pnpm` (el `corepack enable` global falla por permisos).
- Stack fijado → [[ADR-0004-Stack-y-arquitectura-por-fases]].

## En curso

- Instalación de dependencias, shadcn/ui, Supabase/TanStack/Zod.
- Creación del árbol `src/features` + `src/lib` + `src/types` + `supabase/` + `.github/`.
- Git init + primer commit.

## Siguiente paso

1. Terminar de instalar dependencias y shadcn/ui.
2. Crear `supabase/` (init + migrations + seed + tests/rls) y `.env.example`.
3. git init + commit + push.
4. **Próxima sesión:** primera migración (`personas`, `sedes`, `roles`, `modulos_pantallas`, `permisos_rol`) + autenticación.

## Preguntas abiertas (fase 1)

- 🔴 **Q-01** Token de acceso de Supabase (`SUPABASE_ACCESS_TOKEN`) o Docker local: sin uno de los dos no se puede `supabase link` ni `gen types`.
- 🟡 **Q-02** Kiosco: ¿PIN por persona o compartido por sede? ¿Debe marcar sin conexión (cola local en IndexedDB)?
- 🟡 **Q-03** ¿El reloj ZKTime/ZKTime existe ya o es a futuro? (afecta prioridad del receptor `api/integraciones/zkteco`)
- 🟡 **Q-04** ¿La facturación Ekuatia'i/DNIT-SET entra en fase 2 o 3? (confirma el orden de las fases siguientes)
- 🟡 **Q-05** ¿Modalidades de pago del personal: solo salario fijo + por hora, o hay mixtas/por paciente atendido?

## Entorno (para no repetir descubrimientos)

- Docker **no** instalado; `gh` y `vercel` CLI **no** instalados; Git fuera del `PATH`; `corepack enable` EPERM. Detalle → [[Entorno-Local]].
