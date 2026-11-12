# Muestras · Códigos y criptogramas (`COD.CRIPTO`, versión 2)

Deducir una clave a partir de un ejemplo y aplicarla.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Escribe la clave antes de mirar las opciones: qué cifra o qué salto corresponde a cada letra. Después codifica letra a letra y compara con las opciones de izquierda a derecha.

### 1. Nivel 1 · semilla `muestra-1-1`

> En un código, CIUDAD se escribe 564838. Con la misma clave, ¿cómo se escribe ICIU?

- **A)** 6564 ✔ correcta
- **B)** 5654 — Confundes la cifra de la C con la de la I.
- **C)** 5664 — Intercambias el orden de dos cifras seguidas.
- **D)** 4656 — Escribes el código de derecha a izquierda.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: C = 5, I = 6, U = 4.
2. **Regla:** Sustituye cada letra de ICIU por su cifra, en el mismo orden.
3. **Aplica:** I C I U → 6 5 6 4 = 6564

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> En un código, ARROYO se escribe 066575. Con la misma clave, ¿cómo se escribe YRAY?

- **A)** 7607 ✔ correcta
- **B)** 7608 — Te equivocas en la cifra de la última letra.
- **C)** 7067 — Confundes la cifra de la A con la de la R.
- **D)** 6707 — Intercambias el orden de dos cifras seguidas.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: A = 0, R = 6, Y = 7.
2. **Regla:** Sustituye cada letra de YRAY por su cifra, en el mismo orden.
3. **Aplica:** Y R A Y → 7 6 0 7 = 7607

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> En un código, MARCA se escribe 87347. Con la misma clave, ¿cómo se escribe RCRA?

- **A)** 7343 — Escribes el código de derecha a izquierda.
- **B)** 3734 — Confundes la cifra de la C con la de la A.
- **C)** 3347 — Intercambias el orden de dos cifras seguidas.
- **D)** 3437 ✔ correcta

1. **Observa:** Cada letra se escribe siempre con la misma cifra: A = 7, R = 3, C = 4.
2. **Regla:** Sustituye cada letra de RCRA por su cifra, en el mismo orden.
3. **Aplica:** R C R A → 3 4 3 7 = 3437

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> En un código, RUEDA se escribe 46025. Con la misma clave, ¿cómo se escribe DDRU?

- **A)** 6422 — Escribes el código de derecha a izquierda.
- **B)** 2247 — Te equivocas en la cifra de la última letra.
- **C)** 2246 ✔ correcta
- **D)** 2264 — Intercambias el orden de dos cifras seguidas.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: R = 4, U = 6, D = 2.
2. **Regla:** Sustituye cada letra de DDRU por su cifra, en el mismo orden.
3. **Aplica:** D D R U → 2 2 4 6 = 2246

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> En un código, PALOMA se escribe 650795. Con la misma clave, ¿cómo se escribe LLMOP?

- **A)** 00796 — Intercambias el orden de dos cifras seguidas.
- **B)** 99076 — Confundes la cifra de la M con la de la L.
- **C)** 00976 ✔ correcta
- **D)** 67900 — Escribes el código de derecha a izquierda.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: P = 6, L = 0, O = 7, M = 9.
2. **Regla:** Sustituye cada letra de LLMOP por su cifra, en el mismo orden.
3. **Aplica:** L L M O P → 0 0 9 7 6 = 00976

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> En un código, HIERRO se escribe IJFSSP. Con la misma clave, ¿cómo se escribe BOTON?

- **A)** CPUPÑ ✔ correcta
- **B)** DQVQO — Desplazas una posición de más.
- **C)** CPUPO — Olvidas la Ñ al contar las posiciones.
- **D)** AÑSÑM — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: H→I, I→J, E→F… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después en el alfabeto (con Ñ).
3. **Aplica:** B +1 = C, O +1 = P, T +1 = U, O +1 = P, N +1 = Ñ → CPUPÑ

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> En un código, MANTA se escribe 47517. Con la misma clave, ¿cómo se escribe NMMTN?

