import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { loadFont as cargarCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as cargarGaramond } from '@remotion/google-fonts/EBGaramond';

export const { fontFamily: TITULO } = cargarCinzel('normal', { weights: ['400', '700'], subsets: ['latin'] });
export const { fontFamily: TEXTO } = cargarGaramond('normal', { weights: ['500'], subsets: ['latin'] });

// Paleta de cerámica de figuras negras
export const C = {
  barro: '#C8642D',
  barroClaro: '#DE8A4E',
  barroOscuro: '#8A3B17',
  negro: '#1A1210',
  crema: '#F2DFBA',
  oro: '#EBC46E',
  noche: '#0E0A09',
};

export type Escena = { dur: number; at: (i: number) => number; fin: (i: number) => number };

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** 0→1 a partir del frame `desde`, con salida suave. */
export const ap = (frame: number, desde: number, d = 18) =>
  interpolate(frame, [desde, desde + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
export const entre = (frame: number, a: number, b: number, v0: number, v1: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [v0, v1], { ...clamp, easing: ease });

/** Fondo de arcilla con viñeta y textura. */
export const Fondo: React.FC<{ color?: string; oscuro?: number }> = ({ color = C.barro, oscuro = 0 }) => (
  <>
    <defs>
      <radialGradient id="vineta" cx="50%" cy="45%" r="75%">
        <stop offset="0%" stopColor={C.barroClaro} stopOpacity={0.55} />
        <stop offset="60%" stopColor={color} stopOpacity={0} />
        <stop offset="100%" stopColor={C.barroOscuro} stopOpacity={0.9} />
      </radialGradient>
      <filter id="arcilla">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
        <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0.18 0" />
      </filter>
      <filter id="contorno" x="-20%" y="-20%" width="140%" height="140%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d" />
        <feFlood floodColor="#F2DFBA" floodOpacity="0.85" />
        <feComposite in2="d" operator="in" result="c" />
        <feMerge>
          <feMergeNode in="c" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={1920} height={1080} fill={color} />
    <rect width={1920} height={1080} fill="url(#vineta)" />
    <rect width={1920} height={1080} filter="url(#arcilla)" />
    {oscuro > 0 && <rect width={1920} height={1080} fill={C.noche} opacity={oscuro} />}
  </>
);

/** Guarda de meandro griego (arriba y abajo). */
export const Meandro: React.FC<{ y: number; color?: string }> = ({ y, color = C.negro }) => {
  const paso = 60;
  const uno = 'M0 50 V10 H50 V40 H20 V25 H35';
  return (
    <g transform={`translate(0 ${y})`}>
      <rect width={1920} height={60} fill={C.barroOscuro} opacity={0.35} />
      {Array.from({ length: Math.ceil(1920 / paso) + 1 }, (_, i) => (
        <path key={i} d={uno} transform={`translate(${i * paso + 5} 0)`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="square" />
      ))}
      <line x1={0} x2={1920} y1={2} y2={2} stroke={color} strokeWidth={4} />
      <line x1={0} x2={1920} y1={58} y2={58} stroke={color} strokeWidth={4} />
    </g>
  );
};

export const Etiqueta: React.FC<{ x: number; y: number; texto: string; o: number; tam?: number; color?: string }> = ({ x, y, texto, o, tam = 40, color = C.crema }) => (
  <text x={x} y={y + (1 - o) * 14} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={tam} fill={color} opacity={o} letterSpacing={3} style={{ paintOrder: 'stroke' }} stroke={C.negro} strokeWidth={6}>
    {texto}
  </text>
);

/** Lienzo SVG con zoom lento de cámara. */
export const Lienzo: React.FC<{ dur: number; children: React.ReactNode; zoom?: [number, number]; foco?: [number, number] }> = ({ dur, children, zoom = [1, 1.06], foco = [960, 540] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  const fade = Math.min(ap(f, 0, 12), interpolate(f, [dur - 10, dur], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: C.noche }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <g transform={`translate(${foco[0]} ${foco[1]}) scale(${z}) translate(${-foco[0]} ${-foco[1]})`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};

export const TituloEscena: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  const o = ap(f, 4, 20) * interpolate(f, [110, 140], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 90 }}>
      <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 56, color: C.crema, letterSpacing: 6, opacity: o, transform: `translateY(${(1 - o) * -16}px)`, textShadow: `0 3px 0 ${C.negro}, 0 0 24px rgba(0,0,0,.6)` }}>
        {texto.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};

export const Subtitulo: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(ap(f, 0, 8), interpolate(f, [dur + 4, dur + 10], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 92 }}>
      <div style={{ maxWidth: 1500, textAlign: 'center', fontFamily: TEXTO, fontWeight: 500, fontSize: 46, lineHeight: 1.25, color: '#FFF6E4', opacity: o, padding: '14px 34px', borderRadius: 14, background: 'rgba(20,12,9,.62)', textShadow: '0 2px 6px rgba(0,0,0,.7)' }}>
        {texto}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Figuras ----------

export type Objeto = 'rayo' | 'tridente' | 'hoz' | 'casco' | 'lanza' | 'copa' | null;

export const ObjetoSVG: React.FC<{ tipo: Objeto; brillo?: number }> = ({ tipo, brillo = 0 }) => {
  switch (tipo) {
    case 'rayo':
      return <path d="M-6 -150 L22 -150 L4 -70 L28 -70 L-18 40 L-4 -40 L-26 -40 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} filter={brillo ? 'url(#brillo)' : undefined} />;
    case 'tridente':
      return (
        <g stroke={C.negro} strokeWidth={9} strokeLinecap="round" fill="none">
          <line x1={0} y1={90} x2={0} y2={-160} />
          <path d="M-30 -200 V-160 H30 V-200 M0 -210 V-160" />
          <path d="M-30 -200 l-7 12 M30 -200 l7 12 M0 -210 l0 -6" strokeWidth={6} />
        </g>
      );
    case 'hoz':
      return (
        <g filter={brillo ? 'url(#brillo)' : undefined}>
          <line x1={0} y1={30} x2={0} y2={-40} stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
          <path d="M0 -40 C 10 -120, 110 -130, 130 -60 C 100 -100, 40 -95, 6 -30 Z" fill="#E6E1D3" stroke={C.negro} strokeWidth={4} />
        </g>
      );
    case 'casco':
      return (
        <g transform="translate(0 -30)">
          <path d="M-34 10 C -40 -50, 40 -60, 36 0 L 36 30 L 14 30 L 14 4 L -6 4 L -6 34 L -34 34 Z" fill={C.negro} stroke={C.crema} strokeWidth={3} />
          <path d="M-20 -40 C 0 -80, 40 -70, 50 -40" stroke={C.negro} strokeWidth={12} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'lanza':
      return (
        <g>
          <line x1={0} y1={100} x2={0} y2={-170} stroke={C.negro} strokeWidth={7} />
          <path d="M0 -200 L10 -168 L-10 -168 Z" fill={C.negro} />
        </g>
      );
    case 'copa':
      return <path d="M-40 -30 Q0 10 40 -30 Z M-4 -14 V10 M-18 12 H18" fill={C.negro} stroke={C.negro} strokeWidth={6} />;
    default:
      return null;
  }
};

export type FiguraProps = {
  x: number;
  y: number;
  s?: number;
  adelante?: number; // ángulo del brazo delantero (0 = abajo, 90 = al frente, 180 = arriba)
  atras?: number;
  corona?: boolean;
  objeto?: Objeto;
  brilloObjeto?: number;
  voltear?: boolean;
  ciclope?: boolean;
  brazosExtra?: number;
  femenina?: boolean;
  barba?: boolean;
  color?: string;
  rot?: number;
  opacity?: number;
  boca?: number; // 0..1 abierta
  contorno?: boolean; // borde claro para fondos oscuros
};

/** Silueta al estilo de las vasijas de figuras negras. Origen = pies. */
export const Figura: React.FC<FiguraProps> = ({ x, y, s = 1, adelante = 20, atras = -15, corona, objeto = null, brilloObjeto = 0, voltear, ciclope, brazosExtra = 0, femenina, barba = !femenina, color = C.negro, rot = 0, opacity = 1, boca = 0, contorno }) => {
  const f = useCurrentFrame();
  const resp = 1 + Math.sin(f / 18 + x) * 0.008;
  const brazo = (ang: number, k: string, conObjeto = false) => (
    <g key={k} transform={`translate(4 -230) rotate(${-ang})`}>
      <path d="M0 0 L0 80" stroke={color} strokeWidth={15} strokeLinecap="round" />
      <circle cx={0} cy={84} r={9} fill={color} />
      {conObjeto && objeto && (
        <g transform={`translate(0 84) rotate(${ang})`}>
          <ObjetoSVG tipo={objeto} brillo={brilloObjeto} />
        </g>
      )}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${voltear ? -s : s} ${s * resp})`} opacity={opacity} filter={contorno ? 'url(#contorno)' : undefined}>
      {brazo(atras, 'atras')}
      {Array.from({ length: brazosExtra }, (_, i) => brazo(-40 + (i * 220) / Math.max(1, brazosExtra - 1) + Math.sin(f / 8 + i) * 8, `e${i}`))}
      {/* piernas */}
      {!femenina && (
        <g stroke={color} strokeWidth={17} strokeLinecap="round">
          <line x1={-8} y1={-95} x2={-24} y2={-6} />
          <line x1={8} y1={-95} x2={30} y2={-6} />
        </g>
      )}
      <ellipse cx={-18} cy={-4} rx={18} ry={6} fill={color} />
      <ellipse cx={38} cy={-4} rx={18} ry={6} fill={color} />
      {/* falda / túnica */}
      <path d={femenina ? 'M-20 -152 L22 -152 L44 -8 L-40 -8 Z' : 'M-20 -152 L22 -152 L38 -88 L-34 -88 Z'} fill={color} />
      <g stroke={C.crema} strokeWidth={2.5} opacity={0.75} fill="none">
        <path d={femenina ? 'M-6 -140 L-14 -14 M8 -140 L14 -14 M22 -130 L34 -14' : 'M-4 -140 L-10 -94 M10 -140 L14 -94'} />
        <line x1={-20} y1={-152} x2={22} y2={-152} strokeWidth={4} />
      </g>
      {/* torso */}
      <path d="M-26 -240 L32 -240 L20 -150 L-18 -150 Z" fill={color} />
      <path d="M4 -228 Q 22 -214 14 -194" stroke={C.crema} strokeWidth={2.5} fill="none" opacity={0.7} />
      {/* cabeza */}
      <rect x={-6} y={-252} width={16} height={16} fill={color} />
      {femenina && <path d="M-8 -285 Q -40 -250 -30 -205 L -10 -210 Q -16 -245 0 -270 Z" fill={color} />}
      <circle cx={4} cy={-268} r={24} fill={color} />
      <path d={boca > 0 ? `M24 -276 L36 -266 L24 -262 M22 -256 L${34 + boca * 6} ${-250 + boca * 10} L20 -248` : 'M24 -276 L36 -264 L24 -258 Z'} fill={color} stroke={color} strokeWidth={4} />
      {barba && <path d="M8 -256 Q 34 -250 24 -228 Q 8 -232 -2 -250 Z" fill={color} />}
      {ciclope ? (
        <>
          <circle cx={12} cy={-274} r={10} fill={C.crema} />
          <circle cx={15} cy={-274} r={4.5} fill={C.negro} />
        </>
      ) : (
        <circle cx={16} cy={-273} r={3.6} fill={C.crema} />
      )}
      <path d="M-18 -282 Q 4 -300 26 -284" stroke={C.crema} strokeWidth={2.5} fill="none" opacity={0.6} />
      {corona && <path d="M-20 -286 L-16 -310 L-7 -294 L3 -316 L12 -294 L21 -310 L25 -286 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />}
      {brazo(adelante, 'adelante', true)}
    </g>
  );
};

/** Bebé envuelto en pañales (o la piedra disfrazada). */
export const Bebe: React.FC<{ x: number; y: number; s?: number; piedra?: boolean; o?: number }> = ({ x, y, s = 1, piedra, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={46} ry={24} fill={piedra ? '#6E655C' : C.negro} />
    {piedra ? <ellipse cx={-34} cy={-4} rx={18} ry={16} fill="#5A524A" /> : <circle cx={-38} cy={-6} r={18} fill={C.negro} />}
    <g stroke={C.crema} strokeWidth={3} fill="none">
      <path d="M-16 -22 Q -6 0 -16 22 M2 -24 Q 12 0 2 24 M20 -22 Q 30 0 20 20" />
    </g>
  </g>
);

export const Estrellas: React.FC<{ n?: number; area?: [number, number, number, number]; o?: number; seed?: number }> = ({ n = 80, area = [0, 0, 1920, 500], o = 1, seed = 1 }) => {
  const f = useCurrentFrame();
  let s = seed * 9301;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const cx = area[0] + r() * area[2], cy = area[1] + r() * area[3], rr = 1.5 + r() * 3.5, tw = 0.5 + 0.5 * Math.sin(f / 10 + i);
        return <circle key={i} cx={cx} cy={cy} r={rr} fill={C.crema} opacity={0.4 + tw * 0.6} />;
      })}
    </g>
  );
};

export const Olas: React.FC<{ y: number; amp?: number; color?: string; capas?: number; velocidad?: number }> = ({ y, amp = 16, color = C.negro, capas = 3, velocidad = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: capas }, (_, c) => {
        const yy = y + c * 34, fase = (f * velocidad) / (10 + c * 4) + c;
        let d = `M0 1080 L0 ${yy}`;
        for (let x = 0; x <= 1920; x += 40) d += ` L${x} ${yy + Math.sin(x / 90 + fase) * amp}`;
        d += ' L1920 1080 Z';
        return <path key={c} d={d} fill={color} opacity={0.55 + c * 0.2} />;
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const x = ((i * 150 + f * 1.5 * velocidad) % 2000) - 40;
        return <path key={i} d={`M${x} ${y + 8} q 20 -26 40 0 q -14 -8 -20 8`} stroke={C.crema} strokeWidth={3} fill="none" opacity={0.7} />;
      })}
    </g>
  );
};

export const Montana: React.FC<{ d: string; color?: string; o?: number }> = ({ d, color = C.negro, o = 1 }) => <path d={d} fill={color} opacity={o} />;

export const Templo: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-150 -170 L0 -230 L150 -170 Z" fill={C.negro} />
    <rect x={-150} y={-170} width={300} height={16} fill={C.negro} />
    {[-125, -75, -25, 25, 75, 125].map((cx) => (
      <rect key={cx} x={cx - 11} y={-154} width={22} height={134} fill={C.negro} />
    ))}
    <rect x={-165} y={-22} width={330} height={12} fill={C.negro} />
    <rect x={-180} y={-10} width={360} height={12} fill={C.negro} />
    <path d="M-60 -185 L0 -212 L60 -185" stroke={C.crema} strokeWidth={3} fill="none" />
  </g>
);

/** Ánfora para el sorteo. */
export const Anfora: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-30 -150 H30 L24 -120 C 90 -100, 100 20, 30 70 L 40 90 H -40 L -30 70 C -100 20, -90 -100, -24 -120 Z" fill={C.negro} />
    <path d="M-24 -120 C -70 -120, -70 -60, -50 -40 M24 -120 C 70 -120, 70 -60, 50 -40" stroke={C.negro} strokeWidth={10} fill="none" />
    <path d="M-62 -30 H62 M-58 10 H58" stroke={C.crema} strokeWidth={4} />
    <path d="M-50 -20 l16 22 l16 -22 l16 22 l16 -22 l16 22 l16 -22" stroke={C.crema} strokeWidth={3} fill="none" />
  </g>
);

export const Cabra: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => {
  const f = useCurrentFrame();
  const cab = Math.sin(f / 12) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={-70} rx={70} ry={34} fill={C.negro} />
      <g stroke={C.negro} strokeWidth={11} strokeLinecap="round">
        <line x1={-46} y1={-50} x2={-50} y2={0} />
        <line x1={-26} y1={-50} x2={-22} y2={0} />
        <line x1={34} y1={-50} x2={30} y2={0} />
        <line x1={52} y1={-50} x2={56} y2={0} />
      </g>
      <g transform={`rotate(${cab} 60 -90)`}>
        <path d="M54 -84 L80 -130 L112 -118 L92 -80 Z" fill={C.negro} />
        <path d="M84 -128 C 70 -170, 40 -160, 44 -140" stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M104 -112 L108 -90 L96 -96 Z" fill={C.negro} />
        <circle cx={92} cy={-120} r={3} fill={C.crema} />
      </g>
      <path d="M-68 -78 l-20 -18" stroke={C.negro} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};
