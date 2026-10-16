// Diseños oficiales del elenco griego (2026-10-15), para los Shorts "Who is…?" y los episodios nuevos.
// Mismo muñeco de la serie (vasija.tsx), con piel natural, ropa simple y la identidad en silueta, pelo/barba y
// 2–3 atributos clásicos que cualquiera reconoce (iconografía de las vasijas y la escultura, no del cine):
// Zeus = barba gris rizada, rayo de oro y cetro con águila; Hera = corona alta, velo con plumas de pavo real y
// cetro; Poseidón = pelo y barba azul oscuro ("kyanochaites"), manto verde mar y tridente; Hades = barba negra,
// túnica oscura, corona de hierro y bieldo de dos puntas; Atenea = casco corintio echado atrás, lanza, égida con
// la Gorgona y lechuza; Apolo = joven rubio, laurel y lira de oro; Artemisa = túnica corta, arco, carcaj y media
// luna; Hermes = sombrero y sandalias con alas, capa corta de viaje y caduceo; Afrodita = rubia, rosas y concha;
// Ares = casco con cresta roja, coraza de bronce, capa roja, lanza y escudo; Hefesto = barba, gorro de artesano,
// delantal de cuero, martillo y muleta; Dioniso = corona de hiedra y uvas, túnica vino y copa; Prometeo = la
// antorcha en alto; Cronos = titán viejo de barba blanca larga y la hoz.
// Claves *_oficial (las zeus/hera/... de elenco.tsx quedan intactas).
// Piezas en coordenadas del Personaje: cuerpo/detras con origen en los pies; cabeza con el ojo en (18,-6);
// mano/manoAtras con origen en la mano (sin girar: los atributos van derechos, como los del motor).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { suave, lerp, desde, miembro, Fuego, type P, type PersonajeProps } from '../comun/vasija';
import type { Ficha } from './elenco';

const N = '#17110E'; // contorno (el negro de la vasija)
const r1 = (v: number) => v.toFixed(1);
const ORO = '#E8B93E', ORO_OSC = '#B5832A', BRONCE = '#C08A3E', BRONCE_OSC = '#8A5E26', HIERRO = '#7E8790', HIERRO_OSC = '#4E555C';
const BLANCO = '#F4EEE2', CREMA = '#E9DFC8', MADERA = '#7A5232', CUERO = '#6E4526';
const ROJO = '#B3352A', ROJO_OSC = '#7E2219', HOJA = '#4E7A3A', HOJA_OSC = '#355A28';
// pieles naturales (mediterráneas): hombres algo más tostados que mujeres
const PIEL_H = '#D49B72', PIEL_M = '#EEC6A2', PIEL_SOL = '#C2845C', PIEL_PALIDA = '#D9BBA6';

// ---------- utilidades ----------
/** Puntos cada `paso` a lo largo de los lados [desde, hasta) de un polígono cerrado. */
const muestrear = (pts: P[], paso: number, desde = 0, hasta = pts.length): P[] => {
  const out: P[] = [];
  for (let i = desde; i < hasta; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / paso));
    for (let k = 0; k < n; k++) out.push(lerp(a, b, k / n));
  }
  return out;
};
/** Masa de rulos: el polígono con un borde de bucles redondos en los lados [desde, hasta) y rizos claros adentro. */
const Rizado: React.FC<{ pts: P[]; r: number; paso?: number; desde?: number; hasta?: number; c: string; luz?: string; t?: number }> = ({ pts, r, paso, desde = 0, hasta = pts.length, c, luz, t = 0.8 }) => {
  const bolas = muestrear(pts, paso ?? r * 1.15, desde, hasta), d = suave(pts, true, t);
  return (
    <g>
      <path d={d} fill={c} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      {bolas.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r={r} fill={c} stroke={N} strokeWidth={2.2} />)}
      <path d={d} fill={c} />
      {bolas.map(([x, y], i) => <circle key={`f${i}`} cx={r1(x)} cy={r1(y)} r={r - 1.1} fill={c} />)}
      {luz && bolas.map(([x, y], i) => i % 2 === 0 && <path key={`l${i}`} d={`M${r1(x - r * 0.45)} ${r1(y + r * 0.1)} a ${r1(r * 0.42)} ${r1(r * 0.42)} 0 1 1 ${r1(r * 0.8)} 0`} stroke={luz} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Tela lisa con contorno. */
const Tela: React.FC<{ pts: P[]; c: string; t?: number; w?: number }> = ({ pts, c, t = 0.7, w = 2 }) => <path d={suave(pts, true, t)} fill={c} stroke={N} strokeWidth={w} strokeLinejoin="round" />;
const Linea: React.FC<{ pts: P[]; c?: string; w?: number }> = ({ pts, c = N, w = 1.6 }) => <path d={suave(pts)} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ---------- cabeza: pelo y barbas ----------
/** Pelo corto de rulos que tapa coronilla, nuca y oreja. */
const PELO_CORTO: P[] = [[22, -31], [10, -39], [-6, -40], [-20, -34], [-29, -22], [-33, -6], [-32, 10], [-27, 22], [-19, 24], [-16, 8], [-13, -4], [-7, -14], [3, -22], [13, -27]];
/** Melena hasta los hombros (rulos). */
const MELENA: P[] = [[22, -31], [10, -39], [-6, -40], [-20, -34], [-29, -22], [-33, -6], [-34, 14], [-34, 36], [-30, 54], [-20, 56], [-15, 38], [-15, 18], [-13, -2], [-7, -14], [3, -22], [13, -27]];
const PeloRulos: React.FC<{ c: string; luz: string; largo?: boolean; r?: number }> = ({ c, luz, largo, r = 6.5 }) => (
  <Rizado pts={largo ? MELENA : PELO_CORTO} r={r} c={c} luz={luz} desde={0} hasta={largo ? 9 : 7} />
);
/** Barba que sale de la patilla, cubre mandíbula y cuello y termina en `L` (y de la punta). */
const barbaPts = (L: number, adelante = 0): P[] => [[-9, 2], [-14, 22], [-10, L * 0.6], [2 + adelante * 0.4, L * 0.9], [16 + adelante, L], [28 + adelante, L * 0.86], [37 + adelante * 0.5, L * 0.6], [38, 34], [33, 26], [26, 25], [18, 22], [8, 15], [0, 9]];
const Bigote: React.FC<{ c: string }> = ({ c }) => <path d="M23 18 C 30 14, 38 17, 42 25 C 35 23, 29 23.5, 23 24 Z" fill={c} stroke={N} strokeWidth={1.5} strokeLinejoin="round" />;
const BarbaRulos: React.FC<{ c: string; luz: string; L?: number; r?: number; adelante?: number }> = ({ c, luz, L = 58, r = 7.5, adelante = 0 }) => (
  <g><Rizado pts={barbaPts(L, adelante)} r={r} c={c} luz={luz} desde={1} hasta={7} /><Bigote c={c} /></g>
);
/** Barba larga y lisa en mechones (ondas), para Poseidón, Hades y Cronos. */
const BarbaLarga: React.FC<{ c: string; luz: string; L?: number; puntas?: number }> = ({ c, luz, L = 80, puntas = 3 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 1.5;
  const tip: P[] = Array.from({ length: puntas * 2 - 1 }, (_, i) => { const t = i / (puntas * 2 - 2); return [34 - t * 40 + (i % 2 ? 0 : o), (i % 2 ? L - 14 : L) - Math.abs(t - 0.4) * 18] as P; });
  const orden: P[] = [[-9, 2], [-14, 24], [-10, L * 0.55], ...tip.slice().reverse(), [38, L * 0.5], [38, 32], [33, 26], [26, 25], [18, 22], [8, 15], [0, 9]];
  return (
    <g>
      <Tela pts={orden} c={c} t={0.6} />
      {[[2, 22, 0, L - 18], [12, 26, 12, L - 6], [22, 28, 24, L - 16], [31, 32, 32, L * 0.7]].map(([a, b, cx, d], i) => <path key={i} d={`M${a} ${b} Q ${a + 6} ${(b + d) / 2} ${cx} ${d}`} stroke={luz} strokeWidth={1.8} fill="none" strokeLinecap="round" />)}
      <Bigote c={c} />
    </g>
  );
};

// ---------- props de mano ----------
/** Rayo de Zeus: zigzag de oro que brilla (origen = mano). */
const Rayo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="rotate(8)">
      <path d="M30 -110 L 42 -116 M-16 -96 L -28 -102 M34 -40 L 46 -36" stroke="#FFF3B0" strokeWidth={3} strokeLinecap="round" opacity={0.55 + Math.sin(f / 3) * 0.35} />
      <path d="M2 -132 L 26 -128 L 8 -72 L 30 -72 L -10 22 L 0 -46 L -20 -46 Z" fill={ORO} stroke={N} strokeWidth={3} strokeLinejoin="round" />
      <path d="M6 -120 L 14 -118 L 0 -78" stroke="#FFF6CF" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Asta recta (madera o metal) de y0 a y1. */
const Asta: React.FC<{ y0: number; y1: number; c?: string; w?: number }> = ({ y0, y1, c = MADERA, w = 9 }) => (
  <g><path d={`M0 ${y0} L0 ${y1}`} stroke={N} strokeWidth={w + 4} strokeLinecap="round" /><path d={`M0 ${y0 - 1} L0 ${y1 + 1}`} stroke={c} strokeWidth={w} strokeLinecap="round" /></g>
);
/** Águila posada (alas plegadas), mirando a la derecha; origen = patas. */
const Aguila: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-20 -6 L -34 10 L -26 10 L -30 18 L -16 4 Z" fill="#4A3424" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    <path d={suave([[-22, -4], [-14, -30], [4, -40], [16, -34], [14, -14], [2, 0]], true, 0.8)} fill="#5E412A" stroke={N} strokeWidth={2} />
    <path d="M-12 -22 C -4 -30, 6 -30, 10 -24 M-14 -12 C -6 -18, 4 -18, 8 -14" stroke="#8A6440" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    <circle cx={14} cy={-44} r={10} fill={BLANCO} stroke={N} strokeWidth={2} />
    <path d="M22 -48 L 32 -44 Q 30 -36 22 -38 Z" fill={ORO} stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <circle cx={17} cy={-46} r={1.9} fill={N} />
    <path d="M-4 0 L -4 6 M6 -2 L 6 6" stroke={ORO_OSC} strokeWidth={2.4} strokeLinecap="round" />
  </g>
);
const CetroAguila: React.FC = () => (
  <g><Asta y0={176} y1={-250} c={ORO} w={6} /><circle cx={0} cy={-254} r={7} fill={ORO} stroke={N} strokeWidth={2} /><g transform="translate(2 -260)"><Aguila s={0.85} /></g></g>
);
/** Tridente de bronce. */
const Tridente: React.FC<{ y0?: number }> = ({ y0 = 236 }) => (
  <g>
    <Asta y0={y0} y1={-210} c={MADERA} w={8} />
    <path d="M-30 -262 C -32 -226, -18 -212, 0 -212 C 18 -212, 32 -226, 30 -262" stroke={N} strokeWidth={11} fill="none" strokeLinecap="round" />
    <path d="M-30 -262 C -32 -226, -18 -212, 0 -212 C 18 -212, 32 -226, 30 -262" stroke={BRONCE} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M0 -276 V -210" stroke={N} strokeWidth={11} strokeLinecap="round" /><path d="M0 -276 V -212" stroke={BRONCE} strokeWidth={6} strokeLinecap="round" />
    {[-30, 0, 30].map((x) => <path key={x} d={`M${x - 8} ${x ? -258 : -272} L ${x} ${x ? -284 : -298} L ${x + 8} ${x ? -258 : -272} Z`} fill={BRONCE} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />)}
    <rect x={-9} y={-214} width={18} height={10} rx={2} fill={BRONCE_OSC} stroke={N} strokeWidth={2} />
  </g>
);
/** Bieldo de Hades: dos puntas de hierro oscuro. */
const Bieldo: React.FC<{ y0?: number }> = ({ y0 = 236 }) => (
  <g>
    <Asta y0={y0} y1={-212} c="#3A2E2A" w={8} />
    <path d="M-18 -264 C -20 -228, -10 -214, 0 -214 C 10 -214, 20 -228, 18 -264" stroke={N} strokeWidth={11} fill="none" strokeLinecap="round" />
    <path d="M-18 -264 C -20 -228, -10 -214, 0 -214 C 10 -214, 20 -228, 18 -264" stroke={HIERRO_OSC} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[-18, 18].map((x) => <path key={x} d={`M${x - 8} -260 L ${x} -290 L ${x + 8} -260 Z`} fill={HIERRO} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />)}
    <rect x={-9} y={-216} width={18} height={10} rx={2} fill={ROJO_OSC} stroke={N} strokeWidth={2} />
  </g>
);
/** Lanza de punta de bronce. */
const Lanza: React.FC<{ y0?: number; y1?: number }> = ({ y0 = 190, y1 = -250 }) => (
  <g>
    <Asta y0={y0} y1={y1} c={MADERA} w={7} />
    <path d={`M0 ${y1 - 52} C 12 ${y1 - 30}, 12 ${y1 - 12}, 5 ${y1} H -5 C -12 ${y1 - 12}, -12 ${y1 - 30}, 0 ${y1 - 52} Z`} fill={BRONCE} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
    <path d={`M0 ${y1 - 44} V ${y1 - 4}`} stroke={BRONCE_OSC} strokeWidth={1.6} />
    <rect x={-6} y={y1 - 2} width={12} height={10} rx={2} fill={BRONCE_OSC} stroke={N} strokeWidth={1.8} />
  </g>
);
/** Lira de caparazón de tortuga con brazos de cuerno (origen = mano, que la toma por la base). */
const Lira: React.FC = () => (
  <g transform="translate(8 -4) rotate(-6) scale(0.85)">
    <path d="M-20 -24 C -40 -60, -36 -96, -22 -112 M20 -24 C 40 -60, 36 -96, 22 -112" stroke={N} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M-20 -24 C -40 -60, -36 -96, -22 -112 M20 -24 C 40 -60, 36 -96, 22 -112" stroke={ORO} strokeWidth={5.5} fill="none" strokeLinecap="round" />
    <path d="M-30 -104 H 30" stroke={N} strokeWidth={8} strokeLinecap="round" /><path d="M-29 -104 H 29" stroke={ORO_OSC} strokeWidth={4} strokeLinecap="round" />
    {[-10, -3.5, 3.5, 10].map((x) => <path key={x} d={`M${x} -102 L ${x * 0.7} -20`} stroke="#FFF6DE" strokeWidth={1.4} />)}
    <ellipse cx={0} cy={-14} rx={26} ry={16} fill={ORO_OSC} stroke={N} strokeWidth={2.4} />
    <path d="M-16 -16 Q 0 -26 16 -16 M-12 -8 Q 0 -14 12 -8" stroke={ORO} strokeWidth={1.8} fill="none" />
  </g>
);
/** Arco recurvo de Artemisa con flecha (origen = mano en el medio). */
const Arco: React.FC<{ c?: string; s?: number }> = ({ c = '#E2D2A8', s = 1 }) => (
  <g transform={`rotate(4) scale(${s})`}>
    <path d="M-6 -96 C 14 -92, 26 -60, 18 -30 C 14 -14, 8 -6, 8 0 C 8 6, 14 14, 18 30 C 26 60, 14 92, -6 96" stroke={N} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M-6 -96 C 14 -92, 26 -60, 18 -30 C 14 -14, 8 -6, 8 0 C 8 6, 14 14, 18 30 C 26 60, 14 92, -6 96" stroke={c} strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <path d="M-6 -96 L -6 96" stroke="#F4EEE2" strokeWidth={1.6} />
  </g>
);
/** Rosa roja con tallo (origen = mano). */
const Rosa: React.FC<{ s?: number; oro?: boolean }> = ({ s = 1, oro }) => (
  <g transform={`scale(${s})`}>
    <path d="M0 6 C 2 -14, -2 -30, 2 -46" stroke={oro ? ORO_OSC : HOJA_OSC} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    <path d="M1 -24 C 10 -30, 18 -28, 20 -22 C 12 -18, 6 -20, 1 -24 Z" fill={oro ? ORO : HOJA} stroke={N} strokeWidth={1.4} />
    <circle cx={2} cy={-54} r={11} fill={oro ? ORO : '#C8323A'} stroke={N} strokeWidth={2} />
    <path d="M-4 -56 Q 2 -64 8 -56 Q 2 -48 -4 -56 M-6 -50 Q 2 -44 10 -50" stroke={oro ? ORO_OSC : '#8E1D26'} strokeWidth={1.6} fill="none" />
  </g>
);
/** Martillo de herrero (cabeza de hierro, mango de madera); cuelga al costado (origen = mano). */
const Martillo: React.FC = () => (
  <g transform="rotate(172)">
    <rect x={-5.5} y={-74} width={11} height={92} rx={4} fill={MADERA} stroke={N} strokeWidth={2.4} />
    <path d="M-30 -96 H 22 Q 34 -94 34 -84 Q 34 -74 22 -72 H -30 Z" fill={HIERRO} stroke={N} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-30 -96 H -18 V -72 H -30 Z" fill={HIERRO_OSC} stroke={N} strokeWidth={2} />
    <path d="M-12 -92 H 22" stroke="#B9C2CA" strokeWidth={2} />
  </g>
);
/** Muleta de madera bajo el brazo de atrás (origen = mano). */
const Muleta: React.FC = () => (
  <g transform="rotate(12)">
    <Asta y0={167} y1={-104} c={MADERA} w={8} />
    <path d="M-20 -110 Q 0 -118 20 -110" stroke={N} strokeWidth={12} fill="none" strokeLinecap="round" /><path d="M-19 -110 Q 0 -117 19 -110" stroke={CUERO} strokeWidth={7} fill="none" strokeLinecap="round" />
    <rect x={-8} y={-4} width={16} height={9} rx={2} fill={CUERO} stroke={N} strokeWidth={1.8} />
  </g>
);
/** Kántaros: copa de vino de dos asas (origen = mano). */
const Copa: React.FC = () => (
  <g transform="translate(4 -6)">
    <path d="M-24 -46 C -40 -46, -40 -26, -20 -24 M24 -46 C 40 -46, 40 -26, 20 -24" stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M-24 -46 C -40 -46, -40 -26, -20 -24 M24 -46 C 40 -46, 40 -26, 20 -24" stroke={ORO} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    <path d="M-24 -50 H 24 L 18 -22 Q 0 -12 -18 -22 Z" fill={ORO} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
    <ellipse cx={0} cy={-50} rx={24} ry={5} fill="#6E1E3A" stroke={N} strokeWidth={2} />
    <path d="M-4 -16 V -2 M-14 0 H 14" stroke={N} strokeWidth={8} strokeLinecap="round" /><path d="M-4 -16 V -2 M-13 0 H 13" stroke={ORO_OSC} strokeWidth={4} strokeLinecap="round" />
  </g>
);
/** Antorcha encendida (origen = mano). */
const Antorcha: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M-6 30 L -9 -40 H 9 L 6 30 Z" fill={MADERA} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-11 -40 H 11 L 9 -52 H -9 Z" fill={BRONCE} stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <g transform="translate(0 -50) scale(0.62)"><Fuego f={f} viento={-14} /></g>
    </g>
  );
};
/** Hoz de Cronos: hoja curva grande de pedernal/hierro (origen = mano). */
const Hoz: React.FC = () => (
  <g>
    <Asta y0={40} y1={-70} c={MADERA} w={9} />
    <path d="M-2 -66 C 6 -150, 110 -170, 132 -88 C 116 -112, 76 -132, 40 -118 C 18 -110, 8 -90, 6 -62 Z" fill="#C9CDD1" stroke={N} strokeWidth={3.2} strokeLinejoin="round" />
    <path d="M14 -100 C 36 -128, 84 -134, 116 -104" stroke="#F1F3F4" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <rect x={-8} y={-72} width={16} height={12} rx={2} fill={BRONCE} stroke={N} strokeWidth={2} />
  </g>
);

