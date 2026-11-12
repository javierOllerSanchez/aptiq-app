# Muestras · Series de letras (`LET.SERIE`, versión 1)

Encontrar la letra que continúa una serie según saltos en el alfabeto.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Escribe debajo de cada letra su posición en el alfabeto (A = 1… Z = 27) y trabaja con números. No olvides la Ñ, que va después de la N.

### 1. Nivel 1 · semilla `muestra-1-1`

> ¿Qué letra continúa la serie? I, K, M, Ñ, P, R, ?

- **A)** S — Cuentas una letra de menos.
- **B)** T ✔ correcta
- **C)** V — Aplicas el salto (+ 2) dos veces.
- **D)** U — Cuentas una letra de más.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones después de la anterior.
3. **Aplica:** R (19) + 2 = T (21) → T

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> ¿Qué letra continúa la serie? G, J, M, O, R, ?

- **A)** X — Aplicas el salto (+ 3) dos veces.
- **B)** U ✔ correcta
- **C)** T — Cuentas una letra de menos.
- **D)** V — Cuentas una letra de más.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones después de la anterior.
3. **Aplica:** R (19) + 3 = U (22) → U

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> ¿Qué letra continúa la serie? K, M, Ñ, P, R, ?

- **A)** U — Cuentas una letra de más.
- **B)** T ✔ correcta
- **C)** S — Cuentas una letra de menos.
- **D)** V — Aplicas el salto (+ 2) dos veces.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones después de la anterior.
3. **Aplica:** R (19) + 2 = T (21) → T

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> ¿Qué letra continúa la serie? E, H, K, N, P, S, ?

- **A)** Y — Aplicas el salto (+ 3) dos veces.
- **B)** U — Cuentas una letra de menos.
- **C)** V ✔ correcta
- **D)** W — Cuentas una letra de más.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones después de la anterior.
3. **Aplica:** S (20) + 3 = V (23) → V

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> ¿Qué letra continúa la serie? F, I, L, Ñ, Q, T, ?

- **A)** X — Cuentas una letra de más.
- **B)** Z — Aplicas el salto (+ 3) dos veces.
- **C)** V — Cuentas una letra de menos.
- **D)** W ✔ correcta

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones después de la anterior.
3. **Aplica:** T (21) + 3 = W (24) → W

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> ¿Qué letra continúa la serie? J, L, N, O, ?

- **A)** S — Aplicas el salto (+ 2) dos veces.
- **B)** Q ✔ correcta
- **C)** R — Cuentas una letra de más.
- **D)** P — Cuentas una letra de menos.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones después de la anterior.
3. **Aplica:** O (16) + 2 = Q (18) → Q

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> ¿Qué letra continúa la serie? P, Ñ, M, K, ?

- **A)** G — Aplicas el salto (− 2) dos veces.
- **B)** H — Cuentas una letra de menos.
- **C)** J — Cuentas una letra de más.
- **D)** I ✔ correcta

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones antes de la anterior.
3. **Aplica:** K (11) − 2 = I (9) → I

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> ¿Qué letra continúa la serie? M, K, I, G, E, ?

- **A)** D — Cuentas una letra de más.
- **B)** B — Cuentas una letra de menos.
- **C)** A — Aplicas el salto (− 2) dos veces.
- **D)** C ✔ correcta

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones antes de la anterior.
3. **Aplica:** E (5) − 2 = C (3) → C

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> ¿Qué letra continúa la serie? A, D, H, M, R, ?

- **A)** Y ✔ correcta
- **B)** Z — Aumentas el salto dos veces.
- **C)** U — Vuelves a usar el primer salto (+ 3) en vez del que toca.
- **D)** X — Repites el último salto (+ 6) sin aumentarlo.

1. **Observa:** Los saltos entre letras son + 3, + 4, + 5, + 6: su tamaño crece 1 cada vez.
2. **Regla:** El salto aumenta 1 en cada paso.
3. **Aplica:** El siguiente salto es + 7: R (19) + 7 = Y (26) → Y

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> ¿Qué letra continúa la serie? Z, W, S, Ñ, I, ?

- **A)** F — Vuelves a usar el primer salto (− 3) en vez del que toca.
- **B)** C — Repites el último salto (− 6) sin aumentarlo.
- **C)** A — Aumentas el salto dos veces.
- **D)** B ✔ correcta

1. **Observa:** Los saltos entre letras son − 3, − 4, − 5, − 6: su tamaño crece 1 cada vez.
2. **Regla:** El salto aumenta 1 en cada paso, yendo hacia atrás en el alfabeto.
3. **Aplica:** El siguiente salto es − 7: I (9) − 7 = B (2) → B

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> ¿Qué letra continúa la serie? A, D, H, M, R, ?

- **A)** Z — Aumentas el salto dos veces.
- **B)** Y ✔ correcta
- **C)** X — Repites el último salto (+ 6) sin aumentarlo.
- **D)** U — Vuelves a usar el primer salto (+ 3) en vez del que toca.

