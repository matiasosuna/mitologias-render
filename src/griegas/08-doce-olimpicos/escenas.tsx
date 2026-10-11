// Escenas del video 08 · Los doce olímpicos (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, PersonajeProps, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Nube, Relampago, Suelo, Rotulo,
  ap, entre, azar, Accion, Borde,
} from '../../comun/vasija';
import {
  MAR, MAR_OSC, BRONCE, SOMBRA, manoDe, cabezaDe, Agua, Humo, Sonido, Musica, PisoNubes, NubePuerta, PalacioOro, TronoO, Hogar, Columna, Volcan,
  Yunque, EscudoOro, Cratera, Jarra, Ambrosia, MesaLarga, Telar, Flecha, Icor, Espiga, Parra, Flor, Laurel,
  Aguila, PavoReal, Buho, Caballo, Ciervo, Perro, Paloma, Concha, Delfin, Cerbero, Casita,
} from './piezas';

type Cam = [number, number, number][];
type Dios = Partial<PersonajeProps>;
const lin = Easing.linear;
const andar = (f: number, a: number, b: number, x0: number, x1: number, corre = false) => ({
  x: entre(f, a, b, x0, x1, lin),
  accion: (f > a && f < b ? (corre ? 'correr' : 'caminar') : 'parado') as Accion,
});
const vida = (f: number, a: number, b: number, d = 15) => Math.min(ap(f, a, d), 1 - ap(f, b, d));
const habla = (f: number, a: number, b: number) => f > a && f < b && Math.floor(f / 5) % 2 === 0;
const Velo: React.FC<{ o: number; color?: string }> = ({ o, color = '#1A0C06' }) => (o > 0 ? <rect x={-4000} y={-1500} width={14000} height={4000} fill={color} opacity={o} /> : null);
const destello = (f: number, ts: number[]) => Math.max(0, ...ts.map((t) => (f >= t && f < t + 10 ? 1 - (f - t) / 10 : 0)));
const Matas: React.FC<{ xs: number[]; y?: number; color?: string }> = ({ xs, y = SUELO, color = C.negro }) => (
  <g>{xs.map((x) => <path key={x} d={`M${x} ${y} c 10 -30, 50 -40, 70 -20 c 20 -20, 50 -10, 56 20 Z`} fill={color} stroke={C.barroOscuro} strokeWidth={2} />)}</g>
);

// ---------------------------------------------------------------- los dioses
const ZEUS: Dios = { barba: true, tocado: 'corona', capa: C.purpura, ropa: 'larga' };
const HERA: Dios = { mujer: true, tocado: 'velo', objeto: 'cetro', ropa: 'larga' };
const POSEIDON: Dios = { barba: true, tocado: 'cinta', objeto: 'tridente', ropa: 'larga' };
const DEMETER: Dios = { mujer: true, tocado: 'diadema', ropa: 'larga', capa: C.purpura };
const ATENEA: Dios = { mujer: true, tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'gorgona', ropa: 'larga' };
const APOLO: Dios = { barba: false, tocado: 'laurel', objeto: 'lira', ropa: 'larga' };
const ARTEMISA: Dios = { mujer: true, tocado: 'diadema', objeto: 'arco', ropa: 'corta' };
const ARES: Dios = { ropa: 'armadura', tocado: 'casco', objeto: 'lanza', escudo: true, emblema: 'trisquel' };
const AFRODITA: Dios = { mujer: true, tocado: 'diadema', ropa: 'larga' };
const HEFESTO: Dios = { barba: true, tocado: 'cinta', objeto: 'martillo', ropa: 'corta' };
const HERMES: Dios = { barba: false, tocado: 'petaso', objeto: 'caduceo', alas: true, capa: C.purpura };
const HESTIA: Dios = { mujer: true, tocado: 'velo', ropa: 'larga' };
const DIONISO: Dios = { barba: true, tocado: 'laurel', objeto: 'tirso', capa: C.purpura, ropa: 'larga' };

