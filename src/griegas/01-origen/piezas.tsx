// Piezas propias de "El origen del mundo" en estilo vasija (siluetas negras, incisiones crema, púrpura y blanco añadidos).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, azar, Personaje, PersonajeProps, Estrellas } from '../../comun/vasija';

// ---------- geometría de Personaje ----------
const rotar = (p: P, inclinar: number): P => {
  const r = (inclinar * Math.PI) / 180, dx = p[0], dy = p[1] + 176;
  return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r) - 176];
};
/** Posición en el mundo de la mano de adelante de un Personaje. */
export function mano(x: number, y: number, s: number, voltear: boolean | undefined, brazo: [number, number], inclinar = 0): P {
  const hD: P = [14, -292], cD = desde(hD, brazo[0], 66), mD = desde(cD, brazo[0] + brazo[1], 60);
  const r = rotar(mD, inclinar);
  return [x + (voltear ? -1 : 1) * s * r[0], y + s * r[1]];
}
/** Posición en el mundo de la boca de un Personaje. */
export function boca(x: number, y: number, s: number, voltear: boolean | undefined, gigante = false, inclinar = 0): P {
  const r = rotar([20 * (gigante ? 1.35 : 1) + 30, -318], inclinar);
  return [x + (voltear ? -1 : 1) * s * r[0], y + s * r[1]];
}

