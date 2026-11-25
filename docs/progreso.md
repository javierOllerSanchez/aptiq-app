# Progreso

Lo actualiza Claude Code al terminar cada tarea y en `/cerrar-fase`. El propietario aprueba cada fase antes de pasar a la siguiente.

| Fase | Estado | Rama / PR | Cerrada | Aprobada por el propietario |
| --- | --- | --- | --- | --- |
| 0 · Base del proyecto | Cerrada (prueba en iPhone pendiente del propietario) | `fase-0-base` · PR #1 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 1 · Sistema de diseño en código | Cerrada (VoiceOver en iPhone y `/review-animations` pendientes del propietario) | `fase-1-sistema-diseno` · PR #2 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 2 · Motor de contenido v1 | Cerrada (rediseño de distractores pendiente para el inicio de la fase 3) | `fase-2-motor` · PR #3 fusionado | 2026-11-12 | Sí, 2026-11-12 |
| 3 · Perfil de examen y puntuación | Cerrada | `fase-3-perfil` · PR #4 fusionado | 2026-11-12 | Sí, 2026-11-13 |
| 4 · Práctica y simulacro sin conexión | Cerrada (VoiceOver y Maestro en iPhone pendientes del propietario) | `fase-4-practica` · PR #5 y `fase-4-cierre` · PR #9 fusionados | 2026-11-14 | Sí, 2026-11-14 |
| 5 · Cuentas y sincronización | Cerrada con T8 pendiente (SMTP aplazado por el propietario al final del proyecto) | `fase-5-cuentas` · PR #11 fusionado | 2026-11-15 | Sí, 2026-11-15 |
| 6 · Progreso y adaptativo | Cerrada (comprobaciones en el móvil pendientes del propietario) | `fase-6-progreso` · PR #13 fusionado | 2026-11-15 | Sí, 2026-11-15 |
| 7 · Pago | Cerrada con T7 pendiente (pruebas en tiendas: faltan las cuentas de Apple, Google y RevenueCat) | `fase-7-pago` · PR #15 fusionado | 2026-11-15 | Sí, 2026-11-15 |
| 8 · Contenido ampliado y panel interno | Cerrada (pendiente que el propietario vea un reporte en el panel y apruebe verbales y perfiles) | `fase-8-contenido` · PR #17 | 2026-11-19 | Sí, 2026-11-19 |
| 9 · Beta y lanzamiento | En curso (parte A hecha; parte B empezada) | `fase-9-lanzamiento` (sin subir) | | |

## Registro

**2026-11-25 · Fase 9 · Web publicada**

- Web en `https://aptiq.pages.dev` (comprobadas todas las páginas, fuentes, CSS e imágenes); dominio `aptiq.inkfinitysoft.com` dado de alta y **verificándose** (certificado HTTPS; comprobar que responde). Correo de soporte, proveedores (Arsys, Cloudflare) y licencias OFL añadidos.
- Las **7 variables** de la app ya están en EAS (`production` y `preview`).
- **Sigue pendiente en los textos legales:** titular (nombre o razón social, NIF, domicilio: el propietario debe darlos), plazos de conservación de PostHog, Sentry y RevenueCat, transferencias internacionales (RevenueCat, Cloudflare), juzgados y desistimiento (abogado). La web lo muestra como «Pendiente» con el aviso de borrador.
- Validación de RevenueCat sin comprobar hoy (el Chrome conectado tenía otra cuenta de RevenueCat).

**2026-11-24 · Fase 9 · Web (en curso)**

- Decisiones del propietario: web en **`aptiq.inkfinitysoft.com`**; correo de soporte **`support@inkfinitysoft.com`** (comprobar que el buzón existe en Arsys); el propietario pidió que el agente redacte los datos del titular, pero el NIF y el domicilio no se pueden inventar: **pedírselos** (y confirmar si el titular es persona física o «Inkfinity Software»).
- Hallazgo: el DNS de `inkfinitysoft.com` está en **Cloudflare** (la web actual se sirve por Cloudflare), así que el propietario ya tiene cuenta: publicar `apps/web` en Cloudflare Pages y añadir el subdominio es directo.
- Siguiente: licencia OFL en `apps/web/fonts/` (los textos están en `node_modules/@expo-google-fonts/*/LICENSE_FONT`), completar textos legales y web con dominio y correo, publicar, y dar de alta `EXPO_PUBLIC_WEB_URL` y `EXPO_PUBLIC_SOPORTE_EMAIL` en EAS. Comprobar mañana la validación de RevenueCat («Check again»).

**2026-11-23 · Fase 9 · Compras de Google Play (en curso)**

- Diseño confirmado por el propietario (ver `docs/decisiones.md`): suscripción `premium` con mensual, anual (7 días gratis) y pases de prepago de 3 y 6 meses.
- **Bloqueo:** Play Console no deja crear suscripciones sin **cuenta de comercio de Google Payments** en Inkfinity Software. La crea el propietario (datos fiscales y bancarios). Afecta también a la declaración de «comerciante» (abogado).
- **2026-11-24 · Hecho en Play Console:** el propietario creó el perfil de pagos. Suscripción `premium` («Aptiq Premium») con los planes `mensual` (7,99 €), `anual` (39,99 €, con la oferta `prueba-7-dias` solo para quien nunca la tuvo), `pase-3-meses` (19,99 €, prepago) y `pase-6-meses` (29,99 €, prepago), todos **activos**. Precios con IVA en España; Google exige precio en todos los países, así que se fijó el mismo precio base sin IVA y Google lo convierte (dónde se vende lo limita la disponibilidad de la app por países: **pendiente limitarla a España** en la prueba cerrada).
- **Google Cloud (2026-11-24):** condiciones de Google Cloud aceptadas con permiso del propietario (sin prueba de 300 $ ni tarjeta); proyecto `aptiq-play` con Google Play Android Developer API y Cloud Pub/Sub API habilitadas; cuenta de servicio `revenuecat@aptiq-play.iam.gserviceaccount.com` con los roles Editor de Pub/Sub y Visualizador de Monitoring. **Falta:** que el propietario cree la clave JSON y la suba a RevenueCat (app «Aptiq (Play Store)»), e invitar la cuenta de servicio en Play Console.
- **Cuenta de servicio en Play Console (2026-11-24):** invitada y activa, solo para Aptiq, con ver información de la app, ver calidad, ver datos financieros y gestionar pedidos y suscripciones. Clave JSON creada y guardada en RevenueCat por el propietario. **La validación de RevenueCat sigue en «need attention»**: Google tarda hasta 24-36 h en aplicar los permisos; pulsar «Check again» en la app «Aptiq (Play Store)» y, cuando valide, conectar «Google developer notifications» (Pub/Sub). El propietario debe borrar el `.json` de Descargas.
- **RevenueCat (2026-11-24):** permiso `premium` con los productos `premium:mensual` (retrocompatible), `premium:anual`, `premium:pase-3-meses` y `premium:pase-6-meses`; oferta `default` («Aptiq Premium», la oferta por defecto) con `$rc_monthly`, `$rc_annual`, `$rc_three_month` y `$rc_six_month`, que es lo que lee `src/purchases/revenuecat.ts`.
- Avisos de Play Console para el propietario: apuntarse a la **comisión del 15 %** (grupo de cuentas y aceptar términos) y declarar el estado de operador antes del 1 de febrero de 2027.
- Después: crear los productos en Play Console, la cuenta de servicio de Google Cloud con su clave JSON (la crea y sube a RevenueCat el propietario; el agente guía) y el permiso, productos y oferta en RevenueCat.

**2026-11-22 · Fase 9 · Supabase de producción (T10, en parte)**

- No se pudo crear un proyecto nuevo (límite de 2 proyectos gratuitos activos del propietario). Decisión: `aptiq` es producción (ver `docs/decisiones.md`).
- Comprobado: las 8 migraciones del repositorio aplicadas, función `borrar-cuenta` activa (sin cambios desde el 2026-11-15), avisos de seguridad solo los ya conocidos (`metricas()` aceptado; contraseñas filtradas no aplica: se entra con código).
- URL y clave publicable dadas de alta en EAS. Las 5 variables de la app ya están en EAS; faltan `EXPO_PUBLIC_WEB_URL` y `EXPO_PUBLIC_SOPORTE_EMAIL` (dominio pendiente).
- **SMTP y plantillas (hecho):** correo por Arsys desde `dev@inkfinitysoft.com` y plantillas en español con el código de 6 cifras y el enlace del panel. Prueba: petición de código a `dev@inkfinitysoft.com` aceptada (registro de Supabase 22:30, «Confirm sign up»); el propietario confirmó que el correo llegó con el código (2026-11-22). T10 hecha salvo el borrado de datos de prueba antes de la beta. La prueba creó el usuario `dev@inkfinitysoft.com`.
- **Antes de la beta (con confirmación):** borrar los 2 reportes de prueba y el usuario de prueba `dev@inkfinitysoft.com` (si no se va a usar), conservando la cuenta de administrador del panel. Las pruebas `supabase/tests/rls-*.sql` no se han vuelto a ejecutar porque el esquema no ha cambiado desde la fase 8, salvo la columna `perfil`, que hereda la RLS de su tabla.

