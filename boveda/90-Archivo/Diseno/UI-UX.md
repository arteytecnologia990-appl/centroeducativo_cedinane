---
tipo: diseno
actualizado: 2026-10-03
tags:
  - diseno
  - pendiente
---

# Diseño de interfaz y experiencia

Principios y esbozos de interfaz. Nada construido todavía: depende del stack ([[Stack]]).

## Principio rector

La interfaz la usan **personas con prisa y poca paciencia técnica** (un docente entre clases, secretaría en plena matrícula). Todo lo demás se subordina a eso:

1. **La tarea frecuente, a un clic.** Pasar lista, buscar un alumno, registrar un pago: sin menús profundos ni asistentes.
2. **Pocas pantallas, claras.** Nada de funciones escondidas.
3. **Funciona en móvil y tableta** para lo que se hace de pie (asistencia, consultas) → [[Asistencia]].
4. **Se entiende sin formación.** Si hace falta un manual de 20 páginas, está mal diseñado.
5. **Los errores se previenen y se explican**: avisar antes de una acción irreversible, no después.
6. **Sin jerga técnica** en los mensajes: "No se pudo guardar el pago porque…", no "Error 500".
7. **Accesible**: contraste suficiente, navegación con teclado, textos legibles.

## Esqueleto de navegación candidato

```
Inicio (según rol)
├── Alumnos        → ficha, historial, acudientes
├── Matrícula      → solicitudes, altas, renovaciones
├── Académico      → ciclos, grupos, materias, planes
├── Asistencia     → pasar lista (pantalla rápida)
├── Evaluación     → calificaciones, notas de periodo, boletines
├── Pagos          → cargos, pagos, estado de cuenta
├── Comunicación   → avisos
├── Informes       → listados y exportaciones
└── Configuración  → usuarios, roles, ciclo activo   (solo Dirección)
```

La vista inicial **cambia según el rol**: el docente ve sus grupos y la asistencia del día; secretaría ve matrícula y pagos.

## Pantallas críticas a diseñar con cuidado

| Pantalla | Requisito de experiencia |
| --- | --- |
| Pasar lista | Todos los alumnos visibles a la vez, cambio de estado con un clic, guardado automático |
| Buscar alumno | Resultados instantáneos por nombre, curso o documento |
| Registrar pago | Importe, medio, concepto; mostrar lo que queda pendiente tras el pago |
| Introducir notas | Navegación por teclado (tab/enter), validación inmediata de rangos |
| Boletín | Reproduce exactamente el formato oficial en papel/PDF |

## Convenciones visuales (a definir con el stack)

- Formato de fecha visible: `DD/MM/AAAA`.
- Importes con separador de miles y símbolo de moneda local.
- Estados con color **y** texto (nunca solo color: hay daltonismo).
- Confirmación obligatoria antes de: anular un pago, publicar notas, borrar/archivar una matrícula.

## Preguntas

- [ ] ¿Qué dispositivo usa cada rol en su día a día?
- [ ] ¿Hay imagen corporativa, colores o escudo del centro que respetar?
- [ ] ¿Se imprimen listas y boletines? ¿Qué tamaño de papel?
- [ ] ¿Se necesita modo sin conexión?

## Relacionado

- [[Vision-Arquitectura]] · [[Asistencia]] · [[Backlog]]
