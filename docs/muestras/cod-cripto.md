# Muestras · Códigos y criptogramas (`COD.CRIPTO`, versión 3)

Deducir una clave a partir de un ejemplo y aplicarla.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Escribe la clave antes de mirar las opciones: qué cifra o qué salto corresponde a cada letra. Después codifica letra a letra y compara con las opciones de izquierda a derecha.

### 1. Nivel 1 · semilla `muestra-1-1`

> En un código, VELA se escribe 0821. Con la misma clave, ¿cómo se escribe LVAL?

- **A)** 0212 — Intercambias el orden de dos cifras seguidas.
- **B)** 2102 — Escribes el código de derecha a izquierda.
- **C)** 2012 ✔ correcta
- **D)** 0210 — Confundes la cifra de la L con la de la V.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: V = 0, L = 2, A = 1.
2. **Regla:** Sustituye cada letra de LVAL por su cifra, en el mismo orden.
3. **Aplica:** L V A L → 2 0 1 2 = 2012

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> En un código, JARDIN se escribe 103864. Con la misma clave, ¿cómo se escribe DIND?

- **A)** 4684 — Confundes la cifra de la D con la de la N.
- **B)** 4685 — Confundes la cifra de la D con la de la N y te equivocas en la última.
- **C)** 8648 ✔ correcta
- **D)** 4648 — Confundes la cifra de la D con la de la N y, además, intercambias dos cifras seguidas.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: D = 8, I = 6, N = 4.
2. **Regla:** Sustituye cada letra de DIND por su cifra, en el mismo orden.
3. **Aplica:** D I N D → 8 6 4 8 = 8648

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> En un código, NAVE se escribe 3470. Con la misma clave, ¿cómo se escribe VNEV?

- **A)** 7037 — Escribes el código de derecha a izquierda.
- **B)** 7307 ✔ correcta
- **C)** 0370 — Confundes la cifra de la E con la de la V.
- **D)** 3707 — Intercambias el orden de dos cifras seguidas.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: N = 3, V = 7, E = 0.
2. **Regla:** Sustituye cada letra de VNEV por su cifra, en el mismo orden.
3. **Aplica:** V N E V → 7 3 0 7 = 7307

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> En un código, SOBRE se escribe 16932. Con la misma clave, ¿cómo se escribe OBSR?

- **A)** 3196 — Escribes el código de derecha a izquierda.
- **B)** 6931 — Intercambias el orden de dos cifras seguidas.
- **C)** 6914 — Te equivocas en la cifra de la última letra.
- **D)** 6913 ✔ correcta

1. **Observa:** Cada letra se escribe siempre con la misma cifra: S = 1, O = 6, B = 9, R = 3.
2. **Regla:** Sustituye cada letra de OBSR por su cifra, en el mismo orden.
3. **Aplica:** O B S R → 6 9 1 3 = 6913

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> En un código, AGUJA se escribe 82598. Con la misma clave, ¿cómo se escribe AAUUJ?

- **A)** 88559 ✔ correcta
- **B)** 95588 — Escribes el código de derecha a izquierda.
- **C)** 55889 — Confundes la cifra de la A con la de la U.
- **D)** 88550 — Te equivocas en la cifra de la última letra.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: A = 8, U = 5, J = 9.
2. **Regla:** Sustituye cada letra de AAUUJ por su cifra, en el mismo orden.
3. **Aplica:** A A U U J → 8 8 5 5 9 = 88559

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> En un código, PANERA se escribe QBÑFSB. Con la misma clave, ¿cómo se escribe SENDA?

- **A)** TFÑEA — Olvidas codificar la última letra.
- **B)** UGOFC — Desplazas una posición de más.
- **C)** TFÑEB ✔ correcta
- **D)** TFOEB — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: P→Q, A→B, N→Ñ… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después en el alfabeto (con Ñ).
3. **Aplica:** S +1 = T, E +1 = F, N +1 = Ñ, D +1 = E, A +1 = B → TFÑEB

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> En un código, PLAZA se escribe 16595. Con la misma clave, ¿cómo se escribe PLALA?

