# Progreso

Lo actualiza Claude Code al terminar cada tarea y en `/cerrar-fase`. El propietario aprueba cada fase antes de pasar a la siguiente.

| Fase | Estado | Rama / PR | Cerrada | Aprobada por el propietario |
| --- | --- | --- | --- | --- |
| 0 · Base del proyecto | Cerrada (prueba en iPhone pendiente del propietario) | `fase-0-base` · PR #1 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 1 · Sistema de diseño en código | Cerrada (VoiceOver en iPhone y `/review-animations` pendientes del propietario) | `fase-1-sistema-diseno` · PR #2 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 2 · Motor de contenido v1 | Cerrada (rediseño de distractores pendiente para el inicio de la fase 3) | `fase-2-motor` · PR #3 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 3 · Perfil de examen y puntuación | Cerrada | `fase-3-perfil` · PR #4 fusionado | 2026-11-12 | Sí, 2026-11-13 |
| 4 · Práctica y simulacro sin conexión | Fusionada; pendiente de pruebas en móvil real y de la última pasada de Maestro | `fase-4-practica` · PR #5 fusionado | 2026-11-13 | No |
| 5 · Cuentas y sincronización | Pendiente | | | |
| 6 · Progreso y adaptativo | Pendiente | | | |
| 7 · Pago | Pendiente | | | |
| 8 · Contenido ampliado y panel interno | Pendiente | | | |
| 9 · Beta y lanzamiento | Pendiente | | | |

## Registro

**2026-11-13 · Fase 4 · Fusión**

- PR #5 fusionado en `main`. Decisiones del propietario aplicadas: identificador `com.javioller.aptiq`; PRO-02 a la fase 5; PRO-01 a la fase 6; T8 / NFR-02 aplazado a la beta.
- Pendiente antes de aprobar la fase: última pasada de Maestro sobre el código final; cronómetro con la pantalla bloqueada; cerrar la app a mitad de simulacro; VoiceOver y TalkBack; Maestro en iPhone; diseño de Inicio y Resultado; texto de `SourceNote` en la guía y el prototipo.
- No aprobada por el propietario.

**2026-11-13 · Fase 3 · Aprobación**

- El propietario aprueba la fase 3 y su perfil `guardia-civil-2026`.
- Pendiente de la fase 3 que no bloquea el cierre: escribir a la Jefatura de Enseñanza sobre los tipos de la prueba de aptitudes, y las pistas de distractores ya anotadas.

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

**2026-11-12 · Fase 4 · T5**

- **Hecho:** almacenamiento local: contrato `Store` (ajustes, semillas usadas, sesiones, intentos), implementación en memoria para pruebas y la de SQLite con Drizzle (`expo-sqlite` y `drizzle-orm`). Las tablas se crean con SQL al abrir la base, sin drizzle-kit por ahora. 4 pruebas del contrato en verde.
- **Pendiente en dispositivo (T9):** la implementación de SQLite no se puede probar con Jest (módulo nativo); se comprueba al abrir la app.
- **Dependencias nuevas:** `expo-sqlite` (SDK 58, del stack) y `drizzle-orm` (del stack). Se anotan en `docs/decisiones.md` al cerrar la fase.

**2026-11-12 · Fase 4 · T6 (parcial)**

- **Hecho:** cálculo del nivel orientativo por tipo a partir del test de nivel (`packages/engine/src/level/estimate.ts`): lineal de 1 a 5, sin contar las preguntas en blanco y sin inventar nivel cuando no hay respuestas. 3 pruebas en verde.
- **Pendiente:** las pantallas de onboarding (elegir oposición y fecha, test de 10 minutos) y su flujo de Maestro.

**2026-11-12 · Fase 4 · T6 y T7 (código; sin verificar en dispositivo)**

