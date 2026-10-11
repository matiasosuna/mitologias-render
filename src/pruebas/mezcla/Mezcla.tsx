// Prueba de 10 s: figuras de vasija griega (figuras negras) dibujadas a mano sobre papel limpio.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, registerRoot, Composition } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Caveat';
import { Trazo, Tinta, Relleno, Papel, elipse, azar, usePaso, M, TINTA, P } from '../dibujado/lapiz';

const { fontFamily: MANO } = loadFont('normal', { weights: ['700'], subsets: ['latin'] });
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const k = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
const CREMA = '#F3E6C8';
const TERRA = '#C8642D';
const PURPURA = '#8E3420'; // el rojo-púrpura de los detalles en las vasijas

const NEGRO = (props: { forma: P[]; seed: number; prog?: number }) => (
  <>
    <Relleno forma={props.forma} color="#1E1A17" seed={props.seed} ancho={9} o={0.95} correr={3} prog={props.prog} />
    <Relleno forma={props.forma} color="#1E1A17" seed={props.seed + 500} ancho={9} ang={50} o={0.9} correr={2} prog={props.prog} />
    <Tinta pts={props.forma} seed={props.seed + 1} g={4} cerrar prog={props.prog} />
  </>
);

/** Guarda de meandro dibujada a mano con banda de barro. */
const Guarda: React.FC<{ y: number; seed: number; prog: number }> = ({ y, seed, prog }) => {
  const banda: P[] = [[40, y], [1880, y + 4], [1878, y + 64], [42, y + 60]];
  const n = 26, w = 1840 / n;
  const pts: P[] = [];
  for (let i = 0; i < n; i++) {
    const x = 40 + i * w;
    pts.push([x, y + 52], [x, y + 12], [x + w * 0.8, y + 12], [x + w * 0.8, y + 42], [x + w * 0.3, y + 42], [x + w * 0.3, y + 26], [x + w * 0.55, y + 26], [x + w * 0.55, y + 32]);
    pts.push([x + w * 0.55, y + 52]);
  }
  return (
    <>
      <Relleno forma={banda} color={TERRA} seed={seed} ancho={22} o={0.55} prog={prog} correr={5} />
      <Trazo pts={pts} seed={seed + 1} g={4} prog={prog} amp={1.4} />
      <Trazo pts={[[36, y], [1884, y + 4]]} seed={seed + 2} g={5} prog={prog} />
      <Trazo pts={[[38, y + 62], [1882, y + 64]]} seed={seed + 3} g={5} prog={prog} />
    </>
  );
};

/** Dos dibujos de la carrera "arrodillada" de las vasijas arcaicas, alternados. */
const POSES = [
  { piernaD: [[0, -150], [62, -84], [96, -2]], piernaT: [[-6, -150], [-30, -20], [-120, -40]], brazoT: [[0, -244], [-40, -212], [-80, -232]] },
  { piernaD: [[0, -150], [48, -70], [52, -2]], piernaT: [[-6, -150], [-56, -70], [-118, -12]], brazoT: [[0, -244], [-36, -206], [-66, -180]] },
] as const;

const Prometeo: React.FC<{ x: number; y: number; s: number; pose: number; prog: number }> = ({ x, y, s, pose, prog }) => {
  const p = POSES[pose % 2];
  const paso = usePaso(4);
  const ola = Math.sin(paso * 1.3) * 10;
  const capa: P[] = [[-14, -258], [-90, -246 + ola], [-170, -222 - ola], [-150, -196 + ola], [-60, -176], [-18, -186]];
  const torso: P[] = [[-30, -262], [26, -266], [22, -150], [-24, -150]];
  const falda: P[] = [[-28, -160], [26, -160], [52, -104], [-48, -98]];
  const barba: P[] = [[4, -276], [42, -268], [36, -244], [24, -236], [0, -258]];
    const cara: P[] = [[-30, -296], [-24, -318], [-6, -330], [16, -328], [30, -314], [33, -302], [46, -291], [35, -287], [38, -279], [30, -272], [6, -262], [-14, -260], [-30, -272]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* capa ondeando, en púrpura */}
      <Relleno forma={capa} color={PURPURA} seed={801} ancho={10} o={0.85} correr={4} prog={prog} />
      <Tinta pts={capa} seed={802} g={4} cerrar prog={prog} />
      <Trazo pts={[[-40, -238], [-120, -214 + ola * 0.5]]} seed={803} g={2.5} color={CREMA} prog={prog} />
      <Trazo pts={[[-40, -214], [-110, -200 - ola * 0.5]]} seed={804} g={2.5} color={CREMA} prog={prog} />
      {/* brazo y pierna de atrás */}
      <Trazo pts={p.brazoT as unknown as P[]} seed={810 + pose} g={18} prog={prog} />
      <Trazo pts={p.piernaT as unknown as P[]} seed={812 + pose} g={24} prog={prog} />
      <Trazo pts={[(p.piernaT[2] as unknown as P), [p.piernaT[2][0] - 24, p.piernaT[2][1] + 6]]} seed={814} g={12} prog={prog} />
      {/* cuerpo */}
      <NEGRO forma={falda} seed={820} prog={prog} />
      <NEGRO forma={torso} seed={822} prog={prog} />
      <NEGRO forma={cara} seed={824} prog={prog} />
      <NEGRO forma={barba} seed={828} prog={prog} />
      {/* pierna de adelante */}
      <Trazo pts={p.piernaD as unknown as P[]} seed={830 + pose} g={24} prog={prog} />
      <Trazo pts={[(p.piernaD[2] as unknown as P), [p.piernaD[2][0] + 30, p.piernaD[2][1] + 2]]} seed={832} g={12} prog={prog} />
      {/* detalles grabados en crema, como en la cerámica */}
      <g opacity={prog >= 1 ? 1 : 0}>
        <Trazo pts={[[10, -304], [19, -309], [28, -304], [19, -300], [10, -304]]} seed={840} g={3} color={CREMA} amp={0.6} />
        <Trazo pts={[[20, -305], [21, -303]]} seed={841} g={5} color={TINTA} amp={0.3} />
        <Trazo pts={[[-26, -300], [-6, -312], [22, -316]]} seed={844} g={3} color={CREMA} />
        {[0, 1, 2].map((i) => <Trazo key={i} pts={[[10 + i * 8, -270], [16 + i * 7, -246]]} seed={845 + i} g={2} color={CREMA} />)}
        {[0, 1, 2].map((i) => <Trazo key={i} pts={elipse(-28 + i * 4, -276 + i * 12, 5, 5, 850 + i, 10)} seed={853 + i} g={2} color={CREMA} />)}
        <Trazo pts={[[-6, -250], [16, -232], [10, -206]]} seed={856} g={2.5} color={CREMA} />
        <Trazo pts={[[-26, -160], [26, -160]]} seed={857} g={4} color={CREMA} />
        <Trazo pts={[[-26, -152], [26, -152]]} seed={858} g={2} color={CREMA} />
        {[-14, 0, 14, 28].map((dx, i) => <Trazo key={dx} pts={[[dx - 4, -146], [dx + (i - 1) * 6, -104]]} seed={860 + i} g={2} color={CREMA} />)}
        {[0, 1, 2, 3, 4].map((i) => <Trazo key={i} pts={[[-40 + i * 20, -110], [-36 + i * 20, -100]]} seed={865 + i} g={3} color={CREMA} />)}
      </g>
      {/* brazo de adelante con la caña de hinojo */}
      <Trazo pts={[[4, -244], [46, -214], [88, -246]]} seed={870} g={18} prog={prog} />
    </g>
  );
};

const gota = (cx: number, base: number, w: number, h: number, lean: number): P[] => {
  const lado = (sg: number) => Array.from({ length: 12 }, (_, i) => {
    const t = i / 11, ancho = w * Math.sin(Math.PI * Math.pow(1 - t, 1.6));
    return [cx + sg * ancho + lean * t * t, base - h * t] as P;
  });
  return [...lado(1), ...lado(-1).reverse()];
};

const Llama: React.FC<{ x: number; y: number; s: number; seed: number }> = ({ x, y, s, seed }) => {
  const paso = usePaso(4), r = azar(seed + paso);
  const capas: [string, number, number][] = [[M.rojo, 46, 120], [M.naranja, 32, 84], [M.amarillo, 18, 48]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {capas.map(([c, w, h], i) => {
        const fr = gota(0, 0, w, h * (0.85 + r() * 0.3), -30 - r() * 40);
        return (
          <g key={i}>
            <Relleno forma={fr} color={c} seed={seed + i * 7} ancho={9} o={0.9} correr={5} />
            {i === 0 && <Trazo pts={fr} seed={seed + 30} g={3.5} cerrar />}
          </g>
        );
      })}
    </g>
  );
};

