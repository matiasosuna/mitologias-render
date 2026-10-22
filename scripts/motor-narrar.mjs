// Narra un guion visual en varios idiomas (voces de macOS, gratis) y genera su timeline.
// Uso: node scripts/motor-narrar.mjs griegas-02-prometeo [es,pt,en]
// Nube (Linux, sin `say`): VOZ_EN=chatterbox node scripts/motor-narrar.mjs <id> en   (Modal: MODAL_BIN o `modal` del PATH)
// Reutiliza los audios ya generados si el texto no cambió.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, basename } from 'node:path';
import { ralentizar, retimear } from './narracion-lenta.mjs';
import { timelineMulti } from '../lib/motor-tiempos.mjs';
import { tiemposShort } from '../lib/quien.mjs';
import { escenasDe, procesoAudio } from '../lib/short.mjs';
import { leerEnv, usaChatterbox, binModal, motorDeVoz } from '../lib/voz-config.mjs';
import { piezasMarco, marcoTimeline } from '../lib/marco.mjs';

// Inglés: tu voz clonada en ElevenLabs (si hay clave en .env); el resto, voces de macOS gratis.
// En la nube no hay .env: las variables del entorno mandan (VOZ_EN, MODAL_BIN).
const ENV = leerEnv(existsSync('.env') ? readFileSync('.env', 'utf8') : '');
const ELEVEN = ENV.ELEVENLABS_API_KEY && ENV.ELEVENLABS_VOICE_ID ? { key: ENV.ELEVENLABS_API_KEY, voz: ENV.ELEVENLABS_VOICE_ID, modelo: ENV.ELEVENLABS_MODEL ?? 'eleven_flash_v2_5', velocidad: Number(ENV.ELEVENLABS_SPEED ?? 1) } : null;
const VOZ = { es: ['Paulina', 168], pt: ['Luciana', 175], en: ['Samantha', 170] };
// VOZ_EN=chatterbox en .env → inglés con Chatterbox (gratis, GPU de Modal, scripts/modal_voz.py) en vez de ElevenLabs.
const CHATTER = usaChatterbox(process.env, ENV);
const vacio = (f) => existsSync(f) && statSync(f).size === 0;
// Borra un .wav vacío y lo saca del registro de tempo (si no, el nuevo no se llevaría al tempo de su formato).
function borrarVacio(wav) {
  rmSync(wav);
  const reg = join(dirname(wav), '.tempo.json');
  if (!existsSync(reg)) return;
  const hechos = JSON.parse(readFileSync(reg, 'utf8'));
  delete hechos[basename(wav)];
  writeFileSync(reg, JSON.stringify(hechos, null, 1));
}
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
const ESCENAS = escenasDe(g); // con cold open (Shorts), va primero
const MARCO = piezasMarco(g); // Learn Bible: gancho, invitación y final (lib/marco.mjs); se narran igual pero van aparte en el timeline
const dur = (wav) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]).toString());

// Chatterbox: genera de una vez (una sola máquina con GPU) todas las frases en inglés que todavía no tienen audio.
const cbDir = join('out', '.voz', id);
if (CHATTER && idiomas.includes('en')) {
  const dirEn = join('public/audio', id, 'en');
  // un .wav de 0 bytes (corte de Modal) cuenta como faltante: se borra y se vuelve a narrar
  if (existsSync(dirEn)) for (const n of readdirSync(dirEn)) if (n.endsWith('.wav') && vacio(join(dirEn, n))) borrarVacio(join(dirEn, n));
  const hechos = existsSync(dirEn) ? readdirSync(dirEn) : [];
  const faltan = [...ESCENAS, ...MARCO].flatMap((e) => e.frases).filter((t) => t.en).map((t) => ({ h: createHash('sha1').update(`${CB[0]}|${CB[1]}|${t.en}`).digest('hex').slice(0, 8), texto: t.en }))
    .filter((f, i, a) => a.findIndex((x) => x.h === f.h) === i && !hechos.some((n) => n.endsWith(`-${f.h}.wav`)));
  if (faltan.length) {
    mkdirSync(cbDir, { recursive: true });
    writeFileSync(join(cbDir, 'entrada.json'), JSON.stringify(faltan));
    execFileSync(binModal({ ...ENV, ...process.env }, existsSync), ['run', 'scripts/modal_voz.py'], { timeout: 20 * 60 * 1000, killSignal: 'SIGINT', stdio: 'inherit', env: { ...process.env, VOZ_ENTRADA: join(cbDir, 'entrada.json'), VOZ_SALIDA: cbDir } });
  }
}

