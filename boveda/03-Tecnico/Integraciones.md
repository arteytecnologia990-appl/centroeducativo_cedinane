---
tipo: tecnico
actualizado: 2026-10-03
tags:
  - tecnico
  - integraciones
---

# Integraciones

Adaptadores con el mundo exterior. Ninguna está implementada en fase 1; la estructura deja el lugar previsto.

## Principio

No se construye una integración "por si acaso": cada una entra cuando hay un consumidor real. Se reserva la carpeta y se documenta el contrato.

## ZKTeco / ZKTime (reloj biométrico facial) — FASE 1, lugar previsto

- **Punto de entrada:** `src/app/api/integraciones/zkteco/marcaciones/route.ts`.
- **Origen de marcación:** `zkteco` (ver [[Asistencia]]).
- El reloj **empuja** marcas al endpoint; el endpoint valida con un secreto (`ZKTECO_WEBHOOK_TOKEN`) y normaliza a `marcaciones`.
- **Sin implementar todavía**: al crearla, definir autenticación del dispositivo, formato del payload y reintentos.
- Capa de adaptación: `src/features/integraciones/zkteco/`.

## Facturación electrónica — Ekuatia'i / DNIT-SET — FASE 3

- Emisión de facturas electrónicas con numeración y timbrado controlados por DNIT-SET.
- Reservado: `src/features/facturacion/` y `app/(dashboard)/facturacion/`.
- Ver [[Reglas-Paraguay]].

## Extractos bancarios — FASE 3

- Importación de extractos para conciliación de pagos (tesorería).
- Reservado: `src/features/tesoreria/` y `app/(dashboard)/tesoreria/`.

## Integraciones transversales (candidatas)

| Integración | Para qué | Prioridad |
| --- | --- | --- |
| Exportación Excel/CSV | Listados e informes | Alta |
| Generación PDF | Boletines, recibos, certificados | Alta |
| Correo | Avisos a familias | Media |
| WhatsApp/SMS | Avisos urgentes | Baja (datos en terceros) |

## Reglas

1. Todo adaptador externo vive en `src/features/integraciones/` o en el módulo que lo consume; nunca dentro de un componente.
2. Los secretos de integración van en variables de entorno, no en la BD ni en el repo.
3. Cada integración registra: contrato (payload), credenciales, reintentos y trazabilidad.

## Relacionado

- [[Asistencia]] · [[Reglas-Paraguay]] · [[Estructura-Carpetas]]
