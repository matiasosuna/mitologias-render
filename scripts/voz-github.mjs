// Narra con Chatterbox en la CPU de GitHub (repo público, gratis): dispara voz-cpu.yml, espera y baja los .wav.
// Mismo contrato que `modal run scripts/modal_voz.py`: entrada [{h, texto}] → <salida>/<h>.wav.
// Con `gh` logueado: workflow_dispatch + artefactos. Sin `gh` (rutina de la nube): empuja el pedido a la rama "voz" del
// repo público (solo git, con plumbing: nada de checkout) y baja el zip del release "voz".
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, renameSync, mkdirSync, rmSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

const REPO = process.env.MOC_RENDER_REPO || 'matiasosuna/mitologias-render';
const gh = (args, opt = {}) => execFileSync('gh', args, { encoding: 'utf8', ...opt });
const esperar = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
/** Tandas que entran en un dispatch (los inputs suman ≤ 65 kB): de a 60 frases, gzip+base64. */
export const tandas = (frases, n = 60) => Array.from({ length: Math.ceil(frases.length / n) }, (_, i) => frases.slice(i * n, i * n + n));
export const empaquetar = (frases) => gzipSync(JSON.stringify(frases)).toString('base64');

const conGh = () => { if (process.env.VOZ_TRANSPORTE === 'git') return false; try { gh(['auth', 'status'], { stdio: 'ignore' }); return true; } catch { return false; } };

/** Sin gh: commit (main + pedidos/<clave>.json) empujado a la rama "voz"; el workflow sube voz-<clave>.zip al release "voz". */
function porGit(frases, salida) {
  const dest = process.env.MOC_RENDER_DIR || join(homedir(), 'Projects/mitologias-render');
  if (!existsSync(join(dest, '.git'))) throw new Error(`voz: no está el clon del repo público en ${dest} (MOC_RENDER_DIR)`);
  const git = (args, opt = {}) => execFileSync('git', ['-C', dest, ...args], { encoding: 'utf8', ...opt }).trim();
  const clave = randomUUID().slice(0, 8), tmp = mkdtempSync(join(tmpdir(), 'voz-'));
  writeFileSync(join(tmp, 'p.json'), JSON.stringify(frases));
  git(['fetch', '-q', 'origin', 'main']);
  const blob = git(['hash-object', '-w', join(tmp, 'p.json')]), env = { ...process.env, GIT_INDEX_FILE: join(tmp, 'index') };
  git(['read-tree', 'origin/main'], { env });
  git(['update-index', '--add', '--cacheinfo', `100644,${blob},pedidos/${clave}.json`], { env });
  const arbol = git(['write-tree'], { env });
  const commit = git(['-c', 'user.name=voz', '-c', 'user.email=voz@users.noreply.github.com', 'commit-tree', arbol, '-p', 'origin/main', '-m', `voz ${clave}`]);
  git(['push', '-q', '-f', 'origin', `${commit}:refs/heads/voz`]);
  const url = `https://github.com/${REPO}/releases/download/voz/voz-${clave}.zip`;
  console.log(`voz en GitHub (pedido ${clave}): esperando ${url}`);
  const zip = join(tmp, 'v.zip');
  for (let i = 0; ; i++) {
    if (i > 360) throw new Error(`voz: el pedido ${clave} no terminó en 3 h (mirá Actions › voz-cpu)`);
    esperar(30000);
    try { execFileSync('curl', ['-fsSL', '--retry', '2', '-o', zip, url], { stdio: 'ignore' }); break; } catch { /* todavía no */ }
  }
  execFileSync('python3', ['-m', 'zipfile', '-e', zip, salida]);
  rmSync(tmp, { recursive: true, force: true });
}

export function narrarEnGithub(entrada, salida) {
  const frases = JSON.parse(readFileSync(entrada, 'utf8'));
  mkdirSync(salida, { recursive: true });
  if (!conGh()) { porGit(frases, salida); return console.log(`chatterbox (GitHub, por git): ${frases.length} frases`); }
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
