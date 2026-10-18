// Encuadre del HORIZONTAL (16:9) con los tamaños reales de cada ficha (p. ej. animales épicos con `alto`).
// 1) ajusteHorizontal: regla del motor — si un actor ajustable no entra debajo de la franja del rótulo (con el zoom
//    máximo de la cámara) se baja (si vuela) o se achica; si tapa a otro actor, se achica un poco más (hasta K_AJ_MIN).
// 2) revisarHorizontal / revisarVertical: avisos deterministas (fuera de cuadro, encimados, tapa texto) para el
//    revisor (scripts/revisar-encuadre.mjs). Módulo puro (sin React) para probarlo con node --test.
import type { Pista, Muestra, Encuadre } from './puestaVertical';

// iguales a puestaVertical.ts (copiados: node --test no resuelve imports .ts sin extensión)
const SUELO = 790, ARRIBA = 126, ANCHO = 1080, SUELO_V = 1390, TECHO = 430;

/** Lo más alto que puede llegar un actor en pantalla: deja un renglón para su rótulo debajo de la guarda. */
export const TECHO_H = ARRIBA + 64;
/** Techo de las personas con diseño oficial: justo debajo del cartel de arriba (y=230), para que un gigante no lo tape. */
export const TECHO_PERSONA = 250;
/** Lo mínimo que se achica un animal para que entre (más chico deja de ser épico: se avisa). */
export const K_AJ_MIN = 0.55;
/** Piso duro para un animal de suelo que a K_AJ_MIN igual pasa el techo (Fenrir gigante con la cámara cerca): entra justo. */
export const K_AJ_DURO = 0.45;
/** Encimados: fracción del más angosto que se tapan, en más de esta fracción del tiempo que están juntos. */
export const TAPA = 0.35, TIEMPO = 0.4;
const P_CAPA = { fondo: 0.45, medio: 0.75, frente: 1 } as const;

export type Camara = { de?: number; a?: number; zoom?: [number, number] };
export type Ajuste = { k: number; dy: number; dx?: number };
export type Aviso = { tipo: 'arriba' | 'costado' | 'encima' | 'texto'; ids: string[]; formato: '16:9' | '9:16'; detalle: string };
export type RotuloT = { en: number; hasta?: number; texto: string; x: number; y: number; estilo?: string };

const zoomMax = (cam: Camara) => Math.max(...(cam.zoom ?? [1, 1.05]));
const camX = (cam: Camara, f: number, dur: number) => { const de = cam.de ?? 0, a = cam.a ?? de; return de + (a - de) * Math.min(1, Math.max(0, f / Math.max(1, dur))); };
const zoomEn = (cam: Camara, f: number, dur: number) => { const z = cam.zoom ?? [1, 1.05]; return z[0] + (z[1] - z[0]) * Math.min(1, Math.max(0, f / Math.max(1, dur))); };

/** Caja en pantalla [x0, y0, x1, y1] de un actor en una muestra, con su ajuste. */
export function cajaPantalla(p: Pista, m: Muestra, aj: Ajuste, cam: Camara, dur: number): [number, number, number, number] {
  const z = zoomEn(cam, m.f, dur), cx = camX(cam, m.f, dur) * P_CAPA[p.capa], s = m.s * aj.k, y = m.y + aj.dy, mx = m.x + (aj.dx ?? 0);
  const izq = (m.izq ? p.medida.der : p.medida.izq) * s, der = (m.izq ? p.medida.izq : p.medida.der) * s;
  const X = (x: number) => 960 + (x - cx - 960) * z, Y = (yy: number) => SUELO + (yy - SUELO) * z;
  const abajo = y < SUELO - 1 ? Math.min(SUELO, y + p.medida.alto * s * 0.5) : SUELO;
  return [X(mx - izq), Y(y - p.medida.alto * s), X(mx + der), Y(abajo)];
}

/** Qué fracción del más angosto se tapan dos cajas (0 si no se tocan en alto). */
export function tapado(a: number[], b: number[]): number {
  const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
  if (ox <= 0 || oy <= 0) return 0;
  return ox / Math.max(1, Math.min(a[2] - a[0], b[2] - b[0]));
}

/** Fracción del tiempo compartido en que a tapa a b más de TAPA. */
function tiempoEncima(a: Pista, b: Pista, aa: Ajuste, ab: Ajuste, cam: Camara, dur: number): number {
  let juntos = 0, encima = 0;
  a.muestras.forEach((m, i) => {
    const n = b.muestras[i];
    if (!m.vis || !n?.vis) return;
    juntos++;
    if (tapado(cajaPantalla(a, m, aa, cam, dur), cajaPantalla(b, n, ab, cam, dur)) > TAPA) encima++;
  });
  return juntos ? encima / juntos : 0;
}

