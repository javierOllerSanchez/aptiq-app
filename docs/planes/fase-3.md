# Plan · Fase 3 · Perfil de examen y puntuación

**Rama:** `fase-3-perfil` (desde `main`, con la fase 2 fusionada).
**Requisitos:** CON-01, SIM-01, RES-01, RES-04 y NFR-08, más el pendiente de la fase 2 (distractores).
**Skills:** `aptiq-exam-profile` (manda) y `aptiq-generator` (para los distractores).
**Estado:** aprobado por el propietario el 2026-11-12 con las opciones propuestas: simulacro con «mezcla de entrenamiento» a partes iguales y aviso visible; distractores validados con pruebas automáticas y en la beta; nota negativa sin recortar, pendiente de confirmar.

## Qué dicen las fuentes oficiales (consultadas el 2026-11-12)

### 1. Bases de la convocatoria

Resolución 160/38243/2026, de 5 de mayo ([BOE-A-2026-9982](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-9982), BOE n.º 112, de 8 de mayo de 2026).

| Dato | Valor | Dónde |
| --- | --- | --- |
| Preguntas | 80 | Base 6.1.2.a y tabla de la base 7.3 (T = 80) |
| Tiempo | 55 minutos, incluida la lectura de instrucciones | Base 6.1.2.a |
| Opciones por pregunta | 4 | Tabla de la base 7.3 (N = 4) |
| Respuesta válida | Una sola; si varias parecen correctas, se marca «la más completa» | Base 6.1.2.a |
| Penalización | Los errores restan; las preguntas en blanco no | Base 6.1.2.a |
| Fórmula | Puntuación = Y/T × (A − E/(N − 1)) = 30/80 × (aciertos − errores/3) | Base 7.3 |
| Escala | De 0 a 30 | Bases 7.3 (Y = 30) y 7.8 |
| Nota mínima | 12, eliminatoria | Base 7.8 |
| Desempate | La prueba de aptitudes intelectuales es el tercer criterio de desempate | Base 7.10.c |

### 2. Plantilla oficial de respuestas de 2026

