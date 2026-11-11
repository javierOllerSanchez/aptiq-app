#!/usr/bin/env bash
# Instala las skills de terceros de Aptiq en .claude/skills del proyecto y anota
# el commit de cada repositorio en docs/skills-lock.md.
# Antes de activar una skill, lee su SKILL.md: es código de terceros.
# Uso: bash scripts/instalar-skills.sh
set -uo pipefail
cd "$(dirname "$0")/.."

LOCK="docs/skills-lock.md"
FALLOS=()

commit_de() { git ls-remote "https://github.com/$1" HEAD 2>/dev/null | cut -f1; }

instalar() { # repo skill propósito
  local repo="$1" skill="$2" para="$3"
  echo "→ $repo · $skill"
  if npx -y skills add "$repo" --skill "$skill" --agent claude-code; then
    printf "| %s | %s | %s | %s | %s |\n" "$skill" "$repo" "$(commit_de "$repo")" "$(date +%F)" "$para" >> "$LOCK"
  else
    FALLOS+=("$repo · $skill")
  fi
}

if ! grep -q "^| Skill |" "$LOCK" 2>/dev/null; then
  cat > "$LOCK" <<'HDR'
# Skills de terceros instaladas

Generado por `scripts/instalar-skills.sh`. Revisar el `SKILL.md` de cada una antes de usarla. Para actualizar una skill, reinstalarla y anotar el nuevo commit.

| Skill | Repositorio | Commit | Fecha | Para qué |
| --- | --- | --- | --- | --- |
HDR
fi

# Emil Kowalski · movimiento
instalar emilkowalski/skills emil-design-eng           "Criterio de cuándo y cómo animar"
instalar emilkowalski/skills animate-expo              "Animaciones en Expo/React Native (Reanimated, gestos, vibración)"
instalar emilkowalski/skills review-animations         "Revisión de cambios de movimiento"
instalar emilkowalski/skills find-animation-opportunities "Detectar dónde falta movimiento útil"

# Interfaz
instalar nextlevelbuilder/ui-ux-pro-max-skill ui-ux-pro-max "Guías UX y accesibilidad (stack React Native). Ignorar sus paletas y fuentes"
instalar pbakaus/impeccable impeccable                 "Crítica, auditoría y pulido de pantallas (verificar comandos incluidos)"
instalar Leonxlnx/taste-skill design-taste-frontend    "Solo web de lanzamiento (fase 9)"

# Datos
instalar supabase/agent-skills supabase-postgres-best-practices "Esquema, índices y RLS en Supabase"

echo
if [ ${#FALLOS[@]} -gt 0 ]; then
  echo "No se pudieron instalar (revisar nombre de la skill con 'npx skills add <repo> --list' o la documentación del repositorio):"
  printf '  - %s\n' "${FALLOS[@]}"
fi
echo "Plugins (instalar aparte, ver docs/skills-terceros.md): Expo, Superpowers, Ponytail."
