# Muestras · Comparación de datos (`DAT.COMPARA`, versión 2)

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
1. 21754 | 2754
2. 71469 | 71469
3. 49436 | 49436
4. 52019 | 52091
```

- **A)** 0 — Ves dos diferencias donde no las hay.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (21754 / 2754); fila 4: dos caracteres seguidos cambian de lugar (52019 / 52091). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 34317 | 34317
2. 99766 | 99796
3. 63375 | 63375
4. 99676 | 99976
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 4 — Pasas por alto dos diferencias.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (99766 / 99796); fila 4: una cifra cambia (99676 / 99976). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 9HF4 | 9F4
2. NRPK | NRPK
3. FBJW | FBW
4. 6Y2V | 6Y2V
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 0 — Ves dos diferencias donde no las hay.
- **C)** 2 ✔ correcta
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (9HF4 / 9F4); fila 3: falta un carácter (FBJW / FBW). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 60541 | 60541
2. 76216 | 36216
3. 59113 | 5913
4. 12134 | 12134
```

- **A)** 2 ✔ correcta
- **B)** 0 — Ves dos diferencias donde no las hay.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: una cifra cambia (76216 / 36216); fila 3: falta un carácter (59113 / 5913). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 836320 | 836320
2. 813163 | 813163
3. 350152 | 350125
4. 803258 | 803258
5. 630091 | 630091
```

- **A)** 4 ✔ correcta
- **B)** 2 — Ves dos diferencias donde no las hay.
- **C)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 1 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: dos caracteres seguidos cambian de lugar (350152 / 350125). Filas iguales: 5 − 1 = 4

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 440401 | 440401
2. 407271 | 407271
3. 753675 | 753685
4. 728520 | 72520
5. 259137 | 259137
```

- **A)** 0 — Ves tres diferencias donde no las hay.
- **B)** 3 ✔ correcta
- **C)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 1 — Ves dos diferencias donde no las hay.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: una cifra cambia (753675 / 753685); fila 4: falta un carácter (728520 / 72520). Filas iguales: 5 − 2 = 3

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. B66VM | B66VM
2. GJD0A | GD0A
3. JWME3 | JWME6
4. YUVRV | YUVRV
5. 84XRW | 82XRW
```

- **A)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 4 — Pasas por alto dos diferencias.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (GJD0A / GD0A); fila 3: una cifra cambia (JWME3 / JWME6); fila 5: una cifra cambia (84XRW / 82XRW). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. L8PPK | LBPPK
2. 62AHG | 62HAG
3. JHRPJ | JHRPJ
4. WH284 | WH2B4
5. M3G3L | M3G3L
```

- **A)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 0 — Ves dos diferencias donde no las hay.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (L8PPK / LBPPK); fila 2: dos caracteres seguidos cambian de lugar (62AHG / 62HAG); fila 4: un carácter cambia por otro parecido (WH284 / WH2B4). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. VMGE2V | VMGE2V
2. LEUKLB | LEUKLB
3. 5HR0NT | 5HR0NT
4. P39556 | P39556
5. TPB35X | TPB3SX
6. WY28PD | WY28PD
```

- **A)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 5 ✔ correcta
- **C)** 3 — Ves dos diferencias donde no las hay.
- **D)** 1 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 5: un carácter cambia por otro parecido (TPB35X / TPB3SX). Filas iguales: 6 − 1 = 5

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. YEGUA 100 | YEGUA 100
2. BALCON 747 | 8ALCON 747
3. RELOJ 534 | RLEOJ 534
4. LOMA 496 | LOMA 496
5. PATO 254 | PATO 254
6. TORRE 869 | TORRE 869
```

- **A)** 2 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 4 ✔ correcta
- **C)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (BALCON 747 / 8ALCON 747); fila 3: dos caracteres seguidos cambian de lugar (RELOJ 534 / RLEOJ 534). Filas iguales: 6 − 2 = 4

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 1783824 | 1783824
2. 4759194 | 4795194
3. 1517034 | 151034
4. 6767281 | 6767281
5. 9762569 | 9762569
6. 2600670 | 2600670
```

- **A)** 4 ✔ correcta
- **B)** 6 — Pasas por alto dos diferencias.
- **C)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (4759194 / 4795194); fila 3: falta un carácter (1517034 / 151034). Filas iguales: 6 − 2 = 4

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. VHAUUJ | VHAUUJ
2. KHECXA | KHECXA
3. HMVJB4 | HMJB4
4. DLPL32 | DLPL32
5. MFXVG0 | MFVXG0
6. CYTTVD | YCTTVD
```

- **A)** 5 — Pasas por alto dos diferencias.
- **B)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 ✔ correcta

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: falta un carácter (HMVJB4 / HMJB4); fila 5: dos caracteres seguidos cambian de lugar (MFXVG0 / MFVXG0); fila 6: dos caracteres seguidos cambian de lugar (CYTTVD / YCTTVD). Filas iguales: 6 − 3 = 3

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. JBKCLCF | JBCKLCF
2. KLHRH75 | KLHRH75
3. GFA33MK | GF33MK
4. FXBKT6X | FXBK6TX
5. P43TV64 | P43VT64
6. F2W9CEF | FZW9CEF
7. 8BB3BTU | 8BBBTU
```

- **A)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 3 — Pasas por alto dos diferencias.
- **C)** 6 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (JBKCLCF / JBCKLCF); fila 3: falta un carácter (GFA33MK / GF33MK); fila 4: dos caracteres seguidos cambian de lugar (FXBKT6X / FXBK6TX); fila 5: dos caracteres seguidos cambian de lugar (P43TV64 / P43VT64); fila 6: un carácter cambia por otro parecido (F2W9CEF / FZW9CEF); fila 7: falta un carácter (8BB3BTU / 8BBBTU). Filas iguales: 7 − 6 = 1

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 655213402 | 655213402
2. 187533857 | 187533857
3. 119843708 | 119843708
4. 570459259 | 570459259
5. 169918227 | 619918227
6. 338589567 | 33589567
7. 270789484 | 270789484
```

