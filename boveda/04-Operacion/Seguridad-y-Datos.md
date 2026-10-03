---
tipo: operacion
actualizado: 2026-10-03
tags:
  - operacion
  - riesgo
  - pendiente
---

# Seguridad, privacidad y datos personales

Los datos son de **menores de edad** y hay informaciÃ³n econÃ³mica de familias. Esto no es un apartado tÃ©cnico: es una obligaciÃ³n que condiciona el diseÃ±o desde el primer dÃ­a.

## Principios

1. **MÃ­nimo dato necesario.** Si un dato no se usa para nada, no se recoge. Cada campo de mÃ¡s es un riesgo de mÃ¡s.
2. **Acceso por rol y por Ã¡mbito.** Nadie ve mÃ¡s de lo que necesita para su trabajo ([[Roles-y-Permisos]]).
3. **Todo lo sensible se audita.** Notas, pagos, datos personales y bajas de usuario dejan registro de quiÃ©n, quÃ© y cuÃ¡ndo.
4. **Los datos no se borran en silencio**: se archivan con motivo.
5. **Los datos reales nunca salen del entorno de producciÃ³n** (ni a pruebas, ni a esta bÃ³veda, ni a un chat con un asistente) â†’ [[Entornos-y-Despliegue]].

## Medidas tÃ©cnicas mÃ­nimas (cuando exista cÃ³digo)

- [ ] ContraseÃ±as con algoritmo de hash moderno (nunca en texto plano, nunca reversibles).
- [ ] Sesiones con expiraciÃ³n y cierre de sesiÃ³n real.
- [ ] Permisos comprobados **en el servidor** en cada operaciÃ³n, no solo ocultando botones.
- [ ] Cifrado en trÃ¡nsito (HTTPS) en cualquier despliegue accesible desde internet.
- [ ] Copias de seguridad cifradas y con acceso restringido.
- [ ] Registro de auditorÃ­a de acciones sensibles, no editable por los usuarios auditados.
- [ ] ValidaciÃ³n de toda entrada del usuario (formularios e importaciones).
- [ ] Dependencias actualizadas: una librerÃ­a abandonada es una puerta abierta.

## Datos especialmente sensibles

| Dato | Riesgo | Trato |
| --- | --- | --- |
| Documento de identidad del menor | SuplantaciÃ³n | Visible solo para secretarÃ­a y direcciÃ³n |
| DirecciÃ³n y telÃ©fonos | LocalizaciÃ³n de menores | Visible para personal autorizado |
| Salud y necesidades educativas | DiscriminaciÃ³n | Acceso restringido, justificado y auditado |
| Notas y disciplina | EstigmatizaciÃ³n | Visible para el alumno, su familia y su docente |
| Impagos | ExposiciÃ³n econÃ³mica | Nunca en listados visibles a otras familias |
| Credenciales y claves | Acceso total | Fuera del repositorio, rotables |

## Aspectos legales *(a confirmar)*

- [ ] Â¿QuÃ© normativa de protecciÃ³n de datos aplica en el paÃ­s del centro?
- [ ] Â¿Se necesita consentimiento de los acudientes para tratar datos del menor?
- [ ] Â¿CuÃ¡nto tiempo hay que conservar expedientes acadÃ©micos y contables?
- [ ] Â¿Hay obligaciÃ³n de informar de brechas de seguridad?
- [ ] Â¿QuiÃ©n es el responsable del tratamiento de los datos?

## Respuesta ante incidentes

1. Contener: cortar el acceso comprometido.
2. Evaluar: quÃ© datos y de quiÃ©n se han visto afectados.
3. Restaurar desde copia segura si es necesario ([[Entornos-y-Despliegue]]).
4. Avisar segÃºn corresponda.
5. Anotar el incidente y la causa en [[Entorno-Local]] y corregir el origen.

## Relacionado

- [[Roles-y-Permisos]] Â· [[Entornos-y-Despliegue]] Â· [[Modelo-de-Datos]] Â· [[Entornos-y-Despliegue]]
