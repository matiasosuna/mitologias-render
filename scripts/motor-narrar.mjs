// Narra un guion visual en varios idiomas (voces de macOS, gratis) y genera su timeline.
// Uso: node scripts/motor-narrar.mjs griegas-02-prometeo [es,pt,en]
// Reutiliza los audios ya generados si el texto no cambió.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ralentizar, retimear } from './narracion-lenta.mjs';
import { T_SHORT, timelineMulti } from '../lib/motor-tiempos.mjs';

// Inglés: tu voz clonada en ElevenLabs (si hay clave en .env); el resto, voces de macOS gratis.
const ENV = Object.fromEntries((existsSync('.env') ? readFileSync('.env', 'utf8') : '').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const ELEVEN = ENV.ELEVENLABS_API_KEY && ENV.ELEVENLABS_VOICE_ID ? { key: ENV.ELEVENLABS_API_KEY, voz: ENV.ELEVENLABS_VOICE_ID, modelo: ENV.ELEVENLABS_MODEL ?? 'eleven_flash_v2_5', velocidad: Number(ENV.ELEVENLABS_SPEED ?? 1) } : null;
const VOZ = { es: ['Paulina', 168], pt: ['Luciana', 175], en: ['Samantha', 170] };
// VOZ_EN=chatterbox en .env → inglés con Chatterbox (gratis, GPU de Modal, scripts/modal_voz.py) en vez de ElevenLabs.
const CHATTER = ENV.VOZ_EN === 'chatterbox';
const CB = ['chatterbox-turbo', 1];
let caracteres = 0;
const enOrden = async (lista, fn) => { const r = []; for (const [i, x] of lista.entries()) r.push(await fn(x, i)); return r; };
async function eleven(texto, salida) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN.voz}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: ELEVEN.modelo, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2, speed: ELEVEN.velocidad } }),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
  writeFileSync(salida, Buffer.from(await r.arrayBuffer()));
  caracteres += texto.length;
}
const [id, lista = 'es,pt,en'] = process.argv.slice(2);
if (!id) throw new Error('Falta el id del video');
const idiomas = lista.split(',');
const dir = join('src/videos', id);
const g = JSON.parse(readFileSync(join(dir, 'guion.json'), 'utf8'));
const dur = (wav) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());

// Chatterbox: genera de una vez (una sola máquina con GPU) todas las frases en inglés que todavía no tienen audio.
const cbDir = join('out', '.voz', id);
if (CHATTER && idiomas.includes('en')) {
  const dirEn = join('public/audio', id, 'en'), hechos = existsSync(dirEn) ? readdirSync(dirEn) : [];
  const faltan = g.escenas.flatMap((e) => e.frases).filter((t) => t.en).map((t) => ({ h: createHash('sha1').update(`${CB[0]}|${CB[1]}|${t.en}`).digest('hex').slice(0, 8), texto: t.en }))
    .filter((f, i, a) => a.findIndex((x) => x.h === f.h) === i && !hechos.some((n) => n.endsWith(`-${f.h}.wav`)));
  if (faltan.length) {
    mkdirSync(cbDir, { recursive: true });
    writeFileSync(join(cbDir, 'entrada.json'), JSON.stringify(faltan));
    execFileSync('.venv/bin/modal', ['run', 'scripts/modal_voz.py'], { timeout: 20 * 60 * 1000, killSignal: 'SIGINT', stdio: 'inherit', env: { ...process.env, VOZ_ENTRADA: join(cbDir, 'entrada.json'), VOZ_SALIDA: cbDir } });
  }
}

const escenas = [];
for (const esc of g.escenas) escenas.push({
  id: esc.id,
  frases: await enOrden(esc.frases, async (texto, j) => {
    const audio = {}, segundos = {};
    for (const l of idiomas) {
      if (!texto[l]) continue;
      const conCB = l === 'en' && CHATTER, conEleven = l === 'en' && !CHATTER && ELEVEN;
      const [voz, vel] = conCB ? CB : conEleven ? [ELEVEN.voz + ELEVEN.modelo, ELEVEN.velocidad] : VOZ[l];
      const h = createHash('sha1').update(`${voz}|${vel}|${texto[l]}`).digest('hex').slice(0, 8);
      // Reusar el audio si ya existe con el mismo texto (aunque la frase haya cambiado de lugar): no se paga dos veces.
      const dirL = join('public/audio', id, l);
      const previo = existsSync(dirL) ? readdirSync(dirL).find((n) => n.endsWith(`-${h}.wav`)) : undefined;
      const rel = previo ? `audio/${id}/${l}/${previo}` : `audio/${id}/${l}/${esc.id}-${j}-${h}.wav`, wav = join('public', rel);
      if (!existsSync(wav)) {
        mkdirSync(join('public/audio', id, l), { recursive: true });
        const crudo = conCB ? join(cbDir, `${h}.wav`) : wav.replace(/\.wav$/, conEleven ? '.mp3' : '.aiff');
        if (conCB) { if (!existsSync(crudo)) throw new Error(`Chatterbox no devolvió la frase ${h}`); }
        else if (conEleven) await eleven(texto[l], crudo);
        else execFileSync('say', ['-v', voz, '-r', String(vel), '-o', crudo, texto[l]]);
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', crudo, '-af', conCB ? 'highpass=f=60,loudnorm=I=-20:TP=-1.5:LRA=11' : conEleven ? 'highpass=f=60' : 'highpass=f=70,acompressor=threshold=-20dB:ratio=3,volume=1.6', '-ar', '48000', '-ac', '1', wav]);
        execFileSync('rm', [crudo]);
        process.stdout.write('.');
      }
      audio[l] = rel;
      segundos[l] = dur(wav);
    }
    return { texto, audio, segundos };
  }),
});

let tl = timelineMulti(escenas, undefined, g.formato === 'short' ? T_SHORT : undefined);
writeFileSync(join(dir, 'timeline.json'), JSON.stringify(tl));
// Narración más lenta y clara: estira los audios nuevos en inglés y recalcula el timeline.
if (idiomas.includes('en') && ralentizar(id) > 0) { retimear(id); tl = JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8')); }

// Índice de videos para el entry point de Remotion
const ids = readdirSync('src/videos').filter((d) => existsSync(join('src/videos', d, 'timeline.json'))).sort();
writeFileSync('src/motor/indice.ts', `// Generado por scripts/motor-narrar.mjs — no editar a mano.\n${ids.map((d, i) => `import g${i} from '../videos/${d}/guion.json';\nimport t${i} from '../videos/${d}/timeline.json';`).join('\n')}\n\nexport const VIDEOS: { guion: unknown; timeline: unknown }[] = [${ids.map((_, i) => `{ guion: g${i}, timeline: t${i} }`).join(', ')}];\n`);
console.log(`\n${id}: ${(tl.total / tl.fps / 60).toFixed(1)} min · ${idiomas.join(', ')}${caracteres ? ` · ElevenLabs: ${caracteres} caracteres` : ''}`);
