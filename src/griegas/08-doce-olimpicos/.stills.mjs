// Uso: node stills08.mjs <outdir> [frame,frame,...]  (sin frames: 3 por escena)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const root = '/Users/matiasosuna/Projects/mitologias';
const out = process.argv[2];
const tl = JSON.parse(readFileSync(path.join(root, 'src/griegas/08-doce-olimpicos/timeline.json'), 'utf8'));
let frames = [];
if (process.argv[3]) frames = process.argv[3].split(',').map(Number);
else for (const e of tl.escenas) {
  const n = e.frases.length;
  frames.push(e.from + e.frases[1].from + 50, e.from + e.frases[Math.floor(n / 2) + 1].from + 50, e.from + e.durationInFrames - 30);
}
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/griegas/08-doce-olimpicos/entrada.tsx'), publicDir: path.join(root, 'public') });
const composition = await selectComposition({ serveUrl, id: 'griegas-08-doce-olimpicos' });
for (const fr of frames) {
  await renderStill({ serveUrl, composition, frame: fr, output: path.join(out, `f${String(fr).padStart(5, '0')}.png`), scale: 0.5 });
  process.stdout.write(fr + ' ');
}
console.log();
