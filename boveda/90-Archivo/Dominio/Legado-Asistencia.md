---
tipo: dominio
entidad: Attendance
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Asistencia

Registro diario de presencia del alumno. En código, `Attendance`. Es el dato que más se usa a diario y el que más rápido debe capturarse ([[UI-UX]]).

## Registro probable *(a confirmar)*

- Unidad de registro: **por día** o **por clase/sesión** (varía según el centro).
- Estados: presente, ausente, tardanza, ausencia justificada, retirada anticipada.
- Autor de la toma (docente o tutor del grupo).
- Justificación: motivo, quién la presenta, adjunto (documento).
- Comunicación a la familia cuando hay ausencia → [[Comunicacion]].

## Reglas candidatas *(a confirmar)*

1. La asistencia pertenece a un alumno y a una fecha (y opcionalmente a una clase).
2. Un registro por alumno y día; se corrige, no se duplica.
3. Las ausencias justificadas no cuentan igual que las injustificadas para los umbrales de alarma.
4. Cierta acumulación de ausencias genera aviso → ¿automático o manual?

## Requisito no funcional

Tomar asistencia a un grupo entero debe ser **rapidísimo** (una sola pantalla, pocos clics, funciona mal teclado o en móvil/tableta). Si esto es lento, el sistema no se usa. → [[UI-UX]]

## Preguntas

- [ ] ¿Se registra una vez al día o por clase?
- [ ] ¿Quién lo hace: el tutor del grupo o cada docente?
- [ ] ¿Hay medios días, entradas y salidas con hora?
- [ ] ¿Qué se hace con los justificantes médicos?
- [ ] ¿Se necesita un informe mensual de ausencias?

## Relacionado

- [[Alumnos]] · [[Cursos-y-Grupos]] · [[Comunicacion]]