// ---------------------------------------------------------------- 1 · El palacio en las nubes
const Olimpo: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.04], [t1 - 10, 0, 1], [t2, 900, 1], [t2 + 90, 2140, 1], [t3 + 10, 2040, 1], [t3 + 70, 2040, 1.06], [t4 - 10, 2300, 1], [t4 + 70, 3740, 1], [dur, 3760, 1.05]];
  const rayoArriba = f > t0 + 10 && f < t1 + 20;
  const zMano = manoDe({ x: 900, brazo: rayoArriba ? [165, 10] : [40, 30] });
  // desfile de dioses
  const lider = entre(f, t1, t3 + 70, 1000, 2950, lin);
  const desfile: Dios[] = [ZEUS, HERA, POSEIDON, ATENEA, APOLO, ARTEMISA, HERMES];
  // Hefesto martillando
  const g = (f % 22) / 22, golpe = g < 0.7 ? entre(g, 0, 0.7, 60, 165) : entre(g, 0.7, 1, 165, 60);
  const abre = entre(f, t3 + 20, t3 + 90, 0, 1);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}>
        <Sol x={1400} y={260} r={46} f={f} />
        <Nube x={300} y={220} s={0.5} f={f} />
        <Nube x={1800} y={250} s={0.6} f={f + 40} />
      </Capa>
      <Capa p={0.25}>
        <Monte x={1500} ancho={900} alto={560} color="#7A3A1C" o={0.55} templo />
        <Monte x={2500} ancho={600} alto={380} o={0.4} />
      </Capa>
      <Capa p={0.5}>
        <Volcan x={520} s={0.9} f={f} />
        <Rotulo x={520} y={640} texto="ETNA" o={vida(f, 120, t1 - 10)} />
        <Olivo x={1100} y={SUELO - 20} s={0.6} f={f} color={C.barroOscuro} />
        <Nube x={1500} y={560} s={1.2} f={f} />
        <Nube x={2100} y={470} s={1} f={f + 30} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-600} hasta={1550} />
        <Matas xs={[140, 520, 1200]} />
        <PisoNubes x0={1400} x1={6000} f={f} />
        {/* Zeus vencedor */}
        <circle cx={900} cy={SUELO - 360} r={260} fill="url(#halo)" opacity={0.3 + destello(f, [t0 + 25, t0 + 70, t0 + 115]) * 0.6} style={{ mixBlendMode: 'screen' }} />
        <Relampago a={zMano} b={[560, 470]} f={f} desde={t0 + 25} />
        <Relampago a={zMano} b={[470, 500]} f={f} desde={t0 + 70} />
        <Relampago a={zMano} b={[600, 480]} f={f} desde={t0 + 115} />
        <Personaje x={900} {...ZEUS} objeto="rayo" brazo={rayoArriba ? [165, 10] : [40, 30]} cabeza={rayoArriba ? 10 : 0} boca={rayoArriba && f < t0 + 60} opacity={1 - ap(f, t1 - 5, 15)} />
        <Aguila x={700 + Math.cos(f / 40) * 260} y={300 + Math.sin(f / 40) * 40} s={0.7} f={f} voltear={Math.sin(f / 40) > 0} opacity={1 - ap(f, t1 + 40, 20)} />
        <Rotulo x={1080} y={SUELO - 360} texto="ZEUS" o={vida(f, 110, t1 - 10)} />
        {/* puertas de nubes y Horas */}
        <PalacioOro x={3000} f={f} brillo={ap(f, t2 + 10, 40)} />
        {desfile.map((d, i) => {
          const x = lider - i * 120;
          const o = Math.min(ap(f, t1 + i * 8, 15), 1 - entre(x, 2900, 2990, 0, 1, lin));
          if (o <= 0) return null;
          return <Personaje key={i} x={x} s={0.78} {...d} accion={f > t1 && f < t3 + 70 ? 'caminar' : 'parado'} fase={f * 0.2 + i} opacity={o} />;
        })}
        <NubePuerta x={3000} lado={-1} abre={abre} f={f} alto={430} />
        <NubePuerta x={3000} lado={1} abre={abre} f={f} alto={430} />
        {[2520, 2620].map((x, i) => <Personaje key={x} x={x} s={0.82} mujer tocado="diadema" brazo={[70 + Math.sin(f / 14 + i) * 8, 40]} opacity={ap(f, t3 - 40 + i * 10, 20)} />)}
        <Personaje x={3440} s={0.82} mujer voltear tocado="diadema" brazo={[70 + Math.sin(f / 14 + 2) * 8, 40]} opacity={ap(f, t3 - 20, 20)} />
        <Rotulo x={3000} y={210} texto="OLIMPO" o={vida(f, t2 + 20, t3 + 30)} tam={44} />
        <Rotulo x={2610} y={SUELO - 420} texto="LAS HORAS" o={vida(f, t3 + 10, t4 - 10)} />
        {/* Hefesto en su fragua */}
        <Yunque x={3760} s={0.9} brasa={0.8} />
        <Chispas x={3790} y={SUELO - 90} f={f} n={12} />
        {g < 0.12 && <circle cx={3790} cy={SUELO - 90} r={50} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />}
        <Personaje x={3660} s={0.9} {...HEFESTO} brazo={[golpe, 10]} inclinar={8} />
        <Rotulo x={3680} y={SUELO - 400} texto="HEFESTO" o={vida(f, t2 + 30, t3 + 40)} />
        {/* el gran salón de los doce tronos */}
        <rect x={3960} y={180} width={1600} height={SUELO - 180} fill={SOMBRA} />
        <path d={`M3960 230 H 5560`} stroke={BRONCE} strokeWidth={4} strokeDasharray="24 12" />
        {[4000, 5520].map((x) => <Columna key={x} x={x} alto={560} color={C.negro} />)}
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${4040 + i * 116} 250 q 58 50 116 0`} stroke={C.purpura} strokeWidth={8} fill="none" opacity={0.9} />)}
        {Array.from({ length: 6 }, (_, i) => <EscudoOro key={i} x={4160 + i * 240 + (i > 2 ? 40 : 0)} y={340} c={1} f={f + i * 9} s={0.8} />)}
        {[4120, 5400].map((x) => (
          <g key={x}>
            <path d={`M${x - 26} ${SUELO} L ${x - 8} ${SUELO - 200} L ${x + 8} ${SUELO - 200} L ${x + 26} ${SUELO} Z`} fill={C.negro} />
            <g transform={`translate(${x} ${SUELO - 200})`}><Fuego f={f + x} s={0.5} viento={-6} /></g>
          </g>
        ))}
        <circle cx={4760} cy={SUELO - 200} r={520} fill="url(#halo)" opacity={0.25 + ap(f, t4, 40) * 0.3} style={{ mixBlendMode: 'screen' }} />
        {Array.from({ length: 12 }, (_, i) => {
          const centro = i === 5 || i === 6;
          const x = 4180 + i * 112 + (i > 5 ? 30 : 0);
          return <TronoO key={i} x={x} s={centro ? 1.05 : 0.86} color={centro ? C.oro : i % 2 ? C.purpura : MAR} o={ap(f, t4 + i * 6, 12)} voltear={i > 5} />;
        })}
        <Rotulo x={4760} y={470} texto="DOCE TRONOS" o={ap(f, t4 + 50, 25)} tam={48} color={C.oro} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · Zeus y Hera
const Reyes: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -60, 1.06], [t1, 0, 1], [t1 + 150, 0, 1], [t2 + 30, 1050, 1], [t3 + 40, 1250, 1.04], [t4 + 30, 720, 0.92], [dur, 700, 0.94]];
  const tormenta = vida(f, t1, t2 + 20, 20);
  const rayo = f > t1 + 10 && f < t2;
  const zBrazo: [number, number] = rayo ? [165, 10] : [60, 30];
  const zMano = manoDe({ x: 900, brazo: zBrazo });
  const rayos = [t1 + 25, t1 + 70, t1 + 110];
  // águila: vuela en círculo y se posa en el respaldo del trono
  const k = entre(f, t1 + 100, t1 + 150, 0, 1);
  const ax = k > 0 ? entre(k, 0, 1, 700 + Math.cos(f / 30) * 300, 690) : 700 + Math.cos(f / 30) * 300;
  const ay = k > 0 ? entre(k, 0, 1, 330, SUELO - 330) : 330 + Math.sin(f / 30) * 30;
  const hera = andar(f, t2 - 20, t2 + 70, 2300, 1950);
  const pavo = andar(f, t3 - 30, t3 + 30, 2500, 2260);
  const abre = entre(f, t3 + 30, t3 + 80, 0, 1);
  const mira = f > t4 + 10;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}>
        <Nube x={400} y={240} s={0.7} f={f} color={tormenta > 0.3 ? '#9C8F7A' : C.crema} />
        <Nube x={1300} y={210} s={0.8} f={f + 20} color={tormenta > 0.3 ? '#9C8F7A' : C.crema} />
        <Nube x={2200} y={250} s={0.6} f={f + 50} />
      </Capa>
      <Capa p={0.4}>
        {[-200, 300, 1500, 2000, 2500, 3000].map((x) => <Columna key={x} x={x} y={SUELO - 30} alto={520} color={C.barroOscuro} />)}
        <path d="M-400 236 H 3400" stroke={C.barroOscuro} strokeWidth={30} />
      </Capa>
      <Capa p={1}>
        <PisoNubes x0={-800} x1={3600} f={f} />
        <Velo o={tormenta * 0.4} />
        {/* lluvia de la tormenta */}
        {tormenta > 0 && Array.from({ length: 70 }, (_, i) => {
          const x = -200 + azar(i * 7) * 1900, y0 = 140 + ((azar(i * 3) * 640 + f * 28) % 640);
          return <path key={i} d={`M${x} ${y0} l -10 40`} stroke={C.crema} strokeWidth={2} opacity={tormenta * 0.5} />;
        })}
        {rayos.map((t, i) => <Relampago key={i} a={[200 + i * 420, 130]} b={zMano} f={f} desde={t} />)}
        <circle cx={900} cy={SUELO - 360} r={300} fill="url(#halo)" opacity={0.3 + destello(f, rayos) * 0.7} style={{ mixBlendMode: 'screen' }} />
        <TronoO x={720} s={1.05} color={C.oro} />
        <Personaje x={900} {...ZEUS} objeto={rayo ? 'rayo' : 'cetro'} brazo={zBrazo} cabeza={rayo ? 8 : mira ? -4 : 0} boca={habla(f, t0 + 10, t0 + 60)} />
        <Aguila x={ax} y={ay} s={0.75} f={f} posada={k >= 1} voltear={k >= 1 ? false : Math.sin(f / 30) > 0} />
        <Rotulo x={920} y={SUELO - 480} texto="ZEUS" o={vida(f, 120, t2)} />
        {/* Hera y el pavo real */}
        <TronoO x={2130} s={0.95} voltear color={C.purpura} />
        <PavoReal x={pavo.x} f={f} s={1.15} voltear anda={pavo.accion !== 'parado'} abre={abre} brillo={ap(f, t4, 20) * (0.7 + Math.sin(f / 5) * 0.3)} />
        <Personaje x={hera.x} accion={hera.accion} voltear {...HERA} brazo={mira ? [80, 20] : [40, 30]} cabeza={mira ? -2 : 0} boca={habla(f, t4 + 30, t4 + 90)} />
        <Rotulo x={1950} y={SUELO - 480} texto="HERA" o={vida(f, t2 + 40, t4 + 20)} />
        {mira && <path d={`M1880 ${SUELO - 342} L ${1880 - ap(f, t4 + 20, 30) * 860} ${SUELO - 346}`} stroke={C.oro} strokeWidth={3} strokeDasharray="6 14" opacity={0.6} />}
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · Poseidón y Deméter
const Hermanos: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -120, 1.05], [t1, 0, 1], [t2 + 100, 260, 1], [t3 + 10, 1340, 1], [t4, 1360, 1.04], [dur, 1380, 1.1]];
  const NIVEL = SUELO - 60;
  const pY = entre(f, 0, t0 + 60, SUELO + 240, NIVEL + 10, Easing.out(Easing.cubic));
  const golpe = entre(f, t1 + 20, t1 + 40, 0, 1, Easing.in(Easing.cubic));
  const pBrazo: [number, number] = f < t1 ? [70, 20] : f < t1 + 40 ? [170 - golpe * 20, 0] : [100, -10];
  const temblor = f > t1 + 40 && f < t1 + 120 ? Math.sin(f * 2.3) * 9 * (1 - (f - t1 - 40) / 80) : 0;
  const olaAlta = 30 + vida(f, t1 + 40, t2, 20) * 40;
  const cab = entre(f, t2 + 10, t2 + 60, 0, 1, Easing.out(Easing.cubic));
  const cY = SUELO + 180 - cab * 180;
  const crece = (i: number) => entre(f, t3 + 10 + i * 4, t3 + 60 + i * 4, 0, 1);
  const marchita = entre(f, t4 + 50, t4 + 140, 0, 1);
  const triste = f > t4 + 30;
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.08}>
        <Sol x={2000} y={260} r={50} f={f} />
        <Nube x={600} y={230} s={0.6} f={f} />
        <Nube x={2400} y={220} s={0.5} f={f + 30} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={2300} ancho={600} alto={360} />
        <Monte x={2900} ancho={500} alto={300} o={0.45} />
      </Capa>
      <Capa p={1}>
        <g transform={`translate(${temblor} ${Math.abs(temblor) * 0.3})`}>
          {/* tierra firme y campos */}
          <Suelo desde={1500} hasta={4200} />
          {temblor !== 0 && <path d={`M1700 ${SUELO} l 20 30 l -14 20 l 24 40`} stroke={C.barro} strokeWidth={5} fill="none" />}
          {Array.from({ length: 34 }, (_, i) => <Espiga key={i} x={1750 + i * 34 + azar(i) * 14} y={SUELO + 4} c={crece(i % 12)} s={0.9 + azar(i + 3) * 0.3} marchita={marchita} f={f} />)}
          <Olivo x={3100} f={f} s={0.8} />
          {/* Deméter */}
          <circle cx={2300} cy={SUELO - 330} r={240} fill="url(#halo)" opacity={0.35 * (1 - marchita)} style={{ mixBlendMode: 'screen' }} />
          <Personaje x={2300} {...DEMETER} brazo={triste ? [20, 10] : [80, 40]} cabeza={triste ? -14 : 0} ojosCerrados={triste} inclinar={triste ? 6 : 0} />
          <g transform={`translate(${manoDe({ x: 2300, brazo: triste ? [20, 10] : [80, 40], inclinar: triste ? 6 : 0 })[0]} ${manoDe({ x: 2300, brazo: triste ? [20, 10] : [80, 40], inclinar: triste ? 6 : 0 })[1] + 50})`}>
            {[-8, 0, 8].map((dx) => <Espiga key={dx} x={dx} y={0} c={1} s={0.8} marchita={marchita} f={f} />)}
          </g>
          <Rotulo x={2300} y={SUELO - 470} texto="DEMÉTER" o={vida(f, t3 + 20, dur - 20)} />
          {/* Poseidón en su roca */}
          <path d={`M640 ${NIVEL + 60} C 660 ${NIVEL - 10}, 720 ${NIVEL - 20}, 800 ${NIVEL - 4} C 880 ${NIVEL - 20}, 940 ${NIVEL}, 960 ${NIVEL + 60} Z`} fill={C.negro} />
          <circle cx={830} cy={pY - 330} r={260} fill="url(#halo)" opacity={0.25 + destello(f, [t1 + 40]) * 0.7} style={{ mixBlendMode: 'screen' }} />
          <Personaje x={810} y={pY - 20} {...POSEIDON} brazo={pBrazo} boca={f > t1 + 30 && f < t1 + 70} />
          {/* caballo que nace de las olas y delfines */}
          <Caballo x={1180} y={cY} s={0.95} f={f} anda={false} encabrita={cab > 0 ? 0.5 + Math.sin(f / 10) * 0.3 : 0} opacity={cab} />
          <Agua nivel={NIVEL} f={f} x0={-1000} x1={1370} alto={olaAlta} />
          {/* costa rocosa */}
          <path d={`M1340 ${SUELO + 60} C 1360 ${NIVEL + 10}, 1400 ${NIVEL - 14}, 1450 ${NIVEL - 6} C 1480 ${SUELO - 30}, 1500 ${SUELO - 4}, 1560 ${SUELO} L 1560 ${SUELO + 80} Z`} fill={C.negro} />
          {[1400, 1460].map((x, i) => <path key={x} d={`M${x} ${NIVEL + 6 - i * 6} q 14 -12 28 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.5} />)}
          {[0, 1, 2].map((i) => {
            const ciclo = 80, t = ((f - t2 - i * 22) % ciclo) / ciclo;
            if (f < t2 + i * 22) return null;
            const x = 60 + i * 200 + t * 220, y = NIVEL + 40 - Math.sin(t * Math.PI) * 170;
            return <g key={i} opacity={t < 0.9 ? 1 : 0}><Delfin x={x} y={y} s={0.7} rot={-60 + t * 120} f={f} /></g>;
          })}
          {/* espuma */}
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={-200 + i * 100 + Math.sin(f / 9 + i) * 20} cy={NIVEL + 6 - vida(f, t1 + 40, t2, 15) * azar(i) * 30} r={4 + azar(i) * 4} fill={C.blanco} opacity={0.7} />
          ))}
          <Rotulo x={700} y={SUELO - 470} texto="POSEIDÓN" o={vida(f, 120, t3 - 10)} />
        </g>
        <Velo o={marchita * 0.3} color="#3A2A1C" />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · Atenea
