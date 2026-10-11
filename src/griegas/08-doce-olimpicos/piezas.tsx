// Piezas propias del video 08 (Los doce olímpicos) en estilo vasija:
// siluetas negras con curvas suaves, incisiones crema, púrpura, oro y blanco añadidos.
// Todas miran a la derecha; origen = apoyo en el suelo, salvo que se diga otra cosa.
import React from 'react';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar } from '../../comun/vasija';

export const MAR = '#2E4A5C';
export const MAR_OSC = '#1E3240';
export const BRONCE = '#B07A3A';
export const SOMBRA = '#2A120A';

// ---------------------------------------------------------------- utilidades
/** Posición en el mundo de la mano de adelante de un `Personaje`. */
export function manoDe(p: { x: number; y?: number; s?: number; voltear?: boolean; brazo: [number, number]; inclinar?: number }): P {
  const hD: P = [14, -292];
  const cD = desde(hD, p.brazo[0], 66), mD = desde(cD, p.brazo[0] + p.brazo[1], 60);
  const a = ((p.inclinar ?? 0) * Math.PI) / 180, dx = mD[0], dy = mD[1] + 176;
  const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a) - 176;
  const s = p.s ?? 1;
  return [p.x + rx * (p.voltear ? -s : s), (p.y ?? SUELO) + ry * s];
}
/** Centro de la cabeza de un Personaje. */
export const cabezaDe = (x: number, s = 1, voltear = false, y = SUELO): P => [x + 20 * s * (voltear ? -1 : 1), y - 334 * s];

/** Pata de cuadrúpedo con dos tramos; fase anima el paso. */
function pata(o: P, fase: number, l: number, w: number, amp: number, trasera: boolean): string {
  const a = amp * Math.sin(fase);
  const k = desde(o, a, l * 0.5);
  const flex = (trasera ? -1 : 1) * (8 + amp * 0.9 * Math.max(0, Math.sin(fase + 1.9)));
  const t = desde(k, a - flex, l * 0.5);
  const casco = desde(t, a - flex + (trasera ? 60 : 70), w * 0.55);
  return miembro([o, lerp(o, k, 0.5), k, lerp(k, t, 0.5), t, casco], [w, w * 0.85, w * 0.55, w * 0.45, w * 0.42, w * 0.3]);
}

// ---------------------------------------------------------------- agua, humo, sonido
/** Mar con oleaje "perro corriendo" sobre cualquier rango de x. `nivel` = y de la superficie. */
export const Agua: React.FC<{ nivel: number; f: number; x0?: number; x1?: number; alto?: number; color?: string; o?: number; vel?: number; fondo?: number }> = ({ nivel, f, x0 = -800, x1 = 5200, alto = 30, color = MAR, o = 0.9, vel = 1.4, fondo = 1200 }) => {
  const w = 130, off = (f * vel) % w;
  let d = `M${x0 - w - off} ${nivel + alto}`;
  for (let x = x0 - w - off; x < x1 + w; x += w) {
    d += ` C ${x + w * 0.3} ${nivel + alto}, ${x + w * 0.35} ${nivel}, ${x + w * 0.6} ${nivel} C ${x + w * 0.85} ${nivel}, ${x + w * 0.85} ${nivel + alto * 0.5}, ${x + w * 0.68} ${nivel + alto * 0.5} C ${x + w * 0.6} ${nivel + alto * 0.5}, ${x + w * 0.62} ${nivel + alto * 0.8}, ${x + w} ${nivel + alto}`;
  }
  d += ` L${x1 + w} ${fondo} L${x0 - w} ${fondo} Z`;
  const n = Math.ceil((x1 - x0) / 260);
  return (
    <g opacity={o}>
      <path d={d} fill={color} stroke={C.negro} strokeWidth={4} />
      {Array.from({ length: n * 3 }, (_, i) => {
        const fila = i % 3, col = Math.floor(i / 3);
        const xx = x0 + col * 260 + fila * 90 + ((f * (0.6 + fila * 0.3)) % 260) - 130, yy = nivel + 60 + fila * 50;
        if (yy > fondo - 10) return null;
        return <path key={i} d={`M${xx} ${yy} q 20 -12 40 0 t 40 0`} stroke={C.crema} strokeWidth={2} fill="none" opacity={0.35} />;
      })}
    </g>
  );
};

/** Volutas de humo que suben y se disuelven. */
export const Humo: React.FC<{ x: number; y: number; f: number; o?: number; n?: number; color?: string; alto?: number; s?: number }> = ({ x, y, f, o = 1, n = 6, color = C.negro, alto = 220, s = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const ciclo = 90, edad = (f + i * (ciclo / n)) % ciclo, t = edad / ciclo;
      const yy = y - t * alto, xx = x + Math.sin(t * 6 + i) * 22 * s;
      return <path key={i} d={`M${xx - 16 * s} ${yy} c ${-12 * s} ${-18 * s}, ${12 * s} ${-30 * s}, ${4 * s} ${-44 * s} c ${-6 * s} ${12 * s}, ${18 * s} ${18 * s}, ${12 * s} ${30 * s}`} stroke={color} strokeWidth={(6 - t * 3) * s} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.8} />;
    })}
  </g>
);

/** Arcos de sonido (música, gritos). */
export const Sonido: React.FC<{ x: number; y: number; f: number; o?: number; ang?: number; color?: string; s?: number }> = ({ x, y, f, o = 1, ang = 0, color = C.crema, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`} opacity={o}>
    {[0, 1, 2].map((i) => {
      const t = ((f / 24 + i / 3) % 1), r = 20 + t * 80;
      return <path key={i} d={`M${r * 0.5} ${-r * 0.8} Q ${r} 0 ${r * 0.5} ${r * 0.8}`} stroke={color} strokeWidth={5 - t * 3} fill="none" strokeLinecap="round" opacity={1 - t} />;
    })}
  </g>
);

/** Música: espirales y puntitos dorados que flotan desde un punto. */
export const Musica: React.FC<{ x: number; y: number; f: number; o?: number; n?: number; dir?: number }> = ({ x, y, f, o = 1, n = 7, dir = 1 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const ciclo = 80, t = ((f + i * (ciclo / n)) % ciclo) / ciclo;
        const xx = x + dir * t * 220 + Math.sin(t * 8 + i) * 14, yy = y - t * 200 - azar(i) * 30;
        const r = 7 + azar(i + 4) * 5;
        return (
          <g key={i} opacity={Math.sin(t * Math.PI)} transform={`translate(${xx} ${yy}) rotate(${t * 200 + i * 40})`}>
            <path d={`M0 0 a ${r} ${r} 0 1 1 ${r * 0.8} ${r * 0.9}`} stroke={i % 2 ? C.oro : C.crema} strokeWidth={3} fill="none" strokeLinecap="round" />
            <circle cx={0} cy={0} r={3} fill={C.oro} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- cielo del Olimpo
/** Banco de nubes que hace de piso del Olimpo, desde x0 hasta x1, con la parte alta en `y`. */
export const PisoNubes: React.FC<{ x0: number; x1: number; y?: number; f: number; color?: string; o?: number }> = ({ x0, x1, y = SUELO, f, color = C.crema, o = 1 }) => {
  const n = Math.ceil((x1 - x0) / 120);
  return (
    <g opacity={o}>
      <rect x={x0} y={y + 18} width={x1 - x0} height={300} fill={color} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + i * 120 + 60, r = 46 + azar(i * 3) * 22, dy = Math.sin(f / 30 + i) * 3;
        return <circle key={i} cx={cx} cy={y + 30 + dy} r={r} fill={color} stroke={C.negro} strokeWidth={3} />;
      })}
      <rect x={x0} y={y + 34} width={x1 - x0} height={300} fill={color} />
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x0 + i * 120 + 20} ${y + 40} q 30 -16 60 0`} stroke={C.negro} strokeWidth={2} fill="none" opacity={0.4} />)}
    </g>
  );
};

