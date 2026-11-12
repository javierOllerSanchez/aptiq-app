# Muestras · Comparación de datos (`DAT.COMPARA`, versión 3)

Contar cuántas filas de dos columnas son exactamente iguales.

Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:
- que solo hay una respuesta defendible;
- que la explicación es correcta y clara;
- que cada error descrito es plausible;
- que la dificultad crece con el nivel.

**Truco de examen del tipo:** Compara de izquierda a derecha y por bloques cortos (tres o cuatro caracteres), señalando con el dedo. Los cambios más difíciles de ver son dos cifras que intercambian su lugar y las letras que se parecen a cifras (O y 0, I y 1, B y 8, S y 5).

### 1. Nivel 1 · semilla `muestra-1-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 48615 | 48915
2. 65207 | 56207
3. 17295 | 17295
4. 68265 | 68625
```

- **A)** 3 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 4 — Pasas por alto tres diferencias.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (48615 / 48915); fila 2: dos caracteres seguidos cambian de lugar (65207 / 56207); fila 4: dos caracteres seguidos cambian de lugar (68265 / 68625). Filas iguales: 4 − 3 = 1

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. C9JR | CJ9R
2. B4LN | B4LN
3. TN53 | TN3
4. GYTB | GYTB
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 2 ✔ correcta
- **C)** 0 — Ves dos diferencias donde no las hay.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (C9JR / CJ9R); fila 3: falta un carácter (TN53 / TN3). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 41816 | 14816
2. 24096 | 24069
3. 65626 | 65662
4. 23694 | 23694
```

- **A)** 3 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (41816 / 14816); fila 2: dos caracteres seguidos cambian de lugar (24096 / 24069); fila 3: dos caracteres seguidos cambian de lugar (65626 / 65662). Filas iguales: 4 − 3 = 1

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. R63V | 6R3V
2. AJJU | AJUJ
3. 54MD | 54MD
4. 2JE6 | 2JE1
```

- **A)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 3 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 1 ✔ correcta
- **D)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (R63V / 6R3V); fila 2: dos caracteres seguidos cambian de lugar (AJJU / AJUJ); fila 4: una cifra cambia (2JE6 / 2JE1). Filas iguales: 4 − 3 = 1

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 174057 | 174057
2. 492065 | 432065
3. 726404 | 726404
4. 549813 | 549818
5. 926891 | 92891
```

- **A)** 5 — Pasas por alto tres diferencias.
- **B)** 4 — Pasas por alto dos diferencias.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: una cifra cambia (492065 / 432065); fila 4: una cifra cambia (549813 / 549818); fila 5: falta un carácter (926891 / 92891). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. UBT2U | UBT2U
2. U52PT | US2PT
3. X72U9 | X27U9
4. 1LFBB | 1LFBB
5. 2M6F4 | ZM6F4
```

- **A)** 4 — Pasas por alto dos diferencias.
- **B)** 2 ✔ correcta
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (U52PT / US2PT); fila 3: dos caracteres seguidos cambian de lugar (X72U9 / X27U9); fila 5: un carácter cambia por otro parecido (2M6F4 / ZM6F4). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. TEAL5 | TEL5
2. 4D9ER | 4D9ER
3. 5XBBF | 5XBBF
4. 183TN | 183TN
5. MUJ4A | MUJA
```

- **A)** 3 ✔ correcta
- **B)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 5 — Pasas por alto dos diferencias.
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (TEAL5 / TEL5); fila 5: falta un carácter (MUJ4A / MUJA). Filas iguales: 5 − 2 = 3

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 290047 | 290041
2. 177500 | 177300
3. 700318 | 700313
4. 348537 | 348537
5. 474220 | 44220
```

- **A)** 3 — Pasas por alto dos diferencias.
- **B)** 4 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (290047 / 290041); fila 2: una cifra cambia (177500 / 177300); fila 3: un carácter cambia por otro parecido (700318 / 700313); fila 5: falta un carácter (474220 / 44220). Filas iguales: 5 − 4 = 1

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. AGUJA 728 | AGUJA 7Z8
2. ROBLE 583 | ROBLE S83
3. MAREA 258 | MAREA 258
4. PALCO 761 | PALC0 761
5. ALCALDE 422 | ALCALDE 422
6. MARCA 67 | MARCA 67
```