/** Grupo con la misma transformación que un Personaje (para agregarle partes). */
const Marco: React.FC<{ x: number; y: number; s: number; voltear?: boolean; inclinar?: number; children: React.ReactNode; opacity?: number }> = ({ x, y, s, voltear, inclinar = 0, children, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(${inclinar} 0 -176)`} opacity={opacity}>{children}</g>
);

/** Cíclope: gigante de un solo ojo en la frente. */
export const Ciclope: React.FC<PersonajeProps> = (p) => {
  const s = p.s ?? 1, y = p.y ?? SUELO;
  return (
    <g>
      <Personaje gigante barba ropa="desnudo" tocado={null} {...p} />
      <Marco x={p.x} y={y} s={s} voltear={p.voltear} inclinar={p.inclinar} opacity={p.opacity}>
        <g transform={`translate(${20 * 1.35} -334) rotate(${-6 - (p.cabeza ?? 0)})`}>
          <ellipse cx={18} cy={-8} rx={12} ry={8} fill={C.negro} />
          <ellipse cx={18} cy={-16} rx={13} ry={6} fill={C.negro} />
          <path d="M2 -16 Q 14 -30 28 -16 Q 14 -6 2 -16 Z" fill={C.crema} stroke={C.negro} strokeWidth={1.5} />
          <circle cx={16} cy={-16} r={4.6} fill={C.negro} />
          <Inc d="M0 -26 Q 14 -38 30 -25" w={2.4} />
        </g>
      </Marco>
    </g>
  );
};

/** Hecatónquiro: gigante con un abanico de brazos que se agitan. */
export const Hecatonquiro: React.FC<PersonajeProps & { rocas?: boolean }> = ({ rocas, ...p }) => {
  const f = useCurrentFrame();
  const s = p.s ?? 1, y = p.y ?? SUELO;
  const angs = [110, 128, 146, 164, 182, 200, -110, -130, -150, -170, -190];
  return (
    <g>
      <Marco x={p.x} y={y} s={s} voltear={p.voltear} inclinar={p.inclinar} opacity={p.opacity}>
        {angs.map((a, i) => {
          const h: P = [4, -292], w = Math.sin(f / 7 + i * 1.7) * 12;
          const c = desde(h, a + w, 62), m = desde(c, a + w + (a > 0 ? -30 : 30), 56);
          return (
            <g key={i}>
              <path d={miembro([h, c, m], [22, 15, 10])} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
              <circle cx={m[0]} cy={m[1]} r={9} fill={C.negro} stroke={C.crema} strokeWidth={1.2} />
              {rocas && i % 3 === 0 && <Roca x={m[0]} y={m[1] - 14} s={0.35} />}
            </g>
          );
        })}
      </Marco>
      <Personaje gigante barba ropa="desnudo" tocado={null} {...p} />
    </g>
  );
};

/** Alas en la espalda (Eros, Nix). Se dibujan antes que el Personaje. */
export const Alas: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; inclinar?: number; aleteo?: number; color?: string; opacity?: number }> = ({ x, y = SUELO, s = 1, voltear, inclinar = 0, aleteo = 1, color = C.negro, opacity = 1 }) => {
  const f = useCurrentFrame();
  const ang = Math.sin(f / 4) * 16 * aleteo;
  const ala: P[] = [[-2, -298], [-40, -350], [-100, -404], [-170, -420], [-150, -390], [-176, -376], [-140, -352], [-160, -332], [-118, -318], [-130, -298], [-80, -282], [-24, -262]];
  return (
    <Marco x={x} y={y} s={s} voltear={voltear} inclinar={inclinar} opacity={opacity}>
      <g transform={`rotate(${ang} -6 -290)`}>
        <path d={suave(ala, true, 0.8)} fill={color} stroke={C.negro} strokeWidth={2} />
        <Borde d={suave([[-14, -300], [-60, -350], [-120, -392]])} w={10} />
        {[0, 1, 2, 3, 4].map((i) => <Inc key={i} d={suave([[-40 - i * 14, -318 + i * 4], [-90 - i * 14, -350 + i * 10], [-140 - i * 6, -378 + i * 14]])} w={1.6} />)}
      </g>
    </Marco>
  );
};

/** Bebé envuelto en pañales (o una piedra envuelta). Origen = centro. */
export const Bebe: React.FC<{ x: number; y: number; s?: number; piedra?: boolean; rot?: number; halo?: number }> = ({ x, y, s = 1, piedra, rot = -15, halo = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {halo > 0 && <circle r={90} fill="url(#haloBlanco)" opacity={halo} />}
    <path d={suave([[-34, 0], [-26, -16], [10, -18], [30, -10], [34, 4], [20, 16], [-20, 16]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />
    <Borde d="M-14 -16 Q -8 0 -16 15" w={6} />
    <Borde d="M8 -17 Q 14 0 6 16" w={6} />
    {piedra ? (
      <g>
        <path d={suave([[26, -14], [44, -18], [56, -6], [52, 10], [34, 12]], true)} fill="#8E8478" stroke={C.negro} strokeWidth={2.5} />
        <Inc d="M38 -8 l 8 6 M44 4 l 6 -3" c={C.negro} w={1.6} />
      </g>
    ) : (
      <g>
        <circle cx={42} cy={-4} r={15} fill={C.negro} />
        <path d="M40 -8 Q 46 -11 51 -8" stroke={C.crema} strokeWidth={1.8} fill="none" />
        <Inc d="M30 -16 q 6 -6 14 -2" w={1.4} />
      </g>
    )}
  </g>
);

/** Roca con grietas incisas. Origen = centro. */
export const Roca: React.FC<{ x: number; y: number; s?: number; rot?: number; seed?: number; color?: string }> = ({ x, y, s = 1, rot = 0, seed = 1, color = C.negro }) => {
  const pts: P[] = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2, r = 40 + azar(i + seed * 7) * 18;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.8];
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={suave(pts, true)} fill={color} stroke={C.negro} strokeWidth={2} />
      <Inc d={suave([[-20, -14], [-4, -4], [6, -16]])} w={2} />
      <Inc d={suave([[8, 8], [22, 14]])} w={1.8} />
    </g>
  );
};

/** Ónfalo: la piedra "ombligo del mundo", con su red tallada. Origen = base. */
export const Onfalo: React.FC<{ x: number; y?: number; s?: number; brillo?: number }> = ({ x, y = SUELO, s = 1, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 && <circle cy={-80} r={200} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
    <rect x={-90} y={-24} width={180} height={24} fill={C.negro} />
    <Borde d="M-90 -14 H90" w={8} />
    <path d="M-70 -24 C -74 -110, -36 -160, 0 -160 C 36 -160, 74 -110, 70 -24 Z" fill={C.negro} />
    <defs>
      <clipPath id="onfaloRed"><path d="M-70 -24 C -74 -110, -36 -160, 0 -160 C 36 -160, 74 -110, 70 -24 Z" /></clipPath>
    </defs>
    <g clipPath="url(#onfaloRed)">
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-120 + i * 30} -10 L${-20 + i * 30} -170`} stroke={C.crema} strokeWidth={2} />)}
      {Array.from({ length: 9 }, (_, i) => <path key={`b${i}`} d={`M${-120 + i * 30} -170 L${-20 + i * 30} -10`} stroke={C.crema} strokeWidth={2} />)}
    </g>
    <path d="M-50 -150 C -20 -170, 20 -170, 50 -150" stroke={C.purpura} strokeWidth={6} fill="none" />
  </g>
);

