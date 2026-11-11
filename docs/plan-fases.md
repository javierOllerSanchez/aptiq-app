# Aptiq — Plan de fases para Claude Code

Diez fases. Cada una termina con algo que funciona y se puede probar. **La siguiente fase no empieza hasta cumplir el criterio de aceptación de la anterior** y hasta que el propietario lo confirme.

Cómo se trabaja cada fase:

1. `/fase N`: carga esta ficha, los requisitos que cubre y las skills que le tocan.
2. Plan escrito (skill `brainstorming` / `writing-plans` de Superpowers) y confirmación del propietario antes de tocar código.
3. Rama `fase-N-<nombre>`, commits pequeños, pruebas primero en el motor.
4. `/cerrar-fase N`: verificación independiente, revisión Ponytail, revisión de interfaz si hay pantallas, actualización de `docs/progreso.md` y pull request.

---

## Fase 0 · Base del proyecto

**Objetivo:** monorepo listo para trabajar, con calidad automática desde el primer commit.

**Skills:** `expo-overview`, `expo-project-structure` (plugin de Expo), Superpowers (`writing-plans`, `verification-before-completion`), `aptiq-design-system` (solo para los tokens).

**Tareas:**

1. Instalar las skills y plugins de terceros con `scripts/instalar-skills.sh` y los pasos de `docs/skills-terceros.md`. Leer cada `SKILL.md` antes de activarlo y anotar en `docs/skills-lock.md` el repositorio y el commit instalado.
2. Monorepo pnpm + Turborepo:
   ```
   apps/mobile        app Expo (Expo Router, TypeScript)
   packages/engine    motor de contenido (TypeScript puro, sin dependencias de React)
   packages/tokens    tokens de diseño (TypeScript puro), generados desde docs/tokens.json
   packages/ui        componentes React Native (vacío en esta fase, con su configuración)
   ```
   `apps/admin` NO se crea hasta la fase 8.
