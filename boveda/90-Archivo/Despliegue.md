---
tipo: operacion
actualizado: 2026-10-03
tags:
  - operacion
  - pendiente
---

# Despliegue

CÃ³mo llega el sistema a producciÃ³n. **Pendiente** hasta cerrar [[Stack]] y [[Entornos-y-Despliegue]].

## Escenarios posibles

| Escenario | DescripciÃ³n | Coste | Adecuado siâ€¦ |
| --- | --- | --- | --- |
| **Un solo equipo del centro** | El sistema corre en un PC del centro; se accede por la red local | Bajo | Hay pocos usuarios y no se necesita acceso desde casa |
| **Servidor propio / VPS** | Despliegue en un servidor gestionado, acceso desde internet | Medio | Varios usuarios, familias y docentes entran desde fuera |
| **Plataforma en la nube** | Servicio gestionado (base de datos + hosting) | Medio/alto | Se quiere olvidar del mantenimiento de la mÃ¡quina |
| **Escritorio** | InstalaciÃ³n por equipo, datos en el centro | Bajo en servidor, alto en soporte | No hay conexiÃ³n fiable |

## Reglas de despliegue

1. **Repetible y escrito**: los pasos se documentan aquÃ­, no se recuerdan.
2. **Probado antes en el entorno de pruebas.**
3. **Sin secretos en el repositorio**: solo `.env.example`; los valores reales viven fuera ([[Seguridad-y-Datos]]).
4. **Copia de seguridad antes de cada despliegue** y, si toca la base de datos, plan de vuelta atrÃ¡s.
5. **Registro de versiones**: quÃ© versiÃ³n estÃ¡ en producciÃ³n y quÃ© cambiÃ³.

## Lista de verificaciÃ³n (a completar)

- [ ] Instalar dependencias y compilar
- [ ] Aplicar migraciones de base de datos
- [ ] Configurar variables de entorno
- [ ] Arrancar el servicio y comprobar que responde
- [ ] Copia de seguridad previa verificada
- [ ] Probar un flujo real de punta a punta (entrar, ver un alumno, registrar algo)
- [ ] Anotar la versiÃ³n desplegada y la fecha en esta nota
- [ ] Avisar a los usuarios de los cambios

## Registro de despliegues

| Fecha | VersiÃ³n | Entorno | QuÃ© cambiÃ³ | QuiÃ©n |
| --- | --- | --- | --- | --- |
| â€” | â€” | â€” | *Sin despliegues todavÃ­a* | â€” |

## Relacionado

- [[Entornos-y-Despliegue]] Â· [[Entorno-Local]] Â· [[Seguridad-y-Datos]]
