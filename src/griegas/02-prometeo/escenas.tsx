// Escenas del video 02 · Prometeo y el fuego robado (estilo vasija detallada).
import React from 'react';
import { Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, P, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Olas, Nube, Relampago, Suelo, Rotulo, suave, lerp, Inc, Borde, ap, entre, azar, cl, SUELO, TITULO } from '../../comun/vasija';
import type { EscenaV } from './video';
import {
  manos, Leon, Gacela, Ave, Oso, Tortuga, Buey, Caballo, Aguila, Monticulo, Vientre, Grasa, Altar, Humo, Cueva, Ojos, Fogata,
  CarroSol, Fragua, Yunque, CanaCerca, Torno, Vasija, Tablilla, Constelacion, Penasco, Cadena, Grillete, Nieve, Viento, PielLeon, Flecha, Pithos, FuegosLejanos,
} from './piezas';

type Cam = [number, number, number][];
const PROM = { barba: true, capa: C.purpura, tocado: 'cinta' as const };
const EPI = { barba: false, capa: C.blanco, tocado: 'cinta' as const };
const ZEUS = { barba: true, capa: C.purpura, tocado: 'corona' as const, objeto: 'rayo' as const };

const lin = (f: number, ks: number[], vs: number[]) => interpolate(f, ks, vs, cl);
const anda = (f: number, ks: number[], vs: number[]) => Math.abs(lin(f + 1, ks, vs) - lin(f, ks, vs)) > 0.15;
const camX = (f: number, cam: Cam) => (cam.length > 1 ? interpolate(f, cam.map((c) => c[0]), cam.map((c) => c[1]), { ...cl, easing: Easing.inOut(Easing.sin) }) : cam[0][1]);
const mezcla = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const Oscuro: React.FC<{ o: number; color?: string }> = ({ o, color = C.noche }) => <rect x={-3000} y={0} width={9000} height={1200} fill={color} opacity={o} />;
const Destello: React.FC<{ o: number }> = ({ o }) => <rect x={-3000} y={0} width={9000} height={1200} fill={C.blanco} opacity={o} />;
const Lema: React.FC<{ x: number; y: number; texto: string; o: number }> = ({ x, y, texto, o }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={TITULO} fontSize={24} fill={C.crema} opacity={o} letterSpacing={2} stroke={C.negro} strokeWidth={5} style={{ paintOrder: 'stroke' }}>{texto}</text>
);
/** Orbe de luz que viaja en arco de a hacia b (t 0→1). */
const Orbe: React.FC<{ a: P; b: P; t: number; alto?: number }> = ({ a, b, t, alto = 160 }) => {
  if (t <= 0 || t >= 1) return null;
  const pos = (u: number): P => { const p = lerp(a, b, u); return [p[0], p[1] - Math.sin(u * Math.PI) * alto]; };
  const p = pos(t);
  return (
    <g>
      {[1, 2, 3, 4, 5].map((i) => { const q = pos(Math.max(0, t - i * 0.04)); return <circle key={i} cx={q[0]} cy={q[1]} r={7 - i} fill={C.oro} opacity={1 - i * 0.17} />; })}
      <circle cx={p[0]} cy={p[1]} r={50} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />
      <circle cx={p[0]} cy={p[1]} r={11} fill={C.oro} stroke={C.negro} strokeWidth={2} />
    </g>
  );
};

