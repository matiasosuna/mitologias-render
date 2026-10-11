// Escenas del video 07 · Tifón, el último monstruo (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, PersonajeProps, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Nube, Relampago, Suelo, Rotulo,
  suave, lerp, Inc, Borde, ap, entre, azar, Accion,
} from '../../comun/vasija';
import {
  LAVA, PIEDRA, SANGRE, manoDe, manoAtrasDe, cabezaDe, Acostado, Serpiente, Tifon, Llamarada, Gea, MujerSerpiente, Egipan,
  Leon, Vaca, Ibis, Gata, Cabra, Pez, Cuervo, Perro, Hidra, Quimera, CarroAlado, Cueva, Abismo, Piramide, Palmera, Etna, Roca, Humo, Agua,
  Sonido, Puf, Tendones, Fardo, Huso, Tijeras, Frutal, Fruto, Hoz, Sangre, temblor,
} from './piezas';

type Cam = [number, number, number][];
const lin = Easing.linear;
/** Desplazamiento a pie entre dos frames: posición y acción. */
const andar = (f: number, a: number, b: number, x0: number, x1: number, corre = false) => ({
  x: entre(f, a, b, x0, x1, lin),
  accion: (f > a && f < b ? (corre ? 'correr' : 'caminar') : 'parado') as Accion,
});
/** Aparece en `a` y se va en `b`. */
const vida = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
/** Pulso 1→0 que dura `d` frames desde `a`. */
const pulso = (f: number, a: number, d = 20) => (f >= a && f < a + d ? 1 - (f - a) / d : 0);
/** Velo de color sobre todo lo dibujado antes. */
const Velo: React.FC<{ o: number; color?: string }> = ({ o, color = '#0A0503' }) => (o > 0 ? <rect x={-6000} y={-6000} width={20000} height={12000} fill={color} opacity={Math.min(1, o)} /> : null);
/** Grupo sacudido por un temblor. */
const Tiembla: React.FC<{ f: number; k: number; children: React.ReactNode }> = ({ f, k, children }) => {
  const [dx, dy] = temblor(f, k);
  return <g transform={`translate(${dx} ${dy})`}>{children}</g>;
};
/** Cumbre del Olimpo: montaña con meseta y templo. */
const Cumbre: React.FC<{ x: number; cima: number; ancho?: number; meseta?: number; templo?: boolean; color?: string; o?: number }> = ({ x, cima, ancho = 1000, meseta = 240, templo = true, color = PIEDRA, o = 1 }) => {
  const w = ancho / 2, b = SUELO + 60, h = b - cima;
  return (
    <g opacity={o}>
      {templo && <Templo x={x + 20} y={cima + 4} s={0.6} />}
      <path d={`M${x - w} ${b} C ${x - w * 0.7} ${b - h * 0.35}, ${x - meseta * 1.4} ${cima + 40}, ${x - meseta} ${cima} L ${x + meseta} ${cima} C ${x + meseta * 1.4} ${cima + 40}, ${x + w * 0.7} ${b - h * 0.35}, ${x + w} ${b} Z`} fill={color} />
      <Borde d={`M${x - meseta} ${cima + 2} L ${x + meseta} ${cima + 2}`} w={7} />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 + r * 2 }, (_, i) => {
        const yy = cima + 50 + r * (h / 6), ww = meseta + r * ((w - meseta) / 5);
        const cx = x - ww + ((i + 0.5) * (ww * 2)) / (3 + r * 2);
        return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 15 0 0 1 44 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
      }))}
    </g>
  );
};
/** Lanza rota clavada en el suelo. */
const LanzaRota: React.FC<{ x: number; rot: number; l?: number }> = ({ x, rot, l = 140 }) => (
  <g transform={`translate(${x} ${SUELO}) rotate(${rot})`}>
    <path d={`M0 6 L0 ${-l}`} stroke={C.negro} strokeWidth={7} strokeLinecap="round" />
    <path d={`M-6 ${-l} l 12 -10`} stroke={C.negro} strokeWidth={5} />
  </g>
);
/** Brillo blanco de impacto. */
const Destello: React.FC<{ x: number; y: number; o: number; r?: number }> = ({ x, y, o, r = 140 }) => (o > 0 ? <circle cx={x} cy={y} r={r * (1.4 - o * 0.4)} fill="url(#haloBlanco)" opacity={o} /> : null);
/** Tajo luminoso (golpe de hoz). */
const Tajo: React.FC<{ x: number; y: number; t: number; r?: number; rot?: number }> = ({ x, y, t, r = 90, rot = 0 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={1 - t}>
      <path d={`M${-r} ${-r * 0.4} Q 0 ${r * 0.6} ${r} ${-r * 0.5}`} stroke={C.blanco} strokeWidth={10 * (1 - t) + 2} fill="none" strokeLinecap="round" />
      <path d={`M${-r} ${-r * 0.4} Q 0 ${r * 0.6} ${r} ${-r * 0.5}`} stroke={C.oro} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Notas musicales que flotan. */
const Notas: React.FC<{ x: number; y: number; f: number; o: number; dir?: number }> = ({ x, y, f, o, dir = 1 }) => (o > 0 ? (
  <g opacity={o}>
    {[0, 1, 2, 3].map((i) => {
      const t = ((f / 50 + i / 4) % 1), px = x + dir * t * 260, py = y - t * 70 + Math.sin(t * 8 + i) * 16;
      return (
        <g key={i} transform={`translate(${px} ${py})`} opacity={Math.sin(t * Math.PI)}>
          <ellipse cx={0} cy={0} rx={8} ry={6} fill={C.crema} transform="rotate(-20)" />
          <path d="M7 -2 V -30 l 10 6" stroke={C.crema} strokeWidth={3} fill="none" />
        </g>
      );
    })}
  </g>
) : null);
/** Siringa (flauta de Pan) en la mano (origen = mano). */
const Siringa: React.FC<{ p: P; voltear?: boolean }> = ({ p, voltear }) => (
  <g transform={`translate(${p[0]} ${p[1]}) scale(${voltear ? -1 : 1} 1) rotate(-60)`}>
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 8 - 4} y={-10} width={7} height={46 - i * 6} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />)}
    <path d="M-4 6 H 38" stroke={C.purpura} strokeWidth={4} />
  </g>
);
/** Isla con cerros (Sicilia) — origen = centro en la línea del agua. */
const Tierra: React.FC<{ x: number; y: number; ancho: number; alto: number; color?: string }> = ({ x, y, ancho, alto, color = C.negro }) => (
  <g>
    <path d={suave([[x - ancho / 2, y + 40], [x - ancho * 0.35, y - alto * 0.5], [x - ancho * 0.1, y - alto], [x + ancho * 0.2, y - alto * 0.8], [x + ancho * 0.45, y - alto * 0.3], [x + ancho / 2, y + 40]], true, 0.8)} fill={color} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x - ancho * 0.3 + i * ancho * 0.11} ${y - alto * 0.3 + (i % 2) * 20} a 18 12 0 0 1 36 0`} stroke={C.crema} strokeWidth={1.8} fill="none" opacity={0.45} />)}
  </g>
);

// ---------------------------------------------------------------- 1 · El último hijo de Gea
const Nacimiento: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.04], [t1 - 20, 0, 1], [t1 + 60, 140, 1.06], [t2 - 10, 180, 1.06], [t2 + 90, 1500, 1], [t3, 1500, 1], [dur, 1500, 0.9]];
  const gx = 1100, cx = 2460;
  const sube = f < t1 + 30 ? ap(f, 25, 70) : 1 - entre(f, t1 + 40, t1 + 160, 0, 1);
  const enojo = ap(f, 130, 40);
  const nace = ap(f, t3 - 5, 100);
  const ts = 0.3 + nace * 0.95;
  const brillan = f > t2 + 40 && f < t3 + 10 && Math.floor(f / 40) % 3 !== 2;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={55} f={f} area={[0, 140, 2400, 360]} />
        <Luna x={1650} y={240} r={40} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={400} alto={300} ancho={620} o={0.55} />
        <Monte x={1300} alto={380} ancho={700} o={0.45} />
        <Monte x={2000} alto={320} ancho={600} o={0.5} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={4200} />
        {/* Flegra: rocas humeantes y lanzas rotas de la Gigantomaquia */}
        {[[220, 1.3, 1], [470, 1.7, 2], [720, 1.1, 3]].map(([x, s, k]) => (
          <g key={k}>
            <Humo x={x} y={SUELO - 50 * s} f={f + k * 30} n={6} s={0.7} o={0.8} viento={-0.4} />
            <Roca x={x} y={SUELO - 30 * s} s={s} seed={k} rot={k * 30} />
          </g>
        ))}
        <LanzaRota x={340} rot={-24} />
        <LanzaRota x={600} rot={18} l={110} />
        <LanzaRota x={850} rot={-8} l={90} />
        <Rotulo x={470} y={SUELO - 260} texto="FLEGRA" o={vida(f, 40, t1 - 20)} />
        <Abismo x={gx} abre={ap(f, t1, 50)} f={f} />
        <Gea x={gx} s={1.3} sube={sube} f={f} id="nac" contorno voltear enojo={f < t1 ? enojo * 0.6 : (1 - ap(f, t1 + 40, 40)) * 0.6}
          ojosCerrados={f < 130} cabeza={f < 130 ? -14 : 6} boca={f > 140 && f < t1 && Math.floor(f / 6) % 2 === 0}
          brazo={f < 130 ? [30, 40] : [entre(f, 130, 160, 30, 150), 20]} brazoAtras={f < 130 ? [-10, -50] : [-60, -40]} />
        <Rotulo x={gx + 340} y={SUELO - 110} texto="TÁRTARO" o={vida(f, t1 + 50, t2 + 30)} />
        {/* la cueva de Cilicia */}
        <Cueva x={cx} s={1.2} luz={ap(f, t2 + 20, 40) * (1 - nace * 0.5)} color="#5A2A16" />
        {brillan && (
          <g>
            <circle cx={cx - 10} cy={SUELO - 150} r={40} fill="url(#halo)" opacity={0.9} style={{ mixBlendMode: 'screen' }} />
            <circle cx={cx - 22} cy={SUELO - 150} r={6} fill={C.oro} />
            <circle cx={cx + 4} cy={SUELO - 150} r={6} fill={C.oro} />
          </g>
        )}
        {f > t2 + 60 && f < t3 + 20 && (
          <g opacity={1 - ap(f, t3, 20)}>
            <Serpiente pts={[[cx + 40, SUELO - 10], [cx - 40, SUELO - 20 + Math.sin(f / 6) * 6], [cx - 120 - ap(f, t2 + 60, 60) * 60, SUELO - 14], [cx - 170 - ap(f, t2 + 60, 60) * 80, SUELO - 40 + Math.sin(f / 5) * 10]]} ancho={30} f={f} claro fuego={1} />
          </g>
        )}
        <Rotulo x={cx} y={SUELO - 560} texto="CILICIA" o={vida(f, t2 + 40, t3 + 10)} />
        {nace > 0 && (
          <g>
            <circle cx={cx - 60} cy={SUELO - 300 * ts} r={300 * ts} fill="url(#halo)" opacity={pulso(f, t3 - 5, 40) * 0.9} style={{ mixBlendMode: 'screen' }} />
            <Tifon id="nace" x={cx - 60 * nace} s={ts} opacity={ap(f, t3 - 5, 20)} contorno largo={0.2 + nace * 0.8} ala={ap(f, t3 + 50, 40)} ojos={1} cuellos={10} rugido={nace} brazo={[60 + nace * 60, 20]} brazoAtras={[-30 - nace * 60, -30]} />
          </g>
        )}
        <Rotulo x={cx + 380} y={SUELO - 380} texto="TIFÓN" o={ap(f, t3 + 50, 20)} tam={46} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · El monstruo
const Monstruo: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.4], [t1 - 10, 0, 0.76], [t3 - 10, 0, 0.76], [t3 + 50, 0, 1.1], [t4 - 10, 0, 1.1], [t4 + 50, 0, 0.75], [dur, 0, 0.74]];
  const tx = 960, s = 1.6;
  const abre = ap(f, t1, 40);
  const brazo: [number, number] = [entre(f, t1, t1 + 40, 25, 92) + Math.sin(f / 14) * 3, entre(f, t1, t1 + 40, 30, 0)];
  const brazoAtras: [number, number] = [entre(f, t1, t1 + 40, -15, -92) - Math.sin(f / 14) * 3, entre(f, t1, t1 + 40, -30, -40)];
  const mD = manoDe({ x: tx, s, brazo }), mT = manoAtrasDe({ x: tx, s, brazo: brazoAtras });
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.1}>
        <Estrellas n={80} f={f} area={[-400, -300, 2700, 800]} seed={4} />
      </Capa>
      <Capa p={1}>
        <g opacity={abre}>
          <Sol x={mD[0] + 120} y={mD[1] - 20 + (1 - abre) * 120} r={46} f={f} />
          <Luna x={mT[0] - 230} y={mT[1] - 60 + (1 - abre) * 120} r={40} />
        </g>
        <Rotulo x={mD[0] + 120} y={mD[1] - 110} texto="ORIENTE" o={vida(f, t1 + 30, t2)} tam={28} />
        <Rotulo x={mT[0] - 230} y={mT[1] - 140} texto="OCCIDENTE" o={vida(f, t1 + 30, t2)} tam={28} />
        {/* montañas que le quedan chicas */}
        <Monte x={300} alto={190} ancho={380} o={0.9} color={PIEDRA} />
        <Monte x={1640} alto={210} ancho={400} o={0.9} color={PIEDRA} />
        <Monte x={-180} alto={150} ancho={320} o={0.8} color={PIEDRA} />
        <Monte x={2150} alto={160} ancho={340} o={0.8} color={PIEDRA} />
        {/* un templo y olivos diminutos: la escala del monstruo */}
        <Templo x={1380} y={SUELO} s={0.22} />
        {[520, 600, 1500, 1560].map((x, i) => <Olivo key={x} x={x} s={0.18} f={f + i * 9} />)}
        <Suelo desde={-1600} hasta={3600} />
        <Tifon id="monstruo" x={tx} s={s} contorno cuellos={16} largo={0.15 + ap(f, t2, 70) * 0.85} ala={ap(f, t4, 40)} ojos={ap(f, t4 + 20, 20)}
          enrosca={1 + ap(f, t3, 40) * 1.8} rugido={ap(f, t2 + 60, 30)} brazo={brazo} brazoAtras={brazoAtras} boca={f > t4 + 20 && Math.floor(f / 7) % 2 === 0} />
        {/* nubes a la altura de su cintura */}
        <Nube x={tx - 380 + f * 0.5} y={SUELO - 300} s={1.1} f={f} />
        <Nube x={tx + 420 - f * 0.4} y={SUELO - 360} s={0.9} f={f + 50} />
        <Nube x={tx - 900 + f * 0.3} y={SUELO - 420} s={0.7} f={f + 90} />
        <Destello x={cabezaDe({ x: tx, s, gigante: true })[0]} y={cabezaDe({ x: tx, s, gigante: true })[1]} o={pulso(f, t4 + 20, 30)} r={200} />
        <Rotulo x={tx - 620} y={SUELO - 700} texto="CIEN CABEZAS" o={vida(f, t2 + 40, t3)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · Las cien voces
const Voces: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t4, 0, 1], [t4 + 110, 480, 0.95], [dur, 520, 0.95]];
  const tx = 600 + ap(f, t4, 120) * 200, ty = SUELO + 380, s = 1.9;
  const cab = cabezaDe({ x: tx, y: ty, s, gigante: true });
  const toro = vida(f, t1 + 10, t1 + 90), leon = vida(f, t1 + 90, fin(1) + 5);
  const perros = vida(f, t2, t2 + 100), silbo = vida(f, t2 + 90, fin(2) + 10);
  const dioses = vida(f, t3, fin(3) + 10);
  const lanza = (k: number) => (f - (t4 + 30 + k * 24)) / 46;
  const olimpo: P = [2120, SUELO - 330];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.08}>
        <Estrellas n={50} f={f} area={[0, 140, 2600, 380]} seed={9} />
      </Capa>
      <Capa p={0.5}>
        <Monte x={1600} alto={330} ancho={520} o={0.9} color={PIEDRA} />
        {/* ecos: los animales cuyas voces imita */}
        <Vaca x={1450} y={SUELO - 40} s={1.7} f={f} toro color={C.crema} opacity={toro * 0.55} />
        <Leon x={1450} y={SUELO - 40} s={1.6} f={f} color={C.crema} opacity={leon * 0.55} />
        {[0, 1, 2].map((i) => <Perro key={i} x={1250 + i * 260} y={SUELO - 40 - (i % 2) * 30} s={1.1} f={f + i * 9} color={C.crema} ladra opacity={perros * 0.55} />)}
        <g opacity={dioses * 0.45}><Templo x={1500} y={SUELO - 120} s={1.1} color={C.oro} /></g>
      </Capa>
      <Capa p={1}>
        {/* eco del silbido rebotando en las montañas */}
        <Sonido x={1300} y={SUELO - 260} f={f} o={silbo} ang={180} s={1.4} />
        <Sonido x={1700} y={SUELO - 240} f={f + 12} o={silbo} ang={0} s={1.2} />
        {silbo > 0 && [0, 1, 2].map((i) => <path key={i} d={suave(Array.from({ length: 10 }, (_, k) => [900 + k * 50, 300 + i * 40 + Math.sin(k * 1.4 + f / 3 + i) * 14] as P))} stroke={C.crema} strokeWidth={3} fill="none" opacity={silbo * 0.7} strokeDasharray="14 10" strokeDashoffset={-f * 6} />)}
        <Cumbre x={olimpo[0]} cima={SUELO - 300} ancho={1100} meseta={170} color={C.barroOscuro} />
        <Rotulo x={olimpo[0]} y={SUELO - 520} texto="OLIMPO" o={ap(f, t4 + 80, 20)} />
        {Array.from({ length: 6 }, (_, k) => {
          const t = lanza(k);
          if (t <= 0) return null;
          const a: P = [cab[0] + 120, cab[1] - 60], b: P = [olimpo[0] - 180 + k * 70, olimpo[1] + 40 - (k % 2) * 30];
          if (t < 1) {
            const p = lerp(a, b, t);
            return <Roca key={k} x={p[0]} y={p[1] - Math.sin(t * Math.PI) * 260} s={0.7} rot={t * 300} seed={k + 3} fuego f={f} />;
          }
          return (
            <g key={k}>
              <Destello x={b[0]} y={b[1]} o={pulso(f, t4 + 30 + k * 24 + 46, 24)} r={160} />
              <g transform={`translate(${b[0]} ${b[1] + 20})`} opacity={1 - ap(f, t4 + 30 + k * 24 + 120, 40)}><Fuego f={f + k * 9} s={0.7} /></g>
            </g>
          );
        })}
        <Suelo desde={-600} hasta={4000} />
        <Tifon id="voces" x={tx} y={ty} s={s} contorno cuellos={16} ojos={1} ala={1} rugido={0.6 + 0.4 * Math.sin(f / 8)}
          brazo={f > t4 + 20 ? [120 + Math.sin(f / 4) * 30, -20] : [70, 20]} brazoAtras={[-40, -40]} boca={Math.floor(f / 6) % 2 === 0} cabeza={f > t4 ? 8 : 0} />
        {/* voces que salen de las cabezas */}
        <Sonido x={cab[0] + 90} y={cab[1] - 40} f={f} o={vida(f, 10, t1)} s={1.3} ang={-20} />
        <Sonido x={cab[0] + 160} y={cab[1] - 220} f={f + 6} o={toro} s={1.6} ang={-30} />
        <Sonido x={cab[0] + 120} y={cab[1] + 30} f={f + 3} o={leon} s={1.6} ang={10} />
        <Sonido x={cab[0] - 40} y={cab[1] - 260} f={f + 9} o={perros} s={1.4} ang={-60} />
        <Sonido x={cab[0] + 140} y={cab[1] - 120} f={f + 4} o={silbo} s={1.8} />
        <Sonido x={cab[0] + 120} y={cab[1] - 30} f={f} o={dioses} s={2} color={C.oro} />
        {dioses > 0 && <circle cx={cab[0]} cy={cab[1]} r={220} fill="url(#halo)" opacity={dioses * 0.6} style={{ mixBlendMode: 'screen' }} />}
        <Rotulo x={1450} y={SUELO - 420} texto="MUGIDOS" o={toro} tam={30} />
        <Rotulo x={1450} y={SUELO - 420} texto="RUGIDOS" o={leon} tam={30} />
        <Rotulo x={1520} y={SUELO - 420} texto="LADRIDOS" o={perros} tam={30} />
        <Rotulo x={1500} y={SUELO - 470} texto="SILBIDOS" o={silbo} tam={30} />
        <Rotulo x={1500} y={SUELO - 470} texto="LA VOZ DE LOS DIOSES" o={dioses} tam={30} />
        <Llamarada x={cab[0] + 40} y={cab[1] + 30} ang={-10} largo={1.4} f={f} o={vida(f, t4 + 10, dur - 10, 20)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La huida a Egipto
type Dios = { n: string; p: Partial<PersonajeProps>; meta: number };
const DIOSES_HUYEN: Dios[] = [
  { n: 'APOLO', p: { barba: false, tocado: 'laurel', objeto: 'lira' }, meta: 1700 },
  { n: 'HERA', p: { mujer: true, tocado: 'corona', objeto: 'cetro' }, meta: 1900 },
  { n: 'HERMES', p: { barba: false, tocado: 'petaso', objeto: 'caduceo', alas: true }, meta: 2110 },
  { n: 'ÁRTEMIS', p: { mujer: true, ropa: 'corta', objeto: 'arco' }, meta: 2300 },
  { n: 'DIONISO', p: { tocado: 'laurel', objeto: 'tirso', capa: C.purpura }, meta: 2470 },
  { n: 'AFRODITA', p: { mujer: true, tocado: 'diadema' }, meta: 2640 },
];
const Huida: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t1 + 10, 0, 1], [t1 + 120, 1450, 1], [t4 - 15, 1450, 1], [t4 + 55, -150, 1], [dur, -170, 1.04]];
  const cambios = [t2 + 5, t2 + 62, t2 + 120, t3 + 5, t3 + 65, t3 + 125];
  const tifX = entre(f, 0, dur, -230, 20);
  const miedo = f > 30;
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0.06}><Sol x={1500} y={260} r={50} f={f} /></Capa>
      <Capa p={0.25}>
        <Nube x={600} y={240} s={0.7} f={f} />
        <Nube x={1700} y={210} s={0.6} f={f} />
      </Capa>
      <Capa p={0.5}>
        <Cumbre x={260} cima={SUELO - 360} ancho={1000} meseta={150} color={C.barroOscuro} o={0.8} />
        <Piramide x={1500} s={1} o={0.7} />
        <Piramide x={1800} s={0.7} o={0.6} />
        <Piramide x={2150} s={0.85} o={0.65} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={2722} />
        <Agua nivel={SUELO - 4} f={f} x0={2720} x1={4200} alto={24} />
        <Rotulo x={3050} y={SUELO - 40} texto="EL NILO" o={ap(f, t1 + 100, 20)} tam={28} />
        <Palmera x={1700} s={1} f={f} />
        <Palmera x={2560} s={0.9} f={f + 30} />
        <Palmera x={2800} s={1.1} f={f + 60} />
        <Rotulo x={2250} y={SUELO - 470} texto="EGIPTO" o={vida(f, t1 + 90, t2 + 20)} />
        {/* Tifón se acerca por la izquierda */}
        <Tifon id="huida" x={tifX} s={2.2} opacity={ap(f, 0, 40)} cuellos={12} ojos={1} rugido={0.5} brazo={[95, 0]} brazoAtras={[-40, -40]} />
        {/* Zeus se queda */}
        {(() => {
          const enfrenta = f > t4 - 20;
          return (
            <g>
              {enfrenta && <circle cx={720} cy={SUELO - 200} r={240} fill="url(#halo)" opacity={ap(f, t4, 30) * 0.7} style={{ mixBlendMode: 'screen' }} />}
              <Personaje x={720} s={0.72} voltear barba capa={C.purpura} tocado="corona" objeto="rayo" brazo={enfrenta ? [entre(f, t4, t4 + 30, 60, 160), 10] : [70, 20]} brazoAtras={[-30, -30]} />
              <Rotulo x={720} y={SUELO - 420} texto="ZEUS" o={ap(f, t4 + 30, 20)} />
            </g>
          );
        })()}
        {DIOSES_HUYEN.map((d, i) => {
          const x0 = 830 + i * 95;
          const h = andar(f, t1 + i * 6, t1 + 115 + i * 6, x0, d.meta, true);
          const tc = cambios[i], o = ap(f, tc, 10), pt = (f - tc) / 30;
          const huye = f > t1;
          const vuelta = f > tc;
          return (
            <g key={d.n}>
              {o < 1 && (
                <Personaje x={h.x} s={0.62} accion={h.accion} voltear={!huye} opacity={1 - o} {...d.p}
                  brazo={huye ? undefined : miedo ? [150 + Math.sin(f / 5 + i) * 10, 20] : [40, 30]} brazoAtras={huye ? undefined : miedo ? [-150, -20] : undefined} cabeza={!huye && miedo ? 12 : 0} />
              )}
              {vuelta && i === 0 && <Cuervo x={d.meta + (f - tc) * 4} y={SUELO - 160 - (f - tc) * 1.6} s={1.1} f={f} opacity={o} />}
              {vuelta && i === 1 && <Vaca x={d.meta} s={0.8} f={f} opacity={o} />}
              {vuelta && i === 2 && <Ibis x={d.meta} s={1} f={f} opacity={o} />}
              {vuelta && i === 3 && <Gata x={d.meta} s={0.9} f={f} opacity={o} />}
              {vuelta && i === 4 && <Cabra x={d.meta} s={0.95} f={f} opacity={o} anda={f > tc + 30} />}
              {vuelta && i === 5 && <Pez x={2860 + (f - tc) * 1.2} y={SUELO + 30} s={1.5} color={C.purpura} f={f} opacity={o} />}
              <Puf x={i === 5 ? 2760 : d.meta} y={SUELO - 140} t={pt} s={0.8} />
              <Rotulo x={i === 5 ? 2900 : d.meta} y={SUELO - (i === 0 ? 330 : i % 2 ? 250 : 300)} texto={d.n} o={vida(f, tc, i === 0 ? tc + 80 : i < 3 ? t3 - 10 : t4 - 30)} tam={28} />
            </g>
          );
        })}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · Zeus contra Tifón
const Combate: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1], [t1, 0, 1], [t1 + 80, 160, 1.05], [t2, 200, 1.05], [t2 + 140, 1000, 1], [t3, 1000, 1], [dur, 1060, 1.08]];
  const corre1 = andar(f, t1 + 10, t1 + 70, 420, 1020, true), corre2 = andar(f, t2 + 10, t2 + 140, 1020, 1880, true);
  const zx = f < t2 ? corre1.x : corre2.x;
  const zAcc = f < t2 ? corre1.accion : corre2.accion;
  const tx = entre(f, t2, t2 + 150, 1400, 2280);
  const lanzando = f < t1 - 5;
  const golpe = f > t1 + 70 && f < t2;
  const brazoZ: [number, number] = lanzando ? [130 + 30 * Math.cos(((f - 20) / 24) * Math.PI * 2), 0] : golpe ? [110 + 60 * Math.sin(f / 4), -10] : zAcc === 'correr' ? [120, 10] : [140, 10];
  const zs = 0.95;
  const mano = manoDe({ x: zx, s: zs, brazo: brazoZ, inclinar: zAcc === 'correr' ? 6 : 0 });
  const golpes = Array.from({ length: 8 }, (_, k) => 26 + k * 24).filter((d) => d < t1 - 5);
  const herida = f > t1 + 80;
  const ataja = f > t3;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.06}><Estrellas n={40} f={f} area={[0, 140, 2400, 300]} seed={12} /></Capa>
      <Capa p={0.2}>
        <Nube x={500} y={220} s={0.8} f={f} color="#5A3A2A" />
        <Nube x={1300} y={190} s={0.9} f={f} color="#5A3A2A" />
        <Nube x={2000} y={230} s={0.7} f={f} color="#5A3A2A" />
      </Capa>
      <Capa p={0.7}>
        <Monte x={2250} alto={420} ancho={620} o={0.75} color={PIEDRA} />
        <Rotulo x={2380} y={SUELO - 170} texto="MONTE CASIO" o={ap(f, t2 + 130, 20)} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={4000} />
        {[300, 820, 1500, 2100].map((x, i) => <Olivo key={x} x={x} s={0.6} f={f + i * 20} color="#2A1A12" />)}
        <Tifon id="combate" x={tx} s={1.45} voltear contorno cuellos={12} ojos={1 + pulso(f, t3, 30)} rugido={ataja ? 1 : 0.5} enrosca={ataja ? 2.6 : 1.2}
          inclinar={golpe ? -6 + Math.sin(f / 4) * 4 : 0} brazo={[110 + Math.sin(f / 9) * 15, 30]} brazoAtras={[-30, -40]} boca={Math.floor(f / 6) % 2 === 0} />
        <Sangre x={tx - 40} y={SUELO - 420} f={f} o={herida ? 1 : 0} />
        <Sangre x={tx + 30} y={SUELO - 300} f={f + 13} o={herida ? 1 : 0} n={4} />
        {golpes.map((d0, k) => {
          const b: P = [tx - 60 + (azar(k) - 0.5) * 260, SUELO - 640 + azar(k + 9) * 220];
          return (
            <g key={k}>
              <Relampago a={mano} b={b} f={f} desde={d0} dur={12} />
              <Destello x={b[0]} y={b[1]} o={pulso(f, d0, 16)} r={110} />
            </g>
          );
        })}
        <Personaje x={zx} s={zs} accion={zAcc} barba capa={C.purpura} tocado="corona" objeto={f < t1 ? 'rayo' : 'hoz'} brazo={brazoZ} brazoAtras={[-30, -40]} contorno boca={golpe && Math.floor(f / 5) % 2 === 0} />
        {golpe && <Tajo x={tx - 160} y={SUELO - 300} t={((f - t1 - 70) % 16) / 16} r={80} rot={-20} />}
        <Rotulo x={zx} y={SUELO - 420} texto="HOZ DE DIAMANTE" o={vida(f, t1 + 30, t2 - 10)} tam={28} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · La cueva Coricia
const Tendones6: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const salto = t3 - 6;
  const cam: Cam = [[0, 60, 1.05], [salto - 1, 160, 1.12], [salto, 2040, 1], [dur, 2080, 1.04]];
  const zx = 900, zs = 0.95, tx = 1230, ts = 1.45;
  const enrosca = ap(f, 10, 60) * (1 - ap(f, t2 + 20, 30));
  const cae = ap(f, t2 + 20, 25);
  const brazoZ: [number, number] = f < t1 + 20 ? [120 + Math.sin(f / 3) * 20, 20] : [40 + Math.sin(f / 5) * 10, 30];
  const manoZ = manoDe({ x: zx, s: zs, brazo: brazoZ });
  const brazoT: [number, number] = f < t1 + 50 ? [100, 20] : f < t1 + 62 ? [entre(f, t1 + 50, t1 + 62, 160, 50), -20] : f < t1 + 80 ? [entre(f, t1 + 62, t1 + 80, 50, 160), 10] : f < t1 + 92 ? [entre(f, t1 + 80, t1 + 92, 160, 50), -20] : [80, 30];
  const manoT = manoDe({ x: tx, s: ts, voltear: true, brazo: brazoT });
  const vHoz = (f - t1 - 10) / 30;
  const tieneHoz = vHoz >= 1;
  const vTend = (f - t1 - 95) / 30;
  // --- cueva
  const cx = 3000, tx2 = entre(f, t3 + 110, t4 + 50, 2380, 1750);
  const brazoT2: [number, number] = f < t3 + 70 ? [70, 10] : [entre(f, t3 + 70, t3 + 100, 70, 30), 30];
  const manoT2 = manoDe({ x: tx2, s: 1.3, brazo: brazoT2 });
  const deja = ap(f, t3 + 70, 30);
  const fardoP = lerp([manoT2[0] + 10, manoT2[1] + 60], [2650, SUELO], deja);
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.06}><Estrellas n={45} f={f} area={[0, 140, 4200, 320]} seed={21} /><Luna x={2800} y={230} r={38} /></Capa>
      <Capa p={0.6}>
        <Monte x={1050} alto={400} ancho={600} o={0.6} color={PIEDRA} />
        <Monte x={2400} alto={300} ancho={500} o={0.5} color={PIEDRA} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={4600} />
        {f < salto && (
          <g>
            <Tifon id="tend" x={tx} s={ts} voltear contorno cuellos={12} ojos={1} rugido={0.7} enrosca={1.5} brazo={brazoT} brazoAtras={[-30, -40]} objeto={tieneHoz ? 'hoz' : null} boca={Math.floor(f / 7) % 2 === 0} />
            {/* la serpiente que lo atrapa */}
            {enrosca > 0 && <Serpiente pts={[[tx - 120, SUELO - 20], [tx - 200, SUELO - 70 + Math.sin(f / 6) * 8], [zx + 120, SUELO - 50], [zx + 60, SUELO - 120 * zs]]} ancho={44} f={f} claro cabeza={false} />}
            <Acostado x={zx} t={cae} s={zs}>
              <Personaje x={zx} s={zs} barba capa={C.purpura} tocado="corona" objeto={!tieneHoz && vHoz <= 0 ? 'hoz' : null} brazo={brazoZ} brazoAtras={[-120 + Math.sin(f / 4) * 20, -20]} contorno boca={f > t1 + 50 && f < t2 + 40} ojosCerrados={f > t2 + 50} />
            </Acostado>
            {enrosca > 0 && [110, 190, 265].map((h, i) => {
              const o = Math.min(1, Math.max(0, enrosca * 3 - i));
              const y = SUELO - h * zs;
              return (
                <g key={h} opacity={o}>
                  <ellipse cx={zx + 4} cy={y} rx={56 - i * 4} ry={18} fill="none" stroke={C.crema} strokeWidth={30} />
                  <ellipse cx={zx + 4} cy={y} rx={56 - i * 4} ry={18} fill="none" stroke={C.negro} strokeWidth={26} />
                  <ellipse cx={zx + 4} cy={y} rx={56 - i * 4} ry={18} fill="none" stroke={C.purpura} strokeWidth={6} />
                  <ellipse cx={zx + 4} cy={y} rx={56 - i * 4} ry={18} fill="none" stroke={C.blanco} strokeWidth={2} strokeDasharray="1 9" />
                </g>
              );
            })}
            {vHoz > 0 && vHoz < 1 && (() => {
              const p = lerp(manoZ, manoT, vHoz);
              return <Hoz x={p[0]} y={p[1] - Math.sin(vHoz * Math.PI) * 120} rot={vHoz * 540} s={0.9} brillo={0.6} />;
            })()}
            <Tajo x={zx + 20} y={SUELO - 230} t={(f - t1 - 58) / 14} r={90} rot={30} />
            <Tajo x={zx + 20} y={SUELO - 120} t={(f - t1 - 88) / 14} r={80} rot={-20} />
            {vTend > 0 && (() => {
              const p = lerp([zx + 20, SUELO - 200], [manoT[0], manoT[1] - 30], Math.min(1, vTend));
              return <Tendones x={p[0]} y={p[1] - Math.sin(Math.min(1, vTend) * Math.PI) * 80} f={f} s={0.9} />;
            })()}
          </g>
        )}
        {/* --- la cueva Coricia --- */}
        <Cueva x={cx} s={1.3} color="#5A2A16" luz={0.25} />
        <Rotulo x={cx} y={SUELO - 600} texto="CUEVA CORICIA" o={vida(f, t3 + 15, t4 + 10)} />
        {f >= salto && (
          <g>
            <Acostado x={3110} t={1} s={0.8}>
              <Personaje x={3110} s={0.8} barba capa={C.purpura} tocado="corona" contorno ojosCerrados brazo={[10, 10]} brazoAtras={[-10, -10]} />
            </Acostado>
            <Tifon id="tend2" x={tx2} s={1.3} contorno cuellos={12} ojos={1} rugido={0.4} brazo={brazoT2} brazoAtras={[-30, -40]} opacity={1 - ap(f, t4 + 10, 40)} />
            {deja < 1 && <Tendones x={manoT2[0] + 10} y={manoT2[1] + 20} f={f} s={0.8} o={1 - ap(f, t3 + 40, 20)} />}
            {f > t3 + 40 && <Fardo x={fardoP[0]} y={fardoP[1]} s={0.8} f={f} brillo={0.5} rot={(1 - deja) * -20} />}
            <Puf x={manoT2[0] + 10} y={manoT2[1] + 20} t={(f - t3 - 40) / 26} s={0.5} />
            <MujerSerpiente id="delfine" x={2520} s={0.85} f={f} voltear contorno alza={ap(f, t4, 40)} opacity={ap(f, t4, 25)} tocado="diadema" brazo={[80, 20]} brazoAtras={[-30, -30]} boca={f > t4 + 20 && f < t4 + 60} />
            <Rotulo x={2520} y={SUELO - 420} texto="DELFINE" o={ap(f, t4 + 40, 20)} />
          </g>
        )}
        <Velo o={Math.max(ap(f, salto - 22, 16) * (f < salto ? 1 : 0), f >= salto ? 1 - ap(f, salto, 22) : 0)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · Hermes y Egipán
const Rescate: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 2060, 1.04], [t1, 1960, 1], [t2 + 60, 2000, 1], [t3, 2280, 1.08], [t4, 2300, 1.06], [dur, 2560, 0.96]];
  const her = andar(f, t1 + 10, t1 + 130, 1800, 2260);
  const egi = andar(f, t1 + 25, t1 + 150, 1740, 2150);
  // vuelo de Hermes: por encima de Delfine hasta el fardo y después hasta Zeus
  const v1 = entre(f, t2 + 30, t2 + 90, 0, 1), v2 = entre(f, t2 + 110, t3 + 10, 0, 1);
  const hx = f < t2 + 30 ? her.x : f < t2 + 100 ? lerp([2260, 0], [2610, 0], v1)[0] : lerp([2610, 0], [2860, 0], v2)[0];
  const hy = f < t2 + 30 ? SUELO : f < t2 + 100 ? SUELO - Math.sin(v1 * Math.PI) * 260 : SUELO - Math.sin(v2 * Math.PI) * 120;
  const vuela = (f > t2 + 30 && f < t2 + 90) || (f > t2 + 110 && f < t3 + 10);
  const brazoH: [number, number] = f > t2 + 90 ? [50, 30] : [60, 20];
  const manoH = manoDe({ x: hx, y: hy, s: 0.7, brazo: brazoH });
  const lleva = f > t2 + 92;
  const fardoP: P = lleva ? [manoH[0] + 10, manoH[1] + 70] : [2650, SUELO];
  const vTend = (f - t3 - 15) / 40;
  const levanta = 1 - ap(f, t3 + 50, 40);
  const carroX = entre(f, t4, t4 + 70, 3900, 3250), carroY = SUELO - 40 - ap(f, t4 + 80, 60) * 330;
  const subido = f > t4 + 70;
  const toca = f > t1 + 150 && f < t3 + 40;
  const brazoE: [number, number] = toca ? [110, -70] : [30, 30];
  const manoE = manoDe({ x: egi.x, s: 0.7, brazo: brazoE });
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.06}><Estrellas n={50} f={f} area={[0, 140, 4200, 320]} seed={31} /><Luna x={2600} y={230} r={40} /></Capa>
      <Capa p={0.6}>
        <Monte x={1500} alto={300} ancho={500} o={0.5} color={PIEDRA} />
        <Monte x={2700} alto={360} ancho={560} o={0.45} color={PIEDRA} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={0} hasta={5200} />
        <Olivo x={1850} s={0.7} f={f} color="#2A1A12" />
        <Cueva x={3000} s={1.3} color="#5A2A16" luz={0.25 + ap(f, t3 + 10, 30) * 0.6} />
        {/* Zeus en la cueva: se levanta */}
        {!subido && (
          <g opacity={1 - ap(f, t4 + 50, 20)}>
            {levanta < 1 && <circle cx={3110} cy={SUELO - 180} r={260} fill="url(#halo)" opacity={(1 - levanta) * 0.7} style={{ mixBlendMode: 'screen' }} />}
            <Acostado x={3110} t={levanta} s={0.8}>
              <Personaje x={3110} s={0.8} barba capa={C.purpura} tocado="corona" contorno ojosCerrados={levanta > 0.5} objeto={levanta < 0.2 ? 'rayo' : null}
                brazo={levanta < 0.2 ? [entre(f, t3 + 90, t3 + 120, 40, 160), 10] : [10, 10]} brazoAtras={[-10, -10]} voltear={false} />
            </Acostado>
          </g>
        )}
        {vTend > 0 && vTend < 1 && (
          <Tendones x={lerp([fardoP[0], fardoP[1] - 60], [3000, SUELO - 60], vTend)[0]} y={lerp([fardoP[0], fardoP[1] - 60], [3000, SUELO - 60], vTend)[1] - Math.sin(vTend * Math.PI) * 60} f={f} s={0.8} />
        )}
        {vTend >= 1 && <Chispas x={3110} y={SUELO - 100} f={f} n={20} />}
        <Fardo x={fardoP[0]} y={fardoP[1]} s={0.8} f={f} brillo={vTend > 0 ? 0 : 0.5} rot={lleva ? 10 : 0} />
        {/* Delfine, hechizada por la música */}
        {(() => {
          const hechizo = ap(f, t2, 30) * (1 - ap(f, t4, 30));
          return <MujerSerpiente id="delfine2" x={2520} s={0.85} f={f} voltear contorno alza={1} ojosCerrados={hechizo > 0.5} cabeza={hechizo * Math.sin(f / 12) * 10}
            brazo={[80 - hechizo * 50, 20]} brazoAtras={[-30, -30]} boca={f > t4 + 10 && f < t4 + 70} inclinar={hechizo * Math.sin(f / 15) * 6} />;
        })()}
        <Notas x={manoE[0]} y={manoE[1] - 10} f={f} o={toca ? 1 : 0} />
        <Egipan id="egipan" x={egi.x} s={0.7} f={f} accion={egi.accion} contorno brazo={brazoE} brazoAtras={toca ? [40, 60] : undefined} />
        {toca && <Siringa p={manoE} />}
        <Personaje x={hx} y={hy} s={0.7} accion={vuela ? 'correr' : her.accion} barba={false} tocado="petaso" objeto={lleva ? null : 'caduceo'} alas contorno brazo={brazoH} inclinar={vuela ? 18 : 0}
          voltear={f > t3 + 20 ? false : false} />
        <Rotulo x={her.x} y={SUELO - 300} texto="HERMES" o={vida(f, t1 + 40, t2)} tam={30} />
        <Rotulo x={egi.x - 30} y={SUELO - 360} texto="EGIPÁN" o={vida(f, t1 + 70, t2)} tam={30} />
        {f > t4 - 5 && <CarroAlado x={carroX} y={carroY} s={0.75} f={f} voltear={false} rayo brazo={subido ? [150, 10] : [80, 20]} contorno />}
        <Puf x={3110} y={SUELO - 160} t={(f - t4 - 50) / 24} s={0.7} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · Los frutos efímeros
const Frutos: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [60, 0, 1], [t1 + 70, 1060, 1], [t3, 1060, 1.02], [dur, 1020, 1.08]];
  const tx = entre(f, 0, t1 + 60, 300, 1450), ts = 1.15;
  const debil = ap(f, t4 - 10, 50);
  const carroX = tx - 640 + ap(f, t1, 50) * 200, carroY = SUELO - 440 + Math.sin(f / 10) * 10 - ap(f, t1, 40) * 120;
  const rayos = [30, 58, 86, 112].filter((d) => d < t1);
  const moiras = [1950, 2080, 2210];
  const ofrece = f > t2 + 10;
  const brazoCloto: [number, number] = ofrece ? [entre(f, t2 + 10, t2 + 40, 40, 92), 0] : [70, 50];
  const manoC = manoDe({ x: moiras[0], s: 0.72, voltear: true, brazo: brazoCloto });
  const manoL = manoDe({ x: moiras[1], s: 0.72, voltear: true, brazo: [60, 40] });
  const manoA = manoDe({ x: moiras[2], s: 0.72, voltear: true, brazo: [70, 30] });
  const boca = cabezaDe({ x: tx, s: ts, gigante: true, inclinar: debil * 16 });
  const comer = (k: number) => (f - (t3 + 10 + k * 40)) / 30;
  const brazoT: [number, number] = f > t3 && f < t4 ? [100 + Math.sin(f / 6) * 30, 40] : [60, 20];
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0.06}><Sol x={760} y={280} r={52} f={f} /></Capa>
      <Capa p={0.25}><Nube x={500} y={230} s={0.7} f={f} /><Nube x={1500} y={200} s={0.6} f={f} /></Capa>
      <Capa p={0.5}>
        <Monte x={2000} alto={420} ancho={620} o={0.7} />
        <Rotulo x={2000} y={SUELO - 450} texto="MONTE NISA" o={vida(f, t1 - 10, t2)} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={4000} />
        <Olivo x={700} s={0.7} f={f} />
        <Frutal x={2420} s={0.95} f={f} brillo={ap(f, t3 - 20, 30) * (1 - debil * 0.5)} />
        {/* las Moiras hilando */}
        {moiras.map((x, i) => (
          <Personaje key={x} x={x} s={0.72} mujer voltear tocado="velo" brazo={i === 0 ? brazoCloto : i === 1 ? [60, 40] : [70, 30]} brazoAtras={[-20, -30]} cabeza={debil > 0.5 ? -6 : 0} />
        ))}
        <path d={suave([[manoC[0], manoC[1] + 18], lerp(manoC, manoL, 0.5), manoL, lerp(manoL, manoA, 0.5), manoA])} stroke={C.blanco} strokeWidth={2.5} fill="none" opacity={ofrece ? 0.6 : 1} />
        {!ofrece && <Huso x={manoC[0]} y={manoC[1]} f={f} s={0.9} />}
        <Tijeras x={manoA[0]} y={manoA[1]} s={0.8} abre={Math.abs(Math.sin(f / 10))} />
        <Rotulo x={moiras[1]} y={SUELO - 330} texto="LAS MOIRAS" o={vida(f, t1 + 40, t2 + 30)} />
        <Fruto x={manoC[0]} y={manoC[1]} f={f} o={f > t2 + 20 && comer(0) < 0 ? ap(f, t2 + 20, 15) : 0} />
        <Puf x={manoC[0]} y={manoC[1]} t={(f - t2 - 15) / 22} s={0.35} />
        {[0, 1, 2].map((k) => {
          const t = comer(k);
          if (t < 0 || t > 1) return null;
          const a: P = k === 0 ? manoC : [2420 + (k - 1.5) * 90, SUELO - 300 + k * 20];
          const p = lerp(a, boca, t);
          return <Fruto key={k} x={p[0]} y={p[1] - Math.sin(t * Math.PI) * 100} f={f} />;
        })}
        <Rotulo x={2080} y={SUELO - 400} texto="FRUTOS EFÍMEROS" o={vida(f, t3 + 20, t4 + 40)} />
        <Tifon id="frutos" x={tx} s={ts} cuellos={12} ojos={1} debil={debil} rugido={0.5 * (1 - debil)} inclinar={debil * 16} cabeza={-debil * 18} y={SUELO + debil * 20}
          brazo={brazoT} brazoAtras={[-30 + debil * 20, -40]} boca={f > t3 && f < t4 && Math.floor(f / 5) % 2 === 0} abanico={1 - debil * 0.3} />
        {debil > 0 && <Humo x={tx} y={SUELO - 420} f={f} n={5} s={0.7} o={debil * 0.6} color="#8C5A3C" />}
        {/* Zeus lo persigue en su carro */}
        {f < t1 + 60 && <CarroAlado x={carroX} y={carroY} s={0.62} f={f} brazo={[150, 10]} />}
        {rayos.map((d0, k) => (
          <Relampago key={k} a={[carroX + 40, carroY - 330]} b={[tx - 60 + (azar(k) - 0.5) * 200, SUELO - 500 + azar(k + 2) * 200]} f={f} desde={d0} dur={12} />
        ))}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · El monte Etna
const EtnaE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 0.86], [t2, 0, 0.86], [t2 + 100, 1900, 0.85], [t3, 1900, 0.85], [t4, 1700, 0.9], [dur, 1600, 0.98]];
  // --- Tracia
  const sube = ap(f, 20, 70);
  const tirar = entre(f, t1 - 25, t1, 0, 1, lin), vuelve = entre(f, t1, t1 + 22, 0, 1, lin);
  const carroA: P = [320, SUELO - 400 + Math.sin(f / 12) * 12];
  const manoArriba: P = [1000, SUELO - 650];
  const rocaP: P = f < t1 - 25 ? lerp([1060, SUELO - 40], manoArriba, sube) : f < t1 ? lerp(manoArriba, [carroA[0] + 140, carroA[1] - 60], tirar) : f < t1 + 22 ? lerp([carroA[0] + 140, carroA[1] - 60], [980, SUELO - 380], vuelve) : [1120 + ap(f, t1 + 22, 20) * 40, SUELO - 380 + ap(f, t1 + 22, 25) * 320];
  const golpe = pulso(f, t1 + 22, 30);
  const sangre = ap(f, t1 + 40, 90);
  // --- el mar y Sicilia
  const huye = entre(f, t2 + 10, t2 + 140, 0, 1);
  const tx = f < t2 ? 1000 : lerp([1000, 0], [2560, 0], huye)[0];
  const ty = f < t2 ? SUELO : SUELO + Math.max(0, Math.min(1, (tx - 1650) / 300)) * 230;
  const alza = entre(f, t2 + 70, t2 + 120, 0, 1), cae = entre(f, t2 + 125, t3 - 4, 0, 1, Easing.in(Easing.cubic));
  const ex = lerp([3500, 0], [2560, 0], cae)[0];
  const ey = SUELO - 30 - alza * 300 + cae * (300 + 120);
  const aplasta = f >= t3 - 4;
  const carroB: P = [entre(f, t2 + 40, t3, 1700, 2300) - ap(f, t3 + 40, 90) * 900, SUELO - 400 + Math.sin(f / 12) * 10 - ap(f, t3 + 40, 90) * 260];
  const tiembla = aplasta ? Math.max(pulso(f, t3 - 4, 40) * 1.4, Math.pow(Math.max(0, Math.sin(f / 22)), 10) * 0.7 * ap(f, t4, 20)) : golpe * 1.2;
  const brazoT: [number, number] = f < t1 - 25 ? [entre(f, 20, 90, 60, 175), 0] : f < t1 ? [entre(f, t1 - 25, t1 - 10, 175, 100), 0] : [100 + Math.sin(f / 7) * 20, 30];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}><Estrellas n={60} f={f} area={[-200, 120, 3600, 340]} seed={41} /></Capa>
      <Capa p={0.4}>
        <Monte x={300} alto={260} ancho={500} o={0.5} color={PIEDRA} />
        
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={tiembla}>
          {/* monte Hemo, bañado de sangre */}
          <Monte x={1500} alto={430} ancho={520} o={1} color={PIEDRA} />
          {[[1500, 1380, 1250], [1520, 1600, 1720], [1490, 1460, 1420]].map(([a, b, c], i) => (
            sangre > 0.02 && (
              <g key={i}>
                <path d={suave([[a, SUELO - 420], [(a + b) / 2 + 16, SUELO - 340], [b, SUELO - 260], [(b + c) / 2 - 14, SUELO - 150], [c, SUELO - 40]])} stroke={C.negro} strokeWidth={20} fill="none" strokeLinecap="round" strokeDasharray={`${sangre * 520} 900`} />
                <path d={suave([[a, SUELO - 420], [(a + b) / 2 + 16, SUELO - 340], [b, SUELO - 260], [(b + c) / 2 - 14, SUELO - 150], [c, SUELO - 40]])} stroke={SANGRE} strokeWidth={13} fill="none" strokeLinecap="round" strokeDasharray={`${sangre * 520} 900`} />
              </g>
            )
          ))}
          <Rotulo x={1500} y={SUELO - 480} texto="TRACIA" o={vida(f, 30, t1 - 10)} />
          <Rotulo x={1500} y={SUELO - 480} texto="MONTE HEMO" o={vida(f, t1 + 50, t2 + 40)} />
          <Suelo desde={-800} hasta={1760} />
          {/* Sicilia */}
          <Tierra x={3700} y={SUELO - 10} ancho={1200} alto={110 + ap(f, t2 + 70, 30) * 0} color={C.negro} />
          <Rotulo x={3450} y={SUELO - 180} texto="SICILIA" o={vida(f, t2 + 90, t3 + 60)} />
          {!aplasta && (
            <Tifon id="etna" x={tx} y={ty} s={1.3} voltear={f < t2} contorno cuellos={12} ojos={0.6} debil={0.4} rugido={0.6} brazo={f < t2 ? brazoT : [130, 20]} brazoAtras={f < t2 ? [-175, -10] : [-60, -40]}
              boca={Math.floor(f / 6) % 2 === 0} inclinar={golpe * -10} />
          )}
          <Sangre x={1000} y={SUELO - 380} f={f} o={f > t1 + 22 && f < t2 ? 1 : 0} />
          {f < t2 + 20 && <Roca x={rocaP[0]} y={rocaP[1]} s={1.8} rot={f * 2} seed={5} color={PIEDRA} fuego={f > t1 - 2 && f < t1 + 22} f={f} />}
          <Destello x={980} y={SUELO - 380} o={golpe} r={220} />
          {/* el Etna se levanta y cae */}
          <Etna x={ex} y={ey} s={0.75} f={f} humo={aplasta ? ap(f, t3 + 20, 40) : 0} lava={aplasta ? ap(f, t4, 60) : 0} luz={aplasta ? ap(f, t4, 40) : alza * 0.4} rot={(1 - cae) * alza * -6} />
          <Agua nivel={SUELO - 30} f={f} x0={1700} x1={5000} alto={26} />
          {aplasta && [[-440, 1], [-330, -1], [380, 1], [460, -1]].map(([dx, sg], i) => {
            const vive = 1 - ap(f, t3 + 40 + i * 20, 80);
            const w = Math.sin(f / 5 + i) * 30 * vive;
            const b: P = [2560 + dx, SUELO - 10];
            return <Serpiente key={i} pts={[b, [b[0] + sg * 40 * (dx < 0 ? -1 : 1), b[1] - 60 - w], [b[0] + (dx < 0 ? -90 : 90), b[1] - 100 * (0.4 + vive * 0.6) + w], [b[0] + (dx < 0 ? -150 : 150), b[1] - 60 * (0.3 + vive)]]} ancho={30} f={f} k={i} claro fuego={vive} />;
          })}
          {aplasta && <circle cx={2560} cy={SUELO - 10} r={500} fill="url(#halo)" opacity={pulso(f, t3 - 4, 50)} style={{ mixBlendMode: 'screen' }} />}
          {aplasta && <Chispas x={2560} y={SUELO - 400} f={f} n={30} viento={-1} />}
          <Rotulo x={3020} y={SUELO - 300} texto="ETNA" o={ap(f, t4 + 20, 20)} tam={44} />
        </Tiembla>
        {/* Zeus en su carro */}
        {f < t2 ? <CarroAlado x={carroA[0]} y={carroA[1]} s={0.62} f={f} brazo={[150, 10]} contorno /> : <CarroAlado x={carroB[0]} y={carroB[1]} s={0.62} f={f} brazo={[160, 10]} contorno />}
        <Relampago a={[carroA[0] + 40, carroA[1] - 320]} b={[carroA[0] + 160, carroA[1] - 80]} f={f} desde={t1 - 4} dur={16} />
        {[0, 1, 2, 3].map((k) => (
          <Relampago key={k} a={[carroB[0] + 40, carroB[1] - 320]} b={[ex + (k - 1.5) * 60, ey - 380]} f={f} desde={t2 + 70 + k * 14} dur={12} />
        ))}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · Los hijos del monstruo
const OLIMPICOS: { p: Partial<PersonajeProps> }[] = [
  { p: { mujer: true, objeto: 'antorcha', tocado: 'velo' } }, // Deméter
  { p: { tocado: 'casco', objeto: 'lanza', ropa: 'armadura', escudo: true } }, // Ares
  { p: { objeto: 'martillo' } }, // Hefesto
  { p: { mujer: true, tocado: 'casco', objeto: 'lanza', escudo: true } }, // Atenea
  { p: { objeto: 'tridente' } }, // Poseidón
  { p: { mujer: true, tocado: 'corona', objeto: 'cetro' } }, // Hera
  { p: { tocado: 'corona', objeto: 'rayo', capa: C.purpura } }, // Zeus
  { p: { barba: false, tocado: 'laurel', objeto: 'lira' } }, // Apolo
  { p: { mujer: true, ropa: 'corta', objeto: 'arco' } }, // Ártemis
  { p: { mujer: true, tocado: 'diadema' } }, // Afrodita
  { p: { barba: false, tocado: 'petaso', objeto: 'caduceo', alas: true } }, // Hermes
  { p: { tocado: 'laurel', objeto: 'tirso' } }, // Dioniso
];
const Cierre: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const d1 = fin(1) - t1;
  const tc = [t1, t1 + d1 * 0.28, t1 + d1 * 0.45, t1 + d1 * 0.72];
  const salto = t3 + 10;
  const cam: Cam = [[0, 0, 1.04], [t1, 0, 1], [tc[1] + 10, 820, 1], [tc[2] + 10, 1450, 1], [tc[3] + 10, 2080, 1], [t2 + 40, 2380, 1], [salto - 1, 2420, 1.02], [salto, 6000, 1.05], [t4, 6000, 0.95], [dur, 6000, 0.92]];
  const hijos = [
    { x: 1200, n: 'CERBERO' }, { x: 1800, n: 'HIDRA' }, { x: 2450, n: 'QUIMERA' }, { x: 3050, n: 'ORTRO' },
  ];
  const heroe = andar(f, t2 - 10, t2 + 90, 3900, 3500);
  const noche = 1 - ap(f, salto, 20);
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Velo o={0.62 * noche} color="#1A0A05" />
      <Capa p={0.05}>
        <g opacity={noche}><Estrellas n={50} f={f} area={[0, 140, 2600, 320]} seed={51} /></g>
        <g opacity={1 - noche}><Sol x={1900} y={250} r={56} f={f} /></g>
      </Capa>
      <Capa p={0.3}>
        <g opacity={noche * 0.22}><Tifon id="sombra" x={300} s={1.6} cuellos={12} ojos={0.6} piel="#2A1408" /></g>
        <g opacity={noche}><Nube x={1700} y={220} s={0.7} f={f} color="#5A3A2A" /></g>
      </Capa>
      <Capa p={1}>
        {f < salto && (
          <g>
            <Suelo desde={-600} hasta={4400} />
            <Cueva x={330} s={0.9} color="#5A2A16" luz={0.5} />
            <MujerSerpiente id="equidna" x={620} s={0.85} f={f} contorno alza={1} opacity={ap(f, 10, 25)} tocado="velo" brazo={[entre(f, t1, t1 + 30, 30, 95), 0]} brazoAtras={[-30, -30]} />
            <Rotulo x={620} y={SUELO - 430} texto="EQUIDNA" o={vida(f, 40, t1 + 40)} />
            {hijos.map((h, i) => {
              const o = ap(f, tc[i], 20);
              return (
                <g key={h.n}>
                  <Puf x={h.x} y={SUELO - 140} t={(f - tc[i]) / 26} s={0.9} />
                  <g opacity={o}>
                    {i === 0 && <Perro x={h.x} s={1.15} f={f} n={3} ladra colaSerpiente />}
                    {i === 1 && <Hidra x={h.x + 40} s={1.15} f={f} n={7} />}
                    {i === 2 && <Quimera x={h.x} s={1} f={f} fuego={ap(f, tc[2] + 20, 20)} />}
                    {i === 3 && <Perro x={h.x} s={1.05} f={f + 20} n={2} ladra={f > t2} />}
                  </g>
                  <Rotulo x={h.x} y={SUELO - (i === 1 ? 420 : 360)} texto={h.n} o={o} tam={32} />
                </g>
              );
            })}
            <Personaje x={heroe.x} s={0.85} voltear accion={heroe.accion} tocado="casco" objeto="lanza" escudo emblema="leon" brazo={[95, -10]} contorno opacity={ap(f, t2 - 10, 20)} />
            <Rotulo x={3400} y={SUELO - 440} texto="LOS HÉROES" o={vida(f, t2 + 40, salto - 10)} tam={30} />
          </g>
        )}
        {f >= salto && (
          <g>
            <Suelo desde={5200} hasta={8000} />
            <Cumbre x={6960} cima={SUELO - 120} ancho={1900} meseta={760} color={C.barroOscuro} templo={false} />
            <circle cx={6960} cy={SUELO - 360} r={520} fill="url(#halo)" opacity={ap(f, t4, 40) * 0.6} style={{ mixBlendMode: 'screen' }} />
            <Templo x={6960} y={SUELO - 120} s={1.25} />
            {OLIMPICOS.map((d, i) => {
              const xf = i < 6 ? 6960 - 840 + i * 95 : i === 6 ? 6960 : 6960 + 325 + (i - 7) * 95, desdeIzq = i < 6;
              const h = andar(f, salto + 10 + Math.abs(i - 5.5) * 6, salto + 100 + Math.abs(i - 5.5) * 6, xf + (desdeIzq ? -700 : 700), xf);
              return <Personaje key={i} x={h.x} y={SUELO - 120} s={i === 6 ? 0.6 : 0.5} accion={h.accion} voltear={h.accion !== 'parado' ? !desdeIzq : i > 6} barba={!d.p.mujer} {...d.p} brazo={i === 6 && f > t4 ? [160, 10] : undefined} contorno={i === 6} />;
            })}
            <Rotulo x={6960} y={SUELO - 470} texto="LOS DOCE OLÍMPICOS" o={ap(f, t4 + 10, 25)} tam={48} color={C.oro} />
          </g>
        )}
        <Velo o={Math.max(f < salto ? ap(f, salto - 20, 18) : 0, f >= salto ? 1 - ap(f, salto, 22) : 0)} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  nacimiento: Nacimiento,
  monstruo: Monstruo,
  voces: Voces,
  huida: Huida,
  combate: Combate,
  tendones: Tendones6,
  rescate: Rescate,
  frutos: Frutos,
  etna: EtnaE,
  cierre: Cierre,
};