- **Hecho:**
  - Arranque con redirección: sin oposición va al onboarding, con oposición a Inicio.
  - Onboarding en 3 pasos (oposición, fecha opcional y test de 12 preguntas), con el nivel estimado guardado.
  - Inicio con sesión de hoy, simulacro, práctica por aptitud y el aviso de preguntas en revisión.
  - Práctica con confirmación y explicación (EXP-01 a EXP-03), simulacro con cronómetro y navegación, resultado con la nota del perfil oficial (RES-01, RES-02) y repaso de fallos (RES-03).
  - El paquete de Android se genera sin errores (`expo export`).
  - Lint de la app limpio; 12 pruebas de la app en verde.
- **No verificado aún:**
  - Ninguna pantalla se ha visto en un dispositivo ni comparado con su prototipo (T10).
  - Los flujos de Maestro (T9) no existen.
  - Sesión activa en memoria: si la app se cierra a mitad de práctica se pierde esa sesión.
- **Pendiente de la fase:** T8 (modo avión y medición de arranque), T9, T10 y T11.

**2026-11-12 · Fase 4 · T9 (Maestro en el emulador)**

- **Hecho:**
  - **Compilación release en Windows arreglada.** Pasaba de 260 caracteres en las rutas de CMake. Se resuelve con `node_modules` plano (`.npmrc`) y con un plugin que usa CMake 3.31.6 en Windows.
  - **App instalada** en el emulador Android 37 (`Medium_Phone_API_37.0`).
  - **Flujos de Maestro en verde:**
    - `onboarding.yaml`: oposición, fecha y test de 12 preguntas.
    - `practica.yaml`: 10 preguntas de Numérica, con explicación y truco.
    - `simulacro-offline.yaml`: **simulacro completo de 80 preguntas en modo avión**, pasando por segundo plano, con marca para revisar, entrega, resultado con la fórmula y repaso de fallos.
  - Monorepo: typecheck, lint y pruebas en verde (221 del motor, 15 de `ui` y 15 de la app).
- **Límite:** Maestro no lee el cronómetro con precisión. La exactitud tras pasar a segundo plano la cubre la prueba de `use-exam-clock`.
- **Pendiente:**
  - T8: medir el arranque en un móvil de gama media.
  - T10: comparar con los prototipos y revisar accesibilidad.
  - T11: cierre.
  - Que el propietario confirme el identificador de la app.

**2026-11-12 · Fase 4 · T10 (prototipos, accesibilidad y `revisor-interfaz`)**

- **Revisión:** `revisor-interfaz` encontró 7 problemas graves y 13 importantes. **Graves, todos corregidos:**
  1. **Dejar en blanco (SIM-02):** `clear()` en el motor, con prueba, y botón en el simulacro.
  2. **Fórmula visible (RES-01):** completa y con el resultado, «(0 aciertos − 1 fallo ÷ 3) × 30/80 = −0,13», con el singular y el signo menos tipográfico.
  3. **Desglose (RES-02):** por aptitud y por tipo, con el total real (incluidas las de en blanco) y porcentaje; la aptitud a reforzar en rojo.
  4. **Nivel estimado:** se muestra en Inicio, marcado como orientativo.
  5. **Salida del simulacro:** pide confirmación con el botón cerrar, con Atrás de Android y al entregar (dice cuántas quedan en blanco y cuántas marcadas); sin gesto de deslizar.
  6. **Campo de fecha:** estilo de texto correcto (`textStyle`) y validación del formato.
  7. **Capturas:** rehechas, a tamaño normal y con el texto al 200 % (`docs/capturas/fase-4-texto-200/`).
- **Importantes corregidos:**
  - márgenes duplicados (ahora 20 de lado);
  - `Timer` de cristal con reloj y anuncio por minutos;
  - tipo de pregunta, penalización, nota de fuente y «Siguiente marcada» en el simulacro;
  - `checked` y `radiogroup` para TalkBack y VoiceOver;
  - fuente «la Guardia Civil» y formato leídos del perfil;
  - repaso con los tres pasos, opciones correcta/fallo y una tarjeta por pregunta;
  - un solo amarillo en Práctica tras corregir;
  - test de nivel con 10 minutos, «No lo sé» y casillas;
  - estados de carga.
