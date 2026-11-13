# Plan · Fase 4 · Práctica y simulacro sin conexión

**Rama:** `fase-4-practica` (desde `main`, con la fase 3 fusionada).
**Requisitos:** ONB-01, ONB-02, ENT-01, ENT-02, SIM-01, SIM-02, SIM-03, EXP-01–03, RES-01–03, PRO-01, PRO-02, CON-03, NFR-01–04.
**Skills:** `aptiq-design-system` (manda), `expo-router`, `expo-data-fetching`, `animate-expo`, `review-animations` (a mano, ver decisiones), `ui-ux-pro-max`, Impeccable (`critique`, `audit`, `polish`), `design:ux-copy`, `design:accessibility-review`.
**Estado:** aprobado por el propietario el 2026-11-12 con las opciones propuestas: 1a (práctica con aviso de preguntas en revisión), test de nivel orientativo, Maestro en Android por Claude y en iPhone por el propietario, y cuentas en la fase 5.

## Qué ya existe y se reutiliza

- Motor: 6 generadores y solucionadores (`packages/engine`), perfil `guardia-civil-2026` con validador, puntuación `score()`.
- UI: 13 piezas en `packages/ui` (`OptionBubble`, `ProgressTicks`, `LevelBubbles`, `GlassCard`, `TabBar`, `Stamp`, `SourceNote`, `PaperBackground`…).
- App: solo pantallas provisionales (`apps/mobile/src/app/index.tsx`, `catalogo.tsx`).
- No existen todavía: base de datos, Maestro, pantallas de producto, cronómetro.

## Principios de la fase

- **Motor primero.** Toda la lógica de sesión, simulacro, cronómetro lógico y puntuación se prueba en `packages/engine` (TypeScript puro, sin `Date.now` ni `Math.random`). La app solo pinta y guarda.
- **Tiempo por marcas.** El motor recibe instantes (`ms`) desde fuera; la app los toma con `Date.now()` en su capa, nunca el motor (NFR-03).
- **Nada se inventa.** Las preguntas salen del generador con su semilla; el perfil cita su fuente; lo no confirmado se muestra como «Pendiente de confirmar».
- **Sin cuenta.** Todo se guarda en local (SQLite). La sincronización es la fase 5.

## Global Constraints

- Simulacro de Guardia Civil: **80 preguntas, 55 minutos, 4 opciones, penalización Y/T/N de la base 7.3** (valores del perfil, no escritos a mano).
- Texto y títulos en español de España, tuteo, sin emojis ni exclamaciones (`aptiq-design-system`).
- Un solo protagonista amarillo por pantalla; cristal solo en barra de navegación, cronómetro y tarjetas de resumen.
- Solo tokens de `packages/tokens` y `packages/ui`; ningún color, tamaño o radio escrito a mano.
- Zonas táctiles ≥ 44; texto dinámico sin cortar; VoiceOver y TalkBack.
- Tras cada tarea: ESLint del archivo, pruebas relacionadas, comprobación de tipos y commit en español.

## Tareas

### T1 · Modelo de sesión y mezcla de práctica (ENT-01, ENT-02, CON-02)

- **Archivos:** `packages/engine/src/session/plan.ts`, `packages/engine/src/session/plan.test.ts`.
- **Interfaces:**
  - Produces: `buildPractice(input: { profile: ExamProfile; aptitude?: TypeCode; count: number; seeds: ReadonlySet<number>; weakness: Record<TypeCode, number> }): PracticeItemSpec[]` donde `PracticeItemSpec = { type: TypeCode; level: Level; seed: number }`.
- **Qué hace:** elige tipo y nivel, reparte por tipo (aptitud o mezcla) y evita semillas ya usadas por el mismo usuario (CON-02). ENT-02 prioriza los tipos con más fallos, sin dejar a cero los demás.
- **Verificación:** prueba con semillas ya usadas (no se repiten); con `aptitude` solo sale ese tipo; la mezcla de simulacro reparte a partes iguales. Sin `Math.random`.

### T2 · Simulacro: estado y navegación (SIM-01, SIM-02, SIM-03)

