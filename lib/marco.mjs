// Learn Bible 777: "marco" del capítulo = gancho + invitación al principio y una invitación final, narrados con la misma
// voz (scripts/motor-narrar.mjs, cacheados) y mostrados como el versículo, pero sin referencia (no son texto bíblico).
// Solo actúa si el guion trae los campos; los episodios de Myths no cambian.
//   guion.reels   = { ganchos: [{en}, …] (uno por parte), invitacion: {en}, final: {en} }
//     → parte n de los Reels: abre con ganchos[n-1] + invitacion y cierra con final.
//   guion.youtube = { gancho?: {en} (por defecto reels.ganchos[0]), invitacion: {en}, final: {en} }
//     → horizontal: después de la portada (antes de la primera frase del capítulo) y al final, antes de la pantalla final.
// timeline.json guarda cada pieza narrada en `marco`: { [pieza]: { frases: [{ texto, audio, dur }], pausas: [s] } }.
//   reels.pausas = { "<frase>": s } silencio después de esa frase en los ganchos; reels.tempos = { gancho, invitacion, final } tempo extra
//   (atempo, mismo tono); los silencios internos del marco quedan en ≤ SILENCIO_MAX.

/** Pausas (s) del marco, como en Hermes Tarot (hermes-videos/scripts/b2-armar.py): gancho → invitación, invitación → capítulo,
 *  antes del final; `entrada` = antes de la primera voz, `salida` = después de la última. */
export const T_MARCO = { entrada: 0.7, ganchoInvitacion: 0.3, invitacionCapitulo: 0.3, antesFinal: 0.5, salida: 1.0 };

/** Parte el texto en trozos que se narran aparte, cortando después de cada frase de `pausas` ({ "It isn't like that.": 0.7 }):
 *  [{ en, pausa }] (pausa = silencio después del trozo; en el último, 0 o la de su frase si termina con una). */
export function trozos(texto, pausas = {}) {
  const out = [];
  let resto = texto;
  for (;;) {
    let mejor = null;
    for (const [frase, s] of Object.entries(pausas)) { const i = resto.indexOf(frase); if (i >= 0 && (!mejor || i < mejor.i)) mejor = { i: i + frase.length, s }; }
    if (!mejor) break;
    if (mejor.i >= resto.trimEnd().length) { out.push({ en: resto.trim(), pausa: mejor.s }); return out.filter((t) => t.en); } // al final: pausa después de la pieza
    out.push({ en: resto.slice(0, mejor.i).trim(), pausa: mejor.s });
    resto = resto.slice(mejor.i);
  }
  out.push({ en: resto.trim(), pausa: 0 });
  return out.filter((t) => t.en);
}

/** Piezas narrables: [{ id, frases: [{ en }], pausas: [s] }]. Los ganchos se parten en trozos con sus pausas (reels.pausas).
 *  Vacío si el guion no trae marco. */
export function piezasMarco(g) {
  const r = g?.reels ?? {}, y = g?.youtube ?? {};
  const pieza = (id, t, pausas) => { const tr = trozos(t?.en ?? '', pausas); return { id, frases: tr.map((x) => ({ en: x.en })), pausas: tr.slice(0, -1).map((x) => x.pausa), ...(tr.at(-1)?.pausa ? { pausaFinal: tr.at(-1).pausa } : {}) }; };
  const p = [];
  (r.ganchos ?? []).forEach((t, i) => p.push(pieza(`reels-gancho-${i + 1}`, t, r.pausas)));
  if (r.invitacion) p.push(pieza('reels-invitacion', r.invitacion));
  if (r.final) p.push(pieza('reels-final', r.final));
  if (y.gancho) p.push(pieza('youtube-gancho', y.gancho, r.pausas));
  if (y.invitacion) p.push(pieza('youtube-invitacion', y.invitacion));
  if (y.final) p.push(pieza('youtube-final', y.final));
  return p.filter((x) => x.frases[0]?.en);
}

/** Silencio máximo (s) que queda adentro de un audio del marco. */
export const SILENCIO_MAX = 0.3; // medido después (silencedetect, -42 dB) da ≤ 0,35 s
const PARTE = /^(?:reels|youtube)-(gancho|invitacion|final)-/;