- **A)** 61516 — Confundes la cifra de la P con la de la L y te equivocas en la última.
- **B)** 65115 — Confundes la cifra de la P con la de la L y, además, intercambias dos cifras seguidas.
- **C)** 16565 ✔ correcta
- **D)** 61515 — Confundes la cifra de la P con la de la L.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: P = 1, L = 6, A = 5.
2. **Regla:** Sustituye cada letra de PLALA por su cifra, en el mismo orden.
3. **Aplica:** P L A L A → 1 6 5 6 5 = 16565

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> En un código, NORMA se escribe ÑPSNB. Con la misma clave, ¿cómo se escribe ESCUDO?

- **A)** FTDVEP ✔ correcta
- **B)** GUEWFQ — Desplazas una posición de más.
- **C)** DRBTCÑ — Desplazas hacia el lado contrario del alfabeto.
- **D)** FTDVEO — Olvidas codificar la última letra.

1. **Observa:** Compara letra a letra: N→Ñ, O→P, R→S… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después en el alfabeto (con Ñ).
3. **Aplica:** E +1 = F, S +1 = T, C +1 = D, U +1 = V, D +1 = E, O +1 = P → FTDVEP

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> En un código, NIEVE se escribe LGCTC. Con la misma clave, ¿cómo se escribe NIDO?

- **A)** LGBN ✔ correcta
- **B)** KFAM — Desplazas una posición de más.
- **C)** LGBM — Olvidas la Ñ al contar las posiciones.
- **D)** OKFQ — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: N→L, I→G, E→C… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** N −2 = L, I −2 = G, D −2 = B, O −2 = N → LGBN

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> En un código, OLIVO se escribe ÑKHUÑ. Con la misma clave, ¿cómo se escribe DUEÑO?

- **A)** BSCMN — Desplazas una posición de más.
- **B)** CTDNO — Olvidas codificar la última letra.
- **C)** CTDNÑ ✔ correcta
- **D)** EVFOP — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: O→Ñ, L→K, I→H… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición antes en el alfabeto (con Ñ).
3. **Aplica:** D −1 = C, U −1 = T, E −1 = D, Ñ −1 = N, O −1 = Ñ → CTDNÑ

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> En un código, SARTEN se escribe UCTVGO. Con la misma clave, ¿cómo se escribe RAMA?

- **A)** UDOD — Desplazas una posición de más.
- **B)** TCOC — Olvidas la Ñ al contar las posiciones.
- **C)** TCÑA — Olvidas codificar la última letra.
- **D)** TCÑC ✔ correcta

1. **Observa:** Compara letra a letra: S→U, A→C, R→T… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** R +2 = T, A +2 = C, M +2 = Ñ, A +2 = C → TCÑC

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> En un código, NORMA se escribe 73910 y FLECHA se escribe 682540. Con la misma clave, ¿cómo se escribe OERRM?

- **A)** 39291 — Intercambias el orden de dos cifras seguidas.
- **B)** 19923 — Escribes el código de derecha a izquierda.
- **C)** 32991 ✔ correcta
- **D)** 12993 — Confundes la cifra de la M con la de la O.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: O = 3, R = 9, M = 1, E = 2.
2. **Regla:** Sustituye cada letra de OERRM por su cifra, en el mismo orden.
3. **Aplica:** O E R R M → 3 2 9 9 1 = 32991

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> En un código, PALACIO se escribe SDÑDFLR. Con la misma clave, ¿cómo se escribe MALETA?

- **A)** PEOIXE — Desplazas una posición de más.
- **B)** PDOHWD — Olvidas la Ñ al contar las posiciones.
- **C)** ODÑHWD ✔ correcta
- **D)** ODÑHWA — Olvidas codificar la última letra.

1. **Observa:** Compara letra a letra: P→S, A→D, L→Ñ… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** M +3 = O, A +3 = D, L +3 = Ñ, E +3 = H, T +3 = W, A +3 = D → ODÑHWD

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> En un código, MALETA se escribe PEOIXE. Con la misma clave, ¿cómo se escribe MERCADO?

- **A)** PIVGEHO — Olvidas codificar la última letra.
- **B)** QIVGEHS — Olvidas la Ñ al contar las posiciones.
- **C)** PIVGEHS ✔ correcta
- **D)** QJWHFIT — Desplazas una posición de más.

