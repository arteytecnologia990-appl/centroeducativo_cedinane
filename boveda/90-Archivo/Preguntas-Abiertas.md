---
tipo: preguntas
actualizado: 2026-10-03
tags:
  - cerebro
  - pregunta
  - pendiente
---

# 07 Â· Preguntas abiertas

Lo que hay que responder para avanzar. Cada pregunta tiene un **porquÃ©** (quÃ© desbloquea) y un estado.

Estados: ðŸ”´ bloquea | ðŸŸ¡ importante, no bloquea | ðŸŸ¢ resuelta (se mueve a [[Estado-Actual]] o a un ADR)

## Bloqueantes para empezar

### P-001 ðŸŸ¢ Â¿QuÃ© es exactamente el centro educativo y quiÃ©n lo usarÃ¡?

- **PorquÃ©:** define el alcance, los roles y el tono de la interfaz.
- **Necesito:** tipo de centro (primaria, secundaria, academia, infantil), tamaÃ±o aproximado (n.Âº de alumnos y docentes) y quiÃ©n usarÃ¡ el sistema (direcciÃ³n, secretarÃ­a, docentes, familias).

### P-002 ðŸŸ¢ Â¿CuÃ¡l es el stack tÃ©cnico?

- **PorquÃ©:** sin esto no se puede crear el proyecto real en `codigo/`.
- **Necesito:** lenguaje y framework. Opciones sensatas a decidir en [[Stack]]:
  - A) **Web todo-en-uno**: Next.js + TypeScript + base de datos relacional.
  - B) **API + SPA**: Node/Express (o NestJS) + React + PostgreSQL.
  - C) **Escritorio**: app nativa o Electron con base de datos local.
  - D) **Sin cÃ³digo, hoja de cÃ¡lculo/plantillas**: si el objetivo es ordenar procesos antes de programar.

### P-003 ðŸŸ¢ Â¿CuÃ¡l es el alcance del primer entregable (MVP)?

- **PorquÃ©:** evita construir todo a la vez.
- **Necesito:** las 3â€“5 funcionalidades imprescindibles. Candidatas en [[Backlog]]: alumnos, matrÃ­cula, asistencia, calificaciones, pagos.

### P-004 ðŸ”´ Â¿DÃ³nde vivirÃ¡n los datos y quiÃ©n los respalda?

- **PorquÃ©:** hay datos de menores; condiciona arquitectura y legalidad â†’ [[Seguridad-y-Datos]].
- **Necesito:** local en un solo equipo, servidor propio, o nube; y quiÃ©n es el responsable de los datos.

## Importantes, no bloqueantes

### P-005 ðŸŸ¡ Â¿Un solo centro educativo o varios?

Si algÃºn dÃ­a son varios, el modelo de datos debe nacer preparado. Impacta [[Modelo-de-Datos]].

### P-006 ðŸŸ¡ Â¿Se integra con algo existente?

Plataformas actuales (hojas de cÃ¡lculo, software previo, sistemas de la administraciÃ³n educativa), exportaciones o importaciones necesarias.

### P-007 ðŸŸ¡ Â¿QuÃ© informes o boletines se imprimen hoy?

Determina plantillas de salida (PDF, Excel) y su formato oficial.

### P-008 ðŸŸ¡ Â¿Acceso desde mÃ³vil?

Condiciona el diseÃ±o responsive y si conviene una app aparte.

### P-009 ðŸŸ¡ Â¿QuiÃ©n mantendrÃ¡ el sistema despuÃ©s?

Define cuÃ¡nta complejidad es razonable y quÃ© documentaciÃ³n es obligatoria.

### P-010 ðŸŸ¡ Â¿Notificaciones por correo/WhatsApp a las familias?

Integraciones externas con coste y configuraciÃ³n.

## Dudas del diseÃ±o de estructura (sesiÃ³n 1)

Detalle y consecuencias en [[Estructura-Carpetas]] (secciÃ³n 6):

- ðŸŸ¡ **P-011** Â¿La bÃ³veda se queda en la raÃ­z y la app va en `web/`, o la app ocupa la raÃ­z y la bÃ³veda se mueve a `boveda/`?
- ðŸŸ¡ **P-012** Â¿pnpm vÃ­a corepack o npm? Â¿Se aÃ±aden Vitest y pgTAP para las pruebas?
- ðŸŸ¡ **P-013** Â¿Existen ya el proyecto Supabase, el repositorio GitHub y el proyecto Vercel? Â¿Con quÃ© nombres?
- ðŸŸ¡ **P-014** Kiosco: Â¿PIN por persona o compartido? Â¿Debe poder marcar sin conexiÃ³n (cola local)?
- ðŸŸ¡ **P-015** Â¿Se migra el contenido ya escrito de la bÃ³veda a la estructura nueva, o se empieza de cero?

## Resueltas

- ðŸŸ¢ **P-000** Â¿DÃ³nde vive la documentaciÃ³n y la memoria del proyecto? â†’ En esta bÃ³veda de Obsidian, junto al cÃ³digo. Ver [[ADR-0001-Vault-como-raiz-del-proyecto]].
- ðŸŸ¢ **P-001** Â¿QuÃ© es el centro y quiÃ©n lo usarÃ¡? â†’ Centro **educativo y terapÃ©utico** en Paraguay, 2 sedes (diseÃ±o para N), desarrollo por fases. Usuarios de fase 1: direcciÃ³n, administraciÃ³n, profesionales y personal del centro. Ver [[Proyecto]].
- ðŸŸ¢ **P-002** Â¿CuÃ¡l es el stack? â†’ Next.js (App Router, Server Actions) + TypeScript estricto, Tailwind + shadcn/ui + Lucide, Supabase (PostgreSQL, Auth, RLS, Storage), TanStack Query, Zod, Vercel + GitHub, Obsidian como segundo cerebro. Ver [[ADR-0004-Stack-y-arquitectura-por-fases]].
- ðŸŸ¢ **P-003** Â¿Alcance del primer entregable? â†’ **Fase 1**: base del sistema, RBAC granular, personas, horarios, asistencia y horas pagables. Ver [[Estructura-Carpetas]].
