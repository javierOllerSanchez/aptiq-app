# Respuestas de privacidad para las tiendas · borrador

Fase 9 · T11 (NFR-05). Sale del código, no de suposiciones; debe coincidir con `apps/web/privacidad.html`. Si cambia lo que la app guarda o envía, se actualizan las dos cosas.

## De dónde sale cada dato

| Dato | Cuándo | Adónde | Código |
| --- | --- | --- | --- |
| Correo | Solo si crea cuenta | Supabase (UE) | `src/auth/` |
| Progreso: respuestas (tipo, nivel, semilla, opción, acierto, tiempo), simulacros, sesiones, ajustes | Solo con cuenta | Supabase (UE) | `src/sync/`, `src/auth/supabase-remote.ts` |
| Id de usuario y compras | Al comprar o restaurar | RevenueCat (EE. UU.) | `src/purchases/revenuecat.ts` |
| Eventos de uso (7 fijos) con id anónimo, versión y sistema | Solo con permiso | PostHog (UE) | `src/analytics/analytics.ts` |
| Informes de fallos (sin IP ni usuario) | Siempre, si hay DSN | Sentry (UE) | `src/app/_layout.tsx` |
| Reporte de error en una pregunta (tipo, nivel, semilla, motivo, comentario) | Si lo envía | Supabase (UE), sin usuario | `src/reports/` |

No hay anuncios, ni seguimiento entre apps, ni localización, ni contactos, ni fotos.

## Google Play · Seguridad de los datos

- **¿Recoge o comparte datos?** Recoge. No comparte (los proveedores actúan por encargo: no cuenta como compartir).
- **¿Cifrados en tránsito?** Sí (HTTPS).
- **¿Se pueden borrar?** Sí: en la app (Cuenta → Borrar cuenta) y en la web (`borrar-cuenta.html`).

| Tipo de Google | Recogido | Opcional | Para qué |
| --- | --- | --- | --- |
| Información personal → Dirección de correo | Sí | Sí (solo con cuenta) | Gestión de la cuenta |
| Información financiera → Historial de compras | Sí | Sí (solo si compra) | Funciones de la app |
| Actividad en la app → Interacciones con la app | Sí | Sí (permiso de datos de uso) | Analítica |
| Actividad en la app → Otras acciones (progreso y respuestas) | Sí | Sí (solo con cuenta) | Funciones de la app, personalización |
| Actividad en la app → Otro contenido generado por el usuario (comentario del reporte) | Sí | Sí | Funciones de la app |
| Información y rendimiento de la app → Registros de fallos, diagnósticos | Sí | No | Funciones de la app |
| Dispositivo u otros ID → id anónimo de analítica, id de compras | Sí | Sí | Analítica, funciones de la app |

## Apple · Privacidad de la app

- **Seguimiento (tracking):** No.

| Tipo de Apple | Vinculado a la persona | Para qué |
| --- | --- | --- |
| Información de contacto → Correo electrónico | Sí | Funcionalidad de la app |
| Compras → Historial de compras | Sí | Funcionalidad de la app |
| Contenido del usuario → Otro contenido (progreso; comentario del reporte) | Sí (el progreso); no (el reporte) | Funcionalidad de la app |
| Identificadores → ID de usuario | Sí | Funcionalidad de la app |
| Datos de uso → Interacción con el producto | No | Analítica |
| Diagnóstico → Datos de fallos, rendimiento | No | Funcionalidad de la app |

## Por confirmar con el abogado

- Sentry sin pedir permiso (interés legítimo).
- Si el id de compras de RevenueCat para usuarios sin cuenta cuenta como «vinculado».
- Al borrar la cuenta no se borra aún el registro de RevenueCat (pendiente, ver `docs/progreso.md`).
