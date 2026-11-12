# Muestras · Comparación de datos (`DAT.COMPARA`, versión 4)

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
1. 0DUD | 0DUD
2. V0KW | VOKW
3. W52N | W2N
4. C4WB | C4WB
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 ✔ correcta
- **D)** 4 — Pasas por alto dos diferencias.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (V0KW / VOKW); fila 3: falta un carácter (W52N / W2N). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. CULF | CULF
2. 3R9M | 3R9M
3. V56K | V5K
4. HWG1 | HW1G
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 4 — Pasas por alto dos diferencias.
- **C)** 2 ✔ correcta
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: falta un carácter (V56K / V5K); fila 4: dos caracteres seguidos cambian de lugar (HWG1 / HW1G). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 49273 | 49273
2. 45454 | 45454
3. 68547 | 65847
4. 72650 | 12650
```

- **A)** 2 ✔ correcta
- **B)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 4 — Pasas por alto dos diferencias.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: dos caracteres seguidos cambian de lugar (68547 / 65847); fila 4: un carácter cambia por otro parecido (72650 / 12650). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. AC5J | AC5J
2. GXKK | GXKK
3. 1A4Y | 1A4Y
4. JCLX | JCXL
```

- **A)** 3 ✔ correcta
- **B)** 0 — Ves tres diferencias donde no las hay.
- **C)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 4: dos caracteres seguidos cambian de lugar (JCLX / JCXL). Filas iguales: 4 − 1 = 3

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. PASILLO 524 | PASILLO 520
2. VALLE 548 | VALLE S48
3. FAROL 856 | FAROL 856
4. AVENIDA 301 | AVENIDA 301
5. MESA 709 | MESA 790
```

- **A)** 4 — Pasas por alto dos diferencias.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 2 ✔ correcta
- **D)** 5 — Pasas por alto tres diferencias.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: una cifra cambia (PASILLO 524 / PASILLO 520); fila 2: un carácter cambia por otro parecido (VALLE 548 / VALLE S48); fila 5: dos caracteres seguidos cambian de lugar (MESA 709 / MESA 790). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 59JAU | 59JAU
2. 9MXB4 | 9MXB4
3. 7G803 | 4G803
4. NVM52 | NM52
5. 62EM8 | 62E8M
```

- **A)** 2 ✔ correcta
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 4 — Pasas por alto dos diferencias.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: una cifra cambia (7G803 / 4G803); fila 4: falta un carácter (NVM52 / NM52); fila 5: dos caracteres seguidos cambian de lugar (62EM8 / 62E8M). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. TAZA 396 | TZAA 396
2. PASTEL 463 | PASTEL 463
3. TECHO 435 | TECHO 035
4. VENTANA 165 | VENTANA 165
5. YEGUA 361 | YEGUA 36I
```

- **A)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 2 ✔ correcta
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 0 — Ves dos diferencias donde no las hay.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (TAZA 396 / TZAA 396); fila 3: una cifra cambia (TECHO 435 / TECHO 035); fila 5: un carácter cambia por otro parecido (YEGUA 361 / YEGUA 36I). Filas iguales: 5 − 3 = 2

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 961512 | 991512
2. 244436 | 24436
3. 627358 | 627358
4. 594854 | 594854
5. 937704 | 937704
```

- **A)** 3 ✔ correcta
- **B)** 5 — Pasas por alto dos diferencias.
- **C)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (961512 / 991512); fila 2: falta un carácter (244436 / 24436). Filas iguales: 5 − 2 = 3

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. OBRERO 879 | OBRERO 879
2. DEDAL 940 | DEDAL 940
3. MANTA 495 | MANTA 49S
4. SONIDO 173 | SNIDO 173
5. ASIENTO 670 | ASIETNO 670
6. SOMBRERO 605 | SOM8RERO 605
```

- **A)** 2 ✔ correcta
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 4 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: un carácter cambia por otro parecido (MANTA 495 / MANTA 49S); fila 4: falta un carácter (SONIDO 173 / SNIDO 173); fila 5: dos caracteres seguidos cambian de lugar (ASIENTO 670 / ASIETNO 670); fila 6: un carácter cambia por otro parecido (SOMBRERO 605 / SOM8RERO 605). Filas iguales: 6 − 4 = 2

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 3486977 | 3486977
2. 1097708 | 1097708
3. 6030871 | 6030871
4. 1456755 | 1456755
5. 5444933 | 544933
6. 5702084 | 5702084
```

