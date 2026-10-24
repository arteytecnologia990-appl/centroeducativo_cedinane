<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas del proyecto (DSH)

## Verificación obligatoria al cerrar un encargo

Antes de decir "listo", verificá **siempre**:

1. **Rutas nuevas o modificadas**: abrí `http://localhost:3000/<ruta>` y confirmá que **NO da 404**.
   Un `307` sin sesión no alcanza (el middleware redirige igual): verificá con el navegador logueado
   o con el dev server fresco.
2. **Dev server fresco**: si corrés `pnpm build` con `next dev` activo, el `.next` de producción
   pisa el del dev y las rutas nuevas dan **404**. Reiniciá el dev (`job_kill` + `pnpm dev`) o
   borrá `.next` y levantalo de nuevo **antes** de verificar.
3. **`tsc` + `lint`**: `corepack pnpm exec tsc --noEmit` y `corepack pnpm lint` sin errores.
4. **Server actions**: en archivos con `'use server'`, todos los `export` deben ser **async**.
   Los helpers síncronos van **sin** `export`.
5. **Migraciones**: `supabase db push` aplicado y `corepack pnpm db:types` regenerado.
6. **Commit**: si todo pasa, commit + push.
