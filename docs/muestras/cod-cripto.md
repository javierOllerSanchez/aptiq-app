# Muestras · Códigos y criptogramas (`COD.CRIPTO`, versión 4)

Deducir una clave a partir de un ejemplo y aplicarla.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Escribe la clave antes de mirar las opciones: qué cifra o qué salto corresponde a cada letra. Después codifica letra a letra y compara con las opciones de izquierda a derecha.

### 1. Nivel 1 · semilla `muestra-1-1`

> En un código, PARED se escribe 19358. Con la misma clave, ¿cómo se escribe ARDP?

- **A)** 9381 ✔ correcta
- **B)** 9138 — Confundes la cifra de la R con la de la P y, además, intercambias dos cifras seguidas.
- **C)** 9184 — Confundes la cifra de la R con la de la P y te equivocas en la última.
- **D)** 9183 — Confundes la cifra de la R con la de la P.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: P = 1, A = 9, R = 3, D = 8.
2. **Regla:** Sustituye cada letra de ARDP por su cifra, en el mismo orden.
3. **Aplica:** A R D P → 9 3 8 1 = 9381

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

> En un código, MANTA se escribe 10620. Con la misma clave, ¿cómo se escribe ANMT?

- **A)** 6013 — Confundes la cifra de la N con la de la A y te equivocas en la última.
- **B)** 0612 ✔ correcta
- **C)** 6021 — Confundes la cifra de la N con la de la A y, además, intercambias dos cifras seguidas.
- **D)** 6012 — Confundes la cifra de la N con la de la A.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: M = 1, A = 0, N = 6, T = 2.
2. **Regla:** Sustituye cada letra de ANMT por su cifra, en el mismo orden.
3. **Aplica:** A N M T → 0 6 1 2 = 0612

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

> En un código, PELOTA se escribe 527096. Con la misma clave, ¿cómo se escribe ALOA?

- **A)** 6706 ✔ correcta
- **B)** 7606 — Intercambias el orden de dos cifras seguidas.
- **C)** 6076 — Escribes el código de derecha a izquierda.
- **D)** 7607 — Confundes la cifra de la L con la de la A.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: L = 7, O = 0, A = 6.
2. **Regla:** Sustituye cada letra de ALOA por su cifra, en el mismo orden.
3. **Aplica:** A L O A → 6 7 0 6 = 6706

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

> En un código, TRIGO se escribe 84309. Con la misma clave, ¿cómo se escribe GOTI?

- **A)** 3980 — Confundes la cifra de la I con la de la G.
- **B)** 0893 — Intercambias el orden de dos cifras seguidas.
- **C)** 3890 — Escribes el código de derecha a izquierda.
- **D)** 0983 ✔ correcta

1. **Observa:** Cada letra se escribe siempre con la misma cifra: T = 8, I = 3, G = 0, O = 9.
2. **Regla:** Sustituye cada letra de GOTI por su cifra, en el mismo orden.
3. **Aplica:** G O T I → 0 9 8 3 = 0983

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

> En un código, CAMPO se escribe 01247. Con la misma clave, ¿cómo se escribe OCCAM?

- **A)** 20107 — Confundes la cifra de la O con la de la M y, además, intercambias dos cifras seguidas.
- **B)** 20018 — Confundes la cifra de la O con la de la M y te equivocas en la última.
- **C)** 20017 — Confundes la cifra de la O con la de la M.
- **D)** 70012 ✔ correcta

1. **Observa:** Cada letra se escribe siempre con la misma cifra: C = 0, A = 1, M = 2, O = 7.
2. **Regla:** Sustituye cada letra de OCCAM por su cifra, en el mismo orden.
3. **Aplica:** O C C A M → 7 0 0 1 2 = 70012

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

> En un código, ROBLE se escribe SPCMF. Con la misma clave, ¿cómo se escribe ARENA?

- **A)** BSFÑB ✔ correcta
- **B)** BSFOB — Olvidas la Ñ al contar las posiciones.
- **C)** BSFÑA — Olvidas codificar la última letra.
- **D)** CTGOC — Desplazas una posición de más.

1. **Observa:** Compara letra a letra: R→S, O→P, B→C… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después en el alfabeto (con Ñ).
3. **Aplica:** A +1 = B, R +1 = S, E +1 = F, N +1 = Ñ, A +1 = B → BSFÑB

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

> En un código, LAGO se escribe 5204. Con la misma clave, ¿cómo se escribe GAGLG?

