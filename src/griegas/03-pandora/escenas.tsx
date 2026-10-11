// Escenas del video 03 · Pandora y la caja (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Olas, Nube, Relampago, Suelo, Rotulo,
  suave, desde, Inc, Borde, ap, entre, azar, Accion,
} from '../../comun/vasija';
import {
  PLATA, BRONCE, HIERRO, manoDe, cabezaDe, cuelloDe, Pithos, Anforita, Caja, Yunque, Horno, Hidria, Collar, CoronaFlores, Mal, Elpis, Roca, Cadena, Aguila,
  Casa, Columna, Hoguera, Buey, Arado, Balanza, Barro, Rayos, PolvoOro, Remolino, Lampara, Tumba, Medallon, Destello,
} from './piezas';

type Cam = [number, number, number][];
const lin = Easing.linear;
/** Desplazamiento a pie entre dos frames: posición y acción (camina mientras se mueve). */
const andar = (f: number, a: number, b: number, x0: number, x1: number, corre = false) => ({
  x: entre(f, a, b, x0, x1, lin),
  accion: (f > a && f < b ? (corre ? 'correr' : 'caminar') : 'parado') as Accion,
});
/** Aparece y se va: 0→1 en `a`, 1→0 en `b`. */
const vida = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
const habla = (f: number, a: number, b: number) => f > a && f < b && Math.floor(f / 5) % 2 === 0;

// ---------------------------------------------------------------- 1 · La furia de Zeus
const Furia: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -60, 1.08], [t1 - 10, 0, 1.03], [t1 + 80, 1180, 1], [t3, 1220, 1.03], [dur, 1300, 1.12]];
  // Prometeo encadenado
  const px = 470, ps = 1.05, lucha = Math.sin(f / 9) * 4;
  const manoP = manoDe({ x: px, s: ps, brazo: [160, 8], inclinar: lucha });
  const cT = desde([-4, -292], -158, 66), mT = desde(cT, -158 - 30 + 40, 60);
  const manoPT: P = [px + mT[0] * ps, SUELO + mT[1] * ps];
  // Zeus
  const zx = 2330, zs = 1.12;
  const brazoZ: [number, number] = [entre(f, t3 + 20, t3 + 50, 55, 150), entre(f, t3 + 20, t3 + 50, 45, 10)];
  const manoZ = manoDe({ x: zx, s: zs, voltear: true, brazo: brazoZ });
  const aguilaA = f / 34;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={60} f={f} area={[-100, 140, 2400, 360]} />
        <Luna x={1560} y={230} />
      </Capa>
      <Capa p={0.18}>
        <Nube x={300 + f * 0.2} y={260} s={0.6} color="#5A2A1C" f={f} />
        <Nube x={1500 - f * 0.15} y={210} s={0.8} color="#5A2A1C" f={f} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={250} ancho={520} alto={430} color="#2A120A" o={0.9} />
        <Monte x={820} ancho={420} alto={330} color="#2A120A" o={0.9} />
        <Monte x={1650} ancho={620} alto={560} color="#3A1A0C" o={0.95} />
      </Capa>
      {/* valle de los humanos con sus hogueras */}
      <Capa p={0.5}>
        <path d="M200 1000 L200 690 C 420 640, 640 700, 860 660 C 1080 620, 1300 690, 1560 650 C 1700 630, 1800 660, 1900 650 L1900 1000 Z" fill="#2A120A" />
        <path d="M200 1000 L200 740 C 500 720, 800 760, 1100 730 C 1400 700, 1600 750, 1900 720 L1900 1000 Z" fill={C.negro} opacity={0.8} />
        {[[720, 708], [900, 690], [1030, 730], [1180, 705], [1320, 725], [1450, 700], [1560, 740]].map(([x, y], i) => {
          const o = ap(f, t2 + i * 9, 20);
          return (
            <g key={i}>
              <Hoguera x={x} y={y} s={0.32} f={f} o={o} />
              <g opacity={o}><Personaje x={x + 28} y={y + 4} s={0.12} contorno brazo={[60 + Math.sin(f / 8 + i) * 20, 30]} voltear={i % 2 === 0} /></g>
            </g>
          );
        })}
        <Templo x={1980} y={SUELO - 150} s={1.15} />
        <path d={`M1660 ${SUELO + 20} L1680 ${SUELO - 120} L1730 ${SUELO - 150} L2240 ${SUELO - 150} L2280 ${SUELO - 110} L2300 ${SUELO + 20} Z`} fill={C.negro} />
        {[1760, 1880, 2000, 2120].map((x) => <path key={x} d={`M${x} ${SUELO - 110} a 40 22 0 0 1 80 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />)}
      </Capa>
      <Capa p={1}>
        {/* Cáucaso */}
        <Suelo desde={-500} hasta={950} />
        <Roca x={px - 10} s={1.15} />
        <Cadena a={manoP} b={[px - 10 + 90 * 1.15, SUELO - 330 * 1.15]} />
        <Cadena a={manoPT} b={[px - 10 - 90 * 1.15, SUELO - 330 * 1.15]} />
        <Personaje x={px} s={ps} contorno barba capa={null} ropa="corta" brazo={[160, 8]} brazoAtras={[-158, -30]} inclinar={lucha} cabeza={Math.sin(f / 13) * 8} boca={Math.sin(f / 11) > 0.6} />
        <Aguila x={px + Math.cos(aguilaA) * 260} y={300 + Math.sin(aguilaA) * 60} s={0.9} f={f} dir={-Math.sin(aguilaA) > 0 ? 1 : -1} />
        <Rotulo x={px} y={SUELO - 470} texto="PROMETEO" o={vida(f, 20, t1 + 20)} />
        {/* cumbre del Olimpo */}
        <Suelo desde={1900} hasta={4200} />
        <path d="M1900 790 L1930 740 L1990 760 L2050 730 L2120 790 Z" fill={C.negro} />
        <circle cx={zx} cy={SUELO - 200} r={340} fill="url(#halo)" opacity={0.25 + ap(f, t2, 60) * 0.3 + (habla(f, t3, fin(3)) ? 0.05 : 0)} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={zx} s={zs} voltear contorno barba tocado="corona" capa={C.purpura} objeto="rayo" brazo={brazoZ} cabeza={f > t2 && f < t3 + 20 ? -12 : 2} boca={habla(f, t3 + 10, fin(3))} />
        <Rotulo x={zx} y={SUELO - 490} texto="ZEUS" o={vida(f, t1 + 60, t2 + 60)} />
        <Relampago a={[manoZ[0], manoZ[1] - 120]} b={[1660, 700]} f={f} desde={t2 + 90} />
        <Relampago a={[manoZ[0] - 20, 140]} b={[manoZ[0] - 10, manoZ[1] - 140]} f={f} desde={t3 + 50} dur={18} />
        <Relampago a={[2700, 130]} b={[2600, 600]} f={f} desde={t3 + 130} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · La fragua de Hefesto
const Fragua: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t1, 120, 1.02], [t2, 300, 1.12], [t4, 340, 1.24], [dur, 350, 1.28]];
  const zeus = andar(f, 0, 70, -180, 400);
  const zeusO = 1 - ap(f, t2 - 10, 30);
  const hs = 1.1;
  const mira = f > t1 + 10; // Hefesto se da vuelta hacia el barro
  const hx = entre(f, at(4) + 20, at(4) + 60, 1070, 990);
  const atras = f > t4 + 20;
  const brazoH: [number, number] = f < t1 + 10 ? [40, 30]
    : f < t2 ? [110, -10]
    : atras ? [entre(f, t4 + 20, t4 + 45, 95, 40), 40]
    : [95 + Math.sin(f * 0.25) * 25, 10 + Math.sin(f * 0.25 + 1) * 15];
  const manoH = manoDe({ x: hx, s: hs, voltear: !mira, brazo: brazoH, inclinar: mira && f > t2 && f < t4 + 30 ? 8 : 0 });
  const vierte = f > t1 + 40 && f < t2 + 10;
  const barroT = entre(f, t1 + 40, t2, 0.2, 1);
  const px = 1300, ps = 1.08;
  const sube = entre(f, t2 + 10, t3 - 10, 0, 1, Easing.out(Easing.cubic));
  const blanca = ap(f, t3 + 10, 70);
  const despierta = f > t4 + 40;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      {/* muro de la cueva */}
      <Capa p={0.3}>
        <path d="M-400 830 L-400 126 L2600 126 L2600 830 Z" fill="#2E140C" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${-300 + i * 330} 830 C ${-260 + i * 330} 500, ${-120 + i * 330} 380, ${0 + i * 330} 360 C ${120 + i * 330} 380, ${200 + i * 330} 600, ${230 + i * 330} 830 Z`} fill="#3E1C10" />
        ))}
        {[200, 620, 980].map((x, i) => (
          <g key={x} transform={`translate(${x} 300)`}>
            <path d="M0 0 L0 60" stroke={C.negro} strokeWidth={4} />
            {i === 0 && <path d="M-20 60 L0 140 L20 60 M-20 60 L20 60" stroke={C.negro} strokeWidth={8} fill="none" />}
            {i === 1 && <rect x={-30} y={60} width={60} height={26} fill={C.negro} />}
            {i === 2 && <path d="M0 60 L0 170 M-24 170 L24 170" stroke={C.negro} strokeWidth={8} />}
          </g>
        ))}
      </Capa>
      <Capa p={0.6}>
        {[150, 260, 2050, 2160].map((x, i) => <Anforita key={x} x={x} s={1.2 + (i % 2) * 0.2} color="#1E0E08" />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-500} hasta={3000} />
        <circle cx={1760} cy={SUELO - 120} r={520} fill="url(#halo)" opacity={0.35 + Math.sin(f / 6) * 0.05} style={{ mixBlendMode: 'screen' }} />
        <Horno x={1780} s={1.15} f={f} />
        <Chispas x={1780} y={SUELO - 100} f={f} n={30} viento={-0.8} />
        <Yunque x={1560} s={1.1} />
        <Personaje x={zeus.x} s={1.15} accion={zeus.accion} contorno barba tocado="corona" capa={C.purpura} objeto="cetro" brazo={f > t0 + 60 && f < t1 + 40 ? [92, 4] : [30, 30]} boca={habla(f, t0 + 10, t2 - 20)} opacity={zeusO} />
        <Rotulo x={zeus.x + 10} y={SUELO - 470} texto="ZEUS" o={vida(f, 40, t1) * zeusO} />
        {/* barro, agua y la figura que se levanta */}
        <Barro x={px} t={barroT * (1 - sube * 0.6)} />
        {vierte && (
          <path d={suave([[manoH[0] + 40, manoH[1] - 30], [manoH[0] + 70, manoH[1] + 40], [px + Math.sin(f / 3) * 3, SUELO - 20]])} stroke="#6E8CA0" strokeWidth={10} fill="none" strokeDasharray="20 8" strokeDashoffset={-f * 4} />
        )}
        <defs>
          <clipPath id="sube03">
            <rect x={px - 300} y={SUELO + 10 - 400 * ps * sube} width={600} height={400 * ps * sube + 10} />
          </clipPath>
        </defs>
        {sube > 0 && (
          <g clipPath="url(#sube03)">
            {blanca > 0 && <circle cx={px} cy={SUELO - 200} r={260} fill="url(#haloBlanco)" opacity={blanca * (despierta ? 0.9 : 0.5)} />}
            <Personaje x={px} s={ps} voltear mujer piel={C.barroOscuro} ojosCerrados brazo={[8, 12]} brazoAtras={[-6, -30]} opacity={1 - ap(f, t3 + 70, 20)} />
            {blanca > 0 && <Personaje x={px} s={ps} voltear mujer ojosCerrados={!despierta} brazo={despierta ? [entre(f, t4 + 40, t4 + 70, 8, 60), 30] : [8, 12]} brazoAtras={[-6, -30]} cabeza={despierta ? 6 : -4} opacity={blanca} />}
          </g>
        )}
        {[0, 1, 2, 3].map((i) => <Destello key={i} x={px + [-60, 50, -30, 70][i]} y={SUELO - [380, 300, 200, 420][i]} t={(f - (t4 + 30 + i * 12)) / 30} s={0.6} />)}
        <Personaje x={hx} s={hs} voltear={!mira} contorno barba objeto={f < t1 + 10 ? 'martillo' : null} brazo={brazoH} inclinar={mira && f > t2 && f < t4 + 30 ? 8 : 0} cabeza={mira && !atras ? -10 : 0} />
        {f > t1 + 10 && f < t2 + 20 && <Hidria x={manoH[0] + 10} y={manoH[1] + 30} s={0.9} rot={vierte ? 70 : 20} f={f} />}
        {f > t2 + 10 && f < t4 && <Chispas x={manoH[0] + 20} y={manoH[1]} f={f} n={10} viento={1} />}
        <Rotulo x={hx} y={SUELO - 480} texto="HEFESTO" o={vida(f, t0 + 30, t2)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · Los dones de los dioses
const Dones: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.12], [t1, -60, 1.04], [t2, 60, 1.04], [t3, 0, 1], [t4, 60, 1.04], [dur, 40, 1.12]];
  const px = 960, ps = 1.12;
  // Atenea (izquierda)
  const ate = f < t3 ? andar(f, t1 - 30, t1 + 40, -250, 650) : andar(f, t3, t3 + 50, 650, 220);
  const ateBrazo: [number, number] = f > t1 + 40 && f < t2 ? [86, 4] : [30, 20];
  const manoA = manoDe({ x: ate.x, s: 1.08, brazo: ateBrazo });
  // Afrodita (derecha)
  const afr = f < t3 + 50 ? andar(f, t2 - 30, t2 + 30, 2200, 1250) : andar(f, t3 + 50, t3 + 100, 1250, 1640);
  const afrBrazo: [number, number] = f > t2 + 30 && f < t3 + 40 ? [150, 30] : [30, 20];
  const manoAf = manoDe({ x: afr.x, s: 1.08, voltear: true, brazo: afrBrazo });
  // Gracias (izquierda) y Horas (derecha)
  const gra = f < t4 ? andar(f, t3 - 20, t3 + 40, -500, 620) : andar(f, t4, t4 + 40, 620, 560);
  const hor = f < t4 ? andar(f, t3 + 60, t3 + 110, 2400, 1300) : andar(f, t4 - 20, t4 + 40, 1300, 2500);
  // Hermes (entra corriendo desde la derecha)
  const her = andar(f, t4 + 20, t4 + 70, 2300, 1330, true);
  const capaOn = f > t1 + 70;
  const collar = ap(f, t3 + 50, 20), corona = ap(f, t3 + 120, 20);
  const cabP = cabezaDe(px, ps), cuello = cuelloDe(px, ps);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.1}><Sol x={1500} y={260} r={46} f={f} /></Capa>
      <Capa p={0.25}>
        <Monte x={420} ancho={600} alto={430} />
        <Monte x={1550} ancho={700} alto={500} />
        <Nube x={400} y={250} s={0.7} f={f} />
        <Nube x={1200} y={200} s={0.5} f={f + 60} />
      </Capa>
      <Capa p={0.55}>
        <Templo x={960} y={SUELO - 10} s={1.9} color="#6E2E12" />
        <Olivo x={-120} f={f} color={C.barroOscuro} s={1.1} />
        <Olivo x={2050} f={f + 20} color={C.barroOscuro} s={1.1} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3200} />
        <circle cx={px} cy={SUELO - 220} r={300} fill="url(#haloBlanco)" opacity={0.25 + collar * 0.1 + corona * 0.1} />
        {/* Pandora en el centro */}
        <Personaje x={px} s={ps} mujer tocado={null} capa={capaOn ? PLATA : null} brazo={f > t4 + 80 ? [50, 40] : [14, 20]} cabeza={f > t2 + 30 && f < t3 ? 10 : 0} boca={habla(f, t4 + 90, fin(4))} />
        <Collar x={cuello[0] + 4} y={cuello[1] + 2} s={ps} o={collar} />
        <CoronaFlores x={cabP[0] - 6} y={cabP[1] - 10} s={ps} o={corona} />
        {[0, 1, 2].map((i) => <Destello key={'c' + i} x={px - 40 + i * 30} y={SUELO - 300 + i * 20} t={(f - (t1 + 66 + i * 6)) / 26} s={0.7} />)}
        {[0, 1].map((i) => <Destello key={'k' + i} x={cuello[0] + i * 20} y={cuello[1] + 10} t={(f - (t3 + 48 + i * 6)) / 24} s={0.6} />)}
        {[0, 1, 2].map((i) => <Destello key={'r' + i} x={cabP[0] - 30 + i * 30} y={cabP[1] - 40} t={(f - (t3 + 118 + i * 6)) / 24} s={0.6} />)}
        {/* hilo de Atenea */}
        {f > t1 + 30 && f < t1 + 90 && (
          <path d={suave([manoA, [(manoA[0] + px) / 2, manoA[1] - 60 + Math.sin(f / 5) * 10], [px - 20, SUELO - 260]])} stroke={C.blanco} strokeWidth={3} fill="none" strokeDasharray="8 6" strokeDashoffset={-f * 3} opacity={vida(f, t1 + 30, t1 + 75, 10)} />
        )}
        <PolvoOro x={cabP[0]} y={manoAf[1]} f={f} o={vida(f, t2 + 40, t3 + 30)} ancho={110} />
        <Remolino x={cabP[0] + 10} y={cabP[1] - 10} f={f} o={vida(f, t4 + 70, fin(4) - 10) * 0.9} />
        {/* dioses */}
        <Personaje x={ate.x} s={1.08} accion={ate.accion} mujer tocado="casco" objeto="lanza" escudo brazo={ateBrazo} ropa="larga" />
        <Rotulo x={ate.x} y={SUELO - 480} texto="ATENEA" o={vida(f, t1 + 30, t2 + 10)} />
        <Personaje x={afr.x} s={1.08} accion={afr.accion} voltear mujer tocado="velo" brazo={afrBrazo} />
        <Rotulo x={afr.x} y={SUELO - 470} texto="AFRODITA" o={vida(f, t2 + 20, t3)} />
        {[0, 1, 2].map((i) => <Personaje key={'g' + i} x={gra.x - i * 95} s={0.82} accion={gra.accion} mujer tocado="diadema" brazo={[70 + i * 10, 30]} fase={f * 0.2 + i} />)}
        <Rotulo x={gra.x - 95} y={SUELO - 360} texto="LAS GRACIAS" o={vida(f, t3 + 30, t3 + 120)} tam={28} />
        {[0, 1, 2].map((i) => <Personaje key={'h' + i} x={hor.x + i * 95} s={0.82} accion={hor.accion} voltear={hor.accion === 'parado' ? true : hor.x > 1300 || f < t4} mujer tocado="laurel" brazo={[100, 20]} fase={f * 0.2 + i * 2} />)}
        <Rotulo x={hor.x + 95} y={SUELO - 360} texto="LAS HORAS" o={vida(f, t3 + 100, t4)} tam={28} />
        <Personaje x={her.x} s={1.06} accion={her.accion} voltear barba={false} tocado="petaso" objeto="caduceo" alas brazo={f > t4 + 60 ? [90, 20] : undefined} boca={habla(f, t4 + 60, t4 + 140)} />
        <Rotulo x={her.x} y={SUELO - 470} texto="HERMES" o={vida(f, t4 + 50, dur - 20)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La de todos los dones
const Nombre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.14], [t3, 0, 1.0], [dur, 560, 1.0]];
  const pan = andar(f, t3 + 20, dur, 960, 1560);
  const hermes = andar(f, t3 + 10, dur, 1180, 2020);
  const dioses: { x: number; t: any; o: any; m?: boolean; v?: boolean }[] = [
    { x: 160, t: 'corona', o: 'rayo' }, { x: 360, t: 'diadema', o: 'cetro', m: true }, { x: 560, t: 'cinta', o: 'tridente' }, { x: 740, t: 'casco', o: 'lanza', m: true },
    { x: 1180, t: 'laurel', o: 'lira', v: true }, { x: 1360, t: 'velo', o: null, m: true, v: true }, { x: 1540, t: 'casco', o: 'espada', v: true }, { x: 1740, t: 'cinta', o: 'tirso', v: true },
  ];
  const brillo = 0.35 + ap(f, t2, 30) * 0.35 - ap(f, t3 + 20, 40) * 0.5;
  const pecho: P = [960 + 10, SUELO - 250 * 1.2];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.1}>
        <Nube x={300} y={220} s={0.6} f={f} />
        <Nube x={1650} y={260} s={0.5} f={f + 90} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={2500} ancho={600} alto={300} />
        {[1650, 1850, 2080].map((x, i) => <Casa key={x} x={x} y={SUELO - 40} s={0.32 + i * 0.03} />)}
      </Capa>
      <Capa p={0.45}>
        <g opacity={Math.max(0.15, brillo)}>
          {dioses.map((d, i) => (
            <Personaje key={i} x={d.x} y={SUELO - 30} s={0.72} mujer={d.m} tocado={d.t} objeto={d.o} voltear={d.v} brazo={f > t2 ? [85, 10] : [30, 30]} capa={i % 3 === 0 ? C.purpura : null} />
          ))}
        </g>
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3500} />
        <circle cx={pan.x} cy={SUELO - 220} r={320} fill="url(#halo)" opacity={0.35 + ap(f, t2, 30) * 0.4} style={{ mixBlendMode: 'screen' }} />
        <Rayos desde={dioses.map((d) => [d.x + (d.v ? -60 : 60) * 0.72, SUELO - 30 - 270 * 0.72] as P)} hacia={pecho} o={vida(f, t2 + 5, t3 + 10) * 0.9} f={f} />
        <Personaje x={hermes.x} s={1.05} accion={hermes.accion} opacity={ap(f, t3, 20)} barba={false} tocado="petaso" objeto="caduceo" alas brazoAtras={[-60, -10]} />
        <Personaje x={pan.x} s={1.2} accion={pan.accion} mujer tocado={null} capa={PLATA} brazo={pan.accion === 'caminar' ? [70, 10] : [20, 30]} />
        <Collar x={cuelloDe(pan.x, 1.2)[0] + 4} y={cuelloDe(pan.x, 1.2)[1] + 2} s={1.2} />
        <CoronaFlores x={cabezaDe(pan.x, 1.2)[0] - 6} y={cabezaDe(pan.x, 1.2)[1] - 10} s={1.2} />
      </Capa>
      {/* el nombre, fijo sobre la escena */}
      <Rotulo x={960} y={300} texto="ΠΑΝΔΩΡΑ" o={vida(f, 118, t3)} tam={96} color={C.oro} />
      <Rotulo x={560} y={410} texto="ΠΑΝ · TODO" o={vida(f, t1 + 30, t3)} tam={44} />
      <Rotulo x={1360} y={410} texto="ΔΩΡΟΝ · REGALO" o={vida(f, t1 + 70, t3)} tam={44} />
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · Epimeteo
const Epimeteo: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 250, 1.08], [t1, 140, 1.04], [t2 + 20, 0, 1], [t3 + 40, 240, 1.04], [t4, 300, 1.1], [dur, 330, 1.16]];
  const casa = 1500;
  const ex = f < t3 ? 1180 : entre(f, t3 + 10, t3 + 70, 1180, casa - 10, lin);
  const eAcc: Accion = f > t3 + 10 && f < t3 + 70 ? 'caminar' : 'parado';
  const eVolt = f < t3 + 5;
  const eO = f < t4 ? 1 - ap(f, t3 + 55, 15) : ap(f, t4 + 15, 20);
  const fuera = f > t4;
  const pro = vida(f, t1 - 5, t2 - 20, 20);
  const hermes = f < t3 ? andar(f, t2 - 10, t2 + 70, -260, 640) : andar(f, t3 + 10, t3 + 60, 640, -300, true);
  const pan = andar(f, t2, t2 + 80, -420, 880);
  const panX = f < t3 + 20 ? pan.x : entre(f, t3 + 20, t3 + 80, 880, casa - 40, lin);
  const panAcc: Accion = f < t3 + 20 ? pan.accion : f < t3 + 80 ? 'caminar' : 'parado';
  const panO = 1 - ap(f, t3 + 70, 15);
  const oscuro = ap(f, t4 - 10, 60);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.1}><Sol x={1300} y={250} r={44} f={f} /></Capa>
      <Capa p={0.3}>
        <Monte x={300} ancho={600} alto={380} />
        <Monte x={1600} ancho={500} alto={300} />
        <Nube x={700 + f * 0.3} y={240} s={0.6} f={f} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={250} f={f} color={C.barroOscuro} />
        <Olivo x={2100} f={f + 30} color={C.barroOscuro} s={1.2} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3200} />
        <Olivo x={1900} f={f} s={1.15} />
        <Casa x={casa} luz={ap(f, t3 + 75, 20) * (1 - oscuro * 0.3)} f={f} />
        {/* recuerdo de Prometeo */}
        {pro > 0 && (
          <g opacity={pro * 0.9}>
            <circle cx={760} cy={SUELO - 200} r={300} fill="url(#haloBlanco)" opacity={0.7} />
            <Personaje x={760} s={1.12} barba capa={C.purpura} brazo={[150 + Math.sin(f / 6) * 12, 30]} boca={habla(f, t1 + 10, fin(1))} />
            <Rotulo x={760} y={SUELO - 490} texto="PROMETEO" o={pro} />
          </g>
        )}
        <Personaje x={hermes.x} s={1.05} accion={hermes.accion} voltear={f > t3} barba={false} tocado="petaso" objeto="caduceo" alas brazo={f > t2 + 70 && f < t3 ? [90, 0] : undefined} />
        <g opacity={panO}>
          <Personaje x={panX} s={1.1} accion={panAcc} mujer tocado={null} capa={PLATA} brazo={[40, 40]} />
          <Collar x={cuelloDe(panX, 1.1)[0] + 4} y={cuelloDe(panX, 1.1)[1] + 2} s={1.1} />
          <CoronaFlores x={cabezaDe(panX, 1.1)[0] - 6} y={cabezaDe(panX, 1.1)[1] - 10} s={1.1} />
        </g>
        <Rotulo x={panX} y={SUELO - 460} texto="PANDORA" o={vida(f, t2 + 70, t3 + 30)} />
        {!fuera ? (
          <Personaje x={ex} s={1.1} accion={eAcc} voltear={eVolt} barba opacity={eO}
            brazo={f > t2 + 60 && f < t3 ? [140, 30] : [30, 30]} cabeza={pro > 0.5 ? Math.sin(f / 7) * 8 : 0} boca={f > t2 + 60 && f < t3 && Math.floor(f / 6) % 2 === 0} />
        ) : (
          <Personaje x={casa - 290} s={1.1} voltear barba opacity={eO} brazo={[150, 60]} brazoAtras={[-30, -40]} inclinar={4} cabeza={-14} />
        )}
        <Rotulo x={fuera ? casa - 290 : ex} y={SUELO - 470} texto="EPIMETEO" o={vida(f, 20, t1 - 10) + vida(f, t4 + 30, dur)} />
        {/* el mal ya hecho: sombras que se escapan */}
        {fuera && [0, 1, 2, 3].map((i) => {
          const e = f - (t4 + 10 + i * 14);
          return e > 0 ? <Mal key={i} x={casa + (i % 2 ? -120 : 120) + e * (i % 2 ? -2.2 : 2.4)} y={SUELO - 170 - e * 2.4} s={0.45} f={f} v={i} dir={i % 2 ? -1 : 1} o={Math.min(1, e / 10)} /> : null;
        })}
      </Capa>
      <rect x={-400} y={0} width={2800} height={1080} fill="#1A0A06" opacity={oscuro * 0.45} />
      <Capa p={0.2}>
        {oscuro > 0 && [0, 1, 2].map((i) => <Nube key={i} x={entre(f, t4 - 10, dur, -400 + i * 500, 300 + i * 600, lin)} y={200 + i * 30} s={0.9} color="#3A1A0C" f={f} />)}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- Interior de la casa (común a 6, 7 y 8)
