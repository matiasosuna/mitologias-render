// Cartel gancho (~2 s) al principio de los episodios largos de YouTube, SIN re-renderizar el episodio:
// se renderiza solo el cartel (composición "gancho-horizontal", 1920×1080, mismos fps) y se pega adelante del mp4 ya
// hecho con ffmpeg (video sin recodificar; cada pista de audio con un golpe de música de 2 s adelante), justo antes de
// subir (scripts/subir.mjs, que usan la Mac y nube.mjs). Los .srt y los capítulos de la descripción se corren lo mismo.
// La pantalla final de YouTube (últimos 12 s) no cambia: el cartel va al principio.
// Uso suelto: node scripts/gancho-horizontal.mjs <id>   → out/<id>/con-gancho/<id>.en.mp4 (+ .en.srt/.es.srt)
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { parteCuriosa, lineaTemporada, leerTitulos } from './titulos.mjs';

export const SEG_GANCHO = 2;
export const MUSICA = { griegas: 'lira-griega', nordicas: 'nordica', egipcias: 'egipcia', hawaianas: 'hawaiana', norteamericanas: 'norteamericana', aztecas: 'azteca', balinesas: 'balinesa', hindues: 'hindu', maories: 'maori' };

/** Textos del cartel: { gancho: título curioso, linea: "Norse Mythology · Season 1, Episode 13" } (null si no hay título). */
export function textosGancho(id, serie, titulos = leerTitulos()) {
  const e = titulos[id], gancho = parteCuriosa(e?.titulo);
  return gancho ? { gancho, linea: lineaTemporada(e, serie) } : null;
}

const ms2ts = (ms) => `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
/** Corre todos los tiempos de un .srt `ms` milisegundos. */
export const desplazarSrt = (texto, ms) => texto.replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, (_, h, m, s, x) => ms2ts(((Number(h) * 60 + Number(m)) * 60 + Number(s)) * 1000 + Number(x) + ms));

/** Corre `seg` segundos los capítulos "m:ss Título" de la descripción, salvo el 0:00 (YouTube lo exige en 0:00). */
export const desplazarCapitulos = (desc, seg) => desc.replace(/^(\d+):(\d{2}) /gm, (t, m, s) => {
  const total = Number(m) * 60 + Number(s);
  if (!total) return t;
  const n = total + seg;
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')} `;
});

/** Pregunta al público para la descripción: la del guion (`pregunta`) o una corta según la serie. */
const PREGUNTAS = {
  griegas: 'Which Greek god would you trust? Tell us in the comments 👇',
  nordicas: 'Which Norse god would you want on your side? Tell us in the comments 👇',
  egipcias: 'Which Egyptian god would you trust? Tell us in the comments 👇',
  hawaianas: 'Which moment of this story surprised you most? Tell us in the comments 👇',
  norteamericanas: 'Which moment of this story stayed with you? Tell us in the comments 👇',
  aztecas: 'Which Aztec god would you trust? Tell us in the comments 👇',
  balinesas: 'Which moment of this story stayed with you? Tell us in the comments 👇',
  hindues: 'Which moment of this story stayed with you? Tell us in the comments 👇',
  maories: 'Which moment of this story stayed with you? Tell us in the comments 👇',
};
export const preguntaDe = (g) => (typeof g.pregunta === 'string' ? g.pregunta : g.pregunta?.en) || PREGUNTAS[g.serie ?? 'griegas'] || PREGUNTAS.griegas;
/** Pone la pregunta justo después del resumen (antes de "Chapters"); si no hay capítulos, al final del primer párrafo. */
export function conPregunta(desc, pregunta) {
  if (!pregunta || desc.includes(pregunta)) return desc;
  const i = desc.search(/^(📜 )?Chapters/m);
  if (i >= 0) return `${desc.slice(0, i)}${pregunta}\n\n${desc.slice(i)}`;
  const j = desc.indexOf('\n\n');
  return j >= 0 ? `${desc.slice(0, j)}\n\n${pregunta}${desc.slice(j)}` : `${desc}\n\n${pregunta}`;
}

/** Comandos de ffmpeg (listas de argumentos) para pegar el cartel adelante del episodio.
 *  pistas = [{ idioma: 'eng' }, …] en el orden de las pistas de audio del original. */