- **A)** 02005 — Intercambias el orden de dos cifras seguidas.
- **B)** 02050 ✔ correcta
- **C)** 02051 — Te equivocas en la cifra de la última letra.
- **D)** 05020 — Confundes la cifra de la A con la de la L.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: L = 5, A = 2, G = 0.
2. **Regla:** Sustituye cada letra de GAGLG por su cifra, en el mismo orden.
3. **Aplica:** G A G L G → 0 2 0 5 0 = 02050

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

> En un código, MAPA se escribe NBQB. Con la misma clave, ¿cómo se escribe DINERO?

- **A)** CHMDQÑ — Desplazas hacia el lado contrario del alfabeto.
- **B)** EJÑFSP ✔ correcta
- **C)** EJOFSP — Olvidas la Ñ al contar las posiciones.
- **D)** FKOGTQ — Desplazas una posición de más.

1. **Observa:** Compara letra a letra: M→N, A→B, P→Q… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después en el alfabeto (con Ñ).
3. **Aplica:** D +1 = E, I +1 = J, N +1 = Ñ, E +1 = F, R +1 = S, O +1 = P → EJÑFSP

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

> En un código, SUELO se escribe QSCJN. Con la misma clave, ¿cómo se escribe NIÑO?

- **A)** LGMO — Olvidas codificar la última letra.
- **B)** KFLM — Desplazas una posición de más.
- **C)** LGMN ✔ correcta
- **D)** OKPQ — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: S→Q, U→S, E→C… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** N −2 = L, I −2 = G, Ñ −2 = M, O −2 = N → LGMN

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

> En un código, DIBUJO se escribe CHATIÑ. Con la misma clave, ¿cómo se escribe SUEÑO?

- **A)** RTDNÑ ✔ correcta
- **B)** RTDNO — Olvidas codificar la última letra.
- **C)** QSCMN — Desplazas una posición de más.
- **D)** TVFOP — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: D→C, I→H, B→A… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 1 posición antes en el alfabeto (con Ñ).
3. **Aplica:** S −1 = R, U −1 = T, E −1 = D, Ñ −1 = N, O −1 = Ñ → RTDNÑ

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

> En un código, MALETA se escribe 236053 y CUERDA se escribe 810473. Con la misma clave, ¿cómo se escribe MLATC?

- **A)** 28356 — Confundes la cifra de la L con la de la C.
- **B)** 62358 — Intercambias el orden de dos cifras seguidas.
- **C)** 85362 — Escribes el código de derecha a izquierda.
- **D)** 26358 ✔ correcta

1. **Observa:** Cada letra se escribe siempre con la misma cifra: M = 2, A = 3, L = 6, T = 5, C = 8.
2. **Regla:** Sustituye cada letra de MLATC por su cifra, en el mismo orden.
3. **Aplica:** M L A T C → 2 6 3 5 8 = 26358

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

> En un código, MARCA se escribe 39509 y AGENDA se escribe 914269. Con la misma clave, ¿cómo se escribe EDAEE?

- **A)** 64966 — Confundes la cifra de la D con la de la E.
- **B)** 64696 — Confundes la cifra de la D con la de la E y, además, intercambias dos cifras seguidas.
- **C)** 46944 ✔ correcta
- **D)** 64967 — Confundes la cifra de la D con la de la E y te equivocas en la última.

1. **Observa:** Cada letra se escribe siempre con la misma cifra: A = 9, E = 4, D = 6.
2. **Regla:** Sustituye cada letra de EDAEE por su cifra, en el mismo orden.
3. **Aplica:** E D A E E → 4 6 9 4 4 = 46944

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

> En un código, DIENTE se escribe AFBKQB. Con la misma clave, ¿cómo se escribe MOLINO?

- **A)** JLIFKL — Olvidas la Ñ al contar las posiciones.
- **B)** ORÑLPR — Desplazas hacia el lado contrario del alfabeto.
- **C)** ILHEJL — Desplazas una posición de más.
- **D)** JMIFKM ✔ correcta

1. **Observa:** Compara letra a letra: D→A, I→F, E→B… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** M −3 = J, O −3 = M, L −3 = I, I −3 = F, N −3 = K, O −3 = M → JMIFKM

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

> En un código, DUENDE se escribe ARBKAB. Con la misma clave, ¿cómo se escribe MOLINO?

