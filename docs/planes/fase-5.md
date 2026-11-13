# Plan · Fase 5 · Cuentas y sincronización

**Estado:** BORRADOR, sin aprobar. No se empieza hasta que el propietario apruebe la fase 4 y confirme este plan.
**Rama:** `fase-5-cuentas` (desde `main`, con la fase 4 aprobada).
**Requisitos:** ONB-03, PRO-02, SOP-02, NFR-01 (sincronizar al recuperar la red), NFR-05, NFR-06.
**Skills:** `supabase-postgres-best-practices` (manda en esquema, RLS y migraciones), `aptiq-design-system` (pantallas), `expo-data-fetching`, `design:ux-copy`, `design:accessibility-review`.

## Qué ya existe y se reutiliza

- Almacenamiento local con la interfaz `Store` (`apps/mobile/src/data/store.ts`): SQLite con Drizzle y una implementación en memoria para pruebas.
- Tablas locales: `ajustes`, `semilla_usada`, `sesion`, `intento_simulacro`. Solo guardan semillas y respuestas, no el texto de las preguntas (el motor las regenera).
- Los IDs de `sesion` e `intento_simulacro` son texto generado en el dispositivo, así que sirven para subir datos sin duplicados.
- No existen todavía: proyecto Supabase, autenticación, cola de sincronización, pantalla de historial (PRO-02, aplazada desde la fase 4), borrado ni exportación.

## Principios de la fase

- **Sin cuenta sigue funcionando todo.** La cuenta solo sirve para guardar el progreso y verlo en otro dispositivo (ONB-03). Ninguna pantalla de práctica o simulacro exige iniciar sesión.
- **Datos mínimos (NFR-05).** Se sincronizan semillas, respuestas, fechas y ajustes. No se suben el texto de las preguntas, ni el correo en tablas propias (queda solo en Supabase Auth).
- **Local primero.** Se escribe siempre en SQLite; la sincronización va después, desde una cola, y puede fallar sin que el usuario lo note (NFR-01).
- **Ningún secreto en la app (NFR-06).** La app usa solo la URL y la clave pública (`anon`). La clave de servicio vive solo en funciones de Supabase.
- **RLS en todas las tablas**, con comprobación automática.

## Global Constraints

- Supabase en la **región de la UE** (NFR-05).
- Cada tabla tiene `user_id uuid not null references auth.users(id) on delete cascade` y políticas con `(select auth.uid())`, más un índice en `user_id` (buenas prácticas de Supabase).
- Las migraciones son archivos SQL en `supabase/migrations/`, versionados en git. Nada de cambios a mano en el panel.
- Texto en español de España, tuteo, sin emojis ni exclamaciones; solo tokens y piezas de `packages/ui`.
- Cada dependencia nueva se justifica y se anota en `docs/decisiones.md`.
- Tras cada tarea: ESLint, pruebas relacionadas, comprobación de tipos y commit en español.

## Tareas

### T1 · Proyecto Supabase en la UE (con el propietario) (NFR-05, NFR-06)

- **Quién:** el propietario crea la cuenta y el proyecto (es una cuenta y puede suponer gasto). Claude no los crea.
- **Qué hace:** proyecto en región UE, `supabase/config.toml` y carpeta de migraciones en el repositorio, variables públicas en `apps/mobile` (`EXPO_PUBLIC_SUPABASE_URL`, clave `anon`). Los secretos nunca entran en el repositorio ni en la app.
- **Verificación:** la app se conecta con la clave pública; la región figura en `docs/decisiones.md`.

### T2 · Esquema, migraciones y RLS (PRO-02, NFR-05, NFR-06)

- **Archivos:** `supabase/migrations/*.sql`, pruebas SQL en `supabase/tests/`.
- **Tablas propuestas:** `perfil` (oposición, fecha prevista), `ajuste`, `sesion`, `intento_simulacro` (mismas columnas que en local, más `user_id` y `actualizado`). Sin tabla para el texto de las preguntas.
- **Políticas:** el usuario solo ve, crea, modifica y borra filas con su `user_id`.
- **Verificación:** prueba con dos usuarios (el usuario B no lee ni modifica nada de A); los avisos de seguridad de Supabase (`get_advisors`) sin tablas sin RLS.

### T3 · Cola de sincronización local (NFR-01, PRO-02)

- **Archivos:** `apps/mobile/src/sync/*`, tabla local `cola_sync` (operación, entidad, id, creada, intentos), cambio en `sqlite-store.ts`.
- **Reglas propuestas:**
  - sesiones e intentos terminados son de solo añadir y se suben por `upsert` con su ID (sin duplicados al reintentar);
  - el simulacro abierto no se sube hasta terminarse;
  - los ajustes se resuelven por la fecha más reciente;
  - al iniciar sesión por primera vez, lo guardado sin cuenta se sube; si la cuenta ya tenía datos, se unen por ID.
- **Reintentos:** al recuperar la red y al abrir la app, con espera creciente. Un fallo no bloquea el uso.
- **Verificación:** pruebas con almacén en memoria y cliente simulado: reintento sin duplicar, sin red, orden de operaciones, unión de dos dispositivos.

### T4 · Inicio de sesión (ONB-03)

- **Qué hace:** Apple, Google y correo con Supabase Auth; sesión guardada en `expo-secure-store`.
- **Dependencias nuevas (fuera del stack, se anotan en decisiones):** `@supabase/supabase-js`, `expo-secure-store`, `expo-apple-authentication`, y una librería de Google (por decidir tras ver qué admite el SDK 58).
- **Requisitos de plataforma:** iOS exige ofrecer «Iniciar sesión con Apple» si se ofrece Google. Apple necesita cuenta de Apple Developer; Google necesita credenciales OAuth.
- **Verificación:** pruebas de la capa de sesión con cliente simulado; el inicio con Apple y Google se prueba a mano en dispositivo (no es automatizable aquí).

### T5 · Pantallas de cuenta e historial (ONB-03, PRO-02)

- **Pantallas:** invitación a crear cuenta (sin bloquear), Cuenta (estado de sincronización, cerrar sesión, borrar, exportar) e Historial de simulacros y sesiones.
- **Referencia visual:** no hay prototipo de estas pantallas; se diseñan con `aptiq-design-system` y se enseñan al propietario antes de implementarlas (ver decisión 5).
- **Verificación:** pruebas de componentes, texto al 200 %, etiquetas para VoiceOver y TalkBack, `revisor-interfaz` sin hallazgos graves.

### T6 · Borrado de cuenta y exportación (SOP-02, NFR-05)

- **Qué hace:**
  - borrado desde la app con confirmación, mediante una función de Supabase que usa la clave de servicio (nunca en la app); el `on delete cascade` elimina todas las filas; después se borran los datos locales y se cierra la sesión;
  - exportación de los datos del usuario en un archivo JSON que se comparte con el menú del sistema.
- **Verificación:** prueba que, tras borrar, no queda ninguna fila de ese usuario en ninguna tabla; la exportación incluye todo lo que hay en el servidor.

### T7 · Seguridad y comprobaciones (NFR-06)

- Ninguna tabla sin RLS (avisos de Supabase), ninguna clave de servicio en el código ni en el paquete de la app (búsqueda automática en CI), `.env` sin subir.
- `supabase-postgres-best-practices` aplicada al esquema y a las políticas.

### T8 · Dos dispositivos y flujos de prueba (criterio de aceptación)

- Con la misma cuenta en dos dispositivos o emuladores, el progreso de uno aparece en el otro.
- Flujo de Maestro para el correo con una cuenta de prueba; Apple y Google se prueban a mano.

### T9 · Cierre

- `verificador-fase`, `revisor-interfaz` y, si cambia algo del contenido mostrado, `revisor-contenido`.
- Actualizar `docs/progreso.md` y `docs/decisiones.md`; `/cerrar-fase 5`.

## Criterio de aceptación (de `docs/plan-fases.md`)

| Criterio | Cómo se comprueba | Quién |
| --- | --- | --- |
| El progreso aparece en un segundo dispositivo | T8 | Claude (pruebas) / **propietario** (dos móviles reales) |
| El borrado elimina todos los datos | Prueba de T6 y consulta al servidor | Claude |
| Ninguna tabla sin RLS | Avisos de seguridad de Supabase | Claude |

## Decisiones que necesito de ti

1. **Proyecto Supabase:** crearlo tú en una región de la UE (T1). Sin él no se puede probar nada del servidor. Pendiente: ¿un solo proyecto o uno de pruebas y otro de producción? Recomiendo empezar con uno y separar antes de la beta.
2. **Inicio con correo:** código de un solo uso por correo (recomendado: no hay contraseñas que guardar ni olvidar) o correo y contraseña.
3. **Apple y Google:** requieren cuenta de Apple Developer y credenciales OAuth de Google (y suponen gasto, tuyo). Si todavía no las tienes, propongo hacer la fase 5 con correo y dejar Apple y Google para cuando existan las cuentas; ONB-03 quedaría parcialmente cumplido hasta entonces.
4. **Primer inicio de sesión con datos locales:** propongo subirlos a la cuenta sin preguntar, con el aviso en pantalla antes de crearla. Alternativa: preguntar si se quieren conservar.
5. **Diseño de las pantallas nuevas** (cuenta, historial): no hay prototipo. ¿Prefieres que prepare uno en `docs/prototipos/` para que lo apruebes antes de implementarlo? (recomendado)
6. **Aprobar la fase 4** (pendiente de las pruebas en móvil real): la fase 5 no empieza sin ella.

## Lo que no sé todavía

- Qué librería de Google es compatible con Expo SDK 58 sin salir del flujo de compilación actual: se comprueba en T4 antes de elegirla.
- Si el plan gratuito de Supabase basta durante la beta. Se mira con datos reales, no se supone.
