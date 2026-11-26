# Fase 9 · Parte C · Pulido de la experiencia · Plan

**Rama:** `fase-9-experiencia` (sale de `fase-9-lanzamiento`).
**Requisitos que toca:** ONB-01, ONB-02, SIM-01, SIM-02, SIM-03, EXP-01 a EXP-04, RES-01 a RES-04, PAY-01, NFR-08 y los de accesibilidad. No se quita ninguna función: se reordena, se agrupa y se anima.
**Estado:** aprobado por el propietario el 2026-11-25 con las cinco propuestas («apruebo el plan con tus propuestas»).
**Skills:** `aptiq-design-system` (manda). Como criterio: `emil-design-eng` y `animate-expo` (movimiento), `impeccable` y `ui-ux-pro-max` (UX y pulido), `design:accessibility-review` y `review-animations` al cerrar. Sus colores, fuentes y radios no se usan.

## Por qué parece hecha por IA

Lo he comprobado recorriendo la app en el emulador (Android, versión de producción). La paleta, las fuentes y el concepto de «papel, tinta y subrayador» son buenos y distintos. El problema está en cómo se aplican:

1. **Lo explica todo, siempre.** Cada pantalla repite avisos de método y de fuente. El de «Mezcla de entrenamiento… la proporción no es oficial» sale en Inicio, en el simulacro y en el resultado. Es correcto y necesario, pero no tiene que estar a la vista todo el rato.
2. **Todo pesa lo mismo.** Títulos, avisos, filas y botones tienen un peso visual parecido, así que el ojo no sabe dónde ir. En el simulacro hay **seis botones** debajo de la pregunta.
3. **No se mueve casi nada.** Solo animan la burbuja de la opción y el sello APTO. Las pantallas, las cifras, las barras y el progreso aparecen de golpe. Es lo que más delata una app hecha deprisa.
4. **Se ven piezas de serie.** Los diálogos son los nativos de Android (letras verde azulado, nada de la marca), la carga es un «Cargando…» en texto plano y la fecha del examen se escribe a mano como «AAAA-MM-DD».
5. **Faltan los momentos de recompensa.** Acabar un simulacro, acertar o subir de nivel no se nota. Al entregar el primer simulacro, lo primero que ves es el **muro de pago**, antes que tu nota.
6. **Se aparta de los prototipos.** El prototipo de Inicio tiene logotipo y selector de oposición arriba, y el botón y la fuente dentro de la tarjeta de nivel. La app los ha perdido y ha ganado párrafos.

## Hallazgos por pantalla

Gravedad: **A** = se nota mucho o rompe la experiencia · **M** = importante · **B** = detalle.

### Onboarding

| | Problema | Propuesta |
| --- | --- | --- |
| A | Empieza en frío: «Paso 1 de 3» y un botón amarillo con la oposición. No hay bienvenida, logotipo ni promesa. | Pantalla de bienvenida con el logotipo, el claim «Saca tu apto.» y una sola frase de valor. |
| A | La oposición es un botón principal, no una opción para elegir. | Tarjeta seleccionable con burbuja (como una respuesta) y «Continuar» abajo. |
| A | La fecha se escribe a mano («AAAA-MM-DD»). | Selector propio de mes y año (las convocatorias se anuncian por mes) y «Aún no lo sé». |
| M | Media pantalla vacía en cada paso. | Contenido centrado en la parte alta, acción fija abajo, entrada con fundido y desplazamiento corto. |

### Inicio

