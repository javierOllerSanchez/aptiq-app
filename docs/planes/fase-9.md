# Fase 9 · Beta y lanzamiento · Plan

**Rama:** `fase-9-lanzamiento`
**Requisitos:** NFR-05 (consentimiento para analítica, RGPD), NFR-08 (aviso de independencia), SOP-03 (ayuda y contacto), PAY-01 y PAY-03 (enlaces legales del muro y prueba en tiendas), NFR-02 (medir el arranque, aplazado a la beta), NFR-11, ADM-03 (versión del perfil en el simulacro, pendiente de la fase 8) y el punto 7 del «Motor de contenido» (calibración con datos reales). La ficha no cita IDs; estos son los que tocan sus tareas.
**Criterio de aceptación (`docs/plan-fases.md`):** beta con opositores reales, sin errores graves abiertos, revisión legal hecha.
**Estado:** plan confirmado por el propietario el 2026-11-19 («Sí, tal cual»), con las propuestas de las decisiones 1–9. Las cuentas, los datos del titular y los probadores siguen pendientes de él.
**Skills:**
- `aptiq-design-system` (manda): pantallas nuevas, iconos y web.
- `aptiq-generator`: solo si la calibración cambia un generador.
- Taste (`design-taste-frontend`): solo la web de lanzamiento, y sin sus colores ni fuentes.
- `design:accessibility-review`: app y web antes del cierre.
- `eas-app-stores`, `eas-workflows` y `eas-observe` **no están instaladas** (vienen con el plugin de Expo, ver `docs/skills-terceros.md`). Sin ellas sigo la documentación de Expo. Superpowers tampoco está instalada: el plan sigue el formato de las fases anteriores.

## Punto de partida

- La app usa todavía el **icono de ejemplo de Expo** (una «A» azul) y el fondo del icono de Android es el de la plantilla. Hay que cambiarlo antes de cualquier beta.
- No hay analítica ni registro de errores. No hay «Ayuda y contacto» (SOP-03). El muro no enlaza a Términos ni a Privacidad (Apple lo exige, norma 3.1.2).
- El aviso de independencia ya está en Onboarding e Inicio. No hay política de privacidad, aviso legal ni términos.
- `eas.json` tiene los perfiles básicos, pero el proyecto no está vinculado a EAS (falta la cuenta de Expo) y no hay `expo-updates`.
- Supabase: un solo proyecto (pruebas). Se decidió separar pruebas y producción antes de la beta (2026-11-14).
- El correo de Supabase es el de serie, que solo envía unos pocos correos por hora: con 15 personas probando, el inicio de sesión fallaría. El SMTP propio se aplazó «al final del proyecto», que es ahora.
- Pendientes de fases anteriores que tocan aquí: prueba de compras en tiendas (fase 7 · T7), medir el arranque (NFR-02), versión del perfil en el simulacro (ADM-03) y las tres decisiones de la fase 7.

## Reglas

- La fase tiene dos partes. **Parte A**: lo que puedo hacer ya, sin cuentas nuevas. **Parte B**: lo que necesita tus cuentas (Apple, Google, Expo, PostHog, Sentry) o personas reales.
- **Nunca invento datos legales.** Los textos legales son un borrador para el abogado; tus datos de titular (nombre, NIF, domicilio) los pones tú o me los das, y lo que falte queda como «Pendiente».
- **Analítica solo con permiso:** desactivada por defecto, «Aceptar» y «No, gracias» igual de fáciles, sin datos personales, servidor en la UE. Sin permiso no sale ningún evento (lo vigila una prueba).
- Claves de PostHog y Sentry: solo las públicas, en variables `EXPO_PUBLIC_*`. Sin clave, la app no envía nada. Las claves privadas (subir mapas de código a Sentry) van como secreto de EAS, nunca en el repositorio.
- **No publico nada en las tiendas ni creo cuentas.** Te dejo todo listo y el botón de enviar a revisión lo pulsas tú o me das el sí explícito en ese momento.
- Dependencias nuevas previstas: `posthog-react-native` y `@sentry/react-native` (ambas en el stack), `expo-updates` (EAS Update, en el stack). Se anotan en `docs/decisiones.md`.

## Tareas · Parte A (sin cuentas nuevas)

