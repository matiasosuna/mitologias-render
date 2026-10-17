// Animales épicos (2026-10-17): grandes, con anatomía creíble y detalle en capas, en el barro plano de la serie.
// Escala real: a s = 1 un hombre mide 400; acá el caballo pasa los 400 a la cruz, el toro es una mole y el águila
// abre ~760 de punta a punta. Guía para rehacer animales de otras mitologías: revision/GUIA-ANIMALES-EPICOS.md.
// Técnica: las masas (cuerpo, cuello, cabeza) van SIN trazo y el filtro `barroEpico` les pone un solo contorno a la
// silueta unida + luz y sombra de barro; las patas lejanas y las piezas sueltas (mechones, plumas, cuernos) sí llevan trazo.
// Origen = suelo bajo el animal (los que vuelan/nadan: centro del cuerpo), mirando a la derecha.
import React, { useId } from 'react';
import { suave, miembro, desde, lerp, type P } from '../comun/vasija';
import type { DibujoProps } from './elencoAzteca';

export const N = '#17110E';
const r1 = (v: number) => v.toFixed(1);
export const ORO = '#E8B93E', ORO_OSC = '#B5832A', ORO_LUZ = '#FFE38A', BRONCE = '#C08A3E', ROJO = '#B3352A';
/** Oscurece (k < 1) o aclara (k > 1) un #rrggbb. */
export const tono = (hex: string, k: number) => '#' + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');
/** Mezcla dos #rrggbb. */
export const mezcla = (a: string, b: string, t: number) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
const idLimpio = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '');

// ---------- piezas comunes ----------
/** Filtro de barro: contorno único de la silueta unida + sombra abajo-derecha y luz arriba-izquierda (en px de pantalla). */
export const FiltroBarro: React.FC = () => (
  <defs>
    <filter id="barroEpico" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" />
      <feOffset in="b" dx="14" dy="-10" result="bs" />
      <feComposite in="SourceAlpha" in2="bs" operator="out" result="zs" />
      <feFlood floodColor="#2A1206" floodOpacity="0.36" />
      <feComposite in2="zs" operator="in" result="sombra" />
      <feOffset in="b" dx="-6" dy="5" result="bl" />
      <feComposite in="SourceAlpha" in2="bl" operator="out" result="zl" />
      <feFlood floodColor="#FFF4DC" floodOpacity="0.4" />
      <feComposite in2="zl" operator="in" result="luz" />
      <feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="dil" />
      <feFlood floodColor="#140A04" />
      <feComposite in2="dil" operator="in" result="borde" />
      <feMerge><feMergeNode in="borde" /><feMergeNode in="SourceGraphic" /><feMergeNode in="sombra" /><feMergeNode in="luz" /></feMerge>
    </filter>
  </defs>
);
/** Marco de todo animal épico: posición, escala, volteo y el filtro de barro (afuera de la escala: contorno parejo). */
export const Marco: React.FC<{ x: number; y: number; s: number; voltear?: boolean; opacity?: number; children: React.ReactNode }> = ({ x, y, s, voltear, opacity = 1, children }) => (
  <g opacity={opacity}>
    <FiltroBarro />
    <g filter="url(#barroEpico)"><g transform={`translate(${r1(x)} ${r1(y)}) scale(${voltear ? -s : s} ${s})`}>{children}</g></g>
  </g>
);
/** Puntos de una cadena de huesos desde `o` (ángulos como `desde`: 0 = abajo, 90 = adelante). */
export const cadena = (o: P, angs: number[], lens: number[]): P[] => { const out: P[] = [o]; angs.forEach((a, i) => out.push(desde(out[i], a, lens[i]))); return out; };