| | Problema | Propuesta |
| --- | --- | --- |
| A | Párrafo del formato, aviso de mezcla y nota de fuente seguidos: tres bloques de texto antes de la lista. | Una línea de formato en mono («80 PREGUNTAS · 55 MIN · −1/3»). El aviso y la fuente pasan a un icono «i» que abre una hoja con todo. |
| A | Falta la cabecera del prototipo (logotipo y selector de oposición). | Recuperarla. |
| M | El botón «Empezar simulacro» está fuera de la tarjeta de nivel. | Volver a la composición del prototipo: nivel, racha, burbujas y botón en la misma tarjeta. |
| M | «Sesión de hoy» es a la vez el título y una fila de la lista. | El título pasa a ser el saludo del día; «Sesión de hoy» queda como tarjeta destacada encima de la lista. |
| M | Con el simulacro semanal ya hecho aparece una segunda tarjeta con un botón de dos líneas. | Estado compacto en la propia tarjeta: «Próximo simulacro gratis: lun 30 nov» y un enlace a Premium. |
| M | La barra de pestañas deja ver el texto de detrás (en Android no hay desenfoque), y queda sucia. | Desenfoque real en Android (`expo-blur` ya lo permite envolviendo la pantalla) o el blanco al 88 % opaco de la guía, más un degradado de papel bajo la barra para que el texto se desvanezca. |
| B | Todas las aptitudes al 0 % se ven igual de vacías. | Sin datos: «—» y «Sin empezar», en vez de «0 %». |

### Simulacro

| | Problema | Propuesta |
| --- | --- | --- |
| A | Seis botones bajo la pregunta (dejar en blanco, marcar, anterior, siguiente, siguiente marcada y entregar). | Barra inferior fija con «Anterior», «Dejar en blanco» y «Siguiente». «Marcar para revisar» pasa a un icono de bandera en la cabecera. «Entregar» va en la cabecera o en la última pregunta. Se cumple igual SIM-02. |
| A | Al bajar, el cronómetro desaparece de la vista: SIM-02 pide que esté siempre visible. | Cabecera fija con cerrar, «12 / 80», bandera y cronómetro de cristal. |
| A | Las 80 casillas de progreso son un código de barras ilegible y no se pueden tocar. | Las casillas siguen arriba; al tocarlas se abre una hoja con la cuadrícula de las 80 preguntas (respondida, en blanco, marcada) para saltar a cualquiera. |
| M | La serie va como texto dentro del enunciado («7, 19, 55, 163, 487, ?»). | Usar `SeriesTile`, que está en la guía y no se usa: casillas con los números y la incógnita discontinua. |
| M | Dos líneas de etiqueta en mono (tipo y penalización) antes de la pregunta. | Una sola: «NUMÉRICA · SERIES». La penalización ya está en la hoja de información. |
| M | Entregar y salir usan el diálogo nativo de Android. | Hoja inferior propia con el resumen (respondidas, en blanco, marcadas) y dos botones de la marca. |
| B | No se puede pasar de pregunta deslizando. | Deslizar a izquierda y derecha para cambiar de pregunta. |

### Resultado

| | Problema | Propuesta |
| --- | --- | --- |
| A | La primera vez, el muro de pago sale **antes** que la nota. | Primero la nota. Premium se ofrece después, dentro del resultado o al salir (ver decisión 3). |
| A | La nota aparece de golpe. | La cifra cuenta hacia arriba, las barras crecen y el sello cae al final, con vibración (dentro de 250 ms por elemento y respetando «reducir movimiento»). |
| M | No hay botón de cerrar arriba (el prototipo lo tiene). | Cabecera del prototipo: cerrar y «SIMULACRO Nº 14 · GUARDIA CIVIL». |
| M | Se repite el aviso de mezcla. | A la hoja de información. |
| M | «Abstracta · a reforzar» cuando todas están al 0 % y además es Premium. | Solo se marca una aptitud a reforzar si hay datos suficientes y una diferencia real. |
| B | «0 fallos» sale en rojo. | Rojo solo si hay fallos. |

### Práctica y explicaciones

| | Problema | Propuesta |
| --- | --- | --- |
| A | No hay forma de salir de la práctica (no hay botón de cerrar). | Cabecera con cerrar, como en el simulacro. |
| A | La explicación es un documento entero (observa, regla, aplica, cada distractor y truco) y «Siguiente» queda fuera de la pantalla. | Se ve primero el veredicto y la regla en una línea, con «Siguiente» fijo abajo. «Ver paso a paso» despliega el resto en el mismo orden. EXP-01 a EXP-03 se cumplen igual. |
| M | Al confirmar no hay respuesta visual ni táctil diferenciada. | Acierto: la fila se rellena de subrayador y vibración de éxito. Fallo: la fila tiembla una vez con el borde rojo y vibración de error. Sin rebotes. |
| M | Repasar fallos: 79 preguntas en una sola lista larga, con un «Cargando…» en blanco antes. | Una pregunta por pantalla con «3 / 79» y deslizar, y esqueletos de carga en vez del texto. |

### Historial, Cuenta y muro de pago

| | Problema | Propuesta |
| --- | --- | --- |
| M | Cuenta empieza con un formulario grande de «Guarda tu progreso»; los ajustes quedan debajo y se cortan con la barra. | Cuenta empieza con tu plan y tus ajustes. «Guardar progreso» pasa a una fila con su propia pantalla. |
| M | Muro de pago: lista de ventajas sin jerarquía, sin planes visibles cuando falla la carga y con un «Continuar» desactivado. | Planes como opciones seleccionables (el anual destacado con su prueba de 7 días) y un estado de error con su propio dibujo y «Reintentar». |
| B | En el gráfico del historial la línea va pegada al 1 aunque el nivel es 1,2. | Comprobar si es correcto (semanas anteriores en 1) y, si lo es, enseñar el eje solo donde hay datos. |
| B | «Ver Premium» va en mono y negrita, distinto del resto de valores. | Mismo estilo que las demás filas. |

## Errores encontrados (no son de diseño)

1. **Contenido, grave:** el generador de series creó «3, 3, 3, 3, 3, ?» con la regla «× 2 − 3» (el 3 es un punto fijo de esa regla) y su explicación dice «las diferencias crecen deprisa (0, 0, 0, 0)». Es un fallo del motor y va aparte, con prueba que lo reproduzca primero (`aptiq-generator`).
2. **Accesibilidad:** TalkBack lee «1 aciertos» (falta el singular).
3. El cronómetro del simulacro no queda siempre a la vista (SIM-02).
4. No se puede salir de la práctica.

## Movimiento

Siguiendo la guía: de 150 a 250 ms, ease-out, sin rebotes en el simulacro, solo lo que informa y con «reducir movimiento» (en ese caso, solo fundidos).

| Momento | Qué se mueve |
| --- | --- |
| Entrar en una pantalla | Fundido y 8 px hacia arriba; las tarjetas de Inicio aparecen escalonadas (40 ms entre una y otra) |
| Pulsar cualquier botón o fila | Escala a 0,97 mientras se mantiene pulsado |
| Marcar una opción | Relleno de la burbuja (ya existe) |
| Confirmar en práctica | Acierto: relleno de subrayador y vibración de éxito. Fallo: un temblor corto y vibración de error |
| Cambiar de pregunta | Desplazamiento lateral corto de la tarjeta y avance de la casilla de progreso |
| Cronómetro | En el último minuto, el número pasa a rojo (estado, no decoración) |
| Resultado | Cifra que cuenta hacia arriba, barras que crecen escalonadas y sello al final |
| Nivel en Inicio | Las burbujas se rellenan una tras otra al entrar |
| Hojas y diálogos | Suben desde abajo con el fondo oscurecido; se pueden cerrar deslizando |
| Pestañas | La pastilla negra se desliza a la pestaña nueva |

## Componentes nuevos

Todo con StyleSheet y tokens, sin librerías nuevas (Reanimated, Gesture Handler y expo-haptics ya están en el stack):

- `Sheet`: hoja inferior propia, para la información, entregar o salir, la cuadrícula de preguntas y Premium.
- `Pressable` con escala: lo usan todos los botones y filas.
- `Skeleton`: bloques de papel que laten suavemente, en lugar de «Cargando…».
- `InfoButton`: el icono «i» que abre la hoja con fuente, método e independencia.
- `QuestionGrid`: cuadrícula de 80 casillas para el simulacro.
- `MonthPicker`: mes y año para la fecha del examen.
- `CountUp`: cifra que cuenta hacia arriba.

