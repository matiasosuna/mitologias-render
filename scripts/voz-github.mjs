// Narra con Chatterbox en la CPU de GitHub (repo público, gratis): dispara voz-cpu.yml, espera y baja los .wav.
// Mismo contrato que `modal run scripts/modal_voz.py`: entrada [{h, texto}] → <salida>/<h>.wav.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, renameSync, mkdirSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const REPO = process.env.MOC_RENDER_REPO || 'matiasosuna/mitologias-render';
const gh = (args, opt = {}) => execFileSync('gh', args, { encoding: 'utf8', ...opt });
const esperar = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
/** Tandas que entran en un dispatch (los inputs suman ≤ 65 kB): de a 60 frases, gzip+base64. */
export const tandas = (frases, n = 60) => Array.from({ length: Math.ceil(frases.length / n) }, (_, i) => frases.slice(i * n, i * n + n));
export const empaquetar = (frases) => gzipSync(JSON.stringify(frases)).toString('base64');

export function narrarEnGithub(entrada, salida) {
  const frases = JSON.parse(readFileSync(entrada, 'utf8'));
  mkdirSync(salida, { recursive: true });
  const claves = tandas(frases).map((t) => {
    const clave = randomUUID().slice(0, 8);
    gh(['workflow', 'run', 'voz-cpu.yml', '-R', REPO, '-f', `clave=${clave}`, '-f', `frases=${empaquetar(t)}`]);
    return clave;
  });
  for (const clave of claves) {
    let id;
    for (let i = 0; i < 30 && !id; i++) { esperar(4000); id = gh(['run', 'list', '-R', REPO, '-w', 'voz-cpu', '-L', '20', '--json', 'databaseId,displayTitle', '-q', `.[] | select(.displayTitle == "voz ${clave}") | .databaseId`]).trim().split('\n')[0]; }
    if (!id) throw new Error(`voz-cpu: no apareció la corrida ${clave}`);
    console.log(`voz en GitHub: https://github.com/${REPO}/actions/runs/${id}`);
    try { gh(['run', 'watch', id, '-R', REPO, '--exit-status', '-i', '20'], { stdio: 'ignore' }); } catch { throw new Error(`voz-cpu ${id} falló`); }
    const tmp = join(salida, `.bajando-${clave}`);
    rmSync(tmp, { recursive: true, force: true });
    gh(['run', 'download', id, '-R', REPO, '-p', `voz-${clave}-*`, '-D', tmp]);
    for (const d of readdirSync(tmp)) for (const f of readdirSync(join(tmp, d))) renameSync(join(tmp, d, f), join(salida, f));
    rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`chatterbox (GitHub): ${frases.length} frases`);
}

if (import.meta.url === `file://${process.argv[1]}`) narrarEnGithub(process.env.VOZ_ENTRADA, process.env.VOZ_SALIDA);
