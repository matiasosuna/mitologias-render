// Master final de audio (sonoridad de redes): −14 LUFS integrados, pico real −1 dBTP, en todas las pistas de audio.
// 2 pasadas de loudnorm con los valores medidos y SIEMPRE en modo lineal (una sola ganancia fija para todo el video):
// la música de fondo no sube respecto de la voz (el modo dinámico de loudnorm la "bombea" en las pausas).
// Si con esa ganancia los picos pasan −1 dBTP, antes se suben con `volume` y un limitador con sobremuestreo ×4 (pico real)
// recorta solo los picos de la voz; después loudnorm corrige el resto en lineal.
// La narración ya viene con loudnorm −20 por frase (motor-narrar): esto es el master del archivo final.
// Video: se copia sin recodificar. Audio: AAC 192k (o el que se pida). Uso suelto: node lib/master.mjs <mp4> [<mp4>…]
import { execFileSync, spawnSync } from 'node:child_process';
import { renameSync, rmSync } from 'node:fs';
import { extname } from 'node:path';

// TP −1,5 en PCM: el AAC agrega ~0,3–0,5 dB de sobrepico; así el archivo final queda ≤ −1 dBTP.
export const OBJETIVO = { I: -14, TP: -1.5, LRA: 11 };
const MARGEN_TP = 0.3; // dB por debajo del pico objetivo para que loudnorm acepte el modo lineal
const LIMITE_DB = -2.3; // techo del limitador (pico de muestra a 192 kHz ≈ pico real)

const n2 = (x) => Number(x).toFixed(2);
const dbALineal = (db) => 10 ** (db / 20);

/** LRA objetivo: 11, o lo medido (+1, hasta 20) si es más; así loudnorm nunca cae al modo dinámico por el LRA. */
export const lraObjetivo = (m, base = OBJETIVO.LRA) => Math.min(20, Math.max(base, Math.ceil(m?.input_lra ?? 0) + 1));

/** Filtro de la 1.ª pasada (medición), con el pre-proceso opcional adelante. */
export function filtroMedicion(pre = '', o = OBJETIVO) {
  return `${pre ? `${pre},` : ''}loudnorm=I=${o.I}:TP=${o.TP}:LRA=${o.LRA}:print_format=json`;
}

/** Los bloques JSON que imprime loudnorm (uno por filtro, en orden), con números. */
export function leerLoudnorm(salida) {
  return [...String(salida).matchAll(/\{\s*"input_i"[\s\S]*?\}/g)].map((b) => {
    const o = JSON.parse(b[0]);
    for (const k of Object.keys(o)) if (k !== 'normalization_type' && o[k] !== '' && !Number.isNaN(Number(o[k]))) o[k] = Number(o[k]);
    return o;
  });
}

/** Pista muda (o casi): se deja como está, sin subirle ruido. */
export const esSilencio = (m) => !Number.isFinite(m?.input_i) || m.input_i < -60;

/** Ganancia (dB) para llegar al objetivo en lineal. */
export const ganancia = (m, o = OBJETIVO) => o.I - m.input_i;

/** ¿Con la ganancia fija los picos pasarían el techo? Entonces hace falta el limitador antes. */
export const necesitaLimitador = (m, o = OBJETIVO) => m.input_tp + ganancia(m, o) > o.TP - MARGEN_TP;

/** Ganancia (dB) + limitador de picos con sobremuestreo ×4 (sin cambiar la latencia), vuelve a la frecuencia original. */
export function filtroLimitador(db, { sampleRate = 48000 } = {}) {
  return [
    `volume=${n2(db)}dB`,
    'aresample=192000',
    `alimiter=limit=${dbALineal(LIMITE_DB).toFixed(4)}:attack=1:release=60:level=0:latency=1`,
    `aresample=${sampleRate}`,
  ].join(',');
}

/** Filtro de la 2.ª pasada: loudnorm lineal con lo medido (sobre la señal ya pre-procesada, si hay `pre`). */
export function filtroMaster(m, { pre = '', sampleRate = 48000, o = OBJETIVO } = {}) {
  const ln = [
    `I=${o.I}`, `TP=${o.TP}`, `LRA=${lraObjetivo(m, o.LRA)}`,
    `measured_I=${n2(m.input_i)}`, `measured_TP=${n2(m.input_tp)}`, `measured_LRA=${n2(m.input_lra)}`, `measured_thresh=${n2(m.input_thresh)}`,
    `offset=${n2(m.target_offset ?? 0)}`, 'linear=true', 'print_format=json',
  ].join(':');
  return `${pre ? `${pre},` : ''}loudnorm=${ln},aresample=${sampleRate}`;
}

/** Argumentos de ffmpeg para medir la pista de audio `pista` (índice entre las de audio). */
export function argsMedir(entrada, pista = 0, pre = '') {
  return ['-hide_banner', '-nostats', '-i', entrada, '-map', `0:a:${pista}`, '-af', filtroMedicion(pre), '-f', 'null', '-'];
}

