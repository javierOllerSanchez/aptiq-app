---
description: Cierra una fase de Aptiq con verificación independiente y revisiones antes del pull request
argument-hint: <número de fase>
---

Cierre de la **fase $ARGUMENTS**. No declares nada como terminado sin evidencia (skill `verification-before-completion` de Superpowers si está instalada).

1. Ejecuta `pnpm typecheck && pnpm lint && pnpm test`. Si la fase toca el motor, ejecuta también `pnpm test:stress`. Arregla lo que falle antes de seguir.
2. Lanza los subagentes que correspondan, en paralelo cuando se pueda:
   - `revisor-contenido` si la fase toca `packages/engine` o perfiles de examen;
   - `revisor-interfaz` si la fase toca pantallas o componentes;
   - `verificador-fase` siempre, con el número de fase.
3. Si Ponytail está instalado, ejecuta `/ponytail-review` sobre el diff de la rama. Aplica solo las simplificaciones que no quiten pruebas, accesibilidad, validaciones ni comportamiento definido en la guía o los requisitos. Las dudosas, anótalas.
4. Corrige todos los hallazgos **BLOQUEANTE** y vuelve a pasar el revisor que los encontró. Los **IMPORTANTE** se corrigen o se anotan en `docs/progreso.md` con su motivo.
5. Actualiza:
   - `docs/progreso.md`: estado, fecha, qué se entregó, qué queda pendiente y qué tiene que comprobar el propietario en un dispositivo real;
   - `docs/decisiones.md`, si se tomó alguna decisión.
6. Haz commit y abre un pull request hacia `main` con:
   - resumen de la fase;
   - requisitos cubiertos;
   - resultado de cada revisor;
   - pasos de prueba para el propietario.
7. Termina con un mensaje corto al propietario: qué está listo, qué tiene que probar él y la siguiente fase. **No empieces la siguiente fase sin su aprobación.**
