// Puesta en escena VERTICAL (9:16) de los episodios: no es un recorte ni un zoom del horizontal.
// Cada escena tiene UN encuadre fijo (la cámara no se mueve, no hay cortes ni acercamientos): todos los actores
// de la escena entran juntos en el cuadro de 1080 de ancho. Se acercan entre sí (comprimiendo sus x, con el mismo
// orden izquierda/derecha y la misma mirada, sin encimarse) y se elige una escala única para la escena: algo más
// grandes que en el horizontal si son 1–2, más chicos si son muchos, nunca gigantes. Los movimientos (entrar,
// caminar…) pasan por la misma compresión. Los elementos (árboles, templos, barcos…) se acomodan alrededor del grupo.
// Este módulo es puro (sin React ni Remotion) para poder probarlo con node --test.

// ---------- geometría del cuadro vertical (px de pantalla 1080×1920) ----------
export const ANCHO = 1080;
/** Línea de suelo en pantalla (los pies). Debajo empieza el panel de subtítulos (1470). */
export const SUELO_V = 1390;
/** Lo más alto que puede llegar un actor (deja libre la cabecera y la franja de carteles de arriba). */
export const TECHO = 430;
export const MARGEN = 40;
/** Suelo y borde superior del mundo horizontal (coordenadas de las escenas). */
export const SUELO_MUNDO = 790, ARRIBA_MUNDO = 126;
/** Escala del fondo: el cielo del horizontal (126→790) llena de la cabecera (230) al suelo. */
export const KB = (SUELO_V - 230) / (SUELO_MUNDO - ARRIBA_MUNDO);
/** Cada cuántos cuadros se muestrea la escena para encuadrarla. */
export const PASO = 3;
/** Escala de los actores según cuántos hay en la escena (1 = mismo tamaño en px que en el horizontal). */
export const ESCALA_GRUPO = [0.83, 0.83, 0.83, 0.83, 0.8, 0.78, 0.75]; // +15% (pedido 2026-10-18: "un poquito más de zoom"); antes 0.72 = toma de lejos (2026-10-11)
/** Escala mínima y máxima de una escena. */
export const K_MIN = 0.25, K_MAX = 0.89;

export type Capa = 'fondo' | 'medio' | 'frente';
/** Tamaño de un actor a escala 1 mirando a la derecha: cuánto ocupa hacia atrás (izq), hacia adelante (der) y de alto. */
export type Medida = { izq: number; der: number; alto: number };
export type Muestra = { f: number; x: number; y: number; s: number; vis: boolean; izq: boolean };
/** ajustable: el motor puede achicarlo/bajarlo para que entre (animales con alto propio). oficial: persona con diseño *_oficial (los altos: se achican si se pasan del cartel). */
export type Pista = { id: string; capa: Capa; medida: Medida; muestras: Muestra[]; ajustable?: boolean; oficial?: boolean };
/**
 * Encuadre fijo de una escena: escala K y una compresión de x por tramos (xs del mundo → vs virtuales, monótona:
 * los huecos vacíos se achican mucho, los que separan a dos actores cercanos poco); pend = pendiente fuera de los
 * tramos; c = x del mundo en el centro (para el fondo); actores en cuadro y lo que ocupa cada uno en pantalla.
 */
export type Encuadre = { K: number; xs: number[]; vs: number[]; pend: number; c: number; ids: string[]; cajas: [number, number][] };
/** Separación mínima entre vecinos que en el guion no se tocaban (fracción de lo que ocupan con brazos y objetos). */
export const SEPARACION = 1;
/** Lo mínimo que se conserva de un recorrido (para que una caminata se siga leyendo). */
export const PEND_MIN = 0.2;

// ---------- tamaños ----------
const TAM: Record<string, number> = { leon: 1, toro: 1.1, caballo: 1.15, perro: 0.7, lobo: 0.8, jabali: 0.8, ciervo: 0.95, cabra: 0.7, oso: 1.05, oveja: 0.7, buey: 1.1, hipopotamo: 1.15 };
const CORONA: Record<string, number> = { doble: 110, blanca: 110, atef: 120, trono: 90, plumas: 130, cuernosDisco: 110, disco: 90, pluma: 100, corona: 60, yelmoAlas: 70, casco: 70, roja: 80, gustoweh: 90, tocadoPlumas: 90, roach: 50, plumaAtras: 40, sombreroCesteria: 30 };
export type FichaLike = { tipo: string; animal?: string; p?: Record<string, unknown>; extra?: string };

