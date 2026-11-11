# Aptiq · Kit de arranque para Claude Code

Este kit contiene todo lo que Claude Code necesita para construir Aptiq por fases: instrucciones del proyecto, requisitos, plan, guía de estilos con prototipos, logotipos y un harness ya montado.

## Cómo empezar

1. **Requisitos en tu ordenador:**
   - Node.js 20 o superior, pnpm y git.
   - Claude Code.
   - Para ver la app: la app **Expo Go** en tu móvil o un simulador (Xcode en Mac / Android Studio).
2. **Crea una carpeta** para el proyecto (por ejemplo `~/Proyectos/aptiq`) y copia dentro **todo el contenido** de este kit, incluida la carpeta oculta `.claude`.
3. **Abre Claude Code** en esa carpeta.
4. **Copia el prompt** de `PROMPT-INICIO.md` y pégalo. Claude:
   - comprobará el harness y tu entorno;
   - instalará las skills de terceros;
   - te propondrá el plan de la fase 0 y esperará tu confirmación.
5. **Repite el ciclo** en cada fase: `/fase N` para empezar y `/cerrar-fase N` para terminar.

## Qué hay dentro

```
CLAUDE.md                  Instrucciones permanentes del proyecto para Claude Code
PROMPT-INICIO.md           Prompt para la primera sesión
docs/
  requisitos.md            Requisitos con ID, no funcionales, monetización y riesgos
  plan-fases.md            Las 10 fases con tareas y criterios de aceptación
  guia-estilos.md          Sistema visual completo
  prototipos/index.html    Prototipos de interfaz (ábrelo en el navegador)
  tokens.json              Valores de diseño
  marca/                   Logotipo e icono en SVG
  skills-terceros.md       Skills y plugins externos y cómo instalarlos
  progreso.md              Estado de las fases
  decisiones.md            Decisiones tomadas y pendientes
.claude/
  settings.json            Permisos y hooks
  hooks/                   Comprobaciones automáticas tras cada edición y al terminar
  skills/                  aptiq-design-system, aptiq-generator, aptiq-exam-profile
  agents/                  revisor-contenido, revisor-interfaz, verificador-fase
  commands/                /fase y /cerrar-fase
scripts/
  instalar-skills.sh       Instala las skills de terceros y anota su versión
```

## Lo que tendrás que hacer tú

Claude te avisará en cada momento, pero hay cosas que solo puedes hacer tú:

- **Crear cuentas:** Expo/EAS, Apple Developer, Google Play Console, Supabase (región UE), RevenueCat, PostHog y Sentry.
- **Confirmar el plan** de cada fase y **aprobar** su cierre.
- **Revisar** el perfil de examen de Guardia Civil contra las bases oficiales.
- **Probar en tu móvil** lo que Claude no puede comprobar desde el ordenador.

Las decisiones pendientes están en `docs/decisiones.md`.
