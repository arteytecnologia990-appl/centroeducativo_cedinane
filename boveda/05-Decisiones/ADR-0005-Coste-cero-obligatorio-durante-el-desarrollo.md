---
tipo: decision
numero: 0005
fecha: 2026-10-03
estado: aceptada
tags:
  - decision
  - costos
---

# ADR 0005 · Coste cero obligatorio durante el desarrollo

## Contexto

Aviso del promotor (2026-10-03):

> "Queda totalmente prohibido utilizar Vercel u otra herramienta que genere costo alguno, por lo menos durante el desarrollo del proyecto. En el futuro lo veremos."

**Verificación del mismo día:** el team de Vercel `centroeducativo-cedinane` está en plan **`hobby`, que es gratuito**; no hay plan Pro ni trial de pago activo. Por tanto, hoy Vercel **no** genera costo.

## Decisión

1. **Solo planes gratuitos** durante el desarrollo: Supabase Free, GitHub Free, GitHub Actions (dentro del cupo) y Vercel **Hobby**.
2. **Prohibido** activar cualquier plan de pago (Vercel Pro/Enterprise, Supabase Pro, add-ons) sin autorización expresa del promotor.
3. **Prohibido** añadir métodos de pago o aceptar trials que puedan terminar en cobro automático.
4. El desarrollo y las pruebas se hacen **en local** (`localhost`).
5. Si un servicio amenaza con generar costo (límite superado, aviso de upgrade, fin de trial), **se detiene su uso** y se consulta antes de continuar.
6. Vercel se mantiene en Hobby: su uso no queda prohibido por esta regla, pero **no se activa nada de pago**.

### Advertencia sobre el plan Hobby

El plan **Hobby** de Vercel está pensado para uso **personal y no comercial**. Si este sistema se explota comercialmente, Hobby incumpliría sus términos y requeriría un plan de pago. Eso **no** se resuelve ahora: se decidirá cuando el proyecto salga de desarrollo y el promotor lo autorice.

## Consecuencias

**Positivas**
- Coste cero mientras dure el desarrollo.
- Menos configuración externa que mantener.

**Negativas / costes**
- Dependemos de los límites de los planes gratuitos (Supabase se pausa por inactividad; Vercel Hobby tiene cupos de build y banda ancha).
- La validación "en el entorno real" se pospone.

## Alternativas descartadas

| Alternativa | Por qué no |
| --- | --- |
| Vercel Pro / Team de pago | Coste mensual: prohibido |
| Supabase Pro / add-ons | Coste: se usa el plan Free |
| Cualquier servicio de pago | Prohibido por la misma regla |

## Revisión

Se revisará cuando el proyecto salga de la fase de desarrollo y el promotor autorice expresamente un despliegue y su coste (si lo hubiera).

## Relacionado

- [[Entornos-y-Despliegue]] · [[Estado-Actual]] · [[Proyecto]]