/** Lo más que se achica un animal solo por tapar a otro (los animales al lado de su dios son a propósito). */
export const K_SOLAPE_MIN = 0.8;
/** Lo más que se corre de costado un animal quieto para no tapar a otro. */
export const DX_MAX = 160;
/** Los voladores (origen = centro del cuerpo) cuelgan por debajo del origen esta fracción de su alto. */
export const COLGADO = 0.5;
const vuela = (vis: Muestra[]) => vis.every((m) => m.y < SUELO - 1);

/** Regla del motor: cuánto se achica (k) y se baja (dy, solo voladores) cada actor ajustable de la escena. */
export function ajusteHorizontal(pistas: Pista[], cam: Camara = {}, dur = 0): Record<string, Ajuste> {
  const lim = (SUELO - TECHO_H) / zoomMax(cam); // alto máximo en el mundo, medido desde el suelo
  const out: Record<string, Ajuste> = {};
  for (const p of pistas) {
    const vis = p.muestras.filter((m) => m.vis);
    if (p.oficial && !p.ajustable && vis.length && !vuela(vis)) {
      // persona oficial alta (gigantes, jotuns, reyes…): si pasa el cartel de arriba se achica, nunca menos de K_AJ_MIN
      const suelo = vis.filter((m) => m.y >= SUELO - 1), elev = suelo.length ? 0 : Math.max(...vis.map((m) => SUELO - m.y));
      const alto = p.medida.alto * Math.max(...vis.map((m) => m.s)), limP = (SUELO - TECHO_PERSONA) / zoomMax(cam);
      out[p.id] = { k: alto + elev > limP ? Math.max(K_AJ_MIN, (limP - elev) / alto) : 1, dy: 0 };
      continue;
    }
    if (!p.ajustable || !vis.length) { out[p.id] = { k: 1, dy: 0 }; continue; }
    const s = Math.max(...vis.map((m) => m.s)), alto = p.medida.alto * s;
    if (vuela(vis)) {
      // volador: que entre entero en el cielo (alto + lo que cuelga) y, si la punta pasa el techo, bajarlo
      const k = Math.max(K_AJ_MIN, Math.min(1, lim / (alto * (1 + COLGADO))));
      const techo = SUELO - lim, arriba = Math.min(...vis.map((m) => m.y)) - alto * k;
      out[p.id] = { k, dy: Math.max(0, techo - arriba) };
    } else {
      // si sube (escalera al cielo, salto…) es a propósito: el tamaño se elige con lo que está en el suelo
      const suelo = vis.filter((m) => m.y >= SUELO - 1), elev = suelo.length ? 0 : Math.max(...vis.map((m) => SUELO - m.y));
      const kFit = (lim - elev) / alto;
      out[p.id] = { k: alto + elev > lim ? (kFit >= K_AJ_MIN ? kFit : Math.max(K_AJ_DURO, kFit)) : 1, dy: 0 };
    }
  }
  // si un animal ajustable tapa a otro actor, se achica de a 5% (como mucho hasta K_SOLAPE_MIN de lo que tenía)
  for (const p of pistas) {
    if (!p.ajustable) continue;
    const piso = Math.min(out[p.id].k, Math.max(K_AJ_MIN, out[p.id].k * K_SOLAPE_MIN));
    for (const q of pistas) {
      if (q === p || q.capa !== p.capa) continue;
      while (out[p.id].k > piso + 1e-6 && tiempoEncima(p, q, out[p.id], out[q.id], cam, dur) > TIEMPO) out[p.id] = { ...out[p.id], k: Math.max(piso, out[p.id].k - 0.05) };
    }
  }
  // si todavía tapa y el animal está quieto, se corre de costado (alejándose del otro), como mucho DX_MAX
  for (const p of pistas) {
    const vis = p.muestras.filter((m) => m.vis);
    if (!p.ajustable || !vis.length || Math.max(...vis.map((m) => m.x)) - Math.min(...vis.map((m) => m.x)) > 2) continue;
    for (const q of pistas) {
      if (q === p || q.capa !== p.capa || tiempoEncima(p, q, out[p.id], out[q.id], cam, dur) <= TIEMPO) continue;
      const qx = q.muestras.filter((m) => m.vis).map((m) => m.x), dir = vis[0].x + (out[p.id].dx ?? 0) >= (qx.length ? qx.reduce((a, b) => a + b, 0) / qx.length : vis[0].x) ? 1 : -1;
      for (let d = 10; d <= DX_MAX && tiempoEncima(p, q, out[p.id], out[q.id], cam, dur) > TIEMPO; d += 10) out[p.id] = { ...out[p.id], dx: (out[p.id].dx ?? 0) + dir * 10 };
    }
  }
  return out;
}

