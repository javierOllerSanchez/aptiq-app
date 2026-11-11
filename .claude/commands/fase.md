---
description: Arranca una fase del plan de Aptiq (carga ficha, requisitos y skills, y propone plan)
argument-hint: <número de fase>
---

Vamos a trabajar en la **fase $ARGUMENTS** de Aptiq.

1. Lee `docs/progreso.md`. Si la fase anterior no está cerrada (`/cerrar-fase`) y aprobada por el propietario, detente y dilo.
2. Lee la ficha de la fase $ARGUMENTS en `docs/plan-fases.md`, los requisitos que cita en `docs/requisitos.md` y las decisiones pendientes en `docs/decisiones.md` que le afecten.
3. Carga las skills que indica la ficha. Las propias de Aptiq (`aptiq-*`) mandan sobre las de terceros. Si alguna de terceros no está instalada, dilo y sigue con criterio propio.
4. Crea la rama `fase-$ARGUMENTS-<nombre-corto>` desde `main`.
5. Escribe un plan de tareas pequeñas y verificables (skill `writing-plans` de Superpowers si está instalada) y guárdalo en `docs/planes/fase-$ARGUMENTS.md`. Cada tarea debe indicar:
   - los requisitos que cubre (IDs);
   - los archivos que toca;
   - cómo se verifica.
6. **Para y pide confirmación del plan** al propietario antes de escribir código. Si hay decisiones que solo él puede tomar (cuentas, datos oficiales, precios), pregúntalas aquí.
7. Tras la confirmación, ejecuta el plan tarea a tarea: pruebas primero en el motor, commits pequeños con mensajes en español y `docs/progreso.md` actualizado al terminar cada tarea.