// ---------- ropa (cuerpo) ----------
/** Forma del torso del Personaje (para taparlo con tela). */
const torsoPts = (a: number): P[] => [[-20 * a, -300], [18 * a, -304], [34 * a, -282], [30 * a, -248], [22 * a, -212], [-22 * a, -208], [-30 * a, -250], [-30 * a, -284]];
/** Quitón (túnica de arriba): tapa el torso, escote redondo y pliegues. */
const Quiton: React.FC<{ a: number; c: string; borde?: string; mujer?: boolean }> = ({ a, c, borde = ORO, mujer }) => (
  <g>
    <path d={suave(torsoPts(a), true)} fill={c} stroke={N} strokeWidth={2} />
    {mujer && <Linea pts={[[6 * a, -272], [22 * a, -262], [28 * a, -250]]} w={1.6} />}
    {[[-14, -290, -16, -222], [-2, -294, 0, -220], [10, -290, 12, -222]].map(([x0, y0, x1, y2], i) => <Linea key={i} pts={[[x0 * a, y0], [(x0 + x1) / 2 * a + 2, (y0 + y2) / 2], [x1 * a, y2]]} c="rgba(23,17,14,0.35)" w={1.4} />)}
    <path d={suave([[-12 * a, -301], [6 * a, -290], [24 * a, -300]])} stroke={borde} strokeWidth={4.5} fill="none" strokeLinecap="round" />
  </g>
);
/** Manto (himatión) en diagonal: del hombro de atrás al costado de adelante, dejando el pecho medio desnudo. */
const Himation: React.FC<{ a: number; c: string; borde?: string }> = ({ a, c, borde = ORO }) => (
  <g>
    <Tela pts={[[-30 * a, -288], [-20 * a, -303], [-4 * a, -306], [14 * a, -282], [32 * a, -238], [26 * a, -208], [-23 * a, -207], [-31 * a, -250]]} c={c} t={0.55} />
    <Linea pts={[[-4 * a, -304], [14 * a, -280], [32 * a, -236]]} c={borde} w={4.5} />
    {[[-14, -292, 4, -238], [-22, -276, -6, -220], [-6, -296, 16, -244]].map(([x0, y0, x1, y2], i) => <Linea key={i} pts={[[x0 * a, y0], [(x0 + x1) / 2 * a - 3, (y0 + y2) / 2], [x1 * a, y2]]} c="rgba(23,17,14,0.4)" w={1.5} />)}
  </g>
);
/** Cinturón simple (tapa la banda de la cintura del motor). */
const Cinto: React.FC<{ a: number; c: string; hebilla?: string }> = ({ a, c, hebilla }) => (
  <g>
    <path d={`M${r1(-29 * a)} -222 L ${r1(27 * a)} -224 L ${r1(27 * a)} -211 L ${r1(-29 * a)} -209 Z`} fill={c} stroke={N} strokeWidth={1.8} />
    {hebilla && <circle cx={r1(20 * a)} cy={-217} r={5.5} fill={hebilla} stroke={N} strokeWidth={1.5} />}
  </g>
);
/** Capa/manto que cae por la espalda (detrás del cuerpo). largo: 1 = tobillos, 0.5 = cadera. */
const Manto: React.FC<{ c: string; borde?: string; largo?: number; ancho?: number; forro?: string }> = ({ c, borde = ORO, largo = 1, ancho = 1, forro }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 16 + k) * (2 + k);
  const y = (v: number) => -304 + (v + 304) * largo;
  const pts: P[] = [[-14, -306], [-34 * ancho, -294], [-50 * ancho + o(1), y(-200)], [-66 * ancho + o(3), y(-80)], [-74 * ancho + o(4), y(-12)], [-44 * ancho + o(2), y(-6)], [-20, y(-10)], [-6, y(-150)], [4, -290]];
  return (
    <g>
      <Tela pts={pts} c={c} t={0.5} w={2.5} />
      {forro && <Tela pts={[[-34 * ancho, -294], [-50 * ancho + o(1), y(-200)], [-66 * ancho + o(3), y(-80)], [-74 * ancho + o(4), y(-12)], [-58 * ancho + o(3), y(-40)], [-40 * ancho, y(-160)]]} c={forro} t={0.5} w={1.5} />}
      <path d={suave([[-74 * ancho + o(4), y(-12)], [-44 * ancho + o(2), y(-6)], [-20, y(-10)]])} stroke={borde} strokeWidth={5} fill="none" strokeLinecap="round" />
      {[[-24, -280, -44, y(-30)], [-14, -270, -24, y(-40)]].map(([x0, y0, x1, y2], i) => <Linea key={i} pts={[[x0 * ancho, y0], [(x0 + x1) / 2 * ancho, (y0 + y2) / 2], [x1 * ancho, y2]]} c="rgba(23,17,14,0.35)" w={1.5} />)}
    </g>
  );
};
/** Broche redondo de oro. */
const Broche: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = ORO }) => <g transform={`translate(${x} ${y})`}><circle r={7.5} fill={c} stroke={N} strokeWidth={1.8} /><circle r={2.5} fill={ROJO} /></g>;

// ---------- piezas propias de cada uno ----------
/** Zeus: corona de hojas de oro sobre los rulos. */
const CintaOro: React.FC<{ c?: string }> = ({ c = ORO }) => {
  const d = suave([[-32, -14], [-18, -32], [4, -38], [22, -30]]);
  return <g><path d={d} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d={d} stroke={c} strokeWidth={4.5} fill="none" strokeLinecap="round" /></g>;
};

/** Corona de hojas (laurel, hiedra u oro) alrededor de la cabeza. */
const Corona: React.FC<{ c: string; luz?: string; uvas?: boolean; hojas?: number; ancha?: boolean }> = ({ c, luz, uvas, hojas = 8, ancha }) => {
  const ang = (i: number) => 196 - i * (156 / (hojas - 1)); // de la nuca (atrás) a la frente
  const arco: P[] = Array.from({ length: hojas }, (_, i) => { const t = (ang(i) * Math.PI) / 180; return [-4 + Math.cos(t) * 33, -6 - Math.sin(t) * 33] as P; });
  return (
    <g>
      <path d={suave([[-34, -6], [-24, -30], [0, -40], [22, -32]])} stroke={N} strokeWidth={4} fill="none" strokeLinecap="round" />
      {arco.map(([x, y], i) => {
        return (
          <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(90 - ang(i))})`}>
            {ancha
              ? <path d="M0 0 C -9 -4, -10 -14, -4 -18 L 0 -13 L 4 -18 C 10 -14, 9 -4, 0 0 Z" fill={c} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
              : <ellipse cx={0} cy={-8} rx={4.2} ry={9.5} fill={c} stroke={N} strokeWidth={1.4} />}
            {luz && <path d="M0 -2 V -14" stroke={luz} strokeWidth={1} />}
          </g>
        );
      })}
      {uvas && [[-30, 4], [-24, 10], [-36, 10], [-30, 16], [-24, 22], [-36, 22], [-30, 28]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill="#5B2A6E" stroke={N} strokeWidth={1.4} />)}
      {uvas && [[-29, 6], [-23, 12], [-35, 12]].map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r={1.4} fill="#B98BD0" />)}
    </g>
  );
};

/** Hera: corona alta (polos) de oro. */
const Polos: React.FC = () => (
  <g transform="rotate(-4)">
    <path d="M-28 -24 L -24 -60 Q 0 -66 24 -60 L 26 -26 Q 0 -34 -28 -24 Z" fill={ORO} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
    <path d="M-25 -50 Q 0 -56 25 -50" stroke={ORO_OSC} strokeWidth={2} fill="none" />
    {[-16, -4, 8, 18].map((x) => <path key={x} d={`M${x - 4} -60 L ${x} -72 L ${x + 4} -60`} fill={ORO} stroke={N} strokeWidth={1.8} strokeLinejoin="round" />)}
    {[-14, 0, 14].map((x) => <circle key={x} cx={x} cy={-40} r={3.6} fill={x ? '#1F7A86' : ROJO} stroke={N} strokeWidth={1.3} />)}
  </g>
);
/** Ojo de pluma de pavo real. */
const OjoPavo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <ellipse rx={8} ry={10} fill={ORO} stroke={N} strokeWidth={1.4} />
    <ellipse rx={5.4} ry={7} fill="#1F7A86" />
    <ellipse rx={3} ry={4} cy={1} fill="#1A2E6B" />
  </g>
);
/** Velo largo de Hera que cae de la corona por la espalda, con el borde de plumas de pavo real. */
const VeloPavo: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 2;
  return (
    <g>
      <Tela pts={[[-24, -46], [-4, -54], [-14, -20], [-30, 20], [-40, 60], [-48 + o, 120], [-70 + o, 130], [-62, 70], [-46, 0]]} c="#1E6E78" t={0.6} />
      {[[-56, 118], [-50, 92], [-44, 64], [-38, 38]].map(([x, y], i) => <OjoPavo key={i} x={x + (i === 0 ? o : 0)} y={y} s={0.8} />)}
    </g>
  );
};
/** Hades: corona de hierro oscuro de puntas. */
const CoronaHierro: React.FC = () => (
  <g transform="rotate(-6)">
    <path d="M-28 -24 L -26 -48 L -18 -36 L -10 -56 L -2 -38 L 6 -58 L 13 -38 L 21 -52 L 24 -26 Q 0 -32 -28 -24 Z" fill={HIERRO_OSC} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
    <path d="M-26 -30 Q 0 -36 24 -32" stroke={ROJO} strokeWidth={3} fill="none" />
  </g>
);
/** Casco corintio de bronce con cresta. bajado = cubre la cara salvo el ojo (Ares); si no, echado hacia arriba y
 * atrás sobre la frente, con la cara libre (Atenea). */
const CascoCorintio: React.FC<{ cresta: string; crestaOsc: string; bajado?: boolean }> = ({ cresta, crestaOsc, bajado }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 13) * 1.5;
  return (
    <g transform={bajado ? undefined : 'translate(-6 -48) rotate(-16) scale(0.9)'}>
      <path d={suave([[-50, 10], [-46, -40], [-20, -76], [16, -82], [40, -70], [48, -56 + o], [34, -56], [8, -62], [-18, -56], [-32, -36], [-36, -4]], true, 0.7)} fill={cresta} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      {[[-38, -36, -46, -24], [-30, -54, -40, -50], [-14, -66, -20, -74], [4, -70, 4, -78], [22, -68, 28, -76]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L ${c} ${d}`} stroke={crestaOsc} strokeWidth={1.8} />)}
      <path d="M2 -60 L 0 -40" stroke={N} strokeWidth={4} />
      {bajado
        ? <path fillRule="evenodd" d="M-36 14 C -42 -30, -16 -48, 12 -46 C 34 -44, 46 -28, 44 -4 L 42 14 L 40 30 C 38 40, 30 44, 22 44 L 22 26 C 26 24, 28 18, 26 12 L 14 10 L 8 2 L 8 -2 C 18 -2, 26 -2, 32 -8 C 26 -16, 14 -16, 6 -12 L 0 -4 L -4 40 L -30 42 Z" fill={BRONCE} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
        : <>
            <path d="M-36 14 C -42 -30, -16 -48, 12 -46 C 34 -44, 46 -28, 44 -4 L 42 14 L 40 30 C 38 40, 30 44, 22 44 L 22 26 C 26 24, 28 18, 26 12 L 14 10 L 8 2 L 0 -4 L -4 40 L -30 42 Z" fill={BRONCE} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
            <path d="M8 -2 C 18 -2, 26 -2, 32 -8 C 26 -16, 14 -16, 6 -12 Z" fill="#3A2412" stroke={N} strokeWidth={1.6} />
          </>}
      <path d="M-30 -20 C -14 -36, 14 -40, 38 -26" stroke="#E7C27A" strokeWidth={2.2} fill="none" />
      <path d="M-28 -2 C -14 -10, 0 -12, 4 -10" stroke={BRONCE_OSC} strokeWidth={2} fill="none" />
    </g>
  );
};
/** Égida: capa corta de escamas de oro sobre hombros y pecho, con flecos de serpientes y la cara de la Gorgona. */
const Egida: React.FC<{ a: number }> = ({ a }) => {
  const borde: P[] = Array.from({ length: 6 }, (_, k) => { const t = k / 5; return [(-26 + t * 56) * a, -258 + Math.sin(t * Math.PI) * 12] as P; });
  return (
    <g>
      {borde.map(([x, y], k) => <g key={`s${k}`}><path d={`M${r1(x)} ${r1(y - 4)} q 6 6 1 12 q -5 5 1 10`} stroke={N} strokeWidth={5.5} fill="none" strokeLinecap="round" /><path d={`M${r1(x)} ${r1(y - 4)} q 6 6 1 12 q -5 5 1 10`} stroke="#5E8A4A" strokeWidth={3} fill="none" strokeLinecap="round" /><circle cx={r1(x + 1)} cy={r1(y + 19)} r={3.2} fill="#5E8A4A" stroke={N} strokeWidth={1.3} /></g>)}
      <Tela pts={[[-30 * a, -290], [-20 * a, -305], [18 * a, -307], [36 * a, -286], [32 * a, -254], [10 * a, -244], [-12 * a, -248], [-30 * a, -258]]} c="#D6AE52" t={0.6} />
      {Array.from({ length: 4 }, (_, fila) => Array.from({ length: 6 }, (_, k) => <path key={`${fila}-${k}`} d={`M${r1((-26 + k * 10 + (fila % 2) * 5) * a)} ${-294 + fila * 11} q ${r1(4 * a)} 6 ${r1(8 * a)} 0`} stroke={ORO_OSC} strokeWidth={1.5} fill="none" />))}
      <g transform={`translate(${r1(4 * a)} -258)`}>
        {Array.from({ length: 10 }, (_, k) => { const an = (k / 10) * Math.PI * 2; return <path key={k} d={`M${r1(Math.cos(an) * 11)} ${r1(Math.sin(an) * 11)} q ${r1(Math.cos(an + 0.9) * 6)} ${r1(Math.sin(an + 0.9) * 6)} ${r1(Math.cos(an) * 7)} ${r1(Math.sin(an) * 7)}`} stroke="#3E6A34" strokeWidth={2.6} fill="none" strokeLinecap="round" />; })}
        <circle r={12} fill="#E9C9A6" stroke={N} strokeWidth={2} />
        <circle cx={-4.2} cy={-2.5} r={2} fill={N} /><circle cx={4.2} cy={-2.5} r={2} fill={N} />
        <path d="M-6 5 H 6" stroke={N} strokeWidth={2} strokeLinecap="round" /><path d="M-2 5 Q 0 10 2 5 Z" fill={ROJO} stroke={N} strokeWidth={1} />
      </g>
    </g>
  );
};
/** Lechuza (origen = patas), de frente con la cara redonda. */
const Lechuza: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const f = useCurrentFrame(), cab = Math.sin(f / 20) * 6;
  return (
    <g transform={`scale(${s})`}>
      <path d={suave([[-14, 0], [-16, -20], [-10, -32], [10, -32], [16, -20], [14, 0]], true, 0.8)} fill="#8A6A4A" stroke={N} strokeWidth={2} />
      <path d="M-8 -8 l 3 3 l 3 -3 M2 -8 l 3 3 l 3 -3 M-6 -18 l 3 3 l 3 -3 M4 -18 l 3 3 l 3 -3" stroke="#E9DFC8" strokeWidth={1.3} fill="none" />
      <g transform={`rotate(${r1(cab)} 0 -34)`}>
        <path d="M-15 -30 L -16 -52 L -8 -44 L 8 -44 L 16 -52 L 15 -30 Q 0 -22 -15 -30 Z" fill="#8A6A4A" stroke={N} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={-6.5} cy={-37} r={6} fill="#F4EEE2" stroke={N} strokeWidth={1.4} /><circle cx={6.5} cy={-37} r={6} fill="#F4EEE2" stroke={N} strokeWidth={1.4} />
        <circle cx={-6.5} cy={-37} r={3} fill={ORO} /><circle cx={6.5} cy={-37} r={3} fill={ORO} />
        <circle cx={-6.5} cy={-37} r={1.5} fill={N} /><circle cx={6.5} cy={-37} r={1.5} fill={N} />
        <path d="M-2 -33 L 0 -28 L 2 -33 Z" fill={ORO_OSC} stroke={N} strokeWidth={1} />
      </g>
      <path d="M-6 0 v 4 M6 0 v 4" stroke={ORO_OSC} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
};
/** Artemisa: diadema con media luna de plata. */
const MediaLuna: React.FC = () => (
  <g>
    <path d={suave([[-30, -12], [-16, -30], [6, -36], [22, -30]])} stroke={N} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d={suave([[-30, -12], [-16, -30], [6, -36], [22, -30]])} stroke="#DDE3E8" strokeWidth={3.6} fill="none" strokeLinecap="round" />
    <path d="M2 -52 a 13 13 0 1 0 14 18 a 10 10 0 1 1 -14 -18 Z" fill="#F2F4F6" stroke={N} strokeWidth={2} strokeLinejoin="round" transform="translate(-4 2)" />
  </g>
);
/** Pelo recogido de Artemisa: liso con rodete en la nuca. */
const PeloRecogido: React.FC<{ c: string; luz: string }> = ({ c, luz }) => (
  <g>
    <Tela pts={[[24, -27], [14, -38], [-2, -42], [-20, -38], [-32, -26], [-36, -8], [-32, 10], [-22, 18], [-14, 8], [-8, -2], [-2, -12], [8, -21], [17, -24]]} c={c} t={0.8} />
    <circle cx={-38} cy={-14} r={12} fill={c} stroke={N} strokeWidth={2} />
    <path d="M-44 -18 q 6 -6 12 0 M-46 -10 q 8 -6 14 2" stroke={luz} strokeWidth={1.4} fill="none" />
    {[[16, -30, -26, -20], [10, -26, -28, -6], [2, -20, -24, 8]].map(([x0, y0, x1, y1], i) => <path key={i} d={`M${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 10 + i * 3} ${x1} ${y1}`} stroke={luz} strokeWidth={1.4} fill="none" strokeLinecap="round" />)}
    {/* coleta que cae del rodete */}
    <path d={suave([[-44, -6], [-50, 20], [-46, 44], [-38, 56]])} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d={suave([[-44, -6], [-50, 20], [-46, 44], [-38, 56]])} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round" />
  </g>
);
/** Pelo largo liso y ondulado de mujer (cae por la espalda hasta media espalda). */
const PeloLargo: React.FC<{ c: string; luz: string; largo?: number }> = ({ c, luz, largo = 96 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 17) * 2;
  return (
    <g>
      <Tela pts={[[24, -27], [14, -38], [-2, -43], [-20, -39], [-34, -26], [-40, -6], [-42, 26], [-46 + o, largo * 0.65], [-40 + o, largo], [-30 + o, largo - 8], [-24, largo + 2], [-16, largo * 0.7], [-14, 30], [-10, 6], [-3, -11], [8, -21], [17, -24]]} c={c} t={0.75} />
      {[[16, -32, -30, -14, -36, 60], [6, -28, -24, 8, -26, 80], [-6, -22, -18, 20, -20, 70]].map(([a, b, c2, d, e, g], i) => <path key={i} d={`M${a} ${b} Q ${c2} ${d} ${e} ${g}`} stroke={luz} strokeWidth={1.6} fill="none" strokeLinecap="round" />)}
    </g>
  );
};
/** Correas de sandalia en el tobillo (origen = tobillo). */
const Sandalia: React.FC<{ c?: string }> = ({ c = CUERO }) => <path d="M-10 -10 L 12 -4 M-10 -2 L 12 4 M-9 -18 L 11 -12" stroke={c} strokeWidth={3} strokeLinecap="round" />;
/** Coraza de bronce con músculos marcados y faldellín de tiras (pteruges). */
const Coraza: React.FC<{ a: number; c?: string; osc?: string; luz?: string }> = ({ a, c = BRONCE, osc = BRONCE_OSC, luz = '#E7C27A' }) => (
  <g>
    {Array.from({ length: 7 }, (_, k) => { const x = (-26 + k * 8.4) * a; return <rect key={k} x={r1(x)} y={-214} width={r1(7.4 * a)} height={34} rx={2} fill={k % 2 ? ROJO_OSC : CUERO} stroke={N} strokeWidth={1.6} />; })}
    <path d={suave(torsoPts(a), true)} fill={c} stroke={N} strokeWidth={2.4} />
    <path d={suave([[10 * a, -292], [30 * a, -276], [26 * a, -256], [12 * a, -260]])} stroke={osc} strokeWidth={2.2} fill="none" />
    <path d={suave([[14 * a, -246], [24 * a, -236], [20 * a, -220]])} stroke={osc} strokeWidth={2} fill="none" />
    <path d={suave([[-24 * a, -296], [-4 * a, -304], [16 * a, -300]])} stroke={luz} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <path d={`M${r1(-29 * a)} -220 L ${r1(27 * a)} -222`} stroke={N} strokeWidth={6} strokeLinecap="round" /><path d={`M${r1(-28 * a)} -220 L ${r1(26 * a)} -222`} stroke={osc} strokeWidth={3} strokeLinecap="round" />
  </g>
);
/** Escudo redondo (hoplon) visto de costado, colgado del brazo de atrás (origen = mano de atrás). */
const Hoplon: React.FC<{ borde?: string; campo?: string }> = ({ borde = BRONCE, campo = ROJO }) => (
  <g transform="translate(34 -36)">
    <ellipse rx={36} ry={70} fill={borde} stroke={N} strokeWidth={3} />
    <ellipse rx={28} ry={60} fill={campo} stroke={N} strokeWidth={2} />
    <ellipse rx={28} ry={60} fill="none" stroke={BRONCE_OSC} strokeWidth={2} strokeDasharray="2 7" />
    <ellipse rx={13} ry={26} fill={BRONCE} stroke={N} strokeWidth={2} />
    <ellipse rx={6} ry={12} fill={BRONCE_OSC} stroke={N} strokeWidth={1.4} />
    <path d="M-20 -40 C -12 -52, 6 -54, 14 -46" stroke="#E7C27A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
);
/** Hefesto: gorro de artesano (pilos), de fieltro. */
const Pilos: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M-30 -14 C -34 -48, -14 -66, 4 -66 C 20 -64, 28 -46, 26 -20 Q 0 -28 -30 -14 Z" fill="#8C7A62" stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M-31 -16 Q 0 -30 27 -22" stroke="#5E4E3A" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-14 -54 C -4 -60, 10 -58, 16 -48" stroke="#B3A288" strokeWidth={1.8} fill="none" />
  </g>
);
/** Delantal de cuero de herrero (sobre la exomis), con cinturón. */
const Delantal: React.FC<{ a: number }> = ({ a }) => (
  <g>
    <Tela pts={[[2 * a, -270], [30 * a, -272], [36 * a, -232], [40 * a, -176], [44 * a, -146], [14 * a, -140], [6 * a, -180], [4 * a, -232]]} c={CUERO} t={0.5} />
    <path d={`M${r1(4 * a)} -270 L ${r1(-10 * a)} -300 M${r1(28 * a)} -272 L ${r1(16 * a)} -300`} stroke={CUERO} strokeWidth={3} />
    {[[18, -260, 22, -160], [30, -250, 36, -158]].map(([x0, y0, x1, y1], i) => <Linea key={i} pts={[[x0 * a, y0], [x1 * a, y1]]} c="#4A2E18" w={1.4} />)}
    <path d="M24 -200 l 6 4" stroke="#2A1A0E" strokeWidth={2.4} strokeLinecap="round" />
  </g>
);
/** Exomis: túnica de trabajador prendida en un solo hombro (deja el hombro de adelante y medio pecho desnudos). */
const Exomis: React.FC<{ a: number; c: string }> = ({ a, c }) => (
  <g>
    <Tela pts={[[-30 * a, -286], [-18 * a, -302], [-2 * a, -304], [10 * a, -270], [24 * a, -246], [24 * a, -212], [-22 * a, -208], [-30 * a, -250]]} c={c} t={0.55} />
    <Linea pts={[[-2 * a, -302], [10 * a, -270], [24 * a, -246]]} c="#4E5A66" w={2.4} />
  </g>
);
/** Piel de leopardo (nebris) de Dioniso cruzada sobre el pecho. */
const Nebris: React.FC<{ a: number }> = ({ a }) => (
  <g>
    <Tela pts={[[-28 * a, -290], [-16 * a, -304], [-2 * a, -304], [14 * a, -276], [30 * a, -240], [22 * a, -226], [2 * a, -250], [-20 * a, -268]]} c="#D9A54E" t={0.6} />
    {[[-14, -290], [-2, -286], [6, -272], [-10, -276], [14, -258], [22, -244], [2, -262]].map(([x, y], i) => <circle key={i} cx={r1(x * a)} cy={y} r={2.6} fill="#4A2E18" />)}
  </g>
);
/** Afrodita: corona de rosas y una concha de vieira en el pelo. */
const CoronaRosas: React.FC = () => (
  <g>
    <path d={suave([[-30, -14], [-16, -32], [6, -38], [22, -30]])} stroke={HOJA_OSC} strokeWidth={4} fill="none" strokeLinecap="round" />
    {[[-28, -16], [-18, -30], [-4, -37], [10, -36]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <ellipse cx={-6} cy={4} rx={5} ry={2.6} fill={HOJA} stroke={N} strokeWidth={1} transform="rotate(-30 -6 4)" />
        <circle r={6.5} fill={i % 2 ? '#E06A7E' : '#C8323A'} stroke={N} strokeWidth={1.5} />
        <path d="M-3 -1 Q 0 -5 3 -1 Q 0 3 -3 -1" stroke={i % 2 ? '#A83A50' : '#8E1D26'} strokeWidth={1.2} fill="none" />
      </g>
    ))}
  </g>
);
/** Concha de vieira (abanico con rayas). */
const Concha: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 10 L -16 -6 C -14 -18, 14 -18, 16 -6 Z" fill="#F6E1D3" stroke={N} strokeWidth={1.8} strokeLinejoin="round" />
    {[-10, -5, 0, 5, 10].map((xx) => <path key={xx} d={`M0 8 L ${xx} -13`} stroke="#D9A08E" strokeWidth={1.3} />)}
    <path d="M-5 10 H 5 L 3 14 H -3 Z" fill="#F6E1D3" stroke={N} strokeWidth={1.4} />
  </g>
);
/** Collar de perlas. */
const Perlas: React.FC<{ a: number }> = ({ a }) => <g>{Array.from({ length: 7 }, (_, i) => { const t = i / 6; return <circle key={i} cx={r1((-10 + t * 34) * a)} cy={r1(-300 + Math.sin(t * Math.PI) * 12)} r={2.8} fill="#FBF6EE" stroke={N} strokeWidth={1} />; })}</g>;
/** Carcaj con flechas a la espalda (detrás del cuerpo). */
const Carcaj: React.FC = () => (
  <g transform="translate(-30 -268) rotate(-24)">
    {[-6, 0, 6].map((x) => <g key={x}><path d={`M${x} -40 V -10`} stroke={MADERA} strokeWidth={2.6} /><path d={`M${x - 4} -40 L ${x} -50 L ${x + 4} -40 Z`} fill={BLANCO} stroke={N} strokeWidth={1.2} /></g>)}
    <rect x={-11} y={-14} width={22} height={84} rx={6} fill={CUERO} stroke={N} strokeWidth={2.2} />
    <path d="M-11 -2 H 11 M-11 56 H 11" stroke={ORO} strokeWidth={3} />
  </g>
);

// ---------- Hermes (versión épica, 2026-10-15): celeste y oro ----------
const CELESTE = '#6FA8DC', CELESTE_OSC = '#3F6E9E', ORO_CLARO_H = '#FFE38A', PELO_HERMES = '#2A1C14', PELO_HERMES_L = '#6A4A34';
/** Ala de plumas en capas (primarias largas, secundarias y cobertoras) con raíz de oro; crece hacia atrás y arriba
 * (origen = raíz). abre = cuánto se abre el abanico (aleteo). */
const AlaPlumas: React.FC<{ s?: number; abre?: number; tono?: string }> = ({ s = 1, abre = 0, tono = BLANCO }) => {
  const pluma = (a: number, L: number, w: number, c: string, k: string, raquis = true) => {
    const r = (a * Math.PI) / 180, cx = (Math.cos(r) * L) / 2, cy = (Math.sin(r) * L) / 2;
    return (
      <g key={k}>
        <ellipse cx={r1(cx)} cy={r1(cy)} rx={r1(L / 2)} ry={w} transform={`rotate(${r1(a)} ${r1(cx)} ${r1(cy)})`} fill={c} stroke={N} strokeWidth={1.6} />
        {raquis && <path d={`M${r1(cx * 0.4)} ${r1(cy * 0.4)} L ${r1(cx * 1.75)} ${r1(cy * 1.75)}`} stroke="#BDB4A2" strokeWidth={1.1} />}
      </g>
    );
  };
  return (
    <g transform={`scale(${s})`}>
      {[46, 56, 62, 56, 44].map((L, i) => pluma(212 + (i - 2) * (10 + abre), L, 6.2, tono, `p${i}`))}
      {[34, 38, 36, 30].map((L, i) => pluma(210 + (i - 1.5) * (10 + abre * 0.7), L, 5.8, tono, `s${i}`))}
      {[19, 22, 19].map((L, i) => pluma(212 + (i - 1) * 13, L, 5.2, '#F3E3B8', `c${i}`, false))}
      <ellipse cx={-3} cy={-3} rx={8} ry={6} transform="rotate(-38 -3 -3)" fill={ORO} stroke={N} strokeWidth={1.8} />
      <path d="M-8 1 L 2 -8" stroke={ORO_OSC} strokeWidth={1.4} />
    </g>
  );
};
/** Pétaso de Hermes: copa y ala celestes con ribete y banda de oro, y dos alas de plumas. */
const PetasoEpico: React.FC = () => {
  const f = useCurrentFrame(), a = Math.sin(f / 6) * 2.5;
  return (
    <g transform="rotate(-6)">
      <g transform="translate(2 -46) rotate(2) scale(0.9)"><AlaPlumas tono="#DCD5C6" abre={a} /></g>
      <path d="M-26 -26 C -26 -54, 22 -56, 22 -26 Z" fill={CELESTE_OSC} stroke={N} strokeWidth={2.4} />
      <path d="M-14 -48 C -4 -52, 8 -50, 14 -44" stroke="#8FBCE4" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M-50 -22 C -34 -32, 36 -34, 52 -22 C 56 -16, 48 -12, 40 -16 C 20 -24, -20 -24, -42 -14 C -52 -10, -56 -16, -50 -22 Z" fill={CELESTE} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-47 -19 C -30 -27.5, 32 -29.5, 49 -19.5" stroke={ORO} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <path d="M-25 -30 C -8 -35, 8 -35, 22 -30" stroke={N} strokeWidth={7} fill="none" /><path d="M-25 -30 C -8 -35, 8 -35, 22 -30" stroke={ORO} strokeWidth={4} fill="none" />
      <g transform="translate(-12 -38) rotate(-8) scale(1.05)"><AlaPlumas abre={a} /></g>
    </g>
  );
};
/** Talaria: correas de oro en el tobillo, ala de plumas en el talón y un brillo dorado (origen = tobillo). */
const Talaria: React.FC<{ fase?: number }> = ({ fase = 0 }) => {
  const f = useCurrentFrame(), a = Math.sin(f / 4 + fase) * 4;
  return (
    <g>
      <circle cx={-10} cy={-16} r={34} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.55 + Math.sin(f / 5 + fase) * 0.2} />
      <g transform="translate(-6 -12) rotate(10)"><AlaPlumas s={0.8} abre={a} /></g>
      <path d="M-10 -12 L 12 -6 M-10 -3 L 12 3 M-9 -21 L 10 -15" stroke={N} strokeWidth={5.4} strokeLinecap="round" />
      <path d="M-10 -12 L 12 -6 M-10 -3 L 12 3 M-9 -21 L 10 -15" stroke={ORO} strokeWidth={3} strokeLinecap="round" />
      <circle cx={-8} cy={-8} r={3} fill={ORO_CLARO_H} stroke={N} strokeWidth={1.2} />
    </g>
  );
};
/** Caduceo: vara de oro, dos serpientes que se enroscan parejas (una adelante y otra atrás en cada vuelta),
 * cabezas enfrentadas arriba y alas de plumas en la punta (origen = mano). */
const CaduceoEpico: React.FC = () => {
  const f = useCurrentFrame(), a = Math.sin(f / 7) * 2;
  const VUELTAS = 4, A = 15, Y0 = -16, LARGO = 116;
  const tramo = (k: number, j: number): P[] => Array.from({ length: 9 }, (_, i) => { const t = (j + i / 8) / VUELTAS; return [k * A * Math.sin(Math.PI * VUELTAS * t) * Math.min(1, t * 5 + 0.25), Y0 - LARGO * t] as P; });
  const COL = { [-1]: '#3F7A34', [1]: '#6FA84A' } as Record<number, string>;
  const serp = (k: number, j: number) => { const d = suave(tramo(k, j)); return <g key={`${k}${j}`}><path d={d} stroke={N} strokeWidth={8.4} fill="none" strokeLinecap="round" /><path d={d} stroke={COL[k]} strokeWidth={4.8} fill="none" strokeLinecap="round" /></g>; };
  const adelante = (k: number, j: number) => (j % 2 === 0) === (k > 0);
  const tramos = [-1, 1].flatMap((k) => Array.from({ length: VUELTAS }, (_, j) => [k, j] as [number, number]));
  return (
    <g>
      {tramos.filter(([k, j]) => !adelante(k, j)).map(([k, j]) => serp(k, j))}
      <Asta y0={74} y1={-170} c={ORO} w={6} />
      <circle cx={0} cy={76} r={5.5} fill={ORO} stroke={N} strokeWidth={1.8} />
      {tramos.filter(([k, j]) => adelante(k, j)).map(([k, j]) => serp(k, j))}
      {[-1, 1].map((k) => {
        const d = suave([[0, Y0 - LARGO], [k * 12, Y0 - LARGO - 8], [k * 15, Y0 - LARGO - 20]]);
        return (
          <g key={`c${k}`}>
            <path d={d} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d={d} stroke={COL[k]} strokeWidth={4.6} fill="none" strokeLinecap="round" />
            <ellipse cx={k * 9} cy={Y0 - LARGO - 24} rx={7} ry={4.6} transform={`rotate(${k * 18} ${k * 9} ${Y0 - LARGO - 24})`} fill={COL[k]} stroke={N} strokeWidth={1.6} />
            <circle cx={k * 7} cy={Y0 - LARGO - 26} r={1.4} fill={N} />
          </g>
        );
      })}
      <g transform={`translate(-3 ${Y0 - LARGO - 40})`}><AlaPlumas s={0.7} abre={a} /></g>
      <g transform={`translate(3 ${Y0 - LARGO - 40}) scale(-1 1)`}><AlaPlumas s={0.7} abre={a} /></g>
      <circle cx={0} cy={Y0 - LARGO - 42} r={7} fill={ORO} stroke={N} strokeWidth={2} />
      <circle cx={-2} cy={Y0 - LARGO - 44} r={2.2} fill={ORO_CLARO_H} />
    </g>
  );
};
/** Clámide al viento: capa corta prendida en el hombro que flamea hacia atrás, con ribete de oro. */
const ClamideViento: React.FC<{ c: string; forro: string }> = ({ c, forro }) => {
  const f = useCurrentFrame(), o = (k: number) => Math.sin(f / 7 + k * 0.9) * (2 + k * 1.6);
  const hem: P[] = [[-150, -292 + o(4)], [-138, -272 + o(4)], [-118, -268 + o(3)], [-108, -250 + o(3)], [-86, -246 + o(2)], [-74, -228 + o(2)], [-52, -226 + o(1)], [-36, -206]];
  const pts: P[] = [[-6, -310], [-40, -322 + o(1)], [-82, -318 + o(2)], [-120, -306 + o(3)], ...hem, [-18, -232], [-4, -270], [8, -296]];
  return (
    <g>
      <Tela pts={pts} c={c} t={0.5} w={2.6} />
      <Tela pts={[[-40, -318 + o(1)], [-82, -314 + o(2)], [-120, -302 + o(3)], [-146, -290 + o(4)], [-118, -290 + o(3)], [-80, -300 + o(2)], [-44, -306]]} c={forro} t={0.5} w={1.4} />
      <path d={suave(hem)} stroke={N} strokeWidth={7.5} fill="none" strokeLinecap="round" /><path d={suave(hem)} stroke={ORO} strokeWidth={4.4} fill="none" strokeLinecap="round" />
      {[[-20, -300, -96, -270 + o(2)], [-24, -280, -70, -246 + o(1)], [-50, -312, -128, -284 + o(3)]].map(([x0, y0, x1, y1], i) => <Linea key={i} pts={[[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 - 6], [x1, y1]]} c="rgba(23,17,14,0.35)" w={1.6} />)}
    </g>
  );
};
/** Morral de mensajero: bolsa de cuero en la cadera de atrás con correa cruzada al hombro de adelante. */
const Morral: React.FC = () => (
  <g>
    <path d="M18 -300 L -24 -216" stroke={N} strokeWidth={7} strokeLinecap="round" /><path d="M18 -300 L -24 -216" stroke={CUERO} strokeWidth={4} strokeLinecap="round" />
    <path d={suave([[-44, -224], [-14, -226], [-12, -200], [-16, -186], [-42, -186], [-46, -200]], true, 0.5)} fill="#8A5A32" stroke={N} strokeWidth={2.2} />
    <path d={suave([[-46, -226], [-12, -228], [-14, -206], [-30, -202], [-44, -206]], true, 0.5)} fill={CUERO} stroke={N} strokeWidth={2} />
    <circle cx={-29} cy={-206} r={3.4} fill={ORO} stroke={N} strokeWidth={1.3} />
    <path d="M-40 -194 H -18" stroke="#5A3A20" strokeWidth={1.4} strokeDasharray="2 3" />
  </g>
);
/** Oreja chica en C (la del muñeco) por encima de los rulos. */
const Oreja: React.FC<{ piel: string }> = ({ piel }) => (
  <g><path d="M-3 -9 C -13 -11, -16 6, -6 9 C -2 8, -1 -6, -3 -9 Z" fill={piel} stroke={N} strokeWidth={1.6} strokeLinejoin="round" /><path d="M-5 -4 C -10 -4, -11 3, -6 4" stroke={N} strokeWidth={1.1} fill="none" opacity={0.55} /></g>
);
const ADORNOS_HERMES: PersonajeProps['adornos'] = {
  detras: <ClamideViento c="#C9502E" forro="#8E3420" />,
  cuerpo: <><Quiton a={1} c={CELESTE} borde={ORO} /><Cinto a={1} c={CUERO} hebilla={ORO} /><Morral /><Broche x={-6} y={-300} /></>,
  cabeza: <><PeloRulos c={PELO_HERMES} luz={PELO_HERMES_L} r={6} /><Oreja piel={PIEL_H} /><PetasoEpico /></>,
  mano: <CaduceoEpico />,
  pie: <Talaria />,
  pieAtras: <Talaria fase={2} />,
};

// ---------- segunda tanda (2026-10-15): familia de Zeus, titanes, héroes y monstruos ----------
const estrellaD = (r: number) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${r1(Math.cos(a) * rr)} ${r1(Math.sin(a) * rr)}`; }).join(' ') + 'Z';
const Estrella: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 4.5, c = ORO }) => <path transform={`translate(${x} ${y})`} d={estrellaD(r)} fill={c} stroke={N} strokeWidth={0.9} strokeLinejoin="round" />;
/** Velo que cae de la coronilla por la espalda (tapa la nuca). */
const Velo: React.FC<{ c: string; borde?: string; largo?: number }> = ({ c, borde, largo = 110 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 18) * 2;
  return (
    <g>
      <Tela pts={[[-30, -22], [-14, -40], [8, -43], [21, -34], [6, -30], [-12, -22], [-22, 6], [-28, 44], [-34 + o, largo], [-60 + o, largo + 6], [-56, 50], [-46, 0]]} c={c} t={0.6} />
      {borde && <path d={suave([[-34 + o, largo], [-60 + o, largo + 6]])} stroke={borde} strokeWidth={4} fill="none" strokeLinecap="round" />}
      <path d={suave([[-24, -10], [-36, 40], [-46 + o, largo - 6]])} stroke="rgba(23,17,14,0.3)" strokeWidth={1.5} fill="none" />
    </g>
  );
};
/** Corona chica de flores (color, centro). */
const CoronaFlores: React.FC<{ colores: string[]; centro?: string; petalos?: number }> = ({ colores, centro = ORO, petalos = 5 }) => (
  <g>
    <path d={suave([[-30, -14], [-16, -32], [6, -38], [22, -30]])} stroke={HOJA_OSC} strokeWidth={4} fill="none" strokeLinecap="round" />
    {[[-29, -16], [-20, -28], [-8, -35], [5, -37], [17, -32]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        {Array.from({ length: petalos }, (_, k) => <ellipse key={k} cx={0} cy={-4} rx={2.6} ry={4} transform={`rotate(${(k * 360) / petalos})`} fill={colores[i % colores.length]} stroke={N} strokeWidth={0.9} />)}
        <circle r={2.2} fill={centro} stroke={N} strokeWidth={0.8} />
      </g>
    ))}
  </g>
);
/** Pelo calvo arriba con flequillo de rulos alrededor de la nuca. */
const PeloCalvo: React.FC<{ c: string; luz: string }> = ({ c, luz }) => (
  <Rizado pts={[[-10, -32], [-24, -26], [-32, -10], [-32, 10], [-26, 24], [-18, 26], [-15, 10], [-13, -8], [-8, -22]]} r={6} c={c} luz={luz} desde={0} hasta={5} />
);

// props de mano (origen = mano)
/** Piedra envuelta en pañales (la que Rea le dio a Cronos). */
const PiedraEnvuelta: React.FC = () => (
  <g transform="translate(6 -20) rotate(-14)">
    <circle cx={0} cy={-26} r={12} fill="#8C8C86" stroke={N} strokeWidth={2} />
    <path d="M-5 -30 q 4 -4 9 -1" stroke="#B5B5AE" strokeWidth={1.6} fill="none" />
    <path d={suave([[-17, -22], [0, -18], [17, -22], [19, 6], [10, 26], [-10, 26], [-19, 6]], true, 0.8)} fill={BLANCO} stroke={N} strokeWidth={2.2} />
    <path d="M-17 -6 L 17 8 M-15 12 L 15 -2" stroke="#C9BFA8" strokeWidth={2} />
  </g>
);
/** Cuenco con el fuego del hogar (Hestia). */
const CuencoFuego: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(6 -14)">
      <g transform="translate(0 -6) scale(0.32)"><Fuego f={f} viento={-10} /></g>
      <path d="M-22 -8 H 22 C 20 8, 10 14, 0 14 C -10 14, -20 8, -22 -8 Z" fill={BRONCE} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-18 -2 H 18" stroke={BRONCE_OSC} strokeWidth={1.6} />
    </g>
  );
};
/** Gavilla de trigo atada con cinta (Deméter). */
const Gavilla: React.FC = () => (
  <g transform="rotate(-6)">
    {[-12, -6, 0, 6, 12].map((x, i) => <path key={i} d={`M${x * 0.3} 34 Q ${x * 0.5} -20 ${x} -70`} stroke={N} strokeWidth={4.4} fill="none" strokeLinecap="round" />)}
    {[-12, -6, 0, 6, 12].map((x, i) => <path key={`c${i}`} d={`M${x * 0.3} 34 Q ${x * 0.5} -20 ${x} -70`} stroke="#C9A24A" strokeWidth={2.2} fill="none" strokeLinecap="round" />)}
    {[-12, -6, 0, 6, 12].map((x, i) => <g key={`e${i}`} transform={`translate(${x} -78) rotate(${x * 1.5})`}>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={k % 2 ? 2.4 : -2.4} cy={-k * 5} rx={2.6} ry={4.4} fill={ORO} stroke={N} strokeWidth={1} />)}</g>)}
    <rect x={-9} y={-8} width={18} height={9} rx={2} fill={ROJO} stroke={N} strokeWidth={1.6} />
  </g>
);
/** Granada (Perséfone). */
const Granada: React.FC = () => (
  <g transform="translate(4 -16)">
    <circle r={13} fill="#B3262E" stroke={N} strokeWidth={2.2} />
    <path d="M-5 -12 L -4 -19 L 0 -15 L 4 -19 L 5 -12" fill="#B3262E" stroke={N} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M-7 -5 q 3 -4 7 -3" stroke="#E86A6A" strokeWidth={2} fill="none" strokeLinecap="round" />
  </g>
);
/** Clava de madera nudosa (Heracles), apoyada hacia arriba. */
const Clava: React.FC = () => (
  <g transform="rotate(10)">
    <path d={suave([[-5, 30], [5, 30], [8, -30], [14, -80], [12, -112], [-12, -112], [-14, -80], [-8, -30]], true, 0.6)} fill={MADERA} stroke={N} strokeWidth={2.6} />
    {[[-10, -94], [9, -76], [-9, -60], [7, -44]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4.5} ry={3.4} fill="#5A3A20" stroke={N} strokeWidth={1.4} />)}
    <path d="M0 -104 Q 4 -60 1 10" stroke="#9A7048" strokeWidth={1.8} fill="none" />
  </g>
);
/** Piel del león de Nemea como capucha: cabeza de león sobre la cabeza (de perfil), melena atrás. */
const CapuchaLeon: React.FC = () => (
  <g>
    <Rizado pts={[[-6, -46], [-24, -40], [-36, -22], [-40, 2], [-38, 26], [-30, 38], [-20, 30], [-18, 6], [-14, -16], [-4, -30]]} r={7.5} c="#8A5A22" luz="#B9823C" desde={0} hasta={6} />
    <path d={suave([[-26, -24], [-14, -48], [12, -54], [32, -44], [44, -34], [48, -22], [42, -14], [26, -18], [8, -22], [-12, -14], [-24, -8]], true, 0.75)} fill="#C8913E" stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    {[30, 38].map((x) => <path key={x} d={`M${x} -17 l 2.5 7 l 2.5 -7`} fill={BLANCO} stroke={N} strokeWidth={1} strokeLinejoin="round" />)}
    <path d="M42 -36 L 49 -32 L 44 -27 Z" fill="#3A2416" stroke={N} strokeWidth={1.2} strokeLinejoin="round" />
    <path d="M44 -26 Q 40 -22 34 -24" stroke="#8A5A22" strokeWidth={1.6} fill="none" />
    <path d="M16 -42 Q 22 -47 28 -42 Q 22 -38 16 -42 Z" fill={N} />
    <ellipse cx={-6} cy={-50} rx={7} ry={6} fill="#C8913E" stroke={N} strokeWidth={2} />
  </g>
);
/** Piel del león cayendo por la espalda, con una garra. */
const PielLeonEspalda: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 16) * 2;
  return (
    <g>
      <Tela pts={[[-12, -312], [-36, -300], [-48 + o, -220], [-56 + o, -140], [-34, -134], [-20, -170], [-8, -240], [4, -296]]} c="#C8913E" t={0.55} />
      <path d={`M${-56 + o} -140 l -4 8 M${-50 + o} -138 l -1 9 M${-44} -136 l 2 8`} stroke={N} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-30 -290 Q -40 -240 -44 -170" stroke="#A8762E" strokeWidth={1.6} fill="none" />
    </g>
  );
};
/** Patas del león anudadas sobre el pecho. */
const NudoLeon: React.FC<{ a: number }> = ({ a }) => (
  <g>
    <path d={suave([[-24 * a, -300], [0, -292], [16 * a, -284]])} stroke={N} strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d={suave([[-24 * a, -300], [0, -292], [16 * a, -284]])} stroke="#C8913E" strokeWidth={9} fill="none" strokeLinecap="round" />
    <ellipse cx={r1(18 * a)} cy={-282} rx={8} ry={7} fill="#C8913E" stroke={N} strokeWidth={2} />
    <path d={`M${r1(22 * a)} -278 l 3 4 M${r1(18 * a)} -276 l 2 5 M${r1(14 * a)} -276 l 0 5`} stroke={N} strokeWidth={1.6} strokeLinecap="round" />
  </g>
);
/** Ovillo de hilo rojo con la hebra que cuelga (Ariadna, Teseo). */
const Ovillo: React.FC<{ hebra?: number }> = ({ hebra = 150 }) => {
  const f = useCurrentFrame(), o = Math.sin(f / 14) * 4;
  return (
    <g transform="translate(4 -10)">
      <path d={`M0 10 C -10 ${hebra * 0.3}, ${12 + o} ${hebra * 0.6}, ${-6 + o} ${hebra}`} stroke="#C8323A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle r={12} fill="#C8323A" stroke={N} strokeWidth={2} />
      <path d="M-9 -5 Q 0 2 9 -6 M-10 2 Q 0 9 10 1 M-4 -11 Q 4 -2 2 11" stroke="#8E1D26" strokeWidth={1.3} fill="none" />
    </g>
  );
};
/** Espada corta griega (xiphos) en alto. */
const Xiphos: React.FC = () => (
  <g>
    <path d="M-5 -16 C -9 -50, -7 -84, 0 -104 C 7 -84, 9 -50, 5 -16 Z" fill="#D9DEE2" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M0 -20 V -96" stroke="#9AA4AC" strokeWidth={1.4} />
    <rect x={-14} y={-18} width={28} height={6} rx={2} fill={BRONCE} stroke={N} strokeWidth={1.8} />
    <rect x={-3.5} y={-12} width={7} height={22} rx={2} fill={CUERO} stroke={N} strokeWidth={1.6} />
    <circle cy={12} r={4} fill={BRONCE} stroke={N} strokeWidth={1.4} />
  </g>
);
/** Harpe de Perseo: espada con un gancho curvo. */
const Harpe: React.FC = () => (
  <g>
    <path d="M-4 -14 L -4 -84 C -4 -110, 30 -116, 34 -94 C 22 -104, 6 -98, 5 -80 L 4 -14 Z" fill="#D9DEE2" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <rect x={-12} y={-16} width={24} height={6} rx={2} fill={BRONCE} stroke={N} strokeWidth={1.8} />
    <rect x={-3.5} y={-10} width={7} height={22} rx={2} fill={CUERO} stroke={N} strokeWidth={1.6} />
  </g>
);
/** Escudo de bronce pulido como espejo (Perseo), del brazo de atrás. */
const EscudoEspejo: React.FC = () => (
  <g transform="translate(34 -36)">
    <ellipse rx={36} ry={70} fill={BRONCE} stroke={N} strokeWidth={3} />
    <ellipse rx={29} ry={61} fill="#DCE5EA" stroke={N} strokeWidth={2} />
    <path d="M-14 -40 L 8 -52 M-18 -18 L 14 -34 M-6 10 L 12 2" stroke={BLANCO} strokeWidth={4} strokeLinecap="round" />
    <path d="M-20 30 C -10 46, 10 50, 20 36" stroke="#A9B8C2" strokeWidth={2.4} fill="none" />
  </g>
);
/** Escuadra de carpintero (Dédalo, el inventor). */
const Escuadra: React.FC = () => (
  <g transform="translate(2 -6) rotate(-20)">
    <path d="M-4 10 L -4 -70 L 6 -70 L 6 0 L 44 0 L 44 10 Z" fill="#C9A26A" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    {[-60, -48, -36, -24, -12].map((y) => <path key={y} d={`M-4 ${y} h 5`} stroke={N} strokeWidth={1.2} />)}
    {[14, 24, 34].map((x) => <path key={x} d={`M${x} 10 v -5`} stroke={N} strokeWidth={1.2} />)}
  </g>
);
/** Huso de hilar con lana (Aracne). */
const Huso: React.FC = () => {
  const f = useCurrentFrame(), g = (f * 9) % 360;
  return (
    <g transform="translate(4 -4)">
      <path d="M0 -60 C 18 -60, 18 -86, 0 -90 C -18 -86, -16 -60, 0 -60 Z" fill="#F4EEE2" stroke={N} strokeWidth={1.8} />
      <path d="M-6 -80 q 6 -4 12 2 M-7 -70 q 7 -3 13 1" stroke="#CFC6B4" strokeWidth={1.3} fill="none" />
      <path d="M0 -60 L 0 60" stroke="#E9DFC8" strokeWidth={1.4} />
      <path d="M0 50 L 0 104" stroke={N} strokeWidth={5} strokeLinecap="round" /><path d="M0 51 L 0 103" stroke={MADERA} strokeWidth={2.6} strokeLinecap="round" />
      <ellipse cx={0} cy={90} rx={11} ry={4} fill={MADERA} stroke={N} strokeWidth={1.6} transform={`rotate(${Math.sin((g * Math.PI) / 180) * 6} 0 90)`} />
    </g>
  );
};
/** Tinaja (pithos) de Pandora, con la tapa corrida y un humo oscuro que se escapa. */
const Pithos: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 10) * 3;
  return (
    <g transform="translate(14 -2)">
      <path d={`M-6 -66 C -16 -84, ${4 + o} -96, -4 ${-112 + o}`} stroke="#3A2E3A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d={suave([[-14, -56], [14, -56], [28, -32], [26, 6], [12, 26], [-12, 26], [-26, 6], [-28, -32]], true, 0.7)} fill="#C9682F" stroke={N} strokeWidth={2.4} />
      <path d="M-26 -14 H 26 M-25 -4 H 25" stroke={N} strokeWidth={4} />
      {[-18, -6, 6, 18].map((x) => <path key={x} d={`M${x - 4} -24 l 4 -8 l 4 8`} stroke={N} strokeWidth={1.6} fill="none" />)}
      <rect x={-16} y={-62} width={32} height={8} rx={2} fill="#A8552A" stroke={N} strokeWidth={2} />
      <path d="M-10 -68 H 18 L 20 -63 H -8 Z" fill="#A8552A" stroke={N} strokeWidth={1.8} transform="rotate(-14 4 -66)" />
    </g>
  );
};
/** Narciso (flor blanca con corona amarilla). */
const FlorNarciso: React.FC<{ tallo?: number }> = ({ tallo = 46 }) => (
  <g>
    <path d={`M0 6 C 2 ${-tallo * 0.4}, -2 ${-tallo * 0.8}, 2 ${-tallo}`} stroke={HOJA_OSC} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d={`M0 -8 C -8 -24, -10 -34, -6 -40`} stroke={HOJA} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    <g transform={`translate(4 ${-tallo - 6})`}>
      {Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={0} cy={-6} rx={3.6} ry={6.5} transform={`rotate(${k * 60})`} fill={BLANCO} stroke={N} strokeWidth={1.2} />)}
      <circle r={4.4} fill={ORO} stroke={N} strokeWidth={1.3} /><circle r={2} fill="#E07A2A" />
    </g>
  </g>
);
/** Rama con hojas y flores (Gea, la tierra que brota). */
const RamaBrotes: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M0 8 C 2 -30, -4 -60, 6 -96" stroke={MADERA} strokeWidth={4} fill="none" strokeLinecap="round" />
    {[[-1, -30, -1], [2, -50, 1], [0, -70, -1], [4, -86, 1]].map(([x, y, k], i) => <ellipse key={i} cx={x + k * 10} cy={y} rx={9} ry={4.5} transform={`rotate(${k * -30} ${x + k * 10} ${y})`} fill={HOJA} stroke={N} strokeWidth={1.3} />)}
    {[[6, -98], [-8, -66], [12, -44]].map(([x, y], i) => <g key={`f${i}`} transform={`translate(${x} ${y})`}>{Array.from({ length: 5 }, (_, k) => <ellipse key={k} cy={-3.4} rx={2.4} ry={3.6} transform={`rotate(${k * 72})`} fill={i % 2 ? '#F2C94C' : '#E8728A'} stroke={N} strokeWidth={0.8} />)}<circle r={1.8} fill={ORO_OSC} /></g>)}
  </g>
);
/** Cuenco con poción que humea (Metis, la que le dio a Cronos el vomitivo). */
const Pocion: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 9) * 3;
  return (
    <g transform="translate(6 -10)">
      <path d={`M-6 -14 C -12 -28, ${4 + o} -36, -2 -50 M6 -14 C 2 -26, ${14 + o} -34, 8 -46`} stroke="#B9E0B0" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M-22 -10 H 22 C 20 6, 10 12, 0 12 C -10 12, -20 6, -22 -10 Z" fill="#9AA4AC" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
      <ellipse cx={0} cy={-10} rx={22} ry={4.5} fill="#4E9A5A" stroke={N} strokeWidth={1.8} />
    </g>
  );
};
/** Lanza tosca de titán con punta de hierro. */
const LanzaTitan: React.FC = () => (
  <g>
    <Asta y0={236} y1={-250} c="#5A4232" w={9} />
    <path d="M0 -318 L 14 -262 L 6 -250 H -6 L -14 -262 Z" fill={HIERRO_OSC} stroke={N} strokeWidth={2.6} strokeLinejoin="round" />
    <path d="M-10 -246 L 10 -240 M-10 -238 L 10 -232" stroke={CUERO} strokeWidth={3} />
  </g>
);
/** Rayito de juguete del Zeus bebé. */
const RayitoBebe: React.FC = () => <g transform="scale(0.55)"><Rayo /></g>;

// cabezas especiales
/** Cabeza de toro (Minotauro) que tapa toda la cabeza humana. */
const CabezaToro: React.FC = () => (
  <g>
    <path d="M-10 -36 C -26 -66, 2 -86, 26 -78 C 12 -74, 4 -62, 6 -40 Z" fill="#CFC2A4" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d={suave([[-36, 2], [-32, -26], [-12, -42], [14, -42], [32, -30], [48, -14], [62, -2], [66, 14], [60, 30], [42, 34], [24, 32], [10, 44], [-4, 54], [-24, 50], [-36, 28]], true, 0.75)} fill="#5A3A26" stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    <ellipse cx={56} cy={16} rx={13} ry={14} fill="#8A6A50" stroke={N} strokeWidth={2} />
    <ellipse cx={62} cy={10} rx={2.6} ry={3.6} fill={N} />
    <circle cx={62} cy={26} r={6.5} fill="none" stroke={N} strokeWidth={4.6} /><circle cx={62} cy={26} r={6.5} fill="none" stroke={ORO} strokeWidth={2.4} />
    <path d="M10 -18 Q 22 -26 32 -16 Q 22 -10 10 -18 Z" fill={BLANCO} stroke={N} strokeWidth={1.6} />
    <circle cx={24} cy={-17} r={3.4} fill="#7E2219" /><circle cx={24.5} cy={-17} r={1.7} fill={N} />
    <path d="M8 -26 L 34 -22" stroke={N} strokeWidth={3.4} strokeLinecap="round" />
    <path d="M-6 -36 C -16 -64, 14 -84, 40 -72 C 20 -70, 12 -58, 12 -36 Z" fill="#EDE3C8" stroke={N} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M-2 -40 C -6 -54, 4 -66, 18 -68" stroke="#B9AE90" strokeWidth={1.6} fill="none" />
    <ellipse cx={-20} cy={-30} rx={12} ry={6} transform="rotate(20 -20 -30)" fill="#5A3A26" stroke={N} strokeWidth={2} />
    {[[0, -38], [8, -40], [-6, -32]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q 4 -6 8 0`} stroke="#7A5236" strokeWidth={1.8} fill="none" />)}
  </g>
);
/** Pelo de serpientes (Medusa): cada una con su cabeza, que se mueven. */
const PeloSerpientes: React.FC = () => {
  const f = useCurrentFrame();
  const raiz: [number, number, number][] = [[18, -34, -70], [6, -40, -95], [-8, -40, -120], [-20, -34, -140], [-30, -22, -160], [-34, -6, -180], [-32, 10, 160], [-26, 24, 140]];
  return (
    <g>
      <Tela pts={[[22, -31], [10, -40], [-6, -42], [-22, -35], [-32, -20], [-35, 0], [-30, 22], [-20, 26], [-15, 8], [-10, -10], [-2, -20], [12, -28]]} c="#3E6A34" t={0.8} />
      {raiz.map(([x, y, a], i) => {
        const r = (a * Math.PI) / 180, w = Math.sin(f / 6 + i * 1.3) * 7, nx = -Math.sin(r), ny = Math.cos(r);
        const p1: P = [x + Math.cos(r) * 14 + nx * (8 + w), y + Math.sin(r) * 14 + ny * (8 + w)], p2: P = [x + Math.cos(r) * 28 - nx * (6 + w * 0.6), y + Math.sin(r) * 28 - ny * (6 + w * 0.6)];
        const d = suave([[x, y], p1, p2]), col = i % 2 ? '#6FAE4E' : '#4E8A3E';
        return (
          <g key={i}>
            <path d={d} stroke={N} strokeWidth={8} fill="none" strokeLinecap="round" /><path d={d} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" />
            <ellipse cx={r1(p2[0])} cy={r1(p2[1])} rx={6} ry={4.2} transform={`rotate(${r1(a + w)} ${r1(p2[0])} ${r1(p2[1])})`} fill={col} stroke={N} strokeWidth={1.5} />
            <circle cx={r1(p2[0] + Math.cos(r) * 2)} cy={r1(p2[1] + Math.sin(r) * 2 - 1.5)} r={1.2} fill={N} />
          </g>
        );
      })}
    </g>
  );
};
/** Ojo amarillo de pupila rajada con ceño (Medusa, Tifón) encima del ojo del muñeco. */
const OjoFiero: React.FC<{ c?: string }> = ({ c = '#F2D34A' }) => (
  <g>
    <path d="M8 -6 Q 18 -15 28 -6 Q 18 1 8 -6 Z" fill={c} stroke={N} strokeWidth={1.8} />
    <ellipse cx={19} cy={-6} rx={1.6} ry={4.4} fill={N} />
    <path d="M6 -16 L 30 -9" stroke={N} strokeWidth={3.4} strokeLinecap="round" />
  </g>
);
/** Ondas de voz que se repiten (Eco), delante de la boca. */
const Ondas: React.FC = () => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2].map((i) => { const k = ((f / 30 + i / 3) % 1); return <path key={i} d={`M${r1(46 + k * 34)} ${r1(6 - 12 - k * 10)} Q ${r1(54 + k * 40)} 18 ${r1(46 + k * 34)} ${r1(30 + k * 10)}`} stroke={BLANCO} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.9 * (1 - k)} />; })}</g>;
};
/** Pañuelo de tejedora sobre el pelo (Aracne). */
const Panuelo: React.FC<{ c: string }> = ({ c }) => (
  <g>
    <Tela pts={[[24, -30], [10, -42], [-10, -44], [-28, -34], [-36, -14], [-34, 8], [-42, 18], [-30, 20], [-22, 8], [-14, -6], [-2, -18], [14, -26]]} c={c} t={0.7} />
    <path d="M-34 6 L -48 24 M-32 10 L -40 30" stroke={c} strokeWidth={5} strokeLinecap="round" />
    {[[-14, -36], [0, -38], [-26, -24], [-8, -26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#8A3E22" />)}
  </g>
);
/** Gorro de viajero cónico (pilos) de Odiseo. */
const PilosViajero: React.FC = () => (
  <g transform="rotate(-8)">
    <path d="M-28 -18 C -26 -44, -10 -66, 0 -72 C 12 -64, 24 -44, 24 -20 Z" fill="#B98A55" stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M-34 -16 Q 0 -30 30 -18 Q 0 -24 -34 -12 Z" fill="#8A6236" stroke={N} strokeWidth={2} strokeLinejoin="round" />
    <path d="M-8 -56 Q 2 -60 10 -52" stroke="#D9B07A" strokeWidth={1.8} fill="none" />
  </g>
);
/** Corona de oro de puntas con piedras (Midas). */
const CoronaRey: React.FC = () => (
  <g transform="rotate(-5)">
    <path d="M-27 -24 L -26 -54 L -16 -40 L -6 -60 L 4 -40 L 14 -58 L 22 -40 L 26 -26 Q 0 -32 -27 -24 Z" fill={ORO} stroke={N} strokeWidth={2.4} strokeLinejoin="round" />
    {[-14, 0, 14].map((x, i) => <circle key={x} cx={x} cy={-33} r={3.6} fill={i === 1 ? ROJO : '#2E6E9E'} stroke={N} strokeWidth={1.2} />)}
  </g>
);
/** Diadema con estrellas (Maia, una de las Pléyades; Urano, el cielo). */
const DiademaEstrellas: React.FC<{ n?: number; c?: string }> = ({ n = 7, c = '#F2E6B8' }) => (
  <g>
    <path d={suave([[-30, -14], [-16, -32], [6, -38], [22, -30]])} stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d={suave([[-30, -14], [-16, -32], [6, -38], [22, -30]])} stroke="#C9D3E0" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    {Array.from({ length: n }, (_, i) => { const t = i / (n - 1), a = Math.PI * (1.05 - t * 0.78); return <Estrella key={i} x={-4 + Math.cos(a) * 32} y={-6 - Math.sin(a) * 33} r={i === Math.floor(n / 2) ? 6 : 4.5} c={c} />; })}
  </g>
);

// cuerpo y espalda
/** Estrellas sobre la ropa (Urano): en el torso y el ruedo largo. */
const RopaEstrellada: React.FC<{ a: number }> = ({ a }) => (
  <g>{[[-16, -280], [8, -262], [-4, -236], [-20, -180], [10, -150], [-12, -110], [20, -90], [-26, -60], [4, -40], [28, -26]].map(([x, y], i) => <Estrella key={i} x={x * a} y={y} r={i % 3 ? 4 : 5.5} c="#F2E6B8" />)}</g>
);
/** Vellocino de oro sobre el hombro de atrás, colgando por la espalda. */
const Vellocino: React.FC = () => (
  <g>
    <Rizado pts={[[-6, -312], [-30, -302], [-44, -260], [-46, -214], [-36, -196], [-22, -204], [-14, -250], [2, -292]]} r={7} c={ORO} luz="#FFE9A0" desde={1} hasta={5} />
    <path d="M-40 -200 C -46 -186, -52 -184, -58 -190" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M-40 -200 C -46 -186, -52 -184, -58 -190" stroke={ORO} strokeWidth={3.4} fill="none" strokeLinecap="round" />
  </g>
);
/** Alas de plumas pegadas con cera (Dédalo e Ícaro), detrás de los hombros. */
const AlasCera: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const f = useCurrentFrame(), a = Math.sin(f / 8) * 3;
  return (
    <g transform={`translate(-10 -292) scale(${s})`}>
      <g transform="translate(18 -6) rotate(26) scale(1.9)"><AlaPlumas tono="#D9CFBE" abre={a} /></g>
      <g transform="rotate(14) scale(2.2)"><AlaPlumas tono="#F1E9DA" abre={a} /></g>
      <path d="M-8 -6 C -16 -2, -14 10, -8 14 C -4 18, 2 12, 0 6 Z" fill="#E8C45A" stroke={N} strokeWidth={1.6} />
      {[[-16, -20], [-30, -12], [-24, -32]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q -2 8 0 12 q 2 3 3 0 q 1 -6 -3 -12`} fill="#E8C45A" stroke={N} strokeWidth={1.2} />)}
    </g>
  );
};
/** Mano abierta suelta (para los brazos extra): misma forma que la del muñeco. ang = ángulo del antebrazo. */
const ManoSuelta: React.FC<{ m: P; ang: number; piel: string }> = ({ m, ang, piel }) => (
  <g transform={`translate(${r1(m[0])} ${r1(m[1])}) rotate(${r1(-ang)}) scale(0.9)`}>
    {[[-6.2, -12], [-2.2, -4], [1.8, 4], [5.8, 12]].map(([x, g]) => <rect key={x} x={x - 1.7} y={4} width={3.4} height={12} rx={1.7} fill={piel} stroke={N} strokeWidth={1.4} transform={`rotate(${g} ${x} 6)`} />)}
    <path d="M7 1 L 15 4 C 17 5, 16 8, 14 8 L 7 6 Z" fill={piel} stroke={N} strokeWidth={1.4} strokeLinejoin="round" />
    <rect x={-8.5} y={-3} width={17} height={11} rx={4} fill={piel} stroke={N} strokeWidth={1.8} />
  </g>
);
/** Brazos extra en abanico detrás de los hombros (Hecatónquiro, simplificado). */
const BrazosExtra: React.FC<{ piel: string; angs: number[] }> = ({ piel, angs }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {angs.map((a0, i) => {
        const a = a0 + Math.sin(f / 10 + i) * 6, hh: P = [-6, -290], c = desde(hh, a, 64), m = desde(c, a - 25, 58);
        return <g key={i}><path d={miembro([hh, c, m], [26, 19, 13])} fill={piel} stroke={N} strokeWidth={2} /><ManoSuelta m={m} ang={a - 25} piel={piel} /></g>;
      })}
    </g>
  );
};
/** Cola de serpiente enroscada en el piso detrás (Tifón), con cabeza de víbora. */
const ColaSerpiente: React.FC = () => {
  const f = useCurrentFrame(), o = Math.sin(f / 12) * 6;
  const pts: P[] = [[-10, -60], [-60, -10], [-120, -6], [-160, -40], [-140, -84], [-100, -70], [-110, -40 + o], [-150, -120 + o]];
  const d = suave(pts);
  return (
    <g>
      <path d={d} stroke={N} strokeWidth={34} fill="none" strokeLinecap="round" /><path d={d} stroke="#3E6A3A" strokeWidth={29} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#6FA05A" strokeWidth={8} fill="none" strokeDasharray="6 10" strokeLinecap="round" />
      <g transform={`translate(-152 ${-128 + o}) rotate(-60)`}>
        <ellipse rx={20} ry={13} fill="#3E6A3A" stroke={N} strokeWidth={2.4} />
        <path d="M14 -4 L 34 -10 L 30 0 L 34 8 L 14 6 Z" fill="#B3352A" stroke={N} strokeWidth={1.6} />
        <circle cx={6} cy={-6} r={3.4} fill="#F2D34A" stroke={N} strokeWidth={1} />
      </g>
    </g>
  );
};
/** Tapa el pie con un rollo de serpiente (origen = tobillo). */
const PieSerpiente: React.FC = () => <g><ellipse cx={10} cy={4} rx={32} ry={15} fill="#3E6A3A" stroke={N} strokeWidth={2.4} /><path d="M-12 2 q 8 8 16 0 M6 4 q 8 8 16 0 M24 2 q 6 6 12 0" stroke="#6FA05A" strokeWidth={2} fill="none" /></g>;
/** Escamas sobre la ropa larga (Tifón: de la cintura para abajo es serpiente). */
const Escamas: React.FC = () => <g>{Array.from({ length: 6 }, (_, fila) => Array.from({ length: 3 + Math.floor(fila / 2) }, (_, k) => <path key={`${fila}-${k}`} d={`M${-24 - fila * 3 + k * 16 + (fila % 2) * 8} ${-190 + fila * 30} q 8 11 16 0`} stroke="#6FA05A" strokeWidth={2.2} fill="none" />))}</g>;

// ---------- fichas ----------
const h = (p: Partial<PersonajeProps>, griego: string): Ficha => ({ tipo: 'persona', p: { hd: true, barba: false, peloCorto: true, tocado: null, ...p }, griego });
const m = (p: Partial<PersonajeProps>, griego: string): Ficha => h({ mujer: true, piel: PIEL_M, ...p }, griego);
const A_GIG = 1.35, A_M = 0.92, A_FLACO = 0.8;

// Colores de pelo
const GRIS = '#A7A6A2', GRIS_L = '#D6D3CC', AZUL_P = '#1E2E44', AZUL_PL = '#4A6488', NEGRO_P = '#16120F', NEGRO_PL = '#4A4038';
const RUBIO = '#E2B04A', RUBIO_L = '#F4D88A', CASTANO = '#5A3A22', CASTANO_L = '#8E6440', CAOBA = '#8E3E22', CAOBA_L = '#C0663A', BLANCO_P = '#ECE8E0', BLANCO_PL = '#B9B4AA';

export const ELENCO_GRIEGO_OFICIAL: Record<string, Ficha> = {
  zeus_oficial: h({ s: 1.08, piel: PIEL_H, pelo: GRIS, ropa: 'larga', ropaColor: '#2C4C8C', ribete: ORO, brazo: [40, 80], brazoAtras: [-30, -20],
    adornos: { detras: <Manto c="#2C4C8C" borde={ORO} />, cuerpo: <><Quiton a={1} c={BLANCO} /><Himation a={1} c="#2C4C8C" /><Broche x={-12} y={-298} /></>, cabeza: <><PeloRulos c={GRIS} luz={GRIS_L} /><BarbaRulos c={GRIS} luz={GRIS_L} L={62} /><CintaOro /></>, mano: <Rayo />, manoAtras: <CetroAguila /> } }, 'ΖΕΥΣ'),
  hera_oficial: m({ s: 1.04, pelo: CASTANO, ropa: 'larga', ropaColor: '#5A3478', ribete: ORO, brazo: [26, 50],
    adornos: { detras: <Manto c="#1E6E78" borde={ORO} forro="#2E8A8C" />, cuerpo: <><Quiton a={A_M} c="#5A3478" mujer /><Perlas a={A_M} /></>, cabeza: <><PeloRecogido c={CASTANO} luz={CASTANO_L} /><VeloPavo /><Polos /></>, mano: <g><Asta y0={190} y1={-170} c={ORO} w={6} /><circle cx={0} cy={-178} r={9} fill={ORO} stroke={N} strokeWidth={2} /><OjoPavo x={0} y={-198} s={1.1} /></g> } }, 'ΗΡΑ'),
  poseidon_oficial: h({ s: 1.08, piel: PIEL_SOL, pelo: AZUL_P, ropa: 'larga', ropaColor: '#2E8A7A', ribete: '#D9E8E0', brazo: [30, 60],
    adornos: { cuerpo: <><Himation a={1} c="#2E8A7A" borde="#D9E8E0" /></>, cabeza: <><PeloRulos c={AZUL_P} luz={AZUL_PL} largo r={7} /><BarbaLarga c={AZUL_P} luz={AZUL_PL} L={78} /><path d={suave([[-34, -10], [-18, -30], [4, -38], [22, -30]])} stroke="#2E8A7A" strokeWidth={5} fill="none" strokeLinecap="round" /></>, mano: <Tridente /> } }, 'ΠΟΣΕΙΔΩΝ'),
  hades_oficial: h({ s: 1.08, piel: PIEL_PALIDA, pelo: NEGRO_P, ropa: 'larga', ropaColor: '#2A2230', ribete: ROJO, brazo: [30, 60],
    adornos: { detras: <Manto c="#1A1418" borde={ROJO} forro="#5A1E1A" />, cuerpo: <><Quiton a={1} c="#2A2230" borde={ROJO} /><Cinto a={1} c={ROJO_OSC} /></>, cabeza: <><PeloRulos c={NEGRO_P} luz={NEGRO_PL} largo /><BarbaLarga c={NEGRO_P} luz={NEGRO_PL} L={72} /><CoronaHierro /></>, mano: <Bieldo /> } }, 'ΑΙΔΗΣ'),
  atenea_oficial: m({ s: 1.06, pelo: CASTANO, ropa: 'larga', ropaColor: CREMA, ribete: '#24345A', brazo: [30, 60],
    adornos: { detras: <g transform="translate(-30 -300)"><Lechuza s={1} /></g>, cuerpo: <><Quiton a={A_M} c={CREMA} borde="#24345A" mujer /><Egida a={A_M} /></>, cabeza: <><PeloLargo c={CASTANO} luz={CASTANO_L} largo={40} /><CascoCorintio cresta="#2B3F6E" crestaOsc="#4E6496" /></>, mano: <Lanza y0={236} y1={-250} /> } }, 'ΑΘΗΝΑ'),
  apolo_oficial: h({ piel: PIEL_H, pelo: RUBIO, ropa: 'larga', ropaColor: BLANCO, ribete: ORO, brazo: [18, 44],
    adornos: { detras: <Manto c={ORO} borde={BLANCO} largo={0.95} />, cuerpo: <><Quiton a={1} c={BLANCO} /><Broche x={-12} y={-298} /></>, cabeza: <><PeloRulos c={RUBIO} luz={RUBIO_L} largo r={7} /><Corona c={HOJA} luz={HOJA_OSC} /></>, mano: <Lira /> } }, 'ΑΠΟΛΛΩΝ'),
  artemisa_oficial: m({ pelo: CAOBA, ropa: 'corta', ropaColor: '#4E7A4A', ribete: '#DDE3E8', brazo: [24, 50], botas: CUERO,
    adornos: { detras: <Carcaj />, cuerpo: <><Quiton a={A_M} c="#4E7A4A" borde="#DDE3E8" mujer /><Cinto a={A_M} c={CUERO} /></>, cabeza: <><PeloRecogido c={CAOBA} luz={CAOBA_L} /><MediaLuna /></>, mano: <Arco /> } }, 'ΑΡΤΕΜΙΣ'),
  hermes_oficial: h({ piel: PIEL_H, pelo: PELO_HERMES, ropa: 'corta', ropaColor: CELESTE, ribete: ORO, inclinar: 5, brazo: [60, 50], brazoAtras: [-45, -5], adornos: ADORNOS_HERMES }, 'ΕΡΜΗΣ'),
  afrodita_oficial: m({ pelo: RUBIO, ropa: 'larga', ropaColor: '#E79AA6', ribete: ORO, brazo: [34, 80],
    adornos: { detras: <Manto c="#F2C9CE" borde={ORO} largo={0.9} ancho={0.85} />, cuerpo: <><Quiton a={A_M} c="#E79AA6" mujer /><Perlas a={A_M} /></>, cabeza: <><PeloLargo c={RUBIO} luz={RUBIO_L} largo={104} /><CoronaRosas /><Concha x={-34} y={2} s={0.9} rot={-20} /></>, mano: <Rosa /> } }, 'ΑΦΡΟΔΙΤΗ'),
  ares_oficial: h({ gigante: true, s: 1.04, piel: PIEL_SOL, pelo: NEGRO_P, ropa: 'corta', ropaColor: ROJO, ribete: BRONCE, brazo: [30, 60], brazoAtras: [30, 30], escudo: false, botas: BRONCE,
    adornos: { detras: <Manto c={ROJO} borde={ORO} ancho={1.1} largo={0.9} />, cuerpo: <Coraza a={A_GIG} />, cabeza: <><BarbaRulos c={NEGRO_P} luz={NEGRO_PL} L={44} r={6} /><CascoCorintio cresta={ROJO} crestaOsc={ROJO_OSC} bajado /></>, mano: <Lanza y0={236} y1={-250} />, manoAtras: <Hoplon /> } }, 'ΑΡΗΣ'),
  hefesto_oficial: h({ gigante: true, piel: PIEL_SOL, pelo: CASTANO, ropa: 'corta', ropaColor: '#7D8A96', ribete: '#4E5A66', brazo: [6, 6], brazoAtras: [-8, -40],
    adornos: { cuerpo: <><Exomis a={A_GIG} c="#7D8A96" /><Delantal a={A_GIG} /></>, cabeza: <><PeloRulos c={CASTANO} luz={CASTANO_L} /><BarbaRulos c={CASTANO} luz={CASTANO_L} L={56} /><Pilos /></>, mano: <Martillo />, manoAtras: <Muleta /> } }, 'ΗΦΑΙΣΤΟΣ'),
  dioniso_oficial: h({ piel: PIEL_H, pelo: CASTANO, ropa: 'larga', ropaColor: '#7A2E52', ribete: ORO, brazo: [34, 70],
    adornos: { cuerpo: <><Quiton a={1} c="#7A2E52" /><Nebris a={1} /></>, cabeza: <><PeloRulos c={CASTANO} luz={CASTANO_L} largo r={7} /><Corona c={HOJA} luz={HOJA_OSC} ancha uvas /></>, mano: <Copa /> } }, 'ΔΙΟΝΥΣΟΣ'),
  prometeo_oficial: h({ s: 1.06, piel: PIEL_SOL, pelo: CAOBA, ropa: 'corta', ropaColor: '#3F5B73', ribete: '#C9A24A', brazo: [85, 70],
    adornos: { detras: <Manto c="#6E4526" borde="#C9A24A" largo={0.8} />, cuerpo: <><Quiton a={1} c="#3F5B73" borde="#C9A24A" /><Cinto a={1} c={CUERO} /></>, cabeza: <><PeloRulos c={CAOBA} luz={CAOBA_L} /><BarbaRulos c={CAOBA} luz={CAOBA_L} L={46} r={6.5} /></>, mano: <Antorcha />, pie: <Sandalia /> } }, 'ΠΡΟΜΗΘΕΥΣ'),
  cronos_oficial: h({ gigante: true, cuerpo: 'viejo', s: 1.08, piel: PIEL_H, pelo: BLANCO_P, canas: true, ropa: 'larga', ropaColor: '#5A4A3A', ribete: '#B9A27A', brazo: [40, 60],
    adornos: { detras: <Manto c="#3A3028" borde="#B9A27A" ancho={1.1} />, cuerpo: <><Quiton a={A_GIG} c="#5A4A3A" borde="#B9A27A" /><Cinto a={A_GIG} c="#3A2A1C" /></>, cabeza: <><Tela pts={[[-6, -36], [-24, -30], [-34, -12], [-36, 12], [-30, 30], [-18, 32], [-14, 12], [-10, -6], [-4, -18]]} c={BLANCO_P} /><BarbaLarga c={BLANCO_P} luz={BLANCO_PL} L={118} puntas={4} /><path d="M10 -16 Q 18 -22 28 -15" stroke={BLANCO_P} strokeWidth={5} strokeLinecap="round" fill="none" /></>, mano: <Hoz /> } }, 'ΚΡΟΝΟΣ'),

  // ---- segunda tanda: familia de Zeus y titanes ----
  rea_oficial: m({ s: 1.04, pelo: CASTANO, ropa: 'larga', ropaColor: '#3E4E6E', ribete: ORO, brazo: [30, 64],
    adornos: { cuerpo: <><Quiton a={A_M} c="#3E4E6E" mujer /><Cinto a={A_M} c={ORO_OSC} /></>, cabeza: <><PeloRecogido c={CASTANO} luz={CASTANO_L} /><Velo c="#8E2A2A" borde={ORO} /><CintaOro /></>, mano: <PiedraEnvuelta /> } }, 'ΡΕΑ'),
  hestia_oficial: m({ pelo: NEGRO_P, ropa: 'larga', ropaColor: '#9A2E26', ribete: ORO, brazo: [34, 70],
    adornos: { cuerpo: <Quiton a={A_M} c="#9A2E26" mujer />, cabeza: <><PeloRecogido c={NEGRO_P} luz={NEGRO_PL} /><Velo c={BLANCO} borde="#C9A24A" largo={120} /></>, mano: <CuencoFuego /> } }, 'ΕΣΤΙΑ'),
  demeter_oficial: m({ s: 1.02, pelo: CAOBA, ropa: 'larga', ropaColor: '#5E7A34', ribete: ORO, brazo: [26, 50],
    adornos: { detras: <Manto c="#C9952E" borde="#5E7A34" largo={0.95} />, cuerpo: <Quiton a={A_M} c="#5E7A34" mujer />, cabeza: <><PeloLargo c={CAOBA} luz={CAOBA_L} largo={90} /><Corona c={ORO} luz={ORO_OSC} hojas={9} /></>, mano: <Gavilla /> } }, 'ΔΗΜΗΤΗΡ'),
  persefone_oficial: m({ pelo: NEGRO_P, ropa: 'larga', ropaColor: '#9CC27A', ribete: '#4A2E5E', brazo: [30, 62],
    adornos: { detras: <Manto c="#4A2E5E" borde={ORO} largo={0.9} ancho={0.9} />, cuerpo: <Quiton a={A_M} c="#9CC27A" borde="#4A2E5E" mujer />, cabeza: <><PeloLargo c={NEGRO_P} luz={NEGRO_PL} largo={96} /><CoronaFlores colores={['#F4EEE2', '#E8728A', '#F2C94C']} /></>, mano: <Granada /> } }, 'ΠΕΡΣΕΦΟΝΗ'),
  zeus_nino_oficial: h({ cuerpo: 'nino', piel: PIEL_M, pelo: CASTANO, ropa: 'corta', ropaColor: BLANCO, ribete: ORO, brazo: [60, 60],
    adornos: { cuerpo: <><Quiton a={1} c={BLANCO} /><Cinto a={1} c={ORO} /></>, cabeza: <><PeloRulos c={CASTANO} luz={CASTANO_L} /><Oreja piel={PIEL_M} /></>, mano: <RayitoBebe /> } }, 'ΖΕΥΣ'),
  amaltea_oficial: { tipo: 'cuadrupedo', animal: 'cabra', p: { color: '#EFE6D2' }, griego: 'ΑΜΑΛΘΕΙΑ' },
  titan_oficial: h({ gigante: true, s: 1.14, piel: PIEL_SOL, pelo: '#2A2420', ropa: 'corta', ropaColor: '#4A4038', ribete: HIERRO, brazo: [30, 60], brazoAtras: [30, 30], botas: CUERO,
    adornos: { detras: <Manto c="#5A4632" borde="#2A2420" ancho={1.15} largo={0.85} />, cuerpo: <Coraza a={A_GIG} c={HIERRO} osc={HIERRO_OSC} luz="#B9C2CA" />, cabeza: <><PeloRulos c="#2A2420" luz="#5A4E44" largo r={7} /><BarbaLarga c="#2A2420" luz="#5A4E44" L={70} /></>, mano: <LanzaTitan />, manoAtras: <Hoplon borde={HIERRO} campo="#2A2420" /> } }, 'ΤΙΤΑΝ'),
  ciclope_oficial: h({ gigante: true, s: 1.16, ciclope: true, piel: '#C08A66', pelo: '#3A2A20', ropa: 'corta', ropaColor: '#6E6458', ribete: '#4E4438', brazo: [6, 6],
    adornos: { cuerpo: <><Exomis a={A_GIG} c="#6E6458" /><Delantal a={A_GIG} /></>, cabeza: <><PeloCalvo c="#3A2A20" luz="#6A5240" /><BarbaRulos c="#3A2A20" luz="#6A5240" L={60} r={7} /><Oreja piel="#C08A66" /><path d="M2 -24 L 30 -17" stroke="#3A2A20" strokeWidth={5} strokeLinecap="round" /></>, mano: <Martillo /> } }, 'ΚΥΚΛΩΨ'),
  gea_oficial: m({ s: 1.04, piel: '#D9A57A', pelo: CASTANO, ropa: 'larga', ropaColor: '#6E4A2E', ribete: HOJA, brazo: [26, 50],
    adornos: { detras: <Manto c={HOJA} borde="#C9A24A" ancho={1.05} />, cuerpo: <Quiton a={A_M} c="#6E4A2E" borde={HOJA} mujer />, cabeza: <><PeloLargo c={CASTANO} luz={CASTANO_L} largo={110} /><Corona c={HOJA} luz={HOJA_OSC} ancha /><CoronaFlores colores={['#E8728A', '#F2C94C']} /></>, mano: <RamaBrotes /> } }, 'ΓΑΙΑ'),
  urano_oficial: h({ gigante: true, s: 1.1, piel: PIEL_H, pelo: '#B9C4D6', ropa: 'larga', ropaColor: '#1E2E5E', ribete: '#F2E6B8', brazo: [40, 70],
    adornos: { detras: <><Manto c="#141E40" borde="#F2E6B8" ancho={1.1} /><g transform="translate(-40 -200)"><Estrella x={0} y={0} r={6} c="#F2E6B8" /><Estrella x={-16} y={-60} r={5} c="#F2E6B8" /><Estrella x={-28} y={40} r={5} c="#F2E6B8" /></g></>, cuerpo: <><Quiton a={A_GIG} c="#1E2E5E" borde="#F2E6B8" /><RopaEstrellada a={A_GIG} /></>, cabeza: <><PeloRulos c="#B9C4D6" luz="#E4EAF2" largo r={7} /><BarbaLarga c="#B9C4D6" luz="#7E8CA4" L={88} /><DiademaEstrellas n={5} /></> } }, 'ΟΥΡΑΝΟΣ'),
  metis_oficial: m({ pelo: NEGRO_P, ropa: 'larga', ropaColor: '#2E5E6E', ribete: '#C9D3E0', brazo: [34, 70],
    adornos: { detras: <Manto c="#1E3E4A" borde="#C9D3E0" largo={0.9} ancho={0.9} />, cuerpo: <Quiton a={A_M} c="#2E5E6E" borde="#C9D3E0" mujer />, cabeza: <><PeloRecogido c={NEGRO_P} luz={NEGRO_PL} /><CintaOro c="#C9D3E0" /></>, mano: <Pocion /> } }, 'ΜΗΤΙΣ'),
  maia_oficial: m({ pelo: CASTANO, ropa: 'larga', ropaColor: '#9A86C2', ribete: '#F2E6B8', brazo: [24, 46],
    adornos: { detras: <Manto c="#2C3E6E" borde="#F2E6B8" largo={0.95} ancho={0.9} />, cuerpo: <Quiton a={A_M} c="#9A86C2" borde="#F2E6B8" mujer />, cabeza: <><PeloLargo c={CASTANO} luz={CASTANO_L} largo={90} /><DiademaEstrellas n={7} /></> } }, 'ΜΑΙΑ'),
  // ---- héroes y mortales ----
  heracles_oficial: h({ gigante: true, s: 1.08, piel: PIEL_SOL, pelo: NEGRO_P, ropa: 'corta', ropaColor: '#C8913E', ribete: '#8A5A22', brazo: [40, 70],
    adornos: { detras: <PielLeonEspalda />, cuerpo: <><NudoLeon a={A_GIG} /><Cinto a={A_GIG} c={CUERO} /></>, cabeza: <><PeloRulos c={NEGRO_P} luz={NEGRO_PL} /><BarbaRulos c={NEGRO_P} luz={NEGRO_PL} L={50} r={6.5} /><CapuchaLeon /></>, mano: <Clava />, pie: <Sandalia /> } }, 'ΗΡΑΚΛΗΣ'),
  perseo_oficial: h({ piel: PIEL_H, pelo: NEGRO_P, ropa: 'corta', ropaColor: '#3E6E5A', ribete: ORO, brazo: [40, 80], brazoAtras: [30, 30],
    adornos: { detras: <Manto c="#2C3E6E" borde={ORO} largo={0.6} />, cuerpo: <><Quiton a={1} c="#3E6E5A" /><Cinto a={1} c={CUERO} hebilla={ORO} /><Broche x={-8} y={-300} /></>, cabeza: <><PeloRulos c={NEGRO_P} luz={NEGRO_PL} r={6} /><Oreja piel={PIEL_H} /></>, mano: <Harpe />, manoAtras: <EscudoEspejo />, pie: <Talaria />, pieAtras: <Talaria fase={2} /> } }, 'ΠΕΡΣΕΥΣ'),
  medusa_oficial: m({ piel: '#A9BC8E', pelo: '#3E6A34', ropa: 'larga', ropaColor: '#3A2A4A', ribete: '#6FAE4E', brazo: [50, 60],
    adornos: { cuerpo: <Quiton a={A_M} c="#3A2A4A" borde="#6FAE4E" mujer />, cabeza: <><PeloSerpientes /><OjoFiero /></> } }, 'ΜΕΔΟΥΣΑ'),
  teseo_oficial: h({ piel: PIEL_H, pelo: '#7A5232', ropa: 'corta', ropaColor: BLANCO, ribete: '#2C4C8C', brazo: [70, 50],
    adornos: { detras: <Manto c="#2C4C8C" borde={ORO} largo={0.6} />, cuerpo: <><Quiton a={1} c={BLANCO} borde="#2C4C8C" /><Cinto a={1} c={CUERO} hebilla={BRONCE} /><Broche x={-8} y={-300} /></>, cabeza: <><PeloRulos c="#7A5232" luz="#A87A50" r={6} /><Oreja piel={PIEL_H} /></>, mano: <Xiphos />, manoAtras: <Ovillo hebra={120} />, pie: <Sandalia /> } }, 'ΘΗΣΕΥΣ'),
  minotauro_oficial: h({ gigante: true, s: 1.12, piel: '#9A6440', pelo: '#5A3A26', ropa: 'corta', ropaColor: '#7E2219', ribete: BRONCE, brazo: [30, 40], brazoAtras: [-30, -20],
    adornos: { cuerpo: <Cinto a={A_GIG} c={BRONCE} />, cabeza: <CabezaToro /> } }, 'ΜΙΝΩΤΑΥΡΟΣ'),
  ariadna_oficial: m({ pelo: '#2A1C14', ropa: 'larga', ropaColor: '#D99A3A', ribete: ROJO, brazo: [30, 60],
    adornos: { detras: <Manto c="#8E2A2A" borde={ORO} largo={0.9} ancho={0.85} />, cuerpo: <><Quiton a={A_M} c="#D99A3A" borde={ROJO} mujer /><Perlas a={A_M} /></>, cabeza: <><PeloLargo c="#2A1C14" luz="#5A4030" largo={100} /><CintaOro /></>, mano: <Ovillo /> } }, 'ΑΡΙΑΔΝΗ'),
  dedalo_oficial: h({ s: 1.02, piel: PIEL_H, pelo: GRIS, ropa: 'corta', ropaColor: '#4E6A7A', ribete: '#C9A26A', brazo: [30, 60],
    adornos: { detras: <AlasCera s={0.8} />, cuerpo: <><Quiton a={1} c="#4E6A7A" borde="#C9A26A" /><Cinto a={1} c={CUERO} hebilla={BRONCE} /></>, cabeza: <><PeloCalvo c={GRIS} luz={GRIS_L} /><BarbaRulos c={GRIS} luz={GRIS_L} L={48} r={6} /><Oreja piel={PIEL_H} /></>, mano: <Escuadra />, pie: <Sandalia /> } }, 'ΔΑΙΔΑΛΟΣ'),
  icaro_oficial: h({ cuerpo: 'flaco', piel: PIEL_H, pelo: '#C9A04A', ropa: 'corta', ropaColor: BLANCO, ribete: CELESTE, brazo: [80, 20], brazoAtras: [60, 20],
    adornos: { detras: <AlasCera s={1.1} />, cuerpo: <><Quiton a={A_FLACO} c={BLANCO} borde={CELESTE} /><Cinto a={A_FLACO} c={CUERO} /></>, cabeza: <><PeloRulos c="#C9A04A" luz="#F0D58A" r={6} /><Oreja piel={PIEL_H} /></> } }, 'ΙΚΑΡΟΣ'),
  midas_oficial: h({ cuerpo: 'gordo', s: 1.04, piel: PIEL_H, pelo: CASTANO, ropa: 'larga', ropaColor: '#7A2340', ribete: ORO, brazo: [34, 70], guante: ORO,
    adornos: { detras: <Manto c={ORO} borde="#7A2340" ancho={1.1} />, cuerpo: <><Quiton a={1.3} c="#7A2340" /><Perlas a={1.1} /></>, cabeza: <><PeloRulos c={CASTANO} luz={CASTANO_L} /><BarbaRulos c={CASTANO} luz={CASTANO_L} L={52} r={6} /><CoronaRey /></>, mano: <Rosa oro /> } }, 'ΜΙΔΑΣ'),
  aracne_oficial: m({ pelo: CASTANO, ropa: 'larga', ropaColor: '#6E7F8E', ribete: '#C9B48A', brazo: [30, 60],
    adornos: { cuerpo: <><Quiton a={A_M} c="#6E7F8E" borde="#C9B48A" mujer /><Cinto a={A_M} c={CUERO} /></>, cabeza: <><PeloRecogido c={CASTANO} luz={CASTANO_L} /><Panuelo c="#C9B48A" /></>, mano: <Huso /> } }, 'ΑΡΑΧΝΗ'),
  jason_oficial: h({ piel: PIEL_SOL, pelo: CASTANO, ropa: 'corta', ropaColor: '#3F5B8A', ribete: ORO, brazo: [30, 60],
    adornos: { detras: <Vellocino />, cuerpo: <><Quiton a={1} c="#3F5B8A" /><Cinto a={1} c={CUERO} hebilla={ORO} /></>, cabeza: <><PeloRulos c={CASTANO} luz={CASTANO_L} /><BarbaRulos c={CASTANO} luz={CASTANO_L} L={42} r={5.5} /><Oreja piel={PIEL_SOL} /></>, mano: <Lanza y0={236} y1={-250} />, pie: <Sandalia /> } }, 'ΙΑΣΩΝ'),
  eco_oficial: m({ pelo: '#8E6440', ropa: 'larga', ropaColor: '#A7BCCB', ribete: BLANCO, brazo: [24, 40],
    adornos: { detras: <Manto c="#D6E0E8" borde={BLANCO} largo={0.95} ancho={0.85} />, cuerpo: <Quiton a={A_M} c="#A7BCCB" borde={BLANCO} mujer />, cabeza: <><PeloLargo c="#8E6440" luz="#B98C62" largo={104} /><Ondas /></> } }, 'ΗΧΩ'),
  narciso_oficial: h({ cuerpo: 'flaco', piel: PIEL_H, pelo: '#B98A3E', ropa: 'corta', ropaColor: BLANCO, ribete: ORO, brazo: [44, 70], cabeza: -8,
    adornos: { detras: <Manto c="#E2B04A" borde={BLANCO} largo={0.6} />, cuerpo: <><Quiton a={A_FLACO} c={BLANCO} /><Broche x={-8} y={-300} /></>, cabeza: <><PeloRulos c="#B98A3E" luz="#E2B870" r={6} /><Oreja piel={PIEL_H} /><CoronaFlores colores={[BLANCO]} petalos={6} /></>, mano: <FlorNarciso /> } }, 'ΝΑΡΚΙΣΣΟΣ'),
  odiseo_oficial: h({ piel: PIEL_SOL, pelo: '#7A3E22', ropa: 'corta', ropaColor: '#2C3E6E', ribete: '#C9A24A', brazo: [24, 50],
    adornos: { detras: <Manto c="#6E4526" borde="#C9A24A" largo={0.8} />, cuerpo: <><Quiton a={1} c="#2C3E6E" borde="#C9A24A" /><Cinto a={1} c={CUERO} /></>, cabeza: <><PeloRulos c="#7A3E22" luz="#B0643A" /><BarbaRulos c="#7A3E22" luz="#B0643A" L={54} r={6.5} /><Oreja piel={PIEL_SOL} /><PilosViajero /></>, mano: <Arco c="#8A5A32" s={1.1} />, pie: <Sandalia /> } }, 'ΟΔΥΣΣΕΥΣ'),
  pandora_oficial: m({ pelo: CAOBA, ropa: 'larga', ropaColor: '#F0E3C0', ribete: ORO, brazo: [10, 70],
    adornos: { cuerpo: <><Quiton a={A_M} c="#F0E3C0" mujer /><Perlas a={A_M} /></>, cabeza: <><PeloLargo c={CAOBA} luz={CAOBA_L} largo={100} /><CoronaFlores colores={[ORO]} centro={ROJO} /></>, mano: <Pithos /> } }, 'ΠΑΝΔΩΡΑ'),
  epimeteo_oficial: h({ piel: PIEL_SOL, pelo: '#8E6440', ropa: 'corta', ropaColor: '#6B7A3A', ribete: '#C9A24A', brazo: [20, 30],
    adornos: { detras: <Manto c="#8A6A3E" borde="#C9A24A" largo={0.75} />, cuerpo: <><Quiton a={1} c="#6B7A3A" borde="#C9A24A" /><Cinto a={1} c={CUERO} /></>, cabeza: <><PeloRulos c="#8E6440" luz="#B98C62" /><BarbaRulos c="#8E6440" luz="#B98C62" L={44} r={5.5} /><Oreja piel={PIEL_SOL} /></>, mano: <Asta y0={190} y1={-150} c={MADERA} w={7} />, pie: <Sandalia /> } }, 'ΕΠΙΜΗΘΕΥΣ'),
  // ---- monstruos ----
  hecatonquiro_oficial: h({ gigante: true, s: 1.22, piel: '#B98060', pelo: '#2A2420', ropa: 'corta', ropaColor: '#5A4632', ribete: '#2A2420', brazo: [36, 40],
    adornos: { detras: <BrazosExtra piel="#B98060" angs={[120, 150, 180, 210, 240]} />, cuerpo: <Cinto a={A_GIG} c={CUERO} />, cabeza: <><PeloRulos c="#2A2420" luz="#5A4E44" largo r={7} /><BarbaLarga c="#2A2420" luz="#5A4E44" L={66} /></> } }, 'ΕΚΑΤΟΓΧΕΙΡ'),
  tifon_oficial: h({ gigante: true, s: 1.26, piel: PIEL_SOL, pelo: '#1E1E22', ropa: 'larga', ropaColor: '#3E6A3A', ribete: '#6FA05A', brazo: [50, 30], brazoAtras: [-30, -20],
    adornos: { detras: <><g transform="translate(-10 -292) rotate(10) scale(2.5)"><AlaPlumas tono="#5A5560" /></g><ColaSerpiente /></>, cuerpo: <Escamas />, pie: <PieSerpiente />, pieAtras: <PieSerpiente />, cabeza: <><PeloRulos c="#1E1E22" luz="#4A4A52" largo r={7.5} /><BarbaLarga c="#1E1E22" luz="#4A4A52" L={70} /><OjoFiero c="#F28A2A" /></> } }, 'ΤΥΦΩΝ'),
};
export const NOMBRE_EN_GRIEGO_OFICIAL: Record<string, string> = {
  zeus_oficial: 'ZEUS', hera_oficial: 'HERA', poseidon_oficial: 'POSEIDON', hades_oficial: 'HADES', atenea_oficial: 'ATHENA', apolo_oficial: 'APOLLO', artemisa_oficial: 'ARTEMIS',
  hermes_oficial: 'HERMES', afrodita_oficial: 'APHRODITE', ares_oficial: 'ARES', hefesto_oficial: 'HEPHAESTUS', dioniso_oficial: 'DIONYSUS', prometeo_oficial: 'PROMETHEUS', cronos_oficial: 'CRONUS',
  rea_oficial: 'RHEA', hestia_oficial: 'HESTIA', demeter_oficial: 'DEMETER', persefone_oficial: 'PERSEPHONE', zeus_nino_oficial: 'ZEUS', amaltea_oficial: 'AMALTHEA', titan_oficial: 'TITAN', ciclope_oficial: 'CYCLOPS',
  gea_oficial: 'GAIA', urano_oficial: 'URANUS', metis_oficial: 'METIS', maia_oficial: 'MAIA', heracles_oficial: 'HERACLES', perseo_oficial: 'PERSEUS', medusa_oficial: 'MEDUSA', teseo_oficial: 'THESEUS', minotauro_oficial: 'MINOTAUR',
  ariadna_oficial: 'ARIADNE', dedalo_oficial: 'DAEDALUS', icaro_oficial: 'ICARUS', midas_oficial: 'MIDAS', aracne_oficial: 'ARACHNE', jason_oficial: 'JASON', eco_oficial: 'ECHO', narciso_oficial: 'NARCISSUS', odiseo_oficial: 'ODYSSEUS',
  pandora_oficial: 'PANDORA', epimeteo_oficial: 'EPIMETHEUS', hecatonquiro_oficial: 'HECATONCHEIRES', tifon_oficial: 'TYPHON',
};