/** Ojo de animal con vida: párpado/ceja, iris de color, pupila y dos brillos. */
export const OjoVivo: React.FC<{ x: number; y: number; r?: number; iris?: string; ceja?: string; ang?: number; fiero?: boolean }> = ({ x, y, r = 9, iris = '#5A3418', ceja, ang = 0, fiero }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${ang})`}>
    <ellipse rx={r * 1.15} ry={r * 0.92} fill="#F6EEDC" stroke={N} strokeWidth={2.2} />
    <circle cx={r * 0.2} r={r * 0.78} fill={iris} />
    <circle cx={r * 0.28} r={r * 0.42} fill={N} />
    <circle cx={r * 0.52} cy={-r * 0.3} r={r * 0.22} fill="#FFFFFF" />
    <circle cx={-r * 0.1} cy={r * 0.32} r={r * 0.1} fill="#FFFFFF" opacity={0.8} />
    <path d={fiero ? `M${-r * 1.5} ${-r * 1.25} Q ${0} ${-r * 0.5} ${r * 1.4} ${-r * 0.55}` : `M${-r * 1.35} ${-r * 0.55} Q ${0} ${-r * 1.45} ${r * 1.35} ${-r * 0.45}`} stroke={ceja ?? N} strokeWidth={r * 0.42} fill="none" strokeLinecap="round" />
  </g>
);
/** Mechón de pelo (crin, cola, melena): gota curva con brillo. Raíz en (x,y), cae hacia `ang` (como `desde`). */
export const Mechon: React.FC<{ x: number; y: number; ang: number; l: number; w: number; c: string; luz?: string; curva?: number; trazo?: number }> = ({ x, y, ang, l, w, c, luz, curva = 0.35, trazo = 2.2 }) => {
  const k = curva * l;
  // gota llena: se ensancha hasta ~0,65 w a un tercio y termina en punta redondeada que se curva
  const d = `M${r1(-w / 2)} 0 C ${r1(-w * 0.72)} ${r1(l * 0.3)}, ${r1(-w * 0.35 + k * 0.6)} ${r1(l * 0.78)}, ${r1(k)} ${r1(l)} C ${r1(k + w * 0.22)} ${r1(l * 0.9)}, ${r1(w * 0.62 + k * 0.3)} ${r1(l * 0.5)}, ${r1(w / 2)} 0 Z`;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(-ang)})`}>
      <path d={d} fill={c} stroke={N} strokeWidth={trazo} strokeLinejoin="round" />
      {luz && <path d={`M${r1(-w * 0.12)} ${r1(l * 0.12)} C ${r1(-w * 0.2 + k * 0.15)} ${r1(l * 0.45)}, ${r1(k * 0.5)} ${r1(l * 0.68)}, ${r1(k * 0.82)} ${r1(l * 0.9)}`} stroke={luz} strokeWidth={Math.max(1.4, w * 0.12)} fill="none" strokeLinecap="round" />}
    </g>
  );
};
/** Pluma suelta: hoja con raquis, para alas en capas. Raíz en (x,y), apunta a `ang` (grados SVG, 0 = derecha). */
export const Pluma: React.FC<{ x: number; y: number; ang: number; l: number; w: number; c: string; raquis?: string; punta?: string; trazo?: number }> = ({ x, y, ang, l, w, c, raquis, punta, trazo = 2 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})`}>
    <path d={`M0 ${r1(-w * 0.35)} C ${r1(l * 0.3)} ${r1(-w * 0.75)}, ${r1(l * 0.8)} ${r1(-w * 0.6)}, ${r1(l)} 0 C ${r1(l * 0.8)} ${r1(w * 0.55)}, ${r1(l * 0.3)} ${r1(w * 0.7)}, 0 ${r1(w * 0.35)} Z`} fill={c} stroke={N} strokeWidth={trazo} strokeLinejoin="round" />
    {punta && <path d={`M${r1(l * 0.72)} ${r1(-w * 0.5)} C ${r1(l * 0.86)} ${r1(-w * 0.42)}, ${r1(l * 0.97)} ${r1(-w * 0.15)}, ${r1(l)} 0 C ${r1(l * 0.94)} ${r1(w * 0.3)}, ${r1(l * 0.84)} ${r1(w * 0.45)}, ${r1(l * 0.72)} ${r1(w * 0.48)} Z`} fill={punta} />}
    {raquis && <path d={`M${r1(l * 0.04)} 0 Q ${r1(l * 0.5)} ${r1(-w * 0.08)} ${r1(l * 0.9)} 0`} stroke={raquis} strokeWidth={Math.max(1.2, w * 0.08)} fill="none" strokeLinecap="round" />}
  </g>
);
/** Pezuña con brillo; `hendida` = de dos dedos (buey, ciervo, cabra). Origen = cuartilla, rota con la pata. */
const Pezuna: React.FC<{ p: P; ang: number; w: number; c: string; hendida?: boolean }> = ({ p, ang, w, c, hendida }) => (
  <g transform={`translate(${r1(p[0])} ${r1(p[1])}) rotate(${r1(-ang)})`}>
    <path d={`M${r1(-w * 0.55)} ${r1(-w * 0.1)} L ${r1(w * 0.5)} ${r1(-w * 0.1)} L ${r1(w * 0.78)} ${r1(w * 1.05)} L ${r1(-w * 0.62)} ${r1(w * 1.05)} Z`} fill={c} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    <path d={`M${r1(w * 0.12)} ${r1(w * 0.05)} L ${r1(w * 0.42)} ${r1(w * 0.85)}`} stroke={tono(c, 2.2)} strokeWidth={Math.max(2, w * 0.14)} strokeLinecap="round" opacity={0.75} />
    {hendida && <path d={`M${r1(w * 0.08)} ${r1(w * 0.45)} L ${r1(w * 0.14)} ${r1(w * 1.05)}`} stroke={N} strokeWidth={2.2} />}
  </g>
);
/** Pata (garra) de felino/cánido/oso: almohadilla redonda con dedos marcados. */
const Garra: React.FC<{ p: P; ang: number; w: number; c: string; unas?: boolean }> = ({ p, ang, w, c, unas }) => (
  <g transform={`translate(${r1(p[0])} ${r1(p[1])}) rotate(${r1(-ang)})`}>
    <path d={suave([[-w * 0.5, -w * 0.2], [w * 0.55, -w * 0.25], [w * 1.05, w * 0.35], [w * 0.95, w * 0.62], [-w * 0.55, w * 0.62], [-w * 0.65, w * 0.2]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.4} />
    {[0.2, 0.55].map((t) => <path key={t} d={`M${r1(w * t)} ${r1(w * 0.62)} l ${r1(w * 0.04)} ${r1(-w * 0.28)}`} stroke={N} strokeWidth={2} strokeLinecap="round" />)}
    {unas && [0.05, 0.4, 0.75].map((t) => <path key={t} d={`M${r1(w * t + w * 0.12)} ${r1(w * 0.6)} l ${r1(w * 0.16)} ${r1(w * 0.14)}`} stroke="#EFE6D2" strokeWidth={3} strokeLinecap="round" />)}
  </g>
);
/** Pata con volumen (miembro) + pie. Devuelve el dibujo; `pts` sale de `cadena`. */
const Pata: React.FC<{ pts: P[]; anchos: number[]; c: string; pie: 'pezuna' | 'hendida' | 'garra' | 'garraUnas'; cPie: string; angPie: number; trazo?: boolean; luz?: string }> = ({ pts, anchos, c, pie, cPie, angPie, trazo = true, luz }) => {
  const fin = pts[pts.length - 1], wPie = anchos[anchos.length - 1];
  return (
    <g>
      <path d={miembro(pts, anchos)} fill={c} stroke={trazo ? N : 'none'} strokeWidth={2.6} />
      {luz && <path d={suave(pts.slice(1, -1).map((q, i) => [q[0] - anchos[i + 1] * 0.25, q[1]] as P))} stroke={luz} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.55} />}
      {pie === 'pezuna' || pie === 'hendida'
        ? <Pezuna p={fin} ang={angPie} w={wPie * 1.05} c={cPie} hendida={pie === 'hendida'} />
        : <Garra p={fin} ang={angPie} w={wPie * 1.1} c={c} unas={pie === 'garraUnas'} />}
    </g>
  );
};
/** Cuerno con anillos y brillo: trazo grueso que se afina hacia la punta. */
export const Cuerno: React.FC<{ pts: P[]; base: number; c?: string; anillos?: number; punta?: string }> = ({ pts, base, c = '#EFE3C4', anillos = 0, punta }) => {
  const n = pts.length, anchos = pts.map((_, i) => Math.max(3, base * (1 - (i / (n - 1)) * 0.88)));
  const lado = pts.map((q, i) => [q[0] - anchos[i] * 0.18, q[1] - anchos[i] * 0.18] as P);
  return (
    <g>
      <path d={miembro(pts, anchos)} fill={c} stroke={N} strokeWidth={2.4} />
      {punta && <path d={miembro(pts.slice(Math.floor(n * 0.6)), anchos.slice(Math.floor(n * 0.6)))} fill={punta} />}
      {Array.from({ length: anillos }, (_, i) => { const t = (i + 1) / (anillos + 1) * 0.75, q = lerp(pts[Math.floor(t * (n - 1))], pts[Math.min(n - 1, Math.floor(t * (n - 1)) + 1)], (t * (n - 1)) % 1), w = base * (1 - t * 0.88) * 0.48; const sig = pts[Math.min(n - 1, Math.floor(t * (n - 1)) + 1)], ant = pts[Math.floor(t * (n - 1))], a = Math.atan2(sig[1] - ant[1], sig[0] - ant[0]) + Math.PI / 2; return <path key={i} d={`M${r1(q[0] - Math.cos(a) * w)} ${r1(q[1] - Math.sin(a) * w)} Q ${r1(q[0] + 4)} ${r1(q[1] + 4)} ${r1(q[0] + Math.cos(a) * w)} ${r1(q[1] + Math.sin(a) * w)}`} stroke={tono(c, 0.72)} strokeWidth={2} fill="none" />; })}
      <path d={suave(lado.slice(0, -1))} stroke="#FFFFFF" strokeWidth={Math.max(2, base * 0.12)} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );
};
/** Sombra/luz de músculo recortada al cuerpo: medialuna de color más oscuro/claro. */
const Masa: React.FC<{ pts: P[]; c: string; op?: number }> = ({ pts, c, op = 1 }) => <path d={suave(pts, true, 0.9)} fill={c} opacity={op} />;
const Raya: React.FC<{ pts: P[]; c: string; w?: number; op?: number }> = ({ pts, c, w = 3, op = 1 }) => <path d={suave(pts)} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" opacity={op} />;
/** Grupo recortado a una silueta (para sombrear adentro). */
const Recorte: React.FC<{ d: string; children: React.ReactNode }> = ({ d, children }) => {
  const id = 'rc' + idLimpio(useId());
  return <g><defs><clipPath id={id}><path d={d} /></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
};

// ---------- caballo (y mula, Pegaso) ----------
type PoseCab = 'encabritado' | 'paso' | 'galope';
/** Ala grande de plumas en capas (Pegaso, águila): raíz en (0,0), se abre hacia arriba-atrás. abre 0..1 = aleteo. */
export const AlaGrande: React.FC<{ largo: number; c: string; c2: string; c3: string; punta?: string; abre?: number; raquis?: string }> = ({ largo: L, c, c2, c3, punta, abre = 0, raquis = '#00000033' }) => {
  // primarias (largas, abanico), secundarias, cobertoras mayores y menores, hombro
  const prim = Array.from({ length: 9 }, (_, i) => ({ a: 168 + i * (11 + abre * 3), l: L * (0.62 - Math.abs(i - 2.5) * 0.035), w: L * 0.085 }));
  const sec = Array.from({ length: 8 }, (_, i) => ({ a: 70 + i * (11 + abre * 2), l: L * (0.42 - i * 0.012), w: L * 0.08 }));
  const cobM = Array.from({ length: 8 }, (_, i) => ({ a: 66 + i * 11, l: L * 0.26, w: L * 0.07 }));
  const cobm = Array.from({ length: 6 }, (_, i) => ({ a: 60 + i * 12, l: L * 0.16, w: L * 0.065 }));
  // los arranques se escalonan a lo largo del brazo del ala
  const brazo = (t: number): P => [-L * 0.42 * t, -L * 0.3 * t];
  return (
    <g>
      {prim.map((p, i) => { const o = brazo(0.85 + i * 0.02); return <Pluma key={`p${i}`} x={o[0]} y={o[1]} ang={p.a} l={p.l} w={p.w} c={c} punta={punta} raquis={raquis} />; })}
      {sec.map((p, i) => { const o = brazo(0.25 + i * 0.08); return <Pluma key={`s${i}`} x={o[0]} y={o[1]} ang={p.a} l={p.l} w={p.w} c={c} punta={punta} raquis={raquis} />; }).reverse()}
      {cobM.map((p, i) => { const o = brazo(0.15 + i * 0.1); return <Pluma key={`m${i}`} x={o[0]} y={o[1]} ang={p.a} l={p.l} w={p.w} c={c2} raquis={raquis} />; }).reverse()}
      {cobm.map((p, i) => { const o = brazo(0.1 + i * 0.13); return <Pluma key={`n${i}`} x={o[0]} y={o[1]} ang={p.a} l={p.l} w={p.w} c={c3} />; }).reverse()}
      <path d={suave([[L * 0.04, L * 0.04], [-L * 0.2, -L * 0.2], [-L * 0.46, -L * 0.34], [-L * 0.4, -L * 0.24], [-L * 0.16, -L * 0.06]], true, 0.8)} fill={c3} stroke={N} strokeWidth={2.4} />
    </g>
  );
};

type CfgCab = { c: string; crin: string; crinLuz: string; pezuna: string; mula?: boolean; brida?: boolean; alas?: boolean; manchaFrente?: boolean };
const CAB: Record<string, CfgCab> = {
  caballo: { c: '#7A4A2A', crin: '#1E1410', crinLuz: '#5A4030', pezuna: '#2A2018', brida: true, manchaFrente: true },
  mula: { c: '#6E6258', crin: '#2E2620', crinLuz: '#6A5E52', pezuna: '#2A2018', mula: true },
  pegaso: { c: '#F2EEE6', crin: '#E8DCC0', crinLuz: '#FFFFFF', pezuna: ORO, alas: true },
};
/** Caballo épico. props: especie ('caballo'|'mula'|'pegaso'), pose ('encabritado'|'paso'|'galope'), color, crin. */
export const CaballoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const esp = (props.especie as string | undefined) ?? 'caballo', cfg = CAB[esp] ?? CAB.caballo;
  const pose: PoseCab = (props.pose as PoseCab | undefined) ?? (corriendo ? 'galope' : moviendo ? 'paso' : 'encabritado');
  const c = (props.color as string | undefined) ?? cfg.c, crin = (props.crin as string | undefined) ?? cfg.crin, crinLuz = cfg.crinLuz;
  const osc = tono(c, 0.8), lej = tono(c, 0.72), claro = tono(c, 1.22), sombra = tono(c, 0.86);
  const mula = !!cfg.mula, k = mula ? 0.82 : 0.92;
  const ond = Math.sin(f / 9), resp = Math.sin(f / 22) * 2;
  const fase = pose === 'galope' ? f * 0.36 : pose === 'paso' ? f * 0.18 : 0;
  const rot = pose === 'encabritado' ? -27 : pose === 'galope' ? -4 + Math.sin(fase * 2) * 3 : 0;
  // cuerpo en su propio marco (de pie): cadera trasera en (-150,-330)
  const CUERPO: P[] = [[-215, -392], [-180, -442], [-112, -448], [-40, -430], [40, -426], [104, -446], [150, -452], [204, -420], [236, -362], [226, -300], [178, -262], [90, -250], [-10, -252], [-100, -266], [-150, -268], [-192, -298], [-228, -350]];
  const dCuerpo = suave(CUERPO, true, 0.9);
  const HOMBRO: P = [160, -304], CADERA: P = [-150, -324];
  // ángulos de las patas por pose (delanteras en el marco del cuerpo; traseras en el mundo)
  const sw = (ph: number, a: number) => Math.sin(fase + ph) * a;
  const del: number[][] = pose === 'encabritado'
    ? [[30, 100, -12, -40], [14, 120, 8, -24]]
    : pose === 'galope' ? [[-10 + sw(0, 40), sw(0, 50) + 20, sw(0.5, 40), 20], [-10 + sw(0.6, 40), sw(0.6, 50) + 20, sw(1.1, 40), 20]]
    : [[-8 + sw(0, 14), sw(0, 18), Math.max(0, sw(0.6, 26)), 22], [-8 + sw(Math.PI, 14), sw(Math.PI, 18), Math.max(0, sw(Math.PI + 0.6, 26)), 22]];
  const tra: number[][] = pose === 'encabritado'
    ? [[24, -26, 6, 30], [38, -18, 10, 34]]
    : pose === 'galope' ? [[20 + sw(2, 34), -30 + sw(2, 20), sw(2.5, 30), 26], [20 + sw(2.6, 34), -30 + sw(2.6, 20), sw(3.1, 30), 26]]
    : [[22 + sw(Math.PI, 12), -24, sw(Math.PI + 0.5, 10) + 4, 24], [22 + sw(0, 12), -24, sw(0.5, 10) + 4, 24]];
  const LD = [62, 110, 74, 28], LT = [92, 100, 84, 28];
  const AD = [90, 54, 30, 25, 22], AT = [118, 60, 33, 25, 22];
  // dónde queda el suelo: la pezuña trasera más baja (encabritado) o la más baja de todas
  const rotar = (p: P): P => { const a = (rot * Math.PI) / 180, dx = p[0] - CADERA[0], dy = p[1] - CADERA[1]; return [CADERA[0] + dx * Math.cos(a) - dy * Math.sin(a), CADERA[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const ptsT = tra.map((a, i) => cadena([CADERA[0] + (i ? 18 : 0), CADERA[1]], a, LT));
  const ptsD = del.map((a, i) => cadena([HOMBRO[0] + (i ? 14 : 0), HOMBRO[1]], a, LD));
  const pies = [...ptsT.map((q) => q[q.length - 1][1] + 20), ...(pose === 'encabritado' ? [] : ptsD.map((q) => rotar(q[q.length - 1])[1] + 20))];
  const suelo = Math.max(...pies) + (pose === 'galope' ? 30 - Math.abs(Math.sin(fase)) * 30 : 0);
  // cuello con cresta arqueada (marco del cuerpo); encabritado: el cuello se tira adelante
  const giroCuello = pose === 'encabritado' ? 26 : pose === 'galope' ? 14 : 0;
  const rc = (q: P): P => { const a = (giroCuello * Math.PI) / 180, dx = q[0] - 170, dy = q[1] + 400; return [170 + dx * Math.cos(a) - dy * Math.sin(a), -400 + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const CRESTA: P[] = ([[92, -446], [150, -506], [198, -566], [232, -600]] as P[]).map(rc);
  const CUELLO: P[] = [...CRESTA, ...([[268, -560], [262, -470], [244, -392], [236, -330], [160, -340]] as P[]).map(rc)];
  const nuca = CRESTA[3];
  const cuello: P[] = [CRESTA[0], CRESTA[2], nuca];
  const angCab = (pose === 'encabritado' ? 14 : pose === 'galope' ? 10 : 0) + giroCuello + Math.sin(f / 26) * 2;
  const crinPts = (n: number) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1), seg = Math.min(2, Math.floor(t * 3)), u = t * 3 - seg; return lerp(CRESTA[3 - seg], CRESTA[2 - seg], u) as P; });
  const grav = -rot; // los mechones caen hacia el suelo aunque el cuerpo esté girado
  const viento = pose === 'galope' ? -50 : 0;
  const Cola = mula
    ? <g>{(() => { const d = suave([[-214, -400], [-250, -360 + ond * 6], [-262, -250]]); return <><path d={d} stroke={N} strokeWidth={22} fill="none" strokeLinecap="round" /><path d={d} stroke={c} strokeWidth={16} fill="none" strokeLinecap="round" /><Mechon x={-262} y={-270} ang={grav - 6} l={110} w={38} c={crin} luz={crinLuz} /><Mechon x={-258} y={-276} ang={grav + 8} l={96} w={30} c={tono(crin, 1.3)} luz={crinLuz} /></>; })()}</g>
    : <g>
      <path d={suave([[-200, -420], [-236, -404], [-250, -360], [-226, -370], [-206, -390]], true)} fill={crin} stroke={N} strokeWidth={2.4} />
      {[-44, -8, -30, -16, -36, -22].map((a, i) => <Mechon key={i} x={-224 - i * 3} y={-398 + i * 4} ang={a + grav + viento + (pose === 'encabritado' ? -30 : 0) + Math.sin(f / 10 + i * 0.7) * 6} l={(250 + (i % 3) * 30) * (pose === 'paso' ? 1 : 0.78)} w={62 - i * 3} c={i % 2 ? tono(crin, 1.3) : crin} luz={crinLuz} curva={0.22 + (i % 2) * 0.12} />)}
    </g>;
  const Ala = ({ lejos }: { lejos: boolean }) => (
    <g transform={`translate(${lejos ? 120 : 96} ${lejos ? -452 : -430}) rotate(${r1((lejos ? 22 : 8) + Math.sin(f / 8) * 8)}) scale(${lejos ? 0.92 : 1})`}>
      <AlaGrande largo={560} c={lejos ? '#D8D0C0' : '#FFFFFF'} c2={lejos ? '#CFC6B4' : '#F6F1E6'} c3={lejos ? '#C8BEA8' : '#EFE7D6'} punta={lejos ? '#C9A24A' : ORO} abre={(Math.sin(f / 8) + 1) / 2} raquis="#B9AE98" />
    </g>
  );
  const Cabeza = (
    <g transform={`translate(${r1(nuca[0])} ${r1(nuca[1])}) rotate(${r1(angCab)})`}>
      {/* oreja lejana */}
      <path d={mula ? 'M-6 -20 C -14 -80, -2 -112, 6 -116 C 18 -96, 20 -60, 14 -18 Z' : 'M-4 -22 C -10 -54, -2 -74, 4 -78 C 14 -62, 16 -42, 12 -20 Z'} fill={osc} stroke={N} strokeWidth={2.4} transform="translate(-14 4) rotate(-14)" />
      <path d={suave([[-34, 24], [-26, -10], [6, -30], [52, -16], [116, 40], [160, 92], [176, 122], [166, 146], [138, 154], [114, 140], [92, 110], [56, 82], [14, 82], [-16, 64]], true, 0.85)} fill={c} />
      {/* mejilla musculosa y hueso nasal */}
      <path d={suave([[-14, 40], [8, 14], [42, 18], [60, 50], [44, 80], [10, 82]], true)} fill={sombra} />
      <path d="M-8 44 C 0 18, 30 10, 52 26" stroke={claro} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M48 2 C 90 26, 128 66, 156 104" stroke={claro} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M10 82 C 40 92, 60 80, 70 60" stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* hocico */}
      <path d={suave([[132, 96], [170, 110], [176, 132], [162, 150], [130, 152], [118, 130]], true)} fill={esp === 'pegaso' ? '#E9DCCF' : tono(c, 0.7)} />
      <path d="M150 112 C 162 110, 168 120, 160 128 C 154 124, 150 120, 150 112 Z" fill={N} />
      <path d="M134 146 C 146 140, 158 142, 166 146" stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {cfg.manchaFrente && <path d="M30 -16 L 44 -18 L 52 4 L 40 2 Z" fill="#F4EEE2" />}
      <OjoVivo x={40} y={6} r={9.5} iris="#6A3A1A" ang={22} />
      {/* oreja cercana */}
      <path d={mula ? 'M-6 -20 C -14 -80, -2 -112, 6 -116 C 18 -96, 20 -60, 14 -18 Z' : 'M-4 -22 C -10 -54, -2 -74, 4 -78 C 14 -62, 16 -42, 12 -20 Z'} fill={c} stroke={N} strokeWidth={2.4} />
      <path d={mula ? 'M2 -30 C 0 -70, 4 -94, 6 -100' : 'M3 -28 C 2 -46, 4 -60, 5 -64'} stroke={tono(c, 0.6)} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* copete */}
      {!mula && [0, 1, 2].map((i) => <Mechon key={i} x={4 + i * 6} y={-24 + i * 2} ang={60 - i * 8 + ond * 4} l={52 - i * 6} w={20} c={i === 1 ? tono(crin, 1.25) : crin} luz={crinLuz} curva={0.25} />)}
      {/* brida de cuero rojo con discos de oro (fáleras) */}
      {cfg.brida && <g>
        <path d="M2 -14 C 20 40, 60 90, 120 112 M124 98 C 130 120, 128 140, 116 150 M44 -12 C 80 20, 110 56, 132 96" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M2 -14 C 20 40, 60 90, 120 112 M124 98 C 130 120, 128 140, 116 150 M44 -12 C 80 20, 110 56, 132 96" stroke={ROJO} strokeWidth={5} fill="none" strokeLinecap="round" />
        {[[30, 42, 11], [120, 110, 9], [2, -14, 8]].map(([cx, cy, r], i) => <g key={i}><circle cx={cx} cy={cy} r={r} fill={ORO} stroke={N} strokeWidth={2.2} /><circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.32} fill={ORO_LUZ} /></g>)}
      </g>}
      {esp === 'pegaso' && <g><path d="M-2 -18 C 30 -26, 54 -16, 60 0" stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M-2 -18 C 30 -26, 54 -16, 60 0" stroke={ORO} strokeWidth={4.4} fill="none" strokeLinecap="round" /></g>}
    </g>
  );
  const dCuello = suave(CUELLO, true, 0.85);
  const mn = (q: P, dx: number, dy: number): P => [q[0] + dx, q[1] + dy];
  return (
    <Marco x={x} y={y} s={s * k} voltear={voltear} opacity={opacity}>
      <g transform={`translate(0 ${r1(-suelo)})`}>
        {cfg.alas && <g transform={`rotate(${rot} ${CADERA[0]} ${CADERA[1]})`}><Ala lejos /></g>}
        {/* patas lejanas (más oscuras) */}
        <Pata pts={ptsT[1]} anchos={AT} c={lej} pie="pezuna" cPie={cfg.pezuna} angPie={tra[1][3]} />
        <g transform={`rotate(${rot} ${CADERA[0]} ${CADERA[1]})`}>
          <Pata pts={ptsD[1]} anchos={AD} c={lej} pie="pezuna" cPie={cfg.pezuna} angPie={del[1][3]} />
          {Cola}
        </g>
        {/* patas cercanas: van antes que el cuerpo, que les tapa el arranque sin línea */}
        <Pata pts={ptsT[0]} anchos={AT} c={c} pie="pezuna" cPie={cfg.pezuna} angPie={tra[0][3]} luz={claro} />
        <g transform={`rotate(${rot} ${CADERA[0]} ${CADERA[1]})`}>
          <Pata pts={ptsD[0]} anchos={AD} c={c} pie="pezuna" cPie={cfg.pezuna} angPie={del[0][3]} luz={claro} />
          <path d={dCuerpo} fill={c} />
          <path d={dCuello} fill={c} />
          <Recorte d={dCuerpo}>
            {/* panza en sombra, lomo con luz, paleta y anca marcadas */}
            <ellipse cx={0} cy={-246} rx={250} ry={44} fill={sombra} />
            <Masa pts={[[96, -446], [180, -404], [214, -318], [176, -266], [130, -320]]} c={sombra} />
            <Masa pts={[[-230, -372], [-184, -440], [-104, -438], [-84, -360], [-120, -280], [-196, -300]]} c={sombra} op={0.85} />
            <Raya pts={[[-196, -436], [-120, -442], [-40, -424], [60, -422], [120, -446]]} c={claro} w={9} op={0.5} />
            <Raya pts={[[-176, -412], [-112, -404], [-100, -330], [-128, -284]]} c={claro} w={6} op={0.55} />
            <Raya pts={[[124, -424], [168, -376], [184, -300]]} c={claro} w={6} op={0.55} />
            <Raya pts={[[-50, -284], [20, -316], [96, -300]]} c={osc} w={3} op={0.55} />
          </Recorte>
          <Recorte d={dCuello}>
            <path d={suave([mn(CUELLO[5], -60, 0), mn(CUELLO[4], -50, 30), CUELLO[4], CUELLO[5], CUELLO[6], CUELLO[7], mn(CUELLO[7], -70, -10)], true)} fill={sombra} />
            <Raya pts={[mn(CRESTA[0], 20, 40), mn(CRESTA[1], 26, 46), mn(CRESTA[2], 26, 50)]} c={claro} w={7} op={0.45} />
            <Raya pts={[mn(CUELLO[5], -30, 10), mn(CUELLO[6], -30, 10), mn(CUELLO[7], -40, 0)]} c={osc} w={3} op={0.5} />
          </Recorte>
          {/* crin en dos capas de mechones que caen sobre el cuello */}
          {!mula && crinPts(10).map((q, i) => <Mechon key={`a${i}`} x={q[0] - 4} y={q[1] - 6} ang={-34 + grav - giroCuello * 0.5 + viento * 0.6 + (pose === 'encabritado' ? -26 : 0) + Math.sin(f / 9 + i) * 5} l={(118 - i * 4) * (pose === 'galope' ? 0.85 : 1)} w={44} c={tono(crin, 1.3)} luz={crinLuz} curva={0.28} />)}
          {!mula && crinPts(10).map((q, i) => <Mechon key={`b${i}`} x={q[0] + 6} y={q[1] + 6} ang={-14 + grav - giroCuello * 0.5 + viento * 0.6 + (pose === 'encabritado' ? -20 : 0) + Math.sin(f / 9 + i + 1) * 6} l={(96 - i * 3) * (pose === 'galope' ? 0.85 : 1)} w={40} c={crin} luz={crinLuz} curva={0.34} />)}
          {mula && <path d={suave([...crinPts(8).map((q) => [q[0] - 8, q[1] - 12] as P), ...crinPts(8).reverse().map((q) => [q[0] + 12, q[1] + 14] as P)], true)} fill={crin} stroke={N} strokeWidth={2.2} />}
          {Cabeza}
          {cfg.alas && <Ala lejos={false} />}
        </g>
      </g>
    </Marco>
  );
};

// ---------- cuadrúpedo genérico (toros, ciervos, cánidos, león, ovinos) ----------
type Pie = 'pezuna' | 'hendida' | 'garra' | 'garraUnas';
type Cuad = {
  k: number; c: string; lej: string; cPie: string; pie: Pie;
  cuerpo: P[]; hombro: P; cadera: P; LD: number[]; LT: number[]; AD: number[]; AT: number[];
  del: number[][]; tra: number[][]; rot?: number; // [cercana, lejana]; rot = cuerpo inclinado sobre la cadera
  cuello: P[]; nuca: P; angCab: number; cabeza: React.ReactNode; cabezaLejos?: React.ReactNode;
  cola?: React.ReactNode; detras?: React.ReactNode; sombreado?: React.ReactNode; encima?: React.ReactNode; delante?: React.ReactNode;
  pelaje?: React.ReactNode; // reemplaza el relleno liso del cuerpo (lana)
};
/** Mueve las patas al caminar/correr (suma oscilación a los ángulos). */
const andar = (a: number[][], f: number, mov: boolean, corre: boolean, desfase: number): number[][] => {
  if (!mov) return a;
  const fa = f * (corre ? 0.36 : 0.18), amp = corre ? 30 : 16;
  return a.map((g, i) => g.map((v, j) => v + (j < 3 ? Math.sin(fa + desfase + i * Math.PI + j * 0.6) * amp * (j === 2 ? 0.7 : 1) : 0)));
};
const Cuadrupedo: React.FC<{ q: Cuad; x: number; y: number; s: number; voltear?: boolean; opacity?: number; f: number; moviendo?: boolean; corriendo?: boolean }> = ({ q, x, y, s, voltear, opacity, f, moviendo, corriendo }) => {
  const rot = q.rot ?? 0, mov = !!(moviendo || corriendo);
  const del = andar(q.del, f, mov, !!corriendo, 0), tra = andar(q.tra, f, mov, !!corriendo, Math.PI / 2);
  const ptsD = del.map((a, i) => cadena([q.hombro[0] - i * 14, q.hombro[1]], a, q.LD));
  const ptsT = tra.map((a, i) => cadena([q.cadera[0] + i * 16, q.cadera[1]], a, q.LT));
  const rotar = (p: P): P => { const a = (rot * Math.PI) / 180, dx = p[0] - q.cadera[0], dy = p[1] - q.cadera[1]; return [q.cadera[0] + dx * Math.cos(a) - dy * Math.sin(a), q.cadera[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const pies = [...ptsT.map((p) => p[p.length - 1][1]), ...(rot < -10 ? [] : ptsD.map((p) => rotar(p[p.length - 1])[1]))];
  const suelo = Math.max(...pies) + q.AT[q.AT.length - 1] * 1.05 - (corriendo ? Math.abs(Math.sin(f * 0.36)) * 16 : 0);
  const dCuerpo = suave(q.cuerpo, true, 0.9), dCuello = suave(q.cuello, true, 0.85), R = `rotate(${rot} ${q.cadera[0]} ${q.cadera[1]})`;
  const claro = tono(q.c, 1.2);
  return (
    <Marco x={x} y={y} s={s * q.k} voltear={voltear} opacity={opacity}>
      <g transform={`translate(0 ${r1(-suelo)})`}>
        <g transform={R}>{q.detras}</g>
        <Pata pts={ptsT[1]} anchos={q.AT} c={q.lej} pie={q.pie} cPie={q.cPie} angPie={tra[1][3]} />
        <g transform={R}><Pata pts={ptsD[1]} anchos={q.AD} c={q.lej} pie={q.pie} cPie={q.cPie} angPie={del[1][3]} />{q.cola}</g>
        <Pata pts={ptsT[0]} anchos={q.AT} c={q.c} pie={q.pie} cPie={q.cPie} angPie={tra[0][3]} luz={claro} />
        <g transform={R}>
          <Pata pts={ptsD[0]} anchos={q.AD} c={q.c} pie={q.pie} cPie={q.cPie} angPie={del[0][3]} luz={claro} />
          {q.cabezaLejos && <g transform={`translate(${q.nuca[0]} ${q.nuca[1]}) rotate(${r1(q.angCab)})`}>{q.cabezaLejos}</g>}
          {q.pelaje ?? <path d={dCuerpo} fill={q.c} />}
          <path d={dCuello} fill={q.c} />
          {q.sombreado && <Recorte d={dCuerpo + ' ' + dCuello}>{q.sombreado}</Recorte>}
          {q.encima}
          <g transform={`translate(${q.nuca[0]} ${q.nuca[1]}) rotate(${r1(q.angCab + Math.sin(f / 26) * 1.5)})`}>{q.cabeza}</g>
          {q.delante}
        </g>
      </g>
    </Marco>
  );
};
/** Cola de cuerda con borla (toro, vaca, león). */
const ColaBorla: React.FC<{ pts: P[]; c: string; borla: string; luz: string; w?: number; ang?: number }> = ({ pts, c, borla, luz, w = 16, ang = 0 }) => {
  const d = suave(pts), fin = pts[pts.length - 1];
  return <g><path d={d} stroke={N} strokeWidth={w + 5} fill="none" strokeLinecap="round" /><path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
    {[-14, 6, 22].map((a, i) => <Mechon key={i} x={fin[0]} y={fin[1] - 6} ang={ang + a} l={70 - i * 8} w={30} c={i === 1 ? tono(borla, 1.3) : borla} luz={luz} />)}</g>;
};

// ---------- toro, buey, vaca ----------
type EspBov = 'toro' | 'buey' | 'vaca';
const BOV: Record<EspBov, { c: string; k: number; cuerno: string; hocico: string }> = {
  toro: { c: '#3E2A20', k: 1.04, cuerno: '#EFE3C4', hocico: '#2A1C16' },
  buey: { c: '#E4D8BE', k: 1.06, cuerno: '#EFE3C4', hocico: '#C99A86' },
  vaca: { c: '#9A5232', k: 0.9, cuerno: '#EFE3C4', hocico: '#D9A08E' },
};
export const BovinoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const esp = ((props.especie as string) ?? 'toro') as EspBov, b = BOV[esp] ?? BOV.toro;
  const c = (props.color as string | undefined) ?? b.c, osc = tono(c, 0.78), som = tono(c, 0.86), claro = tono(c, esp === 'toro' ? 1.6 : 1.12), lej = tono(c, 0.72);
  const toro = esp === 'toro', ond = Math.sin(f / 9);
  const joroba = toro ? -424 : esp === 'buey' ? -400 : -372;
  const cuerpo: P[] = [[-262, -318], [-226, -364], [-130, -374], [-20, -364], [70, joroba + 34], [140, joroba], [196, joroba + 18], [236, -350], [262, -284], [256, -214], [222, -176], [150, -162], [60, -160], [-30, -166], [-120, -172], [-180, -182], [-236, -214], [-270, -266]];
  const cuello: P[] = toro ? [[150, joroba + 4], [236, -396], [292, -350], [318, -286], [300, -214], [250, -180], [196, -230]] : [[150, joroba + 4], [236, -420], [292, -424], [322, -360], [306, -280], [262, -200], [206, -230]];
  const nuca: P = toro ? [300, -350] : [298, -420];
  const cuernoP: P[] = toro ? [[4, -18], [-18, -56], [-2, -100], [44, -122], [86, -112]] : esp === 'buey' ? [[2, -18], [-20, -60], [-4, -112], [36, -136], [64, -128]] : [[2, -18], [-18, -50], [-10, -84], [16, -102]];
  const Cabeza = (lejos: boolean) => lejos ? (
    <g transform="translate(20 -8)"><Cuerno pts={cuernoP} base={toro ? 34 : 28} c={tono(b.cuerno, 0.8)} anillos={2} punta={esp === 'buey' ? ORO_OSC : toro ? '#3A3026' : undefined} /></g>
  ) : (
    <g>
      <ellipse cx={-8} cy={18} rx={34} ry={14} transform="rotate(20 -8 18)" fill={c} stroke={N} strokeWidth={2.4} />
      <ellipse cx={-10} cy={18} rx={20} ry={7} transform="rotate(20 -10 18)" fill={tono(c, 0.6)} />
      <path d={suave([[-26, -6], [8, -30], [52, -26], [96, 4], [132, 52], [148, 92], [140, 120], [112, 130], [82, 120], [54, 98], [18, 84], [-12, 60], [-30, 26]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.6} />
      <path d={suave([[100, 66], [146, 88], [142, 120], [112, 130], [90, 108]], true)} fill={b.hocico} />
      <path d="M126 92 C 138 88, 144 98, 136 104 C 130 100, 126 98, 126 92 Z" fill={N} />
      <path d="M100 124 C 112 118, 124 120, 134 124" stroke={N} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d={suave([[8, 40], [30, 22], [64, 40], [60, 80], [26, 82]], true)} fill={som} />
      <path d="M40 -18 C 70 0, 100 30, 124 64" stroke={claro} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55} />
      {esp === 'vaca' && <path d={suave([[20, -26], [56, -22], [90, 10], [70, 20], [40, 0]], true)} fill="#F2E8D4" />}
      <OjoVivo x={44} y={8} r={9.5} iris={toro ? '#8A2A14' : '#4A2A14'} ang={30} fiero={toro} />
      {toro && [[6, -24], [22, -30], [14, -12], [30, -16]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={9} fill={tono(c, 0.8)} stroke={N} strokeWidth={1.8} /><path d={`M${cx - 4} ${cy + 1} a 4 4 0 1 1 8 0`} stroke={claro} strokeWidth={1.8} fill="none" /></g>)}
      <Cuerno pts={cuernoP} base={toro ? 34 : 28} c={b.cuerno} anillos={toro ? 3 : 2} punta={esp === 'buey' ? ORO : toro ? '#3A3026' : undefined} />
      {esp === 'buey' && <g>{/* cinta sagrada roja y blanca en el cuerno */}
        <path d="M-20 -60 C -10 -50, 4 -50, 12 -60" stroke={N} strokeWidth={13} fill="none" /><path d="M-20 -60 C -10 -50, 4 -50, 12 -60" stroke={ROJO} strokeWidth={9} fill="none" /><path d="M-20 -60 C -10 -50, 4 -50, 12 -60" stroke="#F4EEE2" strokeWidth={9} strokeDasharray="6 6" fill="none" />
        <Mechon x={-8} y={-52} ang={-10 + ond * 6} l={70} w={14} c={ROJO} /><Mechon x={2} y={-52} ang={6 + ond * 6} l={60} w={12} c="#F4EEE2" />
      </g>}
    </g>
  );
  const q: Cuad = {
    k: b.k, c, lej, cPie: '#2A2018', pie: 'hendida', cuerpo, hombro: [180, -222], cadera: [-196, -232],
    LD: [52, 72, 52, 20], LT: [78, 72, 58, 20], AD: [112, 62, 36, 30, 28], AT: [142, 66, 36, 30, 28],
    del: toro ? [[22, 70, -60, -40], [-6, 0, 4, 20]] : esp === 'buey' ? [[-6, 0, 2, 18], [8, 6, 4, 22]] : [[-4, 2, 4, 20], [10, 6, 2, 22]],
    tra: [[22, -28, 6, 22], [14, -22, 2, 22]],
    cuello, nuca, angCab: toro ? 46 : esp === 'buey' ? 20 : 26, cabeza: Cabeza(false), cabezaLejos: Cabeza(true),
    cola: <ColaBorla pts={toro ? [[-260, -310], [-318, -350 + ond * 8], [-348, -300], [-336, -220]] : [[-262, -310], [-290, -260 + ond * 4], [-292, -170]]} c={c} borla={toro ? '#1E1410' : tono(c, 0.6)} luz={claro} ang={toro ? -10 : 0} />,
    sombreado: <g>
      <ellipse cx={0} cy={-150} rx={280} ry={44} fill={som} />
      <Masa pts={[[110, joroba + 10], [200, -390], [250, -300], [230, -200], [170, -230], [150, -330]]} c={som} />
      <Masa pts={[[-276, -290], [-230, -360], [-150, -370], [-130, -280], [-170, -200], [-250, -220]]} c={som} op={0.85} />
      <Raya pts={[[-220, -362], [-120, -370], [-20, -360], [80, joroba + 30], [150, joroba + 6]]} c={claro} w={9} op={0.45} />
      <Raya pts={[[150, joroba + 30], [196, -340], [212, -260]]} c={claro} w={6} op={0.5} />
      <Raya pts={[[-200, -340], [-150, -330], [-150, -260]]} c={claro} w={6} op={0.5} />
      {[0, 1, 2].map((i) => <Raya key={i} pts={[[-30 + i * 36, -300], [-14 + i * 36, -250], [-24 + i * 36, -200]]} c={osc} w={3} op={0.45} />)}
      {esp === 'vaca' && <g fill="#F2E8D4"><ellipse cx={-120} cy={-300} rx={70} ry={46} /><ellipse cx={40} cy={-220} rx={60} ry={40} /><ellipse cx={-10} cy={-360} rx={46} ry={22} /></g>}
      {/* papada */}
      <path d={suave([[230, -260], [270, -230], [256, -170], [222, -170]])} stroke={osc} strokeWidth={3} fill="none" />
    </g>,
    delante: esp === 'vaca' ? <path d={suave([[-150, -168], [-110, -150], [-90, -128], [-120, -126], [-150, -140]], true)} fill="#E9A8A0" stroke={N} strokeWidth={2.2} /> : undefined,
  };
  return <Cuadrupedo q={q} x={x} y={y} s={s} voltear={voltear} opacity={opacity} f={f} moviendo={moviendo} corriendo={corriendo} />;
};

// ---------- ciervo ----------
const Asta: React.FC<{ lejos?: boolean }> = ({ lejos }) => {
  const c = lejos ? '#B9A27A' : '#E6D5B0';
  const ramas: P[][] = [[[6, -14], [-8, -60], [-4, -112], [12, -164], [34, -206]], [[-6, -50], [30, -66], [52, -70]], [[-4, -100], [26, -118], [44, -134]], [[6, -150], [-20, -186], [-34, -208]], [[16, -170], [46, -186], [64, -184]]];
  return <g>{ramas.map((r, i) => <Cuerno key={i} pts={r} base={i ? 12 : 18} c={c} />)}</g>;
};
export const CiervoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const c = (props.color as string | undefined) ?? '#A0623A', som = tono(c, 0.85), claro = '#F1E4C8', lej = tono(c, 0.72);
  const Cabeza = (
    <g>
      <g transform="translate(18 -6) rotate(8)"><Asta lejos /></g>
      <path d="M-6 -6 C -40 -40, -70 -40, -84 -30 C -66 -14, -40 -2, -10 4 Z" fill={som} stroke={N} strokeWidth={2.4} />
      <path d={suave([[-18, 6], [6, -20], [48, -18], [92, 4], [118, 22], [116, 40], [92, 46], [50, 42], [10, 36], [-16, 24]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.6} />
      <path d={suave([[86, 30], [116, 30], [110, 44], [88, 44]], true)} fill="#F1E4C8" />
      <ellipse cx={112} cy={22} rx={8} ry={6.5} fill={N} />
      <path d="M30 -10 C 60 -6, 90 8, 110 18" stroke={tono(c, 1.25)} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
      <OjoVivo x={40} y={4} r={8.5} iris="#3A2010" ang={10} />
      <Asta />
      <path d="M2 -10 C -24 -54, -58 -60, -76 -52 C -58 -32, -30 -14, 0 0 Z" fill={c} stroke={N} strokeWidth={2.4} />
      <path d="M-8 -16 C -26 -40, -48 -44, -62 -42" stroke="#E9C6A8" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
  const q: Cuad = {
    k: 1, c, lej, cPie: '#2A2018', pie: 'hendida',
    cuerpo: [[-182, -334], [-150, -366], [-80, -370], [0, -360], [80, -370], [130, -386], [172, -360], [194, -312], [180, -262], [132, -246], [40, -240], [-50, -244], [-120, -252], [-170, -276], [-194, -308]],
    hombro: [134, -272], cadera: [-134, -282], LD: [62, 92, 82, 18], LT: [84, 86, 94, 18], AD: [64, 32, 19, 15, 14], AT: [86, 36, 19, 15, 14],
    del: [[26, 80, -50, -30], [-4, 0, 2, 16]], tra: [[24, -30, 6, 18], [16, -22, 2, 18]],
    cuello: [[104, -376], [150, -460], [196, -540], [230, -566], [256, -528], [222, -440], [196, -300], [150, -272]], nuca: [230, -556], angCab: 30,
    cabeza: Cabeza,
    cola: <g><Mechon x={-188} y={-344} ang={-30} l={60} w={34} c={claro} /><Mechon x={-186} y={-346} ang={-40} l={40} w={22} c={tono(c, 0.7)} /></g>,
    sombreado: <g>
      <ellipse cx={0} cy={-236} rx={200} ry={30} fill={claro} />
      <Masa pts={[[90, -380], [170, -350], [184, -270], [140, -260], [120, -320]]} c={som} />
      <Masa pts={[[-196, -320], [-150, -364], [-90, -360], [-80, -300], [-120, -256], [-180, -270]]} c={som} op={0.85} />
      <Raya pts={[[-160, -362], [-60, -364], [60, -366], [140, -380]]} c={tono(c, 1.25)} w={7} op={0.5} />
      {[[-120, -330], [-80, -340], [-40, -334], [0, -342], [40, -336], [-100, -306], [-60, -312], [-20, -306], [20, -314], [60, -320], [-140, -300]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={9} ry={6} fill={claro} opacity={0.9} />)}
      <path d={suave([[190, -330], [230, -450], [250, -520], [240, -470], [206, -330]], true)} fill={claro} opacity={0.7} />
    </g>,
  };
  return <Cuadrupedo q={q} x={x} y={y} s={s} voltear={voltear} opacity={opacity} f={f} moviendo={moviendo} corriendo={corriendo} />;
};

// ---------- perro, lobo, Licaón, Cerbero ----------
/** Cabeza de cánido de perfil (origen = nuca). boca: 'cerrada' | 'aullido' | 'grunido'. */
const CabezaCan: React.FC<{ c: string; claro: string; boca: 'cerrada' | 'aullido' | 'grunido'; iris?: string; collar?: string; f: number; fiero?: boolean }> = ({ c, claro, boca, iris = '#C9921E', collar, f, fiero }) => {
  const abre = boca === 'cerrada' ? 0 : boca === 'aullido' ? 22 : 16 + Math.sin(f / 7) * 3;
  return (
    <g>
      {collar && <g><path d="M-26 -30 C -40 10, -30 46, -10 60" stroke={N} strokeWidth={24} fill="none" strokeLinecap="round" /><path d="M-26 -30 C -40 10, -30 46, -10 60" stroke={collar} strokeWidth={18} fill="none" strokeLinecap="round" />
        {[[-33, -8], [-32, 18], [-24, 42]].map(([cx, cy], i) => <g key={i}><path d={`M${cx} ${cy} l -18 -4 l 16 -8 Z`} fill={ORO} stroke={N} strokeWidth={1.8} strokeLinejoin="round" /><circle cx={cx} cy={cy} r={5} fill={ORO} stroke={N} strokeWidth={1.6} /></g>)}</g>}
      {/* oreja lejana */}
      <path d="M-4 -28 L 4 -76 L 26 -34 Z" fill={tono(c, 0.7)} stroke={N} strokeWidth={2.4} strokeLinejoin="round" transform="translate(-16 2)" />
      {/* mandíbula (se abre) */}
      <g transform={`rotate(${abre} 0 20)`}>
        <path d={suave([[-10, 22], [40, 26], [96, 22], [104, 32], [80, 44], [30, 46], [-6, 38]], true)} fill={claro} stroke={N} strokeWidth={2.4} />
        {abre > 0 && <path d="M30 26 L 96 22" stroke="#8E2A2A" strokeWidth={8} strokeLinecap="round" />}
        {abre > 0 && [50, 84].map((x0) => <path key={x0} d={`M${x0} 22 l 4 -12 l 4 12 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
      </g>
      {abre > 0 && <path d={`M28 18 L 98 10 L 96 ${18 + abre * 0.9} L 30 ${30 + abre * 0.4} Z`} fill="#6E1E1E" />}
      <path d={suave([[-30, 14], [-26, -18], [0, -32], [40, -28], [72, -14], [112, -4], [122, 6], [114, 18], [70, 22], [30, 30], [-8, 34]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.6} />
      {abre > 0 && [54, 92].map((x0) => <path key={x0} d={`M${x0} 18 l 4 14 l 4 -14 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
      <path d={suave([[40, 6], [112, 2], [116, 16], [70, 22], [36, 22]], true)} fill={claro} />
      <ellipse cx={116} cy={0} rx={9} ry={7} fill={N} /><ellipse cx={113} cy={-3} rx={3} ry={2} fill="#6A6A6A" />
      <path d={suave([[30, -26], [60, -16], [100, -6]])} stroke={tono(c, 1.3)} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
      {fiero && <path d="M60 -16 C 70 -10, 78 -8, 88 -8 M58 -8 C 68 -4, 76 -2, 86 -2" stroke={tono(c, 0.6)} strokeWidth={2.4} fill="none" strokeLinecap="round" />}
      <OjoVivo x={40} y={-10} r={8} iris={iris} ang={-8} fiero={fiero} />
      <path d="M-6 -28 L 2 -82 L 28 -32 Z" fill={c} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M2 -34 L 6 -66 L 18 -36 Z" fill={tono(claro, 0.85)} />
    </g>
  );
};
/** Gorguera de pelo (mechones) alrededor del cuello. */
const Gorguera: React.FC<{ pts: P[]; c: string; luz: string; l: number; ang: number; f: number }> = ({ pts, c, luz, l, ang, f }) => (
  <g>{pts.map((q, i) => <Mechon key={i} x={q[0]} y={q[1]} ang={ang + (i % 3 - 1) * 14 + Math.sin(f / 10 + i) * 4} l={l * (0.8 + (i % 2) * 0.25)} w={l * 0.55} c={i % 2 ? c : tono(c, 0.88)} luz={luz} curva={0.3} />)}</g>
);
/** Culebrita (melena de serpientes de Cerbero, cola). Raíz en (x,y), sube y se curva. */
const Culebrita: React.FC<{ x: number; y: number; ang: number; l: number; f: number; c?: string }> = ({ x, y, ang, l, f, c = '#4E8A3E' }) => {
  const o = Math.sin(f / 8 + x) * 10, pts: P[] = [[0, 0], [l * 0.3 + o * 0.3, -l * 0.3], [l * 0.1 - o * 0.5, -l * 0.65], [l * 0.45, -l * 0.95]];
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${ang})`}>
      <path d={miembro(pts, [l * 0.16, l * 0.13, l * 0.1, l * 0.08])} fill={c} stroke={N} strokeWidth={2.2} />
      <g transform={`translate(${r1(pts[3][0])} ${r1(pts[3][1])}) rotate(-20)`}><ellipse rx={l * 0.13} ry={l * 0.085} fill={c} stroke={N} strokeWidth={2} /><circle cx={l * 0.03} cy={-l * 0.03} r={l * 0.025} fill="#E8B93E" /><path d={`M${r1(l * 0.12)} 0 l ${r1(l * 0.08)} -3 m -2 3 l ${r1(l * 0.08)} 3`} stroke={ROJO} strokeWidth={1.6} /></g>
    </g>
  );
};
type EspCan = 'perro' | 'lobo' | 'licaon' | 'cerbero';
export const CanidoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const esp = ((props.especie as string) ?? 'lobo') as EspCan;
  const cfg = ({ perro: { c: '#C08A4E', claro: '#F1DDB6', k: 0.95, iris: '#6A3A14' }, lobo: { c: '#8A867E', claro: '#E6E1D6', k: 1.05, iris: '#D9A21E' }, licaon: { c: '#5E5A56', claro: '#B9B2A6', k: 1.15, iris: '#E0601E' }, cerbero: { c: '#3E3430', claro: '#8A766A', k: 1.35, iris: '#F08A1E' } } as const)[esp];
  const c = (props.color as string | undefined) ?? cfg.c, claro = cfg.claro, som = tono(c, 0.82), lej = tono(c, 0.7), luz = tono(c, 1.35);
  const aullido = esp === 'lobo', fiero = esp === 'licaon' || esp === 'cerbero';
  const cuello: P[] = aullido ? [[96, -292], [140, -354], [180, -414], [216, -432], [236, -384], [206, -300], [184, -214], [140, -206]] : [[96, -292], [150, -330], [200, -350], [232, -330], [236, -270], [206, -214], [140, -206]];
  const nuca: P = aullido ? [212, -424] : [214, -330];
  const angCab = aullido ? -44 : fiero ? 14 : -6;
  const cab = (boca: 'cerrada' | 'aullido' | 'grunido', collar?: string) => <CabezaCan c={c} claro={claro} boca={boca} iris={cfg.iris} collar={collar} f={f} fiero={fiero} />;
  const collarC = esp === 'perro' ? ROJO : esp === 'cerbero' ? BRONCE : undefined;
  const q: Cuad = {
    k: cfg.k, c, lej, cPie: c, pie: fiero ? 'garraUnas' : 'garra',
    cuerpo: [[-172, -248], [-130, -284], [-40, -276], [60, -282], [120, -306], [164, -290], [190, -240], [178, -196], [130, -176], [40, -182], [-40, -174], [-110, -178], [-160, -200], [-182, -228]],
    hombro: [134, -200], cadera: [-130, -212], LD: [46, 72, 48, 14], LT: [62, 62, 60, 14], AD: [70, 34, 22, 18, 18], AT: [90, 36, 22, 18, 18],
    del: fiero ? [[30, 20, 6, 30], [10, -4, 4, 24]] : esp === 'perro' ? [[24, 56, -30, -10], [0, -4, 2, 20]] : [[-4, -2, 4, 20], [8, 2, 2, 20]],
    tra: fiero ? [[34, -40, 10, 26], [26, -30, 6, 24]] : [[26, -30, 8, 22], [18, -24, 4, 22]],
    cuello, nuca, angCab,
    cabeza: cab(aullido ? 'aullido' : fiero ? 'grunido' : 'cerrada', collarC),
    cabezaLejos: esp === 'cerbero' ? <g transform="translate(-30 -96) rotate(-26)">{cab('grunido', collarC)}</g> : undefined,
    cola: esp === 'perro'
      ? <g>{(() => { const d = suave([[-172, -248], [-212, -300], [-200, -350], [-170 + Math.sin(f / 6) * 6, -360]]); return <><path d={d} stroke={N} strokeWidth={22} fill="none" strokeLinecap="round" /><path d={d} stroke={c} strokeWidth={16} fill="none" strokeLinecap="round" /></>; })()}</g>
      : esp === 'cerbero' ? <Culebrita x={-176} y={-236} ang={-70} l={240} f={f} />
      : <g>{[-40, -54, -28].map((a, i) => <Mechon key={i} x={-172} y={-246 + i * 6} ang={a + Math.sin(f / 10) * 6} l={150 - i * 20} w={56 - i * 8} c={i === 1 ? tono(c, 0.8) : c} luz={luz} curva={0.2} />)}<Mechon x={-176} y={-244} ang={-44} l={150} w={20} c={N} curva={0.2} trazo={0} /></g>,
    detras: esp === 'cerbero' ? <g>{[-120, -80, -40, 0, 40, 80].map((x0, i) => <Culebrita key={i} x={x0} y={-276 + (i === 5 ? -14 : 0)} ang={-20 - i * 4} l={84 + (i % 2) * 20} f={f + i * 7} c={i % 2 ? '#4E8A3E' : '#3E7A4A'} />)}</g> : undefined,
    sombreado: <g>
      <ellipse cx={0} cy={-172} rx={200} ry={24} fill={claro} />
      <path d={suave([[-160, -270], [-40, -282], [80, -290], [140, -300], [120, -260], [0, -250], [-150, -246]], true)} fill={esp === 'perro' ? tono(c, 0.9) : tono(c, 0.72)} />
      <Masa pts={[[96, -300], [170, -280], [188, -210], [140, -190], [120, -250]]} c={som} />
      <Masa pts={[[-186, -230], [-150, -278], [-90, -270], [-80, -210], [-120, -180], [-170, -196]]} c={som} op={0.85} />
      {[0, 1, 2].map((i) => <Raya key={i} pts={[[-30 + i * 32, -250], [-20 + i * 32, -220], [-28 + i * 32, -194]]} c={tono(c, 0.7)} w={2.6} op={0.5} />)}
    </g>,
    encima: undefined,
    delante: esp === 'licaon' ? <g transform={`translate(170 -300) rotate(${r1(Math.sin(f / 9) * 4)})`}>
      <path d={suave([[-20, -30], [30, -20], [40, 20], [-30, 90], [-110, 120], [-130, 90], [-60, 40]], true, 0.6)} fill={ROJO} stroke={N} strokeWidth={2.6} />
      <path d={suave([[-120, 100], [-60, 60], [0, 20]])} stroke={tono(ROJO, 0.7)} strokeWidth={3} fill="none" />
      <path d="M-128 104 L -40 50" stroke={ORO} strokeWidth={4} strokeDasharray="3 10" strokeLinecap="round" />
      <circle cx={18} cy={-8} r={14} fill={ORO} stroke={N} strokeWidth={2.4} /><circle cx={14} cy={-12} r={5} fill={ORO_LUZ} />
    </g> : esp === 'cerbero' ? <g transform={`translate(${r1(nuca[0] + 16)} ${r1(nuca[1] + 96)}) rotate(${r1(30 + Math.sin(f / 20) * 2)})`}>
      <path d={miembro([[-80, -60], [-30, -16], [0, 0]], [90, 76, 60])} fill={c} />
      {cab('grunido', BRONCE)}
    </g> : undefined,
  };
  return <Cuadrupedo q={q} x={x} y={y} s={s} voltear={voltear} opacity={opacity} f={f} moviendo={moviendo} corriendo={corriendo} />;
};

// ---------- león ----------
const CabezaLeon: React.FC<{ c: string; claro: string; f: number; ruge: boolean }> = ({ c, claro, f, ruge }) => {
  const abre = ruge ? 20 + Math.sin(f / 6) * 3 : 0;
  return (
    <g>
      <g transform={`rotate(${abre} 10 24)`}>
        <path d={suave([[-4, 26], [50, 34], [104, 26], [110, 38], [80, 54], [30, 56], [0, 46]], true)} fill={claro} stroke={N} strokeWidth={2.4} />
        {abre > 0 && <path d="M40 30 L 100 26" stroke="#8E2A2A" strokeWidth={9} strokeLinecap="round" />}
        {abre > 0 && [58, 92].map((x0) => <path key={x0} d={`M${x0} 26 l 5 -16 l 5 16 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
      </g>
      {abre > 0 && <path d={`M36 22 L 104 14 L 100 ${24 + abre * 0.9} L 40 ${36 + abre * 0.5} Z`} fill="#6E1E1E" />}
      <path d={suave([[-24, 14], [-16, -30], [16, -48], [60, -44], [96, -28], [126, -10], [132, 12], [118, 26], [80, 28], [36, 36], [-6, 40]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.6} />
      {abre > 0 && [62, 98].map((x0) => <path key={x0} d={`M${x0} 22 l 5 18 l 5 -18 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} strokeLinejoin="round" />)}
      <path d={suave([[60, 0], [128, -6], [132, 14], [100, 26], [62, 24]], true)} fill={claro} />
      <path d="M116 -16 L 136 -10 L 126 4 Z" fill="#5A3020" stroke={N} strokeWidth={2} strokeLinejoin="round" />
      <path d="M126 4 L 124 18" stroke={N} strokeWidth={2.2} />
      {[[92, 10], [100, 14], [108, 10]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={1.8} fill={N} />)}
      <path d="M30 -40 C 60 -34, 90 -24, 118 -12" stroke={tono(c, 1.25)} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M58 -30 C 66 -24, 70 -18, 72 -8" stroke={tono(c, 0.7)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <OjoVivo x={60} y={-18} r={8.5} iris="#D9A21E" ang={-6} fiero />
    </g>
  );
};
export const LeonEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const c = (props.color as string | undefined) ?? '#D49A48', melena = (props.crin as string | undefined) ?? '#7A4A1E', claro = '#F2DCAA', som = tono(c, 0.84), lej = tono(c, 0.74), mLuz = tono(melena, 1.6);
  const ruge = props.boca !== false;
  const centro: P = [-6, 4];
  const anillo = (n: number, r: number, a0: number, a1: number) => Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * i) / (n - 1), rad = (a * Math.PI) / 180; return { p: [centro[0] + Math.sin(rad) * r, centro[1] + Math.cos(rad) * r] as P, a }; });
  const Melena = <g>
    {anillo(13, 46, -180, 10).map(({ p, a }, i) => <Mechon key={`m${i}`} x={p[0]} y={p[1]} ang={a + Math.sin(f / 11 + i) * 4} l={130 + (i % 3) * 16} w={66} c={i % 2 ? melena : tono(melena, 0.85)} luz={mLuz} curva={0.25} />)}
    {anillo(11, 36, -170, 0).map(({ p, a }, i) => <Mechon key={`n${i}`} x={p[0]} y={p[1]} ang={a + 8 + Math.sin(f / 11 + i + 1) * 4} l={96 + (i % 2) * 14} w={56} c={i % 2 ? tono(melena, 1.18) : melena} luz={mLuz} curva={0.3} />)}
  </g>;
  const q: Cuad = {
    k: 1.18, c, lej, cPie: c, pie: 'garraUnas',
    cuerpo: [[-190, -258], [-150, -292], [-60, -284], [40, -292], [120, -320], [170, -304], [198, -250], [186, -198], [134, -178], [40, -184], [-40, -176], [-120, -180], [-170, -204], [-198, -234]],
    hombro: [140, -202], cadera: [-142, -214], LD: [50, 74, 48, 14], LT: [66, 64, 58, 14], AD: [84, 42, 28, 22, 22], AT: [104, 44, 26, 22, 22],
    del: [[30, 26, 8, 34], [-6, -2, 4, 22]], tra: [[30, -36, 8, 24], [20, -26, 4, 22]],
    cuello: [[90, -310], [170, -350], [220, -330], [236, -270], [210, -210], [140, -200]], nuca: [196, -330], angCab: 4,
    cabeza: <CabezaLeon c={c} claro={claro} f={f} ruge={ruge} />, cabezaLejos: Melena,
    cola: <ColaBorla pts={[[-194, -250], [-250, -280 + Math.sin(f / 9) * 8], [-300, -250], [-310, -180]]} c={c} borla={melena} luz={mLuz} w={14} ang={-10} />,
    sombreado: <g>
      <ellipse cx={0} cy={-176} rx={220} ry={26} fill={claro} />
      <Masa pts={[[100, -316], [180, -290], [196, -210], [150, -190], [126, -260]]} c={som} />
      <Masa pts={[[-204, -230], [-160, -286], [-96, -280], [-80, -214], [-120, -180], [-186, -196]]} c={som} op={0.85} />
      <Raya pts={[[-170, -284], [-60, -284], [40, -292], [120, -316]]} c={tono(c, 1.2)} w={8} op={0.5} />
      {[0, 1, 2].map((i) => <Raya key={i} pts={[[-30 + i * 34, -260], [-20 + i * 34, -226], [-28 + i * 34, -196]]} c={tono(c, 0.72)} w={2.6} op={0.5} />)}
    </g>,
  };
  return <Cuadrupedo q={q} x={x} y={y} s={s} voltear={voltear} opacity={opacity} f={f} moviendo={moviendo} corriendo={corriendo} />;
};

// ---------- oso (erguido sobre las patas de atrás) ----------
export const OsoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#6A4630', som = tono(c, 0.8), claro = tono(c, 1.3), lej = tono(c, 0.7), hoc = '#C9A27A';
  const resp = Math.sin(f / 18) * 3, br = Math.sin(f / 14) * 4;
  const torso: P[] = [[-80, -60], [-110, -170], [-104, -300], [-70, -420], [-10, -470], [60, -470], [100, -420], [110, -320], [96, -190], [70, -70], [0, -40]];
  const brazo = (cerca: boolean) => {
    const o: P = cerca ? [60, -420] : [20, -440], pts = cadena(o, cerca ? [130 + br, 160 + br] : [150 - br, 190 - br], [110, 100]);
    return <g><path d={miembro(pts, [80, 56, 46])} fill={cerca ? c : lej} stroke={N} strokeWidth={2.6} /><g transform={`translate(${r1(pts[2][0])} ${r1(pts[2][1])}) rotate(${cerca ? -150 : -170})`}><Garra p={[0, 0]} ang={0} w={50} c={cerca ? c : lej} unas /></g></g>;
  };
  const pierna = (cerca: boolean) => <Pata pts={cadena([cerca ? 30 : -20, -110], cerca ? [30, -10] : [10, -20], [70, 60])} anchos={[110, 70, 56]} c={cerca ? c : lej} pie="garraUnas" cPie={c} angPie={90} />;
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      <g transform={`translate(0 ${r1(-4 + resp * 0)})`}>
        {brazo(false)}{pierna(false)}
        <path d={suave(torso, true, 0.9)} fill={c} />
        <Recorte d={suave(torso, true, 0.9)}>
          <ellipse cx={30} cy={-250} rx={56} ry={150} fill={claro} opacity={0.35} />
          <Masa pts={[[60, -440], [110, -380], [100, -280], [60, -330]]} c={som} />
          {Array.from({ length: 6 }, (_, i) => <Raya key={i} pts={[[-60 + i * 4, -380 + i * 50], [-30 + i * 6, -360 + i * 50], [0 + i * 4, -372 + i * 50]]} c={som} w={3} op={0.6} />)}
          {Array.from({ length: 5 }, (_, i) => <Raya key={`l${i}`} pts={[[-90, -320 + i * 50], [-70, -300 + i * 50]]} c={claro} w={3} op={0.5} />)}
        </Recorte>
        {pierna(true)}
        {/* cabeza rugiendo */}
        <g transform={`translate(40 -470) rotate(${r1(-14 + Math.sin(f / 22) * 2)})`}>
          <circle cx={-30} cy={-50} r={22} fill={c} stroke={N} strokeWidth={2.4} /><circle cx={-30} cy={-50} r={10} fill={som} />
          <g transform="rotate(16 30 10)"><path d={suave([[0, 10], [70, 18], [104, 14], [100, 30], [50, 40], [8, 34]], true)} fill={hoc} stroke={N} strokeWidth={2.4} /><path d="M40 16 L 96 16" stroke="#8E2A2A" strokeWidth={8} strokeLinecap="round" />{[50, 84].map((x0) => <path key={x0} d={`M${x0} 14 l 4 -12 l 4 12 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} />)}</g>
          <path d={suave([[-50, 10], [-50, -40], [-10, -66], [40, -56], [80, -30], [112, -12], [114, 6], [80, 12], [30, 24], [-20, 34]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.6} />
          <path d={suave([[50, -16], [112, -12], [114, 6], [80, 12], [50, 10]], true)} fill={hoc} />
          <ellipse cx={110} cy={-8} rx={10} ry={8} fill={N} />
          {[66, 96].map((x0) => <path key={x0} d={`M${x0} 8 l 4 12 l 4 -12 Z`} fill="#F6F0E2" stroke={N} strokeWidth={1.4} />)}
          <OjoVivo x={36} y={-24} r={7} iris="#4A2A10" fiero />
          <circle cx={-14} cy={-60} r={22} fill={c} stroke={N} strokeWidth={2.4} /><circle cx={-14} cy={-60} r={10} fill={som} />
        </g>
        {brazo(true)}
      </g>
    </Marco>
  );
};

// ---------- carnero, oveja, cabra ----------
/** Lana: silueta con borde de bucles y rulos adentro. */
const Lana: React.FC<{ pts: P[]; c: string; r: number }> = ({ pts, c, r }) => {
  const d = suave(pts, true, 0.9), bordes: P[] = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (r * 1.3))); for (let k = 0; k < n; k++) bordes.push(lerp(a, b, k / n)); }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), rulos: P[] = [];
  for (let yy = Math.min(...ys) + r; yy < Math.max(...ys); yy += r * 1.5) for (let xx = Math.min(...xs) + r; xx < Math.max(...xs); xx += r * 1.7) rulos.push([xx + ((yy / r) % 2) * r * 0.8, yy]);
  return (
    <g>
      {bordes.map(([bx, by], i) => <circle key={i} cx={r1(bx)} cy={r1(by)} r={r} fill={c} />)}
      <path d={d} fill={c} />
      <Recorte d={d}>{rulos.map(([rx, ry], i) => <path key={i} d={`M${r1(rx - r * 0.5)} ${r1(ry + r * 0.2)} a ${r1(r * 0.5)} ${r1(r * 0.5)} 0 1 1 ${r1(r * 0.9)} -0.1`} stroke={tono(c, 0.8)} strokeWidth={2.4} fill="none" strokeLinecap="round" />)}</Recorte>
    </g>
  );
};
type EspOv = 'carnero' | 'oveja' | 'cabra';
export const OvinoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo, corriendo } = props;
  const esp = ((props.especie as string) ?? 'carnero') as EspOv;
  const lana = esp !== 'cabra', c = (props.color as string | undefined) ?? (esp === 'cabra' ? '#7E5E40' : esp === 'carnero' ? '#E6DCC4' : '#F3ECDD');
  const cara = esp === 'cabra' ? c : esp === 'carnero' ? '#CDBB9C' : '#3A3028', patas = esp === 'cabra' ? tono(c, 0.9) : esp === 'carnero' ? '#BCA888' : '#3A3028';
  const claro = tono(c, 1.25), som = tono(c, 0.86);
  const cuerpo: P[] = [[-170, -230], [-140, -272], [-60, -280], [40, -280], [110, -276], [150, -248], [164, -200], [146, -150], [90, -132], [0, -130], [-90, -132], [-150, -150], [-176, -188]];
  const espiral: P[] = Array.from({ length: 14 }, (_, i) => { const t = i / 13, a = -0.6 + t * 5.4, r = 54 * (1 - t * 0.72); return [-6 + Math.cos(a) * r - 10, 16 + Math.sin(a) * r - 40] as P; });
  const cuernoCabra: P[] = [[4, -20], [-10, -70], [-46, -110], [-90, -120]];
  const Cabeza = (
    <g>
      {esp === 'oveja' && <ellipse cx={-14} cy={6} rx={30} ry={11} transform="rotate(30 -14 6)" fill={cara} stroke={N} strokeWidth={2.2} />}
      {esp === 'cabra' && <g transform="translate(14 -4)"><Cuerno pts={cuernoCabra} base={24} c="#8A7A5A" anillos={5} /></g>}
      <path d={suave([[-24, 20], [-18, -20], [10, -34], [50, -24], [86, 8], [96, 30], [80, 44], [40, 40], [0, 38]], true, 0.85)} fill={cara} stroke={N} strokeWidth={2.6} />
      <path d="M80 18 C 88 16, 92 22, 88 26" stroke={N} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M72 38 C 80 36, 86 38, 90 34" stroke={N} strokeWidth={2} fill="none" strokeLinecap="round" />
      {esp === 'cabra' && <path d="M40 38 C 44 70, 52 90, 60 100 C 66 80, 70 60, 66 40 Z" fill={tono(c, 0.6)} stroke={N} strokeWidth={2.2} />}
      <OjoVivo x={36} y={-6} r={7.5} iris={esp === 'cabra' ? '#D9A21E' : '#5A3A1A'} />
      {esp === 'cabra' && <path d="M30 -6 h 12" stroke={N} strokeWidth={3} />}
      {lana && <g transform="translate(-14 -20)">{[[-6, 0], [8, -10], [22, -14], [-4, -18]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={14} fill={c} stroke={N} strokeWidth={2} />)}</g>}
      {esp === 'carnero' && <Cuerno pts={espiral} base={40} c="#D9C49A" anillos={8} />}
      {esp === 'cabra' && <Cuerno pts={cuernoCabra} base={26} c="#A8946A" anillos={6} />}
      {esp !== 'carnero' && <ellipse cx={-10} cy={4} rx={30} ry={11} transform={`rotate(${esp === 'cabra' ? 40 : 24} -10 4)`} fill={cara} stroke={N} strokeWidth={2.2} />}
    </g>
  );
  const parada = esp === 'cabra';
  const q: Cuad = {
    k: esp === 'carnero' ? 1.2 : esp === 'oveja' ? 1.05 : 1.15, c: lana ? patas : c, lej: tono(lana ? patas : c, 0.72), cPie: '#2A2018', pie: 'hendida',
    cuerpo, hombro: [110, -160], cadera: [-120, -164], LD: [40, 60, 44, 14], LT: [50, 54, 52, 14], AD: lana ? [34, 24, 17, 14, 13] : [60, 28, 17, 14, 13], AT: lana ? [40, 26, 17, 14, 13] : [70, 30, 17, 14, 13],
    del: parada ? [[40, 100, -10, -30], [56, 120, 0, -20]] : [[-4, 0, 4, 18], [8, 4, 2, 20]],
    tra: parada ? [[-4, -10, 4, 14], [8, -4, 2, 16]] : [[20, -24, 6, 18], [12, -18, 2, 18]],
    rot: parada ? -44 : 0,
    cuello: lana ? [[100, -270], [150, -300], [190, -300], [200, -250], [170, -190], [120, -190]] : [[100, -270], [150, -320], [190, -350], [214, -320], [196, -250], [150, -190], [110, -200]],
    nuca: lana ? [178, -294] : [196, -340], angCab: parada ? 36 : esp === 'carnero' ? 10 : 20,
    cabeza: Cabeza,
    cola: <ellipse cx={-168} cy={-238} rx={22} ry={14} transform="rotate(-40 -168 -238)" fill={lana ? c : tono(c, 0.7)} stroke={N} strokeWidth={2.2} />,
    pelaje: lana ? <g><Lana pts={cuerpo} c={c} r={esp === 'carnero' ? 16 : 18} /><Lana pts={[[100, -280], [160, -306], [196, -290], [190, -230], [150, -196], [110, -210]]} c={c} r={14} /></g> : undefined,
    sombreado: lana ? <ellipse cx={0} cy={-120} rx={200} ry={30} fill={som} opacity={0.6} /> : <g>
      <path d={suave([[-170, -230], [-60, -284], [110, -280], [150, -248], [120, -220], [-150, -200]], true)} fill={tono(c, 0.72)} />
      <ellipse cx={0} cy={-130} rx={180} ry={24} fill={claro} />
      <Raya pts={[[-150, -260], [-40, -276], [100, -276]]} c={claro} w={6} op={0.5} />
      <Gorguera pts={[[180, -250], [170, -220], [150, -200]]} c={tono(c, 0.8)} luz={claro} l={50} ang={0} f={f} />
    </g>,
  };
  return <Cuadrupedo q={q} x={x} y={y} s={s} voltear={voltear} opacity={opacity} f={f} moviendo={moviendo} corriendo={corriendo} />;
};

// ---------- tortuga ----------
export const TortugaEpica: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo } = props;
  const piel = '#8A8656', pielO = tono(piel, 0.75), concha = '#7A5E32', placa = '#A8844A', borde = '#5E4426';
  const p = moviendo ? Math.sin(f / 5) * 8 : 0, cab = Math.sin(f / 24) * 4;
  const domo: P[] = [[-170, -46], [-150, -130], [-80, -190], [20, -200], [110, -170], [160, -110], [172, -46]];
  const pata = (lx: number, d: number, col: string) => <g><path d={suave([[lx - 30, -60], [lx - 34 + d, 0], [lx + 26 + d, 0], [lx + 30, -60]], true, 0.6)} fill={col} stroke={N} strokeWidth={2.6} />{[0, 1, 2].map((i) => <path key={i} d={`M${lx - 22 + d + i * 16} 0 l 4 8`} stroke="#EFE6D2" strokeWidth={4} strokeLinecap="round" />)}{[0, 1].map((i) => <path key={`e${i}`} d={`M${lx - 22} ${-40 + i * 18} q 10 -6 22 0 q 10 -6 20 0`} stroke={tono(col, 0.7)} strokeWidth={2.4} fill="none" />)}</g>;
  const hex = (cx: number, cy: number, r: number, i: number) => { const pts: P[] = Array.from({ length: 6 }, (_, k) => [cx + Math.cos((k * Math.PI) / 3) * r * 1.1, cy + Math.sin((k * Math.PI) / 3) * r * 0.8] as P); return <g key={i}><path d={suave(pts, true, 0.3)} fill={placa} stroke={N} strokeWidth={2.4} /><path d={suave(pts.map((q) => lerp([cx, cy], q, 0.62)), true, 0.3)} fill="none" stroke={borde} strokeWidth={2} /><path d={suave(pts.map((q) => lerp([cx, cy], q, 0.3)), true, 0.3)} fill={tono(placa, 1.2)} /></g>; };
  return (
    <Marco x={x} y={y} s={s * 1.15} voltear={voltear} opacity={opacity}>
      {pata(-110, -p, pielO)}{pata(90, p, pielO)}
      <path d="M-170 -60 L -214 -40 L -170 -36 Z" fill={piel} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <g transform={`rotate(${r1(cab)} 160 -70)`}>
        <path d={suave([[130, -96], [190, -120], [244, -116], [272, -90], [262, -62], [220, -54], [160, -54]], true)} fill={piel} stroke={N} strokeWidth={2.6} />
        <path d="M168 -72 q 14 -8 30 0 M176 -60 q 14 -6 28 0" stroke={pielO} strokeWidth={2.4} fill="none" />
        <path d="M256 -70 L 274 -82" stroke={N} strokeWidth={2.4} strokeLinecap="round" />
        <OjoVivo x={236} y={-96} r={7} iris="#6A3A1A" />
      </g>
      <path d={suave(domo, true, 0.8)} fill={concha} />
      <Recorte d={suave(domo, true, 0.8)}>
        {[[-90, -110, 40], [0, -140, 44], [90, -110, 40], [-40, -60, 38], [50, -62, 38], [-130, -60, 30], [130, -60, 30], [-50, -170, 34], [50, -176, 34]].map(([cx, cy, r], i) => hex(cx, cy, r, i))}
        <path d={suave([[-150, -120], [-60, -186], [40, -194], [120, -160]])} stroke="#F2DCA0" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.45} />
      </Recorte>
      <path d={suave([[-180, -40], [-90, -26], [0, -22], [90, -26], [182, -40], [176, -54], [0, -40], [-176, -54]], true)} fill={borde} stroke={N} strokeWidth={2.4} />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-150 + i * 30} -46 l 2 14`} stroke="#C9A86A" strokeWidth={3} strokeLinecap="round" />)}
      {pata(-70, p, piel)}{pata(130, -p, piel)}
    </Marco>
  );
};

// ---------- serpiente enroscada (culebra, Pitón) ----------
/** Tubo de serpiente a lo largo de `pts`, con panza clara y escamas. */
const Tubo: React.FC<{ pts: P[]; w: number[]; c: string; panza: string; mancha: string; diamantes?: boolean }> = ({ pts, w, c, panza, mancha, diamantes }) => {
  const d = miembro(pts, w);
  return (
    <g>
      <path d={d} fill={c} stroke={N} strokeWidth={2.6} />
      <Recorte d={d}>
        <path d={suave(pts.map((q, i) => [q[0], q[1] + w[i] * 0.34] as P))} stroke={panza} strokeWidth={Math.max(...w) * 0.36} fill="none" strokeLinecap="round" />
        {pts.slice(1).map((q, i) => i % 1 === 0 && (diamantes ? <path key={i} d={`M${r1(q[0] - w[i + 1] * 0.22)} ${r1(q[1] - w[i + 1] * 0.08)} l ${r1(w[i + 1] * 0.22)} ${r1(-w[i + 1] * 0.2)} l ${r1(w[i + 1] * 0.22)} ${r1(w[i + 1] * 0.2)} l ${r1(-w[i + 1] * 0.22)} ${r1(w[i + 1] * 0.2)} Z`} fill={mancha} /> : <ellipse key={i} cx={r1(q[0])} cy={r1(q[1] - w[i + 1] * 0.12)} rx={r1(w[i + 1] * 0.22)} ry={r1(w[i + 1] * 0.14)} fill={mancha} />))}
        <path d={suave(pts.map((q, i) => [q[0], q[1] - w[i] * 0.3] as P))} stroke={tono(c, 1.35)} strokeWidth={Math.max(...w) * 0.08} fill="none" strokeLinecap="round" opacity={0.6} />
      </Recorte>
    </g>
  );
};
export const SerpienteEpica: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, boca } = props;
  const piton = !!props.piton, G = piton ? 1.5 : 1;
  const c = (props.color as string | undefined) ?? (piton ? '#5E6A2E' : '#4E7A3A'), panza = piton ? '#E2CF8A' : '#D2DE96', mancha = piton ? '#2E3418' : '#2A4A1E';
  const o = Math.sin(f / 14) * 6, grosor = 34;
  // anillos apilados: atrás de cada vuelta primero, adelante después
  const vuelta = (cy: number, rx: number, ry: number, a0: number, a1: number, n = 10): P[] => Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * i) / (n - 1); return [Math.cos(a) * rx, cy + Math.sin(a) * ry] as P; });
  const v1a = vuelta(-26, 180, 34, Math.PI, 2 * Math.PI), v1b = vuelta(-26, 180, 34, 0, Math.PI);
  const v2a = [v1b[v1b.length - 1], ...vuelta(-80, 140, 30, Math.PI, 2 * Math.PI)], v2b = vuelta(-80, 140, 30, 0, Math.PI);
  const ancho = (pts: P[], w0: number, w1: number) => pts.map((_, i) => w0 + ((w1 - w0) * i) / (pts.length - 1));
  const cuello: P[] = [[140, -80], [170, -140], [120, -220], [90, -300 + o], [130, -370 + o], [190, -390 + o]];
  const cab = cuello[cuello.length - 1], abre = boca || piton ? 16 : 0;
  return (
    <Marco x={x} y={y} s={s * G} voltear={voltear} opacity={opacity}>
      <Tubo pts={[[-260, -14], [-220, -10], ...v1a.slice(0, 1)]} w={[8, 18, grosor * 0.8]} c={c} panza={panza} mancha={mancha} diamantes={piton} />
      <Tubo pts={v1a} w={ancho(v1a, grosor * 0.8, grosor * 0.95)} c={tono(c, 0.85)} panza={panza} mancha={mancha} diamantes={piton} />
      <Tubo pts={v2a} w={ancho(v2a, grosor, grosor * 1.05)} c={tono(c, 0.85)} panza={panza} mancha={mancha} diamantes={piton} />
      <Tubo pts={v1b} w={ancho(v1b, grosor * 0.95, grosor)} c={c} panza={panza} mancha={mancha} diamantes={piton} />
      <Tubo pts={v2b} w={ancho(v2b, grosor * 1.05, grosor * 1.1)} c={c} panza={panza} mancha={mancha} diamantes={piton} />
      <Tubo pts={cuello} w={[grosor * 1.1, grosor * 1.1, grosor, grosor * 0.95, grosor * 0.85, grosor * 0.8]} c={c} panza={panza} mancha={mancha} diamantes={piton} />
      {piton && cuello.slice(1, -1).map((q, i) => <path key={i} d={`M${r1(q[0] - 14)} ${r1(q[1] - grosor * 0.4)} l -14 -22 l 26 10 Z`} fill={ROJO} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
      <g transform={`translate(${r1(cab[0])} ${r1(cab[1])}) rotate(${r1(10 + Math.sin(f / 18) * 3)})`}>
        <g transform={`rotate(${abre} -6 6)`}><path d={suave([[-14, 4], [30, 10], [56, 12], [50, 22], [10, 24], [-14, 16]], true)} fill={panza} stroke={N} strokeWidth={2.2} />{abre > 0 && <path d="M30 12 l 3 10 l 3 -10 Z" fill="#F6F0E2" stroke={N} strokeWidth={1.2} />}</g>
        {abre > 0 && <path d={`M0 4 L 54 0 L 52 ${10 + abre * 0.6} L 0 ${14 + abre * 0.3} Z`} fill="#6E1E1E" />}
        <path d={suave([[-24, 10], [-20, -18], [10, -28], [46, -18], [64, -4], [56, 6], [20, 8]], true, 0.85)} fill={c} stroke={N} strokeWidth={2.4} />
        {abre > 0 && <path d="M34 4 l 3 12 l 3 -12 Z" fill="#F6F0E2" stroke={N} strokeWidth={1.2} />}
        <path d="M-10 -18 Q 16 -30 44 -16" stroke={mancha} strokeWidth={5} fill="none" strokeLinecap="round" />
        <OjoVivo x={20} y={-12} r={6.5} iris={piton ? '#E8B93E' : '#C9A21E'} fiero />
        <path d={`M60 0 l ${r1(16 + Math.sin(f / 3) * 4)} -5 m -3 5 l ${r1(16 + Math.sin(f / 3) * 4)} 5`} stroke={ROJO} strokeWidth={2.6} strokeLinecap="round" />
        {piton && [[-6, -26], [10, -32], [26, -28]].map(([px, py], i) => <path key={i} d={`M${px} ${py} l -8 -22 l 16 8 Z`} fill={ROJO} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
      </g>
    </Marco>
  );
};

// ---------- aves ----------
/** Plumas de pecho en escamas (filas de medialunas). */
const Escamas: React.FC<{ x0: number; x1: number; y0: number; y1: number; r: number; c: string }> = ({ x0, x1, y0, y1, r, c }) => (
  <g>{Array.from({ length: Math.ceil((y1 - y0) / (r * 1.1)) }, (_, fi) => Array.from({ length: Math.ceil((x1 - x0) / (r * 1.6)) + 1 }, (_, ci) => { const cx = x0 + ci * r * 1.6 + (fi % 2) * r * 0.8, cy = y0 + fi * r * 1.1; return <path key={`${fi}-${ci}`} d={`M${r1(cx - r * 0.8)} ${r1(cy)} Q ${r1(cx)} ${r1(cy + r * 1.1)} ${r1(cx + r * 0.8)} ${r1(cy)}`} stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" />; }))}</g>
);
/** Águila (o paloma) de frente con las alas abiertas en alto. Origen = centro del cuerpo. */
export const AguilaEpica: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const paloma = props.especie === 'paloma';
  const K = paloma ? 0.5 : 1;
  const ala = paloma ? { c: '#F4F1EA', c2: '#ECE6DA', c3: '#F8F6F0', punta: '#B9BEC6' } : { c: '#4A321E', c2: '#6A4A2E', c3: '#8A6440', punta: '#24160C' };
  const cuerpo = paloma ? '#EEEAE2' : '#5A3E26', cabeza = paloma ? '#E6E2DA' : '#C9944A', pico = paloma ? '#C98A8A' : '#E8B93E';
  const aleteo = Math.sin(f * 0.22), abre = (aleteo + 1) / 2, dy = -aleteo * 8;
  const Ala = ({ der }: { der: boolean }) => (
    <g transform={`translate(${der ? 36 : -36} -50) scale(${der ? -1 : 1} 1) rotate(${r1(14 - aleteo * 10)})`}>
      <AlaGrande largo={440} c={ala.c} c2={ala.c2} c3={ala.c3} punta={ala.punta} abre={abre} raquis={paloma ? '#C9C4BA' : '#2A1A10'} />
    </g>
  );
  const cuerpoD = suave([[-56, -60], [-30, -96], [30, -96], [58, -60], [62, 20], [40, 80], [-40, 80], [-62, 20]], true, 0.9);
  return (
    <Marco x={x} y={y + dy} s={s * K} voltear={voltear} opacity={opacity}>
      {/* cola en abanico */}
      {Array.from({ length: 7 }, (_, i) => <Pluma key={i} x={0} y={60} ang={60 + i * 10} l={150} w={34} c={i % 2 ? ala.c2 : ala.c} punta={paloma ? undefined : '#EFE6D2'} raquis={paloma ? '#C9C4BA' : '#2A1A10'} />)}
      <Ala der={false} /><Ala der />
      <path d={cuerpoD} fill={cuerpo} />
      <Recorte d={cuerpoD}><Escamas x0={-60} x1={60} y0={-60} y1={80} r={13} c={paloma ? '#D6D0C4' : '#3A2614'} /><ellipse cx={-20} cy={-30} rx={20} ry={50} fill="#FFFFFF" opacity={0.12} /></Recorte>
      {/* patas con calzón de plumas y garras */}
      {[-24, 24].map((lx) => <g key={lx}>
        <path d={suave([[lx - 22, 50], [lx + 22, 50], [lx + 18, 96], [lx - 18, 96]], true, 0.7)} fill={tono(cuerpo, 1.15)} stroke={N} strokeWidth={2.2} />
        <path d={`M${lx} 96 L ${lx} 120`} stroke={N} strokeWidth={14} strokeLinecap="round" /><path d={`M${lx} 96 L ${lx} 120`} stroke={paloma ? '#D9787A' : '#E8B93E'} strokeWidth={9} strokeLinecap="round" />
        {[-30, 0, 30].map((a) => <g key={a} transform={`translate(${lx} 120) rotate(${a})`}><path d="M0 0 L 0 22" stroke={N} strokeWidth={10} strokeLinecap="round" /><path d="M0 0 L 0 22" stroke={paloma ? '#D9787A' : '#E8B93E'} strokeWidth={6} strokeLinecap="round" /><path d="M-4 20 Q 0 34 6 30" stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" /></g>)}
      </g>)}
      {/* cabeza de perfil */}
      <g transform={`translate(0 -96) rotate(${r1(Math.sin(f / 20) * 4)})`}>
        <path d={suave([[-36, 20], [-34, -20], [-6, -44], [30, -42], [56, -24], [60, -4], [40, 10], [20, 30], [-20, 34]], true, 0.85)} fill={cabeza} stroke={N} strokeWidth={2.6} />
        {!paloma && [[-30, 10], [-26, -14], [-14, 24]].map(([mx, my], i) => <Mechon key={i} x={mx} y={my} ang={-60 + i * 20} l={36} w={20} c={tono(cabeza, 0.85)} luz="#F4D88A" />)}
        <path d={paloma ? 'M54 -20 L 78 -12 L 54 -6 Z' : 'M50 -30 C 76 -32, 92 -16, 88 6 C 84 -4, 74 -6, 62 -6 C 56 -6, 52 -10, 50 -16 Z'} fill={pico} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
        {!paloma && <path d="M50 -28 C 54 -22, 54 -14, 50 -10" stroke={tono(pico, 0.75)} strokeWidth={6} fill="none" />}
        <OjoVivo x={30} y={-22} r={paloma ? 6 : 7.5} iris={paloma ? '#C9502A' : '#E8A21E'} fiero={!paloma} />
      </g>
    </Marco>
  );
};
/** Cisne en vuelo de perfil: cuello estirado y las dos alas en alto. Origen = centro del cuerpo. */
export const CisneEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = '#F6F3EC', c2 = '#ECE7DC', c3 = '#FBF9F4', aleteo = Math.sin(f * 0.2), abre = (aleteo + 1) / 2;
  const cuerpo = suave([[-130, 0], [-80, -34], [20, -40], [90, -24], [110, 0], [60, 26], [-40, 30], [-120, 16]], true, 0.9);
  const cuello: P[] = [[80, -18], [150, -40], [220, -50], [270, -48]];
  return (
    <Marco x={x} y={y - aleteo * 8} s={s} voltear={voltear} opacity={opacity}>
      <g transform={`translate(10 -30) rotate(${r1(30 - aleteo * 14)}) scale(0.92)`}><AlaGrande largo={520} c={c2} c2="#E2DCCE" c3="#E6E0D2" punta="#D2CABA" abre={abre} raquis="#C9C2B2" /></g>
      {[-150, -160, -170].map((a, i) => <Pluma key={i} x={-110} y={4} ang={a + 180 - 360} l={70} w={26} c={c2} />)}
      <path d={cuerpo} fill={c} />
      <path d={miembro(cuello, [46, 30, 26, 24])} fill={c} />
      <Recorte d={cuerpo}><Escamas x0={-110} x1={100} y0={-20} y1={30} r={12} c="#DCD6CA" /></Recorte>
      <path d="M-30 24 L -40 44 M0 26 L -6 46" stroke={N} strokeWidth={9} strokeLinecap="round" /><path d="M-30 24 L -40 44 M0 26 L -6 46" stroke="#3A3A3A" strokeWidth={5} strokeLinecap="round" />
      <g transform="translate(270 -48)">
        <ellipse cx={0} cy={0} rx={22} ry={16} fill={c} />
        <path d="M14 -8 L 52 4 L 14 10 Z" fill="#E07A2A" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M10 -12 Q 20 -2 12 12 L 4 4 Z" fill={N} />
        <OjoVivo x={2} y={-4} r={4.5} iris="#3A2A1A" />
      </g>
      <g transform={`translate(30 -30) rotate(${r1(8 - aleteo * 16)})`}><AlaGrande largo={560} c={c} c2={c2} c3={c3} punta="#E2DCCE" abre={abre} raquis="#D2CABA" /></g>
    </Marco>
  );
};
/** Pavo real de pie con la cola abierta en tres capas de plumas con ojo. Origen = patas. */
const OjoPluma: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${r1(x)} ${r1(y)})`}><ellipse rx={r * 1.15} ry={r} fill="#C9A21E" stroke={N} strokeWidth={1.8} /><ellipse rx={r * 0.85} ry={r * 0.78} fill="#2E8A6A" /><ellipse cx={-r * 0.1} rx={r * 0.55} ry={r * 0.5} fill="#2A4FA8" /><ellipse cx={-r * 0.15} rx={r * 0.28} ry={r * 0.26} fill="#12204A" /></g>
);
export const PavoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f, moviendo } = props;
  const o = Math.sin(f / 16) * 2, cab = moviendo ? Math.sin(f / 4) * 4 : Math.sin(f / 22) * 2, base: P = [-30, -150];
  const capa = (n: number, L: number, w: number, c: string, ojo: number, a0: number, a1: number, k: string) => Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1) + o * 0.5, rad = (a * Math.PI) / 180, ex = base[0] + Math.cos(rad) * L, ey = base[1] + Math.sin(rad) * L;
    return <g key={k + i}><Pluma x={base[0]} y={base[1]} ang={a} l={L + 20} w={w} c={c} raquis="#1E4A2E" />{ojo > 0 && <OjoPluma x={ex} y={ey} r={ojo} />}</g>;
  });
  return (
    <Marco x={x} y={y} s={s * 1.1} voltear={voltear} opacity={opacity}>
      {capa(19, 330, 52, '#2E6A3E', 22, -196, 16, 'a')}
      {capa(15, 250, 50, '#3E7A4A', 20, -186, 6, 'b')}
      {capa(11, 170, 46, '#4E8A52', 17, -176, -4, 'c')}
      <path d="M-14 -90 L -20 0 M14 -90 L 18 0" stroke={N} strokeWidth={11} strokeLinecap="round" /><path d="M-14 -90 L -20 0 M14 -90 L 18 0" stroke="#9A9284" strokeWidth={7} strokeLinecap="round" />
      <path d="M-40 0 h 30 M4 0 h 34" stroke={N} strokeWidth={9} strokeLinecap="round" /><path d="M-40 0 h 30 M4 0 h 34" stroke="#9A9284" strokeWidth={5} strokeLinecap="round" />
      <path d={suave([[-80, -120], [-50, -190], [10, -196], [50, -150], [36, -90], [-20, -80], [-70, -96]], true)} fill="#2E5FA8" />
      <Recorte d={suave([[-80, -120], [-50, -190], [10, -196], [50, -150], [36, -90], [-20, -80], [-70, -96]], true)}><Escamas x0={-80} x1={50} y0={-180} y1={-80} r={11} c="#4A8AC8" /><path d={suave([[-90, -150], [-20, -130], [30, -100], [-20, -76], [-80, -90]], true)} fill="#C9B48A" /><Escamas x0={-90} x1={30} y0={-140} y1={-80} r={9} c="#8A6A3A" /></Recorte>
      <g transform={`rotate(${r1(cab)} 20 -180)`}>
        <path d={miembro([[10, -170], [30, -230], [40, -290]], [44, 30, 26])} fill="#2E5FA8" />
        <ellipse cx={46} cy={-300} rx={24} ry={19} fill="#2E5FA8" />
        <path d="M64 -306 L 90 -298 L 64 -290 Z" fill="#C9B48A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <path d="M40 -292 Q 54 -290 62 -296" stroke="#F4EEE2" strokeWidth={4} fill="none" strokeLinecap="round" />
        <OjoVivo x={50} y={-304} r={5} iris="#3A2A1A" />
        {[-14, -4, 6, 16].map((d) => <g key={d}><path d={`M44 -318 L ${44 + d} -352`} stroke={N} strokeWidth={2.2} /><ellipse cx={44 + d} cy={-356} rx={5} ry={6} fill="#2E5FA8" stroke={N} strokeWidth={1.6} /></g>)}
      </g>
    </Marco>
  );
};
/** Lechuza de Atenea, de frente, con las alas a medio abrir. Origen = patas. */
export const BuhoEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = '#8A6440', c2 = '#A8805A', claro = '#EFE2C8', ab = (Math.sin(f / 14) + 1) / 2, cab = Math.sin(f / 30) * 5;
  const cuerpo = suave([[-90, -20], [-110, -140], [-90, -240], [0, -270], [90, -240], [110, -140], [90, -20], [0, 0]], true, 0.9);
  return (
    <Marco x={x} y={y} s={s * 1.05} voltear={voltear} opacity={opacity}>
      <path d="M-200 0 H 200" stroke={N} strokeWidth={26} strokeLinecap="round" /><path d="M-200 0 H 200" stroke="#7A5232" strokeWidth={20} strokeLinecap="round" />
      {[[-150, -10], [120, -6]].map(([lx, ly], i) => <path key={i} d={`M${lx} ${ly} q 20 -30 50 -20`} stroke="#4E7A3A" strokeWidth={10} fill="none" strokeLinecap="round" />)}
      {[false, true].map((der) => <g key={String(der)} transform={`translate(${der ? 70 : -70} -200) scale(${der ? -1 : 1} 1) rotate(${r1(-50 + ab * 10)})`}><AlaGrande largo={340} c={c} c2={c2} c3={tono(c2, 1.1)} punta="#5A3E26" abre={ab * 0.5} raquis="#4A321E" /></g>)}
      <path d={cuerpo} fill={c} />
      <Recorte d={cuerpo}>
        <ellipse cx={0} cy={-110} rx={70} ry={100} fill={claro} />
        {Array.from({ length: 5 }, (_, fi) => Array.from({ length: 4 }, (_, ci) => <path key={`${fi}${ci}`} d={`M${-48 + ci * 32 + (fi % 2) * 16} ${-170 + fi * 30} l 8 10 l 8 -10`} stroke="#6A4A2E" strokeWidth={3.4} fill="none" strokeLinecap="round" />))}
      </Recorte>
      {[-34, 34].map((lx) => <g key={lx}>{[-14, 0, 14].map((d) => <path key={d} d={`M${lx + d} -10 l 0 18`} stroke={N} strokeWidth={10} strokeLinecap="round" />)}{[-14, 0, 14].map((d) => <path key={`o${d}`} d={`M${lx + d} -10 l 0 16`} stroke="#E8B93E" strokeWidth={6} strokeLinecap="round" />)}</g>)}
      <g transform={`rotate(${r1(cab)} 0 -260)`}>
        <path d={suave([[-100, -250], [-110, -330], [-70, -380], [70, -380], [110, -330], [100, -250], [0, -220]], true, 0.8)} fill={c} stroke={N} strokeWidth={2.6} />
        <path d="M-80 -360 L -104 -420 L -50 -376 Z M80 -360 L 104 -420 L 50 -376 Z" fill={c} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
        {[-44, 44].map((ex) => <g key={ex}><circle cx={ex} cy={-310} r={44} fill={claro} stroke={N} strokeWidth={2.4} />{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <path key={i} d={`M${r1(ex + Math.cos(a) * 26)} ${r1(-310 + Math.sin(a) * 26)} L ${r1(ex + Math.cos(a) * 40)} ${r1(-310 + Math.sin(a) * 40)}`} stroke="#C9B08A" strokeWidth={2} />; })}<circle cx={ex} cy={-310} r={24} fill="#F0A21E" stroke={N} strokeWidth={2.4} /><circle cx={ex} cy={-310} r={13} fill={N} /><circle cx={ex + 6} cy={-316} r={5} fill="#FFFFFF" /></g>)}
        <path d="M-90 -350 Q -44 -372 -8 -346 M90 -350 Q 44 -372 8 -346" stroke={tono(c, 0.7)} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M-12 -300 L 0 -262 L 12 -300 Z" fill="#C98A2A" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      </g>
    </Marco>
  );
};
/** Delfín saltando en arco con salpicaduras. Origen = centro del cuerpo. */
export const DelfinEpico: React.FC<DibujoProps> = (props) => {
  const { x, y, s, voltear, opacity, f } = props;
  const c = (props.color as string | undefined) ?? '#5E7E9A', panza = '#E6ECEE', giro = -18 + Math.sin(f / 16) * 6;
  const cuerpo = suave([[-200, 20], [-140, -30], [-40, -64], [60, -66], [140, -40], [190, -16], [230, -8], [190, 6], [120, 22], [20, 34], [-100, 34], [-170, 30]], true, 0.9);
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} opacity={opacity}>
      {[[-240, 120, 14], [-200, 150, 10], [-160, 110, 8], [-270, 160, 7], [-120, 150, 6]].map(([gx, gy, r], i) => <g key={i}><circle cx={gx} cy={gy + Math.sin(f / 6 + i) * 4} r={r} fill="#CFE6EE" stroke={N} strokeWidth={2} /><circle cx={gx - r * 0.3} cy={gy - r * 0.3 + Math.sin(f / 6 + i) * 4} r={r * 0.3} fill="#FFFFFF" /></g>)}
      <g transform={`rotate(${r1(giro)})`}>
        <path d="M0 -60 C 10 -110, 40 -130, 70 -134 C 60 -104, 58 -84, 66 -62 Z" fill={tono(c, 0.82)} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
        <path d={`M-186 20 C -220 0, -250 ${r1(-50 + Math.sin(f / 6) * 6)}, -280 ${r1(-56 + Math.sin(f / 6) * 6)} C -268 -20, -268 30, -282 ${r1(80 + Math.sin(f / 6) * 6)} C -250 74, -220 46, -186 30 Z`} fill={tono(c, 0.82)} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
        <path d={cuerpo} fill={c} />
        <Recorte d={cuerpo}>
          <path d={suave([[-190, 34], [-60, 10], [60, 0], [200, -6], [190, 30], [-170, 50]], true)} fill={panza} />
          <path d={suave([[-150, -20], [-40, -54], [80, -56], [160, -30]])} stroke={tono(c, 1.35)} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d={suave([[-120, 6], [-40, -10], [40, -14]])} stroke={tono(c, 0.8)} strokeWidth={3} fill="none" opacity={0.6} />
        </Recorte>
        <path d="M150 -6 Q 186 2 222 -6" stroke={N} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <path d="M40 20 C 26 50, 6 66, -14 66 C -4 46, 6 30, 14 18 Z" fill={tono(c, 0.82)} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
        <OjoVivo x={136} y={-24} r={7} iris="#2A1A10" />
      </g>
    </Marco>
  );
};