/** Cabra (Amaltea), mirando a la derecha. Origen = suelo bajo el cuerpo. */
export const Cabra: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; camina?: boolean; cabeza?: number }> = ({ x, y = SUELO, s = 1, voltear, camina, cabeza = 0 }) => {
  const f = useCurrentFrame();
  const ph = camina ? f * 0.25 : 0;
  const pata = (bx: number, k: number) => {
    const a = camina ? Math.sin(ph + k) * 18 : 0;
    const top: P = [bx, -70], rod = desde(top, a, 36), pie = desde(rod, a * 0.4, 34);
    return <path key={bx} d={miembro([top, rod, pie], [16, 9, 6])} fill={C.negro} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      {pata(-46, Math.PI)}{pata(36, 0)}
      <path d={suave([[-66, -100], [-30, -112], [30, -110], [58, -104], [66, -80], [50, -62], [-40, -60], [-70, -74]], true)} fill={C.negro} />
      <path d="M-66 -96 q -14 -6 -12 -22 q 8 8 14 10" fill={C.negro} />
      {pata(-36, 0)}{pata(46, Math.PI)}
      <g transform={`rotate(${cabeza} 56 -104)`}>
        <path d={suave([[48, -104], [62, -132], [80, -142], [96, -128], [100, -116], [86, -108], [66, -92]], true)} fill={C.negro} />
        <path d="M74 -140 C 60 -176, 30 -180, 20 -160 C 40 -168, 56 -160, 66 -136 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
        <path d="M90 -112 q 2 18 -8 26 q -2 -14 0 -24" fill={C.negro} />
        <circle cx={84} cy={-128} r={3.2} fill={C.crema} />
        <path d="M64 -136 l -16 -6 l 14 12 Z" fill={C.negro} />
      </g>
      <Borde d={suave([[50, -102], [40, -86], [48, -68]])} w={8} />
      <Inc d={suave([[-40, -96], [0, -100], [36, -96]])} w={1.6} />
      <Inc d={suave([[-30, -80], [10, -78], [40, -82]])} w={1.6} />
      <path d="M-10 -60 q 8 12 16 0" fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
    </g>
  );
};

