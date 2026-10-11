#!/bin/zsh
# Re-renderiza videos ya hechos (p. ej. tras arreglar la plantilla), cuando no haya otro render del mismo video.
cd ~/Projects/mitologias
for v in "$@"; do
  while pgrep -f "render src/griegas/$v/" >/dev/null; do sleep 20; done
  id="griegas-$v"
  npx remotion render "src/griegas/$v/entrada.tsx" "$id" "out/.tmp-$id.mp4" --concurrency=2 --crf=20 --log=error && mv "out/.tmp-$id.mp4" "out/$id.mp4" && echo "listo $id"
done
