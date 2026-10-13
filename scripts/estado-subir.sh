#!/usr/bin/env bash
# Sube los registros y el orden de las colas a la rama "estado" del repo público (la crea si no existe), fusionando con
# lo que ya haya. Lo usan la Mac y el workflow "publicar". Sin claves ni tokens.
# Uso: scripts/estado-subir.sh [lista-de-shorts.txt]   (por defecto out/shorts-orden.txt)
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=${ESTADO_REPO:-https://github.com/matiasosuna/mitologias-render.git}  # en la nube: ESTADO_REPO = remote del clon (pasa por el proxy con permiso)
LISTA=${1:-out/shorts-orden.txt}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
for intento in 1 2 3 4 5 6; do
  rm -rf "$TMP/e"
  if git ls-remote --exit-code --heads "$REPO" estado >/dev/null 2>&1; then
    git clone -q --depth 1 --branch estado "$REPO" "$TMP/e"
  else
    git init -q -b estado "$TMP/e" && git -C "$TMP/e" remote add origin "$REPO"
  fi
  node scripts/estado.mjs subir "$TMP/e" "$LISTA"
  git -C "$TMP/e" add -A
  if git -C "$TMP/e" diff --cached --quiet; then echo "estado: sin cambios"; exit 0; fi
  git -C "$TMP/e" commit -qm "estado $(date -u +%Y-%m-%dT%H:%MZ)"
  if git -C "$TMP/e" push -q origin estado 2>/dev/null; then echo "estado subido"; exit 0; fi
  echo "estado: push rechazado (intento $intento), reintento"; sleep $((intento * 5))
done
echo "estado: no se pudo subir" >&2; exit 1