### T1 · Icono y pantalla de arranque de Aptiq
- **Requisitos:** NFR-11.
- **Archivos:** `apps/mobile/assets/images/*` (icono, icono adaptativo de Android en primer plano, fondo y monocromo, arranque, favicon), `apps/mobile/assets/expo.icon`, `app.json` (color de fondo con el token `paper`).
- **Qué:** los PNG salen de `docs/marca/icono-app.svg` tal cual (no se redibuja). Se exportan desde el navegador interno, sin dependencias nuevas.
- **Verificación:** compilación release en el emulador Android y captura del cajón de apps y del arranque, comparada con `docs/marca/`.

### T2 · Prototipos de las pantallas nuevas
- **Requisitos:** NFR-05, SOP-03, NFR-08, PAY-01, NFR-11.
- **Archivos:** `docs/prototipos/consentimiento.html`, `ayuda.html`, cambios en el prototipo del muro y de Cuenta, sección en `index.html`.
- **Qué:** pregunta de analítica al final del Onboarding; en Cuenta, la sección «Ayuda y legal» (Ayuda y contacto, Privacidad, Aviso legal, Términos, interruptor «Compartir datos de uso») y los enlaces legales al pie del muro.
- **Verificación:** **los apruebas tú** antes de T6 y T7.

### T3 · Textos legales (borrador para el abogado)
- **Requisitos:** NFR-05, NFR-08, PAY-01.
- **Archivos:** `apps/web/privacidad.html`, `aviso-legal.html`, `terminos.html`, `borrar-cuenta.html`.
- **Qué:**
  - **Privacidad:** qué datos se guardan (los de la tabla del servidor de la fase 5), dónde (Supabase en Fráncfort, PostHog UE, Sentry UE, RevenueCat), para qué, cuánto tiempo, derechos y cómo ejercerlos (exportar y borrar desde la app).
  - **Aviso legal:** LSSI, independencia de la Administración y de la Guardia Civil, y contenido original.
  - **Términos:** suscripción, prueba, pases y renovación.
  - **Borrar cuenta:** página pública que Google Play exige.
- **Verificación:** lista de lo que dice cada texto frente a lo que hace el código (lo comprueba un subagente). **La revisión legal la haces tú con un abogado** (criterio de aceptación).

### T4 · Web de lanzamiento
- **Requisitos:** NFR-08, NFR-11, SOP-03.
- **Archivos:** `apps/web/index.html`, `ayuda.html`, `estilos.css` (con los valores de `docs/tokens.json`), imágenes de `docs/marca/` y capturas.
- **Qué:** una página que explica Aptiq (simulacro con el formato oficial, explicación paso a paso, sin conexión, independiente), enlaces a las tiendas cuando existan, ayuda y contacto, y las páginas legales de T3. HTML y CSS estáticos, sin framework: se publica en cualquier alojamiento gratuito. Taste aporta criterio, no estilo.
- **Verificación:** navegador interno a 375 px y en escritorio, capturas, `design:accessibility-review` y que pase `scripts/buscar-secretos.mjs`.

### T5 · Versión del perfil en el simulacro (ADM-03, pendiente de la fase 8)
- **Requisitos:** ADM-03, RES-01.
- **Archivos:** capa de datos de `apps/mobile/src/data/` (intento con `profileVersion`), puntuación en Resultado e Historial, migración local de SQLite y del servidor, pruebas.
- **Qué:** cada simulacro guarda el id y la versión del perfil con que empezó y se puntúa siempre con esa versión, aunque luego se publique otra.
- **Verificación:** prueba primero (falla hoy): publicar una versión con otra fórmula no cambia una nota guardada. Pruebas de RLS si cambia el servidor.

### T6 · Ayuda, legal y enlaces del muro en la app
- **Requisitos:** SOP-03, NFR-08, PAY-01, PAY-03.
- **Archivos:** `apps/mobile/src/screens/cuenta.tsx` y `muro-pago.tsx` (+ pruebas), constantes con las direcciones de la web.
- **Qué:** filas que abren las páginas de T3 y T4 y el correo de soporte, con `Linking` de React Native (sin dependencias). Visibles también sin cuenta.
- **Verificación:** jest-expo (cada fila abre su dirección), revisión con el prototipo aprobado y lector de pantalla.

