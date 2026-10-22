// Learn Bible 777: "marco" del capítulo = gancho + invitación al principio y una invitación final, narrados con la misma
// voz (scripts/motor-narrar.mjs, cacheados) y mostrados como el versículo, pero sin referencia (no son texto bíblico).
// Solo actúa si el guion trae los campos; los episodios de Myths no cambian.
//   guion.reels   = { ganchos: [{en}, …] (uno por parte), invitacion: {en}, final: {en} }
//     → parte n de los Reels: abre con ganchos[n-1] + invitacion y cierra con final.
//   guion.youtube = { gancho?: {en} (por defecto reels.ganchos[0]), invitacion: {en}, final: {en} }
//     → horizontal: después de la portada (antes de la primera frase del capítulo) y al final, antes de la pantalla final.
// timeline.json guarda cada pieza narrada en `marco`: { [pieza]: { texto, audio, dur } }.

/** Ritmo dentro de un tramo del marco (s): igual al de las escenas. */
export const T_MARCO = { entrada: 0.7, pausa: 0.6, salida: 1.0 };

/** Piezas narrables del guion (cada una, una frase): [{ id, frases: [texto] }]. Vacío si el guion no trae marco. */
export function piezasMarco(g) {
  const r = g?.reels ?? {}, y = g?.youtube ?? {};
  const p = [];
  (r.ganchos ?? []).forEach((t, i) => p.push({ id: `reels-gancho-${i + 1}`, frases: [t] }));
  if (r.invitacion) p.push({ id: 'reels-invitacion', frases: [r.invitacion] });
  if (r.final) p.push({ id: 'reels-final', frases: [r.final] });
  if (y.gancho) p.push({ id: 'youtube-gancho', frases: [y.gancho] });
  if (y.invitacion) p.push({ id: 'youtube-invitacion', frases: [y.invitacion] });
  if (y.final) p.push({ id: 'youtube-final', frases: [y.final] });
  return p.filter((x) => x.frases[0]?.en);
}

/** `marco` del timeline a partir de las piezas narradas ([{ id, frases: [{ texto, audio, segundos }] }]). */
export function marcoTimeline(narradas, fps) {
  return Object.fromEntries(narradas.map((p) => {
    const fr = p.frases[0];
    const seg = fr.segundos.en ?? Math.max(...Object.values(fr.segundos));
    return [p.id, { texto: fr.texto, audio: fr.audio, dur: Math.ceil(seg * fps) }];
  }));
}

/** Tramo armado con piezas en orden: { durationInFrames, frases: [{ texto, audio, from, dur }] } o null. */
export function tramoMarco(tl, ids) {
  const piezas = ids.map((id) => tl?.marco?.[id]).filter(Boolean);
  if (!piezas.length) return null;
  const f = (s) => Math.round(s * tl.fps);
  let local = f(T_MARCO.entrada);
  const frases = piezas.map((p) => { const item = { texto: p.texto, audio: p.audio, from: local, dur: p.dur }; local += p.dur + f(T_MARCO.pausa); return item; });
  return { durationInFrames: local - f(T_MARCO.pausa) + f(T_MARCO.salida), frases };
}

/** Tramos de la parte i (0 = primera) de los Reels: { apertura, final } (null donde no hay). */
export function marcoParte(g, tl, i) {
  if (!g?.reels) return { apertura: null, final: null };
  return { apertura: tramoMarco(tl, [`reels-gancho-${i + 1}`, 'reels-invitacion']), final: tramoMarco(tl, ['reels-final']) };
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
  const ap = tramoMarco(tl, [gancho, 'youtube-invitacion']), fin = tramoMarco(tl, ['youtube-final']);
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
