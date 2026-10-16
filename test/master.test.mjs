import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { OBJETIVO, leerLoudnorm, filtroMedicion, filtroMaster, filtroLimitador, argsMedir, argsMaster, ganancia, necesitaLimitador, lraObjetivo, planPista, esSilencio, masterizar } from '../lib/master.mjs';

const SALIDA = `[Parsed_loudnorm_0 @ 0x1] \n{\n\t"input_i" : "-20.46",\n\t"input_tp" : "-4.40",\n\t"input_lra" : "3.70",\n\t"input_thresh" : "-31.01",\n\t"output_i" : "-14.73",\n\t"output_tp" : "-1.00",\n\t"output_lra" : "2.80",\n\t"output_thresh" : "-25.17",\n\t"normalization_type" : "dynamic",\n\t"target_offset" : "0.73"\n}\n[out#0/null] video:0KiB`;
const m = (x) => ({ input_i: -20, input_tp: -10, input_lra: 4, input_thresh: -30, target_offset: 0.1, ...x });

test('objetivo de redes: −14 LUFS y pico por debajo de −1 dBTP', () => {
  assert.equal(OBJETIVO.I, -14);
  assert.ok(OBJETIVO.TP <= -1);
});

test('lee el JSON de loudnorm con números', () => {
  const [r] = leerLoudnorm(SALIDA);
  assert.equal(r.input_i, -20.46);
  assert.equal(r.input_tp, -4.4);
  assert.equal(r.target_offset, 0.73);
  assert.equal(r.normalization_type, 'dynamic');
  assert.equal(leerLoudnorm(SALIDA + SALIDA).length, 2); // una por pista
  assert.deepEqual(leerLoudnorm('nada'), []);
});

test('medición: loudnorm con json y pre-proceso opcional adelante', () => {
  assert.equal(filtroMedicion(), `loudnorm=I=-14:TP=${OBJETIVO.TP}:LRA=11:print_format=json`);
  assert.ok(filtroMedicion('volume=3dB').startsWith('volume=3dB,loudnorm='));
  assert.deepEqual(argsMedir('a.mp4', 1).slice(-7), ['-map', '0:a:1', '-af', filtroMedicion(), '-f', 'null', '-']);
});

test('master: loudnorm LINEAL con los valores medidos (la música no se bombea)', () => {
  const f = filtroMaster(m());
  for (const x of ['I=-14', 'measured_I=-20.00', 'measured_TP=-10.00', 'measured_LRA=4.00', 'measured_thresh=-30.00', 'offset=0.10', 'linear=true']) assert.ok(f.includes(x), x);
  assert.ok(f.endsWith('aresample=48000'));
  assert.ok(filtroMaster(m(), { pre: 'volume=1dB', sampleRate: 44100 }).match(/^volume=1dB,loudnorm=.*aresample=44100$/));
});

test('LRA objetivo cubre lo medido (si no, loudnorm cae a dinámico)', () => {
  assert.equal(lraObjetivo(m({ input_lra: 4 })), 11);
  assert.equal(lraObjetivo(m({ input_lra: 14.2 })), 16);
  assert.equal(lraObjetivo(m({ input_lra: 40 })), 20);
});

test('limitador solo si la ganancia fija pasaría el pico', () => {
  assert.equal(ganancia(m({ input_i: -20.5 })), 6.5);
  assert.equal(necesitaLimitador(m({ input_i: -20, input_tp: -10 })), false); // −10 + 6 = −4
  assert.equal(necesitaLimitador(m({ input_i: -20.46, input_tp: -4.4 })), true); // −4,4 + 6,46 > −1
  const f = filtroLimitador(6.46, { sampleRate: 44100 });
  assert.match(f, /^volume=6\.46dB,aresample=192000,alimiter=limit=0\.\d+:.*level=0:latency=1,aresample=44100$/);
});

