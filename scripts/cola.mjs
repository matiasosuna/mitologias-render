// Cola ÚNICA de publicación (pedido de Matías 2026-10-17): una sola lista ordenada para YouTube, Instagram y TikTok,
// guardada en la rama "estado" (cola-unificada.json). Lógica pura (sin red ni disco): la usan scripts/nube.mjs y los tests.
//
// Lista: los episodios en el orden en que YouTube los publicó (T1 griega, nórdica, egipcia, especiales, T1 hawaiana,
// T2 griega, T2 nórdica, T2 egipcia), después lo que falta (resto de T2 griega, Odisea, Stories griegas, resto de T1 en el
// orden de series de siempre) con un "Who is…?" detrás de cada episodio. Las mini historias viejas NO entran.
// Formato por plataforma: episodio → YouTube horizontal · Instagram en partes · TikTok vertical completo; Short → Short.
//
// Turnos (cada 4 h; HST): 08 = episodio · 12, 16 y 20 = Biblia (Who-is en pausa desde 2026-10-22) · 00 y 04 = solo para alcanzar.
//  - ALCANZAR (alguna plataforma tiene menos episodios de la lista que la que va adelante, hoy YouTube): la que va
//    adelante NO publica episodios; las atrasadas publican hasta 4 episodios por turno (los que les faltan, en orden)
//    hasta llegar. Los "Who is…?" salen igual en sus turnos, a las tres juntas.
//  - PAREJO: por día 1 episodio (turno de las 08) + 2 "Who is…?" (12 y 20), lo mismo en las tres.
// Todo se decide con lo publicado ANTES de empezar el turno: el orden en que corren las plataformas no cambia el plan.
// "Who is…?" horizontal (solo YouTube, video normal 16:9 en la lista "<Mitología>: Who's Who"): sale en el MISMO turno que
// su Short (horizontalTurno). Parejo en YouTube: por día 1 episodio + 2 "Who is…?" Shorts + 2 "Who is…?" horizontales.

export const PLATAFORMAS = ['youtube', 'instagram', 'tiktok'];
/** Las que marcan el ritmo; TikTok las sigue sin frenarlas. */
export const PRINCIPALES = ['youtube', 'instagram'];
export const FORMATOS = {
  episodio: { youtube: 'horizontal', instagram: 'partes', tiktok: 'vertical' },
  short: { youtube: 'short', instagram: 'short', tiktok: 'short' },
};
/** Shorts que entran a la cola además de los "Who is…?". Vacío: el de todos los dioses juntos NO (2026-10-19: un capítulo por dios). */
export const SHORTS_EXTRA = [];
export const esShort = (id) => id.startsWith('short-');
export const esQuien = (id) => /^short-[a-z]+-quien-[a-z0-9-]+$/.test(id) || SHORTS_EXTRA.includes(id);
export const tipoDe = (id) => (esShort(id) ? 'short' : 'episodio');
export const entrada = (id) => ({ id, tipo: tipoDe(id), formato: FORMATOS[tipoDe(id)] });

// ── turnos: 6 por día, a las 2, 6, 10, 14, 18 y 22 UTC = 16, 20, 00, 04, 08 y 12 HST (UTC−10)
export const HORAS_UTC = [2, 6, 10, 14, 18, 22];
export const EPISODIO_HST = 8;
// Matías 2026-10-22: Who-is EN PAUSA; esos turnos (y el de las 16) son para la temporada de la Biblia, 3 capítulos por día.
export const QUIEN_HST = [];
export const BIBLIA_HST = [12, 16, 20];
export const esBiblia = (id) => id.startsWith('biblia-');
export const horaHST = (horaUTC) => (horaUTC + 14) % 24;
/** 'episodio' | 'quien' | 'biblia' | 'alcanzar' (turno que solo usan las plataformas atrasadas). */
export function clase(horaUTC) {
  const h = horaHST(horaUTC);
  return h === EPISODIO_HST ? 'episodio' : QUIEN_HST.includes(h) ? 'quien' : BIBLIA_HST.includes(h) ? 'biblia' : 'alcanzar';
}

