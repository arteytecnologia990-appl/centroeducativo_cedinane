---
tipo: dominio
actualizado: 2026-10-03
tags:
  - dominio
  - multisede
---

# Multisede

Hoy hay **2 sedes**; se diseña para **N**. El aislamiento por sede es un requisito de primera clase, no un filtro cosmético.

## Reglas

1. **Toda tabla de negocio lleva `sede_id`** (FK a `sedes`). La única excepción son catálogos globales que lo indiquen explícitamente.
2. Una **persona** no depende de una sede (es global); su **rol y sus vínculos** sí pueden estar acotados por sede (un profesional puede trabajar en una o varias sedes).
3. Un **usuario** puede tener permisos en una o varias sedes; nunca hereda permisos "globales" salvo `es_admin_general`.
4. El **selector de sede** del panel define el contexto de trabajo; las consultas y mutaciones se acotan a la sede activa (en cliente **y** en servidor/RLS).
5. El **kiosco** de asistencia está físicamente en una sede: su marcación se registra con el `sede_id` del kiosco, no con una sede elegida por el que marca.

## Consecuencias de diseño

- `sede_id` se propaga a: `marcaciones`, `asistencias_diarias`, `horarios`, `tarifas`, `cargos`, `configuraciones`, etc.
- El RBAC se evalúa como `(rol × pantalla × sede)`. Ver [[RBAC-y-RLS]].
- RLS: las políticas de las tablas sensibles filtran por las sedes a las que el usuario tiene acceso → [[Seguridad-y-Datos]].

## Preguntas

- [ ] ¿Las dos sedes comparten dirección y administración, o son unidades autónomas?
- [ ] ¿Un profesional rota entre sedes? (implica `persona_roles` con `sede_id` nullable = todas)
- [ ] ¿Hay una sede "virtual" para actividades fuera de sede (visitas, terapias a domicilio)?
