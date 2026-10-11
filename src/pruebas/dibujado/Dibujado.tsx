import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Caveat';
import { Trazo, Tinta, Relleno, Papel, elipse, estrella, azar, usePaso, useEnDos, M, TINTA, P } from './lapiz';
import timeline from './timeline.json';

const { fontFamily: MANO } = loadFont('normal', { weights: ['500', '700'], subsets: ['latin'] });
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const k = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);

// ---------- Piezas ----------

const MARCO: P[] = [[110, 72], [1812, 66], [1806, 852], [116, 858]];
const Marco: React.FC<{ fondo: string; seed: number; f: number; o?: number }> = ({ fondo, seed, f, o = 0.5 }) => (
  <>
    <Relleno forma={MARCO} color={fondo} seed={seed} ancho={40} ang={-28} o={o} prog={k(f, 0, 16)} correr={4} />
    <Tinta pts={MARCO} seed={seed + 1} g={8} cerrar prog={k(f, 0, 12)} />
  </>
);

/** Texto escrito a mano que aparece letra por letra. */
const Mano: React.FC<{ x: number; y: number; texto: string; tam?: number; desde: number; rot?: number; color?: string; dur?: number; ancla?: 'start' | 'middle' }> = ({ x, y, texto, tam = 54, desde, rot = -2, color = TINTA, dur, ancla = 'middle' }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [desde, desde + (dur ?? texto.length * 1.3)], [0, texto.length], cl));
  if (n <= 0) return null;
  return (
    <text x={x} y={y} fontFamily={MANO} fontWeight={700} fontSize={tam} fill={color} textAnchor={ancla} transform={`rotate(${rot} ${x} ${y})`}>
      {texto.slice(0, n)}
    </text>
  );
};

const Flecha: React.FC<{ a: P; b: P; seed: number; prog: number }> = ({ a, b, seed, prog }) => {
  const m: P = [(a[0] + b[0]) / 2 + 30, (a[1] + b[1]) / 2 - 30];
  const ang = Math.atan2(b[1] - m[1], b[0] - m[0]);
  const punta = (d: number): P => [b[0] - Math.cos(ang + d) * 26, b[1] - Math.sin(ang + d) * 26];
  return (
    <>
      <Trazo pts={[a, m, b]} seed={seed} g={4} prog={prog} />
      {prog >= 1 && <Trazo pts={[punta(0.5), b, punta(-0.5)]} seed={seed + 1} g={4} />}
    </>
  );
};

type PersonaProps = { x: number; y: number; s?: number; seed: number; fase?: number; bI?: number; bD?: number; tunica: string; voltear?: boolean; prog?: number; barba?: boolean };
/** Personaje de pie, de perfil, mirando a la derecha. Origen = pies. */
const Persona: React.FC<PersonaProps> = ({ x, y, s = 1, seed, fase = 0, bI = -10, bD = 15, tunica, voltear, prog = 1, barba }) => {
  const hombro: P = [0, -150];
  const brazo = (a: number): P => [hombro[0] + Math.sin((a * Math.PI) / 180) * 72, hombro[1] + Math.cos((a * Math.PI) / 180) * 72];
  const pierna = (dx: number, a: number): P[] => {
    const pie: P = [dx + Math.sin((a * Math.PI) / 180) * 78, -78 + Math.cos((a * Math.PI) / 180) * 78];
    return [[dx, -80], pie, [pie[0] + 18, pie[1] + 2]];
  };
  const tun: P[] = [[-22, -160], [22, -160], [36, -74], [-36, -74]];
  const hI = brazo(bI), hD = brazo(bD);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      <Tinta pts={[hombro, hI]} seed={seed + 1} g={9} prog={prog} />
      <Tinta pts={pierna(-6, -fase)} seed={seed + 2} g={9} prog={prog} />
      <Tinta pts={pierna(6, fase)} seed={seed + 3} g={9} prog={prog} />
      <Relleno forma={tun} color={tunica} seed={seed + 4} ancho={12} prog={prog} />
      <Tinta pts={tun} seed={seed + 5} g={8} cerrar prog={prog} />
      <Trazo pts={[[-26, -116], [28, -118]]} seed={seed + 6} g={4} prog={prog} />
      <Relleno forma={elipse(2, -192, 25, 28, seed + 7)} color={M.piel} seed={seed + 8} ancho={10} o={0.55} prog={prog} />
      <Tinta pts={elipse(2, -192, 25, 28, seed + 7)} seed={seed + 9} g={8} prog={prog} />
      <Trazo pts={[[-20, -205], [-6, -222], [10, -219], [26, -208]]} seed={seed + 10} g={9} prog={prog} />
      <Trazo pts={[[-22, -196], [-26, -178]]} seed={seed + 11} g={9} prog={prog} />
      <Trazo pts={[[12, -197], [13, -195]]} seed={seed + 12} g={9} prog={prog} />
      <Trazo pts={[[25, -194], [33, -184], [25, -181]]} seed={seed + 13} g={4} prog={prog} />
      {barba && <Trazo pts={[[4, -170], [16, -158], [26, -170]]} seed={seed + 14} g={8} prog={prog} />}
      <Tinta pts={[hombro, hD]} seed={seed + 15} g={9} prog={prog} />
      <Trazo pts={elipse(hD[0], hD[1], 6, 6, seed + 16, 12)} seed={seed + 17} g={5} prog={prog} />
    </g>
  );
};

/** Humano sentado abrazándose las rodillas. */
const Sentado: React.FC<{ x: number; y: number; seed: number; frio: number; feliz: number; prog: number; s?: number }> = ({ x, y, seed, frio, feliz, prog, s = 1 }) => {
  const paso = usePaso(2), r = azar(seed + paso);
  const tx = frio * (r() - 0.5) * 8;
  const cuerpo: P[] = [[-30, -100], [22, -104], [44, -24], [-40, -18]];
  const brazoArriba = feliz > 0.5;
  return (
    <g transform={`translate(${x + tx} ${y}) scale(${s})`}>
      <Relleno forma={cuerpo} color={['#7FA7D9', '#6E9B4E', '#F6C63B'][Math.abs(seed) % 3]} seed={seed + 1} ancho={12} prog={prog} />
      <Tinta pts={cuerpo} seed={seed + 2} g={8} cerrar prog={prog} />
      <Tinta pts={elipse(34, -46, 22, 20, seed + 3)} seed={seed + 4} g={5} prog={prog} />
      <Relleno forma={elipse(-2, -128, 24, 26, seed + 5)} color={M.piel} seed={seed + 6} ancho={10} o={0.5} prog={prog} />
      <Tinta pts={elipse(-2, -128, 24, 26, seed + 5)} seed={seed + 7} g={6} prog={prog} />
      <Trazo pts={[[8, -134], [9, -132]]} seed={seed + 8} g={9} prog={prog} />
      <Trazo pts={feliz > 0.5 ? [[2, -118], [10, -112], [18, -119]] : [[3, -114], [10, -117], [17, -114]]} seed={seed + 9} g={4} prog={prog} />
      {brazoArriba ? (
        <>
          <Tinta pts={[[-6, -96], [-34, -150], [-40, -176]]} seed={seed + 10} g={7} />
          <Tinta pts={[[10, -96], [44, -150], [52, -174]]} seed={seed + 11} g={7} />
        </>
      ) : (
        <Tinta pts={[[-4, -92], [30, -66], [52, -52]]} seed={seed + 12} g={9} prog={prog} />
      )}
    </g>
  );
};