// Tope por turno mientras alcanzan (episodios) y topes por 24 h (publicaciones; en Instagram cuenta cada parte).
export const MAX_ALCANZAR = { youtube: 2, instagram: 4, tiktok: 1 }; // TikTok de a 1: con 4 por turno TikTok frenó la cuenta 24 h (2026-10-19)
export const MAX_TIKTOK_FRENADO = 1; // si TikTok/Buffer rechaza o limita: 1 por turno
export const TOPE_24H = { youtube: 9, instagram: 90, tiktok: 30 }; // IG: content_publishing_limit = 100
export const TOPE_COLA_BUFFER = 10;

// ── armar la lista
/** Orden de los grupos ya publicados en YouTube (serie-temporada; especiales juntos, en el orden en que se subieron). */
export const GRUPOS_PUBLICADOS = ['griegas-1', 'nordicas-1', 'egipcias-1', 'especial', 'hawaianas-1', 'griegas-2', 'nordicas-2', 'egipcias-2'];
export const STORIES_GRIEGAS = ['griegas-80-perseo-y-medusa', 'griegas-81-teseo-y-el-minotauro', 'griegas-82-persefone-y-la-granada', 'griegas-83-heracles-trabajos-1',
  'griegas-84-dedalo-e-icaro', 'griegas-85-el-rey-midas', 'griegas-86-heracles-trabajos-2', 'griegas-87-aracne', 'griegas-88-jason-y-el-vellocino', 'griegas-89-eco-y-narciso'];
/** Lo que sigue (no está en YouTube): foco griego primero, después el resto de las T1 como antes. */
// Solo temporadas (Matías 2026-10-22: nada de la Odisea ni Greek Myth Stories; especiales nuevos solo con su OK).
export const CONTINUACION = [['griegas', 2], ...['hawaianas', 'norteamericanas', 'aztecas', 'hindues', 'maories', 'balinesas'].map((s) => [s, 1]), ['biblia', 1]];

const grupoDe = (id, t) => (t?.especial ? 'especial' : `${id.split('-')[0]}-${t?.temporada}`);
const porEpisodio = (titulos) => (a, b) => (titulos[a]?.episodio ?? 0) - (titulos[b]?.episodio ?? 0) || a.localeCompare(b);

/** Lista nueva. titulos: src/videos/titulos.json · ytIds: youtube-ids.json (en orden de subida) · quien: ids de Shorts
 *  "Who is…?" en orden · stories: Stories griegas planeadas (pueden no existir todavía). */
export function construirCola({ titulos, ytIds, quien = [], stories = STORIES_GRIEGAS }) {
  const subidos = Object.keys(ytIds).filter((id) => !esShort(id));
  const orden = new Map(subidos.map((id, i) => [id, i]));
  const g = (id) => GRUPOS_PUBLICADOS.indexOf(grupoDe(id, titulos[id]));
  const publicados = [...subidos].sort((a, b) => {
    const ga = g(a) < 0 ? 99 : g(a), gb = g(b) < 0 ? 99 : g(b);
    if (ga !== gb) return ga - gb;
    if (ga === 99 || grupoDe(a, titulos[a]) === 'especial') return orden.get(a) - orden.get(b);
    return porEpisodio(titulos)(a, b);
  });
  const ya = new Set(publicados);
  const resto = [];
  for (const [s, t] of CONTINUACION) {
    let ids;
    if (s === 'stories') ids = stories;
    else if (s === 'especial') ids = Object.keys(titulos).filter((id) => titulos[id].especial === t).sort(porEpisodio(titulos));
    else ids = Object.keys(titulos).filter((id) => id.startsWith(`${s}-`) && !titulos[id].especial && titulos[id].temporada === t).sort(porEpisodio(titulos));
    for (const id of ids) if (!ya.has(id)) { ya.add(id); resto.push(id); }
  }
  const q = [...new Set(quien)].filter(esQuien);
  const cola = publicados.map(entrada);
  resto.forEach((id, i) => { cola.push(entrada(id)); if (q[i]) cola.push(entrada(q[i])); });
  for (const id of q.slice(resto.length)) cola.push(entrada(id));
  return cola;
}