### T7 · Analítica con consentimiento (PostHog UE)
- **Requisitos:** NFR-05.
- **Archivos:** `apps/mobile/src/analytics/` (consentimiento guardado en `ajustes`, lista cerrada de eventos), Onboarding, Cuenta, `.env.example`.
- **Qué:** eventos mínimos y sin datos personales para la beta y la calibración: onboarding terminado, test de nivel terminado, simulacro empezado y entregado, muro visto, compra hecha, error reportado. Identificador anónimo; nunca el correo. Retirar el permiso para y borra el identificador local.
- **Verificación:** pruebas (sin permiso, cero envíos; con permiso, solo eventos de la lista; sin clave, nada) y comprobar en PostHog que llegan (Parte B).

### T8 · Registro de errores (Sentry UE)
- **Requisitos:** criterio «sin errores graves abiertos», NFR-05.
- **Archivos:** `apps/mobile/src/_layout.tsx` (iniciar Sentry), `app.json` (plugin), `.env.example`.
- **Qué:** fallos de la app con su versión y la ruta, sin datos personales (`sendDefaultPii: false`, sin capturas de pantalla). La política de privacidad lo explica.
- **Verificación:** un fallo de prueba en desarrollo aparece en Sentry (Parte B) y la búsqueda de secretos sigue en verde.

## Tareas · Parte B (necesitan cuentas o personas)

### T9 · EAS: compilaciones, envío y actualizaciones
- **Requisitos:** NFR-10, NFR-02.
- **Archivos:** `apps/mobile/eas.json`, `app.json` (`projectId`, `updates`, `ITSAppUsesNonExemptEncryption: false`), variables de entorno en EAS.
- **Qué:** perfil `preview` (beta interna) y `production` (tiendas) con canales de EAS Update para corregir la beta sin pasar por revisión. Compilación de Android e iOS en EAS.
- **Verificación:** las dos compilaciones terminan en EAS y la de Android arranca en el emulador. Medir el arranque en frío en release (NFR-02, aplazado desde la fase 0).

### T10 · Supabase de producción y correo propio
- **Requisitos:** NFR-05, NFR-06, ONB-03.
- **Archivos:** `supabase/` (mismas migraciones y función `borrar-cuenta`), variables del perfil `production`.
- **Qué:** proyecto nuevo en la UE para la beta y el lanzamiento (el actual queda para pruebas). SMTP de Arsys: **la contraseña la escribes tú** en el panel de Supabase. Plantilla del correo con el código.
- **Verificación:** `supabase/tests/rls-*.sql` en el proyecto nuevo, sin avisos de seguridad, y entrar con un correo real.

### T11 · Fichas de tienda
- **Requisitos:** NFR-08, NFR-05.
- **Archivos:** `docs/tiendas/ficha.md` (nombre, subtítulo, descripción, palabras clave, categoría Educación, edad), `docs/tiendas/privacidad.md` (respuestas para «Privacidad de la app» de Apple y «Seguridad de los datos» de Google), `docs/capturas/tienda-*.png`.
- **Qué:** textos en el tono de la guía, con el aviso de independencia y sin prometer aprobar. Capturas en los tamaños que piden las tiendas.
- **Verificación:** las respuestas de privacidad coinciden con T3 y con el código (lo revisa un subagente). Las pegas tú, o yo con tu permiso.

### T12 · Beta cerrada
- **Requisitos:** criterio de aceptación; PAY-01 a PAY-03 (fase 7 · T7).
- **Archivos:** `docs/beta/guia-probadores.md` (qué probar y cómo reportar), `docs/beta/registro.md`.
- **Qué:** TestFlight (enlace público tras la revisión de Apple para la beta) y prueba cerrada de Google Play. Compras con dinero de prueba en las dos tiendas, que no cobran a los probadores. Dos o tres semanas.
- **Verificación:** número de probadores activos, simulacros entregados y reportes en el panel; compra, renovación, cancelación y restauración comprobadas (pasos de `docs/planes/fase-7-prueba-tiendas.md`).

### T13 · Errores de la beta
- **Requisitos:** criterio «sin errores graves abiertos», SOP-01.
- **Archivos:** según el error; `docs/beta/errores.md`.
- **Qué:** cada semana repaso Sentry y los reportes del panel. Son graves: un cierre de la app, una pregunta con dos respuestas o una explicación errónea, perder datos y un fallo de pago. Se corrigen con su prueba, y se envían por EAS Update o en una compilación nueva.
- **Verificación:** `docs/beta/errores.md` sin graves abiertos al cerrar.

