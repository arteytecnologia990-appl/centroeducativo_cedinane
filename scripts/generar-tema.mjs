#!/usr/bin/env node
// Genera src/app/globals.css con las 8 combinaciones de tokens (oklch).
// Fuente de verdad del sistema de temas. Uso: node scripts/generar-tema.mjs
import { writeFileSync } from 'node:fs'

// ---------- utilidades de color ----------
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}
function srgbToLin(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function rgbToOklab(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLin)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s)
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const aLab = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  return { L, a: aLab, b: bLab }
}
function oklchStr(L, C, h) {
  const f = (n) => String(+n.toFixed(4))
  return `oklch(${f(L)} ${f(C)} ${f(h)})`
}
function hexToOklch(hex) {
  const { L, a, b } = rgbToOklab(hex)
  const C = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return oklchStr(L, C, +h.toFixed(2))
}
// mezcla en OKLab (perceptual); t = proporción de hexB
function mixOklch(hexA, hexB, t) {
  const A = rgbToOklab(hexA), B = rgbToOklab(hexB)
  const L = A.L + (B.L - A.L) * t
  const a = A.a + (B.a - A.a) * t
  const b = A.b + (B.b - A.b) * t
  const C = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return oklchStr(L, C, +h.toFixed(2))
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(hexA, hexB) {
  const l1 = luminance(hexA), l2 = luminance(hexB)
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}
const AJUSTES = []
function darken(hex, f) {
  const [r, g, b] = hexToRgb(hex)
  const to = (v) => Math.round(v * f * 255).toString(16).padStart(2, '0')
  return '#' + to(r) + to(g) + to(b)
}
// oscurece (multiplica RGB) hasta alcanzar el contraste mínimo contra bg
function ajustar(hex, bg, min) {
  if (contrast(hex, bg) >= min) return hex
  const original = hex
  for (let i = 1; i <= 200; i++) {
    const f = 1 - i * 0.01
    const cur = darken(original, f)
    if (contrast(cur, bg) >= min) return cur
  }
  return darken(original, 0.05)
}

// ---------- paletas (14 tokens x 8 combinaciones) ----------
const PAL = {
  a: {
    light: { background:'#F3F7F9', card:'#FFFFFF', foreground:'#10283A', mutedForeground:'#5A7083', border:'#D6E1E8', primary:'#0E7C86', primaryForeground:'#FFFFFF', accent:'#DCF0F2', success:'#1F7A4D', successSoft:'#DDF3E7', warning:'#B4530A', warningSoft:'#FDEBD6', destructive:'#B42318', destructiveSoft:'#FDE4E1' },
    dark:  { background:'#0C1A22', card:'#132732', foreground:'#E3EEF3', mutedForeground:'#8FA7B5', border:'#234252', primary:'#3FB6C0', primaryForeground:'#05252A', accent:'#12363C', success:'#4CC38A', successSoft:'#123A2A', warning:'#F0A55A', warningSoft:'#3B2A12', destructive:'#FF8A80', destructiveSoft:'#44211F' },
  },
  b: {
    light: { background:'#F6F2FD', card:'#FFFFFF', foreground:'#2A2152', mutedForeground:'#6B6390', border:'#E4DDF5', primary:'#6A4CE0', primaryForeground:'#FFFFFF', accent:'#EAE4FF', success:'#1E8E5A', successSoft:'#DFF5EA', warning:'#C2570C', warningSoft:'#FFEBD9', destructive:'#D6336C', destructiveSoft:'#FFE3EC' },
    dark:  { background:'#17122E', card:'#211A40', foreground:'#EFEBFF', mutedForeground:'#A59FC6', border:'#372E63', primary:'#9C86FF', primaryForeground:'#17122E', accent:'#302659', success:'#52D69A', successSoft:'#12382A', warning:'#FFAE66', warningSoft:'#40290F', destructive:'#FF7FA6', destructiveSoft:'#47172B' },
  },
  c: {
    light: { background:'#F1F5FA', card:'#FFFFFF', foreground:'#0F2038', mutedForeground:'#5B6E88', border:'#D3DDEA', primary:'#1D6FE0', primaryForeground:'#FFFFFF', accent:'#DEEBFD', success:'#14794A', successSoft:'#DCF3E8', warning:'#A15A06', warningSoft:'#FCEBD2', destructive:'#C0322B', destructiveSoft:'#FCE3E1' },
    dark:  { background:'#0E1726', card:'#15233A', foreground:'#E7EEF8', mutedForeground:'#94A6BF', border:'#243651', primary:'#5AA2FF', primaryForeground:'#07192E', accent:'#1B3556', success:'#4CC38A', successSoft:'#14392B', warning:'#F2B35B', warningSoft:'#3D2E12', destructive:'#FF7B72', destructiveSoft:'#44201F' },
  },
  d: {
    light: { background:'#EFF3EC', card:'#FAFCF8', foreground:'#22332A', mutedForeground:'#5E7266', border:'#D5DECF', primary:'#46745A', primaryForeground:'#FFFFFF', accent:'#DCEBDD', success:'#2F7D4F', successSoft:'#DDF0E1', warning:'#A8721A', warningSoft:'#F6E9CC', destructive:'#A8402F', destructiveSoft:'#F6DDD7' },
    dark:  { background:'#121B16', card:'#1A261F', foreground:'#E4EEE6', mutedForeground:'#94A99B', border:'#2C3F33', primary:'#86BE9B', primaryForeground:'#0E1912', accent:'#23382B', success:'#6CCB8F', successSoft:'#173826', warning:'#E3B45E', warningSoft:'#3A2D12', destructive:'#EE8E7B', destructiveSoft:'#40201A' },
  },
}

const SHAPE = {
  a: { radius: '0.375rem', fontSans: 'var(--font-source-sans-3)', fontHeading: 'var(--font-source-sans-3)', density: '0.875rem', shadowLight: '0 0 0 1px var(--border)' },
  b: { radius: '1.25rem', fontSans: 'var(--font-nunito)', fontHeading: 'var(--font-fredoka)', density: '1.125rem', shadowLight: '0 10px 28px -12px color-mix(in oklab, var(--primary) 26%, transparent)' },
  c: { radius: '0.625rem', fontSans: 'var(--font-manrope)', fontHeading: 'var(--font-manrope)', density: '1rem', shadowLight: 'inset 0 1px 0 0 color-mix(in oklab, var(--card) 55%, transparent), 0 1px 2px 0 color-mix(in oklab, var(--foreground) 8%, transparent)' },
  d: { radius: '0.875rem', fontSans: 'var(--font-karla)', fontHeading: 'var(--font-fraunces)', density: '1rem', shadowLight: '0 6px 18px -8px color-mix(in oklab, var(--primary) 16%, transparent)' },
}
// sombra en oscuro: reemplazar por borde (regla del spec)
const shadowDark = '0 0 0 1px var(--border)'

// ---------- build de bloques ----------
function bloqueEstilo(estilo, modo) {
  const p = PAL[estilo][modo]
  const s = SHAPE[estilo]
  const lines = []
  let success = p.success, warning = p.warning, destructive = p.destructive
  if (modo === 'light') {
    success = ajustar(success, p.background, 4.5)
    warning = ajustar(warning, p.background, 4.5)
    destructive = ajustar(destructive, p.background, 4.5)
    if (success !== p.success) AJUSTES.push(`${estilo} ${modo} · success: ${p.success} -> ${success}`)
    if (warning !== p.warning) AJUSTES.push(`${estilo} ${modo} · warning: ${p.warning} -> ${warning}`)
    if (destructive !== p.destructive) AJUSTES.push(`${estilo} ${modo} · destructive: ${p.destructive} -> ${destructive}`)
  }
  lines.push(`  --background: ${hexToOklch(p.background)};`)
  lines.push(`  --card: ${hexToOklch(p.card)};`)
  lines.push(`  --foreground: ${hexToOklch(p.foreground)};`)
  lines.push(`  --muted-foreground: ${hexToOklch(p.mutedForeground)};`)
  lines.push(`  --border: ${hexToOklch(p.border)};`)
  lines.push(`  --primary: ${hexToOklch(p.primary)};`)
  lines.push(`  --primary-foreground: ${hexToOklch(p.primaryForeground)};`)
  lines.push(`  --accent: ${hexToOklch(p.accent)};`)
  lines.push(`  --success: ${hexToOklch(success)};`)
  lines.push(`  --success-soft: ${hexToOklch(p.successSoft)};`)
  lines.push(`  --warning: ${hexToOklch(warning)};`)
  lines.push(`  --warning-soft: ${hexToOklch(p.warningSoft)};`)
  lines.push(`  --destructive: ${hexToOklch(destructive)};`)
  lines.push(`  --destructive-soft: ${hexToOklch(p.destructiveSoft)};`)
  // derivados (mezcla fondo/superficie)
  lines.push(`  --secondary: ${mixOklch(p.card, p.background, 0.1)};`)
  lines.push(`  --muted: ${mixOklch(p.background, p.card, 0.5)};`)
  // forma/tipografía/densidad (solo en el bloque claro, idéntico en oscuro)
  if (modo === 'light') {
    lines.push(`  --radius: ${s.radius};`)
    lines.push(`  --densidad: ${s.density};`)
    lines.push(`  --font-sans: ${s.fontSans};`)
    lines.push(`  --font-heading: ${s.fontHeading};`)
    lines.push(`  --shadow-card: ${s.shadowLight};`)
  } else {
    lines.push(`  --shadow-card: ${shadowDark};`)
  }
  return lines
}

// ---------- contraste ----------
function reportContraste() {
  const pares = [
    ['texto / fondo', (p) => contrast(p.foreground, p.background), 4.5],
    ['texto suave / fondo', (p) => contrast(p.mutedForeground, p.background), 4.5],
    ['texto suave / superficie', (p) => contrast(p.mutedForeground, p.card), 4.5],
    ['texto / superficie', (p) => contrast(p.foreground, p.card), 4.5],
    ['texto / acento', (p) => contrast(p.primaryForeground, p.primary), 4.5],
    ['borde / fondo', (p) => contrast(p.border, p.background), 3],
    ['error / fondo', (p) => contrast(p.destructive, p.background), 4.5],
    ['éxito / fondo', (p) => contrast(p.success, p.background), 4.5],
    ['atención / fondo', (p) => contrast(p.warning, p.background), 4.5],
  ]
  console.log('CONTRASTE WCAG (ratio : mínimo)')
  for (const estilo of ['a', 'b', 'c', 'd']) {
    for (const modo of ['light', 'dark']) {
      const p = PAL[estilo][modo]
      const eff = { ...p }
      if (modo === 'light') {
        eff.success = ajustar(p.success, p.background, 4.5)
        eff.warning = ajustar(p.warning, p.background, 4.5)
        eff.destructive = ajustar(p.destructive, p.background, 4.5)
      }
      const res = pares.map(([nombre, fn, min]) => {
        const r = fn(eff)
        return `${nombre}=${r.toFixed(2)}${r < min ? ' ⚠️' : ''}`
      })
      console.log(`[${estilo} ${modo}]  ${res.join('  ·  ')}`)
    }
  }
}

// ---------- emitir globals.css ----------
const shared = `:root {
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --secondary-foreground: var(--foreground);
  --accent-foreground: var(--primary);
  --input: var(--border);
  --ring: var(--primary);
  --sidebar: var(--card);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--primary);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
  --chart-1: var(--primary);
  --chart-2: var(--success);
  --chart-3: var(--warning);
  --chart-4: var(--destructive);
  --chart-5: var(--muted-foreground);
}`

const bloques = []
for (const estilo of ['a', 'b', 'c', 'd']) {
  for (const modo of ['light', 'dark']) {
    const sel = modo === 'light' ? `[data-estilo="${estilo}"]` : `[data-estilo="${estilo}"].dark`
    bloques.push(`${sel} {\n${bloqueEstilo(estilo, modo).join('\n')}\n}`)
  }
}

const css = `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-heading: var(--font-heading);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-soft: var(--destructive-soft);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --shadow-card: var(--shadow-card);
}

${shared}

${bloques.join('\n\n')}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-variant-numeric: tabular-nums;
  }
  html {
    @apply font-sans;
  }
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
  }
  ::selection {
    background: var(--primary);
    color: var(--primary-foreground);
  }
}
`

writeFileSync('src/app/globals.css', css)
console.log('globals.css generado OK')
reportContraste()
if (AJUSTES.length) {
  console.log('\nAJUSTES DE CONTRASTE (texto en modo claro):')
  AJUSTES.forEach((a) => console.log('  ' + a))
} else {
  console.log('\nSin ajustes de contraste necesarios.')
}
