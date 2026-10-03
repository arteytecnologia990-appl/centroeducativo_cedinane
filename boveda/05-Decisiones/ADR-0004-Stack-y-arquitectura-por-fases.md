---
tipo: decision
numero: 0004
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
  - arquitectura
---

# ADR 0004 Â· Stack y arquitectura por fases

## Contexto

El proyecto es un **Sistema de GestiÃ³n Integral para un Centro Educativo y TerapÃ©utico en Paraguay**, que se construye por fases. La fase 1 cubre base del sistema, roles y permisos granulares, personas, horarios, control de asistencia y cÃ¡lculo de horas pagables. DespuÃ©s vendrÃ¡n facturaciÃ³n (Ekuatia'i / DNIT-SET), importaciÃ³n de extractos bancarios, pacientes con historia clÃ­nica, alumnos, proveedores y clientes.

La decisiÃ³n de stack estaba abierta ([[Stack]]) y bloqueaba el arranque del cÃ³digo.

## DecisiÃ³n

Se fija el stack y el criterio de crecimiento:

**Stack obligatorio**
- Next.js (App Router, Server Components, Server Actions) con TypeScript estricto.
- Tailwind CSS + shadcn/ui + Lucide Icons.
- Supabase (PostgreSQL, Auth, RLS, Storage) gestionado con migraciones de la CLI de Supabase.
- TanStack Query para estado de cliente; Zod para validaciÃ³n de todo lo que entra.
- Despliegue en Vercel y repositorio en GitHub con commits convencionales.
- Obsidian como segundo cerebro: el contexto del proyecto vive en notas `.md` versionadas.

**Reglas de modelo y datos que condicionan la estructura**
- La base de datos se escribe en **espaÃ±ol `snake_case`**; TypeScript en `camelCase`.
- La **CI paraguaya** identifica a la persona de forma Ãºnica, pero **no es la clave primaria**: PK `UUID`.
- **Zona horaria `America/Asuncion`**; en la base de datos todo instante se guarda en **UTC (`timestamptz`)**.
- **Moneda PYG** como `bigint` sin decimales; formato de presentaciÃ³n `Gs. 150.000`.
- **Multi-sede**: hoy 2 sedes, diseÃ±ado para N. Toda tabla de negocio lleva `sede_id`.
- **NingÃºn parÃ¡metro de negocio hardcodeado**: tolerancias, redondeos, reglas de pago y tarifas viven en tablas con **vigencia**.
- El nÃºcleo es `personas`; los roles (profesional, empleado, alumno, paciente, tutor, proveedor, cliente) se asignan con `persona_roles` y se relacionan con `persona_relaciones`.
- La organizaciÃ³n del cÃ³digo es **por funcionalidad** (`src/features/<modulo>/`); aÃ±adir un mÃ³dulo es aÃ±adir una carpeta.

## Consecuencias

**Positivas**
- Un solo lenguaje (TypeScript) de la base de datos a la interfaz, con tipos generados desde el esquema: menos errores y menos contexto que cargar.
- RLS en la base de datos: la seguridad no depende de que la interfaz se acuerde de filtrar por sede.
- Las fases futuras entran como mÃ³dulos nuevos sin reorganizar lo existente.
- Los parÃ¡metros con vigencia permiten cambiar reglas de negocio sin desplegar cÃ³digo ni reescribir el pasado.

**Negativas / costes**
- Dependencia de Supabase y Vercel (servicios gestionados): hay que cuidar la salida de datos y las copias.
- RLS y RBAC dinÃ¡mico aÃ±aden complejidad temprana: sin pruebas de RLS, el aislamiento entre sedes se rompe en silencio.
- `src/types/database.ts` generado: hay que regenerarlo tras cada migraciÃ³n en lugar de escribirlo a mano.

## Alternativas descartadas

| Alternativa | Por quÃ© no |
| --- | --- |
| API + SPA separadas | Dos proyectos que mantener, sin beneficio para este tamaÃ±o; los Server Actions cubren el caso |
| App de escritorio con base local | Sin acceso desde las sedes ni desde casa; y el centro ya trabaja con servicios en la nube |
| Backend propio (Node/Express + Postgres administrado) | Reconstruir autenticaciÃ³n, permisos y almacenamiento que Supabase ya resuelve |
| ParÃ¡metros de negocio en constantes del cÃ³digo | Cada cambio de tarifa o tolerancia exigirÃ­a un despliegue y reescribirÃ­a el histÃ³rico |

## Relacionado

- [[Estructura-Carpetas]] Â· [[Stack]] Â· [[Vision-Arquitectura]] Â· [[Modelo-de-Datos]]
