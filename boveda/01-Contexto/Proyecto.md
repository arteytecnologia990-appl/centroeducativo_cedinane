---
tipo: contexto
actualizado: 2026-10-03
tags:
  - cerebro
  - contexto
---

# 01 · Contexto del proyecto

## Ficha

| Campo | Valor |
| --- | --- |
| Nombre | Sistema de Gestión Integral — Centro Educativo y Terapéutico |
| País | Paraguay (zona horaria `America/Asuncion`, moneda PYG) |
| Tipo | Centro **educativo y terapéutico** (docencia + atención terapéutica) |
| Sedes | 2 hoy, diseño preparado para N |
| Desarrollo | Por fases |
| Stack | Next.js + TypeScript · Tailwind + shadcn/ui · Supabase · Vercel → [[ADR-0004-Stack-y-arquitectura-por-fases]] |
| Estado | Fase 1 → [[Estado-Actual]] |
| Raíz de trabajo | `D:\harness\centroeducativo` |

## Alcance por fases

**Fase 1 — Base y operación diaria**
1. Base del sistema y autenticación.
2. Roles y permisos **granulares** (RBAC dinámico por módulo/pantalla, acotados por sede).
3. **Personas**: núcleo de identidad; una persona acumula roles (profesional, empleado, alumno, paciente, tutor, proveedor, cliente).
4. **Horarios**: plantillas y bloques horarios asignables a cualquier persona.
5. **Asistencia**: marcaciones (evento crudo) → asistencias diarias (calculadas) → correcciones auditadas.
6. **Horas pagables**: reglas configurables y tarifas con vigencia; personal con salario fijo mensual o pago por hora.

**Fases siguientes (la estructura ya las prevé)**
- Facturación electrónica: Ekuatia'i / DNIT-SET.
- Importación de extractos bancarios (tesorería).
- Pacientes con historia clínica.
- Alumnos.
- Proveedores y clientes.

## Personas usuarias

| Rol | Uso principal | Fase |
| --- | --- | --- |
| Dirección / administración | Todo: configuración, reportes, permisos | 1 |
| Personal administrativo | Personas, horarios, asistencia, liquidación | 1 |
| Profesionales y personal del centro | Marcación en kiosco, consulta de sus horarios | 1 |
| Familias / tutores | *(a confirmar)* | 2+ |

## Puntos de entrada del sistema

1. **Kiosco de asistencia** (`/kiosco-asistencia`): pantalla pública **sin sesión**; el personal marca con **CI + PIN (4–6 dígitos)**. Acceso solo mediante Server Action protegida.
2. **Registro manual** de asistencia de pacientes y alumnos por parte del personal.
3. **Receptor del reloj biométrico facial ZKTeco (ZKTime)**: lugar previsto en `app/api/integraciones/zkteco/` y en la capa de integraciones, **sin implementar todavía**.
4. **Panel administrativo** protegido por rol, con selector de sede.
5. **Utilidades transversales**: clientes Supabase (navegador, servidor y administración con `service_role`), zona horaria `America/Asuncion`, formato PYG y validación de CI.

## Restricciones y reglas que afectan al diseño

- Base de datos en **español `snake_case`**; TypeScript en **`camelCase`**.
- **CI paraguaya**: única, pero no clave primaria (PK `UUID`).
- Instantes en **UTC** (`timestamptz`); la presentación y el cálculo de jornadas usan `America/Asuncion`.
- **PYG** en `bigint`, sin decimales.
- Toda tabla de negocio lleva **`sede_id`**; los permisos se acotan por sede.
- **Nada de parámetros hardcodeados**: tolerancias, redondeos, reglas de pago y tarifas en tablas con vigencia.
- Datos sensibles (historia clínica en fases futuras, datos de menores): privacidad y auditoría desde el inicio → [[Seguridad-y-Datos]].

## Flujo por etapas con puertas de seguridad

Ninguna etapa se cierra sin el veredicto del agente de seguridad (APROBADO, APROBADO CON CONDICIONES o BLOQUEADO). Un hallazgo Crítico o Alto abierto bloquea el avance. Antes de cerrar una etapa se entrega un paquete de revisión.

Veredictos y matriz → [[Gates]] · [[Matriz-Capas]].

## Entorno de desarrollo

Windows + PowerShell. Node `v24.21.0` y npm `11.19.0` disponibles (`pnpm` se activa con corepack). Git instalado **fuera del PATH** (`%LOCALAPPDATA%\Programs\Git\cmd`). Obsidian en `C:\Program Files\Obsidian`. Detalles y problemas conocidos → [[Entorno-Local]].

## Enlaces

- Estado y próximo paso → [[Estado-Actual]]
- Estructura de carpetas diseñada → [[Estructura-Carpetas]]
- Preguntas que siguen abiertas → [[Estado-Actual]]
