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
| 2026-11-12 | Familias de reglas del motor: las habituales de los psicotécnicos; no se han podido contrastar: la Guardia Civil no publica el cuestionario de aptitudes (fase 3) | Decisión del propietario; no son datos de la oposición, solo tipos de ejercicio |
| 2026-11-12 | Series de letras con el alfabeto español de 27 letras (con Ñ, sin CH ni LL) y sin dar la vuelta (después de la Z no viene la A) | Decisión del propietario; no se ha podido confirmar con fuente oficial (el cuestionario no se publica). Sin vuelta se evitan respuestas discutibles |
| 2026-11-12 | Muestras para revisión humana: 20 por tipo (4 por nivel) en `docs/muestras/` | Decisión del propietario; la skill pedía 20 por nivel (600), demasiadas para revisar con atención |
| 2026-11-12 | Las muestras se exportan con Vitest (`--mode muestras`), no con un script de Node | Node no ejecuta directamente los imports sin extensión del motor; así no hace falta ninguna dependencia nueva |
| 2026-11-12 | `@types/node` como dependencia de desarrollo de `packages/engine` | Solo para el exportador de muestras; el código del motor no usa Node |
| 2026-11-12 | Prueba de estrés (10.000 por tipo, nivel y opciones) cada noche en GitHub Actions y al cerrar cada fase | Skill `aptiq-generator` |
| 2026-11-12 | La correcta no puede delatarse por su valor: el montaje común reparte cuántas opciones quedan por debajo de ella, y una prueba común lo vigila | Hallazgo del revisor de contenido: en varios tipos la correcta era casi siempre la del medio |
| 2026-11-12 | Ordenación alfabética: se descarta toda pregunta cuya respuesta cambie con el orden antiguo (CH y LL como letras propias) | Muchos opositores aprendieron ese orden; la pregunta sería discutible |
| 2026-11-12 | Cada pregunta guarda la familia de reglas con la que se generó (`meta.family`) | Para calibrar la dificultad por familia con datos de uso |
| 2026-11-12 | Limitación conocida: las series de letras de los niveles 1 a 3 tienen pocas combinaciones (126, 161 y 52 enunciados distintos por cada 1.000 semillas, versión 2) | Con 27 letras y reglas sencillas no hay más; un opositor que practique mucho ese tipo verá repeticiones. Se puede ampliar en la fase 3 si los exámenes oficiales usan otras variantes |
| 2026-11-12 | Perfil `guardia-civil-2026` con datos del BOE-A-2026-9982 (80 preguntas, 55 minutos, 4 opciones, fórmula de la base 7.3, 0-30, mínimo 12) y la proporción de tipos pendiente | La Guardia Civil no publica el cuestionario de aptitudes, solo la plantilla de respuestas |
| 2026-11-12 | Simulacro con el formato oficial y una «mezcla de entrenamiento» con los tipos a partes iguales, con aviso visible de que la proporción no es oficial | Decisión del propietario mientras no haya fuente oficial |
| 2026-11-12 | La nota negativa se muestra sin recortar, con la fórmula, como «pendiente de confirmar» | Decisión del propietario; las bases no dicen qué pasa con una nota negativa |
| 2026-11-12 | Distractores validados con pruebas automáticas de pistas (puesto por valor, centro de errores, consenso) y, después, con opositores en la beta | Decisión del propietario: no hay exámenes oficiales de aptitudes como referencia |
| 2026-11-12 | El montaje común sortea una vez por pregunta la familia y el puesto por valor de la correcta | Sortearlos en cada reintento favorecía los puestos centrales y las familias que se descartan menos |
| 2026-11-12 | Palabras de las preguntas sin ninguna que lleve tilde (se muestran en mayúsculas sin ella) | La oposición evalúa la ortografía: no se debe enseñar «JARDIN» o «VOLCAN» |
| 2026-11-12 | Esquema de perfil con `format.puntuacion.{maxima, minima}` y la fórmula Y/T/N del BOE; la skill `aptiq-exam-profile` se actualiza a este esquema | El esquema de ejemplo de la skill era anterior a leer las bases |

| 2026-11-12 | Práctica de la fase 4 con preguntas en revisión: la pantalla Inicio lo avisa; la validación con opositores va en la beta | Decisión del propietario (opción a) |
| 2026-11-12 | Una sesión y un intento guardan sus preguntas completas (tipo, nivel, semilla, respuesta, marca); las pantallas regeneran el enunciado con el motor | Así el fallo y la explicación salen de la semilla, sin guardar el texto de las preguntas |
| 2026-11-12 | Dependencias nuevas: `expo-sqlite` y `drizzle-orm` (del stack). Tablas creadas con SQL al abrir la base; drizzle-kit se añade con la primera migración de cambio | Stack del CLAUDE.md; evita una herramienta más mientras no hay migraciones |
| 2026-11-12 | `@aptiq/engine` es dependencia interna de la app (no una librería externa) | La app usa el motor para generar y puntuar; el perfil oficial se exporta desde el motor |
| 2026-11-12 | Test de nivel de 12 preguntas (2 por tipo, nivel 2) con estimación lineal de 1 a 5, marcada como orientativa | Decisión del propietario (recomendada); sin datos oficiales de reparto |
| 2026-11-12 | `.npmrc` con `node-linker=hoisted` (sustituye a «no hace falta `.npmrc`» de la fase 0) | Con los enlaces de pnpm, CMake/ninja no compilaban Android en Windows y las rutas pasaban de 260 caracteres; Expo lo recomienda con pnpm. El lockfile no cambia |
| 2026-11-12 | Plugin de configuración `apps/mobile/plugins/with-windows-cmake.js`: en Windows, CMake 3.31.6 (ninja con rutas largas) y carpeta temporal `C:/b` | El ninja de CMake 3.22 no admite rutas largas; `android/` se genera y no se puede editar a mano. En Linux (CI, EAS) no cambia nada |
| 2026-11-12 | Flujos de Maestro en `apps/mobile/.maestro/` (onboarding, práctica, simulacro en modo avión), probados en el emulador Android 37 con la compilación release | Criterio de aceptación de la fase 4 |
| 2026-11-12 | `SourceNote` dice «Formato según la convocatoria oficial: BOE-A-2026-9982, bases 6.1.2.a, 7.3 y 7.8», con la cita sacada del perfil, en lugar de «…exámenes publicados por…» | Principio 4: la Guardia Civil no publica el cuestionario de aptitudes. **Pendiente** que el propietario confirme el cambio en `docs/guia-estilos.md` §5 y en `docs/prototipos/inicio.html` |
| 2026-11-12 | El simulacro en curso se guarda en SQLite tras cada respuesta y se retoma al volver a abrir la app, con su hora de inicio (el tiempo sigue contando); salir sin entregar lo borra | NFR-03: «si la app pasa a segundo plano o se cierra» |
| 2026-11-12 | Dentro de una sesión no se repite ningún enunciado (se cambia la semilla por una derivada, como mucho 50 intentos); entre sesiones solo se evitan las semillas repetidas | CON-02. Las series de letras de niveles bajos tienen pocos enunciados distintos (limitación ya anotada) |
| 2026-11-12 | «A reforzar» con aciertos ÷ total (las de en blanco cuentan), como el porcentaje que se ve; el test de nivel cuenta «No lo sé» como no acertada y no estima más de un nivel por encima del probado | Hallazgos de `revisor-contenido` e `revisor-interfaz` |

## Pendientes (las decide el propietario)

- [x] Logotipo: p marcada (decidido el 2026-11-12)
- [x] Confirmar en las bases vigentes del BOE: número de preguntas, tiempo, opciones, penalización y nota mínima de Guardia Civil (hecho en la fase 3, BOE-A-2026-9982; falta tu revisión del perfil)
- [ ] Preguntar a la Jefatura de Enseñanza si publica o facilita los tipos de ejercicio de la prueba de aptitudes (lo envía el propietario)
- [ ] Identificador de la app en Android e iOS: el prebuild propuso `com.javioller.aptiq` (lo usan los flujos de Maestro); no está en `app.json` hasta que lo confirmes
- [ ] Aplazar a la fase 5 la pantalla de historial (PRO-02: el historial ya se guarda en SQLite) y a la fase 6 el nivel por aptitud con su evolución (PRO-01: hoy hay nivel orientativo por aptitud en Inicio, sin evolución)
- [ ] T8 / NFR-02: medir en un Android de gama media, en release, arranque en frío (< 2 s) y pregunta nueva (< 100 ms), o aplazarlo a la beta
- [ ] Diseño de Inicio y Resultado: barra de pestañas y filas de lista, casillas marcadas en el progreso, nota con «/ 30» y sello al lado, barras por aptitud
- [ ] Cuentas: Expo/EAS, Apple Developer, Google Play Console, Supabase (región UE), RevenueCat, PostHog, Sentry
- [ ] Psicólogo o preparador que revise el contenido
- [ ] Precios definitivos y prueba con 5–8 opositores
- [ ] Consulta legal: propiedad intelectual y aviso de independencia
- [ ] Marca «Aptiq» en la OEPM y la EUIPO, y dominio