1. **Observa:** Compara letra a letra: M→P, A→E, L→O… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 4 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** M +4 = P, E +4 = I, R +4 = V, C +4 = G, A +4 = E, D +4 = H, O +4 = S → PIVGEHS

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> En un código, LECHE se escribe ÑHFKH. Con la misma clave, ¿cómo se escribe HORMIGA?

- **A)** KRUPLJD — Olvidas la Ñ al contar las posiciones.
- **B)** KRUOLJA — Olvidas codificar la última letra.
- **C)** LSVPMKE — Desplazas una posición de más.
- **D)** KRUOLJD ✔ correcta

1. **Observa:** Compara letra a letra: L→Ñ, E→H, C→F… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** H +3 = K, O +3 = R, R +3 = U, M +3 = O, I +3 = L, G +3 = J, A +3 = D → KRUOLJD

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> En un código, HIERRO se escribe KLHUUR. Con la misma clave, ¿cómo se escribe ALMACEN?

- **A)** DÑODFHN — Olvidas codificar la última letra.
- **B)** EOPEGIQ — Desplazas una posición de más.
- **C)** DOPDFHQ — Olvidas la Ñ al contar las posiciones.
- **D)** DÑODFHP ✔ correcta

1. **Observa:** Compara letra a letra: H→K, I→L, E→H… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** A +3 = D, L +3 = Ñ, M +3 = O, A +3 = D, C +3 = F, E +3 = H, N +3 = P → DÑODFHP

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> En un código, JUGUETE se escribe KTHTFSF. Con la misma clave, ¿cómo se escribe SOBRE?

- **A)** TÑCQF ✔ correcta
- **B)** TNCQF — Olvidas la Ñ al contar las posiciones.
- **C)** RPASD — Desplazas hacia el lado contrario del alfabeto.
- **D)** TPCSF — Aplicas +1 a todas las letras, sin alternar.

1. **Observa:** Compara letra a letra: J→K, U→T, G→H… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después y 1 posición antes, alternando en el alfabeto (con Ñ).
3. **Aplica:** S +1 = T, O −1 = Ñ, B +1 = C, R −1 = Q, E +1 = F → TÑCQF

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> En un código, VENTANA se escribe XDOSCMC. Con la misma clave, ¿cómo se escribe ALUMNO?

- **A)** CKWLOÑ ✔ correcta
- **B)** CKWLPN — Olvidas la Ñ al contar las posiciones.
- **C)** DJXKPN — Desplazas una posición de más.
- **D)** CNWÑOQ — Aplicas +2 a todas las letras, sin alternar.

1. **Observa:** Compara letra a letra: V→X, E→D, N→O… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición antes, alternando en el alfabeto (con Ñ).
3. **Aplica:** A +2 = C, L −1 = K, U +2 = W, M −1 = L, N +2 = O, O −1 = Ñ → CKWLOÑ

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> En un código, PARAGUAS se escribe RBTBIVCT. Con la misma clave, ¿cómo se escribe MARTILLO?

- **A)** ÑCTVKNNQ — Aplicas +2 a todas las letras, sin alternar.
- **B)** OBTUKMNP — Olvidas la Ñ al contar las posiciones.
- **C)** ÑBTUKMNP ✔ correcta
- **D)** NCSVJNMQ — Empiezas la alternancia por el salto equivocado.

1. **Observa:** Compara letra a letra: P→R, A→B, R→T… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** M +2 = Ñ, A +1 = B, R +2 = T, T +1 = U, I +2 = K, L +1 = M, L +2 = N, O +1 = P → ÑBTUKMNP

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> En un código, CUCHARA se escribe FVFIDSD. Con la misma clave, ¿cómo se escribe GALLETA?

- **A)** JBÑMHUD ✔ correcta
- **B)** JBOMHUD — Olvidas la Ñ al contar las posiciones.
- **C)** HDMÑFWB — Empiezas la alternancia por el salto equivocado.
- **D)** JDÑÑHWD — Aplicas +3 a todas las letras, sin alternar.

1. **Observa:** Compara letra a letra: C→F, U→V, C→F… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** G +3 = J, A +1 = B, L +3 = Ñ, L +1 = M, E +3 = H, T +1 = U, A +3 = D → JBÑMHUD

- [ ] Revisada · Comentarios:
