---
tipo: tecnico
actualizado: 2026-10-03
tags:
  - tecnico
  - datos
---

# Modelo de datos

Borrador conceptual de la fase 1. No es SQL definitivo: es la guía para escribir las migraciones en `supabase/migrations/`.

## Convenciones globales

- Base de datos en **español `snake_case`**, tablas en **plural** (`personas`, `marcaciones`).
- **PK `id` UUID** en todas las tablas. La **CI es `UNIQUE`, no PK**.
- **FK** = `<tabla_singular>_id` (`persona_id`, `sede_id`).
- **`sede_id`** en toda tabla de negocio → [[Multisede]].
- Instantes en **`timestamptz` (UTC)** → [[Zona-Horaria-y-Moneda]].
- Importes en **`bigint` (PYG)**.
- Auditoría estándar: `created_at`, `updated_at`, `created_by`, `deleted_at` (baja lógica; nada se borra).
- **Parámetros de negocio con vigencia**: toda regla configurable lleva `vigencia_desde` / `vigencia_hasta`.

## Núcleo: personas

| Tabla | Propósito |
| --- | --- |
| `personas` | Identidad central: nombres, CI (UNIQUE), fecha de nacimiento, contacto |
| `persona_roles` | Roles de negocio de una persona (profesional, empleado, alumno, paciente, tutor, proveedor, cliente), opcionalmente por sede |
| `persona_relaciones` | Vínculos entre personas (p. ej. tutor ↔ alumno/paciente), con tipo de relación |

## Seguridad (RBAC)

| Tabla | Propósito |
| --- | --- |
| `usuarios` | Cuenta de acceso vinculada a `persona`; flag `es_admin_general` |
| `roles` | Roles de acceso del sistema |
| `modulos_pantallas` | Catálogo de módulos y pantallas |
| `permisos_rol` | `(rol × pantalla × sede)` con `consultar/crear/actualizar/eliminar` |

Ver [[RBAC-y-RLS]].

## Sedes

| Tabla | Propósito |
| --- | --- |
| `sedes` | Sede física; todas las tablas de negocio la referencian |

## Horarios

| Tabla | Propósito |
| --- | --- |
| `plantillas_horario` | Plantilla con nombre y descripción, por sede |
| `bloques_horario` | Día de la semana + hora inicio/fin (hora local, con zona) |
| `asignaciones_horario` | Plantilla aplicada a una persona, con vigencia |

Ver [[Horarios]].

## Asistencia

| Tabla | Propósito |
| --- | --- |
| `marcaciones` | Evento crudo: persona, instante UTC, `origen` (kiosco_web/manual/zkteco/importacion), sede |
| `asistencias_diarias` | Resultado calculado por persona y día (entrada, salida, horas, estado) |
| `correcciones_asistencia` | Ajuste manual: autor, motivo, valor anterior/nuevo |

Ver [[Asistencia]].

## Horas pagables

| Tabla | Propósito |
| --- | --- |
| `modalidades_personal` | Salario fijo mensual o pago por hora (por persona, con vigencia) |
| `tarifas_hora` | Importe por hora (bigint), con vigencia |
| `configuraciones` | Parámetros genéricos con vigencia: tolerancias, redondeo, feriados, horas extra |

Ver [[Horas-Pagables]].

## Reglas de modelado

1. **Nada se borra**: baja lógica con `deleted_at`.
2. **El pasado no se reescribe**: cambios con vigencia o filas nuevas (tarifas, horarios, configuraciones).
3. **Unicidad explícita**: una marcación = persona + instante + origen; una asignación activa por persona y rango.
4. **`created_by`/`updated_by`** en tablas sensibles, ligado a auditoría → [[Seguridad-y-Datos]].
5. Tipos generados con `supabase gen types` → `src/types/database.ts` (pendiente token/Docker → [[Entorno-Local]]).

## Relacionado

- [[RBAC-y-RLS]] · [[Multisede]] · [[Reglas-Paraguay]] · [[Zona-Horaria-y-Moneda]]
