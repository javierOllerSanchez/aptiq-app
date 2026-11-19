# Fase 8 · Contenido ampliado y panel interno · Plan

**Rama:** `fase-8-contenido`
**Requisitos:** ADM-01, ADM-02, ADM-03, SOP-01, EXP-04, CON-04 (y la tabla «Motor de contenido» de `docs/requisitos.md`: espaciales en SVG y verbales con revisión).
**Criterio de aceptación (`docs/plan-fases.md`):** ninguna verbal se publica sin aprobación; los reportes llegan al panel con la semilla y la pregunta se reproduce.
**Estado:** plan confirmado por el propietario el 2026-11-19 («Sí, tal cual»), con las propuestas de las decisiones 1–7.
**Skills:** la ficha no nombra ninguna. Uso `aptiq-generator` (manda en generadores y verbales), `aptiq-exam-profile` (perfiles nuevos y editables), `aptiq-design-system` (pantallas nuevas y panel), `supabase-postgres-best-practices` (tablas, RLS y funciones) y Superpowers `test-driven-development` como método en el motor.

## Punto de partida

- El motor tiene 6 tipos, todos generados por código; ninguno espacial y ninguna verbal redactada. No existe la aptitud «espacial».
- Las preguntas guardadas llevan tipo, nivel, semilla, respuesta y acierto, pero **no el tiempo** de cada respuesta ni la versión del generador: hacen falta para las métricas (ADM-02) y para reproducir un reporte.
- Supabase: 4 tablas de usuario con RLS y sin permisos para `anon`. No hay rol de administrador.
- El código por correo sigue sin SMTP propio (aplazado). El correo por defecto de Supabase sí envía **enlaces mágicos**, con un límite bajo por hora que basta para una persona.

## Reglas

- **Pruebas primero en el motor**; sin pruebas en verde no se toca `packages/engine`.
- **Figuras:** el motor describe cada figura con datos (celdas, segmentos, giros), y una función pura del motor la convierte en trazos SVG. Así el móvil (`react-native-svg`) y el panel web pintan exactamente lo mismo, y el solucionador trabaja sobre los datos, no sobre dibujos.
- **Verbales:** no se generan por código. Se redactan (borradores míos, marcados como borrador), viven en Supabase con estado `borrador`, `aprobada` o `rechazada`, y **la base de datos solo deja leer las aprobadas** a la app (RLS). La app las guarda en el móvil para usarlas sin conexión. Un tipo verbal no aparece en la app hasta tener suficientes aprobadas.
- **Panel (`apps/admin`):** Next.js solo en el navegador con `@supabase/supabase-js` y la clave publicable. Nada de clave de servicio: la seguridad la dan RLS y una función `es_admin()` que mira una marca en tu usuario. Las métricas salen de una función que devuelve **solo agregados**; el panel no lee las respuestas de cada persona.
- **Reportes:** guardan tipo, nivel, semilla, versión del generador, número de opciones, motivo y comentario. Nunca el correo. El panel regenera la pregunta con el motor y avisa si la versión del generador ya no coincide.
- **Perfiles:** cada dato con su fuente oficial; lo no confirmado, `null` y «Pendiente de confirmar». Editar un perfil crea una versión nueva; las antiguas no se tocan.
- Dependencias nuevas previstas: `next`, `react-dom` (panel). Se anotan en `docs/decisiones.md`.

## Tareas

### T1 · Figuras en el motor y aptitud «espacial»
- **Requisitos:** tabla «Motor de contenido» (espaciales en SVG), NFR-09.
- **Archivos:** `packages/engine/src/figures/figure.ts` (+ prueba), `taxonomy.ts` (aptitud `espacial`), `index.ts`.
- **Qué:** tipo `Figure` (polígonos en una cuadrícula y marcas), giro de 90°, espejo, comparación canónica y `toPaths(figure)` → trazos SVG con su caja.
- **Verificación:** Vitest + fast-check (girar 4 veces = original; espejo dos veces = original; trazos deterministas).

