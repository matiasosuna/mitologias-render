#!/bin/zsh
# Copia al repo PÚBLICO matiasosuna/mitologias-render solo lo necesario para renderizar en GitHub Actions
# (gratis e ilimitado en repos públicos). NO incluye muestras de voz (lib/voz-matias-*), pruebas/, ni nada fuera de git.
# Uso: scripts/publicar-render.sh   → después: gh workflow run render-nube -R matiasosuna/mitologias-render -f ids='[...]' -f tipo=vertical
set -e
cd "$(dirname "$0")/.."
DEST=~/Projects/mitologias-render
LISTA=$(mktemp)
git ls-files | grep -vE '^(lib/voz-matias|pruebas/|\.github/workflows/voz\.yml)' > $LISTA
mkdir -p $DEST
rsync -a --exclude .git --files-from=$LISTA ./ $DEST/
cd $DEST
if [ ! -d .git ]; then
  git init -q -b main
  gh repo view matiasosuna/mitologias-render >/dev/null 2>&1 || gh repo create matiasosuna/mitologias-render --public --description "Render en la nube de Myths on Clay" >/dev/null
  git remote add origin https://github.com/matiasosuna/mitologias-render.git
fi
# sacar lo que ya no está en el repo privado
git ls-files | grep -vxFf $LISTA | while read f; do git rm -q --cached "$f"; rm -f "$f"; done
git add -A
git diff --cached --quiet || git commit -qm "Sync desde mitologias ($(date +%Y-%m-%d))"
git push -q -u origin main
rm -f $LISTA
echo "repo público al día: https://github.com/matiasosuna/mitologias-render"
