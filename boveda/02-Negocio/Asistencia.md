---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
---

# Asistencia

Control de asistencia en tres capas: **evento crudo → día calculado → corrección auditada**. Nada se edita en su lugar; todo deja rastro.

## Flujo

```
marcaciones (crudo) ──► asistencias_diarias (calculada) ──► correcciones_asistencia (auditoría)
   origen: kiosco_web | manual | zkteco | importacion
```

| Tabla | Rol |
| --- | --- |
| `marcaciones` | Evento crudo tal como llegó (quién, cuándo, desde qué origen, en qué sede) |
| `asistencias_diarias` | Resultado calculado por persona y día (entrada, salida, horas, estado) |
| `correcciones_asistencia` | Cualquier ajuste manual, con autor, motivo y valor anterior |

## Reglas

1. **Kiosco** (`/kiosco-asistencia`): pantalla pública **sin sesión**; el personal marca con **CI + PIN (4–6 dígitos)**. Solo una Server Action protegida toca la BD.
2. **Origen** de cada marcación se conserva: `kiosco_web` | `manual` | `zkteco` | `importacion`.
3. **Registro manual** de asistencia de **pacientes y alumnos** lo hace el personal autorizado (no el propio paciente).
4. Una marcación es un **instante UTC** (`timestamptz`); el "día" se determina en `America/Asuncion` → [[Zona-Horaria-y-Moneda]].
5. El día laboral se calcula comparando las marcaciones con el **horario esperado** → [[Horarios]].
6. Corrección manual = fila nueva en `correcciones_asistencia`; nunca se reescribe la marcación original.

## Punto de entrada futuro

- Receptor del **reloj biométrico facial ZKTeco (ZKTime)** en `app/api/integraciones/zkteco/marcaciones/route.ts`, origen `zkteco`. Previsto, no implementado → [[Integraciones]].

## Preguntas

- [ ] ¿PIN por persona o compartido por sede? → [[Estado-Actual]] Q-02
- [ ] ¿Se registra una vez por jornada o entrada y salida separadas?
- [ ] ¿Qué pasa si se olvida marcar la salida? (regla de cierre automático)
- [ ] ¿El kiosco debe funcionar sin internet (cola local)? *(a confirmar)*
