## Resumen

<!-- Qué cambia y por qué. -->

## Checklist

- [ ] `pnpm lint` y `pnpm typecheck` pasan
- [ ] `pnpm test` pasa (o se justifica la ausencia de tests)
- [ ] Si hay cambios de esquema: migración en `supabase/migrations/` y `pnpm db:types` regenerado
- [ ] RLS y políticas por sede revisadas (`boveda/03-Tecnico/RBAC-y-RLS.md`)
- [ ] No se versionan secretos (solo `.env.example`)
- [ ] Bóveda actualizada si cambió el comportamiento o la arquitectura (`boveda/`)

## Pruebas

<!-- Cómo verificarlo. -->
