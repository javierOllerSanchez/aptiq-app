# Skills y plugins de terceros

**Regla:** las skills propias (`.claude/skills/aptiq-*`) y `docs/guia-estilos.md` mandan sobre cualquier skill de terceros. De las de terceros se toma criterio, nunca paletas, tipografías ni estilos.

**Seguridad:** son código de terceros y algunas ejecutan scripts. Antes de usar una, leer su `SKILL.md` (y sus scripts, si los trae). Anotar repositorio y commit en `docs/skills-lock.md`.

## Skills de proyecto (en `.claude/skills/`)

Se instalan con `bash scripts/instalar-skills.sh`.

| Skill | Repositorio | Fases | Uso en Aptiq | Ojo |
| --- | --- | --- | --- | --- |
| `emil-design-eng` | emilkowalski/skills | 1, 4, 6 | Cuándo y cómo animar | Pensada para web: usar como criterio |
| `animate-expo` | emilkowalski/skills | 1, 4, 6 | Animaciones con Reanimated, gestos y vibración | La única de Emil específica para React Native |
| `review-animations` | emilkowalski/skills | 1, 4, 6 | Revisar cada cambio de movimiento | — |
| `find-animation-opportunities` | emilkowalski/skills | 4, 6 | Detectar dónde falta movimiento útil | Proponer, no añadir sin criterio |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 1, 4, 6, 8 | Guías UX y accesibilidad (stack React Native) | Ignorar sus paletas y fuentes |
| `impeccable` | pbakaus/impeccable | 1, 4, 9 | Comandos `critique`, `audit`, `polish`, `typeset`, `clarify` | No confirmado que cubra React Native; usar sus criterios. Verificar el nombre de la skill al instalar |
| `design-taste-frontend` | Leonxlnx/taste-skill | 9 | Web de lanzamiento | Excluye apps nativas: no usar en la app |
| `supabase-postgres-best-practices` | supabase/agent-skills | 5, 8 | Esquema, índices y RLS | — |

## Plugins (alcance de usuario)

Se instalan con la CLI de Claude Code (`claude plugin …`) o desde una sesión con `/plugin …`. Si Claude Code no puede ejecutarlos, se los pide al propietario.

| Plugin | Instalación | Para qué |
| --- | --- | --- |
| Expo (oficial) | `claude plugin install expo@claude-plugins-official` | Skills `expo-*` y `eas-*` (router, sistema de diseño, animación, datos, tiendas, CI) e incluye el MCP de Expo |
| Superpowers | `claude plugin marketplace add obra/superpowers-marketplace` y `claude plugin install superpowers@superpowers-marketplace` (según su README; comprobar) | Brainstorming, planes, TDD, depuración sistemática, verificación antes de terminar, revisión de código |
| Ponytail | `claude plugin marketplace add DietrichGebert/ponytail` y `claude plugin install ponytail@ponytail` | Código mínimo: `/ponytail-review` en cada PR, `/ponytail-audit` al cerrar fase. Requiere Node en el PATH |

**Límite de Ponytail:** decide cuánto código hace falta, nunca qué se quita del producto. No puede eliminar pruebas, accesibilidad, validaciones ni comportamiento definido en la guía o los requisitos.

## Ya disponibles en Claude (no hay que instalarlas)

`design:accessibility-review`, `design:ux-copy`, `design:design-critique` y `skill-creator`, si la cuenta las tiene activas. Si no aparecen, se aplican sus criterios a mano: WCAG 2.1 AA y el tono de la guía.

## Conectores MCP

- **Expo:** viene con el plugin. Builds, simuladores en la nube y documentación.
- **Supabase:** se añade en la fase 5 con el proyecto del propietario. Migraciones y avisos de seguridad.