- **Archivos:** `packages/engine/src/exam/state.ts`, `packages/engine/src/exam/state.test.ts`.
- **Interfaces:**
  - Produces: `createExam(items, now: number, durationMs: number)`, `answer(state, index, option, now)`, `mark(state, index)`, `goTo(state, index)`, `finish(state, now)`, `remainingMs(state, now): number`.
- **Qué hace:** respuestas, en blanco, marcar para revisar; el tiempo restante es `durationMs − (now − startedAt)`, nunca un contador (NFR-03). Al llegar a 0 se cierra solo.
- **Verificación:** casos con `now` fijado: pausa en segundo plano simulada (salto de `now` de 10 min) no pierde tiempo; cierre automático; navegar no cambia respuestas.

### T3 · Explicaciones y resultado (EXP-01–03, RES-01–03)

- **Archivos:** `packages/engine/src/review/review.ts`, `packages/engine/src/review/review.test.ts`.
- **Interfaces:**
  - Produces: `reviewOf(item: Item, answer: number | null): { correct: boolean; blank: boolean; explanation: Explanation; wrongReason?: string; trick: string }` y `breakdown(results): { byAptitude; byType; weakest }`.
- **Qué hace:** da la explicación paso a paso, el error de la opción elegida y el truco (EXP-02, EXP-03); desglose por tipo y aptitud con la aptitud a reforzar (RES-02); lista de fallos y en blanco para repasar (RES-03).
- **Verificación:** con un ítem real del generador, la explicación existe para cualquier opción elegida y `breakdown` suma igual que `score()`.

### T4 · Cronómetro en la app (NFR-03, SIM-02)

- **Archivos:** `apps/mobile/src/hooks/use-exam-clock.ts`, prueba `apps/mobile/src/hooks/use-exam-clock.test.tsx`.
- **Interfaces:** consume T2 (`remainingMs`). Produces: `useExamClock(startedAt: number, durationMs: number): number` (ms restantes, actualiza con `AppState` y un temporizador visual).
- **Verificación:** prueba con reloj simulado: al volver de segundo plano muestra el tiempo real.
- **Aviso:** la prueba automática no sustituye la prueba en dispositivo (pasar la app a segundo plano 2 min, bloquear el móvil).

### T5 · Base de datos local (CON-03, NFR-01)

- **Archivos:** `apps/mobile/src/data/schema.ts` (Drizzle), `apps/mobile/src/data/db.ts`, `apps/mobile/src/data/repository.ts`, prueba del repositorio.
- **Tablas:** `usuario` (oposición, fecha prevista), `sesion` (tipo, nivel, semilla, respuestas), `intento_simulacro`, `semilla_usada`.
- **Dependencias nuevas:** `expo-sqlite`, `drizzle-orm` (ambas del stack, se anotan en `docs/decisiones.md` con la versión de SDK 58). Prueba del repositorio con un adaptador en memoria; el acceso real se comprueba en dispositivo.
- **Verificación:** migración aplica en limpio; guardar y leer una sesión devuelve lo mismo; `semilla_usada` impide repetir.

### T6 · Onboarding y test de nivel (ONB-01, ONB-02)

- **Archivos:** `packages/engine/src/level/estimate.ts` + prueba; pantallas `apps/mobile/src/app/onboarding/*.tsx`.
- **Interfaces:** Produces: `estimateLevels(results): Record<TypeCode, 1|2|3|4|5 | null>` y `estimateGlobal(...)`.
- **Qué hace:** elegir oposición (solo Guardia Civil) y fecha; test de 10 minutos con preguntas de los 6 tipos; estima nivel por aptitud.
- **Aviso:** la estimación se presenta como orientativa. Con 10 minutos el número de preguntas por tipo es corto; ver decisión 2.
- **Verificación:** casos de `estimateLevels` a mano; flujo Maestro `onboarding.yaml`.

### T7 · Pantallas Inicio, Práctica, Simulacro, Resultado, Repasar (ENT-01, ENT-02, SIM-01–03, RES-01–03)

