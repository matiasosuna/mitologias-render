// Renderiza un video del guion visual por tramos (portada, cada escena, cierre) con caché:
// solo se vuelven a renderizar los tramos que cambiaron. Después une los tramos y arma
// una pista de audio por idioma, el .mp4 con todas las pistas y los .srt para YouTube.
// Uso: node scripts/motor-render.mjs griegas-02-prometeo [--imagen=en] [--audio=en,es,pt] [--solo-video]
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import os from 'node:os';
import { srt } from '../lib/motor-tiempos.mjs';

const id = process.argv[2];
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `=${d}`).split('=')[1];
const IMAGEN = arg('imagen', 'en'), AUDIOS = arg('audio', 'en').split(',');
const dir = join('src/videos', id), out = join('out', id), cache = join('out/.tramos', id);
mkdirSync(out, { recursive: true }); mkdirSync(cache, { recursive: true });
const g = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
const tl = JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8'));
// Título del próximo episodio para la pantalla final (de youtube.json si el guion no lo trae)
if (!g.siguiente && existsSync(join(dir, 'youtube.json'))) { const s = JSON.parse(readFileSync(join(dir, 'youtube.json'), 'utf8')).siguiente; if (s) g.siguiente = { es: s, en: s }; }

// Huella del código del motor: si cambia, se re-renderiza todo
const fuentes = ['src/motor', 'src/comun'].flatMap((d) => readdirSync(d).filter((f) => /\.tsx?$/.test(f) && f !== 'indice.ts').map((f) => join(d, f)));
const huellaMotor = createHash('sha1').update(fuentes.map((f) => readFileSync(f)).join('')).digest('hex');

const tramos = [
  { nombre: '00-portada', desde: 0, hasta: tl.introFrames - 1, datos: [g.numero, g.tituloGriego] },
  ...tl.escenas.map((e, i) => ({ nombre: `${String(i + 1).padStart(2, '0')}-${e.id}`, desde: e.from, hasta: e.from + e.durationInFrames - 1, datos: [g.escenas[i], e.durationInFrames, e.frases.map((f) => [f.from, f.dur])] })),
  { nombre: '99-cierre', desde: tl.total - tl.outroFrames, hasta: tl.total - 1, datos: ['cierre'] },
].map((t) => ({ ...t, archivo: join(cache, `${t.nombre}-${createHash('sha1').update(huellaMotor + IMAGEN + JSON.stringify(t.datos)).digest('hex').slice(0, 10)}.mp4`) }));

const faltan = tramos.filter((t) => !existsSync(t.archivo));
console.log(`${id}: ${tramos.length - faltan.length}/${tramos.length} tramos en caché`);
if (faltan.length) {
  const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  process.on('exit', () => rmSync(serveUrl, { recursive: true, force: true })); // los bundles pesan ~600 MB
  const comp = await selectComposition({ serveUrl, id, inputProps: { guion: g, timeline: tl, idioma: null, imagen: IMAGEN } });
  for (const t of faltan) {
    const t0 = Date.now();
    await renderMedia({ serveUrl, composition: comp, codec: 'h264', outputLocation: t.archivo, frameRange: [t.desde, t.hasta], muted: true, crf: 20, timeoutInMilliseconds: 180000, concurrency: Math.max(2, os.cpus().length - 2), inputProps: { guion: g, timeline: tl, idioma: null, imagen: IMAGEN } });
    console.log(`  ${t.nombre}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
}

// Unir tramos (sin recodificar)
const lista = join(cache, 'lista.txt');
writeFileSync(lista, tramos.map((t) => `file '${resolve(t.archivo)}'`).join('\n'));
const video = join(out, `${id}.video-${IMAGEN}.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', video]);
if (process.argv.includes('--solo-video')) process.exit(0);

// Pista de audio por idioma: frases en su lugar + música de fondo
const idiomas = [...new Set(tl.escenas.flatMap((e) => e.frases.flatMap((f) => Object.keys(f.audio))))].filter((l) => AUDIOS.includes(l));
const segTotal = tl.total / tl.fps;
const pistas = idiomas.map((l) => {
  const frases = tl.escenas.flatMap((e) => e.frases.filter((f) => f.audio[l]).map((f) => ({ ruta: join('public', f.audio[l]), ms: Math.round(((e.from + f.from) / tl.fps) * 1000) })));
  const args = ['-y', '-loglevel', 'error', '-i', `public/musica/${g.serie === 'nordicas' ? 'nordica' : g.serie === 'egipcias' ? 'egipcia' : g.serie === 'hawaianas' ? 'hawaiana' : g.serie === 'norteamericanas' ? 'norteamericana' : 'lira-griega'}.wav`, ...frases.flatMap((f) => ['-i', f.ruta])];
  const filtro = [`[0:a]atrim=0:${segTotal},volume=0.2,afade=t=out:st=${segTotal - 3}:d=3[m]`, ...frases.map((f, i) => `[${i + 1}:a]adelay=${f.ms}|${f.ms}[v${i}]`), `[m]${frases.map((_, i) => `[v${i}]`).join('')}amix=inputs=${frases.length + 1}:normalize=0[a]`].join(';');
  const m4a = join(out, `${id}.${l}.m4a`);
  execFileSync('ffmpeg', [...args, '-filter_complex', filtro, '-map', '[a]', '-c:a', 'aac', '-b:a', '160k', m4a]);
  writeFileSync(join(out, `${id}.${l}.srt`), srt(tl, l));
  return { l, m4a };
});

// Subtítulos .srt de todos los idiomas que tenga el texto (aunque no haya audio en ese idioma)
for (const l of ['en', 'es', 'pt']) if (tl.escenas.some((e) => e.frases.some((f) => f.texto?.[l]))) writeFileSync(join(out, `${id}.${l}.srt`), srt(tl, l));

// Un .mp4 por idioma (fácil de compartir) y uno con todas las pistas
const ISO = { es: 'spa', pt: 'por', en: 'eng' };
for (const p of pistas) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', p.m4a, '-c', 'copy', '-map', '0:v', '-map', '1:a', '-metadata:s:a:0', `language=${ISO[p.l]}`, join(out, `${id}.${p.l}.mp4`)]);
if (pistas.length > 1) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, ...pistas.flatMap((p) => ['-i', p.m4a]), '-c', 'copy', '-map', '0:v', ...pistas.flatMap((_, i) => ['-map', `${i + 1}:a`]), ...pistas.flatMap((p, i) => [`-metadata:s:a:${i}`, `language=${ISO[p.l]}`]), join(out, `${id}.multi.mp4`)]);
console.log(`listo: out/${id}/ (${idiomas.join(', ')}) · ${(statSync(video).size / 1e6).toFixed(0)} MB de video`);
