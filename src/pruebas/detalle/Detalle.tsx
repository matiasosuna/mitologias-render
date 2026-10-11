// Prueba de 10 s, estilo "vasija de figuras negras" detallado: trazos limpios con curvas,
// incisiones en crema, colores añadidos (púrpura y blanco), guardas ornamentales y cámara con parallax.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing, registerRoot, Composition } from 'remotion';
import { loadFont as cargarGaramond } from '@remotion/google-fonts/EBGaramond';

const { fontFamily: TEXTO } = cargarGaramond('normal', { weights: ['500'], subsets: ['latin'] });
type P = [number, number];
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const C = {
  barro: '#C9682F', barroClaro: '#E08A4C', barroOscuro: '#8C3D18', negro: '#17110E', crema: '#F1DDB4',
  purpura: '#7E2B22', blanco: '#F7EEDB', oro: '#F2C35B',
};

// ---------- utilidades de dibujo ----------
const f1 = (n: number) => n.toFixed(1);
/** Curva suave (Catmull-Rom → Bézier) por los puntos dados. */
function suave(pts: P[], cerrado = false, tension = 1): string {
  const n = pts.length;
  const g = (i: number) => (cerrado ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (cerrado ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), t = tension / 6;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) * t)} ${f1(p1[1] + (p2[1] - p0[1]) * t)} ${f1(p2[0] - (p3[0] - p1[0]) * t)} ${f1(p2[1] - (p3[1] - p1[1]) * t)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return cerrado ? d + 'Z' : d;
}
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Miembro con volumen: contorno suave alrededor de una línea con anchos por punto. */
function miembro(pts: P[], anchos: number[]): string {
  const izq: P[] = [], der: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = anchos[i] / 2;
    izq.push([p[0] + nx * w, p[1] + ny * w]);
    der.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return suave([...izq, ...der.reverse()], true);
}
const rad = (g: number) => (g * Math.PI) / 180;
const desde = (o: P, ang: number, l: number): P => [o[0] + Math.sin(rad(ang)) * l, o[1] + Math.cos(rad(ang)) * l];
const Inc: React.FC<{ d: string; w?: number; c?: string }> = ({ d, w = 2.2, c = C.crema }) => <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ---------- guardas ornamentales ----------
const Lenguetas: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => (
  <g transform={`translate(${-(desplaz % 48)} ${y})`}>
    <rect x={0} y={0} width={2000} height={34} fill={C.negro} />
    {Array.from({ length: 44 }, (_, i) => (
      <path key={i} d={`M${i * 48 + 6} 0 L${i * 48 + 42} 0 L${i * 48 + 40} 14 Q${i * 48 + 24} 40 ${i * 48 + 8} 14 Z`} fill={i % 2 ? C.purpura : C.barro} stroke={C.negro} strokeWidth={2} />
    ))}
  </g>
);

const Meandro: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => {
  const u = 12, ancho = u * 5 + u * 4; // una vuelta de meandro + un cuadro con aspa
  const greca = `M0 ${u * 4} V0 H${u * 4} V${u * 3} H${u} V${u} H${u * 3} V${u * 2} H${u * 2}`;
  return (
    <g transform={`translate(${-(desplaz % (ancho * 2))} ${y})`}>
      {Array.from({ length: 26 }, (_, i) => (
        <g key={i} transform={`translate(${i * ancho} 0)`}>
          <path d={greca} stroke={C.negro} strokeWidth={6} fill="none" strokeLinejoin="miter" />
          <line x1={u * 4} y1={u * 4} x2={u * 5} y2={u * 4} stroke={C.negro} strokeWidth={6} />
          <rect x={u * 5 + 6} y={4} width={u * 4 - 12} height={u * 4 - 8} fill="none" stroke={C.negro} strokeWidth={4} />
          <path d={`M${u * 5 + 10} 8 L${u * 9 - 10} ${u * 4 - 8} M${u * 9 - 10} 8 L${u * 5 + 10} ${u * 4 - 8}`} stroke={C.negro} strokeWidth={3} />
          {[[u * 5 + 14, u * 2], [u * 9 - 14, u * 2], [u * 7, 12], [u * 7, u * 4 - 12]].map(([cx, cy], j) => <circle key={j} cx={cx} cy={cy} r={2.5} fill={C.negro} />)}
        </g>
      ))}
      <line x1={0} x2={2400} y1={-8} y2={-8} stroke={C.negro} strokeWidth={4} />
      <line x1={0} x2={2400} y1={u * 4 + 8} y2={u * 4 + 8} stroke={C.negro} strokeWidth={4} />
    </g>
  );
};

const Palmeta: React.FC<{ x: number; y: number; arriba: boolean }> = ({ x, y, arriba }) => (
  <g transform={`translate(${x} ${y}) scale(1 ${arriba ? 1 : -1})`}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = -70 + i * 17.5;
      return <ellipse key={i} cx={0} cy={-28} rx={6} ry={22} fill={i % 2 ? C.purpura : C.negro} transform={`rotate(${a} 0 0) translate(0 -6)`} />;
    })}
    <circle cx={0} cy={0} r={9} fill={C.negro} />
    <path d="M-9 4 C -30 14, -40 0, -30 -8 M9 4 C 30 14, 40 0, 30 -8" stroke={C.negro} strokeWidth={4} fill="none" />
  </g>
);
const FrisoPalmetas: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => (
  <g transform={`translate(${-(desplaz % 220)} ${y})`}>
    <path d={Array.from({ length: 12 }, (_, i) => `M${i * 220} 45 C ${i * 220 + 55} -5, ${i * 220 + 55} 95, ${i * 220 + 110} 45 S ${i * 220 + 165} -5, ${i * 220 + 220} 45`).join(' ')} stroke={C.negro} strokeWidth={4} fill="none" />
    {Array.from({ length: 12 }, (_, i) => (
      <g key={i}>
        <Palmeta x={i * 220 + 55} y={36} arriba />
        <Palmeta x={i * 220 + 165} y={56} arriba={false} />
      </g>
    ))}
  </g>
);

// ---------- Prometeo ----------
const L = 88; // largo de muslo y pantorrilla

function pierna(cadera: P, fase: number) {
  const muslo = 34 * Math.sin(fase) + 8;
  const rodilla = 18 + 62 * Math.max(0, Math.sin(fase + 1.9));
  const k = desde(cadera, muslo, L);
  const tob = desde(k, muslo - rodilla, L);
  const pieAng = muslo - rodilla * 0.55 + 90;
  const punta = desde(tob, pieAng, 34);
  return { k, tob, punta, muslo, rodilla, path: miembro([cadera, lerp(cadera, k, 0.45), k, lerp(k, tob, 0.3), lerp(k, tob, 0.7), tob], [34, 31, 19, 23, 14, 11]), pie: suave([[tob[0] - 6, tob[1] - 7], lerp(tob, punta, 0.5), punta, [punta[0] - 2, punta[1] + 6], [tob[0] - 4, tob[1] + 8]], true) };
}

const Prometeo: React.FC<{ fase: number; f: number }> = ({ fase, f }) => {
  const cadera: P = [0, -176];
  const pD = pierna(cadera, fase), pT = pierna([-4, -176], fase + Math.PI);
  // brazo de atrás balanceándose, brazo de adelante firme con la caña
  const hT: P = [-4, -292], cT = desde(hT, -35 + 30 * Math.sin(fase + Math.PI), 66), mT = desde(cT, -55 + 30 * Math.sin(fase + Math.PI) + 40, 60);
  const hD: P = [14, -292], cD: P = [62, -262], mD: P = [104, -300];
  const flameo = (i: number) => Math.sin(f * 0.35 - i * 0.9) * (6 + i * 5);
  const capaArriba: P[] = Array.from({ length: 7 }, (_, i) => [-6 - i * 34, -300 + i * 9 + flameo(i)] as P);
  const capaAbajo: P[] = Array.from({ length: 7 }, (_, i) => [-20 - i * 32, -230 + i * 2 + flameo(i) * 1.3] as P).reverse();
  const vuelo = Math.sin(fase * 2) * 6;
  const torso: P[] = [[-20, -300], [18, -304], [34, -282], [30, -248], [22, -212], [-22, -208], [-30, -250], [-30, -284]];
  const falda: P[] = [[-27, -214], [24, -216], [38, -184], [52 + vuelo, -148], [16, -142], [-26, -146 - vuelo], [-46 - vuelo, -158]];
  return (
    <g>
      {/* capa */}
      <path d={suave([...capaArriba, ...capaAbajo], true)} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
      <path d={suave(capaAbajo.slice().reverse())} stroke={C.blanco} strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" transform="translate(0 -8)" />
      {[1, 2, 3].map((i) => <Inc key={i} d={suave([[-30, -292 + i * 14], [-90, -284 + i * 16 + flameo(2) * 0.6], [-150, -276 + i * 18 + flameo(4) * 0.8]])} w={1.8} c={C.negro} />)}
      {/* brazo de atrás */}
      <path d={miembro([hT, cT, mT], [24, 16, 11])} fill={C.negro} />
      <circle cx={mT[0]} cy={mT[1]} r={8} fill={C.negro} />
      {/* pierna de atrás */}
      <path d={pT.path} fill={C.negro} />
      <path d={pT.pie} fill={C.negro} />
      <Inc d={suave([lerp(pT.k, pT.tob, 0.12), lerp(pT.k, pT.tob, 0.45)])} w={1.6} />
      {/* torso y túnica */}
      <path d={suave(falda, true)} fill={C.negro} />
      {[[-14, -206, -26, -150], [0, -208, 2, -144], [14, -208, 28, -146], [22, -206, 42, -156]].map(([a, b, c, d], i) => (
        <Inc key={i} d={suave([[a, b], [(a + c) / 2 + (i - 1.5) * 2, (b + d) / 2], [c + vuelo * 0.5, d]])} w={1.8} />
      ))}
      <path d={suave([[-44 - vuelo, -160], [-26, -150 - vuelo], [16, -146], [50 + vuelo, -152]])} stroke={C.purpura} strokeWidth={9} fill="none" />
      <path d={suave([[-44 - vuelo, -160], [-26, -150 - vuelo], [16, -146], [50 + vuelo, -152]])} stroke={C.blanco} strokeWidth={3} strokeDasharray="1 8" strokeLinecap="round" fill="none" />
      <path d={suave(torso, true)} fill={C.negro} />
      <Inc d={suave([[-4, -292], [10, -284], [26, -286]])} />
      <Inc d={suave([[12, -276], [28, -264], [22, -246]])} />
      <Inc d={suave([[-6, -246], [8, -240], [20, -244]])} w={1.6} />
      <path d="M-28 -216 L 26 -218" stroke={C.purpura} strokeWidth={8} />
      <path d="M-28 -216 L 26 -218" stroke={C.blanco} strokeWidth={2.5} strokeDasharray="2 7" />
      {/* pierna de adelante */}
      <path d={pD.path} fill={C.negro} />
      <path d={pD.pie} fill={C.negro} />
      <Inc d={suave([lerp(cadera, pD.k, 0.4), lerp(cadera, pD.k, 0.85)])} w={1.6} />
      <Inc d={`M${f1(pD.k[0] - 6)} ${f1(pD.k[1] - 4)} q 8 6 14 0`} w={1.8} />
      <Inc d={suave([lerp(pD.k, pD.tob, 0.12), lerp(pD.k, pD.tob, 0.5)])} w={1.6} />
      <path d={`M${f1(pD.tob[0] - 8)} ${f1(pD.tob[1] - 10)} L${f1(pD.tob[0] + 10)} ${f1(pD.tob[1] - 12)}`} stroke={C.crema} strokeWidth={2} />
      {/* cabeza */}
      <g transform="translate(20 -334) rotate(-6)">
        {[0, 1, 2].map((i) => <path key={i} d={suave([[-22 + i * 6, 6], [-30 + i * 4, 30 + flameo(i) * 0.3], [-26 + i * 5, 54 + flameo(i + 1) * 0.4], [-32 + i * 6, 70]])} stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />)}
        <path d={suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [41, 6], [32, 10], [34, 15], [31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9)} fill={C.negro} />
        {/* barba en punta */}
        <path d={suave([[4, 14], [26, 22], [36, 44], [30, 62], [12, 40], [0, 30]], true)} fill={C.negro} />
        {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([[8 + i * 5, 24], [16 + i * 5, 40], [22 + i * 3, 54]])} w={1.5} />)}
        <Inc d="M24 20 q -6 3 -12 0" w={1.6} />
        {/* ojo almendrado, ceja, oreja */}
        <path d="M10 -6 Q 18 -12 26 -6 Q 18 -2 10 -6 Z" fill={C.crema} />
        <circle cx={19} cy={-6} r={2.6} fill={C.negro} />
        <Inc d="M8 -14 Q 18 -20 28 -13" w={2} />
        <Inc d="M-6 -4 C -14 -10, -14 8, -4 6 C 0 4, -2 -2, -6 0" w={1.8} />
        {/* cinta del pelo y rulos */}
        <path d={suave([[-30, -2], [-16, -22], [8, -30], [26, -24]])} stroke={C.purpura} strokeWidth={7} fill="none" />
        <path d={suave([[-30, -2], [-16, -22], [8, -30], [26, -24]])} stroke={C.blanco} strokeWidth={2.4} strokeDasharray="1 7" strokeLinecap="round" fill="none" />
        {[0, 1, 2, 3, 4].map((i) => <Inc key={i} d={`M${-26 + i * 9} ${-34 + Math.abs(i - 2) * 4} a 3.5 3.5 0 1 1 3 4`} w={1.6} />)}
        {[0, 1, 2].map((i) => <Inc key={i} d={suave([[-22 + i * 5, 10], [-26 + i * 4, 32], [-22 + i * 5, 50]])} w={1.3} />)}
      </g>
      {/* brazo de adelante */}
      <path d={miembro([hD, cD, mD], [26, 17, 12])} fill={C.negro} />
      <Inc d={suave([lerp(hD, cD, 0.3), lerp(hD, cD, 0.8)])} w={1.6} />
      <path d={suave([[mD[0] - 10, mD[1] + 4], [mD[0] + 2, mD[1] - 10], [mD[0] + 14, mD[1] - 4], [mD[0] + 8, mD[1] + 10]], true)} fill={C.negro} />
    </g>
  );
};

// ---------- fuego ----------
const llama = (w: number, h: number, ladeo: number, ruido: number): P[] => {
  const lado = (sg: number) => Array.from({ length: 10 }, (_, i) => {
    const t = i / 9, a = w * Math.sin(Math.PI * Math.pow(1 - t, 1.5)) * (1 + Math.sin(t * 9 + ruido * sg) * 0.08);
    return [sg * a + ladeo * t * t, -h * t] as P;
  });
  return [...lado(1), ...lado(-1).reverse()];
};
const Fuego: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => {
  const n = (k: number) => Math.sin(f * 0.5 + k) * 0.5 + Math.sin(f * 0.83 + k * 2) * 0.5;
  return (
    <g transform={`scale(${s})`}>
      <circle r={120} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.75 + n(1) * 0.15} />
      <path d={suave(llama(40, 120 + n(2) * 14, -40 + n(3) * 14, f * 0.3), true)} fill="#B8331C" stroke={C.negro} strokeWidth={3} />
      <path d={suave(llama(28, 88 + n(4) * 10, -30 + n(5) * 10, f * 0.4), true)} fill="#EE7A2A" />
      <path d={suave(llama(16, 54 + n(6) * 8, -18 + n(7) * 8, f * 0.5), true)} fill={C.oro} />
      <path d={suave(llama(7, 26 + n(8) * 5, -8, f * 0.6), true)} fill={C.blanco} />
    </g>
  );
};

// ---------- escenario ----------
const Olivo: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 0 C -20 -60, 10 -90, -6 -150 C -14 -180, 10 -200, 4 -230 L 18 -230 C 26 -196, 4 -180, 14 -150 C 30 -100, 0 -60, 14 0 Z" fill={C.negro} />
    <path d="M0 -150 C -40 -170, -70 -200, -110 -205 M6 -180 C 40 -200, 80 -230, 120 -232 M8 -215 C 0 -250, -30 -270, -50 -290 M10 -225 C 20 -250, 30 -260, 40 -275 M-20 -160 C -60 -160, -110 -160, -140 -170 M30 -170 C 80 -180, 120 -190, 150 -195 M4 -230 C 2 -260, 0 -290, 0 -310" stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />
    {[[-110, -205], [120, -232], [-50, -290], [40, -275], [-140, -170], [150, -195], [0, -310]].map(([cx, cy], c) =>
      Array.from({ length: 26 }, (_, i) => {
        const r1 = Math.sin((c * 31 + i) * 12.9898) * 43758.5453, u = r1 - Math.floor(r1);
        const r2 = Math.sin((c * 17 + i) * 78.233) * 12345.678, v = r2 - Math.floor(r2);
        const lx = cx + Math.cos(u * 6.28) * v * 62, ly = cy + Math.sin(u * 6.28) * v * 34;
        const ang = u * 360 + Math.sin(f / 18 + i + c) * 7;
        return <ellipse key={`${c}-${i}`} cx={lx} cy={ly} rx={4.5} ry={15} fill={i % 9 === 0 ? C.purpura : C.negro} transform={`rotate(${ang} ${lx} ${ly})`} />;
      }))}
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-80 + i * 45} cy={-210 - (i % 2) * 30} r={4} fill={C.blanco} />)}
  </g>
);

const Olimpo: React.FC = () => (
  <g>
    <path d="M-200 700 C 100 600, 250 380, 420 300 C 470 280, 520 285, 560 300 C 760 380, 900 600, 1200 700 Z" fill={C.barroOscuro} opacity={0.55} />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 4 + r * 2 }, (_, i) => {
      const cx = 490 - (r * 70) + i * 50 + (r % 2) * 25, cy = 330 + r * 60;
      return <path key={`${r}-${i}`} d={`M${cx - 22} ${cy} a 22 16 0 0 1 44 0`} stroke={C.barroOscuro} strokeWidth={3} fill="none" opacity={0.9} />;
    }))}
    <g transform="translate(490 294) scale(0.55)">
      <path d="M-120 -150 L0 -200 L120 -150 Z" fill={C.negro} />
      <rect x={-125} y={-150} width={250} height={14} fill={C.negro} />
      {[-100, -60, -20, 20, 60, 100].map((cx) => <rect key={cx} x={cx - 8} y={-136} width={16} height={116} fill={C.negro} />)}
      <rect x={-140} y={-20} width={280} height={12} fill={C.negro} />
      <path d="M-50 -165 L0 -186 L50 -165" stroke={C.blanco} strokeWidth={3} fill="none" />
    </g>
  </g>
);

// ---------- video ----------
const FRASE = 'Prometeo escondió el fuego en una caña de hinojo… y bajó corriendo a entregárselo a los humanos.';
const ARRIBA = 96, SUELO = 790;

export const Detalle: React.FC = () => {
  const f = useCurrentFrame();
  const px = interpolate(f, [0, 300], [520, 2200]);
  const camX = interpolate(px, [520, 2200], [0, 1300], { ...cl, easing: Easing.inOut(Easing.sin) });
  const fase = f * 0.34;
  const bote = -Math.abs(Math.cos(fase)) * 10;
  const s = 1.18;
  const mano: P = [px + 104 * s, SUELO + bote - 300 * s];
  const tallo: P[] = [mano, [mano[0] + 40, mano[1] - 50], [mano[0] + 70, mano[1] - 110]];
  const punta = tallo[2];
  const subt = Math.floor(interpolate(f, [24, 70], [0, FRASE.length], cl));
  const puntaEn = (t: number): P => {
    const x = interpolate(t, [0, 300], [520, 2200]);
    return [x + 104 * s + 70, SUELO - 300 * s - 110 - Math.abs(Math.cos(t * 0.34)) * 10];
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <Audio src={staticFile('musica/lira-griega.wav')} volume={(fr) => interpolate(fr, [0, 20, 270, 300], [0, 0.2, 0.2, 0], cl)} />
      <Sequence from={24}>
        <Audio src={staticFile('audio/prueba-mezcla/frase.wav')} />
      </Sequence>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="cielo" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor={C.barroClaro} />
            <stop offset="55%" stopColor={C.barro} />
            <stop offset="100%" stopColor={C.barroOscuro} />
          </radialGradient>
          <radialGradient id="halo">
            <stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} />
            <stop offset="45%" stopColor="#FF9A3C" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} />
          </radialGradient>
          <filter id="arcilla">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0.16 0" />
          </filter>
          <filter id="pincel">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.06" numOctaves="2" seed="8" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0.12 0" />
          </filter>
        </defs>
        <rect width={1920} height={1080} fill="url(#cielo)" />
        <rect width={1920} height={1080} filter="url(#pincel)" />
        {/* estrellas en blanco añadido */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = ((i * 397) % 2400) - camX * 0.1, y = 150 + ((i * 131) % 300);
          return <circle key={i} cx={((x % 1920) + 1920) % 1920} cy={y} r={2 + (i % 3)} fill={C.blanco} opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />;
        })}
        <path d="M1690 210 a 46 46 0 1 0 30 80 a 36 36 0 1 1 -30 -80 Z" fill={C.blanco} transform={`translate(${-camX * 0.05} 0)`} />
        {/* capas con parallax */}
        <g transform={`translate(${-camX * 0.3} 0)`}>
          <Olimpo />
        </g>
        <g transform={`translate(${-camX * 0.55} 0)`}>
          <path d="M600 800 C 900 640, 1100 600, 1400 660 C 1700 720, 2000 640, 2400 700 L 2400 820 L 600 820 Z" fill={C.barroOscuro} opacity={0.35} />
          <g opacity={0.42}>
            <Olivo x={1150} y={SUELO - 30} s={1.1} f={f} />
            <Olivo x={1900} y={SUELO - 40} s={0.9} f={f + 40} />
          </g>
        </g>
        <g transform={`translate(${-camX} 0)`}>
          {/* suelo */}
          <rect x={-100} y={SUELO} width={4000} height={170} fill={C.negro} />
          <path d={`M-100 ${SUELO} L4000 ${SUELO}`} stroke={C.purpura} strokeWidth={6} />
          {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={i * 50} cy={SUELO + 18} r={4} fill={C.barro} />)}
          {[300, 1180, 2150, 2900].map((x, i) => (
            <path key={x} d={`M${x} ${SUELO} c 10 -30, 50 -40, 70 -20 c 20 -20, 50 -10, 56 20 Z`} fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />
          ))}
          {/* chispas */}
          {Array.from({ length: 36 }, (_, i) => {
            const nace = Math.floor(f / 3) * 3 - i * 3;
            if (nace < 0) return null;
            const edad = f - nace, o = puntaEn(nace), r = Math.sin(i * 12.9898) * 43758.5453;
            const azar = r - Math.floor(r);
            const x = o[0] - edad * (1.5 + azar * 2), y = o[1] - 70 - edad * (1.2 + azar * 1.4) + Math.sin(edad / 5 + i) * 6;
            return <circle key={i} cx={x} cy={y} r={Math.max(0, 4 - edad * 0.04)} fill={azar > 0.5 ? C.oro : '#FF9A3C'} opacity={Math.max(0, 1 - edad / 90)} />;
          })}
          {/* caña de hinojo */}
          <path d={suave(tallo)} stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />
          {[0.35, 0.7].map((t, i) => {
            const p = lerp(tallo[0], tallo[2], t);
            return <path key={i} d={`M${p[0] - 7} ${p[1] + 2} l 14 -6`} stroke={C.blanco} strokeWidth={3} strokeLinecap="round" />;
          })}
          <g transform={`translate(${punta[0]} ${punta[1] + 6})`}>
            <Fuego f={f} s={0.62} />
          </g>
          <g transform={`translate(${px} ${SUELO + bote}) scale(${s})`}>
            <Prometeo fase={fase} f={f} />
          </g>
        </g>
        <rect width={1920} height={1080} filter="url(#arcilla)" />
        {/* guardas fijas */}
        <rect x={0} y={0} width={1920} height={ARRIBA + 30} fill={C.barro} />
        <Lenguetas y={0} desplaz={camX * 0.2} />
        <Meandro y={54} desplaz={camX * 0.2} />
        <rect x={0} y={SUELO + 40} width={1920} height={130} fill={C.barro} />
        <line x1={0} x2={1920} y1={SUELO + 40} y2={SUELO + 40} stroke={C.negro} strokeWidth={5} />
        <FrisoPalmetas y={SUELO + 58} desplaz={camX * 0.2} />
        <line x1={0} x2={1920} y1={SUELO + 160} y2={SUELO + 160} stroke={C.negro} strokeWidth={5} />
        <rect x={0} y={SUELO + 166} width={1920} height={200} fill={C.negro} />
        <text x={960} y={1032} textAnchor="middle" fontFamily={TEXTO} fontWeight={500} fontSize={40} fill={C.crema}>
          {FRASE.slice(0, subt)}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="prueba-detalle" component={Detalle} durationInFrames={300} fps={30} width={1920} height={1080} />);
