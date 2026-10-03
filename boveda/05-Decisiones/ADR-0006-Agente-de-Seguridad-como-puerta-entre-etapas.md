---
tipo: decision
numero: 0006
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
  - seguridad
---

# ADR 0006 · Agente de Seguridad como puerta obligatoria entre etapas

## Contexto

El proyecto maneja datos de menores, salud (futuro), cédulas de identidad y tarifas. El riesgo es avanzar de etapa sin revisar las capas de seguridad y arrastrar deuda técnica de seguridad.

## Decisión

Se incorpora un agente de Seguridad como puerta obligatoria entre etapas. Motivo: evitar saltarse capas de seguridad. Fecha: 2026-10-03.

- Rol y metodología → [[Seguridad]] (`07-Prompts/Seguridad.md`).
- Registros → [[Matriz-Capas]] · [[Registro-Riesgos]] · [[Modelo-Amenazas]] · [[Gates]].
- Ninguna etapa se cierra sin veredicto (APROBADO / APROBADO CON CONDICIONES / BLOQUEADO); un hallazgo Crítico o Alto abierto bloquea el avance.

## Consecuencias

**Positivas**
- Seguridad por diseño: cada etapa se revisa antes de avanzar.
- Rastro auditable de veredictos y riesgos.

**Negativas / costes**
- Cada etapa exige un paquete de revisión y un veredicto antes de cerrarse.

## Relacionado

- [[Seguridad-y-Datos]] · [[Proyecto]] · [[Gates]]