export const Mezcla: React.FC = () => {
  const f = useCurrentFrame();
  const paso = usePaso(4);
  const pose = Math.floor(f / 6) % 2; // dos dibujos, 5 cambios por segundo
  const t = Math.floor(f / 3) * 3;
  const x = interpolate(t, [20, 300], [420, 1460], cl);
  const y = interpolate(x, [300, 1700], [640, 820], cl) + (pose ? -8 : 0);
  const s = 1.25;
  const mano: P = [x + 88 * s, y - 246 * s];
  const punta: P = [mano[0] + 120, mano[1] - 120];
  return (
    <AbsoluteFill>
      <Audio src={staticFile('musica/lira-griega.wav')} volume={(fr) => interpolate(fr, [0, 20, 270, 300], [0, 0.18, 0.18, 0], cl)} />
      <Sequence from={24}>
        <Audio src={staticFile('audio/prueba-mezcla/frase.wav')} />
      </Sequence>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Papel />
        <Guarda y={40} seed={900} prog={k(f, 0, 14)} />
        <Guarda y={850} seed={910} prog={k(f, 4, 18)} />
        {/* Olimpo a lo lejos */}
        <g opacity={0.9}>
          <Tinta pts={[[60, 560], [220, 330], [300, 260], [380, 300], [560, 560]]} seed={920} g={4} prog={k(f, 6, 20)} />
          {[0, 1, 2, 3, 4, 5].map((i) => <Trazo key={i} pts={[[200 + i * 30, 380 + i * 18], [250 + i * 30, 360 + i * 18]]} seed={921 + i} g={2} color="#6B6258" prog={k(f, 12, 22)} />)}
          <Tinta pts={[[250, 262], [300, 236], [350, 262], [250, 262]]} seed={930} g={3.5} prog={k(f, 14, 24)} />
          {[262, 284, 306, 328].map((cx, i) => <Trazo key={cx} pts={[[cx, 266], [cx, 296]]} seed={931 + i} g={3} prog={k(f, 16, 26)} />)}
          <Trazo pts={[[244, 300], [356, 300]]} seed={936} g={3.5} prog={k(f, 18, 28)} />
          <text x={300} y={210} fontFamily={MANO} fontWeight={700} fontSize={40} fill="#6B6258" textAnchor="middle" transform="rotate(-4 300 210)" opacity={k(f, 24, 32)}>Olimpo</text>
        </g>
        {/* ladera */}
        <Tinta pts={[[40, 600], [400, 650], [900, 720], [1400, 790], [1880, 836]]} seed={940} g={5} prog={k(f, 8, 22)} />
        {Array.from({ length: 16 }, (_, i) => {
          const hx = 100 + i * 110, hy = 610 + (hx / 1880) * 230;
          return <Trazo key={i} pts={[[hx, hy + 14], [hx + 24, hy + 34]]} seed={950 + i} g={2.5} color="#6B6258" prog={k(f, 14, 26)} />;
        })}
        {/* estela de chispas */}
        {Array.from({ length: 8 }, (_, i) => {
          const d = (i + 1) * 40, a = azar(970 + i + paso)();
          return <Trazo key={i} pts={[[punta[0] - d, punta[1] - 30 - a * 40], [punta[0] - d - 6, punta[1] - 36 - a * 40]]} seed={980 + i} g={6} color={i % 2 ? M.naranja : M.amarillo} o={1 - i / 8} />;
        })}
        <Tinta pts={[mano, [mano[0] + 40, mano[1] - 40], [mano[0] + 80, mano[1] - 80], punta]} seed={990} g={8} color="#5E6B2F" prog={k(f, 18, 30)} />
        {[0.3, 0.6].map((u, i) => (
          <Trazo key={i} pts={[[mano[0] + 120 * u - 8, mano[1] - 120 * u + 2], [mano[0] + 120 * u + 6, mano[1] - 120 * u - 10]]} seed={995 + i} g={4} color="#5E6B2F" />
        ))}
        <Llama x={punta[0]} y={punta[1] + 14} s={0.85} seed={1000} />
        <Prometeo x={x} y={y} s={s} pose={pose} prog={k(f, 10, 30)} />
        <text x={x + 40} y={y - 470} fontFamily={MANO} fontWeight={700} fontSize={46} fill={TINTA} textAnchor="middle" transform={`rotate(-6 ${x + 40} ${y - 470})`} opacity={k(f, 200, 206)}>¡ya casi!</text>
        <text x={960} y={1010} fontFamily={MANO} fontWeight={700} fontSize={44} fill={TINTA} textAnchor="middle" transform="rotate(-0.6 960 1010)">
          {'Prometeo escondió el fuego en una caña de hinojo… y bajó corriendo a entregárselo a los humanos.'.slice(0, Math.floor(interpolate(f, [24, 60], [0, 96], cl)))}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

registerRoot(() => <Composition id="prueba-mezcla" component={Mezcla} durationInFrames={300} fps={30} width={1920} height={1080} />);