- **A)** 54415 ✔ correcta
- **B)** 54451 — Intercambias el orden de dos cifras seguidas.
- **C)** 14451 — Confundes la cifra de la T con la de la N.
- **D)** 51445 — Escribes el código de derecha a izquierda.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: M = 4, N = 5, T = 1.
2. **Regla:** Sustituye cada letra de NMMTN por su cifra, en el mismo orden.
3. **Aplica:** N M M T N → 5 4 4 1 5 = 54415

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> En un código, CAMISA se escribe 407320. Con la misma clave, ¿cómo se escribe AAMCC?

- **A)** 00744 ✔ correcta
- **B)** 00477 — Confundes la cifra de la M con la de la C.
- **C)** 07044 — Intercambias el orden de dos cifras seguidas.
- **D)** 44700 — Escribes el código de derecha a izquierda.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: C = 4, A = 0, M = 7.
2. **Regla:** Sustituye cada letra de AAMCC por su cifra, en el mismo orden.
3. **Aplica:** A A M C C → 0 0 7 4 4 = 00744

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> En un código, ZORRO se escribe XNPPN. Con la misma clave, ¿cómo se escribe MUELLE?

- **A)** KSCJJC ✔ correcta
- **B)** JRBIIB — Desplazas una posición de más.
- **C)** KSCJJE — Olvidas codificar la última letra.
- **D)** ÑWGNNG — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: Z→X, O→N, R→P… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** M −2 = K, U −2 = S, E −2 = C, L −2 = J, L −2 = J, E −2 = C → KSCJJC

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> En un código, BOTON se escribe AÑSÑM. Con la misma clave, ¿cómo se escribe DIENTE?

- **A)** CHDMSD ✔ correcta
- **B)** CHDMSE — Olvidas codificar la última letra.
- **C)** EJFÑUF — Desplazas hacia el lado contrario del alfabeto.
- **D)** BGCLRC — Desplazas una posición de más.

1. **Observa:** Compara letra a letra: B→A, O→Ñ, T→S… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición antes en el alfabeto (con Ñ).
3. **Aplica:** D −1 = C, I −1 = H, E −1 = D, N −1 = M, T −1 = S, E −1 = D → CHDMSD

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> En un código, ROBLE se escribe QÑAKD. Con la misma clave, ¿cómo se escribe RELOJ?

- **A)** PCJNH — Desplazas una posición de más.
- **B)** SFMPK — Desplazas hacia el lado contrario del alfabeto.
- **C)** QDKNI — Olvidas la Ñ al contar las posiciones.
- **D)** QDKÑI ✔ correcta

1. **Observa:** Compara letra a letra: R→Q, O→Ñ, B→A… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición antes en el alfabeto (con Ñ).
3. **Aplica:** R −1 = Q, E −1 = D, L −1 = K, O −1 = Ñ, J −1 = I → QDKÑI

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> En un código, ARBOL se escribe 04791 y IMAN se escribe 6308. Con la misma clave, ¿cómo se escribe BORMA?

- **A)** 79403 — Intercambias el orden de dos cifras seguidas.
- **B)** 73490 — Confundes la cifra de la O con la de la M.
- **C)** 79430 ✔ correcta
- **D)** 03497 — Escribes el código de derecha a izquierda.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: A = 0, R = 4, B = 7, O = 9, M = 3.
2. **Regla:** Sustituye cada letra de BORMA por su cifra, en el mismo orden.
3. **Aplica:** B O R M A → 7 9 4 3 0 = 79430

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> En un código, OREJA se escribe RUHMD. Con la misma clave, ¿cómo se escribe AGENDA?

- **A)** EKIQHE — Desplazas una posición de más.
- **B)** DJHPGD ✔ correcta
- **C)** DJHQGD — Olvidas la Ñ al contar las posiciones.
- **D)** DJHPGA — Olvidas codificar la última letra.

1. **Observa:** Compara letra a letra: O→R, R→U, E→H… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** A +3 = D, G +3 = J, E +3 = H, N +3 = P, D +3 = G, A +3 = D → DJHPGD

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> En un código, ZORRO se escribe WMOOM. Con la misma clave, ¿cómo se escribe HUERTO?

