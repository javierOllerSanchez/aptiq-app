# Muestras · Series de letras (`LET.SERIE`, versión 2)

Encontrar la letra que continúa una serie según saltos en el alfabeto.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Escribe debajo de cada letra su posición en el alfabeto (A = 1… Z = 27) y trabaja con números. No olvides la Ñ, que va después de la N.

### 1. Nivel 1 · semilla `muestra-1-1`

> ¿Qué letra continúa la serie? M, Ñ, P, R, ?

- **A)** T ✔ correcta
- **B)** V — Aplicas el salto (+ 2) dos veces.
- **C)** P — Aplicas el salto en sentido contrario (− 2).
- **D)** U — Cuentas una letra de más.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones después de la anterior.
3. **Aplica:** R (19) + 2 = T (21) → T

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> ¿Qué letra continúa la serie? B, C, D, E, F, ?

- **A)** J — Cuentas tres letras de más.
- **B)** I — Cuentas dos letras de más.
- **C)** G ✔ correcta
- **D)** H — Aplicas el salto (+ 1) dos veces.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 1 posiciones.
2. **Regla:** Cada letra está 1 posiciones después de la anterior.
3. **Aplica:** F (6) + 1 = G (7) → G

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> ¿Qué letra continúa la serie? B, C, D, E, F, G, ?

- **A)** G — Cuentas una letra de menos.
- **B)** F — Aplicas el salto en sentido contrario (− 1).
- **C)** H ✔ correcta
- **D)** E — Cuentas tres letras de menos.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 1 posiciones.
2. **Regla:** Cada letra está 1 posiciones después de la anterior.
3. **Aplica:** G (7) + 1 = H (8) → H

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> ¿Qué letra continúa la serie? B, C, D, E, ?

- **A)** G — Aplicas el salto (+ 1) dos veces.
- **B)** I — Cuentas tres letras de más.
- **C)** H — Cuentas dos letras de más.
- **D)** F ✔ correcta

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: + 1 posiciones.
2. **Regla:** Cada letra está 1 posiciones después de la anterior.
3. **Aplica:** E (5) + 1 = F (6) → F

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> ¿Qué letra continúa la serie? Y, V, S, P, ?

- **A)** S — Aplicas el salto en sentido contrario (+ 3).
- **B)** M — Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.
- **C)** N ✔ correcta
- **D)** K — Aplicas el salto (− 3) dos veces.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones antes de la anterior.
3. **Aplica:** P (17) − 3 = N (14) → N

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> ¿Qué letra continúa la serie? Z, W, T, Q, ?

- **A)** Ñ ✔ correcta
- **B)** N — Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.
- **C)** T — Aplicas el salto en sentido contrario (+ 3).
- **D)** O — Cuentas una letra de menos.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones antes de la anterior.
3. **Aplica:** Q (18) − 3 = Ñ (15) → Ñ

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> ¿Qué letra continúa la serie? Ñ, M, K, I, G, ?

- **A)** C — Aplicas el salto (− 2) dos veces.
- **B)** B — Cuentas tres letras de más.
- **C)** D — Cuentas una letra de más.
- **D)** E ✔ correcta

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 2 posiciones.
2. **Regla:** Cada letra está 2 posiciones antes de la anterior.
3. **Aplica:** G (7) − 2 = E (5) → E

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> ¿Qué letra continúa la serie? W, T, Q, Ñ, L, I, ?

- **A)** F ✔ correcta
- **B)** L — Aplicas el salto en sentido contrario (+ 3).
- **C)** H — Cuentas dos letras de menos.
- **D)** G — Cuentas una letra de menos.

1. **Observa:** Entre cada letra y la siguiente hay siempre el mismo salto: − 3 posiciones.
2. **Regla:** Cada letra está 3 posiciones antes de la anterior.
3. **Aplica:** I (9) − 3 = F (6) → F

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> ¿Qué letra continúa la serie? W, Q, M, I, F, ?

- **A)** C — Repites el último salto (− 3) sin cambiarlo.
- **B)** B — Cuentas dos letras de más.
- **C)** D ✔ correcta
- **D)** E — Cambias el salto dos veces (− 1).

1. **Observa:** Los saltos entre letras son − 6, − 5, − 4, − 3: su tamaño decrece de uno en uno.
2. **Regla:** El tamaño del salto decrece 1 en cada paso, yendo hacia atrás en el alfabeto.
3. **Aplica:** El siguiente salto es − 2: F (6) − 2 = D (4) → D

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> ¿Qué letra continúa la serie? W, U, R, Ñ, J, ?

- **A)** C — Cambias el salto dos veces (− 7).
- **B)** E — Repites el último salto (− 5) sin cambiarlo.
- **C)** D ✔ correcta
- **D)** H — Vuelves a usar el primer salto (− 2).

1. **Observa:** Los saltos entre letras son − 2, − 3, − 4, − 5: su tamaño crece de uno en uno.
2. **Regla:** El tamaño del salto crece 1 en cada paso, yendo hacia atrás en el alfabeto.
3. **Aplica:** El siguiente salto es − 6: J (10) − 6 = D (4) → D

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> ¿Qué letra continúa la serie? D, E, G, J, N, ?

- **A)** R ✔ correcta
- **B)** U — Cuentas tres letras de más.
- **C)** S — Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.
- **D)** T — Cuentas dos letras de más.

