// Kit de "dibujado a mano": trazos de tinta temblorosos, rellenos de marcador que se salen
// de la línea, círculos que no cierran y un boceto de lápiz debajo. Todo con defectos a propósito.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { getStroke } from 'perfect-freehand';

export type P = [number, number];
export const TINTA = '#23201C';
export const PAPEL = '#F3ECDC';
export const M = { // marcadores
  amarillo: '#F6C63B', naranja: '#F08A2C', rojo: '#D9462B', azul: '#2F4F8F', azulNoche: '#1D2B55',
  celeste: '#7FA7D9', verde: '#6E9B4E', gris: '#9A948A', piel: '#E9B48A', violeta: '#6A4C93', marron: '#8A5A3B',
};

export const azar = (seed: number) => {
  let s = (Math.abs(Math.floor(seed)) * 2654435761) >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Paso del "hervor" de línea: el dibujo cambia apenas cada 3 cuadros, como animación a mano. */
export const usePaso = (cada = 4) => Math.floor(useCurrentFrame() / cada);
/** Movimiento "en dos": el tiempo avanza a saltos de 2 cuadros. */
export const useEnDos = () => Math.floor(useCurrentFrame() / 3) * 3;

const dist = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function remuestrear(pts: P[], paso = 7): P[] {
  const out: P[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], d = dist(a, b), n = Math.max(1, Math.round(d / paso));
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}

function temblar(pts: P[], seed: number, amp: number): P[] {
  const r = azar(seed);
  const f1 = 0.008 + r() * 0.015, f2 = 0.035 + r() * 0.03, p1 = r() * 7, p2 = r() * 7, p3 = r() * 7;
  let d = 0;
  return pts.map((p, i) => {
    if (i) d += dist(pts[i - 1], p);
    return [p[0] + Math.sin(d * f1 + p1) * amp + Math.sin(d * f2 + p2) * amp * 0.45, p[1] + Math.cos(d * f1 * 1.3 + p3) * amp + Math.sin(d * f2 * 0.8 + p1) * amp * 0.45];
  });
}

/** Alarga un poco las puntas: el pulso que se pasa del final de la línea. */
function pasarse(pts: P[], r: () => number): P[] {
  if (pts.length < 2) return pts;
  const ext = (a: P, b: P, l: number): P => {
    const d = dist(a, b) || 1;
    return [b[0] + ((b[0] - a[0]) / d) * l, b[1] + ((b[1] - a[1]) / d) * l];
  };
  return [ext(pts[1], pts[0], 2 + r() * 9), ...pts, ext(pts[pts.length - 2], pts[pts.length - 1], 2 + r() * 12)];
}

function aPath(points: number[][]) {
  if (!points.length) return '';
  const d: (string | number)[] = ['M', points[0][0].toFixed(1), points[0][1].toFixed(1), 'Q'];
  points.forEach(([x0, y0], i) => {
    const [x1, y1] = points[(i + 1) % points.length];
    d.push(x0.toFixed(1), y0.toFixed(1), ((x0 + x1) / 2).toFixed(1), ((y0 + y1) / 2).toFixed(1));
  });
  return [...d, 'Z'].join(' ');
}

export type TrazoProps = { pts: P[]; seed: number; g?: number; color?: string; prog?: number; amp?: number; o?: number; cerrar?: boolean };

/** Una línea de tinta a pulso. `prog` (0–1) la va dibujando. */
export const Trazo: React.FC<TrazoProps> = ({ pts, seed, g = 5, color = TINTA, prog = 1, amp = 2.2, o = 1, cerrar }) => {
  const paso = usePaso();
  if (prog <= 0 || pts.length < 2) return null;
  const base = cerrar ? [...pts, pts[0]] : pts;
  let p = temblar(remuestrear(pasarse(base, azar(seed))), seed * 31 + paso * 7, amp);
  if (prog < 1) p = p.slice(0, Math.max(2, Math.ceil(p.length * prog)));
  const stroke = getStroke(p, { size: g, thinning: 0.65, smoothing: 0.5, streamline: 0.35, simulatePressure: true, start: { taper: g * 2 }, end: { taper: g * 3 } });
  return <path d={aPath(stroke)} fill={color} opacity={o} />;
};

/** Trazo con su boceto de lápiz gris debajo (y corrido), como quien dibuja primero a lápiz. */
export const Tinta: React.FC<TrazoProps> = (p) => (
  <>
    <Trazo {...p} seed={p.seed + 999} g={1.6} color="#7D776E" amp={(p.amp ?? 2.2) * 2.2} o={0.35 * (p.o ?? 1)} />
    <Trazo {...p} />
  </>
);

/** Puntos de una elipse a mano: no cierra bien y se pasa de largo. */
export const elipse = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 40): P[] => {
  const r = azar(seed), a0 = r() * 6.28, extra = 0.25 + r() * 0.4, def = 0.06 + r() * 0.06;
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((Math.PI * 2 + extra) * i) / n, k = 1 + Math.sin(a * 2 + seed) * def;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as P;
  });
};

const pathPoli = (pts: P[]) => 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L') + ' Z';

/**
 * Relleno de marcador: rayas en zigzag recortadas por la forma, pero corridas y un poco
 * más grandes, así se sale de la línea. Las rayas que se cruzan quedan más oscuras.
 */
export const Relleno: React.FC<{ forma: P[]; color: string; seed: number; ancho?: number; ang?: number; o?: number; prog?: number; correr?: number }> = ({ forma, color, seed, ancho = 16, ang = -35, o = 0.75, prog = 1, correr = 9 }) => {
  const paso = usePaso();
  if (prog <= 0) return null;
  const r = azar(seed);
  const xs = forma.map((p) => p[0]), ys = forma.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, diag = Math.hypot(x1 - x0, y1 - y0) / 2 + 20;
  const dx = (r() - 0.5) * correr * 2, dy = (r() - 0.5) * correr * 2, esc = 1.02 + r() * 0.05;
  const id = `rel${seed}`;
  // Garabato de ida y vuelta, como quien pinta con marcador sin levantar la mano.
  const rr = azar(seed * 13 + paso);
  const sep = ancho * 0.85;
  const n = Math.ceil((diag * 2) / sep), hasta = Math.ceil(n * Math.min(1, prog));
  const pasadas: string[] = [];
  let d = '';
  for (let i = 0; i < hasta; i++) {
    const t = -diag + i * sep + (rr() - 0.5) * sep * 0.5;
    const ida = i % 2 === 0, xa = -diag + rr() * 40, xb = diag - rr() * 40;
    const curva = (rr() - 0.5) * sep * 1.4;
    const [p0, p1] = ida ? [xa, xb] : [xb, xa];
    d += `${d ? ' L' : 'M'}${p0.toFixed(0)} ${t.toFixed(0)} Q0 ${(t + curva).toFixed(0)} ${p1.toFixed(0)} ${(t + sep * 0.4).toFixed(0)}`;
    // cada dos o tres rayas el marcador "se levanta": las puntas se pisan y quedan más oscuras
    if (i % 3 === 2 || rr() < 0.05) { pasadas.push(d); d = ''; }
  }
  if (d) pasadas.push(d);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={pathPoli(forma)} transform={`translate(${cx + dx} ${cy + dy}) scale(${esc}) translate(${-cx} ${-cy})`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`} style={{ mixBlendMode: 'multiply' }} opacity={o}>
        <g transform={`translate(${cx} ${cy}) rotate(${ang + (rr() - 0.5) * 3})`}>
          {pasadas.map((pd, i) => (
            <path key={i} d={pd} stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.6 + (i % 3) * 0.12} />
          ))}
        </g>
      </g>
    </g>
  );
};

/** Hoja de cuaderno de dibujo: papel con grano, mancha de café y bordes gastados. */
export const Papel: React.FC = () => (
  <>
    <defs>
      <filter id="grano">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="5" />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.22 0" />
      </filter>
      <filter id="fibras">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves="2" seed="9" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.12 0" />
      </filter>
      <radialGradient id="bordes" cx="50%" cy="50%" r="72%">
        <stop offset="70%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#5A4630" stopOpacity={0.28} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill={PAPEL} />
    <rect width={1920} height={1080} filter="url(#fibras)" />
    <rect width={1920} height={1080} filter="url(#grano)" />
    <ellipse cx={1690} cy={985} rx={120} ry={108} fill="none" stroke="#9C7448" strokeWidth={9} opacity={0.12} />
    <ellipse cx={1700} cy={990} rx={104} ry={96} fill="#9C7448" opacity={0.04} />
    <rect width={1920} height={1080} fill="url(#bordes)" />
  </>
);

/** Estrellita de cinco puntas a mano. */
export const estrella = (x: number, y: number, rad: number, seed: number): P[] => {
  const r = azar(seed);
  return Array.from({ length: 11 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, k = (i % 2 ? 0.45 : 1) * (0.85 + r() * 0.3);
    return [x + Math.cos(a) * rad * k, y + Math.sin(a) * rad * k] as P;
  });
};
