---
tipo: arquitectura
estado: propuesta
actualizado: 2026-10-03
tags:
  - arquitectura
  - estructura
---

# Estructura del proyecto â€” diseÃ±o inicial

**Proyecto:** Sistema de GestiÃ³n Integral para un Centro Educativo y TerapÃ©utico (Paraguay), por fases.
**Fase 1:** base del sistema, roles y permisos granulares, personas, horarios, asistencia y horas pagables.
**Fases siguientes:** facturaciÃ³n (Ekuatia'i / DNIT-SET), extractos bancarios, pacientes/historia clÃ­nica, alumnos, proveedores y clientes.
**Regla de diseÃ±o:** aÃ±adir un mÃ³dulo = aÃ±adir una carpeta, sin reorganizar nada existente.

> Este documento es la propuesta. Cambios aquÃ­ se registran como ADR en `02-Decisiones/`.

## 1. Ãrbol del repositorio

```
centroeducativo/
â”œâ”€ .github/
â”‚  â”œâ”€ workflows/
â”‚  â”‚  â”œâ”€ ci.yml                      # lint + typecheck + tests en cada PR
â”‚  â”‚  â””â”€ supabase.yml                # valida migraciones y tipos generados
â”‚  â””â”€ pull_request_template.md       # checklist: tests, migraciÃ³n, bÃ³veda actualizada
â”œâ”€ .vscode/                          # settings y extensiones recomendadas
â”œâ”€ boveda/                           # bÃ³veda de Obsidian (detalle en la secciÃ³n 2)
â”œâ”€ public/                           # estÃ¡ticos: logos por sede, favicon
â”œâ”€ scripts/
â”‚  â”œâ”€ generar-tipos.ps1              # supabase gen types â†’ src/types/database.ts
â”‚  â”œâ”€ seed-demo.ts                   # datos ficticios para desarrollo (nunca reales)
â”‚  â””â”€ backup-bd.ps1                  # volcado de la base antes de migrar
â”œâ”€ src/
â”‚  â”œâ”€ app/                           # App Router: solo rutas y composiciÃ³n
â”‚  â”‚  â”œâ”€ (auth)/                     # grupo pÃºblico de sesiÃ³n
â”‚  â”‚  â”‚  â”œâ”€ login/page.tsx
â”‚  â”‚  â”‚  â””â”€ recuperar-clave/page.tsx
â”‚  â”‚  â”œâ”€ (kiosco)/                   # grupo SIN sesiÃ³n de usuario
â”‚  â”‚  â”‚  â””â”€ kiosco-asistencia/
â”‚  â”‚  â”‚     â”œâ”€ page.tsx              # marcaciÃ³n por CI + PIN (Server Action)
â”‚  â”‚  â”‚     â””â”€ _components/          # teclado numÃ©rico, reloj, confirmaciÃ³n
â”‚  â”‚  â”œâ”€ (dashboard)/                # grupo protegido
â”‚  â”‚  â”‚  â”œâ”€ layout.tsx               # shell: sesiÃ³n, sede activa, menÃº segÃºn permisos
â”‚  â”‚  â”‚  â”œâ”€ page.tsx                 # panel de inicio (varÃ­a por rol)
â”‚  â”‚  â”‚  â”œâ”€ personas/                # nÃºcleo de identidad
â”‚  â”‚  â”‚  â”œâ”€ horarios/
â”‚  â”‚  â”‚  â”œâ”€ asistencia/              # marcaciones, diarias, correcciones
â”‚  â”‚  â”‚  â”œâ”€ horas-pagables/          # tarifas, reglas y liquidaciÃ³n
â”‚  â”‚  â”‚  â”œâ”€ configuracion/           # sedes, parÃ¡metros, tolerancias, tarifas
â”‚  â”‚  â”‚  â”œâ”€ seguridad/               # roles, pantallas, permisos
â”‚  â”‚  â”‚  â”œâ”€ pacientes/               # FASE 2 (carpeta prevista)
â”‚  â”‚  â”‚  â”œâ”€ alumnos/                 # FASE 2 (carpeta prevista)
â”‚  â”‚  â”‚  â”œâ”€ facturacion/             # FASE 3 Ekuatia'i / DNIT-SET (prevista)
â”‚  â”‚  â”‚  â”œâ”€ tesoreria/               # FASE 3 extractos bancarios (prevista)
â”‚  â”‚  â”‚  â””â”€ proveedores/             # FASE 3 (prevista)
â”‚  â”‚  â”œâ”€ api/
â”‚  â”‚  â”‚  â”œâ”€ integraciones/zkteco/marcaciones/route.ts   # receptor ZKTime (futuro)
â”‚  â”‚  â”‚  â””â”€ salud/route.ts           # healthcheck para monitoreo
â”‚  â”‚  â”œâ”€ layout.tsx                  # html/body, providers, locale es-PY
â”‚  â”‚  â”œâ”€ globals.css
â”‚  â”‚  â””â”€ error.tsx Â· loading.tsx Â· not-found.tsx
â”‚  â”œâ”€ features/                      # una carpeta por mÃ³dulo de negocio
â”‚  â”‚  â”œâ”€ personas/                   # identidad, roles de persona, relaciones
â”‚  â”‚  â”œâ”€ seguridad/                  # RBAC: roles, mÃ³dulos-pantalla, permisos
â”‚  â”‚  â”œâ”€ sedes/                      # multi-sede
â”‚  â”‚  â”œâ”€ horarios/                   # plantillas y bloques horarios
â”‚  â”‚  â”œâ”€ asistencia/                 # marcaciones â†’ diarias â†’ correcciones
â”‚  â”‚  â”œâ”€ horas-pagables/             # reglas configurables y tarifas con vigencia
â”‚  â”‚  â”œâ”€ integraciones/              # adaptadores externos (zkteco y futuros)
â”‚  â”‚  â”œâ”€ auditoria/                  # registro de cambios sensibles
â”‚  â”‚  â””â”€ configuracion/              # parÃ¡metros de negocio con vigencia
â”‚  â”œâ”€ components/
â”‚  â”‚  â”œâ”€ ui/                         # shadcn/ui (generado; no editar a mano)
â”‚  â”‚  â”œâ”€ layout/                     # sidebar, header, selector de sede
â”‚  â”‚  â”œâ”€ data-table/                 # tabla, paginaciÃ³n y filtros reutilizables
â”‚  â”‚  â”œâ”€ forms/                      # campos CI, fecha PY, moneda PYG, PIN
â”‚  â”‚  â””â”€ shared/                     # estados vacÃ­os, cargas, confirmaciones
â”‚  â”œâ”€ lib/
â”‚  â”‚  â”œâ”€ supabase/                   # client.ts, server.ts, admin.ts, middleware.ts
â”‚  â”‚  â”œâ”€ auth/                       # sesiÃ³n, permisos, es_admin_general
â”‚  â”‚  â”œâ”€ tz/                         # America/Asuncion â†” UTC
â”‚  â”‚  â”œâ”€ format/                     # pyg.ts, fecha.ts, ci.ts
â”‚  â”‚  â”œâ”€ validation/                 # ci.ts, pin.ts, esquemas compartidos
â”‚  â”‚  â”œâ”€ constants/                  # orÃ­genes de marcaciÃ³n, estados, mÃ³dulos
â”‚  â”‚  â”œâ”€ errors/                     # errores tipados y mensajes en espaÃ±ol
â”‚  â”‚  â””â”€ utils.ts                    # cn y utilidades sin dominio
â”‚  â”œâ”€ types/
â”‚  â”‚  â”œâ”€ database.ts                 # GENERADO por Supabase CLI (no editar)
â”‚  â”‚  â””â”€ domain.ts                   # alias y tipos derivados
â”‚  â””â”€ middleware.ts                  # refresco de sesiÃ³n + control por rol
â”œâ”€ supabase/
â”‚  â”œâ”€ config.toml
â”‚  â”œâ”€ migrations/                    # YYYYMMDDHHMMSS_descripcion.sql
â”‚  â”œâ”€ seed.sql                       # catÃ¡logos mÃ­nimos: sedes, mÃ³dulos, permisos
â”‚  â”œâ”€ tests/rls/                     # pruebas pgTAP de aislamiento por sede/rol
â”‚  â””â”€ functions/                     # edge functions (receptor ZKTime, futuro)
â”œâ”€ .editorconfig Â· .gitignore Â· .nvmrc
â”œâ”€ .env.example                      # variables de la secciÃ³n 4 (.env.local ignorado)
â”œâ”€ components.json                   # configuraciÃ³n de shadcn/ui
â”œâ”€ eslint.config.mjs Â· .prettierrc
â”œâ”€ next.config.ts Â· postcss.config.mjs Â· tsconfig.json
â”œâ”€ package.json Â· pnpm-lock.yaml
â””â”€ README.md                         # arranque rÃ¡pido + enlace a la bÃ³veda
```

**Decisiones de estructura no obvias**

- `src/middleware.ts` va **dentro de `src/`**: Next.js lo exige cuando se usa el directorio `src`.
- `app/` solo compone rutas; la lÃ³gica vive en `features/`, para que una pantalla futura (facturaciÃ³n, pacientes) no obligue a mover nada.
- Las rutas de fases futuras se crean **vacÃ­as ahora**: reservan la URL y documentan la intenciÃ³n.
- `(kiosco)` es un route group **fuera** de `(dashboard)` para que el kiosco no herede el layout con sesiÃ³n ni el selector de sede.
- `src/types/database.ts` es **generado**: nunca se edita a mano, asÃ­ los tipos no divergen del esquema real.
- `services/` (lÃ³gica pura, testeable) separado de `queries/` (acceso a datos) y `actions/` (borde HTTP): el cÃ¡lculo de horas se prueba sin base de datos.
- `supabase/tests/rls/` existe desde el dÃ­a uno: los permisos acotados por sede sin pruebas se rompen en silencio.
- Si el proyecto usa Tailwind v4, **no habrÃ¡ `tailwind.config.ts`** (configuraciÃ³n en CSS).

### Forma interna de cada mÃ³dulo (`src/features/<modulo>/`)

```
features/<modulo>/
â”œâ”€ components/     # UI propia del mÃ³dulo
â”œâ”€ actions/        # Server Actions ('use server'), validan con Zod antes de tocar la BD
â”œâ”€ schemas/        # Zod compartido cliente/servidor (una sola verdad de validaciÃ³n)
â”œâ”€ queries/        # lectura tipada desde Supabase
â”œâ”€ services/       # dominio puro y testeable (horas, redondeos, tolerancias)
â”œâ”€ hooks/          # hooks de TanStack Query
â”œâ”€ types.ts        # tipos del mÃ³dulo
â””â”€ index.ts        # superficie pÃºblica (evita imports con rutas profundas)
```

## 2. Ãrbol de la bÃ³veda de Obsidian

Criterio: **cargar poco contexto por tarea**. Notas cortas (â‰¤1 pantalla), muy enlazadas, y un Ã­ndice que dice quÃ© leer segÃºn lo que se vaya a hacer.

```
boveda/
â”œâ”€ 00-Inicio.md                      # Ã­ndice maestro + tabla "tarea â†’ notas a leer"
â”œâ”€ 01-Contexto/
â”‚  â”œâ”€ Proyecto.md                    # quÃ© es, fases y alcance de la fase 1
â”‚  â”œâ”€ Stack.md                       # stack obligatorio y motivo de cada pieza
â”‚  â”œâ”€ Glosario.md                    # tÃ©rminos ES/EN: persona, marcaciÃ³n, sede, CIâ€¦
â”‚  â””â”€ Entorno-Local.md               # comandos, rutas y problemas conocidos
â”œâ”€ 02-Negocio/
â”‚  â”œâ”€ Reglas-Paraguay.md             # CI, RUC, Ekuatia'i/DNIT-SET, feriados, moneda
â”‚  â”œâ”€ Multisede.md                   # 2 sedes hoy, N maÃ±ana; sede_id en todo
â”‚  â”œâ”€ Horarios.md                    # plantillas y bloques
â”‚  â”œâ”€ Asistencia.md                  # marcaciones â†’ diarias â†’ correcciones
â”‚  â””â”€ Horas-Pagables.md              # modalidades, tarifas con vigencia, redondeos
â”œâ”€ 03-Tecnico/
â”‚  â”œâ”€ Estructura-Carpetas.md         # este diseÃ±o
â”‚  â”œâ”€ Modelo-de-Datos.md             # tablas nÃºcleo y convenciones (ES snake_case)
â”‚  â”œâ”€ RBAC-y-RLS.md                  # roles, permisos_rol, es_admin_general, RLS
â”‚  â”œâ”€ Zona-Horaria-y-Moneda.md       # UTC en BD, America/Asuncion, PYG bigint
â”‚  â”œâ”€ Convenciones-Codigo.md         # nombres, Zod, Server Actions, commits
â”‚  â””â”€ Integraciones.md               # ZKTime, Ekuatia'i, bancos (previstas)
â”œâ”€ 04-Operacion/
â”‚  â”œâ”€ Entornos-y-Despliegue.md       # Supabase, Vercel, GitHub, backups
â”‚  â”œâ”€ Seguridad-y-Datos.md           # datos clÃ­nicos y de menores, auditorÃ­a
â”‚  â””â”€ Pruebas.md                     # RLS con pgTAP, datos ficticios, CI
â”œâ”€ 05-Decisiones/                    # ADR-0001-*.md (una decisiÃ³n por nota)
â”œâ”€ 06-Bitacora/                      # AAAA-MM-DD.md (sesiones de trabajo)
â”œâ”€ 07-Prompts/                       # prompts por fase: cargar solo lo necesario
â”‚  â”œâ”€ Plantilla-Prompt-Tarea.md      # encabezado estÃ¡ndar + notas a adjuntar
â”‚  â”œâ”€ Fase-1-Base.md
â”‚  â”œâ”€ Fase-1-RBAC.md
â”‚  â”œâ”€ Fase-1-Personas.md
â”‚  â”œâ”€ Fase-1-Horarios.md
â”‚  â”œâ”€ Fase-1-Asistencia.md
â”‚  â””â”€ Fase-1-Horas-Pagables.md
â”œâ”€ 08-Plantillas/                    # ADR, mÃ³dulo nuevo, migraciÃ³n, bug, reuniÃ³n
â””â”€ 99-Inbox.md                       # captura rÃ¡pida, se vacÃ­a cada sesiÃ³n
```

**CÃ³mo se ahorra contexto**

1. `00-Inicio.md` contiene una tabla *tarea â†’ notas* (p. ej. "cÃ¡lculo de horas" â†’ `Horas-Pagables` + `Modelo-de-Datos` + `Zona-Horaria-y-Moneda`).
2. Cada nota empieza con frontmatter y una frase de resumen; lo demÃ¡s son reglas y enlaces, sin relleno.
3. `07-Prompts/` guarda el encabezado ya escrito por fase: se pega el prompt de la fase y se adjuntan las 2â€“3 notas que la propia tabla indica.
4. Nada de duplicar: la regla vive en una nota y las demÃ¡s la enlazan.
5. La bÃ³veda **solo contiene notas** (el cÃ³digo estÃ¡ en `src/`), asÃ­ que el grafo y la bÃºsqueda quedan limpios sin exclusiones que mantener.

## 3. Orden de creaciÃ³n (solo comandos)

```powershell
# 0. Git disponible en esta sesiÃ³n (Windows: estÃ¡ instalado fuera del PATH)
$env:Path += ";$env:LOCALAPPDATA\Programs\Git\cmd"

# 1. Gestor de paquetes (Node 24 trae corepack)
corepack enable
corepack prepare pnpm@latest --activate

# 2. Proyecto Next.js â€” se genera en una carpeta temporal porque la raÃ­z ya
#    contiene README.md y .gitignore (create-next-app aborta si hay conflicto)
pnpm dlx create-next-app@latest ../centroeducativo-scaffold `
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
Get-ChildItem ../centroeducativo-scaffold -Force | Move-Item -Destination . -Force
Remove-Item ../centroeducativo-scaffold -Recurse -Force

# 3. shadcn/ui y componentes base
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input label card table dialog alert-dialog form select sheet dropdown-menu badge sonner tabs separator skeleton

# 4. Dependencias
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query zod react-hook-form @hookform/resolvers lucide-react date-fns date-fns-tz clsx tailwind-merge
pnpm add -D supabase prettier prettier-plugin-tailwindcss vitest @vitejs/plugin-react @testing-library/react jsdom

# 5. Supabase
pnpm supabase init
pnpm supabase login
pnpm supabase link --project-ref <REF_DEL_PROYECTO>
pnpm supabase start
pnpm supabase db pull
pnpm supabase gen types typescript --local > src/types/database.ts

# 6. Estructura de carpetas previstas (vacÃ­os con .gitkeep)
#    src/features/*, src/app/(dashboard)/<fases futuras>, supabase/tests/rls

# 7. Scripts de package.json
#    dev, build, start, lint, typecheck, format, test, db:start, db:reset,
#    db:migrate, db:types, seed, kiosco:dev

# 8. Entorno
Copy-Item .env.example .env.local
#    rellenar .env.local con las claves de Supabase

# 9. Git y primer commit
git init
git add .
git commit -m "chore: estructura inicial del proyecto (Next.js + Supabase)"
git branch -M main
git remote add origin https://github.com/<USUARIO>/<REPO>.git
git push -u origin main

# 10. Vercel
pnpm dlx vercel link
#    cargar las variables de entorno en Vercel y conectar el repo de GitHub
```

## 4. Variables de entorno (`.env.example`)

| Variable | Para quÃ© |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (cliente y servidor) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pÃºblica sujeta a RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio; **solo servidor**, nunca `NEXT_PUBLIC_*` |
| `SUPABASE_PROJECT_REF` | Referencia del proyecto para la CLI |
| `SUPABASE_ACCESS_TOKEN` | Token de la CLI (uso local y CI) |
| `SUPABASE_DB_PASSWORD` | ContraseÃ±a de la base para migraciones |
| `NEXT_PUBLIC_APP_URL` | URL base para enlaces y redirecciones |
| `ZKTECO_WEBHOOK_TOKEN` | Secreto del futuro receptor ZKTime (vacÃ­o por ahora) |
| `TZ` | `America/Asuncion` (aunque la app lo fija en cÃ³digo) |

## 5. Convenciones de nombres

| Ãmbito | Regla | Ejemplo |
| --- | --- | --- |
| Carpetas y archivos | kebab-case; sin acentos ni `Ã±` | `horas-pagables/`, `registrar-marcacion.ts` |
| Componentes React | archivo kebab-case, export PascalCase | `selector-sede.tsx` â†’ `SelectorSede` |
| Hooks | `use-*.ts` | `use-asistencias.ts` |
| Server Actions | verbo + sustantivo en camelCase | `registrarMarcacion`, `corregirAsistencia` |
| Tablas y columnas (BD) | espaÃ±ol, snake_case, plural en tablas | `personas`, `marcaciones`, `sede_id` |
| Claves | PK `id` UUID; FK `<tabla_singular>_id` | `persona_id` |
| AuditorÃ­a | `created_at`, `updated_at`, `created_by`, `deleted_at` | â€” |
| Migraciones | `YYYYMMDDHHMMSS_descripcion_snake_case.sql` | `20261003120000_crear_personas.sql` |
| Ramas | tipo + kebab-case | `feat/rbac-permisos-por-sede` |
| Commits | Conventional Commits en espaÃ±ol, scope = mÃ³dulo | `feat(asistencia): registrar marcaciÃ³n desde kiosco` |
| Tipos y esquemas Zod | PascalCase; sufijo `Schema` | `PersonaSchema` |

## 6. Supuestos y dudas

1. **UbicaciÃ³n de la bÃ³veda (bloqueante).** Este diseÃ±o pone la app Next.js en la **raÃ­z del repo** y la bÃ³veda en `boveda/`. Hoy la bÃ³veda *es* la raÃ­z y el cÃ³digo estaba en `codigo/`. Hay que elegir: mover la bÃ³veda a `boveda/` (recomendado, Vercel y la CLI de Supabase funcionan sin configuraciÃ³n extra) o dejar la bÃ³veda en la raÃ­z y la app en `web/` (obliga a fijar el *root directory* en Vercel).
2. **Gestor de paquetes y pruebas.** Asumo **pnpm** vÃ­a corepack (no estÃ¡ instalado; npm sÃ­). Y asumo **Vitest** para lÃ³gica pura y **pgTAP** para RLS, porque `services/` y `supabase/tests/rls/` solo sirven si algo los ejecuta.
3. **Credenciales y proyectos.** No sÃ© si ya existen el proyecto Supabase, el repositorio GitHub y el proyecto Vercel, ni sus nombres. `supabase link`, `git remote` y `vercel link` necesitan datos reales.
4. **Kiosco: PIN y conectividad.** Asumo PIN **por persona** (4â€“6 dÃ­gitos, con *hash* y bloqueo por intentos). Si el kiosco debe seguir marcando sin internet, hace falta cola local en el navegador (IndexedDB) y eso aÃ±ade estructura que hoy no estÃ¡ prevista.
5. **MigraciÃ³n de la bÃ³veda actual.** Ya hay contenido escrito (contexto, dominio, glosario, 3 ADR, 5 errores resueltos). Â¿Se migra a la estructura nueva de la secciÃ³n 2 o se empieza de cero?

## Relacionado

- [[Stack]] Â· [[Modelo-de-Datos]] Â· [[Vision-Arquitectura]] Â· [[Seguridad-y-Datos]] Â· [[Roles-y-Permisos]]