**2026-11-22 · Fase 9 · Claves de PostHog, Sentry y RevenueCat**

- PostHog (UE), Sentry (`aptiq`, UE) y RevenueCat («Aptiq», app de Play Store) listos en las cuentas de Inkfinity Software; sus claves públicas, dadas de alta en EAS para `production` y `preview` (detalle en `docs/decisiones.md`).
- **Pendiente del propietario:** confirmar el correo de RevenueCat (aviso en su panel).
- **Pendiente en RevenueCat y Google Play:**
  1. Cuenta de servicio de Google Cloud con acceso a Play Console, y su JSON subido a RevenueCat (sin ella no valida compras).
  2. En Play Console: suscripción (mensual y anual con 7 días de prueba) y pases de 3 y 6 meses.
  3. En RevenueCat: permiso `premium`, productos y oferta por defecto.
- **Pendiente en Sentry:** token de organización (secreto de EAS), `SENTRY_ORG=inkfinity-software`, `SENTRY_PROJECT=aptiq` y quitar `SENTRY_DISABLE_AUTO_UPLOAD`; activar «no guardar IP» (cambiar ajustes: pedir permiso).
- Sigue faltando para la compilación de beta: Supabase de producción (T10), web con dominio (`EXPO_PUBLIC_WEB_URL`, correo de soporte).

**2026-11-22 · Fase 9 · App creada en Google Play**

- Compilación de tienda `versionCode` 4 terminada en EAS.
- App «Aptiq: psicotécnicos oposición» creada en Play Console, en la cuenta de desarrollador **Inkfinity Software** (sesión dev@inkfinitysoft.com; cuenta personal: aplica la regla de 12 probadores durante 14 días). Paquete `com.javioller.aptiq`, español (España), app sin coste; declaraciones de políticas y exportación marcadas con el permiso del propietario. Firma de apps de Google Play activa.
- Versión «1.0.0 (4) - primera subida» en **Prueba cerrada - Alpha**, guardada como **borrador** (no enviada a revisión ni a probadores). El `.aab` lo arrastró el propietario: la extensión de Chrome no sube archivos de más de 10 MB. Copia local en `dist-android/aptiq-4.aab` (ignorada por Git).
- Play Console avisa: declarar el estado de operador antes de febrero de 2027 (consulta al abogado).
- Hay dos Chrome: el del perfil personal y el de Inkfinity Software; Play Console se usa desde el segundo.
- **Siguiente:** pasos 2 a 8 de abajo (claves públicas, Sentry, Supabase de producción, RevenueCat al borrar cuenta, web, compilación de beta). Con la versión subida ya se pueden crear en Play Console la suscripción y los pases para RevenueCat.

**2026-11-20 · Fase 9 · Dónde seguir (siguiente sesión)**

- **Estado:** parte A terminada (T1–T8) y parte B empezada. Rama `fase-9-lanzamiento` con 16 commits, **sin subir a GitHub** y sin PR. Pruebas en verde (app 134, componentes 27), sin secretos.
- **Cuentas:** el propietario tiene Expo, Google Play, PostHog, Sentry y RevenueCat; **falta Apple Developer** (la beta empieza solo en Android).
- **EAS:** sesión abierta en este ordenador como `javioller` (inicio con código de dispositivo: `npx eas-cli@latest login --device --non-interactive`, el propietario aprueba en su Chrome). Proyecto `@javioller/aptiq` (`ba05ed2f-ae3d-46d5-a725-36db0b99a2b4`). Clave de firma de Android generada y guardada por Expo (decisión del propietario).
- **Compilación de tienda en curso:** `versionCode` 4, https://expo.dev/accounts/javioller/projects/aptiq/builds/2fe246b8-d020-48d7-8474-fc979f78dd36. Las dos anteriores: una cancelada (subía la carpeta `android` de Windows; arreglado con `.easignore`) y otra fallida (subida de mapas de Sentry sin organización; desactivada con `SENTRY_DISABLE_AUTO_UPLOAD`). Ver su estado: `npx eas-cli@latest build:view 2fe246b8-d020-48d7-8474-fc979f78dd36`.
- **Esta compilación no vale para la beta:** no lleva variables de entorno (sin Supabase no hay cuentas; sin RevenueCat no hay compras; sin PostHog ni Sentry no se envía nada; sin web no salen las filas legales). Sirve para crear la app en Google Play y probar la subida.

**Siguientes pasos, en orden:**

1. ~~Crear la app en Play Console y subir el `.aab`~~ hecho el 2026-11-22 (arriba).
2. ~~Claves públicas en EAS~~ hecho el 2026-11-22 (PostHog, Sentry, RevenueCat). Faltan las de Supabase de producción, la web y el correo. Antes: PostHog (`phc_…`, región UE), Sentry (DSN con `ingest.de.sentry.io`), RevenueCat Google (`goog_…`). Darlas de alta en EAS con `eas env:create` (entorno `production` y `preview`) junto con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (de producción, T10), `EXPO_PUBLIC_WEB_URL` y `EXPO_PUBLIC_SOPORTE_EMAIL`.
3. Sentry: organización, proyecto y token (secreto de EAS) → quitar `SENTRY_DISABLE_AUTO_UPLOAD` de `eas.json`. En Sentry, activar «no guardar direcciones IP».
4. T10: Supabase de producción (proyecto nuevo en la UE, mismas migraciones y función `borrar-cuenta`, pruebas `supabase/tests/rls-*.sql`) y SMTP de Arsys (la contraseña la escribe el propietario).
5. Borrar el registro de RevenueCat al borrar la cuenta (función `borrar-cuenta`, clave secreta de RevenueCat como secreto de Supabase). Imprescindible antes de la beta.
6. Web: dominio, alojamiento (Cloudflare Pages), correo de soporte, texto de la licencia OFL en `apps/web/fonts/` y datos del titular en los textos legales. Revisión del abogado.
7. Compilación de beta con todas las variables → probar en el emulador y en un móvil → Play Console: probadores (también en «Pruebas de licencia»), guía `docs/beta/guia-probadores.md` con fechas y enlaces → empezar los 14 días.
8. Pendiente sin bloquear: añadir a `apps/mobile/.env.example` las variables `EXPO_PUBLIC_WEB_URL`, `EXPO_PUBLIC_SOPORTE_EMAIL`, `EXPO_PUBLIC_POSTHOG_KEY` y `EXPO_PUBLIC_SENTRY_DSN` (el agente no tiene permiso para abrir ese archivo).

**2026-11-19 · Fase 9 · Plan**

