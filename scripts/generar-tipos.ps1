# Genera src/types/database.ts desde el proyecto Supabase enlazado.
# Requisitos previos: `supabase login` + `supabase link` (o SUPABASE_ACCESS_TOKEN).
# Ver: boveda/01-Contexto/Entorno-Local.md
$ErrorActionPreference = 'Stop'
corepack pnpm db:types
Write-Host "Generado: src/types/database.ts"