/** La lista guardada manda (no se reordena); lo nuevo se agrega al final, en el orden de `nueva`. */
export function actualizarCola(guardada, nueva) {
  if (!guardada?.length) return nueva;
  const ya = new Set(guardada.map((e) => e.id));
  return [...guardada, ...nueva.filter((e) => !ya.has(e.id))];
}

// ── qué tiene cada plataforma: Map id → fecha (ms) en que lo completó
const ms = (f) => (f ? Date.parse(f) || 0 : 0);
const poner = (m, id, f) => { if (id && (!m.has(id) || m.get(id) < f)) m.set(id, f); };

/** YouTube: youtube-ids (episodios y Shorts) + el registro de la API (fecha de subida). */
export function tieneYouTube(ytIds, api = []) {
  const m = new Map(Object.keys(ytIds).map((id) => [id, 0]));
  for (const h of api) if (m.has(h.id) || h.video) poner(m, h.id, ms(h.fecha));
  return m;
}
/** Instagram: Shorts por archivo; episodios completos (todas sus partes, o el Reel entero/apaisado de antes). */
export function tieneInstagram(hist = []) {
  const m = new Map(), partes = new Map();
  for (const h of hist) {
    const f = ms(h.fecha);
    if (h.archivo) { const s = h.archivo.match(/^out\/([^/]+)\/\1\.mp4$/); if (s) poner(m, s[1], f); }
    if (['reel-episodio', 'reel-apaisado-a-archivar'].includes(h.tipo)) poner(m, h.id, f);
    if (h.tipo === 'reel-parte') {
      const p = partes.get(h.id) ?? { de: h.de, hechas: new Set(), f: 0 };
      p.hechas.add(h.parte); p.de = h.de ?? p.de; p.f = Math.max(p.f, f); partes.set(h.id, p);
    }
  }
  for (const [id, p] of partes) if (p.de && p.hechas.size >= p.de) poner(m, id, p.f);
  return m;
}
/** Partes de un episodio ya publicadas en Instagram. */
export const partesHechasIG = (hist, id) => new Set(hist.filter((h) => h.tipo === 'reel-parte' && h.id === id).map((h) => h.parte));
/** TikTok (Buffer): todo lo anotado en subidas-buffer.json (Shorts viejos programados, episodios y Shorts nuevos). */
export function tieneTiktok(buf = []) {
  const m = new Map();
  for (const h of buf) poner(m, h.id, ms(h.fecha ?? h.dueAt));
  return m;
}

/** Partes que va a tener un episodio en Instagram (lo mismo que vertical-partes.mjs: < 175 s de contenido por parte). */
export const partesEstimadas = (tl) => (tl ? Math.max(1, Math.ceil((tl.total - (tl.outroFrames ?? 0) + 3 * tl.fps) / (175 * tl.fps))) : 3);

// ── plan del turno
/** Índice del primer episodio de `eps` que no tiene (según `tiene(id)`). */
export const puntero = (eps, tiene) => { const i = eps.findIndex((e) => !tiene(e.id)); return i < 0 ? eps.length : i; };

/** Estado de la cola al empezar el turno: punteros de episodios por plataforma, la que va adelante y si están parejas. */
export function estadoCola({ cola, tiene, listo = () => true, inicio = Infinity }) {
  const antes = (p) => (id) => tiene[p].has(id) && tiene[p].get(id) < inicio;
  const eps = cola.filter((e) => e.tipo === 'episodio' && !esBiblia(e.id) && listo(e.id)); // la Biblia va por sus turnos
  const punteros = Object.fromEntries(PLATAFORMAS.map((p) => [p, puntero(eps, antes(p))]));
  const lider = Math.max(...Object.values(punteros));
  return { eps, punteros, lider, parejo: PLATAFORMAS.every((p) => punteros[p] === lider), antes };
}