### T14 · Primera calibración
- **Requisitos:** punto 7 del «Motor de contenido», ADM-02, ENT-03.
- **Archivos:** `docs/calibracion/2026-beta.md`; si hace falta, generadores con su versión nueva (skill `aptiq-generator`, pruebas primero).
- **Qué:** con `metricas()`, acierto y tiempo por tipo, nivel y familia (mínimo 10 respuestas por grupo). Marco lo que no encaja: un nivel 4 más fácil que un 2, un tiempo muy lejos del esperado o una pregunta que no discrimina. Te propongo los ajustes y **los apruebas tú** antes de tocar el motor.
- **Verificación:** informe con los datos y, si cambia un generador, pruebas y estrés en verde y `revisor-contenido`.

### T15 · Cierre
- **Qué:** `design:accessibility-review` en la app y la web, `revisor-interfaz`, `revisor-contenido` sobre los textos, `verificador-fase` y `/cerrar-fase 9`.
- **Verificación:** criterio de aceptación con pruebas: beta hecha, sin errores graves abiertos y tu confirmación de la revisión legal.

## Fuera de esta fase

- Pulsar «Publicar» en las tiendas: lo haces tú, o yo con tu sí en ese momento.
- Entrar con Apple o Google (ONB-03 completo): no es obligatorio si solo hay correo; se añade después.
- Elegir oposición (ONB-04), Policía Nacional y Auxiliar en la app.
- Publicar el panel en internet.
- Los informes de rendimiento de EAS (`eas-observe`): el arranque se mide a mano en release, como se decidió en la fase 0.

## Decisiones que solo puedes tomar tú

1. **Cuentas y costes.** Hacen falta: Apple Developer (99 € al año), Google Play Console (25 $ una vez), Expo (gratis), PostHog (gratis hasta 1 millón de eventos al mes, región UE) y Sentry (plan gratuito, región UE). ¿Cuáles tienes ya? Las creas tú. En Apple, ¿cuenta personal (sale tu nombre como vendedor) o de empresa (necesita número D-U-N-S)?
2. **Prueba cerrada de Google.** Hoy, una cuenta personal nueva de Google Play debe tener **al menos 12 probadores durante 14 días seguidos** antes de poder publicar. Lo confirmamos al crear la cuenta. Propuesta: beta de **15 a 20 opositores, al menos 12 con Android**, durante 2 o 3 semanas. ¿Quién los busca? Tú.
3. **Datos del titular** para el aviso legal, la privacidad y las tiendas: nombre, NIF, domicilio y correo. Además, la Unión Europea obliga a decir en las tiendas si eres «comerciante» (si cobras, casi seguro que sí), y entonces la dirección y el teléfono salen públicos. Pregúntalo al abogado.
4. **Dominio, correo de soporte y alojamiento de la web.** Las tiendas exigen una dirección pública para la privacidad y para borrar la cuenta. Propuesta:
   - dominio propio (está pendiente con la marca) y correo `soporte@` en Arsys;
   - la web en **Cloudflare Pages** (gratis y admite uso comercial). GitHub Pages pide un repositorio público o un plan de pago.
5. **Consentimiento de analítica.** Propuesta: preguntar al final del Onboarding con «Aceptar» y «No, gracias» al mismo nivel, desactivada si no contesta y cambiable en Cuenta. Sentry sin pedir permiso (interés legítimo, sin datos personales), confirmándolo con el abogado.
6. **Supabase de producción y correo.** Propuesta: proyecto nuevo gratuito en la UE (coste 0; ojo, el plan gratuito pausa los proyectos tras una semana sin uso, así que en el lanzamiento conviene el plan Pro, 25 $ al mes) y SMTP de Arsys ya.
7. **Probadores y Premium.** Propuesta: los probadores ven Premium comprando con el dinero de prueba de cada tienda (no se cobra). Así se prueban también los pagos.
8. **Pendientes de la fase 7**, que conviene cerrar antes de las fichas: precios definitivos, Sesión de hoy gratuita, el texto «sin perder nada» y el momento del muro.
9. **Plugin de Expo.** ¿Lo instalas para tener `eas-app-stores`, `eas-workflows` y `eas-observe`? Se instala con `claude plugin install expo@claude-plugins-official`. Si no, sigo la documentación de Expo.
