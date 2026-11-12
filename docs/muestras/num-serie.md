# Muestras · Series numéricas (`NUM.SERIE`, versión 2)

Encontrar el número que continúa una serie que sigue una regla.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Calcula primero las diferencias entre términos seguidos. Si son iguales, es una suma constante; si crecen deprisa, prueba con multiplicaciones; si saltan arriba y abajo, mira las posiciones pares e impares por separado.

### 1. Nivel 1 · semilla `muestra-1-1`

> ¿Qué número continúa la serie? 48, 52, 56, 60, 64, ?

- **A)** 68 ✔ correcta
- **B)** 69 — Error de cálculo de una unidad (una de más).
- **C)** 78 — Error de una decena al llevar (una de más).
- **D)** 72 — Aplicas el paso + 4 dos veces seguidas.

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 4.
2. **Regla:** Cada número es el anterior + 4.
3. **Aplica:** 64 + 4 = 68

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> ¿Qué número continúa la serie? 36, 42, 48, 54, 60, ?

- **A)** 66 ✔ correcta
- **B)** 67 — Error de cálculo de una unidad (una de más).
- **C)** 76 — Error de una decena al llevar (una de más).
- **D)** 72 — Aplicas el paso + 6 dos veces seguidas.

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 6.
2. **Regla:** Cada número es el anterior + 6.
3. **Aplica:** 60 + 6 = 66

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> ¿Qué número continúa la serie? 1, 4, 7, 10, 13, ?

- **A)** 17 — Error de cálculo de una unidad (una de más).
- **B)** 19 — Aplicas el paso + 3 dos veces seguidas.
- **C)** 10 — Aplicas el paso al revés (− 3).
- **D)** 16 ✔ correcta

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 3.
2. **Regla:** Cada número es el anterior + 3.
3. **Aplica:** 13 + 3 = 16

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> ¿Qué número continúa la serie? 40, 47, 54, 61, 68, ?

- **A)** 74 — Error de cálculo de una unidad (una de menos).
- **B)** 65 — Error de una decena al llevar (una de menos).
- **C)** 75 ✔ correcta
- **D)** 61 — Aplicas el paso al revés (− 7).

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 7.
2. **Regla:** Cada número es el anterior + 7.
3. **Aplica:** 68 + 7 = 75

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> ¿Qué número continúa la serie? 30, 47, 64, 81, 98, ?

- **A)** 105 — Error de una decena al llevar (una de menos).
- **B)** 81 — Aplicas el paso al revés (− 17).
- **C)** 114 — Error de cálculo de una unidad (una de menos).
- **D)** 115 ✔ correcta

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 17.
2. **Regla:** Cada número es el anterior + 17.
3. **Aplica:** 98 + 17 = 115

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> ¿Qué número continúa la serie? 19, 39, 59, 79, 99, ?

- **A)** 119 ✔ correcta
- **B)** 129 — Error de una decena al llevar (una de más).
- **C)** 120 — Error de cálculo de una unidad (una de más).
- **D)** 139 — Aplicas el paso + 20 dos veces seguidas.

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 20.
2. **Regla:** Cada número es el anterior + 20.
3. **Aplica:** 99 + 20 = 119

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> ¿Qué número continúa la serie? 14, 28, 42, 56, 70, ?

- **A)** 85 — Error de cálculo de una unidad (una de más).
- **B)** 98 — Aplicas el paso + 14 dos veces seguidas.
- **C)** 84 ✔ correcta
- **D)** 94 — Error de una decena al llevar (una de más).

1. **Observa:** Entre cada término y el siguiente hay siempre la misma diferencia: + 14.
2. **Regla:** Cada número es el anterior + 14.
3. **Aplica:** 70 + 14 = 84

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> ¿Qué número continúa la serie? 5, 15, 45, 135, 405, ?

- **A)** 1620 — Multiplicas por 4 en lugar de por 3.
- **B)** 3645 — Multiplicas por 3 dos veces.
- **C)** 675 — Sumas la última diferencia (270) en vez de multiplicar: la diferencia no es constante.
- **D)** 1215 ✔ correcta