const Interior: React.FC<{ f: number; hasta?: number; color?: string; ventana?: number }> = ({ f, hasta = 2600, color = '#7A3418', ventana }) => (
  <>
    <rect x={-800} y={100} width={hasta + 800} height={SUELO - 100} fill={color} />
    {ventana !== undefined && (
      <g>
        <rect x={ventana - 110} y={230} width={220} height={190} fill={C.barroClaro} stroke={C.negro} strokeWidth={10} />
        <path d={`M${ventana} 230 V420 M${ventana - 110} 325 H${ventana + 110}`} stroke={C.negro} strokeWidth={8} />
      </g>
    )}
    <g transform={`translate(${-(0)} 0)`}>
      {Array.from({ length: Math.ceil((hasta + 800) / 96) }, (_, i) => (
        <g key={i} transform={`translate(${-800 + i * 96} 150)`}>
          <path d="M0 48 V0 H48 V36 H12 V12 H36 V24 H24" stroke={C.negro} strokeWidth={6} fill="none" />
          <line x1={48} y1={48} x2={96} y2={48} stroke={C.negro} strokeWidth={6} />
        </g>
      ))}
      <line x1={-800} x2={hasta} y1={140} y2={140} stroke={C.negro} strokeWidth={4} />
      <line x1={-800} x2={hasta} y1={206} y2={206} stroke={C.negro} strokeWidth={4} />
      <rect x={-800} y={SUELO - 60} width={hasta + 800} height={60} fill={C.negro} opacity={0.35} />
    </g>
    {f < 0 && null}
  </>
);

