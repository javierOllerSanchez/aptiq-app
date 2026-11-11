# Decisiones

## Tomadas

| Fecha | Decisión | Motivo |
| --- | --- | --- |
| 2026-11-11 | Nicho: psicotécnicos de oposiciones; MVP solo Guardia Civil | Dolor concreto, captación orgánica, más material oficial publicado |
| 2026-11-11 | Nombre: Aptiq; claim «Saca tu apto.» | Gancho de «apto» con nombre registrable (pendiente de comprobar marca) |
| 2026-11-11 | Identidad «papel, tinta y subrayador», versión sobria; cristal solo en lo flotante | Transmite rigor y evita la estética genérica de apps hechas con IA |
| 2026-11-11 | Contenido original generado desde patrones de exámenes publicados oficialmente, siempre con explicación paso a paso | Seguridad legal y valor real para el opositor |
| 2026-11-11 | Stack: Expo (React Native) + Expo Router, TypeScript, pnpm + Turborepo, Supabase (UE), RevenueCat, PostHog (UE), Sentry | Una base para iOS, Android y una futura web |
| 2026-11-11 | Estilos con StyleSheet + tokens propios, sin librería de UI | Fidelidad al sistema visual y menos dependencias |
| 2026-11-11 | Las skills de Aptiq mandan sobre las de terceros | Evitar que cada skill imponga su estilo |
| 2026-11-12 | Expo SDK 58 (React Native 0.88) y Node 22.13 o superior (24 en CI) | Es la versión actual de la plantilla oficial; el SDK 58 ya no admite Node 20 |
| 2026-11-12 | TypeScript ~6.0 y ESLint 9 (no TypeScript 7 ni ESLint 10) | Son las versiones que admiten Expo y typescript-eslint hoy |
| 2026-11-12 | Dependencias nuevas fuera del stack: `@expo-google-fonts/*` (Instrument Sans, IBM Plex Mono, Bricolage Grotesque; licencia OFL), Prettier, `eslint-config-expo`, `typescript-eslint` | Fuentes de la guía de estilos y calidad automática (NFR-07) |
| 2026-11-12 | El logotipo se carga tal cual desde `docs/marca/` con `expo-image` (Metro trata `.svg` como imagen) | Una sola fuente del logotipo; nunca se recrea |
| 2026-11-12 | ESLint prohíbe `Math.random`, `Date.now` y `new Date()` en `packages/engine` | Determinismo del motor (NFR-09) vigilado por la máquina |
| 2026-11-12 | No se fija la versión mínima de iOS y Android: se usan las del SDK (iOS 15.1 y Android 7) | Ya cubren NFR-10 (iOS 16+ y Android 9+) sin añadir dependencias |
| 2026-11-12 | Se quitan de la plantilla de Expo `@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-device` y `expo-web-browser` | No se usan; el stack es sin librería de UI. El cristal se hará con `expo-blur` en la fase 1 |

## Pendientes (las decide el propietario)

- [ ] Logotipo: p marcada (por defecto en el kit) o punto de la i
- [ ] Confirmar en las bases vigentes del BOE: número de preguntas, tiempo, opciones, penalización y nota mínima de Guardia Civil
- [ ] Cuentas: Expo/EAS, Apple Developer, Google Play Console, Supabase (región UE), RevenueCat, PostHog, Sentry
- [ ] Psicólogo o preparador que revise el contenido
- [ ] Precios definitivos y prueba con 5–8 opositores
- [ ] Consulta legal: propiedad intelectual y aviso de independencia
- [ ] Marca «Aptiq» en la OEPM y la EUIPO, y dominio
