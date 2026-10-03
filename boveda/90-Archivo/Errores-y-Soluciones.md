---
tipo: registro-errores
actualizado: 2026-10-03
tags:
  - cerebro
  - operacion
  - bug
---

# 06 Â· Errores y soluciones

Registro de problemas del entorno o del cÃ³digo que **ya costaron tiempo**. Antes de investigar un fallo, buscar aquÃ­.

**Formato:** sÃ­ntoma â†’ causa â†’ soluciÃ³n â†’ verificado.

---

## E-001 Â· `python` abre Microsoft Store en lugar de ejecutar Python

- **SÃ­ntoma:** `python --version` devuelve *"no se encontrÃ³ Python; ejecutar sin argumentos para instalar desde Microsoft Store"*.
- **Causa:** `%LOCALAPPDATA%\Microsoft\WindowsApps\python.exe` es un alias de ejecuciÃ³n de la Store, no un intÃ©rprete.
- **SoluciÃ³n:** no usar `python` del sistema. Para tareas de datos/documentos, usar el intÃ©rprete gestionado que expone el harness.
- **Verificado:** 2026-10-03.

## E-002 Â· `git` no se reconoce como comando

- **SÃ­ntoma:** `git --version` â†’ *"no se reconoce como nombre de un cmdlet"*.
- **Causa:** Git estÃ¡ instalado en `%LOCALAPPDATA%\Programs\Git\cmd` pero esa carpeta no estÃ¡ en el `PATH`.
- **SoluciÃ³n:** usar la ruta completa `& "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe" â€¦` o aÃ±adir la carpeta al `PATH`. Detalle en [[Entorno-Local]].
- **Verificado:** 2026-10-03.

## E-003 Â· `pnpm` no disponible

- **SÃ­ntoma:** `pnpm` no se reconoce.
- **Causa:** no instalado; solo hay npm 11.
- **SoluciÃ³n:** usar npm, o instalar pnpm con `corepack enable` / `npm i -g pnpm` cuando el stack lo requiera (decisiÃ³n â†’ [[Stack]]).
- **Verificado:** 2026-10-03.

## E-004 Â· Las notas nuevas no aparecen en Obsidian

- **SÃ­ntoma:** se crean archivos por fuera y el explorador de Obsidian parece no verlos.
- **Causa:** Obsidian indexa en segundo plano; ademÃ¡s, si la bÃ³veda no es la que estÃ¡ abierta, no se ve nada.
- **SoluciÃ³n:** confirmar que la bÃ³veda activa es `D:\harness\centroeducativo` (`%APPDATA%\obsidian\obsidian.json` â†’ `"open": true`); si hace falta, recargar la bÃ³veda (`Ctrl+R`).
- **Verificado:** 2026-10-03.

## E-005 Â· `codigo/` contamina la bÃºsqueda de Obsidian

- **SÃ­ntoma:** al instalar dependencias, miles de archivos entran en bÃºsqueda y grafo.
- **Causa:** Obsidian indexa todas las carpetas no excluidas de la bÃ³veda.
- **SoluciÃ³n:** `codigo/` aÃ±adido a *Archivos excluidos* en `.obsidian/app.json` â†’ `userIgnoreFilters`.
- **Verificado:** 2026-10-03.

---

## Plantilla para nuevas entradas

```markdown
## E-00N Â· Titulo corto
- **SÃ­ntoma:** quÃ© se observa.
- **Causa:** por quÃ© ocurre.
- **SoluciÃ³n:** quÃ© se hizo para resolverlo.
- **Verificado:** AAAA-MM-DD.
```