test('plan: corrige la ganancia hasta que el loudnorm final pueda ir lineal', () => {
  // simulación: el limitador deja el pico en −2,3 y le quita 0,8 LU a la sonoridad
  const medidas = [];
  const medirCon = (pre) => {
    medidas.push(pre);
    if (!pre) return m({ input_i: -20.46, input_tp: -4.4 });
    const db = Number(pre.match(/volume=([-\d.]+)dB/)[1]);
    return m({ input_i: -20.46 + db - 0.8, input_tp: -2.3 });
  };
  const { pre, m: final } = planPista(medirCon);
  assert.ok(pre.includes('alimiter'));
  assert.ok(!necesitaLimitador(final), 'el loudnorm final queda lineal');
  assert.ok(Math.abs(final.input_i - OBJETIVO.I) < 0.5);
  assert.ok(medidas.length <= 5);
  // sin picos: ni limitador ni segunda medición
  const una = [];
  assert.equal(planPista((p) => { una.push(p); return m(); }).pre, '');
  assert.equal(una.length, 1);
});

test('pista muda: no se toca', () => {
  assert.equal(esSilencio({ input_i: '-inf' }), true);
  assert.equal(esSilencio(m({ input_i: -70 })), true);
  assert.equal(esSilencio(m()), false);
  assert.equal(planPista(() => ({ input_i: -Infinity, input_tp: -Infinity })).pre, '');
});

test('argumentos del master: video copiado, AAC 192k, un filtro por pista, faststart', () => {
  const a = argsMaster('in.mp4', 'out.mp4', ['F0', 'F1']);
  const j = a.join(' ');
  assert.ok(j.includes('-map 0 -map_metadata 0 -c copy -c:a aac -b:a 192k'));
  assert.ok(j.includes('-filter:a:0 F0 -filter:a:1 F1'));
  assert.ok(j.includes('-movflags +faststart'));
  assert.equal(a.at(-1), 'out.mp4');
  assert.ok(!argsMaster('in.mkv', 'out.mkv', ['F']).includes('-movflags'));
  assert.ok(argsMaster('i.mkv', 'o.mp4', ['F'], { metadatos: false, bitrate: '160k' }).join(' ').includes('-map_metadata -1 -c copy -c:a aac -b:a 160k'));
});

// ── con ffmpeg de verdad (se saltea si no está)
const hayFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
const lufs = (f, pista) => {
  const s = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-map', `0:a:${pista}`, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const sum = s.slice(s.lastIndexOf('Summary:'));
  return { I: Number(sum.match(/I:\s+(-?[\d.]+) LUFS/)[1]), TP: Number(sum.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]) };
};

test('masteriza un mp4 de 2 pistas a −14 LUFS, en lineal y sin tocar el video', { skip: !hayFfmpeg }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'master-'));
  try {
    const f = join(dir, 'v.mp4');
    // pista 0: "voz" baja con picos (tono cortado) + "música" de fondo; pista 1: más fuerte y continua
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc=size=160x120:rate=10:duration=8',
      '-f', 'lavfi', '-i', 'sine=frequency=440:duration=8,volume=0.2,volume=\'if(lt(mod(t,1),0.6),1,0)\':eval=frame[v];sine=frequency=110:duration=8,volume=0.02[mu];[v][mu]amix=inputs=2:normalize=0',
      '-f', 'lavfi', '-i', 'sine=frequency=330:duration=8,volume=0.05',
      '-map', '0:v', '-map', '1:a', '-map', '2:a', '-c:v', 'libx264', '-c:a', 'aac', '-b:a', '128k', '-metadata:s:a:0', 'language=eng', '-metadata:s:a:1', 'language=spa', f]);
    const vAntes = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'packet=size', '-of', 'csv=p=0', f], { encoding: 'utf8' });
    const res = masterizar(f, f, { log: false });
    assert.equal(res.length, 2);
    for (const r of res) assert.equal(r.tipo, 'linear');
    for (const p of [0, 1]) {
      const { I, TP } = lufs(f, p);
      assert.ok(Math.abs(I - -14) <= 0.6, `pista ${p}: ${I} LUFS`);
      assert.ok(TP <= -0.9, `pista ${p}: pico ${TP}`);
    }
    const vDespues = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'packet=size', '-of', 'csv=p=0', f], { encoding: 'utf8' });
    assert.equal(vDespues, vAntes, 'video copiado');
    const meta = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name,bit_rate:stream_tags=language', '-of', 'json', f], { encoding: 'utf8' })).streams;
    assert.deepEqual(meta.map((s) => s.tags.language), ['eng', 'spa']);
    assert.ok(meta.every((s) => s.codec_name === 'aac'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