[PLANTILLAS-INGRESO-CABOS-Y-GUARDIAS.-2026.pdf](https://web.guardiacivil.es/export/sites/guardiaCivil/documentos/pdfs/2026/Procesos_Selectivos_2026/PLANTILLAS-INGRESO-CABOS-Y-GUARDIAS.-2026.pdf), página 3, «Plantilla de respuestas · Prueba de aptitudes», examen del 11/07/2026.

- Confirma 80 ítems en cada modelo (A y B) con las opciones A, B, C y D.
- Hay una versión corregida, el «PDF n.º 2», que cambia preguntas de **conocimientos**, no de aptitudes.

### 3. Lo que NO es oficial y por eso queda pendiente

- La Guardia Civil **no publica el cuestionario de la prueba de aptitudes**, solo la plantilla de respuestas. Lo he comprobado en [su página de ingreso](https://web.guardiacivil.es/es/tramites/ingresos/ingresocuerpo/). Los «exámenes psicotécnicos» que circulan son reconstrucciones de academias y, según el `CLAUDE.md`, no sirven como fuente.
- Las bases solo dicen que se usan «test de inteligencia general y/o escalas específicas» que miden aprendizaje, análisis, razonamiento y potencial cognitivo. **No dicen qué tipos de ejercicio entran ni en qué proporción.**
- Por tanto, **la proporción de tipos (`mix`) queda como pendiente**: no hay fuente oficial de la que sacarla.

## Tareas

### T1 · Rediseño de distractores (pendiente de la fase 2) (EXP-02, NFR-07)

Se parte del trabajo guardado en la rama `fase-2-distractores`:
- prueba común «centro de errores»;
- como mucho dos errores genéricos por pregunta;
- sin distractores ya visibles ni en sentido contrario a la serie.

Falta dar a cada familia errores de la propia regla **a los dos lados** de la respuesta, para que se cumplan a la vez las pruebas de puesto por valor y de centro de errores. Además:
- **Códigos de cifras:** que algunos distractores no sean «una sola modificación» de la respuesta (pista de consenso).
- **Ordenación alfabética:** que la correcta no esté casi siempre en el medio en las preguntas de «puesto N».
- **Series de letras:** algo más de variedad en el nivel 3.

Como no hay cuestionarios oficiales, la referencia son las pruebas automáticas de pistas y la revisión de `revisor-contenido`.

- **Verificación:** las pruebas comunes en verde, también con `pnpm test:stress`, y `revisor-contenido` sin hallazgos que permitan adivinar.

### T2 · Esquema del perfil con validación (CON-01, NFR-08)

- **Archivos:** `packages/engine/src/profile.ts` (tipos y validador, sin dependencias nuevas) y su prueba.
- **Comprobaciones del validador:**
  - todo dato no nulo tiene su entrada en `fieldSources`;
  - los datos nulos aparecen en `pendiente`;
  - las proporciones suman 1;
  - las fuentes llevan URL de un organismo público.
- **Verificación:** pruebas con perfiles válidos e inválidos.

### T3 · Perfil `guardia-civil-2026` (CON-01, SIM-01, NFR-08)

- **Archivo:** `packages/engine/profiles/guardia-civil-2026.json`.
- **Datos con su fuente:** los de la tabla anterior. La fórmula se guarda como parámetros: Y = 30, T = 80, N = 4.
- **`mix`:** `null`, en `pendiente`, con la nota «la Guardia Civil no publica el cuestionario de aptitudes».
- **Análisis:** `packages/engine/profiles/analysis/guardia-civil-2026.md` recoge qué fuentes se consultaron, qué publican y qué no. No incluye ninguna pregunta ni respuesta oficial.
- **Verificación:** el validador de T2 lo acepta, y **tú lo revisas** contra el BOE.

### T4 · Puntuación (RES-01, RES-04)

- **Archivo:** `packages/engine/src/score.ts`, con la fórmula de la base 7.3 a partir del perfil.
- **Resultado:** la nota, la fórmula en texto para la pantalla de Resultado («60 aciertos − 12 fallos ÷ 3») y si llega a la nota mínima.
- **Casos calculados a mano:**

  | Aciertos | Fallos | En blanco | Puntuación | ¿Mínimo de 12? |
  | --- | --- | --- | --- | --- |
  | 80 | 0 | 0 | 30 | Sí |
  | 60 | 12 | 8 | 30/80 × (60 − 4) = 21 | Sí |
  | 32 | 0 | 48 | 30/80 × 32 = 12 | Sí, justo |
  | 40 | 30 | 10 | 30/80 × (40 − 10) = 11,25 | No |
  | 10 | 60 | 10 | 30/80 × (10 − 20) = −3,75 (ver la pregunta 3) | No |

- **Cuestión abierta:** las bases no dicen qué pasa con una puntuación negativa. Se muestra el valor de la fórmula sin recortar y se marca como «pendiente de confirmar»; ver la pregunta 3.
- **Verificación:** las pruebas con estos casos.

### T5 · Cierre

- `revisor-contenido` sobre el perfil y los distractores.
- `verificador-fase`.
- `/cerrar-fase 3`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo se comprueba | Quién |
| --- | --- | --- |
| Pruebas de puntuación con casos calculados a mano | Los casos de T4 | Claude |
| Cada dato del perfil con su fuente o marcado como pendiente | El validador de T2, que falla si no | Claude |
| El propietario revisa el perfil | Lo compruebas contra el BOE | **Tú** |

## Decisiones que necesito de ti

1. **Simulacro sin proporción oficial.** Mientras no haya fuente, propongo:
   - **a)** que el simulacro use una «mezcla de entrenamiento» con los 6 tipos a partes iguales, con un aviso visible: «La proporción de tipos no es oficial: la Guardia Civil no publica el cuestionario». El número de preguntas, el tiempo y la penalización sí serían los oficiales;
   - **b)** además, preguntar a la Jefatura de Enseñanza (en-jefensenanza-seleccion@guardiacivil.org, el correo que aparece en la plantilla oficial) si publica o puede facilitar los tipos de ejercicio. **El correo lo envías tú**; yo puedo redactarlo.
2. **Distractores sin exámenes oficiales como referencia.** Te propuse diseñarlos «con los exámenes oficiales» y no se puede, porque no se publican. Propongo hacerlo con las pruebas automáticas de pistas y la revisión de contenido, y **validarlo con opositores reales en la beta** (fase 9).
3. **Puntuación negativa.** ¿La mostramos tal cual («−3,75») o recortada a 0? Las bases no lo dicen. Propongo mostrarla tal cual con la fórmula, porque refleja lo que pasaría con la fórmula del BOE, y marcarla como pendiente de confirmar.