/** Columna de nubes de la puerta del Olimpo; `lado` -1 = hoja izquierda, 1 = derecha; `abre` 0→1 la corre. */
export const NubePuerta: React.FC<{ x: number; y?: number; lado: number; abre: number; f: number; alto?: number; ancho?: number }> = ({ x, y = SUELO, lado, abre, f, alto = 520, ancho = 260 }) => {
  const dx = lado * abre * (ancho + 60);
  const n = 7;
  const bolas = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), yy = y - t * alto, r = 62 + azar(i * 5 + (lado > 0 ? 3 : 0)) * 26;
    return { cx: lado * (16 + r * 0.6) + Math.sin(f / 22 + i) * 5, cy: yy, r };
  });
  return (
    <g transform={`translate(${x + dx} 0)`}>
      {bolas.map((b, i) => <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={C.crema} stroke={C.negro} strokeWidth={4} />)}
      {bolas.map((b, i) => <circle key={`o${i}`} cx={b.cx + lado * ancho * 0.55} cy={b.cy - 20} r={b.r * 0.9} fill={C.crema} stroke={C.negro} strokeWidth={4} />)}
      <rect x={lado > 0 ? 30 : -ancho - 30} y={y - alto} width={ancho} height={alto} fill={C.crema} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${lado * (50 + (i % 2) * 60)} ${y - 40 - i * 80} q ${lado * 40} -20 ${lado * 90} 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.45} />)}
    </g>
  );
};

// ---------------------------------------------------------------- arquitectura
/** Palacio de bronce y oro del Olimpo. Origen = base al centro. `brillo` hace destellar el oro. */
export const PalacioOro: React.FC<{ x: number; y?: number; s?: number; ancho?: number; f: number; brillo?: number; o?: number }> = ({ x, y = SUELO, s = 1, ancho = 520, f, brillo = 0, o = 1 }) => {
  const h = 380, cols = 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {brillo > 0 && <circle cx={0} cy={-h * 0.6} r={ancho * 1.3} fill="url(#halo)" opacity={brillo * 0.8} style={{ mixBlendMode: 'screen' }} />}
      <rect x={-ancho + 30} y={-h} width={ancho * 2 - 60} height={h} fill={SOMBRA} />
      <path d={`M${-ancho + 60} ${-h + 60} H ${ancho - 60}`} stroke={BRONCE} strokeWidth={3} strokeDasharray="20 10" />
      {Array.from({ length: cols }, (_, i) => {
        const cx = -ancho + 60 + i * ((ancho * 2 - 120) / (cols - 1));
        return (
          <g key={i}>
            <rect x={cx - 22} y={-h + 20} width={44} height={h - 34} fill={C.oro} stroke={C.negro} strokeWidth={3} />
            {[-10, 0, 10].map((d) => <path key={d} d={`M${cx + d} ${-h + 30} V -20`} stroke={C.negro} strokeWidth={1.5} opacity={0.55} />)}
            <rect x={cx - 32} y={-h + 6} width={64} height={16} fill={C.negro} />
            <path d={`M${cx - 30} ${-h + 22} q 10 12 20 0 M${cx + 10} ${-h + 22} q 10 12 20 0`} stroke={C.negro} strokeWidth={4} fill="none" />
            <rect x={cx - 30} y={-16} width={60} height={14} fill={C.negro} />
          </g>
        );
      })}
      <rect x={-ancho - 20} y={-h - 34} width={ancho * 2 + 40} height={40} fill={C.negro} />
      <Borde d={`M${-ancho - 10} ${-h - 14} H ${ancho + 10}`} w={10} color={BRONCE} />
      <path d={`M${-ancho - 30} ${-h - 34} L 0 ${-h - 170} L ${ancho + 30} ${-h - 34} Z`} fill={C.negro} />
      <path d={`M${-ancho * 0.75} ${-h - 50} L 0 ${-h - 146} L ${ancho * 0.75} ${-h - 50} Z`} fill={BRONCE} stroke={C.negro} strokeWidth={3} />
      {/* figuras del frontón */}
      {[-0.45, -0.2, 0.2, 0.45].map((k, i) => <circle key={i} cx={k * ancho} cy={-h - 70 - (0.5 - Math.abs(k)) * 60} r={10} fill={C.negro} />)}
      <circle cx={0} cy={-h - 100} r={18} fill={C.oro} stroke={C.negro} strokeWidth={3} />
      <rect x={-ancho - 40} y={-4} width={ancho * 2 + 80} height={10} fill={C.negro} />
      {/* destellos */}
      {brillo > 0 && [0, 1, 2, 3, 4].map((i) => {
        const t = ((f / 30 + i / 5) % 1), cx = -ancho + 60 + (i * 2 + 1) * ((ancho * 2 - 120) / 10), cy = -h + 60 + t * (h - 120);
        return <path key={i} d={`M${cx} ${cy - 14} L${cx + 4} ${cy - 4} L${cx + 14} ${cy} L${cx + 4} ${cy + 4} L${cx} ${cy + 14} L${cx - 4} ${cy + 4} L${cx - 14} ${cy} L${cx - 4} ${cy - 4} Z`} fill={C.blanco} opacity={brillo * Math.sin(t * Math.PI)} />;
      })}
    </g>
  );
};

/** Trono del Olimpo con un emblema. Origen = base al centro. */
export const TronoO: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; color?: string; o?: number; emblema?: React.ReactNode }> = ({ x, y = SUELO, s = 1, voltear, color = C.purpura, o = 1, emblema }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
    <path d="M-62 0 L -58 -150 L -50 -300 Q -36 -320 -22 -300 L -26 -150 L 64 -150 L 68 0 L 52 0 L 50 -118 L -40 -118 L -44 0 Z" fill={C.negro} />
    <path d="M-50 -296 Q -36 -316 -22 -296" stroke={C.oro} strokeWidth={5} fill="none" />
    <Borde d="M-58 -150 H 66" w={10} color={color} />
    <path d="M58 -150 l 14 -30 M-56 -150 l 0 -10" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <circle cx={72} cy={-184} r={8} fill={C.oro} stroke={C.negro} strokeWidth={2} />
    {[0, 1, 2].map((i) => <Inc key={i} d={`M-48 ${-260 + i * 40} h 18`} w={1.6} />)}
    <path d="M-44 -60 Q 4 -80 52 -60" stroke={C.crema} strokeWidth={2} fill="none" />
    {emblema && <g transform="translate(-36 -224)">{emblema}</g>}
  </g>
);