const escenas = [];
for (const esc of [...ESCENAS, ...MARCO]) escenas.push({
  id: esc.id,
  frases: await enOrden(esc.frases, async (texto, j) => {
    const audio = {}, segundos = {};
    for (const l of idiomas) {
      if (!texto[l]) continue;
      const motor = motorDeVoz(l, { chatter: CHATTER, eleven: !!ELEVEN, plataforma: process.platform });
      const conCB = motor === 'chatterbox', conEleven = motor === 'eleven';
      const [voz, vel] = conCB ? CB : conEleven ? [ELEVEN.voz + ELEVEN.modelo, ELEVEN.velocidad] : VOZ[l];
      const h = createHash('sha1').update(`${voz}|${vel}|${texto[l]}`).digest('hex').slice(0, 8);
      // Reusar el audio si ya existe con el mismo texto (aunque la frase haya cambiado de lugar): no se paga dos veces.
      const dirL = join('public/audio', id, l);
      const previo = existsSync(dirL) ? readdirSync(dirL).find((n) => n.endsWith(`-${h}.wav`) && !vacio(join(dirL, n))) : undefined;
      const rel = previo ? `audio/${id}/${l}/${previo}` : `audio/${id}/${l}/${esc.id}-${j}-${h}.wav`, wav = join('public', rel);
      if (vacio(wav)) borrarVacio(wav);
      if (!existsSync(wav)) {
        mkdirSync(join('public/audio', id, l), { recursive: true });
        const crudo = conCB ? join(cbDir, `${h}.wav`) : wav.replace(/\.wav$/, conEleven ? '.mp3' : '.aiff');
        if (conCB) { if (!existsSync(crudo) || vacio(crudo)) throw new Error(`Chatterbox no devolvió la frase ${h} (volvé a correr motor-narrar)`); }
        else if (conEleven) await eleven(texto[l], crudo);
        else execFileSync('say', ['-v', voz, '-r', String(vel), '-o', crudo, texto[l]]);
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', crudo, '-af', conCB ? 'highpass=f=60,loudnorm=I=-20:TP=-1.5:LRA=11' : conEleven ? 'highpass=f=60' : 'highpass=f=70,acompressor=threshold=-20dB:ratio=3,volume=1.6', '-ar', '48000', '-ac', '1', wav]);
        rmSync(crudo);
        if (vacio(wav)) { borrarVacio(wav); throw new Error(`audio vacío: ${wav} (volvé a correr motor-narrar)`); }
        process.stdout.write('.');
      }
      audio[l] = rel;
      segundos[l] = dur(wav);
    }
    return { texto, audio, segundos };
  }),
});

const narradasMarco = escenas.splice(ESCENAS.length);
let tl = timelineMulti(escenas, undefined, g.formato === 'short' ? tiemposShort(g) : undefined);
if (narradasMarco.length) tl.marco = marcoTimeline(narradasMarco.map((n, i) => ({ ...n, pausas: MARCO[i].pausas, pausaFinal: MARCO[i].pausaFinal })), tl.fps);
writeFileSync(join(dir, 'timeline.json'), JSON.stringify(tl));
// Inglés al tempo de su formato (episodios 0,9× más claros; Shorts 1,1× y sin silencios en las puntas) y timeline de nuevo.
// .tempo.json sabe qué tiene cada archivo: si el texto no cambió pero el tempo sí, se re-estira solo la diferencia.
if (idiomas.includes('en') && ralentizar(id, procesoAudio(g)) > 0) { retimear(id); tl = JSON.parse(readFileSync(join(dir, 'timeline.json'), 'utf8')); }
// Shorts: sacar los audios que ya no usa (texto viejo), así no viajan al render.
if (g.formato === 'short') for (const l of idiomas) {
  const dirL = join('public/audio', id, l);
  if (!existsSync(dirL)) continue;
  const usados = new Set(tl.escenas.flatMap((e) => e.frases.map((fr) => fr.audio[l])).filter(Boolean).map((r) => basename(r)));
  const reg = join(dirL, '.tempo.json'), hechos = existsSync(reg) ? JSON.parse(readFileSync(reg, 'utf8')) : null;
  for (const n of readdirSync(dirL)) if (n.endsWith('.wav') && !usados.has(n)) { rmSync(join(dirL, n)); if (hechos) delete hechos[n]; }
  if (hechos) writeFileSync(reg, JSON.stringify(hechos, null, 1));
}

// Índice de videos para el entry point de Remotion
const ids = readdirSync('src/videos').filter((d) => existsSync(join('src/videos', d, 'timeline.json'))).sort();
writeFileSync('src/motor/indice.ts', `// Generado por scripts/motor-narrar.mjs — no editar a mano.\n${ids.map((d, i) => `import g${i} from '../videos/${d}/guion.json';\nimport t${i} from '../videos/${d}/timeline.json';`).join('\n')}\n\nexport const VIDEOS: { guion: unknown; timeline: unknown }[] = [${ids.map((_, i) => `{ guion: g${i}, timeline: t${i} }`).join(', ')}];\n`);
console.log(`\n${id}: ${(tl.total / tl.fps / 60).toFixed(1)} min · ${idiomas.join(', ')}${caracteres ? ` · ElevenLabs: ${caracteres} caracteres` : ''}`);
