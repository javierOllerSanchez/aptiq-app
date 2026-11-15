# Fase 6 · Progreso y adaptativo · Plan

**Rama:** `fase-6-progreso`
**Requisitos:** ENT-02, ENT-03, PRO-01, PRO-03, REP-01, NOT-01.
**Criterio de aceptación (`docs/plan-fases.md`):** con historiales simulados, la Sesión de hoy prioriza el tipo más flojo y la dificultad sube y baja como se espera.
**Skills:** la ficha no nombra ninguna. Uso `aptiq-generator` (reglas del motor: determinismo, pruebas primero, sin `Math.random` ni `Date.now`), `aptiq-design-system` (pantallas) y `supabase-postgres-best-practices` si cambia el esquema.

## Punto de partida

- Ya existe:
  - el test de nivel (`estimateLevels`), que da un nivel por tipo y se guarda en el ajuste `niveles`;
  - el reparto prioritario por fallos (`buildPractice`, `failuresByType`), que usa la fila «Todas las aptitudes»;
  - el acierto acumulado por aptitud en Inicio.
- No existe:
  - la dificultad que cambie con las respuestas;
  - la repetición espaciada;
  - la racha y la cuenta atrás;
  - la evolución del nivel;
  - los recordatorios.

## Reglas

- Toda la lógica nueva va en `packages/engine`: es TypeScript puro y determinista, y recibe «ahora» como parámetro. Pruebas primero, con Vitest y fast-check (NFR-07).
- No se guarda ningún dato nuevo en el servidor. Todo se calcula a partir del historial que ya se sincroniza: sesiones, simulacros y ajustes. Así la fase no toca el esquema de Supabase.
- Las pantallas nuevas pasan antes por un prototipo que el propietario aprueba (como en la fase 5).

## Tareas

### T1 · Nivel adaptativo por tipo (ENT-03, PRO-01)
- **Archivos:** `packages/engine/src/level/adapt.ts` y su prueba.
- **Qué hace:**
  - parte del nivel del test de nivel;
  - recorre las respuestas de ese tipo en orden;
  - sube un nivel si aciertas al menos 8 de las últimas 10 de ese nivel;
  - baja uno si aciertas 4 o menos;
  - no pasa de 1 a 5.
  - Las preguntas en blanco cuentan como no acertadas.
  - Sin respuestas, se queda en el nivel del test.
- **Verificación:**
  - pruebas con historiales simulados: sube con aciertos, baja con fallos, no oscila con un 60 %, respeta los límites;
  - propiedad con fast-check: el nivel siempre está entre 1 y 5 y nunca salta más de un nivel por bloque de 10.

### T2 · Repetición espaciada de tipos fallados (REP-01)
- **Archivos:** `packages/engine/src/review/spaced.ts` y su prueba.
- **Qué hace:**
  - un tipo con fallos recientes entra en repaso;
  - vuelve a tocar 1, 3, 7 y 14 días después;
  - cada día de repaso bien hecho (al menos 70 % de acierto en ese tipo) lo pasa al siguiente intervalo;
  - un fallo lo devuelve a 1 día.
  - Devuelve los tipos que «tocan hoy».
- **Verificación:** pruebas con fechas fijas que comprueban qué tipos tocan cada día y el cambio de intervalo, también con un cambio de huso horario. Se usa la fecha local del móvil.

### T3 · Sesión de hoy (ENT-02)
- **Archivos:** `packages/engine/src/session/today.ts` y su prueba; `apps/mobile/src/practice/run.ts`.
- **Qué hace:** una sesión de 12 preguntas:
  - la mitad de los tipos que tocan repaso (T2);
  - el resto según el reparto prioritario que ya existe (más preguntas del tipo con más fallos);
  - cada pregunta al nivel adaptativo de su tipo (T1).
  - La sesión es la misma durante todo el día: la semilla sale de la fecha. Al terminarla, Inicio la marca como hecha.
- **Verificación:**
  - criterio de aceptación: con un historial simulado donde un tipo falla mucho, la sesión le da más preguntas que a ningún otro;
  - las preguntas salen al nivel esperado;
  - con la misma fecha, la sesión es la misma.

