---
tipo: prompt
fase: 1
tags:
  - prompt
---

# Prompt — Fase 1 · Base del sistema

**Adjuntar:** [[Proyecto]] · [[Stack]] · [[Estructura-Carpetas]]

```text
# TAREA
Montar la base del sistema: autenticación con Supabase (email/clave), sesión con @supabase/ssr,
layout raíz con providers (TanStack Query), y los clientes de Supabase en src/lib/supabase
(browser / server / admin con service_role, este último server-only).

# CONTEXTO
Proyecto: sistema de gestión para centro educativo y terapéutico (Paraguay), fase 1.
Estructura: feature-based en src/features; app solo compone rutas.
Stack y convenciones: ver notas adjuntas.

# ENTREGABLE
- src/lib/supabase/{client.ts, server.ts, admin.ts, middleware.ts}
- src/middleware.ts (o proxy.ts según Next 16) con refresco de sesión
- route groups (auth)/(kiosco)/(dashboard) con layouts mínimos
- .env.example con las variables de Supabase

# NO HACER
- No construir pantallas de negocio (eso es de las fases siguientes).
- No exponer service_role al navegador.
```