/** Avisos del horizontal (después del ajuste): fuera de cuadro, encimados y actores que tapan rótulos. */
export function revisarHorizontal(pistas: Pista[], cam: Camara, dur: number, aj: Record<string, Ajuste>, rotulos: { f0: number; f1: number; texto: string; x: number; y: number }[] = []): Aviso[] {
  const av: Aviso[] = [];
  const fx = (n: number) => Math.round(n);
  for (const p of pistas) {
    const a = aj[p.id] ?? { k: 1, dy: 0 }, vis = p.muestras.filter((m) => m.vis);
    if (!vis.length) continue;
    const cajas = vis.map((m) => cajaPantalla(p, m, a, cam, dur));
    const enSuelo = vis.some((m) => m.y >= SUELO - 1) && !vuela(vis);
    const top = Math.min(...cajas.filter((_, i) => !enSuelo || vis[i].y >= SUELO - 1).map((c) => c[1]));
    if (top < (p.ajustable ? TECHO_H - 8 : ARRIBA - 10)) av.push({ tipo: 'arriba', ids: [p.id], formato: '16:9', detalle: `llega a y=${fx(top)} (techo ${p.ajustable ? TECHO_H : ARRIBA})` });
    // de costado: solo si está quieto afuera (entrar/salir por el borde es normal)
    const afuera = vis.filter((m, i) => { const c = cajas[i], quieto = Math.abs(m.x - (vis[i + 1]?.x ?? m.x)) < 2; return quieto && (c[0] < -20 || c[2] > 1940) && c[2] > 0 && c[0] < 1920; }).length;
    if (afuera / vis.length > 0.5) av.push({ tipo: 'costado', ids: [p.id], formato: '16:9', detalle: 'queda cortado por el costado' });
    for (const r of rotulos) {
      const w = r.texto.length * 24 + 20, rc = [r.x - w / 2, r.y - 44, r.x + w / 2, r.y + 10];
      const tapa = vis.some((m, i) => m.f >= r.f0 && m.f <= r.f1 && tapado(cajas[i], rc) > 0.5);
      if (tapa) av.push({ tipo: 'texto', ids: [p.id], formato: '16:9', detalle: `tapa el cartel "${r.texto}"` });
    }
  }
  for (let i = 0; i < pistas.length; i++) for (let j = i + 1; j < pistas.length; j++) {
    const p = pistas[i], q = pistas[j];
    if (p.capa !== q.capa || !(p.ajustable || q.ajustable)) continue; // solo pares con un animal grande
    const t = tiempoEncima(p, q, aj[p.id] ?? { k: 1, dy: 0 }, aj[q.id] ?? { k: 1, dy: 0 }, cam, dur);
    if (t > TIEMPO) av.push({ tipo: 'encima', ids: [p.id, q.id], formato: '16:9', detalle: `encimados ${Math.round(t * 100)}% del tiempo` });
  }
  return av;
}

/** Avisos del vertical (9:16) con su encuadre fijo: más alto que el cuadro, cortado o encimado. */
export function revisarVertical(pistas: Pista[], enc: Encuadre): Aviso[] {
  const av: Aviso[] = [];
  enc.ids.forEach((id, i) => {
    const p = pistas.find((x) => x.id === id);
    if (!p) return;
    const c = enc.cajas[i], vis = p.muestras.filter((m) => m.vis);
    const alto = Math.max(...vis.map((m) => p.medida.alto * m.s + Math.max(0, SUELO - m.y))) * enc.K;
    if (alto > SUELO_V - TECHO + 2) av.push({ tipo: 'arriba', ids: [id], formato: '9:16', detalle: `alto ${Math.round(alto)} > ${SUELO_V - TECHO}` });
    if (c && (c[0] < -2 || c[1] > ANCHO + 2)) av.push({ tipo: 'costado', ids: [id], formato: '9:16', detalle: `${Math.round(c[0])}…${Math.round(c[1])}` });
  });
  return av;
}
