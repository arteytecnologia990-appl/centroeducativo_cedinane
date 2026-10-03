---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
---

# Horarios

Plantillas y bloques de horario, creables **por sede** y asignables a **cualquier persona** (personal, pacientes, alumnos).

## Piezas

| Pieza | Qué es |
| --- | --- |
| **Plantilla de horario** | Conjunto de bloques que se repite (p. ej. "lunes a viernes 8–12") |
| **Bloque** | Día de la semana + hora inicio + hora fin (en `America/Asuncion`) |
| **Asignación** | Plantilla aplicada a una persona, con vigencia (desde/hasta) |

## Reglas candidatas *(a confirmar)*

1. Los bloques se definen por día de la semana y hora; se guardan como hora local (con zona), no como instante UTC → [[Zona-Horaria-y-Moneda]].
2. Una asignación tiene **vigencia** (`desde`/`hasta`): cambiar el horario de alguien no reescribe el pasado.
3. Una persona puede tener varias asignaciones que no se solapan; si se solapan, el sistema avisa (no bloquea salvo que se indique).
4. El horario de un profesional define **cuándo se espera su marcación** (y alimenta el cálculo de horas pagables).
5. Un bloque puede ser de trabajo, de terapia (paciente) o de clase (alumno), según el rol de la persona.

## Relación con asistencia

El horario es el **patrón esperado**; la asistencia es lo **real**. La diferencia (llegadas tarde, faltas, horas extra) se calcula comparando ambos → [[Asistencia]] y [[Horas-Pagables]].

## Preguntas

- [ ] ¿Los bloques tienen tolerancia de entrada/salida? ¿Por sede o por persona?
- [ ] ¿Hay horarios rotativos (cambian cada semana)?
- [ ] ¿Se gestionan aulas/consultorios y su disponibilidad, o solo el horario de la persona?