- Plan en `docs/planes/fase-9.md`, confirmado por el propietario («Sí, tal cual») con las propuestas de las decisiones 1–9. Parte A (sin cuentas) en curso; la parte B espera a las cuentas, los datos del titular y los probadores.
- **T2 (prototipos):** `docs/prototipos/consentimiento.html`, `ayuda.html` y pie del muro con «Términos de uso · Privacidad». **Pendientes de tu aprobación** antes de T6 y T7.
- **T5 (ADM-03):** hecho. Cada simulacro guarda el perfil con que empezó y se puntúa con él; prueba nueva en `content.test.ts`; columna `perfil` en SQLite y en Supabase (migración aplicada en el proyecto actual). App: 127 pruebas en verde.
- **T3 (textos legales):** borrador en `apps/web/` (privacidad, aviso legal, términos, borrar cuenta, ayuda), con tus datos de titular, plazos y transferencias marcados como pendientes. Hallazgo: al borrar la cuenta no se borra el registro de compras en RevenueCat; queda anotado en la página y hay que resolverlo antes de la beta.
- **T1 (icono):** hecho. Icono y arranque de Aptiq comprobados en el emulador Android (release): `docs/capturas/fase-9-icono.png` y `fase-9-arranque.png`.
- **T4 (web):** portada en `apps/web/index.html` con capturas reales de la app (simulacro, explicación e inicio) y una tarjeta de resultado marcada como ejemplo. Revisada a 1440 y 390 px, sin desbordes y con zonas táctiles de 44. Pendiente al publicar: enlace del App Store, correo de soporte, dominio y el texto de la licencia OFL de las fuentes. Vista previa: configuración `web` de `.claude/launch.json`.
- **Prototipos aprobados** por el propietario («Aprobados, sigue»).
- **T6 (ayuda y legal):** hecho. Sección «Ayuda y legal» al final de Cuenta (con y sin sesión), «Términos de uso · Privacidad» al pie del muro. Las filas abren la web (`EXPO_PUBLIC_WEB_URL`) y el correo (`EXPO_PUBLIC_SOPORTE_EMAIL`); sin esas variables no se muestran.
- **T7 (datos de uso):** hecho. Pregunta tras el test de nivel, interruptor en Cuenta, 7 eventos sin datos personales a PostHog UE, nada sin permiso ni sin clave (`EXPO_PUBLIC_POSTHOG_KEY`). 5 pruebas nuevas. Falta comprobar en PostHog que llegan (parte B, sin cuenta).
- **T8 (fallos):** hecho. `@sentry/react-native` sin datos personales, solo con `EXPO_PUBLIC_SENTRY_DSN`. Falta ver un fallo de prueba en Sentry (parte B, sin cuenta).
- **Comprobado en el emulador Android (release):** pantalla de datos de uso, sección de Cuenta y que «Política de privacidad» abre la web. Capturas `docs/capturas/fase-9-datos-de-uso.png`, `fase-9-cuenta-ayuda.png` y `fase-9-privacidad-abierta.png`. App: 133 pruebas; componentes: 27; búsqueda de secretos en verde.
- **Cuentas (2026-11-20):** el propietario tiene Expo, Google Play, PostHog, Sentry y RevenueCat; falta Apple Developer. La beta empieza solo en Android.
- **Arreglos de interfaz:** botones del simulacro alineados (`docs/capturas/fase-9-simulacro-botones.png`), texto de botón centrado en dos líneas (componente `Button`, toda la app) y el operador unido a su número en las explicaciones («+ 25»; prueba nueva). El «último botón bajo la barra» era la captura a media página, no un fallo. App: 134 pruebas.
- **T11:** borrador de fichas (`docs/tiendas/ficha.md`, longitudes comprobadas con `scripts/ficha-longitudes.mjs`) y respuestas de privacidad de Google y Apple (`docs/tiendas/privacidad.md`), sacadas del código.
- **T12:** guía para probadores (`docs/beta/guia-probadores.md`), con fechas, enlace y correo pendientes. En Play Console hay que poner a los probadores también en «Pruebas de licencia» para que compren sin pagar.
- **T9 (en parte):** `eas.json` listo para Android (envío a prueba cerrada como borrador). Falta entrar en EAS (`eas login`, lo hace el propietario), `eas init`, `expo-updates` y las variables de entorno.
- **Tienes que añadir** a `apps/mobile/.env.example` (no tengo permiso para abrirlo): `EXPO_PUBLIC_WEB_URL`, `EXPO_PUBLIC_SOPORTE_EMAIL`, `EXPO_PUBLIC_POSTHOG_KEY` y `EXPO_PUBLIC_SENTRY_DSN`, vacías.
- **Visto de paso en el emulador** (para la revisión de interfaz): en el simulacro, los botones de abajo («Dejar en blanco», «Marcar para revisar», «Anterior», «Siguiente», «Siguiente marcada») quedan de anchos distintos y el último queda bajo la barra del sistema; en Inicio, «Simulacros ilimitados con Premium» parte en dos líneas alineadas a la izquierda; en las explicaciones, «+ 25» se corta entre líneas.

**2026-11-19 · Fase 8 · Aprobación**

- El propietario aprueba la fase 8 («Aprobada»). Siguen pendientes ver el reporte de prueba en el panel, aprobar verbales y revisar los perfiles de Policía Nacional y Auxiliar, y resolver la versión del perfil en los simulacros antes de publicar el primero (ADM-03).

**2026-11-19 · Fase 8 · Cierre**

- **Entregado:**
  - aptitud «Espacial» con Figuras giradas (`ESP.GIRO`), Series de figuras (`ABS.FIGURAS`) y Desarrollos de cubos (`ESP.CUBO`): figuras como datos y trazos SVG desde el motor, solucionador independiente, pruebas de pistas (la del medio, la que más se repite, la figura distinta), estrés de 10.000 en verde; muestras en `docs/muestras/*.html`;
  - verbales con aprobación (ADM-01): tabla `pregunta_verbal` con RLS (la app solo lee las aprobadas), banco en el motor (semilla = pregunta + orden), 60 borradores originales en `content/verbales/borradores.json`, que se importan desde el panel;
  - reportar un error desde la explicación (SOP-01): hoja con motivo y comentario, guardado en el móvil y envío con reintento, sin usuario ni correo;
  - panel interno `apps/admin` (Next.js, solo en tu ordenador): reportes con la pregunta regenerada desde la semilla, verbales (editar, aprobar, rechazar, importar), perfiles (versión nueva validada, ADM-03) y métricas (ADM-02);
  - perfiles editables: la app descarga, valida y guarda el último perfil y las verbales aprobadas (sin red, la copia);
  - perfiles de Policía Nacional 2026 y Auxiliar Administrativo 2025 (CON-04), solo con datos del BOE y del INAP; no se muestran aún en la app;
  - fichas de método de los 11 tipos (EXP-04), con «Practicar este tipo»; test de nivel de 18 preguntas; tiempo de cada respuesta.
- **Criterio de aceptación:** comprobado en el emulador Android (release) que un reporte llega a `reporte` con tipo, nivel, semilla (`m50vwl`) y versión, y que el motor la regenera idéntica. Las verbales en borrador no las ve ni `anon` ni un usuario normal (`supabase/tests/rls-fase8.sql`, ejecutada en el proyecto). **Falta que tú veas ese reporte en el panel** con tu sesión (no se puede hacer aquí).
- **Revisores:**
  - `revisor-contenido` (tres pasadas): corregidos los bloqueantes de los generadores (pistas para acertar sin resolver, reintentos agotados) y de los borradores (44 preludio, 45 ayuno, 46 gramo → litro, 58 sustituido; «prístino» cambiado). También: la pareja de contrarios ya no delata la respuesta en la mitad de sinónimos, la correcta cambia de puesto, banco ordenado por id (NFR-09), validador más estricto y `metricas()` v2 (percentiles con empates, mínimo de 10 por grupo, datos mal formados ignorados);
  - `revisor-interfaz` (dos pasadas): sin bloqueantes; corregidos tamaños de figura (tokens nuevos), Repasar, palabra clave subrayada, ficha con botón principal, hoja de reporte (teclado, envío en segundo plano) y filtros del panel;
  - `verificador-fase`: técnica en verde; su bloqueante es que veas el reporte en el panel (arriba);
  - `ponytail-review`: corregida la cola de reportes (podía perder uno) y que Repasar se rompiera con una verbal retirada.
- **Comprobaciones:** `pnpm -r typecheck`, `pnpm -r lint` y `pnpm -r test` en verde (motor 448, app 126, componentes 26, tokens 1) y `test:stress` en verde. `pnpm typecheck` con Turbo no arranca en este Windows: el sistema bloquea `turbo.exe` («Permission denied»), ya antes de esta fase. Capturas en `docs/capturas/fase-8-*.png`.
- **Pendiente, sin bloquear el cierre:**
  - **ADM-03:** un simulacro no guarda la versión del perfil con la que empezó: si se publica un perfil con otra fórmula, se recalculan las notas guardadas. Hoy no hay ningún perfil publicado; hay que resolverlo antes de publicar el primero;
  - borradores verbales (revisor-contenido, segunda pasada sin bloqueantes): palabras repetidas entre preguntas, niveles algo desiguales (las analogías de N4 y N5 son más fáciles de lo que toca), algunos distractores flojos, trucos iguales por tipo y «dormido» (17) por confirmar en el DLE. Revísalo al aprobarlos en el panel;
  - métricas: el acierto global como criterio de la discriminación se iguala con el nivel adaptativo; mejor usar el nivel estimado cuando haya datos de uso;
  - el nivel adaptativo de las verbales no avanza si faltan preguntas del nivel pedido (se elige el más cercano y esa respuesta no cuenta para subir o bajar);
  - el panel no tiene pruebas automáticas (`reproducir()` está probado a mano);
  - Maestro no está instalado en este Windows: `reportar.yaml` no se ha ejecutado (el mismo recorrido se hizo con adb);
  - Turbo bloqueado por Windows (arriba).
