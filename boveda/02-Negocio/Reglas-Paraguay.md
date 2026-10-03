---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - paraguay
---

# Reglas de Paraguay

Datos y reglas específicos del país que afectan validación, formato y facturación.

## Cédula de identidad (CI)

- Identificador único de persona. **`UNIQUE`, no es clave primaria** (la PK es `UUID`).
- Formato numérico, sin guiones internos al guardar; se guarda solo dígitos.
- Tiene **dígito verificador**; validar antes de guardar (algoritmo módulo 11). *(a confirmar la variante exacta usada por el centro)*
- Se acepta CI de **menores** (alumnos/pacientes) y de **adultos** (profesionales, tutores, proveedores).
- Utilidad prevista: `src/lib/validation/ci.ts` (`validarCI`, `normalizarCI`, `formatearCI`).

## RUC

- Para **proveedores y clientes** (facturación, fase 3). *(a confirmar si el centro factura o solo recibe facturas)*
- Formato `NNNNNNN-N`: 7 dígitos + dígito de control. Guardar normalizado.

## Moneda — Guaraní (PYG)

- Se guarda como **`bigint`** (entero, sin decimales): el guaraní no tiene fracciones de uso corriente.
- Formato de presentación: `Gs. 150.000` (punto como separador de miles).
- Nunca usar coma flotante para dinero → [[Zona-Horaria-y-Moneda]].

## Facturación electrónica — Ekuatia'i / DNIT-SET

- Sistema nacional de facturación electrónica. **Fase 3**, pero la estructura ya reserva `src/features/facturacion/` y `app/(dashboard)/facturacion/`.
- Implicaciones: numeración controlada por la DNIT-SET, timbrado, envío y contingencia. *(detalles a confirmar cuando arranque la fase)*
- Ver [[Integraciones]].

## Zona horaria y feriados

- Zona `America/Asuncion` (UTC-4, con cambio a UTC-3 en verano). Todo lo temporal se calcula en esta zona → [[Zona-Horaria-y-Moneda]].
- Los **feriados** paraguayos condicionan el cálculo de horas pagables (¿se pagan como jornada normal?). *(a confirmar)*

## Locale

- Interfaz en español, locale `es-PY`; fechas visibles `DD/MM/AAAA`.

## Preguntas

- [ ] ¿Variante exacta del dígito verificador de la CI? ¿Se valida contra algún servicio oficial?
- [ ] ¿El centro usa RUC para compras o para ventas, o ambas?
- [ ] ¿Política de pago de feriados y horas extra?
