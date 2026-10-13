#!/usr/bin/env bash
# Suma Shorts nativos nuevos al FINAL del orden de publicación (shorts-orden.txt en la rama "estado" del repo público),
# intercalados por mitología. Nunca reescribe ni reordena lo que ya está; los ids repetidos se ignoran.
# Uso: scripts/estado-agregar-shorts.sh short-aztecas-x short-hindues-y …   (en la nube: ESTADO_REPO = remote del clon)
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -gt 0 ] || { echo "uso: scripts/estado-agregar-shorts.sh <short-id>…" >&2; exit 1; }
REPO=${ESTADO_REPO:-https://github.com/matiasosuna/mitologias-render.git}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
for intento in 1 2 3 4 5 6; do
  rm -rf "$TMP/e"
  git clone -q --depth 1 --branch estado "$REPO" "$TMP/e"
  node scripts/estado.mjs agregar "$TMP/e" "$@"
  git -C "$TMP/e" add shorts-orden.txt
  if git -C "$TMP/e" diff --cached --quiet; then echo "orden: sin cambios"; exit 0; fi
  git -C "$TMP/e" -c user.name="${GIT_AUTHOR_NAME:-matiasosuna}" -c user.email="${GIT_AUTHOR_EMAIL:-62261687+matiasosuna@users.noreply.github.com}" commit -qm "orden: +$# Shorts $(date -u +%Y-%m-%dT%H:%MZ)"
  if git -C "$TMP/e" push -q origin HEAD:estado 2>/dev/null; then echo "orden subido"; exit 0; fi
  echo "orden: push rechazado (intento $intento), reintento"; sleep $((intento * 5))
done
echo "orden: no se pudo subir" >&2; exit 1