- **Para que pruebes tú:**
  1. `pnpm --filter admin dev`, entra en el panel y abre «Reportes»: el de la semilla `m50vwl` debe mostrar la serie 4, 8, 16, 32, 64 con la D (128) correcta; descarta el de prueba del cubo;
  2. «Verbales» → importar los borradores, revisar y aprobar 10 de un tipo → en la app aparece ese tipo en Verbal;
  3. en el móvil: una pregunta con figuras en Práctica (con Premium) y «Reportar un error»;
  4. revisar los perfiles de Policía Nacional y Auxiliar.
- **Decisiones tuyas pendientes:** las tres que seguían de la fase 7.

**2026-11-15 · Fase 7 · Aprobación**

- El propietario aprueba la fase 7 y se fusiona el PR #15. Siguen pendientes T7 (pruebas en tiendas, sin cuentas), los enlaces legales del muro y tres decisiones (Sesión de hoy gratuita, texto «sin perder nada» y momento del muro).

**2026-11-15 · Fase 7 · Cierre**

- **Entregado:**
  - reglas del plan gratuito en el motor: 1 Sesión de hoy al día, 1 simulacro por semana (lunes a domingo) y práctica solo en Series numéricas, Comparación de datos y Ordenación alfabética (tabla «Monetización»);
  - capa de compras con RevenueCat (`react-native-purchases`): Premium = permiso `premium`, las compras siguen a la cuenta, y modo local de prueba **solo en desarrollo** (PAY-01, PAY-02, PAY-03);
  - muro de pago tras el primer simulacro, una vez, siempre cerrable, con anual destacado y 7 días de prueba, mensual y pases de 3 y 6 meses; errores explicados y «Reintentar» (PAY-01, PAY-02);
  - candados en Inicio, Práctica, Simulacro e Historial que abren el muro; nivel por aptitud, historial completo y repaso espaciado solo en Premium;
  - «Tu plan» en Cuenta: estado, renovación o fin del pase, gestionar la suscripción en la tienda y restaurar compras (PAY-03);
  - prototipos aprobados por el propietario el 2026-11-15 («Aprobados, sigue») antes de T4.
- **Revisores:**
  - `revisor-contenido`: sin bloqueantes; aplicada la prueba del lunes siguiente y un mensaje de error más claro;
  - `revisor-interfaz`: 1 bloqueante (el aviso del simulacro agrupaba su botón para el lector de pantalla) e importantes de texto legal, avisos en iPhone, muro bloqueado sin red, «Reintentar» y entradilla de Historial. Corregidos; segunda pasada: sin bloqueantes (queda como menor que la fila «Restaurar compras» de Cuenta no se ve ocupada mientras trabaja);
  - `verificador-fase`: sin bloqueantes con T7 aplazada; corregidos el modo local en producción (regalaba Premium), los flujos de Maestro (ahora cierran el muro) y la prueba de la Sesión de hoy sin repaso;
  - `ponytail-review`: corregido que cada arranque cerraba la sesión de RevenueCat (sin red, un Premium veía candados); Práctica y Simulacro preguntan el plan al entrar; quitado un campo sin uso del motor.
- **Comprobaciones:** `pnpm typecheck`, `pnpm lint` y `pnpm test` en verde (motor 274, app 114, componentes 24, tokens 1); `pnpm test:stress` en verde. Capturas Android en `docs/capturas/fase-7-*.png`.
- **Pendiente, sin bloquear el cierre:**
  - **T7**, criterio de aceptación: compra, renovación, cancelación y restauración en las tiendas. Pasos en `docs/planes/fase-7-prueba-tiendas.md`;
  - enlaces a Términos y Privacidad en el muro (norma 3.1.2 de Apple): imprescindibles antes de publicar;
  - «7 días gratis» está escrito en la pantalla: si se cambia la duración en la tienda, hay que cambiar el texto (anotado en el código);
  - en Android hay que comprobar que RevenueCat marca la prueba gratuita;
  - el plan empieza como gratuito hasta que contesta RevenueCat; sin red se usa su caché, pero no hay un estado «cargando»;
  - los límites usan la fecha del móvil: cambiándola se puede conseguir otro simulacro gratis;
  - abandonar un simulacro o una Sesión de hoy antes de terminar no los gasta;
  - faltan: captura del Inicio con el simulacro de la semana hecho, flujo de Maestro propio del plan gratuito, pruebas de pantalla de Práctica, Simulacro y la apertura del muro desde Resultado, y `.env.example` con las claves (los permisos de esta sesión no dejan editarlo);
  - para compilar Android en este Windows hace falta Java 17 (`JAVA_HOME` al JDK que descargó Gradle): Java 27 falla con «Unsupported class file major version 71».
- **Para que pruebes tú en un dispositivo real:** el flujo completo de la T7 cuando tengas las cuentas; mientras, en desarrollo, que el muro aparece al terminar el primer simulacro y que los candados llevan a él.
- **Decisiones tuyas pendientes:**
  - la Sesión de hoy gratuita mezcla los 6 tipos (la tabla solo limita la práctica por tipo) — ¿la limitamos a los 3 gratuitos?;
  - el muro dice «sin perder nada», pero en gratis el historial antiguo se oculta (la tabla dice «del último simulacro») — ¿cambiamos el texto o dejamos ver lo ya hecho?;
  - el muro se abre en cuanto carga el resultado del primer simulacro — ¿mejor al salir del resultado?

**2026-11-15 · Fase 6 · Aprobación**

- El propietario aprueba la fase 6 y se fusiona el PR #13. Siguen pendientes las pruebas en un móvil real (recordatorio, Sesión de hoy sin repetir enunciados y VoiceOver) y las decisiones anotadas en `docs/decisiones.md`.

**2026-11-15 · Fase 6 · Cierre**

- **Entregado:**
  - nivel adaptativo por aptitud (bloques de 10 respuestas, sube con 8 o más aciertos, baja con 4 o menos, rango 1–5) (ENT-03);
  - Sesión de hoy de 12 preguntas que prioriza el repaso y el tipo más flojo, sin repetir enunciados (ENT-02, REP-01);
  - «Tu nivel» en Historial con su evolución semanal de 4 semanas y el resumen leído en voz (PRO-01);
  - Inicio con el mismo nivel que Historial, racha, cuenta atrás al examen y la fila «Sesión de hoy» (PRO-03);
  - recordatorio diario local en Cuenta, con hora a elegir y sin aviso si la sesión de hoy ya está hecha (NOT-01);
  - rendimiento: se guarda si cada respuesta fue correcta; Inicio pasó de unos 8 s a 19 ms con 300 sesiones.
- **Revisores:**
  - primera pasada de `revisor-interfaz`: dos bloqueantes (nivel distinto entre Inicio e Historial; «a reforzar» con empate) y varios importantes. Corregidos en `65f2efc`;
  - segunda pasada de `revisor-interfaz`: sin bloqueantes (B1 y B2 resueltos). Corregidos además la fecha cortada en el gráfico y la prueba de «a reforzar». Quedan como menores el orden distinto de las aptitudes entre Inicio e Historial, que «a reforzar» se decida por acierto en Inicio y por nivel en Historial (decisión tuya), y las bolitas redondeadas;
  - `revisor-contenido`: no aplica a esta fase (no toca generadores ni perfiles);
  - `verificador-fase`: hallazgo I1 (duplicados en la Sesión de hoy) corregido y con prueba.
- **Comprobaciones:** `pnpm typecheck`, `pnpm lint` y `pnpm test` en verde (motor 268, app 95, componentes 23); `pnpm test:stress` 267 en verde. Capturas en el emulador Android: `docs/capturas/fase-6-inicio.png`, `fase-6-historial.png` y `fase-6-cuenta.png`.
- **Pendiente, sin bloquear el cierre:**
  - medidas fijas del gráfico (alto 150 y similares) en `level-chart.tsx` (I3);
  - M1, M3, M5–M7 y M9–M12 de la revisión de interfaz (la cuenta atrás no está en el prototipo de Inicio);
  - no hay `setNotificationHandler`: los avisos no se muestran si la app está abierta;
  - el test de nivel cuenta en el historial adaptativo;
  - los simulacros se fechan por su inicio;
  - `pnpm install --frozen-lockfile` falla en este Windows por una carpeta temporal de pnpm (el lockfile está bien).
