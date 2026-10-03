---
tipo: decision
numero: 0003
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
---

# ADR 0003 Â· Notas en espaÃ±ol, cÃ³digo en inglÃ©s

## Contexto

El proyecto se desarrolla en espaÃ±ol: el dominio (alumno, matrÃ­cula, boletÃ­n) y las personas usuarias lo son. Pero las convenciones de la mayorÃ­a de lenguajes, librerÃ­as y herramientas estÃ¡n en inglÃ©s, y mezclar idiomas dentro del cÃ³digo produce nombres hÃ­bridos difÃ­ciles de mantener (`getAlumnoById`).

## DecisiÃ³n

- **DocumentaciÃ³n, notas, comentarios de negocio, mensajes de la interfaz, commits y nombres de ramas:** espaÃ±ol.
- **CÃ³digo:** identificadores en inglÃ©s (`Student`, `enrollmentDate`, `calculateAverage`); sin traducir literalmente el dominio a medias.
- El puente entre ambos mundos es [[Glosario]], que fija la correspondencia tÃ©rmino de negocio â†” tÃ©rmino en cÃ³digo.

## Consecuencias

**Positivas**
- El cÃ³digo se lee como cualquier proyecto del ecosistema y encaja con librerÃ­as y ejemplos.
- La interfaz habla el idioma real del centro; nadie tiene que traducir mentalmente "Grade" a "nota".
- El glosario elimina ambigÃ¼edades antes de que lleguen a la base de datos.

**Negativas / costes**
- Hay que consultar el glosario al crear entidades nuevas.
- Riesgo de inconsistencia si se ignora: se corrige en cuanto se detecta, sin excepciones.

## Nota

Si aparece terminologÃ­a oficial del centro con nombre propio (por ejemplo, un documento oficial con tÃ­tulo fijo), se respeta su nombre literal en la interfaz aunque no siga esta regla.
