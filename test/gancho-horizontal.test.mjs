// Cartel gancho de los episodios largos: se pega adelante del mp4 ya hecho (sin re-render) y todo se corre 2 s.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SEG_GANCHO, desplazarSrt, desplazarCapitulos, conPregunta, preguntaDe, comandosUnir, textosGancho } from '../scripts/gancho-horizontal.mjs';
import { srt } from '../lib/motor-tiempos.mjs';

test('el cartel dura lo mismo en la composición y en el pegado (2 s)', () => {
  assert.equal(SEG_GANCHO, 2);
  assert.match(readFileSync('src/motor/VideoMotor.tsx', 'utf8'), /export const GANCHO_HORIZONTAL = 2;/);
});

test('srt: todos los tiempos se corren 2 s, también al cruzar minuto y hora', () => {
  const s = '1\n00:00:04,500 --> 00:00:09,583\nHola\n\n2\n00:00:59,000 --> 00:59:58,999\nChau\n';
  assert.equal(desplazarSrt(s, 2000), '1\n00:00:06,500 --> 00:00:11,583\nHola\n\n2\n00:01:01,000 --> 01:00:00,999\nChau\n');
});

test('srt real: misma cantidad de subtítulos, cada uno 2 s más tarde', () => {
  const tl = JSON.parse(readFileSync('src/videos/griegas-02-prometeo/timeline.json', 'utf8'));
  const a = srt(tl, 'en'), b = desplazarSrt(a, SEG_GANCHO * 1000);
  const ms = (t) => t.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g).map((x) => { const [h, m, s, z] = x.split(/[:,]/).map(Number); return ((h * 60 + m) * 60 + s) * 1000 + z; });
  assert.equal(ms(b).length, ms(a).length);
  ms(b).forEach((x, i) => assert.equal(x - ms(a)[i], 2000));
  assert.equal(b.replace(/\d{2}:\d{2}:\d{2},\d{3}/g, ''), a.replace(/\d{2}:\d{2}:\d{2},\d{3}/g, ''));
});

test('capítulos: se corren 2 s salvo el 0:00', () => {
  const d = 'Resumen.\n\nChapters\n0:00 Intro\n0:13 The Fire\n1:59 Pandora\n10:58 End\n\nNext episode: X';
  assert.equal(desplazarCapitulos(d, 2), 'Resumen.\n\nChapters\n0:00 Intro\n0:15 The Fire\n2:01 Pandora\n11:00 End\n\nNext episode: X');
});

test('pregunta en la descripción: después del resumen, una sola vez', () => {
  const d = 'Norse Mythology · Season 1, Episode 13\n\nThe gods fell.\n\nChapters\n0:00 Intro';
  const p = 'Which Norse god would you want on your side? Tell us in the comments 👇';
  const r = conPregunta(d, p);
  assert.equal(r, `Norse Mythology · Season 1, Episode 13\n\nThe gods fell.\n\n${p}\n\nChapters\n0:00 Intro`);
  assert.equal(conPregunta(r, p), r);
  assert.equal(conPregunta('Solo resumen.', p), `Solo resumen.\n\n${p}`);
  assert.equal(preguntaDe({ serie: 'nordicas' }), p);
  assert.equal(preguntaDe({ serie: 'griegas', pregunta: { en: 'Would you have forgiven Zeus?' } }), 'Would you have forgiven Zeus?');
  assert.match(preguntaDe({ serie: 'maories' }), /comments/);
});

test('textos del cartel: título curioso + temporada; nada si no hay título', () => {
  assert.deepEqual(textosGancho('x', 'nordicas', { x: { titulo: 'Two People Survived the End of the World on Dew | Norse Mythology S1E13', temporada: 1, episodio: 13 } }),
    { gancho: 'Two People Survived the End of the World on Dew', linea: 'Norse Mythology · Season 1, Episode 13' });
  assert.equal(textosGancho('y', 'nordicas', {}), null);
});

test('comandos de ffmpeg: video sin recodificar y una pista de audio con música por cada pista del original', () => {
  const c = comandosUnir({ cartel: 'c.mp4', original: 'o.mp4', salida: 's.mp4', musica: 'm.wav', pistas: [{ idioma: 'eng' }, { idioma: 'spa' }], sampleRate: 48000, lista: 'l.txt', soloVideo: 'v.mp4' });
  assert.equal(c.length, 3);
  assert.ok(c[0].includes('-map') && c[0].at(-1) === 'v.mp4');
  assert.ok(c[1].join(' ').includes('-f concat -safe 0 -i l.txt -c copy v.mp4.unido.mp4'));
  const f = c[2][c[2].indexOf('-filter_complex') + 1];
  assert.match(f, /^\[2:a\]atrim=0:2,.*asplit=2\[s0\]\[s1\];/);
  assert.match(f, /\[1:a:0\]aformat=sample_rates=48000:channel_layouts=stereo\[o0\];\[s0\]\[o0\]concat=n=2:v=0:a=1\[a0\]/);
  assert.match(f, /\[s1\]\[o1\]concat=n=2:v=0:a=1\[a1\]/);
  const j = c[2].join(' ');
  assert.ok(j.includes('-map 0:v -map [a0] -map [a1] -c:v copy -c:a aac'));
  assert.ok(j.includes('-metadata:s:a:0 language=eng -metadata:s:a:1 language=spa'));
  assert.equal(c[2].at(-1), 's.mp4');
  // una sola pista: sin asplit
  const u = comandosUnir({ original: 'o.mp4', salida: 's.mp4', musica: 'm.wav', pistas: [{ idioma: 'eng' }], lista: 'l.txt', soloVideo: 'v.mp4' })[2];
  assert.ok(!u[u.indexOf('-filter_complex') + 1].includes('asplit'));
});