- **Al 200 %:** la letra de la burbuja ya no se corta (tamaño fijo, como un icono) y el nombre del tipo ya no se parte a mitad de palabra.
- **Verificado:**
  - los 4 flujos de Maestro en verde en el emulador (el simulacro llega a la pregunta 80 y entrega en modo avión);
  - typecheck, lint y pruebas en verde: 224 del motor, 18 de `ui` y 15 de la app.
- **Pendiente de decidir por el propietario (importantes que cambian la estructura):**
  - barra de pestañas y filas de lista (`ListRow`) en Inicio;
  - marca visible en las casillas de progreso;
  - composición exacta de Resultado (nota con «/ 30» y sello al lado) y barras por aptitud;
  - cuál es el botón amarillo de Inicio: he seguido el prototipo («Empezar simulacro»).
- **Para revisar el propietario:** `SourceNote` dice «exámenes publicados por la Guardia Civil», pero la Guardia Civil solo publica la plantilla de respuestas de aptitudes, no el cuestionario.

**2026-11-12 · Fase 4 · Cierre (en curso; subido a GitHub para seguir desde otro equipo)**

- **Revisiones del cierre:**
  - `verificador-fase`, primera pasada: «no lista». Bloqueantes:
    - segunda pasada de `revisor-interfaz`: **hecha, sin graves**;
    - NFR-03 al cerrarse la app: **corregido**; el simulacro se guarda tras cada cambio y se retoma con «Continuar simulacro»;
    - prueba del cronómetro en un móvil real: **la hace el propietario**;
    - T8: **pendiente del propietario**;
    - aplazar PRO-01 y PRO-02: **pendiente del propietario**;
    - documentación de cierre: hecha.
  - `revisor-interfaz`, segunda pasada: **ningún grave**. Corregidos los importantes 1, 3, 4 y 6:
    - tarjeta de la pregunta;
    - mismo criterio para «a reforzar» y el porcentaje mostrado;
    - aviso si el test no da para estimar;
    - el veredicto de Práctica se anuncia al lector de pantalla.
  - `revisor-contenido`, primera pasada: 2 bloqueantes, **corregidos**:
    - `SourceNote` ya no habla de «exámenes publicados»: cita BOE-A-2026-9982 y sus bases;
    - aviso visible de que la mezcla de tipos no es oficial.

    Importantes corregidos:
    - enunciados repetidos dentro de un simulacro (CON-02);
    - «a reforzar»;
    - test de nivel;
    - el error de cada opción incorrecta (EXP-02);
    - «3 fallos restan 1 acierto».
  - `revisor-contenido`, segunda pasada: **ningún bloqueante**. Sus 2 importantes nuevos están corregidos: no hay «a reforzar» si todas las aptitudes empatan, y con la mitad de aciertos no se sube de nivel.
  - Ponytail: una sola `LETTERS` y `toSaved`/`fromSaved` compartidos. `Store` se queda (dos implementaciones).
- **Verificado en este equipo:** typecheck, lint, test y `test:stress` en verde (230 del motor, 18 de `ui` y 22 de la app).
- **Sin confirmar todavía:** la última pasada de Maestro con el código final. La anterior pasó los 3 flujos; los flujos se han reforzado con dejar en blanco, segundo plano y cierre de la app a mitad. Para repetirla en otro equipo:
  1. compilar el release (Windows necesita el plugin `with-windows-cmake`, ya incluido);
  2. ejecutar `maestro test apps/mobile/.maestro/onboarding.yaml`, `practica.yaml` y `simulacro-offline.yaml` (los dos últimos lanzan el onboarding solos).
- **Debe decidir el propietario** (lista en `docs/decisiones.md`, «Pendientes»):
  - aplazar PRO-01 y PRO-02;
  - T8 / NFR-02;
  - cambio del texto de `SourceNote` en la guía y el prototipo;
  - diseño de Inicio y Resultado;
  - identificador de la app.
- **Debe probar el propietario en un móvil real:**
  - simulacro con 2 minutos en segundo plano y pantalla bloqueada (el cronómetro baja unos 2 minutos);
  - cerrar la app a mitad de simulacro y volver con «Continuar simulacro»;
  - VoiceOver y TalkBack en las opciones;
  - Maestro en iPhone.
