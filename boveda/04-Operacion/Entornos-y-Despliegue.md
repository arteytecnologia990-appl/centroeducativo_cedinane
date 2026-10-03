---
tipo: operacion
actualizado: 2026-10-03
tags:
  - operacion
  - costos
---

# Entornos y despliegue

> [!danger] Coste cero obligatorio durante el desarrollo
> **Solo planes gratuitos** → [[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]].
> Prohibido activar Pro/Enterprise o add-ons, y prohibido añadir métodos de pago. Si algo amenaza con costar, se detiene y se consulta.

## Entornos

| Entorno | Para qué | Datos | Infraestructura |
| --- | --- | --- | --- |
| **Local (desarrollo)** | Construir y probar — **el entorno principal** | Ficticios (seed) | `next dev` + Supabase en la nube (Free) |
| **Preview** | Ver un cambio en remoto (Vercel Hobby, gratis) | Ficticios | Vercel Hobby + Supabase Free |
| **Producción** | Publicar de verdad | Reales | 🔮 **Pendiente de decidir** (licencia Hobby es no comercial) |

> [!danger] Regla dura
> **Nunca** datos reales de alumnos/pacientes en local, preview ni en esta bóveda. Para probar, datos inventados; si hace falta realismo, anonimizar de forma irreversible.

## Servicios (planes gratuitos verificados)

- **Supabase Free**: base de datos, Auth y Storage. Se pausa por inactividad; se reactiva desde el dashboard. Sin costo.
- **GitHub Free**: repositorio y CI dentro del cupo gratuito de Actions. Sin costo.
- **Vercel Hobby** (team `centroeducativo-cedinane`): gratuito y conectado a GitHub. ⚠️ El plan Hobby es para uso **personal/no comercial**: si el sistema se explota comercialmente, habrá que cambiar de plan (con coste) o de hosting. Se decidirá al publicar.

## Copias de seguridad

1. Supabase tiene respaldo gestionado, pero **no sustituye** un plan de restauración propio.
2. Antes de cada migración destructiva: exportar el esquema/datos.
3. Una copia que nunca se restauró **no es una copia**: probar la restauración.
4. Los datos de producción nunca se exportan a local → [[Seguridad-y-Datos]].

## Checklist de despliegue (cuando se autorice)

- [ ] Coste aprobado expresamente por el promotor (si aplica)
- [ ] `build` en verde (lint + typecheck + tests)
- [ ] Migraciones aplicadas en el entorno destino
- [ ] Variables de entorno cargadas
- [ ] Copia de seguridad previa verificada
- [ ] Probar un flujo real de punta a punta

## Registro de despliegues

| Fecha | Versión | Entorno | Cambios | Quién |
| --- | --- | --- | --- | --- |
| — | — | — | *sin despliegues* | — |

## Relacionado

- [[Entorno-Local]] · [[Seguridad-y-Datos]] · [[Pruebas]] · [[ADR-0005-Coste-cero-obligatorio-durante-el-desarrollo]]