/** Caja aproximada de cada ficha del elenco (a escala 1, mirando a la derecha; origen = pies). */
export function medidaFicha(fi: FichaLike, props: Record<string, unknown> = {}): Medida {
  const fp = fi.p ?? {};
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  if (fi.tipo === 'persona') {
    const p = { ...fp, ...props } as Record<string, unknown>;
    const s = num(p.s, 1);
    const ancho = p.gigante ? 1.35 : p.cuerpo === 'gordo' ? 1.3 : p.cuerpo === 'nino' ? 0.8 : 1;
    const extra = Math.max(CORONA[p.tocado as string] ?? 0, ['chacal', 'set'].includes(p.cabezaAnimal as string) ? 50 : 0);
    let izq = 95 * ancho, der = 125 * ancho;
    if (fi.extra === 'centauro') { izq = 200; der = 190; }
    if (fi.extra === 'alado') izq = Math.max(izq, 160);
    if (p.escudo || p.capa) izq = Math.max(izq, 120 * ancho); // escudo a la espalda o capa que vuela
    return { izq: izq * s, der: der * s, alto: (400 + extra) * (p.gigante ? 1.2 : 1) * (p.cuerpo === 'nino' ? 0.75 : 1) * s };
  }
  const s = num(fp.s, 1);
  switch (fi.tipo) {
    // dibujos con alto propio (animales épicos): alto del origen a la punta y lo que ocupan atrás/adelante (izq/der)
    case 'dibujo': if (typeof fp.alto === 'number') return { izq: num(fp.izq, fp.alto * 0.5) * s, der: num(fp.der, fp.alto * 0.5) * s, alto: fp.alto * s }; return { izq: 100 * s, der: 100 * s, alto: 200 * s };
    case 'cuadrupedo': { const k = (TAM[fi.animal ?? ''] ?? 1) * s; const alas = !!(fp.alas ?? props.alas); return { izq: (alas ? 210 : 168) * k, der: 192 * k, alto: (alas ? 265 : 218) * k }; }
    case 'serpiente': {
      // Las serpientes largas pueden dejar la cola fuera de cuadro: cuenta la cabeza y el primer tramo del cuerpo.
      const largo = num(fp.largo, 420), grosor = num(fp.grosor, 34), alas = !!(fp.alas || fp.dragon);
      return { izq: (Math.min(largo, 400) + 10) * s, der: 85 * s, alto: (grosor + 150 + (alas ? 90 : 0) + (num(fp.cuellos, 1) > 1 ? 80 : 0)) * s };
    }
    case 'ave': return { izq: 150 * s, der: 100 * s, alto: 120 * s };
    case 'avepie': return { izq: 70 * s, der: 78 * s, alto: 175 * s };
    case 'bichito': return { izq: 88 * s, der: 100 * s, alto: 85 * s };
    case 'pez': return { izq: 110 * s, der: 110 * s, alto: 70 * s };
    case 'ojo': return { izq: 172 * s, der: 175 * s, alto: 160 * s };
    case 'escorpion': return { izq: 125 * s, der: 125 * s, alto: 140 * s };
    default: return { izq: 100 * s, der: 100 * s, alto: 200 * s };
  }
}

/** Medio ancho aproximado de los elementos de escenario (a escala 1). */
const MEDIO_ELEMENTO: Record<string, number> = {
  templo: 270, monte: 350, monte_nevado: 350, yggdrasil: 430, arbol_cielo: 380, casa: 110, casa_larga: 230, casa_comunal: 240, casa_tablones: 200, tipi: 110,
  hale: 150, heiau: 260, barco: 260, drakkar: 290, waa: 260, canoa: 200, canoa_cedro: 220, muralla: 800, rio: 500, isla: 300, isla_tortuga: 400,
  nut_arco: 900, piramide: 300, pilono: 200, olivo: 130, pino: 110, cipres: 60, palmera: 110, niu: 110, arce: 130, abedul: 90, cedro: 120,
  roca: 95, columna: 40, altar: 70, trono: 75, estatua: 70, puerta: 110, cueva: 260, tumba: 90, cofre: 60, telar: 90, anfora: 40, pithos: 60,
  fogata: 60, sol: 70, luna: 60, nube: 130, estrellas: 400, totem: 50, monticulo: 220, maiz: 50, tres_hermanas: 80, kalo: 70, ipu: 40, petroglifo: 80,
};
export const medioElemento = (tipo: string, s = 1): number => (MEDIO_ELEMENTO[tipo] ?? 100) * s;

// ---------- encuadre fijo de la escena ----------
type Resumen = { id: string; xmin: number; xmax: number; e0: number; e1: number; alto: number; parado: number };