- **A)** ILHEJL — Desplazas una posición de más.
- **B)** ORÑLPR — Desplazas hacia el lado contrario del alfabeto.
- **C)** JMIFKM ✔ correcta
- **D)** JLIFKL — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: D→A, U→R, E→B… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones antes en el alfabeto (con Ñ).
3. **Aplica:** M −3 = J, O −3 = M, L −3 = I, I −3 = F, N −3 = K, O −3 = M → JMIFKM

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

> En un código, CARRERA se escribe FDUUHUD. Con la misma clave, ¿cómo se escribe NIEVE?

- **A)** QMIZI — Desplazas una posición de más.
- **B)** PLHYH ✔ correcta
- **C)** KFBSB — Desplazas hacia el lado contrario del alfabeto.
- **D)** QLHYH — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: C→F, A→D, R→U… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** N +3 = P, I +3 = L, E +3 = H, V +3 = Y, E +3 = H → PLHYH

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

> En un código, DEDAL se escribe GHGDÑ. Con la misma clave, ¿cómo se escribe LIBRO?

- **A)** ÑLEUR ✔ correcta
- **B)** OMFVS — Desplazas una posición de más.
- **C)** OLEUR — Olvidas la Ñ al contar las posiciones.
- **D)** ÑLEUO — Olvidas codificar la última letra.

1. **Observa:** Compara letra a letra: D→G, E→H, D→G… Todas se desplazan lo mismo.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después en el alfabeto (con Ñ).
3. **Aplica:** L +3 = Ñ, I +3 = L, B +3 = E, R +3 = U, O +3 = R → ÑLEUR

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

> En un código, ESCUDO se escribe GTEVFP. Con la misma clave, ¿cómo se escribe CORDERO?

- **A)** EPTEGSQ ✔ correcta
- **B)** DQSFFTP — Empiezas la alternancia por el salto equivocado.
- **C)** EQTFGTQ — Aplicas +2 a todas las letras, sin alternar.
- **D)** AÑPCCQN — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: E→G, S→T, C→E… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** C +2 = E, O +1 = P, R +2 = T, D +1 = E, E +2 = G, R +1 = S, O +2 = Q → EPTEGSQ

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

> En un código, HELADO se escribe KFÑBGP. Con la misma clave, ¿cómo se escribe NARANJA?

- **A)** PBUBPKD ✔ correcta
- **B)** ÑDSDÑMB — Empiezas la alternancia por el salto equivocado.
- **C)** QBUBQKD — Olvidas la Ñ al contar las posiciones.
- **D)** PDUDPMD — Aplicas +3 a todas las letras, sin alternar.

1. **Observa:** Compara letra a letra: H→K, E→F, L→Ñ… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 3 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** N +3 = P, A +1 = B, R +3 = U, A +1 = B, N +3 = P, J +1 = K, A +3 = D → PBUBPKD

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

> En un código, PALMERA se escribe RBNNGSC. Con la misma clave, ¿cómo se escribe ARMARIO?

- **A)** CTÑCTKQ — Aplicas +2 a todas las letras, sin alternar.
- **B)** BTNCSKP — Empiezas la alternancia por el salto equivocado.
- **C)** CSÑBTJQ ✔ correcta
- **D)** CSOBTJQ — Olvidas la Ñ al contar las posiciones.

1. **Observa:** Compara letra a letra: P→R, A→B, L→N… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 2 posiciones después y 1 posición después, alternando en el alfabeto (con Ñ).
3. **Aplica:** A +2 = C, R +1 = S, M +2 = Ñ, A +1 = B, R +2 = T, I +1 = J, O +2 = Q → CSÑBTJQ

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

> En un código, ARROYO se escribe BPSNZN. Con la misma clave, ¿cómo se escribe DIENTE?

- **A)** BJCÑRF — Empiezas la alternancia por el salto equivocado.
- **B)** EGFLUC ✔ correcta
- **C)** EJFÑUF — Aplicas +1 a todas las letras, sin alternar.
- **D)** CKDOSG — Desplazas hacia el lado contrario del alfabeto.

1. **Observa:** Compara letra a letra: A→B, R→P, R→S… El salto cambia según la posición.
2. **Regla:** Cada letra se sustituye por la que está 1 posición después y 2 posiciones antes, alternando en el alfabeto (con Ñ).
3. **Aplica:** D +1 = E, I −2 = G, E +1 = F, N −2 = L, T +1 = U, E −2 = C → EGFLUC

- [ ] Revisada · Comentarios:
