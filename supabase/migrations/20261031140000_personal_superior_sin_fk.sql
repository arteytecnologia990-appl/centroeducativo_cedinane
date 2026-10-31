-- Quitar el FK de superior_id: crea una segunda relación personal↔personas
-- y rompe los embeds "personal(...)" de las consultas. Se valida en la app
-- (el select solo ofrece empleados).
alter table public.personal drop constraint if exists personal_superior_id_fkey;
