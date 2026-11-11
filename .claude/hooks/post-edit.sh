#!/usr/bin/env bash
# Hook PostToolUse (Edit/Write): revisa el archivo recién editado.
# Salida 2 = Claude recibe el error por stderr y debe corregirlo.
# No hace nada hasta que el monorepo exista (fase 0) y tenga dependencias instaladas.
set -uo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const t=j.tool_input||{};process.stdout.write(t.file_path||t.path||"")}catch(e){}})' 2>/dev/null)"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" || exit 0

[ -z "$file" ] && exit 0
[ -f package.json ] && [ -d node_modules ] || exit 0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs) ;;
  *) exit 0 ;;
esac
rel="${file#"$root"/}"
[ -f "$rel" ] || exit 0

out=""
if ! res="$(pnpm exec eslint --no-warn-ignored "$rel" 2>&1 | tail -n 40)"; then
  out+="ESLint en ${rel}:\n${res}\n\n"
fi

case "$rel" in
  packages/engine/*)
    if ! res="$(pnpm --filter @aptiq/engine exec vitest related --run "$root/$rel" 2>&1 | tail -n 40)"; then
      out+="Pruebas del motor relacionadas con ${rel}:\n${res}\n"
    fi
    ;;
esac

if [ -n "$out" ]; then
  printf "%b" "$out" >&2
  exit 2
fi
exit 0