### T2 · Generador «Figuras giradas y en espejo» (`ESP.GIRO`)
- **Requisitos:** tabla «Motor de contenido», EXP-01, EXP-02, EXP-03.
- **Archivos:** `packages/engine/src/spatial/esp-giro.ts`, `.solver.ts`, `.test.ts`, instantáneas; `docs/muestras/ESP.GIRO.md`.
- **Qué:** «¿Qué figura es el modelo girado, sin darle la vuelta?». Distractores: el modelo en espejo y girado, y figuras con una celda cambiada. Solo figuras sin simetría de espejo (si no, habría dos correctas). Niveles: tamaño de la figura y giros de 90° a cualquiera de 4.
- **Verificación:** pruebas obligatorias de la skill (unicidad, determinismo, opciones distintas, coherencia, distractores, 1.000 por nivel); `revisor-contenido`.

### T3 · Generador «Series de figuras» (`ABS.FIGURAS`)
- **Requisitos:** igual que T2.
- **Archivos:** `packages/engine/src/spatial/abs-figuras.ts`, `.solver.ts`, `.test.ts`; `docs/muestras/ABS.FIGURAS.md`.
- **Qué:** serie de figuras donde un elemento gira un ángulo fijo, cambia de posición o aumenta en número; elegir la siguiente. Niveles: de una regla a dos reglas a la vez.
- **Verificación:** igual que T2.

### T4 · Generador «Desarrollos de cubos» (`ESP.CUBO`)
- **Requisitos:** igual que T2.
- **Archivos:** `packages/engine/src/spatial/esp-cubo.ts`, `.solver.ts`, `.test.ts`; `docs/muestras/ESP.CUBO.md`.
- **Qué:** un desarrollo plano (los 11 posibles) con símbolos en las caras; elegir el cubo que se puede formar. El solucionador pliega el desarrollo y prueba las 24 posiciones del cubo. Niveles: de símbolos simétricos a flechas cuya dirección importa.
- **Verificación:** igual que T2. Es el tipo más arriesgado (está en «Riesgos»): si no alcanza la calidad, lo digo y lo dejamos para después.

### T5 · Prototipos de las pantallas nuevas
- **Requisitos:** SOP-01, EXP-04, NFR-11.
- **Archivos:** `docs/prototipos/pregunta-figuras.html`, `pregunta-verbal.html`, `reportar.html`, `ficha-metodo.html` y sección en `index.html`.
- **Qué:** pregunta con figuras como opciones, pregunta verbal, hoja «Reportar un error» (motivo y comentario) y ficha de método por tipo.
- **Verificación:** **los apruebas tú** antes de T6, T9 y T15.

### T6 · Figuras en la app
- **Requisitos:** tabla «Motor de contenido», NFR-04.
- **Archivos:** `packages/ui/src/Figure.tsx` (+ prueba), `apps/mobile/src/screens/pregunta.tsx`, opciones de Práctica, Simulacro y Explicación; test de nivel.
- **Qué:** pintar enunciado y opciones con figuras; etiqueta de accesibilidad que describe la figura; los tres tipos entran en Práctica, Simulacro y test de nivel. Quedan fuera del plan gratuito.
- **Verificación:** pruebas de componente; capturas comparadas con el prototipo; `revisor-interfaz`.

### T7 · Banco de verbales con aprobación (servidor y motor)
- **Requisitos:** ADM-01, criterio de aceptación («ninguna verbal se publica sin aprobación»).
- **Archivos:** `supabase/migrations/…_verbales.sql` (tabla `pregunta_verbal`, función `es_admin()`), `supabase/tests/rls.sql`; `packages/engine/src/verbal/bank.ts` (+ prueba), `taxonomy.ts` (`VER.SINON` Sinónimos y antónimos, `VER.ANALOG` Analogías verbales), `session/plan.ts`.
- **Qué:** cada verbal guarda enunciado, opciones, correcta, explicación completa (observa, regla, aplica, error de cada opción, truco), nivel y estado. RLS: `anon` y usuarios solo leen las `aprobada`; solo el administrador crea, edita y aprueba. En el motor, un generador hecho a partir del banco: la semilla incluye el id de la pregunta y baraja las opciones (con 3 opciones quita un distractor fijo). `buildPractice` solo ofrece un tipo verbal si hay preguntas aprobadas.
- **Verificación:** prueba de RLS (una `borrador` no se ve sin ser administrador); pruebas del motor.

### T8 · Verbales en la app y primeros borradores
- **Requisitos:** criterio de aceptación, CON-03.
- **Archivos:** `apps/mobile/src/data/` (copia local del banco), descarga al abrir la app y al recuperar la red; `content/verbales/borradores.json` (borradores redactados por mí).
- **Qué:** la app descarga las aprobadas y las guarda en SQLite; sin red usa la copia. Redacto los borradores y los subo como `borrador`: ninguno se ve en la app hasta que lo apruebes en el panel.
- **Verificación:** prueba de que la app no recibe borradores; flujo: aprobar una en el panel → aparece en la app.

### T9 · Reportar un error desde la pregunta
- **Requisitos:** SOP-01, ADM-01.
- **Archivos:** `supabase/migrations/…_reportes.sql` (tabla `reporte`, solo inserción para la app), `apps/mobile/src/screens/explicacion.tsx` y hoja nueva, cola local de envío; `data/store.ts` (guardar versión del generador y tiempo de cada respuesta).
- **Qué:** botón «Reportar un error» en la explicación (práctica y repaso del simulacro; nunca durante el examen). Se guarda en el móvil y se envía cuando hay red, con reintentos.
- **Verificación:** pruebas de componente y de la cola; prueba de RLS (la app puede crear reportes pero no leerlos).

### T10 · Panel `apps/admin`: base y acceso
- **Requisitos:** ADM-01.
- **Archivos:** `apps/admin/` (Next.js, `package.json`, `turbo.json`), estilos con `packages/tokens` como variables CSS, `docs/decisiones.md`.
- **Qué:** entrar con enlace mágico; si tu usuario no es administrador, no ve nada (lo bloquea la base de datos, no solo la pantalla). Marca de administrador puesta una vez por SQL en tu usuario.
- **Verificación:** `pnpm typecheck`, `pnpm lint` y compilación del panel; un usuario normal no puede leer nada del panel (prueba de RLS).

### T11 · Panel: reportes y aprobación de verbales
- **Requisitos:** ADM-01, SOP-01, criterio de aceptación.
- **Archivos:** `apps/admin/app/reportes/`, `apps/admin/app/verbales/`.
- **Qué:** lista de reportes con su semilla; al abrir uno, la pregunta **se regenera con el motor** (texto o figuras) con su explicación, y se marca como resuelto o descartado. Verbales: editar, aprobar y rechazar.
- **Verificación:** prueba de extremo a extremo del criterio: reporte desde el emulador → aparece en el panel → la pregunta reproducida coincide con la del móvil.

### T12 · Perfiles de Policía Nacional y Auxiliar Administrativo del Estado
- **Requisitos:** CON-04, CON-01, NFR-08.
- **Archivos:** `packages/engine/profiles/policia-nacional-<año>.json`, `auxiliar-administrativo-<año>.json`, `profiles/analysis/*.md`, pruebas de perfiles.
- **Qué:** buscar las bases vigentes en el BOE y, si existen, los cuestionarios oficiales publicados (el INAP los publica para Auxiliar). Cada dato con su fuente; el resto pendiente. Recuentos por tipo sin copiar ninguna pregunta.
- **Verificación:** validador y pruebas de perfiles; **revisas tú los perfiles** (la skill lo exige); `revisor-contenido`.

### T13 · Perfiles editables sin publicar la app
- **Requisitos:** ADM-03.
- **Archivos:** `supabase/migrations/…_perfiles.sql` (tabla `perfil_examen` versionada), `apps/mobile/src/` (descargar, validar con `validateProfile`, guardar copia; el del motor queda de reserva), `apps/admin/app/perfiles/`.
- **Qué:** el panel edita un perfil y lo publica como versión nueva solo si pasa el validador. La app usa la última versión válida; un simulacro empezado conserva la versión con la que empezó.
- **Verificación:** prueba de que un perfil inválido no se publica ni se usa; cambiar el tiempo en el panel → el simulacro nuevo lo usa sin publicar la app.

### T14 · Métricas por pregunta y tipo
- **Requisitos:** ADM-02.
- **Archivos:** `supabase/migrations/…_metricas.sql` (función `metricas()`, solo administrador, solo agregados), `apps/admin/app/metricas/`.
- **Qué:** por tipo, nivel y familia de reglas (y por cada verbal): respuestas, % de acierto, tiempo medio y **discriminación** (acierto del 27 % de usuarios que mejor lo hacen menos el del 27 % que peor; con menos de 30 respuestas se muestra «pocos datos»).
- **Verificación:** prueba SQL con datos inventados de prueba y resultado calculado a mano; un usuario normal no puede llamar a la función.

### T15 · Fichas de método por tipo
- **Requisitos:** EXP-04.
- **Archivos:** `packages/engine/src/methods.ts` (texto por tipo, + prueba de que todos los tipos tienen ficha), pantalla `apps/mobile/src/screens/metodo.tsx` y enlaces desde Práctica y Explicación.
- **Qué:** cómo atacar cada tipo en 4–6 pasos, con un ejemplo original y los errores típicos. Abiertas también en el plan gratuito.
- **Verificación:** prueba de componente; captura comparada con el prototipo; `revisor-contenido` revisa los textos.

### T16 · Comprobación del criterio de aceptación y cierre
- **Requisitos:** todos los de la fase.
- **Archivos:** `apps/mobile/.maestro/reportar.yaml`, `supabase/tests/rls.sql`, `docs/progreso.md`, `docs/decisiones.md`.
- **Qué:** flujo de Maestro (reportar desde una pregunta); pruebas de RLS completas; `pnpm typecheck`, `pnpm lint`, `pnpm test` y `pnpm test:stress`.
- **Verificación:** `/cerrar-fase 8` con `verificador-fase`, `revisor-contenido`, `revisor-interfaz` y `ponytail-review`.

**Orden:** T1 → T2 → T3 → T4 (motor) · T5 (tu aprobación) · T6 · T7 → T8 · T9 · T10 → T11 · T12 → T13 · T14 · T15 · T16.

## Fuera de esta fase

Recuento de bloques y matrices (espaciales), comprensión lectora y silogismos (verbales), elegir oposición en la app (ONB-04) y publicar el panel en internet. Se pueden añadir si los pides.

## Decisiones que solo puedes tomar tú

1. **Dónde vive el panel:** propuesta, **solo en tu ordenador** (`pnpm --filter admin dev`), sin cuenta nueva ni coste. Publicarlo en internet (por ejemplo Vercel) necesita otra cuenta y se puede hacer en la fase 9.
2. **Cómo entras al panel:** propuesta, con tu correo y un **enlace mágico** de Supabase (funciona sin el SMTP propio). Tras tu primer acceso, marco tu usuario como administrador con una orden SQL que te enseño antes.
3. **Reportes sin cuenta:** propuesta, **sí**: casi todos empiezan sin cuenta. La app solo puede crear reportes (no leerlos), con límites de longitud.
4. **Verbales:** propuesta, los dos tipos del MVP (Sinónimos y antónimos, Analogías verbales), **30 borradores por tipo** (6 por nivel) redactados por mí, y que un tipo aparezca en la app cuando tenga **al menos 10 aprobadas**. Las apruebas tú en el panel (o el revisor experto cuando lo haya). Se escriben en minúsculas con sus tildes.
5. **Espaciales:** propuesta, tres tipos (Figuras giradas y en espejo, Series de figuras, Desarrollos de cubos) en la aptitud nueva «Espacial», **solo en Premium**, y que entren en el test de nivel (2 por tipo: pasa de 12 a 18 preguntas, unos 10 minutos).
6. **Policía Nacional y Auxiliar Administrativo:** propuesta, **preparar los perfiles** (motor y panel) pero **no mostrarlos todavía en la app**: el lanzamiento es solo Guardia Civil y elegir oposición (ONB-04) no entra en esta fase.
7. **Prototipos:** propuesta, prototipos para las pantallas nuevas de la app y **sin prototipo para el panel** (es interno; usará los colores y fuentes de la guía).
