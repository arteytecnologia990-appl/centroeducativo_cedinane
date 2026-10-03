---
tipo: indice
actualizado: 2026-10-03
tags:
  - indice
---

# Centro Educativo — Índice maestro

Segundo cerebro del proyecto. **Regla de oro: cargar poco contexto por tarea.** Aquí se decide qué leer; no se lee todo.

## Protocolo del agente (antes de actuar)

1. Leer este índice y [[Estado-Actual]].
2. Leer la última entrada de `06-Bitacora/`.
3. Mirar `05-Decisiones/` antes de proponer cambios estructurales.
4. Consultar la nota del dominio que toque (`02-Negocio/`) antes de inventar reglas.
5. Al cerrar la sesión: actualizar [[Estado-Actual]], añadir la nota del día en `06-Bitacora/` y registrar cada decisión nueva como ADR.
6. **Código Next.js 16:** antes de escribir, leer la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md` en la raíz).

## Tabla "tarea → notas a leer"

| Voy a… | Leo |
| --- | --- |
| Trabajar la base / arrancar | [[Proyecto]] + [[Stack]] + [[Estado-Actual]] |
| Tocar usuarios, sesiones o permisos | [[RBAC-y-RLS]] + [[Seguridad-y-Datos]] |
| Diseñar o migrar tablas | [[Modelo-de-Datos]] + [[Reglas-Paraguay]] + [[Zona-Horaria-y-Moneda]] |
| Registrar una marca de asistencia | [[Asistencia]] + [[Zona-Horaria-y-Moneda]] |
| Calcular horas pagables | [[Horas-Pagables]] + [[Modelo-de-Datos]] |
| Horarios | [[Horarios]] |
| Sede / multisede | [[Multisede]] |
| Integración externa (ZKTime, Ekuatia'i) | [[Integraciones]] |
| Configurar entorno o arreglar un fallo | [[Entorno-Local]] |
| Desplegar | [[Entornos-y-Despliegue]] |
| Añadir un módulo nuevo | [[Estructura-Carpetas]] + [[Convenciones-Codigo]] |

## Mapa

| Carpeta | Rol |
| --- | --- |
| `01-Contexto/` | Qué es, stack, glosario, entorno y estado |
| `02-Negocio/` | Reglas del dominio (Paraguay, multisede, horarios, asistencia, horas) |
| `03-Tecnico/` | Estructura, datos, RBAC/RLS, zona horaria, convenciones, integraciones |
| `04-Operacion/` | Entornos, despliegue, seguridad, pruebas |
| `05-Decisiones/` | ADRs (una decisión por nota) |
| `06-Bitacora/` | Diario de sesiones |
| `07-Prompts/` | Prompts por fase, listos para pegar |
| `08-Plantillas/` | Plantillas reutilizables |
| `90-Archivo/` | Material anterior al proyecto actual (legado, revisar en fases 2+) |
| `99-Inbox.md` | Captura rápida |

## Estado en una línea

Fase 1 del producto: **estructura del repositorio materializándose** (Next.js 16 + Supabase). Detalle y preguntas → [[Estado-Actual]].
