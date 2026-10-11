import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'fs'; import path from 'path';
const root = '/Users/matiasosuna/Projects/mitologias';
const out = process.argv[2]; const frames = process.argv.slice(3).map(Number);
const serveUrl = await bundle({ entryPoint: root + '/src/griegas/09-nacimiento-atenea/entrada.tsx', publicDir: root + '/public', rootDir: root });
const comp = await selectComposition({ serveUrl, id: 'griegas-09-nacimiento-atenea' });
for (const fr of frames) {
  await renderStill({ serveUrl, composition: comp, frame: fr, output: path.join(out, `f${fr}.png`), scale: 0.5 });
  console.log('ok', fr);
}
fs.rmSync(serveUrl, { recursive: true, force: true });
