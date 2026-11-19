import type { TypeCode } from './taxonomy';

/**
 * Fichas de método por tipo (EXP-04): cómo atacar cada tipo de ejercicio, sus errores típicos y un
 * truco. Texto propio, sin preguntas de examen. Se muestran también en el plan gratuito.
 */
export interface Method {
  pasos: string[];
  errores: string[];
  truco: string;
}

export const methods: Record<TypeCode, Method> = {
  'NUM.SERIE': {
    pasos: [
      'Escribe debajo de la serie la diferencia entre cada número y el siguiente.',
      'Si las diferencias son iguales, es una suma constante; si crecen o decrecen con orden, mira la serie de diferencias.',
      'Si las diferencias crecen muy deprisa, prueba a dividir cada número entre el anterior: puede ser una multiplicación.',
      'Si nada encaja, separa los números en posición impar y par: pueden ser dos series intercaladas.',
      'Comprueba la regla con todos los números antes de calcular el siguiente.',
    ],
    errores: ['Fijarse solo en la primera diferencia.', 'Confundir suma y multiplicación.', 'No ver dos series mezcladas.'],
    truco: 'Si en medio minuto no ves la regla, marca la pregunta y sigue: suele salir a la segunda lectura.',
  },
  'LET.SERIE': {
    pasos: [
      'Pasa cada letra a su número en el alfabeto español (A = 1, Ñ = 15, Z = 27).',
      'Calcula los saltos entre letras como si fuera una serie numérica.',
      'Comprueba si hay dos series intercaladas o saltos que cambian con un orden.',
      'Aplica el salto y vuelve a pasar el número a letra.',
    ],
    errores: ['Olvidar la Ñ al contar.', 'Contar la letra de partida como un salto.', 'Suponer que después de la Z vuelve la A.'],
    truco: 'Ten a mano el alfabeto con la Ñ y cuenta con el dedo: así no te saltas ninguna letra.',
  },
  'NUM.CALC': {
    pasos: [
      'Lee la pregunta hasta el final y subraya qué te piden calcular.',
      'Antes de operar, estima el resultado redondeando: te servirá para descartar opciones.',
      'Para porcentajes, convierte a decimal (15 % = 0,15) y multiplica.',
      'En reglas de tres, comprueba si las magnitudes son directas o inversas.',
      'Opera con cuidado y compara con tu estimación.',
    ],
    errores: ['Aplicar el porcentaje sobre la cantidad equivocada.', 'Tratar una proporción inversa como directa.', 'Errores de cálculo con decimales.'],
    truco: 'Muchas opciones se descartan solo con la estimación: si dudas entre dos, haz la cuenta exacta solo de esas.',
  },
  'COD.CRIPTO': {
    pasos: [
      'Pon el ejemplo en clave debajo del original, carácter a carácter.',
      'Busca la regla: cada letra se cambia por otra fija, se desplaza un número de posiciones o se cambia de lugar.',
      'Comprueba la regla con todos los caracteres del ejemplo.',
      'Aplícala a la palabra nueva, de izquierda a derecha.',
    ],
    errores: ['Deducir la regla con un solo carácter.', 'Desplazar en el sentido contrario.', 'Saltarse una letra repetida.'],
    truco: 'Escribe la tabla de equivalencias a un lado: luego solo tienes que copiar.',
  },
  'VER.ORDEN': {
    pasos: [
      'Compara las palabras por la primera letra; si coincide, por la segunda, y así.',
      'Recuerda que la Ñ va después de la N y que CH y LL ya no son letras aparte.',
      'Ordena solo lo necesario: si piden la tercera palabra, no hace falta ordenar todas.',
      'Comprueba el resultado leyendo la lista de arriba abajo.',
    ],
    errores: ['Ordenar CH o LL como letras propias.', 'Colocar la Ñ antes de la N.', 'Perder la cuenta de la posición pedida.'],
    truco: 'Agrupa las palabras por su primera letra: casi siempre la respuesta sale mirando un solo grupo.',
  },
  'DAT.COMPARA': {
    pasos: [
      'Compara cada pareja de izquierda a derecha, por bloques de tres o cuatro caracteres.',
      'Señala con el dedo o el lápiz el bloque que comparas.',
      'Busca sobre todo cifras que cambian de lugar y letras que se parecen a cifras.',
      'Lleva la cuenta de las filas iguales, no de las distintas.',
    ],
    errores: ['Contar las filas distintas en lugar de las iguales.', 'Pasar por alto dos cifras intercambiadas.', 'Confundir O con 0 o I con 1.'],
    truco: 'Lee cada fila una sola vez y con calma: volver atrás cuesta más tiempo que ir despacio.',
  },
  'ESP.GIRO': {
    pasos: [
      'Elige en el modelo un detalle fácil de seguir: un cuadro que sobresale, una muesca o una esquina.',
      'Fíjate hacia qué lado mira ese detalle respecto al resto de la figura.',
      'Descarta las opciones en las que el detalle mira al lado contrario: son el modelo en espejo.',
      'Con las que quedan, gira mentalmente el modelo y compara cuadro a cuadro.',
    ],
    errores: ['Confundir el giro con el espejo.', 'No ver un cuadro cambiado de sitio.', 'Girar en el sentido equivocado.'],
    truco: 'Girar nunca cambia hacia qué lado mira un detalle respecto al resto; el espejo sí. Empieza siempre por ahí.',
  },
  'ABS.FIGURAS': {
    pasos: [
      'Sigue un solo elemento cada vez: primero la flecha, luego el punto.',
      'Anota cuánto gira o avanza ese elemento de una figura a la siguiente.',
      'Si los pasos no son iguales, comprueba si se alternan (uno corto, uno largo).',
      'Aplica a la última figura el paso de cada elemento y busca la opción que lo cumpla todo.',
    ],
    errores: ['Mirar la serie entera de golpe.', 'Girar en el sentido contrario.', 'No ver que los pasos se alternan.'],
    truco: 'Resuelve primero el elemento más claro y descarta: casi siempre quedan solo dos opciones.',
  },
  'ESP.CUBO': {
    pasos: [
      'Busca las caras opuestas del desarrollo: nunca se ven juntas en el cubo.',
      'Descarta las opciones que muestran dos caras opuestas a la vez.',
      'Elige una esquina del desarrollo y nombra sus tres caras en el sentido de las agujas del reloj.',
      'Comprueba ese orden en cada cubo: en un espejo se invierte.',
      'Si un dibujo tiene dirección, mira hacia qué cara vecina apunta: en el cubo apunta a la misma.',
    ],
    errores: ['Juntar dos caras opuestas.', 'Confundir el cubo con su imagen en espejo.', 'Olvidar hacia dónde apunta una flecha.'],
    truco: 'Empieza siempre por descartar: casi siempre quedan dos opciones antes de mirar la orientación.',
  },
  'VER.SINON': {
    pasos: [
      'Lee si te piden lo mismo (sinónimo) o lo contrario (antónimo).',
      'Piensa una frase corta con la palabra del enunciado.',
      'Sustituye la palabra por cada opción: el sinónimo no cambia el sentido; el antónimo lo da la vuelta.',
      'Descarta las palabras que solo se parecen en la forma (parónimos).',
    ],
    errores: ['Elegir el antónimo cuando piden el sinónimo, o al revés.', 'Dejarse llevar por una palabra que suena parecida.', 'Elegir una palabra relacionada pero no equivalente.'],
    truco: 'El antónimo suele estar entre las opciones como trampa: localízalo primero y sabrás qué buscar.',
  },
  'VER.ANALOG': {
    pasos: [
      'Di en una frase qué une las dos palabras del primer par («el pez se mueve nadando»).',
      'Aplica la misma frase al segundo par cambiando solo la palabra conocida.',
      'Si encajan varias opciones, haz la frase más concreta.',
      'Comprueba que la relación va en el mismo sentido en los dos pares.',
    ],
    errores: ['Invertir la relación (parte y todo al revés).', 'Elegir una palabra relacionada con el tema pero no con la relación.', 'Quedarse con una frase demasiado vaga.'],
    truco: 'Las relaciones más comunes: parte y todo, herramienta y uso, causa y efecto, oficio y producto, contrarios y grados.',
  },
};
