-- Rol "Paciente" → "Usuario" + nuevo rol "Participante"
alter table public.persona_roles drop constraint if exists persona_roles_rol_negocio_check;

update public.persona_roles set rol_negocio = 'usuario' where rol_negocio = 'paciente';

alter table public.persona_roles add constraint persona_roles_rol_negocio_check check (
  rol_negocio in (
    'profesional',
    'empleado',
    'alumno',
    'usuario',
    'participante',
    'tutor',
    'proveedor',
    'cliente'
  )
);
