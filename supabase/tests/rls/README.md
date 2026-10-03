# Tests de RLS — pgTAP

Aquí se prueban las políticas de aislamiento por sede y rol (RLS). Requieren una base local (Docker) o un proyecto enlazado.

## Reglas

- Un archivo `.sql` de pgTAP por tabla o por política crítica.
- Casos mínimos: el usuario de una sede **no** ve datos de otra; el rol sin permiso **no** puede consultar/crear/actualizar/eliminar; `es_admin_general` sí puede todo.
- Datos **ficticios** siempre.

## Ejecución

```powershell
corepack pnpm dlx supabase test db   # requiere Docker
```

Detalle: `boveda/04-Operacion/Pruebas.md` y `boveda/03-Tecnico/RBAC-y-RLS.md`.
