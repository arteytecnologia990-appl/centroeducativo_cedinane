---
tipo: guia
actualizado: 2026-10-03
tags:
  - diseno
  - tema
  - guia
---

# Guía de estilos (sistema de temas)

Cómo usar los tokens y añadir un estilo nuevo. **Fuente de verdad de colores:** `scripts/generar-tema.mjs` (convierte hex → oklch, deriva mezclas y verifica contraste). Los colores hex de esta guía son referencia; en el código solo se usan tokens.

## Los dos ejes

- `data-estilo="a|b|c|d"` en `<html>` → paleta + forma (radio, sombra, densidad, fuente).
- Clase `dark` en `<html>` (next-themes) → modo oscuro.

8 combinaciones = 4 estilos × 2 modos. El servidor pone `data-estilo` desde la cookie (`layout.tsx`) → sin FOUC.

## Tokens

Colores: `--background --foreground --card --card-foreground --popover --popover-foreground --primary --primary-foreground --secondary --secondary-foreground --muted --muted-foreground --accent --accent-foreground --destructive --destructive-soft --success --success-soft --warning --warning-soft --border --input --ring`.
Forma: `--radius --densidad --shadow-card`.
Fuentes: `--font-sans --font-heading --font-mono`.

Utilidades Tailwind (generadas por `@theme inline`): `bg-background text-foreground bg-card text-card-foreground bg-primary text-primary-foreground text-muted-foreground border-border bg-accent text-accent-foreground bg-success-soft text-success bg-warning-soft text-warning bg-destructive-soft text-destructive rounded-lg shadow-card font-heading tabular-nums`.

## Reglas de uso

1. **Prohibido hex dentro de componentes**: todo sale de tokens. (Excepción única: el mini-paleta del `ThemeSwitcher` muestra los colores del catálogo como dato.)
2. **Badges de estado** = icono + texto, nunca solo color → `StatusBadge`.
3. **Estados** (éxito/aviso/error) = fondo `-soft` + texto fuerte del mismo color.
4. **Cifras** (reloj, tablas, montos) con `tabular-nums`.
5. **Oscuro**: las sombras se reemplazan por bordes (ya en `--shadow-card`).
6. **Kiosco** ignora la preferencia personal: usa estilo/modo de la sede.
7. **Contraste**: texto ≥ 4.5:1. El borde fino queda < 3:1 por diseño (los campos se distinguen por el foco).
8. **Contenido Paraguay**: montos `Gs. 150.000` · fechas `dd/mm/aaaa` · hora 24 h · botones con verbo ("Guardar cambios").

## Cómo añadir un quinto estilo

1. En `scripts/generar-tema.mjs`, añadir la entrada `e` en `PAL` (14 tokens × claro/oscuro) y en `SHAPE` (radio, fuentes, densidad, sombra).
2. Registrar la fuente en `layout.tsx` (si es nueva) y en `src/lib/tema/estilos.ts` (nombre + paleta del swatch).
3. Ampliar el tipo `EstiloId` (`estilos.ts`) y el check de `preferencias_usuario` (migración: `estilo in ('a','b','c','d','e')`).
4. `node scripts/generar-tema.mjs` → regenera `globals.css`.
5. `pnpm typecheck && pnpm build` y revisar en `/design-system`.

## Informe de contraste (WCAG AA)

Verificado con el generador (`contrast()` sobre luminancia relativa). **Resultado: todo el texto cumple ≥ 4.5:1 en las 8 combinaciones** tras ajustar 5 colores en modo claro:

| Estilo | Token | Original | Ajustado |
|---|---|---|---|
| B claro | Éxito | `#1E8E5A` | `#1b7e50` |
| B claro | Atención | `#C2570C` | `#b6520b` |
| B claro | Error | `#D6336C` | `#cb3067` |
| D claro | Éxito | `#2F7D4F` | `#2f7c4e` |
| D claro | Atención | `#A8721A` | `#946417` |

Pares evaluados: texto/fondo, texto-suave/fondo, texto-suave/superficie, texto/superficie, texto/acento, error/éxito/atención/fondo. **Bordes finos** (`--border`/`--input`): 1.2–1.7:1 por diseño; se compensan con el anillo de foco (≥3:1) y el fondo de los campos.