/** Cueva en la ladera de un monte de Creta. Origen = base, centro de la boca. */
export const Cueva: React.FC<{ x: number; y?: number; s?: number; luz?: number }> = ({ x, y = SUELO, s = 1, luz = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-520 0 C -420 -200, -300 -380, -80 -430 C 100 -460, 260 -360, 360 -220 C 420 -130, 480 -60, 540 0 Z" fill={C.barroOscuro} />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 + r * 2 }, (_, i) => {
        const yy = -380 + r * 70, w = 120 + r * 90, cx = -40 - w + (i + 0.5) * ((w * 2) / (4 + r * 2));
        return <path key={`${r}-${i}`} d={`M${cx - 20} ${yy} a 20 14 0 0 1 40 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.4} />;
      }))}
      <path d="M-170 0 C -170 -150, -100 -250, 0 -250 C 100 -250, 170 -150, 170 0 Z" fill={C.negro} />
      {luz > 0 && <ellipse cx={0} cy={-90} rx={150} ry={130} fill="url(#halo)" opacity={luz * (0.8 + Math.sin(f / 8) * 0.1)} style={{ mixBlendMode: 'screen' }} />}
      {[-120, -70, -20, 40, 100].map((sx, i) => <path key={sx} d={`M${sx - 10} ${-236 + Math.abs(sx) * 0.5} l 10 ${30 + (i % 2) * 18} l 10 ${-30 - (i % 2) * 18} Z`} fill={C.barroOscuro} />)}
      <path d="M-170 0 C -170 -150, -100 -250, 0 -250 C 100 -250, 170 -150, 170 0" stroke={C.purpura} strokeWidth={8} fill="none" />
    </g>
  );
};

/** Grieta que se abre en la roca (el Tártaro). Origen = base. */
export const Grieta: React.FC<{ x: number; y?: number; abre: number; alto?: number }> = ({ x, y = SUELO, abre, alto = 320 }) => {
  const f = useCurrentFrame();
  const n = 9, izq: P[] = [], der: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, yy = -alto * (1 - t), jit = (azar(i * 3) - 0.5) * 50;
    const w = abre * (14 + 90 * Math.sin(Math.PI * Math.pow(t, 0.7)));
    izq.push([jit - w, yy]);
    der.push([jit + w, yy]);
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-380 0 C -330 -180, -200 -360, -40 -380 C 120 -390, 260 -260, 380 0 Z" fill={C.negro} />
      <ellipse cx={0} cy={-alto * 0.3} rx={260 * abre + 1} ry={260 * abre + 1} fill="url(#halo)" opacity={abre * (0.8 + Math.sin(f / 5) * 0.15)} style={{ mixBlendMode: 'screen' }} />
      <path d={suave([...izq, ...der.reverse()], true, 0.6)} fill="#B8331C" />
      <path d={suave([...izq.map(([a, b]) => [a * 0.5, b] as P), ...der.map(([a, b]) => [a * 0.5, b] as P)], true, 0.6)} fill={C.oro} opacity={0.85} />
      {Array.from({ length: 6 }, (_, i) => <Inc key={i} d={suave([[-300 + i * 110, -40 - (i % 3) * 60], [-270 + i * 110, -90 - (i % 3) * 60]])} w={2} />)}
    </g>
  );
};

/** Remolino del Caos: brazos de espiral que giran. */
export const Remolino: React.FC<{ x: number; y: number; r?: number; brazos?: number; vel?: number; color?: string; o?: number; grosor?: number }> = ({ x, y, r = 380, brazos = 5, vel = 1, color = C.negro, o = 1, grosor = 14 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${f * 0.6 * vel})`} opacity={o}>
      {Array.from({ length: brazos }, (_, k) => {
        const pts: P[] = Array.from({ length: 14 }, (_, i) => {
          const t = i / 13, a = t * Math.PI * 2.4 + (k / brazos) * Math.PI * 2, rr = 20 + t * r;
          return [Math.cos(a) * rr, Math.sin(a) * rr * 0.62];
        });
        return <path key={k} d={suave(pts)} stroke={color} strokeWidth={grosor * (0.6 + (k % 2) * 0.5)} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Bóveda de cielo nocturno (Urano), con estrellas. Origen = centro de la base. */
export const Boveda: React.FC<{ x: number; base?: number; ancho?: number; alto: number; id: string; o?: number }> = ({ x, base = SUELO, ancho = 1300, alto, id, o = 1 }) => {
  const f = useCurrentFrame();
  const d = `M${x - ancho} ${base} C ${x - ancho} ${base - alto * 1.3}, ${x + ancho} ${base - alto * 1.3}, ${x + ancho} ${base} Z`;
  return (
    <g opacity={o}>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <path d={d} fill="#1C1420" />
      <g clipPath={`url(#${id})`}>
        <Estrellas f={f} n={90} area={[x - ancho, base - alto, ancho * 2, alto]} seed={11} />
        <path d={`M${x - ancho} ${base - alto * 0.55} C ${x - ancho * 0.4} ${base - alto * 0.9}, ${x + ancho * 0.4} ${base - alto * 0.9}, ${x + ancho} ${base - alto * 0.55}`} stroke={C.crema} strokeWidth={30} opacity={0.08} fill="none" />
      </g>
      <path d={`M${x - ancho} ${base} C ${x - ancho} ${base - alto * 1.3}, ${x + ancho} ${base - alto * 1.3}, ${x + ancho} ${base}`} stroke={C.purpura} strokeWidth={10} fill="none" />
      <path d={`M${x - ancho} ${base} C ${x - ancho} ${base - alto * 1.3}, ${x + ancho} ${base - alto * 1.3}, ${x + ancho} ${base}`} stroke={C.blanco} strokeWidth={3} strokeDasharray="1 10" strokeLinecap="round" fill="none" />
    </g>
  );
};

/** Esfera celeste (la que carga Atlas). Origen = centro. */
export const Esfera: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 150 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><clipPath id="esferaClip"><circle r={r} /></clipPath></defs>
      <circle r={r} fill="#1C1420" stroke={C.negro} strokeWidth={5} />
      <g clipPath="url(#esferaClip)">
        {Array.from({ length: 40 }, (_, i) => {
          const lon = ((azar(i) * 360 + f * 0.8) % 360) - 180, lat = (azar(i + 50) - 0.5) * 160;
          const px = Math.sin((lon * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * r, py = Math.sin((lat * Math.PI) / 180) * r;
          const vis = Math.cos((lon * Math.PI) / 180);
          return vis > 0 ? <circle key={i} cx={px} cy={py} r={2 + azar(i + 9) * 2.5} fill={C.blanco} opacity={0.5 + vis * 0.5} /> : null;
        })}
        <g transform="rotate(-22)">
          <ellipse rx={r} ry={r * 0.28} fill="none" stroke={C.purpura} strokeWidth={14} />
          <ellipse rx={r} ry={r * 0.28} fill="none" stroke={C.blanco} strokeWidth={4} strokeDasharray="1 12" strokeLinecap="round" />
        </g>
        <ellipse rx={r * 0.35} ry={r} fill="none" stroke={C.crema} strokeWidth={1.5} opacity={0.5} />
        <ellipse rx={r * 0.75} ry={r} fill="none" stroke={C.crema} strokeWidth={1.5} opacity={0.4} />
      </g>
    </g>
  );
};

/** Yunque. Origen = base. */
export const Yunque: React.FC<{ x: number; y?: number; s?: number; brasa?: number }> = ({ x, y = SUELO, s = 1, brasa = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 L-30 -50 L-60 -60 L-110 -64 C -90 -80, -70 -90, -50 -92 L70 -92 L80 -64 L40 -56 L30 0 Z" fill={C.negro} />
    <Inc d="M-46 -84 H66" w={2} />
    <Borde d="M-40 -6 H30" w={7} />
    {brasa > 0 && <path d="M-30 -96 h70 l -6 -10 h -58 Z" fill="#EE7A2A" opacity={brasa} />}
  </g>
);

/** Cadena de eslabones entre dos puntos; `rota` separa los dos tramos. */
export const Cadena: React.FC<{ a: P; b: P; rota?: number }> = ({ a, b, rota = 0 }) => {
  const n = 12, ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n, p = lerp(a, b, t), lado = t < 0.5 ? -1 : 1;
        const caida = rota * (Math.abs(t - 0.5) < 0.5 ? (0.5 - Math.abs(t - 0.5)) * 160 : 0);
        return <ellipse key={i} cx={p[0] + lado * rota * 30} cy={p[1] + caida} rx={14} ry={8} fill="none" stroke={C.oro} strokeWidth={6} transform={`rotate(${ang + lado * rota * 40} ${p[0] + lado * rota * 30} ${p[1] + caida})`} />;
      })}
    </g>
  );
};

/** Puertas de bronce del Tártaro; `cierra` 0 = abiertas, 1 = cerradas. Origen = base, centro. */
export const Puertas: React.FC<{ x: number; y?: number; cierra: number; alto?: number; ancho?: number }> = ({ x, y = SUELO, cierra, alto = 520, ancho = 560 }) => {
  const w = ancho / 2;
  const hoja = (lado: number) => {
    const x0 = lado < 0 ? -w - (1 - cierra) * w * 0.95 : (1 - cierra) * w * 0.95;
    return (
      <g key={lado}>
        <rect x={x0} y={-alto} width={w} height={alto} fill={C.negro} stroke={C.crema} strokeWidth={2} />
        {[0.2, 0.5, 0.8].map((t) => <Borde key={t} d={`M${x0 + 12} ${-alto * t} H${x0 + w - 12}`} w={8} color={C.oro} />)}
        {Array.from({ length: 4 }, (_, i) => Array.from({ length: 3 }, (_, j) => <circle key={`${i}${j}`} cx={x0 + w * (0.25 + j * 0.25)} cy={-alto * (0.12 + i * 0.25) - 20} r={5} fill={C.oro} />))}
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w - 60} y={-alto - 60} width={ancho + 120} height={60} fill={C.negro} />
      <Borde d={`M${-w - 50} ${-alto - 30} H${w + 50}`} w={10} />
      <rect x={-w - 60} y={-alto} width={50} height={alto} fill={C.negro} />
      <rect x={w + 10} y={-alto} width={50} height={alto} fill={C.negro} />
      <rect x={-w} y={-alto} width={ancho} height={alto} fill="#3A160C" />
      {hoja(-1)}{hoja(1)}
    </g>
  );
};

/** Casco corintio (el de invisibilidad). Origen = centro. */
export const Casco: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-34 10 C -44 -50, 36 -60, 38 -2 L 38 40 L 16 40 L 16 6 L -2 6 L -2 44 L -30 44 Z" fill={C.negro} stroke={C.crema} strokeWidth={2.5} />
    <path d="M-26 -38 C -10 -84, 40 -80, 56 -40" stroke={C.purpura} strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M-26 -38 C -10 -84, 40 -80, 56 -40" stroke={C.blanco} strokeWidth={3} strokeDasharray="1 7" strokeLinecap="round" fill="none" />
  </g>
);

/** Ondas de sonido que se expanden desde un punto. */
export const Ondas: React.FC<{ x: number; y: number; f: number; dir?: number; n?: number; color?: string }> = ({ x, y, f, dir = 1, n = 3, color = C.crema }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const t = ((f + i * 10) % 30) / 30, r = 20 + t * 90;
      return <path key={i} d={`M${x + dir * r * 0.5} ${y - r * 0.8} Q ${x + dir * r} ${y}, ${x + dir * r * 0.5} ${y + r * 0.8}`} stroke={color} strokeWidth={5} fill="none" opacity={1 - t} strokeLinecap="round" />;
    })}
  </g>
);

/** Brotes de planta que crecen (`c` de 0 a 1). Origen = base. */
export const Brote: React.FC<{ x: number; y?: number; c: number; s?: number; flor?: boolean }> = ({ x, y = SUELO, c, s = 1, flor }) => {
  const f = useCurrentFrame();
  if (c <= 0) return null;
  const al = 110 * c, sway = Math.sin(f / 14 + x) * 6 * c;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q ${sway} ${-al / 2} ${sway * 1.5} ${-al}`} stroke={C.negro} strokeWidth={5} fill="none" />
      {[0.35, 0.6, 0.85].map((t, i) => (
        <ellipse key={i} cx={sway * t * 1.5 + (i % 2 ? 14 : -14) * c} cy={-al * t} rx={5 * c} ry={15 * c} fill={i === 1 ? C.purpura : C.negro} transform={`rotate(${i % 2 ? 50 : -50} ${sway * t * 1.5 + (i % 2 ? 14 : -14) * c} ${-al * t})`} />
      ))}
      {flor && c > 0.8 && (
        <g transform={`translate(${sway * 1.5} ${-al})`}>
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={0} cy={-10} rx={5} ry={10} fill={i % 2 ? C.blanco : C.purpura} transform={`rotate(${i * 60})`} />)}
          <circle r={5} fill={C.oro} />
        </g>
      )}
    </g>
  );
};

/** Lágrimas que caen desde un punto. */
export const Lagrimas: React.FC<{ x: number; y: number; f: number; o?: number }> = ({ x, y, f, o = 1 }) => (
  <g opacity={o}>
    {[0, 1, 2].map((i) => {
      const t = ((f + i * 12) % 36) / 36;
      return <path key={i} d={`M${x + i * 4} ${y + t * 70} q 4 8 0 10 q -4 -2 0 -10`} fill={C.blanco} opacity={1 - t} />;
    })}
  </g>
);

/** Ave en vuelo (silueta). */
export const Ave: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const a = Math.sin(f / 4) * 14;
  return <path d={`M${x - 30 * s} ${y - a * s} Q ${x - 12 * s} ${y - 14 * s}, ${x} ${y} Q ${x + 12 * s} ${y - 14 * s}, ${x + 30 * s} ${y - a * s}`} stroke={C.negro} strokeWidth={5 * s} fill="none" strokeLinecap="round" />;
};

/** Arco de corte (destello de la hoz). */
export const Tajo: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 220 }) => {
  if (t <= 0 || t >= 1) return null;
  const a0 = -150, a1 = -150 + t * 200;
  const pt = (a: number): P => [x + Math.cos((a * Math.PI) / 180) * r, y + Math.sin((a * Math.PI) / 180) * r];
  const pts: P[] = Array.from({ length: 8 }, (_, i) => pt(a0 + ((a1 - a0) * i) / 7));
  return (
    <g opacity={1 - t * 0.6}>
      <path d={suave(pts)} stroke={C.oro} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d={suave(pts)} stroke={C.blanco} strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};
