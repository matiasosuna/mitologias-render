// Shorts rápidos (lib/short.mjs): voz a 1,1× sin silencios en las puntas, pausas cortas, cold open antes del cartel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { TEMPO_SHORT, escenasDe, preguntaFinal, procesoAudio, pendienteAudio, registroAudio, filtroAudio, erroresColdOpen } from '../lib/short.mjs';
import { T_SHORT, T, TEMPO_EN, timelineMulti, FPS } from '../lib/motor-tiempos.mjs';
import { tiemposShort, INTRO_QUIEN } from '../lib/quien.mjs';

const RAIZ = resolve('.');
const leer = (f) => readFileSync(join(RAIZ, f), 'utf8');
const fr = (en, s) => ({ texto: { en }, audio: {}, segundos: { en: s } });
const COLD = { fondo: 'batalla', frases: [{ es: 'Liberó a los monstruos.', en: 'He freed the monsters.' }], actores: [{ id: 'zeus', como: 'zeus_oficial', x: 960 }] };
const QUIEN = { nombre: { es: 'Zeus', en: 'Zeus' }, subtitulo: { es: 'x', en: 'y' }, como: 'zeus_oficial' };
const historia = [{ id: 'a', frases: [{ es: 'a', en: 'One.' }, { es: 'b', en: 'Two.' }] }, { id: 'b', frases: [{ es: 'c', en: 'Three.' }] }];

const hayFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

test('ritmo de Shorts: 0,12 s entre frases, ~0,35 s entre escenas, cartel final 1,5 s; episodios sin cambios', () => {
  assert.equal(T_SHORT.pausa, 0.12);
  assert.ok(Math.abs(T_SHORT.salida + T_SHORT.entrada - 0.35) < 1e-9);
  assert.equal(T_SHORT.outro, 1.5);
  assert.equal(TEMPO_SHORT, 1.1);
  assert.equal(TEMPO_EN, 0.9);
  assert.deepEqual(T, { intro: 4, entrada: 0.7, pausa: 0.6, salida: 1.0, outro: 12 });
  const tl = timelineMulti([{ id: 'a', frases: [fr('x', 2), fr('y', 1)] }, { id: 'b', frases: [fr('z', 1)] }], FPS, T_SHORT);
  const [a, b] = tl.escenas;
  assert.equal(a.frases[1].from - (a.frases[0].from + a.frases[0].dur), Math.round(0.12 * FPS));
  const hueco = b.from + b.frases[0].from - (a.from + a.frases[1].from + a.frases[1].dur);
  assert.equal(hueco, Math.round(0.2 * FPS) + Math.round(0.15 * FPS)); // ≈ 0,35 s
});

test('proceso de la voz: Shorts 1,1× recortados; episodios 0,9× como siempre', () => {
  assert.deepEqual(procesoAudio({ formato: 'short' }), { tempo: 1.1, recortar: true });
  assert.deepEqual(procesoAudio({}), { tempo: 0.9, recortar: false });
});

test('re-narrar re-estira solo la diferencia (el caché por texto no sabe de tempo; .tempo.json sí)', () => {
  const short = procesoAudio({ formato: 'short' }), ep = procesoAudio({});
  assert.deepEqual(pendienteAudio(undefined, short), { atempo: 1.1, recortar: true }); // crudo
  assert.deepEqual(pendienteAudio(0.9, short), { atempo: 1.222222, recortar: true }); // Short viejo a 0,9
  assert.equal(pendienteAudio({ tempo: 1.1, recorte: true }, short), null); // ya está
  assert.equal(pendienteAudio(0.9, ep), null); // episodios: nada nuevo
  assert.deepEqual(pendienteAudio(undefined, ep), { atempo: 0.9, recortar: false });
  assert.deepEqual(pendienteAudio({ tempo: 1.1, recorte: true }, { tempo: 1.05, recortar: true }), { atempo: 0.954545, recortar: false });
  assert.equal(registroAudio(ep), 0.9); // formato viejo del registro
  assert.deepEqual(registroAudio(short), { tempo: 1.1, recorte: true });
  assert.equal(filtroAudio({ atempo: 0.9, recortar: false }), 'atempo=0.9');
  assert.match(filtroAudio({ atempo: null, recortar: true }), /^silenceremove=.*,areverse,silenceremove=.*,areverse$/);
});

test('ralentizar de verdad (ffmpeg): episodio 0,9 → Short 1,1 sin silencios, y una segunda vez no toca nada', { skip: !hayFfmpeg && 'sin ffmpeg' }, async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'moc-short-'));
  try {
    process.chdir(tmp);
    const dir = 'public/audio/s/en', wav = join(dir, 'a-0-x.wav');
    mkdirSync(dir, { recursive: true });
    // 0,5 s de silencio + 2 s de tono + 0,5 s de silencio
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'sine=frequency=300:duration=2', '-af', 'adelay=500,apad=pad_dur=0.5', '-ar', '48000', '-ac', '1', wav]);
    const dur = () => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());
    assert.ok(Math.abs(dur() - 3) < 0.05);
    const { ralentizar } = await import('../scripts/narracion-lenta.mjs');
    assert.equal(ralentizar('s', procesoAudio({})), 1);
    assert.ok(Math.abs(dur() - 3 / 0.9) < 0.08, `episodio: ${dur()}`);
    assert.equal(ralentizar('s', procesoAudio({ formato: 'short' })), 1);
    const d = dur();
    assert.ok(d > 2 / 1.1 - 0.05 && d < 2 / 1.1 + 0.2, `Short: ${d}`); // tono a 1,1× + ~0,1 s de puntas
    assert.deepEqual(JSON.parse(readFileSync(join(dir, '.tempo.json'), 'utf8'))['a-0-x.wav'], { tempo: 1.1, recorte: true });
    assert.equal(ralentizar('s', procesoAudio({ formato: 'short' })), 0);
  } finally { process.chdir(RAIZ); rmSync(tmp, { recursive: true, force: true }); }
});