// =====================================================================================
// 1 · Dos hermanos titanes
// =====================================================================================
const Hermanos: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4] = [at(1), at(2), at(3), at(4)];
  const CAM: Cam = [[0, 0, 1.1], [a1 - 40, 60, 1.1], [a2 - 20, 700, 1], [a4, 760, 1], [dur, 860, 0.94]];
  const cx = camX(f, CAM);
  const pK = [a1 - 30, a1 + 220], pV = [520, 1500];
  const eK = [a1 - 60, a1 + 230, a3, a3 + 60, a3 + 75, a3 + 95], eV = [640, 1880, 1880, 2140, 2160, 2160];
  const eX = lin(f, eK, eV);
  const tropiezo = Math.sin(entre(f, a3 + 55, a3 + 95, 0, Math.PI, Easing.linear)) * 24;
  const piensa = entre(f, a2 + 5, a2 + 30, 0, 1) * (1 - entre(f, a3 - 10, a3 + 15, 0, 1));
  const mira = entre(f, a4 + 10, a4 + 40, 0, 22);
  const haz = ap(f, a4, 30);
  const zeusW: P = [700 + cx * 0.7, 320];
  return (
    <Escenario dur={dur} camara={CAM}>
      <Capa p={0.15}>
        <Nube x={300} y={240} s={0.6} f={f} />
        <Nube x={1500} y={200} s={0.5} f={f + 60} />
        <Nube x={2300} y={260} s={0.7} f={f + 20} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={700} alto={470} ancho={760} templo />
        <Personaje x={700} y={326} s={0.3} {...ZEUS} brazo={[150, 20]} contorno />
        <Monte x={1900} alto={300} ancho={600} o={0.4} />
        <Relampago a={[700, 200]} b={[520, 520]} f={f} desde={70} />
        <Relampago a={[720, 200]} b={[900, 560]} f={f} desde={160} />
      </Capa>
      <Capa p={0.6}>
        <path d="M-200 800 C 300 700, 700 720, 1100 750 C 1600 790, 2100 700, 3200 740 L 3200 820 L -200 820 Z" fill={C.barroOscuro} opacity={0.4} />
        <Olivo x={1250} s={0.8} f={f} color={C.barroOscuro} />
        <Olivo x={2350} s={1} f={f + 40} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        {/* haz de luz del Olimpo: el encargo */}
        {haz > 0 && (
          <g opacity={haz}>
            <path d={`M${zeusW[0] - 20} ${zeusW[1]} L ${zeusW[0] + 20} ${zeusW[1]} L 2300 ${SUELO} L 1300 ${SUELO} Z`} fill={C.oro} opacity={0.18} />
            {Array.from({ length: 22 }, (_, i) => {
              const u = ((f * 0.012 + azar(i)) % 1), p = lerp(zeusW, [1800 + (azar(i + 4) - 0.5) * 700, SUELO - 40], u);
              return <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={C.blanco} opacity={Math.sin(u * Math.PI)} />;
            })}
          </g>
        )}
        <path d="M2196 790 c 4 -22, 40 -26, 46 0 Z" fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />
        <Personaje x={lin(f, pK, pV)} accion={anda(f, pK, pV) ? 'caminar' : 'parado'} {...PROM} brazo={mezcla([20, 30], [128, 88], piensa)} cabeza={mira} opacity={ap(f, a1 - 30, 20)} />
        <Personaje x={eX} accion={anda(f, eK, eV) ? 'caminar' : 'parado'} {...EPI} inclinar={tropiezo} voltear={f > a3 + 110 && f < a4 + 20} boca={f > a3 + 70 && f < a3 + 130} cabeza={mira} brazo={f > a3 + 60 && f < a3 + 110 ? [110, -10] : undefined} opacity={ap(f, a1 - 60, 20)} />
        {/* idea de Prometeo: una lucecita que ve venir las cosas */}
        {piensa > 0 && (
          <g opacity={piensa}>
            <circle cx={1560} cy={350} r={60} fill="url(#haloBlanco)" />
            <path d="M1560 330 C 1590 330, 1600 360, 1580 372 L 1580 384 L 1540 384 L 1540 372 C 1520 360, 1530 330, 1560 330 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />
            <path d={`M1610 360 L ${1660 + piensa * 60} 360`} stroke={C.crema} strokeWidth={4} strokeDasharray="8 8" />
            <path d={`M${1660 + piensa * 60} 350 l 14 10 l -14 10`} stroke={C.crema} strokeWidth={4} fill="none" />
          </g>
        )}
        <Rotulo x={lin(f, pK, pV) + 20} y={385} texto="ΠΡΟΜΗΘΕΥΣ" o={ap(f, a2 - 30) * (1 - ap(f, a4 + 40))} />
        <Lema x={lin(f, pK, pV) + 20} y={292} texto="el que piensa antes" o={ap(f, a2 + 10) * (1 - ap(f, a3))} />
        <Rotulo x={eX + 20} y={385} texto="ΕΠΙΜΗΘΕΥΣ" o={ap(f, a3 - 20) * (1 - ap(f, a4 + 40))} />
        <Lema x={eX + 20} y={340} texto="el que piensa después" o={ap(f, a3 + 20) * (1 - ap(f, a4))} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 2 · El reparto de los dones
// =====================================================================================
const Cofre: React.FC<{ p: P; f: number; lleno: number; giro: number }> = ({ p, f, lleno, giro }) => (
  <g transform={`translate(${p[0]} ${p[1]}) rotate(${giro})`}>
    {lleno > 0 && <circle cy={-30} r={60 + Math.sin(f / 5) * 6} fill="url(#halo)" opacity={lleno} style={{ mixBlendMode: 'screen' }} />}
    <path d="M-34 -6 L 34 -6 L 30 26 L -30 26 Z" fill={C.negro} />
    <Borde d="M-32 8 L 32 8" w={8} />
    <path d={`M-36 -6 L 36 -6 L 36 -16 L -36 -16 Z`} fill={C.negro} transform={`rotate(${-30 - lleno * 10} -36 -6)`} stroke={C.crema} strokeWidth={1.5} />
    {lleno > 0 && [0, 1, 2].map((i) => <circle key={i} cx={-14 + i * 14} cy={-12 - Math.abs(Math.sin(f / 6 + i)) * 6} r={5} fill={C.oro} opacity={lleno} />)}
  </g>
);

const Dones: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4] = [at(1), at(2), at(3), at(4)];
  const CAM: Cam = [[0, 0, 1], [a1 - 10, 40, 1], [a1 + 45, 350, 1], [a1 + 115, 650, 1], [a2 + 30, 1000, 1], [a2 + 100, 1300, 1], [a2 + 170, 1600, 1], [a3 + 40, 1820, 1], [a4, 1880, 1], [a4 + 90, 2060, 1.08], [dur, 2090, 1.1]];
  const eK = [0, a1 - 10, a1 + 40, a1 + 110, a2 + 25, a2 + 95, a2 + 165, a3 + 40], eV = [760, 760, 1050, 1350, 1700, 2000, 2300, 2420];
  const eX = lin(f, eK, eV);
  const brazo: [number, number] = [70, 20];
  const mano = manos(eX, 1, brazo, [-20, -40]).del;
  // dones: [frame de lanzamiento, x del animal, y del centro]
  const dones: [number, number, number][] = [[a1 + 20, 1310, SUELO - 120], [a1 + 90, 1640, SUELO - 160], [a2 + 10, 1980, 420], [a2 + 80, 2280, SUELO - 120], [a2 + 150, 2600, SUELO - 50]];
  const nace = (i: number) => dones[i][0] + 22;
  const apar = (i: number) => ap(f, nace(i), 14);
  const restantes = dones.filter((d) => f < d[0]).length / dones.length;
  const vacio = f > a3;
  const giro = entre(f, a3 + 20, a3 + 50, 0, 150) * (1 - entre(f, a4 - 20, a4 + 10, 0, 1));
  const pK = [a1 - 60, a1 + 60], pV = [520, 160];
  return (
    <Escenario dur={dur} camara={CAM}>
      <Capa p={0.2}>
        <Sol x={1700} y={260} r={46} f={f} />
        <Nube x={800} y={250} s={0.6} f={f} />
      </Capa>
      <Capa p={0.4}>
        <Monte x={900} alto={300} ancho={700} o={0.35} />
        <Monte x={2100} alto={380} ancho={800} o={0.4} />
      </Capa>
      <Capa p={0.7}>
        <Olivo x={600} s={0.7} f={f} color={C.barroOscuro} />
        <Olivo x={2000} s={0.8} f={f + 30} color={C.barroOscuro} />
        <Olivo x={3100} s={0.7} f={f + 60} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        {/* Prometeo acepta y se va */}
        <Personaje x={lin(f, pK, pV)} accion={anda(f, pK, pV) ? 'caminar' : 'parado'} voltear={f > a1 - 70} {...PROM} brazo={f < a1 - 80 ? [60, 30] : undefined} opacity={1 - ap(f, a1 + 30, 30)} />
        {/* animales */}
        <g opacity={apar(0)}><Leon x={1310 + Math.max(0, f - nace(0) - 60) * 0.8} s={0.6 + apar(0) * 0.4} f={f} anda={f > nace(0) + 60} /></g>
        {f > nace(1) && <Gacela x={1640 + Math.max(0, f - nace(1) - 20) * 7} s={0.95} f={f} corre={f > nace(1) + 20} opacity={apar(1)} />}
        <Ave x={1980 + Math.max(0, f - nace(2)) * 2.2} y={420 - Math.max(0, f - nace(2)) * 0.5} s={0.6 + apar(2) * 0.3} f={f} opacity={apar(2)} />
        <Ave x={2120 + Math.max(0, f - nace(2) - 10) * 2.4} y={360 - Math.max(0, f - nace(2)) * 0.4} s={0.5} f={f + 7} opacity={ap(f, nace(2) + 10)} />
        <g opacity={apar(3)}><Oso x={2280 - Math.max(0, f - nace(3) - 30) * 0.6} s={0.75} f={f} anda={f > nace(3) + 30} voltear /></g>
        <g opacity={apar(4)}><Tortuga x={2600} s={0.9} f={f} /></g>
        {dones.map(([t0, x, y], i) => (
          <g key={i}>
            <Orbe a={mano} b={[x, y]} t={(f - t0) / 22} />
            {f > nace(i) && f < nace(i) + 50 && <Chispas x={x} y={y + 20} f={f - nace(i)} n={16} viento={0} />}
          </g>
        ))}
        {/* Epimeteo con el cofre de los dones */}
        <Personaje x={eX} accion={anda(f, eK, eV) ? 'caminar' : 'parado'} {...EPI} brazo={vacio && f < a4 ? [100, 10] : brazo} boca={(f > a3 + 40 && f < a3 + 90) || f > a4 + 20} cabeza={vacio && f < a4 ? -10 : 0} />
        <Cofre p={vacio && f < a4 ? manos(eX, 1, [100, 10], [-20, -40]).del : mano} f={f} lleno={vacio ? 0 : Math.max(0.15, restantes)} giro={giro} />
        {vacio && f < a3 + 60 && <Chispas x={mano[0]} y={mano[1] - 10} f={f - a3} n={5} viento={0} />}
        {/* el ser humano, sin nada */}
        <Personaje x={2950} s={0.85} ropa="desnudo" barba={false} tocado={null} opacity={ap(f, a4, 30)} cabeza={Math.sin(f / 18) * 8} voltear={f > a4 + 90} brazo={[30, 10]} />
        <Rotulo x={2965} y={445} texto="ΑΝΘΡΩΠΟΣ" o={ap(f, a4 + 30)} />
        <Rotulo x={1330} y={600} texto="ΛΕΩΝ" tam={26} o={apar(0) * (1 - ap(f, a2))} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 3 · Hombres de barro
// =====================================================================================
const Barro: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4] = [at(1), at(2), at(3), at(4)];
  const CAM: Cam = [[0, 0, 1], [a1, 120, 1], [a2, 420, 1.06], [a3, 420, 1], [a4, 460, 1.04], [dur, 470, 1.12]];
  const pK = [0, a1 - 10], pV = [380, 820];
  const molde = f > a1 && f < a2 + 40;
  const golpe = Math.max(0, Math.sin(f * 0.25)) * 10;
  const figs = [1050, 1200, 1350];
  const sube = (i: number) => entre(f, a1 + 60 + i * 30, a1 + 140 + i * 30, 0, 1);
  const mirar = f < a2 + 30 ? -12 : entre(f, a2 + 30, a2 + 70, -12, 8) + entre(f, a4, a4 + 40, 0, 16);
  const vida = (i: number) => ap(f, a3 + 70 + i * 22, 26);
  const atK = [a3 - 40, a3 + 70], atV = [2150, 1660];
  const noche = entre(f, a4 - 10, a4 + 50, 0, 0.5);
  return (
    <Escenario dur={dur} camara={CAM}>
      <Oscuro o={noche} />
      <g opacity={ap(f, a4 + 20, 40)}><Estrellas f={f} n={36} area={[0, 140, 1920, 300]} /></g>
      <Capa p={0.25}>
        <Monte x={500} alto={340} ancho={620} o={0.35} />
        <Monte x={1500} alto={420} ancho={700} o={0.45} templo />
      </Capa>
      <Capa p={0.6}>
        <Olas y={714} f={f} color={C.mar} alto={26} capas={1} />
        <Olivo x={300} s={0.6} f={f} />
        <Olivo x={2100} s={0.7} f={f} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        {/* un animal mira al suelo */}
        <g opacity={ap(f, a2 - 10)}><Oso x={lin(f, [a2 - 10, a2 + 90], [260, 520])} s={0.7} f={f} anda={f < a2 + 90} /></g>
        <Personaje x={lin(f, pK, pV)} accion={anda(f, pK, pV) ? 'caminar' : 'parado'} {...PROM} inclinar={molde ? 22 : 0} brazo={molde ? [50 + golpe, 20] : f > a2 + 40 && f < a3 ? [165, 10] : undefined} cabeza={molde ? -10 : 0} />
        {figs.map((x, i) => {
          const t = sube(i);
          return (
            <g key={i}>
              <Monticulo x={x + 10} t={t} s={1 - t * 0.4} />
              <clipPath id={`brota${i}`}><rect x={x - 200} y={SUELO - 340 * t} width={400} height={400} /></clipPath>
              <g clipPath={`url(#brota${i})`}>
                <Personaje x={x} s={0.82} ropa="desnudo" barba={false} tocado={null} piel={C.barroOscuro} ojosCerrados cabeza={mirar} opacity={1 - vida(i)} brazo={[10, 10]} />
                {vida(i) > 0 && <Personaje x={x} s={0.82} ropa="desnudo" barba={false} tocado={null} cabeza={mirar} opacity={vida(i)} brazo={f > a4 + 40 ? [150 - i * 15, 15] : [10, 10]} contorno={noche > 0.2} />}
              </g>
            </g>
          );
        })}
        {/* soplo de Atenea */}
        {f > a3 + 60 && figs.map((x, i) => {
          const o = ap(f, a3 + 50 + i * 20) * (1 - ap(f, a4 - 10));
          return <path key={i} d={suave([[1605, 465], [1500, 430 - i * 10], [x + 160, 470 + Math.sin(f / 8 + i) * 16], [x + 40, 520]])} stroke={C.blanco} strokeWidth={4} fill="none" strokeDasharray="14 12" strokeDashoffset={-f * 3} opacity={o} />;
        })}
        <Personaje x={lin(f, atK, atV)} accion={anda(f, atK, atV) ? 'caminar' : 'parado'} voltear mujer tocado="casco" objeto="lanza" escudo emblema="gorgona" boca={f > a3 + 60 && f < a4} opacity={ap(f, a3 - 40)} />
        <Rotulo x={820} y={400} texto="ΠΡΟΜΗΘΕΥΣ" o={ap(f, 20) * (1 - ap(f, a1 + 60))} />
        <Rotulo x={1640} y={365} texto="ΑΘΗΝΑ" o={ap(f, a3 + 70) * (1 - ap(f, a4 + 30))} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 4 · El engaño de Mecone
// =====================================================================================
const Mecone: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4, a5] = [at(1), at(2), at(3), at(4), at(5)];
  const CAM: Cam = [[0, 0, 1], [a1 - 60, 760, 1], [a1, 520, 1], [a4, 520, 1], [a4 + 90, 380, 1.1], [a5, 420, 1.1], [a5 + 60, 640, 1], [dur, 700, 1.03]];
  const bK = [a1, a1 + 80], bV = [1900, 1440];
  const corte = a1 + 95;
  const flash = interpolate(f, [corte, corte + 3, corte + 20], [0, 0.9, 0], cl);
  const abierto = f < a2 ? 0 : entre(f, a2, a2 + 20, 0, 1) * (1 - entre(f, a2 + 120, a2 + 160, 0, 1));
  const alzar = f < a3 ? 0 : f < a4 + 60 ? entre(f, a3, a3 + 15, 0, 1) * (1 - entre(f, a3 + 70, a3 + 130, 0, 1)) : entre(f, a4 + 85, a4 + 115, 0, 1);
  const zK = [a4, a4 + 80], zV = [560, 1060];
  const furia = f > a4 + 115;
  const pK = [a4 - 40, a4 + 30], pV = [1120, 1800];
  const altar = ap(f, a5 - 10, 30);
  const enojo = furia ? entre(f, a4 + 115, a4 + 140, 0, 0.35) * (1 - entre(f, a5, a5 + 40, 0, 1)) : 0;
  return (
    <Escenario dur={dur} camara={CAM}>
      <Oscuro o={enojo} />
      <Capa p={0.2}>
        <Nube x={500} y={230} s={0.6} f={f} />
        <Nube x={1700} y={260} s={0.5} f={f + 50} />
      </Capa>
      <Capa p={0.45}>
        <Templo x={700} y={SUELO - 40} s={1.1} color={C.barroOscuro} />
        <Monte x={1800} alto={300} ancho={700} o={0.4} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        <Relampago a={[1250, 130]} b={[1290, SUELO - 180]} f={f} desde={a4 + 120} />
        <Relampago a={[1350, 130]} b={[1200, SUELO - 200]} f={f} desde={a4 + 150} />
        {/* dioses */}
        <Personaje x={180} alas tocado="petaso" objeto="caduceo" barba={false} />
        <Personaje x={370} mujer tocado="velo" objeto="cetro" />
        <Personaje x={lin(f, zK, zV)} accion={anda(f, zK, zV) ? 'caminar' : 'parado'} {...ZEUS} objeto={furia ? 'rayo' : 'cetro'} brazo={f > a4 + 80 && f < a4 + 115 ? [95, 0] : furia ? [150, 20] : undefined} boca={furia && f < a5} />
        {/* humanos */}
        {[1960, 2090, 2220].map((x, i) => (
          <Personaje key={x} x={x - (f > a5 + 30 ? entre(f, a5 + 30, a5 + 110, 0, 130) : 0)} accion={f > a5 + 30 && f < a5 + 110 ? 'caminar' : 'parado'} s={0.85} ropa="corta" barba={i !== 1} voltear brazo={f > a5 + 120 && i === 0 ? [60, 120] : undefined} />
        ))}
        {/* el buey */}
        {f < corte + 6 && <Buey x={lin(f, bK, bV)} s={0.95} f={f} anda={anda(f, bK, bV)} voltear opacity={ap(f, a1, 15)} />}
        {f > corte && f < a5 + 30 && <g opacity={ap(f, corte, 10) * (1 - ap(f, a5, 30))}><Grasa x={1290} alzar={alzar} f={f} /></g>}
        {f > corte && <g opacity={ap(f, corte, 10)}><Vientre x={1560} abierto={abierto} f={f} /></g>}
        {altar > 0 && (
          <g opacity={altar}>
            <Altar x={1290} f={f} fuego={ap(f, a5 + 10, 30)} />
            <Humo x={1290} y={SUELO - 260} f={f} alto={420} o={ap(f, a5 + 30, 40) * 0.8} />
          </g>
        )}
        {/* Prometeo */}
        <Personaje x={lin(f, pK, pV)} accion={anda(f, pK, pV) ? 'caminar' : 'parado'} {...PROM} objeto={f > a1 + 40 && f < corte + 30 ? 'espada' : null} brazo={f > a1 + 60 && f < corte ? [165, 10] : f > a2 && f < a3 + 130 ? [80, 10] : undefined} voltear={f > a5 + 40} />
        <Destello o={flash} />
        <Rotulo x={960} y={330} texto="ΜΗΚΩΝΗ" tam={44} o={ap(f, 140, 20) * (1 - ap(f, a1 - 20))} />
        <Rotulo x={lin(f, zK, zV) + 20} y={385} texto="ΖΕΥΣ" o={ap(f, a4) * (1 - ap(f, a5))} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 5 · La venganza de Zeus
// =====================================================================================
const SinFuego: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3] = [at(1), at(2), at(3)];
  const CAM: Cam = [[0, 0, 1], [a1, 120, 1], [a2, 300, 1], [a3, 760, 1], [dur, 860, 1.1]];
  const apaga = [a1 - 70, a1 - 40, a1 - 10];
  const fuegos = [900, 1300, 1700];
  const fz = (i: number) => 1 - entre(f, apaga[i], apaga[i] + 14, 0, 1);
  const oscuro = entre(f, a1 - 60, a1 + 20, 0, 0.45);
  const tiembla = (i: number) => (f > a2 ? Math.sin(f * 1.7 + i * 2) * 1.6 : 0);
  return (
    <Escenario dur={dur} camara={CAM} cielo="noche">
      <Oscuro o={oscuro} />
      <Estrellas f={f} n={40} />
      <Luna x={1650} y={230} r={38} />
      <Capa p={0.3}>
        <Monte x={360} alto={480} ancho={600} templo o={0.7} />
        <Personaje x={360} y={316} s={0.3} {...ZEUS} brazo={f > 60 ? [160, 10] : [60, 20]} contorno />
        <Monte x={1500} alto={300} ancho={700} o={0.4} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={500} s={0.7} f={f} />
        <Olivo x={1900} s={0.8} f={f + 40} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        <Viento f={f} o={ap(f, a2, 30) * 0.7} y={260} />
        {fuegos.map((x, i) => (
          <g key={x}>
            <Fogata x={x} f={f} fuego={fz(i)} s={0.9} />
            {f > apaga[i] && <Humo x={x} y={SUELO - 30} f={f - apaga[i]} alto={260} o={0.6 * (1 - ap(f, apaga[i] + 80, 40))} />}
            <Personaje x={x - 120} s={0.75} ropa="desnudo" tocado={null} barba={i !== 1} brazo={f > a2 + 10 && f < a3 ? [60, 120] : [80, 0]} contorno={oscuro > 0.2} cabeza={f > apaga[i] && f < a2 ? 18 : 0} y={SUELO} />
            <g transform={`translate(${tiembla(i)} 0)`}>
              <Personaje x={x + 120} s={0.7} ropa="desnudo" tocado={null} mujer={i === 1} barba={false} voltear brazo={f > a2 ? [40, 140] : [80, 0]} contorno={oscuro > 0.2} />
            </g>
          </g>
        ))}
        {/* la cueva y las sombras */}
        <Cueva x={2050} s={0.85} />
        {[1940, 2060, 2170].map((x, i) => (
          <g key={x} transform={`translate(${f > a3 ? Math.sin(f * 1.9 + i) * 1.5 : 0} 0)`} opacity={ap(f, a3 - 20)}>
            <Personaje x={x} s={0.62} ropa="desnudo" tocado={null} barba={i === 0} mujer={i === 2} voltear={i === 2} inclinar={-6} brazo={[40, 140]} contorno />
          </g>
        ))}
        <Ojos x={1520} y={700} f={f} o={ap(f, a3 + 30)} seed={1} />
        <Ojos x={2620} y={690} f={f} o={ap(f, a3 + 60)} seed={2} />
        <Ojos x={2760} y={640} f={f} o={ap(f, a3 + 90)} seed={3} />
        <Ojos x={1380} y={630} f={f} o={ap(f, a3 + 110)} seed={4} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 6 · El robo del fuego (dos planos: la cima del Olimpo y la carrera hacia la tierra)
// =====================================================================================
const RoboCima: React.FC<{ dur: number; a1: number; a2: number }> = ({ dur, a1, a2 }) => {
  const f = useCurrentFrame();
  const CAM: Cam = [[0, 0, 1], [a1, 0, 1.04], [a1 + 110, 260, 1], [a2, 520, 1.1], [dur, 540, 1.16]];
  const pK = [18, 140, a1 + 100, a2 - 20], pV = [-120, 260, 260, 1060];
  const px = lin(f, pK, pV);
  const corre = f > a1 + 100 && f < a2 - 20;
  const enFragua = f >= a2 - 20;
  const mano = manos(1060, 1, [95, 0], [-20, -40]).del;
  const cerca = ap(f, a2 + 30, 15) * (1 - ap(f, dur - 40, 15));
  return (
    <Escenario dur={dur} camara={CAM} cielo="noche">
      <Estrellas f={f} n={44} />
      <Capa p={0.15}>
        <Nube x={300} y={600} s={1.2} f={f} color={C.barroOscuro} />
        <Nube x={1700} y={640} s={1.4} f={f + 40} color={C.barroOscuro} />
      </Capa>
      <Capa p={0.5}>
        <Templo x={900} y={SUELO - 10} s={1.6} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo color={C.negro} />
        <CarroSol x={540} y={SUELO} f={f} s={1} />
        <Caballo x={830} s={0.85} f={f} anda={false} />
        <Fragua x={1290} f={f} />
        <Yunque x={1530} s={0.9} />
        <Personaje x={px} accion={corre ? 'correr' : anda(f, pK, pV) ? 'caminar' : 'parado'} {...PROM} inclinar={corre ? 10 : enFragua ? 12 : 6} brazo={enFragua ? [95, 0] : undefined} cabeza={f > 140 && f < a1 + 90 ? 10 : 0} contorno />
        {enFragua && (
          <g>
            <path d={suave([mano, [mano[0] + 70, mano[1] + 20], [mano[0] + 140, mano[1] + 50]])} stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />
            <circle cx={mano[0] + 142} cy={mano[1] + 50} r={6 + ap(f, a2 + 10) * 4} fill={ap(f, a2 + 10) > 0.5 ? '#FF7A2A' : C.negro} />
            {f > a2 && <Chispas x={mano[0] + 142} y={mano[1] + 50} f={f} n={10} viento={-0.5} />}
          </g>
        )}
        <Rotulo x={550} y={350} texto="ΗΛΙΟΣ" o={ap(f, a1 + 10) * (1 - ap(f, a1 + 120))} />
        <Rotulo x={1400} y={430} texto="ΗΦΑΙΣΤΟΣ" tam={28} o={ap(f, a1 + 90) * (1 - ap(f, a2))} />
      </Capa>
      {/* primer plano: la caña de hinojo */}
      {cerca > 0 && (
        <g opacity={cerca}>
          <rect x={-2000} y={0} width={6000} height={1200} fill={C.noche} opacity={0.95} />
          <circle cx={960} cy={540} r={262} fill="none" stroke={C.purpura} strokeWidth={10} />
          <circle cx={960} cy={540} r={250} fill="none" stroke={C.blanco} strokeWidth={3} strokeDasharray="2 12" />
          <CanaCerca x={910} y={540} f={f} brasa={ap(f, a2 + 60, 30)} ang={-8} s={0.75} />
          <Rotulo x={960} y={360} texto="ΝΑΡΘΗΞ" tam={40} o={ap(f, a2 + 50)} />
          <Lema x={960} y={730} texto="la caña de hinojo" o={ap(f, a2 + 70)} />
        </g>
      )}
    </Escenario>
  );
};

const RoboCarrera: React.FC<{ dur: number; a4: number }> = ({ dur, a4 }) => {
  const f = useCurrentFrame();
  const llega = 150;
  const s = 1.18;
  const pxEn = (t: number) => lin(t, [0, llega], [260, 1120]);
  const px = pxEn(f);
  const corre = f < llega;
  const CAM: Cam = [[0, 0, 1], [llega, 600, 1], [dur, 680, 1.06]];
  const faseEn = (t: number) => t * 0.34;
  const brazo: [number, number] = [58, 74];
  const puntaEn = (t: number): P => {
    const bote = -Math.abs(Math.cos(faseEn(t))) * 10;
    return [pxEn(t) + (104 + 60) * s, SUELO + bote * s + (-300 - 118) * s];
  };
  const fuego = entre(f, a4 + 25, a4 + 60, 0, 1);
  const luz = 0.5 - fuego * 0.32;
  return (
    <Escenario dur={dur} camara={CAM} cielo="noche">
      <Oscuro o={luz} />
      <Estrellas f={f} n={34} />
      <Luna x={1700} y={230} />
      <Capa p={0.3}>
        <Monte x={420} alto={540} ancho={640} templo o={0.6} />
      </Capa>
      <Capa p={0.55}>
        <path d="M-200 800 C 300 660, 600 640, 1000 700 C 1400 760, 1800 650, 2600 710 L 2600 820 L -200 820 Z" fill={C.barroOscuro} opacity={0.35} />
        <Olivo x={800} s={1} f={f} color={C.barroOscuro} />
        <Olivo x={1700} s={0.85} f={f + 40} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        {[300, 980, 1600, 2300].map((x) => <path key={x} d={`M${x} ${SUELO} c 10 -30, 50 -40, 70 -20 c 20 -20, 50 -10, 56 20 Z`} fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />)}
        {/* estela de chispas, como en la prueba */}
        {Array.from({ length: 36 }, (_, i) => {
          const nace = Math.floor(f / 3) * 3 - i * 3;
          if (nace < 0 || nace > llega) return null;
          const edad = f - nace, o = puntaEn(nace), a = azar(i + 1);
          const x = o[0] - edad * (1.5 + a * 2), y = o[1] - 60 - edad * (1.2 + a * 1.4) + Math.sin(edad / 5 + i) * 6;
          return <circle key={i} cx={x} cy={y} r={Math.max(0, 4 - edad * 0.04)} fill={a > 0.5 ? C.oro : '#FF9A3C'} opacity={Math.max(0, 1 - edad / 90)} />;
        })}
        <Fogata x={1330} f={f} fuego={fuego} s={1.1} />
        {fuego > 0.3 && <Chispas x={1330} y={SUELO - 120} f={f} n={20} />}
        {fuego > 0 && <circle cx={1330} cy={SUELO - 80} r={520 * fuego} fill="url(#halo)" opacity={0.45} style={{ mixBlendMode: 'screen' }} />}
        {[1560, 1700, 1830].map((x, i) => (
          <Personaje key={x} x={x} s={0.8} ropa="desnudo" tocado={null} voltear barba={i !== 1} mujer={i === 1} inclinar={fuego > 0.5 ? 0 : -6} brazo={fuego > 0.6 ? [150 - i * 20, 20] : [40, 140]} cabeza={fuego > 0.6 ? 12 : -6} contorno />
        ))}
        <Personaje x={px} s={s} accion={corre ? 'correr' : 'parado'} {...PROM} objeto="cana" brazo={corre ? brazo : [70, 30]} inclinar={corre ? 0 : entre(f, llega, llega + 20, 0, 18)} boca={f > a4 && f < a4 + 40} fase={faseEn(f)} contorno />
      </Capa>
    </Escenario>
  );
};

const Robo: React.FC<EscenaV> = ({ dur, at }) => {
  const corte = at(3) - 4;
  return (
    <>
      <Sequence durationInFrames={corte + 10}>
        <RoboCima dur={corte + 10} a1={at(1)} a2={at(2)} />
      </Sequence>
      <Sequence from={corte}>
        <RoboCarrera dur={dur - corte} a4={at(4) - corte} />
      </Sequence>
    </>
  );
};

// =====================================================================================
// 7 · El regalo de Prometeo
// =====================================================================================
const Asador: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g transform={`translate(${x} ${SUELO})`}>
    <path d="M-80 0 L -80 -110 M80 0 L 80 -110 M-90 -120 L -80 -110 L -70 -120 M70 -120 L 80 -110 L 90 -120" stroke={C.negro} strokeWidth={7} fill="none" />
    <path d="M-100 -110 L 100 -110" stroke={C.negro} strokeWidth={5} />
    <g transform={`translate(0 -110) rotate(${f * 3})`}>
      <ellipse rx={40} ry={24} fill={C.purpura} stroke={C.negro} strokeWidth={3} />
      <Inc d="M-24 -6 q 24 12 48 0" c={C.blanco} w={2} />
    </g>
  </g>
);

const Oficios: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4] = [at(1), at(2), at(3), at(4)];
  const CAM: Cam = [[0, 60, 1.12], [a1, 100, 1], [a2, 420, 1], [a3, 1250, 1], [a3 + 120, 1980, 1], [dur, 2010, 1.07]];
  const luz = 1 - entre(f, 10, a1, 0, 1);
  const martillo = 120 + Math.sin(f * 0.32) * 55;
  const golpea = Math.sin(f * 0.32) < -0.8;
  const vasija = ((f - a2) % 120) / 120;
  const celebra = f > a4;
  const bob = (i: number) => (celebra ? Math.abs(Math.sin(f * 0.15 + i)) * -10 : 0);
  return (
    <Escenario dur={dur} camara={CAM}>
      <Oscuro o={luz * 0.6} />
      <g opacity={ap(f, a3)}>
        <Constelacion pts={[[1000, 210], [1090, 250], [1180, 230], [1260, 280], [1340, 250], [1420, 300]]} t={entre(f, a3 + 40, a3 + 160, 0, 1)} />
        <Constelacion pts={[[1500, 190], [1560, 260], [1650, 240], [1700, 180]]} t={entre(f, a3 + 100, a3 + 200, 0, 1)} />
      </g>
      <Capa p={0.25}>
        <Sol x={500} y={260} r={44} f={f} />
        <Monte x={900} alto={320} ancho={700} o={0.35} templo />
        <Monte x={2300} alto={360} ancho={800} o={0.35} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={1200} s={0.7} f={f} color={C.barroOscuro} />
        <Olivo x={2600} s={0.8} f={f + 20} color={C.barroOscuro} />
        <Olivo x={3300} s={0.7} f={f + 40} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        {/* el hogar */}
        <Fogata x={720} f={f} fuego={1} s={1.1} />
        <Chispas x={720} y={SUELO - 110} f={f} n={14} />
        <Asador x={720} f={f} />
        <Personaje x={500} s={0.85} ropa="corta" barba brazo={[85, 0]} />
        <Personaje x={960} s={0.8} mujer voltear brazo={[85, 0]} />
        {/* el alfarero */}
        <Personaje x={1360} s={0.85} ropa="corta" barba inclinar={14} brazo={[55, 25]} brazoAtras={[30, -10]} />
        <Torno x={1500} f={f} alto={f < a2 ? 1 : Math.min(1, vasija * 1.4)} />
        <Vasija x={1640} s={0.55} />
        <Vasija x={1720} s={0.45} />
        {/* el herrero */}
        <Personaje x={1930} s={0.9} ropa="corta" barba objeto="martillo" brazo={[martillo, 10]} />
        <Yunque x={2060} s={0.9} />
        {golpea && <Chispas x={2080} y={SUELO - 80} f={f % 40} n={14} viento={0.5} />}
        <path d="M2040 724 l 40 -2" stroke="#FF7A2A" strokeWidth={6} />
        {/* Prometeo enseña */}
        <Tablilla x={2800} y={SUELO - 80} n={(f - a3 - 20) / 12} s={0.9} />
        <Personaje x={2350} s={0.85} ropa="corta" barba={false} cabeza={f > a3 ? 18 : 0} brazo={celebra ? [160, 10] : undefined} y={SUELO + bob(0)} />
        <Personaje x={2480} s={0.82} mujer cabeza={f > a3 ? 14 : 0} brazo={celebra ? [150, 20] : undefined} y={SUELO + bob(1)} />
        <Personaje x={2620} {...PROM} brazo={f > a3 + 20 && !celebra ? [160, 15] : celebra ? [120, 20] : undefined} />
        <Personaje x={3000} s={0.85} ropa="corta" barba voltear brazo={celebra ? [160, 10] : [60, 30]} y={SUELO + bob(2)} />
        {celebra && <circle cx={2640} cy={SUELO - 200} r={300} fill="url(#halo)" opacity={ap(f, a4, 30) * 0.5} style={{ mixBlendMode: 'screen' }} />}
        <Rotulo x={2640} y={360} texto="ΦΙΛΑΝΘΡΩΠΟΣ" o={ap(f, a4 + 10)} />
        <Lema x={2640} y={320} texto="el amigo de la humanidad" o={ap(f, a4 + 30)} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 8 · Encadenado en el Cáucaso (Zeus ve los fuegos; luego la roca)
// =====================================================================================
const ENCADENADO = { brazo: [150, 20] as [number, number], atras: [-150, -60] as [number, number] };
const LIBRE = { brazo: [20, 30] as [number, number], atras: [-20, -40] as [number, number] };
const ROCA = 1100;
const ANCLAS: [P, P] = [[ROCA - 160, 300], [ROCA + 165, 300]];

const PrometeoEncadenado: React.FC<{ f: number; libre?: number; cabeza?: number; ojosCerrados?: boolean; cadenas?: number; roto?: number }> = ({ f, libre = 0, cabeza = 0, ojosCerrados, cadenas = 1, roto = 0 }) => {
  const brazo = mezcla(ENCADENADO.brazo, LIBRE.brazo, libre), atras = mezcla(ENCADENADO.atras, LIBRE.atras, libre);
  const m = manos(ROCA, 1, brazo, atras);
  const n = Math.round(9 * cadenas);
  return (
    <g>
      {n > 0 && <Cadena a={m.atr} b={ANCLAS[0]} n={n} roto={roto} caida={500} />}
      {n > 0 && <Cadena a={m.del} b={ANCLAS[1]} n={n} roto={roto} caida={500} />}
      {cadenas > 0 && <Cadena a={[ROCA + 8, SUELO - 14]} b={[ROCA + 150, SUELO - 6]} n={6} roto={roto} caida={10} />}
      {ANCLAS.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={9} fill={C.negro} stroke="#BDB3A0" strokeWidth={3} />)}
      <Personaje x={ROCA} {...PROM} capa={null} brazo={brazo} brazoAtras={atras} cabeza={cabeza + Math.sin(f / 30) * 2} ojosCerrados={ojosCerrados} contorno />
      {cadenas > 0 && <><Grillete p={m.del} abierto={roto} /><Grillete p={m.atr} abierto={roto} /></>}
    </g>
  );
};

const CastigoZeus: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const furia = f > 110;
  return (
    <Escenario dur={dur} camara={[[0, 0, 1.05], [dur, 520, 1]]} cielo="noche">
      <Estrellas f={f} n={40} />
      <Capa p={0.5}>
        <FuegosLejanos f={f} t={entre(f, 10, 170, 0, 1, Easing.linear)} n={22} x0={900} x1={2700} y0={660} y1={780} s={0.2} />
      </Capa>
      <Capa p={1}>
        <path d={suave([[-400, SUELO + 10], [-200, 600], [-100, 566], [300, 556], [700, 566], [820, 620], [900, 720], [960, SUELO + 10]], true)} fill={C.negro} stroke={C.barroOscuro} strokeWidth={4} />
        <Templo x={170} y={560} s={0.75} color={C.barroOscuro} />
        <Personaje x={520} y={560} {...ZEUS} brazo={furia ? [150, 20] : [80, 20]} cabeza={furia ? 0 : -14} boca={furia} contorno />
        <Rotulo x={780} y={330} texto="ΖΕΥΣ" o={ap(f, 130) * (1 - ap(f, dur - 20))} />
      </Capa>
    </Escenario>
  );
};

const CastigoRoca: React.FC<{ dur: number; b2: number; b3: number }> = ({ dur, b2, b3 }) => {
  const f = useCurrentFrame();
  const hK = [0, 160, b2 - 30, b2 - 5, b3 + 20, b3 + 150], hV = [-500, 700, 700, 1330, 1330, 2050];
  const hx = lin(f, hK, hV);
  const pK = [0, 200], pV = [-200, ROCA];
  const encadenado = f > b2 - 10;
  const golpe = Math.sin(f * 0.35);
  const sol = entre(f, b3 - 10, b3 + 110, 0, 1, Easing.linear);
  const nieve = ap(f, b3 + 90, 40);
  return (
    <Escenario dur={dur} camara={[[0, 40, 1], [200, 140, 1], [b3, 140, 1.08], [dur, 140, 1]]}>
      <Oscuro o={entre(f, b3 + 80, b3 + 130, 0, 0.35)} />
      {sol > 0 && sol < 1 && <Sol x={200 + sol * 1500} y={330 - Math.sin(sol * Math.PI) * 140} r={44} f={f} />}
      <Capa p={0.2}>
        <Monte x={300} alto={420} ancho={500} o={0.35} />
        <Monte x={1800} alto={460} ancho={600} o={0.35} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        <Penasco x={ROCA} nieve={nieve} />
        {encadenado ? (
          <PrometeoEncadenado f={f} cadenas={entre(f, b2 - 10, b2 + 100, 0, 1, Easing.linear)} cabeza={f > b3 ? 6 : -6} />
        ) : (
          <Personaje x={lin(f, pK, pV)} accion={anda(f, pK, pV) ? 'caminar' : 'parado'} {...PROM} capa={null} brazo={[10, 20]} cabeza={-8} contorno />
        )}
        <Personaje x={hx} accion={anda(f, hK, hV) ? 'caminar' : 'parado'} barba tocado="petaso" objeto="martillo" voltear={f > b2 - 15 && f < b3 + 20} brazo={f > b2 && f < b3 + 20 ? [120 + golpe * 50, 10] : undefined} inclinar={f > b2 && f < b3 + 20 ? 16 : 0} cabeza={-12} contorno />
        {f > b2 && f < b3 + 20 && golpe < -0.75 && <Chispas x={ROCA + 150} y={SUELO - 30} f={f % 30} n={12} viento={0.3} />}
        <Rotulo x={hx + 20} y={390} texto="ΗΦΑΙΣΤΟΣ" tam={28} o={ap(f, 60) * (1 - ap(f, b2))} />
        <Rotulo x={ROCA} y={170} texto="ΚΑΥΚΑΣΟΣ" tam={30} o={ap(f, 120) * (1 - ap(f, b2 + 40))} />
      </Capa>
      <Viento f={f} o={ap(f, b3 + 60) * 0.8} y={280} />
      <Nieve f={f} o={nieve} />
    </Escenario>
  );
};

const Castigo: React.FC<EscenaV> = ({ dur, at }) => {
  const corte = at(1) - 6;
  return (
    <>
      <Sequence durationInFrames={corte + 10}>
        <CastigoZeus dur={corte + 10} />
      </Sequence>
      <Sequence from={corte}>
        <CastigoRoca dur={dur - corte} b2={at(2) - corte} b3={at(3) - corte} />
      </Sequence>
    </>
  );
};

// =====================================================================================
// 9 · El águila de Zeus
// =====================================================================================
const AguilaEscena: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3, a4, a5] = [at(1), at(2), at(3), at(4), at(5)];
  const CAM: Cam = [[0, 140, 1.12], [a1, 140, 1], [a3, 140, 1.06], [a4, 0, 1], [a4 + 160, 0, 1], [a5, 140, 1.04], [dur, 140, 1.1]];
  const PERCHA: P = [1290, 520];
  // trayectoria del águila: [frame, x, y] por tramos
  const hx = lin(f, [a4, a4 + 95, a4 + 175, a4 + 220], [-180, 430, 430, 860]);
  const heraclesAnda = anda(f, [a4, a4 + 95, a4 + 175, a4 + 220], [-180, 430, 430, 860]);
  const disparo = a4 + 120;
  const cae = entre(f, disparo + 22, disparo + 80, 0, 1, Easing.in(Easing.quad));
  const aK = [a1, a1 + 80, a2 + 10, a2 + 50, a2 + 150, a2 + 200, a3 + 10, a3 + 40, a4 + 50, a4 + 100], aX = [2200, PERCHA[0], PERCHA[0], 2300, 2300, PERCHA[0], PERCHA[0], 2300, 2300, PERCHA[0]], aY = [180, PERCHA[1], PERCHA[1], 150, 150, PERCHA[1], PERCHA[1], 150, 150, PERCHA[1]];
  const ax = lin(f, aK, aX), ay = lin(f, aK, aY) + cae * (SUELO - PERCHA[1] - 20);
  const posada = Math.abs(ax - PERCHA[0]) < 4 && Math.abs(lin(f, aK, aY) - PERCHA[1]) < 4;
  const picotea = posada && f < disparo ? Math.max(0, Math.sin(f * 0.3)) : 0;
  const noche = entre(f, a2 + 20, a2 + 60, 0, 0.6) * (1 - entre(f, a2 + 130, a2 + 175, 0, 1));
  const sufre = posada && f < a3;
  const roto = entre(f, a4 + 222, a4 + 240, 0, 1);
  const libre = entre(f, a5 + 10, a5 + 50, 0, 1);
  return (
    <Escenario dur={dur} camara={CAM}>
      <Oscuro o={noche} />
      <g opacity={noche / 0.6}>
        <Estrellas f={f} n={40} />
        <Luna x={lin(f, [a2 + 20, a2 + 170], [500, 1100])} y={lin(f, [a2 + 20, a2 + 170], [460, 230])} />
      </g>
      {f > a2 + 140 && <Sol x={1650} y={lin(f, [a2 + 140, a2 + 220], [560, 270])} r={44} f={f} />}
      <Capa p={0.2}>
        <Monte x={300} alto={420} ancho={500} o={0.35} />
        <Monte x={1800} alto={460} ancho={600} o={0.35} />
      </Capa>
      <Capa p={0.45}>
        <FuegosLejanos f={f} t={entre(f, a3 + 10, a3 + 120, 0, 1, Easing.linear)} n={14} x0={1500} x1={2400} y0={700} y1={780} s={0.14} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        <Penasco x={ROCA} nieve={0.6} />
        <path d="M1240 560 L 1350 556 L 1340 576 L 1250 580 Z" fill={C.barroOscuro} stroke={C.negro} strokeWidth={4} />
        <PrometeoEncadenado f={f} cabeza={sufre ? -10 : f > a3 ? 14 : 0} ojosCerrados={sufre && picotea > 0.3} roto={roto} libre={libre} cadenas={1} />
        {sufre && <circle cx={ROCA + 20} cy={SUELO - 250} r={40} fill="url(#haloBlanco)" opacity={0} />}
        {/* curación de cada noche */}
        {noche > 0.3 && <circle cx={ROCA + 15} cy={SUELO - 245} r={36 + Math.sin(f / 6) * 6} fill="url(#haloBlanco)" opacity={0.5 * (noche / 0.6)} />}
        {cae < 1 && <Aguila x={ax - picotea * 26} y={ay} s={0.85} f={f} posada={posada} voltear={posada || lin(f + 1, aK, aX) < ax} rot={cae * 140 + (posada ? picotea * -18 : 0)} opacity={1 - cae * 0.6} />}
        {/* Heracles */}
        <Personaje x={hx} accion={heraclesAnda ? 'caminar' : 'parado'} barba tocado={null} objeto="arco" brazo={f > a4 + 95 && f < disparo + 30 ? [95, -5] : undefined} opacity={ap(f, a4, 10)} />
        {f > a4 && <PielLeon x={hx} f={f} />}
        <Flecha a={[hx + 160, SUELO - 300]} b={[PERCHA[0] - 20, PERCHA[1] - 10]} t={(f - disparo) / 22} />
        {roto > 0 && roto < 1 && <Chispas x={ROCA} y={330} f={(f - a4 - 222) * 3} n={18} viento={0} />}
        {libre > 0 && <circle cx={ROCA} cy={SUELO - 200} r={340} fill="url(#halo)" opacity={libre * 0.4} style={{ mixBlendMode: 'screen' }} />}
        <Rotulo x={hx + 20} y={385} texto="ΗΡΑΚΛΗΣ" o={ap(f, a4 + 30) * (1 - ap(f, a4 + 200)) + ap(f, a5 + 20)} />
      </Capa>
    </Escenario>
  );
};

// =====================================================================================
// 10 · Cierre: el fuego de los humanos y el regalo que prepara Zeus
// =====================================================================================
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const [a1, a2, a3] = [at(1), at(2), at(3)];
  const CAM: Cam = [[0, 0, 1], [a1, 300, 1], [a1 + 90, 1450, 1], [a3, 1500, 1], [dur, 1530, 1.14]];
  const nubes = entre(f, a1, a1 + 100, 0, 1);
  const pithos = ap(f, a2 + 10, 30);
  const oscuro = entre(f, a1 + 20, a1 + 90, 0, 0.3);
  return (
    <Escenario dur={dur} camara={CAM} cielo="noche">
      <Oscuro o={oscuro} />
      <Estrellas f={f} n={44} />
      <Capa p={0.4}>
        <Templo x={300} y={SUELO - 60} s={0.7} color={C.barroOscuro} />
        <Templo x={1300} y={SUELO - 70} s={0.5} color={C.barroOscuro} />
        <FuegosLejanos f={f} t={1} n={20} x0={-200} x1={1900} y0={680} y1={770} s={0.16} />
      </Capa>
      <Capa p={1}>
        <Suelo />
        <Fogata x={300} f={f} fuego={0.7} s={0.8} />
        <Fogata x={1250} f={f + 20} fuego={0.7} s={0.8} />
        <Fogata x={780} f={f} fuego={1.2} s={1.1} />
        <circle cx={780} cy={SUELO - 100} r={360} fill="url(#halo)" opacity={0.4} style={{ mixBlendMode: 'screen' }} />
        <Chispas x={780} y={SUELO - 160} f={f} n={24} />
        {[0, 1, 2, 3].map((i) => {
          const ang = f / 40 + i * (Math.PI / 2);
          const x = 780 + Math.cos(ang) * 230;
          const atras = Math.sin(ang) < 0;
          return <Personaje key={i} x={x} s={atras ? 0.7 : 0.82} accion="caminar" ropa="corta" mujer={i % 2 === 1} barba={i === 0} voltear={Math.sin(ang) > 0} brazo={[150, 20]} opacity={atras ? 0.75 : 1} contorno />;
        })}
        {/* el monte de Zeus */}
        <path d={suave([[1650, SUELO + 10], [1900, 720], [2050, 650], [2300, 638], [2600, 650], [2800, 720], [3000, SUELO + 10]], true)} fill={C.negro} stroke={C.barroOscuro} strokeWidth={4} />
        <Nube x={lin(nubes, [0, 1], [1700, 2050])} y={300} s={0.9} f={f} color={C.barroOscuro} />
        <Nube x={lin(nubes, [0, 1], [2900, 2550])} y={270} s={1} f={f + 30} color={C.barroOscuro} />
        <Relampago a={[2080, 300]} b={[1900, 640]} f={f} desde={a1 + 70} />
        <Relampago a={[2560, 280]} b={[2700, 640]} f={f} desde={a1 + 120} />
        <Personaje x={2240} y={640} {...ZEUS} objeto="cetro" brazo={f > a2 ? [95, -5] : [20, 30]} cabeza={f > a2 ? -8 : 0} contorno />
        <g opacity={pithos}>
          <Pithos x={2440} y={640} s={0.62} f={f} brillo={pithos} />
        </g>
        <Rotulo x={2440} y={420} texto="ΠΑΝΔΩΡΑ" tam={42} o={ap(f, a3 + 10)} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  hermanos: Hermanos,
  dones: Dones,
  barro: Barro,
  mecone: Mecone,
  sinfuego: SinFuego,
  robo: Robo,
  oficios: Oficios,
  castigo: Castigo,
  aguila: AguilaEscena,
  cierre: Cierre,
};