const AteneaE: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -200, 1], [t0 + 120, 0, 1], [t1 + 40, 120, 1.12], [t2, 100, 1], [t2 + 100, 300, 1], [t3 + 50, 900, 1], [dur, 950, 1.04]];
  const at0 = andar(f, 0, t0 + 70, 500, 900);
  const alza = entre(f, t1 + 10, t1 + 40, 0, 1) * (1 - entre(f, t2 - 20, t2 + 10, 0, 1));
  const noche = vida(f, t2, t3 - 10, 25);
  const guerreros = [1500, 1640];
  const corre = f < t1 + 40;
  const piedra = entre(f, t1 + 40, t1 + 70, 0, 1);
  const olivo = entre(f, t3 + 10, t3 + 70, 0, 1, Easing.out(Easing.back(1.4)));
  const bx = entre(f, t2 + 20, t3 - 10, -100, 2200, lin);
  const by = 340 + Math.sin(f / 15) * 30;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.05}>
        <g opacity={1 - noche}><Sol x={1500} y={260} r={44} f={f} /></g>
        <g opacity={noche}>
          <Estrellas n={40} f={f} area={[0, 140, 2400, 320]} />
          <Luna x={600} y={250} />
        </g>
      </Capa>
      <Capa p={0.3}>
        <Monte x={700} ancho={700} alto={320} />
        <Templo x={700} y={SUELO - 320} s={0.7} color="#5A2410" />
        <Monte x={2000} ancho={600} alto={260} o={0.45} />
      </Capa>
      <Capa p={0.6}>
        <Olivo x={200} y={SUELO - 20} s={0.7} f={f} color={C.barroOscuro} />
        <Olivo x={2300} y={SUELO - 20} s={0.8} f={f} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3800} />
        <Matas xs={[300, 1250, 2600]} />
        {/* búho sobre su columna */}
        <Columna x={1180} alto={220} />
        <Buho x={1180} y={SUELO - 240} s={1.1} f={f} brillo={noche} o={1 - vida(f, t2 + 10, t3 - 10, 10)} />
        {/* Atenea */}
        <circle cx={at0.x + 50} cy={SUELO - 270} r={110 + alza * 60} fill="url(#halo)" opacity={alza * (0.7 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={at0.x} accion={at0.accion} {...ATENEA} brazo={f > t3 ? [110, -10] : [40, 20]} brazoAtras={[-20 + alza * 100, -40 + alza * 30]} contorno={noche > 0.5} />
        <Rotulo x={at0.x} y={SUELO - 500} texto="ATENEA" o={vida(f, 125, t2)} />
        {/* guerreros que se paralizan */}
        {guerreros.map((x, i) => (
          <Personaje key={x} x={x - (corre ? (t1 + 40 - f) * 0 : 0)} voltear ropa="armadura" tocado="casco" objeto="espada" escudo emblema="pulpo"
            accion={corre && f > t1 - 30 ? 'correr' : 'parado'} brazo={[110, -20]} inclinar={-6 - piedra * 4} boca={piedra > 0.5}
            piel={piedra > 0.5 ? '#8C8274' : C.negro} opacity={vida(f, t1 - 30, t2 + 20)} />
        ))}
        {/* noche: el búho vuela */}
        <Velo o={noche * 0.55} />
        {noche > 0 && <Buho x={bx} y={by} s={1.3} f={f} vuela brillo={1} o={noche} />}
        {/* regalos a los humanos */}
        <g transform={`translate(1460 ${SUELO}) scale(${olivo}) translate(-1460 ${-SUELO})`}>
          {olivo > 0 && <Olivo x={1460} f={f} s={1.1} />}
        </g>
        <g opacity={ap(f, t3 + 20, 20)}><Telar x={1880} t={entre(f, t3 + 40, dur - 20, 0.1, 1)} /></g>
        <Personaje x={1770} mujer tocado="velo" brazo={[80 + Math.sin(f / 6) * 10, 30]} opacity={ap(f, t3 + 20, 20)} />
        <g opacity={ap(f, t3 + 30, 20)}><Columna x={2290} alto={entre(f, t3 + 40, dur - 30, 60, 300)} /></g>
        <Personaje x={2170} brazo={[120 + Math.sin(f / 5) * 20, 10]} objeto="martillo" opacity={ap(f, t3 + 30, 20)} />
        <Personaje x={2470} voltear barba={false} brazo={[60, 60]} cabeza={Math.sin(f / 20) * 6} boca={habla(f, t3 + 60, dur)} opacity={ap(f, t3 + 40, 20)} />
        <Rotulo x={1460} y={SUELO - 400} texto="EL OLIVO" o={vida(f, t3 + 40, dur - 10)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · Apolo y Artemisa
const Gemelos: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 40, 1.04], [t1, 40, 1], [t1 + 80, -260, 1.04], [t3 - 20, -240, 1.08], [t3 + 60, 1100, 1], [t4, 1150, 1], [dur, 1800, 1]];
  const leto = 1 - ap(f, t1 - 10, 20);
  const art = f < t3 ? { x: 1240, accion: 'parado' as Accion } : f < t4 ? andar(f, t3, t3 + 60, 1240, 2050) : andar(f, t4, dur, 2050, 2750, true);
  const ciervo = f < t4 ? { x: 2450, accion: 'parado' } : andar(f, t4, dur, 2450, 3250, true);
  const tira = f > t4 + 60;
  const fl = entre(f, t4 + 64, t4 + 100, 0, 1, lin);
  const laurel = entre(f, t2 - 10, t2 + 50, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}>
        <g opacity={1 - ap(f, t3, 40)}><Sol x={300} y={280} r={58} f={f} /></g>
        <circle cx={300} cy={280} r={260} fill="url(#halo)" opacity={0.3 + vida(f, t1, t3) * 0.4} style={{ mixBlendMode: 'screen' }} />
        <Luna x={1700} y={250} r={50} />
        <circle cx={1700} cy={250} r={150} fill="url(#haloBlanco)" opacity={0.3} />
      </Capa>
      <Capa p={0.3}>
        <Monte x={-200} ancho={600} alto={340} />
        <Monte x={1200} ancho={500} alto={300} color="#3A1A0C" o={0.7} />
        <Monte x={1900} ancho={700} alto={380} color="#2A120A" o={0.8} />
      </Capa>
      <Capa p={0.6}>
        {[1500, 1800, 2100, 2400, 2700].map((x, i) => <Olivo key={x} x={x} y={SUELO - 30} s={0.6 + (i % 2) * 0.15} f={f} color="#2A120A" />)}
      </Capa>
      <Capa p={1}>
        <defs>
          <linearGradient id="nocheG" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#120806" stopOpacity={0} />
            <stop offset="0.35" stopColor="#120806" stopOpacity={0.55} />
            <stop offset="1" stopColor="#120806" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect x={1300} y={0} width={4000} height={SUELO} fill="url(#nocheG)" />
        <Suelo desde={-1000} hasta={4200} />
        <Estrellas n={30} f={f} area={[1900, 150, 2000, 300]} seed={5} />
        {/* Apolo con su lira y su laurel */}
        <g transform={`translate(380 ${SUELO}) scale(${laurel}) translate(-380 ${-SUELO})`}>{laurel > 0 && <Laurel x={380} f={f} s={1.3} />}</g>
        <circle cx={800} cy={SUELO - 340} r={200} fill="url(#halo)" opacity={0.3 + vida(f, t1, t3) * 0.4} style={{ mixBlendMode: 'screen' }} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M800 ${SUELO - 380} l ${Math.cos(i * 0.52 + f / 40) * 240} ${Math.sin(i * 0.52 + f / 40) * 240}`} stroke={C.oro} strokeWidth={4} opacity={vida(f, t1 + 10, t2 + 60) * 0.35} />)}
        <Personaje x={760} {...APOLO} brazo={f > t2 ? [70 + Math.sin(f / 4) * 6, 50] : [40, 40]} brazoAtras={f > t2 ? [40 + Math.sin(f / 3) * 10, 50] : undefined} cabeza={f > t2 ? 6 : 0} boca={habla(f, t2 + 20, t3 - 20)} />
        <Musica x={880} y={SUELO - 300} f={f} o={vida(f, t2 + 10, t3 + 40)} />
        <Rotulo x={760} y={SUELO - 470} texto="APOLO" o={vida(f, 120, t3)} />
        {/* Leto entre sus hijos */}
        <Personaje x={1000} s={1.05} mujer tocado="velo" ropa="larga" brazo={[30, 20]} opacity={leto} />
        <Rotulo x={1000} y={SUELO - 490} texto="LETO" o={vida(f, 125, t1 - 10)} />
        {/* Artemisa y el ciervo */}
        <Ciervo x={ciervo.x} f={f} corre={ciervo.accion !== 'parado'} s={1.05} contorno />
        <Personaje x={art.x} accion={art.accion} voltear={f < t3} {...ARTEMISA} brazo={tira ? [120, 0] : f < t3 ? [20, 20] : [50, 30]} brazoAtras={tira ? [80, 10] : undefined} contorno={f > t3} />
        <Flecha a={[art.x + 150, SUELO - 380]} b={[art.x + 800, SUELO - 760]} t={fl} />
        <Rotulo x={art.x} y={SUELO - 470} texto="ARTEMISA" o={f < t3 ? vida(f, 130, t1 - 10) : vida(f, t3 + 30, dur)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · Ares y Afrodita
const AmorGuerra: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.04], [t1, 800, 1], [t2 - 40, 1600, 1], [t2 + 40, 3340, 1], [t3 + 60, 3040, 1], [t4 + 60, 2700, 0.96], [dur, 2680, 1]];
  const ares = andar(f, 0, t2, 500, 2500, true);
  const NIVEL = SUELO - 30;
  const sube = entre(f, t2 + 10, t2 + 70, 0, 1, Easing.out(Easing.cubic));
  const deriva = entre(f, t3, t3 + 80, 4400, 4050);
  const cY = NIVEL + 120 - sube * 130 + Math.sin(f / 14) * 4;
  const baja = f > t3 + 80;
  const afro = baja ? andar(f, t3 + 80, t4 + 20, 3980, 3700) : { x: deriva - 20, accion: 'parado' as Accion };
  const afY = baja ? SUELO : cY - 40;
  const ares2 = andar(f, t4, t4 + 90, 2900, 3300);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}>
        <Sol x={2200} y={270} r={50} f={f} />
        <Nube x={500} y={230} s={0.6} f={f} color="#9C8F7A" />
        <Nube x={2600} y={220} s={0.7} f={f + 20} />
      </Capa>
      <Capa p={0.35}>
        <Monte x={300} ancho={600} alto={300} color="#7A3A1C" />
        <Monte x={1100} ancho={500} alto={260} color="#7A3A1C" />
      </Capa>
      <Capa p={0.6}>
        {/* la batalla al fondo */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = 100 + i * 230, g = Math.sin(f / 7 + i * 1.3);
          return <Personaje key={i} x={x} y={SUELO - 30} s={0.55} voltear={i % 2 === 1} ropa="armadura" tocado="casco" escudo objeto={i % 3 ? 'lanza' : 'espada'} brazo={[100 + g * 25, -10]} inclinar={6 + g * 4} opacity={0.38} />;
        })}
        <Humo x={700} y={SUELO - 200} f={f} n={6} alto={300} s={1.4} color={C.barroOscuro} />
        <Humo x={1600} y={SUELO - 200} f={f + 30} n={6} alto={300} s={1.4} color={C.barroOscuro} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3950} />
        <Matas xs={[200, 1300, 2300, 3300]} />
        {/* Ares y sus perros */}
        {[0, 1].map((i) => (
          <Perro key={i} x={ares.x + 220 + i * 170} s={0.85 - i * 0.08} corre={ares.accion !== 'parado'} fase={f * 0.42 + i * 1.5} ladra={Math.floor(f / 7 + i) % 3 === 0} o={ap(f, t1 - 30 + i * 12, 15) * (1 - ap(f, t2 - 10, 10))} />
        ))}
        <Personaje x={ares.x} accion={ares.accion} {...ARES} brazo={[100, -20]} boca={Math.floor(f / 8) % 3 !== 0} inclinar={10} opacity={1 - ap(f, t2 - 10, 10)} />
        <Rotulo x={ares.x} y={SUELO - 490} texto="ARES" o={vida(f, 120, t2 - 20)} />
        {/* Ares vuelve, encantado */}
        <Personaje x={ares2.x} accion={ares2.accion} {...ARES} brazo={f > t4 + 90 ? [40, 20] : [80, 0]} cabeza={f > t4 + 90 ? -4 : 0} opacity={ap(f, t4, 15)} />
        {/* el mar de Afrodita */}
        <path d={`M3950 ${SUELO} C 3990 ${SUELO + 10}, 4010 ${SUELO + 30}, 4040 ${SUELO + 60} L 3900 ${SUELO + 200} Z`} fill={C.negro} />
        <circle cx={afro.x + 20} cy={afY - 320} r={260} fill="url(#halo)" opacity={0.15 + sube * 0.35} style={{ mixBlendMode: 'screen' }} />
        <Personaje x={afro.x} y={afY} accion={afro.accion} voltear={baja} {...AFRODITA} brazo={f > t4 ? [100, 20] : [140, 30]} cabeza={f > t4 ? -6 : 8} opacity={sube} />
        {!baja && <Concha x={deriva} y={cY} s={0.95} rot={Math.sin(f / 16) * 3} />}
        {baja && <Concha x={4050} y={NIVEL + 30} s={0.95} rot={6} />}
        <Agua nivel={NIVEL} f={f} x0={4000} x1={6000} alto={26} color={MAR} />
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={4100 + azar(i) * 700 + Math.sin(f / 8 + i) * 10} cy={NIVEL + 10 + azar(i + 3) * 30} r={3 + azar(i + 5) * 6} fill={C.blanco} opacity={0.4 + sube * 0.5} />
        ))}
        {/* flores donde pisa */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 3960 - i * 34;
          return <Flor key={i} x={x} c={baja ? entre(afro.x, x - 20, x + 30, 1, 0, lin) : 0} color={i % 3 ? C.blanco : C.purpura} s={0.9 + azar(i) * 0.4} />;
        })}
        {/* palomas */}
        {Array.from({ length: 5 }, (_, i) => {
          const a = f / 30 + (i * Math.PI * 2) / 5;
          return <Paloma key={i} x={afro.x + 20 + Math.cos(a) * 200} y={afY - 330 + Math.sin(a) * 90} s={1.4} voltear={Math.sin(a) < 0} f={f + i * 7} o={ap(f, t4 - 20 + i * 6, 15)} />;
        })}
        <Rotulo x={afro.x} y={afY - 490} texto="AFRODITA" o={vida(f, t2 + 40, dur - 10)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · Hefesto y Hermes
const FuegoCamino: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.05], [t1, 0, 1], [t2 - 40, 140, 1.06], [t2 + 40, 1700, 1], [t3, 2050, 1], [t3 + 120, 2450, 1], [t4 + 40, 3000, 1], [dur, 3050, 1.04]];
  const camina = f > t1 && f < t1 + 90;
  const hx = entre(f, t1, t1 + 90, 760, 980, lin);
  const g = (f % 22) / 22, martilla = !camina && f < t2 - 30;
  const golpe = martilla ? (g < 0.7 ? entre(g, 0, 0.7, 60, 165) : entre(g, 0.7, 1, 165, 60)) : f >= t2 - 30 ? 150 : 40;
  const chispa = martilla && g < 0.14;
  const escudo = entre(f, t1 + 100, t2 - 40, 0, 1, lin);
  // Hermes
  const run = andar(f, t2, t3, 2100, 3100, true);
  const vuelo = entre(f, t3, t4 + 30, 0, 1, lin);
  const hmX = f < t3 ? run.x : 3100 + vuelo * 600;
  const hmY = f < t3 ? SUELO : SUELO - Math.sin(vuelo * Math.PI) * 330;
  const enAire = f > t3 && f < t4 + 30;
  const viajero = andar(f, t4 - 20, dur, 3150, 3450);
  const ladron = andar(f, t4 + 40, dur, 4200, 4520);
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}>
        <Nube x={2100} y={240} s={0.6} f={f} />
        <Nube x={2900} y={300} s={0.8} f={f + 40} />
        <Monte x={3000} base={560} ancho={260} alto={260} color="#7A3A1C" o={0.6} templo />
      </Capa>
      <Capa p={0.35}>
        <Monte x={2500} ancho={600} alto={300} />
        <Monte x={3300} ancho={500} alto={260} o={0.45} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={5200} />
        {/* la cueva de la fragua */}
        <path d={`M-800 ${SUELO} L -800 100 L 1900 100 C 1950 200, 2010 300, 1980 420 C 1960 520, 2040 620, 2010 ${SUELO} Z`} fill={SOMBRA} />
        <path d={`M1900 100 C 1950 200, 2010 300, 1980 420 C 1960 520, 2040 620, 2010 ${SUELO}`} stroke={C.negro} strokeWidth={10} fill="none" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-200 + i * 260} 140 l 20 40 l 20 -40`} fill={C.negro} />)}
        {/* herramientas y maravillas colgadas */}
        {[700, 790, 880].map((x, i) => <path key={x} d={`M${x} 200 V ${300 + i * 20} M${x - 16} ${300 + i * 20} h 32`} stroke={C.negro} strokeWidth={8} strokeLinecap="round" />)}
        <path d="M1300 200 V 260 M1290 260 l -14 70 M1310 260 l 14 70" stroke={C.negro} strokeWidth={6} />
        {[1500, 1680].map((x, i) => <EscudoOro key={x} x={x} y={330 + i * 20} c={1} f={f + i * 20} s={1.2} />)}
        <Cratera x={1600} f={f} s={0.8} brillo={0.4} />
        <path d={`M1760 ${SUELO} L 1780 ${SUELO - 150} L 1840 ${SUELO - 150} L 1860 ${SUELO} M1770 ${SUELO - 150} H 1850`} stroke={C.oro} strokeWidth={8} fill="none" />
        {[1780, 1840].map((x) => <circle key={x} cx={x} cy={SUELO - 10} r={12} fill="none" stroke={C.oro} strokeWidth={5} />)}
        {/* horno */}
        <path d={`M380 ${SUELO} L 380 ${SUELO - 230} Q 470 ${SUELO - 300} 560 ${SUELO - 230} L 560 ${SUELO} Z`} fill={C.negro} />
        <g transform={`translate(470 ${SUELO - 30})`}><Fuego f={f} s={1.05} viento={-10} /></g>
        <Chispas x={470} y={SUELO - 160} f={f} n={20} viento={0.4} />
        <Humo x={470} y={SUELO - 310} f={f} color={C.barroOscuro} n={5} />
        {/* yunque y escudo */}
        <Yunque x={1120} brasa={0.9} />
        {escudo > 0 && f < t2 - 30 && <EscudoOro x={1150} y={SUELO - 100} c={escudo} f={f} />}
        {chispa && <circle cx={1140} cy={SUELO - 100} r={70} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />}
        {martilla && <Chispas x={1140} y={SUELO - 100} f={f} n={14} viento={1} />}
        <Personaje x={hx} {...HEFESTO} accion={camina ? 'caminar' : 'parado'} fase={camina ? f * 0.16 : undefined} inclinar={camina ? 6 + Math.sin(f * 0.16) * 8 : 8}
          y={camina ? SUELO + Math.abs(Math.sin(f * 0.16)) * 10 : SUELO} brazo={f >= t2 - 30 ? [150, 10] : [golpe, 10]} contorno />
        {f >= t2 - 30 && (() => { const m = manoDe({ x: 980, brazo: [150, 10], inclinar: 8 }); return <EscudoOro x={m[0] + 10} y={m[1] - 40} c={1} f={f} s={1.3} />; })()}
        <Rotulo x={hx} y={SUELO - 470} texto="HEFESTO" o={vida(f, 120, t2 - 10)} />
        {/* Hermes */}
        {enAire && [1, 2, 3, 4].map((i) => {
          const v = Math.max(0, vuelo - i * 0.03);
          return <circle key={i} cx={3100 + v * 600 - 40} cy={SUELO - Math.sin(v * Math.PI) * 330 - 200} r={14 - i * 2} fill={C.crema} opacity={0.5 - i * 0.1} />;
        })}
        <Personaje x={hmX} y={hmY} accion={enAire ? 'correr' : run.accion} {...HERMES} brazo={enAire ? [130, 10] : [100, 0]} inclinar={enAire ? 16 : run.accion === 'correr' ? 10 : 0} opacity={ap(f, t2 - 10, 10)} />
        <Rotulo x={hmX} y={hmY - 480} texto="HERMES" o={vida(f, t2 + 10, t4)} />
        {enAire && <Nube x={3400} y={SUELO - 180} s={0.7} f={f} />}
        {/* viajero, comerciante y ladrón */}
        <Personaje x={viajero.x} accion={viajero.accion} tocado="petaso" canas brazo={[30, 20]} opacity={ap(f, t4 - 20, 15)} />
        <path d={`M${manoDe({ x: viajero.x, brazo: [30, 20] })[0]} ${manoDe({ x: viajero.x, brazo: [30, 20] })[1] - 30} L ${manoDe({ x: viajero.x, brazo: [30, 20] })[0] + 14} ${SUELO}`} stroke={C.negro} strokeWidth={8} strokeLinecap="round" opacity={ap(f, t4 - 20, 15)} />
        <g opacity={ap(f, t4, 15)}>
          <Personaje x={4000} voltear barba brazo={[60, 40]} boca={habla(f, t4 + 20, dur)} />
          <path d={`M3870 ${SUELO} C 3850 ${SUELO - 60}, 3880 ${SUELO - 110}, 3920 ${SUELO - 110} C 3960 ${SUELO - 110}, 3980 ${SUELO - 60}, 3960 ${SUELO} Z`} fill={C.negro} />
          <Borde d={`M3884 ${SUELO - 96} H 3950`} w={6} />
        </g>
        <Personaje x={ladron.x} accion={ladron.accion} barba={false} tocado={null} objeto="copa" brazo={[70, 50]} inclinar={14} s={0.92} opacity={ap(f, t4 + 30, 15)} />
        <Rotulo x={ladron.x} y={SUELO - 420} texto="¡LADRÓN!" o={vida(f, t4 + 70, dur)} tam={28} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · Hestia y Dioniso
