# Fase 7 · Pago · Plan

**Rama:** `fase-7-pago`
**Requisitos:** PAY-01, PAY-02, PAY-03 (y la tabla «Monetización» de `docs/requisitos.md`).
**Criterio de aceptación (`docs/plan-fases.md`):** compra, renovación, cancelación y restauración probadas en los entornos de prueba de ambas tiendas.
**Estado:** plan confirmado por el propietario el 2026-11-15 («Sí, tal cual»), con las propuestas de las decisiones 1–4.
**Skills:** la ficha no nombra ninguna. Uso `aptiq-design-system` (muro de pago y pantallas), `animate-expo` solo como criterio y `supabase-postgres-best-practices` si hiciera falta tocar el servidor (no está previsto).

## Punto de partida

- Todavía **no existen** las cuentas de Apple Developer, Google Play Console ni RevenueCat (pendiente en `docs/decisiones.md`). Sin ellas no se puede cumplir el criterio de aceptación: las compras de prueba solo funcionan con apps dadas de alta en las tiendas.
- RevenueCat tiene una **Test Store** que permite probar compras sin tiendas, pero también necesita una cuenta de RevenueCat.
- Precios orientativos ya escritos: mensual 7,99 €, pase 3 meses 19,99 €, pase 6 meses 29,99 €, anual 39,99 € con 7 días de prueba. Se configuran en RevenueCat, nunca en el código.

## Reglas

- **Quién manda en «eres Premium»:** el permiso (`entitlement`) `premium` de RevenueCat. La app no guarda ni calcula precios.
- **Las reglas del plan gratuito van en `packages/engine`** como funciones puras con «ahora» como parámetro (pruebas primero): cuántas Sesiones de hoy y simulacros quedan, qué tipos están abiertos.
- **Nunca se bloquea lo ya hecho:** explicaciones siempre visibles y lo guardado siempre accesible.
- **El muro de pago aparece al terminar el primer simulacro**, nunca en el primer arranque, y siempre se puede cerrar.
- Sin cuentas de tienda, la app funciona con un **modo de prueba local** (todo gratis o todo Premium con un interruptor solo de desarrollo), para poder construir y probar las pantallas.
- Dependencia nueva: `react-native-purchases` (y `react-native-purchases-ui` solo si usamos sus pantallas; propongo que **no**: el muro es propio para seguir la guía de estilos). Se anota en `docs/decisiones.md`.

## Tareas

### T1 · Reglas del plan gratuito en el motor (tabla «Monetización»)
- **Archivos:** `packages/engine/src/plan/limits.ts` y su prueba; exportar en `index.ts`.
- **Qué:** `freeAllowance({ premium, hoy, sesionesHoy, simulacrosSemana })` → qué puede hacer: Sesión de hoy 1 al día, simulacro 1 a la semana (lunes a domingo), práctica solo en los tipos básicos.
- **Verificación:** pruebas con Vitest y fast-check (cambio de día y de semana, Premium sin límites).

### T2 · Capa de compras con RevenueCat y modo de prueba local (PAY-01, PAY-02, PAY-03)
- **Archivos:** `apps/mobile/src/purchases/` (`api.ts` con una interfaz pequeña: `estado`, `ofertas`, `comprar`, `restaurar`; `revenuecat.ts`; `local.ts` para desarrollo), `provider.tsx`, `app.json`, `.env.example` (clave pública de RevenueCat, que es pública por diseño).
- **Qué:** iniciar RevenueCat con el id de usuario de Supabase si hay cuenta (las compras siguen a la cuenta en otro móvil) o anónimo si no; escuchar cambios de estado (renovación, caducidad).
- **Verificación:** pruebas con jest-expo usando la versión local; compilación Android.

### T3 · Prototipo del muro de pago y de «Tu plan» en Cuenta
- **Archivos:** `docs/prototipos/muro-pago.html`, `docs/prototipos/cuenta-plan.html` y sección en `index.html`.
- **Qué:** muro tras el primer simulacro (anual destacado con 7 días de prueba, mensual y los tres pases; texto legal de renovación y cancelación) y bloque «Tu plan» en Cuenta (estado, gestionar suscripción, restaurar compras).
- **Verificación:** **lo apruebas tú** antes de T4.

### T4 · Muro de pago en la app (PAY-01, PAY-02)
- **Archivos:** `apps/mobile/src/screens/muro-pago.tsx` (+ ruta), `resultado.tsx` (abrirlo tras el primer simulacro) y pruebas.
- **Qué:** precios leídos de RevenueCat con su formato local; comprar; errores comprensibles (cancelada, sin red, pendiente de pago).
- **Verificación:** pruebas de componente; capturas comparadas con el prototipo; `revisor-interfaz`.

### T5 · Límites del plan gratuito en la app
- **Archivos:** `inicio.tsx`, `practica.tsx`, `simulacro.tsx`, `historial.tsx` y pruebas.
- **Qué:** aplicar T1: candado y texto claro en lo que no está incluido, que lleva al muro; nivel por aptitud y repetición espaciada solo en Premium; historial completo solo en Premium (lo gratuito ve el último simulacro).
- **Verificación:** pruebas de componente con plan gratuito y Premium; flujo de Maestro.

### T6 · «Tu plan» en Cuenta: restaurar y gestionar (PAY-03)
- **Archivos:** `cuenta.tsx` y prueba.
- **Qué:** estado del plan y fecha de renovación o fin; «Restaurar compras»; «Gestionar suscripción» abre la página de la tienda.
- **Verificación:** pruebas de componente; captura.

### T7 · Pruebas en las tiendas (criterio de aceptación) — **bloqueada por las cuentas**
- **Archivos:** `docs/planes/fase-7-prueba-tiendas.md` (pasos), productos en App Store Connect, Google Play y RevenueCat.
- **Qué:** compra, renovación acelerada, cancelación y restauración en el sandbox de Apple y en las pruebas de Google Play.
- **Verificación:** tú en un iPhone y un Android con cuentas de prueba; resultado anotado en `docs/progreso.md`.

## Decisiones que solo puedes tomar tú

1. **Cuentas:** ¿das de alta ya Apple Developer (99 $/año), Google Play Console (25 $ una vez) y RevenueCat (gratis hasta cierto volumen)? Sin ellas, T7 queda pendiente y la fase se cierra como la 5, con la prueba en tiendas aplazada.
2. **Precios:** ¿valen los orientativos? Mensual 7,99 €, anual 39,99 € con 7 días de prueba, pase de 3 meses 19,99 € y pase de 6 meses 29,99 €. El requisito PAY-02 cita también un pase de 12 meses que no tiene precio: ¿lo quitamos (el anual ya cubre ese plazo) o le pones precio?
3. **«3 tipos básicos» gratis:** ¿cuáles? Propuesta: uno de cada aptitud que tiene más de un tipo, para que se pruebe todo: Series numéricas (`NUM.SERIE`), Comparación de datos (`DAT.COMPARA`) y Ordenación alfabética (`VER.ORDEN`). Quedarían para Premium: Series de letras, Cálculo y porcentajes, y Códigos y criptogramas.
4. **Pases:** pago único que no se renueva; al acabar vuelves al plan gratuito sin perder nada.
