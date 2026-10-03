---
tipo: contexto
actualizado: 2026-10-03
tags:
  - cerebro
  - contexto
---

# 01 Â· Contexto del proyecto

## Ficha

| Campo | Valor |
| --- | --- |
| Nombre | Sistema de GestiÃ³n Integral â€” Centro Educativo y TerapÃ©utico |
| PaÃ­s | Paraguay (zona horaria `America/Asuncion`, moneda PYG) |
| Tipo | Centro **educativo y terapÃ©utico** (docencia + atenciÃ³n terapÃ©utica) |
| Sedes | 2 hoy, diseÃ±o preparado para N |
| Desarrollo | Por fases |
| Stack | Next.js + TypeScript Â· Tailwind + shadcn/ui Â· Supabase Â· Vercel â†’ [[ADR-0004-Stack-y-arquitectura-por-fases]] |
| Estado | Fase 0 (estructura) â†’ [[Estado-Actual]] |
| RaÃ­z de trabajo | `D:\harness\centroeducativo` |

## Alcance por fases

**Fase 1 â€” Base y operaciÃ³n diaria**
1. Base del sistema y autenticaciÃ³n.
2. Roles y permisos **granulares** (RBAC dinÃ¡mico por mÃ³dulo/pantalla, acotados por sede).
3. **Personas**: nÃºcleo de identidad; una persona acumula roles (profesional, empleado, alumno, paciente, tutor, proveedor, cliente).
4. **Horarios**: plantillas y bloques horarios asignables a cualquier persona.
5. **Asistencia**: marcaciones (evento crudo) â†’ asistencias diarias (calculadas) â†’ correcciones auditadas.
6. **Horas pagables**: reglas configurables y tarifas con vigencia; personal con salario fijo mensual o pago por hora.

**Fases siguientes (la estructura ya las prevÃ©)**
- FacturaciÃ³n electrÃ³nica: Ekuatia'i / DNIT-SET.
- ImportaciÃ³n de extractos bancarios (tesorerÃ­a).
- Pacientes con historia clÃ­nica.
- Alumnos.
- Proveedores y clientes.

## Personas usuarias

| Rol | Uso principal | Fase |
| --- | --- | --- |
| DirecciÃ³n / administraciÃ³n | Todo: configuraciÃ³n, reportes, permisos | 1 |
| Personal administrativo | Personas, horarios, asistencia, liquidaciÃ³n | 1 |
| Profesionales y personal del centro | MarcaciÃ³n en kiosco, consulta de sus horarios | 1 |
| Familias / tutores | *(a confirmar)* | 2+ |

## Puntos de entrada del sistema

1. **Kiosco de asistencia** (`/kiosco-asistencia`): pantalla pÃºblica **sin sesiÃ³n**; el personal marca con **CI + PIN (4â€“6 dÃ­gitos)**. Acceso solo mediante Server Action protegida.
2. **Registro manual** de asistencia de pacientes y alumnos por parte del personal.
3. **Receptor del reloj biomÃ©trico facial ZKTeco (ZKTime)**: lugar previsto en `app/api/integraciones/zkteco/` y en la capa de integraciones, **sin implementar todavÃ­a**.
4. **Panel administrativo** protegido por rol, con selector de sede.
5. **Utilidades transversales**: clientes Supabase (navegador, servidor y administraciÃ³n con `service_role`), zona horaria `America/Asuncion`, formato PYG y validaciÃ³n de CI.

## Restricciones y reglas que afectan al diseÃ±o

- Base de datos en **espaÃ±ol `snake_case`**; TypeScript en **`camelCase`**.
- **CI paraguaya**: Ãºnica, pero no clave primaria (PK `UUID`).
- Instantes en **UTC** (`timestamptz`); la presentaciÃ³n y el cÃ¡lculo de jornadas usan `America/Asuncion`.
- **PYG** en `bigint`, sin decimales.
- Toda tabla de negocio lleva **`sede_id`**; los permisos se acotan por sede.
- **Nada de parÃ¡metros hardcodeados**: tolerancias, redondeos, reglas de pago y tarifas en tablas con vigencia.
- Datos sensibles (historia clÃ­nica en fases futuras, datos de menores): privacidad y auditorÃ­a desde el inicio â†’ [[Seguridad-y-Datos]].

## Entorno de desarrollo

Windows + PowerShell. Node `v24.21.0` y npm `11.19.0` disponibles (`pnpm` no instalado, se activa con corepack). Git instalado **fuera del PATH** (`%LOCALAPPDATA%\Programs\Git\cmd`). Obsidian en `C:\Program Files\Obsidian`. Detalles y problemas conocidos en [[Entorno-Local]] y [[Entorno-Local]].

## Enlaces

- Estado y prÃ³ximo paso â†’ [[Estado-Actual]]
- Estructura de carpetas diseÃ±ada â†’ [[Estructura-Carpetas]]
- Preguntas que siguen abiertas â†’ [[Estado-Actual]]
