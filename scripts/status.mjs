// STATUS.md del canal, generado en GitHub Actions (workflow "status") y guardado en la rama "estado". Cero uso de Claude.
// Uso: node scripts/status.mjs <carpeta-estado>   → lee los registros de esa carpeta y escribe <carpeta>/STATUS.md
// Las funciones puras (tablas) se testean en test/status.test.mjs; la red (YouTube, Instagram, gh) se saltea si falla.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { tieneYouTube, tieneInstagram, tieneTiktok, esShort, esQuien, PLATAFORMAS } from './cola.mjs';

const REPO = 'matiasosuna/mitologias-render';
const NOMBRES = { griegas: 'Griegas', nordicas: 'Nórdicas', egipcias: 'Egipcias', hawaianas: 'Hawaianas', norteamericanas: 'Norteamericanas', aztecas: 'Aztecas', hindues: 'Hindúes', maories: 'Maoríes', balinesas: 'Balinesas' };
const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('es'));
const tabla = (cab, filas) => [`| ${cab.join(' | ')} |`, `| ${cab.map(() => '---').join(' | ')} |`, ...filas.map((f) => `| ${f.join(' | ')} |`)].join('\n');

/** Temporadas por mitología: episodios totales · publicados en YouTube · publicados en Instagram. */
export function tablaMitologias({ ids, titulos, tiene }) {
  const g = new Map();
  for (const id of ids.filter((x) => !esShort(x))) {
    const t = titulos[id], serie = id.split('-')[0];
    const temp = t?.especial ? `Especial ${t.especial}` : t?.temporada != null ? `T${t.temporada}` : 'sin título';
    const k = `${serie}|${temp}`;
    const r = g.get(k) ?? { serie, temp, total: 0, yt: 0, ig: 0 };
    r.total++; if (tiene.youtube.has(id)) r.yt++; if (tiene.instagram.has(id)) r.ig++;
    g.set(k, r);
  }
  const filas = [...g.values()].sort((a, b) => (Object.keys(NOMBRES).indexOf(a.serie) - Object.keys(NOMBRES).indexOf(b.serie)) || a.temp.localeCompare(b.temp));
  return tabla(['Mitología', 'Temporada', 'Episodios', 'YouTube', 'Instagram'], filas.map((r) => [NOMBRES[r.serie] ?? r.serie, r.temp, r.total, r.yt, r.ig]));
}

/** Lo próximo de la cola (no publicado en alguna plataforma) y cuántos "Who is…?" están listos. */
export function resumenCola({ cola, tiene, listo, n = 5 }) {
  const falta = (e) => PLATAFORMAS.some((p) => !tiene[p].has(e.id));
  const pendientes = cola.filter((e) => listo(e.id) && falta(e));
  const quien = cola.filter((e) => e.tipo === 'short' && esQuien(e.id) && listo(e.id));
  return { proximos: pendientes.slice(0, n), quienListos: quien.length, quienPendientes: quien.filter(falta).length };
}

export function tablaEstado({ publicar, ultimaCorrida, proximos, quienListos, quienPendientes, ultimoTurno }) {
  const filas = [
    ['publicar', publicar == null ? 'sin dato' : publicar ? 'activado' : 'desactivado'],
    ['Última corrida de publicar', ultimaCorrida ? `${ultimaCorrida.resultado ?? 'en curso'} · ${String(ultimaCorrida.fecha ?? '').slice(0, 16).replace('T', ' ')} UTC` : 'sin corridas'],
    ['Último turno registrado', ultimoTurno ?? '—'],
    ['Próximos de la cola', proximos.length ? proximos.map((e) => `${e.id}`).join('<br>') : 'nada pendiente'],
    ['"Who is…?" listos', `${quienListos} (${quienPendientes} sin publicar en alguna red)`],
  ];
  return tabla(['Qué', 'Estado'], filas);
}

export function tablaMetricas({ yt, ig }) {
  const filas = [
    ['YouTube', yt ? `${fmt(yt.suscriptores)} suscriptores · ${fmt(yt.vistas)} vistas · ${fmt(yt.videos)} videos` : 'sin datos'],
    ['Instagram', ig ? `${fmt(ig.seguidores)} seguidores · ${fmt(ig.likes)} likes · ${fmt(ig.vistas)} vistas (28 días)` : 'sin datos (token no disponible o sin permiso)'],
    ['TikTok', 'sin API'],
  ];
  return tabla(['Red', 'Métricas'], filas);
}

