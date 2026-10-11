// Control de calidad de un video terminado, en dos capas:
//  1) ffmpeg (gratis): cuadros negros y congelados.
//  2) Gemini mira el video entero y lista problemas visuales con su minuto exacto.
// Uso: node scripts/qa-video.mjs <id> [--sin-gemini]   → out/<id>/qa.md
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const id = process.argv[2];
const video = join('out', id, `${id}.en.mp4`);
if (!existsSync(video)) throw new Error(`no existe ${video}`);
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const KEY = env.GEMINI_API_KEY;
const MODELO = env.GEMINI_QA_MODEL || 'gemini-2.5-flash';
const informe = [`# QA · ${id}`, ''];

// --- 1) ffmpeg ---
const ff = (filtro) => { try { return execFileSync('ffmpeg', ['-hide_banner', '-i', video, '-vf', filtro, '-an', '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return String(e.stderr || ''); } };
const salidaNegro = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${video}" -vf blackdetect=d=0.8:pix_th=0.08 -an -f null - 2>&1 | grep black_start || true`], { encoding: 'utf8' });
const salidaCongelado = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${video}" -vf freezedetect=n=0.001:d=6 -an -f null - 2>&1 | grep freeze_start || true`], { encoding: 'utf8' });
void ff;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const negros = [...salidaNegro.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => `${mmss(+m[1])}–${mmss(+m[2])}`);
const congelados = [...salidaCongelado.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => mmss(+m[1]));
informe.push('## ffmpeg', `- Pantalla negra (>0,8 s): ${negros.length ? negros.join(', ') : 'ninguna'}`, `- Imagen quieta (>6 s): ${congelados.length ? congelados.join(', ') : 'ninguna'}`, '');

// --- 2) Gemini ---
if (!process.argv.includes('--sin-gemini') && KEY) {
  const base = 'https://generativelanguage.googleapis.com';
  const bytes = statSync(video).size;
  const ini = await fetch(`${base}/upload/v1beta/files?key=${KEY}`, { method: 'POST', headers: { 'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start', 'X-Goog-Upload-Header-Content-Length': String(bytes), 'X-Goog-Upload-Header-Content-Type': 'video/mp4', 'Content-Type': 'application/json' }, body: JSON.stringify({ file: { display_name: id } }) });
  const url = ini.headers.get('x-goog-upload-url');
  if (!url) throw new Error(`no pude iniciar la subida: ${ini.status} ${await ini.text()}`);
  const sub = await (await fetch(url, { method: 'POST', headers: { 'Content-Length': String(bytes), 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' }, body: readFileSync(video) })).json();
  let file = sub.file;
  for (let i = 0; i < 60 && file.state !== 'ACTIVE'; i++) { await new Promise((r) => setTimeout(r, 5000)); file = await (await fetch(`${base}/v1beta/${file.name}?key=${KEY}`)).json(); if (file.state === 'FAILED') throw new Error('Gemini no pudo procesar el video'); }
  const guion = JSON.parse(readFileSync(join('src/videos', id, 'guion.json'), 'utf8'));
  const resumen = guion.escenas.map((e) => `- ${e.id}: ${e.frases.map((f) => f.en).join(' ')}`).join('\n');
  const prompt = `You are the quality checker for an animated mythology video in a hand-made 2D style (flat figures in profile, ornamental borders top and bottom, a dark subtitle strip at the very bottom that is intentionally empty). Watch the whole video and list ONLY real visual problems a viewer would notice, each with its MM:SS timestamp:
- something the narration mentions that is not visible on screen at that moment (compare with the script below);
- characters or labels cut off by the frame or the borders, overlapping each other, or unreadable;
- objects floating, misplaced, wrong size, or appearing before they should;
- long static moments where nothing moves;
- anything that looks broken or glitchy.
Do not comment on the art style itself or on audio quality. Be concrete and brief. If there are no problems, say "No problems found". Answer in Spanish.

Script (English narration per scene):
${resumen}`;
  // Reintenta si el modelo está saturado (503) y prueba modelos alternativos.
  let j = {}, usado = MODELO;
  for (const m of [MODELO, 'gemini-3-flash-preview', 'gemini-2.5-flash-lite']) {
    for (let intento = 0; intento < 3; intento++) {
      const r = await fetch(`${base}/v1beta/models/${m}:generateContent?key=${KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ file_data: { mime_type: 'video/mp4', file_uri: file.uri } }, { text: prompt }] }], generationConfig: { mediaResolution: 'MEDIA_RESOLUTION_LOW', temperature: 0.2 } }) });
      j = await r.json(); usado = m;
      if (r.ok || ![429, 500, 503].includes(r.status)) break;
      await new Promise((res) => setTimeout(res, 8000 * (intento + 1)));
    }
    if (j.candidates) break;
  }
  const texto = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? `Error: ${JSON.stringify(j.error ?? j).slice(0, 300)}`;
  informe.push(`## Gemini (${usado})`, texto.trim(), '', `_Tokens: ${j.usageMetadata?.totalTokenCount ?? '?'}_`);
  await fetch(`${base}/v1beta/${file.name}?key=${KEY}`, { method: 'DELETE' });
}
writeFileSync(join('out', id, 'qa.md'), informe.join('\n'));
console.log(informe.join('\n'));
