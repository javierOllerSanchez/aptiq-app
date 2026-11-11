# Aptiq

App móvil (iOS y Android; web en el futuro) para entrenar la prueba de **aptitudes psicotécnicas** de oposiciones en España. Simulacros con el formato oficial y explicación paso a paso de cada pregunta. MVP: **Guardia Civil**.

El propietario del producto no programa a diario: explícale las decisiones en lenguaje claro, en español, y pídele confirmación en los puntos marcados.

## Documentos (leer antes de trabajar)

| Archivo | Qué contiene |
| --- | --- |
| `docs/requisitos.md` | Requisitos con ID (ONB-01, SIM-01…), no funcionales, monetización, riesgos |
| `docs/plan-fases.md` | Las 10 fases, sus tareas, skills y criterio de aceptación |
| `docs/guia-estilos.md` | Sistema visual completo |
| `docs/prototipos/index.html` | Prototipos HTML de referencia (Inicio, Simulacro, Resultado, sistema, logotipo) |
| `docs/tokens.json` | Valores de diseño (fuente única) |
| `docs/marca/` | Logotipo e icono en SVG |
| `docs/progreso.md` | Estado de cada fase (mantenerlo al día) |
| `docs/decisiones.md` | Decisiones tomadas y pendientes |
| `docs/skills-terceros.md` | Skills y plugins externos, y cómo instalarlos |

## Principios de contenido (no negociables)

1. Solo se usan como referencia exámenes **publicados oficialmente** por las instituciones (BOE, cuestionarios y plantillas oficiales).
2. Todas las preguntas son **originales**, generadas desde los patrones de esos exámenes. **Nunca** se copia una pregunta oficial ni se guarda su texto en el repositorio.
3. Toda pregunta lleva **explicación paso a paso**, el error de cada opción incorrecta y un truco de examen.
4. Cada formato de examen **cita su fuente**. Lo que no esté confirmado en una fuente oficial se marca como pendiente; **nunca se inventa**.

## Stack

- Expo (React Native) + Expo Router + TypeScript estricto.
- Monorepo pnpm + Turborepo:
  - `apps/mobile`
  - `apps/admin` (desde la fase 8)
  - `packages/engine` (motor de preguntas, TypeScript puro)
  - `packages/tokens`
  - `packages/ui`
- Estilos con StyleSheet + `packages/tokens`, **sin librería de UI**.
- Estado: Zustand (interfaz) y TanStack Query (servidor).
- Datos locales: expo-sqlite + Drizzle.
- Movimiento: Reanimated, Gesture Handler, expo-haptics. Gráficos: react-native-svg. Cristal: expo-blur.
- Servicios: Supabase en la UE (Auth, Postgres con RLS, funciones), RevenueCat, PostHog (UE), Sentry.
- Pruebas: Vitest + fast-check (motor), jest-expo + Testing Library (componentes), Maestro (flujos completos).
- CI: GitHub Actions + EAS Build, Submit y Update.

Cualquier dependencia nueva fuera de esta lista se justifica y se anota en `docs/decisiones.md`.

## Comandos

```bash
pnpm install
pnpm typecheck      # TypeScript en todo el monorepo
pnpm lint
pnpm test           # incluye 1.000 preguntas por tipo y nivel
pnpm test:stress    # 10.000 por tipo y nivel (cierre de fase y CI nocturna)
pnpm --filter mobile start
```

(Se crean en la fase 0; mantenerlos así.)

## Cómo trabajamos

- **Una fase por sesión**, con `/fase N` para empezar y `/cerrar-fase N` para terminar. No empezar una fase sin la anterior cerrada y aprobada por el propietario.
- **Plan antes de código:** cada fase empieza con un plan en `docs/planes/` que el propietario confirma.
- **Rama** `fase-N-<nombre>` y commits pequeños en español. Pull request al cerrar. Nunca `push --force` ni trabajar directamente en `main`.
- **Pruebas primero en el motor.** Sin pruebas en verde no se toca `packages/engine`.
- **Nada se da por terminado sin evidencia:** pruebas pasando, capturas comparadas con el prototipo y revisión de los subagentes.
- Cada tarea cita los IDs de requisito que cubre.

## Skills: cuál usar y quién manda

**Propias (mandan sobre cualquier otra):**
- `aptiq-design-system`: cualquier pantalla, componente, animación o texto de interfaz.
- `aptiq-generator`: cualquier cambio en generadores o el motor.
- `aptiq-exam-profile`: perfiles de examen y puntuación.

**De terceros, solo como criterio** (ver `docs/skills-terceros.md`):
- Emil Kowalski (`animate-expo`, `emil-design-eng`, `review-animations`).
- UI UX Pro Max e Impeccable (UX, accesibilidad, crítica y pulido).
- Taste (solo la web de lanzamiento).
- Plugin de Expo.
- Superpowers (método).
- Ponytail (código mínimo; nunca quita pruebas, accesibilidad, validaciones ni comportamiento especificado).
- Supabase Postgres Best Practices.

Si una skill de terceros propone colores, fuentes, radios o estilos distintos de la guía, **se ignora**.

## Harness del repositorio

**Hooks:**
- Tras cada edición: ESLint del archivo y pruebas relacionadas si es del motor.
- Antes de terminar un turno: comprobación de tipos si hay cambios en TypeScript.
- Si un hook falla, corrige el error antes de seguir.

**Subagentes:**
- `revisor-contenido`: generadores y perfiles.
- `revisor-interfaz`: pantallas frente a la guía y los prototipos.
- `verificador-fase`: criterio de aceptación, de forma independiente.

**Comandos:** `/fase N`, `/cerrar-fase N`.

## Nunca

- Copiar preguntas de exámenes oficiales o de academias.
- Inventar datos de una oposición (número de preguntas, tiempos, penalización, nota mínima).
- Usar `Math.random` o `Date.now` en el motor.
- Escribir colores, tamaños, radios o fuentes a mano en lugar de usar tokens.
- Leer o subir archivos `.env` o secretos; meter claves en la app.
- Saltarse los hooks, desactivar pruebas (`.skip`) o bajar umbrales para que algo pase.
- Publicar en tiendas, crear cuentas o gastar dinero sin la confirmación del propietario.