export function comandosUnir({ cartel, original, salida, musica, seg = SEG_GANCHO, pistas, sampleRate = 44100, lista, soloVideo }) {
  const fmt = `aformat=sample_rates=${sampleRate}:channel_layouts=stereo`;
  const n = pistas.length;
  const filtro = n ? [
    `[2:a]atrim=0:${seg},asetpts=PTS-STARTPTS,volume=0.2,afade=t=in:d=0.3,afade=t=out:st=${Math.max(0, seg - 0.5)}:d=0.5,${fmt}${n > 1 ? `,asplit=${n}` : ''}${pistas.map((_, i) => `[s${i}]`).join('')}`,
    ...pistas.map((_, i) => `[1:a:${i}]${fmt}[o${i}];[s${i}][o${i}]concat=n=2:v=0:a=1[a${i}]`),
  ].join(';') : null;
  return [
    // 1) solo el video del original (sin recodificar) y 2) cartel + video, por concat (mismo códec y fps)
    ['-y', '-loglevel', 'error', '-i', original, '-map', '0:v:0', '-c', 'copy', soloVideo],
    ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', `${soloVideo}.unido.mp4`],
    // 3) video unido + cada pista de audio con 2 s de música adelante
    ['-y', '-loglevel', 'error', '-i', `${soloVideo}.unido.mp4`, '-i', original, '-i', musica,
      ...(filtro ? ['-filter_complex', filtro] : []),
      '-map', '0:v', ...pistas.flatMap((_, i) => ['-map', `[a${i}]`]),
      '-c:v', 'copy', ...(n ? ['-c:a', 'aac', '-b:a', '160k'] : []),
      ...pistas.flatMap((p, i) => (p.idioma ? [`-metadata:s:a:${i}`, `language=${p.idioma}`] : [])),
      '-movflags', '+faststart', salida],
  ];
}

const sondear = (f) => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,r_frame_rate,width,height,sample_rate:stream_tags=language', '-show_entries', 'format=duration', '-of', 'json', f], { encoding: 'utf8' }));

/** Renderiza el cartel (solo video) con los fps del original. */
async function renderCartel({ serie, gancho, linea, fps, salida }) {
  const { bundle } = await import('@remotion/bundler');
  const { renderMedia, selectComposition } = await import('@remotion/renderer');
  const serveUrl = await bundle({ entryPoint: resolve('src/motor/entrada.tsx') });
  try {
    const inputProps = { serie, gancho, linea, fps };
    const comp = await selectComposition({ serveUrl, id: 'gancho-horizontal', inputProps });
    await renderMedia({ serveUrl, composition: comp, codec: 'h264', crf: 20, muted: true, outputLocation: salida, inputProps, timeoutInMilliseconds: 180000 });
  } finally { rmSync(serveUrl, { recursive: true, force: true }); }
}

/** Arma out/<id>/con-gancho/ (video + .srt corridos). Devuelve { archivo, srt: { en, es }, seg } o null si no se pudo. */
export async function conGancho(id, { original = join('out', id, `${id}.en.mp4`) } = {}) {
  const g = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const textos = textosGancho(id, g.serie);
  if (!textos || !existsSync(original)) return null;
  const dir = join('out', id, 'con-gancho'); mkdirSync(dir, { recursive: true });
  const salida = join(dir, `${id}.en.mp4`);
  const srt = {};
  for (const l of ['en', 'es']) { const f = join('out', id, `${id}.${l}.srt`); if (existsSync(f)) { srt[l] = join(dir, `${id}.${l}.srt`); writeFileSync(srt[l], desplazarSrt(readFileSync(f, 'utf8'), SEG_GANCHO * 1000)); } }
  if (existsSync(salida) && statSync(salida).mtimeMs > statSync(original).mtimeMs) return { archivo: salida, srt, seg: SEG_GANCHO };
  const p = sondear(original), v = p.streams.find((s) => s.codec_type === 'video'), auds = p.streams.filter((s) => s.codec_type === 'audio');
  const [a, b] = v.r_frame_rate.split('/').map(Number), fps = Math.round(a / (b || 1));
  const cartel = join(dir, 'cartel.mp4');
  await renderCartel({ serie: g.serie, ...textos, fps, salida: cartel });
  const lista = join(dir, 'lista.txt'), soloVideo = join(dir, 'video.mp4');
  writeFileSync(lista, [cartel, soloVideo].map((f) => `file '${resolve(f)}'`).join('\n'));
  const tmp = `${salida}.tmp.mp4`;
  const cmds = comandosUnir({ cartel, original, salida: tmp, musica: join('public/musica', `${MUSICA[g.serie] ?? MUSICA.griegas}.wav`), pistas: auds.map((s) => ({ idioma: s.tags?.language })), sampleRate: Number(auds[0]?.sample_rate) || 44100, lista, soloVideo });
  for (const c of cmds) execFileSync('ffmpeg', c, { stdio: ['ignore', 'ignore', 'inherit'] });
  const durO = Number(p.format.duration), durN = Number(sondear(tmp).format.duration);
  if (Math.abs(durN - durO - SEG_GANCHO) > 0.25) throw new Error(`${id}: el video con cartel dura ${durN.toFixed(2)} s (esperado ${(durO + SEG_GANCHO).toFixed(2)})`);
  execFileSync('mv', [tmp, salida]);
  for (const f of [soloVideo, `${soloVideo}.unido.mp4`, lista]) rmSync(f, { force: true });
  return { archivo: salida, srt, seg: SEG_GANCHO };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await conGancho(process.argv[2]);
  console.log(r ? `listo: ${r.archivo}` : 'sin cartel (falta el título o el video)');
}
