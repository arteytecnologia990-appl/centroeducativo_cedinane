---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
---

# 03 Â· Dominio â€” Centro educativo

Mapa de conocimiento del negocio. **Todo lo de esta carpeta es un borrador de trabajo**: son hipÃ³tesis razonables sobre cÃ³mo funciona un centro educativo, no requisitos confirmados. Cuando el promotor confirme o corrija algo, se actualiza la nota y se quita la marca *(a confirmar)*.

> [!warning] Regla
> Ninguna regla de negocio de esta carpeta se implementa sin confirmaciÃ³n. Si falta un dato, se pregunta ([[Estado-Actual]]) antes de inventarlo.

## Entidades principales

| Entidad | Nota | Papel |
| --- | --- | --- |
| Alumno | [[Alumnos]] | Persona matriculada; centro de casi todo el sistema |
| Acudiente / tutor | [[Alumnos]] | Adulto responsable; contacto y pagos |
| Docente | [[Docentes]] | Imparte materias a grupos |
| Curso, grupo, materia | [[Cursos-y-Grupos]] | OrganizaciÃ³n acadÃ©mica |
| Ciclo escolar y periodo | [[Cursos-y-Grupos]] | Marco temporal de todo |
| MatrÃ­cula | [[Matricula]] | VÃ­nculo alumno â†” curso en un ciclo |
| EvaluaciÃ³n y calificaciones | [[Evaluacion-y-Calificaciones]] | Resultado acadÃ©mico |
| Asistencia | [[Asistencia]] | Presencia diaria |
| Pago y pensiÃ³n | [[Pagos-y-Cobros]] | Dinero |
| Usuario y rol | [[Roles-y-Permisos]] | QuiÃ©n puede hacer quÃ© |
| ComunicaciÃ³n | [[Comunicacion]] | Mensajes a las familias |

## CÃ³mo se relacionan (vista mental)

```
Ciclo escolar â”€â”€< Grupo â”€â”€< MatrÃ­cula >â”€â”€ Alumno â”€â”€< Acudiente
                    â”‚                        â”‚
                    â”œâ”€â”€< Clase >â”€â”€ Docente    â”œâ”€â”€< CalificaciÃ³n >â”€â”€ EvaluaciÃ³n >â”€â”€ Materia
                    â”‚                        â”œâ”€â”€< Asistencia
                    â””â”€â”€< Horario             â””â”€â”€< Pago
```

Reglas estructurales que probablemente se cumplen *(a confirmar)*:

1. Un alumno pertenece a **un** grupo por ciclo escolar.
2. Una calificaciÃ³n siempre cuelga de un alumno, una materia y un periodo.
3. Un pago cuelga de un alumno (o de su acudiente responsable) y de un concepto.
4. Nada se borra: la informaciÃ³n acadÃ©mica y contable se **archiva o anula**, no se elimina.

## Procesos clave del aÃ±o

1. **AdmisiÃ³n y matrÃ­cula** (inicio de ciclo) â†’ [[Matricula]]
2. **AsignaciÃ³n de grupos y horarios** â†’ [[Cursos-y-Grupos]]
3. **Jornada diaria**: asistencia y clases â†’ [[Asistencia]]
4. **EvaluaciÃ³n por periodos** y boletines â†’ [[Evaluacion-y-Calificaciones]]
5. **Cobro de pensiones** y seguimiento de mora â†’ [[Pagos-y-Cobros]]
6. **ComunicaciÃ³n con familias** â†’ [[Comunicacion]]
7. **Cierre de ciclo**: promociÃ³n, certificados, archivo.

## Dudas de dominio abiertas

- [ ] Â¿CÃ³mo se nombran los cursos y grupos en este centro concreto?
- [ ] Â¿La evaluaciÃ³n es numÃ©rica, conceptual o ambas?
- [ ] Â¿Se gestiona horario y aulas, o solo la parte administrativa?
- [ ] Â¿Hay transporte, comedor, enfermerÃ­a u otros servicios?
- [ ] Â¿Se necesita generar documentos oficiales (certificados, actas)?
