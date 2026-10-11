// Escenas del video 06 · La Gigantomaquia (estilo vasija detallada).
import React from 'react';
import { useCurrentFrame, Easing } from 'remotion';
import type { EscenaV } from '../../comun/VideoVasija';
import {
  C, P, SUELO, Escenario, Capa, Personaje, Fuego, Chispas, Estrellas, Luna, Sol, Olivo, Monte, Templo, Olas, Nube, Relampago, Suelo, Rotulo,
  suave, lerp, Inc, Borde, ap, entre, azar, Accion,
} from '../../comun/vasija';
import {
  LAVA, PIEDRA, TIERRA, manoDe, cabezaDe, Gigante, Gea, PielLeon, Flecha, Roca, Humo, Gota, Grieta, Chorro, Crisol, Hierba, Tripode, Mojon, Isla,
  Salpicadura, Tondo, AlasGrandes, CuellosSerpiente, temblor,
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
/** Pulso 1→0 que dura `d` frames desde `a`. */
const pulso = (f: number, a: number, d = 20) => (f >= a && f < a + d ? 1 - (f - a) / d : 0);

/** Mar que cubre de `desde` a `hasta` (las Olas de la biblioteca cubren un rango fijo: se repiten en tramos). */
const Mar: React.FC<{ desde: number; hasta: number; y: number; f: number; id: string; alto?: number; color?: string }> = ({ desde: x0, hasta, y, f, id, alto = 40, color = C.mar }) => {
  const tramos = Math.ceil((hasta - x0) / 2200);
  return (
    <g>
      {Array.from({ length: tramos }, (_, i) => {
        const a = x0 + i * 2200, b = Math.min(hasta, a + 2200);
        return (
          <g key={i}>
            <defs>
              <clipPath id={`mar-${id}-${i}`}><rect x={a} y={-2000} width={b - a + 1} height={5000} /></clipPath>
            </defs>
            <g clipPath={`url(#mar-${id}-${i})`}>
              <g transform={`translate(${a} 0)`}><Olas y={y} f={f} alto={alto} color={color} /></g>
            </g>
          </g>
        );
      })}
    </g>
  );
};
/** Velo oscuro sobre todo lo dibujado antes. */
const Velo: React.FC<{ o: number; color?: string }> = ({ o, color = '#0A0503' }) => (o > 0 ? <rect x={-6000} y={-6000} width={16000} height={12000} fill={color} opacity={o} /> : null);
/** Grupo sacudido por un temblor. */
const Tiembla: React.FC<{ f: number; k: number; children: React.ReactNode }> = ({ f, k, children }) => {
  const [dx, dy] = temblor(f, k);
  return <g transform={`translate(${dx} ${dy})`}>{children}</g>;
};
/** Cumbre del Olimpo: montaña con meseta y templo arriba. */
const Cumbre: React.FC<{ x: number; cima: number; ancho?: number; meseta?: number; templo?: boolean; color?: string; o?: number }> = ({ x, cima, ancho = 1000, meseta = 240, templo = true, color = PIEDRA, o = 1 }) => {
  const w = ancho / 2, b = SUELO + 60, h = b - cima;
  return (
    <g opacity={o}>
      {templo && <Templo x={x + 40} y={cima + 4} s={0.6} />}
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
/** Gaviota en vuelo. */
const Gaviota: React.FC<{ x: number; y: number; f: number; s?: number; k?: number }> = ({ x, y, f, s = 1, k = 0 }) => {
  const a = Math.sin(f / 5 + k) * 12;
  return <path d={`M${x - 30 * s} ${y + a * s} Q ${x - 12 * s} ${y - 14 * s} ${x} ${y} Q ${x + 12 * s} ${y - 14 * s} ${x + 30 * s} ${y + a * s}`} stroke={C.negro} strokeWidth={4} fill="none" strokeLinecap="round" />;
};
/** Media luna de la hoz de Cronos. */
const HozCielo: React.FC<{ x: number; y: number; o: number; rot: number }> = ({ x, y, o, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.5)`} opacity={o}>
    <circle r={110} fill="url(#haloBlanco)" opacity={0.6} />
    <path d="M0 -60 L0 70" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -60 C 10 -150, 120 -160, 140 -80 C 110 -120, 40 -115, 6 -50 Z" fill="#DCD6C8" stroke={C.negro} strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- 1 · La furia de Gea
const Furia: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1.04], [t1 - 30, 120, 1], [t1 + 70, 1250, 1], [t3, 1290, 1], [t4, 1320, 1.03], [dur, 1350, 1.08]];
  const nivel = entre(f, 0, t1 + 30, 640, 760);
  const gx = 2520, gs = 1.45;
  const sube = ap(f, t1 - 5, 70);
  const ira = ap(f, t3, 60), alza = ap(f, t4, 30);
  const sacude = alza * (0.6 + Math.sin(f / 7) * 0.3);
  const brazoG: [number, number] = f < t3 ? [35, 30] : f < t4 ? [95 + Math.sin(f / 2.5) * 4 * ira, -20] : [entre(f, t4, t4 + 30, 95, 168), entre(f, t4, t4 + 30, -20, 6)];
  const brazoAt: [number, number] = f < t4 ? [-20, -30] : [entre(f, t4, t4 + 30, -20, -168), entre(f, t4, t4 + 30, -30, -40)];
  const geaY = SUELO + (400 - 230 * sube) * gs;
  const cab = cabezaDe({ x: gx, y: geaY, s: gs, voltear: true });
  const tondo = vida(f, t2, t3 + 30, 20);
  const tx = 1830, ty = 420;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}>
        <g opacity={1 - ira * 0.7}><Sol x={420} y={290} r={50} f={f} /></g>
      </Capa>
      <Velo o={ira * 0.45} color="#4A1206" />
      <Capa p={0.18}>
        <Nube x={300} y={240} s={0.7} f={f} />
        <Nube x={1400} y={200} s={0.6} f={f} color={ira > 0.3 ? '#8C4A30' : C.crema} />
      </Capa>
      <Capa p={0.35}>
        <Cumbre x={1050} cima={SUELO - 430} ancho={1100} meseta={130} color={C.barroOscuro} o={0.85} />
        {ira > 0 && <circle cx={1050} cy={SUELO - 470} r={150} fill="url(#halo)" opacity={ira * 0.8} style={{ mixBlendMode: 'screen' }} />}
        <Monte x={2300} alto={330} ancho={620} o={0.45} />
      </Capa>
      <Capa p={0.6}>
        <g opacity={0.5}>
          <Olivo x={1300} y={SUELO - 30} s={0.9} f={f} color={C.barroOscuro} />
          <Olivo x={2050} y={SUELO - 40} s={0.8} f={f + 30} color={C.barroOscuro} />
        </g>
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude}>
          <Mar desde={-900} hasta={640} y={nivel} f={f} id="furia" />
          <path d={`M540 ${SUELO + 50} L 560 ${SUELO - 70} C 600 ${SUELO - 120}, 680 ${SUELO - 110}, 720 ${SUELO - 40} L 740 ${SUELO + 50} Z`} fill={C.negro} />
          <Inc d={`M590 ${SUELO - 60} q 30 -30 70 -10`} w={1.8} />
          <Suelo desde={600} hasta={4200} />
          <Olivo x={1180} f={f} s={0.85} />
          {/* la nueva humanidad camina sobre la tierra seca */}
          {[0, 1, 2].map((i) => {
            const x1 = 1350 + i * 110;
            const h = f < t4 ? andar(f, 10 + i * 14, t1 + 60, 640 + i * 90, x1) : andar(f, t4 + i * 6, t4 + 110, x1, x1 - 700, true);
            const miedo = f > t3 + 20;
            return <Personaje key={i} x={h.x} s={0.62} accion={h.accion} voltear={f > t4} mujer={i === 1} barba={i === 0} brazo={miedo ? [150 + Math.sin(f / 5 + i) * 10, 20] : i === 2 ? [70, 30] : undefined} brazoAtras={miedo ? [-150, -20] : undefined} cabeza={miedo ? 14 : 0} />;
          })}
          <Rotulo x={1180} y={SUELO - 300} texto="LA NUEVA HUMANIDAD" o={vida(f, 140, t1, 18)} tam={30} />
          {/* las grietas de la ira */}
          <Grieta x={gx - 380} ancho={300} abre={ap(f, t3 + 20, 40)} f={f} seed={2} />
          <Grieta x={gx + 330} ancho={260} abre={ap(f, t3 + 50, 40)} f={f} seed={5} />
          <Grieta x={gx - 760} ancho={240} abre={ap(f, t4 + 10, 30)} f={f} seed={8} />
          {f > t4 && <Chispas x={gx - 380} y={SUELO} f={f} n={14} viento={0.4} />}
          {f > t4 && <Chispas x={gx + 330} y={SUELO} f={f} n={14} viento={-0.4} />}
          <Gea x={gx} s={gs} sube={sube} voltear brazo={brazoG} brazoAtras={brazoAt} f={f} enojo={ira * (0.7 + Math.sin(f / 6) * 0.2)} boca={habla(f, t4 + 10, fin(4))} cabeza={f > t2 && f < t3 ? -12 : f > t4 ? 10 : 0} id="furia" />
          <Rotulo x={cab[0]} y={cab[1] - 90} texto="GEA" o={vida(f, t1 + 40, t3)} />
          {/* visión: los Titanes encadenados en el Tártaro */}
          <Tondo x={tx} y={ty} r={190} o={tondo} id="titanes" fondo="#1E0C06">
            <circle cx={tx} cy={ty + 40} r={160} fill="url(#halo)" opacity={0.25} />
            <rect x={tx - 200} y={ty + 150} width={400} height={60} fill={C.negro} />
            {[-110, 0, 110].map((dx, i) => {
              const lucha = Math.sin(f / 8 + i) * 5;
              const m = manoDe({ x: tx + dx, y: ty + 150, s: 0.55, brazo: [165, 10], inclinar: lucha });
              return (
                <g key={i}>
                  <path d={`M${m[0]} ${m[1]} L ${m[0] + 6} ${ty - 200}`} stroke="#D9D3C4" strokeWidth={3} strokeDasharray="7 4" />
                  <Personaje x={tx + dx} y={ty + 150} s={0.55} contorno barba={i !== 1} brazo={[165, 10]} brazoAtras={[-160, -10]} inclinar={lucha} voltear={i === 2} boca={Math.sin(f / 9 + i) > 0.5} />
                </g>
              );
            })}
          </Tondo>
          <Rotulo x={tx} y={ty - 230} texto="TITANES · TÁRTARO" o={tondo} tam={28} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 2 · Los hijos de la sangre
const Nacen: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t2, 0, 1], [t3, -40, 0.95], [t4 - 10, 0, 0.95], [t4 + 80, 520, 0.98], [dur, 640, 1]];
  const xs = [520, 960, 1400], gs = 1.3;
  const hoz = vida(f, t0 + 5, t1 + 10, 20);
  return (
    <Escenario dur={dur} camara={cam} cielo="noche">
      <Capa p={0.05}>
        <Estrellas n={70} f={f} area={[-200, 140, 2600, 380]} />
      </Capa>
      <Capa p={0.35}>
        <Cumbre x={1850} cima={SUELO - 410} ancho={1000} meseta={130} color="#3A1A0C" o={0.95} />
        <circle cx={1850} cy={SUELO - 410} r={120} fill="url(#halo)" opacity={0.25 + ap(f, t4, 40) * 0.5} style={{ mixBlendMode: 'screen' }} />
        <Monte x={300} alto={300} ancho={600} color="#2A120A" o={0.9} />
      </Capa>
      <Capa p={0.3}>
        <Rotulo x={1850 + 0} y={SUELO - 520} texto="OLIMPO" o={vida(f, t4 + 60, dur, 20)} tam={28} />
      </Capa>
      {/* la hoz de Cronos y la sangre de Urano */}
      <Capa p={0.6}>
        <HozCielo x={960} y={250} o={hoz} rot={-20 + entre(f, t0, t0 + 40, -30, 0)} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={3200} />
        {xs.map((x, k) => (
          <g key={k}>
            {Array.from({ length: 6 }, (_, j) => {
              const a = t0 + 30 + j * 24 + k * 9, t = (f - a) / 38;
              if (t <= 0 || t >= 1) return null;
              return <Gota key={j} x={lerp([960 + (k - 1) * 40, 0], [x, 0], t)[0]} y={300 + (SUELO - 310) * t * t} s={1.4} />;
            })}
            <ellipse cx={x} cy={SUELO + 4} rx={entre(f, t0 + 60 + k * 9, t1, 0, 90)} ry={10} fill={C.purpura} opacity={1 - ap(f, t3, 30)} />
            {f > t0 + 60 && f < t1 + 60 && <circle cx={x} cy={SUELO} r={90} fill="url(#halo)" opacity={0.35 + Math.sin(f / 5 + k) * 0.15} style={{ mixBlendMode: 'screen' }} />}
          </g>
        ))}
        {/* humo de Flegra */}
        {[260, 740, 1180, 1660, 2150, 2550].map((x, i) => <Humo key={x} x={x} y={SUELO} f={f + i * 17} n={5} s={0.7} o={0.25 + ap(f, t4 - 40, 40) * 0.6} viento={0.5} />)}
        {xs.map((x, k) => {
          const r1 = ap(f, t1 + k * 22, 50), r2 = entre(f, t3 + k * 18, t3 + k * 18 + 70, 0, 1);
          const y = SUELO + 176 * gs * (1 - r2) + (1 - r1) * 210 * gs;
          const flex = f > t2 && f < t3 + 40;
          const brazo: [number, number] = k === 2 && f > t4 + 20 ? [100, -4] : flex ? [150 + Math.sin(f / 7 + k) * 15, 20] : [40, 40];
          const brazoAtras: [number, number] = flex ? [-150 + Math.sin(f / 8 + k) * 12, -20] : [-20, -40];
          return (
            <g key={k}>
              {r1 > 0 && r1 < 1 && Array.from({ length: 7 }, (_, j) => {
                const t = (f - (t1 + k * 22)) / 40, a = -150 + j * 20;
                if (t >= 1) return null;
                return <Roca key={j} x={x + Math.cos((a * Math.PI) / 180) * 220 * t} y={SUELO + Math.sin((a * Math.PI) / 180) * 260 * t + 300 * t * t} s={0.25} rot={j * 40 + f * 4} seed={j} />;
              })}
              <Gigante id={`nace${k}`} x={x} y={y} s={gs} recorte={SUELO + 4} boca={habla(f, t2 + k * 10, t3) || (f > t1 + k * 22 && f < t1 + k * 22 + 40)} cabeza={k === 1 ? 12 : 0} brazo={brazo} brazoAtras={brazoAtras} contorno />
            </g>
          );
        })}
        <Rotulo x={960} y={248} texto="GIGANTES" o={vida(f, t2 + 20, t3 + 20)} tam={40} />
        <Rotulo x={1450} y={SUELO - 520} texto="FLEGRA" o={vida(f, t4 + 30, dur, 20)} tam={30} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 3 · El asalto al Olimpo
const Asalto: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -250, 1], [t1 + 20, -50, 1], [t2 - 20, 1450, 1], [t2 + 70, 1560, 1], [t3, 940, 0.68], [dur, 960, 0.7]];
  const ox = 2950, cima = 545;
  const avance = entre(f, 0, t2, -140, 250);
  const G = [{ x: 180, s: 1.4 }, { x: 640, s: 1.5 }, { x: 1060, s: 1.35 }];
  // lanzamientos de rocas encendidas
  const tiros: { g: number; L: number; dest: P }[] = [];
  G.forEach((_, i) => {
    for (let n = 0; n < 3; n++) {
      const L = t1 + 40 + i * 38 + n * 105;
      if (L < t3 + 30) tiros.push({ g: i, L, dest: [ox - 220 + azar(i * 5 + n) * 440, cima + 30 - azar(n + i) * 120] });
    }
  });
  const impacto = tiros.reduce((m, t) => Math.max(m, pulso(f, t.L + 70, 24)), 0);
  const sacude = Math.max(impacto, f > t2 && f < t3 ? 0.35 : 0);
  // dioses que responden
  const zeusB: [number, number] = f > t3 + 5 && f < t3 + 40 ? [150, 10] : [40, 30];
  const zeusM = manoDe({ x: ox - 50, y: cima, s: 0.76, voltear: true, brazo: zeusB });
  const caida = entre(f, t3 + 24, t3 + 40, 0, 1) * (1 - entre(f, t3 + 110, t3 + 150, 0, 1));
  const tambalea = entre(f, t3 + 70, t3 + 80, 0, 1) * (1 - entre(f, t3 + 130, t3 + 160, 0, 1));
  const apoloM = manoDe({ x: ox + 130, y: cima, s: 0.74, voltear: true, brazo: [90, 0] });
  const pose = (i: number) => {
    const g = G[i], tr = tiros.filter((t) => t.g === i);
    let brazo: [number, number] = [40, 40], roca = false;
    for (const t of tr) {
      if (f > t.L - 50 && f <= t.L) { brazo = [entre(f, t.L - 50, t.L - 25, 40, 172), entre(f, t.L - 50, t.L - 25, 40, 14)]; roca = f > t.L - 30; }
      if (f > t.L && f < t.L + 12) brazo = [entre(f, t.L, t.L + 8, 172, 95), 0];
    }
    return { x: g.x + avance, brazo, roca };
  };
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}><Sol x={1500} y={260} r={48} f={f} /></Capa>
      <Velo o={entre(f, t1, t2 + 60, 0, 0.3)} color="#3A1206" />
      <Capa p={0.3}>
        <Monte x={200} alto={360} ancho={600} />
        <Monte x={1300} alto={300} ancho={500} o={0.45} />
        <Nube x={900} y={230} s={0.6} f={f} />
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude}>
          <Suelo desde={-1200} hasta={1400} />
          {/* la isla que se hunde y el mar revuelto */}
          <Isla x={1900} y={SUELO - 50 + entre(f, t2 + 10, t2 + 150, 0, 230)} ancho={420} alto={170} f={f} arboles={3} seed={4} />
          <Mar desde={1300} hasta={4200} y={SUELO - 60} f={f * (1 + sacude)} id="asalto" />
          <Cumbre x={ox} cima={cima} ancho={1200} />
          {/* dioses en la cumbre */}
          <Personaje x={ox - 230} y={cima} s={0.74} voltear mujer tocado="casco" objeto="lanza" escudo brazo={[60, 20]} />
          <Personaje x={ox - 50} y={cima} s={0.76} voltear tocado="corona" capa={C.purpura} objeto="rayo" brazo={zeusB} boca={f > t3} />
          <Personaje x={ox + 130} y={cima} s={0.74} voltear barba={false} tocado="laurel" objeto="arco" brazo={f > t3 + 30 ? [90, 0] : [30, 20]} />
          <Rotulo x={ox} y={cima - 360} texto="OLIMPO" o={vida(f, t2 - 40, t3, 20)} tam={30} />
          {G.map((_, i) => {
            const p = pose(i), g = G[i];
            const inc = i === 1 ? caida * -70 : i === 2 ? tambalea * -25 : 0;
            const yb = SUELO + (i === 1 ? caida * 30 : 0);
            const m = manoDe({ x: p.x, y: yb, s: g.s, brazo: p.brazo, inclinar: inc });
            return (
              <g key={i}>
                <Gigante id={`as${i}`} x={p.x} y={yb} s={g.s} brazo={p.brazo} brazoAtras={[-40 + Math.sin(f / 9 + i) * 15, -30]} inclinar={inc} boca={habla(f, 10 + i * 8, t1 + 40) || pulso(f, t3 + 24, 40) > 0} cabeza={8} />
                {p.roca && <Roca x={m[0]} y={m[1] - 40} s={0.95} fuego f={f} seed={i + 2} />}
                {i === 1 && f > t3 + 110 && f < t3 + 170 && <circle cx={p.x} cy={SUELO - 200} r={260} fill="url(#halo)" opacity={pulso(f, t3 + 110, 60) * 0.8} style={{ mixBlendMode: 'screen' }} />}
              </g>
            );
          })}
          {tiros.map((t, k) => {
            const p = pose(t.g), g = G[t.g];
            const a = manoDe({ x: p.x, y: SUELO, s: g.s, brazo: [95, 0] });
            const u = (f - t.L) / 70;
            if (u <= 0) return null;
            if (u >= 1) return f < t.L + 94 ? <g key={k}><circle cx={t.dest[0]} cy={t.dest[1]} r={160 * (1 + (f - t.L - 70) / 24)} fill="url(#halo)" opacity={pulso(f, t.L + 70, 24)} style={{ mixBlendMode: 'screen' }} /><Chispas x={t.dest[0]} y={t.dest[1]} f={f} n={10} viento={1} /></g> : null;
            const x = lerp(a, t.dest, u)[0], y = lerp(a, t.dest, u)[1] - Math.sin(u * Math.PI) * 130;
            return <Roca key={k} x={x} y={y} s={0.95} rot={f * 6} fuego f={f + k} seed={k} />;
          })}
          {/* respuesta de los dioses */}
          <Relampago a={[zeusM[0], zeusM[1] - 120]} b={[pose(1).x + 30, SUELO - 300]} f={f} desde={t3 + 20} dur={16} />
          <Flecha a={apoloM} b={[pose(2).x + 40, SUELO - 260]} t={(f - (t3 + 50)) / 24} />
          <Rotulo x={pose(1).x + 200} y={SUELO - 700} texto="NO MUEREN" o={vida(f, t3 + 120, dur, 15)} tam={46} color={C.oro} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 4 · La hierba secreta
const Hierbas: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1.04], [t1 - 10, 60, 1], [t1 + 60, 1300, 1], [t2, 1330, 1], [t2 + 60, 1380, 0.96], [t3, 1480, 1.03], [dur, 1500, 1.08]];
  const eos = ap(f, t2 + 60, 30), sel = ap(f, t2 + 110, 30), hel = ap(f, t2 + 160, 30);
  const osc = ((eos + sel + hel) / 3) * 0.88;
  const gea = f < t3 ? andar(f, t1 + 20, t2 - 10, 1380, 1930) : andar(f, t3, t3 + 120, 1930, 2040);
  const zeus = f < t3 ? andar(f, t2, t2 + 70, 3300, 2740) : andar(f, t3, t3 + 70, 2740, 2394);
  const agacha = entre(f, t3 + 70, t3 + 88, 0, 40) * (1 - entre(f, t3 + 100, t3 + 125, 0, 1));
  const zeusB: [number, number] = f < t3 + 60 ? (f > t2 + 40 && f < t3 ? [165, 8] : [30, 30]) : f < t3 + 100 ? [20, 0] : [entre(f, t3 + 100, t3 + 125, 20, 158), entre(f, t3 + 100, t3 + 125, 0, 10)];
  const zm = manoDe({ x: zeus.x, s: 1.05, voltear: true, brazo: zeusB, inclinar: agacha });
  const arranca = entre(f, t3 + 100, t3 + 125, 0, 1);
  const vision = vida(f, t0 + 50, t1 + 10, 20);
  return (
    <Escenario dur={dur} camara={cam}>
      {/* Eos, Selene y Helios */}
      <Capa p={0.15}>
        <circle cx={500} cy={SUELO - 120} r={420} fill="#F2A0A0" opacity={(1 - eos) * 0.35} />
        <circle cx={500} cy={SUELO - 120} r={300} fill="url(#haloBlanco)" opacity={(1 - eos) * 0.45} />
        <g opacity={1 - sel}><Luna x={1000} y={250} r={44} /></g>
        <g opacity={1 - hel}><Sol x={1720} y={270} r={52} f={f} /></g>
        <Rotulo x={500} y={SUELO - 330} texto="EOS" o={vida(f, t2 + 10, t2 + 70)} tam={30} />
        <Rotulo x={1000} y={360} texto="SELENE" o={vida(f, t2 + 20, t2 + 120)} tam={30} />
        <Rotulo x={1720} y={400} texto="HELIOS" o={vida(f, t2 + 30, t2 + 170)} tam={30} />
      </Capa>
      <Capa p={0.35}>
        <Monte x={300} alto={420} ancho={560} />
        <Monte x={1400} alto={320} ancho={600} o={0.45} />
      </Capa>
      <Capa p={0.7}>
        <g opacity={0.8}><Templo x={250} y={SUELO - 10} s={1.25} color={C.barroOscuro} /></g>
      </Capa>
      <Capa p={1}>
        <Suelo desde={-800} hasta={4200} />
        {/* Delfos */}
        <Tripode x={640} f={f} />
        <Personaje x={450} mujer tocado="laurel" brazo={f > t0 && f < t1 ? [120 + Math.sin(f / 10) * 10, 10] : [40, 30]} boca={habla(f, t0 + 10, t1 - 10)} />
        <Personaje x={900} voltear tocado="corona" capa={C.purpura} objeto="cetro" brazo={[30, 30]} cabeza={6} />
        <Personaje x={1120} voltear mujer tocado="velo" brazo={[60, 40]} />
        {vision > 0 && (
          <g opacity={vision}>
            <circle cx={640} cy={330} r={130} fill="url(#haloBlanco)" opacity={0.8} />
            <Personaje x={630} y={420} s={0.42} objeto="arco" brazo={[90, 0]} contorno />
            <PielLeon x={630} y={420} s={0.42} f={f} />
          </g>
        )}
        <Rotulo x={700} y={250} texto="ORÁCULO DE DELFOS" o={vida(f, 130, t1)} tam={30} />
        <Rotulo x={830} y={340} texto="UN MORTAL" o={vision * ap(f, t0 + 80, 15)} tam={24} color={C.blanco} />
        {/* pradera de Flegra con flores */}
        {Array.from({ length: 26 }, (_, i) => {
          const x = 1450 + i * 60 + azar(i) * 30;
          return <path key={i} d={`M${x} ${SUELO} q -4 -18 -10 -26 M${x} ${SUELO} q 2 -22 8 -30 M${x} ${SUELO} q 0 -14 0 -20`} stroke={C.negro} strokeWidth={3} fill="none" />;
        })}
      </Capa>
      <Velo o={osc} />
      <Capa p={1}>
        <circle cx={arranca > 0 ? zm[0] : 2350} cy={arranca > 0 ? zm[1] + 60 : SUELO - 70} r={200} fill="url(#haloBlanco)" opacity={osc * 0.55} />
        <Hierba x={arranca > 0 ? zm[0] : 2350} y={arranca > 0 ? zm[1] + 144 + arranca * 120 : SUELO} f={f} brillo={0.7 + osc * 0.4} arranca={arranca} />
        <Personaje x={gea.x} accion={gea.accion} mujer tocado="velo" contorno={osc > 0.3} cabeza={f < t3 ? -14 : 4} brazo={f > t3 ? [92 + Math.sin(f / 9) * 10, -6] : [55, 30]} brazoAtras={f > t3 ? [60 + Math.sin(f / 11) * 10, -20] : undefined} />
        <Rotulo x={gea.x + 20} y={SUELO - 440} texto="GEA" o={vida(f, t1 + 40, t2)} />
        <Personaje x={zeus.x} accion={zeus.accion} voltear tocado="corona" capa={C.purpura} contorno={osc > 0.3} brazo={zeusB} inclinar={agacha} boca={habla(f, t2 + 40, t2 + 150)} objeto={f < t3 ? 'rayo' : null} />
         <Rotulo x={zeus.x + 170} y={SUELO - 400} texto="ZEUS" o={vida(f, t2 + 20, t3 - 20)} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 5 · Heracles y Alcioneo
const Alcioneo: React.FC<EscenaV> = ({ dur, at, fin }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, -120, 1], [t1, -20, 1], [t1 + 60, 440, 0.92], [t4, 520, 0.92], [t4 + 150, 1420, 0.94], [dur, 1560, 0.98]];
  const ate = andar(f, t0, t0 + 110, -320, 470);
  // Heracles
  const camina1 = andar(f, t4 + 10, t4 + 50, 760, 1640);
  const carga = andar(f, t4 + 75, t4 + 170, 1640, 2780);
  const hx = f < t4 + 75 ? camina1.x : carga.x;
  const hAcc: Accion = f < t4 + 75 ? camina1.accion : carga.accion;
  const mira = f > t1 - 20; // se da vuelta hacia el gigante
  const apunta = f > t1 + 40 && f < t4;
  const levanta = entre(f, t4 + 50, t4 + 75, 0, 1);
  const hB: [number, number] = levanta > 0 && f < t4 + 175 ? [entre(f, t4 + 50, t4 + 70, 40, 170), -10] : apunta ? [90, 0] : [30, 30];
  const hBA: [number, number] | undefined = levanta > 0 && f < t4 + 175 ? [-170, 10] : undefined;
  const arcoM = manoDe({ x: 760, s: 1.1, brazo: [90, 0] });
  // Alcioneo
  const gs = 1.5, ax0 = 1850;
  const cae = entre(f, t2 + 14, t2 + 34, 0, 1, Easing.in(Easing.cubic)) * (1 - entre(f, t2 + 70, t2 + 105, 0, 1));
  const suelta = entre(f, t4 + 170, t4 + 190, 0, 1, Easing.in(Easing.quad));
  let ax = ax0, ay = SUELO + cae * 230, ainc = -cae * 85;
  if (levanta > 0) {
    ax = entre(f, t4 + 50, t4 + 75, ax0, hx - 10);
    if (f >= t4 + 75) ax = hx - 10;
    ay = entre(f, t4 + 50, t4 + 75, SUELO, SUELO - 91);
    ainc = levanta * 90;
  }
  if (suelta > 0) { ax = lerp([2770, 0], [3180, 0], suelta)[0]; ay = SUELO - 91 + suelta * 321; ainc = 90; }
  const muerto = f > t4 + 190;
  const brilla = (f > t2 + 40 && f < t4 + 75 ? 1 : 0) * (0.6 + Math.sin(f / 5) * 0.3);
  const pecho: P = [ax0 - 30, SUELO - 250 * gs * 0.75];
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}><Sol x={300} y={260} r={46} f={f} /></Capa>
      <Capa p={0.3}>
        <Monte x={700} alto={380} ancho={600} />
        <Monte x={1900} alto={300} ancho={600} o={0.45} />
        <Nube x={1300} y={230} s={0.6} f={f} />
      </Capa>
      <Capa p={0.6}>
        <g opacity={0.45}>
          <Olivo x={300} y={SUELO - 30} s={0.9} f={f} color={C.barroOscuro} />
          <Olivo x={2600} y={SUELO - 30} s={0.8} f={f} color={C.barroOscuro} />
        </g>
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1000} hasta={4400} />
        {/* Palene: la tierra natal del gigante */}
        <rect x={1380} y={SUELO} width={1150} height={40} fill={C.purpura} opacity={0.75} />
        {Array.from({ length: 23 }, (_, i) => <circle key={i} cx={1400 + i * 50} cy={SUELO + 18} r={4} fill={C.oro} />)}
        {brilla > 0 && Array.from({ length: 7 }, (_, i) => {
          const x = ax0 - 180 + i * 60, e = (f * 3 + i * 40) % 160;
          return <path key={i} d={`M${x} ${SUELO} Q ${x + 20} ${SUELO - e * 0.6} ${ax0} ${SUELO - 40 - e}`} stroke={C.oro} strokeWidth={4} fill="none" opacity={brilla * (1 - e / 160)} />;
        })}
        {brilla > 0 && <circle cx={ax0} cy={SUELO} r={300} fill="url(#halo)" opacity={brilla * 0.6} style={{ mixBlendMode: 'screen' }} />}
        <Rotulo x={1950} y={SUELO - 30} texto="PALENE" o={vida(f, t3, t4 + 40)} tam={26} color={C.oro} />
        <Mojon x={2620} />
        {/* Atenea */}
        <Personaje x={ate.x} accion={ate.accion} mujer tocado="casco" objeto="lanza" escudo brazo={f > t1 && f < t2 ? [100, 0] : [40, 20]} boca={habla(f, t3 + 20, t4 + 10)} />
        <Rotulo x={ate.x + 20} y={SUELO - 470} texto="ATENEA" o={vida(f, 60, t1)} />
        {/* Alcioneo */}
        <Gigante id="alcioneo" cola={false} x={ax} y={ay} s={gs} voltear inclinar={ainc} brazo={f > t2 + 105 && f < t4 + 50 ? [120 + Math.sin(f / 6) * 15, 10] : [40, 40]} brazoAtras={[-30, -30]} boca={!muerto && (habla(f, t1 + 30, t1 + 90) || (f > t2 + 105 && f < t4))} ojosCerrados={muerto || (cae > 0.8)} contorno={false} />
        <Rotulo x={ax0 - 30} y={SUELO - 620} texto="ALCIONEO" o={vida(f, t1 + 30, t2 + 20)} />
        {/* Heracles */}
        <Personaje x={hx} s={1.1} accion={hAcc} voltear={!mira} objeto={levanta > 0 ? null : 'arco'} brazo={hB} brazoAtras={hBA} />
        <PielLeon x={hx} s={1.1} voltear={!mira} f={f} />
        <Rotulo x={hx + 10} y={SUELO - 500} texto="HERACLES" o={vida(f, t0 + 60, t1 + 60)} />
        <Flecha a={arcoM} b={pecho} t={(f - t2) / 14} />
        {f > t2 + 14 && f < t2 + 40 && <circle cx={pecho[0]} cy={pecho[1]} r={90} fill="url(#halo)" opacity={pulso(f, t2 + 14, 26)} style={{ mixBlendMode: 'screen' }} />}
        {suelta > 0.95 && f < t4 + 220 && <Humo x={3180} y={SUELO} f={f} n={5} s={0.8} o={1 - ap(f, t4 + 200, 20)} />}
        <Rotulo x={3200} y={SUELO - 420} texto="FUERA DE SU TIERRA" o={vida(f, t4 + 175, fin(4) + 30)} tam={28} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 6 · Porfirión y Efialtes
const Porfirion: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4);
  const cam: Cam = [[0, 0, 1], [t1, 40, 0.94], [t2, 100, 0.94], [t2 + 90, 1360, 0.95], [t4, 1400, 0.95], [t4 + 50, 1500, 0.78], [dur, 1540, 0.8]];
  // Porfirión
  const po = andar(f, t0 + 20, t0 + 140, 2000, 1250, true);
  const poCae = entre(f, t1 + 60, t1 + 82, 0, 1, Easing.in(Easing.cubic));
  const golpe = pulso(f, t1 + 12, 30);
  // Zeus sobre la nube
  const zB: [number, number] = f > t1 - 10 && f < t1 + 30 ? [150, 10] : [50, 30];
  const zm = manoDe({ x: 260, y: 500, s: 0.8, brazo: zB });
  // Heracles
  const he = andar(f, t2, t2 + 80, 560, 1850, true);
  const heApunta = (f > t1 + 20 && f < t2) || (f > t3 + 30 && f < t4);
  const heM = manoDe({ x: he.x, s: 1.08, brazo: [90, 0] });
  // Efialtes
  const ex = entre(f, t2, t2 + 90, 2950, 2360), es = 1.6;
  const efCae = entre(f, t3 + 95, t3 + 125, 0, 1, Easing.in(Easing.cubic));
  const ojo = cabezaDe({ x: ex, s: es, voltear: true, gigante: true, inclinar: -efCae * 70 });
  const ap0 = andar(f, t2 + 40, t2 + 110, 3400, 2900);
  const apM = manoDe({ x: ap0.x, s: 1.02, voltear: true, brazo: [92, 0] });
  const flechaAp = (f - (t3 + 20)) / 18, flechaHe = (f - (t3 + 70)) / 18;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.08}><Sol x={1200} y={250} r={44} f={f} /></Capa>
      <Velo o={0.15 + golpe * 0.3} color="#2A0A04" />
      <Capa p={0.3}>
        <Cumbre x={500} cima={SUELO - 400} ancho={1000} meseta={130} color={C.barroOscuro} o={0.8} />
        <Monte x={1700} alto={330} ancho={600} o={0.45} />
      </Capa>
      {/* uno por uno: duelos al fondo */}
      <Capa p={0.55}>
        <path d={`M600 ${SUELO + 40} C 900 ${SUELO - 140}, 1400 ${SUELO - 160}, 1900 ${SUELO - 120} C 2300 ${SUELO - 100}, 2600 ${SUELO - 160}, 3000 ${SUELO - 120} L 3000 ${SUELO + 40} Z`} fill={C.barroOscuro} opacity={0.75} />
        {[1150, 1500, 1850, 2200, 2550].map((x, i) => {
          const a = t4 + 10 + i * 22, o = ap(f, a, 15), c = entre(f, a + 18, a + 34, 0, 1);
          const yb = SUELO - 140 + (i % 2) * 10;
          return (
            <g key={i} opacity={o * 0.6}>
              <Personaje x={x - 110} y={yb} s={0.5} objeto={i % 2 ? 'lanza' : 'arco'} mujer={i === 2} tocado={i === 2 ? 'casco' : 'cinta'} brazo={[95, 0]} />
              <Gigante id={`fondo${i}`} x={x + 40} y={yb + c * 70} s={0.62} voltear inclinar={-c * 80} cabeza={6} />
            </g>
          );
        })}
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1200} hasta={4600} />
        {/* Zeus en su nube */}
 <Nube x={250} y={520} s={0.8} f={0} />
        <Personaje x={260} y={500} s={0.8} tocado="corona" capa={C.purpura} objeto="rayo" brazo={zB} />
        <Rotulo x={265} y={196} texto="ZEUS" o={vida(f, t1 - 30, t2)} tam={28} />
        <Relampago a={[zm[0] + 10, zm[1] - 100]} b={[po.x - 20, SUELO - 320]} f={f} desde={t1 + 12} dur={18} />
        {/* Hera */}
 <Personaje x={800} mujer tocado="diadema" objeto="cetro" brazo={f > t0 + 100 && f < t1 + 40 ? [70, -10] : [40, 30]} brazoAtras={f > t0 + 100 && f < t1 + 40 ? [60, 20] : undefined} boca={habla(f, t0 + 110, t1)} />
        <Rotulo x={810} y={SUELO - 440} texto="HERA" o={vida(f, 130, t1 + 20)} tam={30} />
        {/* Porfirión */}
        <Gigante id="porfirion" cola={false} x={po.x} y={SUELO + poCae * 220} s={1.45} voltear accion={poCae > 0 ? 'parado' : po.accion} tocado="corona" inclinar={-poCae * 85 + golpe * -10} brazo={poCae > 0 ? [40, 40] : f > t0 + 140 ? [165, 10] : [100, 0]} brazoAtras={[-30, -30]} boca={f > t0 + 60 && poCae === 0} ojosCerrados={poCae > 0.7} />
        <Rotulo x={1250} y={SUELO - 610} texto="PORFIRIÓN" o={vida(f, 140, t1 + 30)} />
        <Flecha a={manoDe({ x: 560, s: 1.08, brazo: [90, 0] })} b={[po.x - 30, SUELO - 300]} t={(f - (t1 + 50)) / 14} />
        {/* Efialtes */}
        <Gigante id="efialtes" x={ex} y={SUELO + efCae * 40} s={es} voltear inclinar={-efCae * 70} brazo={f > t2 + 90 && efCae === 0 ? [140 + Math.sin(f / 7) * 18, 20] : [40, 40]} brazoAtras={[-120, -20]} boca={f > t2 + 60 && efCae < 0.5} ojosCerrados={efCae > 0.3} />
        <Rotulo x={ex - 40} y={SUELO - 650} texto="EFIALTES" o={vida(f, t2 + 70, t3 + 20)} />
        <Flecha a={apM} b={ojo} t={flechaAp} clavada={f < t3 + 95} />
        <Flecha a={heM} b={ojo} t={flechaHe} clavada={f < t3 + 95} />
        {[t3 + 38, t3 + 88].map((a) => f > a && f < a + 22 && <circle key={a} cx={ojo[0]} cy={ojo[1]} r={80} fill="url(#halo)" opacity={pulso(f, a, 22)} style={{ mixBlendMode: 'screen' }} />)}
        {/* Apolo */}
        <Personaje x={ap0.x} s={1.02} accion={ap0.accion} voltear barba={false} tocado="laurel" objeto="arco" brazo={f > t3 && f < t4 ? [92, 0] : [30, 20]} />
        <Rotulo x={ap0.x - 10} y={SUELO - 450} texto="APOLO" o={vida(f, t3, t3 + 100)} tam={30} />
        {/* Heracles */}
        <Personaje x={he.x} s={1.08} accion={he.accion} objeto="arco" brazo={heApunta ? [90, 0] : [30, 30]} />
        <PielLeon x={he.x} s={1.08} f={f} />
        <Rotulo x={he.x + 10} y={SUELO - 480} texto="HERACLES" o={vida(f, t1 + 20, t1 + 120)} tam={30} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 7 · Encélado y el Etna
const Encelado: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -100, 1], [t1 - 10, 700, 1], [t1 + 100, 800, 0.88], [t1 + 160, 1000, 0.86], [t2 + 20, 1330, 0.92], [t3, 1380, 1], [dur, 1400, 1.06]];
  const mar = SUELO - 60;
  // Encélado huye
  const en1 = andar(f, 0, t1 - 10, 420, 1360, true);
  const en2 = andar(f, t1 - 10, t1 + 120, 1360, 2300);
  const ex = f < t1 - 10 ? en1.x : en2.x;
  const ey = SUELO + entre(f, t1 - 10, t1 + 40, 0, 150);
  // Atenea
  const at1 = andar(f, 10, t1 + 20, -160, 1150, true);
  const alza = entre(f, t1 + 40, t1 + 100, 0, 1);
  const aB: [number, number] = alza > 0 && f < t1 + 150 ? [entre(f, t1 + 40, t1 + 70, 30, 172), 0] : f >= t1 + 150 && f < t1 + 175 ? [95, 0] : [40, 20];
  const tiro = (f - (t1 + 150)) / 45;
  const isX = tiro <= 0 ? lerp([1720, 0], [1180, 0], alza)[0] : lerp([1180, 0], [2300, 0], Math.min(1, tiro))[0];
  const isY = tiro <= 0 ? entre(f, t1 + 40, t1 + 100, 900, 250) : lerp([0, 250], [0, mar + 30], Math.min(1, tiro))[1] - Math.sin(Math.min(1, tiro) * Math.PI) * 180;
  const isS = tiro <= 0 ? 0.55 : 0.55 + Math.min(1, tiro) * 0.45;
  const cayo = tiro >= 1;
  const etna = ap(f, t3 - 20, 40);
  const respira = cayo ? Math.sin(f / 18) * 4 : 0;
  const sacude = pulso(f, t1 + 195, 30) + (f > t3 ? 0.25 + Math.max(0, Math.sin(f / 18)) * 0.4 : 0);
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.08}><Sol x={1700} y={280} r={44} f={f} /></Capa>
      <Velo o={etna * 0.3} color="#3A0A04" />
      <Capa p={0.25}>
        <Monte x={200} alto={330} ancho={520} />
        <Nube x={1200} y={220} s={0.6} f={f} />
        <Isla x={2600} y={SUELO - 70} ancho={500} alto={140} f={f} color="#7A3A1C" arboles={0} />
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={sacude}>
          <Suelo desde={-1200} hasta={1480} />
          <path d={`M1380 ${SUELO + 50} L 1400 ${SUELO - 60} C 1440 ${SUELO - 90}, 1500 ${SUELO - 70}, 1530 ${SUELO - 20} L 1560 ${SUELO + 50} Z`} fill={C.negro} />
          {/* Encélado (en el agua, detrás de las olas) */}
          {!cayo && <Gigante id="encelado" cola={false} x={ex} y={ey} s={1.4} recorte={ex > 1460 ? mar + 30 : undefined} accion={f < t1 + 120 ? (f < t1 - 10 ? 'correr' : 'caminar') : 'parado'} cabeza={f > t1 + 120 ? 20 : -6} brazo={f > t1 + 120 ? [150, 30] : undefined} brazoAtras={f > t1 + 120 ? [-150, -20] : undefined} boca={f > t1 + 120 || Math.floor(f / 8) % 3 === 0} />}
          {/* la isla de Sicilia */}
          {cayo && (
            <g transform={`translate(0 ${respira})`}>
              <Isla x={2300} y={mar + 30} ancho={720} alto={250} volcan f={f} humo={etna} arboles={4} seed={3} />
            </g>
          )}
          <Mar desde={1450} hasta={5200} y={mar} f={f} id="encelado" />
          {/* la mano del gigante asoma bajo la isla */}
          {cayo && f < t3 + 30 && (
            <g opacity={1 - ap(f, t3, 30)}>
              <path d={suave([[2700, mar + 60], [2730, mar - 20 + Math.sin(f / 4) * 10], [2770, mar - 60 + Math.sin(f / 5) * 14]])} stroke={C.negro} strokeWidth={26} fill="none" strokeLinecap="round" />
              <circle cx={2772} cy={mar - 66 + Math.sin(f / 5) * 14} r={16} fill={C.negro} />
            </g>
          )}
          <Salpicadura x={2300} y={mar + 20} t={(f - (t1 + 195)) / 40} s={1.5} />
          {/* Atenea con la isla en alto */}
          {!cayo && (
            <g opacity={tiro > 0 ? 1 : ap(f, t1 + 40, 20)}>
              <Isla x={isX} y={isY} ancho={720} alto={250} s={isS} rot={tiro > 0 ? Math.min(1, tiro) * 15 : 0} volcan raiz f={f} arboles={4} seed={3} />
            </g>
          )}
          <Personaje x={at1.x} accion={at1.accion} mujer tocado="casco" objeto={alza > 0 && f < t1 + 175 ? null : 'lanza'} escudo={!(alza > 0 && f < t1 + 175)} brazo={aB} brazoAtras={alza > 0 && f < t1 + 150 ? [-172, -10] : undefined} />
          <Rotulo x={at1.x + 20} y={SUELO - 460} texto="ATENEA" o={vida(f, 40, t1 + 20)} tam={30} />
          <Rotulo x={ex} y={SUELO - 590} texto="ENCÉLADO" o={vida(f, 130, t1 + 60)} />
          <Rotulo x={2300} y={mar - 330} texto="SICILIA" o={vida(f, t2 + 10, t3 + 20)} tam={32} />
          <Rotulo x={2620} y={mar - 330} texto="ETNA" o={vida(f, t3 + 30, dur, 20)} tam={34} color={C.oro} />
          {f > t3 && <Chispas x={2300} y={mar - 220} f={f} n={26} viento={-0.6} />}
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 8 · Polibotes y el mar
const Polibotes: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, -100, 1], [t1 + 20, 1000, 0.85], [t2, 1150, 0.85], [t2 + 60, 1250, 0.85], [t3, 1250, 0.85], [dur, 1290, 0.88]];
  const mar = SUELO - 60;
  const pb = andar(f, 0, t1 + 60, 380, 2860);
  const ps = andar(f, 0, t1 - 10, -60, 1540, true);
  const golpe = t1 + 70;
  const pB: [number, number] = f < t1 + 20 ? [60, 30] : f < golpe ? [entre(f, t1 + 20, t1 + 50, 60, 165), 0] : f < golpe + 8 ? [entre(f, golpe, golpe + 6, 165, 110), 0] : f < t2 ? [110, 0] : f < t2 + 30 ? [entre(f, t2, t2 + 25, 110, 170), 0] : f < t2 + 40 ? [entre(f, t2 + 30, t2 + 38, 170, 95), 0] : f > t3 + 20 ? [140, 20] : [60, 30];
  const pm = manoDe({ x: ps.x, y: mar + 10, s: 1.08, brazo: pB });
  const grieta = ap(f, golpe, 12);
  const vuela = (f - (t2 + 35)) / 40;
  const pedazoX = f < t2 ? 2440 : vuela <= 0 ? entre(f, t2, t2 + 30, 2440, 2300) : lerp([2300, 0], [2900, 0], Math.min(1, vuela))[0];
  const pedazoY = f < t2 ? mar + 30 : vuela <= 0 ? entre(f, t2, t2 + 30, mar + 30, 360) : lerp([0, 360], [0, mar + 30], Math.min(1, vuela))[1] - Math.sin(Math.min(1, vuela) * Math.PI) * 160;
  const cayo = vuela >= 1;
  const miedo = f > t2;
  return (
    <Escenario dur={dur} camara={cam} cielo="mar">
      <Capa p={0.08}><Sol x={1500} y={270} r={44} f={f} /></Capa>
      <Capa p={0.2}>
        <Nube x={500} y={230} s={0.6} f={f} />
        <Nube x={1600} y={260} s={0.5} f={f} />
        {Array.from({ length: 4 }, (_, i) => <Gaviota key={i} x={600 + i * 200 + ((f * 1.5) % 600)} y={300 + (i % 2) * 40} f={f} s={0.8} k={i} />)}
      </Capa>
      <Capa p={0.4}>
        <Isla x={600} y={SUELO - 60} ancho={600} alto={150} f={f} color="#7A3A1C" arboles={0} />
      </Capa>
      <Capa p={1}>
        <Tiembla f={f} k={pulso(f, golpe, 20) + pulso(f, t2 + 75, 26)}>
          {/* Polibotes */}
          {!cayo && <Gigante id="polibotes" cola={false} x={pb.x} y={SUELO + 150} s={1.4} recorte={mar + 30} accion={pb.accion} cabeza={miedo ? 22 : -8} voltear={f > t1 + 60 && !miedo ? true : false} brazo={miedo ? [160, 30] : undefined} brazoAtras={miedo ? [-160, -20] : undefined} boca={Math.floor(f / 7) % 3 === 0} />}
          {/* Cos y el pedazo que se desprende */}
          <Isla x={2000} y={mar + 30} ancho={700} alto={270} f={f} arboles={4} seed={7} />
          {grieta > 0 && f < t2 + 5 && <path d={`M2310 ${mar + 30} L 2290 ${mar - 40} L 2330 ${mar - 90} L 2300 ${mar - 150}`} stroke={C.blanco} strokeWidth={6 * grieta} fill="none" />}
          <Isla x={pedazoX} y={pedazoY} ancho={300} alto={200} raiz={f > t2 - 5 && !cayo} volcan={cayo} humo={cayo ? ap(f, t3, 40) * 0.6 : 0} rot={vuela > 0 && !cayo ? Math.min(1, vuela) * 20 : 0} f={f} arboles={2} seed={9} />
          <Mar desde={-1200} hasta={5200} y={mar} f={f} id="polibotes" />
          <Salpicadura x={2900} y={mar + 20} t={(f - (t2 + 75)) / 40} s={1.3} />
          {f > golpe && f < golpe + 20 && <circle cx={2310} cy={mar - 60} r={140} fill="url(#haloBlanco)" opacity={pulso(f, golpe, 20)} />}
          {/* Poseidón sobre las olas */}
          <Personaje x={ps.x} y={mar + 10} s={1.08} accion={ps.accion} tocado="corona" capa={C.purpura} objeto="tridente" brazo={pB} boca={f > t3 + 20} />
          {f > t2 - 5 && f < t2 + 40 && <line x1={pm[0]} y1={pm[1] - 220} x2={pedazoX} y2={pedazoY - 100} stroke={C.blanco} strokeWidth={3} strokeDasharray="6 10" opacity={0.7} />}
          <Rotulo x={ps.x + 20} y={mar - 440} texto="POSEIDÓN" o={vida(f, 40, t1 + 40)} tam={30} />
          <Rotulo x={pb.x} y={SUELO - 470} texto="POLIBOTES" o={vida(f, 130, t1 + 60)} tam={30} />
          <Rotulo x={2000} y={mar - 320} texto="COS" o={vida(f, t1 + 10, t2 + 20)} tam={32} />
          <Rotulo x={3120} y={mar - 150} texto="NÍSIROS" o={vida(f, t3 + 20, dur, 20)} tam={36} color={C.oro} />
        </Tiembla>
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 9 · Todos los dioses a la guerra
const Dioses: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t1 = at(1), t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  const cam: Cam = [[0, -300, 0.95], [t1 - 20, 250, 1], [t1 + 25, 700, 1], [t2, 820, 1], [t2 + 40, 1700, 1], [t3, 1800, 1], [t3 + 40, 2600, 1], [t4, 2720, 1], [t4 + 40, 3500, 1], [t5, 3640, 1], [t5 + 80, 4320, 0.72], [dur, 4360, 0.74]];
  // f0: carga de los dioses
  const carga = (i: number) => andar(f, 0, t1, -350 + i * 170, 250 + i * 180, true);
  // Hefesto y Mimas
  const vierte = entre(f, t1 + 20, t1 + 50, 0, 1) * (1 - entre(f, t2 + 10, t2 + 30, 0, 1));
  const hfB: [number, number] = [entre(f, t1 + 10, t1 + 40, 40, 100), entre(f, t1 + 10, t1 + 40, 40, -10)];
  const hfM = manoDe({ x: 1300, s: 1.05, brazo: hfB });
  const crRot = -vierte * 50;
  const pico: P = [hfM[0] + Math.cos((crRot * Math.PI) / 180) * 120, hfM[1] + Math.sin((crRot * Math.PI) / 180) * 120 - 20];
  const mimasCae = entre(f, t2, t2 + 30, 0, 1);
  // Dioniso y Éurito
  const golpeD = t2 + 40;
  const diB: [number, number] = f < golpeD - 25 ? [40, 30] : f < golpeD ? [entre(f, golpeD - 25, golpeD - 8, 40, 175), 0] : [entre(f, golpeD, golpeD + 8, 175, 85), 0];
  const euCae = entre(f, golpeD + 6, golpeD + 30, 0, 1);
  // Hermes invisible e Hipólito
  const golpeH = t3 + 120;
  const he = andar(f, t3, golpeH - 20, 2950, 3330);
  const heO = f > golpeH - 10 && f < golpeH + 40 ? 0.9 : 0.16 + Math.sin(f / 3) * 0.05;
  const heB: [number, number] = f < golpeH - 15 ? [60, 30] : f < golpeH ? [entre(f, golpeH - 15, golpeH - 3, 60, 175), 0] : [entre(f, golpeH, golpeH + 8, 175, 90), 0];
  const hiCae = entre(f, golpeH + 6, golpeH + 30, 0, 1);
  // Heracles remata
  const gxs = [4700, 5020, 5340];
  const hcM = manoDe({ x: 4300, s: 1.08, brazo: [90, 0] });
  const flecha = (i: number) => (f - (t4 + 10 + i * 38)) / 16;
  const remate = (i: number) => entre(f, t4 + 26 + i * 38, t4 + 50 + i * 38, 0, 1);
  const paz = ap(f, t5 + 40, 40);
  const caido = (x: number, c: number, id: string, s = 1.3) => <Gigante id={id} x={x} y={SUELO + c * 34} s={s} voltear inclinar={-c * 78} ojosCerrados={c > 0.5} brazo={c > 0.5 ? [80, 20] : [140 + Math.sin(f / 6) * 15, 20]} brazoAtras={[-110, -20]} boca={c < 0.5} />;
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}>
        <g opacity={0.35 + paz * 0.65}><Sol x={1900} y={280 - paz * 30} r={50} f={f} /></g>
      </Capa>
      <Velo o={0.25 * (1 - paz)} color="#3A1206" />
      <Capa p={0.3}>
        <Cumbre x={200} cima={SUELO - 400} ancho={1000} meseta={130} color={C.barroOscuro} o={0.8} />
        <Monte x={1300} alto={300} ancho={600} o={0.45} />
        <Monte x={2300} alto={360} ancho={700} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-1500} hasta={7600} />
        {/* la carga */}
        {[0, 1, 2, 3].map((i) => {
          const c = carga(i);
          return <Personaje key={i} x={c.x} s={1.02} accion={c.accion} mujer={i === 0 || i === 3} tocado={i === 0 ? 'casco' : i === 1 ? 'casco' : i === 2 ? 'corona' : 'diadema'} ropa={i === 1 ? 'armadura' : i === 3 ? 'corta' : undefined} objeto={i === 0 ? 'lanza' : i === 1 ? 'espada' : i === 2 ? 'rayo' : 'arco'} escudo={i < 2} capa={i === 2 ? C.purpura : null} emblema={i === 1 ? 'leon' : 'gorgona'} />;
        })}
        {/* Hefesto y Mimas */}
        <Chorro a={pico} b={[1600, SUELO - 380]} f={f} o={vierte} />
        {vierte > 0.5 && <Chispas x={1600} y={SUELO - 380} f={f} n={20} viento={0.8} />}
        <Gigante id="mimas" x={1660} y={SUELO + mimasCae * 34} s={1.35} voltear inclinar={-mimasCae * 78 + vierte * Math.sin(f / 3) * 6} brazo={[150 + Math.sin(f / 4) * 20, 30]} brazoAtras={[-140, -20]} boca={mimasCae < 0.5} ojosCerrados={mimasCae > 0.5} />
        <Personaje x={1300} s={1.05} barba objeto={null} brazo={hfB} cabeza={4} />
        <Crisol x={hfM[0]} y={hfM[1]} rot={crRot} f={f} />
        <Rotulo x={1300} y={SUELO - 450} texto="HEFESTO" o={vida(f, t1 + 10, t2 + 20)} tam={30} />
        <Rotulo x={1680} y={SUELO - 600} texto="MIMAS" o={vida(f, t1 + 30, t2 + 20)} tam={30} />
        {/* Dioniso y Éurito */}
        <Personaje x={2300} s={1.05} ropa="larga" tocado="laurel" objeto="tirso" brazo={diB} capa={null} />
        {caido(2620, euCae, 'eurito')}
        {f > golpeD && f < golpeD + 20 && <circle cx={2560} cy={SUELO - 420} r={120} fill="url(#halo)" opacity={pulso(f, golpeD, 20)} style={{ mixBlendMode: 'screen' }} />}
        {Array.from({ length: 6 }, (_, i) => {
          const g = ap(f, golpeD + 10 + i * 6, 14);
          const x = 2480 + i * 40, y = SUELO - 20 - (i % 3) * 40;
          return g > 0 && <ellipse key={i} cx={x} cy={y} rx={9 * g} ry={15 * g} fill="#3E5A2A" stroke={C.negro} strokeWidth={1.5} transform={`rotate(${i * 50} ${x} ${y})`} />;
        })}
        <Rotulo x={2300} y={SUELO - 450} texto="DIONISO" o={vida(f, t2 + 10, t3 + 10)} tam={30} />
        <Rotulo x={2640} y={SUELO - 600} texto="ÉURITO" o={vida(f, t2 + 20, t3 + 10)} tam={30} />
        {/* Hermes invisible con el casco de Hades */}
        {caido(3640, hiCae, 'hipolito')}
        <g opacity={heO}>
          <Personaje x={he.x} s={1.05} accion={he.accion} tocado="casco" alas objeto="espada" brazo={heB} contorno />
        </g>
        {f > golpeH && f < golpeH + 20 && <circle cx={3560} cy={SUELO - 420} r={120} fill="url(#haloBlanco)" opacity={pulso(f, golpeH, 20)} />}
        <Rotulo x={he.x + 10} y={SUELO - 450} texto="HERMES" o={vida(f, t3 + 20, t4) * 0.9} tam={30} />
        <Rotulo x={3660} y={SUELO - 600} texto="HIPÓLITO" o={vida(f, t3 + 30, t4)} tam={30} />
        {/* Heracles remata */}
        {gxs.map((x, i) => <g key={i}>{caido(x, remate(i), `rem${i}`, 1.25 - i * 0.05)}<Flecha a={hcM} b={[x - 30, SUELO - 300]} t={flecha(i)} /></g>)}
        {caido(5680, 1, 'yace1', 1.2)}
        <Personaje x={4300} s={1.08} objeto="arco" brazo={f > t4 && f < t5 + 20 ? [90, 0] : [150, 10]} />
        <PielLeon x={4300} s={1.08} f={f} />
        <Rotulo x={4310} y={SUELO - 480} texto="HERACLES" o={vida(f, t4, t5)} tam={30} />
        {/* la victoria */}
        {[4760, 5100, 5700].map((x, i) => <Humo key={x} x={x} y={SUELO - 20} f={f + i * 30} n={5} s={0.8} o={paz * 0.8} />)}
        <g opacity={ap(f, t5 + 20, 30)}>
          <Personaje x={6060} y={SUELO} s={1.05} tocado="corona" capa={C.purpura} objeto="rayo" brazo={[160, 10]} voltear />
          <Personaje x={6280} s={1.02} mujer tocado="casco" objeto="lanza" escudo brazo={[150, 10]} voltear />
          <Personaje x={6500} s={1.02} barba={false} tocado="laurel" objeto="lira" brazo={[100, -10]} voltear />
        </g>
        <Rotulo x={5280} y={60} texto="VICTORIA DEL OLIMPO" o={ap(f, t5 + 70, 30)} tam={66} color={C.oro} />
      </Capa>
    </Escenario>
  );
};

// ---------------------------------------------------------------- 10 · El último hijo
const Cierre: React.FC<EscenaV> = ({ dur, at }) => {
  const f = useCurrentFrame();
  const t0 = at(0), t1 = at(1), t2 = at(2), t3 = at(3);
  const cam: Cam = [[0, 0, 1], [t0 + 50, 0, 1], [t0 + 110, 900, 1], [t2 - 20, 920, 1], [t2 + 70, 900, 0.55], [dur, 900, 0.6]];
  const gx = 1700;
  const sube = ap(f, t0 + 50, 50) * (1 - entre(f, t1 + 90, t1 + 160, 0, 1));
  const abismo = ap(f, t1, 50);
  const noche = ap(f, t1 + 20, 80);
  const ts = 2.6, tx = 1900;
  const tsube = entre(f, t2 - 20, t2 + 90, 0, 1, Easing.out(Easing.cubic));
  const ty = SUELO + (1 - tsube) * 1000;
  const ojos = ap(f, t2 + 70, 20);
  const head = cabezaDe({ x: tx, y: ty, s: ts, gigante: true, voltear: true });
  return (
    <Escenario dur={dur} camara={cam}>
      <Capa p={0.06}><g opacity={1 - noche}><Sol x={500} y={280} r={50} f={f} /></g></Capa>
      <Velo o={noche * 0.8} color="#120604" />
      <Capa p={0.04}>
        <g opacity={noche}><Estrellas n={90} f={f} area={[-1200, -600, 4200, 900]} seed={6} /></g>
      </Capa>
      <Capa p={0.3}>
        <Monte x={1600} alto={300} ancho={700} o={0.45} />
      </Capa>
      <Capa p={1}>
        <Suelo desde={-2400} hasta={5200} />
        {/* el Olimpo a salvo */}
        <Cumbre x={540} cima={570} ancho={1100} meseta={280} />
        <Personaje x={340} y={570} s={0.7} mujer tocado="casco" objeto="lanza" escudo brazo={[140, 10]} />
        <Personaje x={470} y={570} s={0.72} tocado="corona" capa={C.purpura} objeto="rayo" brazo={[150, 10]} />
        <Personaje x={610} y={570} s={0.7} barba={false} tocado="laurel" objeto="lira" brazo={[100, -10]} />
        <Personaje x={730} y={570} s={0.72} objeto="arco" brazo={[140, 10]} />
        <PielLeon x={730} y={570} s={0.72} f={f} />
        <circle cx={540} cy={400} r={260} fill="url(#halo)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
        {/* Gea y el Tártaro */}
        <Grieta x={gx} ancho={700} abre={abismo} f={f} seed={3} />
        {abismo > 0 && <circle cx={gx} cy={SUELO} r={420 * abismo} fill="url(#halo)" opacity={abismo * 0.7} style={{ mixBlendMode: 'screen' }} />}
        {abismo > 0 && <Humo x={gx - 200} y={SUELO} f={f} n={6} s={1} o={abismo * (1 - tsube)} color="#1E0C06" />}
        {abismo > 0 && <Humo x={gx + 220} y={SUELO} f={f + 40} n={6} s={1} o={abismo * (1 - tsube)} color="#1E0C06" />}
        {/* Tifón */}
        {tsube > 0 && (
          <g>
            <defs><clipPath id="tifon-suelo"><rect x={-4000} y={-6000} width={10000} height={SUELO + 6006} /></clipPath></defs>
            <g clipPath="url(#tifon-suelo)">
              <AlasGrandes x={tx} y={ty} s={ts} voltear f={f} claro />
              <CuellosSerpiente x={tx} y={ty} s={ts} voltear f={f} n={8} largo={0.75} claro />
              <Gigante id="tifon" x={tx} y={ty} s={ts} voltear contorno brazo={[105 + Math.sin(f / 9) * 12, 25]} brazoAtras={[-120, -30]} boca={f > t2 + 60} cabeza={0} />
            </g>
            <circle cx={head[0]} cy={head[1]} r={120} fill="url(#halo)" opacity={ojos * (0.7 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />
            <circle cx={head[0] - 4} cy={head[1]} r={9} fill={LAVA} opacity={ojos} stroke={C.oro} strokeWidth={3} />
            <Relampago a={[head[0] - 500, -900]} b={[head[0] - 260, head[1] + 200]} f={f} desde={t3 + 10} dur={16} />
            <Relampago a={[head[0] + 600, -900]} b={[head[0] + 380, head[1] + 300]} f={f} desde={t3 + 60} dur={16} />
          </g>
        )}
        {sube > 0.03 && <Gea x={gx} s={1.4} sube={sube} voltear brazo={f < t1 ? [100, -20] : [160, 10]} brazoAtras={f < t1 ? undefined : [-160, -10]} f={f} enojo={0.6 + Math.sin(f / 6) * 0.2} boca={f > t0 + 70 && f < t1 + 90} id="cierre" />}
        <Rotulo x={gx} y={SUELO - 430} texto="GEA" o={vida(f, t0 + 90, t1 + 60)} />
        <Rotulo x={tx - 1050} y={head[1] + 120} texto="TIFÓN" o={ap(f, t3 + 10, 25)} tam={120} color={C.oro} />
      </Capa>
    </Escenario>
  );
};

export const ESCENAS: Record<string, React.FC<EscenaV>> = {
  furia: Furia,
  gigantes: Nacen,
  asalto: Asalto,
  profecia: Hierbas,
  heracles: Alcioneo,
  porfirion: Porfirion,
  encelado: Encelado,
  polibotes: Polibotes,
  dioses: Dioses,
  cierre: Cierre,
};

void Fuego; void LAVA; void TIERRA;