/** Altar redondo del hogar con el fuego sagrado. Origen = base. */
export const Hogar: React.FC<{ x: number; y?: number; s?: number; f: number; fuego?: number }> = ({ x, y = SUELO, s = 1, f, fuego = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(0 -132) scale(${0.95 * fuego})`}><Fuego f={f} viento={-8} /></g>
    <path d="M-90 0 L -80 -100 L 80 -100 L 90 0 Z" fill={C.negro} />
    <ellipse cx={0} cy={-104} rx={100} ry={22} fill={C.negro} />
    <ellipse cx={0} cy={-114} rx={84} ry={14} fill="#B8331C" stroke={C.negro} strokeWidth={3} opacity={0.6 + fuego * 0.4} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-70 + i * 26} -40 v -26 h 16 v 16 h -8 v -6`} stroke={C.crema} strokeWidth={2.2} fill="none" />)}
    <Borde d="M-84 -80 H 84" w={8} />
    <Borde d="M-88 -14 H 88" w={8} />
  </g>
);

/** Columna dórica. Origen = base. */
export const Columna: React.FC<{ x: number; y?: number; alto?: number; color?: string }> = ({ x, y = SUELO, alto = 560, color = C.negro }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-30} y={-alto} width={60} height={alto} fill={color} />
    <rect x={-46} y={-alto - 20} width={92} height={20} fill={color} />
    <path d={`M-40 ${-alto} Q 0 ${-alto + 22} 40 ${-alto}`} fill={color} />
    {[-16, -6, 6, 16].map((dx) => <path key={dx} d={`M${dx} ${-alto + 20} V-8`} stroke={C.crema} strokeWidth={1.3} opacity={0.5} />)}
    <rect x={-40} y={-12} width={80} height={12} fill={color} />
  </g>
);

/** Volcán (el Etna) humeando, con brillo de lava. Origen = base al centro. */
export const Volcan: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = '#5A2410' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-330} r={160} fill="url(#halo)" opacity={0.55 + Math.sin(f / 7) * 0.15} style={{ mixBlendMode: 'screen' }} />
    <Humo x={0} y={-340} f={f} n={7} alto={260} s={1.6} />
    <path d="M-420 0 C -260 -120, -110 -300, -60 -330 L 60 -330 C 110 -300, 260 -120, 420 0 Z" fill={color} />
    <path d="M-60 -330 Q 0 -310 60 -330" stroke="#EE7A2A" strokeWidth={8} fill="none" />
    <path d={`M-20 -322 C -30 -260, 10 -220, -10 -150 C -16 -110, 6 -80, -4 -40`} stroke="#EE7A2A" strokeWidth={6} fill="none" opacity={0.7 + Math.sin(f / 5) * 0.2} />
    <path d="M24 -318 C 40 -270, 60 -240, 70 -190" stroke={C.oro} strokeWidth={4} fill="none" opacity={0.6} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 2 + r * 2 }, (_, i) => {
      const yy = -280 + r * 60, w = 60 + r * 70, cx = -w + (i + 0.5) * ((w * 2) / (2 + r * 2));
      return <path key={`${r}-${i}`} d={`M${cx - 18} ${yy} a 18 12 0 0 1 36 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.4} />;
    }))}
  </g>
);

// ---------------------------------------------------------------- objetos
/** Yunque. Origen = base. */
export const Yunque: React.FC<{ x: number; y?: number; s?: number; brasa?: number }> = ({ x, y = SUELO, s = 1, brasa = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 L-30 -50 L-60 -60 L-110 -64 C -90 -80, -70 -90, -50 -92 L70 -92 L80 -64 L40 -56 L30 0 Z" fill={C.negro} />
    <Inc d="M-46 -84 H66" w={2} />
    <Borde d="M-40 -6 H30" w={7} />
    {brasa > 0 && <path d="M-30 -96 h70 l -6 -10 h -58 Z" fill="#EE7A2A" opacity={brasa} />}
  </g>
);

/** Escudo dorado que se va forjando (c 0→1). Origen = centro. */
export const EscudoOro: React.FC<{ x: number; y: number; s?: number; c: number; f: number }> = ({ x, y, s = 1, c, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={80} fill="url(#halo)" opacity={c * (0.5 + Math.sin(f / 4) * 0.2)} style={{ mixBlendMode: 'screen' }} />
    <ellipse rx={56} ry={18} fill={c > 0.7 ? C.oro : '#EE7A2A'} stroke={C.negro} strokeWidth={3} />
    {c > 0.4 && <ellipse rx={36} ry={11} fill="none" stroke={C.negro} strokeWidth={2} />}
    {c > 0.8 && <ellipse rx={14} ry={5} fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />}
  </g>
);

/** Crátera grande (vasija para mezclar el néctar). Origen = base. */
export const Cratera: React.FC<{ x: number; y?: number; s?: number; f: number; brillo?: number }> = ({ x, y = SUELO, s = 1, f, brillo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brillo > 0 && <circle cx={0} cy={-150} r={150} fill="url(#halo)" opacity={brillo * (0.7 + Math.sin(f / 6) * 0.15)} style={{ mixBlendMode: 'screen' }} />}
    <path d="M-40 0 L -30 -24 L 30 -24 L 40 0 Z" fill={C.negro} />
    <path d="M-20 -24 L -26 -50 L 26 -50 L 20 -24 Z" fill={C.negro} />
    <path d="M-30 -50 C -90 -70, -96 -130, -86 -170 L 86 -170 C 96 -130, 90 -70, 30 -50 Z" fill={C.negro} />
    <path d="M-96 -170 H 96 L 90 -184 H -90 Z" fill={C.negro} />
    <path d="M-80 -150 C -120 -150, -120 -110, -84 -104 M80 -150 C 120 -150, 120 -110, 84 -104" stroke={C.negro} strokeWidth={9} fill="none" />
    <Borde d="M-84 -140 H 84" w={8} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-66 + i * 22} -112 v -16 h 14 v 10 h -7`} stroke={C.crema} strokeWidth={2} fill="none" />)}
    <Inc d="M-60 -78 Q 0 -60 60 -78" w={1.6} />
    <ellipse cx={0} cy={-178} rx={84} ry={8} fill={C.oro} opacity={0.4 + brillo * 0.6} />
  </g>
);

/** Jarra (enócoe) inclinada que vierte un chorro dorado. Origen = asa (la mano). */
export const Jarra: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; vierte?: number; f: number }> = ({ x, y, s = 1, voltear, vierte = 0, f }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
    <g transform={`rotate(${vierte * 60})`}>
      <path d="M0 -20 C -20 -20, -20 30, 6 34" stroke={C.negro} strokeWidth={6} fill="none" />
      <path d="M8 -26 C 40 -30, 50 0, 46 30 C 44 50, 14 56, 8 40 C 2 20, 8 0, 8 -26 Z" fill={C.negro} />
      <path d="M6 -26 L 20 -40 L 40 -34 L 34 -24 Z" fill={C.negro} />
      <Borde d="M14 10 Q 30 14 44 8" w={6} />
    </g>
    {vierte > 0.5 && (
      <path d={`M${44} ${-4} q 20 ${30 + Math.sin(f / 3) * 4} 10 ${90}`} stroke={C.oro} strokeWidth={7} fill="none" strokeLinecap="round" opacity={(vierte - 0.5) * 2} />
    )}
  </g>
);

