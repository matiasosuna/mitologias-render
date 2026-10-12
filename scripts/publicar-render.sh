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
# indice.ts se regenera al narrar y puede nombrar episodios todavía sin commitear: rehacerlo con lo que sí se copió
node -e "
const { readdirSync, existsSync, writeFileSync } = require('fs');
const ids = readdirSync('src/videos').filter((d) => existsSync('src/videos/' + d + '/timeline.json') && existsSync('src/videos/' + d + '/guion.json')).sort();
writeFileSync('src/motor/indice.ts', '// Generado por scripts/motor-narrar.mjs — no editar a mano.\n' + ids.map((d, i) => \"import g\" + i + \" from '../videos/\" + d + \"/guion.json';\nimport t\" + i + \" from '../videos/\" + d + \"/timeline.json';\").join('\n') + '\n\nexport const VIDEOS: { guion: unknown; timeline: unknown }[] = [' + ids.map((_, i) => '{ guion: g' + i + ', timeline: t' + i + ' }').join(', ') + '];\n');
"
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
