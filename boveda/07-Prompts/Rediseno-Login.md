---
tipo: prompt
rol: disenador-login
actualizado: 2026-10-17
tags:
  - prompt
  - diseno
  - auth
---

# Rediseño del login (prompt profesional)

Prompt para rediseñar la pantalla de inicio de sesión a un modelo profesional. Incluye el inventario verificado y lo que falta.

## ROL

Actúa como **Senior Product Designer + Frontend Engineer** especializado en Auth UX/UI. Rediseñá `/login` a un modelo profesional, seguro, accesible y coherente con el sistema de temas. No cambies la lógica de autenticación salvo lo que se indica.

## PROYECTO

Sistema de Gestión Integral de un Centro Educativo y Terapéutico (Paraguay, 2 sedes). Stack: Next.js 16 (App Router, Server Actions), TypeScript estricto, Tailwind v4 + shadcn/ui (base-ui), Lucide, Supabase Auth. Tokens de tema: `data-estilo="a|b|c|d"` + clase `dark`.

## ESTADO ACTUAL (verificado en el código)

- `/login` es un Server Component que redirige a `/dashboard` si ya hay sesión.
- `LoginForm` (cliente): campos `email` + `password`, botón "Entrar" con estado "Entrando…", y un mensaje de error que distingue **credenciales / conexión / email no confirmado / demasiados intentos**.
- Layout `(auth)`: el formulario aparece centrado, **sin branding**.
- Server Action `login`: `signInWithPassword` → `redirect('/dashboard')`; `logout` cierra sesión.
- Usa los tokens del sistema (background, foreground, destructive-soft, etc.) → respeta los 4 estilos × 2 modos.
- Accesibilidad básica: `<Label htmlFor>`, `required`, `autoComplete`, `role="alert"`.

## FALTANTES (gap analysis)

1. **Branding**: logo, nombre del centro, tagline; layout de dos paneles en escritorio y apilado en móvil.
2. **Recordarme** y sesión persistente explícita.
3. **¿Olvidé mi contraseña?** — flujo de recuperación por correo (`resetPasswordForEmail`).
4. **Mostrar/ocultar contraseña** (toggle con icono).
5. **Validación con Zod** y errores en línea (`aria-invalid` + `aria-describedby`).
6. **Spinner** en el botón y formulario bloqueado durante el envío.
7. **Detector de Caps Lock** (útil al escribir contraseñas).
8. **Redirección al destino solicitado** (`?next=`), en vez de ir siempre a `/dashboard`.
9. **MFA / 2FA** (código de 6 dígitos) — requerido por la Puerta 2 del agente de seguridad.
10. **Límite de intentos / bloqueo temporal** tras varios fallos.
11. **Footer** con aviso de privacidad (Ley 6534/2020) y "¿Problemas para entrar? Contactá a administración".
12. **Accesibilidad**: foco inicial en el primer campo, anuncios con `aria-live`, contraste, teclado.
13. **Estados**: sesión expirada y cuenta deshabilitada.
14. **Tests** del flujo (credenciales correctas/incorrectas, conexión caída).

## OBJETIVO

Un login que transmita confianza, sea rápido de usar, accesible (WCAG AA), coherente con el sistema de temas y seguro por defecto.

## REQUISITOS

- **Solo tokens** (sin hex). Debe verse bien en los 4 estilos × 2 modos (probar en `/design-system`).
- Copy en **español de Paraguay**, claro y directo (botones con verbo: "Entrar", "Recuperar contraseña").
- Errores **genéricos** (no enumerar usuarios ni filtrar si el correo existe).
- Foco visible, navegación por teclado, respetar `prefers-reduced-motion`.
- Responsive: móvil, tablet y escritorio.
- No romper: `proxy.ts` (sesión), RLS ni `preferencias_usuario`.

## ENTREGABLES

1. Análisis y decisiones de diseño (breve).
2. Componentes: `LoginForm` rediseñado (dos paneles), `PasswordInput` con toggle, `CapsLockHint`, `LoginFooter`.
3. Flujo "olvidé mi contraseña": página + acción `recuperarPassword` (`resetPasswordForEmail`).
4. Validación con Zod + accesibilidad.
5. Manejo de `?next=` al redirigir.
6. (Opcional) MFA/2FA.
7. Actualizar `/design-system` con el login nuevo.
8. Nota para la bóveda: `Guia-Login.md`.

## RESTRICCIONES

- No cambiar el esquema salvo lo mínimo para MFA (si se incluye).
- Sin librerías de UI fuera de shadcn/ui y Lucide.
- Responder en español.
- **Detenerse tras el análisis (punto 1) y esperar confirmación** antes de codificar.
