---
tipo: dominio
entidad: Enrollment
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Matrícula

El acto de inscribir a un alumno en un grupo para un ciclo escolar. En código, `Enrollment`.

## Flujo probable *(a confirmar)*

1. **Solicitud / admisión**: la familia entrega datos y documentación.
2. **Revisión y decisión**: el centro acepta, rechaza o pone en lista de espera.
3. **Asignación de grupo**: se decide curso y grupo ([[Cursos-y-Grupos]]).
4. **Formalización**: firma, pago de matrícula ([[Pagos-y-Cobros]]), entrega de documentos.
5. **Alta efectiva**: el alumno queda activo y aparece en listas, asistencia y calificaciones.

Estados candidatos: `solicitada` → `en_revision` → `aceptada` → `matriculada` → (`retirada` | `egresada`). *(a confirmar con el centro)*

## Datos del registro

- Alumno, ciclo escolar, curso y grupo asignados.
- Fecha de solicitud y de formalización.
- Acudiente que firma y responsable del pago.
- Documentación entregada y su estado (checklist).
- Observaciones y motivo de rechazo o retirada, si procede.
- Renovación: ¿los alumnos ya matriculados se renuevan automáticamente o repiten el proceso?

## Reglas candidatas *(a confirmar)*

1. Un alumno no puede tener dos matrículas **activas** en el mismo ciclo.
2. La matrícula puede existir sin pago (beca, exención, pago pendiente): matrícula y cobro son cosas distintas aunque se relacionen.
3. Al cerrar el ciclo, las matrículas pasan a histórico y se conservan.
4. El cupo del grupo limita la asignación.

## Preguntas

- [ ] ¿Cómo se pide hoy: presencial, formulario en papel, correo?
- [ ] ¿Quién aprueba? ¿Hay lista de espera y criterios de prioridad?
- [ ] ¿Existe matrícula condicional o periodo de prueba?
- [ ] ¿Qué documentos son obligatorios y hay que controlar su entrega?
- [ ] ¿Se matriculan alumnos a mitad de ciclo?

## Relacionado

- [[Alumnos]] · [[Cursos-y-Grupos]] · [[Pagos-y-Cobros]] · [[Backlog]]
