# Progreso

Lo actualiza Claude Code al terminar cada tarea y en `/cerrar-fase`. El propietario aprueba cada fase antes de pasar a la siguiente.

| Fase | Estado | Rama / PR | Cerrada | Aprobada por el propietario |
| --- | --- | --- | --- | --- |
| 0 · Base del proyecto | En curso: CI en verde ([ejecución](https://github.com/javierOllerSanchez/aptiq-app/actions/runs/43120389658)); falta prueba en iPhone | `fase-0-base` | | |
| 1 · Sistema de diseño en código | Pendiente | | | |
| 2 · Motor de contenido v1 | Pendiente | | | |
| 3 · Perfil de examen y puntuación | Pendiente | | | |
| 4 · Práctica y simulacro sin conexión | Pendiente | | | |
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
- **Queda:**
  - subir la rama y ver la CI en verde en GitHub;
  - `/cerrar-fase 0`.
- **Debe comprobar el propietario:** abrir la app en Expo Go en su iPhone (`pnpm --filter mobile start` y escanear el código QR).
- **Notas para fases siguientes:**
  - iconos y pantalla de arranque siguen siendo los de Expo; se sustituirán por `docs/marca/icono-app.svg` antes de la beta;
  - `test:stress` aún no hace nada (fase 2);
  - el perfil `development` de `eas.json` necesitará `expo-dev-client` el día que se haga la primera compilación de desarrollo.
