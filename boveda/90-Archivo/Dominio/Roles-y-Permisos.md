---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Roles y permisos

QuiÃ©n puede ver y hacer quÃ©. Con datos de menores y de dinero en juego, esto **no** es un detalle de implementaciÃ³n: es un requisito de primera clase.

## Roles candidatos *(a confirmar)*

| Rol | Ãmbito | Puede (borrador) |
| --- | --- | --- |
| **DirecciÃ³n** | Todo el centro | Ver todo, configurar el ciclo, publicar notas, informes |
| **SecretarÃ­a / administraciÃ³n** | Administrativo | Alumnos, matrÃ­culas, cobros, documentaciÃ³n |
| **Docente** | Sus grupos y materias | Asistencia, calificaciones de sus materias |
| **Tutor de grupo** | Su grupo | AdemÃ¡s: observaciones, comunicaciÃ³n con familias |
| **Familia / acudiente** | Sus hijos | Ver notas, asistencia, pagos; comunicarse |
| **Alumno** *(mayor)* | SÃ­ mismo | Ver notas y asistencia |
| **Administrador tÃ©cnico** | Sistema | ConfiguraciÃ³n, usuarios; **no** deberÃ­a ver calificaciones ni pagos por defecto |

Una persona puede tener **mÃ¡s de un rol** (docente que ademÃ¡s es tutor). El modelo debe permitirlo.

## Reglas candidatas *(a confirmar)*

1. Un docente **solo** accede a los alumnos de sus grupos y materias.
2. Una familia **solo** accede a sus hijos; el vÃ­nculo se establece en el acudiente ([[Alumnos]]).
3. Los datos sensibles (salud, dinero, disciplina) tienen permisos **mÃ¡s** restrictivos que los acadÃ©micos.
4. Todo acceso y cambio relevante queda en un registro de auditorÃ­a: quiÃ©n, quÃ©, cuÃ¡ndo ([[Seguridad-y-Datos]]).
5. Dar de baja a un usuario no borra su histÃ³rico: sus notas y registros siguen siendo suyos.

## Preguntas

- [ ] Â¿QuÃ© perfiles existen hoy en la realidad del centro?
- [ ] Â¿Las familias tendrÃ¡n acceso al sistema o solo reciben papel/correo?
- [ ] Â¿Hay mÃ¡s de una sede o turno con administraciÃ³n separada?
- [ ] Â¿QuiÃ©n puede corregir una nota ya publicada?
- [ ] Â¿Se necesita doble verificaciÃ³n para acciones sensibles (anular un pago)?

## Relacionado

- [[Seguridad-y-Datos]] Â· [[Alumnos]] Â· [[Docentes]] Â· [[Evaluacion-y-Calificaciones]]
