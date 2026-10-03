---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Cursos, grupos, materias y ciclo escolar

La organización académica: qué se enseña, a quién y cuándo. En código: `SchoolYear`, `Course`, `Group`, `Subject`.

## Piezas

| Pieza | Qué es | Ejemplo |
| --- | --- | --- |
| **Ciclo escolar** | Periodo que engloba el año académico | 2026–2027 |
| **Periodo** | Subdivisión del ciclo para evaluar | 1.º trimestre |
| **Curso / nivel** | Grado académico | 3.º de Primaria |
| **Grupo / clase** | Conjunto concreto de alumnos de un curso en un ciclo | 3.º A |
| **Materia** | Asignatura impartida | Matemáticas |
| **Plan de estudios** | Materias que corresponden a un curso | 3.º: Matemáticas, Lengua… |
| **Clase / sesión** | Materia impartida por un docente a un grupo | Matemáticas, 3.º A, lunes 9:00 |

*(nombres y agrupaciones a confirmar: el centro puede usar "aula", "sección", "salón", "grado", "nivel")*

## Reglas candidatas *(a confirmar)*

1. Los grupos pertenecen a un ciclo escolar concreto: se crean nuevos cada año, no se reutilizan.
2. Un grupo tiene una capacidad máxima y un aula asignada.
3. Una materia se imparte en varios cursos con dificultad distinta; la nota no es comparable entre cursos.
4. El paso de un alumno de un curso al siguiente es un proceso explícito (promoción) al cerrar el ciclo.

## Temporalidad: el detalle importante

Casi toda la información es **por ciclo escolar**. El modelo de datos debe permitir responder "¿cómo estaba esto en el ciclo 2025–2026?" sin ambigüedad. Es la fuente más probable de errores de diseño → [[Modelo-de-Datos]].

## Preguntas

- [ ] ¿Cómo se llaman y cuántos son los periodos de evaluación?
- [ ] ¿Cambian los grupos durante el ciclo (alumnos que se mueven de grupo)?
- [ ] ¿Se gestionan aulas y horarios, o solo la lista de alumnos por grupo?
- [ ] ¿Hay niveles distintos (infantil, primaria, secundaria) con reglas diferentes?

## Relacionado

- [[Alumnos]] · [[Docentes]] · [[Matricula]] · [[Evaluacion-y-Calificaciones]]