## Tareas

Orden pensado para que lo que más se nota llegue primero. Cada tarea termina con capturas antes y después, comparadas con el prototipo.

| # | Tarea | Requisitos |
| --- | --- | --- |
| C1 | Componentes base: `Pressable` con escala, `Sheet`, `Skeleton`, `InfoButton`, transiciones de pantalla y la pastilla deslizante de las pestañas | — |
| C2 | Barra de pestañas en Android: desenfoque real o blanco al 88 % opaco, y degradado de papel debajo | — |
| C3 | Inicio: cabecera del prototipo, tarjeta de nivel con el botón, formato en una línea, avisos a la hoja «i», estados sin datos y entrada escalonada | NFR-08, SIM-01 |
| C4 | Simulacro: cabecera fija, barra inferior de 3 acciones, bandera, cuadrícula de preguntas, `SeriesTile`, deslizar, hojas propias de entregar y salir | SIM-01, SIM-02, SIM-03 |
| C5 | Práctica: cerrar, respuesta al confirmar (visual y táctil), explicación por capas con «Siguiente» fijo | EXP-01 a EXP-04 |
| C6 | Resultado: cabecera, nota que cuenta, barras y sello animados, regla de «a reforzar», muro después de la nota | RES-01 a RES-04, PAY-01 |
| C7 | Repasar: una pregunta por pantalla, esqueletos de carga | RES-03 |
| C8 | Onboarding: bienvenida, selección de oposición como tarjeta, selector de mes y año | ONB-01, ONB-02 |
| C9 | Cuenta, Historial y muro de pago | ONB-03, PAY-01 |
| C10 | Repaso de textos: quitar todo lo que repite lo que ya dice la pantalla (máximo una línea de apoyo por bloque) | — |
| C11 | Cierre: `revisor-interfaz`, `review-animations`, `design:accessibility-review`, TalkBack, «reducir movimiento» y capturas finales | — |

**Prueba de que está hecho:** pruebas de componentes en verde, comprobación de tipos y ESLint sin errores, y una tabla de capturas antes y después de cada pantalla. Tú validas las capturas en el emulador.

## Cambios en la guía de estilos

Si apruebas el plan, se añade a `docs/guia-estilos.md`:

- **Densidad:** como mucho una línea de texto de apoyo por bloque. El método, la fuente y la independencia van en la hoja «i», salvo `SourceNote`, que sigue visible al empezar cada simulacro (lo exige la guía).
- **Acciones:** una principal y como mucho una secundaria a la vista. El resto, en iconos o en hojas.
- **Movimiento:** se amplía la lista de momentos con la tabla de arriba.
- **Componentes:** los siete nuevos, con sus estados.

La paleta, las fuentes, los radios y el cristal no cambian.

## Decisiones que necesito de ti

1. **Dónde entra.** Propuesta: como parte C de la fase 9, **antes de compilar la beta** (así los probadores ven la versión buena), en un PR aparte, `fase-9-experiencia`. La alternativa es lanzar la beta ya y hacer esto después, pero los probadores juzgarían la versión actual.
2. **Cambios en la guía.** ¿Apruebas las reglas de densidad y acciones y la lista de movimiento de arriba?
3. **Muro de pago tras el primer simulacro.** Propuesta: primero la nota completa; Premium se ofrece en una tarjeta del propio resultado («Ver explicaciones de todo el simulacro con Premium») y no como pantalla que tapa la nota.
4. **Bienvenida del onboarding.** Añade una pantalla (pasarían a ser 4 pasos, el primero sin pregunta). ¿Te parece bien?
5. **Fecha del examen.** Propuesta: mes y año (sin día) más «Aún no lo sé». Si prefieres día exacto, haría un calendario propio, con más trabajo.

## Fuera de alcance

- Modo oscuro, ilustraciones nuevas e iconos nuevos de la app.
- El fallo de la serie del punto 1 de «Errores encontrados», que va aparte en el motor.
- Pantallas que no existen todavía (mini simulacros de SIM-04, varias oposiciones de ONB-04).
