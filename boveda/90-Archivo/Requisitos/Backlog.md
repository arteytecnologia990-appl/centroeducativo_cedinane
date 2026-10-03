---
tipo: requisito
actualizado: 2026-10-03
tags:
  - requisito
  - pendiente
---

# Backlog

Lista priorizada de lo que el sistema debe hacer. **VacÃ­o de elementos confirmados**: los candidatos de abajo son hipÃ³tesis derivadas del dominio ([[00-Dominio]]), pendientes de validar con el promotor.

## CÃ³mo se escribe un elemento

- Formato historia de usuario: *Como \<rol\>, quiero \<acciÃ³n\> para \<beneficio\>* â†’ [[Plantilla-Historia-de-Usuario]].
- Criterios de aceptaciÃ³n verificables ("puedo hacer X y veo Y"), no deseos.
- Toda historia tiene: rol, prioridad, estimaciÃ³n aproximada y estado.

Estados: `idea` â†’ `lista` â†’ `en curso` â†’ `hecha` â†’ `descartada` (con motivo).

## MVP candidato (a validar y recortar)

| # | Historia | Rol | Prioridad | Estado |
| --- | --- | --- | --- | --- |
| H-001 | Dar de alta y mantener la ficha de un alumno con sus acudientes | SecretarÃ­a | Alta | idea |
| H-002 | Consultar y buscar alumnos por nombre, curso o grupo | SecretarÃ­a / DirecciÃ³n | Alta | idea |
| H-003 | Crear el ciclo escolar con sus cursos, grupos y materias | DirecciÃ³n | Alta | idea |
| H-004 | Matricular un alumno en un grupo del ciclo activo | SecretarÃ­a | Alta | idea |
| H-005 | Pasar lista de un grupo y corregirla | Docente / Tutor | Alta | idea |
| H-006 | Registrar calificaciones de una materia y periodo | Docente | Alta | idea |
| H-007 | Calcular y consultar la nota de periodo por alumno y materia | Docente / DirecciÃ³n | Alta | idea |
| H-008 | Emitir el boletÃ­n de un alumno o de un grupo | DirecciÃ³n | Media | idea |
| H-009 | Registrar pagos y ver el estado de cuenta de una familia | SecretarÃ­a | Media | idea |
| H-010 | Ver mis hijos: notas, asistencia y pagos | Familia | Media | idea |

## Fuera del MVP (candidato)

- Horarios y aulas Â· transporte y comedor Â· inventario Â· nÃ³mina Â· app mÃ³vil nativa Â· chat con familias Â· integraciÃ³n bancaria.

## Requisitos no funcionales a fijar

| CategorÃ­a | Objetivo tentativo |
| --- | --- |
| Facilidad de uso | Un docente sin formaciÃ³n tÃ©cnica pasa lista de 30 alumnos en menos de 1 minuto |
| Rendimiento | Cualquier pantalla responde en menos de 2 s con los datos de un centro mediano |
| Disponibilidad | El sistema debe funcionar en la jornada escolar; caÃ­da = papel de respaldo |
| Privacidad | Datos de menores protegidos; acceso por rol y auditorÃ­a â†’ [[Seguridad-y-Datos]] |
| Copias de seguridad | AutomÃ¡ticas y **probadas** (una copia que nunca se restaurÃ³ no es copia) |
| Idiomas | EspaÃ±ol (Â¿mÃ¡s?) *(a confirmar)* |
| Accesibilidad | Usable en pantallas pequeÃ±as y con teclado |

## Preguntas

- [ ] Â¿CuÃ¡l es *el* dolor que hay que resolver primero? (normalmente matrÃ­cula, notas o cobros)
- [ ] Â¿QuÃ© se hace hoy y con quÃ© herramienta (papel, Excel, otro software)?
- [ ] Â¿QuÃ© datos hay que migrar del sistema actual?

## Relacionado

- [[Reglas-de-Negocio]] Â· [[00-Dominio]] Â· [[Estado-Actual]]
