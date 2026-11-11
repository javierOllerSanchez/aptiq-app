#!/usr/bin/env bash
# Hook Stop: antes de que Claude dé el turno por terminado, comprueba tipos si hay
# cambios en TypeScript sin confirmar. Salida 2 = Claude debe arreglarlo antes de parar.
set -uo pipefail

input="$(cat)"
active="$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(j.stop_hook_active?"1":"")}catch(e){}})' 2>/dev/null)"
[ -n "$active" ] && exit 0

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" || exit 0
[ -f package.json ] && [ -d node_modules ] || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

changed="$(git status --porcelain -- '*.ts' '*.tsx' 2>/dev/null | head -n 1)"
[ -z "$changed" ] && exit 0

if ! res="$(pnpm -s typecheck 2>&1 | tail -n 60)"; then
  printf "La comprobación de tipos falla. Corrígelo antes de terminar:\n%s\n" "$res" >&2
  exit 2
fi
exit 0
