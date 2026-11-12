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
| 2026-11-12 | Si `docs/prototipos/sistema.html` difiere de la guía y `tokens.json`, mandan la guía y los tokens (tabla en `docs/planes/fase-1.md`) | Decisión del propietario; los prototipos de pantalla ya coinciden con la guía |
| 2026-11-12 | Logotipo con la **p** marcada y siempre el SVG oficial de `docs/marca/` (sin versión de trazo grueso para tamaños pequeños) | Decisión del propietario |
| 2026-11-12 | En Android el cristal usa siempre la alternativa sin desenfoque (blanco al 88 %); en iOS, `expo-blur` | En el SDK 58, el desenfoque de Android exige envolver cada pantalla en `BlurTargetView`; se añadirá si el aspecto se queda corto |
| 2026-11-12 | Dependencias nuevas: `expo-blur` (cristal) y `expo-haptics` (vibración), oficiales de Expo; `packages/ui` usa `react-native-svg`, `jest-expo` y Testing Library, ya en el stack | Guía, secciones 4 y 8 |
| 2026-11-12 | Tokens nuevos en `tokens.json`: tamaños de logotipo, casillas y burbujas de nivel, giro del sello, bordes del sello, radio de casilla, opacidades de pulsado y desactivado, curva `easingCurve` | Valores que la guía y los prototipos definen y que estaban escritos a mano |
| 2026-11-12 | Simulación mínima de Reanimated en Jest (`packages/ui/jest.setup.js`) | La simulación oficial de Reanimated 4 choca con jest-expo en este monorepo |
| 2026-11-12 | `review-animations` se aplica a mano (la skill solo se puede invocar desde el chat) | Su criterio llevó a la curva ease-out marcada y a mantener el fundido con «reducir movimiento» |
| 2026-11-12 | La animación de avance de `ProgressTicks` llega en la fase 4, con el Simulacro | Solo tiene sentido con la navegación entre preguntas |

## Pendientes (las decide el propietario)

- [x] Logotipo: p marcada (decidido el 2026-11-12)
- [ ] Confirmar en las bases vigentes del BOE: número de preguntas, tiempo, opciones, penalización y nota mínima de Guardia Civil
- [ ] Cuentas: Expo/EAS, Apple Developer, Google Play Console, Supabase (región UE), RevenueCat, PostHog, Sentry
- [ ] Psicólogo o preparador que revise el contenido
- [ ] Precios definitivos y prueba con 5–8 opositores
- [ ] Consulta legal: propiedad intelectual y aviso de independencia
- [ ] Marca «Aptiq» en la OEPM y la EUIPO, y dominio
