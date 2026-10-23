// Piel natural (serie `biblia`, Learn Bible 777): fondos y elementos con colores suaves y casi reales — cielos de
// verdad, mar, desierto y colinas de Oriente Medio, olivos y palmeras —, sin contornos gruesos ni ornamentos.
// Lugares de Génesis 1: el abismo (aguas oscuras), la luz sobre las aguas, el firmamento, la tierra seca, mar y tierra,
// el jardín, la noche, el amanecer, el mar con vida, la llanura, el desierto y las colinas.
// Dios NUNCA se dibuja como persona: es luz (`luz_divina`, rayos y resplandor) y el soplo sobre las aguas (`soplo`).
import React from 'react';
import { Capa, SUELO, azar } from '../comun/vasija';
import { NT, SueloNatural } from '../comun/natural';
import type { Cielo } from './fondos';

const r1 = (v: number) => v.toFixed(1);

/** Fondos del tema y su cielo (lo usa Escena para el degradé de base). */
export const CIELO_BIBLIA: Record<string, Cielo> = {
  abismo: 'inframundo', aguas_luz: 'inframundo', firmamento_agua: 'mar', tierra_seca: 'barro', mar_tierra: 'mar', jardin: 'barro',
  cielo_noche: 'noche', amanecer: 'barro', mar_vida: 'mar', llanura: 'barro', desierto: 'barro', colinas: 'barro',
};
export const FONDOS_BIBLIA = ['abismo', 'aguas_luz', 'firmamento_agua', 'tierra_seca', 'mar_tierra', 'jardin', 'cielo_noche', 'amanecer', 'mar_vida', 'llanura', 'desierto', 'colinas'];
export const ELEMENTOS_BIBLIA = ['luz_divina', 'soplo', 'bruma', 'cupula', 'tierra', 'sol_natural', 'luna_natural', 'estrellas_natural', 'nube_natural', 'olivo_natural', 'palmera_natural', 'arbol_fruta', 'acacia', 'arbusto', 'hierba', 'flores', 'roca_natural', 'cardumen', 'bandada', 'algas', 'tabla_dias', 'ritmo_dias', 'arca', 'lluvia', 'arcoiris', 'altar_piedra', 'tienda'];

// ---------- degradés ----------
const Degrades: React.FC = () => (
  <defs>
    <linearGradient id="ntDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6FA4D2" /><stop offset="55%" stopColor="#B9D6EA" /><stop offset="100%" stopColor="#F3EAD8" /></linearGradient>
    <linearGradient id="ntTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8DB6D6" /><stop offset="60%" stopColor="#EAD9B4" /><stop offset="100%" stopColor="#F2C58A" /></linearGradient>
    <linearGradient id="ntAlba" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24345E" /><stop offset="38%" stopColor="#6E7096" /><stop offset="72%" stopColor="#E6A47A" /><stop offset="100%" stopColor="#F8DCA8" /></linearGradient>
    <linearGradient id="ntNoche" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0C1226" /><stop offset="65%" stopColor="#1E2A4A" /><stop offset="100%" stopColor="#3A4A6E" /></linearGradient>
    <linearGradient id="ntAbismo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06070A" /><stop offset="70%" stopColor="#11141B" /><stop offset="100%" stopColor="#1C222C" /></linearGradient>
    <linearGradient id="ntLuzAguas" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A3E4E" /><stop offset="40%" stopColor="#8A8490" /><stop offset="75%" stopColor="#F0DCB0" /><stop offset="100%" stopColor="#FFF2D2" /></linearGradient>
    <linearGradient id="ntMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6AA6C8" /><stop offset="100%" stopColor="#2E5E7E" /></linearGradient>
    <linearGradient id="ntMarOsc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E2733" /><stop offset="100%" stopColor="#090B10" /></linearGradient>
    <linearGradient id="ntMarLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2D6B6" /><stop offset="35%" stopColor="#8A929A" /><stop offset="100%" stopColor="#3A4652" /></linearGradient>
    <linearGradient id="ntBajoAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5C9EC4" /><stop offset="100%" stopColor="#1F4C6C" /></linearGradient>
    <linearGradient id="ntRayoAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} /><stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} /></linearGradient>
    <linearGradient id="ntRayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6DC" stopOpacity={0.55} /><stop offset="100%" stopColor="#FFF6DC" stopOpacity={0} /></linearGradient>
    <radialGradient id="ntResplandor"><stop offset="0%" stopColor="#FFFCEE" stopOpacity={1} /><stop offset="30%" stopColor="#FFF1C6" stopOpacity={0.75} /><stop offset="100%" stopColor="#FFE2A0" stopOpacity={0} /></radialGradient>
    <radialGradient id="ntSol"><stop offset="0%" stopColor="#FFF4CC" stopOpacity={0.95} /><stop offset="40%" stopColor="#FFD98A" stopOpacity={0.45} /><stop offset="100%" stopColor="#FFC870" stopOpacity={0} /></radialGradient>
    <radialGradient id="ntLuna"><stop offset="0%" stopColor="#F4F1E6" stopOpacity={0.6} /><stop offset="100%" stopColor="#C9D4E6" stopOpacity={0} /></radialGradient>
    <radialGradient id="ntBruma"><stop offset="0%" stopColor="#8A93A0" stopOpacity={0.45} /><stop offset="100%" stopColor="#8A93A0" stopOpacity={0} /></radialGradient>
  </defs>
);

// ---------- piezas de paisaje ----------
/** Perfil ondulado de colina/duna (camino de x0 a x1 con base en y, cerrado hacia abajo). */
const perfil = (x0: number, x1: number, y: number, amp: number, seed: number, fondo = 400) => {
  let d = `M${x0} ${y + fondo}`;
  for (let x = x0; x <= x1; x += 24) {
    const k = 0.55 + 0.3 * Math.sin(x / 330 + seed) + 0.15 * Math.sin(x / 97 + seed * 2.3);
    const borde = Math.min(1, (x - x0) / 420, (x1 - x) / 420), t = borde * borde * (3 - 2 * borde);
    d += ` L ${x} ${r1(y - amp * k * t + (1 - t) * Math.min(fondo, 160))}`;
  }
  return d + ` L ${x1} ${y + fondo} Z`;
};
const Cielo: React.FC<{ id: string }> = ({ id }) => <rect x={-2400} y={-600} width={8000} height={SUELO + 1200} fill={`url(#${id})`} />;
/** Loma o duna: perfil suave con un velo claro arriba (luz) y sin contorno. */
const Loma: React.FC<{ y: number; amp: number; c: string; luz?: string; seed?: number; desde?: number; hasta?: number }> = ({ y, amp, c, luz, seed = 1, desde = -1800, hasta = 5200 }) => (
  <g>
    <path d={perfil(desde, hasta, y, amp, seed)} fill={c} />
    {luz && <path d={perfil(desde, hasta, y, amp, seed).replace(/ L [-\d.]+ [-\d.]+ Z$/, '')} fill="none" stroke={luz} strokeWidth={5} opacity={0.22} transform="translate(0 3)" />}
  </g>
);
/** Nube suave (cúmulo sin contorno, con panza un poco más oscura). */
const NubeSuave: React.FC<{ x: number; y: number; s?: number; f?: number; gris?: boolean; o?: number }> = ({ x, y, s = 1, f = 0, gris, o = 0.92 }) => {
  const c = gris ? '#B8BEC8' : '#FFFFFF', p = gris ? '#8E96A4' : '#DCE4EC';
  return (
    <g transform={`translate(${r1(x + Math.sin(f / 90 + x / 300) * 14)} ${r1(y)}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={14} rx={150} ry={26} fill={p} />
      {[[-90, 0, 60, 34], [-30, -24, 70, 48], [40, -14, 66, 42], [100, 6, 52, 30], [-130, 12, 40, 22]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={c} />)}
    </g>
  );
};
/** Agua natural: degradé, borde de arriba suave y reflejos finos que se mueven. */
const Agua: React.FC<{ y: number; f: number; id?: string; desde?: number; hasta?: number; reflejo?: string; quieta?: boolean; soloReflejos?: boolean }> = ({ y, f, id = 'ntMar', desde = -2000, hasta = 6400, reflejo = '#FFFFFF', quieta, soloReflejos }) => {
  const filas = Math.ceil((SUELO + 60 - y) / 22);
  return (
    <g>
      {!soloReflejos && <rect x={desde} y={y} width={hasta - desde} height={SUELO + 300 - y} fill={`url(#${id})`} />}
      {Array.from({ length: filas }, (_, r) => {
        const yy = y + 8 + r * 22, paso = 160 + r * 20, des = quieta ? 0 : (f * (0.3 + (r % 3) * 0.12)) % paso;
        return <path key={r} transform={`translate(${r1(-des + (r % 2) * 50)} 0)`} d={Array.from({ length: Math.ceil((hasta - desde) / paso) + 2 }, (_, i) => `M${desde + i * paso + azar(i + r * 7) * 40} ${yy} h ${30 + azar(i + r) * 50}`).join(' ')} stroke={reflejo} strokeWidth={2} opacity={0.18 + 0.1 * Math.sin(f / 30 + r)} strokeLinecap="round" />;
      })}
    </g>
  );
};
/** Olivo: tronco retorcido gris pardo y copa de verde plateado, que se mece apenas. */
const Olivo: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 50 + x) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d="M-16 0 C -12 -40, -30 -70, -14 -110 C -8 -126, 6 -128, 10 -112 C 20 -80, 4 -50, 18 0 Z" fill="#7A6A56" />
      <path d="M-6 -100 C -30 -130, -60 -140, -80 -150 M6 -104 C 30 -130, 50 -150, 76 -160" stroke="#7A6A56" strokeWidth={10} fill="none" strokeLinecap="round" />
      <g transform={`translate(${r1(m)} 0)`}>
        {[[-80, -170, 70, 40], [-20, -200, 90, 52], [60, -180, 80, 46], [0, -150, 100, 40], [-60, -140, 60, 30], [70, -140, 56, 30]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? NT.olivo : NT.olivoOsc} />)}
        {Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={-130 + azar(i) * 260} cy={-220 + azar(i + 9) * 100} rx={9} ry={3.5} fill={NT.olivoPlata} opacity={0.85} transform={`rotate(${-30 + azar(i + 3) * 60} ${r1(-130 + azar(i) * 260)} ${r1(-220 + azar(i + 9) * 100)})`} />)}
      </g>
    </g>
  );
};
/** Palmera datilera: tronco curvo con anillos, penacho de hojas largas y racimo de dátiles. */
const Palmera: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => {
  const m = Math.sin(f / 40 + x) * 4;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d="M-12 0 C -6 -120, 10 -240, 24 -330 L 40 -328 C 26 -240, 12 -120, 12 0 Z" fill="#8A6E4E" />
      {Array.from({ length: 14 }, (_, i) => { const t = i / 14, yy = -t * 320, xx = t * t * 28; return <path key={i} d={`M${r1(-10 + xx)} ${r1(yy)} h 22`} stroke="#6E553A" strokeWidth={3} opacity={0.6} />; })}
      <g transform={`translate(32 -330) rotate(${r1(m)})`}>
        {[-160, -130, -100, -70, -40, -15, 15, 40].map((a, i) => {
          const r = (a * Math.PI) / 180, L = 150 + (i % 3) * 20, ex = Math.cos(r) * L, ey = Math.sin(r) * L * 0.6 + 50;
          return <g key={i}>
            <path d={`M0 0 Q ${r1(ex * 0.5)} ${r1(ey * 0.2 - 30)} ${r1(ex)} ${r1(ey)}`} stroke={i % 2 ? NT.verde : NT.olivoOsc} strokeWidth={7} fill="none" strokeLinecap="round" />
            {Array.from({ length: 7 }, (_, k) => { const t = (k + 1) / 8, px = ex * t, py = (ey * 0.2 - 30) * 2 * t * (1 - t) + ey * t * t; return <path key={k} d={`M${r1(px)} ${r1(py)} l ${r1(Math.cos(r + 1.2) * 26)} ${r1(16 + k)}`} stroke={NT.verde} strokeWidth={4} strokeLinecap="round" opacity={0.9} />; })}
          </g>;
        })}
        {[[-8, 18], [4, 22], [12, 16], [0, 30]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7} fill="#B8742A" />)}
      </g>
    </g>
  );
};
/** Árbol frutal: tronco y copa redonda con frutas rojas y anaranjadas. fruta=false: solo hojas. */
const ArbolFruta: React.FC<{ x: number; y?: number; s?: number; f?: number; fruta?: boolean }> = ({ x, y = SUELO, s = 1, f = 0, fruta = true }) => {
  const m = Math.sin(f / 45 + x) * 3;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
      <path d="M-12 0 C -8 -50, -10 -90, -4 -130 L 8 -130 C 12 -90, 10 -50, 14 0 Z" fill="#7A5A3E" />
      <path d="M0 -110 C -20 -130, -40 -140, -56 -160 M4 -112 C 24 -134, 40 -150, 56 -164" stroke="#7A5A3E" strokeWidth={8} fill="none" strokeLinecap="round" />
      <g transform={`translate(${r1(m)} 0)`}>
        {[[-60, -180, 64], [0, -220, 76], [60, -184, 62], [-30, -150, 58], [36, -146, 56]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#5E8A4A' : '#4E7A3E'} />)}
        {[[-40, -230, 30], [30, -250, 28], [70, -200, 22]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#7FA65A" opacity={0.6} />)}
        {fruta && [[-70, -170], [-30, -200], [10, -240], [40, -190], [70, -160], [-10, -150], [20, -170], [-50, -140]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={8} fill={i % 3 ? '#C8402E' : '#E8892B'} />)}
      </g>
    </g>
  );
};
/** Acacia de copa plana (llanura). */
const Acacia: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-8 0 C -6 -60, -20 -120, -60 -170 M-4 -80 C 10 -120, 40 -150, 70 -176 M-6 -40 C -8 -100, 0 -150, 4 -190" stroke="#6E5A44" strokeWidth={9} fill="none" strokeLinecap="round" />
    <g transform={`translate(${r1(Math.sin(f / 60 + x) * 2)} 0)`}>
      <ellipse cx={0} cy={-196} rx={140} ry={26} fill="#6E7E44" />
      <ellipse cx={-30} cy={-208} rx={100} ry={18} fill="#8A9A5A" />
    </g>
  </g>
);
const Arbusto: React.FC<{ x: number; y?: number; s?: number; c?: string }> = ({ x, y = SUELO, s = 1, c = NT.olivoOsc }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse cx={-22} cy={-22} rx={34} ry={26} fill={c} /><ellipse cx={18} cy={-30} rx={36} ry={32} fill={NT.olivo} /><ellipse cx={44} cy={-16} rx={26} ry={18} fill={c} />
  </g>
);
/** Mata de pasto (hojas finas que se mecen). */
const Hierba: React.FC<{ x: number; y?: number; s?: number; f?: number }> = ({ x, y = SUELO, s = 1, f = 0 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 9 }, (_, i) => { const dx = -28 + i * 7, al = 30 + azar(i + x) * 30, m = Math.sin(f / 25 + i + x) * 4; return <path key={i} d={`M${dx} 2 q ${r1(-4 + m)} ${r1(-al * 0.6)} ${r1(-8 + (i - 4) * 3 + m)} ${r1(-al)}`} stroke={i % 2 ? NT.pasto : NT.pastoOsc} strokeWidth={3.4} fill="none" strokeLinecap="round" />; })}
  </g>
);
/** Flores silvestres (anémonas rojas, margaritas blancas y amarillas). */
const Flores: React.FC<{ x: number; y?: number; s?: number; f?: number; c?: string }> = ({ x, y = SUELO, s = 1, f = 0, c }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 6 }, (_, i) => {
      const dx = -40 + i * 16, al = 34 + azar(i * 3 + x) * 30, m = Math.sin(f / 30 + i) * 3, col = c ?? ['#D23A30', '#FFFFFF', '#F2C24A'][i % 3];
      return <g key={i}>
        <path d={`M${dx} 2 q 2 ${-al / 2} ${r1(m)} ${-al}`} stroke={NT.pastoOsc} strokeWidth={2.4} fill="none" />
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={dx + m} cy={-al - 6} rx={3.6} ry={6} fill={col} transform={`rotate(${a} ${r1(dx + m)} ${-al})`} />)}
        <circle cx={dx + m} cy={-al} r={2.6} fill={col === '#D23A30' ? '#2A2420' : '#E8A030'} />
      </g>;
    })}
  </g>
);
/** Roca natural (arenisca) con cara iluminada. */
const Roca: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-80 4 L -66 -40 L -24 -70 L 26 -64 L 70 -30 L 84 4 Z" fill={NT.piedraOsc} />
    <path d="M-66 -40 L -24 -70 L 26 -64 L 10 -30 L -40 -20 Z" fill={NT.piedra} />
  </g>
);
/** Arca de Noé (Génesis 6–8): casco de madera de gopher, tres pisos con una ventana arriba y la puerta de costado. `y` = línea de flotación. */
const Arcoiris: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`} opacity={o} fill="none" strokeWidth={16}>
    {['#C8685A', '#E0A25A', '#E6D27A', '#8DB67A', '#7AA8C8', '#9A86B8'].map((c, i) => <path key={i} d={`M${-520 + i * 16} 0 A ${520 - i * 16} ${420 - i * 16} 0 0 1 ${520 - i * 16} 0`} stroke={c} />)}
  </g>
);

const AltarPiedra: React.FC<{ x: number; y: number; s: number; f: number; fuego: boolean }> = ({ x, y, s, f, fuego }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-130 0 L -110 -70 L 110 -70 L 130 0 Z" fill="#9C9078" />
    <path d="M-100 -70 L -90 -120 L 90 -120 L 100 -70 Z" fill="#B3A78C" />
    <rect x={-110} y={-126} width={220} height={14} rx={5} fill="#C8BDA2" />
    {fuego && <path d={`M-34 -126 C -40 -170, -10 -190, ${r1(Math.sin(f / 5) * 8)} -230 C 18 -190, 44 -166, 34 -126 Z`} fill="#E89A3C" opacity={0.92} />}
  </g>
);

const Tienda: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-260 0 L 0 -260 L 260 0 Z" fill="#8A6A4C" />
    <path d="M-260 0 L 0 -260 L -40 0 Z" fill="#7A5C40" />
    <path d="M-60 0 L 0 -150 L 60 0 Z" fill="#3E2E22" />
  </g>
);

const Arca: React.FC<{ x: number; y?: number; s?: number; f?: number; mece?: boolean }> = ({ x, y = SUELO - 40, s = 1, f = 0, mece }) => (
  <g transform={`translate(${r1(x)} ${r1(y + (mece ? Math.sin(f / 18) * 5 : 0))}) rotate(${mece ? r1(Math.sin(f / 26) * 1.6) : 0}) scale(${s})`}>
    <path d="M-330 -60 L 330 -60 C 310 10, 230 40, 150 40 L -150 40 C -230 40, -310 10, -330 -60 Z" fill={NT.tierraOsc} />
    <path d="M-330 -60 L 330 -60 L 318 -40 L -318 -40 Z" fill={NT.tierra} />
    <rect x={-270} y={-140} width={540} height={82} fill={NT.tierra} />
    <rect x={-270} y={-140} width={540} height={10} fill={NT.tierraOsc} />
    {[-210, -140, -70, 0, 70, 140, 210].map((px, i) => <rect key={i} x={px - 1.5} y={-140} width={3} height={82} fill={NT.tierraOsc} opacity={0.55} />)}
    <rect x={-210} y={-218} width={420} height={80} fill={NT.arenaOsc} />
    <rect x={-210} y={-218} width={420} height={10} fill={NT.tierraOsc} />
    <path d="M-250 -218 L -190 -262 L 190 -262 L 250 -218 Z" fill={NT.tierraOsc} />
    <rect x={-40} y={-196} width={80} height={14} rx={3} fill={NT.noche} opacity={0.75} />
    <rect x={110} y={-124} width={46} height={64} rx={4} fill={NT.noche} opacity={0.7} />
    <path d="M-330 -60 C -300 -50, -260 -42, -150 -40 L 150 -40 C 260 -42, 300 -50, 330 -60" stroke={NT.tierraOsc} strokeWidth={4} fill="none" />
  </g>
);
/** Lluvia: rayitas inclinadas que caen sin parar; `n` = cantidad, `largo` = alto de la cortina. */
const Lluvia: React.FC<{ x: number; y?: number; f?: number; n?: number; ancho?: number; largo?: number }> = ({ x, y = 120, f = 0, n = 70, ancho = 2000, largo = 640 }) => (
  <g opacity={0.7}>
    {Array.from({ length: n }, (_, i) => {
      const px = x - ancho / 2 + azar(i * 3 + 1) * ancho, v = 0.6 + azar(i * 7 + 2) * 0.6;
      const py = y + ((f * 22 * v + azar(i * 5 + 3) * largo) % largo);
      return <path key={i} d={`M${r1(px - py * 0.12)} ${r1(py)} l -9 28`} stroke="#DCE8F2" strokeWidth={2.4} strokeLinecap="round" opacity={0.45 + azar(i + 9) * 0.45} />;
    })}
  </g>
);
/** Sol: resplandor amplio y disco claro, sin cara. */
const Sol: React.FC<{ x: number; y: number; r?: number; f: number }> = ({ x, y, r = 60, f }) => (
  <g>
    <circle cx={x} cy={y} r={r * 5 + Math.sin(f / 20) * 6} fill="url(#ntSol)" />
    <circle cx={x} cy={y} r={r} fill="#FFF3CF" />
    <circle cx={x} cy={y} r={r * 0.82} fill="#FFFBEA" />
  </g>
);
/** Luna con un halo frío y manchas suaves; llena=false = creciente. */
const Luna: React.FC<{ x: number; y: number; r?: number; llena?: boolean }> = ({ x, y, r = 46, llena = true }) => (
  <g>
    <circle cx={x} cy={y} r={r * 3.4} fill="url(#ntLuna)" />
    {llena ? <>
      <circle cx={x} cy={y} r={r} fill="#EEEADC" />
      {[[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [-0.05, 0.35, 0.12], [0.35, -0.35, 0.1]].map(([dx, dy, rr], i) => <circle key={i} cx={x + dx * r} cy={y + dy * r} r={rr * r} fill="#D2CEC0" />)}
    </> : <path d={`M${x - r * 0.2} ${y - r} A ${r} ${r} 0 1 0 ${x - r * 0.2} ${y + r} A ${r * 0.78} ${r} 0 1 1 ${x - r * 0.2} ${y - r} Z`} fill="#EEEADC" />}
  </g>
);
/** Estrellas que titilan (puntos y algunas con cruz de luz). */
const Estrellas: React.FC<{ f: number; n?: number; area?: [number, number, number, number]; seed?: number }> = ({ f, n = 50, area = [-300, 140, 2600, 440], seed = 3 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = area[0] + azar(i * 3 + seed) * area[2], y = area[1] + azar(i * 7 + seed) * area[3], r = 1.2 + azar(i + seed * 5) * 2.2, o = 0.55 + 0.45 * Math.sin(f / 12 + i * 1.7);
      return <g key={i} opacity={o}>
        <circle cx={x} cy={y} r={r} fill="#FFF8E6" />
        {i % 7 === 0 && <path d={`M${r1(x - r * 4)} ${r1(y)} H ${r1(x + r * 4)} M${r1(x)} ${r1(y - r * 4)} V ${r1(y + r * 4)}`} stroke="#FFF8E6" strokeWidth={1} opacity={0.7} />}
      </g>;
    })}
  </g>
);

/**
 * La luz de Dios: resplandor alto y rayos suaves que bajan en abanico (nunca una figura). Origen = centro del
 * resplandor. props.intensidad 0–1.5, props.ancho (apertura de los rayos), props.largo.
 */
const LuzDivina: React.FC<{ x: number; y: number; s?: number; f: number; intensidad?: number; ancho?: number; largo?: number }> = ({ x, y, s = 1, f, intensidad = 1, ancho = 1, largo = 900 }) => {
  const k = Math.max(0, intensidad), pul = 1 + Math.sin(f / 18) * 0.04;
  return (
    <g opacity={Math.min(1, 0.35 + k * 0.65)}>
      {Array.from({ length: 11 }, (_, i) => {
        const a = (-55 + i * 11) * ancho + Math.sin(f / 70 + i * 1.3) * 2.5, r = (a * Math.PI) / 180, L = largo * s * (0.75 + 0.25 * azar(i + 4));
        const w = (16 + azar(i) * 26) * s, ex = Math.sin(r) * L, ey = Math.cos(r) * L;
        return <path key={i} d={`M${r1(x - w * 0.2)} ${y} L ${r1(x + ex - w)} ${r1(y + ey)} L ${r1(x + ex + w)} ${r1(y + ey)} L ${r1(x + w * 0.2)} ${y} Z`} fill="url(#ntRayo)" opacity={(0.5 + 0.25 * Math.sin(f / 25 + i * 2)) * Math.min(1, k)} />;
      })}
      <circle cx={x} cy={y} r={300 * s * pul * (0.6 + k * 0.4)} fill="url(#ntResplandor)" opacity={0.85} />
      {Array.from({ length: 14 }, (_, i) => { const t = ((f / 90 + azar(i)) % 1); return <circle key={i} cx={x + (azar(i + 2) - 0.5) * 500 * s} cy={y + t * 380 * s} r={2.4 * s} fill="#FFFBEA" opacity={(1 - t) * 0.8 * Math.min(1, k)} />; })}
    </g>
  );
};
/** "El Espíritu de Dios se movía sobre las aguas": un brillo suave que recorre la superficie con ondas. */
const Soplo: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const cx = x + Math.sin(f / 70) * 420 * s;
  return (
    <g>
      <ellipse cx={cx} cy={y - 10} rx={340 * s} ry={70 * s} fill="url(#ntResplandor)" opacity={0.55} />
      {[0, 1, 2, 3].map((i) => { const t = ((f / 50 + i / 4) % 1); return <ellipse key={i} cx={cx} cy={y + 6} rx={(60 + t * 320) * s} ry={(8 + t * 22) * s} fill="none" stroke="#F4E8C8" strokeWidth={2} opacity={(1 - t) * 0.55} />; })}
    </g>
  );
};
/** Bruma gris que se arrastra sobre el agua oscura (lo informe y vacío). */
const Bruma: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g>{Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={x - 1200 + ((i * 420 + f * (0.6 + (i % 3) * 0.2)) % 2600)} cy={y - (i % 3) * 50} rx={420 * s} ry={70 * s} fill="url(#ntBruma)" />)}</g>
);
/** El firmamento: una gran bóveda de luz clara que separa las aguas de arriba (nubes) de las de abajo. */
const Cupula: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g opacity={0.9}>
    <path d={`M${x - 1300 * s} ${y} C ${x - 1100 * s} ${y - 560 * s}, ${x + 1100 * s} ${y - 560 * s}, ${x + 1300 * s} ${y}`} stroke="#FFFFFF" strokeWidth={14 * s} fill="none" opacity={0.35} />
    <path d={`M${x - 1300 * s} ${y} C ${x - 1100 * s} ${y - 560 * s}, ${x + 1100 * s} ${y - 560 * s}, ${x + 1300 * s} ${y}`} stroke="#FFFFFF" strokeWidth={50 * s} fill="none" opacity={0.08 + Math.sin(f / 30) * 0.03} />
  </g>
);
/** Tierra seca que sale de las aguas: lomas pardas con orilla de arena y rocas. Origen = línea del agua (centro). */
const Tierra: React.FC<{ x: number; y: number; s?: number; verde?: boolean }> = ({ x, y, s = 1, verde }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M-900 40 C -760 -10, -640 -30, -560 -90 C -460 -170, -340 -200, -220 -180 C -120 -250, 40 -270, 160 -210 C 260 -240, 400 -220, 520 -140 C 640 -80, 760 -30, 900 40 Z" fill={NT.arena} />
    <path d="M-820 40 C -700 -20, -600 -60, -520 -110 C -420 -190, -320 -210, -210 -190 C -110 -262, 40 -282, 150 -222 C 250 -250, 390 -234, 500 -156 C 610 -96, 720 -40, 820 40 Z" fill={verde ? '#8A9A5A' : NT.tierra} />
    <path d="M-360 -40 C -240 -130, -80 -170, 40 -150 C 170 -170, 300 -120, 420 -40 C 300 -70, 160 -90, 40 -84 C -100 -90, -240 -70, -360 -40 Z" fill={verde ? '#76884A' : '#8E6C4C'} opacity={0.7} />
    {[[-420, -78], [260, -150], [560, -46]].map(([rx, ry], i) => <g key={i} transform={`translate(${rx} ${ry}) scale(0.45)`}><path d="M-80 4 L -66 -40 L -24 -70 L 26 -64 L 70 -30 L 84 4 Z" fill={NT.piedraOsc} /><path d="M-66 -40 L -24 -70 L 26 -64 L 10 -30 L -40 -20 Z" fill={NT.piedra} /></g>)}
    <path d="M-900 40 H 900" stroke="#F4EAD2" strokeWidth={4} opacity={0.6} />
  </g>
);
/** Cardumen: peces chicos que nadan juntos dando vueltas suaves. props.n, props.dir (1 = a la derecha). */
const Cardumen: React.FC<{ x: number; y: number; s?: number; f: number; n?: number; dir?: number; c?: string }> = ({ x, y, s = 1, f, n = 14, dir = 1, c = '#E8B04A' }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const fx = x + dir * ((f * 2.2 + azar(i) * 500) % 700 - 350) * s, fy = y + (azar(i + 5) - 0.5) * 140 * s + Math.sin(f / 14 + i) * 8;
      const col = i % 4 === 0 ? '#C9D6DE' : c;
      return <g key={i} transform={`translate(${r1(fx)} ${r1(fy)}) scale(${dir * s} ${s})`}>
        <path d="M-18 0 C -8 -9, 10 -9, 18 0 C 10 9, -8 9, -18 0 Z" fill={col} />
        <path d={`M-16 0 L -28 ${r1(-8 + Math.sin(f / 4 + i) * 2)} L -28 ${r1(8 + Math.sin(f / 4 + i) * 2)} Z`} fill={col} />
        <circle cx={10} cy={-2} r={1.8} fill="#1E2A30" />
      </g>;
    })}
  </g>
);
/** Bandada lejana: pájaros chicos (dos trazos) que cruzan el cielo. props.n, props.dir. */
const Bandada: React.FC<{ x: number; y: number; s?: number; f: number; n?: number; dir?: number }> = ({ x, y, s = 1, f, n = 9, dir = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const bx = x + dir * (f * 3 + i * 46 - 300) * s, by = y + (i % 2) * 26 * s - Math.abs(i - n / 2) * 10 * s, a = Math.sin(f / 4 + i) * 9;
      return <path key={i} d={`M${r1(bx - 14 * s)} ${r1(by - a * s * 0.6)} Q ${r1(bx - 6 * s)} ${r1(by - 6 * s)} ${r1(bx)} ${r1(by)} Q ${r1(bx + 6 * s)} ${r1(by - 6 * s)} ${r1(bx + 14 * s)} ${r1(by - a * s * 0.6)}`} stroke="#3A3A44" strokeWidth={2.6 * s} fill="none" strokeLinecap="round" />;
    })}
  </g>
);
/** Algas del fondo del mar que se mecen. */
const Algas: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    {Array.from({ length: 5 }, (_, i) => { const dx = -30 + i * 15, al = 90 + azar(i + x) * 80, m = Math.sin(f / 22 + i) * 14; return <path key={i} d={`M${dx} 0 C ${dx + m} ${-al * 0.3}, ${dx - m} ${-al * 0.6}, ${r1(dx + m * 1.2)} ${-al}`} stroke={i % 2 ? '#3E7A5A' : '#5A9A6A'} strokeWidth={7} fill="none" strokeLinecap="round" />; })}
  </g>
);

/** Cuadro chico de un día (para la tabla de la parte 2): fondo y un dibujito. */
const CuadroDia: React.FC<{ x: number; y: number; dia: number; f: number }> = ({ x, y, dia, f }) => {
  const W = 240, H = 150;
  const cielo = ['#2A2E3A', '#9FC4E0', '#BFD8EA', '#24345E', '#9FC4E0', '#CFE0EA'][dia - 1];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={10} fill={cielo} />
      {dia === 1 && <><circle cx={0} cy={-10} r={60} fill="url(#ntResplandor)" /><rect x={-W / 2} y={30} width={W} height={45} fill="#1E2630" /></>}
      {dia === 2 && <><ellipse cx={-50} cy={-38} rx={46} ry={14} fill="#FFFFFF" /><ellipse cx={50} cy={-44} rx={40} ry={12} fill="#FFFFFF" /><rect x={-W / 2} y={20} width={W} height={55} fill="#4F86A8" /></>}
      {dia === 3 && <><rect x={-W / 2} y={30} width={W} height={45} fill="#4F86A8" /><path d={`M-80 75 C -60 10, 40 0, 110 75 Z`} fill={NT.tierra} /><circle cx={20} cy={0} r={22} fill="#5E8A4A" /><path d="M20 20 V 36" stroke="#7A5A3E" strokeWidth={5} /></>}
      {dia === 4 && <><circle cx={-60} cy={10} r={24} fill="#FFE9A8" /><circle cx={-60} cy={10} r={44} fill="url(#ntSol)" /><circle cx={60} cy={-30} r={16} fill="#EEEADC" />{[[10, -50], [90, 0], [30, 20], [-10, -20], [100, -50]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={2.4} fill="#FFF8E6" />)}</>}
      {dia === 5 && <><rect x={-W / 2} y={10} width={W} height={65} fill="#4F86A8" /><path d="M-60 40 C -40 28, -10 28, 10 40 C -10 52, -40 52, -60 40 Z M10 40 L 24 30 L 24 50 Z" fill="#E8B04A" />{[[-30, -40], [10, -50], [50, -36]].map(([bx, by], i) => <path key={i} d={`M${bx - 12} ${by} Q ${bx - 5} ${by - 8} ${bx} ${by} Q ${bx + 5} ${by - 8} ${bx + 12} ${by}`} stroke="#3A3A44" strokeWidth={3} fill="none" />)}</>}
      {dia === 6 && <><rect x={-W / 2} y={35} width={W} height={40} fill={NT.pasto} /><ellipse cx={-50} cy={22} rx={34} ry={18} fill="#D9CDB4" /><path d="M-78 30 V 46 M-24 30 V 46" stroke="#5A4A3A" strokeWidth={5} /><circle cx={-82} cy={14} r={10} fill="#D9CDB4" /><circle cx={40} cy={-6} r={11} fill="#B98A62" /><path d="M40 5 V 36" stroke="#E9E0CC" strokeWidth={14} strokeLinecap="round" /><circle cx={72} cy={-2} r={10} fill="#D2A57E" /><path d="M72 8 V 36" stroke="#D9C9A8" strokeWidth={14} strokeLinecap="round" /></>}
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={10} fill="none" stroke="#F4EBDA" strokeWidth={4} />
      <text x={0} y={H / 2 + 34} textAnchor="middle" fontFamily="Cinzel, serif" fontWeight={700} fontSize={26} fill="#F4EBDA" style={{ paintOrder: 'stroke', stroke: '#2A2420', strokeWidth: 5 }} opacity={0.95}>{`DAY ${dia}`}</text>
      {f < 0 && null}
    </g>
  );
};
/** Tabla de los seis días: arriba los espacios (1–3), abajo lo que los llena (4–6). props.filas 1 | 2. Origen = centro. */
const TablaDias: React.FC<{ x: number; y: number; s?: number; f: number; filas?: number }> = ({ x, y, s = 1, f, filas = 2 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-470} y={filas === 2 ? -225 : -105} width={940} height={filas === 2 ? 480 : 240} rx={22} fill="#2A2420" opacity={0.55} />
    {[1, 2, 3].map((d, i) => <CuadroDia key={d} x={(i - 1) * 290} y={filas === 2 ? -125 : 0} dia={d} f={f} />)}
    {filas === 2 && [4, 5, 6].map((d, i) => <CuadroDia key={d} x={(i - 1) * 290} y={135} dia={d} f={f} />)}
    {filas === 2 && [0, 1, 2].map((i) => <path key={i} d={`M${(i - 1) * 290} 6 v 34 m -9 -10 l 9 10 l 9 -10`} stroke="#F4EBDA" strokeWidth={4} fill="none" strokeLinecap="round" />)}
  </g>
);
/** El ritmo de los días: siete soles en fila; props.n llenos, props.septimo = el séptimo brilla (todavía vacío). */
const RitmoDias: React.FC<{ x: number; y: number; s?: number; f: number; n?: number; septimo?: boolean }> = ({ x, y, s = 1, f, n = 6, septimo }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <rect x={-570} y={-90} width={1140} height={220} rx={22} fill="#2A2420" opacity={0.55} />
    {Array.from({ length: 7 }, (_, i) => {
      const cx = (i - 3) * 150, lleno = i < n, siete = i === 6;
      return <g key={i}>
        {siete && septimo && <circle cx={cx} cy={0} r={90 + Math.sin(f / 10) * 8} fill="url(#ntResplandor)" />}
        <circle cx={cx} cy={0} r={46} fill={lleno ? '#FFE9A8' : 'none'} stroke="#F4EBDA" strokeWidth={4} strokeDasharray={lleno ? undefined : '8 8'} opacity={lleno || (siete && septimo) ? 1 : 0.6} />
        {lleno && <circle cx={cx} cy={0} r={70} fill="url(#ntSol)" />}
        <text x={cx} y={88} textAnchor="middle" fontFamily="Cinzel, serif" fontWeight={700} fontSize={28} fill="#F4EBDA" style={{ paintOrder: 'stroke', stroke: '#2A2420', strokeWidth: 5 }}>{siete ? '7 ?' : i + 1}</text>
      </g>;
    })}
  </g>
);

// ---------- fondos ----------
export function fondoBiblia(tipo: string, f: number, astros = true): React.ReactNode | null {
  switch (tipo) {
    case 'abismo': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntAbismo" /></Capa>
        <Capa p={0.3}><Agua y={SUELO - 170} f={f * 0.25} id="ntMarOsc" reflejo="#5A6474" desde={-1800} hasta={4400} /></Capa>
        <Capa p={0.6}><Bruma x={960} y={SUELO - 170} f={f} /></Capa>
        <Capa p={1}><Agua y={SUELO - 60} f={f * 0.5} id="ntMarOsc" reflejo="#4A5464" desde={-1800} hasta={6400} soloReflejos /></Capa>
      </>
    );
    case 'aguas_luz': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntLuzAguas" /></Capa>
        <Capa p={0.3}><Agua y={SUELO - 170} f={f * 0.3} id="ntMarLuz" reflejo="#FFF0CC" desde={-1800} hasta={4400} /></Capa>
        <Capa p={1}><Agua y={SUELO - 60} f={f * 0.55} id="ntMarLuz" reflejo="#FFF0CC" desde={-1800} hasta={6400} soloReflejos /></Capa>
      </>
    );
    case 'firmamento_agua': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.3}><Agua y={SUELO - 150} f={f * 0.3} desde={-1800} hasta={4400} /></Capa>
        <Capa p={1}><Agua y={SUELO - 50} f={f * 0.6} desde={-1800} hasta={6400} soloReflejos /></Capa>
      </>
    );
    case 'tierra_seca': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.15}><Loma y={SUELO - 150} amp={150} c="#BFA88A" seed={2} /></Capa>
        <Capa p={0.4}><Loma y={SUELO - 70} amp={130} c="#A9895E" luz="#FFF0D0" seed={5} /></Capa>
        <Capa p={0.7}>{[[-200, 0.9], [900, 0.7], [2100, 1]].map(([x, s], i) => <Roca key={i} x={x} y={SUELO - 10} s={s} />)}</Capa>
        <Capa p={1}><SueloNatural desde={-1600} hasta={6400} color="#C9AE84" /></Capa>
      </>
    );
    case 'mar_tierra': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.15}><Loma y={SUELO - 200} amp={160} c="#9FB0BE" seed={3} desde={600} hasta={5200} /></Capa>
        <Capa p={0.3}><Agua y={SUELO - 170} f={f * 0.3} desde={-1800} hasta={4400} /><Loma y={SUELO - 120} amp={170} c="#9AA06A" luz="#FFF0D0" seed={7} desde={900} hasta={5200} /></Capa>
        <Capa p={0.6}><path d={`M380 ${SUELO + 300} C 460 ${SUELO + 170}, 520 ${SUELO + 90}, 600 ${SUELO + 60} C 800 ${SUELO - 40}, 1000 ${SUELO - 90}, 1300 ${SUELO - 96} H 5600 V ${SUELO + 300} H 380 Z`} fill={NT.arena} /></Capa>
        <Capa p={1}><path d={`M300 ${SUELO + 300} C 380 ${SUELO + 190}, 460 ${SUELO + 110}, 560 ${SUELO + 80} C 720 ${SUELO + 6}, 860 ${SUELO - 2}, 1100 ${SUELO - 2} H 6400 V ${SUELO + 300} H 300 Z`} fill="#D9C08E" />{[1400, 2200, 3000].map((x, i) => <Hierba key={i} x={x} y={SUELO} s={1} f={f} />)}</Capa>
      </>
    );
    case 'jardin': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.1}>{[[300, 260], [1300, 220], [2200, 280]].map(([x, y], i) => <NubeSuave key={i} x={x} y={y} s={0.8} f={f} />)}</Capa>
        <Capa p={0.18}><Loma y={SUELO - 170} amp={170} c="#A9BC8A" seed={4} /></Capa>
        <Capa p={0.4}><Loma y={SUELO - 80} amp={140} c="#8FA25A" luz="#FFF8D8" seed={8} />{[-300, 500, 1400, 2300, 3000].map((x, i) => <Olivo key={i} x={x} y={SUELO - 110 + (i % 2) * 20} s={0.45} f={f} />)}</Capa>
        <Capa p={0.75}>{[-150, 2300].map((x, i) => <ArbolFruta key={i} x={x} y={SUELO - 10} s={0.9} f={f + i * 20} />)}{[500, 1100, 2500].map((x, i) => <Arbusto key={i} x={x} y={SUELO - 6} s={1.2} />)}</Capa>
        <Capa p={1}>{[100, 800, 1500, 2200, 2900, 3600].map((x, i) => i % 2 ? <Flores key={i} x={x} y={SUELO + 4} s={1} f={f} /> : <Hierba key={i} x={x} y={SUELO + 4} s={1.1} f={f} />)}<SueloNatural desde={-1600} hasta={6400} color="#9AAE62" /></Capa>
      </>
    );
    case 'cielo_noche': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntNoche" /></Capa>
        <Capa p={0.04}>{astros && <><Estrellas f={f} n={70} /><Luna x={1500} y={260} r={44} /></>}</Capa>
        <Capa p={0.2}><Loma y={SUELO - 120} amp={140} c="#2A3450" seed={6} /></Capa>
        <Capa p={0.5}><Loma y={SUELO - 40} amp={90} c="#1E2638" seed={9} />{[200, 1300, 2400].map((x, i) => <g key={i} opacity={0.9}><Olivo x={x} y={SUELO - 30} s={0.6} f={f} /></g>)}<rect x={-1800} y={SUELO - 300} width={8000} height={600} fill="#0C1226" opacity={0.25} /></Capa>
        <Capa p={1}><SueloNatural desde={-1600} hasta={6400} color="#3A3A44" /></Capa>
      </>
    );
    case 'amanecer': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntAlba" /></Capa>
        <Capa p={0.04}>{astros && <><Estrellas f={f} n={24} area={[-200, 140, 2400, 200]} /><Sol x={520} y={560} r={56} f={f} /></>}</Capa>
        <Capa p={0.15}><Loma y={SUELO - 90} amp={110} c="#7A6A7A" seed={11} /></Capa>
        <Capa p={0.4}><Loma y={SUELO - 30} amp={80} c="#5E5262" luz="#F8DCA8" seed={13} />{[300, 1600, 2600].map((x, i) => <Palmera key={i} x={x} y={SUELO - 40} s={0.5} f={f} />)}</Capa>
        <Capa p={1}><SueloNatural desde={-1600} hasta={6400} color="#8A7060" /></Capa>
      </>
    );
    case 'mar_vida': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.1}>{[[400, 260], [1500, 240]].map(([x, y], i) => <NubeSuave key={i} x={x} y={y} s={0.7} f={f} />)}</Capa>
        <Capa p={0.5}>
          <rect x={-1800} y={400} width={8000} height={SUELO} fill="url(#ntBajoAgua)" />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-600 + i * 420 + Math.sin(f / 60 + i) * 30} 400 l 60 0 l ${120 + i % 3 * 40} 400 l -150 0 Z`} fill="url(#ntRayoAgua)" opacity={0.6} />)}
          <path d={`M-1800 400 ` + Array.from({ length: 170 }, (_, i) => `q 25 ${r1(-8 + Math.sin(f / 10 + i) * 2)} 50 0`).join(' ')} stroke="#E6F2F8" strokeWidth={4} fill="none" opacity={0.8} />
        </Capa>
        <Capa p={0.8}>{[-100, 700, 1500, 2300, 3100].map((x, i) => <Algas key={i} x={x} y={SUELO - 10} s={0.9} f={f} />)}{[300, 1900].map((x, i) => <g key={i} opacity={0.8}><Roca x={x} y={SUELO - 6} s={0.8} /></g>)}</Capa>
        <Capa p={1}><rect x={-1800} y={SUELO - 14} width={8200} height={300} fill="#CDB98E" /><path d={`M-1800 ${SUELO - 14} ` + Array.from({ length: 160 }, () => `q 25 -6 50 0`).join(' ')} fill="#CDB98E" /></Capa>
      </>
    );
    case 'llanura': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.05}>{astros && <Sol x={1640} y={230} r={34} f={f} />}</Capa>
        <Capa p={0.1}>{[[200, 250], [1100, 210]].map(([x, y], i) => <NubeSuave key={i} x={x} y={y} s={0.75} f={f} />)}</Capa>
        <Capa p={0.18}><Loma y={SUELO - 140} amp={120} c="#B8B49A" seed={14} /></Capa>
        <Capa p={0.45}><Loma y={SUELO - 50} amp={60} c="#B9A86A" luz="#FFF4D0" seed={15} />{[-200, 1000, 2400].map((x, i) => <Acacia key={i} x={x} y={SUELO - 60} s={0.7} f={f} />)}</Capa>
        <Capa p={1}>{[0, 600, 1200, 1800, 2400, 3000, 3600].map((x, i) => <Hierba key={i} x={x} y={SUELO + 4} s={1.1} f={f + i} />)}<SueloNatural desde={-1600} hasta={6400} color="#C9B47A" /></Capa>
      </>
    );
    case 'desierto': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntTarde" /></Capa>
        <Capa p={0.05}>{astros && <Sol x={1500} y={300} r={40} f={f} />}</Capa>
        <Capa p={0.15}><Loma y={SUELO - 160} amp={200} c="#C9A88A" seed={17} /></Capa>
        <Capa p={0.4}><Loma y={SUELO - 60} amp={110} c="#D9BC8A" luz="#FFF0D0" seed={19} />{[500, 2300].map((x, i) => <Palmera key={i} x={x} y={SUELO - 60} s={0.55} f={f} />)}</Capa>
        <Capa p={0.75}>{[-100, 1300, 2700].map((x, i) => <Roca key={i} x={x} y={SUELO - 6} s={0.9} />)}{[800, 2000].map((x, i) => <Arbusto key={i} x={x} y={SUELO} s={0.8} c="#8A8A5A" />)}</Capa>
        <Capa p={1}><SueloNatural desde={-1600} hasta={6400} color="#E2C79A" /></Capa>
      </>
    );
    case 'colinas': return (
      <>
        <Degrades />
        <Capa p={0}><Cielo id="ntDia" /></Capa>
        <Capa p={0.05}>{astros && <Sol x={1640} y={220} r={32} f={f} />}</Capa>
        <Capa p={0.1}>{[[350, 240], [1250, 200]].map(([x, y], i) => <NubeSuave key={i} x={x} y={y} s={0.7} f={f} />)}</Capa>
        <Capa p={0.18}><Loma y={SUELO - 190} amp={190} c="#AEB89A" seed={21} /></Capa>
        <Capa p={0.4}><Loma y={SUELO - 70} amp={150} c="#A8A066" luz="#FFF4D0" seed={23} />{[-400, 200, 800, 1500, 2100, 2800].map((x, i) => <Olivo key={i} x={x} y={SUELO - 110 + (i % 3) * 22} s={0.42} f={f} />)}</Capa>
        <Capa p={0.75}>{[-250, 2300].map((x, i) => <Olivo key={i} x={x} y={SUELO - 6} s={0.95} f={f + i * 30} />)}</Capa>
        <Capa p={1}>{[300, 1700, 2000, 2600, 3300].map((x, i) => i % 2 ? <Flores key={i} x={x} y={SUELO + 4} s={0.9} f={f} /> : <Hierba key={i} x={x} y={SUELO + 4} s={1} f={f} />)}<SueloNatural desde={-1600} hasta={6400} color="#B8A86E" /></Capa>
      </>
    );
    default: return null;
  }
}

// ---------- elementos ----------
export function elementoBiblia(tipo: string, x: number, y: number | undefined, s: number, f: number, props: Record<string, unknown> = {}): React.ReactNode | null {
  const yy = y ?? SUELO;
  const n = (k: string, d: number) => (typeof props[k] === 'number' ? (props[k] as number) : d);
  const def = <Degrades />;
  switch (tipo) {
    case 'luz_divina': return <>{def}<LuzDivina x={x} y={y ?? 240} s={s} f={f} intensidad={n('intensidad', 1)} ancho={n('ancho', 1)} largo={n('largo', 900)} /></>;
    case 'soplo': return <>{def}<Soplo x={x} y={y ?? SUELO - 60} s={s} f={f} /></>;
    case 'bruma': return <>{def}<Bruma x={x} y={y ?? SUELO - 80} s={s} f={f} /></>;
    case 'cupula': return <Cupula x={x} y={y ?? SUELO - 60} s={s} f={f} />;
    case 'tierra': return <Tierra x={x} y={y ?? SUELO - 40} s={s} verde={props.verde === true} />;
    case 'sol_natural': case 'sol': return <>{def}<Sol x={x} y={y ?? 260} r={56 * s} f={f} /></>;
    case 'luna_natural': case 'luna': return <>{def}<Luna x={x} y={y ?? 240} r={44 * s} llena={props.llena !== false} /></>;
    case 'estrellas_natural': case 'estrellas': return <Estrellas f={f} n={n('n', 40)} area={[x - 1000, y ?? 140, 2000, n('alto', 380)]} seed={n('seed', 3)} />;
    case 'nube_natural': case 'nube': return <NubeSuave x={x} y={y ?? 260} s={s} f={f} gris={props.gris === true} />;
    case 'olivo_natural': case 'olivo': case 'arbol': return <Olivo x={x} y={yy} s={s} f={f} />;
    case 'palmera_natural': case 'palmera': return <Palmera x={x} y={yy} s={s} f={f} />;
    case 'arbol_fruta': return <ArbolFruta x={x} y={yy} s={s} f={f} fruta={props.fruta !== false} />;
    case 'acacia': return <Acacia x={x} y={yy} s={s} f={f} />;
    case 'arbusto': return <Arbusto x={x} y={yy} s={s} />;
    case 'hierba': return <Hierba x={x} y={yy} s={s} f={f} />;
    case 'flores': return <Flores x={x} y={yy} s={s} f={f} c={props.color as string | undefined} />;
    case 'roca_natural': case 'roca': return <Roca x={x} y={yy} s={s} />;
    case 'monte': return <g transform={`translate(${r1(x)} ${r1(yy)}) scale(${s})`}><path d="M-420 0 C -260 -120, -120 -300, 0 -320 C 120 -300, 260 -120, 420 0 Z" fill="#B8A88A" /><path d="M-60 -300 C -20 -320, 20 -320, 60 -300 C 30 -260, -30 -260, -60 -300 Z" fill="#D8CCB4" /></g>;
    case 'cardumen': return <Cardumen x={x} y={y ?? 600} s={s} f={f} n={n('n', 14)} dir={n('dir', 1)} c={props.color as string | undefined} />;
    case 'bandada': return <Bandada x={x} y={y ?? 260} s={s} f={f} n={n('n', 9)} dir={n('dir', 1)} />;
    case 'algas': return <Algas x={x} y={yy} s={s} f={f} />;
    case 'tabla_dias': return <>{def}<TablaDias x={x} y={y ?? 430} s={s} f={f} filas={n('filas', 2)} /></>;
    case 'ritmo_dias': return <>{def}<RitmoDias x={x} y={y ?? 420} s={s} f={f} n={n('n', 6)} septimo={props.septimo === true} /></>;
    case 'arca': return <Arca x={x} y={y ?? SUELO - 40} s={s} f={f} mece={props.mece === true} />;
    case 'lluvia': return <Lluvia x={x} y={y ?? 120} f={f} n={n('n', 70)} ancho={n('ancho', 2000)} largo={n('largo', 640)} />;
    case 'arcoiris': return <Arcoiris x={x} y={y ?? 520} s={s} o={n('o', 0.85)} />;
    case 'altar_piedra': return <AltarPiedra x={x} y={yy} s={s} f={f} fuego={props.fuego !== false} />;
    case 'tienda': return <Tienda x={x} y={yy} s={s} />;
    default: return null;
  }
}
