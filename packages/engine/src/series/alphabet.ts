/**
 * Alfabeto de las series de letras: español de 27 letras, con Ñ y sin CH ni LL (decisión del
 * propietario, 2026-11-12; se confirma con las instrucciones de los cuestionarios oficiales en la
 * fase 3). Las series no dan la vuelta: después de la Z no se vuelve a la A.
 */
export const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

/** Posición 1..27 de una letra (A = 1). */
export const position = (letter: string) => ALPHABET.indexOf(letter) + 1;
export const letterAt = (pos: number) => ALPHABET[pos - 1];