// ---------------------------------------------------------------- 6 · El ánfora cerrada
const Anfora: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -520, 1], [t1 - 10, 0, 1.1], [t2, 0, 1.1], [t2 + 40, -40, 1], [t3 + 20, 60, 1.02], [t4, 120, 1.04], [dur, 150, 1.1]];
  const ax = 1000, as = 1.05;
  const sello = vida(f, t1 - 10, t2, 10);
  const eras = vida(f, t2, t3 - 10);
  const encoge = entre(f, t2 + 50, t2 + 120, 0, 1);
  const cajaX = 640, cajaY = SUELO - 250;
  const serv = f < t4 ? andar(f, t3 - 20, t3 + 50, -300, 760) : andar(f, t4, t4 + 50, 760, -300);
  const pan = andar(f, t4 + 10, t4 + 70, 2000, 1290);
  const ciclo = Math.max(0, f - t4) / 60; // vueltas del día y la noche
  const ventana = 1250;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.6}>
        <Interior f={f} ventana={ventana} hasta={2800} />
        {/* cielo por la ventana: el día y la noche se suceden */}
        <defs><clipPath id="ventana03"><rect x={ventana - 106} y={234} width={212} height={182} /></clipPath></defs>
        <g clipPath="url(#ventana03)">
          <rect x={ventana - 110} y={230} width={220} height={190} fill={C.barroClaro} />
          <rect x={ventana - 110} y={230} width={220} height={190} fill="#2E140C" opacity={f > t4 ? (1 - Math.cos(ciclo * Math.PI * 2)) / 2 : 0} />
          <Sol x={ventana + Math.sin(ciclo * Math.PI * 2) * 90} y={390 - Math.cos(ciclo * Math.PI * 2) * 130} r={24} f={f} />
          <Luna x={ventana - Math.sin(ciclo * Math.PI * 2) * 90} y={390 + Math.cos(ciclo * Math.PI * 2) * 130} r={20} />
        </g>
        <path d={`M${ventana} 230 V420 M${ventana - 110} 325 H${ventana + 110}`} stroke={C.negro} strokeWidth={8} />
        {[-400, 100, 1700, 2200].map((x) => <Columna key={x} x={x} alto={600} />)}
      </Capa>
      <Capa p={0.85}>
        {[-900, -820, -740, -560, -480, 1650, 1730, 1900].map((x, i) => <Anforita key={x} x={x} s={0.9 + (i % 3) * 0.15} />)}
        {[-680, 1820].map((x) => <path key={x} d={`M${x - 50} ${SUELO} C ${x - 60} ${SUELO - 90}, ${x + 60} ${SUELO - 90}, ${x + 50} ${SUELO} Z`} fill={C.negro} />)}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={3200} />
        {sello > 0 && <circle cx={ax} cy={SUELO - 360 * as} r={100} fill="url(#halo)" opacity={sello * (0.6 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />}
        <Pithos x={ax} s={as} f={f} />
        <Rotulo x={ax} y={SUELO - 430 * as} texto="ΠΙΘΟΣ" o={vida(f, 125, t2 - 10)} tam={52} color={C.oro} />
        {/* Erasmo y la "caja" */}
        <g opacity={eras}>
          <Personaje x={380} s={1.0} canas barba ropa="larga" tocado={null} brazo={[80, 20]} cabeza={-8} />
          <g transform={`translate(${manoDe({ x: 380, brazo: [80, 20] })[0]} ${manoDe({ x: 380, brazo: [80, 20] })[1]})`}>
            <rect x={-6} y={-30} width={46} height={34} fill={C.blanco} stroke={C.negro} strokeWidth={3} />
            <path d="M17 -30 V4 M0 -20 H12 M0 -12 H12 M22 -20 H34 M22 -12 H34" stroke={C.negro} strokeWidth={1.5} />
          </g>
          <Rotulo x={380} y={SUELO - 420} texto="ERASMO" o={eras} />
          {encoge > 0 && encoge < 1 && (
            <g transform={`translate(${ax + (cajaX - ax) * encoge} ${SUELO + (cajaY - SUELO) * encoge}) scale(${as * (1 - encoge * 0.7)})`} opacity={1 - encoge}>
              <path d="M-34 0 C -110 -130, -110 -200, -60 -280 L-46 -296 L-62 -318 L62 -318 L46 -296 L60 -280 C 110 -200, 110 -130, 34 0 Z" fill="none" stroke={C.crema} strokeWidth={4} strokeDasharray="10 8" />
            </g>
          )}
          <g opacity={ap(f, t2 + 100, 20)}>
            <Caja x={cajaX} y={cajaY + Math.sin(f / 10) * 6} s={0.9} />
            <Rotulo x={cajaX} y={cajaY - 120} texto="«CAJA»" o={ap(f, t2 + 110, 20)} tam={30} />
          </g>
        </g>
        {/* para comparar: un hombre a su lado */}
        {f > t3 - 30 && (
          <>
            <Personaje x={serv.x} s={1.0} accion={serv.accion} voltear={f > t4} barba brazo={[160, 30]} brazoAtras={[-20, -30]} />
            <Anforita x={manoDe({ x: serv.x, voltear: f > t4, brazo: [160, 30] })[0]} y={manoDe({ x: serv.x, voltear: f > t4, brazo: [160, 30] })[1] + 30} s={0.8} rot={f > t4 ? 15 : -15} />
            <g opacity={vida(f, t3 + 50, t4 - 10)}>
              <path d={`M${ax + 150} ${SUELO} V${SUELO - 360 * as}`} stroke={C.crema} strokeWidth={3} strokeDasharray="8 8" />
              <path d={`M${ax + 135} ${SUELO - 360 * as} H${ax + 165} M${ax + 135} ${SUELO} H${ax + 165}`} stroke={C.crema} strokeWidth={3} />
              <Rotulo x={ax + 260} y={SUELO - 200} texto="≈ 1,7 m" o={1} tam={30} />
            </g>
            <Rotulo x={760} y={300} texto="GRANO · ACEITE · VINO" o={vida(f, t3 + 60, t4 - 10)} tam={30} />
          </>
        )}
        {/* Pandora la mira cada día */}
        {f > t4 && (
          <>
            <Personaje x={pan.x} s={1.1} accion={pan.accion} voltear mujer tocado={null} capa={PLATA} brazo={pan.accion === 'parado' ? [60 + Math.sin(f / 20) * 15, 30] : [30, 30]} cabeza={-6 + Math.sin(f / 25) * 4} />
            <Collar x={cuelloDe(pan.x, 1.1, true)[0] - 4} y={cuelloDe(pan.x, 1.1, true)[1] + 2} s={1.1} voltear />
            <CoronaFlores x={cabezaDe(pan.x, 1.1, true)[0] + 6} y={cabezaDe(pan.x, 1.1, true)[1] - 10} s={1.1} voltear />
          </>
        )}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · Salen los males
const NOMBRES = ['ENFERMEDAD', 'VEJEZ', 'FATIGA', 'ENVIDIA', 'HAMBRE', 'GUERRA'];
const Males: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.1], [t1, 0, 1.06], [t2, 0, 1], [t3, 0, 1], [t3 + 70, 1350, 1], [t4, 1500, 1], [dur, 1700, 1.05]];
  const ax = 1000, as = 1.05, boca: P = [ax, SUELO - 320 * as];
  const abre = f < t0 + 40 ? 0 : entre(f, t0 + 40, t0 + 65, 0, 1, Easing.out(Easing.back(1.4)));
  const px = 790;
  const asusta = f > t1 - 10;
  const brazo: [number, number] = asusta ? [155, 40] : [entre(f, t0, t0 + 40, 20, 105), entre(f, t0, t0 + 40, 30, 0)];
  const noche = ap(f, t4 - 20, 50);
  return (
    <Escenario dur={dur} camara={cam} cielo="inframundo">
      {/* afuera: tierra, mar y aldea */}
      <Capa p={0.1}><Estrellas n={70} f={f} area={[0, 140, 2400, 320]} /><Luna x={1700} y={220} /></Capa>
      <Capa p={0.45}>
        <Monte x={1200} ancho={600} alto={420} color="#3A1A0C" o={1} />
        <Monte x={1800} ancho={500} alto={300} color="#3A1A0C" o={1} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3000} />
        <g transform="translate(3000 0)"><Olas y={SUELO - 40} f={f} color={C.mar} alto={36} /></g>
        <rect x={2980} y={SUELO + 20} width={2200} height={200} fill={C.negro} />
        {[2300, 2700].map((x, i) => <Casa key={x} x={x} s={0.62} luz={noche * 0.8} f={f + i * 7} />)}
        {[2450, 2560].map((x, i) => <Hoguera key={x} x={x} y={SUELO} s={0.4} f={f} o={1 - noche * 0.6} />)}
        {/* interior de la casa */}
        <Interior f={f} hasta={1700} color="#4A2010" />
        <rect x={1700} y={110} width={60} height={SUELO - 110} fill={C.negro} />
        <Columna x={300} alto={600} />
        <Columna x={1500} alto={600} />
        <Lampara x={430} y={SUELO - 220} f={f} s={1.3} />
        <rect x={400} y={SUELO - 220} width={60} height={220} fill={C.negro} />
        <circle cx={ax} cy={boca[1]} r={260} fill="url(#halo)" opacity={abre * (0.5 + Math.sin(f / 3) * 0.15) * (1 - ap(f, t2, 60) * 0.7)} style={{ mixBlendMode: 'screen' }} />
        <Pithos x={ax} s={as} f={f} tapa={abre} sacude={f > t0 + 60 && f < t2 ? 1 : 0} />
        <Personaje x={px} s={1.1} mujer contorno tocado={null} capa={PLATA} brazo={brazo} brazoAtras={asusta ? [-60, -30] : undefined} inclinar={asusta ? -12 : 4} cabeza={asusta ? 14 : -4} boca={asusta && f < t2} />
        <Collar x={cuelloDe(px, 1.1)[0] + 4} y={cuelloDe(px, 1.1)[1] + 2} s={1.1} />
        {/* humo negro */}
        {f > t0 + 60 && Array.from({ length: 14 }, (_, i) => {
          const e = (f - t0 - 60 + i * 9) % 110;
          return <circle key={'h' + i} cx={boca[0] + Math.sin(i * 2.3 + e / 14) * (10 + e * 0.8)} cy={boca[1] - e * 2.4} r={10 + e * 0.5} fill={C.negro} opacity={(1 - e / 110) * 0.6 * (1 - ap(f, t2 + 40, 40))} />;
        })}
        {/* los males salen en espiral */}
        {Array.from({ length: 14 }, (_, i) => {
          const e = f - (t0 + 62 + i * 11);
          if (e < 0 || f > t3) return null;
          const ang = e * 0.07 + i * 1.3, r = Math.min(260, 20 + e * 3);
          const x = boca[0] + Math.cos(ang) * r * (i % 2 ? 1 : -1) + e * (i % 2 ? 1.5 : -1.4);
          const y = Math.max(230 + (i % 4) * 30, boca[1] - e * 2.0 + Math.sin(ang) * r * 0.3);
          return <Mal key={i} x={x} y={y} s={0.55 + azar(i) * 0.3} f={f} v={i} dir={Math.sin(ang) * (i % 2 ? 1 : -1) > 0 ? -1 : 1} o={Math.min(1, e / 8) * (1 - ap(f, t2 - 20, 20))} />;
        })}
        {/* los males con nombre */}
        {NOMBRES.map((n, k) => {
          const a = t2 + k * 22;
          const xs = 380 + k * 232, ys = 340 + (k % 2) * 80;
          const llegada = ap(f, a, 30);
          const x = f < t3 + 10 ? boca[0] + (xs - boca[0]) * llegada : xs + (f - t3 - 10) * (4 + k * 0.6);
          const y = f < t3 + 10 ? boca[1] + (ys - boca[1]) * llegada + Math.sin(f / 10 + k) * 8 : ys - (f - t3 - 10) * 0.3 + Math.sin(f / 10 + k) * 8;
          if (f < a) return null;
          return (
            <g key={n}>
              <Mal x={x} y={y} s={0.8} f={f} v={k} dir={f > t3 + 10 ? 1 : k < 3 ? -1 : 1} />
              <Rotulo x={x} y={y - 70} texto={n} o={vida(f, a + 10, t3 + 10)} tam={24} />
            </g>
          );
        })}
        {/* sobre la tierra y el mar, y de noche hacia las casas */}
        {f > t3 && Array.from({ length: 9 }, (_, i) => {
          const e = f - t3 - i * 10;
          if (e < 0) return null;
          const destino = i % 2 ? 2300 : 2700;
          const x0 = 1500 + i * 60 + e * 4.2, y0 = 300 + (i % 4) * 55 + Math.sin(e / 12 + i) * 30;
          const baja = f > t4 + i * 8 ? ap(f, t4 + i * 8, 50) : 0;
          const x = x0 + (destino - x0) * baja, y = y0 + (SUELO - 70 - y0) * baja;
          return <Mal key={'v' + i} x={x} y={y} s={(0.6 + azar(i + 9) * 0.3) * (1 - baja * 0.6)} f={f} v={i + 3} dir={1} o={1 - ap(f, t4 + i * 8 + 40, 15)} />;
        })}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · Elpis, la esperanza
