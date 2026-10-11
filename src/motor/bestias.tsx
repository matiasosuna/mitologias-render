// Criaturas componibles en estilo vasija: cuadrúpedos (con alas, varias cabezas, cabeza humana, cola de
// serpiente), serpientes y dragones (hidra), aves (águila, arpía, sirena), peces y delfines.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, P, suave, miembro, desde, Inc, Borde, SUELO } from '../comun/vasija';

export type TipoCuadrupedo = 'leon' | 'toro' | 'caballo' | 'perro' | 'lobo' | 'jabali' | 'ciervo' | 'cabra' | 'oso' | 'oveja' | 'buey' | 'hipopotamo';

export type BestiaProps = {
  x: number; y?: number; s?: number; voltear?: boolean; opacity?: number;
  moviendo?: boolean; corriendo?: boolean;
  alas?: boolean; cabezas?: number; cabezaHumana?: boolean; colaSerpiente?: boolean;
  color?: string; contorno?: boolean; boca?: boolean;
};

const TAM: Record<TipoCuadrupedo, number> = { leon: 1, toro: 1.1, caballo: 1.15, perro: 0.7, lobo: 0.8, jabali: 0.8, ciervo: 0.95, cabra: 0.7, oso: 1.05, oveja: 0.7, buey: 1.1, hipopotamo: 1.15 };

const Ojo: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 4 }) => (
  <>
    <circle cx={x} cy={y} r={r + 2} fill={C.crema} />
    <circle cx={x + 1} cy={y} r={r * 0.55} fill={C.negro} />
  </>
);