/** Cuenco de ambrosía que brilla. Origen = base. */
export const Ambrosia: React.FC<{ x: number; y: number; s?: number; f: number; brillo?: number }> = ({ x, y, s = 1, f, brillo = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-30} r={70} fill="url(#halo)" opacity={brillo * (0.6 + Math.sin(f / 5) * 0.2)} style={{ mixBlendMode: 'screen' }} />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-28 + i * 14} cy={-24 - (i % 2) * 10 - Math.abs(i - 2) * -2} r={11} fill={C.oro} stroke={C.negro} strokeWidth={1.5} />)}
    <path d="M-46 -20 Q 0 20 46 -20 Z" fill={C.negro} />
    <path d="M-10 -2 L -14 0 L 14 0 L 10 -2" stroke={C.negro} strokeWidth={6} />
    <Borde d="M-40 -16 Q 0 10 40 -16" w={5} />
  </g>
);

/** Mesa larga del banquete. Origen = base al centro. */
export const MesaLarga: React.FC<{ x: number; y?: number; ancho?: number }> = ({ x, y = SUELO, ancho = 600 }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, -0.35, 0.35, 1].map((k) => <path key={k} d={`M${k * (ancho - 40)} -120 L ${k * (ancho - 50)} 0`} stroke={C.negro} strokeWidth={14} strokeLinecap="round" />)}
    <rect x={-ancho} y={-136} width={ancho * 2} height={20} rx={4} fill={C.negro} />
    <Borde d={`M${-ancho + 6} -126 H ${ancho - 6}`} w={7} />
    <path d={`M${-ancho + 40} -50 H ${ancho - 40}`} stroke={C.negro} strokeWidth={6} />
  </g>
);

/** Telar vertical con tela a medio tejer (t 0→1). Origen = base. */
export const Telar: React.FC<{ x: number; y?: number; s?: number; t?: number }> = ({ x, y = SUELO, s = 1, t = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 0 L -70 -300 M80 0 L 70 -300 M-90 -296 H 90" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${-56 + i * 11} -290 V -40`} stroke={C.crema} strokeWidth={1.5} />)}
    {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={-56 + i * 11} cy={-36} r={5} fill={C.negro} />)}
    <rect x={-60} y={-288} width={120} height={180 * t} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
    {t > 0.2 && Array.from({ length: Math.floor(t * 6) }, (_, i) => <path key={i} d={`M-54 ${-270 + i * 28} l 12 -12 l 12 12 l 12 -12 l 12 12 l 12 -12 l 12 12 l 12 -12 l 12 12`} stroke={C.blanco} strokeWidth={2} fill="none" />)}
  </g>
);

/** Flecha que vuela de `a` a `b` según t (0→1). */
export const Flecha: React.FC<{ a: P; b: P; t: number }> = ({ a, b, t }) => {
  if (t <= 0 || t >= 1) return null;
  const p = lerp(a, b, t), ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang})`}>
      <path d="M-70 0 H 20" stroke={C.negro} strokeWidth={4} />
      <path d="M20 -8 L 36 0 L 20 8 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M-70 0 l -12 -10 M-62 0 l -12 -10 M-70 0 l -12 10 M-62 0 l -12 10" stroke={C.purpura} strokeWidth={3} />
      <path d="M-120 0 H -80" stroke={C.crema} strokeWidth={2} opacity={0.6} strokeDasharray="6 8" />
    </g>
  );
};

/** Gotas doradas de icor que caen desde un punto. */
export const Icor: React.FC<{ x: number; y: number; f: number; o?: number; alto?: number }> = ({ x, y, f, o = 1, alto = 160 }) => (
  <g opacity={o}>
    {[0, 1, 2].map((i) => {
      const t = ((f / 40 + i / 3) % 1);
      return <path key={i} d={`M${x} ${y + t * alto - 12} q 8 10 0 16 q -8 -6 0 -16 Z`} fill={C.oro} stroke={C.negro} strokeWidth={1.5} opacity={Math.sin(t * Math.PI)} />;
    })}
  </g>
);

// ---------------------------------------------------------------- plantas
/** Espiga de trigo que crece (c 0→1); `marchita` 0→1 la dobla y la oscurece. */
export const Espiga: React.FC<{ x: number; y?: number; c: number; s?: number; marchita?: number; f?: number }> = ({ x, y = SUELO, c, s = 1, marchita = 0, f = 0 }) => {
  if (c <= 0) return null;
  const h = 120 * c * (1 - marchita * 0.25), dobla = marchita * 60 + Math.sin(f / 15 + x * 0.05) * 4;
  const color = marchita > 0.5 ? '#6B4A2A' : C.oro;
  const tope: P = [Math.sin((dobla * Math.PI) / 180) * h, -Math.cos((dobla * Math.PI) / 180) * h];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q 4 ${-h * 0.5} ${tope[0]} ${tope[1]}`} stroke={C.negro} strokeWidth={3} fill="none" />
      <path d={`M0 ${-h * 0.3} q -16 -10 -22 -30 M0 ${-h * 0.45} q 16 -10 20 -30`} stroke={C.negro} strokeWidth={2.5} fill="none" />
      {c > 0.5 && (
        <g transform={`translate(${tope[0]} ${tope[1]}) rotate(${dobla})`}>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <ellipse cx={-5} cy={8 + i * 9} rx={4} ry={7} fill={color} stroke={C.negro} strokeWidth={1.3} transform={`rotate(-25 -5 ${8 + i * 9})`} />
              <ellipse cx={5} cy={8 + i * 9} rx={4} ry={7} fill={color} stroke={C.negro} strokeWidth={1.3} transform={`rotate(25 5 ${8 + i * 9})`} />
            </g>
          ))}
          <path d="M0 4 L 0 -20" stroke={C.negro} strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/** Parra que crece a lo largo de una curva (c 0→1), con hojas y racimos. */
export const Parra: React.FC<{ pts: P[]; c: number; f: number; racimos?: boolean }> = ({ pts, c, f, racimos = true }) => {
  if (c <= 0) return null;
  // muestras de la curva por segmentos rectos para ubicar hojas
  const seg: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 6; k++) seg.push(lerp(pts[i], pts[i + 1], k / 6));
  seg.push(pts[pts.length - 1]);
  const n = Math.max(2, Math.ceil(seg.length * c));
  const vis = seg.slice(0, n);
  return (
    <g>
      <path d={suave(vis)} stroke={C.negro} strokeWidth={7} fill="none" strokeLinecap="round" />
      {vis.map((p, i) => {
        if (i === 0 || i % 2) return null;
        const lado = (i / 2) % 2 ? 1 : -1, m = Math.sin(f / 14 + i) * 6;
        return (
          <g key={i} transform={`translate(${p[0]} ${p[1]}) rotate(${lado * 40 + m})`}>
            <path d={`M0 0 q ${lado * 10} -10 ${lado * 6} -22`} stroke={C.negro} strokeWidth={3} fill="none" />
            <path d={`M${lado * 6} -22 c ${lado * -22} -6, ${lado * -18} -38, 0 -40 c ${lado * 4} 10, ${lado * 16} 6, ${lado * 20} 0 c 4 18, -6 34, ${lado * -20} 40 Z`} fill={C.negro} />
            <Inc d={`M${lado * 6} -24 l ${lado * 2} -26`} w={1.2} />
            {racimos && i % 4 === 0 && (
              <g transform={`translate(${-lado * 4} 6)`}>
                {[[0, 0], [10, 0], [-10, 0], [5, 10], [-5, 10], [0, 20], [0, -10]].map(([gx, gy], j) => <circle key={j} cx={gx} cy={gy + 10} r={6} fill={C.purpura} stroke={C.negro} strokeWidth={1.5} />)}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Flor que brota (c 0→1). */
export const Flor: React.FC<{ x: number; y?: number; c: number; s?: number; color?: string }> = ({ x, y = SUELO, c, s = 1, color = C.blanco }) => {
  if (c <= 0) return null;
  const h = 46 * c;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q 4 ${-h * 0.5} 0 ${-h}`} stroke={C.negro} strokeWidth={3} fill="none" />
      <path d={`M0 ${-h * 0.4} q 12 -4 16 -14 q -12 0 -16 14`} fill={C.negro} />
      {c > 0.6 && (
        <g transform={`translate(0 ${-h}) scale(${(c - 0.6) / 0.4})`}>
          {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={0} cy={-9} rx={5} ry={9} fill={color} stroke={C.negro} strokeWidth={1.5} transform={`rotate(${i * 60})`} />)}
          <circle r={5} fill={C.oro} stroke={C.negro} strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/** Laurel joven (arbusto de hojas alargadas). */
export const Laurel: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 0 C -10 -60, 6 -100, -2 -160 L 10 -160 C 16 -100, 4 -60, 8 0 Z" fill={color} />
    <path d="M0 -120 C -30 -150, -60 -170, -80 -200 M2 -140 C 30 -170, 60 -190, 80 -220 M2 -160 C 0 -200, 4 -230, 0 -260" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[[-80, -200], [80, -220], [0, -260], [-40, -170], [40, -190]].map(([cx, cy], c) =>
      Array.from({ length: 16 }, (_, i) => {
        const u = azar(c * 23 + i), v = azar(c * 11 + i + 50);
        const lx = cx + Math.cos(u * 6.28) * v * 46, ly = cy + Math.sin(u * 6.28) * v * 30;
        return <ellipse key={`${c}-${i}`} cx={lx} cy={ly} rx={5} ry={17} fill={i % 7 === 0 ? C.purpura : color} stroke={C.crema} strokeWidth={0.8} transform={`rotate(${u * 360 + Math.sin(f / 20 + i) * 6} ${lx} ${ly})`} />;
      }))}
  </g>
);

// ---------------------------------------------------------------- animales
/** Águila: volando (alas que baten) o posada. Origen = cuerpo. */
export const Aguila: React.FC<{ x: number; y: number; s?: number; f: number; posada?: boolean; voltear?: boolean; opacity?: number; rot?: number }> = ({ x, y, s = 1, f, posada, voltear, opacity = 1, rot = 0 }) => {
  const al = posada ? 20 + Math.sin(f * 0.25) * 12 : Math.sin(f * 0.22) * 40;
  const ala = (sg: number) => {
    const raiz: P = [-6, -10];
    const codo = desde(raiz, 180 + al * sg * 0.5 - (posada ? 70 : 30), 90);
    const punta = desde(codo, 180 + al * sg - (posada ? 110 : 60), 110);
    const plumas: P[] = Array.from({ length: 5 }, (_, i) => desde(punta, 20 + i * 18 + (posada ? 30 : 0), 30 + i * 4));
    return { d: suave([raiz, codo, punta, ...plumas, lerp(codo, [-30, 6], 0.6), [-30, 6]], true), codo, punta };
  };
  const A = ala(1), B = ala(-1);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={B.d} fill={C.negro} opacity={0.9} />
      <path d="M-60 0 L -118 -16 L -110 4 L -122 20 L -70 14 Z" fill={C.negro} />
      {[-104, -92, -80].map((xx) => <Inc key={xx} d={`M${xx} -8 L${xx + 4} 12`} w={1.4} />)}
      <path d={suave([[-70, 8], [-30, -22], [20, -26], [48, -22], [56, -4], [30, 14], [-30, 18]], true)} fill={C.negro} />
      <path d={suave([[34, -24], [56, -34], [74, -26], [72, -12], [52, -8]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M70 -28 C 88 -26, 90 -14, 80 -6 L 76 -16 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} />
      <circle cx={62} cy={-24} r={2.8} fill={C.negro} />
      {posada ? (
        <>
          <path d="M-10 14 L -4 40 M10 14 L 16 40" stroke={C.negro} strokeWidth={7} />
          <path d="M-14 40 l 10 0 l 6 6 M6 40 l 10 0 l 6 6" stroke={C.oro} strokeWidth={4} fill="none" />
        </>
      ) : (
        <path d="M-20 14 L -40 30 M-4 14 L -22 34" stroke={C.oro} strokeWidth={5} strokeLinecap="round" />
      )}
      <path d={A.d} fill={C.negro} />
      <Borde d={suave([[-6, -10], A.codo])} w={8} />
      {[0.25, 0.5, 0.75].map((t) => <Inc key={t} d={suave([lerp([-6, -10], A.codo, t), lerp(A.codo, A.punta, t)])} w={1.5} />)}
      {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([lerp([-30, 6], A.codo, 0.2 + i * 0.18), lerp([-30, 6], A.punta, 0.3 + i * 0.16)])} w={1.3} />)}
    </g>
  );
};

/** Pavo real: `abre` 0→1 despliega la cola en abanico con cien ojos; `brillo` enciende los ojos. */
export const PavoReal: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; abre?: number; anda?: boolean; brillo?: number; o?: number }> = ({ x, y = SUELO, s = 1, f, voltear, abre = 0, anda, brillo = 0, o = 1 }) => {
  const fa = anda ? f * 0.25 : 0;
  const bote = anda ? -Math.abs(Math.sin(fa)) * 4 : 0;
  const raiz: P = [-40, -92];
  const N = 17, L = 190;
  const plumas = Array.from({ length: N }, (_, i) => {
    const cerrada = 166 + (i - 8) * 0.8, abierta = 188 + i * (164 / (N - 1));
    const a = cerrada + (abierta - cerrada) * abre + Math.sin(f / 9 + i) * 1.5 * abre;
    const largo = L * (0.8 + 0.2 * Math.sin((i / (N - 1)) * Math.PI)) * (0.9 + 0.1 * abre);
    return { a, largo, i };
  });
  const cabeceo = anda ? Math.sin(fa * 2) * 6 : Math.sin(f / 18) * 3;
  return (
    <g transform={`translate(${x} ${y + bote * s}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
      {/* cola */}
      <g transform={`translate(${raiz[0]} ${raiz[1]})`}>
        {plumas.map((p) => (
          <g key={p.i} transform={`rotate(${p.a})`}>
            <path d={`M0 0 Q ${p.largo * 0.5} -9 ${p.largo} 0 Q ${p.largo * 0.5} 9 0 0`} fill={C.negro} />
            <Inc d={`M6 0 H ${p.largo - 30}`} w={1.2} />
            <ellipse cx={p.largo - 16} cy={0} rx={17} ry={12} fill={C.oro} stroke={C.negro} strokeWidth={2} />
            <ellipse cx={p.largo - 16} cy={0} rx={10} ry={7} fill={MAR} stroke={C.negro} strokeWidth={1.5} />
            <circle cx={p.largo - 14} cy={0} r={3.5} fill={brillo > 0 ? C.blanco : C.negro} />
            {abre > 0.5 && <ellipse cx={p.largo * 0.55} cy={0} rx={10} ry={7} fill={C.purpura} stroke={C.negro} strokeWidth={1.2} />}
            {abre > 0.5 && <circle cx={p.largo * 0.55} cy={0} r={2.5} fill={brillo > 0 ? C.blanco : C.oro} />}
          </g>
        ))}
        {brillo > 0 && <circle cx={0} cy={-80 * abre} r={200} fill="url(#haloBlanco)" opacity={brillo * 0.35} />}
      </g>
      {/* patas */}
      {[-6, 14].map((px, i) => {
        const a = anda ? Math.sin(fa + i * Math.PI) * 18 : 0;
        const k = desde([px, -64], a, 32), pie = desde(k, a - 8, 32);
        return (
          <g key={i}>
            <path d={`M${px} -64 L${k[0]} ${k[1]} L${pie[0]} ${pie[1]}`} stroke={C.negro} strokeWidth={5} fill="none" />
            <path d={`M${pie[0] - 8} ${pie[1]} h 22`} stroke={C.negro} strokeWidth={4} strokeLinecap="round" />
          </g>
        );
      })}
      {/* cuerpo */}
      <path d={suave([[-56, -92], [-20, -118], [26, -112], [44, -92], [30, -66], [-10, -60], [-48, -74]], true)} fill={MAR} stroke={C.negro} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-36 + i * 12} -100 q 5 8 10 0`} stroke={C.negro} strokeWidth={1.5} fill="none" />)}
      <path d={suave([[-50, -88], [-20, -104], [20, -96], [-10, -76]], true)} fill={C.negro} />
      <Inc d={suave([[-40, -88], [-10, -94], [14, -90]])} w={1.3} />
      {/* cuello y cabeza */}
      <g transform={`rotate(${cabeceo} 30 -100)`}>
        <path d={miembro([[24, -100], [40, -140], [46, -176]], [26, 16, 13])} fill={MAR} stroke={C.negro} strokeWidth={2.5} />
        <circle cx={50} cy={-182} r={12} fill={MAR} stroke={C.negro} strokeWidth={2.5} />
        <path d="M60 -186 L 74 -180 L 60 -176 Z" fill={C.negro} />
        <path d="M54 -186 Q 58 -190 62 -186" stroke={C.blanco} strokeWidth={3} fill="none" />
        <circle cx={55} cy={-184} r={2} fill={C.negro} />
        {[-6, 0, 6].map((dx, i) => (
          <g key={i}>
            <path d={`M${48 + dx * 0.3} -192 L ${44 + dx} -214`} stroke={C.negro} strokeWidth={1.5} />
            <circle cx={44 + dx} cy={-216} r={3.5} fill={C.negro} />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Búho de vasija, de frente. `vuela` abre las alas; `brillo` enciende los ojos. Origen = patas. */
export const Buho: React.FC<{ x: number; y: number; s?: number; f: number; vuela?: boolean; brillo?: number; o?: number }> = ({ x, y, s = 1, f, vuela, brillo = 0, o = 1 }) => {
  const parpadeo = !vuela && f % 90 > 84;
  const bate = vuela ? Math.sin(f * 0.4) : 0;
  const ala = (sg: number) => vuela
    ? suave([[sg * 22, -60], [sg * 70, -90 - bate * 40], [sg * 130, -80 - bate * 70], [sg * 120, -60 - bate * 40], [sg * 100, -50 - bate * 20], [sg * 80, -40], [sg * 30, -30]], true)
    : suave([[sg * 22, -70], [sg * 36, -50], [sg * 32, -16], [sg * 18, -10]], true);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {brillo > 0 && <circle cx={0} cy={-76} r={70} fill="url(#halo)" opacity={brillo * 0.7} style={{ mixBlendMode: 'screen' }} />}
      <path d={ala(-1)} fill={C.negro} />
      <path d={ala(1)} fill={C.negro} />
      {vuela && [-1, 1].map((sg) => [0, 1, 2].map((i) => <Inc key={`${sg}${i}`} d={`M${sg * (50 + i * 22)} ${-60 - bate * (20 + i * 15)} l ${sg * 10} 18`} w={1.4} />))}
      <path d={suave([[-26, -64], [-30, -30], [-20, -4], [20, -4], [30, -30], [26, -64], [0, -72]], true)} fill={C.negro} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-14 + (i % 3) * 12 + (Math.floor(i / 3) % 2) * 6} ${-46 + Math.floor(i / 3) * 12} q 4 5 8 0`} stroke={C.crema} strokeWidth={1.4} fill="none" />)}
      {/* cabeza */}
      <path d={suave([[-28, -70], [-32, -100], [-26, -116], [-14, -106], [0, -110], [14, -106], [26, -116], [32, -100], [28, -70], [0, -62]], true)} fill={C.negro} />
      {[-1, 1].map((sg) => (
        <g key={sg}>
          <circle cx={sg * 13} cy={-90} r={11} fill={brillo > 0 ? C.oro : C.crema} />
          {parpadeo ? <path d={`M${sg * 13 - 9} -90 h 18`} stroke={C.negro} strokeWidth={3} /> : <circle cx={sg * 13} cy={-90} r={5} fill={C.negro} />}
          <circle cx={sg * 13} cy={-90} r={11} fill="none" stroke={C.purpura} strokeWidth={2} />
        </g>
      ))}
      <path d="M-4 -82 L 0 -72 L 4 -82 Z" fill={C.oro} />
      {!vuela && <path d="M-12 -4 l -4 8 M-8 -4 v 9 M8 -4 v 9 M12 -4 l 4 8" stroke={C.oro} strokeWidth={3} strokeLinecap="round" />}
    </g>
  );
};

/** Caballo (Poseidón lo creó). Origen = cascos. */
export const Caballo: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean; voltear?: boolean; opacity?: number; color?: string; encabrita?: number }> = ({ x, y = SUELO, s = 1, f, anda = true, voltear, opacity = 1, color = C.negro, encabrita = 0 }) => {
  const fa = anda ? f * 0.32 : Math.sin(f / 9) * 0.3, amp = anda ? 34 : 8;
  const crin = (i: number) => Math.sin(f * 0.3 - i) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s}) rotate(${-encabrita * 28} -80 -30)`} opacity={opacity}>
      <path d={pata([-90, -110], fa + Math.PI, 112, 30, amp, true)} fill={color} />
      <path d={pata([60, -110], fa + 0.5 + encabrita * 1.2, 112, 26, amp + encabrita * 30, false)} fill={color} />
      <path d={miembro([[-120, -160], [-150, -150 + crin(1)], [-176, -120 + crin(2)]], [16, 14, 8])} fill={color} />
      <path d={suave([[-126, -150], [-60, -170], [40, -168], [80, -190], [96, -150], [70, -116], [-40, -114], [-110, -116], [-130, -130]], true)} fill={color} />
      <path d={miembro([[60, -160], [96, -224], [120, -252]], [56, 36, 28])} fill={color} />
      <path d={suave([[108, -268], [140, -262], [176, -230], [170, -216], [140, -222], [110, -240]], true)} fill={color} />
      <path d="M116 -266 l 4 -20 l 10 18 Z" fill={color} />
      <circle cx={140} cy={-246} r={3} fill={C.crema} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${66 + i * 9} ${-196 - i * 11} l ${-18 + crin(i)} ${-6}`} stroke={C.purpura} strokeWidth={7} strokeLinecap="round" />)}
      <path d={pata([-76, -110], fa, 112, 30, amp, true)} fill={color} />
      <path d={pata([74, -110], fa + Math.PI + 0.5 + encabrita * 1.6, 112, 26, amp + encabrita * 30, false)} fill={color} />
      <Inc d={suave([[-100, -156], [-80, -136], [-86, -116]])} />
      <Inc d={suave([[40, -164], [56, -140], [50, -118]])} />
      <Borde d={suave([[90, -210], [110, -206], [128, -222]])} w={6} />
    </g>
  );
};

/** Ciervo con cornamenta. Origen = patas. */
export const Ciervo: React.FC<{ x: number; y?: number; s?: number; f: number; corre?: boolean; voltear?: boolean; o?: number; contorno?: boolean }> = ({ x, y = SUELO, s = 1, f, corre, voltear, o = 1, contorno }) => {
  const fa = corre ? f * 0.36 : Math.sin(f / 12) * 0.2, amp = corre ? 40 : 6;
  const bote = corre ? -Math.abs(Math.sin(fa)) * 18 : 0;
  return (
    <g transform={`translate(${x} ${y + bote * s}) scale(${voltear ? -s : s} ${s})`} opacity={o} filter={contorno ? 'url(#contornoC)' : undefined}>
      <defs>
        <filter id="contornoC" x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d" />
          <feFlood floodColor={C.crema} floodOpacity="0.9" />
          <feComposite in2="d" operator="in" result="c" />
          <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={pata([-70, -104], fa + Math.PI, 104, 20, amp, true)} fill={C.negro} />
      <path d={pata([50, -104], fa + 0.5, 104, 16, amp, false)} fill={C.negro} />
      <path d="M-96 -140 l -16 -6 l 6 14 Z" fill={C.negro} />
      <path d={suave([[-100, -140], [-40, -152], [30, -150], [64, -164], [76, -132], [56, -104], [-40, -102], [-96, -108], [-108, -124]], true)} fill={C.negro} />
      {/* manchas blancas */}
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-70 + i * 18} cy={-134 + (i % 2) * 8} r={3.5} fill={C.blanco} />)}
      <path d={miembro([[50, -146], [74, -196], [88, -214]], [40, 24, 20])} fill={C.negro} />
      <path d={suave([[78, -228], [104, -222], [128, -200], [122, -190], [100, -194], [80, -206]], true)} fill={C.negro} />
      <path d="M84 -226 l -8 -18 l 16 10 Z" fill={C.negro} />
      <circle cx={102} cy={-212} r={2.8} fill={C.crema} />
      {/* cornamenta */}
      <path d="M90 -228 C 84 -260, 70 -280, 50 -300 M80 -262 C 66 -268, 56 -266, 46 -260 M72 -282 C 80 -300, 82 -312, 78 -326 M96 -228 C 104 -262, 120 -282, 140 -296 M110 -264 C 124 -268, 132 -262, 140 -252 M122 -284 C 118 -302, 120 -314, 126 -326" stroke={C.negro} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={pata([-58, -104], fa, 104, 20, amp, true)} fill={C.negro} />
      <path d={pata([64, -104], fa + Math.PI + 0.5, 104, 16, amp, false)} fill={C.negro} />
      <Inc d={suave([[-80, -136], [-66, -120], [-72, -106]])} w={1.6} />
      <Inc d={suave([[34, -146], [48, -128], [42, -110]])} w={1.6} />
    </g>
  );
};

/** Perro de caza (los perros de Ares). Origen = patas. */
export const Perro: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean; fase?: number; corre?: boolean; ladra?: boolean; o?: number; contorno?: boolean }> = ({ x, y = SUELO, s = 1, voltear, fase = 0, corre, ladra, o = 1, contorno }) => {
  const amp = corre ? 36 : 2;
  const p = (cad: P, ph: number, del: boolean) => {
    const a = amp * Math.sin(fase + ph);
    const k = desde(cad, a + (del ? 6 : -10), 40), pie = desde(k, a + (del ? -18 : 26), 38);
    return miembro([cad, k, pie], [22, 12, 8]);
  };
  const bote = corre ? -Math.abs(Math.sin(fase)) * 10 : 0;
  return (
    <g transform={`translate(${x} ${y + bote * s}) scale(${voltear ? -s : s} ${s})`} opacity={o} filter={contorno ? 'url(#contornoV)' : undefined}>
      <path d={suave([[-84, -98], [-120, -110 + Math.sin(fase) * 8], [-140, -132 + Math.sin(fase) * 14], [-124, -116], [-92, -88]], true)} fill={C.negro} />
      <path d={p([-64, -84], Math.PI, false)} fill={C.negro} />
      <path d={p([52, -86], 0.6, true)} fill={C.negro} />
      <path d={suave([[-92, -102], [-30, -110], [30, -116], [72, -126], [84, -96], [64, -76], [0, -72], [-52, -70], [-92, -80]], true)} fill={C.negro} />
      {[0, 1, 2, 3].map((i) => <Inc key={i} d={`M${-50 + i * 14} -96 q 4 10 0 18`} w={1.5} />)}
      <path d={p([-52, -82], 0.2, false)} fill={C.negro} />
      <path d={p([62, -88], Math.PI + 0.6, true)} fill={C.negro} />
      <Borde d="M66 -126 Q 80 -110 82 -96" w={7} />
      <g transform="translate(84 -126)">
        <path d={suave([[-18, 6], [-10, -18], [6, -24], [20, -16], [56, -6], [60, 4], [50, 10], [24, 12], [4, 18], [-14, 16]], true)} fill={C.negro} />
        <path d="M-6 -18 L -10 -40 L 8 -22 Z" fill={C.negro} />
        <path d="M14 -10 Q 20 -14 26 -10 Q 20 -6 14 -10 Z" fill={C.crema} />
        <circle cx={20} cy={-10} r={2} fill={C.negro} />
        {ladra ? <path d="M58 2 L 30 12 L 54 16 Z" fill={C.purpura} stroke={C.crema} strokeWidth={1.2} /> : <Inc d="M32 8 L 54 4" w={1.5} />}
      </g>
    </g>
  );
};

/** Paloma blanca con alas que baten. Origen = cuerpo. */
export const Paloma: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; f: number; o?: number }> = ({ x, y, s = 1, voltear, f, o = 1 }) => {
  const bate = Math.sin(f * 0.5 + x * 0.01);
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
      <path d={suave([[-8, -6], [-14, -6 - 30 * bate], [-36, -10 - 40 * bate], [-4, -10 - 14 * bate], [10, -6]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} opacity={0.85} />
      <path d={suave([[-36, 0], [-6, -10], [20, -8], [32, -2], [20, 6], [-8, 8]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M-34 0 L -54 -8 L -50 4 L -54 14 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d="M30 -4 L 40 -1 L 30 1 Z" fill={C.oro} stroke={C.negro} strokeWidth={1} />
      <circle cx={23} cy={-4} r={1.8} fill={C.negro} />
      <path d={suave([[-4, -6], [-10, -6 - 34 * -bate], [-30, -8 - 44 * -bate], [0, -8 - 16 * -bate], [12, -6]], true)} fill={C.blanco} stroke={C.negro} strokeWidth={2} />
      <path d={`M-6 -8 L -14 ${-8 - 24 * -bate}`} stroke={C.negro} strokeWidth={1.2} />
    </g>
  );
};

/** Concha de vieira (Afrodita llega sobre ella). Origen = base al centro. */
export const Concha: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => {
  const N = 11;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M-150 0 ${Array.from({ length: N }, (_, i) => {
        const a0 = Math.PI - (i / N) * Math.PI, a1 = Math.PI - ((i + 1) / N) * Math.PI, am = (a0 + a1) / 2;
        return `Q ${Math.cos(am) * 175} ${-Math.sin(am) * 125} ${Math.cos(a1) * 150} ${-Math.sin(a1) * 110}`;
      }).join(' ')} L 30 20 L -30 20 Z`} fill={C.blanco} stroke={C.negro} strokeWidth={4} />
      {Array.from({ length: N - 1 }, (_, i) => {
        const a = Math.PI - ((i + 1) / N) * Math.PI;
        return <path key={i} d={`M0 16 L ${Math.cos(a) * 146} ${-Math.sin(a) * 106}`} stroke={i % 2 ? C.purpura : C.negro} strokeWidth={i % 2 ? 5 : 2} />;
      })}
      <path d="M-40 20 L -60 40 L 60 40 L 40 20 Z" fill={C.blanco} stroke={C.negro} strokeWidth={3} />
      <Borde d="M-120 -10 Q 0 -60 120 -10" w={6} color={C.oro} />
    </g>
  );
};

/** Delfín de vasija, curvado (mira a la derecha). */
export const Delfin: React.FC<{ x: number; y: number; s?: number; voltear?: boolean; rot?: number; f: number }> = ({ x, y, s = 1, voltear, rot = 0, f }) => {
  const c = Math.sin(f / 5 + x * 0.01) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${voltear ? -s : s} ${s})`}>
      <path d={suave([[-110, 10 + c], [-60, -20], [10, -34], [70, -22], [104, -8], [130, -4], [104, 4], [70, 16], [0, 18], [-70, 18]], true)} fill={C.negro} />
      <path d={`M-104 ${12 + c} L -140 ${-14 + c * 2} L -126 ${12 + c} L -140 ${34 + c * 2} Z`} fill={C.negro} />
      <path d="M-4 -30 C 0 -60, 20 -66, 28 -64 C 16 -50, 18 -40, 24 -28 Z" fill={C.negro} />
      <path d="M10 14 C 4 34, -10 40, -20 40 C -8 30, -6 22, -6 14 Z" fill={C.negro} />
      <Borde d={suave([[-90, 6 + c], [-20, 6], [60, 6], [100, 2]])} w={6} />
      <path d="M78 -10 Q 86 -16 94 -10 Q 86 -6 78 -10 Z" fill={C.crema} />
      <Inc d="M104 2 L 124 -2" w={1.5} />
    </g>
  );
};

/** Cerbero: perro de tres cabezas con cola de serpiente. Origen = patas. */
export const Cerbero: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; o?: number; ladra?: number }> = ({ x, y = SUELO, s = 1, f, voltear, o = 1, ladra = 0 }) => {
  const resp = Math.sin(f / 10) * 3;
  const cabeza = (ang: number, largo: number, k: number) => {
    const base: P = [70, -150];
    const mov = Math.sin(f / 9 + k * 2) * 6 + (ladra > 0 && Math.floor(f / 6 + k) % 2 ? -8 : 0);
    const cab = desde(base, ang + mov, largo);
    const abre = ladra > 0 && Math.floor(f / 6 + k) % 2 === 0;
    return (
      <g key={k}>
        <path d={miembro([base, lerp(base, cab, 0.5), cab], [48, 34, 28])} fill={C.negro} />
        <g transform={`translate(${cab[0]} ${cab[1]}) rotate(${-(ang - 120) * 0.4})`}>
          <path d={suave([[-18, 8], [-10, -18], [6, -24], [20, -16], [58, -6], [62, 4], [52, 12], [24, 14], [4, 20], [-14, 18]], true)} fill={C.negro} />
          <path d="M-6 -18 L -12 -42 L 8 -22 Z" fill={C.negro} />
          <path d="M14 -10 Q 20 -14 26 -10 Q 20 -6 14 -10 Z" fill={C.oro} />
          <circle cx={20} cy={-10} r={2} fill="#B8331C" />
          {abre ? <path d="M60 2 L 30 14 L 56 20 Z" fill="#B8331C" stroke={C.crema} strokeWidth={1.2} /> : <Inc d="M32 10 L 56 6" w={1.5} />}
          {[0, 1, 2].map((i) => <path key={i} d={`M${40 + i * 6} 12 l 2 5`} stroke={C.blanco} strokeWidth={2} />)}
        </g>
      </g>
    );
  };
  const p = (cad: P, ph: number, del: boolean) => {
    const a = Math.sin(f / 30 + ph) * 3;
    const k = desde(cad, a + (del ? 6 : -10), 50), pie = desde(k, a + (del ? -16 : 24), 48);
    return miembro([cad, k, pie], [34, 18, 12]);
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={o}>
      {/* cola de serpiente */}
      <path d={miembro([[-100, -120], [-150, -100 + Math.sin(f / 8) * 10], [-190, -140 + Math.sin(f / 8 + 1) * 14], [-200, -190 + Math.sin(f / 8 + 2) * 10]], [20, 16, 12, 8])} fill={C.negro} />
      <path d={`M-200 ${-190 + Math.sin(f / 8 + 2) * 10} l 16 -10 l -4 16 Z`} fill={C.negro} />
      <path d={p([-70, -104], Math.PI, false)} fill={C.negro} />
      <path d={p([56, -104], 0.6, true)} fill={C.negro} />
      <path d={suave([[-110, -126 + resp], [-30, -140 + resp], [50, -160 + resp], [100, -150], [100, -110], [70, -92], [0, -92], [-60, -88], [-110, -96]], true)} fill={C.negro} />
      {Array.from({ length: 5 }, (_, i) => <Inc key={i} d={`M${-70 + i * 22} -126 q 6 12 0 24`} w={1.6} />)}
      <Borde d="M60 -158 Q 96 -140 100 -110" w={9} />
      {cabeza(160, 90, 0)}
      {cabeza(125, 100, 1)}
      {cabeza(95, 92, 2)}
      <path d={p([-56, -100], 0.2, false)} fill={C.negro} />
      <path d={p([72, -104], Math.PI + 0.6, true)} fill={C.negro} />
    </g>
  );
};

/** Casita pequeña (el mundo de abajo visto desde el Olimpo). */
export const Casita: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-40} width={60} height={40} fill={color} />
    <path d="M-38 -38 L 0 -64 L 38 -38 Z" fill={color} />
    <rect x={-6} y={-20} width={12} height={20} fill={C.barroOscuro} />
  </g>
);