const HogarVino: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -60, 1.06], [t1, 0, 1], [t2, 150, 1], [t2 + 150, 460, 1], [t3 + 40, 560, 1.1], [t4 + 30, 300, 0.95], [dur, 300, 0.97]];
  const ida = andar(f, t2 + 40, t2 + 130, 760, 1330);
  const vuelta = andar(f, t3 + 10, t3 + 110, 1330, 760);
  const hes = f < t3 + 10 ? ida : vuelta;
  const ofrece = f > t2 + 130 && f < t3 + 10;
  const dio = f < t3 + 20 ? andar(f, t2, t2 + 130, 2500, 1700) : andar(f, t3 + 20, t3 + 80, 1700, 1600);
  const parra = entre(f, t2 + 60, t4, 0, 1, lin);
  // dioses que pasan apurados al fondo
  const pasa = (k: number) => ((f * (k ? 9 : 7) + k * 900) % 2600) - 500;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.4}>
        {[-100, 450, 1000, 1550, 2100, 2650].map((x) => <Columna key={x} x={x} y={SUELO - 30} alto={520} color={C.barroOscuro} />)}
        <path d="M-400 236 H 3200" stroke={C.barroOscuro} strokeWidth={30} />
        <Parra pts={[[-100, 260], [450, 250], [1000, 262], [1550, 250], [2100, 260], [2650, 250]]} c={parra} f={f} />
        <Parra pts={[[1000, SUELO - 30], [1000, 520], [1000, 260]]} c={parra} f={f} racimos={false} />
        <Parra pts={[[1550, SUELO - 30], [1550, 520], [1550, 260]]} c={parra} f={f} racimos={false} />
      </Capa>
      <Capa p={0.7}>
        {/* dioses que corren de un lado a otro */}
        <Personaje x={pasa(0)} y={SUELO - 20} s={0.6} {...HERMES} accion="correr" opacity={vida(f, t1, t2) * 0.5} />
        <Personaje x={2400 - pasa(1)} y={SUELO - 20} s={0.62} voltear {...ARES} accion="correr" opacity={vida(f, t1 + 20, t2) * 0.5} />
      </Capa>
      <Capa p={1}>
        <PisoNubes x0={-800} x1={3600} f={f} />
        {/* el fuego del hogar */}
        <circle cx={940} cy={SUELO - 220} r={300} fill="url(#halo)" opacity={0.45 + Math.sin(f / 8) * 0.08} style={{ mixBlendMode: 'screen' }} />
        <Hogar x={940} f={f} />
        <Chispas x={940} y={SUELO - 260} f={f} n={16} viento={-0.5} />
        {/* el trono que Hestia cede */}
        <TronoO x={1480} s={0.95} voltear color={C.purpura} />
        <Personaje x={hes.x} accion={hes.accion} voltear={f > t3 + 10 && f < t3 + 115} {...HESTIA} brazo={ofrece ? [90, 0] : f < t2 ? [70 + Math.sin(f / 12) * 6, 30] : [40, 30]} cabeza={f < t2 ? -6 : 0} boca={ofrece && habla(f, t2 + 140, t3)} />
        <Rotulo x={hes.x} y={SUELO - 470} texto="HESTIA" o={vida(f, 120, t2 + 40)} />
        {/* Dioniso */}
        <Personaje x={dio.x} accion={dio.accion} voltear {...DIONISO} objeto={f > t4 ? 'copa' : 'tirso'} brazo={f > t4 ? [90, 30] : [50, 30]} cabeza={f > t3 + 40 && f < t4 ? 6 : 0} />
        {f > t4 && <path d={`M${manoDe({ x: dio.x, voltear: true, brazo: [90, 30] })[0]} ${manoDe({ x: dio.x, voltear: true, brazo: [90, 30] })[1] - 34} q -10 -14 0 -26`} stroke={C.purpura} strokeWidth={6} fill="none" />}
        <Rotulo x={dio.x} y={SUELO - 480} texto="DIONISO" o={vida(f, t2 + 60, dur - 10)} />
        <Rotulo x={1200} y={340} texto="LOS DOCE" o={ap(f, t4 + 60, 25)} tam={52} color={C.oro} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · El banquete