- **Archivos:** `apps/mobile/src/app/(tabs)/_layout.tsx`, `apps/mobile/src/app/(tabs)/inicio.tsx`, `practica/[aptitud].tsx`, `simulacro/index.tsx`, `simulacro/[id].tsx`, `resultado/[id].tsx`, `repasar/[id].tsx`; componentes nuevos solo si faltan en `packages/ui`.
- **Referencia visual:** `docs/prototipos/inicio.html`, `simulacro.html`, `resultado.html`. Captura comparada en el simulador/dispositivo antes de dar la pantalla por terminada.
- **Textos:** `design:ux-copy` con las reglas de `aptiq-design-system` (sección Tono).
- **Animación:** solo la de avance de `ProgressTicks` (decisión tomada) y transición de tarjeta de pregunta con `animate-expo` (150–250 ms, sin rebote en simulacro).
- **Verificación:** `pnpm typecheck`, pruebas de componentes con Testing Library; `revisor-interfaz` sin hallazgos graves.

### T8 · Modo avión y arranque (NFR-01, NFR-02)

- **Qué hace:** la app funciona sin red desde el primer arranque; comprobación de arranque < 2 s y pregunta nueva < 100 ms en un móvil de gama media.
- **Verificación:** Maestro con el móvil en modo avión (flujo `simulacro-offline.yaml`); medición del arranque en release y nota en `docs/progreso.md`.

### T9 · Flujos Maestro (criterio de aceptación)

- **Archivos:** `apps/mobile/.maestro/onboarding.yaml`, `practica.yaml`, `simulacro-offline.yaml`, `repasar.yaml`.
- **Verificación:** los cuatro en verde en Android (emulador) y, si el propietario lo facilita, en iPhone.

### T10 · Accesibilidad y revisión de interfaz (NFR-04)

- **Qué hace:** texto dinámico al 200 %, etiquetas de VoiceOver/TalkBack, zonas ≥ 44.
- **Verificación:** `design:accessibility-review`, `revisor-interfaz` (Impeccable `audit`, `critique`, `polish` como criterio).

### T11 · Cierre

- `verificador-fase` (criterio de aceptación de `docs/plan-fases.md`).
- `revisor-contenido` sobre la explicación y el truco mostrados (EXP-01–03).
- Actualizar `docs/progreso.md` y `docs/decisiones.md`.
- `/cerrar-fase 4`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo se comprueba | Quién |
| --- | --- | --- |
| Simulacro completo de Guardia Civil en modo avión | Maestro `simulacro-offline.yaml` | Claude (Android) / **tú** (iPhone) |
| Cronómetro fiable tras pasar a segundo plano | Prueba de T2 y T4 + prueba manual en el móvil | Claude + **tú** |
| Flujos de Maestro en verde | T9 | Claude |
| `revisor-interfaz` sin hallazgos graves | T10 | Claude |

## Decisiones que necesito de ti

1. **Bloqueo heredado de la fase 2 (lo más importante).** Lo anotaste: «Hasta resolverlo, las preguntas no se muestran a opositores (fase 4)». En la fase 3 aprobaste validar los distractores con opositores reales en la beta. Esta fase muestra preguntas. Propongo:
   - **a)** seguir con los generadores actuales y avisar en la app, durante la beta, de que la práctica está en revisión (recomendado);
   - **b)** no mostrar práctica hasta que se resuelvan las pistas pendientes (esta fase quedaría sin contenido real).
   - Elige a o b.
2. **Test de nivel de 10 minutos.** No hay datos oficiales de cuántas preguntas por tipo ni de cómo se puntúa. Propongo una estimación simple: aciertos por tipo sobre preguntas de niveles 1 a 3, con el resultado marcado como «orientativo». Confirma o indica otra.
3. **Maestro en iPhone.** Maestro en Android con emulador lo puedo montar yo. En iPhone necesita un Mac y el móvil; propongo que tú ejecutes esa parte en tu iPhone y yo dejo los flujos listos. ¿De acuerdo?
4. **Fuera de esta fase:** registro, cuentas y sincronización de resultados (ONB-03, NFR-01 en la nube) van a la fase 5. Aquí todo queda en el móvil.

## Notas

- `docs/progreso.md` tiene una modificación sin confirmar que viene de `main`; se incluirá en el primer commit de la fase.
- Dependencias nuevas (`expo-sqlite`, `drizzle-orm`) se anotarán en `docs/decisiones.md`.
- Si el plan crece al implementarlo, se parte la fase en 4a (motor y datos) y 4b (pantallas).
