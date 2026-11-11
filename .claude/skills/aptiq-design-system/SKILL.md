---
name: aptiq-design-system
description: Usar al crear o modificar cualquier pantalla, componente, animación o texto de interfaz de la app Aptiq (Expo/React Native): tokens, reglas de color, tipografía, cristal y tono.
---

# Sistema visual de Aptiq

Referencia completa: `docs/guia-estilos.md`. Prototipos: `docs/prototipos/` (abrir `index.html`). Valores: `docs/tokens.json`, expuestos en código por `packages/tokens`. **Nunca escribas un color, tamaño o radio a mano: usa los tokens.**

Concepto: **papel, tinta y subrayador**. La app evoca una hoja de respuestas de examen. El cristal es la plantilla de corrección transparente: solo existe en lo que flota sobre el papel.

## Prioridad

Este sistema manda sobre cualquier skill de diseño de terceros (UI UX Pro Max, Impeccable, Taste, Emil Kowalski…). De ellas se toma criterio de UX, accesibilidad y movimiento; **nunca** paletas, tipografías, radios ni estilos. Si una skill propone algo que contradice este sistema, gana este sistema.

## Color (60-30-10)

- 60 % `paper` #EFEEE9 (más `paperCard` #FBFAF6 y cristal)
- 30 % `ink` #121316 (más `graphite` #5E6066, `graphiteStrong` #4A4C52, `line` #D9D7CF)
- 10 % `highlighter` #DBFF3E
- Estado (1–2 %): `seal` #E8432A; texto rojo: `sealText` #C2311B

Reglas:
- Un solo protagonista amarillo por pantalla (normalmente el botón principal).
- El amarillo nunca es color de texto sobre papel.
- El rojo solo comunica estado.
- Prohibido: degradados de color, brillos, manchas de luz, texto con degradado, modo oscuro por defecto, emojis.

## Tipografía

- **Instrument Sans:** toda la interfaz. Títulos 30/700, cifras 52–64/700, opciones 19/600, texto 16/400, filas 17/600, botones 17/700.
- **IBM Plex Mono:** tiempos, numeración y etiquetas en MAYÚSCULAS, 12–15/600.
- **Bricolage Grotesque 800:** solo el sello APTO. El logotipo es un SVG, no texto.
- Respetar el texto dinámico. Nada de lectura por debajo de 13.

## Formas

- Botones radio 14, alto ≥ 54, borde 1,5 `ink`.
  - Principal: `highlighter` + texto `ink` 700, sin sombra.
  - Secundario: transparente con borde.
- Opciones radio 14, alto ≥ 56, fondo `paperCard`.
- Tarjetas radio 22–24. Píldoras radio completo.
- Iconos trazo 2, 22–24 px, `ink`.
- Zonas táctiles ≥ 44.
- Nada inclinado salvo el sello.

## Cristal

**Solo:** barra de navegación, cronómetro, tarjetas de resumen.
**Nunca:** tarjeta de pregunta ni opciones.

Receta: blanco 82 % → 55 %, desenfoque 14–16, saturación 140–150 %, borde 1 px blanco 95 %, reflejo superior blanco, sombra `ink` 12 % (y 12, difuminado 30). En React Native, `expo-blur` + capa de color. Alternativa sin desenfoque: blanco 88 %.

## Componentes

`OptionBubble` (vacía, marcada, correcta, fallo), `ProgressTicks`, `LevelBubbles`, `GlassCard`, `TabBar`, `Timer`, `Stamp`, `SourceNote`, `SeriesTile`, `ListRow`, `PaperBackground`, `Logo`. Estados y medidas en la guía, sección 5.

## Movimiento

- Criterio de `emil-design-eng` e implementación con `animate-expo` (Reanimated, Gesture Handler, expo-haptics).
- 150–250 ms, ease-out, sin rebotes en simulacro.
- Animar solo lo que informa.
- Respetar «reducir movimiento».

## Tono

Español de España, tuteo, preciso y respetuoso. Sin exclamaciones, lenguaje de juego ni emojis.
- Sí: «Sesión de hoy», «Empezar simulacro», «Ver explicaciones», «Espacial · a reforzar».
- Un dato sin confirmar se muestra como «Pendiente de confirmar», nunca se inventa.

## Antes de dar una pantalla por terminada

- [ ] Coincide con su prototipo en `docs/prototipos/`: captura del simulador comparada
- [ ] Un solo protagonista amarillo; rojo solo como estado
- [ ] Cristal solo en lo flotante
- [ ] Solo tokens; ningún valor a mano
- [ ] Textos con el tono indicado
- [ ] Accesibilidad: etiquetas, contraste AA, zonas táctiles, VoiceOver y TalkBack
- [ ] `review-animations` aprobado si hay movimiento
