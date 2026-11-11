# Progreso

Lo actualiza Claude Code al terminar cada tarea y en `/cerrar-fase`. El propietario aprueba cada fase antes de pasar a la siguiente.

| Fase | Estado | Rama / PR | Cerrada | Aprobada por el propietario |
| --- | --- | --- | --- | --- |
| 0 · Base del proyecto | Cerrada (prueba en iPhone pendiente del propietario) | `fase-0-base` · PR #1 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 1 · Sistema de diseño en código | Plan propuesto | `fase-1-sistema-diseno` | | |
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
