// Escenas del video 05 · El diluvio de Deucalión (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing, interpolateColors } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Nube, Relampago, Suelo, Rotulo,
  suave, ap, entre, azar, Accion, Objeto,
} from '../../comun/vasija';
import {
  MAR, MAR_OSC, PIEDRA, manoDe, cabezaDe, Agua, Lluvia, Lobo, Oveja, Pez, Delfin, Ave, Arcon, Casa, Cipres, Piedra, Mesa, Humo, Sonido,
  Cadena, Baston, Bebe, Balanza, Alas, Soplo, MedioCuerpo, Triton, Barro, Colina, Palacio, Marcas,
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
const habla = (f: number, a: number, b: number) => f > a && f < b && Math.floor(f / 5) % 2 === 0;
/** Velo de color sobre toda la escena (noche, tormenta, destellos). */
const Velo: React.FC<{ o: number; color?: string }> = ({ o, color = '#1A0C06' }) => (o > 0 ? <rect x={-4000} y={-1500} width={12000} height={4000} fill={color} opacity={o} /> : null);
/** Destello blanco breve en los frames dados. */
const destello = (f: number, ts: number[]) => Math.max(0, ...ts.map((t) => (f >= t && f < t + 10 ? 1 - (f - t) / 10 : 0)));
/** Matorrales negros sobre el suelo. */
const Matas: React.FC<{ xs: number[]; y?: number }> = ({ xs, y = SUELO }) => (
  <g>{xs.map((x) => <path key={x} d={`M${x} ${y} c 10 -30, 50 -40, 70 -20 c 20 -20, 50 -10, 56 20 Z`} fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />)}</g>
);

// ---------------------------------------------------------------- 1 · La edad de hierro
const Hierro: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.06], [t1, 380, 1], [t2 - 30, 900, 1], [t2 + 60, 2000, 0.96], [dur, 2060, 1]];
  // pelea de guerreros
  const golpe = (k: number) => Math.sin(f / 7 + k);
  // ladrón y víctima
  const ladron = andar(f, 30, t1 + 80, 960, 2000, true);
  const victima = andar(f, 50, t1 + 100, 760, 1780, true);
  // anfitrión que echa al viajero
  const empuja = f > t1 + 10 && f < t1 + 40;
  const viejoX = entre(f, t1 + 20, t1 + 70, 1440, 1290, Easing.out(Easing.cubic));
  // Zeus y su descenso disfrazado
  const zx = 2950, zy = 545, zs = 0.85;
  const zO = 1 - ap(f, t3 + 10, 20);
  const k = entre(f, t3 + 40, dur - 5, 0, 1, lin);
  const vx = zx - 560 * k, vy = zy + (SUELO - zy) * k;
  const vMano = manoDe({ x: vx, y: vy, s: zs, voltear: true, brazo: [30, 20] });
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}>
        <Sol x={1500} y={270} r={50} f={f} />
        <Nube x={500} y={230} s={0.6} f={f} />
        <Nube x={2200} y={200} s={0.7} f={f + 30} />
      </Capa>
      <Capa p={0.25}>
        <Monte x={250} ancho={600} alto={380} />
        <Monte x={1050} ancho={480} alto={300} />
        <Monte x={1650} ancho={700} alto={560} color="#7A3A1C" templo />
      </Capa>
      <Capa p={0.55}>
        <Cipres x={120} y={SUELO - 20} s={0.7} f={f} color={C.barroOscuro} />
        <Casa x={330} y={SUELO - 20} s={0.6} color={C.barroOscuro} />
        <Casa x={760} y={SUELO - 20} s={0.55} color={C.barroOscuro} />
        <Cipres x={980} y={SUELO - 20} s={0.8} f={f} color={C.barroOscuro} />
        <Casa x={1300} y={SUELO - 20} s={0.62} color={C.barroOscuro} />
        <g transform={`translate(1300 ${SUELO - 140})`}><Fuego f={f} s={0.55} /></g>
        <Chispas x={1300} y={SUELO - 200} f={f} n={14} />
        <Humo x={1310} y={SUELO - 220} f={f} n={6} alto={260} />
        <Olivo x={1650} y={SUELO - 20} s={0.7} f={f} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={4300} />
        <Matas xs={[120, 1180, 2250, 2600]} />
        {/* dos hermanos peleando */}
        <Personaje x={430} ropa="armadura" tocado="casco" escudo objeto="lanza" brazo={[95 + golpe(0) * 22, -10 - golpe(0) * 10]} inclinar={8 + golpe(0) * 4} boca={golpe(0) > 0.5} />
        <Personaje x={660} voltear ropa="armadura" tocado="casco" escudo emblema="leon" objeto="espada" brazo={[110 + golpe(2) * 30, -20]} inclinar={8 + golpe(2) * 4} boca={golpe(2) > 0.4} />
        {/* ladrón con la copa robada y su víctima */}
        <Personaje x={victima.x} accion={victima.accion} boca brazo={[100, 0]} s={0.95} canas />
        <Personaje x={ladron.x} accion={ladron.accion} objeto="copa" brazo={[60, 50]} s={0.95} barba={false} tocado={null} />
        {/* el anfitrión que echa a un viajero */}
        <Casa x={1660} s={1.15} />
        <Personaje x={1560} voltear brazo={empuja ? [95, 0] : [30, 30]} inclinar={empuja ? -10 : 0} boca={empuja} capa={C.purpura} />
        <Personaje x={viejoX} voltear canas inclinar={f > t1 + 20 && f < t1 + 70 ? -14 : 4} brazo={[60, 20]} accion={f > t1 + 20 && f < t1 + 70 ? 'caminar' : 'parado'} />
        <Baston mano={manoDe({ x: viejoX, voltear: true, brazo: [60, 20], inclinar: 4 })} suelo={SUELO} />
        {/* rumores que suben al cielo */}
        <Humo x={540} y={SUELO - 360} f={f} o={vida(f, t1 - 20, t2 + 120, 30)} color={C.crema} alto={300} n={5} />
        <Humo x={1300} y={SUELO - 380} f={f + 20} o={vida(f, t1, t2 + 120, 30)} color={C.crema} alto={300} n={5} />
        {/* nubes del Olimpo con Zeus */}
        <circle cx={zx} cy={zy - 200} r={360} fill="url(#halo)" opacity={0.35 + destello(f, [t3 + 10]) * 0.6} style={{ mixBlendMode: 'screen' }} />
        <Humo x={zx - 260} y={zy - 140} f={f} o={vida(f, t2, t3, 20)} color={C.crema} alto={160} n={4} />
        <Personaje x={zx} y={zy} s={zs} voltear barba tocado="corona" capa={C.purpura} objeto="cetro" brazo={f > t2 + 20 ? [165, 70] : [40, 30]} cabeza={f > t2 ? -14 : 0} opacity={zO} />
        <circle cx={zx} cy={zy - 160} r={200} fill="url(#haloBlanco)" opacity={destello(f, [t3 + 10, t3 + 20]) * 0.9} />
        <Personaje x={vx} y={vy} s={zs} voltear barba tocado="petaso" brazo={[30, 20]} accion={k > 0 && k < 1 ? 'caminar' : 'parado'} opacity={ap(f, t3 + 15, 20)} />
        <g opacity={ap(f, t3 + 15, 20)}><Baston mano={vMano} suelo={vy} /></g>
        {[0, 0.25, 0.5, 0.75].map((kk, i) => <Nube key={i} x={zx - 560 * kk - 30} y={zy + (SUELO - zy) * kk + 34} s={i === 0 ? 1.15 : 0.45} f={f + i * 20} />)}
        <Nube x={zx + 260} y={zy + 20} s={0.8} f={f + 50} />
        <Rotulo x={zx} y={zy - zs * 430} texto="ZEUS" o={vida(f, t2 + 10, t3 + 10)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · El banquete de Licaón
const PX = 1250; // centro del palacio
const Licaon: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -380, 1], [t1, 150, 1], [t2, 430, 1.03], [t3, 560, 1.1], [dur, 600, 1.15]];
  const z = andar(f, 0, t1 - 10, -300, 760);
  const z2 = andar(f, t3 - 30, t3 + 10, 760, 860);
  const zX = f < t3 - 30 ? z.x : z2.x, zAcc = f < t3 - 30 ? z.accion : z2.accion;
  const zMano = manoDe({ x: zX, brazo: [30, 20] });
  const reza = entre(f, t1 + 20, t1 + 50, 0, 1);
  const lic = f < t3 - 20 ? andar(f, t2 - 30, t2 + 20, 1950, 1480) : andar(f, t3 - 20, t3 + 15, 1480, 1400);
  const ries = f > t2 + 10 && f < fin(2);
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={50} f={f} area={[-300, 140, 2500, 330]} />
        <Luna x={350} y={240} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={-150} ancho={500} alto={380} color="#2A120A" o={0.9} />
        <Monte x={500} ancho={420} alto={300} color="#2A120A" o={0.9} />
        <Monte x={1500} ancho={620} alto={420} color="#2A120A" o={0.9} />
      </Capa>
      <Capa p={0.6}>
        {[-500, -300, -60, 220].map((x, i) => <Cipres key={x} x={x} y={SUELO - 30} s={0.7 + (i % 2) * 0.15} f={f} color="#2A120A" />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-900} hasta={3000} />
        <Matas xs={[-600, -150, 300]} />
        <Palacio x={PX} ancho={620} f={f}>
          {[-180, 180].map((dx) => (
            <g key={dx}>
              <rect x={dx - 6} y={-300} width={12} height={40} fill={C.negro} />
              <g transform={`translate(${dx} -300)`}><Fuego f={f + dx} s={0.32} /></g>
            </g>
          ))}
        </Palacio>
        {/* pueblo que reza al huésped */}
        {[[960, false], [1070, true], [1180, false]].map(([x, mujer], i) => (
          <Personaje key={i} x={x as number} voltear mujer={mujer as boolean} contorno={!mujer} inclinar={reza * 22} brazo={[20 + reza * 130, 20]} opacity={vida(f, t0 + 30 + i * 10, t3 - 30)} />
        ))}
        {/* Licaón */}
        <Personaje x={lic.x} accion={lic.accion} voltear contorno barba tocado="corona" capa={C.purpura} objeto="cetro"
          brazo={ries ? [95, -5] : f > t3 + 15 ? [70, 30] : [30, 20]} boca={habla(f, t2 + 10, fin(2)) || f > fin(3) - 40} cabeza={ries ? 8 + Math.sin(f / 4) * 6 : 0} />
        {/* la mesa del banquete */}
        <g opacity={ap(f, t3 - 40, 25)}>
          <Mesa x={1130} f={f} fuente={ap(f, t3 + 15, 25)} humo={ap(f, t3 + 60, 40) * 0.8} />
        </g>
        {/* Zeus disfrazado */}
        <circle cx={zX + 20} cy={SUELO - 330} r={220} fill="url(#halo)" opacity={ap(f, t1 + 10, 40) * (0.45 + Math.sin(f / 10) * 0.1)} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={zX} accion={zAcc} contorno barba tocado="petaso" brazo={[30, 20]} cabeza={f > t3 + 40 ? -10 : 0} />
        <Baston mano={zMano} suelo={SUELO} />
        <Rotulo x={PX} y={250} texto="ARCADIA" o={vida(f, 115, t1 + 70)} />
        <Rotulo x={lic.x} y={SUELO - 440} texto="LICAÓN" o={vida(f, t2, t3 + 40)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · El rey lobo
const ReyLobo: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 500, 1.08], [t0 + 80, 450, 1], [t1, 700, 1], [t2, 1700, 1], [t3, 2250, 1.03], [dur, 2350, 1.1]];
  const vuelca = entre(f, t0 + 5, t0 + 30, 0, 1, Easing.out(Easing.cubic));
  const revela = ap(f, t0 + 5, 15);
  const brazoZ: [number, number] = [entre(f, t0 + 10, t0 + 40, 60, 170), 10];
  const zMano = manoDe({ x: 880, brazo: brazoZ });
  const run = andar(f, t0 + 60, t2 + 90, 1400, 2900, true);
  const m = entre(f, t2, t2 + 80, 0, 1);
  const lobX = f < t2 + 90 ? run.x : entre(f, t2 + 90, t3, 2900, 3150, lin);
  const lobCorre = f < t3;
  const lobY = entre(f, t3 - 25, t3 + 5, SUELO, SUELO - 70);
  const aulla = entre(f, t3 + 20, t3 + 40, 0, 1);
  const cab = cabezaDe(run.x, 1);
  const fuego = ap(f, t0 + 55, 30);
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={60} f={f} area={[-200, 140, 2600, 340]} />
        <Luna x={1650} y={240} r={52} />
        <circle cx={1650} cy={240} r={140} fill="url(#haloBlanco)" opacity={0.25} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={300} ancho={520} alto={360} color="#2A120A" o={0.9} />
        <Monte x={1100} ancho={600} alto={420} color="#2A120A" o={0.9} />
        <Monte x={1900} ancho={500} alto={330} color="#2A120A" o={0.9} />
      </Capa>
      <Capa p={0.6}>
        {[1700, 2000, 2350, 2700, 3000].map((x, i) => (i % 2 ? <Cipres key={x} x={x} y={SUELO - 30} s={0.75} f={f} color="#2A120A" /> : <Olivo key={x} x={x} y={SUELO - 30} s={0.6} f={f} color="#2A120A" />))}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-400} hasta={4400} />
        <Matas xs={[2000, 2420, 2780, 3600]} />
        <Palacio x={PX} ancho={620} f={f}>
          {[-180, 180].map((dx) => <g key={dx} transform={`translate(${dx} -300)`}><Fuego f={f + dx} s={0.32} /></g>)}
        </Palacio>
        {/* el palacio arde */}
        {[700, 950, 1250, 1550, 1800].map((x, i) => (
          <g key={x} transform={`translate(${x} ${SUELO - 455 - (i === 2 ? 110 : i % 2 ? 50 : 0)})`} opacity={ap(f, t0 + 55 + i * 6, 20)}><Fuego f={f + i * 7} s={0.9} /></g>
        ))}
        <Chispas x={1250} y={SUELO - 560} f={f} n={30 * fuego} />
        <Humo x={1250} y={SUELO - 620} f={f} o={fuego} n={8} alto={300} s={1.6} />
        <Relampago a={[1250, 120]} b={[1260, SUELO - 560]} f={f} desde={t0 + 48} dur={16} />
        <Relampago a={[700, 120]} b={[760, SUELO - 460]} f={f} desde={t0 + 80} />
        {/* la mesa volcada */}
        <Mesa x={1130 + vuelca * 80} y={SUELO - Math.sin(vuelca * Math.PI) * 90} rot={vuelca * 100} f={f} fuente={1 - vuelca} />
        {/* Licaón huye y se transforma */}
        <Personaje x={run.x} accion={run.accion} contorno barba tocado="corona" capa={C.purpura} canas={m > 0.15}
          boca={f > t1 - 10} brazo={f < t0 + 60 ? [140, 30] : undefined} inclinar={f < t0 + 60 ? -12 : 6 + m * 40} opacity={1 - m} />
        <Sonido x={cab[0] + 50} y={cab[1] + 10} f={f} o={vida(f, t1, t2 + 60) * (1 - m * 0.5)} />
        <Lobo x={lobX} y={lobY} s={1.1} fase={f * 0.36} corre={lobCorre && f > t2} contorno aullar={aulla} o={m} />
        <path d={`M3050 ${SUELO + 2} C 3060 ${SUELO - 60}, 3120 ${SUELO - 80}, 3200 ${SUELO - 72} C 3280 ${SUELO - 80}, 3320 ${SUELO - 40}, 3340 ${SUELO + 2} Z`} fill={C.negro} stroke={C.crema} strokeWidth={2} />
        <Sonido x={lobX + 150} y={lobY - 290} f={f} o={ap(f, t3 + 40, 20)} ang={-50} s={1.4} />
        {/* Zeus revela su forma divina */}
        <circle cx={900} cy={SUELO - 300} r={380} fill="url(#halo)" opacity={revela * 0.55} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={880} contorno barba tocado="petaso" brazo={[30, 20]} opacity={1 - revela} />
        <g opacity={1 - revela}><Baston mano={manoDe({ x: 880, brazo: [30, 20] })} suelo={SUELO} /></g>
        <Personaje x={880} contorno barba tocado="corona" capa={C.purpura} objeto="rayo" brazo={brazoZ} boca={f > t0 + 10 && f < t0 + 60} opacity={revela} />
        <circle cx={zMano[0]} cy={zMano[1] - 80} r={90} fill="url(#haloBlanco)" opacity={revela * 0.4} />
        <Rotulo x={lobX + 30} y={lobY - 330} texto="LICAÓN" o={ap(f, t3 + 10, 25)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La decisión de Zeus
const DIOSES: { id: string; x: number; voltear: boolean; desde: number; props: Partial<React.ComponentProps<typeof Personaje>> }[] = [
  { id: 'POSEIDÓN', x: 380, voltear: false, desde: -300, props: { objeto: 'tridente', brazo: [30, 150], canas: false, capa: MAR } },
  { id: 'HERA', x: 620, voltear: false, desde: -200, props: { mujer: true, tocado: 'corona', objeto: 'cetro', brazo: [40, 40] } },
  { id: 'ATENEA', x: 1290, voltear: true, desde: 2200, props: { mujer: true, tocado: 'casco', objeto: 'lanza', escudo: true, brazo: [30, 150] } },
  { id: 'HERMES', x: 1510, voltear: true, desde: 2300, props: { tocado: 'petaso', objeto: 'caduceo', alas: true, barba: false, brazo: [40, 40] } },
  { id: 'APOLO', x: 1730, voltear: true, desde: 2400, props: { tocado: 'laurel', objeto: 'lira', barba: false, ropa: 'larga', brazo: [50, 40] } },
];
const Decision: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -120, 1.1], [t1, 0, 1], [t2, 60, 1.06], [t3, 0, 0.94], [t4, 0, 1], [dur, 40, 1.08]];
  const zx = 960;
  const brazoZ: [number, number] = f < t1 ? [40, 30]
    : f < t2 - 10 ? [entre(f, t1, t1 + 20, 40, 45), entre(f, t1, t1 + 20, 30, -5)]
    : f < t3 + 50 ? [entre(f, t2 - 10, t2 + 20, 45, 172), 4]
    : f < t4 ? [entre(f, t3 + 50, t3 + 80, 172, 60), 20]
    : [entre(f, t4, t4 + 20, 60, 105), -10];
  const zMano = manoDe({ x: zx, brazo: brazoZ });
  const vision = vida(f, t3, t4 - 15, 30);
  const retro = entre(f, t3 + 20, t3 + 50, 0, 1) - entre(f, t4 - 20, t4 + 10, 0, 1);
  const nubesN = ap(f, t4, 50);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.1}>
        <Sol x={250} y={260} r={46} f={f} />
        <Nube x={1650 - nubesN * 300} y={260} s={0.9} color={nubesN > 0 ? MAR_OSC : C.crema} f={f} />
      </Capa>
      <Capa p={0.2}>
        {[-200, 300, 1300, 1900].map((x, i) => <Nube key={x} x={x + (i < 2 ? 1 : -1) * nubesN * 450} y={220 + (i % 2) * 50} s={0.9} color={MAR_OSC} f={f + i * 15} />).map((n, i) => <g key={i} opacity={nubesN}>{n}</g>)}
      </Capa>
      <Capa p={0.5}>
        <circle cx={960} cy={SUELO - 300} r={520} fill="url(#halo)" opacity={0.4} style={{ mixBlendMode: 'screen' }} />
        <Templo x={960} y={SUELO - 30} s={1.75} />
        {[-500, 2400].map((x) => <Nube key={x} x={x} y={SUELO - 80} s={1.3} f={f} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={2800} />
        {/* la maldad de la tierra sube como humo */}
        <Humo x={200} y={SUELO} f={f} o={vida(f, t1, t2 + 40, 30)} alto={420} n={6} s={1.5} />
        <Humo x={1720} y={SUELO} f={f + 30} o={vida(f, t1 + 20, t2 + 40, 30)} alto={420} n={6} s={1.5} />
        {DIOSES.map((d, i) => {
          const w = andar(f, 0, t0 + 70 + i * 8, d.desde, d.x);
          return (
            <Personaje key={d.id} x={w.x} accion={w.accion} voltear={d.voltear} {...d.props}
              inclinar={(d.voltear ? 1 : 1) * -retro * 14} brazo={d.id === 'HERA' && retro > 0.3 ? [150, 60] : d.props.brazo} boca={retro > 0.5 && i % 2 === 0} />
          );
        })}
        {/* Zeus */}
        <circle cx={zx + 20} cy={SUELO - 300} r={260} fill="url(#halo)" opacity={0.3 + ap(f, t2, 20) * 0.45} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={zx} barba tocado="corona" capa={C.purpura} objeto={f > t2 - 10 ? 'rayo' : 'cetro'} brazo={brazoZ} boca={habla(f, t1, fin(1)) || habla(f, t4, fin(4))} cabeza={f > t1 && f < t2 ? -12 : 0} />
        {f > t2 && <circle cx={zMano[0]} cy={zMano[1] - 90} r={120} fill="url(#haloBlanco)" opacity={0.5 * (1 - ap(f, t3 + 60, 20))} />}
        {/* visión del fuego que alcanzaría el cielo */}
        <g opacity={vision * 0.9}>
          {[150, 450, 760, 1180, 1480, 1780].map((x, i) => (
            <g key={x} transform={`translate(${x} ${SUELO + 40})`}><Fuego f={f + i * 9} s={entre(f, t3, t3 + 80, 0.6, 3 + (i % 2) * 0.6)} /></g>
          ))}
          <Chispas x={960} y={SUELO - 300} f={f} n={30} />
        </g>
        {/* nubes del suelo del Olimpo */}
        {Array.from({ length: 9 }, (_, i) => <Nube key={i} x={-120 + i * 280} y={SUELO - 6} s={0.55} f={f + i * 13} />)}
        <Lluvia f={f} o={ap(f, t4 + 30, 30) * 0.8} area={[-300, 160, 2500, 520]} n={80} />
        {DIOSES.map((d, i) => <Rotulo key={d.id} x={d.x} y={SUELO - 430} texto={d.id} tam={26} o={vida(f, t0 + 40 + i * 12, t1 + 40)} />)}
        <Rotulo x={zx} y={SUELO - 470} texto="ZEUS" tam={30} o={vida(f, t0 + 30, t1 + 40)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · El diluvio
const ARBOLES: [number, 'olivo' | 'cipres', number][] = [[2050, 'olivo', 1.2], [2420, 'olivo', 1.25], [2700, 'cipres', 1.1], [3000, 'olivo', 1.2], [3260, 'cipres', 1.15], [3560, 'olivo', 1.2], [3900, 'olivo', 1.25], [4200, 'cipres', 1.1]];
const Diluvio: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  const cam: Cam = [[0, 0, 1.04], [t1, 300, 1], [t2, 720, 1], [t3, 1300, 1], [t4, 2100, 1], [t5, 2850, 1], [dur, 3200, 1.04]];
  const nivel = entre(f, t2 + 20, t3 + 40, SUELO + 40, 520);
  const oscuro = entre(f, t0, t1 + 40, 0.05, 0.38);
  const flash = destello(f, [t1 + 10, t1 + 60, t2 + 8, t3 + 30, t4 + 70, t5 + 40]);
  // Noto, el viento del sur
  const nk = entre(f, t0 - 10, t1 + 60, 0, 1, lin);
  const nx = -300 + nk * 2100, ny = 440 + Math.sin(f / 14) * 16;
  // Poseidón golpea la tierra
  const golpe = entre(f, t2 + 10, t2 + 24, 0, 1, Easing.in(Easing.cubic)) - entre(f, t2 + 40, t2 + 70, 0, 1);
  const brazoP: [number, number] = [120 - golpe * 80, -10];
  const huye = (i: number) => (f > t1 + 30 ? (f - t1 - 30) * 6 : 0);
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.06}>
        <Sol x={1300} y={260} r={44} f={f} />
      </Capa>
      <Velo o={oscuro} color="#1A1210" />
      <Capa p={0.18}>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} opacity={ap(f, t0 + 20 + i * 18, 40)}>
            <Nube x={-200 + i * 420 + (1 - ap(f, t0 + 20 + i * 18, 80)) * (i % 2 ? 300 : -300)} y={200 + (i % 3) * 40} s={1 + (i % 2) * 0.3} color={i % 2 ? '#3A2A26' : MAR_OSC} f={f + i * 9} />
          </g>
        ))}
      </Capa>
      <Capa p={0.3}>
        <Monte x={400} ancho={600} alto={360} color="#4A2A1C" o={0.85} />
        <Monte x={1300} ancho={700} alto={460} color="#4A2A1C" o={0.85} />
        <Monte x={2300} ancho={600} alto={380} color="#4A2A1C" o={0.85} />
      </Capa>
      <Capa p={0.3}>
        <Agua nivel={entre(f, t2 + 20, t3 + 80, SUELO + 60, 470)} f={f * 0.6} color={MAR_OSC} o={0.85} x0={-600} x1={3600} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-700} hasta={5200} />
        {/* campos, casas y templo */}
        <Casa x={250} s={1} />
        <Casa x={650} s={0.9} />
        <Olivo x={880} s={0.9} f={f} />
        <Casa x={1110} s={1.05} />
        <Templo x={1500} y={SUELO} s={1} />
        {ARBOLES.map(([x, t, s], i) => (t === 'olivo' ? <Olivo key={i} x={x} s={s} f={f + i * 11} /> : <Cipres key={i} x={x} s={s} f={f + i * 11} />))}
        {/* humanos que miran el cielo y huyen */}
        {[380, 820, 1260].map((x, i) => (
          <Personaje key={i} x={x - huye(i)} voltear={f > t1 + 30} accion={f > t1 + 30 ? 'correr' : 'parado'} mujer={i === 1} contorno={i !== 1} cabeza={f < t1 + 30 ? 16 : 0} boca={f > t1} brazo={f < t1 + 30 ? [150, 30] : undefined} opacity={1 - ap(f, t2 + 40, 30)} />
        ))}
        {/* Noto */}
        <g transform={`translate(${nx} ${ny}) rotate(72)`} opacity={vida(f, t0 - 10, t1 + 50, 20)}>
          <Alas x={0} y={-270} s={0.9} bate={Math.sin(f / 5)} />
          <Personaje x={0} y={0} s={0.8} barba contorno capa={MAR} boca brazo={[110, 10]} brazoAtras={[-40, -20]} />
        </g>
        <Soplo x={nx + 270} y={ny - 70} f={f} o={vida(f, t0, t1 + 50, 20)} largo={700} />
        <Lluvia f={f} o={vida(f, t0 + 30, t1, 20) * 0.5} area={[nx - 200, ny + 40, 360, 300]} n={30} />
        <Rotulo x={nx + 150} y={ny - 230} texto="NOTO" o={vida(f, t0 + 30, t1 + 30)} />
        {/* Poseidón */}
        <circle cx={1900} cy={SUELO - 320} r={300} fill="url(#haloBlanco)" opacity={ap(f, t2 - 20, 30) * 0.25} />
        <Personaje x={1880} s={1.25} voltear contorno barba canas capa={MAR} objeto="tridente" brazo={brazoP} inclinar={golpe * 10} boca={golpe > 0.5} opacity={ap(f, t2 - 20, 25)} />
        <Rotulo x={1880} y={SUELO - 540} texto="POSEIDÓN" o={vida(f, t2, t3)} />
        {/* la inundación */}
        <Agua nivel={nivel} f={f} o={0.84} x0={-800} x1={5200} />
        {/* peces entre los árboles */}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} opacity={ap(f, t4 - 30 + i * 6, 30)} filter="url(#contornoV)">
            <Pez x={2150 + i * 120 + ((f * (0.8 + azar(i) * 0.6)) % 300) * (i % 2 ? -1 : 1)} y={600 + azar(i + 4) * 150} s={0.7 + azar(i) * 0.4} voltear={i % 2 === 1} f={f} color={i % 3 === 0 ? C.purpura : C.negro} />
          </g>
        ))}
        {/* delfines que chocan contra el bosque */}
        {[[2560, 2700], [3080, 3260]].map(([x0, xt], i) => {
          const c = Math.abs(Math.sin((f + i * 30) / 22));
          return <g key={i} opacity={ap(f, t4 + 10 + i * 20, 25)} filter="url(#contornoV)"><Delfin x={x0 + (xt - x0 - 150) * c} y={640 + i * 40} s={0.85} rot={c > 0.97 ? -8 : Math.sin(f / 10) * 4} f={f} /></g>;
        })}
        {/* lobo y oveja nadando juntos */}
        {(() => {
          const o = ap(f, t5 - 20, 30), lx = 3300 + (f - t5) * 0.6, ox = 3560 + (f - t5) * 0.6;
          return (
            <g opacity={o}>
              <g opacity={0.35}>
                <Lobo x={lx} y={nivel + 80} s={1.15} fase={f * 0.2} nada contorno />
                <Oveja x={ox} y={nivel + 56} s={1.15} fase={f * 0.2} nada />
              </g>
              <MedioCuerpo id="nadanDil" corte={nivel + 8}>
                <Lobo x={lx} y={nivel + 80} s={1.15} fase={f * 0.2} nada contorno />
                <Oveja x={ox} y={nivel + 56} s={1.15} fase={f * 0.2} nada />
              </MedioCuerpo>
              <path d={`M${lx - 120} ${nivel + 6} q 30 -10 60 0 t 60 0 t 60 0 M${ox - 70} ${nivel + 6} q 30 -10 60 0 t 60 0`} stroke={C.crema} strokeWidth={3} fill="none" />
            </g>
          );
        })()}
        {/* aves sin dónde posarse */}
        {[3250, 3450, 3650, 3850].map((x, i) => {
          const tf = t5 + 30 + i * 22, kk = entre(f, tf, tf + 60, 0, 1, Easing.in(Easing.quad));
          const y0 = 250 + (i % 2) * 70;
          return kk < 1 ? <Ave key={x} x={x + Math.sin(f / 20 + i) * 30 + kk * 60} y={y0 + (nivel - y0) * kk} s={0.9} f={f + i * 7} caida={kk} /> : <Sonido key={x} x={x + 60} y={nivel + 10} f={f} ang={-90} o={1 - ap(f, tf + 60, 30)} />;
        })}
        {/* restos flotando */}
        {[1300, 1700, 2900].map((x, i) => <rect key={x} x={x + Math.sin(f / 30 + i) * 30} y={nivel - 4 + Math.sin(f / 12 + i) * 4} width={90} height={10} fill={C.negro} opacity={ap(f, t3, 30)} transform={`rotate(${Math.sin(f / 15 + i) * 6} ${x} ${nivel})`} />)}
      </Capa>
      <Lluvia f={f} o={ap(f, t1 + 20, 30)} area={[-300, 120, 2600, 760]} n={220} />
      <Relampago a={[1200, 130]} b={[1080, 620]} f={f} desde={t1 + 10} />
      <Relampago a={[480, 130]} b={[640, 650]} f={f} desde={t1 + 60} />
      <Relampago a={[1500, 130]} b={[1300, 560]} f={f} desde={t2 + 8} />
      <Relampago a={[700, 130]} b={[900, 520]} f={f} desde={t3 + 30} />
      <Relampago a={[1400, 130]} b={[1500, 480]} f={f} desde={t4 + 70} />
      <Relampago a={[400, 130]} b={[300, 500]} f={f} desde={t5 + 40} />
      <Velo o={flash * 0.3} color={C.blanco} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · El arcón de Deucalión
