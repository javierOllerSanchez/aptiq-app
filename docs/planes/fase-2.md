# Plan · Fase 2 · Motor de contenido v1

**Rama:** `fase-2-motor`, creada desde `fase-1-sistema-diseno`; se rebasa sobre `main` cuando se fusione el PR #2.
**Requisitos:** EXP-01, EXP-02, EXP-03, CON-02, NFR-07, NFR-09.
**Skills:**
- `aptiq-generator`, que manda;
- Superpowers `test-driven-development`.

**Estado:** aprobado por el propietario el 2026-11-12 con las opciones por defecto: familias habituales (se contrastan en la fase 3), alfabeto de 27 letras con Ñ, 20 muestras por tipo. Pendiente: quién revisa las muestras.

## Qué se construye

Los seis tipos de pregunta que el MVP genera por código, cada uno con:
- un **generador** que crea la pregunta a partir de una semilla y un nivel del 1 al 5;
- un **solucionador independiente**, que resuelve la pregunta sin conocer la regla usada al generarla.

Ejemplo de pregunta (serie numérica, nivel 3):

> ¿Qué número continúa la serie? 3, 7, 15, 31, ?
> A) 47 · B) 63 · C) 62 · D) 64

La explicación se genera desde la misma regla:
1. **Observa:** las diferencias son 4, 8, 16, se duplican.
2. **Regla:** cada número es el anterior × 2 + 1.
3. **Aplica:** 31 × 2 + 1 = 63.
4. **Errores:**
   - 47 sale de sumar otra vez 16;
   - 62 sale de multiplicar por 2 y olvidar el + 1;
   - 64 sale de sumar 1 de más.
5. **Truco:** si las diferencias crecen deprisa, prueba con multiplicaciones antes que con sumas.

## Tareas

Siempre **primero las pruebas** (sin pruebas en verde no se toca el motor).

### T1 · Base del motor (NFR-09, NFR-07)

**Archivos** (en `packages/engine/src/`):

| Archivo | Contenido |
| --- | --- |
| `rng.ts` | Generador de números pseudoaleatorios con semilla. Es código propio de unas 30 líneas, sin dependencias, y ofrece `createRng(seed)` con `int`, `pick` y `shuffle`. |
| `types.ts` | Las interfaces `Item`, `Generator` y `Solver` de la skill. |
| `taxonomy.ts` | Los seis códigos de tipo, cada uno con descripción, niveles y tiempo esperado. |
| `build.ts` | El paso común a todos los generadores: barajar opciones, validar con el solucionador, reintentar con `${seed}:retry:${n}` (máximo 20 veces) y montar el `id`. |

**Pruebas comunes** para todos los tipos, en `test/generator-suite.ts`:
- **unicidad:** el solucionador encuentra exactamente una opción válida;
- **determinismo:** la misma semilla da la misma pregunta;
- **opciones:** distintas y en el número pedido (3 o 4);
- **coherencia:** la explicación lleva a la opción correcta;
- **distractores:** cada opción incorrecta tiene su error explicado;
- **posición de la correcta:** repartida de forma uniforme.

**Volumen:**
- `pnpm test`: 1.000 preguntas por tipo y nivel, con 3 y con 4 opciones;
- `pnpm test:stress`: 10.000.

**Instantáneas:** una muestra fija de semillas. Si cambian, hay que subir `version`.

### T2 a T7 · Los seis tipos

| Tarea | Código | Tipo | Familias de reglas (de menos a más difícil) | Cómo resuelve el solucionador |
| --- | --- | --- | --- | --- |
| T2 | `NUM.SERIE` | Series numéricas | aritmética, geométrica, ×a+b, diferencias crecientes, dos series intercaladas | Prueba todas las familias sobre los términos visibles. Si más de una opción encaja con alguna regla razonable, la pregunta se descarta |
| T3 | `LET.SERIE` | Series de letras | saltos fijos, saltos crecientes, intercaladas, ida y vuelta | Igual, sobre posiciones del alfabeto |
| T4 | `NUM.CALC` | Cálculo y porcentajes | operaciones encadenadas, porcentajes, regla de tres, fracciones | Recalcula desde los datos estructurados del enunciado |
| T5 | `COD.CRIPTO` | Códigos y criptogramas | sustitución letra a número, desplazamiento de letras, código con clave | Deduce la clave a partir del ejemplo. Si la clave no queda determinada, la pregunta se descarta |
| T6 | `VER.ORDEN` | Ordenación alfabética | qué palabra ocupa el puesto N, cuál va primera o última | Ordena con `Intl.Collator('es')` de Node, que es un método distinto del comparador propio del generador |
| T7 | `DAT.COMPARA` | Comparación de datos | contar filas iguales en dos columnas (códigos, nombres, cifras) con diferencias sutiles | Compara carácter a carácter |

Cada tarea incluye:
- **parámetros por nivel:** el nivel 1 se resuelve en segundos y el nivel 5 equivale a lo más difícil publicado;
- **distractores** que salen de errores típicos, cada uno con su explicación;
- **un truco de examen** por tipo;
- **lista de palabras de T6:** palabras comunes del español escritas por nosotros, sin copiar ningún examen.

### T8 · Muestras para revisión humana

- Un script con Node 24, sin dependencias nuevas, exporta muestras a `docs/muestras/<tipo>.md`: enunciado, opciones, solución y explicación.
- Se ejecuta con `pnpm --filter @aptiq/engine muestras`.

### T9 · Cierre

- `pnpm test:stress` en verde.
- `revisor-contenido` sin hallazgos bloqueantes. Revisa a mano 30 preguntas por tipo, busca reglas alternativas, el sesgo de posición y el uso de `Math.random`.
- `/cerrar-fase 2`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo lo compruebo | Quién |
| --- | --- | --- |
| 10.000 preguntas por tipo y nivel, sin ninguna con dos respuestas válidas | `pnpm test:stress` | Claude |
| Cada explicación reproduce la solución y cada distractor tiene su error explicado | Pruebas de coherencia y distractores | Claude |
| Determinismo comprobado | Prueba de misma semilla y misma pregunta, más las instantáneas | Claude |
| `revisor-contenido` sin hallazgos graves | Su informe | Subagente |
| Muestra en `docs/muestras/` para revisión humana | Los archivos | **Tú** los revisas |

## Fuera de esta fase

- **Fase 8:** las preguntas verbales (sinónimos, analogías, comprensión), porque se redactan y necesitan aprobación humana.
- **Fase 8:** las espaciales (figuras, cubos).
- **Fase 3:** el perfil de examen y la proporción de tipos.

## Decisiones que necesito de ti

1. **De dónde salen las familias de reglas.** Las de la tabla son los patrones habituales de los psicotécnicos. Todavía no están contrastadas con los cuestionarios oficiales de la Guardia Civil; eso se hace en la fase 3, al analizar los exámenes publicados. Propongo:
   - empezar con estas familias;
   - en la fase 3, quitar o añadir familias según lo que aparezca en los exámenes oficiales.

   No se inventa ningún dato de la oposición: solo son tipos de ejercicio.
2. **Alfabeto de las series de letras.** Propongo el alfabeto español de 27 letras, con **Ñ** y sin CH ni LL. Es lo habitual, pero se confirmará con las instrucciones de los cuestionarios oficiales en la fase 3. Queda configurable.
3. **Tamaño de la muestra para revisión humana.** La ficha de la fase pide «20 preguntas por tipo», pero la skill `aptiq-generator` dice «20 por nivel», que serían 100 por tipo y 600 en total. Propongo **20 por tipo (4 por nivel), 120 en total**: es lo que puede revisar una persona con atención. Si quieres las 600, dímelo.
4. **Quién revisa las muestras.** ¿Las revisas tú, o se las pasamos a un preparador o psicólogo? Está pendiente en `docs/decisiones.md`.