test('cold open: va primero, después el cartel de 1,5 s y después la historia', () => {
  const g = { formato: 'short', quien: QUIEN, coldOpen: COLD, escenas: historia };
  const esc = escenasDe(g);
  assert.deepEqual(esc.map((e) => e.id), ['coldopen', 'a', 'b']);
  const tl = timelineMulti(esc.map((e) => ({ id: e.id, frases: e.frases.map((t) => fr(t.en, 2)) })), FPS, tiemposShort(g));
  const [frio, a] = tl.escenas;
  assert.equal(frio.from, Math.round(T_SHORT.intro * FPS));
  assert.equal(tl.cartelFrom, frio.from + frio.durationInFrames);
  assert.equal(tl.cartelFrames, INTRO_QUIEN * FPS);
  assert.equal(a.from, tl.cartelFrom + tl.cartelFrames);
  // sin cold open ni quien: igual que siempre
  assert.equal(escenasDe({ escenas: historia }), historia);
  assert.equal(tiemposShort({ formato: 'short', escenas: historia }), T_SHORT);
});

test('si termina en pregunta, la última escena queda 1 s más', () => {
  const g = { formato: 'short', escenas: [{ id: 'a', frases: [{ es: '¿Y vos?', en: 'Would you?' }] }] };
  assert.ok(preguntaFinal(g));
  const con = timelineMulti([{ id: 'a', frases: [fr('x', 2)] }], FPS, tiemposShort(g)), sin = timelineMulti([{ id: 'a', frases: [fr('x', 2)] }], FPS, T_SHORT);
  assert.equal(con.total - sin.total, FPS);
  assert.equal(con.outroFrames, sin.outroFrames);
});

test('validación del cold open', () => {
  assert.deepEqual(erroresColdOpen({ formato: 'short', coldOpen: COLD }), []);
  assert.deepEqual(erroresColdOpen({ formato: 'short' }), []);
  assert.match(erroresColdOpen({ coldOpen: COLD }).join(), /formato/);
  assert.match(erroresColdOpen({ formato: 'short', coldOpen: { ...COLD, frases: [] } }).join(), /1–2 frases/);
  assert.match(erroresColdOpen({ formato: 'short', coldOpen: { ...COLD, actores: [] } }).join(), /sin actores/);
});

test('los Shorts con cold open son válidos y su timeline lo trae primero', () => {
  for (const d of readdirSync(join(RAIZ, 'src/videos')).filter((x) => x.startsWith('short-'))) {
    const p = `src/videos/${d}/guion.json`;
    if (!existsSync(join(RAIZ, p))) continue;
    const g = JSON.parse(leer(p));
    if (!g.coldOpen) continue;
    assert.deepEqual(erroresColdOpen(g), [], d);
    const tl = JSON.parse(leer(`src/videos/${d}/timeline.json`));
    assert.deepEqual(tl.escenas.map((e) => e.id), escenasDe(g).map((e) => e.id), d);
    if (g.quien) assert.equal(tl.cartelFrom, tl.escenas[0].from + tl.escenas[0].durationInFrames, d);
  }
});

test('cableado: narrar, retimear, revisar y ShortNativo', () => {
  const n = leer('scripts/motor-narrar.mjs');
  assert.match(n, /escenasDe\(g\)/);
  assert.match(n, /ralentizar\(id, procesoAudio\(g\)\)/);
  assert.match(leer('scripts/narracion-lenta.mjs'), /pendienteAudio\(hechos\[f\], objetivo\)/);
  assert.match(leer('scripts/motor-revisar.mjs'), /erroresColdOpen\(g\)/);
  const sn = leer('src/motor/ShortNativo.tsx');
  assert.match(sn, /escenasDe\(guion\)/);
  assert.match(sn, /esc=\{escenasG\[i\]\}/);
});

test('cíclope: el ojo va dentro de la cabeza (no flota al arrodillarse)', () => {
  assert.doesNotMatch(leer('src/motor/elenco.tsx'), /ficha\.extra === 'ciclope' && \(/);
  assert.match(leer('src/motor/elenco.tsx'), /ciclope: ficha\.extra === 'ciclope'/);
  assert.match(leer('src/comun/vasija.tsx'), /props\.ciclope \?/);
});

test('rótulos y brillos cortos (ritmo de Shorts) no rompen interpolate', () => {
  const e = leer('src/motor/Escena.tsx');
  assert.match(e, /const fd = Math\.max\(1, Math\.min\(12, \(t1 - t0\) \/ 2 - 0\.5\)\)/);
  assert.match(e, /Math\.max\(t1, t0 \+ 12\.5\)/);
  // el fundido achicado siempre deja los 4 puntos en orden estricto
  for (const largo of [3, 5, 10, 18, 24, 40]) { const fd = Math.max(1, Math.min(12, largo / 2 - 0.5)); assert.ok(0 < fd && fd < largo - fd && largo - fd < largo, String(largo)); }
});