/** x del mundo → x virtual con el encuadre (el cuadro muestra 960 ± 540/K). */
export function mapear(enc: Pick<Encuadre, 'xs' | 'vs' | 'pend'>, x: number): number {
  const { xs, vs, pend } = enc, n = xs.length;
  if (x <= xs[0]) return vs[0] + (x - xs[0]) * pend;
  if (x >= xs[n - 1]) return vs[n - 1] + (x - xs[n - 1]) * pend;
  let i = 0; while (x > xs[i + 1]) i++;
  const k = (x - xs[i]) / (xs[i + 1] - xs[i] || 1);
  return vs[i] + (vs[i + 1] - vs[i]) * k;
}

/**
 * Encuadre fijo de la escena: todos los actores que se ven (dentro del `rango` de x que mostraba el horizontal;
 * los que entran o salen desde más lejos lo hacen por el borde) entran juntos, sin encimarse si en el guion
 * estaban separados, con margen, y con una escala única.
 */
export function encuadreEscena(pistas: Pista[], rango: [number, number] = [-100, 2020]): Encuadre {
  const enRango = (m: Muestra) => m.vis && m.x >= rango[0] && m.x <= rango[1];
  const ext = (p: Pista, m: Muestra) => ({ e0: (m.izq ? p.medida.der : p.medida.izq) * m.s, e1: (m.izq ? p.medida.izq : p.medida.der) * m.s });
  const res: Resumen[] = pistas.flatMap((p) => {
    const ms = p.muestras.filter(enRango);
    if (!ms.length) return [];
    return [{
      id: p.id, xmin: Math.min(...ms.map((m) => m.x)), xmax: Math.max(...ms.map((m) => m.x)),
      e0: Math.max(...ms.map((m) => ext(p, m).e0)), e1: Math.max(...ms.map((m) => ext(p, m).e1)),
      alto: Math.max(...ms.map((m) => p.medida.alto * m.s + Math.max(0, SUELO_MUNDO - m.y))),
      parado: Math.max(...ms.map((m) => p.medida.alto * m.s)),
    }];
  });
  if (!res.length) {
    const c = Math.max(300, Math.min(1620, (rango[0] + rango[1]) / 2));
    return { K: 1, xs: [c], vs: [960], pend: 0.7, c, ids: [], cajas: [] };
  }
  const W = ANCHO - 2 * MARGEN;
  // tramos: las posiciones donde los actores están quietos y los extremos de la escena
  const nT = Math.max(...pistas.map((p) => p.muestras.length));
  const quieto = (p: Pista, t: number) => Math.abs((p.muestras[Math.min(p.muestras.length - 1, t + 1)]?.x ?? 0) - (p.muestras[Math.max(0, t - 1)]?.x ?? 0)) < 2;
  const anclas = new Set<number>([Math.min(...res.map((r) => r.xmin)), Math.max(...res.map((r) => r.xmax))]);
  for (const p of pistas) p.muestras.forEach((m, t) => { if (enRango(m) && quieto(p, t)) anclas.add(Math.round(m.x)); });
  const xs = [...anclas].sort((a, b) => a - b);
  const lens = xs.slice(1).map((x, j) => x - xs[j]);
  // pendiente mínima de cada tramo: los vecinos quietos que estaban separados siguen sin encimarse
  const smin = lens.map(() => PEND_MIN);
  for (let t = 0; t < nT; t++) {
    const vis = pistas.map((p) => ({ p, m: p.muestras[t] })).filter(({ p, m }) => m && enRango(m) && quieto(p, t)).sort((a, b) => a.m.x - b.m.x);
    for (let k = 0; k + 1 < vis.length; k++) {
      const a = vis[k], b = vis[k + 1], d = b.m.x - a.m.x, nec = SEPARACION * (ext(a.p, a.m).e1 + ext(b.p, b.m).e0);
      if (d < nec || d <= 1) continue; // ya se tocaban a propósito (abrazo, mano en la boca…)
      const r = Math.min(1, nec / d);
      xs.forEach((x, j) => { if (j < lens.length && x >= Math.round(a.m.x) && xs[j + 1] <= Math.round(b.m.x)) smin[j] = Math.max(smin[j], r); });
    }
  }
  const armar = (sl: number[]) => { const vs = [0]; sl.forEach((sj, j) => vs.push(vs[j] + sj * lens[j])); return vs; };
  const ancho = (vs: number[]) => {
    const m = (x: number) => mapear({ xs, vs, pend: 1 }, x);
    return Math.max(...res.map((r) => m(r.xmax) + r.e1)) - Math.min(...res.map((r) => m(r.xmin) - r.e0));
  };
  // escala buscada: por cantidad de actores; si son todos chicos (animalitos), un poco más grandes; nunca gigantes
  const n = res.length, parado = Math.max(...res.map((r) => r.parado));
  let K = ESCALA_GRUPO[Math.min(n, ESCALA_GRUPO.length - 1)] * Math.max(1, Math.min(1.25, 448 / Math.max(60, parado)));
  K = Math.min(K, K_MAX, (SUELO_V - TECHO) / Math.max(...res.map((r) => r.alto)));
  let sl = smin;
  const K0 = W / ancho(armar(smin));
  if (K0 < K) {
    if (K0 >= K_MIN) K = K0;
    else { // ni con lo mínimo entran a la escala más chica: se comprimen más los tramos (pueden rozarse)
      K = K_MIN;
      let lo = 0, hi = 1;
      for (let it = 0; it < 30; it++) { const mu = (lo + hi) / 2; if (ancho(armar(smin.map((x) => x * mu))) * K <= W) lo = mu; else hi = mu; }
      sl = smin.map((x) => x * lo);
      if (ancho(armar(sl)) * K > W) K = W / ancho(armar(sl));
    }
  } else {
    // sobra lugar: se descomprime de a poco (hasta la distancia original) mientras entre
    let lo = 0, hi = 1;
    for (let it = 0; it < 30; it++) { const la = (lo + hi) / 2; if (ancho(armar(smin.map((x) => x + la * (1 - x)))) * K <= W) lo = la; else hi = la; }
    sl = smin.map((x) => x + lo * (1 - x));
  }
  const vs0 = armar(sl);
  const m0 = (x: number) => mapear({ xs, vs: vs0, pend: 1 }, x);
  const L = Math.min(...res.map((r) => m0(r.xmin) - r.e0)), R = Math.max(...res.map((r) => m0(r.xmax) + r.e1));
  const vs = vs0.map((v) => 960 + v - (L + R) / 2);
  const total = xs[xs.length - 1] - xs[0];
  const pend = total > 1 ? Math.max(PEND_MIN, Math.min(1, (vs[vs.length - 1] - vs[0]) / total)) : 1;
  const enc = { K, xs, vs, pend, c: 960, ids: res.map((r) => r.id), cajas: [] as [number, number][] };
  // x del mundo que queda en el centro (para correr un poco el fondo)
  let lo = xs[0] - 2000, hi = xs[xs.length - 1] + 2000;
  for (let it = 0; it < 40; it++) { const mid = (lo + hi) / 2; if (mapear(enc, mid) < 960) lo = mid; else hi = mid; }
  enc.c = (lo + hi) / 2;
  enc.cajas = res.map((r) => [aPantalla(mapear(enc, r.xmin), K) - r.e0 * K, aPantalla(mapear(enc, r.xmax), K) + r.e1 * K] as [number, number]);
  return enc;
}

