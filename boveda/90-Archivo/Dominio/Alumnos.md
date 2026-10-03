---
tipo: dominio
entidad: Student
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# Alumnos

Persona matriculada en el centro. Es la entidad central: casi todo lo demÃ¡s cuelga de ella. En cÃ³digo, `Student` ([[Glosario]]).

## Datos que probablemente se guardan *(a confirmar)*

**IdentificaciÃ³n**
- Nombre completo, fecha de nacimiento, documento de identidad (o equivalente local).
- FotografÃ­a (opcional, con consentimiento).
- Curso y grupo actual.

**Contacto**
- DirecciÃ³n, telÃ©fonos, correo (a menudo del acudiente, no del menor).

**AcadÃ©mico**
- Historial de matrÃ­culas por ciclo, calificaciones, asistencia, observaciones.

**Salud / necesidades** *(sensible, confirmar si se guarda y con quÃ© protecciÃ³n)*
- Alergias, condiciones mÃ©dicas, apoyos educativos.

**Acudientes**
- Uno o varios adultos responsables, con parentesco, contacto y quiÃ©n responde econÃ³micamente.

## Reglas candidatas *(a confirmar)*

1. Un alumno puede estar matriculado como mÃ¡ximo en un grupo por ciclo escolar.
2. Un alumno tiene **al menos un** acudiente de contacto.
3. Los datos personales de menores son de acceso restringido â†’ [[Roles-y-Permisos]], [[Seguridad-y-Datos]].
4. Un alumno no se elimina: se marca como inactivo, retirado o egresado, conservando su historial.

## Identificador

- Clave interna propia (no el documento de identidad: cambia y puede repetirse).
- CÃ³digo visible de alumno o nÃºmero de matrÃ­cula, si el centro ya usa uno *(a confirmar)*.

## Preguntas

- [ ] Â¿Se admiten alumnos en varios grupos o turnos?
- [ ] Â¿Se guardan datos de salud? Â¿Con quÃ© base legal?
- [ ] Â¿Se necesita historial de cambios de grupo o de curso repetido?
- [ ] Â¿Hay hermanos que deban vincularse para descuentos o cobros conjuntos? â†’ [[Pagos-y-Cobros]]

## Relacionado

- [[Matricula]] Â· [[Asistencia]] Â· [[Evaluacion-y-Calificaciones]] Â· [[Pagos-y-Cobros]]
