---
tipo: requisito
actualizado: 2026-10-03
tags:
  - requisito
  - dominio
  - pendiente
---

# Reglas de negocio

Reglas que el sistema debe **hacer cumplir**, no solo mostrar. Cada regla se implementa una vez y en un solo lugar: si aparece duplicada en el código, es un error de diseño.

> Estado: borrador. Ninguna regla pasa a `confirmada` sin validación del promotor.

## Estructura de una regla

`RN-NNN · Enunciado · Ámbito · Verificación · Estado`

## Candidatas

### Alumnos y matrícula

- **RN-001** · Un alumno solo puede tener una matrícula **activa** por ciclo escolar. · Matrícula · *(a confirmar)*
- **RN-002** · Un alumno debe tener al menos un acudiente de contacto. · Alumnos · *(a confirmar)*
- **RN-003** · Los alumnos no se eliminan: se marcan como retirados, egresados o inactivos. · Alumnos · *(por confirmar)*
- **RN-004** · Un grupo no admite más alumnos que su capacidad. · Grupos · *(a confirmar)*

### Evaluación

- **RN-005** · La nota de un periodo se calcula con los pesos definidos para cada tipo de evaluación. · Evaluación · *(fórmula por definir)*
- **RN-006** · Una calificación publicada no se modifica sin dejar registro de la corrección (autor, motivo, valor anterior). · Evaluación · *(por confirmar)*
- **RN-007** · Una evaluación sin calificar al cerrar el periodo debe tener un tratamiento explícito (no se asume 0). · Evaluación · *(por definir)*

### Asistencia

- **RN-008** · Solo puede existir un registro de asistencia por alumno, fecha y clase. · Asistencia · *(a confirmar)*
- **RN-009** · Una ausencia justificada requiere motivo y queda vinculada a quien la justifica. · Asistencia · *(a confirmar)*

### Dinero

- **RN-010** · Los importes se fijan por ciclo escolar y no se alteran retroactivamente. · Pagos · *(por confirmar)*
- **RN-011** · Un cargo puede liquidarse con varios pagos parciales; un pago puede cubrir varios cargos. · Pagos · *(a confirmar)*
- **RN-012** · Ningún movimiento de dinero se borra: se anula con motivo y autor. · Pagos · *(por confirmar)*
- **RN-013** · Los descuentos (hermanos, beca, pronto pago) se calculan según reglas explícitas y auditables. · Pagos · *(por definir)*

### Acceso

- **RN-014** · Un docente solo accede a los alumnos de sus grupos y materias. · Permisos · *(por confirmar)*
- **RN-015** · Un acudiente solo accede a la información de sus hijos. · Permisos · *(por confirmar)*
- **RN-016** · Toda acción sensible (nota, pago, baja de usuario) queda registrada con autor y fecha. · Auditoría · *(por confirmar)*

## Preguntas que deben resolverse antes de implementar

- [ ] ¿Cómo se decide la promoción de curso al final del ciclo?
- [ ] ¿Qué ocurre si un alumno se cambia de grupo a mitad de periodo?
- [ ] ¿Hay que conservar el histórico exacto de una nota corregida (valor anterior y posterior)?

## Relacionado

- [[Backlog]] · [[00-Dominio]] · [[Modelo-de-Datos]]
