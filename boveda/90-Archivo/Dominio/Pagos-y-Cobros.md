---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Pagos y cobros

Dinero: pensiones, matrÃ­cula, servicios y mora. En cÃ³digo: `TuitionFee`, `Payment`, `Invoice`. Sensible y con consecuencias legales: cualquier error aquÃ­ se nota en el bolsillo de las familias.

## Piezas

| Pieza | QuÃ© es |
| --- | --- |
| **Concepto** | Motivo del cobro: matrÃ­cula, pensiÃ³n mensual, comedor, material |
| **Tarifa** | Importe definido por curso/nivel y ciclo |
| **Cargo / factura** | Lo que un alumno debe por un concepto y un periodo |
| **Pago** | Lo que efectivamente se entrega, con fecha, medio e importe |
| **Descuento / beca** | ReducciÃ³n del importe (hermanos, beca, pronto pago) |
| **Mora** | Deuda vencida, con posible recargo |
| **Recibo** | Justificante del pago |

## Reglas candidatas *(a confirmar)*

1. Los importes se definen **por ciclo escolar** y no cambian retroactivamente: si sube la pensiÃ³n, no se altera lo ya facturado.
2. Un cargo puede pagarse **parcialmente** en varios pagos.
3. Lo que se cobra es el **cargo**, no el pago: nunca se modifica un cargo ya pagado, se emite ajuste.
4. Todo movimiento de dinero queda auditado: quiÃ©n, cuÃ¡ndo, cuÃ¡nto y por quÃ© â†’ [[Seguridad-y-Datos]].
5. Anular un pago no lo borra: se marca anulado con motivo y autor.
6. Los datos de pago (tarjeta, cuenta) **no** se guardan en el sistema salvo que sea imprescindible y con protecciÃ³n fuerte.

## Consideraciones

- **Moneda e impuestos**: definir moneda y si los importes llevan impuestos *(a confirmar)*.
- **Medios de pago**: efectivo, transferencia, tarjeta, domiciliaciÃ³n.
- **ConciliaciÃ³n**: Â¿el sistema debe cuadrar con el banco o la contabilidad externa?
- **Informes**: estado de cuenta por familia, listado de morosos, ingresos del mes.
- **Alcance**: la contabilidad completa (nÃ³mina, proveedores, impuestos) queda **fuera**: aquÃ­ se gestionan cobros a familias.

## Preguntas

- [ ] Â¿QuÃ© conceptos se cobran y con quÃ© periodicidad?
- [ ] Â¿CÃ³mo se calculan los descuentos (hermanos, becas, pronto pago)?
- [ ] Â¿QuiÃ©n registra los pagos: secretarÃ­a, direcciÃ³n, varios?
- [ ] Â¿Se emiten recibos desde el sistema? Â¿Formato?
- [ ] Â¿Hay recargos por mora y avisos automÃ¡ticos?
- [ ] Â¿Se necesita integraciÃ³n con contabilidad o banco?

## Relacionado

- [[Alumnos]] Â· [[Matricula]] Â· [[Roles-y-Permisos]] Â· [[Seguridad-y-Datos]]