1. **Observa:** Los saltos entre letras son + 3, + 4, + 5, + 6: su tamaño crece 1 cada vez.
2. **Regla:** El salto aumenta 1 en cada paso.
3. **Aplica:** El siguiente salto es + 7: R (19) + 7 = Y (26) → Y

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> ¿Qué letra continúa la serie? A, C, F, J, Ñ, ?

- **A)** S — Repites el último salto (+ 5) sin aumentarlo.
- **B)** T ✔ correcta
- **C)** U — Aumentas el salto dos veces.
- **D)** P — Vuelves a usar el primer salto (+ 2) en vez del que toca.

1. **Observa:** Los saltos entre letras son + 2, + 3, + 4, + 5: su tamaño crece 1 cada vez.
2. **Regla:** El salto aumenta 1 en cada paso.
3. **Aplica:** El siguiente salto es + 6: Ñ (15) + 6 = T (21) → T

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> ¿Qué letra continúa la serie? B, G, E, I, H, K, K, ?

- **A)** M ✔ correcta
- **B)** N — Continúas la serie de las posiciones impares (K + 3).
- **C)** L — Cuentas una letra de menos.
- **D)** I — Aplicas el salto de las pares en sentido contrario.

1. **Observa:** Las letras en posición impar (B, E, H, K) y en posición par (G, I, K) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares + 2.
3. **Aplica:** Toca la serie de las posiciones pares: K (11) + 2 = M (13) → M

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> ¿Qué letra continúa la serie? B, I, E, M, H, P, K, ?

- **A)** M — Aplicas el salto de las pares en sentido contrario.
- **B)** N — Continúas la serie de las posiciones impares (K + 3).
- **C)** T ✔ correcta
- **D)** U — Cuentas una letra de más.

1. **Observa:** Las letras en posición impar (B, E, H, K) y en posición par (I, M, P) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares + 4.
3. **Aplica:** Toca la serie de las posiciones pares: P (17) + 4 = T (21) → T

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> ¿Qué letra continúa la serie? G, E, H, I, I, M, J, ?

- **A)** K — Continúas la serie de las posiciones impares (J + 1).
- **B)** Q — Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.
- **C)** P ✔ correcta
- **D)** I — Aplicas el salto de las pares en sentido contrario.

1. **Observa:** Las letras en posición impar (G, H, I, J) y en posición par (E, I, M) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 1 y las pares + 4.
3. **Aplica:** Toca la serie de las posiciones pares: M (13) + 4 = P (17) → P

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> ¿Qué letra continúa la serie? L, C, Ñ, E, Q, G, T, ?

- **A)** J — Cuentas una letra de más.
- **B)** W — Continúas la serie de las posiciones impares (T + 3).
- **C)** E — Aplicas el salto de las pares en sentido contrario.
- **D)** I ✔ correcta

1. **Observa:** Las letras en posición impar (L, Ñ, Q, T) y en posición par (C, E, G) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares + 2.
3. **Aplica:** Toca la serie de las posiciones pares: G (7) + 2 = I (9) → I

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> ¿Qué letra continúa la serie? H, M, K, K, N, I, P, ?

- **A)** K — Aplicas el salto de las pares en sentido contrario.
- **B)** G ✔ correcta
- **C)** S — Continúas la serie de las posiciones impares (P + 3).
- **D)** H — Cuentas una letra de más.

1. **Observa:** Las letras en posición impar (H, K, N, P) y en posición par (M, K, I) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares − 2.
3. **Aplica:** Toca la serie de las posiciones pares: I (9) − 2 = G (7) → G

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> ¿Qué letra continúa la serie? E, O, H, M, K, J, N, ?

- **A)** M — Aplicas el salto de las pares en sentido contrario.
- **B)** G ✔ correcta
- **C)** P — Continúas la serie de las posiciones impares (N + 3).
- **D)** H — Cuentas una letra de más.

1. **Observa:** Las letras en posición impar (E, H, K, N) y en posición par (O, M, J) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares − 3.
3. **Aplica:** Toca la serie de las posiciones pares: J (10) − 3 = G (7) → G

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> ¿Qué letra continúa la serie? N, Q, Ñ, O, O, N, P, ?

- **A)** L ✔ correcta
- **B)** M — Cuentas una letra de más.
- **C)** O — Aplicas el salto de las pares en sentido contrario.
- **D)** Q — Continúas la serie de las posiciones impares (P + 1).

1. **Observa:** Las letras en posición impar (N, Ñ, O, P) y en posición par (Q, O, N) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 1 y las pares − 2.
3. **Aplica:** Toca la serie de las posiciones pares: N (14) − 2 = L (12) → L

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> ¿Qué letra continúa la serie? K, T, N, P, P, M, S, ?

- **A)** I ✔ correcta
- **B)** P — Aplicas el salto de las pares en sentido contrario.
- **C)** J — Cuentas una letra de más.
- **D)** V — Continúas la serie de las posiciones impares (S + 3).

1. **Observa:** Las letras en posición impar (K, N, P, S) y en posición par (T, P, M) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 3 y las pares − 4.
3. **Aplica:** Toca la serie de las posiciones pares: M (13) − 4 = I (9) → I

- [ ] Revisada · Comentarios:
