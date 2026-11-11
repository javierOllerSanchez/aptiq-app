# Aptiq — Requisitos

Fuente viva: [Aptiq — Análisis de requisitos y plan de desarrollo](https://claude.ai/artifact/91W62zxu3r2h49Y4cpHLcj). Este archivo es la copia de trabajo para Claude Code; si hay diferencias, se pregunta al propietario del producto.

## Resumen y alcance

Aptiq es una app móvil (iOS y Android, preparada para web en el futuro) para entrenar la prueba de **aptitudes psicotécnicas** de oposiciones, con simulacros que reproducen el formato oficial y una explicación paso a paso en cada pregunta.

- **MVP:** solo **Guardia Civil** (es el cuerpo que más material oficial publica). Policía Nacional y Auxiliar Administrativo del Estado llegan después con el mismo motor.
- **Dentro del MVP:** aptitud numérica, verbal, abstracta, espacial y de atención; español de España; suscripción freemium.
- **Fuera del MVP:** personalidad y entrevista, temario teórico, pruebas físicas, versión web, comunidad o rankings, venta a academias.

### Principios de contenido (no negociables)

1. Solo se usan como referencia exámenes **publicados oficialmente** por las instituciones (bases del BOE, cuestionarios y plantillas publicados tras la convocatoria).
2. Todas las preguntas son **originales**, generadas a partir de los patrones de esos exámenes. Ninguna se copia.
3. Toda pregunta lleva **explicación paso a paso**, el porqué de cada opción incorrecta y un truco de examen.
4. Cada formato de simulacro **cita su fuente**.

## Usuarios

| Perfil | Contexto | Lo que necesita |
| --- | --- | --- |
| Opositor a Guardia Civil o Policía | Joven, usa sobre todo el móvil, prepara a la vez temario y físicas | Simulacros realistas con cronómetro y penalización, sesiones cortas diarias |
| Opositor a Auxiliar Administrativo | Perfil de edad más amplio, a menudo trabajando | Sesiones de 10–15 min, letra legible, progreso claro |
| Opositor con academia | Ya tiene temario y clases; practica poco el psicotécnico | Práctica extra centrada en sus puntos débiles |
| Repetidor | Suspendió o quedó sin plaza | Saber qué aptitud le hizo perder nota y entrenarla |

Los perfiles son hipótesis a validar con entrevistas antes de la beta.

## Requisitos funcionales

Prioridad: **Imprescindible** (MVP), **Importante** (justo después del lanzamiento), **Deseable** (más adelante).

| ID | Módulo | Requisito | Prioridad |
| --- | --- | --- | --- |
| ONB-01 | Inicio y cuenta | Elegir oposición y fecha prevista de examen en el primer arranque | Imprescindible |
| ONB-02 | Inicio y cuenta | Test de nivel inicial de 10 minutos que estima el punto de partida por aptitud | Imprescindible |
| ONB-03 | Inicio y cuenta | Probar sin cuenta; crear cuenta (Apple, Google o email) para guardar el progreso | Imprescindible |
| ONB-04 | Inicio y cuenta | Cambiar de oposición o preparar varias a la vez | Importante |
| ENT-01 | Práctica | Practicar por aptitud y por tipo de ejercicio (p. ej. Numérica › Series) | Imprescindible |
| ENT-02 | Práctica | Sesión de hoy: mezcla diaria que prioriza los puntos débiles | Imprescindible |
| ENT-03 | Práctica | Dificultad adaptativa según los aciertos recientes | Importante |
| ENT-04 | Práctica | Modo contrarreloj por tipo para ganar velocidad | Deseable |
| SIM-01 | Simulacro | Simulacro con el formato del perfil oficial: número de preguntas, tiempo, opciones y penalización | Imprescindible |
| SIM-02 | Simulacro | Cronómetro visible, dejar en blanco, marcar para revisar y navegar entre preguntas | Imprescindible |
| SIM-03 | Simulacro | Modo examen sin pausas ni explicaciones hasta el final | Imprescindible |
| SIM-04 | Simulacro | Mini simulacros de 10 y 20 preguntas con la misma proporción de tipos | Importante |
| EXP-01 | Explicaciones | Explicación paso a paso de cada pregunta | Imprescindible |
| EXP-02 | Explicaciones | Por qué es incorrecta cada opción errónea (error típico que la produce) | Imprescindible |
| EXP-03 | Explicaciones | Truco de examen por tipo de ejercicio | Imprescindible |
| EXP-04 | Explicaciones | Fichas de método por tipo (cómo atacar series, giros, cubos…) | Importante |
| RES-01 | Resultado | Nota neta con la fórmula visible (aciertos − fallos ÷ penalización) | Imprescindible |
| RES-02 | Resultado | Desglose por aptitud y por tipo, con la aptitud a reforzar | Imprescindible |
| RES-03 | Resultado | Repasar fallos y preguntas en blanco con su explicación | Imprescindible |
| RES-04 | Resultado | Comparar con la nota mínima oficial cuando las bases la fijan | Importante |
| PRO-01 | Progreso | Nivel estimado por aptitud y global, con su evolución | Imprescindible |
| PRO-02 | Progreso | Historial de simulacros y sesiones | Imprescindible |
| PRO-03 | Progreso | Racha y cuenta atrás hasta el examen, en segundo plano | Importante |
| PRO-04 | Progreso | Plan semanal según la fecha del examen y el tiempo disponible | Deseable |
| REP-01 | Repaso | Repetición espaciada de los tipos de ejercicio fallados | Importante |
| CON-01 | Contenido | Perfiles de examen por oposición con su fuente oficial citada | Imprescindible |
| CON-02 | Contenido | Preguntas generadas sin repetición para el mismo usuario | Imprescindible |
| CON-03 | Contenido | Práctica sin conexión | Imprescindible |
| CON-04 | Contenido | Perfiles de Policía Nacional y Auxiliar Administrativo | Importante |
| NOT-01 | Avisos | Recordatorio diario configurable | Importante |
| NOT-02 | Avisos | Aviso de cambios en las bases o fechas de la oposición elegida | Deseable |
| PAY-01 | Pago | Suscripción con prueba gratuita, gestionada por App Store y Google Play | Imprescindible |
| PAY-02 | Pago | Pase de pago único por oposición (3, 6 o 12 meses) | Imprescindible |
| PAY-03 | Pago | Restaurar compras y gestionar la suscripción | Imprescindible |
| SOP-01 | Soporte | Reportar un error en una pregunta desde la propia pregunta | Imprescindible |
| SOP-02 | Soporte | Borrar la cuenta y los datos desde la app | Imprescindible |
| SOP-03 | Soporte | Ayuda y contacto | Imprescindible |
| ADM-01 | Interno | Panel para revisar preguntas reportadas y aprobar las verbales | Imprescindible |
| ADM-02 | Interno | Métricas por pregunta y tipo: acierto, tiempo, discriminación | Importante |
| ADM-03 | Interno | Editar perfiles de examen sin publicar una versión nueva de la app | Importante |

## Requisitos no funcionales

| ID | Área | Requisito |
| --- | --- | --- |
| NFR-01 | Sin conexión | Práctica y simulacros funcionan sin red; los resultados se sincronizan al recuperarla |
| NFR-02 | Rendimiento | Arranque < 2 s en un móvil de gama media; pregunta nueva en < 100 ms |
| NFR-03 | Fiabilidad | El cronómetro sigue contando bien si la app pasa a segundo plano o se cierra (se calcula con marcas de tiempo, no con un contador) |
| NFR-04 | Accesibilidad | WCAG 2.1 AA, texto dinámico, VoiceOver y TalkBack, zonas táctiles ≥ 44 px |
| NFR-05 | Privacidad | RGPD: datos mínimos, alojamiento en la UE, consentimiento para analítica, exportar y borrar datos |
| NFR-06 | Seguridad | Acceso por fila (RLS) en la base de datos; ningún secreto dentro de la app |
| NFR-07 | Calidad | Pruebas automáticas de cada generador y de la puntuación; sin pruebas en verde no se toca el motor |
| NFR-08 | Legal | Aviso visible de que la app es independiente de la Administración; cada perfil cita su fuente |
| NFR-09 | Contenido | Generación determinista por semilla (la misma semilla produce la misma pregunta) |
| NFR-10 | Plataformas | iOS 16+ y Android 9+, solo español de España |
| NFR-11 | Diseño | Sistema visual de Aptiq (`docs/guia-estilos.md`) |

## Motor de contenido

1. **Ficha oficial por oposición:** bases del BOE + cuestionarios y plantillas publicados. Cada ficha guarda organismo, convocatoria, enlace y fecha de consulta.
2. **Perfil de examen versionado** (skill `aptiq-exam-profile`).
3. **Taxonomía de tipos** con código (`NUM.SERIE.ARIT`), regla, niveles y tiempo esperado.
4. **Generadores por código + solucionador independiente** (skill `aptiq-generator`).
5. **Redacción con revisión humana** para lo verbal; nada se publica sin aprobación.
6. **Control de calidad:** pruebas masivas + revisión experta de una muestra por generador.
7. **Calibración** con datos reales de uso.

| Fase | Tipos | Cómo se crean |
| --- | --- | --- |
| MVP | Series numéricas, series de letras, cálculo y porcentajes, códigos y criptogramas, ordenación alfabética, comparación de datos | Generador + solucionador |
| MVP | Sinónimos y antónimos, analogías verbales | Redacción + revisión |
| Después | Figuras giradas y en espejo, series de figuras, matrices | Generador SVG + solucionador |
| Después | Desarrollos de cubos, recuento de bloques | Generador 3D sencillo en SVG |
| Después | Comprensión lectora, silogismos | Redacción + revisión |

## Monetización

| | Gratis | Premium |
| --- | --- | --- |
| Sesión de hoy | 1 al día | Ilimitada |
| Práctica por tipo | 3 tipos básicos | Todos los tipos y niveles |
| Simulacros con formato oficial | 1 a la semana | Ilimitados |
| Explicaciones paso a paso | En todo lo que respondes | En todo lo que respondes |
| Desglose y repaso de fallos | Del último simulacro | Historial completo y repetición espaciada |
| Nivel estimado | Global | Por aptitud y tipo |

Precios orientativos (a validar): mensual 7,99 €, pase 3 meses 19,99 €, pase 6 meses 29,99 €, anual 39,99 € (destacado, 7 días de prueba). El muro de pago aparece al terminar el primer simulacro, nunca en el primer arranque. Los precios se configuran en RevenueCat, no en el código.

## Riesgos principales

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Pregunta con dos respuestas válidas o explicación errónea | Alto | Solucionador independiente, pruebas masivas, revisión experta, reporte desde la pregunta |
| Formato de examen distinto del oficial | Alto | Perfiles solo desde fuentes oficiales con fecha; revisión en cada convocatoria |
| Propiedad intelectual | Medio | Ninguna pregunta copiada; consulta legal antes del lanzamiento |
| Coste de captación | Alto | Contenido orgánico, canales de opositores, alianzas con academias |
| Abandono tras el examen | Medio | Pases por periodo y nuevas oposiciones |
| Generadores espaciales complejos | Medio | Fuera del MVP; se empieza por giros 2D |
