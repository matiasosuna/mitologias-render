#!/usr/bin/env bash
# Trae la rama "estado" del repo público a los archivos de acá (registros fusionados; el orden de los Shorts queda en
# out/shorts-orden.txt). Lo usan la Mac (para volver a publicar desde acá) y el workflow "publicar".
# Uso: scripts/estado-traer.sh
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=https://github.com/matiasosuna/mitologias-render.git
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
git clone -q --depth 1 --branch estado "$REPO" "$TMP/e"
node scripts/estado.mjs traer "$TMP/e"
echo "estado traído: $(ls "$TMP/e" | grep -v '^\.' | tr '\n' ' ')"
