---
tipo: decision
numero: 0002
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
---

# ADR 0002 Â· El cÃ³digo vive aislado en `codigo/`

## Contexto

Al ser la bÃ³veda la raÃ­z del proyecto ([[ADR-0001-Vault-como-raiz-del-proyecto]]), el cÃ³digo fuente convive con las notas. Obsidian indexa todo el Ã¡rbol de la bÃ³veda: en cuanto exista `node_modules` o cualquier carpeta de dependencias, la bÃºsqueda, los enlaces y el grafo se vuelven inutilizables.

## DecisiÃ³n

Todo el producto vive bajo `codigo/`, con esta forma inicial:

```
codigo/
â”œâ”€â”€ src/        # cÃ³digo fuente
â”œâ”€â”€ tests/      # pruebas
â”œâ”€â”€ scripts/    # utilidades de desarrollo y automatizaciÃ³n
â”œâ”€â”€ public/     # recursos estÃ¡ticos servidos tal cual
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

Y en `.obsidian/app.json` se aÃ±ade:

```json
"userIgnoreFilters": ["codigo/", "node_modules/", ".git/", ".trash/"]
```

## Consecuencias

**Positivas**
- BÃºsqueda y grafo de Obsidian se mantienen limpios y rÃ¡pidos.
- El cÃ³digo tiene un lÃ­mite claro: nada de archivos generados mezclados con las notas.
- La estructura interna admite cualquier stack (web, API, escritorio) sin rehacerla.

**Negativas / costes**
- Al crear archivos dentro de `codigo/` hay que recordar que Obsidian no los verÃ¡; se navega con VS Code o el explorador.
- La documentaciÃ³n del producto (README, comandos) vive **fuera** del cÃ³digo, en la bÃ³veda: hay que mantener el enlace a mano.

## Regla derivada

Ninguna nota de la bÃ³veda se guarda dentro de `codigo/`, y ningÃºn archivo de cÃ³digo se guarda fuera de `codigo/` (salvo `.gitignore`, `README.md` y la configuraciÃ³n de la raÃ­z).
