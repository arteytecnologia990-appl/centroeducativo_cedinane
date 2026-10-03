---
tipo: arquitectura
actualizado: 2026-10-03
tags:
  - arquitectura
  - pendiente
---

# VisiÃ³n de arquitectura

CÃ³mo se construye el sistema. Todo lo de esta carpeta depende de la decisiÃ³n de stack ([[Stack]]), todavÃ­a abierta.

## Principios que ya se pueden fijar

1. **Simple antes que completo.** Un centro educativo no necesita microservicios. Un monolito bien organizado, con una base de datos relacional, cubre el 99 % de los casos y se mantiene sin un equipo.
2. **El dominio manda.** La estructura del cÃ³digo sigue el dominio ([[00-Dominio]]), no la tecnologÃ­a de moda.
3. **Los datos acadÃ©micos son histÃ³ricos.** Nunca se sobreescribe el pasado: se versiona por ciclo escolar ([[Modelo-de-Datos]]).
4. **Todo se puede verificar.** Cada funcionalidad debe poder probarse sin depender de datos reales.
5. **Los datos son de menores.** Privacidad y copias de seguridad desde el dÃ­a uno, no al final ([[Seguridad-y-Datos]]).
6. **Nada de dependencias innecesarias.** Cada librerÃ­a aÃ±adida es algo que hay que mantener y actualizar.
7. **Funciona en el entorno real del centro**: el equipo que hay, la conexiÃ³n que hay.

## Piezas esperadas

| Capa | Responsabilidad |
| --- | --- |
| Interfaz | Pantallas y formularios por rol ([[UI-UX]]) |
| LÃ³gica de dominio | Reglas de negocio ([[Reglas-de-Negocio]]), cÃ¡lculo de notas, validaciones |
| Acceso a datos | Persistencia y consultas ([[Modelo-de-Datos]]) |
| AutenticaciÃ³n y permisos | Roles, sesiones, auditorÃ­a ([[Roles-y-Permisos]]) |
| Informes y exportaciÃ³n | Boletines, listados, exportaciÃ³n a Excel/PDF |
| Copias de seguridad | Respaldo y restauraciÃ³n probada ([[Entornos-y-Despliegue]]) |

## Decisiones pendientes

- [ ] Stack â†’ [[Stack]] (ADR obligatorio)
- [ ] Base de datos y esquema â†’ [[Modelo-de-Datos]]
- [ ] Â¿AplicaciÃ³n Ãºnica o API + interfaz separadas? â†’ [[Integraciones]]
- [ ] Â¿DÃ³nde se despliega? â†’ [[Entornos-y-Despliegue]] y [[Entornos-y-Despliegue]]
- [ ] AutenticaciÃ³n: Â¿propia, con proveedor externo, con la cuenta del centro?

## Riesgos

| Riesgo | Impacto | MitigaciÃ³n temprana |
| --- | --- | --- |
| CÃ¡lculo de notas distinto al del centro | PÃ©rdida de confianza total en el sistema | Fijar la fÃ³rmula con ejemplos reales y probarla antes de construir la interfaz |
| Datos migrados mal desde Excel/papel | Sucios para siempre | ImportaciÃ³n con validaciÃ³n y vista previa, nunca carga ciega |
| Se construye de mÃ¡s y no se termina | Nada llega a usarse | MVP corto, entregas usables ([[Backlog]]) |
| Dependencia de una sola persona | El sistema muere con ella | Documentar en la bÃ³veda y mantener sencillez |

## Relacionado

- [[Stack]] Â· [[Modelo-de-Datos]] Â· [[Integraciones]] Â· [[Seguridad-y-Datos]]