/** Proceso de un .wav del marco: { tempo (extra, reels.tempos.<gancho|invitacion|final>), compactar } o null si no es del marco. */
export function procesoMarco(g, archivo) {
  const m = archivo.match(PARTE);
  if (!m || !g?.reels) return null;
  return { tempo: g.reels.tempos?.[m[1]] ?? 1, compactar: SILENCIO_MAX };
}
/** Tempo extra de un audio del marco (1 = ninguno). */
export const tempoExtra = (g, archivo) => procesoMarco(g, archivo)?.tempo ?? 1;

/** Filtro ffmpeg (-filter_complex) para llevar un .wav del marco de `prev` (.tempo.json: número o { tempo, compactar }) a `obj`
 *  (tempo total y compactar); null si ya está. `silencios` = [[ini, fin], …] medidos con silencedetect (-42 dB): cada uno más
 *  largo que compactar queda en compactar s (atrim + concat; silenceremove y aselect de ffmpeg 8 no los acortan). Después el atempo. */
export function filtroMarco(prev, obj, silencios = []) {
  const p = prev == null ? { tempo: 1 } : typeof prev === 'number' ? { tempo: prev } : prev;
  const atempo = Math.abs(obj.tempo - (p.tempo ?? 1)) < 1e-6 ? null : Number((obj.tempo / (p.tempo ?? 1)).toFixed(6));
  const c = obj.compactar, largos = c ? silencios.filter(([i, f]) => f - i > c + 0.02) : [];
  if (!atempo && !largos.length) return null;
  const tm = atempo ? `,atempo=${atempo}` : '';
  if (!largos.length) return `[0:a]atempo=${atempo}`;
  const x = (v) => v.toFixed(4), cortes = [0, ...largos.flatMap(([i, f]) => [i + c / 2, f - c / 2]), null];
  const n = largos.length + 1, tramos = [];
  for (let k = 0; k < n; k++) {
    const [ini, fin] = [cortes[2 * k], cortes[2 * k + 1]];
    tramos.push(`[i${k}]atrim=${[ini ? `start=${x(ini)}` : '', fin != null ? `end=${x(fin)}` : ''].filter(Boolean).join(':')},asetpts=PTS-STARTPTS[a${k}]`);
  }
  return `[0:a]asplit=${n}${Array.from({ length: n }, (_, k) => `[i${k}]`).join('')};${tramos.join(';')};${Array.from({ length: n }, (_, k) => `[a${k}]`).join('')}concat=n=${n}:v=0:a=1${tm}`;
}

/** Silencios [[ini, fin]] de la salida de `ffmpeg -af silencedetect` (stderr). */
export function silenciosDe(log) {
  const out = []; let ini = null;
  for (const m of log.matchAll(/silence_(start|end): (-?[\d.]+)/g)) { if (m[1] === 'start') ini = Math.max(0, Number(m[2])); else if (ini != null) { out.push([ini, Number(m[2])]); ini = null; } }
  return out;
}

/** `marco` del timeline a partir de las piezas narradas ([{ id, pausas, frases: [{ texto, audio, segundos }] }]). */
export function marcoTimeline(narradas, fps) {
  return Object.fromEntries(narradas.map((p) => [p.id, {
    pausas: p.pausas ?? [], ...(p.pausaFinal ? { pausaFinal: p.pausaFinal } : {}),
    frases: p.frases.map((fr) => ({ texto: fr.texto, audio: fr.audio, dur: Math.ceil((fr.segundos.en ?? Math.max(...Object.values(fr.segundos))) * fps) })),
  }]));
}

/** Tramo armado con piezas en orden: { durationInFrames, frases: [{ texto, audio, from, dur }] } o null.
 *  `entre[k]` = pausa (s) entre la pieza k y la k+1; `entrada`/`salida` en s. */