/** Cabeza según el animal; origen en la base del cuello, mirando a la derecha. */
const Cabeza: React.FC<{ tipo: TipoCuadrupedo; color: string; boca?: boolean; humana?: boolean }> = ({ tipo, color, boca, humana }) => {
  if (humana) {
    return (
      <g>
        <path d={suave([[-14, 10], [-16, -30], [4, -46], [22, -40], [28, -26], [38, -18], [28, -12], [30, -4], [22, 6], [4, 12]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
        <path d={suave([[-18, 12], [-20, -34], [4, -50], [24, -44], [8, -36], [-6, -20], [-10, 20], [-24, 50]], true)} fill={C.negro} />
        <path d="M8 -26 Q 15 -31 22 -26 Q 15 -22 8 -26 Z" fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
        <circle cx={15} cy={-26} r={2.4} fill={C.negro} />
        <Borde d={suave([[-18, -30], [0, -46], [22, -42]])} w={7} color={C.oro} />
      </g>
    );
  }
  switch (tipo) {
    case 'leon':
      return (
        <g>
          <path d={suave([[-30, 20], [-40, -20], [-20, -56], [20, -60], [44, -36], [40, 4], [10, 26]], true)} fill={color} />
          {Array.from({ length: 9 }, (_, i) => <Inc key={i} d={`M${-26 + i * 7} ${-50 + Math.abs(i - 4) * 4} q -6 18 0 36`} w={1.6} />)}
          <path d={suave([[18, -36], [48, -30], [58, -16], [52, 0], boca ? [34, 6] : [40, 2], [22, 4]], true)} fill={color} />
          {boca && <path d="M40 2 L 58 10 L 36 12 Z" fill={C.purpura} />}
          <Ojo x={36} y={-28} />
          <Inc d="M48 -10 q 6 2 8 6" w={1.6} />
        </g>
      );
    case 'toro':
    case 'buey':
      return (
        <g>
          <path d={suave([[-20, 16], [-20, -26], [10, -40], [40, -30], [62, -6], [60, 10], [30, 14]], true)} fill={color} />
          <path d={tipo === 'toro' ? 'M0 -36 C -6 -70, 24 -80, 36 -66 C 20 -66, 14 -56, 14 -36 Z' : 'M2 -34 C 0 -54, 20 -60, 28 -52 C 18 -50, 14 -44, 14 -34 Z'} fill={C.crema} stroke={C.negro} strokeWidth={2} />
          <Ojo x={30} y={-20} />
          <Inc d="M52 2 q 6 -4 6 -10" w={1.6} />
          <path d="M-6 -26 l -18 -10 l 8 14 Z" fill={color} />
        </g>
      );
    case 'caballo':
      return (
        <g>
          <path d={suave([[-16, 20], [-8, -30], [16, -56], [36, -48], [70, -10], [66, 6], [44, 4], [10, 20]], true)} fill={color} />
          <path d="M14 -56 l 4 -18 l 8 16 Z" fill={color} />
          <path d={suave([[-18, 22], [-14, -26], [10, -58]])} stroke={C.purpura} strokeWidth={10} fill="none" strokeLinecap="round" />
          <Ojo x={30} y={-36} />
          <Inc d="M58 -2 q 4 -4 2 -10" w={1.6} />
          <Inc d="M12 -20 L 54 -6" w={1.6} c={C.blanco} />
        </g>
      );
    case 'perro':
    case 'lobo':
      return (
        <g>
          <path d={suave([[-16, 16], [-14, -24], [8, -38], [30, -30], [62, -14], [58, -4], boca ? [36, 2] : [40, 0], [10, 14]], true)} fill={color} />
          <path d="M4 -34 l 6 -26 l 12 22 Z" fill={color} />
          {boca && <path d="M40 0 L 62 4 L 38 10 Z" fill={C.purpura} />}
          <Ojo x={28} y={-22} r={3.5} />
          <Inc d="M-6 -20 q 6 10 2 24" w={1.5} />
        </g>
      );
    case 'jabali':
      return (
        <g>
          <path d={suave([[-20, 20], [-20, -26], [10, -36], [40, -22], [64, -6], [62, 8], [30, 16]], true)} fill={color} />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-20 + i * 7} ${-30 + i * 1} l 2 -14`} stroke={color} strokeWidth={4} />)}
          <path d="M50 6 C 60 -4, 66 -10, 62 -22" stroke={C.crema} strokeWidth={4} fill="none" />
          <Ojo x={26} y={-16} r={3} />
        </g>
      );
    case 'ciervo':
      return (
        <g>
          <path d={suave([[-12, 16], [-6, -30], [14, -46], [32, -38], [58, -14], [52, -2], [12, 14]], true)} fill={color} />
          <path d="M10 -44 C 0 -80, -20 -90, -30 -110 M4 -66 L -20 -70 M-6 -86 L -2 -104 M18 -44 C 30 -80, 44 -90, 40 -116 M28 -70 L 50 -76 M36 -92 L 56 -100" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Ojo x={26} y={-30} r={3.5} />
          {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={-40 - i * 18} cy={30 + (i % 2) * 14} r={4} fill={C.crema} />)}
        </g>
      );
    case 'cabra':
    case 'oveja':
      return (
        <g>
          <path d={suave([[-12, 16], [-8, -24], [12, -38], [30, -30], [50, -10], [44, 2], [12, 14]], true)} fill={tipo === 'oveja' ? C.crema : color} stroke={C.negro} strokeWidth={2} />
          <path d={tipo === 'cabra' ? 'M6 -36 C -10 -70, -40 -66, -36 -44' : 'M4 -30 C -14 -46, -20 -20, -2 -16'} stroke={C.negro} strokeWidth={7} fill="none" strokeLinecap="round" />
          {tipo === 'cabra' && <path d="M40 0 l 4 20 l -12 -12 Z" fill={color} />}
          <Ojo x={26} y={-22} r={3} />
        </g>
      );
    case 'hipopotamo':
      return (
        <g transform="translate(6 34)">
          <path d={suave([[-24, 24], [-26, -24], [0, -46], [34, -40], [70, -30], [90, -8], boca ? [84, 2] : [88, 14], [70, 26], [30, 30]], true)} fill={color} stroke={C.negro} strokeWidth={2.5} />
          {boca && <><path d="M84 2 L 96 34 L 60 30 Z" fill={C.purpura} stroke={C.negro} strokeWidth={2} /><path d="M70 14 l 4 12 l 4 -12 M84 8 l 3 10 l 3 -10" fill={C.blanco} /></>}
          <circle cx={-2} cy={-46} r={8} fill={color} stroke={C.negro} strokeWidth={2} />
          <ellipse cx={22} cy={-44} rx={11} ry={8} fill={color} stroke={C.negro} strokeWidth={2} />
          <Ojo x={24} y={-44} r={3.5} />
          <ellipse cx={80} cy={-20} rx={6} ry={4} fill={C.negro} />
          <Inc d="M40 -20 q 14 -6 26 -4" w={1.6} c={C.negro} />
        </g>
      );
    case 'oso':
      return (
        <g>
          <path d={suave([[-24, 20], [-26, -24], [0, -46], [30, -40], [56, -14], [52, 4], [20, 18]], true)} fill={color} />
          <circle cx={-6} cy={-44} r={12} fill={color} />
          <Ojo x={22} y={-24} />
        </g>
      );
  }
};

/** Cuadrúpedo genérico (león, toro, caballo, perro…) con opciones para quimeras. Origen = suelo. */
export const Cuadrupedo: React.FC<BestiaProps & { tipo: TipoCuadrupedo; ochoPatas?: boolean }> = ({ tipo, x, y = SUELO, s = 1, voltear, opacity = 1, moviendo, corriendo, alas, cabezas = 1, cabezaHumana, colaSerpiente, color = C.negro, contorno, boca, ochoPatas }) => {
  const f = useCurrentFrame();
  const k = s * TAM[tipo];
  const fase = moviendo || corriendo ? f * (corriendo ? 0.38 : 0.2) : 0;
  const amp = corriendo ? 34 : moviendo ? 20 : 0;
  const bote = corriendo ? -Math.abs(Math.sin(fase)) * 10 : 0;
  const lana = tipo === 'oveja';
  const hipo = tipo === 'hipopotamo'; // cuerpo de barril y patas cortas
  const cuerpo: P[] = hipo
    ? [[-136, -116], [-84, -164], [30, -172], [104, -154], [136, -112], [120, -62], [40, -46], [-74, -48], [-132, -72]]
    : [[-124, -132], [-70, -152], [30, -150], [96, -146], [124, -116], [104, -82], [40, -72], [-60, -74], [-120, -92]];
  const pata = (cx: number, ph: number, del: boolean): string => {
    const cad: P = [cx, hipo ? -62 : -96];
    const a = Math.sin(fase + ph) * amp * (hipo ? 0.6 : 1);
    const rod = desde(cad, a, hipo ? 32 : 52);
    const pie = desde(rod, a + (del ? -1 : 1) * (14 + Math.max(0, Math.sin(fase + ph + 1.5)) * 30) * (hipo ? 0.5 : 1), hipo ? 30 : 50);
    return miembro([cad, rod, pie], hipo ? [38, 30, 26] : [30, 16, 11]);
  };
  const ala = alas ? Math.sin(f * 0.25) * 18 : 0;
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${voltear ? -k : k} ${k})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {alas && (
        <g transform={`rotate(${-ala} -10 -140)`}>
          <path d="M-10 -140 C -60 -230, -150 -260, -200 -250 C -170 -220, -160 -200, -170 -180 C -140 -190, -120 -180, -110 -160 C -80 -170, -50 -160, -10 -130 Z" fill={C.purpura} stroke={C.negro} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <Inc key={i} d={`M${-30 - i * 30} ${-150 - i * 12} L ${-60 - i * 34} ${-200 - i * 12}`} w={1.8} c={C.negro} />)}
        </g>
      )}
      {ochoPatas && <><path d={pata(-108, Math.PI * 1.5, false)} fill={color} /><path d={pata(50, Math.PI * 0.5, true)} fill={color} /></>}
      <path d={pata(-90, Math.PI, false)} fill={color} />
      <path d={pata(70, 0, true)} fill={color} />
      {colaSerpiente ? (
        <g>
          <path d={suave([[-120, -110], [-160, -140 + Math.sin(f / 8) * 10], [-190, -120], [-210, -150 + Math.sin(f / 6) * 12]])} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M-210 -150 l 22 -6 l -6 14 Z" fill={color} />
        </g>
      ) : tipo === 'caballo' ? (
        <path d={suave([[-118, -120], [-150, -110 + Math.sin(f / 10) * 6], [-160, -60], [-150, -40]])} stroke={C.purpura} strokeWidth={14} fill="none" strokeLinecap="round" />
      ) : (
        <path d={suave([[-120, -116], [-150, -100 + Math.sin(f / 10) * 8], [-160, -60]])} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      <path d={suave(cuerpo, true)} fill={lana ? C.crema : color} stroke={lana ? C.negro : 'none'} strokeWidth={2} />
      {lana && Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-110 + i * 18} ${-110 + (i % 2) * 14} a 9 9 0 0 1 18 0`} stroke={C.negro} strokeWidth={1.5} fill="none" />)}
      {!lana && (
        <>
          <Inc d={suave([[-60, -140], [-40, -110], [-50, -82]])} w={1.6} />
          <Inc d={suave([[-30, -144], [-14, -112], [-22, -80]])} w={1.6} />
          <Inc d={suave([[60, -140], [80, -112], [70, -84]])} w={1.6} />
        </>
      )}
      <path d={pata(-70, 0, false)} fill={color} />
      <path d={pata(92, Math.PI, true)} fill={color} />
      {ochoPatas && <><path d={pata(-48, Math.PI * 0.5, false)} fill={color} /><path d={pata(112, Math.PI * 1.5, true)} fill={color} /></>}
      {Array.from({ length: cabezas }, (_, i) => {
        const dy = (i - (cabezas - 1) / 2) * 40, dx = Math.abs(i - (cabezas - 1) / 2) * -12;
        return (
          <g key={i} transform={`translate(${116 + dx} ${-150 + dy}) rotate(${(i - (cabezas - 1) / 2) * 10 + Math.sin(f / 14 + i) * 3})`}>
            <path d={miembro([[-30, 30], [-6, 0], [6, -16]], [40, 34, 30])} fill={color} />
            <Cabeza tipo={tipo} color={color} boca={boca} humana={cabezaHumana} />
          </g>
        );
      })}
    </g>
  );
};

/** Serpiente o dragón. Con `cuellos` > 1 es una hidra. Origen = suelo, cola a la izquierda. */
export const Serpiente: React.FC<BestiaProps & { largo?: number; grosor?: number; cuellos?: number; patas?: boolean; erguida?: number; dragon?: boolean; manchas?: boolean }> = ({ x, y = SUELO, s = 1, voltear, opacity = 1, largo = 420, grosor = 34, cuellos = 1, patas, alas, erguida = 0.6, color = C.negro, contorno, boca, dragon, manchas }) => {
  const f = useCurrentFrame();
  const n = 12;
  const cuerpo: P[] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [-largo + t * largo, -grosor / 2 - Math.sin(t * Math.PI * 2.2 + f * 0.12) * 18 * (1 - t * 0.5) - (t > 0.8 ? (t - 0.8) * 5 * 120 * erguida : 0)] as P;
  });
  const anchos = cuerpo.map((_, i) => { const t = i / (n - 1); return Math.max(6, grosor * Math.max(t > 0.5 ? 0.45 * t : 0, Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.08)))); }); // cuello con grosor (no se afina a un hilo)
  const cab = cuerpo[n - 1];
  const kc = Math.max(1, grosor / 40); // las serpientes gruesas (Apep) llevan cabeza proporcionada
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {alas && (
        <path d={`M${-largo * 0.4} ${-grosor} C ${-largo * 0.5} -200, ${-largo * 0.8} ${-230 + Math.sin(f * 0.25) * 30}, ${-largo} ${-210 + Math.sin(f * 0.25) * 30} C ${-largo * 0.8} -170, ${-largo * 0.7} -140, ${-largo * 0.2} ${-grosor}`} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
      )}
      {patas && [-largo * 0.7, -largo * 0.3].map((px, i) => <path key={i} d={miembro([[px, -grosor / 2], [px + 10, -10], [px + 24, 0]], [20, 12, 8])} fill={color} />)}
      <path d={miembro(cuerpo, anchos)} fill={color} />
      {manchas && cuerpo.slice(1, -1).map((p, i) => <ellipse key={`m${i}`} cx={p[0]} cy={p[1]} rx={anchos[i + 1] * 0.32} ry={anchos[i + 1] * 0.22} fill={C.oro} stroke={C.negro} strokeWidth={2} />)}
      {cuerpo.slice(1, -1).map((p, i) => <Inc key={i} d={`M${p[0] - 6} ${p[1] - anchos[i + 1] * 0.25} q 6 ${anchos[i + 1] * 0.25} 0 ${anchos[i + 1] * 0.5}`} w={1.5} />)}
      {Array.from({ length: cuellos }, (_, i) => {
        const ang = cuellos > 1 ? -60 + (i * 120) / (cuellos - 1) : 0;
        const l = cuellos > 1 ? 150 : 0;
        const mov = Math.sin(f / 10 + i * 1.7) * 12;
        const fin: P = [cab[0] + Math.sin(((ang + mov) * Math.PI) / 180) * l + (cuellos > 1 ? 40 : 0), cab[1] - Math.cos(((ang + mov) * Math.PI) / 180) * l];
        return (
          <g key={i}>
            {cuellos > 1 && <path d={suave([cab, [(cab[0] + fin[0]) / 2 + mov, (cab[1] + fin[1]) / 2], fin])} stroke={color} strokeWidth={grosor * 0.55} fill="none" strokeLinecap="round" />}
            <g transform={`translate(${fin[0]} ${fin[1]}) scale(${kc})`}>
              <path d={suave([[-14, 8], [-10, -16], [16, -20], [44, -8], boca ? [30, 0] : [44, 2], [18, 12]], true)} fill={color} />
              {boca && <path d="M30 0 L 50 4 L 28 10 Z" fill={C.purpura} />}
              {dragon && <path d="M-6 -14 l -10 -22 l 16 12 Z M6 -18 l 0 -24 l 10 18 Z" fill={color} />}
              <Ojo x={14} y={-8} r={3} />
              <path d={`M44 0 l ${12 + Math.sin(f / 3) * 4} -4 m -2 4 l ${12 + Math.sin(f / 3) * 4} 4`} stroke={C.purpura} strokeWidth={2} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** Ave grande (águila). Con cabeza humana = sirena/arpía. Origen = centro del cuerpo. */
export const Ave: React.FC<BestiaProps & { aleteo?: boolean; ala2?: string; pico?: string }> = ({ x, y = 400, s = 1, voltear, opacity = 1, cabezaHumana, color = C.negro, aleteo = true, contorno, ala2, pico }) => {
  const f = useCurrentFrame();
  const a = aleteo ? Math.sin(f * 0.35) * 40 : 10;
  const ala = (sg: number) => (
    <path transform={`rotate(${sg * a} -6 -10)`} d="M-6 -10 C -30 -70, -90 -110, -150 -110 C -120 -90, -116 -80, -126 -64 C -96 -70, -84 -60, -80 -46 C -56 -50, -36 -40, -10 4 Z" fill={sg > 0 ? (ala2 ?? C.purpura) : color} stroke={C.negro} strokeWidth={2.5} />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {ala(1)}
      <path d={suave([[-70, 6], [-30, -16], [30, -18], [56, -6], [40, 10], [-20, 18]], true)} fill={color} />
      <path d="M-70 6 L -110 -10 L -104 12 L -114 26 Z" fill={color} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${-20 + i * 16} -10 q 8 8 0 18`} w={1.5} />)}
      <path d="M10 16 l 4 26 m 0 0 l -8 8 m 8 -8 l 8 8 M30 14 l 4 26 m 0 0 l -8 8 m 8 -8 l 8 8" stroke={C.negro} strokeWidth={4} />
      {cabezaHumana ? (
        <g transform="translate(58 -18)">
          <path d={suave([[-8, 16], [-10, -14], [8, -24], [22, -18], [28, -8], [20, -2], [18, 12]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
          <path d={suave([[-12, 18], [-12, -16], [8, -28], [24, -20], [6, -16], [-4, 0], [-10, 40]], true)} fill={C.negro} />
          <circle cx={14} cy={-8} r={2.2} fill={C.negro} />
        </g>
      ) : (
        <g transform="translate(56 -12)">
          <path d={suave([[-8, 12], [-6, -12], [14, -16], [26, -6], [34, 4], [20, 4], [10, 12]], true)} fill={color} />
          <path d="M26 -6 Q 40 -2 34 10 L 26 2 Z" fill={pico ?? C.oro} stroke={C.negro} strokeWidth={1.5} />
          <Ojo x={12} y={-6} r={2.5} />
        </g>
      )}
      {ala(-1)}
    </g>
  );
};

/** Pez o delfín saltando. */
export const Pez: React.FC<BestiaProps & { delfin?: boolean; salto?: number }> = ({ x, y = SUELO, s = 1, voltear, opacity = 1, delfin, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
    <path d={delfin ? suave([[-90, 0], [-40, -26], [30, -28], [70, -12], [96, -6], [70, 2], [10, 14], [-60, 8]], true) : suave([[-50, 0], [-10, -20], [30, -16], [50, 0], [30, 16], [-10, 20]], true)} fill={color} />
    <path d={delfin ? 'M-86 0 L -120 -24 L -110 0 L -120 22 Z M0 -26 L 20 -54 L 30 -26 Z' : 'M-48 0 L -76 -20 L -70 0 L -76 20 Z'} fill={color} />
    <circle cx={delfin ? 56 : 30} cy={delfin ? -14 : -4} r={3} fill={C.crema} />
    <Inc d={delfin ? 'M-40 6 Q 10 14 60 0' : 'M-20 -10 q 6 10 0 20 M0 -12 q 6 12 0 24'} w={1.6} />
  </g>
);

/** Escorpión (los siete de Isis, Serket). Origen = suelo, mira a la derecha. */
export const Escorpion: React.FC<BestiaProps> = ({ x, y = SUELO, s = 1, voltear, opacity = 1, color = '#7A3B1E', moviendo, contorno }) => {
  const f = useCurrentFrame();
  const paso = moviendo ? f * 0.5 : 0;
  const cola: P[] = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6, a = Math.PI * (0.95 - t * 1.05) + Math.sin(f / 12) * 0.08 * t;
    return [-40 + Math.cos(a) * 70 * (0.5 + t * 0.5), -30 - Math.sin(a) * 90 * t] as P;
  });
  const pun = cola[6];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {[0, 1, 2, 3].map((i) => {
        const bx = -24 + i * 16, sw = Math.sin(paso + i * 1.3) * 6;
        return <path key={i} d={`M${bx} -22 L ${bx - 10 + sw} -36 L ${bx - 18 + sw} 0 M${bx + 4} -22 L ${bx + 14 - sw} -34 L ${bx + 20 - sw} 0`} stroke={C.negro} strokeWidth={4} fill="none" strokeLinejoin="round" />;
      })}
      <path d={miembro(cola, [24, 20, 17, 14, 12, 10, 8])} fill={color} stroke={C.negro} strokeWidth={2} />
      {cola.slice(1, -1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2} fill={C.negro} />)}
      <path d={`M${pun[0]} ${pun[1]} q 22 -4 26 14 q -12 -6 -22 -2 Z`} fill={C.negro} />
      <ellipse cx={0} cy={-24} rx={46} ry={18} fill={color} stroke={C.negro} strokeWidth={2.5} />
      {[-20, -6, 8, 22].map((sx) => <path key={sx} d={`M${sx} -40 v 30`} stroke={C.negro} strokeWidth={1.5} />)}
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${40 - k * 6} ${-24 + k * 6}) rotate(${Math.sin(f / 10 + k) * 8})`}>
          <path d="M0 0 L 26 -10 L 40 -4" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M38 -4 C 52 -20, 70 -14, 66 0 L 50 -2 L 64 6 C 58 16, 42 12, 38 -4 Z" fill={color} stroke={C.negro} strokeWidth={2} />
        </g>
      ))}
      <circle cx={34} cy={-32} r={3} fill={C.crema} />
    </g>
  );
};

