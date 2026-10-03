---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - pendiente
---

# EvaluaciÃ³n y calificaciones

CÃ³mo se mide y se registra el aprendizaje. En cÃ³digo: `Assessment`, `Grade`, `ReportCard`.

## Piezas

| Pieza | QuÃ© es |
| --- | --- |
| **EvaluaciÃ³n** | Prueba, trabajo o actividad que produce una nota (examen, trabajo, participaciÃ³n) |
| **Instrumento / tipo** | CategorÃ­a de la evaluaciÃ³n, con peso distinto (examen 60 %, trabajos 40 %) |
| **CalificaciÃ³n** | Resultado de un alumno en una evaluaciÃ³n |
| **Nota de periodo** | Resultado agregado de un alumno en una materia y un periodo |
| **BoletÃ­n** | Informe que se entrega a la familia con las notas del periodo |

## Reglas candidatas *(a confirmar)*

1. La nota del periodo se calcula a partir de las evaluaciones, normalmente con **pesos** o **medias ponderadas**.
2. La escala puede ser numÃ©rica (0â€“10, 0â€“100) o conceptual (Insuficiente / Suficiente / Notable / Sobresaliente). A veces conviven y se convierten.
3. La nota de la materia en el ciclo es el agregado de sus periodos.
4. Un alumno con materias suspensas puede tener evaluaciÃ³n extraordinaria o recuperaciÃ³n.
5. Solo el docente de la materia (o direcciÃ³n) puede modificar notas; toda modificaciÃ³n queda registrada.
6. Las notas son **inmutables una vez publicadas** salvo correcciÃ³n auditada â†’ [[Seguridad-y-Datos]].

## Riesgos de diseÃ±o

- **Redondeo y pesos**: es la fuente clÃ¡sica de discrepancias entre lo que calcula el sistema y lo que calcula el docente a mano. Hay que fijar la regla exacta y probarla ([[Backlog]], [[Modelo-de-Datos]]).
- **Notas fuera de plazo o incompletas**: definir quÃ© pasa si falta una evaluaciÃ³n al cerrar el periodo (Â¿0? Â¿nulo? Â¿bloquea el cierre?).
- **BoletÃ­n impreso**: la fÃ³rmula debe reproducir exactamente el formato que hoy se entrega.

## Preguntas

- [ ] Â¿Escala numÃ©rica o conceptual? Â¿Rangos y mÃ­nimos aprobatorios?
- [ ] Â¿CuÃ¡ntos periodos y cÃ³mo se ponderan?
- [ ] Â¿QuÃ© tipos de evaluaciÃ³n se usan y con quÃ© peso cada uno?
- [ ] Â¿Hay recuperaciones, y cÃ³mo afectan a la nota final?
- [ ] Â¿CÃ³mo es el boletÃ­n actual (formato, datos, firmas)? Â¿Se genera solo o se imprime desde el sistema?
- [ ] Â¿QuiÃ©n publica las notas y cuÃ¡ndo pueden verlas las familias?

## Relacionado

- [[Cursos-y-Grupos]] Â· [[Alumnos]] Â· [[Docentes]] Â· [[Comunicacion]]
