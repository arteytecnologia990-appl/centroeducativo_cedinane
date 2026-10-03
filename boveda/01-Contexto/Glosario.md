---
tipo: glosario
actualizado: 2026-10-03
tags:
  - cerebro
  - dominio
---

# 05 · Glosario del dominio

Vocabulario controlado. Si una palabra del negocio se usa distinto a como está aquí, se corrige **aquí primero** y luego en el código (el código usa la columna *término en código*).

| Término (negocio) | Significado en este proyecto | Término en código | Confirmado |
| --- | --- | --- | --- |
| Alumno / estudiante | Persona matriculada en el centro | `Student` | *(a confirmar)* |
| Acudiente / tutor legal | Adulto responsable del alumno (padre, madre, tutor) | `Guardian` | *(a confirmar)* |
| Docente / profesor | Persona que imparte clases | `Teacher` | *(a confirmar)* |
| Curso | Nivel y grado académico (p. ej. "3.º de Primaria") | `Course` / `GradeLevel` | *(a confirmar)* |
| Grupo / clase | Conjunto concreto de alumnos asignados a un curso en un año | `Group` / `ClassGroup` | *(a confirmar)* |
| Materia / asignatura | Área de conocimiento impartida | `Subject` | *(a confirmar)* |
| Ciclo escolar / año lectivo | Periodo que agrupa la actividad académica | `SchoolYear` / `Term` | *(a confirmar)* |
| Matrícula | Acto de inscripción de un alumno en un ciclo | `Enrollment` | *(a confirmar)* |
| Plan de estudios | Conjunto de materias por curso y ciclo | `Curriculum` | *(a confirmar)* |
| Evaluación | Prueba o actividad que produce una calificación | `Assessment` | *(a confirmar)* |
| Calificación / nota | Resultado numérico o conceptual de una evaluación | `Grade` / `Score` | *(a confirmar)* |
| Boletín | Informe periódico de calificaciones de un alumno | `ReportCard` | *(a confirmar)* |
| Asistencia | Registro de presencia, ausencia o tardanza | `Attendance` | *(a confirmar)* |
| Pension / cuota | Pago periódico por la escolaridad | `TuitionFee` | *(a confirmar)* |
| Recibo / pago | Registro de un pago realizado por una familia | `Payment` | *(a confirmar)* |
| Horario | Distribución semanal de clases por grupo | `Timetable` | *(a confirmar)* |
| Periodo | Subdivisión del ciclo (trimestre, semestre, bimestre) | `Term` / `Period` | *(a confirmar)* |

## Reglas de vocabulario

1. En la interfaz se usa el término del negocio (columna 1) tal como lo usa el centro, **no** el término en código.
2. Un concepto = un término. Si aparecen sinónimos ("nota" vs "calificación"), se elige uno y el otro queda como alias en esta tabla.
3. Antes de crear una tabla, una ruta o un tipo nuevo, comprobarlo aquí.