/** Argumentos de ffmpeg para escribir el master: video (y todo lo demás) copiado, cada pista de audio con su filtro. */
export function argsMaster(entrada, salida, filtros, { bitrate = '192k', metadatos = true } = {}) {
  const contenedorMp4 = /\.(mp4|m4a|mov)$/i.test(extname(salida));
  return [
    '-hide_banner', '-nostats', '-y', '-i', entrada,
    '-map', '0', '-map_metadata', metadatos ? '0' : '-1', '-c', 'copy',
    '-c:a', 'aac', '-b:a', bitrate,
    ...filtros.flatMap((f, i) => [`-filter:a:${i}`, f]),
    ...(contenedorMp4 ? ['-movflags', '+faststart'] : []),
    salida,
  ];
}

/** Pre-proceso de una pista: '' si alcanza con la ganancia lineal; si no, ganancia + limitador. Como el limitador baja
 *  un poco la sonoridad, se vuelve a medir y se corrige la ganancia hasta que el loudnorm final pueda ir en lineal.
 *  `medirCon(pre)` → medición de la pista con ese pre-proceso. Devuelve { pre, m } (m = medición con `pre`). */
export function planPista(medirCon, { sampleRate = 48000, o = OBJETIVO, intentos = 4 } = {}) {
  let m = medirCon(''), pre = '', db = 0;
  for (let i = 0; i < intentos && !esSilencio(m) && necesitaLimitador(m, o); i++) {
    db += ganancia(m, o);
    pre = filtroLimitador(db, { sampleRate });
    m = medirCon(pre);
  }
  return { pre, m };
}

// ── ejecución
const correr = (ffmpeg, args) => {
  const r = spawnSync(ffmpeg, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`ffmpeg falló: ${(r.stderr || '').trim().slice(-400)}`);
  return r.stderr;
};
function sondear(entrada, ffprobe) {
  const j = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=sample_rate', '-of', 'json', entrada], { encoding: 'utf8' }));
  return j.streams.map((s) => Number(s.sample_rate) || 48000);
}
/** Mide una pista: { input_i, input_tp, input_lra, input_thresh, target_offset }. */
export function medir(entrada, pista = 0, pre = '', { ffmpeg = 'ffmpeg' } = {}) {
  const m = leerLoudnorm(correr(ffmpeg, argsMedir(entrada, pista, pre)))[0];
  if (!m) throw new Error(`no se pudo medir la pista ${pista} de ${entrada}`);
  return m;
}

/** Masteriza `entrada` (todas sus pistas de audio) a −14 LUFS / −1 dBTP. Si `salida` es la misma ruta, la reemplaza.
 *  Devuelve [{ antes, despues, tipo }] por pista (LUFS integrados medidos antes y estimados por loudnorm después). */
export function masterizar(entrada, salida = entrada, { bitrate = '192k', metadatos = true, ffmpeg = 'ffmpeg', ffprobe = 'ffprobe', log = true } = {}) {
  const rates = sondear(entrada, ffprobe);
  if (!rates.length) return [];
  const planes = rates.map((sampleRate, i) => {
    let m0;
    const { pre, m } = planPista((pre) => { const x = medir(entrada, i, pre, { ffmpeg }); m0 ??= x; return x; }, { sampleRate });
    return { m0, filtro: esSilencio(m0) ? `aresample=${sampleRate}` : filtroMaster(m, { pre, sampleRate }) };
  });
  const tmp = salida === entrada ? `${salida}.master${extname(salida)}` : salida;
  try {
    const log2 = correr(ffmpeg, argsMaster(entrada, tmp, planes.map((p) => p.filtro), { bitrate, metadatos }));
    if (tmp !== salida) renameSync(tmp, salida);
    const finales = leerLoudnorm(log2);
    const res = planes.map((p, i) => ({ antes: p.m0.input_i, despues: finales[i]?.output_i, tipo: finales[i]?.normalization_type }));
    if (log) console.log(`master: ${salida} · ${res.map((r) => `${r.antes} → ${r.despues} LUFS (${r.tipo})`).join(' · ')}`);
    return res;
  } finally { if (tmp !== salida) rmSync(tmp, { force: true }); }
}

/** ¿La medición ya está en el objetivo? (±1 LU y pico ≤ −0,5 dBTP; una pista muda también cuenta). */
export const enObjetivo = (m, o = OBJETIVO) => esSilencio(m) || (Math.abs(m.input_i - o.I) <= 1 && m.input_tp <= -0.5);

/** Masteriza solo si alguna pista no está en el objetivo (archivos hechos antes del master). true = lo cambió. */
export function asegurarMaster(ruta, opciones = {}) {
  const { ffmpeg = 'ffmpeg', ffprobe = 'ffprobe' } = opciones;
  const pistas = sondear(ruta, ffprobe);
  if (pistas.every((_, i) => enObjetivo(medir(ruta, i, '', { ffmpeg })))) return false;
  masterizar(ruta, ruta, opciones);
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) for (const f of process.argv.slice(2)) masterizar(f);