- **Para que pruebes tú en un dispositivo real:**
  - que llega el recordatorio a la hora elegida en Android e iPhone, y que no avisa si ya hiciste la sesión de hoy;
  - que la Sesión de hoy no repite enunciados al hacerla varios días seguidos;
  - VoiceOver en iPhone: el gráfico se lee en orden (nivel, variación, resumen).
- **Decisiones pendientes de tu confirmación** (en `docs/decisiones.md`):
  - repetir la Sesión de hoy el mismo día da preguntas nuevas;
  - los avisos se programan para 7 días: si no abres la app en una semana, dejan de llegar;
  - el reparto de la Sesión de hoy usa el total de fallos y no el porcentaje.

**2026-11-15 · Fase 5 · Aprobación**

- El propietario aprueba la fase 5 y se fusiona el PR #11. Siguen pendientes, por su decisión: T8 (SMTP al final del proyecto), Apple y Google, y VoiceOver en iPhone.

**2026-11-15 · Fase 5 · Cierre**

- **Entregado:**
  - proyecto Supabase `aptiq` en la UE con RLS forzado, pruebas de dos usuarios y borrado en cascada pasadas en el servidor, y avisos de seguridad vacíos;
  - cola de sincronización (subida por id, sin red, reintentos, ajustes «gana el más reciente»);
  - inicio de sesión con código por correo;
  - pantallas de Cuenta, Código e Historial (prototipo aprobado);
  - borrar cuenta (función `borrar-cuenta`) y exportar;
  - búsqueda de claves secretas en la CI.
- **Revisiones:**
  - `revisor-interfaz`, dos pasadas: dos graves de accesibilidad corregidos y sin bloqueantes en la segunda;
  - `verificador-fase`, dos pasadas: sin bloqueantes en la segunda;
  - revisión Ponytail: vaciado local en una transacción.
  - Corregidos tras las revisiones: búsqueda de secretos en la CI, carrera al entrar con otra cuenta, mensajes para VoiceOver y TalkBack, teclado en Android.
- **Pendiente por decisión del propietario:**
  - T8 entero (SMTP aplazado al final del proyecto): prueba con dos móviles (`docs/planes/fase-5-prueba-dos-moviles.md`), flujos de Maestro `cuenta-enviar` y `cuenta-entrar`, y borrar una cuenta real desde la app comprobando que no quedan filas;
  - ONB-03 parcial: Apple y Google cuando existan sus cuentas de desarrollador.
- **Anotado para más adelante (menores de las revisiones):**
  - exportar como archivo en lugar de texto si el historial supera ~1 MB (límite de Android al compartir), antes de la beta;
  - cifras del código en mono 26 como en el prototipo, borde de las casillas vacías al 30 % de tinta (contraste 3:1), candado en la nota «Al crear la cuenta» y tamaño de las pestañas;
  - `accessibilityLabel` estable para «Reenviar código»; «Cerrar sesión» sin aviso mientras sube lo pendiente;
  - valores `maxHeight: '90%'` y `maxFontSizeMultiplier` a tokens;
  - la búsqueda de secretos revisa el paquete sin las variables de EAS: repetirla sobre la compilación de EAS en la fase 9;
  - carrera poco probable entre una descarga en curso y el borrado de cuenta.
- **Capturas (emulador Android, 2026-11-15):** `docs/capturas/fase-5-inicio.png`, `fase-5-cuenta-invitacion.png` y `fase-5-historial.png`, que coinciden con los prototipos. Faltan Cuenta con sesión y Código (necesitan SMTP), la hoja de borrar y el texto al 200 %.
- **Tiene que comprobarlo el propietario en un dispositivo real:**
  - VoiceOver en iPhone: campo del correo, campo del código y hoja de borrado;
  - TalkBack en Android;
  - con SMTP, todo T8.

**2026-11-15 · Fase 5 · T1–T7 hechas, T8 pendiente**

- Hecho: proyecto Supabase `aptiq` en la UE, esquema con RLS probado en el servidor, cola de sincronización, inicio con código por correo, pantallas de Cuenta, código e Historial (prototipo aprobado), borrar cuenta y exportar, búsqueda de secretos en la CI.
- **Pendiente, aplazado al final del proyecto (decisión del propietario, 2026-11-15):** correo propio por SMTP (buzón de Arsys). Sin él, Supabase envía un enlace en vez del código y solo a miembros del equipo; la plantilla no se puede editar. Lo configura el propietario; después Claude pone la plantilla con `{{ .Token }}`.
- Bloqueado por lo anterior: T8 (flujos `cuenta-enviar` / `cuenta-entrar` de Maestro y la prueba con dos móviles de `docs/planes/fase-5-prueba-dos-moviles.md`) y el criterio «el progreso aparece en un segundo dispositivo».

**2026-11-14 · Fase 4 · Aprobación**