- **A)** 7 — Pasas por alto dos diferencias.
- **B)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 6 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 5 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 5: dos caracteres seguidos cambian de lugar (169918227 / 619918227); fila 6: falta un carácter (338589567 / 33589567). Filas iguales: 7 − 2 = 5

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 157607097 | 157601097
2. 329970673 | 329970673
3. 110400296 | 170400296
4. 923409040 | 924309040
5. 810725369 | 810125369
6. 692011004 | 692017004
7. 930834968 | 93084968
```

- **A)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 6 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (157607097 / 157601097); fila 3: un carácter cambia por otro parecido (110400296 / 170400296); fila 4: dos caracteres seguidos cambian de lugar (923409040 / 924309040); fila 5: un carácter cambia por otro parecido (810725369 / 810125369); fila 6: un carácter cambia por otro parecido (692011004 / 692017004); fila 7: falta un carácter (930834968 / 93084968). Filas iguales: 7 − 6 = 1

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 310HPA9 | 310HPA9
2. 5MJXTNT | 5MXJTNT
3. XRRPG0Y | XRRPG0Y
4. KBDGPL6 | KBDGPL6
5. FX0UCE5 | FX0CE5
6. CDKRHH6 | CDKHH6
7. EK18J99 | EK18J99
```

- **A)** 2 — Ves dos diferencias donde no las hay.
- **B)** 4 ✔ correcta
- **C)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (5MJXTNT / 5MXJTNT); fila 5: falta un carácter (FX0UCE5 / FX0CE5); fila 6: falta un carácter (CDKRHH6 / CDKHH6). Filas iguales: 7 − 3 = 4

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 6977544796 | 6977544796
2. 7172327930 | 7172327930
3. 5762272939 | 5762212939
4. 7373152729 | 7733152729
5. 4020723238 | 4020728238
6. 8799395956 | 8799395956
7. 3393756813 | 8393756813
8. 1352647126 | 1352647126
```

- **A)** 1 — Ves tres diferencias donde no las hay.
- **B)** 4 ✔ correcta
- **C)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 2 — Ves dos diferencias donde no las hay.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: un carácter cambia por otro parecido (5762272939 / 5762212939); fila 4: dos caracteres seguidos cambian de lugar (7373152729 / 7733152729); fila 5: un carácter cambia por otro parecido (4020723238 / 4020728238); fila 7: un carácter cambia por otro parecido (3393756813 / 8393756813). Filas iguales: 8 − 4 = 4

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. O52SAZL | O52SAZL
2. BD5LSIB | BD5LSIB
3. HAC5CHB | HAC5CH8
4. EBONBNZ | EBONBNZ
5. C8DBOEE | C8D8OEE
6. BONB8SH | BONBS8H
7. HGI1JLI | HGI1JLI
8. M5AZDAG | MA5ZDAG
```

- **A)** 4 ✔ correcta
- **B)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 6 — Pasas por alto dos diferencias.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: un carácter cambia por otro parecido (HAC5CHB / HAC5CH8); fila 5: un carácter cambia por otro parecido (C8DBOEE / C8D8OEE); fila 6: dos caracteres seguidos cambian de lugar (BONB8SH / BONBS8H); fila 8: dos caracteres seguidos cambian de lugar (M5AZDAG / MA5ZDAG). Filas iguales: 8 − 4 = 4

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 8298750711 | 8298705711
2. 8830538766 | 8830538766
3. 1883391753 | 188339173
4. 9753626182 | 9753626182
5. 7078723368 | 7078723368
6. 5009982888 | 5009892888
7. 9861630638 | 9861630638
8. 9326964582 | 9326964682
```

- **A)** 2 — Ves dos diferencias donde no las hay.
- **B)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 4 ✔ correcta

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (8298750711 / 8298705711); fila 3: falta un carácter (1883391753 / 188339173); fila 6: dos caracteres seguidos cambian de lugar (5009982888 / 5009892888); fila 8: un carácter cambia por otro parecido (9326964582 / 9326964682). Filas iguales: 8 − 4 = 4

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 1840058438 | 184008438
2. 5480043161 | 5480048161
3. 8689104295 | 8698104295
4. 4478918503 | 4478918530
5. 8000544349 | 800054349
6. 3836279778 | 3836279778
7. 3852512880 | 3852572880
8. 6643894192 | 6643394192
```

- **A)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 1 ✔ correcta
- **C)** 7 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (1840058438 / 184008438); fila 2: un carácter cambia por otro parecido (5480043161 / 5480048161); fila 3: dos caracteres seguidos cambian de lugar (8689104295 / 8698104295); fila 4: dos caracteres seguidos cambian de lugar (4478918503 / 4478918530); fila 5: falta un carácter (8000544349 / 800054349); fila 7: un carácter cambia por otro parecido (3852512880 / 3852572880); fila 8: un carácter cambia por otro parecido (6643894192 / 6643394192). Filas iguales: 8 − 7 = 1

- [ ] Revisada · Comentarios:
