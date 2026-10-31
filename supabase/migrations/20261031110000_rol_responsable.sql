-- Rol "Tutor" → "Responsable"
alter table public.persona_roles drop constraint if exists persona_roles_rol_negocio_check;

update public.persona_roles set rol_negocio = 'responsable' where rol_negocio = 'tutor';

alter table public.persona_roles add constraint persona_roles_rol_negocio_check check (
  rol_negocio in (
    'profesional',
    'empleado',
    'alumno',
    'usuario',
    'participante',
    'responsable',
    'proveedor',
    'cliente'
  )
);
