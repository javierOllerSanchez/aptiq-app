/**
 * Taxonomía de tipos de ejercicio. Un tipo nuevo se añade aquí antes de escribir su generador.
 * Las familias de reglas y la aptitud de cada tipo son provisionales: se contrastan en la fase 3
 * con los cuestionarios oficiales publicados. Los tiempos esperados son una estimación inicial
 * que se calibra con datos reales de uso; no son datos de ninguna oposición.
 */
export const taxonomy = {
  'NUM.SERIE': {
    nombre: 'Series numéricas',
    aptitud: 'numerica',
    descripcion: 'Encontrar el número que continúa una serie que sigue una regla.',
    segundosEsperados: [20, 30, 40, 50, 60],
  },
  'LET.SERIE': {
    nombre: 'Series de letras',
    aptitud: 'abstracta',
    descripcion: 'Encontrar la letra que continúa una serie según saltos en el alfabeto.',
    segundosEsperados: [20, 30, 40, 50, 60],
  },
  'NUM.CALC': {
    nombre: 'Cálculo y porcentajes',
    aptitud: 'numerica',
    descripcion: 'Resolver operaciones, porcentajes, reglas de tres y fracciones.',
    segundosEsperados: [20, 30, 40, 55, 70],
  },
  'COD.CRIPTO': {
    nombre: 'Códigos y criptogramas',
    aptitud: 'atencion',
    descripcion: 'Deducir una clave a partir de un ejemplo y aplicarla.',
    segundosEsperados: [25, 35, 45, 55, 70],
  },
  'VER.ORDEN': {
    nombre: 'Ordenación alfabética',
    aptitud: 'verbal',
    descripcion: 'Ordenar palabras alfabéticamente y localizar la que ocupa un puesto.',
    segundosEsperados: [20, 25, 35, 45, 55],
  },
  'DAT.COMPARA': {
    nombre: 'Comparación de datos',
    aptitud: 'atencion',
    descripcion: 'Contar cuántas filas de dos columnas son exactamente iguales.',
    segundosEsperados: [20, 30, 40, 50, 60],
  },
  'ESP.GIRO': {
    nombre: 'Figuras giradas',
    aptitud: 'espacial',
    descripcion: 'Elegir la figura que es el modelo girado, sin confundirla con su imagen en espejo.',
    segundosEsperados: [20, 25, 35, 45, 55],
  },
  'ABS.FIGURAS': {
    nombre: 'Series de figuras',
    aptitud: 'espacial',
    descripcion: 'Elegir la figura que continúa una serie en la que una flecha gira o un punto avanza.',
    segundosEsperados: [20, 30, 40, 50, 60],
  },
  'ESP.CUBO': {
    nombre: 'Desarrollos de cubos',
    aptitud: 'espacial',
    descripcion: 'Elegir el cubo que se forma al plegar un desarrollo con dibujos en sus caras.',
    segundosEsperados: [30, 40, 50, 60, 75],
  },
  // Verbales redactadas (banco): solo aparecen con preguntas aprobadas por una persona (fase 8).
  'VER.SINON': {
    nombre: 'Sinónimos y antónimos',
    aptitud: 'verbal',
    descripcion: 'Elegir la palabra que significa lo mismo, o lo contrario, que otra.',
    segundosEsperados: [15, 20, 25, 30, 35],
    banco: true,
  },
  'VER.ANALOG': {
    nombre: 'Analogías verbales',
    aptitud: 'verbal',
    descripcion: 'Completar un par de palabras con la misma relación que otro par.',
    segundosEsperados: [20, 25, 30, 40, 50],
    banco: true,
  },
} as const;

export type TypeCode = keyof typeof taxonomy;
export const typeCodes = Object.keys(taxonomy) as TypeCode[];