3. Configuración común: TypeScript estricto (`tsconfig.base.json`), ESLint (flat config), Prettier, Vitest en `engine` y `tokens`, jest-expo en `mobile`.
4. Scripts en la raíz: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format`, todos vía Turborepo.
5. App Expo creada con la plantilla oficial actual, con Expo Router, fuentes (Instrument Sans, IBM Plex Mono, Bricolage Grotesque) y una pantalla provisional que use los tokens: fondo papel con cuadrícula y el logotipo SVG.
6. `packages/tokens` exporta los valores de `docs/tokens.json` con tipos; prueba que comprueba que coinciden.
7. GitHub Actions (`.github/workflows/ci.yml`): instalar, typecheck, lint y test en cada push y pull request.
8. `eas.json` con perfiles `development`, `preview` y `production` (sin publicar nada; requiere cuenta de Expo del propietario).
9. Comprobar que los hooks de `.claude/settings.json` funcionan con el monorepo ya creado.

**Requisitos:** NFR-07, NFR-10, NFR-11 (base).

**Criterio de aceptación:**
- `pnpm install && pnpm typecheck && pnpm lint && pnpm test` pasa en limpio.
- La app arranca en iOS y Android (simulador o Expo Go) y muestra la pantalla provisional con fuentes y colores correctos.
- La integración continua pasa en GitHub.
- `docs/skills-lock.md` lista cada skill instalada con su commit.

---

## Fase 1 · Sistema de diseño en código

**Objetivo:** todos los componentes base, idénticos a los prototipos.

**Skills:** `aptiq-design-system` (manda), `expo-design-system`, `ui-ux-pro-max` (solo criterio UX y accesibilidad), `emil-design-eng`, `animate-expo`, Impeccable (`typeset`, `polish`), `design:accessibility-review`.

**Tareas:** en `packages/ui`: `Text` (variantes de la guía), `Button` (principal, secundario, cristal), `OptionBubble` (vacía, marcada, correcta, fallo), `GlassCard`, `TabBar`, `ProgressTicks`, `LevelBubbles`, `Stamp`, `SourceNote`, `PaperBackground`, `Logo`. Pantalla de catálogo en `apps/mobile` (ruta `/catalogo`, solo en desarrollo).

**Requisitos:** NFR-04, NFR-11.

**Criterio de aceptación:**
- El catálogo coincide con `docs/prototipos/sistema.html` (comparar capturas).
- Todos los componentes con etiquetas de accesibilidad, contraste AA y zonas táctiles ≥ 44.
- Pruebas de componentes en verde; `review-animations` aprueba las animaciones.

---

## Fase 2 · Motor de contenido v1

**Objetivo:** generadores fiables con explicación, probados a gran escala.

**Skills:** `aptiq-generator` (manda), Superpowers `test-driven-development`.

**Tareas:** PRNG sembrado, taxonomía, interfaz `Generator`/`Solver`, y generadores de: series numéricas, series de letras, cálculo y porcentajes, códigos y criptogramas, ordenación alfabética, comparación de datos. Cada uno con su solucionador independiente y explicaciones.

**Requisitos:** EXP-01, EXP-02, EXP-03, CON-02, NFR-07, NFR-09.

**Criterio de aceptación:**
- 10.000 preguntas por tipo y nivel sin ninguna con dos respuestas válidas.
- Cada explicación reproduce la solución; cada distractor tiene su error explicado.
- Determinismo comprobado. Subagente `revisor-contenido` sin hallazgos graves.
- Una muestra de 20 preguntas por tipo exportada a `docs/muestras/` para revisión humana.

---

## Fase 3 · Perfil de examen y puntuación

**Skills:** `aptiq-exam-profile` (manda).

**Tareas:** esquema de perfil con validación, perfil `guardia-civil-<año>` desde las bases del BOE vigentes y los cuestionarios publicados (datos sin fuente → `pendiente`), análisis de proporción de tipos en `profiles/analysis/`, cálculo de nota con penalización y nota mínima.

**Requisitos:** CON-01, SIM-01, RES-01, RES-04, NFR-08.

**Criterio de aceptación:** pruebas de puntuación con casos calculados a mano; cada dato del perfil con su fuente o marcado como pendiente; el propietario revisa el perfil.

---

## Fase 4 · Práctica y simulacro sin conexión

**Skills:** `aptiq-design-system`, `expo-router`, `expo-data-fetching`, `animate-expo`, `review-animations`, `ui-ux-pro-max`, Impeccable (`critique`, `audit`, `polish`), `design:ux-copy`, `design:accessibility-review`.

**Tareas:** pantallas Inicio, Práctica por aptitud, Simulacro, Resultado y Repasar fallos (prototipos en `docs/prototipos/`), SQLite con Drizzle, cronómetro basado en marcas de tiempo, onboarding (oposición, fecha, test de nivel).

**Requisitos:** ONB-01, ONB-02, ENT-01, ENT-02, SIM-01, SIM-02, SIM-03, EXP-01–03, RES-01–03, PRO-01, PRO-02, CON-03, NFR-01–04.

**Criterio de aceptación:** simulacro completo de Guardia Civil en modo avión, de principio a fin, con cronómetro fiable tras pasar a segundo plano; flujos de Maestro en verde; subagente `revisor-interfaz` sin hallazgos graves.

---

## Fase 5 · Cuentas y sincronización

**Skills:** Supabase Postgres Best Practices, `expo-data-fetching`.

**Tareas:** proyecto Supabase en la UE (con el propietario), esquema con migraciones, RLS en todas las tablas, inicio de sesión con Apple, Google y email, sincronización del historial desde la cola local, borrado de cuenta y exportación de datos.

**Requisitos:** ONB-03, PRO-02, SOP-02, NFR-05, NFR-06.

**Criterio de aceptación:** el progreso aparece en un segundo dispositivo; el borrado elimina todos los datos; ninguna tabla sin RLS (comprobado con los avisos de seguridad de Supabase).

---

## Fase 6 · Progreso y adaptativo

**Tareas:** nivel estimado por aptitud y tipo, Sesión de hoy, dificultad adaptativa, repetición espaciada, recordatorios.

**Requisitos:** ENT-02, ENT-03, PRO-01, PRO-03, REP-01, NOT-01.

**Criterio de aceptación:** con historiales simulados, la Sesión de hoy prioriza el tipo más flojo y la dificultad sube y baja como se espera.

---

## Fase 7 · Pago

**Tareas:** RevenueCat (`react-native-purchases`), productos y pases, muro de pago tras el primer simulacro, límites del plan gratuito, restaurar compras.

**Requisitos:** PAY-01, PAY-02, PAY-03.

**Criterio de aceptación:** compra, renovación, cancelación y restauración probadas en los entornos de prueba de ambas tiendas.

---

## Fase 8 · Contenido ampliado y panel interno

**Tareas:** generadores espaciales en SVG (giros, series de figuras, cubos), preguntas verbales con flujo de aprobación, `apps/admin` (Next.js sobre Supabase), reporte de errores con semilla.

**Requisitos:** ADM-01, ADM-02, ADM-03, SOP-01, EXP-04, CON-04.

**Criterio de aceptación:** ninguna verbal se publica sin aprobación; los reportes llegan al panel con la semilla y la pregunta se reproduce.

---

## Fase 9 · Beta y lanzamiento

**Skills:** `eas-app-stores`, `eas-workflows`, `eas-observe`, Taste (solo web de lanzamiento), `design:accessibility-review`.

**Tareas:** beta cerrada (TestFlight y prueba interna de Google Play), analítica PostHog con consentimiento, primera calibración, fichas de tienda, política de privacidad, aviso legal y de independencia, web de lanzamiento.

**Criterio de aceptación:** beta con opositores reales, sin errores graves abiertos, revisión legal hecha.