/** Ave de pie, de cuello largo: ganso (el del mago Djedi) o pelícano. Origen = suelo, mira a la derecha. */
export const AvePie: React.FC<BestiaProps & { especie?: 'ganso' | 'pelicano' | 'gallineta' | 'colimbo'; frente?: string }> = ({ x, y = SUELO, s = 1, voltear, opacity = 1, especie = 'ganso', color, moviendo, contorno, frente }) => {
  const f = useCurrentFrame();
  const pel = especie === 'pelicano', gal = especie === 'gallineta' || especie === 'colimbo'; // gallineta = ʻalae: cuello corto, pico corto
  const colimbo = especie === 'colimbo'; // colimbo (somorgujo): cabeza negra, collar blanco, pico largo y lomo a cuadros; nada (sin patas)
  const cuerpo = color ?? (pel ? '#EDE4D3' : colimbo ? '#22282A' : '#F2EEE4');
  const cab = Math.sin(f / (moviendo ? 5 : 18)) * (moviendo ? 6 : 3);
  const paso = moviendo ? Math.sin(f / 4) * 10 : 0;
  return (
    <g transform={`translate(${x} ${y + (colimbo ? 42 * s : 0)}) scale(${voltear ? -s : s} ${s})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {!colimbo && <path d={`M-6 -40 L ${-10 + paso} 0 M10 -40 L ${12 - paso} 0`} stroke="#D9822B" strokeWidth={5} />}
      {!colimbo && <path d={`M${-18 + paso} 0 h 14 M${4 - paso} 0 h 16`} stroke="#D9822B" strokeWidth={5} strokeLinecap="round" />}
      <path d={suave([[-70, -62], [-40, -96], [20, -100], [46, -80], [40, -52], [0, -38], [-50, -44]], true)} fill={cuerpo} stroke={C.negro} strokeWidth={2.5} />
      <path d={suave([[-56, -66], [-20, -84], [20, -76]])} stroke={C.negro} strokeWidth={1.5} fill="none" />
      <path d="M-70 -62 L -92 -70 L -78 -54 Z" fill={cuerpo} stroke={C.negro} strokeWidth={2} />
      {colimbo && Array.from({ length: 12 }, (_, i) => <rect key={`cb${i}`} x={-46 + (i % 6) * 13} y={-86 + Math.floor(i / 6) * 12} width={5} height={5} fill="#F2EEE4" />)}
      {gal ? (
        <g transform={`translate(40 -86) rotate(${cab * 1.5})`}>
          <path d={suave([[0, 6], [8, -10], [14, -20]])} stroke={C.negro} strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d={suave([[0, 6], [8, -10], [14, -20]])} stroke={cuerpo} strokeWidth={17} fill="none" strokeLinecap="round" />
          <ellipse cx={18} cy={-24} rx={15} ry={12} fill={cuerpo} stroke={C.negro} strokeWidth={2} />
          {frente && <path d="M24 -36 C 34 -36, 38 -28, 34 -22 L 28 -26 Z" fill={frente} stroke={C.negro} strokeWidth={1.5} />}
          {colimbo ? <path d="M30 -28 L 62 -22 L 30 -18 Z" fill="#2A2E30" stroke={C.negro} strokeWidth={1.5} /> : <path d="M31 -27 L 46 -22 L 31 -18 Z" fill={frente ? '#F2E8D8' : '#E8C46A'} stroke={C.negro} strokeWidth={1.5} />}
          {colimbo && <path d="M0 -2 C 6 -8, 14 -8, 18 -4" stroke="#F2EEE4" strokeWidth={3} strokeDasharray="3 3" fill="none" />}
          <circle cx={22} cy={-27} r={2.6} fill="#C8321E" />
        </g>
      ) : (
      <g transform={`translate(36 -84) rotate(${cab})`}>
        <path d={suave([[0, 4], [10, -40], [6, -80], [14, -100]])} stroke={C.negro} strokeWidth={pel ? 17 : 15} fill="none" strokeLinecap="round" />
        <path d={suave([[0, 4], [10, -40], [6, -80], [14, -100]])} stroke={cuerpo} strokeWidth={pel ? 12 : 10} fill="none" strokeLinecap="round" />
        <ellipse cx={18} cy={-102} rx={14} ry={11} fill={cuerpo} stroke={C.negro} strokeWidth={2} />
        {pel
          ? <path d="M28 -106 L 92 -96 L 86 -90 Q 60 -64 30 -92 Z" fill="#E8B04A" stroke={C.negro} strokeWidth={2} />
          : <path d="M28 -106 L 50 -100 L 30 -94 Z" fill="#D9822B" stroke={C.negro} strokeWidth={2} />}
        <circle cx={20} cy={-105} r={2.6} fill={C.negro} />
      </g>
      )}
    </g>
  );
};

/** Animales chicos de tierra: honu (tortuga marina), moʻo (gecko) y rata. Origen = suelo, miran a la derecha. */
export const Bichito: React.FC<BestiaProps & { especie: 'honu' | 'moo' | 'rata' | 'tortuga' | 'castor' | 'nutria' | 'arana' | 'escarabajo'; cuenco?: boolean }> = ({ x, y = SUELO, s = 1, voltear, opacity = 1, especie, color, moviendo, contorno, cuenco }) => {
  const f = useCurrentFrame();
  const p = moviendo ? Math.sin(f / 4) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity} filter={contorno ? 'url(#contornoV)' : undefined}>
      {especie === 'honu' && (
        <g>
          <path d={`M-58 -8 l -22 ${10 + p * 6} l 18 -2 Z M48 -10 l 30 ${12 - p * 6} l -26 -4 Z`} fill={color ?? '#6B7A3A'} stroke={C.negro} strokeWidth={2} />
          <path d="M-70 -6 C -66 -52, 56 -56, 62 -6 Z" fill="#7A5A2E" stroke={C.negro} strokeWidth={3} />
          {[-40, -12, 16, 42].map((cx) => <path key={cx} d={`M${cx - 12} -30 l 12 -10 l 12 10 l -6 14 h -12 Z`} fill="#A07A3A" stroke={C.negro} strokeWidth={1.5} />)}
          <path d={`M60 -14 C 74 -24, 92 -20, 92 -10 C 92 -2, 78 0, 62 -4 Z`} fill={color ?? '#6B7A3A'} stroke={C.negro} strokeWidth={2} />
          <circle cx={84} cy={-14} r={2.2} fill={C.negro} />
        </g>
      )}
      {especie === 'moo' && (
        <g>
          <path d={suave([[-70, -6 + p * 3], [-40, -10], [0, -12], [30, -12], [52, -14], [66, -10], [52, -6], [30, -4], [0, -2], [-40, -4]], true)} fill={color ?? '#7A8A3A'} stroke={C.negro} strokeWidth={2} />
          {[[-20, 1], [20, -1]].map(([px, k], i) => <path key={i} d={`M${px} -6 l ${-8 + p * 6 * k} 10 m 0 0 l -6 2 m 6 -2 l 2 6 M${px + 6} -6 l ${10 - p * 6 * k} 10 m 0 0 l 6 2 m -6 -2 l -2 6`} stroke={C.negro} strokeWidth={3} fill="none" />)}
          <circle cx={58} cy={-12} r={2} fill={C.negro} />
          {[-30, -10, 10].map((px) => <circle key={px} cx={px} cy={-8} r={2.5} fill={C.crema} opacity={0.6} />)}
        </g>
      )}
      {especie === 'tortuga' && ( // tortuga de tierra/agua dulce: caparazón alto, patas cortas
        <g>
          {[-46, -20, 22, 46].map((lx, i) => <path key={i} d={`M${lx} -14 l ${(i % 2 ? 4 : -4) + p * 4 * (i % 2 ? 1 : -1)} 16 h 14 l -2 -16 Z`} fill={color ?? '#6E7A3A'} stroke={C.negro} strokeWidth={2} />)}
          <path d="M-62 -14 L -84 -6 L -62 -4 Z" fill={color ?? '#6E7A3A'} stroke={C.negro} strokeWidth={2} />
          <path d={`M58 -22 C 70 -40, 96 -40, 100 -26 C 102 -16, 88 -12, 64 -12 Z`} fill={color ?? '#6E7A3A'} stroke={C.negro} strokeWidth={2} />
          <path d="M94 -26 L 104 -22 L 96 -18" fill="#4A4A2A" stroke={C.negro} strokeWidth={1.4} />
          <circle cx={88} cy={-30} r={2.6} fill={C.negro} />
          <path d="M-70 -10 C -66 -78, 66 -82, 70 -10 Z" fill="#5E5A2E" stroke={C.negro} strokeWidth={3} />
          {[[-36, -36], [0, -52], [36, -36], [-18, -18], [18, -18]].map(([cx, cy], i) => <path key={i} d={`M${cx - 16} ${cy} l 8 -12 h 16 l 8 12 l -8 12 h -16 Z`} fill="#7E7A3E" stroke={C.negro} strokeWidth={1.5} />)}
          <path d="M-70 -10 C -30 -2, 30 -2, 70 -10" stroke="#C98A3A" strokeWidth={4} fill="none" />
        </g>
      )}
      {especie === 'castor' && (
        <g>
          <path d={`M-48 -10 C -70 ${-14 + p * 3}, -96 ${-12 + p * 3}, -104 -2 C -96 6, -70 4, -48 -2 Z`} fill="#4A3A2E" stroke={C.negro} strokeWidth={2} />
          {[-92, -80, -68].map((cx) => <path key={cx} d={`M${cx} -10 v 10`} stroke="#2A201A" strokeWidth={1.5} />)}
          <path d={suave([[-50, -4], [-46, -40], [-6, -52], [30, -40], [52, -24], [60, -10], [40, -2]], true)} fill={color ?? '#7A4E2E'} stroke={C.negro} strokeWidth={2} />
          <circle cx={26} cy={-44} r={6} fill="#6A4026" stroke={C.negro} strokeWidth={1.5} />
          <circle cx={44} cy={-30} r={2.4} fill={C.negro} />
          <path d="M58 -12 v 8 h 4 v -8" fill="#F2EEE4" stroke={C.negro} strokeWidth={1} />
          <path d={`M-20 -4 l -4 ${6 + p * 3} M20 -4 l 4 ${6 - p * 3}`} stroke={C.negro} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      {especie === 'nutria' && (
        <g>
          <path d={`M-40 -12 C -70 ${-10 + p * 4}, -100 ${-2 + p * 4}, -120 4 C -96 -4, -70 -6, -40 -4 Z`} fill={color ?? '#5A3E2A'} stroke={C.negro} strokeWidth={2} />
          <path d={suave([[-44, -6], [-30, -30], [20, -34], [56, -30], [76, -22], [84, -14], [62, -6], [10, -2]], true)} fill={color ?? '#5A3E2A'} stroke={C.negro} strokeWidth={2} />
          <circle cx={60} cy={-32} r={4} fill={color ?? '#5A3E2A'} stroke={C.negro} strokeWidth={1.4} />
          <path d={suave([[56, -16], [76, -16], [84, -12]])} stroke="#D9C8A8" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={72} cy={-24} r={2.3} fill={C.negro} />
          <path d="M84 -16 l 12 -4 M84 -14 l 12 2" stroke={C.negro} strokeWidth={1} />
          <path d={`M-16 -4 l -6 ${6 + p * 3} M34 -6 l 6 ${6 - p * 3}`} stroke={C.negro} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      {especie === 'arana' && ( // araña (la Araña de Agua cherokee; con `cuenco`, el cuenco tejido con la brasa)
        <g>
          {[0, 1, 2, 3].map((i) => { const ax = -14 + i * 10, sw = Math.sin(f / 3 + i) * (moviendo ? 5 : 1); return <g key={i}>
            <path d={`M${ax} -22 Q ${ax - 26 - i * 4 + sw} -46, ${ax - 34 - i * 6 + sw} 0`} stroke={C.negro} strokeWidth={3.2} fill="none" strokeLinecap="round" />
            <path d={`M${ax + 4} -22 Q ${ax + 30 + i * 2 - sw} -44, ${ax + 36 + i * 4 - sw} 0`} stroke={C.negro} strokeWidth={3.2} fill="none" strokeLinecap="round" />
          </g>; })}
          <ellipse cx={-22} cy={-30} rx={24} ry={18} fill={color ?? '#3A2E2A'} stroke={C.negro} strokeWidth={2} />
          {[-34, -22, -10].map((cx) => <circle key={cx} cx={cx} cy={-34} r={2.4} fill="#C98A3A" opacity={0.8} />)}
          <ellipse cx={8} cy={-26} rx={13} ry={11} fill={color ?? '#3A2E2A'} stroke={C.negro} strokeWidth={2} />
          <circle cx={14} cy={-29} r={2.2} fill="#F2EEE4" /><circle cx={18} cy={-26} r={1.6} fill="#F2EEE4" />
          {cuenco && <g transform="translate(-22 -48)">
            <circle cx={0} cy={-10} r={18 + Math.sin(f / 5) * 2} fill="url(#halo)" />
            <path d="M-20 0 C -18 16, 18 16, 20 0 Z" fill="#B88A4A" stroke={C.negro} strokeWidth={1.8} />
            {[-12, -4, 4, 12].map((cx) => <path key={cx} d={`M${cx} 2 l 2 8`} stroke="#7A5A2A" strokeWidth={1.2} />)}
            <ellipse cx={0} cy={-2} rx={9} ry={5} fill="#FF7A2A" stroke="#9E1E0C" strokeWidth={1.2} />
          </g>}
        </g>
      )}
      {especie === 'escarabajo' && ( // escarabajo de agua (Dâyuni'sï, "el nieto del castor")
        <g>
          {[-18, 0, 18].map((lx, i) => <path key={i} d={`M${lx} -10 L ${lx - 16 + p * 6 * (i % 2 ? 1 : -1)} 2 L ${lx - 26} 0`} stroke={C.negro} strokeWidth={3} fill="none" strokeLinecap="round" />)}
          <path d="M-40 -14 C -40 -40, 34 -42, 40 -16 C 34 -4, -34 -2, -40 -14 Z" fill={color ?? '#2A3A3A'} stroke={C.negro} strokeWidth={2} />
          <path d="M-30 -20 C -10 -34, 20 -34, 34 -18" stroke="#9AB8B0" strokeWidth={3} fill="none" opacity={0.7} />
          <path d="M-2 -38 V -6" stroke={C.negro} strokeWidth={1.5} />
          <ellipse cx={46} cy={-16} rx={9} ry={7} fill={color ?? '#2A3A3A'} stroke={C.negro} strokeWidth={1.8} />
          <circle cx={50} cy={-18} r={1.8} fill="#E8C46A" />
          <path d="M52 -22 l 10 -8 M52 -20 l 12 -3" stroke={C.negro} strokeWidth={1.4} />
        </g>
      )}
      {especie === 'rata' && (
        <g>
          <path d={`M-30 -10 C -60 -6, -80 ${-20 + p * 4}, -96 -30`} stroke={C.negro} strokeWidth={3} fill="none" />
          <path d={suave([[-32, -4], [-30, -22], [0, -30], [26, -20], [44, -10], [30, -2]], true)} fill={color ?? '#6B5A4A'} stroke={C.negro} strokeWidth={2} />
          <circle cx={14} cy={-28} r={7} fill="#B08A7A" stroke={C.negro} strokeWidth={1.5} />
          <circle cx={30} cy={-14} r={2} fill={C.negro} />
          <path d={`M-14 -2 v 6 M14 -2 v 6`} stroke={C.negro} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};