- El propietario aprueba la fase 4 tras la verificación en el emulador (PR #9).
- Pendiente que no bloquea: VoiceOver y Maestro en iPhone, y escuchar TalkBack en un móvil real.

**2026-11-13 · Fase 4 · Cierre de pendientes (rama `fase-4-cierre`)**

- **Hecho:**
  - `SourceNote`: la guía (§5) y `docs/prototipos/inicio.html` dicen ya «Formato según la convocatoria oficial: …», como la app.
  - Inicio: práctica por aptitud con filas (`ListRow`) y acierto acumulado; «—» si no hay datos; la aptitud a reforzar en rojo. La práctica mixta (ENT-02) pasa a la fila «Todas las aptitudes».
  - Resultado: nota «x / 30» con el sello al lado, el mínimo en el veredicto, barras por aptitud (`AptitudeBar`) y desglose por tipo plegado.
  - Componentes nuevos en `packages/ui` con pruebas: `ListRow`, `AptitudeBar` e icono `chevron`.
  - Typecheck, lint y pruebas en verde: 230 del motor, 22 de `ui`, 22 de la app y 1 de tokens.
- **Verificado el 2026-11-14 en este equipo** (Android SDK, emulador Android 36 con Google Play, JDK 17 y Maestro instalados en carpetas de usuario):
  - release compilado (solo x86_64 para el emulador);
  - Maestro en verde con el código final: `onboarding.yaml` (3 pasadas), `practica.yaml` y `simulacro-offline.yaml` (simulacro de 80 preguntas en modo avión, segundo plano, cierre a mitad, entrega, resultado y repaso);
  - capturas nuevas en `docs/capturas/fase-4-*.png` y al 200 % en `docs/capturas/fase-4-texto-200/`;
  - cronómetro con la pantalla bloqueada: 128 s de reloj, 128 s menos en el cronómetro (52:36 → 50:28);
  - app cerrada a la fuerza 73 s a mitad de simulacro: al volver sigue el mismo simulacro con 74 s menos (50:17 → 49:03);
  - etiquetas que lee TalkBack, comprobadas en el árbol de accesibilidad («Opción A, ESCUDO», «Quedan 49 minutos», «Pregunta 1 de 80»…).
- **Corregido al verificar:**
  - `app.json` tenía `ios` y `android` repetidos, así que el identificador se perdía y la app salía como `com.anonymous.aptiq`. Ahora va dentro de los bloques existentes, con una prueba que detecta claves repetidas;
  - el plugin `with-windows-cmake` añade `CMAKE_OBJECT_PATH_MAX=200`: compila también en equipos Windows sin rutas largas activadas;
  - flujos de Maestro: tocan la fila «Numérica, …» (antes tocaban el texto de la tarjeta de nivel) y se desplazan hasta ella (al 200 % queda fuera de la pantalla).
- **`revisor-interfaz`:** sin graves en el código (el grave eran las capturas antiguas, ya rehechas). Corregidos los importantes:
  - cabecera de la lista de Inicio y nota «/ 30» que se cortaban al 200 %;
  - fórmula en mono (variante de token `formula`);
  - el punto débil también con texto «· a reforzar», no solo con color (WCAG 1.4.1).

  Corregidos los menores: «Puntos netos», plegable «Desglose por tipo» con chevron, cabecera «Por aptitud», orden fijo de las barras, nombre en tinta en la aptitud débil, sello oculto al lector (el veredicto ya lo dice) y espaciado de la lista.
- **Anotado para más adelante** (menores del revisor): cifras de aciertos, fallos y en blanco a 28 y centradas como en el prototipo; «Otro simulacro» junto a «Ver explicaciones» y botón de cerrar en Resultado (con la navegación de la fase 5); un mínimo de respuestas antes de marcar una aptitud como débil en Inicio; pequeñas diferencias de tamaño con el prototipo.
- **Solo lo puede hacer el propietario:** VoiceOver y Maestro en iPhone (este equipo es Windows) y escuchar TalkBack en un móvil real.

**2026-11-13 · Fase 4 · Fusión**

- PR #5 fusionado en `main`. Decisiones del propietario aplicadas: identificador `com.javioller.aptiq`; PRO-02 a la fase 5; PRO-01 a la fase 6; T8 / NFR-02 aplazado a la beta.
- Pendiente antes de aprobar la fase: última pasada de Maestro sobre el código final; cronómetro con la pantalla bloqueada; cerrar la app a mitad de simulacro; VoiceOver y TalkBack; Maestro en iPhone; diseño de Inicio y Resultado; texto de `SourceNote` en la guía y el prototipo.
- No aprobada por el propietario.

**2026-11-13 · Fase 3 · Aprobación**

- El propietario aprueba la fase 3 y su perfil `guardia-civil-2026`.
- Pendiente de la fase 3 que no bloquea el cierre: escribir a la Jefatura de Enseñanza sobre los tipos de la prueba de aptitudes, y las pistas de distractores ya anotadas.

<!-- Formato de cada entrada: fecha · fase · qué se hizo · qué queda · qué debe comprobar el propietario -->

**2026-11-12 · Fase 0**

- **Hecho:**
  - 8 skills de terceros instaladas (`docs/skills-lock.md`); Taste sin confirmar en git hasta que el propietario decida.
  - Plugins Expo, Superpowers y Ponytail.
  - Monorepo pnpm + Turborepo (`apps/mobile`, `packages/engine`, `packages/tokens`, `packages/ui`).
  - `@aptiq/tokens` con prueba contra `docs/tokens.json` (falla si se cambia un valor: comprobado).
  - ESLint bloquea `Math.random`, `Date.now` y `new Date()` en el motor (comprobado).
  - App Expo SDK 58 con la pantalla provisional: captura en `docs/capturas/fase-0-android.png`.
  - `expo-doctor`: 20/20.
  - CI en `.github/workflows/ci.yml`; `eas.json` sin enlazar a ninguna cuenta.
  - `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm test`: en verde.
- **Hooks verificados con el monorepo:**
  - `post-edit.sh` detecta errores de ESLint y lanza las pruebas del motor relacionadas.
  - `stop-check.sh` bloquea un error de tipos.
  - Se corrigió un fallo con las rutas de Windows en `post-edit.sh`.
  - CI en verde en GitHub ([ejecución](https://github.com/javierOllerSanchez/aptiq-app/actions/runs/43120389658)).
- **Cierre (`/cerrar-fase 0`):**
  - `verificador-fase`: todo lo comprobable cumple; solo falta la prueba en iPhone (no verificable aquí).
  - `revisor-interfaz`: sin bloqueantes. Corregidos I-1 (logotipo accesible para VoiceOver/TalkBack), I-3 (margen superior con el área segura) y M-1 (grosor de la cuadrícula).
  - `revisor-contenido`: no aplica (el motor aún no tiene generadores ni perfiles).
  - Ponytail: quitados dos tipos sin uso en `@aptiq/tokens`.
  - El `tsconfig` de la app ya usa las mismas reglas estrictas que el resto del monorepo.
- **Anotado para la fase 1 (hallazgos menores del revisor de interfaz):**
  - token de tamaño del logotipo, y decidir entre el SVG oficial (trazo 9) o el del prototipo a 80 px (trazo 11);
  - Bricolage solo en `Stamp`, en color `seal` (el «APTO» de la pantalla provisional es solo una muestra de la fuente);
  - patrón de pantalla con `ScrollView` para texto grande;
  - registrar si fallan las fuentes, y fondo `paper` en las transiciones del `Stack`;
  - sacar de `tokens.type` los pesos de fuente que se cargan;
  - pasar `app.json` a `app.config.ts` con tokens, y fondo del icono en `ink`.
- **Anotado (avisos del verificador):**
  - no se fija iOS 16 / Android 9 en la configuración porque el SDK ya admite desde iOS 15.1 y Android 7, así que NFR-10 se cumple sin añadir `expo-build-properties`;
  - no hace falta `.npmrc`: pnpm con dependencias aisladas funciona y `expo-doctor` lo aprueba;
  - `format` llama a Prettier directamente, sin Turborepo: es una sola herramienta en la raíz.
- **Debe comprobar el propietario:** abrir la app en Expo Go en su iPhone (`pnpm --filter mobile start` y escanear el código QR).
- **Notas para fases siguientes:**
  - iconos y pantalla de arranque siguen siendo los de Expo; se sustituirán por `docs/marca/icono-app.svg` antes de la beta;
  - `test:stress` aún no hace nada (fase 2);
  - el perfil `development` de `eas.json` necesitará `expo-dev-client` el día que se haga la primera compilación de desarrollo.

**2026-11-12 · Fase 1**

- **Hecho:**
  - `packages/ui` con 13 piezas, cada una con pruebas de rol y etiqueta: `Text`, `Button`, `OptionBubble`, `GlassCard` y `Glass`, `TabBar`, `ProgressTicks`, `LevelBubbles`, `Stamp`, `SourceNote`, `PaperBackground` (con modo `scroll`), `Logo` e `Icon`.
  - Tokens nuevos en `docs/tokens.json`; la prueba de coincidencia sigue en verde.
  - Catálogo `/catalogo`, solo en desarrollo, y pantalla provisional con los componentes.
  - Capturas en Android: `docs/capturas/fase-1-catalogo-1/2/3.png` y, con el texto al 200 %, `fase-1-texto-200.png`.
- **Cierre (`/cerrar-fase 1`):**
  - `verificador-fase`: typecheck, lint, test y CI en verde. Pedía corregir «reducir movimiento» y actualizar estos documentos; ya está hecho.
  - `revisor-interfaz`: sin bloqueantes. Corregido:
    - «reducir movimiento» mantiene el fundido (`ReduceMotion.Never` en las animaciones de opacidad);
    - las opciones se anuncian «Opción B, 63, seleccionada», y las correctas o falladas ya no salen como desactivadas;
    - la letra amarilla ya no asoma al marcar (fundido cruzado);
    - todo lo pulsable responde visualmente; la vibración solo suena si cambia la respuesta;
    - el contenido no salta 1 px al marcar;
    - la barra de pestañas se anuncia como grupo de pestañas;
    - `GlassCard` agrupa su contenido para el lector.
  - Ponytail: se ha simplificado la simulación de Reanimated y se ha quitado una etiqueta redundante del botón.
  - Prettier aplicado al código; los Markdown y los recursos quedan fuera.
- **Debe comprobar el propietario:**
  - en el iPhone, abrir el catálogo («Ver catálogo») y recorrerlo con VoiceOver: opciones, pestañas, progreso y sello;
  - ejecutar `/review-animations` en el chat sobre `packages/ui/src/option-bubble.tsx` y `stamp.tsx`.
- **Anotado para la fase 4 (menores):**
  - el icono de `SourceNote` no crece con el texto dinámico;
  - algunos valores de icono y sello siguen escritos a mano (`size.icon * 0.8`, la escala 1,15 del sello): pasarlos a tokens cuando se usen en pantallas;
  - `glass.saturate` no se aplica (expo-blur no lo admite);
  - el catálogo no sigue el orden exacto de `sistema.html` ni tiene la lámina de color.
- **Para que lo decida el propietario:** casillas pendientes (1,28:1), burbujas de nivel vacías (1,73:1) y borde de opción vacía (1,38:1) quedan por debajo del 3:1 que WCAG 1.4.11 pide a los elementos gráficos. Son valores de la guía; la información también llega por el texto y la etiqueta accesible.

**2026-11-12 · Fase 2**

- **Hecho:**
  - Motor con 6 tipos de pregunta (series numéricas y de letras, cálculo y porcentajes, códigos, ordenación alfabética y comparación de datos), en versión 2.
  - 5 niveles por tipo, con familias de reglas con nombre.
  - Cada tipo tiene generador, solucionador independiente y explicación paso a paso (observa, regla, aplica, error de cada distractor y truco).
  - Generación determinista por semilla (NFR-09).
  - Batería común de pruebas para todos los tipos:
    - unicidad;
    - determinismo;
    - coherencia de la explicación;
    - errores explicados;
    - posición A, B, C, D uniforme;
    - puesto por valor;
    - que aparezcan todas las familias;
    - variedad;
    - instantáneas.
  - 171 pruebas. `pnpm test:stress`: 10.000 por tipo, nivel y número de opciones, sin ninguna ambigua. La prueba de estrés también se ejecuta cada noche en GitHub Actions.
  - 120 muestras en `docs/muestras/`.
- **Revisiones:**
  - `verificador-fase`: el código cumple el criterio de aceptación.
  - `revisor-contenido`, primera revisión: 2 bloqueantes (explicación invertida en las series de letras hacia atrás y series intercaladas con dos lecturas) y 7 importantes. Todos corregidos, salvo lo que se indica abajo.
  - `revisor-contenido`, segunda revisión: **sin bloqueantes**.
- **Pendiente (decisión del propietario: se hace al empezar la fase 3, con los exámenes oficiales como referencia):**
  - **Distractores adivinables.** En NUM.SERIE y NUM.CALC, elegir «la opción rodeada de errores de ±1, ±2 o ±10» acierta entre el 53 % y el 75 % con 4 opciones; en COD.CRIPTO de cifras, «la opción que más se parece a las demás» acierta entre el 40 % y el 69 %.
    - El trabajo empezado está en la rama local `fase-2-distractores`. Incluye la prueba común «centro de errores» y el límite de errores genéricos por pregunta, y le faltan errores de la regla a ambos lados en varias familias.
  - En las series que solo suben o solo bajan, el distractor «paso al revés» da un término ya visible. LET.SERIE, nivel 3: «cambias el salto dos veces» puede repetir la última letra.
  - VER.ORDEN, preguntas de «puesto N»: la correcta está en el medio alfabéticamente un 67–70 % de las veces en los niveles 2 y 3.
  - Variedad baja en LET.SERIE, nivel 3 (52 enunciados distintos por cada 1.000 semillas).
  - **Hasta resolverlo, las preguntas no se muestran a opositores (fase 4).**
- **Debe hacer el propietario:** decidir quién revisa las 120 muestras de `docs/muestras/` y marcar las casillas «Revisada».

**2026-11-12 · Fase 3**

- **Hecho:**
  - **Perfil `guardia-civil-2026`:** 80 preguntas, 55 minutos, 4 opciones, escala 0-30 y mínimo de 12, con la fórmula de la base 7.3 (BOE-A-2026-9982). Cada dato cita su apartado.
  - **Proporción de tipos pendiente:** la Guardia Civil no publica el cuestionario de aptitudes, solo la plantilla de respuestas (`packages/engine/profiles/analysis/guardia-civil-2026.md`).
  - **Validador de perfiles:** un dato con valor sin fuente oficial, o un dato nulo que no esté en `pendiente`, hace fallar las pruebas.
  - **Puntuación (`score.ts`):** casos calculados a mano; la nota negativa se muestra sin recortar.
  - **Rediseño de distractores, pendiente de la fase 2:**
    - el montaje sortea la familia y el puesto de la correcta una vez por pregunta;
    - como mucho dos errores genéricos;
    - sin la correcta en el centro de los errores;
    - sin opciones visibles ni en sentido contrario;
    - en los códigos, sin la pista de «la que más se parece a las demás».
  - **Generadores:** versión 4, salvo las series numéricas, que van en la 3. 198 pruebas del motor, también en estrés.
- **Revisiones:**
  - `verificador-fase`: el código cumple el criterio de aceptación; la revisión del propietario no es verificable aquí.
  - `revisor-contenido`:
    - **Perfil:** correcto contra el BOE y la plantilla oficial.
    - **1 bloqueante, corregido:** el texto «sumas/restas la diferencia» invertido en las reglas de tres, ahora con prueba.
    - **Corregidos además:** una opción que repetía la última letra en las series de letras, las palabras con tilde mostradas sin ella, los porcentajes con punto decimal, la cita del PDF corregido de plantillas y varios textos desfasados.
- **Pendiente (importantes del revisor, anotados con su motivo):**
  - **Nuevas pistas para adivinar, más sutiles:**
    - la correcta en el punto medio de dos opciones a la misma distancia (multiplicación del nivel 1, diferencias de segundo orden, reglas de tres; 40-60 %);
    - en porcentajes, la opción que tiene su doble o su mitad entre las opciones (57-62 %);
    - en los códigos de cifras, un patrón en los distractores de dos errores (51-73 %).
  - **Motivo:** cada arreglo de una pista ha hecho aparecer otra. Lo eficaz es validar con opositores reales (decisión del propietario) y añadir cada estrategia que se detecte a la batería común. Se retoma antes de la beta.
  - **Series de letras:** muchos distractores son «cuentas una o dos letras de más o de menos».
  - **Variedad baja en las series de letras:** 162, 167 y 52 enunciados distintos por cada 1.000 semillas en los niveles 1 a 3. Es una limitación del alfabeto de 27 letras, ya anotada en `docs/decisiones.md`.
- **Debe hacer el propietario:**
  - revisar el perfil contra el BOE y marcar la casilla de `packages/engine/profiles/analysis/guardia-civil-2026.md`;
  - decidir si escribe a la Jefatura de Enseñanza.

**2026-11-12 · Fase 4 · T1 (en curso)**

- **Hecho:** modelo de sesión y reparto de práctica en el motor (`packages/engine/src/session/plan.ts`). Reparto equitativo para el simulacro y prioritario por fallos para la práctica; semillas no repetidas (CON-02). 7 pruebas en verde.
- **Pendiente de la fase:** T2 a T11 según `docs/planes/fase-4.md`.

**2026-11-12 · Fase 4 · T2**

- **Hecho:** estado del simulacro en el motor (`packages/engine/src/exam/state.ts`): tiempo por marcas de reloj, cierre automático al agotarse, respuestas en blanco, marcar para revisar y navegación. Inmutable. Pruebas en verde.
- **Pendiente de la fase:** T3 a T11.

**2026-11-12 · Fase 4 · T3**

- **Hecho:** explicación de cada pregunta, error de la opción elegida y truco (`packages/engine/src/review/review.ts`); desglose por tipo y aptitud, cuadrado con `score()`, y aptitud a reforzar. Pruebas en verde.
- **Pendiente de la fase:** T4 a T11.

**2026-11-12 · Fase 4 · T4**

- **Hecho:** hook `useExamClock` (`apps/mobile/src/hooks/use-exam-clock.ts`): recalcula con el reloj cada segundo y al volver a primer plano; recibe el estado del simulacro (no inicio y duración, como decía el plan) para no repetir la lógica del motor. La app depende de `@aptiq/engine`. Pruebas en verde.
- **Pendiente de la fase:** T5 a T11. Pendiente en dispositivo: pasar el móvil a segundo plano 2 minutos y comprobar el cronómetro.

**2026-11-12 · Fase 4 · T5**

- **Hecho:** almacenamiento local: contrato `Store` (ajustes, semillas usadas, sesiones, intentos), implementación en memoria para pruebas y la de SQLite con Drizzle (`expo-sqlite` y `drizzle-orm`). Las tablas se crean con SQL al abrir la base, sin drizzle-kit por ahora. 4 pruebas del contrato en verde.
- **Pendiente en dispositivo (T9):** la implementación de SQLite no se puede probar con Jest (módulo nativo); se comprueba al abrir la app.
- **Dependencias nuevas:** `expo-sqlite` (SDK 58, del stack) y `drizzle-orm` (del stack). Se anotan en `docs/decisiones.md` al cerrar la fase.

**2026-11-12 · Fase 4 · T6 (parcial)**

- **Hecho:** cálculo del nivel orientativo por tipo a partir del test de nivel (`packages/engine/src/level/estimate.ts`): lineal de 1 a 5, sin contar las preguntas en blanco y sin inventar nivel cuando no hay respuestas. 3 pruebas en verde.
- **Pendiente:** las pantallas de onboarding (elegir oposición y fecha, test de 10 minutos) y su flujo de Maestro.

**2026-11-12 · Fase 4 · T6 y T7 (código; sin verificar en dispositivo)**

- **Hecho:**
  - Arranque con redirección: sin oposición va al onboarding, con oposición a Inicio.
  - Onboarding en 3 pasos (oposición, fecha opcional y test de 12 preguntas), con el nivel estimado guardado.
  - Inicio con sesión de hoy, simulacro, práctica por aptitud y el aviso de preguntas en revisión.
  - Práctica con confirmación y explicación (EXP-01 a EXP-03), simulacro con cronómetro y navegación, resultado con la nota del perfil oficial (RES-01, RES-02) y repaso de fallos (RES-03).
  - El paquete de Android se genera sin errores (`expo export`).
  - Lint de la app limpio; 12 pruebas de la app en verde.
- **No verificado aún:**
  - Ninguna pantalla se ha visto en un dispositivo ni comparado con su prototipo (T10).
  - Los flujos de Maestro (T9) no existen.
  - Sesión activa en memoria: si la app se cierra a mitad de práctica se pierde esa sesión.
- **Pendiente de la fase:** T8 (modo avión y medición de arranque), T9, T10 y T11.

**2026-11-12 · Fase 4 · T9 (Maestro en el emulador)**

- **Hecho:**
  - **Compilación release en Windows arreglada.** Pasaba de 260 caracteres en las rutas de CMake. Se resuelve con `node_modules` plano (`.npmrc`) y con un plugin que usa CMake 3.31.6 en Windows.
  - **App instalada** en el emulador Android 37 (`Medium_Phone_API_37.0`).
  - **Flujos de Maestro en verde:**
    - `onboarding.yaml`: oposición, fecha y test de 12 preguntas.
    - `practica.yaml`: 10 preguntas de Numérica, con explicación y truco.
    - `simulacro-offline.yaml`: **simulacro completo de 80 preguntas en modo avión**, pasando por segundo plano, con marca para revisar, entrega, resultado con la fórmula y repaso de fallos.
  - Monorepo: typecheck, lint y pruebas en verde (221 del motor, 15 de `ui` y 15 de la app).
- **Límite:** Maestro no lee el cronómetro con precisión. La exactitud tras pasar a segundo plano la cubre la prueba de `use-exam-clock`.
- **Pendiente:**
  - T8: medir el arranque en un móvil de gama media.
  - T10: comparar con los prototipos y revisar accesibilidad.
  - T11: cierre.
  - Que el propietario confirme el identificador de la app.

**2026-11-12 · Fase 4 · T10 (prototipos, accesibilidad y `revisor-interfaz`)**

- **Revisión:** `revisor-interfaz` encontró 7 problemas graves y 13 importantes. **Graves, todos corregidos:**
  1. **Dejar en blanco (SIM-02):** `clear()` en el motor, con prueba, y botón en el simulacro.
  2. **Fórmula visible (RES-01):** completa y con el resultado, «(0 aciertos − 1 fallo ÷ 3) × 30/80 = −0,13», con el singular y el signo menos tipográfico.
  3. **Desglose (RES-02):** por aptitud y por tipo, con el total real (incluidas las de en blanco) y porcentaje; la aptitud a reforzar en rojo.
  4. **Nivel estimado:** se muestra en Inicio, marcado como orientativo.
  5. **Salida del simulacro:** pide confirmación con el botón cerrar, con Atrás de Android y al entregar (dice cuántas quedan en blanco y cuántas marcadas); sin gesto de deslizar.
  6. **Campo de fecha:** estilo de texto correcto (`textStyle`) y validación del formato.
  7. **Capturas:** rehechas, a tamaño normal y con el texto al 200 % (`docs/capturas/fase-4-texto-200/`).
- **Importantes corregidos:**
  - márgenes duplicados (ahora 20 de lado);
  - `Timer` de cristal con reloj y anuncio por minutos;
  - tipo de pregunta, penalización, nota de fuente y «Siguiente marcada» en el simulacro;
  - `checked` y `radiogroup` para TalkBack y VoiceOver;
  - fuente «la Guardia Civil» y formato leídos del perfil;
  - repaso con los tres pasos, opciones correcta/fallo y una tarjeta por pregunta;
  - un solo amarillo en Práctica tras corregir;
  - test de nivel con 10 minutos, «No lo sé» y casillas;
  - estados de carga.
- **Al 200 %:** la letra de la burbuja ya no se corta (tamaño fijo, como un icono) y el nombre del tipo ya no se parte a mitad de palabra.
- **Verificado:**
  - los 4 flujos de Maestro en verde en el emulador (el simulacro llega a la pregunta 80 y entrega en modo avión);
  - typecheck, lint y pruebas en verde: 224 del motor, 18 de `ui` y 15 de la app.
- **Pendiente de decidir por el propietario (importantes que cambian la estructura):**
  - barra de pestañas y filas de lista (`ListRow`) en Inicio;
  - marca visible en las casillas de progreso;
  - composición exacta de Resultado (nota con «/ 30» y sello al lado) y barras por aptitud;
  - cuál es el botón amarillo de Inicio: he seguido el prototipo («Empezar simulacro»).
- **Para revisar el propietario:** `SourceNote` dice «exámenes publicados por la Guardia Civil», pero la Guardia Civil solo publica la plantilla de respuestas de aptitudes, no el cuestionario.

**2026-11-12 · Fase 4 · Cierre (en curso; subido a GitHub para seguir desde otro equipo)**

- **Revisiones del cierre:**
  - `verificador-fase`, primera pasada: «no lista». Bloqueantes:
    - segunda pasada de `revisor-interfaz`: **hecha, sin graves**;
    - NFR-03 al cerrarse la app: **corregido**; el simulacro se guarda tras cada cambio y se retoma con «Continuar simulacro»;
    - prueba del cronómetro en un móvil real: **la hace el propietario**;
    - T8: **pendiente del propietario**;
    - aplazar PRO-01 y PRO-02: **pendiente del propietario**;
    - documentación de cierre: hecha.
  - `revisor-interfaz`, segunda pasada: **ningún grave**. Corregidos los importantes 1, 3, 4 y 6:
    - tarjeta de la pregunta;
    - mismo criterio para «a reforzar» y el porcentaje mostrado;
    - aviso si el test no da para estimar;
    - el veredicto de Práctica se anuncia al lector de pantalla.
  - `revisor-contenido`, primera pasada: 2 bloqueantes, **corregidos**:
    - `SourceNote` ya no habla de «exámenes publicados»: cita BOE-A-2026-9982 y sus bases;
    - aviso visible de que la mezcla de tipos no es oficial.

    Importantes corregidos:
    - enunciados repetidos dentro de un simulacro (CON-02);
    - «a reforzar»;
    - test de nivel;
    - el error de cada opción incorrecta (EXP-02);
    - «3 fallos restan 1 acierto».
  - `revisor-contenido`, segunda pasada: **ningún bloqueante**. Sus 2 importantes nuevos están corregidos: no hay «a reforzar» si todas las aptitudes empatan, y con la mitad de aciertos no se sube de nivel.
  - Ponytail: una sola `LETTERS` y `toSaved`/`fromSaved` compartidos. `Store` se queda (dos implementaciones).
- **Verificado en este equipo:** typecheck, lint, test y `test:stress` en verde (230 del motor, 18 de `ui` y 22 de la app).
- **Sin confirmar todavía:** la última pasada de Maestro con el código final. La anterior pasó los 3 flujos; los flujos se han reforzado con dejar en blanco, segundo plano y cierre de la app a mitad. Para repetirla en otro equipo:
  1. compilar el release (Windows necesita el plugin `with-windows-cmake`, ya incluido);
  2. ejecutar `maestro test apps/mobile/.maestro/onboarding.yaml`, `practica.yaml` y `simulacro-offline.yaml` (los dos últimos lanzan el onboarding solos).
- **Debe decidir el propietario** (lista en `docs/decisiones.md`, «Pendientes»):
  - aplazar PRO-01 y PRO-02;
  - T8 / NFR-02;
  - cambio del texto de `SourceNote` en la guía y el prototipo;
  - diseño de Inicio y Resultado;
  - identificador de la app.
- **Debe probar el propietario en un móvil real:**
  - simulacro con 2 minutos en segundo plano y pantalla bloqueada (el cronómetro baja unos 2 minutos);
  - cerrar la app a mitad de simulacro y volver con «Continuar simulacro»;
  - VoiceOver y TalkBack en las opciones;
  - Maestro en iPhone.