/** Qué publica `plataforma` en este turno (ids en orden: primero el "Who is…?", después los episodios).
 *  max: tope de episodios por turno mientras alcanza. */
export function planTurno({ cola, tiene, plataforma, clase: c, listo = () => true, inicio = Infinity, max = MAX_ALCANZAR[plataforma] }) {
  const { eps, punteros, lider, parejo, antes } = estadoCola({ cola, tiene, listo, inicio });
  const ahora = (id) => tiene[plataforma].has(id);
  const ids = [];
  if (c === 'quien') {
    // el próximo "Who is…?" que le falta a alguna, a las tres juntas
    const q = cola.find((e) => e.tipo === 'short' && listo(e.id) && PLATAFORMAS.some((p) => !antes(p)(e.id)));
    if (q && !ahora(q.id)) ids.push(q.id);
  }
  if (c === 'biblia') {
    // el próximo capítulo de la Biblia que le falta a esta plataforma (cada una a su ritmo, de a uno por turno)
    const b = cola.find((e) => esBiblia(e.id) && listo(e.id) && !antes(plataforma)(e.id));
    if (b && !ahora(b.id)) ids.push(b.id);
  }
  // YouTube e Instagram marcan el ritmo entre ellas; TikTok alcanza por su cuenta y nunca las frena (2026-10-20)
  const grupo = plataforma === 'tiktok' ? PLATAFORMAS : PRINCIPALES;
  const liderG = Math.max(...grupo.map((p) => punteros[p])), parejoG = grupo.every((p) => punteros[p] === liderG);
  if (!parejoG) {
    // alcanzar: solo las atrasadas, hasta `max` de lo que les falta antes del puntero de la que va adelante
    if (punteros[plataforma] < liderG) ids.push(...eps.slice(0, liderG).filter((e) => !antes(plataforma)(e.id)).slice(0, max).map((e) => e.id).filter((id) => !ahora(id)));
  } else if (c === 'episodio' && liderG < eps.length && !ahora(eps[liderG].id)) ids.push(eps[liderG].id);
  return { ids, parejo, punteros, lider };
}

/** Clave de la versión horizontal de un "Who is…?" en youtube-ids.json (el Short ocupa la del id). */
export const claveHorizontal = (id) => `${id}-horizontal`;
/** "Who is…?" cuya versión horizontal sube YouTube en este turno (o null): solo en turnos de "Who is…?"; el del Short
 *  del plan y, si el plan no trae uno, el más viejo de la cola cuyo Short ya está en YouTube y su horizontal no
 *  (reintento). Uno por turno → 2 por día. conHorizontal(id): el guion tiene versión 16:9 (Short con `quien`). */
export function horizontalTurno({ cola, tieneYT, ytIds, ids = [], clase: c, conHorizontal }) {
  if (c !== 'quien') return null;
  const falta = (id) => esShort(id) && conHorizontal(id) && !ytIds[claveHorizontal(id)];
  return ids.find(falta) ?? cola.find((e) => tieneYT.has(e.id) && falta(e.id))?.id ?? null;
}

/** Recorta el plan a lo que entra en el tope de 24 h (en orden; corta en el primero que no entra). */
export function limitar(ids, costo, usados, tope) {
  const out = [];
  let n = usados;
  for (const id of ids) { if (n + costo(id) > tope) break; n += costo(id); out.push(id); }
  return out;
}
/** Publicaciones en las últimas 24 h de un registro (fecha o dueAt ya pasado). */
export const usadas24h = (reg, ahora = Date.now(), filtro = () => true) =>
  reg.filter((h) => filtro(h) && (() => { const f = ms(h.fecha ?? h.dueAt); return f > ahora - 864e5 && f <= ahora; })()).length;