/** Llama en forma de gota, panzona abajo y con la punta que se mueve. */
const gota = (cx: number, base: number, w: number, h: number, lean: number): P[] => {
  const lado = (sg: number) => Array.from({ length: 12 }, (_, i) => {
    const t = i / 11, ancho = w * Math.sin(Math.PI * Math.pow(1 - t, 1.6));
    return [cx + sg * ancho + lean * t * t, base - h * t] as P;
  });
  return [...lado(1), ...lado(-1).reverse()];
};
/** Fuego que titila: tres llamas de marcador y chispas. */
const Fuego: React.FC<{ x: number; y: number; s?: number; seed: number; prog?: number }> = ({ x, y, s = 1, seed, prog = 1 }) => {
  const paso = usePaso(3), r = azar(seed * 7 + paso);
  if (prog <= 0) return null;
  const h = (b: number) => b * (0.85 + r() * 0.3) * prog;
  const capas: [string, number, number][] = [[M.rojo, 62, 150], [M.naranja, 44, 105], [M.amarillo, 26, 62]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {capas.map(([c, w, hh], i) => {
        const forma = gota((r() - 0.5) * 6, 0, w, h(hh), (r() - 0.5) * 50);
        return (
          <g key={i}>
            <Relleno forma={forma} color={c} seed={seed + i * 11} ancho={11} o={0.9} correr={6} />
            {i === 0 && <Trazo pts={forma} seed={seed + 50} g={4} cerrar />}
          </g>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const t = ((paso * 3 + i * 9) % 40) / 40;
        const cx = (azar(seed + i)() - 0.5) * 120, cy = -40 - t * 190;
        return <Trazo key={i} pts={[[cx, cy], [cx + 3, cy - 6]]} seed={seed + 70 + i} g={6} color={M.naranja} o={1 - t} />;
      })}
    </g>
  );
};

const CUEVA: P[] = [[260, 852], [300, 560], [470, 380], [760, 300], [1160, 300], [1450, 380], [1620, 560], [1660, 852]];
const BOCA: P[] = [[520, 852], [560, 620], [720, 500], [960, 470], [1200, 500], [1360, 620], [1400, 852]];

// ---------- Escenas ----------

type E = { dur: number; dice: number };

const Frio: React.FC<E> = () => {
  const f = useCurrentFrame(), t = useEnDos();
  return (
    <>
      <Marco fondo={M.azulNoche} seed={10} f={f} o={0.4} />
      <Relleno forma={elipse(1550, 200, 60, 60, 11)} color={M.amarillo} seed={12} ancho={14} prog={k(f, 10, 20)} />
      <Tinta pts={elipse(1550, 200, 60, 60, 11)} seed={13} g={5} prog={k(f, 8, 18)} />
      {[[300, 170], [520, 120], [880, 180], [1240, 130], [1700, 330]].map(([x, y], i) => (
        <Trazo key={i} pts={estrella(x, y, 16, 20 + i)} seed={30 + i} g={4} color={M.amarillo} cerrar prog={k(f, 14 + i * 3, 22 + i * 3)} />
      ))}
      <Relleno forma={CUEVA} color={M.gris} seed={40} ancho={30} o={0.45} prog={k(f, 12, 26)} />
      <Relleno forma={BOCA} color={M.azul} seed={41} ancho={30} o={0.45} prog={k(f, 18, 30)} />
      <Tinta pts={CUEVA} seed={42} g={7} prog={k(f, 4, 22)} />
      <Tinta pts={BOCA} seed={43} g={6} prog={k(f, 10, 26)} />
      {[760, 960, 1160].map((x, i) => (
        <Sentado key={x} x={x} y={830} seed={100 + i * 40} frio={1} feliz={0} prog={k(f, 20 + i * 5, 36 + i * 5)} />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const r = azar(500 + i), x = 140 + r() * 1640, y = 90 + ((r() * 760 + t * (2 + r() * 2)) % 740);
        return <Trazo key={i} pts={[[x - 6, y], [x + 6, y]]} seed={600 + i} g={3} color="#fff" o={0.8} />;
      })}
      <Mano x={1330} y={640} texto="brrr…" tam={60} desde={45} rot={-8} color="#F3ECDC" />
    </>
  );
};

const Subida: React.FC<E> = ({ dur, dice }) => {
  const f = useCurrentFrame(), t = useEnDos();
  const MONTE: P[] = [[116, 852], [380, 700], [560, 690], [800, 540], [980, 520], [1240, 360], [1420, 300], [1806, 420], [1806, 852]];
  const avance = interpolate(t, [dice, dur - 15], [0, 1], cl);
  const camino: P[] = [[260, 780], [560, 690], [800, 545], [1000, 520], [1240, 365]];
  const seg = avance * (camino.length - 1), i = Math.min(camino.length - 2, Math.floor(seg)), u = seg - i;
  const px = camino[i][0] + (camino[i + 1][0] - camino[i][0]) * u, py = camino[i][1] + (camino[i + 1][1] - camino[i][1]) * u;
  const fase = Math.sin(t * 0.35) * 28;
  return (
    <>
      <Marco fondo={M.azul} seed={200} f={f} />
      {[[300, 150], [700, 210], [1000, 120]].map(([x, y], j) => (
        <Trazo key={j} pts={estrella(x, y, 14, 210 + j)} seed={220 + j} g={4} color={M.amarillo} cerrar prog={k(f, 8 + j * 3, 16 + j * 3)} />
      ))}
      <Relleno forma={MONTE} color={M.verde} seed={230} ancho={28} prog={k(f, 10, 24)} />
      <Tinta pts={MONTE.slice(0, 8)} seed={231} g={7} prog={k(f, 2, 20)} />
      {/* templo del Olimpo */}
      <g transform="translate(1560 300)">
        <Relleno forma={elipse(0, -90, 190, 130, 240)} color={M.naranja} seed={241} ancho={22} o={0.35} prog={k(f, 20, 30)} />
        <Tinta pts={[[-120, -120], [0, -175], [120, -120], [-120, -120]]} seed={242} g={6} prog={k(f, 12, 26)} />
        {[-90, -30, 30, 90].map((x, j) => (
          <Tinta key={x} pts={[[x, -115], [x + 2, -10]]} seed={250 + j} g={6} prog={k(f, 16 + j * 2, 28 + j * 2)} />
        ))}
        <Tinta pts={[[-135, -6], [135, -10]]} seed={259} g={6} prog={k(f, 22, 30)} />
        <Fuego x={0} y={-20} s={0.45} seed={260} prog={k(f, 26, 36)} />
      </g>
      <Mano x={1300} y={150} texto="el Olimpo" tam={52} desde={34} rot={-4} color="#F3ECDC" />
      <Flecha a={[1360, 165]} b={[1440, 200]} seed={270} prog={k(f, 46, 56)} />
      <Persona x={px} y={py} s={1} seed={300} fase={fase} bI={-50 + fase} bD={40 - fase} tunica={M.rojo} barba prog={k(f, 6, 26)} />
      <Mano x={px - 10} y={py - 230} texto="shh…" tam={44} desde={dice + 40} rot={-10} color="#F3ECDC" dur={14} />
    </>
  );
};

const Robo: React.FC<E> = ({ dur, dice }) => {
  const f = useCurrentFrame(), t = useEnDos();
  const prende = dice + (dur - dice) * 0.45;
  const huye = interpolate(t, [prende + 18, dur - 6], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const acerca = interpolate(t, [dice, prende], [0, 1], cl);
  const x = 560 + acerca * 110 - huye * 900;
  const fase = huye > 0 ? Math.sin(t * 0.8) * 38 : Math.sin(t * 0.25) * 10;
  const huyendo = huye > 0;
  const mano: P = huyendo ? [x + 93, 571] : [x + 101, 662];
  const punta: P = huyendo ? [x + 260, 450] : [x + 101 + 250 * (0.6 + acerca * 0.4), 600];
  const PIEDRAS: P[] = [[860, 852], [880, 760], [1000, 730], [1260, 735], [1380, 765], [1400, 852]];
  return (
    <>
      <Marco fondo={M.violeta} seed={400} f={f} o={0.7} />
      <Relleno forma={elipse(1130, 600, 330, 260, 401)} color={M.naranja} seed={402} ancho={26} o={0.45} prog={k(f, 10, 24)} />
      <Relleno forma={PIEDRAS} color={M.gris} seed={403} ancho={24} prog={k(f, 6, 20)} />
      <Tinta pts={PIEDRAS} seed={404} g={7} prog={k(f, 2, 16)} />
      {[[940, 800], [1060, 790], [1190, 800], [1310, 795]].map(([a, b], j) => (
        <Trazo key={j} pts={[[a, b - 30], [a + 50, b - 34]]} seed={410 + j} g={4} prog={k(f, 12, 20)} />
      ))}
      <Fuego x={1130} y={740} s={2.2} seed={420} prog={k(f, 10, 26)} />
      <Mano x={1130} y={180} texto="la fragua de los dioses" tam={50} desde={20} rot={-2} color="#F3ECDC" />
      <Persona x={x} y={850} s={1.5} seed={450} fase={fase} bI={huyendo ? 60 : -20} bD={huyendo ? -120 : 70} tunica={M.rojo} barba voltear={huyendo} prog={k(f, 4, 22)} />
      <Tinta pts={[mano, punta]} seed={470} g={9} color={M.verde} prog={k(f, 14, 26)} />
      {t > prende && <Fuego x={punta[0]} y={punta[1]} s={0.28} seed={480} />}
      {huyendo && [0, 1, 2].map((j) => <Trazo key={j} pts={[[x + 120 + j * 10, 600 + j * 70], [x + 260 + j * 30, 600 + j * 70]]} seed={490 + j} g={4} o={0.8} />)}
      <Mano x={x + 40} y={440} texto="¡ahora!" tam={56} desde={prende} rot={-6} color="#F3ECDC" dur={10} />
    </>
  );
};

const Regalo: React.FC<E> = ({ dice }) => {
  const f = useCurrentFrame();
  const fogata = k(f, dice + 20, dice + 45), feliz = k(f, dice + 40, dice + 46);
  return (
    <>
      <Marco fondo={M.azulNoche} seed={10} f={f} o={0.4} />
      <Relleno forma={CUEVA} color={M.gris} seed={40} ancho={30} o={0.45} />
      <Relleno forma={BOCA} color={M.azul} seed={41} ancho={30} o={0.45} />
      <Relleno forma={elipse(960, 690, 340 * fogata + 1, 220 * fogata + 1, 501)} color={M.amarillo} seed={502} ancho={28} o={0.55} />
      <Relleno forma={elipse(960, 760, 260 * fogata + 1, 180 * fogata + 1, 503)} color={M.naranja} seed={504} ancho={24} o={0.5} />
      <Tinta pts={CUEVA} seed={42} g={7} />
      <Tinta pts={BOCA} seed={43} g={6} />
      {[740, 1180, 600].map((x, i) => (
        <Sentado key={x} x={x} y={830} seed={100 + i * 40} frio={1 - fogata} feliz={feliz} prog={1} s={i === 2 ? 0.9 : 1} />
      ))}
      <Tinta pts={[[880, 840], [1040, 815]]} seed={510} g={10} color={M.marron} prog={k(f, dice + 10, dice + 18)} />
      <Tinta pts={[[880, 815], [1040, 842]]} seed={511} g={10} color={M.marron} prog={k(f, dice + 14, dice + 22)} />
      <Fuego x={960} y={825} s={0.9 * fogata} seed={520} prog={fogata} />
      <Persona x={1400 - k(f, 0, dice + 10) * 130} y={850} s={0.95} seed={300} fase={0} bI={-10} bD={k(f, dice, dice + 20) * 50 + 20} tunica={M.rojo} barba voltear />
      {[[700, 560], [1220, 560], [960, 420]].map(([x, y], i) => (
        <Mano key={i} x={x} y={y} texto="♥" tam={70} desde={dice + 55 + i * 6} rot={i * 8 - 8} color={M.rojo} dur={2} />
      ))}
    </>
  );
};

const Zeus: React.FC<E> = ({ dur, dice }) => {
  const f = useCurrentFrame(), paso = usePaso(2);
  const ojos = k(f, dice + 10, dice + 18);
  const rayo = f > dice + 30 && paso % 5 < 2;
  const nube = (cx: number, cy: number, w: number, seed: number): P[] => {
    const r = azar(seed);
    const pts: P[] = [];
    for (let i = 0; i <= 9; i++) {
      const a = Math.PI + (Math.PI * i) / 9;
      pts.push([cx + Math.cos(a) * w * (0.9 + r() * 0.2), cy + Math.sin(a) * w * 0.45 * (0.8 + r() * 0.4)]);
    }
    return [...pts, [cx + w, cy + 20], [cx - w, cy + 22]];
  };
  return (
    <>
      <Marco fondo={M.gris} seed={700} f={f} o={0.7} />
      {[[560, 420, 420, 701], [1360, 400, 440, 702], [960, 330, 520, 703]].map(([x, y, w, s], i) => (
        <g key={i} transform={`translate(${Math.sin((f + i * 30) / 40) * 10} 0)`}>
          <Relleno forma={nube(x, y, w, s)} color={i === 2 ? M.violeta : M.celeste} seed={s + 10} ancho={26} o={0.75} prog={k(f, 4 + i * 4, 18 + i * 4)} />
          <Tinta pts={nube(x, y, w, s)} seed={s + 20} g={6} cerrar prog={k(f, 2 + i * 4, 16 + i * 4)} />
        </g>
      ))}
      {[860, 1060].map((x, i) => (
        <g key={x}>
          <Relleno forma={elipse(x, 300, 52, 30 * ojos + 1, 720 + i)} color="#fff" seed={730 + i} ancho={14} o={0.95} />
          <Tinta pts={elipse(x, 300, 52, 30 * ojos + 1, 720 + i)} seed={740 + i} g={5} />
          {ojos > 0.6 && <Trazo pts={elipse(x + (i ? -10 : 10), 308, 12, 12, 750 + i, 12)} seed={760 + i} g={14} />}
          <Tinta pts={i ? [[1000, 250], [1120, 228]] : [[800, 228], [920, 250]]} seed={770 + i} g={11} prog={ojos} />
        </g>
      ))}
      {rayo && (
        <>
          <Relleno forma={[[1300, 420], [1250, 600], [1310, 600], [1230, 820], [1400, 560], [1330, 560], [1390, 420]]} color={M.amarillo} seed={780 + (paso % 3)} ancho={14} o={1} />
          <Trazo pts={[[1300, 420], [1250, 600], [1310, 600], [1230, 820], [1400, 560], [1330, 560], [1390, 420]]} seed={790} g={5} cerrar />
        </>
      )}
      <Mano x={1500} y={760} texto="continuará…" tam={64} desde={dur - 50} rot={-4} />
    </>
  );
};

const ESCENAS: Record<string, React.FC<E>> = { frio: Frio, subida: Subida, robo: Robo, regalo: Regalo, zeus: Zeus };

// ---------- Video ----------

const Portada: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <Papel />
      <Mano x={960} y={500} texto="Prometeo y el fuego robado" tam={130} desde={6} rot={-2} dur={50} />
      <Trazo pts={[[470, 545], [900, 560], [1460, 535]]} seed={5} g={9} prog={k(f, 56, 70)} />
      <Fuego x={1500} y={430} s={0.5} seed={6} prog={k(f, 60, 80)} />
      <Mano x={960} y={650} texto="mitología griega" tam={60} desde={70} rot={1} color="#6B6258" />
    </svg>
  );
};

const Subtitulo: React.FC<{ texto: string }> = ({ texto }) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <Mano x={960} y={965} texto={texto} tam={texto.length > 80 ? 46 : texto.length > 65 ? 50 : 56} desde={0} rot={-0.6} dur={Math.min(40, texto.length * 0.7)} />
    </svg>
  </AbsoluteFill>
);

export const Dibujado: React.FC = () => {
  const f = useCurrentFrame();
  const tl = timeline;
  return (
    <AbsoluteFill style={{ backgroundColor: '#F3ECDC' }}>
      <Audio src={staticFile('musica/lira-griega.wav')} volume={(fr) => interpolate(fr, [0, tl.introFrames, tl.total - 40, tl.total], [0.35, 0.14, 0.14, 0], cl)} />
      <Sequence durationInFrames={tl.introFrames}>
        <Portada />
      </Sequence>
      {tl.escenas.map((e) => {
        const Comp = ESCENAS[e.id];
        return (
          <Sequence key={e.id} from={e.from} durationInFrames={e.durationInFrames}>
            <AbsoluteFill style={{ transform: `rotate(${Math.sin(f / 70) * 0.25}deg)` }}>
              <svg viewBox="0 0 1920 1080" width="100%" height="100%">
                <Papel />
                <Comp dur={e.durationInFrames} dice={e.frases[0].from} />
              </svg>
            </AbsoluteFill>
            {e.frases.map((fr, i) => (
              <Sequence key={i} from={fr.from} durationInFrames={fr.dur + 10}>
                <Audio src={staticFile(fr.audio)} />
                <Subtitulo texto={fr.texto} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Sequence from={tl.total - tl.outroFrames}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Papel />
          <Mano x={960} y={560} texto="fin de la prueba ✎" tam={90} desde={0} rot={-3} dur={25} />
        </svg>
      </Sequence>
    </AbsoluteFill>
  );
};
