---
name: aptiq-generator
description: Usar al crear, modificar o probar un generador de preguntas psicotécnicas de Aptiq (packages/engine): interfaz, solucionador, distractores, explicaciones paso a paso y pruebas.
---

# Generadores de preguntas de Aptiq

Cada pregunta de Aptiq es original, nace de un patrón de examen oficial, tiene **exactamente una** respuesta correcta y lleva su explicación paso a paso. Un generador que no garantiza esto no se publica.

## Principios de contenido (no negociables)

1. Los exámenes oficiales publicados solo se usan para extraer patrones. **Nunca** se copia una pregunta oficial, ni literal ni con cambios mínimos.
2. Toda pregunta lleva:
   - observación (qué mirar primero);
   - regla;
   - aplicación con el cálculo;
   - por qué falla cada opción incorrecta;
   - truco de examen.
3. Ante la mínima ambigüedad, la pregunta se descarta.
4. Las preguntas verbales (sinónimos, analogías, comprensión, silogismos) no se generan por código. Se redactan y quedan en `status: 'draft'` hasta que una persona las aprueba. Un borrador de IA nunca se publica sin aprobación.

## Interfaz

```ts
export type Level = 1 | 2 | 3 | 4 | 5;

export interface Item {
  id: string;              // `${type}:${version}:${seed}:${level}`
  type: TypeCode;          // p. ej. 'NUM.SERIE.ARIT'
  level: Level;
  seed: string;
  stem: Stem;              // texto y/o datos estructurados (serie, tabla, figura SVG)
  options: Option[];       // longitud = opciones del perfil de examen (3 o 4)
  answerIndex: number;
  explanation: {
    observe: string;
    rule: string;
    apply: string;
    distractors: { optionIndex: number; error: string }[];
    tip: string;
  };
  meta: { expectedSeconds: number; generatorVersion: string };
}

export interface Generator {
  type: TypeCode;
  version: string;         // subir si cambia la salida para una misma semilla
  levels: Level[];
  generate(seed: string, level: Level, optionCount: 3 | 4): Item;
}

export interface Solver {
  type: TypeCode;
  // Resuelve SIN datos internos del generador: solo enunciado y opciones.
  validOptions(item: Item): number[];
}
```

## Cómo escribir un generador

1. **Familia de reglas** del tipo, sacada del análisis de exámenes oficiales. Para series: aritmética, geométrica, ×a+b, diferencias crecientes, dos series intercaladas.
2. **Parámetros por nivel:** tamaño de los números, pasos de la regla, términos visibles. El nivel 1 se resuelve en segundos; el 5 equivale a las preguntas más difíciles publicadas.
3. **Construir la respuesta** aplicando la regla.
4. **Distractores a partir de errores típicos**, cada uno con su explicación:
   - un paso de menos o de más;
   - confundir suma y producto;
   - ver solo la primera diferencia;
   - ±1 o ±10 por error de cálculo.

   Prohibidos los distractores absurdos.
5. **Validar con el solucionador:** `validOptions(item)` debe devolver exactamente `[answerIndex]`. Si no, se regenera con `${seed}:retry:${n}` (máximo 20 intentos; agotarlos es un error del generador).
6. **Explicación generada desde la regla**, nunca escrita aparte.
7. **Barajar opciones** con el PRNG sembrado.

## Determinismo

- Prohibido `Math.random`, `Date.now` y cualquier fuente no sembrada. Usar `createRng(seed)` del paquete.
- Misma semilla + nivel + opciones + versión = misma pregunta, en la app y en el servidor.

## Estilo de las explicaciones

Español de España, tuteo, máximo cinco pasos, frases cortas, números concretos. Ejemplo para la serie 3, 7, 15, 31, ?:

1. **Observa:** las diferencias son 4, 8, 16, se duplican.
2. **Regla:** cada número es el anterior × 2 + 1.
3. **Aplica:** 31 × 2 + 1 = 63.
4. **Error:** 47 sale de sumar otra vez 16 (no ver que la diferencia se duplica).
5. **Truco:** si las diferencias crecen deprisa, prueba con multiplicaciones antes que con sumas.

## Pruebas obligatorias (primero las pruebas)

Vitest + fast-check, por generador:

- **Unicidad:** el solucionador encuentra exactamente una opción válida.
- **Determinismo.**
- **Opciones:** distintas entre sí y en el número correcto.
- **Coherencia:** el resultado de `apply` coincide con la opción correcta.
- **Distractores:** cada uno con su error explicado.
- **Volumen:** 1.000 por tipo y nivel en `pnpm test`; 10.000 con `pnpm test:stress` (nocturno y al cerrar fase).
- **Instantáneas** de una muestra fija de semillas. Si cambian, subir `version`.

## Taxonomía

Los códigos de tipo viven en `packages/engine/src/taxonomy.ts`. Un tipo nuevo se añade allí (descripción, niveles, tiempo esperado) antes de escribir su generador.

## Al terminar un generador

Exportar 20 preguntas de muestra por nivel a `docs/muestras/<tipo>.md` (enunciado, opciones, solución y explicación) para revisión humana, y pedir al subagente `revisor-contenido` que lo audite.
