# Muestras · Comparación de datos (`DAT.COMPARA`, versión 1)

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
1. 49722 | 49722
2. 69705 | 69700
3. 58689 | 58689
4. 73316 | 73316
```

- **A)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 ✔ correcta

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: una cifra cambia (69705 / 69700). Filas iguales: 4 − 1 = 3

- [ ] Revisada · Comentarios:

### 2. Nivel 1 · semilla `muestra-1-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. W6VN | W6VN
2. KFND | KND
3. 5D14 | 5D14
4. TCEV | TCV
```

- **A)** 2 ✔ correcta
- **B)** 4 — Pasas por alto dos diferencias.
- **C)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (KFND / KND); fila 4: falta un carácter (TCEV / TCV). Filas iguales: 4 − 2 = 2

- [ ] Revisada · Comentarios:

### 3. Nivel 1 · semilla `muestra-1-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 28549 | 28589
2. 41555 | 41155
3. 85213 | 85213
4. 26548 | 29548
```

- **A)** 1 ✔ correcta
- **B)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 3 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: una cifra cambia (28549 / 28589); fila 2: una cifra cambia (41555 / 41155); fila 4: un carácter cambia por otro parecido (26548 / 29548). Filas iguales: 4 − 3 = 1

- [ ] Revisada · Comentarios:

### 4. Nivel 1 · semilla `muestra-1-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. RY4Y | R4Y
2. 1GF9 | 1GF9
3. 1768 | 8768
4. 0WV8 | 0VW8
```

- **A)** 1 ✔ correcta
- **B)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 3 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 4 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (RY4Y / R4Y); fila 3: una cifra cambia (1768 / 8768); fila 4: dos caracteres seguidos cambian de lugar (0WV8 / 0VW8). Filas iguales: 4 − 3 = 1

- [ ] Revisada · Comentarios:

### 5. Nivel 2 · semilla `muestra-2-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. VIÑEDO 952 | VIÑED0 952
2. RINCON 714 | RINCON 714
3. PUENTE 812 | PUENTE 812
4. CAÑA 690 | ACÑA 690
5. ANILLO 884 | ANILLO 884
```

- **A)** 5 — Pasas por alto dos diferencias.
- **B)** 3 ✔ correcta
- **C)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (VIÑEDO 952 / VIÑED0 952); fila 4: dos caracteres seguidos cambian de lugar (CAÑA 690 / ACÑA 690). Filas iguales: 5 − 2 = 3

- [ ] Revisada · Comentarios:

### 6. Nivel 2 · semilla `muestra-2-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. NUDO 92 | NUDO 92
2. HIERRO 248 | HIERO 248
3. MARINO 171 | MARINO 171
4. CAÑA 77 | CAÑA 7
5. BUZON 134 | BUZON 134
```

- **A)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 5 — Pasas por alto dos diferencias.
- **C)** 3 ✔ correcta
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (HIERRO 248 / HIERO 248); fila 4: falta un carácter (CAÑA 77 / CAÑA 7). Filas iguales: 5 − 2 = 3

- [ ] Revisada · Comentarios:

### 7. Nivel 2 · semilla `muestra-2-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 7899A | 7899A
2. WT5C3 | WTSC3
3. KPXM2 | KPXM9
4. R4K2H | R4KZH
5. 3HG31 | 3HG3I
```

- **A)** 4 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 1 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (WT5C3 / WTSC3); fila 3: una cifra cambia (KPXM2 / KPXM9); fila 4: un carácter cambia por otro parecido (R4K2H / R4KZH); fila 5: un carácter cambia por otro parecido (3HG31 / 3HG3I). Filas iguales: 5 − 4 = 1

- [ ] Revisada · Comentarios:

### 8. Nivel 2 · semilla `muestra-2-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. PAÑUELO 806 | PAÑUELO 806
2. PAPEL 112 | PAPEL 112
3. NARANJA 892 | NARANJA 82
4. PLAZA 41 | PLAZA 41
5. ENERO 945 | ENERO 945
```

- **A)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 4 ✔ correcta

1. **Observa:** Hay 5 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 3: falta un carácter (NARANJA 892 / NARANJA 82). Filas iguales: 5 − 1 = 4

- [ ] Revisada · Comentarios:

### 9. Nivel 3 · semilla `muestra-3-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. AA2AYK | AA2AYK
2. 13AWFL | 13AWLF
3. KVAR78 | KVAR78
4. 5PAY16 | 5PAY16
5. LCCK4D | LCCK4D
6. MPHGFY | MPHFGY
```

- **A)** 2 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 4 ✔ correcta
- **D)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: dos caracteres seguidos cambian de lugar (13AWFL / 13AWLF); fila 6: dos caracteres seguidos cambian de lugar (MPHGFY / MPHFGY). Filas iguales: 6 − 2 = 4

- [ ] Revisada · Comentarios:

### 10. Nivel 3 · semilla `muestra-3-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 43XC9E | 43XC9E
2. 1XL8UD | 1XLBUD
3. H3203D | H3203D
4. L0UV0V | L0UV0V
5. DR2ETL | DRZETL
6. 8J087A | 8JO87A
```

- **A)** 3 ✔ correcta
- **B)** 5 — Pasas por alto dos diferencias.
- **C)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (1XL8UD / 1XLBUD); fila 5: un carácter cambia por otro parecido (DR2ETL / DRZETL); fila 6: un carácter cambia por otro parecido (8J087A / 8JO87A). Filas iguales: 6 − 3 = 3

- [ ] Revisada · Comentarios:

### 11. Nivel 3 · semilla `muestra-3-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. CX219V | XC219V
2. NN670D | NN670D
3. EV0GCT | EV0GTC
4. KLM2T0 | KLM2TO
5. 4DX52Y | 4DX52Y
6. PFMTPG | PFTMPG
```

- **A)** 4 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 ✔ correcta
- **D)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (CX219V / XC219V); fila 3: dos caracteres seguidos cambian de lugar (EV0GCT / EV0GTC); fila 4: un carácter cambia por otro parecido (KLM2T0 / KLM2TO); fila 6: dos caracteres seguidos cambian de lugar (PFMTPG / PFTMPG). Filas iguales: 6 − 4 = 2

- [ ] Revisada · Comentarios:

### 12. Nivel 3 · semilla `muestra-3-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. 8259427 | 8259427
2. 9320191 | 9320197
3. 5690090 | 5690090
4. 5530759 | 5530759
5. 4961149 | 4961149
6. 8326453 | 8326453
```

- **A)** 1 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 6 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 5 ✔ correcta

1. **Observa:** Hay 6 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (9320191 / 9320197). Filas iguales: 6 − 1 = 5

- [ ] Revisada · Comentarios:

### 13. Nivel 4 · semilla `muestra-4-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. X9TC1ED | X9TCE1D
2. KT7N05D | TK7N05D
3. 8PPHEX6 | BPPHEX6
4. HJHUH9W | HJHUH9W
5. 9XP30TV | 9XP30TV
6. 215UA77 | 215UA7
7. F961WNK | F91WNK
```

- **A)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **C)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **D)** 2 ✔ correcta

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (X9TC1ED / X9TCE1D); fila 2: dos caracteres seguidos cambian de lugar (KT7N05D / TK7N05D); fila 3: un carácter cambia por otro parecido (8PPHEX6 / BPPHEX6); fila 6: falta un carácter (215UA77 / 215UA7); fila 7: falta un carácter (F961WNK / F91WNK). Filas iguales: 7 − 5 = 2

- [ ] Revisada · Comentarios:

### 14. Nivel 4 · semilla `muestra-4-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. YR33HTY | YR33HY
2. M1B33EC | MIB33EC
3. YWLV6J9 | WYLV6J9
4. KVVF6PH | KVVFPH
5. K5C2DL3 | K5C2DL3
6. W507UFN | W570UFN
7. 5P5WRV9 | 5PSWRV9
```

- **A)** 6 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 1 ✔ correcta
- **C)** 0 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **D)** 2 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (YR33HTY / YR33HY); fila 2: un carácter cambia por otro parecido (M1B33EC / MIB33EC); fila 3: dos caracteres seguidos cambian de lugar (YWLV6J9 / WYLV6J9); fila 4: falta un carácter (KVVF6PH / KVVFPH); fila 6: dos caracteres seguidos cambian de lugar (W507UFN / W570UFN); fila 7: un carácter cambia por otro parecido (5P5WRV9 / 5PSWRV9). Filas iguales: 7 − 6 = 1

- [ ] Revisada · Comentarios:

### 15. Nivel 4 · semilla `muestra-4-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. E49KXDA | E49KXDA
2. 4TWLLRV | 4TWLLV
3. 44BDWMF | 44BDMF
4. A6N72U3 | A6N72U3
5. H499PF7 | H499PF7
6. 67DRXL8 | 67DRXLB
7. 58VBHW9 | 5VBHW9
```

- **A)** 3 ✔ correcta
- **B)** 4 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 5 — Pasas por alto dos diferencias.
- **D)** 2 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: falta un carácter (4TWLLRV / 4TWLLV); fila 3: falta un carácter (44BDWMF / 44BDMF); fila 6: un carácter cambia por otro parecido (67DRXL8 / 67DRXLB); fila 7: falta un carácter (58VBHW9 / 5VBHW9). Filas iguales: 7 − 4 = 3

- [ ] Revisada · Comentarios:

### 16. Nivel 4 · semilla `muestra-4-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. YCDL1EN | YCDL1EN
2. VY5E3CW | VYSE3CW
3. WDHECPT | WDHECTP
4. U32253W | U3253W
5. EGY5EMT | EGYE5MT
6. UVVK2WD | UVVKZWD
7. 4H1TKM1 | 4H1TKM1
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 2 ✔ correcta
- **C)** 5 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 7 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 2: un carácter cambia por otro parecido (VY5E3CW / VYSE3CW); fila 3: dos caracteres seguidos cambian de lugar (WDHECPT / WDHECTP); fila 4: falta un carácter (U32253W / U3253W); fila 5: dos caracteres seguidos cambian de lugar (EGY5EMT / EGYE5MT); fila 6: un carácter cambia por otro parecido (UVVK2WD / UVVKZWD). Filas iguales: 7 − 5 = 2

- [ ] Revisada · Comentarios:

### 17. Nivel 5 · semilla `muestra-5-1`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. B5CNS1J | B5CN51J
2. BB5B5NJ | BB5BNJ
3. N8SS0ES | N8SS0ES
4. JB5LFHM | JB5LFHM
5. SH8I25B | SH8I25B
6. KOBES0O | KOBES0O
7. LSGM0HG | L5GM0HG
8. CDZ0JEF | CD20JEF
```

- **A)** 3 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **B)** 5 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 6 — Pasas por alto dos diferencias.
- **D)** 4 ✔ correcta

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: un carácter cambia por otro parecido (B5CNS1J / B5CN51J); fila 2: falta un carácter (BB5B5NJ / BB5BNJ); fila 7: un carácter cambia por otro parecido (LSGM0HG / L5GM0HG); fila 8: un carácter cambia por otro parecido (CDZ0JEF / CD20JEF). Filas iguales: 8 − 4 = 4

- [ ] Revisada · Comentarios:

### 18. Nivel 5 · semilla `muestra-5-2`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. GCBN1HJ | GCBN1JH
2. SAFFB2F | SAFFB2F
3. HB1OLFS | HB1LOFS
4. 0SFO08B | 0SFO08B
5. H2IAZNS | H2IAZNS
6. 5NOB8K5 | 5NOB8K5
7. EDALB50 | EDAL50
8. KHL5ZSH | KHL5ZSH
```

- **A)** 3 — Cuentas las filas distintas en lugar de las iguales.
- **B)** 6 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 5 ✔ correcta
- **D)** 4 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (GCBN1HJ / GCBN1JH); fila 3: dos caracteres seguidos cambian de lugar (HB1OLFS / HB1LOFS); fila 7: falta un carácter (EDALB50 / EDAL50). Filas iguales: 8 − 3 = 5

- [ ] Revisada · Comentarios:

### 19. Nivel 5 · semilla `muestra-5-3`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. IHI5BEJ | IHI5EJ
2. M0FGK2D | M0GFK2D
3. B0BZDBE | B0BDZBE
4. IC1B15F | IC1B1F
5. 5ZB0OZF | SZB0OZF
6. NZIMGKB | NZIMGKB
7. LONBKGC | LONBKCG
8. BK521I2 | BK521I2
```

- **A)** 2 ✔ correcta
- **B)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **C)** 6 — Cuentas las filas distintas en lugar de las iguales.
- **D)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: falta un carácter (IHI5BEJ / IHI5EJ); fila 2: dos caracteres seguidos cambian de lugar (M0FGK2D / M0GFK2D); fila 3: dos caracteres seguidos cambian de lugar (B0BZDBE / B0BDZBE); fila 4: falta un carácter (IC1B15F / IC1B1F); fila 5: un carácter cambia por otro parecido (5ZB0OZF / SZB0OZF); fila 7: dos caracteres seguidos cambian de lugar (LONBKGC / LONBKCG). Filas iguales: 8 − 6 = 2

- [ ] Revisada · Comentarios:

### 20. Nivel 5 · semilla `muestra-5-4`

```
¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?
1. AIC0FBK | IAC0FBK
2. JGO1IH2 | JGO1IH2
3. ZCLNCCZ | 2CLNCCZ
4. 2KGF50B | 2KGF05B
5. LFKZMBB | LFKMBB
6. SFJMEFA | 5FJMEFA
7. BFAE5SB | BFAE5SB
8. BZC0D51 | BZC0DS1
```

- **A)** 3 — Pasas por alto una de las diferencias y cuentas como igual una fila distinta.
- **B)** 1 — Ves una diferencia donde no la hay y descuentas una fila igual.
- **C)** 2 ✔ correcta
- **D)** 6 — Cuentas las filas distintas en lugar de las iguales.

1. **Observa:** Hay 8 filas. Compara cada pareja carácter a carácter.
2. **Regla:** Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.
3. **Aplica:** Diferencias: fila 1: dos caracteres seguidos cambian de lugar (AIC0FBK / IAC0FBK); fila 3: un carácter cambia por otro parecido (ZCLNCCZ / 2CLNCCZ); fila 4: dos caracteres seguidos cambian de lugar (2KGF50B / 2KGF05B); fila 5: falta un carácter (LFKZMBB / LFKMBB); fila 6: un carácter cambia por otro parecido (SFJMEFA / 5FJMEFA); fila 8: un carácter cambia por otro parecido (BZC0D51 / BZC0DS1). Filas iguales: 8 − 6 = 2

- [ ] Revisada · Comentarios:
