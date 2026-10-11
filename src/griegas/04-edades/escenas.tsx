// Escenas del video 04 · Las cinco edades del hombre (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Olas, Nube, Relampago, Suelo, Rotulo,
  suave, Inc, ap, entre, azar, Accion,
} from '../../comun/vasija';
import {
  ORO, PLATA, BRONCE, HIERRO, manoDe, Mal, Pithos, Medallon, Oveja, Frutal, Flor, Pajaro, Mesa, Casa, Altar, Humo, Nieve, Lluvia, Constelacion,
  Balanza, Buey, Arado, Fresno, Estela, BocaHades, Muralla, Barco, Isla, Pico, Aro, Trono, Veta, PolvoOro, Niebla, Pan, Espiga,
} from './piezas';

type Cam = [number, number, number][];
const lin = Easing.linear;
/** Desplazamiento a pie entre dos frames: posición y acción. */
const andar = (f: number, a: number, b: number, x0: number, x1: number, corre = false) => ({
  x: entre(f, a, b, x0, x1, lin),
  accion: (f > a && f < b ? (corre ? 'correr' : 'caminar') : 'parado') as Accion,
});
/** Aparece y se va: 0→1 en `a`, 1→0 en `b`. */
const vida = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
const habla = (f: number, a: number, b: number) => f > a && f < b && Math.floor(f / 5) % 2 === 0;
/** Personaje acostado boca arriba (gira sobre los pies). */
const Tendido: React.FC<{ x: number; ang: number; children: React.ReactNode; y?: number }> = ({ x, ang, children, y = SUELO }) => (
  <g transform={`translate(0 ${(-Math.abs(ang) / 90) * 26}) rotate(${ang} ${x} ${y})`}>{children}</g>
);
/** Medallón de la edad, fijo arriba a la derecha. */
const SelloEdad: React.FC<{ f: number; color: string; n: number; a?: number }> = ({ f, color, n, a = 140 }) => (
  <Capa p={0}>
    <Medallon x={1770} y={232} r={44} color={color} n={n} o={ap(f, a, 25)} f={f} />
  </Capa>
);
const SECUENCIA: [string, number][] = [[ORO, 1], [PLATA, 2], [BRONCE, 3], [C.purpura, 4], [HIERRO, 5]];

// ---------------------------------------------------------------- 1 · Un mundo lleno de males
const Inicio: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -100, 1.1], [t1 - 10, -40, 1.06], [t2, 1100, 1], [dur, 1180, 1.03]];
  const boca: P = [450, SUELO - 330];
  const hx = 1500;
  const brazoH: [number, number] = f > t2 && f < fin(3) ? [entre(f, t2, t2 + 25, 30, 120) + Math.sin(f / 9) * 10, 20] : [40, 50];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={50} f={f} area={[-100, 140, 2400, 300]} />
        <Luna x={1620} y={230} />
      </Capa>
      <Capa p={0.25}>
        <Monte x={200} ancho={500} alto={380} color="#2A120A" o={0.9} />
        <Monte x={1500} ancho={720} alto={520} color="#3A1A0C" o={0.95} />
        <Monte x={2200} ancho={420} alto={300} color="#2A120A" o={0.9} />
      </Capa>
      {/* aldea a la que llegan los males */}
      <Capa p={0.55}>
        <path d="M-400 1000 L-400 720 C 0 690, 400 730, 800 700 C 1200 670, 1600 720, 2600 700 L2600 1000 Z" fill="#2A120A" />
        {[300, 520, 760, 980].map((x, i) => (
          <g key={x}>
            <Casa x={x} y={712} s={0.32} luz={1} f={f + i * 7} />
            <Humo x={x + 30} y={600} f={f + i * 40} alto={200} o={0.35} />
          </g>
        ))}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={3600} />
        {/* Pandora y el ánfora abierta */}
        <Pithos x={boca[0]} s={1} tapa={1} brillo={0.4 + Math.sin(f / 7) * 0.1} />
        <Personaje x={260} mujer contorno brazo={[110 + Math.sin(f / 10) * 6, 60]} brazoAtras={[150, 40]} inclinar={-6} cabeza={10} boca />
        <Rotulo x={290} y={SUELO - 400} texto="PANDORA" o={vida(f, 30, t1)} />
        {Array.from({ length: 10 }, (_, i) => {
          const nace = i * 22, e = f - nace;
          if (e < 0) return null;
          const ang = -0.9 + azar(i) * 1.5;
          const x = boca[0] + e * (2.2 + azar(i + 4) * 2.5) * Math.cos(ang) + e * 1.2;
          const techo = 230 + azar(i + 6) * 220;
          const y = Math.max(techo, boca[1] - 30 - e * (0.9 + azar(i + 8) * 0.8)) + Math.sin(e / 14 + i) * 30;
          return <Mal key={i} x={x} y={y} s={0.55 + azar(i + 2) * 0.3} f={f} v={i} dir={Math.cos(e / 60 + i) > -0.6 ? 1 : -1} o={ap(f, nace, 12)} />;
        })}
        {/* Hesíodo, pastor del Helicón */}
        <Olivo x={1180} s={1.05} f={f} />
        {[1720, 1880, 2010].map((x, i) => <Oveja key={x} x={x} s={0.75} f={f} seed={i} voltear={i === 1} />)}
        <Personaje x={hx} canas tocado="laurel" ropa="larga" objeto="cetro" brazoAtras={[10, 10]} brazo={brazoH} contorno cabeza={f > t3 ? 14 : 0} boca={habla(f, t2, fin(3))} />
        <Rotulo x={hx + 20} y={SUELO - 430} texto="HESÍODO" o={vida(f, t2 + 10, dur - 10)} />
        {/* las Musas del Helicón le dictan el canto */}
        {[2250, 2420, 2590].map((x, i) => {
          const g = Math.sin(f / 10 + i * 2);
          return <Personaje key={x} x={x + g * 14} s={0.82} mujer voltear contorno accion="caminar" fase={f * 0.1 + i * 2} brazo={[130 + g * 25, 20]} brazoAtras={[100 - g * 20, 30]} opacity={ap(f, t2 - 20 + i * 12, 25)} />;
        })}
        <Rotulo x={2420} y={SUELO - 360} texto="MUSAS" tam={28} o={vida(f, t2 + 20, t3 + 10)} />
      </Capa>
      {/* las cinco razas, en escalera descendente */}
      <Capa p={0}>
        {SECUENCIA.map(([c, n], i) => (
          <Medallon key={i} x={780 + i * 200} y={235 + i * 38} r={46} color={c} n={n} o={ap(f, t3 + 20 + i * 30, 20)} f={f} />
        ))}
        {SECUENCIA.slice(1).map((_, i) => (
          <path key={i} d={`M${830 + i * 200} ${245 + i * 38} q 60 -10 100 30`} stroke={C.crema} strokeWidth={3} strokeDasharray="6 8" fill="none" opacity={ap(f, t3 + 40 + i * 30, 20)} />
        ))}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · La edad de oro
const EdadOro: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.05], [t1, 200, 1], [t2, 900, 1], [t3, 1500, 1], [t4, 2300, 1.02], [dur, 2420, 1.08]];
  const gente: { x: number; mujer?: boolean; v?: boolean }[] = [{ x: 960 }, { x: 1130, mujer: true }, { x: 1480, v: true }, { x: 1660, mujer: true }, { x: 1830 }];
  const alcanza = f > t2 + 30 && f < t3 + 40;
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0.05}>
        <Sol x={1500} y={260} r={56} f={f} />
      </Capa>
      <Capa p={0.15}>
        <Nube x={400 + f * 0.15} y={230} s={0.7} f={f} />
        <Nube x={1400 + f * 0.1} y={300} s={0.5} f={f} />
      </Capa>
      <Capa p={0.35}>
        <Monte x={300} ancho={600} alto={480} o={0.55} templo />
        <Monte x={1400} ancho={600} alto={330} o={0.45} />
        <Monte x={2400} ancho={700} alto={400} o={0.5} />
      </Capa>
      <Capa p={0.6}>
        <g opacity={0.45}>
          {[700, 1300, 1900, 2500, 3100].map((x, i) => <Olivo key={x} x={x} y={SUELO - 20} s={0.8} f={f + i * 20} />)}
        </g>
        {Array.from({ length: 6 }, (_, i) => <Pajaro key={i} x={(700 + i * 380 + f * (1.5 + (i % 3) * 0.4)) % 3600} y={260 + (i % 3) * 50} s={0.32} f={f + i * 10} opacity={ap(f, t3 - 20 + i * 8, 20)} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={5000} />
        {/* Cronos reina */}
        <circle cx={460} cy={SUELO - 260} r={360} fill="url(#halo)" opacity={0.45} style={{ mixBlendMode: 'screen' }} />
        <path d={`M240 ${SUELO} C 260 ${SUELO - 40}, 300 ${SUELO - 70}, 460 ${SUELO - 70} C 620 ${SUELO - 70}, 660 ${SUELO - 40}, 690 ${SUELO} Z`} fill={C.negro} />
        <Personaje x={450} y={SUELO - 60} s={1.15} gigante canas tocado="corona" capa={C.purpura} objeto="hoz" brazo={[60, 50]} cabeza={-4} />
        <Rotulo x={700} y={SUELO - 400} texto="CRONOS" o={vida(f, 20, t1 + 20)} />
        {/* frutales que dan solos */}
        {[1300, 1950, 2500].map((x, i) => <Frutal key={x} x={x} s={0.95 - i * 0.08} f={f + i * 30} frutos={ap(f, t2 + i * 12, 50)} caen={entre(f, t2 + 70, t2 + 140, 0, 1)} />)}
        {Array.from({ length: 14 }, (_, i) => <Espiga key={i} x={1060 + i * 26} c={ap(f, t2 + 20 + i * 3, 40)} s={0.9} />)}
        {/* la raza de oro */}
        {gente.map((g, i) => {
          const o = ap(f, t1 + i * 10, 25);
          const baile = Math.sin(f / 10 + i * 1.3);
          const brazo: [number, number] = alcanza && i % 2 === 0 ? [170, -10] : [60 + baile * 30, 40];
          return (
            <g key={i} opacity={o}>
              <circle cx={g.x} cy={SUELO - 200} r={150} fill="url(#halo)" opacity={0.25} style={{ mixBlendMode: 'screen' }} />
              <Personaje x={g.x + Math.sin(f / 30 + i) * 20} s={0.92} piel={ORO} mujer={g.mujer} voltear={g.v} brazo={brazo} brazoAtras={[-30 - baile * 20, -20]} cabeza={alcanza ? 16 : 0} />
            </g>
          );
        })}
        <Rotulo x={1420} y={SUELO - 400} texto="RAZA DE ORO" o={vida(f, t1 + 40, t2 + 20)} color={C.oro} />
        {/* primavera eterna */}
        {Array.from({ length: 40 }, (_, i) => <Flor key={i} x={1500 + i * 52 + azar(i) * 20} c={ap(f, t3 + i * 3, 30)} s={0.7 + azar(i + 3) * 0.5} color={i % 3 ? C.purpura : C.blanco} />)}
        {/* banquete */}
        <Personaje x={2760} s={0.95} piel={ORO} objeto="lira" brazo={[70 + Math.sin(f / 4) * 6, 50]} cabeza={6} boca={habla(f, t4, dur)} />
        <Mesa x={3120} f={f} />
        <Personaje x={2960} s={0.95} piel={ORO} objeto="copa" brazo={[entre(f, t4 + 10, t4 + 30, 40, 120), entre(f, t4 + 10, t4 + 30, 40, 60)]} />
        <Personaje x={3300} s={0.95} piel={ORO} voltear mujer brazo={[110, 40]} />
        {[3540, 3720].map((x, i) => {
          const g = Math.sin(f / 9 + i * Math.PI);
          return <Personaje key={x} x={x + g * 30} s={0.9} piel={ORO} mujer={i === 0} voltear={i === 1} accion="caminar" fase={f * 0.12 + i} brazo={[160 + g * 15, -20]} brazoAtras={[150 - g * 15, -20]} />;
        })}
        <Chispas x={3120} y={SUELO - 180} n={14} f={f} viento={0.4} />
      </Capa>
      <SelloEdad f={f} color={ORO} n={1} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · Los guardianes invisibles
const Guardianes: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.12], [t1, 40, 1.05], [t2, 600, 1], [t3, 1300, 1], [dur, 1400, 1.04]];
  const tumulo = entre(f, t1 - 30, t1 + 40, 0, 1);
  const sube = entre(f, t1 + 30, t1 + 130, 0, 1, Easing.out(Easing.cubic));
  const espiritus = [{ x0: 900, y: 520 }, { x0: 1250, y: 470 }, { x0: 1600, y: 540 }];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={60} f={f} area={[-100, 140, 2400, 340]} />
        <Luna x={300} y={240} />
      </Capa>
      {/* Zeus en el cielo */}
      <Capa p={0.12}>
        <g opacity={vida(f, t1 + 10, t2, 25) * 0.7}>
          <circle cx={1350} cy={420} r={300} fill="url(#haloBlanco)" opacity={0.25} />
          <Personaje x={1350} y={780} s={1.1} voltear contorno barba tocado="corona" capa={C.purpura} objeto="rayo" brazo={[95, 10]} cabeza={10} />
          <Rotulo x={1180} y={330} texto="ZEUS" o={1} />
        </g>
      </Capa>
      <Capa p={0.35}>
        <Monte x={700} ancho={600} alto={380} color="#2A120A" o={0.9} />
        <Monte x={1900} ancho={700} alto={460} color="#2A120A" o={0.9} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={4000} />
        <Olivo x={420} s={1.15} f={f} />
        {/* el último hombre de oro se duerme */}
        <g opacity={1 - ap(f, t1 + 20, 20)}>
          <Tendido x={780} ang={-90}>
            <Personaje x={780} piel={ORO} ojosCerrados brazo={[20, 10]} brazoAtras={[10, 0]} />
          </Tendido>
        </g>
        <Personaje x={1000} s={0.95} piel={ORO} mujer voltear contorno brazo={[40, 100]} brazoAtras={[20, 30]} cabeza={22} inclinar={6} opacity={1 - ap(f, t1, 25)} />
        <path d={`M${470 - 40 * tumulo} ${SUELO} C ${500} ${SUELO - 110 * tumulo}, ${900} ${SUELO - 110 * tumulo}, ${930 + 40 * tumulo} ${SUELO} Z`} fill={C.negro} stroke={C.crema} strokeWidth={2} opacity={tumulo > 0 ? 1 : 0} />
        {tumulo > 0.5 && [560, 660, 760, 860].map((x) => <path key={x} d={`M${x} ${SUELO - 60} a 30 14 0 0 1 60 0`} stroke={C.crema} strokeWidth={1.6} fill="none" opacity={0.5 * tumulo} />)}
        {/* su espíritu se levanta */}
        <g opacity={sube * (1 - ap(f, t2 + 40, 30)) * 0.85}>
          <circle cx={700} cy={SUELO - 160 - sube * 160} r={160} fill="url(#haloBlanco)" opacity={0.6} />
          <Personaje x={680} y={SUELO - sube * 170} s={0.9} piel={C.blanco} ropa="larga" ojosCerrados={sube < 0.6} brazo={[100 + sube * 40, 20]} cabeza={10} />
        </g>
        {/* espíritus envueltos en niebla recorren la tierra */}
        {espiritus.map((e, i) => {
          const x = e.x0 + (f - t2) * 1.6;
          return (
            <g key={i} opacity={vida(f, t2 + i * 20, dur - 20, 30) * 0.7}>
              <circle cx={x} cy={e.y - 120} r={140} fill="url(#haloBlanco)" opacity={0.5} />
              <Personaje x={x} y={e.y + Math.sin(f / 15 + i) * 12} s={0.65} piel={C.blanco} ropa="larga" brazo={[90, 30]} brazoAtras={[-60, -20]} />
            </g>
          );
        })}
        {/* un labrador justo y su casa bendecida */}
        <Arado x={2090} />
        <Buey x={2410} s={0.9} f={f} />
        <Personaje x={2040} contorno accion="caminar" fase={f * 0.1} inclinar={8} brazo={[70, 10]} />
        <Casa x={2880} s={0.8} luz={0.5 + ap(f, t3 + 40, 40) * 0.5} f={f} />
        <PolvoOro x={2880} y={SUELO - 420} f={f} o={ap(f, t3 + 20, 30)} ancho={180} alto={260} />
        <g opacity={ap(f, t3, 30) * 0.8}>
          <circle cx={2840} cy={SUELO - 520} r={130} fill="url(#haloBlanco)" opacity={0.5} />
          <Personaje x={2840} y={SUELO - 390 + Math.sin(f / 15) * 8} s={0.55} piel={C.blanco} ropa="larga" brazo={[100, 40]} brazoAtras={[60, 40]} cabeza={20} />
        </g>
      </Capa>
      <Capa p={0}>
        <Niebla f={f} o={ap(f, t2, 40)} y={540} />
      </Capa>
      <SelloEdad f={f} color={ORO} n={1} a={10} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La edad de plata
const EdadPlata: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  const cam: Cam = [[0, 0, 1], [t1 - 20, 0, 1], [t1 + 30, 700, 1.05], [t2, 760, 1.08], [t2 + 60, 1500, 1], [t3, 1700, 1], [t4, 2700, 1], [t5, 2800, 1.04], [dur, 2860, 1.1]];
  // infancia de cien años
  const anios = Math.round(entre(f, t1 + 10, fin(1) - 10, 1, 100, lin));
  const ninoS = entre(f, t1 + 10, fin(1), 0.48, 0.62, lin);
  const aroX = 1430 + Math.sin(f / 22) * 120;
  // adulto que se va
  const adulto = andar(f, t2 + 20, fin(2), 1520, 2150);
  const frio = ap(f, t4 + 80, 30);
  const hunde = entre(f, t5 + 40, t5 + 140, 0, 1, Easing.in(Easing.cubic));
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0.05}>
        <g opacity={1 - frio * 0.7}>
          <Sol x={1500} y={260} r={56 + vida(f, t4, t4 + 80) * 30} f={f} />
        </g>
      </Capa>
      <Capa p={0.12}>
        <g opacity={ap(f, t5, 25) * 0.75}>
          <Personaje x={1250} y={760} s={1.2} voltear contorno barba tocado="corona" capa={C.purpura} objeto="rayo" brazo={[entre(f, t5, t5 + 30, 80, 135), 0]} boca />
        </g>
      </Capa>
      <Capa p={0.35}>
        <Monte x={500} ancho={600} alto={380} o={0.5} />
        <Monte x={900} ancho={600} alto={460} o={0.5} templo />
        <Monte x={2600} ancho={700} alto={420} o={0.5} />
      </Capa>
      <Capa p={1}>
        {/* los de plata, antes de que el suelo los trague */}
        {[3150, 3380, 3600].map((x, i) => {
          const tirita = Math.sin(f * 1.3 + i) * frio * 3;
          return (
            <g key={x} opacity={ap(f, t4 - 20 + i * 8, 20)}>
              <Personaje x={x + tirita} y={SUELO + hunde * 420} s={0.9} piel={PLATA} mujer={i === 1} voltear={i === 2} brazo={frio > 0.5 ? [150, 120] : [40, 40]} brazoAtras={frio > 0.5 ? [140, 120] : undefined} inclinar={frio * 6} boca={hunde > 0} cabeza={hunde > 0 ? 25 : 0} />
            </g>
          );
        })}
        <Suelo desde={-600} hasta={5000} />
        {/* grieta por donde se hunden */}
        {f > t5 + 30 && <path d={`M3060 ${SUELO} L3200 ${SUELO + 8} L3330 ${SUELO - 4} L3480 ${SUELO + 10} L3680 ${SUELO}`} stroke={C.oro} strokeWidth={4 + hunde * 6} fill="none" opacity={1 - ap(f, t5 + 150, 20)} />}
        {/* la raza de plata aparece */}
        {[250, 450, 650, 850].map((x, i) => (
          <g key={x} opacity={ap(f, 20 + i * 14, 25) * (1 - ap(f, t1 + 20, 20))}>
            <circle cx={x} cy={SUELO - 190} r={130} fill="url(#haloBlanco)" opacity={0.35} />
            <Personaje x={x} s={0.95} piel={PLATA} mujer={i % 2 === 1} voltear={i > 1} brazo={[60 + Math.sin(f / 12 + i) * 20, 40]} />
          </g>
        ))}
        <Rotulo x={550} y={SUELO - 400} texto="RAZA DE PLATA" color={PLATA} o={vida(f, 40, t1 + 10)} />
        {/* cien años de infancia */}
        <Casa x={1880} s={0.95} luz={0.4} f={f} />
        <Personaje x={1180} s={0.95} piel={PLATA} mujer canas={anios > 60} brazo={[70 + Math.sin(f / 15) * 15, 40]} cabeza={8} />
        <Personaje x={aroX - 70} s={ninoS} piel={PLATA} barba={false} tocado={null} accion="correr" fase={f * 0.3} brazo={[80, -20]} voltear={Math.cos(f / 22) < 0} opacity={1 - ap(f, t2 + 10, 15)} />
        <g opacity={1 - ap(f, t2 + 10, 15)}><Aro x={aroX} r={34} f={f} /></g>
        <Rotulo x={1400} y={SUELO - 360} texto={`${anios} ${anios === 1 ? 'AÑO' : 'AÑOS'}`} tam={44} o={vida(f, t1 + 5, t2 + 10)} />
        {/* adulto necio y breve */}
        <g opacity={ap(f, t2 + 5, 15) * (1 - ap(f, fin(2) - 10, 20))}>
          <Personaje x={adulto.x} piel={PLATA} accion={adulto.accion} fase={f * 0.13} inclinar={10} cabeza={-18} brazo={[10, 10]} />
        </g>
        <Estela x={2250} s={0.9} o={Math.max(ap(f, t2 + 30, 20) * 0.35, ap(f, fin(2) - 20, 20))} />
        {/* insolencia: peleas y altar derribado */}
        <g opacity={ap(f, t3 - 25, 20)}>
        <Personaje x={2550 + entre(f, t3 + 10, t3 + 25, 0, 30)} piel={PLATA} brazo={[entre(f, t3 + 10, t3 + 22, 40, 95), 0]} inclinar={entre(f, t3 + 10, t3 + 22, 0, 12)} boca={f > t3} />
        <Personaje x={2760 + entre(f, t3 + 20, t3 + 40, 0, 40)} piel={PLATA} voltear inclinar={entre(f, t3 + 20, t3 + 40, 0, -14)} brazo={[120, 30]} brazoAtras={[140, 20]} boca={f > t3 + 20} />
        <Altar x={3000} f={f} fuego={1 - ap(f, t3 + 60, 25)} rot={entre(f, t3 + 50, t3 + 70, 0, 80, Easing.in(Easing.quad))} s={0.85} />
        <Personaje x={2880} s={0.92} piel={PLATA} voltear={false} brazo={[entre(f, t3 + 40, t3 + 55, 30, 100), 0]} inclinar={entre(f, t3 + 40, t3 + 55, 0, 8)} cabeza={-6} opacity={1 - ap(f, t4, 20)} />
        </g>
        <Humo x={3060} y={SUELO - 60} f={f} alto={200} o={vida(f, t3 + 70, t4 + 30) * 0.6} />
        {/* invierno */}
        <Frutal x={4150} f={f} frutos={0} hojas={1 - frio * 0.75} />
      </Capa>
      <Capa p={0}>
        {/* calor: ondas sobre el suelo */}
        <g opacity={vida(f, t4, t4 + 80)}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={suave(Array.from({ length: 12 }, (_, k) => [200 + k * 140, 420 + i * 60 + Math.sin(k + f / 5 + i) * 12] as P))} stroke={C.oro} strokeWidth={4} fill="none" opacity={0.6} />)}
        </g>
        <Nieve f={f} o={frio * (1 - ap(f, t5 + 20, 20))} />
        <rect x={0} y={126} width={1920} height={704} fill={PLATA} opacity={frio * 0.12 * (1 - ap(f, t5 + 20, 20))} />
      </Capa>
      <Relampago a={[1200, 130]} b={[1300, SUELO]} f={f} desde={t5 + 30} dur={16} />
      <SelloEdad f={f} color={PLATA} n={2} a={10} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · La edad de bronce
const EdadBronce: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  const cam: Cam = [[0, 0, 1.08], [t1, 250, 1], [t2, 900, 1], [t3, 1500, 1], [t4, 2100, 1.02], [t5 - 10, 2200, 1.02], [t5 + 50, 3000, 1], [dur, 3100, 1.08]];
  const arboles = [400, 800, 1180];
  const choque = t4 + 45;
  const oscuro = ap(f, t5, 60);
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0.05}>
        <Sol x={1300} y={250} r={50} f={f} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={400} ancho={600} alto={400} o={0.55} />
        <Monte x={1500} ancho={700} alto={480} o={0.55} />
        <Monte x={2700} ancho={600} alto={360} o={0.55} />
      </Capa>
      <Capa p={0.6}>
        {[600, 1700, 2600].map((x, i) => <Humo key={x} x={x} y={SUELO - 40} f={f + i * 50} alto={300} o={ap(f, t4, 40) * 0.5} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={5000} />
        {/* nacen de los fresnos */}
        {arboles.map((x, i) => {
          const abre = ap(f, 30 + i * 18, 40);
          const sale = andar(f, 70 + i * 18, 130 + i * 18, x, x + 170);
          const flexiona = f > t1 && f < fin(1);
          return (
            <g key={x}>
              <Fresno x={x} s={0.82} f={f} abre={abre} />
              <g opacity={ap(f, 60 + i * 18, 20) * (1 - ap(f, t2 + 30, 20))}>
                <Personaje x={sale.x} accion={sale.accion} piel={BRONCE} gigante s={1.02} tocado="casco" brazo={flexiona ? [95 + Math.sin(f / 6 + i) * 8, 85] : [40, 60]} brazoAtras={flexiona ? [-95, -85] : undefined} boca={flexiona && Math.sin(f / 8 + i) > 0.3} />
              </g>
            </g>
          );
        })}
        <Rotulo x={1600} y={SUELO - 420} texto="RAZA DE BRONCE" color={BRONCE} o={vida(f, t1 - 10, t2 + 20)} />
        {/* casas y armas de bronce */}
        <Casa x={1650} s={0.9} color={BRONCE} />
        <Casa x={2200} s={0.75} color={BRONCE} />
        {[1500, 1580, 1720, 1800].map((x, i) => (
          <g key={x} transform={`translate(${x} ${SUELO - 300})`}>
            <circle r={26} fill={BRONCE} stroke={C.negro} strokeWidth={4} />
            <circle r={8} fill={C.negro} />
            {i % 2 === 0 && <Inc d="M-16 0 A 16 16 0 0 1 16 0" c={C.negro} w={2} />}
          </g>
        ))}
        {[1950, 1980, 2010].map((x) => <path key={x} d={`M${x} ${SUELO} L${x + 10} ${SUELO - 300} M${x + 10} ${SUELO - 300} l -8 -26 l 16 0 Z`} stroke={C.negro} strokeWidth={6} fill={BRONCE} />)}
        <Personaje x={1430} piel={BRONCE} gigante tocado="casco" objeto="lanza" escudo emblema="leon" brazo={[30, 150]} opacity={ap(f, t2 - 10, 20)} />
        {/* no comen pan */}
        {(() => {
          const lanza = f > t3 + 30;
          const p: P = manoDe({ x: 2450, brazo: lanza ? [150, 10] : [80, 30] });
          const vuela = entre(f, t3 + 25, t3 + 60, 0, 1, lin);
          return (
            <>
              <Personaje x={2450} piel={BRONCE} gigante tocado="casco" brazo={lanza ? [150, 10] : [80, 30]} objeto={lanza ? 'espada' : null} cabeza={lanza ? -5 : 10} boca={f > t3 + 20 && f < t3 + 50} />
              {vuela < 1 && <Pan x={vuela > 0 ? p[0] + vuela * 260 : p[0] + 14} y={vuela > 0 ? p[1] - Math.sin(vuela * Math.PI) * 160 + vuela * (SUELO - p[1]) : p[1] - 8} rot={vuela * 400} s={1.1} />}
              {vuela >= 1 && <Pan x={p[0] + 260} y={SUELO - 4} rot={20} s={1.1} />}
            </>
          );
        })()}
        {/* la guerra: se destruyen entre ellos */}
        {[0, 1, 2].map((i) => {
          const a = andar(f, t4 - 10, choque, 2450 - i * 90, 2780 - i * 40, true);
          const cae = ap(f, choque + 30 + i * 25, 20) * (i === 1 ? 0 : 1);
          return (
            <Tendido key={`a${i}`} x={a.x} ang={-cae * 90}>
              <Personaje x={a.x} accion={a.accion} piel={BRONCE} gigante s={0.95} tocado="casco" objeto="lanza" escudo brazo={f > choque ? [90 + Math.sin(f / 4 + i) * 25, 10] : [70, 40]} ojosCerrados={cae > 0.5} opacity={f > t1 ? ap(f, t4 - 20, 15) : 0} />
            </Tendido>
          );
        })}
        {[0, 1, 2].map((i) => {
          const a = andar(f, t4 - 10, choque, 3300 + i * 90, 2930 + i * 40, true);
          const cae = ap(f, choque + 40 + i * 20, 20);
          return (
            <Tendido key={`b${i}`} x={a.x} ang={cae * 90}>
              <Personaje x={a.x} accion={a.accion} voltear piel={BRONCE} gigante s={0.95} tocado="casco" objeto="lanza" escudo emblema="pulpo" brazo={f > choque ? [90 + Math.sin(f / 4 + i + 1) * 25, 10] : [70, 40]} ojosCerrados={cae > 0.5} opacity={ap(f, t4 - 20, 15)} />
            </Tendido>
          );
        })}
        {f > choque && f < choque + 100 && <Chispas x={2860} y={SUELO - 260} n={30} f={f} viento={0} />}
        {/* sin nombre, al reino de Hades */}
        {[3250, 3400, 3550].map((x, i) => <Estela key={x} x={x} s={0.85} o={ap(f, t5 - 40 + i * 12, 20)} rot={(i - 1) * 4} />)}
        <BocaHades x={4100} s={1} f={f} />
        {[0, 1, 2, 3].map((i) => {
          const a = andar(f, t5 + 20 + i * 18, t5 + 150 + i * 18, 3500 + i * 60, 4080);
          return <Personaje key={i} x={a.x} accion={a.accion} piel={BRONCE} s={0.75} contorno inclinar={6} cabeza={-14} opacity={vida(f, t5 + 20 + i * 18, t5 + 130 + i * 18, 25) * 0.55} />;
        })}
        <Rotulo x={4100} y={SUELO - 430} texto="HADES" o={vida(f, t5 + 30, dur - 10)} />
      </Capa>
      <Capa p={0}>
        <rect x={0} y={126} width={1920} height={704} fill={C.noche} opacity={oscuro * 0.45} />
      </Capa>
      <SelloEdad f={f} color={BRONCE} n={3} a={10} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · La edad de los héroes
const MAR1: [number, number] = [1700, 2850];
const MAR2: [number, number] = [3500, 6200];
const Mar: React.FC<{ f: number; tramo: [number, number]; id: string }> = ({ f, tramo, id }) => (
  <g>
    <defs>
      <clipPath id={id}><rect x={tramo[0]} y={SUELO - 80} width={tramo[1] - tramo[0]} height={400} /></clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <rect x={tramo[0]} y={SUELO - 30} width={tramo[1] - tramo[0]} height={300} fill={C.negro} />
      <g transform={`translate(${tramo[0] - 100} 0)`}>
        <Olas y={SUELO - 50} f={f} color={C.mar} alto={34} />
        <g transform="translate(2300 0)"><Olas y={SUELO - 50} f={f} color={C.mar} alto={34} /></g>
      </g>
    </g>
  </g>
);
const EdadHeroes: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  const cam: Cam = [[0, 0, 1], [t1, 150, 1], [t2 - 20, 450, 1], [t2 + 50, 1700, 1], [t3, 1900, 1], [t4, 2700, 1], [t5, 3500, 1.02], [dur, 3600, 1.06]];
  const heroes = [0, 1, 2].map((i) => andar(f, 0, 130, -140 - i * 170, 560 - i * 170));
  const barco = entre(f, t2 - 20, t3 + 40, 2060, 2580, lin);
  const viaje = entre(f, t4 - 10, t5 + 40, 3650, 4150, Easing.inOut(Easing.sin));
  // tres cosechas
  const cosecha = (k: number) => ap(f, t5 + 10 + k * 55, 20) * (k < 2 ? 1 - ap(f, t5 + 45 + k * 55, 10) * 0.5 : 1);
  const frutos = Math.max(cosecha(0), cosecha(1), cosecha(2));
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.05}>
        <Sol x={250} y={250} r={52} f={f} />
      </Capa>
      <Capa p={0.12}>
        <g opacity={vida(f, t3, t4, 25) * 0.75}>
          <circle cx={920} cy={400} r={260} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
          <Personaje x={900} y={560} s={0.8} contorno barba tocado="corona" capa={C.purpura} objeto="cetro" brazo={[entre(f, t3, t3 + 40, 60, 115), 10]} />
        </g>
      </Capa>
      <Capa p={0.35}>
        <Monte x={400} ancho={600} alto={360} o={0.5} />
        <Monte x={1300} ancho={500} alto={300} o={0.45} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={MAR1[0]} />
        <Suelo desde={MAR1[1]} hasta={MAR2[0]} />
        <Mar f={f} tramo={MAR1} id="marH1" />
        <Mar f={f} tramo={MAR2} id="marH2" />
        {/* Tebas de las siete puertas */}
        <Muralla x={760} ancho={840} alto={250} puertas={7} lumbre={1} f={f} />
        <Rotulo x={1180} y={SUELO - 380} texto="TEBAS" o={vida(f, t1 + 10, t2 + 10)} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = 760 + (i + 0.5) * 120, g = Math.sin(f / 5 + i * 2);
          return (
            <g key={i} opacity={ap(f, t1 + i * 6, 15)}>
              <Personaje x={x - 28} s={0.46} tocado="casco" escudo objeto="lanza" brazo={[90 + g * 25, 10]} inclinar={6} />
              <Personaje x={x + 28} s={0.46} voltear tocado="casco" escudo emblema="trisquel" objeto="espada" brazo={[110 - g * 25, 10]} />
            </g>
          );
        })}
        {/* los héroes, hijos de dioses */}
        {heroes.map((h, i) => (
          <g key={i}>
            <circle cx={h.x + 10} cy={SUELO - 340} r={70} fill="url(#halo)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
            <Personaje x={h.x} accion={h.accion} tocado="casco" capa={C.purpura} escudo emblema={(['gorgona', 'leon', 'pulpo'] as const)[i]} objeto="lanza" brazo={[30, 150]} />
          </g>
        ))}
        <Rotulo x={360} y={SUELO - 470} texto="HÉROES" o={vida(f, 40, t1)} />
        {/* naves hacia Troya */}
        <g opacity={ap(f, t2 - 40, 25)}>
          <Barco x={barco} y={SUELO - 30} s={0.8} f={f} />
          <Barco x={barco - 300} y={SUELO - 20} s={0.6} f={f + 20} />
        </g>
        <Muralla x={2950} ancho={480} alto={330} puertas={1} />
        <Personaje x={3190} y={SUELO - 352} s={0.6} mujer tocado="velo" voltear brazo={[100, 40]} />
        <Rotulo x={3060} y={SUELO - 470} texto="HELENA" tam={28} o={vida(f, t2 + 40, t3 + 30)} />
        <Rotulo x={3190} y={SUELO - 220} texto="TROYA" o={vida(f, t2 + 20, t3 + 60)} />
        {/* rayo de luz de Zeus sobre un héroe */}
        <g opacity={vida(f, t3 + 30, t4, 20)}>
          <path d={`M2960 130 L2880 ${SUELO} L3040 ${SUELO} Z`} fill={C.oro} opacity={0.3} />
        </g>
        <Personaje x={2960} y={SUELO - entre(f, t3 + 50, t4 + 20, 0, 260)} s={0.62} contorno tocado="casco" escudo capa={C.purpura} brazo={[150, 20]} cabeza={20} opacity={vida(f, t3 + 30, t4 + 20, 20)} />
        {/* hacia las Islas de los Bienaventurados */}
        <Isla x={4750} y={SUELO - 10} f={f} luz={0.6 + ap(f, t4, 40) * 0.4} frutos={frutos} />
        {[[4430, SUELO - 80], [5000, SUELO - 95]].map(([x, y], i) => (
          <g key={x} opacity={ap(f, t5 - 10 + i * 15, 25)}>
            <Personaje x={x} y={y} s={0.55} tocado="laurel" brazo={[100 + Math.sin(f / 12 + i) * 10, 40]} voltear={i === 1} />
          </g>
        ))}
        <Barco x={viaje} y={SUELO - 30} s={0.65} f={f} />
        <Rotulo x={4750} y={SUELO - 480} texto="ISLAS DE LOS BIENAVENTURADOS" tam={28} o={vida(f, t4 + 40, dur - 10)} />
      </Capa>
      <SelloEdad f={f} color={C.purpura} n={4} a={10} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · La edad de hierro
const EdadHierro: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.04], [t1, 0, 1], [t1 + 40, 450, 1.06], [t2, 520, 1.1], [t2 + 50, 1150, 1], [t3, 1300, 1], [t4, 2100, 1], [dur, 2420, 1.02]];
  // ciclo de días y noches
  const ciclo = (f - t2) / 70;
  const noche = f > t2 && f < t3 + 40 ? (1 - Math.cos(ciclo * Math.PI * 2)) / 2 : 0;
  const golpe = (k: number) => Math.sin(f / 6 + k);
  return (
    <Escenario dur={dur} camara={cam} cielo="barro">
      <Capa p={0}>
        {f > t2 && f < t3 + 40 && (
          <>
            <g transform={`rotate(${ciclo * 360} 960 980)`}>
              <Sol x={960} y={300} r={44} f={f} />
              <Luna x={960} y={1660} r={40} />
            </g>
          </>
        )}
      </Capa>
      <Capa p={0.3}>
        <Monte x={300} ancho={600} alto={380} o={0.55} />
        <Monte x={1500} ancho={700} alto={420} o={0.55} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={5000} />
        {/* la raza de hierro: la nuestra */}
        {[150, 330, 520, 700].map((x, i) => {
          const a = andar(f, 0, t1 + 60, x - 260, x + 120);
          return <Personaje key={x} x={a.x} accion={a.accion} fase={f * 0.12 + i} piel={HIERRO} mujer={i === 2} inclinar={8} cabeza={-12} brazo={[10, 10]} contorno opacity={ap(f, 10 + i * 10, 20)} />;
        })}
        <Rotulo x={420} y={SUELO - 420} texto="RAZA DE HIERRO" color={C.crema} o={vida(f, 30, t1 + 20)} />
        {/* Hesíodo se lamenta */}
        <Personaje x={980} canas tocado="laurel" ropa="larga" contorno brazo={f > t1 && f < fin(1) + 20 ? [entre(f, t1, t1 + 20, 40, 160), entre(f, t1, t1 + 20, 50, 0)] : [40, 50]} brazoAtras={[-10, -10]} inclinar={f > t1 ? -4 : 0} cabeza={f > t1 ? 14 : 0} boca={habla(f, t1 + 5, fin(1))} />
        <Rotulo x={1000} y={SUELO - 440} texto="HESÍODO" o={vida(f, t1 + 10, fin(1))} />
        {/* trabajo sin fin */}
        <Personaje x={1360} piel={HIERRO} inclinar={18 + golpe(0) * 8} brazo={[100 + golpe(0) * 60, 20]} brazoAtras={[100 + golpe(0) * 60, 30]} cabeza={-10} />
        <Pico p={manoDe({ x: 1360, brazo: [100 + golpe(0) * 60, 20], inclinar: 18 + golpe(0) * 8 })} ang={120 + golpe(0) * 50} s={0.8} />
        <Arado x={1770} />
        <Buey x={2090} s={0.9} f={f} />
        <Personaje x={1720} piel={HIERRO} accion="caminar" fase={f * 0.1} inclinar={10} brazo={[70, 10]} />
        <Personaje x={2450} piel={HIERRO} mujer voltear inclinar={12} brazo={[40, 70]} cabeza={-10} />
        <Pithos x={2590} s={0.45} />
        {/* males que mandan los dioses, y bienes mezclados */}
        {Array.from({ length: 6 }, (_, i) => {
          const e = f - t3 - i * 14;
          if (e < 0) return null;
          return <Mal key={i} x={1400 + i * 170 + Math.sin(e / 20 + i) * 40} y={180 + Math.min(e, 120) * 2.2 - Math.max(0, e - 140) * 3} s={0.62} f={f} v={i} dir={i % 2 ? 1 : -1} o={vida(f, t3 + i * 14, t4 - 20 + i * 5, 15)} />;
        })}
        {Array.from({ length: 10 }, (_, i) => <Espiga key={i} x={2160 + i * 22} c={ap(f, t3 + 60 + i * 4, 30)} s={0.8} />)}
        <Flor x={1880} c={ap(f, t3 + 80, 30)} />
        <Flor x={1940} c={ap(f, t3 + 95, 30)} color={C.blanco} />
        {/* la mina: hierro y oro arrancados a la tierra */}
        <path d={`M2650 ${SUELO} C 2700 ${SUELO - 200}, 2850 ${SUELO - 420}, 3050 ${SUELO - 440} C 3250 ${SUELO - 420}, 3400 ${SUELO - 200}, 3500 ${SUELO} Z`} fill="#3A1A0C" />
        {Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 + r }, (_, i) => <path key={`${r}-${i}`} d={`M${3050 - 60 * (r + 1) + i * 120 - 20} ${SUELO - 380 + r * 90} a 24 14 0 0 1 48 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.5} />))}
        <path d={`M2900 ${SUELO} L2920 ${SUELO - 150} Q 3000 ${SUELO - 200} 3080 ${SUELO - 150} L3100 ${SUELO} Z`} fill={C.noche} />
        <Veta x={3000} y={SUELO - 110} t={ap(f, t4 + 20, 25)} f={f} />
        <Veta x={3180} y={SUELO - 260} t={ap(f, t4 + 50, 25)} f={f} color={PLATA} />
        {[2780, 3240].map((x, i) => {
          const g = golpe(i * 2);
          const br: [number, number] = [120 + g * 50, 20];
          return (
            <g key={x}>
              <Personaje x={x} piel={HIERRO} voltear={i === 1} inclinar={14} brazo={br} brazoAtras={br} cabeza={-8} />
              <Pico p={manoDe({ x, voltear: i === 1, brazo: br, inclinar: 14 })} ang={(i === 1 ? -1 : 1) * (130 + g * 40)} s={0.8} />
            </g>
          );
        })}
        {f > t4 + 80 && <Chispas x={3000} y={SUELO - 120} n={16} f={f} viento={0.2} />}
        {/* y nace la guerra */}
        <g opacity={ap(f, t4 + 50, 25)}>
          <circle cx={4150} cy={SUELO - 150} r={320} fill="url(#halo)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
          <g transform={`translate(4150 ${SUELO})`}><Fuego f={f} s={1.4} /></g>
          <Chispas x={4150} y={SUELO - 160} f={f} n={20} />
        </g>
        {[0, 1, 2].map((i) => {
          const a = andar(f, t4 + 60 + i * 10, dur, 3520 + i * 130, 3850 + i * 130, true);
          return <Personaje key={i} x={a.x} accion={a.accion} piel={HIERRO} tocado="casco" objeto={i === 1 ? 'espada' : 'lanza'} escudo brazo={[100, 20]} opacity={ap(f, t4 + 60 + i * 10, 15)} contorno />;
        })}
      </Capa>
      <Capa p={0}>
        <rect x={0} y={126} width={1920} height={704} fill={C.noche} opacity={noche * 0.5} />
      </Capa>
      <SelloEdad f={f} color={HIERRO} n={5} a={10} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · La profecía de Hesíodo
const Profecia: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.08], [t1 - 20, 60, 1.04], [t1 + 25, 700, 1], [t2 - 15, 760, 1], [t2 + 30, 1750, 1], [t3 - 10, 1800, 1], [t3 + 40, 2600, 1], [t4 - 10, 2650, 1], [t4 + 40, 3000, 1.02], [dur, 3060, 1.05]];
  const huesped = entre(f, t1 + 40, t1 + 100, 0, 1);
  const empuja = entre(f, t2 + 20, t2 + 40, 0, 1, Easing.out(Easing.back(2)));
  const pesa = entre(f, fin(2) - 70, fin(2) - 30, 0, 24, Easing.out(Easing.bounce));
  // las diosas suben
  const sube = entre(f, t3 + 90, fin(3), 0, 1, Easing.inOut(Easing.sin));
  const astrea = entre(f, t4 + 30, t4 + 150, 0, 1, Easing.inOut(Easing.sin));
  const virgo: P[] = [[1380, 300], [1460, 250], [1540, 270], [1620, 220], [1700, 260], [1650, 350], [1580, 400]];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0}>
        <Estrellas n={60} f={f} area={[0, 140, 1920, 320]} />
        <Constelacion pts={virgo} t={ap(f, t4 + 100, 60)} />
        <Rotulo x={1540} y={460} texto="VIRGO" tam={26} o={ap(f, t4 + 150, 20)} />
      </Capa>
      <Capa p={0.15}>
        <Luna x={1500} y={250} r={40} />
      </Capa>
      {/* el Olimpo, lejos, adonde suben las diosas */}
      <Capa p={0.3}>
        <circle cx={1300} cy={380} r={260} fill="url(#haloBlanco)" opacity={0.15 + ap(f, t3, 60) * 0.2} />
        <Monte x={1300} ancho={600} alto={560} color="#3A1A0C" o={0.95} templo />
        <Monte x={300} ancho={500} alto={360} color="#2A120A" o={0.9} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={5000} />
        {/* Hesíodo profetiza */}
        <Personaje x={420} canas tocado="laurel" ropa="larga" contorno brazo={[entre(f, 20, 45, 40, 155), 10]} cabeza={14} boca={habla(f, 18, fin(0))} />
        <Rotulo x={440} y={SUELO - 430} texto="HESÍODO" o={vida(f, 20, t1)} />
        {/* el huésped rechazado */}
        <Casa x={1150} s={0.85} luz={1 - huesped * 0.8} f={f} puerta={huesped} />
        <Personaje x={1400} contorno voltear tocado="petaso" objeto="cetro" brazo={[100 - huesped * 60, 20]} cabeza={huesped * -10} inclinar={-4} />
        {/* hermanos que pelean */}
        <Personaje x={1680} piel={HIERRO} contorno brazo={[95, 0]} inclinar={10 + Math.sin(f / 5) * 4} boca={f > t1 + 30} />
        <Personaje x={1840} piel={HIERRO} contorno voltear brazo={[95, 0]} inclinar={10 + Math.cos(f / 5) * 4} boca={f > t1 + 50} />
        {/* el padre anciano, empujado */}
        <Personaje x={2250} piel={HIERRO} contorno brazo={[entre(f, t2 + 15, t2 + 30, 40, 95), 0]} inclinar={empuja * 10} boca={f > t2 + 20} />
        <Tendido x={2450 + empuja * 40} ang={empuja * 30}>
          <Personaje x={2450 + empuja * 40} canas ropa="larga" contorno voltear objeto="cetro" brazo={[60, 20]} inclinar={-6} cabeza={-10} />
        </Tendido>
        {/* la fuerza contra la justicia */}
        <Balanza x={3020} y={SUELO - 300} inc={-pesa} s={1} />
        <Personaje x={2790} piel={HIERRO} gigante contorno objeto="lanza" brazo={[entre(f, fin(2) - 80, fin(2) - 50, 40, 100), -10]} inclinar={8} cabeza={8} />
        <Rotulo x={2860} y={SUELO - 460} texto="LA FUERZA" tam={26} o={vida(f, fin(2) - 60, t3 + 20)} />
        {/* Aidós y Némesis */}
        {[0, 1].map((i) => {
          const x = 3420 + i * 190, y = SUELO - sube * (360 - i * 30);
          return (
            <g key={i} opacity={ap(f, t3 + i * 15, 25) * (1 - ap(f, fin(3) + 10, 25))}>
              <circle cx={x} cy={y - 180} r={170} fill="url(#haloBlanco)" opacity={0.35} />
              <Personaje x={x + sube * 60} y={y} s={1 - sube * 0.45} mujer ropa="larga" capa={C.blanco} tocado="diadema" voltear={i === 1} brazo={sube > 0 ? [150, 10] : [80, 40]} cabeza={sube > 0 ? 18 : 0} accion={sube > 0.02 && sube < 0.98 ? 'caminar' : 'parado'} fase={f * 0.08 + i} />
            </g>
          );
        })}
        <Rotulo x={3420} y={SUELO - 400} texto="AIDÓS" tam={28} o={vida(f, t3 + 30, t3 + 100)} />
        <Rotulo x={3610} y={SUELO - 400} texto="NÉMESIS" tam={28} o={vida(f, t3 + 40, t3 + 110)} />
        {/* tierra manchada de sangre */}
        {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={3600 + i * 80 + azar(i) * 30} cy={SUELO + 4} rx={22 + azar(i + 2) * 20} ry={5} fill={C.purpura} opacity={ap(f, t4, 30)} />)}
        {[0, 1].map((i) => {
          const g = Math.sin(f / 5 + i);
          return <Personaje key={i} x={3450 + i * 190} piel={HIERRO} contorno voltear={i === 1} tocado="casco" objeto={i ? 'espada' : 'lanza'} escudo brazo={[95 + g * 25, 10]} inclinar={6} opacity={ap(f, t4, 25)} />;
        })}
        {[3700, 4400].map((x, i) => <path key={x} d={`M${x} ${SUELO} L${x + 120} ${SUELO - 30 - i * 20}`} stroke={C.negro} strokeWidth={6} opacity={ap(f, t4, 30)} />)}
        {/* Astrea, la última */}
        {(() => {
          const ax = 4050 + astrea * 280, ay = SUELO - astrea * 300, as = 1 - astrea * 0.5;
          const m = manoDe({ x: ax, y: ay, s: as, brazo: [110, 40] });
          return (
            <>
              <g opacity={ap(f, t4 - 10, 20) * (1 - ap(f, t4 + 120, 40))}>
                <circle cx={ax} cy={ay - 180 * as} r={190} fill="url(#halo)" opacity={0.4} style={{ mixBlendMode: 'screen' }} />
                <Personaje x={ax} y={ay} s={as} mujer ropa="larga" capa={C.blanco} tocado="corona" brazo={[110, 40]} cabeza={astrea * 20} accion={astrea > 0.02 && astrea < 0.98 ? 'caminar' : 'parado'} fase={f * 0.08} />
                <Balanza x={m[0]} y={m[1] + 6} s={0.4 * as} mano />
              </g>
              <Rotulo x={ax} y={ay - 430 * as} texto="ASTREA" o={vida(f, t4 + 10, t4 + 100)} />
            </>
          );
        })()}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · La paciencia de Zeus
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1], [t1, 150, 1.02], [t2, 260, 1.08], [dur, 360, 1.14]];
  const tormenta = ap(f, t2 - 20, 60);
  const llueve = ap(f, t3 - 10, 30);
  const agua = entre(f, t3, dur, 0, 70);
  const brazoZ: [number, number] = f < t1 + 60 ? [50, 40] : f < t2 + 50 ? [entre(f, t1 + 60, t1 + 90, 50, 112), entre(f, t1 + 60, t1 + 90, 40, 10)] : [entre(f, t2 + 50, t2 + 80, 112, 50), entre(f, t2 + 50, t2 + 80, 10, 40)];
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={40} f={f} area={[0, 140, 1920, 260]} />
      </Capa>
      {/* la tierra, allá abajo */}
      <Capa p={0.4}>
        <path d="M-300 1000 L-300 640 C 100 610, 400 660, 800 630 C 1100 610, 1300 650, 1500 640 L1500 1000 Z" fill="#2A120A" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = -100 + i * 230, y = 640 + (i % 2) * 14;
          return (
            <g key={i}>
              <Casa x={x} y={y} s={0.26} luz={0.6} f={f + i * 11} />
              {i % 2 === 0 && <g transform={`translate(${x + 80} ${y})`}><Fuego f={f + i * 9} s={0.45} /></g>}
              {i % 2 === 1 && [0, 1].map((k) => <Personaje key={k} x={x + 70 + k * 40} y={y + 4} s={0.16} voltear={k === 1} contorno objeto="lanza" brazo={[90 + Math.sin(f / 4 + k + i) * 25, 10]} />)}
              <Humo x={x + 50} y={y - 40} f={f + i * 30} alto={240} o={0.3 + ap(f, t1, 30) * 0.3} />
            </g>
          );
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const e = (f - t1 + i * 30) % 180;
          if (f < t1) return null;
          return <Mal key={i} x={100 + i * 200 + e * 1.4} y={640 - e * 2.4} s={0.45} f={f} v={i} o={Math.sin((e / 180) * Math.PI)} />;
        })}
        <g transform={`translate(0 ${-agua})`}>
          <g opacity={ap(f, t3, 30)}><Olas y={760} f={f} color={C.mar} alto={26} /></g>
        </g>
      </Capa>
      <Capa p={0.15}>
        {[[300, 260, 1.1], [800, 230, 1.3], [1300, 280, 1]].map(([x, y, s], i) => (
          <Nube key={i} x={x - 300 + tormenta * 300} y={y} s={s * (0.6 + tormenta * 0.6)} color="#3A1A0C" f={f} />
        ))}
      </Capa>
      <Capa p={0}>
        <Lluvia f={f} o={llueve} x0={-200} ancho={1600} />
      </Capa>
      {/* el Olimpo, sobre las nubes */}
      <Capa p={1}>
        <circle cx={1700} cy={SUELO - 260} r={420} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        <Templo x={1800} y={SUELO - 30} s={1.1} />
        <path d={`M1180 ${SUELO + 60} C 1200 ${SUELO - 40}, 1300 ${SUELO - 40}, 1350 ${SUELO - 10} C 1400 ${SUELO - 60}, 1520 ${SUELO - 60}, 1560 ${SUELO - 20} L 3000 ${SUELO - 20} L3000 ${SUELO + 60} Z`} fill={C.crema} stroke={C.negro} strokeWidth={4} />
        {[1260, 1440, 1700, 1960, 2200].map((x) => <path key={x} d={`M${x} ${SUELO - 10} c 30 -30, 70 -30, 100 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.6} />)}
        <Personaje x={1600} y={SUELO - 20} s={1.15} voltear contorno barba tocado="corona" capa={C.purpura} objeto="rayo" brazo={brazoZ} cabeza={f < t1 + 40 ? 18 : -4} boca={habla(f, t2, t3)} />
        <Rotulo x={1330} y={SUELO - 420} texto="ZEUS" o={vida(f, 20, t1 + 30)} />
        <Relampago a={[1000, 140]} b={[900, 560]} f={f} desde={t2 + 50} dur={14} />
        <Relampago a={[600, 140]} b={[720, 600]} f={f} desde={t3 + 30} dur={14} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  inicio: Inicio,
  oro: EdadOro,
  guardianes: Guardianes,
  plata: EdadPlata,
  bronce: EdadBronce,
  heroes: EdadHeroes,
  hierro: EdadHierro,
  profecia: Profecia,
  cierre: Cierre,
};
