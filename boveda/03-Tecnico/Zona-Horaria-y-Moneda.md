---
tipo: tecnico
actualizado: 2026-10-03
tags:
  - tecnico
---

# Zona horaria y moneda

Reglas transversales que el código debe respetar **siempre**; las utilidades viven en `src/lib/`.

## Zona horaria

- **En BD, todo instante es `timestamptz` (UTC).** Nunca `timestamp without time zone` para un momento real.
- **Presentación y cálculo en `America/Asuncion`** (UTC-4 / UTC-3 en verano).
- El "día de trabajo" de una persona se define por la fecha local en Asunción, no por la fecha UTC.
- Librería: `date-fns` + `date-fns-tz` (zonas con nombre IANA).
- Utilidades previstas en `src/lib/tz/`: `nowAsuncion()`, `startOfDayAsuncion()`, `toUTC()`, `fromUTC()`, `zonedFormat()`.

## Moneda (PYG)

- **Tipo de dato: `bigint`**, sin decimales. El guaraní se maneja entero.
- Nunca `number`/`float` para dinero (pérdida de precisión); ni `numeric` con decimales innecesarios.
- **Formato de presentación:** `Gs. 150.000` (símbolo + punto como separador de miles).
- Utilidades previstas en `src/lib/format/pyg.ts`: `formatearPYG(int)`, `parsearPYG(str)`.
- Toda tarifa, cargo y pago usa `bigint` → [[Modelo-de-Datos]].

## Regla de oro

Cualquier fecha, hora o importe que cruce la frontera cliente↔servidor↔BD pasa por estas utilidades; **está prohibido** formatear con `toLocaleString()` suelto o sumar milisegundos a mano en un componente.

## Relacionado

- [[Reglas-Paraguay]] · [[Asistencia]] · [[Horas-Pagables]] · [[Modelo-de-Datos]]
