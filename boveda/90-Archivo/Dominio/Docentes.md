---
tipo: dominio
entidad: Teacher
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Docentes

Personal que imparte clase. En cÃ³digo, `Teacher` ([[Glosario]]).

## Datos probables *(a confirmar)*

- Nombre completo, documento, contacto, titulaciÃ³n.
- Materias que puede impartir.
- Grupos y materias asignados por ciclo (carga acadÃ©mica).
- Tipo de vinculaciÃ³n (jornada completa, parcial, sustituto) *(a confirmar)*.
- Fecha de alta y baja.

## Reglas candidatas *(a confirmar)*

1. Un docente puede impartir **varias** materias y atender **varios** grupos.
2. Una materia en un grupo tiene normalmente un docente responsable, y puede tener suplentes.
3. Un docente solo ve la informaciÃ³n de los alumnos de sus grupos â†’ [[Roles-y-Permisos]].
4. El histÃ³rico de asignaciones por ciclo no se reescribe: se conserva para saber quiÃ©n puso cada nota.

## Distinciones a aclarar

- Â¿Se gestiona tambiÃ©n **personal administrativo** en el mismo sistema? Si sÃ­, probablemente convenga un concepto comÃºn de *empleado* o, al menos, un Ãºnico modelo de usuario â†’ [[Roles-y-Permisos]].
- Â¿Hay **tutores de grupo** (responsables de un grupo completo) ademÃ¡s de los profesores de materia? Es una figura habitual y cambia permisos y flujos.

## Preguntas

- [ ] Â¿Se necesita registrar horarios y disponibilidad del docente?
- [ ] Â¿Se guardan datos contractuales o de nÃ³mina? (Probablemente fuera de alcance.)
- [ ] Â¿Un docente sustituto debe poder calificar en nombre del titular?

## Relacionado

- [[Cursos-y-Grupos]] Â· [[Evaluacion-y-Calificaciones]] Â· [[Roles-y-Permisos]]