1. **Observa:** Los saltos entre letras son + 1, + 2, + 3, + 4: su tamaño crece de uno en uno.
2. **Regla:** El tamaño del salto crece 1 en cada paso.
3. **Aplica:** El siguiente salto es + 5: N (14) + 5 = R (19) → R

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> ¿Qué letra continúa la serie? C, I, N, Q, T, ?

- **A)** U — Cambias el salto dos veces (+ 1).
- **B)** S — Cuentas tres letras de menos.
- **C)** V ✔ correcta
- **D)** T — Cuentas dos letras de menos.

1. **Observa:** Los saltos entre letras son + 6, + 5, + 4, + 3: su tamaño decrece de uno en uno.
2. **Regla:** El tamaño del salto decrece 1 en cada paso.
3. **Aplica:** El siguiente salto es + 2: T (21) + 2 = V (23) → V

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> ¿Qué letra continúa la serie? E, F, I, J, M, N, ?

- **A)** P ✔ correcta
- **B)** Ñ — Repites el último salto (+ 1); no ves que se alternan.
- **C)** Q — Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.
- **D)** R — Cuentas dos letras de más.

1. **Observa:** Los saltos se alternan: + 1, + 3, + 1, + 3…
2. **Regla:** Se alternan dos saltos: + 1 y + 3.
3. **Aplica:** El último salto fue + 1, ahora toca + 3: N (14) + 3 = P (17) → P

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> ¿Qué letra continúa la serie? A, N, C, P, E, S, G, ?

- **A)** Y — Aplicas el salto de las pares (+ 3) dos veces.
- **B)** X — Cuentas dos letras de más.
- **C)** W — Cuentas una letra de más.
- **D)** V ✔ correcta

1. **Observa:** Las letras en posición impar (A, C, E, G) y en posición par (N, P, S) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 2 y las pares + 3.
3. **Aplica:** Toca la serie de las posiciones pares: S (20) + 3 = V (23) → V

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> ¿Qué letra continúa la serie? G, H, L, M, P, Q, ?

- **A)** U ✔ correcta
- **B)** R — Repites el último salto (+ 1); no ves que se alternan.
- **C)** N — Aplicas + 4 en sentido contrario.
- **D)** T — Cuentas una letra de menos.

1. **Observa:** Los saltos se alternan: + 1, + 4, + 1, + 4…
2. **Regla:** Se alternan dos saltos: + 1 y + 4.
3. **Aplica:** El último salto fue + 1, ahora toca + 4: Q (18) + 4 = U (22) → U

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> ¿Qué letra continúa la serie? B, E, I, L, O, R, ?

- **A)** Y — Aplicas los dos saltos a la vez.
- **B)** U — Repites el último salto (+ 3); no ves que se alternan.
- **C)** V ✔ correcta
- **D)** Ñ — Aplicas + 4 en sentido contrario.

1. **Observa:** Los saltos se alternan: + 3, + 4, + 3, + 4…
2. **Regla:** Se alternan dos saltos: + 3 y + 4.
3. **Aplica:** El último salto fue + 3, ahora toca + 4: R (19) + 4 = V (23) → V

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> ¿Qué letra continúa la serie? D, H, F, J, H, L, ?

- **A)** K — Cuentas una letra de menos.
- **B)** J ✔ correcta
- **C)** O — Repites el último salto (+ 4); no ves que se alternan.
- **D)** N — Aplicas los dos saltos a la vez.

1. **Observa:** Los saltos se alternan: + 4, − 2, + 4, − 2…
2. **Regla:** Se alternan dos saltos: + 4 y − 2.
3. **Aplica:** El último salto fue + 4, ahora toca − 2: L (12) − 2 = J (10) → J

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> ¿Qué letra continúa la serie? C, Y, D, U, E, Q, F, ?

- **A)** Ñ — Cuentas una letra de menos.
- **B)** R — Aplicas a la serie de las pares el salto de las impares (+ 1).
- **C)** N ✔ correcta
- **D)** O — Cuentas dos letras de menos.

1. **Observa:** Las letras en posición impar (C, D, E, F) y en posición par (Y, U, Q) forman dos series distintas.
2. **Regla:** Hay dos series intercaladas: las impares van + 1 y las pares − 4.
3. **Aplica:** Toca la serie de las posiciones pares: Q (18) − 4 = N (14) → N

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> ¿Qué letra continúa la serie? H, L, G, K, F, J, ?

- **A)** D — Cuentas una letra de más.
- **B)** N — Repites el último salto (+ 4); no ves que se alternan.
- **C)** C — Cuentas dos letras de más.
- **D)** E ✔ correcta

1. **Observa:** Los saltos se alternan: + 4, − 5, + 4, − 5…
2. **Regla:** Se alternan dos saltos: + 4 y − 5.
3. **Aplica:** El último salto fue + 4, ahora toca − 5: J (10) − 5 = E (5) → E

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> ¿Qué letra continúa la serie? H, K, G, J, F, I, ?

- **A)** L — Repites el último salto (+ 3); no ves que se alternan.
- **B)** E ✔ correcta
- **C)** M — Aplicas − 4 en sentido contrario.
- **D)** H — Aplicas los dos saltos a la vez.

1. **Observa:** Los saltos se alternan: + 3, − 4, + 3, − 4…
2. **Regla:** Se alternan dos saltos: + 3 y − 4.
3. **Aplica:** El último salto fue + 3, ahora toca − 4: I (9) − 4 = E (5) → E

- [ ] Revisada · Comentarios:
