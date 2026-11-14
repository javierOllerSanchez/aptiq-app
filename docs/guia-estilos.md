# Aptiq — Guía de estilos

**Concepto: papel, tinta y subrayador.** La app evoca una hoja de respuestas de examen. El cristal (liquid glass) es la plantilla de corrección transparente que se pone encima: solo existe en lo que flota sobre el papel.

- Prototipos navegables: `docs/prototipos/index.html` (abrir en el navegador).
- Valores exactos: `docs/tokens.json` (fuente única; `packages/tokens` se valida contra él).
- Archivos de marca: `docs/marca/`.

> **Regla de prioridad.** Esta guía manda sobre cualquier skill de diseño de terceros (UI UX Pro Max, Impeccable, Taste, Emil Kowalski…). Esas skills aportan criterio de UX, accesibilidad y movimiento; nunca paletas, tipografías, radios ni estilos propios.

## 1. Color · regla 60-30-10

| Token | Valor | Rol | Peso |
| --- | --- | --- | --- |
| `paper` | #EFEEE9 | Fondo de todo | 60 % |
| `paperCard` | #FBFAF6 | Tarjeta de pregunta, opciones, superficies de lectura | (dentro del 60 %) |
| `ink` | #121316 | Texto, bordes, iconos, burbuja marcada, progreso, pestaña activa | 30 % |
| `graphite` | #5E6066 | Texto secundario | (dentro del 30 %) |
| `graphiteStrong` | #4A4C52 | Texto secundario sobre cristal | (dentro del 30 %) |
| `line` | #D9D7CF | Separadores y bordes suaves | (dentro del 30 %) |
| `highlighter` | #DBFF3E | Acción principal, pregunta en curso, acierto | 10 % |
| `seal` | #E8432A | Estado: fallo, aptitud a reforzar, sello APTO | 1–2 % |
| `sealText` | #C2311B | Texto rojo sobre papel (contraste AA) | — |

Fondo de pantalla: `paper` con cuadrícula de 24 px en `ink` al 4,5 %.

Reglas:

- **Un solo protagonista amarillo por pantalla** (normalmente el botón principal). El resto de amarillos son indicadores pequeños (casilla actual, burbuja del icono, pestaña activa en icono).
- **El amarillo nunca es color de texto** sobre papel. Siempre como fondo con texto `ink`, o como icono sobre `ink`.
- **El rojo solo comunica estado**, nunca decora.
- Prohibido: degradados de color, brillos o neón, manchas de luz de fondo, texto con degradado, modo oscuro por defecto, emojis.

## 2. Tipografía

| Uso | Fuente | Peso | Tamaño |
| --- | --- | --- | --- |
| Título de pantalla | Instrument Sans | 700 | 30, interlineado 1,15, tracking −0,02em |
| Cifra grande (nivel) | Instrument Sans | 700 | 52 |
| Nota del resultado | Instrument Sans | 700 | 64 |
| Enunciado de pregunta | Instrument Sans | 700 | 21 |
| Valor de opción | Instrument Sans | 600 (700 marcada) | 19 |
| Texto | Instrument Sans | 400 | 16, interlineado 1,45 |
| Filas de lista | Instrument Sans | 600 | 17 |
| Botón | Instrument Sans | 700 principal / 600 secundario | 16–17 |
| Etiquetas, tiempos, numeración | IBM Plex Mono | 600 | 12–15; etiquetas en MAYÚSCULAS, tracking 0,08–0,12em |
| Logotipo y sello APTO | Bricolage Grotesque | 800 | Solo ahí |

Respetar el texto dinámico del sistema. Ningún texto de lectura por debajo de 13; las etiquetas mono pueden bajar a 11–12.

## 3. Formas, espaciado y tamaños

- Márgenes de pantalla: 20 laterales, 56 arriba (área segura incluida en la implementación real).
- Botones: radio 14, alto ≥ 54, borde 1,5 `ink`.
  - **Principal:** fondo `highlighter`, texto `ink` 700. Sin sombra.
  - **Secundario:** transparente, borde `ink`.
  - **Cristal:** solo cuando flota sobre contenido.
- Opciones de respuesta: radio 14, alto ≥ 56, fondo `paperCard`, borde 1 `line`.
- Tarjetas: radio 22–24. Chips y selector de oposición: radio completo.
- Iconos: trazo 2, 22–24 px, puntas redondeadas, color `ink`.
- Zonas táctiles ≥ 44 × 44.
- **Nada inclinado** salvo el sello APTO.

## 4. Cristal (plantilla de corrección)

**Solo en:** barra de navegación inferior, cronómetro, tarjetas de resumen (nivel estimado, aciertos/fallos/en blanco).
**Nunca en:** la tarjeta de la pregunta ni en las opciones (deben leerse perfectamente).

Receta: relleno blanco del 82 % (arriba izquierda) al 55 % (abajo derecha), desenfoque 14–16, saturación 140–150 %, borde 1 px blanco al 95 %, reflejo interior superior blanco de 1 px, sombra `ink` al 12 % con desplazamiento vertical 12 y difuminado 30.

En React Native: `expo-blur` (`BlurView`, intensidad equivalente) + capa de color encima. En dispositivos Android con poca potencia o con "reducir transparencia" activo: blanco al 88 % sin desenfoque.

## 5. Componentes

| Componente | Descripción y estados |
| --- | --- |
| `OptionBubble` | Fila con burbuja (círculo 32, letra en mono) y valor. **Vacía:** borde `ink` 2. **Marcada:** círculo `ink` con letra `highlighter`; fila blanca con borde `ink` 2. **Correcta:** fila `highlighter`, check. **Fallo:** borde y círculo `seal`, aspa blanca. |
| `ProgressTicks` | Una casilla por pregunta, 12 de alto, separación 3. Respondidas `ink`, actual `highlighter` con borde `ink` 1,5, pendientes `ink` al 12 %. |
| `LevelBubbles` | 10 burbujas de 22: rellenas `ink`, vacías con borde `ink` al 25 %. |
| `GlassCard` | Receta de cristal. Radio 24. Para resúmenes. |
| `TabBar` | Cristal, radio 22, 4 pestañas (Inicio, Tests, Estadísticas, Perfil). Activa: fondo `ink`, icono `highlighter`. |
| `Timer` | Píldora de cristal con icono de reloj y tiempo en mono 15. |
| `Stamp` | «APTO» en Bricolage 800 color `seal`, doble borde, girado −6°. Solo en Resultado, más pequeño que la nota. |
| `SourceNote` | Icono de documento + «Formato según la convocatoria oficial: …» con la cita del perfil (p. ej. «BOE-A-2026-9982, bases 6.1.2.a, 7.3 y 7.8»). No menciona exámenes publicados: la Guardia Civil no publica el cuestionario de aptitudes. Obligatorio en cada simulacro. |
| `SeriesTile` | Casilla de serie: radio 12, borde `ink` 1,5, número 24/700. La incógnita con borde discontinuo y «?» en `graphite`. |
| `ListRow` | Fila de 52 con separador al 14 %; nombre 17/600, valor en mono 15/600, chevron. Valor en `sealText` si es el punto débil. |
| `PaperBackground` | Papel con cuadrícula. |
| `Logo` | SVG oficial de `docs/marca/`. Nunca recrearlo con una fuente. |

## 6. Pantallas de referencia

### Inicio (`prototipos/inicio.html`)
1. Cabecera: logotipo a la izquierda, selector de oposición (píldora con borde) a la derecha.
2. Título «Sesión de hoy» y una línea con el formato oficial de la oposición.
3. `GlassCard` con nivel estimado (cifra grande), racha en mono, `LevelBubbles`, botón principal «Empezar simulacro» y `SourceNote`.
4. «PRÁCTICA POR APTITUD»: lista de aptitudes con su porcentaje de acierto; la más floja en rojo.
5. `TabBar` flotante.

### Simulacro (`prototipos/simulacro.html`)
1. Cabecera: cerrar (círculo con borde), «PREGUNTA 12 / 40» en mono, `Timer`.
2. `ProgressTicks`.
3. Etiqueta de aptitud y tipo + regla de penalización, en mono.
4. Tarjeta de pregunta sobre `paperCard` (no cristal): enunciado y casillas de la serie.
5. 4 opciones `OptionBubble` (3 o 4 según el perfil).
6. Abajo: «Dejar en blanco» (secundario) y «Confirmar» (principal).

### Resultado (`prototipos/resultado.html`)
1. Cabecera: cerrar, «SIMULACRO Nº 14 · GUARDIA CIVIL».
2. Nota neta grande «27,0 / 40», fórmula en mono («29 aciertos − 6 fallos ÷ 3») y `Stamp` al lado.
3. `GlassCard` con aciertos, fallos (rojo) y en blanco.
4. «POR APTITUD»: barras `ink`; la aptitud a reforzar en `seal`.
5. Abajo: «Otro simulacro» (secundario) y «Ver explicaciones» (principal).

El canvas de diseño original está en [Aptiq — Identidad visual](https://claude.ai/artifact/NnaV5ckKUBpp4R31nmB3Em).

## 7. Logotipo e icono

- Logotipo dibujado con trazo uniforme. Los ojos de la **a**, la **p** y la **q** son las tres burbujas de la hoja de respuestas (A · B · C); la **p** va rellena de subrayador.
- Variantes: sobre papel (principal), sobre tinta, sobre subrayador (la burbuja pasa a tinta). Alternativa pendiente de decisión: punto de la i como burbuja marcada.
- Icono de app: tres burbujas sobre `ink`, la central en `highlighter`. Variante: sobre `highlighter` con burbujas en `ink`.
- Área de respeto: la altura de la x a cada lado. Tamaño mínimo del logotipo: 64 px de ancho.

## 8. Movimiento

Criterio de las skills de Emil Kowalski (`emil-design-eng`, `animate-expo`) con estas reglas:

- 150–250 ms, ease-out. Sin rebotes durante un simulacro.
- Se anima solo lo que informa:
  - marcar una burbuja (relleno de 150 ms);
  - confirmar una respuesta;
  - avance de la casilla de progreso;
  - aparición del sello (escala de 1,15 a 1 con giro, 250 ms).
- Vibración ligera al marcar y al confirmar.
- Respetar «reducir movimiento»: sin escalas ni desplazamientos, solo fundidos.

## 9. Tono de los textos

Español de España, tuteo, preciso y respetuoso. El opositor se juega mucho: nada de lenguaje de juego, exclamaciones ni emojis.

| Sí | No |
| --- | --- |
| Sesión de hoy | ¡Hoy toca entrenar! |
| Empezar simulacro | ¡Vamos allá! |
| Espacial · a reforzar | ¡Ups! Fallas en espacial |
| Ver explicaciones | Descubre tus errores |
| Pendiente de confirmar en el BOE | (inventar un dato) |

## 10. Accesibilidad

- Contraste WCAG 2.1 AA (comprobado en la paleta: `ink` sobre `paper`, `graphite` sobre `paper`, `sealText` sobre `paper`, `ink` sobre `highlighter`).
- Zonas táctiles ≥ 44.
- Etiqueta de accesibilidad en todo botón de icono.
- Opciones anunciadas como «Opción B, 63, seleccionada».
- Cronómetro anunciado cada minuto, no cada segundo.
- Probado con VoiceOver y TalkBack.

## 11. Lista de comprobación antes de cerrar una pantalla

- [ ] Un solo protagonista amarillo; rojo solo como estado
- [ ] Cristal solo en elementos flotantes
- [ ] Tipografías y tamaños de la tabla
- [ ] Nada inclinado salvo el sello
- [ ] Textos con el tono indicado
- [ ] Accesibilidad revisada (`design:accessibility-review`)
- [ ] Captura comparada con el prototipo correspondiente