- **A)** ERBOQM ✔ correcta
- **B)** KXHUWR — Desplazas hacia el lado contrario del alfabeto.
- **C)** DQAÑPL — Desplazas una posición de más.
- **D)** ERBOQL — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: Z→W, O→M, R→O… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** H −3 = E, U −3 = R, E −3 = B, R −3 = O, T −3 = Q, O −3 = M → ERBOQM

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> En un código, LIBRO se escribe OMFVS. Con la misma clave, ¿cómo se escribe MAREA?

- **A)** QFWJF — Desplazas una posición de más.
- **B)** PEVIE ✔ correcta
- **C)** QEVIE — Olvidas la Ñ al contar las posiciones.
- **D)** PEVIA — Olvidas codificar la última letra.

1. **Observa:** Compara letra a letra: L→O, I→M, B→F… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 4 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** M +4 = P, A +4 = E, R +4 = V, E +4 = I, A +4 = E → PEVIE

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> En un código, CALLE se escribe FDÑÑH. Con la misma clave, ¿cómo se escribe DIENTE?

- **A)** AFBKQB — Desplazas hacia el lado contrario del alfabeto.
- **B)** GLHPWH ✔ correcta
- **C)** HMIQXI — Desplazas una posición de más.
- **D)** GLHQWH — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: C→F, A→D, L→Ñ… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** D +3 = G, I +3 = L, E +3 = H, N +3 = P, T +3 = W, E +3 = H → GLHPWH

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> En un código, SOMBRA se escribe UPÑCTB. Con la misma clave, ¿cómo se escribe MARTILLO?

- **A)** OBTUKMNP — Olvidas la Ñ al contar las posiciones.
- **B)** ÑCTVKNNQ — Aplicas +2 a todas las letras, sin alternar.
- **C)** NCSVJNMQ — Empiezas la alternancia por el salto equivocado.
- **D)** ÑBTUKMNP ✔ correcta

1. **Observa:** Compara letra a letra: S→U, O→P, M→Ñ… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** M +2 = Ñ, A +1 = B, R +2 = T, T +1 = U, I +2 = K, L +1 = M, L +2 = N, O +1 = P → ÑBTUKMNP

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> En un código, RUEDA se escribe STFCB. Con la misma clave, ¿cómo se escribe SUEÑO?

- **A)** TVFOP — Aplicas +1 a todas las letras, sin alternar.
- **B)** RVDOÑ — Desplazas hacia el lado contrario del alfabeto.
- **C)** TTFNP ✔ correcta
- **D)** USGMQ — Desplazas una posición de más.

1. **Observa:** Compara letra a letra: R→S, U→T, E→F… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después y 1 posición antes, alternando en el alfabeto (con Ñ).
3. **Aplica:** S +1 = T, U −1 = T, E +1 = F, Ñ −1 = N, O +1 = P → TTFNP

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> En un código, PUERTA se escribe SVHSWB. Con la misma clave, ¿cómo se escribe MADERA?

- **A)** OBGFUB ✔ correcta
- **B)** ODGHUD — Aplicas +3 a todas las letras, sin alternar.
- **C)** PBGFUB — Olvidas la Ñ al contar las posiciones.
- **D)** NDEHSD — Empiezas la alternancia por el salto equivocado.

1. **Observa:** Compara letra a letra: P→S, U→V, E→H… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** M +3 = O, A +1 = B, D +3 = G, E +1 = F, R +3 = U, A +1 = B → OBGFUB

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> En un código, ALFOMBRA se escribe CMHPÑCTB. Con la misma clave, ¿cómo se escribe AGENDA?

- **A)** CHGÑFB ✔ correcta
- **B)** CIGOFC — Aplicas +2 a todas las letras, sin alternar.
- **C)** CHGOFB — Olvidas la Ñ al contar las posiciones.
- **D)** BIFOEC — Empiezas la alternancia por el salto equivocado.

1. **Observa:** Compara letra a letra: A→C, L→M, F→H… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** A +2 = C, G +1 = H, E +2 = G, N +1 = Ñ, D +2 = F, A +1 = B → CHGÑFB

- [ ] Revisada · Comentarios:
