---
tipo: arquitectura
actualizado: 2026-10-03
tags:
  - arquitectura
  - pendiente
  - decision
---

# Stack tÃ©cnico

> [!success] Decidido el 2026-10-03
> Stack fijado por el promotor: **Next.js (App Router) + TypeScript estricto Â· Tailwind + shadcn/ui + Lucide Â· Supabase (PostgreSQL, Auth, RLS, Storage) Â· TanStack Query Â· Zod Â· Vercel + GitHub Â· Obsidian como segundo cerebro**.
> DecisiÃ³n completa y consecuencias en [[ADR-0004-Stack-y-arquitectura-por-fases]].
> Lo que queda por concretar (gestor de paquetes, pruebas, credenciales) estÃ¡ en las dudas de [[Estructura-Carpetas]]. El resto de esta nota queda como registro del anÃ¡lisis previo.

## Restricciones que condicionan la elecciÃ³n

- Windows como entorno de desarrollo; PowerShell. Node.js 24 y npm 11 ya instalados.
- Sin equipo tÃ©cnico permanente confirmado *(a confirmar)*: cuanto mÃ¡s simple de mantener, mejor.
- Datos sensibles de menores: autenticaciÃ³n, permisos y auditorÃ­a son obligatorios.
- Posible uso desde el mÃ³vil por docentes y familias *(a confirmar)*.

## Opciones sobre la mesa

| OpciÃ³n | Stack | A favor | En contra | CuÃ¡ndo elegirla |
| --- | --- | --- | --- | --- |
| **A. Web todo-en-uno** | Next.js + TypeScript + PostgreSQL (o SQLite al principio) | Un solo proyecto, despliegue sencillo, gran ecosistema, buena UI sin esfuerzo | Framework con mucha superficie que aprender | OpciÃ³n por defecto si nada empuja en contra |
| **B. API + SPA** | Node/Express o NestJS + React + PostgreSQL | SeparaciÃ³n clara, API reutilizable por mÃ³vil futuro | Dos proyectos, mÃ¡s piezas que mantener | Si se prevÃ© app mÃ³vil o varias interfaces |
| **C. Escritorio** | Electron o app nativa con base de datos local | Funciona sin internet, datos en el centro | Actualizar cada equipo, sin acceso desde casa | Si no hay conexiÃ³n fiable ni servidor |
| **D. Sin programar (todavÃ­a)** | Hoja de cÃ¡lculo bien estructurada + plantillas | Resultado inmediato, cero mantenimiento | No escala, errores manuales | Si el objetivo real es ordenar procesos antes de invertir |

## Criterios de decisiÃ³n (por orden)

1. Que resuelva el MVP ([[Backlog]]) sin construir infraestructura innecesaria.
2. Que pueda mantenerlo una persona con ayuda de un agente.
3. Que sea seguro por defecto para datos de menores.
4. Que funcione en el hardware y la conexiÃ³n reales del centro.
5. Que no encierre los datos en un formato propietario.

## RecomendaciÃ³n provisional (sujeta a P-001â€¦P-004)

**OpciÃ³n A** para empezar: un Ãºnico proyecto web con TypeScript, base de datos relacional (SQLite en desarrollo y para un solo centro; PostgreSQL si hay varios usuarios concurrentes o despliegue en nube), y permisos por rol desde el primer modelo.

## Al cerrar la decisiÃ³n, completar

- [ ] Lenguaje y framework
- [ ] Base de datos y motor
- [ ] Gestor de paquetes (npm, salvo motivo)
- [ ] LibrerÃ­as de interfaz y estilos
- [ ] AutenticaciÃ³n
- [ ] Tests (framework y umbral)
- [ ] Despliegue y copias de seguridad â†’ [[Entornos-y-Despliegue]]
- [ ] ADR en `02-Decisiones/`
- [ ] Comandos reales en [[Entorno-Local]]
