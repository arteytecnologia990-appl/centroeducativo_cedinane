---
tipo: tecnico
actualizado: 2026-10-17
tags:
  - tecnico
  - auth
  - diseno
---

# Guía del login y la recuperación de contraseña

Cómo está armado el flujo de autenticación y qué falta configurar.

## Rutas

| Ruta | Quién | Qué hace |
| --- | --- | --- |
| `/login` | pública | Iniciar sesión (email + clave + recordarme) |
| `/recuperar-clave` | pública | Pedir enlace de recuperación |
| `/restablecer-clave` | pública (con `?code=`) | Elegir contraseña nueva |
| `/` | pública | Redirige a `/login` o `/dashboard` según sesión |
| `/dashboard` | privada | Redirige a `/login` si no hay sesión |

## Piezas

- `src/app/(auth)/layout.tsx`: dos paneles (marca + formulario); en móvil se apila.
- `src/app/(auth)/login/login-form.tsx`: formulario con Zod, `PasswordInput` (mostrar/ocultar + Caps Lock), spinner, recordarme, `?next=` y footer de privacidad.
- `src/lib/auth/actions.ts`: `login`, `logout`, `recuperarPassword`.
- `src/lib/auth/schemas.ts`: esquemas Zod.
- `src/lib/supabase/server.ts`: `createClient({ maxAge })` — la duración de la cookie de sesión.

## Recordarme

- Marcado → cookie de sesión de **30 días** + cookie `recordarme_email` (prefill del correo).
- Desmarcado → sesión de **8 horas** y se borra el correo recordado.

## Recuperación de contraseña

1. `/recuperar-clave` → `resetPasswordForEmail` con `redirectTo = ${NEXT_PUBLIC_APP_URL}/auth/callback?next=/restablecer-clave`.
2. El correo trae un enlace con `?code=...` que pasa por `/auth/callback`.
3. `src/app/auth/callback/route.ts` intercambia el código (`exchangeCodeForSession`) **en el servidor** y redirige a `/restablecer-clave`.
4. `/restablecer-clave` (protegida: sin sesión redirige a recuperar) permite fijar la nueva clave (`updateUser`).

> [!important] Configuración necesaria en Supabase
> En **Authentication → URL Configuration → Redirect URLs** hay que agregar `http://localhost:3000/restablecer-clave` (y el dominio de producción cuando exista). Sin eso, el enlace del correo no vuelve a la app.

## Seguridad

- Mensajes de error **genéricos** (no se revela si un correo existe).
- `recuperarPassword` responde igual exista o no el correo.
- Límite de intentos: lo aplica Supabase Auth (rate limiting).
- **Pendiente**: MFA/2FA para administradores (Puerta 2) y bloqueo por intentos fallidos a nivel de aplicación.

## Pendientes

- MFA (código de 6 dígitos).
- Tests del flujo (credenciales ok/err, conexión caída, recuperación).
- Actualizar la sección de login en `/design-system`.