- **A)** 3 — Ves dos diferencias donde no las hay.
- **B)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 5 ✔ correcta
- **D)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 5: falta un carácter (5444933 / 544933). Filas iguales: 6 − 1 = 5

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 9537929 | 9537929
2. 9792914 | 9729914
3. 1430779 | 130779
4. 3986117 | 3986717
5. 1167559 | 1167659
6. 7389128 | 738128
```

- **A)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 3 — Pasas por alto dos diferencias.
- **C)** 1 ✔ correcta
- **D)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (9792914 / 9729914); fila 3: falta un carácter (1430779 / 130779); fila 4: un carácter cambia por otro parecido (3986117 / 3986717); fila 5: un carácter cambia por otro parecido (1167559 / 1167659); fila 6: falta un carácter (7389128 / 738128). Filas iguales: 6 − 5 = 1

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. DUENDE 339 | UDENDE 339
2. DINERO 911 | DINEO 911
3. GORRA 55 | G0RRA 55
4. CARPETA 846 | CAREPTA 846
5. PATATA 518 | PATATA 518
6. GUANTE 823 | GUANTE 823
```

- **A)** 2 ✔ correcta
- **B)** 5 — Pasas por alto tres diferencias.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 4 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (DUENDE 339 / UDENDE 339); fila 2: falta un carácter (DINERO 911 / DINEO 911); fila 3: un carácter cambia por otro parecido (GORRA 55 / G0RRA 55); fila 4: dos caracteres seguidos cambian de lugar (CARPETA 846 / CAREPTA 846). Filas iguales: 6 − 4 = 2

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 7678KUT | 7678KUT
2. HRU1PJ2 | HRU1PJ2
3. 6P87WBA | 68P7WBA
4. N7UGARA | N7UGARA
5. 0WT30R2 | 0WT302
6. 1JE3MP9 | 1JE3MP9
7. 5J14XVB | 5J14XVB
```

- **A)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 2 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 6 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 5 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: dos caracteres seguidos cambian de lugar (6P87WBA / 68P7WBA); fila 5: falta un carácter (0WT30R2 / 0WT302). Filas iguales: 7 − 2 = 5

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. DA0VY44 | DA0VY44
2. FEU1DLE | FEUIDLE
3. 6VJFLFV | V6JFLFV
4. V2190B4 | V2190B4
5. 3KUY579 | 3KUYS79
6. JNFDEXF | JNFDEXF
7. 740YC3R | 740YC3R
```

- **A)** 1 — Ves tres diferencias donde no las hay.
- **B)** 2 — Ves dos diferencias donde no las hay.
- **C)** 4 ✔ correcta
- **D)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (FEU1DLE / FEUIDLE); fila 3: dos caracteres seguidos cambian de lugar (6VJFLFV / V6JFLFV); fila 5: un carácter cambia por otro parecido (3KUY579 / 3KUYS79). Filas iguales: 7 − 3 = 4

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. AB8R1VJ | AB81RVJ
2. 6LLU761 | 6LLU761
3. YW070R2 | YW07R02
4. 0FHDH04 | F0HDH04
5. J0AJ9CR | JA0J9CR
6. GE78GBW | GE7G8BW
7. FM6AMKJ | FM6AMKJ
```

- **A)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 4 — Pasas por alto dos diferencias.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (AB8R1VJ / AB81RVJ); fila 3: dos caracteres seguidos cambian de lugar (YW070R2 / YW07R02); fila 4: dos caracteres seguidos cambian de lugar (0FHDH04 / F0HDH04); fila 5: dos caracteres seguidos cambian de lugar (J0AJ9CR / JA0J9CR); fila 6: dos caracteres seguidos cambian de lugar (GE78GBW / GE7G8BW). Filas iguales: 7 − 5 = 2

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 427479712 | 427479712
2. 139073754 | 13903754
3. 755919198 | 755919198
4. 880169736 | 880199736
5. 786771030 | 76771030
6. 526501154 | 562501154
7. 248344547 | 248844547
```

- **A)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 2 ✔ correcta
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (139073754 / 13903754); fila 4: un carácter cambia por otro parecido (880169736 / 880199736); fila 5: falta un carácter (786771030 / 76771030); fila 6: dos caracteres seguidos cambian de lugar (526501154 / 562501154); fila 7: un carácter cambia por otro parecido (248344547 / 248844547). Filas iguales: 7 − 5 = 2

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. HZGGDDB | HZGGDDB
2. A5A2BNM | ASA2BNM
3. OHB5FFD | OHB5FFD
4. 8N8IEO5 | 8N8IEO5
5. O5JBOBS | O5JBOBS
6. IHNMLKE | IHNMLKE
7. Z8JB1Z1 | Z8JBIZ1
8. 8L2GDB1 | 8L2GDB1
```

- **A)** 7 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 5 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 8 — Pasas por alto dos diferencias.
- **D)** 6 ✔ correcta

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (A5A2BNM / ASA2BNM); fila 7: un carácter cambia por otro parecido (Z8JB1Z1 / Z8JBIZ1). Filas iguales: 8 − 2 = 6

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 6841484380 | 6841484380
2. 6579009702 | 6579009702
3. 4046287008 | 404628708
4. 5003935168 | 5003935168
5. 8242423736 | 8242423736
6. 6194161701 | 6194161701
7. 5066809503 | 5066809503
8. 5376795736 | 5376795736
```

- **A)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 6 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 7 ✔ correcta
- **D)** 5 — Ves dos diferencias donde no las hay.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: falta un carácter (4046287008 / 404628708). Filas iguales: 8 − 1 = 7

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. MOEEB0N | MOEEB0N
2. IGMO2KM | 1GMO2KM
3. HNJMKCS | HNJMKCS
4. IAGF0GB | IAGF0GB
5. 5ECOB8G | 5ECOB8G
6. BI2GNJG | BI2GNJG
7. BLDZ8B1 | BLDZ8B1
8. G8NZS58 | G8NZS58
```

- **A)** 5 — Ves dos diferencias donde no las hay.
- **B)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 6 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 7 ✔ correcta

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (IGMO2KM / 1GMO2KM). Filas iguales: 8 − 1 = 7

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 9537796481 | 9537796487
2. 7766550902 | 1766550902
3. 9591105575 | 959115575
4. 3522224102 | 3522224102
5. 5269097930 | 5269097390
6. 8463836337 | 8463833637
7. 6919686470 | 6991686470
8. 2057180118 | 2057130118
```

- **A)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 1 ✔ correcta
- **C)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 7 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (9537796481 / 9537796487); fila 2: un carácter cambia por otro parecido (7766550902 / 1766550902); fila 3: falta un carácter (9591105575 / 959115575); fila 5: dos caracteres seguidos cambian de lugar (5269097930 / 5269097390); fila 6: dos caracteres seguidos cambian de lugar (8463836337 / 8463833637); fila 7: dos caracteres seguidos cambian de lugar (6919686470 / 6991686470); fila 8: un carácter cambia por otro parecido (2057180118 / 2057130118). Filas iguales: 8 − 7 = 1

- [ ] Revisada · Comentarios:
