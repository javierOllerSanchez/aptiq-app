# Progreso

Lo actualiza Claude Code al terminar cada tarea y en `/cerrar-fase`. El propietario aprueba cada fase antes de pasar a la siguiente.

| Fase | Estado | Rama / PR | Cerrada | Aprobada por el propietario |
| --- | --- | --- | --- | --- |
| 0 · Base del proyecto | Cerrada (prueba en iPhone pendiente del propietario) | `fase-0-base` · PR #1 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 1 · Sistema de diseño en código | Cerrada (VoiceOver en iPhone y `/review-animations` pendientes del propietario) | `fase-1-sistema-diseno` · PR #2 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 2 · Motor de contenido v1 | Cerrada (rediseño de distractores pendiente para el inicio de la fase 3) | `fase-2-motor` · PR #3 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 3 · Perfil de examen y puntuación | Cerrada (revisión del perfil por el propietario pendiente) | `fase-3-perfil` · PR #4 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 4 · Práctica y simulacro sin conexión | En curso | `fase-4-practica` | | |
| 5 · Cuentas y sincronización | Pendiente | | | |
| 6 · Progreso y adaptativo | Pendiente | | | |
| 7 · Pago | Pendiente | | | |
| 8 · Contenido ampliado y panel interno | Pendiente | | | |
| 9 · Beta y lanzamiento | Pendiente | | | |

## Registro

<!-- Formato de cada entrada: fecha · fase · qué se hizo · qué queda · qué debe comprobar el propietario -->

**2026-11-12 · Fase 0**

- **Hecho:**
  - 8 skills de terceros instaladas (`docs/skills-lock.md`); Taste sin confirmar en git hasta que el propietario decida.
  - Plugins Expo, Superpowers y Ponytail.
  - Monorepo pnpm + Turborepo (`apps/mobile`, `packages/engine`, `packages/tokens`, `packages/ui`).
  - `@aptiq/tokens` con prueba contra `docs/tokens.json` (falla si se cambia un valor: comprobado).
  - ESLint bloquea `Math.random`, `Date.now` y `new Date()` en el motor (comprobado).
  - App Expo SDK 58 con la pantalla provisional: captura en `docs/capturas/fase-0-android.png`.
  - `expo-doctor`: 20/20.
  - CI en `.github/workflows/ci.yml`; `eas.json` sin enlazar a ninguna cuenta.
  - `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm test`: en verde.
- **Hooks verificados con el monorepo:**
  - `post-edit.sh` detecta errores de ESLint y lanza las pruebas del motor relacionadas.
  - `stop-check.sh` bloquea un error de tipos.
  - Se corrigió un fallo con las rutas de Windows en `post-edit.sh`.
  - CI en verde en GitHub ([ejecución](https://github.com/javierOllerSanchez/aptiq-app/actions/runs/43120389658)).
- **Cierre (`/cerrar-fase 0`):**
  - `verificador-fase`: todo lo comprobable cumple; solo falta la prueba en iPhone (no verificable aquí).
  - `revisor-interfaz`: sin bloqueantes. Corregidos I-1 (logotipo accesible para VoiceOver/TalkBack), I-3 (margen superior con el área segura) y M-1 (grosor de la cuadrícula).
  - `revisor-contenido`: no aplica (el motor aún no tiene generadores ni perfiles).
  - Ponytail: quitados dos tipos sin uso en `@aptiq/tokens`.
  - El `tsconfig` de la app ya usa las mismas reglas estrictas que el resto del monorepo.
- **Anotado para la fase 1 (hallazgos menores del revisor de interfaz):**
  - token de tamaño del logotipo, y decidir entre el SVG oficial (trazo 9) o el del prototipo a 80 px (trazo 11);
  - Bricolage solo en `Stamp`, en color `seal` (el «APTO» de la pantalla provisional es solo una muestra de la fuente);
  - patrón de pantalla con `ScrollView` para texto grande;
  - registrar si fallan las fuentes, y fondo `paper` en las transiciones del `Stack`;
  - sacar de `tokens.type` los pesos de fuente que se cargan;
  - pasar `app.json` a `app.config.ts` con tokens, y fondo del icono en `ink`.
- **Anotado (avisos del verificador):**
  - no se fija iOS 16 / Android 9 en la configuración porque el SDK ya admite desde iOS 15.1 y Android 7, así que NFR-10 se cumple sin añadir `expo-build-properties`;
  - no hace falta `.npmrc`: pnpm con dependencias aisladas funciona y `expo-doctor` lo aprueba;
  - `format` llama a Prettier directamente, sin Turborepo: es una sola herramienta en la raíz.
- **Debe comprobar el propietario:** abrir la app en Expo Go en su iPhone (`pnpm --filter mobile start` y escanear el código QR).
- **Notas para fases siguientes:**
  - iconos y pantalla de arranque siguen siendo los de Expo; se sustituirán por `docs/marca/icono-app.svg` antes de la beta;
  - `test:stress` aún no hace nada (fase 2);
  - el perfil `development` de `eas.json` necesitará `expo-dev-client` el día que se haga la primera compilación de desarrollo.

**2026-11-12 · Fase 1**

- **Hecho:**
  - `packages/ui` con 13 piezas, cada una con pruebas de rol y etiqueta: `Text`, `Button`, `OptionBubble`, `GlassCard` y `Glass`, `TabBar`, `ProgressTicks`, `LevelBubbles`, `Stamp`, `SourceNote`, `PaperBackground` (con modo `scroll`), `Logo` e `Icon`.
  - Tokens nuevos en `docs/tokens.json`; la prueba de coincidencia sigue en verde.
  - Catálogo `/catalogo`, solo en desarrollo, y pantalla provisional con los componentes.
  - Capturas en Android: `docs/capturas/fase-1-catalogo-1/2/3.png` y, con el texto al 200 %, `fase-1-texto-200.png`.
- **Cierre (`/cerrar-fase 1`):**
  - `verificador-fase`: typecheck, lint, test y CI en verde. Pedía corregir «reducir movimiento» y actualizar estos documentos; ya está hecho.
  - `revisor-interfaz`: sin bloqueantes. Corregido:
    - «reducir movimiento» mantiene el fundido (`ReduceMotion.Never` en las animaciones de opacidad);
    - las opciones se anuncian «Opción B, 63, seleccionada», y las correctas o falladas ya no salen como desactivadas;
    - la letra amarilla ya no asoma al marcar (fundido cruzado);
    - todo lo pulsable responde visualmente; la vibración solo suena si cambia la respuesta;
    - el contenido no salta 1 px al marcar;
    - la barra de pestañas se anuncia como grupo de pestañas;
    - `GlassCard` agrupa su contenido para el lector.
  - Ponytail: se ha simplificado la simulación de Reanimated y se ha quitado una etiqueta redundante del botón.
  - Prettier aplicado al código; los Markdown y los recursos quedan fuera.
- **Debe comprobar el propietario:**
  - en el iPhone, abrir el catálogo («Ver catálogo») y recorrerlo con VoiceOver: opciones, pestañas, progreso y sello;
  - ejecutar `/review-animations` en el chat sobre `packages/ui/src/option-bubble.tsx` y `stamp.tsx`.
- **Anotado para la fase 4 (menores):**
  - el icono de `SourceNote` no crece con el texto dinámico;
  - algunos valores de icono y sello siguen escritos a mano (`size.icon * 0.8`, la escala 1,15 del sello): pasarlos a tokens cuando se usen en pantallas;
  - `glass.saturate` no se aplica (expo-blur no lo admite);
  - el catálogo no sigue el orden exacto de `sistema.html` ni tiene la lámina de color.
- **Para que lo decida el propietario:** casillas pendientes (1,28:1), burbujas de nivel vacías (1,73:1) y borde de opción vacía (1,38:1) quedan por debajo del 3:1 que WCAG 1.4.11 pide a los elementos gráficos. Son valores de la guía; la información también llega por el texto y la etiqueta accesible.

**2026-11-12 · Fase 2**

- **Hecho:**
  - Motor con 6 tipos de pregunta (series numéricas y de letras, cálculo y porcentajes, códigos, ordenación alfabética y comparación de datos), en versión 2.
  - 5 niveles por tipo, con familias de reglas con nombre.
  - Cada tipo tiene generador, solucionador independiente y explicación paso a paso (observa, regla, aplica, error de cada distractor y truco).
  - Generación determinista por semilla (NFR-09).
  - Batería común de pruebas para todos los tipos:
    - unicidad;
    - determinismo;
    - coherencia de la explicación;
    - errores explicados;
    - posición A, B, C, D uniforme;
    - puesto por valor;
    - que aparezcan todas las familias;
    - variedad;
    - instantáneas.
  - 171 pruebas. `pnpm test:stress`: 10.000 por tipo, nivel y número de opciones, sin ninguna ambigua. La prueba de estrés también se ejecuta cada noche en GitHub Actions.
  - 120 muestras en `docs/muestras/`.
- **Revisiones:**
  - `verificador-fase`: el código cumple el criterio de aceptación.
  - `revisor-contenido`, primera revisión: 2 bloqueantes (explicación invertida en las series de letras hacia atrás y series intercaladas con dos lecturas) y 7 importantes. Todos corregidos, salvo lo que se indica abajo.
  - `revisor-contenido`, segunda revisión: **sin bloqueantes**.
- **Pendiente (decisión del propietario: se hace al empezar la fase 3, con los exámenes oficiales como referencia):**
  - **Distractores adivinables.** En NUM.SERIE y NUM.CALC, elegir «la opción rodeada de errores de ±1, ±2 o ±10» acierta entre el 53 % y el 75 % con 4 opciones; en COD.CRIPTO de cifras, «la opción que más se parece a las demás» acierta entre el 40 % y el 69 %.
    - El trabajo empezado está en la rama local `fase-2-distractores`. Incluye la prueba común «centro de errores» y el límite de errores genéricos por pregunta, y le faltan errores de la regla a ambos lados en varias familias.
  - En las series que solo suben o solo bajan, el distractor «paso al revés» da un término ya visible. LET.SERIE, nivel 3: «cambias el salto dos veces» puede repetir la última letra.
  - VER.ORDEN, preguntas de «puesto N»: la correcta está en el medio alfabéticamente un 67–70 % de las veces en los niveles 2 y 3.
  - Variedad baja en LET.SERIE, nivel 3 (52 enunciados distintos por cada 1.000 semillas).
  - **Hasta resolverlo, las preguntas no se muestran a opositores (fase 4).**
- **Debe hacer el propietario:** decidir quién revisa las 120 muestras de `docs/muestras/` y marcar las casillas «Revisada».

**2026-11-12 · Fase 3**

- **Hecho:**
  - **Perfil `guardia-civil-2026`:** 80 preguntas, 55 minutos, 4 opciones, escala 0-30 y mínimo de 12, con la fórmula de la base 7.3 (BOE-A-2026-9982). Cada dato cita su apartado.
  - **Proporción de tipos pendiente:** la Guardia Civil no publica el cuestionario de aptitudes, solo la plantilla de respuestas (`packages/engine/profiles/analysis/guardia-civil-2026.md`).
  - **Validador de perfiles:** un dato con valor sin fuente oficial, o un dato nulo que no esté en `pendiente`, hace fallar las pruebas.
  - **Puntuación (`score.ts`):** casos calculados a mano; la nota negativa se muestra sin recortar.
  - **Rediseño de distractores, pendiente de la fase 2:**
    - el montaje sortea la familia y el puesto de la correcta una vez por pregunta;
    - como mucho dos errores genéricos;
    - sin la correcta en el centro de los errores;
    - sin opciones visibles ni en sentido contrario;
    - en los códigos, sin la pista de «la que más se parece a las demás».
  - **Generadores:** versión 4, salvo las series numéricas, que van en la 3. 198 pruebas del motor, también en estrés.
- **Revisiones:**
  - `verificador-fase`: el código cumple el criterio de aceptación; la revisión del propietario no es verificable aquí.
  - `revisor-contenido`:
    - **Perfil:** correcto contra el BOE y la plantilla oficial.
    - **1 bloqueante, corregido:** el texto «sumas/restas la diferencia» invertido en las reglas de tres, ahora con prueba.
    - **Corregidos además:** una opción que repetía la última letra en las series de letras, las palabras con tilde mostradas sin ella, los porcentajes con punto decimal, la cita del PDF corregido de plantillas y varios textos desfasados.
- **Pendiente (importantes del revisor, anotados con su motivo):**
  - **Nuevas pistas para adivinar, más sutiles:**
    - la correcta en el punto medio de dos opciones a la misma distancia (multiplicación del nivel 1, diferencias de segundo orden, reglas de tres; 40-60 %);
    - en porcentajes, la opción que tiene su doble o su mitad entre las opciones (57-62 %);
    - en los códigos de cifras, un patrón en los distractores de dos errores (51-73 %).
  - **Motivo:** cada arreglo de una pista ha hecho aparecer otra. Lo eficaz es validar con opositores reales (decisión del propietario) y añadir cada estrategia que se detecte a la batería común. Se retoma antes de la beta.
  - **Series de letras:** muchos distractores son «cuentas una o dos letras de más o de menos».
  - **Variedad baja en las series de letras:** 162, 167 y 52 enunciados distintos por cada 1.000 semillas en los niveles 1 a 3. Es una limitación del alfabeto de 27 letras, ya anotada en `docs/decisiones.md`.
- **Debe hacer el propietario:**
  - revisar el perfil contra el BOE y marcar la casilla de `packages/engine/profiles/analysis/guardia-civil-2026.md`;
  - decidir si escribe a la Jefatura de Enseñanza.

**2026-11-12 · Fase 4 · T1 (en curso)**

- **Hecho:** modelo de sesión y reparto de práctica en el motor (`packages/engine/src/session/plan.ts`). Reparto equitativo para el simulacro y prioritario por fallos para la práctica; semillas no repetidas (CON-02). 7 pruebas en verde.
- **Pendiente de la fase:** T2 a T11 según `docs/planes/fase-4.md`.

**2026-11-12 · Fase 4 · T2**

- **Hecho:** estado del simulacro en el motor (`packages/engine/src/exam/state.ts`): tiempo por marcas de reloj, cierre automático al agotarse, respuestas en blanco, marcar para revisar y navegación. Inmutable. Pruebas en verde.
- **Pendiente de la fase:** T3 a T11.

**2026-11-12 · Fase 4 · T3**

- **Hecho:** explicación de cada pregunta, error de la opción elegida y truco (`packages/engine/src/review/review.ts`); desglose por tipo y aptitud, cuadrado con `score()`, y aptitud a reforzar. Pruebas en verde.
- **Pendiente de la fase:** T4 a T11.

**2026-11-12 · Fase 4 · T4**

- **Hecho:** hook `useExamClock` (`apps/mobile/src/hooks/use-exam-clock.ts`): recalcula con el reloj cada segundo y al volver a primer plano; recibe el estado del simulacro (no inicio y duración, como decía el plan) para no repetir la lógica del motor. La app depende de `@aptiq/engine`. Pruebas en verde.
- **Pendiente de la fase:** T5 a T11. Pendiente en dispositivo: pasar el móvil a segundo plano 2 minutos y comprobar el cronómetro.