export function tramoMarco(tl, ids, { entrada = T_MARCO.entrada, entre = [], salida = T_MARCO.salida } = {}) {
  const piezas = ids.map((id) => tl?.marco?.[id]).filter((p) => p?.frases);
  if (!piezas.length) return null;
  const f = (s) => Math.round(s * tl.fps);
  let local = f(entrada);
  const frases = [];
  piezas.forEach((p, k) => {
    p.frases.forEach((fr, j) => {
      frases.push({ texto: fr.texto, audio: fr.audio, from: local, dur: fr.dur });
      local += fr.dur + (j < p.frases.length - 1 ? f(p.pausas?.[j] ?? 0.4) : 0);
    });
    if (k < piezas.length - 1) local += f(p.pausaFinal ?? entre[k] ?? T_MARCO.ganchoInvitacion); // "Tell me in the comments." deja 2 s
  });
  return { durationInFrames: local + f(salida), frases };
}

/** Apertura (gancho + invitación, y 0,5 s antes del capítulo) y final (0,8 s antes). */
export const apertura = (tl, gancho, invitacion) => tramoMarco(tl, [gancho, invitacion], { entre: [T_MARCO.ganchoInvitacion], salida: T_MARCO.invitacionCapitulo });
export const despedida = (tl, final) => tramoMarco(tl, [final], { entrada: T_MARCO.antesFinal });

/** Tramos de la parte i (0 = primera) de los Reels: { apertura, final } (null donde no hay). */
export function marcoParte(g, tl, i) {
  if (!g?.reels) return { apertura: null, final: null };
  return { apertura: apertura(tl, `reels-gancho-${i + 1}`, 'reels-invitacion'), final: despedida(tl, 'reels-final') };
}

/** Cuadros que el marco le suma a la parte i (para que el corte lo tenga en cuenta). */
export const sobraParte = (g, tl) => (i) => { const m = marcoParte(g, tl, i); return (m.apertura?.durationInFrames ?? 0) + (m.final?.durationInFrames ?? 0); };

/** Escena quieta para mostrar el marco: el fondo y lo que está desde el principio de `esc`, sin cámara, actores ni rótulos. */
export function escenaQuieta(esc, id, frases) {
  const z = esc.camara?.zoom?.[0] ?? 1, de = esc.camara?.de ?? 0;
  return {
    id, fondo: esc.fondo, ...(esc.sinAstros ? { sinAstros: true } : {}),
    camara: { de, a: de, zoom: [z, z] },
    elementos: (esc.elementos ?? []).filter((e) => !e.en && e.hasta == null && !e.sube),
    actores: [], efectos: [], rotulos: [],
    frases,
  };
}

/** Horizontal (YouTube) con el marco: escena `apertura` después de la portada y `despedida` antes de la pantalla final.
 *  Sin `guion.youtube` (o sin narrar) devuelve lo mismo. */
export function horizontalConMarco(g, tl) {
  const y = g?.youtube;
  if (!y || !tl?.marco) return { guion: g, timeline: tl };
  const gancho = y.gancho ? 'youtube-gancho' : 'reels-gancho-1';
  const ap = apertura(tl, gancho, 'youtube-invitacion'), fin = despedida(tl, 'youtube-final');
  if (!ap && !fin) return { guion: g, timeline: tl };
  const A = ap?.durationInFrames ?? 0, F = fin?.durationInFrames ?? 0;
  const escenas = tl.escenas.map((e) => ({ ...e, from: e.from + A }));
  const ultima = escenas.at(-1);
  const tlEsc = [
    ...(ap ? [{ id: 'apertura', from: tl.introFrames, durationInFrames: A, frases: ap.frases }] : []),
    ...escenas,
    ...(fin ? [{ id: 'despedida', from: ultima.from + ultima.durationInFrames, durationInFrames: F, frases: fin.frases }] : []),
  ];
  const gEsc = [
    ...(ap ? [escenaQuieta(g.escenas[0], 'apertura', ap.frases.map((f) => f.texto))] : []),
    ...g.escenas,
    ...(fin ? [escenaQuieta(g.escenas.at(-1), 'despedida', fin.frases.map((f) => f.texto))] : []),
  ];
  return { guion: { ...g, escenas: gEsc }, timeline: { ...tl, escenas: tlEsc, total: tl.total + A + F } };
}
