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
| 2026-11-12 | Familias de reglas del motor: las habituales de los psicotécnicos; se contrastan con los cuestionarios oficiales en la fase 3 | Decisión del propietario; no son datos de la oposición, solo tipos de ejercicio |
| 2026-11-12 | Series de letras con el alfabeto español de 27 letras (con Ñ, sin CH ni LL) y sin dar la vuelta (después de la Z no viene la A) | Decisión del propietario; se confirma con las instrucciones oficiales en la fase 3. Sin vuelta se evitan respuestas discutibles |
| 2026-11-12 | Muestras para revisión humana: 20 por tipo (4 por nivel) en `docs/muestras/` | Decisión del propietario; la skill pedía 20 por nivel (600), demasiadas para revisar con atención |
| 2026-11-12 | Las muestras se exportan con Vitest (`--mode muestras`), no con un script de Node | Node no ejecuta directamente los imports sin extensión del motor; así no hace falta ninguna dependencia nueva |
| 2026-11-12 | `@types/node` como dependencia de desarrollo de `packages/engine` | Solo para el exportador de muestras; el código del motor no usa Node |
| 2026-11-12 | Prueba de estrés (10.000 por tipo, nivel y opciones) cada noche en GitHub Actions y al cerrar cada fase | Skill `aptiq-generator` |
| 2026-11-12 | La correcta no puede delatarse por su valor: el montaje común reparte cuántas opciones quedan por debajo de ella, y una prueba común lo vigila | Hallazgo del revisor de contenido: en varios tipos la correcta era casi siempre la del medio |
| 2026-11-12 | Ordenación alfabética: se descarta toda pregunta cuya respuesta cambie con el orden antiguo (CH y LL como letras propias) | Muchos opositores aprendieron ese orden; la pregunta sería discutible |
| 2026-11-12 | Cada pregunta guarda la familia de reglas con la que se generó (`meta.family`) | Para calibrar la dificultad por familia con datos de uso |
| 2026-11-12 | Limitación conocida: las series de letras de los niveles 1 a 3 tienen pocas combinaciones (126, 161 y 52 enunciados distintos por cada 1.000 semillas, versión 2) | Con 27 letras y reglas sencillas no hay más; un opositor que practique mucho ese tipo verá repeticiones. Se puede ampliar en la fase 3 si los exámenes oficiales usan otras variantes |

## Pendientes (las decide el propietario)

- [x] Logotipo: p marcada (decidido el 2026-11-12)
- [ ] Confirmar en las bases vigentes del BOE: número de preguntas, tiempo, opciones, penalización y nota mínima de Guardia Civil
- [ ] Cuentas: Expo/EAS, Apple Developer, Google Play Console, Supabase (región UE), RevenueCat, PostHog, Sentry
- [ ] Psicólogo o preparador que revise el contenido
- [ ] Precios definitivos y prueba con 5–8 opositores
- [ ] Consulta legal: propiedad intelectual y aviso de independencia
- [ ] Marca «Aptiq» en la OEPM y la EUIPO, y dominio
