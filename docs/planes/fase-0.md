# Plan · Fase 0 · Base del proyecto

**Rama:** `fase-0-base` (creada desde `main`).
**Requisitos:** NFR-07 (calidad automática), NFR-10 (iOS 16+ / Android 9+), NFR-11 (sistema visual, solo la base).
**Estado:** propuesto, pendiente de confirmación del propietario.

## Punto de partida (comprobado el 2026-11-12)

| Elemento | Estado |
| --- | --- |
| Node | 24.18.1 (≥ 20) |
| pnpm | 9.15.9 |
| git | 2.55 |
| Claude Code | 2.1.284 |
| Android SDK | Instalado, con emulador e imágenes de sistema (no está en el PATH; se usa por ruta) |
| iOS | Windows no tiene simulador de iOS: se prueba con **Expo Go en un iPhone** |
| Repositorio | `javierOllerSanchez/aptiq-app` en GitHub, **público** |
| Versiones actuales | Expo SDK 58, Turborepo 2.11. Se usan las versiones que fija la plantilla oficial de Expo (`npx expo install`), no «la última» de cada paquete |

Tarea 1 del plan de fases (skills y plugins de terceros) **ya está hecha**: ver `docs/skills-lock.md`.

## Tareas

Cada tarea termina en un commit pequeño en español.

### T1 · Esqueleto del monorepo
- **Archivos:** `package.json` (raíz, `packageManager: pnpm@9.15.9`, `engines.node >= 20`), `pnpm-workspace.yaml`, `turbo.json`, `.npmrc` (lo que pida Expo para pnpm), `.gitignore`, `.nvmrc`.
- **Scripts raíz** (todos vía Turborepo): `typecheck`, `lint`, `test`, `test:stress`, `format`.
- **Verificación:** `pnpm install` termina sin errores.

### T2 · Configuración común
- **Archivos:** `tsconfig.base.json` (estricto), `eslint.config.mjs` (flat config única para todo el repo), `.prettierrc`.
- **Verificación:** `pnpm lint` y `pnpm typecheck` en verde con los paquetes vacíos.

### T3 · `packages/tokens` (NFR-11)
- **Archivos:** `packages/tokens/src/index.ts` con los valores de `docs/tokens.json` y sus tipos (`as const`), y `src/index.test.ts` (Vitest).
- La prueba compara el objeto exportado con `docs/tokens.json`: si alguien cambia uno sin el otro, falla.
- **Verificación:** `pnpm --filter @aptiq/tokens test` en verde; modifico un valor a propósito y compruebo que la prueba falla.

### T4 · `packages/engine` y `packages/ui` (vacíos, con configuración) (NFR-07)
- `engine`: TypeScript puro, sin React, con Vitest + fast-check preparados. Una regla de ESLint que prohíbe `Math.random` y `Date.now` en `packages/engine` (lo exige el `CLAUDE.md`; mejor que la máquina lo vigile desde hoy).
- `ui`: solo `package.json` y `tsconfig.json`; sus componentes llegan en la fase 1.
- **Verificación:** `pnpm test` en verde; un `Math.random()` de prueba en `engine` hace fallar `pnpm lint`.

### T5 · App Expo en `apps/mobile` (NFR-10, NFR-11)
- Creada con la plantilla oficial actual (`create-expo-app`, Expo Router, TypeScript). Se quitan las pantallas de ejemplo.
- Fuentes Instrument Sans, IBM Plex Mono y Bricolage Grotesque (paquetes `@expo-google-fonts/*`, licencia libre OFL).
- **Pantalla provisional:**
  - fondo `paper` con cuadrícula de 24 px en `ink` al 4,5 % (react-native-svg);
  - el logotipo SVG oficial de `docs/marca/logo-aptiq.svg`, sin recrearlo;
  - una línea de texto en cada fuente;
  - todo con valores de `@aptiq/tokens`, ninguno a mano.
- jest-expo + Testing Library con una prueba que renderiza la pantalla.
- Versión mínima: iOS 16 y Android 9 (API 28) en la configuración.
- **Verificación:**
  - `pnpm --filter mobile start`;
  - captura en el emulador de Android, comparada con `docs/prototipos/sistema.html` (colores y fuentes);
  - **tú** la abres en Expo Go en el iPhone.

### T6 · Integración continua
- **Archivo:** `.github/workflows/ci.yml`: instalar, typecheck, lint y test en cada push y pull request.
- **Verificación:** la ejecución en GitHub sale en verde. **Requiere subir la rama a GitHub** (`git push`): te lo pediré antes.

### T7 · `eas.json`
- Perfiles `development`, `preview` y `production`. Solo el archivo: no se enlaza a ninguna cuenta ni se compila nada.
- **Verificación:** el JSON es válido. El enlace con tu cuenta de Expo queda para cuando la crees.

### T8 · Hooks con el monorepo ya creado
- Edito un archivo con un error de ESLint y compruebo que `post-edit.sh` lo detecta.
- Edito un archivo del motor y compruebo que lanza sus pruebas.
- Dejo un error de tipos y compruebo que `stop-check.sh` lo bloquea.
- **Verificación:** las tres comprobaciones dan el resultado esperado. Las anoto en `docs/progreso.md`.

### T9 · Documentación y cierre
- Actualizo `docs/progreso.md` y anoto en `docs/decisiones.md` las dependencias nuevas que no están en la lista del stack: paquetes de fuentes y Prettier.
- Después, `/cerrar-fase 0`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo lo compruebo | Quién |
| --- | --- | --- |
| `pnpm install && pnpm typecheck && pnpm lint && pnpm test` en limpio | Lo ejecuto y copio la salida | Claude |
| La app arranca en Android con la pantalla provisional, con las fuentes y los colores correctos | Captura del emulador | Claude |
| La app arranca en iOS | Expo Go en tu iPhone | **Tú** |
| La integración continua pasa en GitHub | Ejecución de Actions en verde | Claude, tras tu permiso para hacer `push` |
| `docs/skills-lock.md` lista cada skill con su commit | Ya hecho | — |

## Lo que queda fuera (a propósito)

- `apps/admin`: llega en la fase 8.
- Componentes de `packages/ui`: llegan en la fase 1.
- `test:stress` existe como script, pero no hace nada hasta que haya generadores (fase 2).
- Enlazar el proyecto con EAS, Sentry, PostHog o Supabase: se hace cuando tengas las cuentas.

## Decisiones que necesito de ti

1. **Logotipo:** uso la versión por defecto del kit, con la **p** marcada, salvo que prefieras la alternativa del punto de la i. La pantalla provisional es fácil de cambiar después.
2. **Repositorio público:** ahora mismo cualquiera puede ver el plan de negocio, los precios y el código. ¿Lo pasamos a privado? Lo cambias tú en GitHub, en *Settings › General › Danger Zone*.
3. **Permiso para hacer `push`** de la rama `fase-0-base` cuando llegue a T6, para que se ejecute la integración continua.
4. **Móvil para probar:** ¿tienes iPhone, Android o ambos? Expo Go se instala gratis desde la tienda.