const Esperanza: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.05], [t1, 40, 1.28], [t3, 40, 1.28], [t3 + 80, 0, 0.98], [t4, 0, 1], [dur, 60, 1.1]];
  const ax = 1020, as = 1.1;
  const tapa = f < t0 + 45 ? entre(f, t0, t0 + 45, 0.55, 0, Easing.in(Easing.cubic)) : 0;
  const golpe = f >= t0 + 45 && f < t0 + 70;
  const corte = ap(f, t1 + 20, 40);
  const luz = ap(f, t1 + 40, 60) * (f > t4 ? 0.85 + Math.sin(f / 3.2) * 0.25 : 1);
  const px = 800;
  const empuja = f < t0 + 60;
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}><Estrellas n={70} f={f} area={[-100, 140, 2300, 330]} seed={4} /><Luna x={300} y={230} r={40} /></Capa>
      <Capa p={0.35}>
        <Monte x={300} ancho={600} alto={330} color="#3A1A0C" o={1} />
        <Monte x={1600} ancho={700} alto={400} color="#3A1A0C" o={1} />
        <path d="M-400 830 L-400 690 C 0 650, 400 710, 900 670 C 1400 640, 1900 700, 2400 660 L2400 830 Z" fill="#2A120A" />
        {/* humanos lejanos con su lucecita */}
        {[120, 380, 640, 1300, 1560, 1820].map((x, i) => (
          <g key={x} opacity={ap(f, t3 + 20 + i * 8, 20)}>
            <Personaje x={x} y={700} s={0.22} contorno voltear={i % 2 === 1} brazo={[100, 10]} accion="caminar" fase={f * 0.12 + i} />
            <Lampara x={x + (i % 2 ? -30 : 30)} y={700 - 76} s={0.5} f={f} />
          </g>
        ))}
        {f > t3 && Array.from({ length: 6 }, (_, i) => {
          const x = ((f - t3) * (2.5 + i * 0.4) + i * 400) % 2600 - 300;
          return <Mal key={i} x={x} y={260 + (i % 3) * 70 + Math.sin(f / 15 + i) * 20} s={0.45} f={f} v={i} dir={1} o={0.9} />;
        })}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3000} />
        <rect x={420} y={SUELO - 30} width={1200} height={30} fill={C.negro} />
        <circle cx={ax} cy={SUELO - 140} r={260 * luz + 1} fill="url(#halo)" opacity={luz * 0.6} style={{ mixBlendMode: 'screen' }} />
        <Pithos x={ax} s={as} f={f} tapa={tapa} corte={corte} sacude={golpe ? 1.5 : 0}>
          <Elpis x={0} y={-24} s={0.78} f={f} luz={luz} />
        </Pithos>
        {golpe && Array.from({ length: 8 }, (_, i) => {
          const e = f - t0 - 45;
          return <circle key={i} cx={ax + (i - 3.5) * 22 + (i - 3.5) * e * 2} cy={SUELO - 350 * as - e * 0.6} r={6 + e * 0.6} fill={C.crema} opacity={0.5 * (1 - e / 25)} />;
        })}
        <Personaje x={px} s={1.12} mujer contorno tocado={null} capa={PLATA} brazo={empuja ? [125, 25] : [entre(f, t0 + 60, t0 + 90, 125, 40), 30]} brazoAtras={empuja ? [60, 20] : undefined} inclinar={empuja ? 16 : 4} cabeza={f > t1 + 30 ? -10 : 0} />
        <Collar x={cuelloDe(px, 1.12)[0] + 4} y={cuelloDe(px, 1.12)[1] + 2} s={1.12} />
        <Rotulo x={ax + 300} y={SUELO - 300} texto="ΕΛΠΙΣ" o={vida(f, t2, t3 + 20)} tam={64} color={C.oro} />
        <Rotulo x={ax + 300} y={SUELO - 250} texto="LA ESPERANZA" o={vida(f, t2 + 15, t3 + 20)} tam={28} />
        {f > t4 && <Mal x={ax + 220 + Math.sin(f / 14) * 40} y={SUELO - 420 + Math.cos(f / 11) * 20} s={0.6} f={f} v={2} dir={-1} o={ap(f, t4 + 20, 30)} />}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · Un mundo nuevo