- **A)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 3 ✔ correcta
- **D)** 5 — Pasas por alto dos diferencias.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (AGUJA 728 / AGUJA 7Z8); fila 2: un carácter cambia por otro parecido (ROBLE 583 / ROBLE S83); fila 4: un carácter cambia por otro parecido (PALCO 761 / PALC0 761). Filas iguales: 6 − 3 = 3

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. G23ETB | G2E3TB
2. D3C9UN | D3C9UN
3. 2DJ8JJ | 2D8JJJ
4. XTKRBC | XTKR8C
5. VUH428 | UVH428
6. AMBTEY | AMBTEY
```

- **A)** 0 — Ves dos diferencias donde no las hay.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (G23ETB / G2E3TB); fila 3: dos caracteres seguidos cambian de lugar (2DJ8JJ / 2D8JJJ); fila 4: un carácter cambia por otro parecido (XTKRBC / XTKR8C); fila 5: dos caracteres seguidos cambian de lugar (VUH428 / UVH428). Filas iguales: 6 − 4 = 2

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. G0C6PU | GOC6PU
2. AWY8T7 | AWY8T7
3. LPCHY0 | PLCHY0
4. GGLG85 | GGL85
5. DFFRU5 | DFFRU5
6. MGYNH9 | MGNYH9
```

- **A)** 2 ✔ correcta
- **B)** 0 — Ves dos diferencias donde no las hay.
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (G0C6PU / GOC6PU); fila 3: dos caracteres seguidos cambian de lugar (LPCHY0 / PLCHY0); fila 4: falta un carácter (GGLG85 / GGL85); fila 6: dos caracteres seguidos cambian de lugar (MGYNH9 / MGNYH9). Filas iguales: 6 − 4 = 2

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. ANCLA 197 | ANLA 197
2. RINCON 819 | RINCON 819
3. DIBUJO 341 | DIBUJO 341
4. ÑANDU 977 | AÑNDU 977
5. DADO 822 | DADO 822
6. MARTES 224 | MARTS 224
```

- **A)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 6 — Pasas por alto tres diferencias.
- **C)** 3 ✔ correcta
- **D)** 5 — Pasas por alto dos diferencias.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (ANCLA 197 / ANLA 197); fila 4: dos caracteres seguidos cambian de lugar (ÑANDU 977 / AÑNDU 977); fila 6: falta un carácter (MARTES 224 / MARTS 224). Filas iguales: 6 − 3 = 3

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 6AH0YA3 | A6H0YA3
2. 6KXG7V0 | 6KXG7V0
3. WUJ719E | WUJ719E
4. UCNYU4Y | UCNYUY
5. 8Y4V2KT | 8YV42KT
6. KG05WF0 | KG05WF0
7. 8C3X5TY | 8C3XSTY
```

- **A)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 3 ✔ correcta
- **C)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 — Ves dos diferencias donde no las hay.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (6AH0YA3 / A6H0YA3); fila 4: falta un carácter (UCNYU4Y / UCNYUY); fila 5: dos caracteres seguidos cambian de lugar (8Y4V2KT / 8YV42KT); fila 7: un carácter cambia por otro parecido (8C3X5TY / 8C3XSTY). Filas iguales: 7 − 4 = 3

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. BVJHEMX | BVJHEMX
2. 4L9J7RT | 4L97RT
3. K033KPY | K033KPY
4. K9J67MT | K96J7MT
5. C3563G7 | C353G7
6. 1ELG3EA | 1ELG3EA
7. 9T8YYXC | 9TY8YXC
```

- **A)** 3 ✔ correcta
- **B)** 5 — Pasas por alto dos diferencias.
- **C)** 6 — Pasas por alto tres diferencias.
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (4L9J7RT / 4L97RT); fila 4: dos caracteres seguidos cambian de lugar (K9J67MT / K96J7MT); fila 5: falta un carácter (C3563G7 / C353G7); fila 7: dos caracteres seguidos cambian de lugar (9T8YYXC / 9TY8YXC). Filas iguales: 7 − 4 = 3

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 749955212 | 749955212
2. 620447409 | 620474409
3. 217561346 | 217561346
4. 323790950 | 323790950
5. 441893780 | 41893780
6. 556572262 | 556752262
7. 738747477 | 738747477
```