1. **Observa:** Cada término es 3 veces el anterior: 135 × 3 = 405.
2. **Regla:** Cada número es el anterior × 3.
3. **Aplica:** 405 × 3 = 1215

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> ¿Qué número continúa la serie? 6, 23, 74, 227, 686, ?

- **A)** 1145 — Sumas otra vez la última diferencia (459); no ves que se multiplica.
- **B)** 2062 — Error de cálculo de una unidad (una de menos).
- **C)** 2058 — Multiplicas por 3 pero olvidas el + 5.
- **D)** 2063 ✔ correcta

1. **Observa:** Las diferencias crecen deprisa (17, 51, 153, 459): hay una multiplicación.
2. **Regla:** Cada número es el anterior × 3 + 5.
3. **Aplica:** 686 × 3 + 5 = 2063

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> ¿Qué número continúa la serie? 15, 17, 20, 24, 29, 35, ?

- **A)** 42 ✔ correcta
- **B)** 44 — Error de cálculo de dos unidades (de más).
- **C)** 43 — Aumentas la diferencia dos veces (8).
- **D)** 52 — Error de una decena al llevar (una de más).

1. **Observa:** Las diferencias son 2, 3, 4, 5, 6: aumentan 1 cada vez.
2. **Regla:** Se suma una cantidad que crece 1 en cada paso.
3. **Aplica:** La siguiente diferencia es 6 + 1 = 7; 35 + 7 = 42

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> ¿Qué número continúa la serie? 3, 4, 6, 10, 18, ?

- **A)** 34 ✔ correcta
- **B)** 32 — Cambias el orden: haces − 2 antes de multiplicar.
- **C)** 52 — Multiplicas por 3 en lugar de por 2.
- **D)** 36 — Multiplicas por 2 pero olvidas el − 2.

1. **Observa:** Las diferencias crecen deprisa (1, 2, 4, 8): hay una multiplicación.
2. **Regla:** Cada número es el anterior × 2 − 2.
3. **Aplica:** 18 × 2 − 2 = 34

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> ¿Qué número continúa la serie? 6, 15, 42, 123, 366, ?

- **A)** 1095 ✔ correcta
- **B)** 1094 — Error de cálculo de una unidad (una de menos).
- **C)** 1089 — Cambias el orden: haces − 3 antes de multiplicar.
- **D)** 609 — Sumas otra vez la última diferencia (243); no ves que se multiplica.

1. **Observa:** Las diferencias crecen deprisa (9, 27, 81, 243): hay una multiplicación.
2. **Regla:** Cada número es el anterior × 3 − 3.
3. **Aplica:** 366 × 3 − 3 = 1095

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> ¿Qué número continúa la serie? 11, 12, 16, 24, 37, 56, 82, ?

- **A)** 118 — Error de cálculo de dos unidades (de más).
- **B)** 116 ✔ correcta
- **C)** 117 — Aumentas el aumento dos veces (1 de más).
- **D)** 126 — Error de una decena al llevar (una de más).

1. **Observa:** Las diferencias son 1, 4, 8, 13, 19, 26, y las diferencias entre ellas, 3, 4, 5, 6, 7: también crecen, 1 cada vez.
2. **Regla:** La diferencia aumenta cada vez 1 más que la vez anterior.
3. **Aplica:** Aumento siguiente: 7 + 1 = 8; diferencia: 26 + 8 = 34; 82 + 34 = 116

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> ¿Qué número continúa la serie? 20, 43, 23, 38, 26, 33, 29, ?

- **A)** 32 — Continúas la serie de las posiciones impares (29 + 3) cuando toca la de las pares.
- **B)** 38 — Aplicas el paso de la serie par al revés (+ 5).
- **C)** 25 — Tratas todo como una sola serie y repites la última diferencia.
- **D)** 28 ✔ correcta

1. **Observa:** Los términos en posición impar (20, 23, 26, 29) y en posición par (43, 38, 33) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 3; la de las pares va − 5.
3. **Aplica:** Toca la serie de las posiciones pares: 33 − 5 = 28

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> ¿Qué número continúa la serie? 8, 52, 14, 55, 20, 58, 26, ?

- **A)** 61 ✔ correcta
- **B)** 55 — Aplicas el paso de la serie par al revés (− 3).
- **C)** 64 — Aplicas el paso de la serie par (+ 3) dos veces.
- **D)** 32 — Continúas la serie de las posiciones impares (26 + 6) cuando toca la de las pares.

1. **Observa:** Los términos en posición impar (8, 14, 20, 26) y en posición par (52, 55, 58) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 6; la de las pares va + 3.
3. **Aplica:** Toca la serie de las posiciones pares: 58 + 3 = 61

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> ¿Qué número continúa la serie? 14, 32, 22, 36, 30, 40, 38, ?

- **A)** 44 ✔ correcta
- **B)** 36 — Tratas todo como una sola serie y repites la última diferencia.
- **C)** 46 — Continúas la serie de las posiciones impares (38 + 8) cuando toca la de las pares.
- **D)** 43 — Error de cálculo de una unidad (una de menos).

1. **Observa:** Los términos en posición impar (14, 22, 30, 38) y en posición par (32, 36, 40) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 8; la de las pares va + 4.
3. **Aplica:** Toca la serie de las posiciones pares: 40 + 4 = 44

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> ¿Qué número continúa la serie? 6, 9, 11, 18, 16, 36, 21, 72, 26, ?

- **A)** 31 — Continúas la serie de las posiciones impares (26 + 5) cuando toca la de las pares.
- **B)** 145 — Error de cálculo de una unidad (una de más).
- **C)** 288 — Multiplicas por 2 dos veces.
- **D)** 144 ✔ correcta

1. **Observa:** Los términos en posición impar (6, 11, 16, 21, 26) y en posición par (9, 18, 36, 72) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 5; la de las pares va × 2.
3. **Aplica:** Toca la serie de las posiciones pares: 72 × 2 = 144

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> ¿Qué número continúa la serie? 15, 2, 22, 6, 29, 18, 36, 54, 43, ?

- **A)** 32 — Tratas todo como una sola serie y repites la última diferencia.
- **B)** 486 — Multiplicas por 3 dos veces.
- **C)** 162 ✔ correcta
- **D)** 50 — Continúas la serie de las posiciones impares (43 + 7) cuando toca la de las pares.

1. **Observa:** Los términos en posición impar (15, 22, 29, 36, 43) y en posición par (2, 6, 18, 54) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 7; la de las pares va × 3.
3. **Aplica:** Toca la serie de las posiciones pares: 54 × 3 = 162

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> ¿Qué número continúa la serie? 12, 2, 19, 6, 26, 18, 33, 54, 40, ?

- **A)** 162 ✔ correcta
- **B)** 47 — Continúas la serie de las posiciones impares (40 + 7) cuando toca la de las pares.
- **C)** 26 — Tratas todo como una sola serie y repites la última diferencia.
- **D)** 90 — Sumas la última diferencia de la serie par (36) en vez de multiplicar.

1. **Observa:** Los términos en posición impar (12, 19, 26, 33, 40) y en posición par (2, 6, 18, 54) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 7; la de las pares va × 3.
3. **Aplica:** Toca la serie de las posiciones pares: 54 × 3 = 162

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> ¿Qué número continúa la serie? 13, 4, 17, 8, 21, 16, 25, 32, 29, ?

- **A)** 26 — Tratas todo como una sola serie y repites la última diferencia.
- **B)** 128 — Multiplicas por 2 dos veces.
- **C)** 64 ✔ correcta
- **D)** 33 — Continúas la serie de las posiciones impares (29 + 4) cuando toca la de las pares.

1. **Observa:** Los términos en posición impar (13, 17, 21, 25, 29) y en posición par (4, 8, 16, 32) siguen reglas distintas.
2. **Regla:** Hay dos series intercaladas: la de las posiciones impares suma 4; la de las pares va × 2.
3. **Aplica:** Toca la serie de las posiciones pares: 32 × 2 = 64

- [ ] Revisada · Comentarios:
