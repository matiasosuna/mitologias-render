// Personaje "elaborado" (prueba): misma vista de perfil del motor, pero con anatomía (músculos, manos, pies),
// cara detallada, piel con volumen, pelo con mechones que se mueven y ropa con dibujo. Origen = pies, mira a la derecha.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';
import { P, suave, desde, lerp } from './vasija';

export type Personaje2Props = {
  x: number; y?: number; s?: number; voltear?: boolean;
  mujer?: boolean;
  accion?: 'parado' | 'caminar';
  /** Brazo de adelante: [hombro, codo] en grados (0 = abajo, 90 = al frente). */
  brazo?: [number, number];
  piel?: string; pelo?: string;
  /** Tela de la ropa (malo / pāʻū / kīhei). */
  tela?: string; telaDibujo?: string;
  /** Tatuajes kākau en brazo y pierna. */
  tatuaje?: boolean;
  lei?: boolean;
  barba?: boolean;
  /** Objeto en la mano: anzuelo de Maui o bastón. */
  objeto?: 'anzuelo' | 'baston' | null;
  semilla?: number;
};

const rad = (g: number) => (g * Math.PI) / 180;
const f1 = (n: number) => n.toFixed(1);

/** Contorno de un segmento del cuerpo con perfil muscular: anchos del lado de atrás y de adelante a lo largo de a→b. */
function segmento(a: P, b: P, atras: number[], frente: number[]): string {
  const n = atras.length, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l, ny = dx / l; // normal "atrás" cuando el segmento apunta hacia abajo
  const izq: P[] = [], der: P[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), p = lerp(a, b, t);
    izq.push([p[0] + nx * atras[i], p[1] + ny * atras[i]]);
    der.push([p[0] - nx * frente[i], p[1] - ny * frente[i]]);
  }
  return suave([...izq, ...der.reverse()], true, 0.9);
}

/** Dibujo de un punto en coordenadas locales rotadas (para manos y pies). */
const rot = (o: P, ang: number, pts: P[]): P[] => pts.map(([px, py]) => {
  const c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
  return [o[0] + px * c - py * s, o[1] + px * s + py * c];
});

export const Personaje2: React.FC<Personaje2Props> = (props) => {
  const fr = useCurrentFrame();
  const { x, y = 790, s = 1, voltear, mujer, accion = 'parado', tatuaje, lei, barba, objeto = null, semilla = 1 } = props;
  const piel = props.piel ?? (mujer ? '#B9774A' : '#9A5A34');
  const pelo = props.pelo ?? '#1E1410';
  const tela = props.tela ?? (mujer ? '#B8452A' : '#C9A26B');
  const telaDibujo = props.telaDibujo ?? '#3A2216';
  const id = `p2${semilla}${mujer ? 'm' : 'h'}`;
  const anda = accion === 'caminar';
  const fase = anda ? fr * 0.19 : 0;
  // vida en reposo
  const respira = Math.sin((fr + semilla * 9) / 24);
  const peso = anda ? 0 : Math.sin((fr + semilla * 5) / 37);
  const parpadeo = (fr + semilla * 17) % 110;
  const ojoAbierto = parpadeo < 2 ? 0.15 : parpadeo < 4 ? 0.5 : 1;
  const bote = anda ? -Math.abs(Math.cos(fase)) * 5 : respira * 0.8;

  // ---- esqueleto ----
  const k = 1; // la mujer se escala entera (más baja)
  const cadera: P = [0, -215 * k];
  const hombro: P = [2, -342 * k];
  const pierna = (ph: number): { rod: P; tob: P; angPie: number } => {
    const amp = anda ? 22 : 0;
    const muslo = amp * Math.sin(fase + ph) + (anda ? 2 : ph === 0 ? 3 + peso * 2 : -2 - peso * 2);
    const flex = anda ? 6 + 34 * Math.max(0, Math.sin(fase + ph + 1.9)) : 3;
    const rod = desde(cadera, muslo, 100 * k);
    const tob = desde(rod, muslo - flex, 98 * k);
    const angPie = anda ? Math.max(-14, Math.min(20, -(muslo - flex) * 0.7)) : 0;
    return { rod, tob, angPie };
  };
  const pD = pierna(0), pT = pierna(Math.PI);
  const swing = anda ? Math.sin(fase + Math.PI) * 22 : 0;
  const sigue = anda ? Math.sin(fase + Math.PI - 0.7) * 12 : Math.sin((fr + semilla * 5) / 37 - 0.6) * 3;
  const [bDh, bDc] = props.brazo ?? [12 - swing, 18 - swing * 0.6 + sigue];
  const bTh = -14 + swing, bTc = 12 + swing * 0.6 - sigue;
  const codoD = desde(hombro, bDh, 70 * k), manoD = desde(codoD, bDh + bDc, 62 * k);
  const hombroT: P = [-6, -344 * k];
  const codoT = desde(hombroT, bTh, 70 * k), manoT = desde(codoT, bTh + bTc, 62 * k);

  // ---- perfiles musculares (atrás, adelante) ----
  const M = mujer
    ? { muslo: [[19, 21, 19, 16, 13, 11, 10], [15, 17, 17, 15, 13, 11, 10]], pierna: [[10, 13, 14, 11, 8, 6, 5.5], [9, 9, 8.5, 7.5, 6.5, 6, 5.5]], brazo: [[10, 11, 10, 9, 8, 7, 6.5], [9, 10, 10, 9, 8, 7, 6.5]], ante: [[7, 8, 7.5, 6.5, 5.5, 5, 4.5], [7, 7.5, 7, 6, 5.5, 5, 4.5]] }
    : { muslo: [[19, 20, 18, 16, 14, 12, 11], [17, 20, 21, 19, 16, 13, 11]], pierna: [[11, 15, 17, 14, 9, 7, 6], [10, 10, 9.5, 8.5, 7, 6.5, 6]], brazo: [[14, 15, 14, 12, 10, 9, 8], [13, 13, 15, 13, 10, 9, 8]], ante: [[9, 11, 10.5, 9, 7, 6, 5], [9, 10, 10, 8.5, 7, 6, 5]] };

  const grad = (n: string, a: string, b: string) => (
    <linearGradient id={`${id}${n}`} x1="0" y1="0" x2="1" y2="0.25">
      <stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} />
    </linearGradient>
  );
  const oscuro = (c: string, f: number) => {
    const n = parseInt(c.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
  };
  const pielOsc = oscuro(piel, 0.72), pielClara = oscuro(piel, 1.12);
  const linea = oscuro(piel, 0.5);

  const pie = (tob: P, ang: number, fill: string) => {
    const pts = rot(tob, ang, [[-9, -6], [-13, 4], [-10, 13], [10, 14], [30, 13], [38, 10], [36, 5], [22, 0], [8, -8]]);
    return <path d={suave(pts, true, 0.8)} fill={fill} stroke={linea} strokeWidth={1.4} />;
  };
  const mano = (m: P, ang: number, fill: string) => {
    // ang = dirección del antebrazo (0 = abajo); palma y dedos un poco cerrados
    const pts = rot(m, ang, [[-6, -2], [-7, 8], [-5, 18], [0, 24], [5, 20], [7, 12], [6, 2]]);
    const pulgar = rot(m, ang, [[5, 2], [11, 8], [10, 14], [6, 12]]);
    return <><path d={suave(pts, true, 0.8)} fill={fill} stroke={linea} strokeWidth={1.3} /><path d={suave(pulgar, true, 0.8)} fill={fill} stroke={linea} strokeWidth={1.2} /></>;
  };
  // Para rot(): ángulo de rotación en grados del sistema SVG (0 = eje x). El antebrazo con ang motor θ apunta a (sinθ, cosθ) → rotación = -θ.
  const angMano = (h: number, c: number) => -(h + c);

  const kakau = (a: P, b: P, desdeT: number, hastaT: number) => {
    const p0 = lerp(a, b, desdeT), p1 = lerp(a, b, hastaT), dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    const dientes = Array.from({ length: 7 }, (_, i) => {
      const t = i / 6, c = lerp(p0, p1, t);
      return `M${f1(c[0] + nx * 9)} ${f1(c[1] + ny * 9)} L${f1(c[0] - nx * 9 + dx * 0.04)} ${f1(c[1] - ny * 9 + dy * 0.04)} L${f1(c[0] + nx * 9 + dx * 0.08)} ${f1(c[1] + ny * 9 + dy * 0.08)}`;
    }).join(' ');
    return <g opacity={0.85}><path d={`M${f1(p0[0] + nx * 10)} ${f1(p0[1] + ny * 10)} L${f1(p0[0] - nx * 10)} ${f1(p0[1] - ny * 10)} M${f1(p1[0] + nx * 10)} ${f1(p1[1] + ny * 10)} L${f1(p1[0] - nx * 10)} ${f1(p1[1] - ny * 10)}`} stroke="#1A1714" strokeWidth={3} /><path d={dientes} stroke="#1A1714" strokeWidth={1.8} fill="none" /></g>;
  };

  // ---- torso ----
  const ch = respira * 1.2;
  const torsoH: P[] = [[-12, -368], [-17, -356], [-28, -345], [-31, -318], [-25, -284], [-21, -256], [-28, -228], [-22, -205], [8, -206], [19, -226], [21, -256], [23, -284], [31 + ch, -316], [27, -338], [13, -356], [12, -367]];
  const torsoM: P[] = [[-11, -366], [-15, -354], [-25, -344], [-26, -318], [-19, -284], [-15, -262], [-26, -232], [-21, -206], [8, -207], [17, -230], [15, -262], [17, -286], [31 + ch, -308], [24, -334], [12, -353], [11, -364]];
  const torso = (mujer ? torsoM : torsoH).map(([px, py]) => [px * (mujer ? 1.08 : 1.18), py] as P);

  // ---- cabeza (perfil) ----
  const cab = (mujer ? [[-25, -392], [-21, -414], [-4, -424], [16, -416], [20, -402], [21, -396], [28, -385], [23, -381], [24, -376], [23, -372], [22, -369], [19, -362], [7, -359], [-7, -366], [-12, -372]] : [[-25, -392], [-22, -414], [-4, -424], [17, -415], [22, -400], [21, -395], [31, -383], [24, -379], [25, -375], [24, -371], [24, -368], [21, -361], [6, -358], [-7, -366], [-12, -372]]) as P[];
  const cabeza = cab.map(([px, py]) => [px, py * k] as P);
  const ojo: P = [13, -396 * k];
  const cabeceo = anda ? Math.sin(fase * 2) * 1.2 : Math.sin((fr + semilla * 3) / 43) * 2 - peso * 0.8;

  // ---- pelo con mechones (ruido) ----
  const mechones = Array.from({ length: mujer ? 9 : 6 }, (_, i) => {
    const base: P = [-22 + i * 3.5, (-412 + i * 2) * k];
    const largo = mujer ? 150 + (i % 3) * 18 : 46 + (i % 2) * 10;
    const pts: P[] = Array.from({ length: 6 }, (_, j) => {
      const t = j / 5, n = noise2D(`${id}-${i}`, fr / 70 + t * 0.6, i * 0.3) * 10 * t * (anda ? 1.6 : 1);
      return [base[0] - 10 * t - (mujer ? 8 : 4) * Math.sin(t * 2.4) + n - (anda ? 10 * t : 0), base[1] + largo * t] as P;
    });
    return <path key={i} d={suave(pts)} stroke={i % 3 === 0 ? oscuro(pelo, 1.6) : pelo} strokeWidth={mujer ? 9 - (i % 3) : 8} fill="none" strokeLinecap="round" />;
  });

  // ---- ropa ----
  const ondea = (i: number) => (anda ? Math.sin(fase * 2 - i) * 4 : Math.sin(fr / 20 - i) * 1.5);
  const malo = (
    <g>
      <path d={suave([[-24, -216], [-14, -214], [-18 + ondea(2), -172], [-30 + ondea(3), -176]], true)} fill={oscuro(tela, 0.8)} stroke={linea} strokeWidth={1.4} />
      <path d={suave([[-24, -236], [20, -238], [22, -214], [10, -206], [-8, -204], [-25, -214]], true)} fill={tela} stroke={linea} strokeWidth={1.5} />
      {[-18, -8, 2, 12].map((px) => <path key={px} d={`M${px} -233 l4 6 l4 -6 M${px} -222 l4 6 l4 -6`} stroke={telaDibujo} strokeWidth={1.6} fill="none" />)}
    </g>
  );
  const maloFrente = (
    <g>
      <path d={suave([[4, -214], [17, -214], [19 + ondea(1), -166], [5 + ondea(2), -158]], true)} fill={tela} stroke={linea} strokeWidth={1.4} />
      <path d={`M8 ${-196} l4 6 l4 -6 M8 -182 l4 6 l4 -6`} stroke={telaDibujo} strokeWidth={1.5} fill="none" />
    </g>
  );
  const pau = (
    <g>
      {[0, 1, 2].map((c) => {
        const y0 = -246 + c * 4, y1 = -128 + c * 6;
        return <path key={c} d={suave([[-25, y0], [19, y0 - 2], [26 + ondea(c) , y1 - 30], [34 + ondea(c + 1), y1], [-2, y1 + 6], [-36 + ondea(c + 2), y1 - 2], [-30, y0 + 40]], true)} fill={c === 2 ? tela : oscuro(tela, 0.85 + c * 0.05)} stroke={linea} strokeWidth={1.4} />;
      })}
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-26 + i * 13} -170 l5 -8 l5 8 l5 -8 l5 8`} stroke={telaDibujo} strokeWidth={1.8} fill="none" />)}
      <path d={suave([[-30, -140], [0, -132], [33 + ondea(2), -136]])} stroke={telaDibujo} strokeWidth={3} fill="none" />
    </g>
  );
  const kihei = mujer && (
    <path d={suave([[-26, -350], [24, -342], [30, -318], [18, -296], [-8, -300], [-32, -312]], true)} fill={oscuro(tela, 1.05)} stroke={linea} strokeWidth={1.4} />
  );
  const leiFlores = lei && Array.from({ length: 9 }, (_, i) => {
    const t = i / 8, px = -14 + t * 40, py = (-352 + Math.sin(t * Math.PI) * 16) * k;
    return <g key={i}><circle cx={px} cy={py} r={5.5} fill={['#F2C35B', '#E8724B', '#F7EEDB'][i % 3]} stroke={linea} strokeWidth={1} /><circle cx={px} cy={py} r={1.6} fill="#7E2B22" /></g>;
  });

  // Contextura: un poco más de masa muscular en los brazos, piernas y torso.
  const masa = mujer ? 1.08 : 1.22;
  (Object.keys(M) as (keyof typeof M)[]).forEach((kk) => { M[kk] = M[kk].map((arr) => arr.map((w) => w * masa)) as typeof M[typeof kk]; });
  const pielG = `url(#${id}piel)`, pielAtrasG = `url(#${id}atras)`;
  const angPieT = pT.angPie, angPieD = pD.angPie;
  return (
    <g transform={`translate(${x} ${y + bote * s}) scale(${(voltear ? -s : s) * (mujer ? 0.94 : 1)} ${s * (mujer ? 0.94 : 1)})`}>
      <defs>
        {grad('piel', pielOsc, pielClara)}
        {grad('atras', oscuro(piel, 0.55), oscuro(piel, 0.8))}
        <radialGradient id={`${id}sombra`}><stop offset="0" stopColor="#140A04" stopOpacity="0.45" /><stop offset="1" stopColor="#140A04" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={4} cy={-bote + 2} rx={60} ry={10} fill={`url(#${id}sombra)`} />
      {/* pelo de atrás (mujer) */}
      {mujer && <g transform={`rotate(${cabeceo} 0 ${-366 * k})`}>{mechones}</g>}
      {/* brazo y pierna de atrás */}
      <path d={segmento(hombroT, codoT, M.brazo[0], M.brazo[1])} fill={pielAtrasG} stroke={linea} strokeWidth={1.3} />
      <path d={segmento(codoT, manoT, M.ante[0], M.ante[1])} fill={pielAtrasG} stroke={linea} strokeWidth={1.3} />
      {mano(manoT, angMano(bTh, bTc), oscuro(piel, 0.62))}
      <path d={segmento(cadera, pT.rod, M.muslo[0], M.muslo[1])} fill={pielAtrasG} stroke={linea} strokeWidth={1.3} />
      <path d={segmento(pT.rod, pT.tob, M.pierna[0], M.pierna[1])} fill={pielAtrasG} stroke={linea} strokeWidth={1.3} />
      {pie(pT.tob, angPieT, oscuro(piel, 0.62))}
      {/* torso */}
      <path d={suave(torso, true, 0.95)} fill={pielG} stroke={linea} strokeWidth={1.5} />
      {!mujer && <>
        <path d={`M${f1(6)} ${f1(-341)} Q 18 -344 25 -337`} stroke={linea} strokeWidth={1.4} fill="none" opacity={0.7} />
        <path d={`M2 -318 Q 18 -306 ${f1(29 + ch)} -312`} stroke={linea} strokeWidth={1.6} fill="none" opacity={0.6} />
        <path d="M14 -298 Q 18 -270 16 -240" stroke={linea} strokeWidth={1.2} fill="none" opacity={0.45} />
        {[-292, -276, -260].map((py) => <path key={py} d={`M10 ${py} q 6 2 11 0`} stroke={linea} strokeWidth={1.1} fill="none" opacity={0.4} />)}
        <circle cx={15} cy={-248} r={1.5} fill={linea} opacity={0.6} />
        <path d="M-24 -300 Q -14 -280 -18 -258" stroke={linea} strokeWidth={1.2} fill="none" opacity={0.35} />
      </>}
      {mujer && <path d="M8 -322 Q 26 -318 30 -306" stroke={linea} strokeWidth={1.3} fill="none" opacity={0.5} />}
      {mujer ? pau : malo}
      {kihei}
      {/* pierna de adelante */}
      <path d={segmento(cadera, pD.rod, M.muslo[0], M.muslo[1])} fill={pielG} stroke={linea} strokeWidth={1.4} />
      <path d={segmento(pD.rod, pD.tob, M.pierna[0], M.pierna[1])} fill={pielG} stroke={linea} strokeWidth={1.4} />
      <path d={`M${f1(pD.rod[0] + 2)} ${f1(pD.rod[1] - 6)} q 9 4 8 13`} stroke={linea} strokeWidth={1.3} fill="none" opacity={0.6} />
      {!mujer && <path d={segmento(lerp(pD.rod, pD.tob, 0.12), lerp(pD.rod, pD.tob, 0.55), [1, 5, 7, 5, 1], [0, 0, 0, 0, 0])} fill={oscuro(piel, 0.85)} opacity={0.5} />}
      {tatuaje && kakau(cadera, pD.rod, 0.35, 0.7)}
      {!mujer && maloFrente}
      {pie(pD.tob, angPieD, pielClara)}
      {/* cabeza */}
      <g transform={`rotate(${cabeceo} 0 ${-366 * k}) translate(0 -360) scale(1.12) translate(0 360)`}>
        <path d={suave([[-10, -372 * k], [11, -366 * k], [13, -352 * k], [-14, -350 * k]], true)} fill={pielG} />
        <path d={suave(cabeza, true, 0.85)} fill={pielG} stroke={linea} strokeWidth={1.5} />
        {/* oreja */}
        <path d={suave([[-6, -398 * k], [-1, -401 * k], [2, -394 * k], [0, -385 * k], [-5, -383 * k], [-7, -390 * k]], true)} fill={oscuro(piel, 0.9)} stroke={linea} strokeWidth={1.2} />
        <path d={`M-3 ${f1(-395 * k)} q 2 4 -1 8`} stroke={linea} strokeWidth={1} fill="none" />
        {/* ojo: blanco, iris, párpado y pestañas */}
        <g transform={`translate(${ojo[0]} ${ojo[1]}) scale(1 ${ojoAbierto})`}>
          <path d="M-4 0 Q 3 -5 8 0 Q 3 3 -4 0 Z" fill="#F4ECDD" stroke={linea} strokeWidth={1} />
          <circle cx={4} cy={0} r={2.6} fill="#3A2312" /><circle cx={4.4} cy={0} r={1.3} fill="#0E0906" /><circle cx={5.2} cy={-1} r={0.7} fill="#FFFFFF" />
        </g>
        <path d={`M${ojo[0] - 5} ${f1(ojo[1] - 1)} Q ${ojo[0] + 3} ${f1(ojo[1] - 7 * ojoAbierto)} ${ojo[0] + 9} ${f1(ojo[1] - 1)}`} stroke="#140A04" strokeWidth={mujer ? 2.2 : 1.6} fill="none" strokeLinecap="round" />
        <path d={`M${ojo[0] - 6} ${f1(ojo[1] - 9)} Q ${ojo[0] + 3} ${f1(ojo[1] - 13)} ${ojo[0] + 10} ${f1(ojo[1] - 8)}`} stroke={pelo} strokeWidth={mujer ? 2 : 3} fill="none" strokeLinecap="round" />
        {/* nariz, labios, mentón */}
        <path d={`M24 ${f1(-381 * k)} q -3 2 -6 0`} stroke={linea} strokeWidth={1.2} fill="none" />
        <path d={`M${mujer ? 22 : 23} ${f1(-372.5 * k)} q -4 1 -7 -1`} stroke={linea} strokeWidth={1.3} fill="none" />
        {mujer && <path d={`M23 ${f1(-376 * k)} q 1 2 0 4`} stroke="#8E3B2A" strokeWidth={2.4} fill="none" strokeLinecap="round" />}
        <path d={`M8 ${f1(-371 * k)} q 6 6 12 9`} stroke={linea} strokeWidth={1} fill="none" opacity={0.5} />
        {/* pelo de arriba */}
        <path d={suave(mujer
          ? [[-27, -388], [-25, -414], [-6, -428], [16, -420], [20, -408], [6, -412], [-6, -406], [-14, -394], [-18, -370]]
          : [[-27, -386], [-24, -414], [-6, -428], [16, -421], [21, -410], [9, -413], [-4, -408], [-12, -398], [-18, -380]]
          .map(([px, py]) => [px, py * k] as P), true)} fill={pelo} />
        {!mujer && <g>{mechones}</g>}
        {barba && <path d={suave([[6, -364 * k], [22, -366 * k], [24, -356 * k], [14, -350 * k], [2, -354 * k]], true)} fill={pelo} />}
        {mujer && <g transform={`translate(-18 ${-414 * k})`}>{[0, 1, 2].map((i) => <circle key={i} cx={i * 7} cy={-Math.sin(i) * 3} r={5} fill={['#E8724B', '#F2C35B', '#F7EEDB'][i]} stroke={linea} strokeWidth={1} />)}</g>}
      </g>
      {leiFlores}
      {/* brazo de adelante */}
      <path d={segmento(hombro, codoD, M.brazo[0], M.brazo[1])} fill={pielG} stroke={linea} strokeWidth={1.4} />
      <path d={`M${f1(hombro[0] - 6)} ${f1(hombro[1] + 4)} Q ${f1(hombro[0] + 12)} ${f1(hombro[1] + 2)} ${f1(lerp(hombro, codoD, 0.42)[0] + 9)} ${f1(lerp(hombro, codoD, 0.42)[1])}`} stroke={linea} strokeWidth={1.2} fill="none" opacity={0.55} />
      {tatuaje && kakau(hombro, codoD, 0.4, 0.75)}
      <path d={segmento(codoD, manoD, M.ante[0], M.ante[1])} fill={pielG} stroke={linea} strokeWidth={1.4} />
      {objeto === 'anzuelo' && (() => {
        const t = rot(manoD, angMano(bDh, bDc), [[2, 14]])[0];
        return <g transform={`translate(${f1(t[0])} ${f1(t[1])}) rotate(${-(bDh + bDc) + 180})`}><path d="M0 0 L0 -70 C 0 -100, 34 -100, 34 -70 C 34 -50, 18 -48, 14 -60" stroke="#E9DDBF" strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M0 0 L0 -70 C 0 -100, 34 -100, 34 -70 C 34 -50, 18 -48, 14 -60" stroke="#6B5A3A" strokeWidth={1.5} fill="none" /></g>;
      })()}
      {mano(manoD, angMano(bDh, bDc), pielClara)}
    </g>
  );
};