export function armarStatus(d) {
  return ['# Myths on Clay — estado', `_Actualizado ${d.fecha} UTC_`, '', '## Resumen', tablaEstado(d), '', '## Temporadas', d.mitologias, '', '## Métricas', tablaMetricas(d), ''].join('\n');
}

// ── red (todo tolerante a fallos)
const gh = (...a) => { try { return execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };
function datosPublicar() {
  const w = gh('api', `repos/${REPO}/actions/workflows/publicar.yml`, '-q', '.state');
  const r = gh('run', 'list', '-R', REPO, '--workflow', 'publicar.yml', '--limit', '1', '--json', 'conclusion,createdAt');
  const u = r ? JSON.parse(r)[0] : null;
  return { publicar: w == null ? null : w.trim() === 'active', ultimaCorrida: u ? { resultado: u.conclusion || null, fecha: u.createdAt } : null };
}
async function metricasYT() {
  try {
    if (!existsSync('.env') || !existsSync('.yt-token.json')) return null;
    const { api } = await import('./youtube-api.mjs');
    const s = (await api('GET', '/channels', { query: { part: 'statistics', mine: 'true' } })).items?.[0]?.statistics; // 1 unidad de cuota
    return s ? { suscriptores: s.subscriberCount, vistas: s.viewCount, videos: s.videoCount } : null;
  } catch (e) { console.log(`YouTube: ${String(e.message).slice(0, 120)}`); return null; }
}
async function metricasIG() {
  const t = process.env.MOC_PAGE_TOKEN, id = process.env.MOC_IG_USER_ID;
  if (!t || !id) return null;
  const g = async (ruta, q) => { const r = await (await fetch(`https://graph.facebook.com/v21.0${ruta}?${new URLSearchParams({ ...q, access_token: t })}`)).json(); if (r.error) throw new Error(r.error.message); return r; };
  try {
    const seguidores = (await g(`/${id}`, { fields: 'followers_count' })).followers_count;
    const out = { seguidores };
    const desde = String(Math.floor(Date.now() / 1000) - 28 * 864e2);
    try {
      const ins = await g(`/${id}/insights`, { metric: 'views,likes', metric_type: 'total_value', period: 'day', since: desde });
      for (const m of ins.data ?? []) out[m.name === 'views' ? 'vistas' : 'likes'] = m.total_value?.value;
    } catch (e) { console.log(`Instagram insights: ${String(e.message).slice(0, 120)}`); }
    return out;
  } catch (e) { console.log(`Instagram: ${String(e.message).slice(0, 120)}`); return null; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2];
  if (!dir || !existsSync(dir)) throw new Error('uso: node scripts/status.mjs <carpeta-estado>');
  const J = (f, def) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), 'utf8')) : def);
  const titulos = JSON.parse(readFileSync('src/videos/titulos.json', 'utf8'));
  const ytIds = J('youtube-ids.json', {}), cola = J('cola-unificada.json', []), turnos = J('turnos.json', []);
  const tiene = { youtube: tieneYouTube(ytIds, J('subidas-api.json', [])), instagram: tieneInstagram(J('subidas-instagram.json', [])), tiktok: tieneTiktok(J('subidas-buffer.json', [])) };
  const ids = readdirSync('src/videos').filter((d) => existsSync(join('src/videos', d, 'guion.json')));
  const listo = (id) => ['guion.json', 'timeline.json'].every((f) => existsSync(join('src/videos', id, f))) && (esShort(id) || Boolean(titulos[id]?.titulo));
  const c = resumenCola({ cola, tiene, listo });
  const md = armarStatus({
    fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
    ...datosPublicar(), ...c, ultimoTurno: turnos.at(-1)?.split('|').slice(0, 1)[0],
    mitologias: tablaMitologias({ ids, titulos, tiene }),
    yt: await metricasYT(), ig: await metricasIG(),
  });
  writeFileSync(join(dir, 'STATUS.md'), md);
  console.log(md);
}
