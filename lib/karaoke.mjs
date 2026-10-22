// Subtítulos karaoke de Learn Bible (como los de Hermes Tarot): la palabra que suena resaltada. Sin alineación forzada:
// las palabras se reparten en la duración de la voz según su largo (más letras, más tiempo; la puntuación suma una pausa).

const peso = (w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[,;:]$/.test(w) ? 3 : /[.!?]$/.test(w) ? 5 : 0);

/** Palabras del texto. */
export const palabras = (texto) => (texto ?? '').split(/\s+/).filter(Boolean);

/** Cuadro (relativo al comienzo de la voz) en que empieza cada palabra, en una voz de `dur` cuadros. */
export function iniciosPalabras(texto, dur) {
  const ws = palabras(texto), pesos = ws.map(peso), total = pesos.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return ws.map((_, i) => { const x = Math.round((acc / total) * dur); acc += pesos[i]; return x; });
}

/** Índice de la palabra que suena `f` cuadros después de que empieza la voz (−1 antes; la última se queda). */
export function palabraEn(texto, dur, f) {
  if (f < 0) return -1;
  const ini = iniciosPalabras(texto, dur);
  let k = 0;
  for (let i = 0; i < ini.length; i++) if (ini[i] <= f) k = i;
  return k;
}

/** Páginas de ≤ `renglones` renglones de ≤ `max` caracteres: [{ desde (índice de su primera palabra), renglones: [[palabra]] }]. */
export function paginar(texto, max = 24, renglones = 3) {
  const ws = palabras(texto), lineas = [];
  let cur = [];
  for (const w of ws) { if (cur.length && [...cur, w].join(' ').length > max) { lineas.push(cur); cur = []; } cur.push(w); }
  if (cur.length) lineas.push(cur);
  const pags = [];
  let i = 0;
  for (let l = 0; l < lineas.length; l += renglones) {
    const r = lineas.slice(l, l + renglones);
    pags.push({ desde: i, renglones: r });
    i += r.flat().length;
  }
  // sin página huérfana de un renglón corto al final: se pasa un renglón de la anterior
  const ult = pags.at(-1), ant = pags.at(-2);
  if (ant && ult.renglones.length === 1 && ant.renglones.length === renglones && ult.renglones[0].join(' ').length < max / 2) {
    const mov = ant.renglones.pop();
    ult.renglones.unshift(mov);
    ult.desde -= mov.length;
  }
  return pags;
}

/** Página que se ve cuando suena la palabra k. */
export const paginaDe = (pags, k) => pags.reduce((p, x, i) => (x.desde <= Math.max(0, k) ? i : p), 0);