const Parnaso: React.FC<{ x: number; dy?: number; color?: string }> = ({ x, dy = 0, color = C.negro }) => (
  <g transform={`translate(${x} ${dy})`}>
    <path d="M-420 1000 L-420 760 C -300 690, -180 600, -100 530 C -60 500, -30 540, 0 560 C 40 556, 70 500, 110 500 C 190 520, 320 660, 450 1000 Z" fill={color} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 2 + r }, (_, i) => {
      const cx = -120 + i * 70 - r * 30, cy = 600 + r * 50;
      return <path key={`${r}-${i}`} d={`M${cx - 20} ${cy} a 20 14 0 0 1 40 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.4} />;
    }))}
  </g>
);
const ArconE: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -100, 1.05], [t1, 150, 1], [t2, 420, 1.04], [t3 - 20, 560, 1], [t4, 2330, 1], [dur, 2420, 1.06]];
  const promO = 1 - ap(f, t2 + 30, 30);
  const deu = f < t1 + 40 ? { x: 780, accion: 'parado' as Accion } : f < t2 + 140 ? andar(f, t1 + 40, t1 + 80, 780, 1340) : andar(f, t2 + 140, t2 + 175, 1340, 1180);
  const martilla = f > t1 + 80 && f < t2 + 40;
  const pirO = ap(f, t2 - 5, 15);
  const pir = f < t2 + 140 ? andar(f, t2, t2 + 70, 1850, 1450) : andar(f, t2 + 140, t2 + 175, 1450, 1250);
  const dentro = ap(f, t2 + 170, 15);
  const tapa = entre(f, t2 + 120, t2 + 140, 0, 1) - entre(f, t2 + 190, t2 + 210, 0, 1);
  const nivel = entre(f, t2 + 160, t3 + 20, SUELO + 40, 640);
  const ax = entre(f, t3, t4 + 50, 1120, 3330);
  const flota = f > t2 + 200 && f < t4 + 50;
  const ay = f < t4 + 50 ? Math.min(SUELO, nivel + 40) + (flota ? Math.sin(f / 12) * 6 : 0) : entre(f, t4 + 50, t4 + 70, nivel + 40, 564);
  const ar = flota ? Math.sin(f / 14) * 5 : 0;
  // días y noches
  const per = (t4 - t3) / 4.5;
  const noche = f > t3 && f < t4 ? 0.5 - 0.5 * Math.cos(((f - t3) / per) * Math.PI * 2) : 0;
  const dia = f < t3 ? 0 : Math.min(10, 1 + Math.floor(((f - t3) / (t4 - t3)) * 9));
  const sube = entre(f, t4 - 60, t4 + 20, 160, 0, Easing.out(Easing.cubic));
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}>
        <Sol x={1500} y={270} r={48} f={f} />
      </Capa>
      <Capa p={0.05}>
        <g opacity={noche}><Luna x={500} y={250} /><Estrellas n={30} f={f} area={[0, 140, 1920, 300]} /></g>
      </Capa>
      <Velo o={entre(f, t2 + 80, t2 + 160, 0, 0.3) * (f < t3 + 30 ? 1 : 1 - ap(f, t3 + 30, 40))} color="#2A1A14" />
      <Capa p={0.3}>
        <Monte x={200} ancho={500} alto={320} />
        <Monte x={900} ancho={560} alto={380} />
        <Agua nivel={entre(f, t2 + 160, t3 + 40, SUELO + 60, 600)} f={f * 0.5} color={MAR_OSC} o={0.85} x0={-600} x1={3200} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={150} y={SUELO - 20} s={0.8} f={f} color={C.barroOscuro} />
        <Casa x={560} y={SUELO - 20} s={0.8} color={C.barroOscuro} />
        <Cipres x={1600} y={SUELO - 20} s={0.8} f={f} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={2400} />
        {/* tablones apilados */}
        {[0, 1, 2, 3].map((i) => <rect key={i} x={1480 + i * 8} y={SUELO - 16 - i * 16} width={220 - i * 20} height={14} fill={C.negro} stroke={C.barroOscuro} strokeWidth={1.5} opacity={1 - ap(f, t1 + 80 + i * 30, 20)} />)}
        <Parnaso x={3330} dy={sube} />
        {/* Prometeo y su visión */}
        <circle cx={400} cy={SUELO - 360} r={150} fill="url(#haloBlanco)" opacity={promO * (0.35 + Math.sin(f / 8) * 0.1)} />
        <Personaje x={380} barba capa={C.purpura} brazo={habla(f, t1, t1 + 120) || (f > t1 && f < t1 + 120) ? [100, -10] : [40, 30]} ojosCerrados={f < t1 - 30} cabeza={f < t1 - 30 ? 12 : 0} boca={habla(f, t1, t1 + 120)} opacity={promO} />
        <Rotulo x={380} y={SUELO - 440} texto="PROMETEO" o={vida(f, t0 + 10, t1 + 20) * promO} />
        <g opacity={vida(f, t0 + 95, t1 + 40, 20)}>
          <defs><clipPath id="visionP"><circle cx={660} cy={330} r={90} /></clipPath></defs>
          <circle cx={660} cy={330} r={96} fill={C.crema} stroke={C.negro} strokeWidth={4} />
          <g clipPath="url(#visionP)">
            <Agua nivel={330} f={f * 2} alto={18} x0={540} x1={780} o={1} fondo={430} />
            <Lluvia f={f} area={[560, 240, 220, 90]} n={16} o={0.8} />
          </g>
          {[[530, 410, 10], [490, 440, 7]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.crema} stroke={C.negro} strokeWidth={3} />)}
        </g>
        {/* el arcón */}
        <Arcon x={ax} y={ay} s={0.8} rot={ar} armado={entre(f, t1 + 80, t2 + 30, 0, 1, lin)} tapa={tapa} />
        {martilla && [0, 1, 2].map((i) => {
          const e = (f * 0.35 + i * 2) % 6.28;
          return e < 1 ? <path key={i} d={`M${1210 + i * 10} ${SUELO - 120 - i * 20} l ${-10 - i * 6} ${-12}`} stroke={C.crema} strokeWidth={3} strokeLinecap="round" /> : null;
        })}
        <Personaje x={deu.x} accion={deu.accion} voltear contorno={f > t2 + 80} barba objeto={martilla ? 'martillo' : null}
          brazo={martilla ? [110 + Math.sin(f * 0.35) * 45, 10] : f < t1 + 40 ? [40, 30] : [60, 20]} inclinar={martilla ? 10 : 0} opacity={1 - dentro} />
        <Personaje x={pir.x} accion={pir.accion} voltear mujer tocado="velo" opacity={(1 - dentro) * pirO} />
        <Rotulo x={deu.x} y={SUELO - 440} texto="DEUCALIÓN" o={vida(f, t1 + 20, t2 + 100) * (1 - dentro)} />
        <Rotulo x={pir.x} y={SUELO - 420} texto="PIRRA" o={vida(f, t2 + 50, t2 + 160) * (1 - dentro)} />
        <Agua nivel={nivel} f={f} o={0.86} x0={-800} x1={4200} />
        <Rotulo x={3330} y={370} texto="MONTE PARNASO" o={ap(f, t4 + 30, 25)} />
      </Capa>
      <Lluvia f={f} o={vida(f, t2 + 90, t3 + 160, 30)} area={[-300, 120, 2600, 760]} n={180} />
      <Velo o={noche * 0.45} color="#140A06" />
      <Marcas x={110} y={300} n={Math.min(9, dia)} o={vida(f, t3 + 5, t4 + 40)} />
      <Rotulo x={230} y={232} texto={dia >= 10 ? 'DÍA 10' : `DÍA ${Math.max(1, dia)}`} o={vida(f, t3 + 5, t4 + 90)} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · El monte Parnaso
const MonteP: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 0.96], [t1, 0, 1], [t2, -120, 1], [t3, 60, 0.96], [t4, 0, 1], [dur, 30, 1.14]];
  const nivel = entre(f, t3, t4 + 20, 650, SUELO + 30);
  const abre = entre(f, t1, t1 + 90, 0, 1);
  const llora = f > t4;
  const sopla = f > t2 + 60 && f < t3 + 60;
  const trO = Math.min(ap(f, t2 + 30, 25), 1 - ap(f, t3 + 50, 30));
  const posO = 1 - ap(f, t3 + 60, 30);
  const deja = entre(f, t2 + 10, t2 + 40, 0, 1);
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.05}>
        <Sol x={1320} y={250} r={50} f={f} />
      </Capa>
      <Velo o={0.45 * (1 - abre)} color="#2A1A14" />
      <Capa p={0.15}>
        <circle cx={1560} cy={380} r={260} fill="url(#halo)" opacity={0.3 * vida(f, 0, t1 + 60, 30)} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={1560} y={560} s={0.95} voltear barba tocado="corona" capa={C.purpura} contorno cabeza={-16} brazo={f > t1 ? [130, 20] : [40, 30]} opacity={vida(f, 0, t2 + 20, 30)} />
        <Nube x={1540} y={590} s={1.2} f={f} color="#3A2A26" />
        <Rotulo x={1560} y={190} texto="ZEUS" o={vida(f, t0 + 10, t1 + 20)} />
        {[[200, 280], [700, 230], [1180, 290], [1700, 560], [1400, 600], [2000, 520]].map(([x, y], i) => (
          <Nube key={i} x={x + (x < 960 ? -1 : 1) * abre * 700} y={y} s={1.1 + (i % 2) * 0.3} color={i % 2 ? MAR_OSC : '#3A2A26'} f={f + i * 10} />
        ))}
      </Capa>
      <Capa p={0.35}>
        <Colina x={300} ancho={500} alto={300} color="#7A3A1C" />
        <Colina x={1650} ancho={600} alto={340} color="#7A3A1C" />
        {[150, 420, 1500, 1800].map((x, i) => <Olivo key={x} x={x} y={SUELO - 150 - (i % 2) * 30} s={0.5} f={f} color={C.barroOscuro} />)}
        <Agua nivel={entre(f, t3, t4 + 40, 560, SUELO + 40)} f={f * 0.5} color={MAR_OSC} o={0.85} x0={-600} x1={2600} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={2600} />
        <Colina x={-150} ancho={420} alto={220} color={C.negro} />
        <Colina x={2050} ancho={420} alto={200} color={C.negro} />
        {[-260, 2160].map((x) => <Olivo key={x} x={x} y={SUELO - 120} s={0.8} f={f} />)}
        <Barro x0={-400} x1={2400} o={ap(f, t4 - 40, 40)} />
        {/* el monte */}
        <path d="M200 1000 C 380 820, 560 660, 700 580 C 740 556, 770 600, 800 604 L 1160 604 C 1280 620, 1450 800, 1700 1000 Z" fill={C.negro} />
        <path d="M640 620 C 690 560, 740 520, 760 540 L 800 604" fill={C.negro} />
        {Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 + r * 2 }, (_, i) => {
          const cx = 980 - (r * 90) + i * 90, cy = 660 + r * 50;
          return <path key={`${r}-${i}`} d={`M${cx - 22} ${cy} a 22 14 0 0 1 44 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
        }))}
        <Arcon x={1100} y={604} s={0.62} tapa={0.75} />
        {/* Deucalión y Pirra */}
        <Personaje x={850} y={604} s={0.9} barba contorno brazo={llora ? [100, 130] : f > t1 + 10 && f < t2 ? [150, 0] : [40, 30]} cabeza={llora ? -18 : f > t1 && f < t2 ? 16 : 0} inclinar={llora ? 10 : 0} ojosCerrados={llora} />
        <Personaje x={1020} y={604} s={0.86} mujer tocado="velo" brazo={llora ? [100, 130] : [40, 30]} cabeza={llora ? -18 : f > t1 && f < t2 ? 16 : 0} inclinar={llora ? 12 : 0} ojosCerrados={llora} />
        {llora && [0, 1].map((i) => <circle key={i} cx={(i ? 1010 : 880) + 6} cy={604 - 280 + ((f * 2 + i * 20) % 50)} r={3} fill={C.blanco} opacity={0.8} />)}
        {/* Poseidón deja su tridente */}
        <Personaje x={300} s={1.3} contorno barba canas capa={MAR} objeto={deja < 1 ? 'tridente' : null} brazo={[60 - deja * 40, 30 - deja * 20]} opacity={posO} />
        {deja >= 1 && <path d={`M150 ${nivel - 4} L 470 ${nivel - 18}`} stroke={C.negro} strokeWidth={9} opacity={posO} />}
        <Rotulo x={300} y={SUELO - 560} texto="POSEIDÓN" o={vida(f, t2, t3) * posO} />
        <Agua nivel={nivel} f={f} o={0.86} x0={-800} x1={2800} />
        {/* Tritón */}
        <g opacity={trO}>
          <Triton id="tritonP" x={1520} y={nivel + 12 + (1 - ap(f, t2 + 30, 30)) * 120} s={0.95} voltear f={f} sopla={sopla} />
        </g>
        <Rotulo x={1520} y={nivel - 330} texto="TRITÓN" o={vida(f, t2 + 50, t3 + 40) * trO} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · El oráculo de Temis
const PIEDRAS_O: [number, number][] = [[260, 0.8], [420, 1.1], [560, 0.7], [700, 1], [930, 0.9], [1580, 1.1], [1720, 0.8]];
const Oraculo: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -320, 1], [t0 + 110, 150, 1], [t1, 330, 1.06], [t2, 200, 1.1], [t3, 120, 1.03], [dur, 60, 1.08]];
  const d = andar(f, 0, t0 + 100, -250, 840);
  const p = f < t2 ? andar(f, 0, t0 + 110, -420, 700) : andar(f, t2 + 5, t2 + 30, 700, 590);
  const reza = entre(f, t0 + 120, t0 + 145, 0, 1) - entre(f, t2 - 10, t2 + 10, 0, 1) * 0;
  const pirraAsustada = f > t2 && f < t3 + 80;
  const deuSeLevanta = f > t3 - 10;
  const reD = deuSeLevanta ? 0 : reza;
  const reP = f > t2 ? 0 : reza;
  const tO = ap(f, t1 - 15, 30);
  const tMano = manoDe({ x: 1250, y: SUELO - 22, voltear: true, brazo: [90, -10] });
  const tCab = cabezaDe(1250, 1, true, SUELO - 22);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}>
        <Sol x={1500} y={300} r={46} f={f} />
        <Nube x={500} y={240} s={0.6} f={f} />
      </Capa>
      <Capa p={0.25}>
        <Monte x={1500} ancho={650} alto={480} />
        <Monte x={300} ancho={500} alto={300} color="#7A3A1C" />
      </Capa>
      <Capa p={0.4}>
        {/* Gea, la gran madre, asoma en los cerros */}
        <g opacity={ap(f, t3 + 20, 40) * 0.6}>
          <MedioCuerpo id="geaOr" corte={SUELO - 140}>
            <Personaje x={170} y={SUELO - 140 + 176 * 1.5} s={1.5} mujer piel={C.barroClaro} tocado="corona" brazo={[60, 60]} ojosCerrados />
          </MedioCuerpo>
          <Rotulo x={210} y={SUELO - 700} texto="GEA · LA TIERRA" tam={28} o={ap(f, t3 + 50, 25)} />
        </g>
        <Colina x={200} ancho={700} alto={170} base={SUELO - 60} color={C.barroOscuro} />
        <Colina x={1400} ancho={600} alto={150} base={SUELO - 60} color={C.barroOscuro} />
      </Capa>
      <Capa p={0.65}>
        {[-200, 100, 2000, 2250].map((x, i) => <Olivo key={x} x={x} y={SUELO - 30} s={0.7} f={f + i * 20} color={C.barroOscuro} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={2800} />
        <Barro x0={-700} x1={2600} />
        {/* templo de Temis, cubierto de musgo y sin fuego en el altar */}
        <circle cx={1250} cy={SUELO - 260} r={420} fill="url(#haloBlanco)" opacity={tO * 0.35} />
        <Templo x={1250} y={SUELO} s={1.45} />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={1250 - 220 + azar(i) * 440} cy={SUELO - 30 - azar(i + 5) * 250} r={4 + azar(i + 9) * 4} fill="#5B6B3A" opacity={0.8} />)}
        <rect x={980} y={SUELO - 70} width={70} height={70} fill={C.negro} />
        <rect x={970} y={SUELO - 80} width={90} height={12} fill={C.negro} />
        <Humo x={1015} y={SUELO - 90} f={f} o={0.2} color={C.crema} alto={60} n={3} s={0.5} />
        {PIEDRAS_O.map(([x, s], i) => <Piedra key={i} x={x} s={s} brillo={ap(f, t3 + 30 + i * 6, 20) * (0.6 + Math.sin(f / 7 + i) * 0.2)} />)}
        {/* Temis */}
        <g opacity={tO}>
          <Personaje x={1250} y={SUELO - 22} voltear mujer tocado="corona" ropa="larga" capa={C.purpura} brazo={[90, -10]} boca={habla(f, t1, fin(1))} />
          <Balanza x={tMano[0]} y={tMano[1]} f={f} />
          <Sonido x={tCab[0] - 50} y={tCab[1] + 14} f={f} ang={180} o={vida(f, t1, fin(1))} />
        </g>
        <Rotulo x={1250} y={SUELO - 460} texto="TEMIS" o={vida(f, t1, t2 + 20) * tO} />
        {/* Deucalión y Pirra */}
        <Personaje x={p.x} accion={p.accion} mujer tocado="velo" voltear={pirraAsustada} inclinar={reP * 15} brazo={pirraAsustada ? [150, 60] : [20 + reP * 130, 15]} boca={pirraAsustada && f < t3} />
        <Personaje x={d.x} accion={d.accion} barba voltear={f > t3 + 5 && f < t3 + 120} inclinar={reD * 15} brazo={f > t3 + 30 ? [45, 0] : [20 + reD * 130, 15]} boca={habla(f, t3, fin(3))} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · Las piedras que caminan
type Tiro = { quien: 'D' | 'P'; t: number };
const Piedras: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t0 + 150, 450, 1], [t1, 330, 0.95], [t2, 420, 1], [t3, 520, 0.95], [t4, 820, 1.05], [dur, 880, 1.1]];
  const dx = (fr: number) => entre(fr, 0, t1 + 20, 260, 1460, lin);
  const caminan = f < t1 + 20;
  const tiros: Tiro[] = [0, 45, 90, 130].flatMap((d, i) => [{ quien: 'D' as const, t: t0 + d }, { quien: 'P' as const, t: t0 + 22 + i * 44 }]).sort((a, b) => a.t - b.t);
  const lanza = (q: 'D' | 'P') => {
    const ts = tiros.filter((x) => x.quien === q).map((x) => x.t);
    const p = Math.max(0, ...ts.map((T) => entre(f, T - 12, T, 0, 1) - entre(f, T + 4, T + 22, 0, 1)));
    return [20 + p * 195, 20 - p * 40] as [number, number];
  };
  const xD = dx(f) + entre(f, t4 - 10, t4 + 20, 0, 110), xP = dx(f) - 160;
  const bebe = f > t4 + 10;
  const brazoP: [number, number] = bebe ? [40, 80] : lanza('P');
  const manoP = manoDe({ x: xP, brazo: brazoP });
  const objetos: Objeto[] = ['martillo', 'lanza', null, 'martillo'];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}>
        <Sol x={1400} y={260} r={52} f={f} />
        <Nube x={400} y={230} s={0.6} f={f} />
      </Capa>
      <Capa p={0.25}>
        <Monte x={200} ancho={600} alto={420} />
        <Templo x={200} y={SUELO - 420} s={0.35} />
        <Monte x={1300} ancho={500} alto={300} color="#7A3A1C" />
      </Capa>
      <Capa p={0.6}>
        {[300, 900, 1500, 2100].map((x, i) => (i % 2 ? <Cipres key={x} x={x} y={SUELO - 30} s={0.7} f={f} color={C.barroOscuro} /> : <Olivo key={x} x={x} y={SUELO - 30} s={0.65} f={f + i * 9} color={C.barroOscuro} />))}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={3200} />
        <Barro x0={-500} x1={3000} o={0.6} />
        {/* piedras lanzadas que se vuelven personas */}
        {tiros.map((tr, j) => {
          const x0 = tr.quien === 'D' ? dx(tr.t) : dx(tr.t) - 160;
          const xl = x0 - 260 - (j % 3) * 30;
          const k = entre(f, tr.t, tr.t + 26, 0, 1, lin);
          if (k <= 0) return null;
          const h: P = manoDe({ x: x0, brazo: [215, -20] });
          const sx = h[0] + (xl - h[0]) * k, sy = h[1] + (SUELO - h[1]) * k - 220 * 4 * k * (1 - k);
          const g = entre(f, t1 + j * 12, t1 + 70 + j * 12, 0, 1);
          const mujer = tr.quien === 'P';
          const piel = interpolateColors(entre(f, t2 + j * 6, t2 + 50 + j * 6, 0, 1, lin), [0, 1], [PIEDRA, mujer ? C.blanco : C.negro]);
          const n = Math.floor(j / 2);
          const ox = entre(f, t3 + 20 + j * 8, t4 + 60 + j * 8, 0, -1300, lin);
          const anda = f > t3 + 20 + j * 8 && f < t4 + 60 + j * 8;
          return (
            <g key={j}>
              <Piedra x={sx} y={sy} s={0.9} rot={k * 300} o={1 - g} />
              {g > 0 && (
                <Personaje x={xl + ox} voltear={f > t3 + 20 + j * 8} s={0.3 + 0.62 * g} mujer={mujer} piel={piel} barba={!mujer && n % 2 === 0} tocado={mujer ? 'diadema' : n % 2 ? 'cinta' : null}
                  ojosCerrados={f < t2 + 30} cabeza={f < t2 + 30 ? -10 : 0} opacity={Math.min(1, g * 3)} accion={anda ? 'caminar' : 'parado'}
                  objeto={f > t3 ? (mujer ? (n % 2 ? 'copa' : null) : objetos[n]) : null} brazo={f > t3 ? [50, 40] : [20, 20]} />
              )}
            </g>
          );
        })}
        {/* Deucalión y Pirra, con la cabeza cubierta */}
        <Personaje x={xP} accion={caminan ? 'caminar' : 'parado'} mujer tocado="velo" brazo={brazoP} />
        {bebe && <Bebe x={manoP[0] - 10} y={manoP[1] - 20} s={0.9} />}
        <Personaje x={xD} accion={caminan ? 'caminar' : 'parado'} barba tocado="velo" brazo={lanza('D')} voltear={bebe} />
        <Rotulo x={manoP[0]} y={manoP[1] - 170} texto="HELÉN" o={ap(f, t4 + 30, 20)} />
      </Capa>
      <Rotulo x={960} y={250} texto="HELENOS" tam={58} color={C.oro} o={ap(f, t4 + 90, 25)} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · Un mundo nuevo
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1], [t1, 700, 1], [t2, 1500, 1], [t3, 2250, 0.95], [dur, 2350, 1]];
  const noche = entre(f, t1 - 20, t2, 0, 0.5);
  const geaY = SUELO + 176 * 1.7 + (1 - entre(f, t2 - 20, t2 + 60, 0, 1, Easing.out(Easing.cubic))) * 620;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}>
        <g opacity={1 - Math.min(1, noche * 2)}><Sol x={700} y={280 + noche * 300} r={52} f={f} /></g>
      </Capa>
      <Capa p={0.05}>
        <g opacity={noche * 2}><Estrellas n={40} f={f} area={[0, 140, 2200, 300]} /><Luna x={1700} y={240} /></g>
      </Capa>
      <Velo o={noche} color="#1A0C06" />
      <Capa p={0.3}>
        <Monte x={2300} ancho={600} alto={420} color="#4A2414" o={0.95} templo />
        <circle cx={2300} cy={SUELO - 440} r={160} fill="url(#halo)" opacity={0.5 * ap(f, t2, 30)} style={{ mixBlendMode: 'screen' }} />
        <Rotulo x={2300} y={SUELO - 590} texto="OLIMPO" tam={28} o={ap(f, t3 - 20, 25)} />
      </Capa>
      <Capa p={0.5}>
        {/* el Tártaro: los Titanes encadenados dentro de la montaña */}
        <Monte x={1000} ancho={560} alto={420} color="#2A120A" o={1} />
        <ellipse cx={1000} cy={SUELO - 120} rx={210} ry={130} fill={C.noche} stroke={C.purpura} strokeWidth={6} />
        <ellipse cx={1000} cy={SUELO - 110} rx={180} ry={110} fill="url(#halo)" opacity={0.35} />
        {[910, 1000, 1090].map((x, i) => (
          <g key={x}>
            <Cadena a={manoDe({ x, y: SUELO - 22, s: 0.42, brazo: [150, 20] })} b={[x + 40, SUELO - 240]} />
            <Personaje x={x} y={SUELO - 22} s={0.42} gigante contorno ropa="desnudo" barba brazo={[150, 20]} cabeza={-10 + Math.sin(f / 15 + i) * 6} />
          </g>
        ))}
        <Rotulo x={1000} y={SUELO - 300} texto="TITANES" tam={26} o={vida(f, t1 + 20, t2 + 40)} />
        {/* los gigantes en marcha */}
        {[1900, 2050, 2200].map((x, i) => (
          <Personaje key={x} x={x + entre(f, t2 + 40, dur, 0, 220, lin)} y={SUELO - 30} s={0.75} gigante contorno ropa="desnudo" barba accion={f > t2 + 40 ? 'caminar' : 'parado'} brazo={[120 + i * 10, 20]} opacity={ap(f, t2 + 30 + i * 15, 30) * 0.95} />
        ))}
      </Capa>
      <Capa p={0.65}>
        {[200, 700, 1300, 1900, 2600].map((x, i) => <Olivo key={x} x={x} y={SUELO - 20} s={0.7} f={f + i * 10} color={C.barroOscuro} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-500} hasta={5200} />
        {/* la nueva humanidad en camino */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Personaje key={i} x={140 + i * 150 + f * 2.2} accion="caminar" mujer={i % 2 === 1} barba={i !== 4} fase={f * 0.2 + i}
            objeto={(['lanza', null, 'martillo', 'copa', null] as Objeto[])[i]} brazo={[50, 40]} contorno={noche > 0.2 && i % 2 === 0} />
        ))}
        {/* Gea se alza */}
        <circle cx={2620} cy={SUELO - 300} r={340} fill="url(#halo)" opacity={0.35 * ap(f, t2, 40)} style={{ mixBlendMode: 'screen' }} />
        <MedioCuerpo id="geaC" corte={SUELO}>
          <Personaje x={2620} y={geaY} s={1.7} mujer tocado="corona" brazo={[entre(f, t2 + 40, t2 + 70, 60, 160), 10]} boca={habla(f, t2 + 20, t3 + 20)} />
        </MedioCuerpo>
        <path d={`M2370 ${SUELO} q 60 -20 120 -6 q 60 -24 120 0 q 60 -18 120 4`} stroke={C.purpura} strokeWidth={6} fill="none" opacity={ap(f, t2, 20)} />
        <Rotulo x={2630} y={SUELO - 620} texto="GEA" o={vida(f, t2 + 30, dur - 10) * (1 - ap(f, t3, 15))} />
      </Capa>
      <Rotulo x={960} y={250} texto="LA GIGANTOMAQUIA" tam={60} color={C.oro} o={ap(f, t3 + 10, 30)} />
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  hierro: Hierro,
  licaon: Licaon,
  lobo: ReyLobo,
  decision: Decision,
  diluvio: Diluvio,
  arcon: ArconE,
  parnaso: MonteP,
  oraculo: Oraculo,
  piedras: Piedras,
  cierre: Cierre,
};