const Mundo: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.05], [t1, 0, 1], [t1 + 90, 1420, 1], [dur, 1460, 1.04]];
  const buey = 1980 + Math.max(0, f - t1) * 0.45;
  const bal = ap(f, t2, 30);
  const inc = Math.sin((f - t2) / 9) * 14 * Math.max(0, 1 - (f - t2) / 120);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}><Sol x={300} y={200} r={50} f={f} /></Capa>
      <Capa p={0.3}>
        <Monte x={300} ancho={600} alto={400} />
        <Monte x={1000} ancho={500} alto={300} />
        <g opacity={0.3 * ap(f, t3, 40)}>
          <Personaje x={2140} s={1.5} voltear barba tocado="corona" objeto="rayo" brazo={[95, 20]} capa={C.purpura} />
        </g>
        <Nube x={1150} y={250} s={0.7} f={f} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={150} f={f} color={C.barroOscuro} />
        <Olivo x={2000} f={f} color={C.barroOscuro} s={0.9} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={4200} />
        {/* antes: la vida sin dolor */}
        <circle cx={560} cy={SUELO - 200} r={420} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        <Olivo x={560} f={f} s={1.2} />
        <Personaje x={300} s={1.05} barba objeto="copa" brazo={[130 + Math.sin(f / 10) * 15, 20]} />
        <Personaje x={560} s={1.05} barba={false} objeto="lira" brazo={[70, 50]} ropa="larga" tocado="laurel" />
        <Personaje x={800} s={1.05} voltear barba objeto="copa" brazo={[130 + Math.sin(f / 10 + 2) * 15, 20]} />
        {[380, 460, 680].map((x, i) => <Anforita key={x} x={x} s={0.6} rot={i === 1 ? 0 : 0} />)}
        <Rotulo x={560} y={300} texto="ANTES" o={vida(f, 30, t1 + 20)} tam={44} color={C.oro} />
        {/* ahora: trabajo, vejez y muerte */}
        <Arado x={buey - 260} />
        <Buey x={buey} f={f} />
        <Personaje x={buey - 420} s={1.0} accion="caminar" inclinar={14} barba brazo={[95, -20]} fase={f * 0.12} />
        <path d={`M${buey - 270} ${SUELO + 4} L${buey - 900} ${SUELO + 4}`} stroke={C.barroOscuro} strokeWidth={6} strokeDasharray="30 12" />
        <Personaje x={2720 + Math.max(0, f - t1) * 0.2} s={0.98} accion="caminar" fase={f * 0.08} canas barba inclinar={18} objeto="cetro" brazo={[40, 10]} cabeza={-10} />
        <Tumba x={2990} />
        <Rotulo x={2350} y={290} texto="AHORA" o={vida(f, t1 + 80, t2)} tam={44} />
        {/* la balanza: fuego contra males */}
        <g opacity={bal}>
          <Balanza x={2400} y={215} s={0.8} colgada inc={inc}
            izq={<g transform="translate(0 -6) scale(0.45)"><Fuego f={f} /></g>}
            der={<g transform="translate(0 -4)"><Pithos x={0} y={0} s={0.24} f={f} /></g>} />
        </g>
        <Relampago a={[2200, 130]} b={[2100, 520]} f={f} desde={t3 + 40} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · Cierre