- **A)** 2 — Ves dos diferencias donde no las hay.
- **B)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 4 ✔ correcta
- **D)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (620447409 / 620474409); fila 5: falta un carácter (441893780 / 41893780); fila 6: dos caracteres seguidos cambian de lugar (556572262 / 556752262). Filas iguales: 7 − 3 = 4

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 2E74ANF | 2E74ANF
2. 3348EWN | 3438EWN
3. R80H3JB | R80H3J8
4. N8PEW8L | 8NPEW8L
5. VXV8H96 | VXVBH96
6. 62CPVM5 | 62CPVM5
7. 4J5Y16V | 4JSY16V
```

- **A)** 2 ✔ correcta
- **B)** 4 — Pasas por alto dos diferencias.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 5 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (3348EWN / 3438EWN); fila 3: un carácter cambia por otro parecido (R80H3JB / R80H3J8); fila 4: dos caracteres seguidos cambian de lugar (N8PEW8L / 8NPEW8L); fila 5: un carácter cambia por otro parecido (VXV8H96 / VXVBH96); fila 7: un carácter cambia por otro parecido (4J5Y16V / 4JSY16V). Filas iguales: 7 − 5 = 2

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 0EC2J5I | 0EC2J5I
2. JHCMNH2 | JHCMNHZ
3. 0NIJGB5 | 0NIJGB5
4. AOFJGIL | AOFJGIL
5. BD2EKSC | BD2EKSC
6. AMIEOG2 | AMIOEG2
7. 10I55BI | 10I55BI
8. H2HOIJ1 | H2H0IJ1
```

- **A)** 5 ✔ correcta
- **B)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 6 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (JHCMNH2 / JHCMNHZ); fila 6: dos caracteres seguidos cambian de lugar (AMIEOG2 / AMIOEG2); fila 8: un carácter cambia por otro parecido (H2HOIJ1 / H2H0IJ1). Filas iguales: 8 − 3 = 5

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 4322885624 | 4822885624
2. 4969946822 | 4969946282
3. 5030549038 | 5030549038
4. 6960712856 | 6960712856
5. 3953655911 | 3963655911
6. 8564114239 | 8564114239
7. 9657333978 | 957333978
8. 1966549660 | 1966546960
```

- **A)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 6 — Pasas por alto tres diferencias.
- **C)** 3 ✔ correcta
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (4322885624 / 4822885624); fila 2: dos caracteres seguidos cambian de lugar (4969946822 / 4969946282); fila 5: un carácter cambia por otro parecido (3953655911 / 3963655911); fila 7: falta un carácter (9657333978 / 957333978); fila 8: dos caracteres seguidos cambian de lugar (1966549660 / 1966546960). Filas iguales: 8 − 5 = 3

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. ICN0G2J | ICNOG2J
2. 822EECG | B22EECG
3. C20AABE | C20AAEB
4. CK1FAOS | C1KFAOS
5. E8KZD2D | EKZD2D
6. KMCIHME | KMCIHME
7. ZNBZOZN | ZNBZZN
8. DGMC1KS | DGMC1K5
```

- **A)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 7 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 1 ✔ correcta
- **D)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (ICN0G2J / ICNOG2J); fila 2: un carácter cambia por otro parecido (822EECG / B22EECG); fila 3: dos caracteres seguidos cambian de lugar (C20AABE / C20AAEB); fila 4: dos caracteres seguidos cambian de lugar (CK1FAOS / C1KFAOS); fila 5: falta un carácter (E8KZD2D / EKZD2D); fila 7: falta un carácter (ZNBZOZN / ZNBZZN); fila 8: un carácter cambia por otro parecido (DGMC1KS / DGMC1K5). Filas iguales: 8 − 7 = 1

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 6004119555 | 6004119556
2. 8426453961 | 8426453961
3. 1668180097 | 166818097
4. 9526706507 | 952670507
5. 3774969375 | 3774969375
6. 1793315969 | 1793315969
7. 3811574269 | 381157429
8. 2104421101 | 2104421101
```

- **A)** 1 — Ves tres diferencias donde no las hay.
- **B)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 — Ves dos diferencias donde no las hay.
- **D)** 4 ✔ correcta

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (6004119555 / 6004119556); fila 3: falta un carácter (1668180097 / 166818097); fila 4: falta un carácter (9526706507 / 952670507); fila 7: falta un carácter (3811574269 / 381157429). Filas iguales: 8 − 4 = 4

- [ ] Revisada · Comentarios:
