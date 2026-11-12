# Plan · Fase 1 · Sistema de diseño en código

**Rama:** `fase-1-sistema-diseno` (desde `main`, con la fase 0 fusionada).
**Requisitos:** NFR-04 (accesibilidad), NFR-11 (sistema visual).
**Skills:**
- `aptiq-design-system`, que manda;
- `expo-design-system`;
- `ui-ux-pro-max`, solo para criterio de UX y accesibilidad;
- `emil-design-eng` y `animate-expo`;
- Impeccable (`typeset`, `polish`), solo sus guías escritas, sin ejecutar su programa;
- `review-animations`;
- `design:accessibility-review`.

**Estado:** aprobado por el propietario el 2026-11-12 con las opciones por defecto: mandan la guía y `tokens.json`; logotipo con la **p** marcada; siempre el SVG oficial.

## Fuente de verdad cuando no coinciden

He comparado el tablero `docs/prototipos/sistema.html` con la guía, `tokens.json` y los prototipos de pantalla (`inicio.html`, `simulacro.html`, `resultado.html`). Hay diferencias:

| Elemento | `sistema.html` | Guía, tokens y prototipos de pantalla |
| --- | --- | --- |
| Burbuja de opción | 34 | **32** (`size.bubble`) |
| Valor de opción | 20 / 700 | **19 / 600** (700 marcada) |
| Casillas de progreso | 16 de alto | **12** |
| Burbujas de nivel | 18, borde al 28 % | **22**, borde al 25 % (`inicio.html` también usa 22) |
| Cristal | blanco del 72 al 36 % | **del 82 al 55 %** (`tokens.glass`) |
| Sello | girado −9° | **−6°** (`resultado.html` también usa −6°) |

**Propuesta:** mandan la guía y `tokens.json`, que son la fuente única según el `CLAUDE.md`. `sistema.html` se usa para el aspecto general: formas, estados y jerarquía. La comparación de capturas se hace con ese criterio.

## Tareas

Cada componente se hace así:
1. primero su prueba (jest-expo + Testing Library);
2. después el componente, solo con tokens;
3. después su entrada en el catálogo.

Un commit por componente.

### T1 · Preparar `packages/ui` (NFR-11)
- Dependencias, todas con `npx expo install` para que cuadren con el SDK:
  - `react` y `react-native` como dependencias compartidas con la app;
  - `react-native-svg`;
  - `expo-blur` (cristal);
  - `expo-haptics` (vibración);
  - `react-native-reanimated`, que ya está en la app.
- `jest-expo` en `packages/ui` para probar los componentes allí mismo.
- Añadir a `tokens.json` lo que hoy está escrito a mano y la guía define:
  - tamaño del logotipo;
  - alto de las casillas de progreso (12) y su separación (3);
  - tamaño de las burbujas de nivel (22);
  - giro del sello (−6°).

  Se actualiza `packages/tokens` y su prueba.
- **Verificación:** `pnpm typecheck && pnpm lint && pnpm test` en verde.

### T2 · Base: `Text`, `PaperBackground` y `Logo`
- **`Text`:**
  - variantes de `tokens.type`, que ya elige la familia por peso (lo que hoy hace `fonts.ts` pasa aquí);
  - respeta el texto dinámico del sistema;
  - las etiquetas van en mayúsculas.
- **`PaperBackground`:** la cuadrícula de la fase 0 (líneas de 1 px), con el área segura incluida.
- **`Logo`:**
  - el SVG oficial de `docs/marca/` (variantes sobre papel, sobre tinta y sobre subrayador);
  - ancho mínimo de 64;
  - etiqueta «Aptiq».
- **Requisitos:** NFR-04 y NFR-11.

### T3 · Acciones: `Button`
- **Variantes:**
  - **principal:** `highlighter`, texto 700;
  - **secundario:** borde `ink`;
  - **cristal:** solo sobre contenido.
- **Medidas:** alto ≥ 54, radio 14, borde 1,5.
- **Estados:** pulsado y desactivado.
- **Accesibilidad:** rol de botón, etiqueta y zona táctil ≥ 44.

### T4 · Respuesta: `OptionBubble`
- **Estados:** vacía, marcada, correcta y fallo, como en la guía (sección 5).
- **Accesibilidad:** se anuncia como «Opción B, 63, seleccionada».
- **Movimiento:**
  - la burbuja se rellena en 150 ms con ease-out;
  - vibración ligera al marcar;
  - con «reducir movimiento», solo un fundido.

### T5 · Progreso: `ProgressTicks`, `LevelBubbles` y `Stamp`
- **`ProgressTicks`:** respondidas, actual y pendientes. Se anuncia como «Pregunta 12 de 40».
- **`LevelBubbles`:** 10 burbujas. Se anuncia como «Nivel 7 de 10».
- **`Stamp`:**
  - «APTO» en Bricolage 800 y color `seal`, con doble borde y girado −6°;
  - aparece con una escala de 1,15 a 1 en 250 ms;
  - con «reducir movimiento», solo un fundido.

### T6 · Cristal: `GlassCard` y `TabBar`
- **`GlassCard`:**
  - receta de `tokens.glass` con `expo-blur` y una capa de color encima;
  - alternativa sin desenfoque (blanco al 88 %) si el sistema pide «reducir transparencia», y en Android 11 o anterior, donde el desenfoque es lento.
- **`TabBar`:**
  - 4 pestañas: Inicio, Tests, Estadísticas y Perfil, con iconos SVG de trazo 2;
  - la activa con fondo `ink` e icono `highlighter`;
  - cada pestaña con su etiqueta accesible.

### T7 · Fuente: `SourceNote`
- Icono de documento y el texto «Estructura basada en las bases del BOE y en los exámenes publicados por …».
- El organismo se pasa como dato. El componente **no inventa ninguna fuente**.

### T8 · Catálogo en `apps/mobile`
- Ruta `/catalogo`, que solo existe en desarrollo (en producción redirige a Inicio).
- Muestra todos los componentes con sus estados, ordenados como `sistema.html`.
- La pantalla provisional de la fase 0 pasa a usar `Text`, `PaperBackground` y `Logo`.

### T9 · Verificación y cierre
- Pruebas de componentes en verde.
- **Revisión de accesibilidad** con el criterio de `design:accessibility-review`:
  - contraste AA;
  - etiquetas;
  - zonas táctiles;
  - texto dinámico al 200 %.
- `review-animations` sobre OptionBubble y Stamp.
- Capturas del catálogo en el emulador de Android, comparadas con `sistema.html` (abierto en el navegador).
- **Tú:** el catálogo en tu iPhone con Expo Go.
- `/cerrar-fase 1`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo lo compruebo | Quién |
| --- | --- | --- |
| El catálogo coincide con `sistema.html` | Capturas comparadas, con la tabla de arriba como criterio | Claude y `revisor-interfaz` |
| Etiquetas de accesibilidad, contraste AA y zonas táctiles ≥ 44 | Pruebas que consultan rol y etiqueta, y revisión | Claude y `revisor-interfaz` |
| Pruebas de componentes en verde | `pnpm test` | Claude |
| `review-animations` aprueba las animaciones | Informe de la skill | Claude |
| VoiceOver real en iPhone | Recorrer el catálogo con VoiceOver | **Tú** |

## Fuera de esta fase

- **Llegan en la fase 4, junto a las pantallas que los usan:**
  - `Timer`, `SeriesTile` y `ListRow`;
  - la navegación con pestañas: en esta fase `TabBar` es solo un componente.
- **Sin cambios:** iconos de la app y pantalla de arranque (antes de la beta).

## Decisiones que necesito de ti

1. **Fuente de verdad:** ¿confirmas que mandan la guía y `tokens.json` sobre el tablero `sistema.html` (tabla de arriba)?
2. **Logotipo:** ¿**p** marcada (por defecto) o punto de la i? En esta fase se crea el componente `Logo`.
3. **Trazo del logotipo pequeño:** el SVG oficial tiene trazo 9. `inicio.html` lo dibuja a 80 px con trazo 11, para que no se vea fino. ¿Usamos siempre el oficial, o una versión «pequeña» con trazo 11 para tamaños menores de unos 100 px? Si es la segunda, se añadiría como archivo nuevo en `docs/marca/`.