const EDADES: [string, string][] = [['ORO', C.oro], ['PLATA', PLATA], ['BRONCE', BRONCE], ['HÉROES', C.purpura], ['HIERRO', HIERRO]];
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2);
  const cam: Cam = [[0, 0, 1.02], [dur, 520, 1.06]];
  const oscuro = ap(f, t1, 120);
  const objs: any[] = ['copa', 'lanza', 'espada', 'martillo', null, 'lanza'];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.15}>
        <Monte x={300} ancho={620} alto={520} templo />
        <circle cx={300} cy={300} r={220} fill="url(#haloBlanco)" opacity={0.6 * (1 - oscuro)} />
      </Capa>
      <Capa p={0.5}>
        <Olivo x={900} f={f} color={C.barroOscuro} />
        <Olivo x={1700} f={f} color={C.barroOscuro} s={0.9} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={4000} />
        {objs.map((o, i) => {
          const x = 1400 - i * 230 + f * 1.4;
          return <Personaje key={i} x={x} s={1.0 - i * 0.05} accion="caminar" fase={f * 0.2 + i * 1.3} barba={i % 3 !== 1} mujer={i % 3 === 1} objeto={i % 3 === 1 ? null : o} tocado={i === 2 ? 'casco' : undefined} ropa={i === 2 ? 'armadura' : undefined} escudo={i === 2} />;
        })}
      </Capa>
      <rect x={-400} y={0} width={2800} height={1080} fill="#2A120A" opacity={oscuro * 0.35} />
      {EDADES.map(([n, c], i) => (
        <g key={n}>
          <Medallon x={560 + i * 200} y={330} color={c} o={ap(f, t2 + i * 12, 20)} f={f} r={52} />
          <Rotulo x={560 + i * 200} y={430} texto={n} o={ap(f, t2 + 10 + i * 12, 20)} tam={24} />
        </g>
      ))}
      <Rotulo x={960} y={230} texto="LAS CINCO EDADES" o={ap(f, t2 + 70, 25)} tam={44} color={C.oro} />
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  furia: Furia,
  hefesto: Fragua,
  dones: Dones,
  nombre: Nombre,
  epimeteo: Epimeteo,
  pithos: Anfora,
  males: Males,
  elpis: Esperanza,
  mundo: Mundo,
  cierre: Cierre,
};

// evitar avisos de imports sin usar en piezas opcionales
void Inc; void Borde; void Yunque; void Hidria; void Caja;