### T4 · Racha y cuenta atrás (PRO-03)
- **Archivos:** `packages/engine/src/progress/streak.ts` y su prueba; `apps/mobile/src/screens/inicio.tsx`.
- **Qué hace:**
  - **Racha:** días seguidos, hasta hoy o ayer, con al menos una sesión o simulacro terminado.
  - **Cuenta atrás:** días hasta la fecha del examen que se guardó en el onboarding. Si no hay fecha, no se muestra; no se inventa.
  - Las dos se ven en Inicio, como en el prototipo («Racha · 6 días»).
- **Verificación:** pruebas con fechas: días seguidos, un hueco que rompe la racha, varias sesiones el mismo día y la medianoche local.

### T5 · Evolución del nivel (PRO-01)
- **Archivos:**
  - `packages/engine/src/progress/history.ts` (nivel por aptitud y global, semana a semana);
  - prototipo `docs/prototipos/progreso.html`;
  - la pantalla.
- **Qué hace:** nivel actual por aptitud y global, y un gráfico sencillo de su evolución semanal, con `react-native-svg`, que ya está en el stack.
- **Dónde va:** propongo una sección «Tu nivel» al principio de **Historial**, para no añadir una cuarta pestaña. Necesita prototipo aprobado antes de programarla.
- **Verificación:**
  - pruebas del cálculo semanal;
  - pruebas de componente;
  - el gráfico tiene que poder leerse con VoiceOver y TalkBack, con un resumen en texto;
  - `revisor-interfaz`.

### T6 · Recordatorio diario (NOT-01)
- **Archivos:**
  - `apps/mobile/src/notifications/*`;
  - una fila «Recordatorio diario» con la hora en **Cuenta**, disponible también sin sesión;
  - prototipo.
- **Qué hace:**
  - notificación **local**, sin servidor ni cuenta, a la hora que elija el usuario;
  - desactivada por defecto;
  - el permiso del sistema se pide solo al activarla;
  - si ese día ya se ha hecho la Sesión de hoy, no avisa.
- **Dependencia nueva:** `expo-notifications`, del SDK de Expo. Se anota en `docs/decisiones.md`.
- **Verificación:** pruebas de la lógica de programación con el módulo simulado. Que llegue la notificación solo se puede comprobar a mano en un dispositivo.

### T7 · Inicio con todo junto
- **Archivos:** `apps/mobile/src/screens/inicio.tsx`.
- **Qué hace:**
  - el nivel estimado pasa a ser el adaptativo;
  - aparece el botón «Empezar la sesión de hoy», que la sesión ya está hecha o cuántas quedan de repaso;
  - aparece la racha.
  - Inicio ya tiene prototipo: se compara con él.
- **Verificación:** pruebas de componente y capturas en el emulador.

### T8 · Cierre
- `revisor-interfaz`, `verificador-fase` y Ponytail.
- Actualizar `docs/progreso.md` y `docs/decisiones.md`.
- `/cerrar-fase 6`.
- No toca generadores, así que no hace falta `revisor-contenido`.

## Criterio de aceptación

| Criterio | Cómo se comprueba | Quién |
| --- | --- | --- |
| La Sesión de hoy prioriza el tipo más flojo | Prueba con historial simulado (T3) | Claude |
| La dificultad sube y baja como se espera | Pruebas de T1 con historiales simulados | Claude |

## Decisiones del propietario (antes de empezar)

1. **Reglas de dificultad (T1):** subir con 8 de 10 y bajar con 4 o menos de 10. ¿Te valen estos umbrales?
2. **Intervalos de repaso (T2):** 1, 3, 7 y 14 días. ¿Te valen?
3. **Dónde va la evolución del nivel (T5):** ¿sección «Tu nivel» dentro de Historial (propuesta) o una pestaña nueva «Progreso»?
4. **Recordatorio (T6):** ¿dentro de Cuenta (propuesta) y desactivado por defecto? Supone una dependencia nueva, `expo-notifications`.

## Lo que no sé todavía

- Si la Sesión de hoy debe tener 12 preguntas o otro número. Lo dejo en 12, como la práctica actual, salvo que digas otra cosa.
- Cómo se comportan las notificaciones locales con el ahorro de batería de cada fabricante Android. Se comprueba a mano en un dispositivo.

**Estado del plan:** confirmado por el propietario el 2026-11-15, con las cuatro propuestas tal cual (8/10 y 4/10; 1, 3, 7 y 14 días; «Tu nivel» en Historial; recordatorio en Cuenta, desactivado, con `expo-notifications`) y 12 preguntas en la Sesión de hoy.