const Banquete: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 300, 1], [t1, 340, 1], [t2 - 10, 340, 1], [t2 + 40, 340, 1.28], [t3 - 10, 340, 1.28], [t3 + 30, 400, 1], [t4 + 40, 1500, 1], [dur, 1560, 1.03]];
  const mesa: { d: Dios; x: number; v?: boolean }[] = [
    { d: POSEIDON, x: 920, v: false }, { d: DEMETER, x: 1030, v: false }, { d: HERA, x: 1160, v: false },
    { d: ZEUS, x: 1300 }, { d: ATENEA, x: 1440, v: true }, { d: AFRODITA, x: 1560, v: true }, { d: DIONISO, x: 1680, v: true },
  ];
  const hebe = andar(f, t3 - 20, t4 + 40, 760, 1220);
  const gani = andar(f, t3 - 20, t4 + 40, 1880, 1420);
  const vierte = (x: number) => (f > t3 + 60 && Math.floor(x / 80) % 2 === 0 ? 1 : 0.2);
  const zB: [number, number] = f > t2 - 10 && f < t3 ? [110, -20] : [60, 40];
  const zM = manoDe({ x: 1300, s: 0.82, y: SUELO, brazo: zB });
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.1}>
        <Sol x={900} y={250} r={44} f={f} />
        <Nube x={300} y={230} s={0.5} f={f} />
        <Nube x={2300} y={280} s={0.6} f={f + 40} />
      </Capa>
      <Capa p={0.45}>
        <PalacioOro x={1400} y={SUELO - 40} s={0.85} ancho={760} f={f} brillo={0.3} o={0.5} />
      </Capa>
      <Capa p={1}>
        <PisoNubes x0={-800} x1={2700} f={f} />
        {/* el mundo de abajo, visto desde el borde */}
        <g opacity={0.9}>
          <Agua nivel={SUELO - 36} f={f} x0={3420} x1={4400} alto={12} vel={0.5} o={0.8} />
          <path d={`M2700 ${SUELO + 40} C 2900 ${SUELO - 120}, 3100 ${SUELO - 60}, 3300 ${SUELO - 30} C 3500 ${SUELO - 90}, 3700 ${SUELO - 30}, 4000 ${SUELO - 50} L 4000 ${SUELO + 60} L 2700 ${SUELO + 60} Z`} fill={C.barroOscuro} />
          {[2950, 3080, 3200, 3380].map((x, i) => <Casita key={x} x={x} y={SUELO - 50 - (i % 2) * 20} s={0.55} color="#5A2410" />)}
          <path d={`M3700 ${SUELO - 38} l 50 0 l -8 10 l -36 0 Z M3724 ${SUELO - 38} V ${SUELO - 70} L 3744 ${SUELO - 44}`} fill="#5A2410" stroke="#5A2410" strokeWidth={3} />
          {[0, 1, 2].map((i) => <Nube key={i} x={2900 + i * 380} y={SUELO - 150 - i * 30} s={0.35} f={f + i * 30} color="#E9CFA0" />)}
        </g>
        {/* los dioses detrás de la mesa */}
        <circle cx={1300} cy={SUELO - 300} r={420} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        {mesa.map(({ d, x, v }, i) => (
          <Personaje key={i} x={x} s={0.82} {...d} voltear={v} objeto={d === ZEUS ? 'copa' : d.objeto} brazo={d === ZEUS ? zB : [70 + Math.sin(f / 15 + i) * 10, 40]} boca={habla(f + i * 3, t0 + i * 10, t1 + 40) && i % 2 === 0} opacity={ap(f, i * 8, 15)} />
        ))}
        {/* venas de icor */}
        {f > t2 - 10 && f < t3 + 10 && (
          <g opacity={vida(f, t2, t3, 20)}>
            <circle cx={1310} cy={SUELO - 230} r={160} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />
            <path d={`M${1300 + 14 * 0.82} ${SUELO - 292 * 0.82} L ${zM[0]} ${zM[1]}`} stroke={C.oro} strokeWidth={7} strokeDasharray="12 6" strokeDashoffset={-f} />
            <circle cx={zM[0]} cy={zM[1]} r={70} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} />
            <Icor x={zM[0] + 30} y={zM[1] - 10} f={f} alto={120} />
          </g>
        )}
        <Rotulo x={1300} y={SUELO - 370} texto="ICOR" o={vida(f, t2 + 40, t3 - 10)} tam={28} color={C.oro} />
        <MesaLarga x={1300} ancho={480} />
        <Ambrosia x={1150} y={SUELO - 136} f={f} s={1.1} brillo={0.4 + vida(f, t1, t2 + 30) * 0.6} />
        {[1000, 1420, 1560].map((x) => <path key={x} d={`M${x - 16} ${SUELO - 160} Q ${x} ${SUELO - 140} ${x + 16} ${SUELO - 160} Z M${x} ${SUELO - 150} V ${SUELO - 138}`} fill={C.negro} stroke={C.negro} strokeWidth={4} />)}
        <Cratera x={1880} f={f} s={1.15} brillo={0.3 + vida(f, t1, t2 + 30) * 0.7} />
        <Rotulo x={1150} y={SUELO - 230} texto="AMBROSÍA" o={vida(f, t1 + 30, t2 + 20)} tam={26} />
        <Rotulo x={1880} y={SUELO - 260} texto="NÉCTAR" o={vida(f, t1 + 60, t2 + 20)} tam={26} />
        {/* Hebe y Ganimedes */}
        <Personaje x={hebe.x} accion={hebe.accion} mujer tocado="diadema" ropa="larga" brazo={[80, 20]} opacity={ap(f, t3 - 30, 15)} />
        <Jarra x={manoDe({ x: hebe.x, brazo: [80, 20] })[0]} y={manoDe({ x: hebe.x, brazo: [80, 20] })[1]} f={f} vierte={vierte(hebe.x)} s={1.1} />
        <Personaje x={gani.x} accion={gani.accion} voltear barba={false} tocado="cinta" brazo={[80, 20]} opacity={ap(f, t3 - 30, 15)} />
        <Jarra x={manoDe({ x: gani.x, voltear: true, brazo: [80, 20] })[0]} y={manoDe({ x: gani.x, voltear: true, brazo: [80, 20] })[1]} voltear f={f} vierte={vierte(gani.x + 80)} s={1.1} />
        <Rotulo x={hebe.x} y={SUELO - 440} texto="HEBE" o={vida(f, t3 + 10, t4 + 20)} tam={28} />
        <Rotulo x={gani.x} y={SUELO - 440} texto="GANIMEDES" o={vida(f, t3 + 10, t4 + 20)} tam={28} />
        {/* Apolo y las Musas */}
        <Personaje x={2120} {...APOLO} voltear brazo={[70 + Math.sin(f / 4) * 6, 50]} brazoAtras={[40 + Math.sin(f / 3) * 10, 50]} />
        <Musica x={2060} y={SUELO - 300} f={f} dir={-1} o={vida(f, t3, dur)} />
        {[2230, 2310, 2390, 2470].map((x, i) => (
          <Personaje key={x} x={x} s={0.86} mujer voltear tocado={i % 2 ? 'diadema' : 'cinta'} brazo={[60 + Math.sin(f / 10 + i) * 20, 40]} boca={f > t4 && Math.floor(f / 7 + i) % 2 === 0} cabeza={f > t4 + 60 ? -10 : 6} opacity={ap(f, t4 - 30 + i * 6, 15)} />
        ))}
        <Rotulo x={2350} y={SUELO - 430} texto="LAS MUSAS" o={vida(f, t4 + 10, dur - 10)} />
        {/* dioses asomados al borde */}
        <Personaje x={2610} s={0.9} {...HERMES} brazo={[50, 0]} cabeza={-18} inclinar={10} opacity={ap(f, t4 + 20, 20)} />
        <Personaje x={2690} s={0.9} {...ARTEMISA} brazo={[30, 20]} cabeza={-16} inclinar={6} opacity={ap(f, t4 + 30, 20)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · Hades y el anuncio
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -120, 1.06], [t1, 80, 1], [t2, 80, 1.08], [t3 - 10, 100, 1.12], [t3 + 10, 0, 1], [dur, 0, 1.05]];
  const invisible = entre(f, t2 + 30, t2 + 80, 0, 1) * (1 - entre(f, t3 - 40, t3 - 10, 0, 1));
  const olimpo = ap(f, t3 - 5, 20);
  const golpe = entre(f, t3 + 40, t3 + 70, 0, 1, Easing.in(Easing.cubic));
  const hefX = entre(f, t3 + 10, t3 + 40, 1350, 1180);
  const nace = entre(f, t3 + 72, t3 + 140, 0, 1, Easing.out(Easing.cubic));
  const zc = cabezaDe(820, 1);
  return (
    <Escenario dur={dur} camara={cam} cielo="inframundo">
      <Capa p={0.1}>
        <path d="M-400 140 C 200 200, 600 160, 1000 200 C 1400 240, 1800 180, 2400 220 L 2400 120 L -400 120 Z" fill={C.negro} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-200 + i * 200} 150 l 24 ${60 + (i % 3) * 30} l 24 ${-60 - (i % 3) * 30}`} fill={C.negro} />)}
        {/* rayo de sol lejano */}
        <path d="M1500 120 L 1460 560 L 1620 560 L 1560 120 Z" fill={C.oro} opacity={0.12 + vida(f, t2 + 60, t3) * 0.2} />
      </Capa>
      <Capa p={0.5}>
        {/* almas que vagan */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = ((f * 0.8 + i * 380) % 2600) - 400;
          return <Personaje key={i} x={x} y={SUELO - 30} s={0.6} piel="#C9B79A" barba={i % 2 === 0} mujer={i % 3 === 1} accion="caminar" fase={f * 0.12 + i} cabeza={-10} opacity={0.22 * vida(f, t1 - 30, t3 - 10)} />;
        })}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3000} color="#0A0503" />
        <Agua nivel={SUELO - 10} f={f} x0={1500} x1={3200} alto={14} color={MAR_OSC} vel={0.6} />
        {/* braseros */}
        {[520, 1400].map((x) => (
          <g key={x}>
            <path d={`M${x - 30} ${SUELO} L ${x - 10} ${SUELO - 120} L ${x + 10} ${SUELO - 120} L ${x + 30} ${SUELO} Z`} fill={C.negro} stroke={C.barroOscuro} strokeWidth={2} />
            <path d={`M${x - 46} ${SUELO - 120} Q ${x} ${SUELO - 100} ${x + 46} ${SUELO - 120} Z`} fill={C.negro} />
            <g transform={`translate(${x} ${SUELO - 124})`}><Fuego f={f + x} s={0.55} viento={-6} /></g>
          </g>
        ))}
        <TronoO x={760} s={1.05} color={C.purpura} />
        <Personaje x={940} {...ZEUS} capa={C.purpura} objeto="cetro" contorno tocado={invisible > 0.05 ? 'casco' : 'corona'} brazo={[50, 30]} cabeza={-4} opacity={1 - invisible * 0.88} boca={habla(f, t0 + 10, t0 + 60)} />
        {invisible > 0 && <circle cx={950} cy={SUELO - 330} r={180} fill="url(#haloBlanco)" opacity={Math.sin(invisible * Math.PI) * 0.4} />}
        <Rotulo x={950} y={SUELO - 480} texto="HADES" o={vida(f, 115, t2 + 30)} />
        <Cerbero x={1240} s={1.05} f={f} ladra={f > t1 + 30 && f < t1 + 120 ? 1 : 0} o={ap(f, t1 - 20, 20)} />
        <Rotulo x={1300} y={SUELO - 360} texto="CERBERO" o={vida(f, t1 + 10, t2 + 20)} />
        {/* destello: la cabeza de Zeus */}
        {olimpo > 0 && (
          <g opacity={olimpo}>
            <rect x={-1000} y={-200} width={4000} height={1400} fill={C.barro} />
            <circle cx={960} cy={420} r={900} fill="url(#halo)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
            <PisoNubes x0={-800} x1={2800} f={f} />
            <Columna x={300} alto={520} color={C.barroOscuro} />
            <Columna x={1640} alto={520} color={C.barroOscuro} />
            <Personaje x={820} {...ZEUS} objeto={null} brazo={[175, -60]} brazoAtras={[60, 40]} boca={f < t3 + 72} ojosCerrados={f < t3 + 72} inclinar={-4} cabeza={4} />
            <Personaje x={hefX} voltear {...HEFESTO} accion={f < t3 + 40 ? 'caminar' : 'parado'} brazo={[170 - golpe * 90, 10]} inclinar={-8} />
            {golpe >= 1 && <circle cx={zc[0]} cy={zc[1] - 20} r={140 + nace * 120} fill="url(#haloBlanco)" opacity={0.9 - nace * 0.5} />}
            {nace > 0 && (
              <g transform={`translate(${zc[0]} ${zc[1] - 34}) scale(${0.25 + nace * 0.35})`}>
                <Personaje x={0} y={0} {...ATENEA} brazo={[170, 0]} contorno opacity={nace} />
              </g>
            )}
            <Rotulo x={1500} y={300} texto="EL NACIMIENTO" o={ap(f, t4 + 10, 25)} tam={54} color={C.oro} />
            <Rotulo x={1500} y={370} texto="DE ATENEA" o={ap(f, t4 + 20, 25)} tam={54} color={C.oro} />
          </g>
        )}
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  olimpo: Olimpo,
  reyes: Reyes,
  hermanos: Hermanos,
  atenea: AteneaE,
  gemelos: Gemelos,
  amor_guerra: AmorGuerra,
  fuego_camino: FuegoCamino,
  hogar_vino: HogarVino,
  banquete: Banquete,
  cierre: Cierre,
};