/** x virtual → x de pantalla. */
export const aPantalla = (vx: number, K: number) => ANCHO / 2 + (vx - 960) * K;

/** x virtual de un elemento: en su lugar si se ve; si quedó afuera, entra por el costado (se ve al menos un buen pedazo). */
export function ubicarElemento(vx: number, medio: number, K: number, cajas: [number, number][] = []): number {
  const X = aPantalla(vx, K), w = medio * K;
  // los chicos (estatua, roca, altar) entran enteros; los grandes (templo, árbol del mundo), al menos un buen pedazo
  const a = Math.min(w + 12, Math.max(w * 0.3, 0.2 * ANCHO));
  const X2 = X < a ? a : X > ANCHO - a ? ANCHO - a : X;
  if (X2 === X) return vx;
  // si al entrar taparía a un actor del plano, queda afuera del todo (nada cortado a medias): primero los personajes
  const tapa = cajas.some(([x0, x1]) => Math.min(x1, X2 + w) - Math.max(x0, X2 - w) > 0.25 * Math.min(2 * w, x1 - x0));
  if (!tapa) return vx + (X2 - X) / K;
  const X3 = X < ANCHO / 2 ? Math.min(X, -w - 4) : Math.max(X, ANCHO + w + 4);
  return vx + (X3 - X) / K;
}

/** x virtual de un rótulo (texto de `ancho` en unidades del mundo) para que quede entero dentro del cuadro. */
export function limitarRotulo(vx: number, ancho: number, K: number): number {
  const lim = (ANCHO / 2 - 24) / K, a = 960 - lim + ancho / 2, b = 960 + lim - ancho / 2;
  return a > b ? 960 : Math.max(a, Math.min(b, vx));
}

/** Cámara del fondo (x de Escenario) para un centro de plano: sigue al plano, pero menos. */
export const fondoX = (c: number) => Math.max(-450, Math.min(450, (c - 960) * 0.8));

/** Parte un texto en renglones de hasta `max` caracteres (por palabras). */
export function partirLineas(texto: string, max: number): string[] {
  const out: string[] = [];
  for (const w of texto.split(/\s+/).filter(Boolean)) {
    const u = out[out.length - 1];
    if (u !== undefined && (u + ' ' + w).length <= max) out[out.length - 1] = u + ' ' + w; else out.push(w);
  }
  return out;
}
