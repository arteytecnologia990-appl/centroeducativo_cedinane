---
tipo: decision
numero: 0001
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
---

# ADR 0001 Â· La bÃ³veda de Obsidian es la raÃ­z del proyecto

## Contexto

El proyecto necesita un lugar Ãºnico para el cÃ³digo y para la memoria de trabajo (contexto, decisiones, dominio, bitÃ¡cora). Las alternativas eran: bÃ³veda separada de la carpeta del cÃ³digo, documentaciÃ³n dentro del repositorio de cÃ³digo en `docs/`, o bÃ³veda y repositorio en el mismo Ã¡rbol.

Se trabaja asistido por un agente de IA cuya memoria entre el chat y el disco debe ser explÃ­cita y reutilizable. AdemÃ¡s, `D:\harness\centroeducativo` **ya estaba registrada como bÃ³veda de Obsidian** y abierta en la aplicaciÃ³n.

## DecisiÃ³n

La raÃ­z del proyecto (`D:\harness\centroeducativo`) **es** la bÃ³veda de Obsidian y, a la vez, la raÃ­z del repositorio. El conocimiento vive en carpetas numeradas (`00-Cerebro` â€¦ `99-Inbox`) y el cÃ³digo en `codigo/`.

## Consecuencias

**Positivas**
- Una sola ruta para todo: abrir la carpeta en Obsidian o en VS Code muestra el proyecto completo.
- Los enlaces `[[wikilinks]]` conectan decisiones, dominio y bitÃ¡cora; el grafo revela relaciones.
- La memoria sobrevive a la sesiÃ³n: cualquier agente futuro lee [[00-Inicio]] y se pone al dÃ­a.

**Negativas / costes**
- Hay que evitar que el cÃ³digo contamine la bÃ³veda (resuelto en [[ADR-0002-Codigo-aislado-en-carpeta-codigo]]).
- El `.gitignore` debe cubrir tanto notas como cÃ³digo.
- Obsidian y las herramientas de desarrollo compiten por archivos si se edita a la vez (riesgo bajo).

## Alternativas descartadas

| Alternativa | Por quÃ© no |
| --- | --- |
| BÃ³veda en `Documents` y cÃ³digo aparte | Dos rutas, enlaces rotos, la memoria se desincroniza del cÃ³digo |
| Solo `docs/` dentro del repo | Sin grafo, sin enlaces vivos, sin captura rÃ¡pida; peor para pensar |
| Wiki externa | Fuera del disco, sin control de versiones, riesgo de perder contexto |
