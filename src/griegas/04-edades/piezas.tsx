// Piezas propias del video 04 (Las cinco edades) en estilo vasija: siluetas negras, incisiones crema, púrpura y blanco añadidos.
import React from 'react';
import { C, P, SUELO, suave, miembro, desde, lerp, Inc, Borde, Fuego, azar } from '../../comun/vasija';

// Color de piel de cada raza (las figuras de oro, plata, bronce, hierro).
export const ORO = '#E7B54A';
export const PLATA = '#D9D3C4';
export const BRONCE = '#B0703C';
export const HIERRO = '#4E4844';

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

/** Alas sueltas (para espíritus y males). */
export const Alas: React.FC<{ x: number; y: number; s?: number; f: number; vel?: number; color?: string; claro?: boolean }> = ({ x, y, s = 1, f, vel = 0.4, color = C.negro, claro }) => {
  const a = Math.sin(f * vel) * 22;
  const ala = (abre: number, op: number) => {
    const punta = desde([0, 0], 200 + abre, 150);
    const medio = desde([0, 0], 225 + abre, 90);
    return (
      <g opacity={op}>
        <path d={suave([[0, 0], medio, punta, lerp(punta, [-30, 50], 0.4), [-40, 60], [-6, 24]], true)} fill={color} stroke={claro ? C.negro : C.crema} strokeWidth={2} />
        {[0.3, 0.5, 0.7].map((t, i) => <Inc key={i} d={suave([[-8, 12], lerp(medio, punta, t), lerp(punta, [-40, 60], 0.3 + t * 0.4)])} w={1.4} c={claro ? C.negro : C.crema} />)}
        <Borde d={suave([[0, 0], lerp([0, 0], medio, 0.6), lerp(medio, punta, 0.3)])} w={6} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {ala(-a - 12, 0.75)}
      {ala(a, 1)}
    </g>
  );
};

/** Un mal alado (ker). Origen = centro del cuerpo. */
export const Mal: React.FC<{ x: number; y: number; s?: number; f: number; v?: number; dir?: number; o?: number }> = ({ x, y, s = 1, f, v = 0, dir = 1, o = 1 }) => {
  const fl = Math.sin(f * 0.6 + v * 1.7) * 26;
  const larg = 70 + (v % 3) * 14;
  const cola: P[] = Array.from({ length: 6 }, (_, i) => [-20 - i * 16, 10 + Math.sin(f * 0.3 + i * 0.9 + v) * (4 + i * 2)] as P);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`} opacity={o}>
      <path d={suave([[0, -6], [-30, -50 - fl], [-70, -60 - fl * 1.2], [-50, -26], [-60, -10], [-20, 0]], true)} fill={C.purpura} stroke={C.crema} strokeWidth={2} />
      <path d={miembro([[30, -4], [0, 4], ...cola], [34, 40, 34, 26, 18, 12, 6, 2])} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      <path d={suave([[22, -18], [44, -30], [larg - 14, -18], [larg - 20, -2], [40, 6], [22, 4]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      {v % 3 === 1 && <path d="M38 -26 L30 -50 L46 -30 M50 -28 L50 -52 L58 -28" fill={C.negro} stroke={C.crema} strokeWidth={2} />}
      <circle cx={larg - 30} cy={-14} r={4.5} fill={C.oro} />
      <circle cx={larg - 30} cy={-14} r={1.8} fill={C.negro} />
      <path d="M14 12 l -4 16 M22 12 l 2 16" stroke={C.crema} strokeWidth={2} />
      <path d={suave([[6, -8], [-10, -60 + fl], [-56, -80 + fl * 1.3], [-36, -36 + fl * 0.3], [-46, -18], [-6, -2]], true)} fill={C.negro} stroke={C.crema} strokeWidth={2} />
      <Inc d={suave([[0, -10], [-20, -50 + fl], [-44, -66 + fl * 1.2]])} w={1.4} />
    </g>
  );
};

/** Pithos (la gran ánfora de Pandora), con tapa que se abre. Origen = base. */
export const Pithos: React.FC<{ x: number; y?: number; s?: number; tapa?: number; brillo?: number }> = ({ x, y = SUELO, s = 1, tapa = 0, brillo = 0 }) => {
  const der: P[] = [[34, 0], [66, -40], [100, -130], [110, -192], [96, -248], [58, -280], [46, -294], [62, -304], [62, -318]];
  const cuerpo = suave([...der, ...der.slice().reverse().map(([a, b]) => [-a, b] as P)], true, 0.8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-98 -232 C -136 -236, -136 -186, -108 -176 M98 -232 C 136 -236, 136 -186, 108 -176" stroke={C.negro} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={cuerpo} fill={C.negro} />
      {Array.from({ length: 9 }, (_, i) => {
        const cx = -64 + i * 16;
        return <path key={i} d={`M${cx - 7} -262 Q ${cx} -238 ${cx + 7} -262`} fill={i % 2 ? C.purpura : 'none'} stroke={C.crema} strokeWidth={1.8} />;
      })}
      <Borde d={suave([[-104, -222], [0, -230], [104, -222]])} w={10} />
      <path d={Array.from({ length: 12 }, (_, i) => `${i ? 'L' : 'M'}${-96 + i * 17.5} ${i % 2 ? -150 : -178}`).join(' ')} stroke={C.crema} strokeWidth={2.4} fill="none" />
      <Borde d={suave([[-90, -96], [0, -100], [90, -96]])} w={9} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-48 + i * 16} -10 L${-42 + i * 14} -70`} stroke={C.crema} strokeWidth={1.6} />)}
      {brillo > 0 && <circle cx={0} cy={-330} r={90 + brillo * 70} fill="url(#halo)" opacity={brillo} style={{ mixBlendMode: 'screen' }} />}
      <ellipse cx={0} cy={-318} rx={62} ry={9} fill="#2A120A" stroke={C.crema} strokeWidth={1.5} />
      <g transform={`translate(${tapa * 90} ${-tapa * 60}) rotate(${tapa * 50} 0 -318)`}>
        <path d="M-66 -318 Q 0 -360 66 -318 Z" fill={C.negro} />
        <rect x={-8} y={-358} width={16} height={14} rx={4} fill={C.negro} />
        <Borde d="M-66 -319 L66 -319" w={6} />
      </g>
    </g>
  );
};

/** Medallón de metal de una edad, con el número grabado. */
export const Medallon: React.FC<{ x: number; y: number; color: string; o: number; f: number; r?: number; n?: number; apagado?: number }> = ({ x, y, color, o, f, r = 58, n = 1, apagado = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 14 + x) * 4}) scale(${0.6 + o * 0.4})`} opacity={o}>
    <circle r={r * 1.7} fill="url(#halo)" opacity={0.45 * (1 - apagado)} style={{ mixBlendMode: 'screen' }} />
    <circle r={r} fill={color} stroke={C.negro} strokeWidth={5} />
    <circle r={r - 10} fill="none" stroke={C.negro} strokeWidth={2} strokeDasharray="3 6" />
    {Array.from({ length: n }, (_, i) => <rect key={i} x={-((n - 1) * 14) / 2 + i * 14 - 4} y={-r * 0.38} width={8} height={r * 0.76} rx={2} fill={C.negro} />)}
    <circle r={r} fill={C.negro} opacity={apagado * 0.55} />
  </g>
);

/** Oveja pastando. Origen = pies. */
export const Oveja: React.FC<{ x: number; y?: number; s?: number; f: number; voltear?: boolean; seed?: number }> = ({ x, y = SUELO, s = 1, f, voltear, seed = 0 }) => {
  const come = Math.sin(f / 22 + seed * 2) > 0.2;
  const cab: P = come ? [70, -34] : [78, -96];
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
      {[-46, -30, 30, 44].map((px, i) => <path key={i} d={`M${px} -50 L${px + (i % 2 ? 2 : -2)} 0`} stroke={C.negro} strokeWidth={9} strokeLinecap="round" />)}
      <path d={suave(Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const r = 1 + (i % 2) * 0.12; return [Math.cos(a) * 66 * r, -76 + Math.sin(a) * 36 * r] as P; }), true)} fill={C.negro} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-44 + i * 16} -96 q 8 10 0 20 q -8 10 0 20`} stroke={C.crema} strokeWidth={1.4} fill="none" opacity={0.8} />)}
      <path d={suave([[50, -86], lerp([50, -86], cab, 0.5), cab, [cab[0] + 26, cab[1] + 14], [cab[0] + 6, cab[1] + 24], [44, -62]], true)} fill={C.negro} />
      <circle cx={cab[0] + 10} cy={cab[1] + 4} r={2.6} fill={C.crema} />
      <path d={`M${cab[0] - 6} ${cab[1] + 2} l -18 6 l 14 4 Z`} fill={C.purpura} />
    </g>
  );
};

/** Árbol frutal frondoso. `frutos` 0→1 hace crecer las frutas; `caen` hace caer algunas. Origen = base. */
export const Frutal: React.FC<{ x: number; y?: number; s?: number; f: number; frutos?: number; caen?: number; color?: string; fruta?: string; hojas?: number; tf?: number }> = ({ x, y = SUELO, s = 1, f, frutos = 1, caen = 0, color = C.negro, fruta = C.oro, hojas = 1, tf = 1 }) => {
  const copas: P[] = [[-120, -300], [-40, -380], [70, -360], [140, -280], [0, -280], [-70, -230], [80, -220]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 0 C -14 -80, -30 -140, -10 -220 L 14 -220 C 28 -140, 14 -80, 24 0 Z" fill={color} />
      <path d="M-4 -200 C -40 -240, -90 -260, -120 -300 M6 -210 C 20 -270, 50 -320, 70 -360 M0 -220 C -10 -290, -30 -340, -40 -380 M10 -190 C 60 -210, 110 -240, 140 -280" stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
      <Inc d="M0 -20 C 4 -80, -8 -140, 2 -200" w={1.5} />
      {copas.map(([cx, cy], c) =>
        Array.from({ length: Math.round(22 * hojas) }, (_, i) => {
          const u = azar(c * 31 + i), v = azar(c * 17 + i + 100);
          const lx = cx + Math.cos(u * 6.28) * v * 72, ly = cy + Math.sin(u * 6.28) * v * 44;
          return <ellipse key={`${c}-${i}`} cx={lx} cy={ly} rx={6} ry={17} fill={i % 8 === 0 ? C.purpura : color} transform={`rotate(${u * 360 + Math.sin(f / 18 + i + c) * 7} ${lx} ${ly})`} />;
        }))}
      {frutos > 0 && copas.map(([cx, cy], c) => Array.from({ length: 3 }, (_, i) => {
        const k = c * 3 + i, u = azar(k + 7), v = azar(k + 70);
        const fx = cx + (u - 0.5) * 100, fy0 = cy + (v - 0.3) * 50;
        const cae = caen > 0 && k % 4 === 1 ? Math.min(1, Math.max(0, caen * 1.6 - azar(k) * 0.6)) : 0;
        const fy = fy0 + cae * cae * (-fy0 - 10);
        return (
          <g key={k} transform={`translate(${fx} ${fy}) scale(${Math.min(1, frutos * 1.4 - azar(k + 3) * 0.4)})`}>
            <circle r={11 * tf} fill={fruta} stroke={C.negro} strokeWidth={2.5} />
            <circle cx={-3} cy={-3} r={3} fill={C.blanco} opacity={0.7} />
          </g>
        );
      }))}
    </g>
  );
};

/** Flor que brota (c: 0→1). */
export const Flor: React.FC<{ x: number; y?: number; c: number; s?: number; color?: string }> = ({ x, y = SUELO, c, s = 1, color = C.purpura }) => {
  if (c <= 0) return null;
  const h = 60 * c;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 C 4 ${-h * 0.4}, -4 ${-h * 0.7}, 0 ${-h}`} stroke={C.negro} strokeWidth={4} fill="none" />
      <path d={`M0 ${-h * 0.4} q 16 -10 20 -24 q -16 4 -20 18`} fill={C.negro} opacity={c} />
      {c > 0.6 && [0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={0} cy={-h} rx={5} ry={11 * (c - 0.6) * 2.5} fill={color} stroke={C.negro} strokeWidth={1.5} transform={`rotate(${a} 0 ${-h}) translate(0 -8)`} />)}
      {c > 0.6 && <circle cx={0} cy={-h} r={5} fill={C.oro} />}
    </g>
  );
};

/** Pájaro en vuelo. */
export const Pajaro: React.FC<{ x: number; y: number; s?: number; f: number; voltear?: boolean; opacity?: number }> = ({ x, y, s = 1, f, voltear, opacity = 1 }) => {
  const al = Math.sin(f * 0.35 + x) * 38;
  const ala = (sg: number) => {
    const raiz: P = [0, -4], codo = desde(raiz, 180 + al * sg * 0.6 - 25, 60), punta = desde(codo, 180 + al * sg - 55, 70);
    return suave([raiz, codo, punta, lerp(punta, raiz, 0.3), [20, 4]], true);
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`} opacity={opacity}>
      <path d={ala(-1)} fill={C.negro} opacity={0.85} />
      <path d="M-40 0 L -86 -16 L -80 0 L -88 14 Z" fill={C.negro} />
      <path d={suave([[-50, 2], [-10, -14], [30, -14], [52, -8], [42, 8], [0, 12], [-40, 8]], true)} fill={C.negro} />
      <path d="M50 -10 L 66 -4 L 50 0 Z" fill={C.negro} />
      <circle cx={42} cy={-8} r={2.5} fill={C.crema} />
      <path d={ala(1)} fill={C.negro} />
      <Inc d="M-30 0 Q 0 4 30 -2" w={1.3} />
    </g>
  );
};

/** Mesa de banquete con comida, copas y ánforas. Origen = centro de la base. */
export const Mesa: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 -110 L-150 0 M170 -110 L150 0 M-60 -110 L-56 0 M60 -110 L56 0" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
    <rect x={-190} y={-124} width={380} height={18} rx={4} fill={C.negro} />
    <Borde d="M-186 -114 L186 -114" w={6} />
    {/* fuente con frutas */}
    <path d="M-120 -124 Q -80 -170 -40 -124 Z" fill={C.negro} />
    {[[-96, -150], [-80, -160], [-64, -148], [-88, -136], [-72, -136]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={9} fill={i % 2 ? C.oro : C.purpura} stroke={C.negro} strokeWidth={2} />)}
    {/* racimo */}
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={10 + (i % 3) * 10 + Math.floor(i / 3) * 4} cy={-136 - Math.floor(i / 3) * -10 - 26} r={6} fill={C.purpura} stroke={C.negro} strokeWidth={1.5} />)}
    <path d="M24 -170 l 6 -14" stroke={C.negro} strokeWidth={3} />
    {/* copa (kílix) y cratera */}
    <path d="M80 -124 L92 -124 L92 -140 Q 60 -146 64 -156 L 120 -156 Q 124 -146 92 -140" fill={C.negro} />
    <path d="M130 -124 L170 -124 L180 -170 C 196 -170, 196 -150, 186 -146 M130 -124 L120 -170 C 104 -170, 104 -150, 114 -146 M116 -174 L184 -174" fill={C.negro} stroke={C.negro} strokeWidth={6} />
    <circle cx={150} cy={-200} r={30} fill="url(#halo)" opacity={0.3 + Math.sin(f / 7) * 0.1} />
  </g>
);

/** Casa de la aldea; `color` cambia el material (bronce, piedra…). */
export const Casa: React.FC<{ x: number; y?: number; s?: number; luz?: number; f?: number; color?: string; puerta?: number }> = ({ x, y = SUELO, s = 1, luz = 0, f = 0, color = C.negro, puerta = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-250} width={400} height={250} fill={color} stroke={C.negro} strokeWidth={color === C.negro ? 0 : 4} />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, i) => (
      <rect key={`${r}-${i}`} x={-196 + i * 80 + (r % 2) * 40} y={-246 + r * 40} width={76} height={36} fill="none" stroke={color === C.negro ? C.crema : C.negro} strokeWidth={1.2} opacity={0.35} />
    )))}
    <path d="M-230 -250 L0 -350 L230 -250 Z" fill={color} stroke={C.negro} strokeWidth={color === C.negro ? 0 : 4} />
    <Borde d="M-230 -252 L230 -252" w={10} />
    <path d="M-150 -262 L0 -330 L150 -262" stroke={color === C.negro ? C.crema : C.negro} strokeWidth={2} fill="none" />
    <circle cx={0} cy={-286} r={12} fill={C.purpura} stroke={C.blanco} strokeWidth={2} />
    <path d="M-50 0 L-50 -170 Q 0 -200 50 -170 L50 0 Z" fill={luz ? '#3A1408' : '#2A120A'} stroke={C.purpura} strokeWidth={6} />
    {luz > 0 && <circle cx={0} cy={-80} r={90} fill="url(#halo)" opacity={luz * (0.7 + Math.sin(f / 4) * 0.1)} style={{ mixBlendMode: 'screen' }} />}
    {/* hoja de la puerta (se cierra con `puerta` 1) */}
    {puerta > 0 && <path d={`M-50 0 L-50 -170 Q ${-50 + 50 * puerta} ${-185 - 15 * puerta} ${-50 + 100 * puerta} -170 L${-50 + 100 * puerta} 0 Z`} fill={C.negro} stroke={C.crema} strokeWidth={2} />}
    <rect x={-150} y={-180} width={50} height={50} fill={luz ? C.oro : '#2A120A'} opacity={luz ? 0.4 + luz * 0.5 : 1} stroke={C.purpura} strokeWidth={4} />
    <rect x={100} y={-180} width={50} height={50} fill={luz ? C.oro : '#2A120A'} opacity={luz ? 0.4 + luz * 0.5 : 1} stroke={C.purpura} strokeWidth={4} />
  </g>
);

/** Altar de piedra con fuego de sacrificio. */
export const Altar: React.FC<{ x: number; y?: number; f: number; fuego?: number; s?: number; rot?: number }> = ({ x, y = SUELO, f, fuego = 1, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot} 80 0)`}>
    <rect x={-80} y={-130} width={160} height={130} fill={C.negro} />
    <rect x={-96} y={-150} width={192} height={22} fill={C.negro} />
    <rect x={-96} y={-12} width={192} height={12} fill={C.negro} />
    <circle cx={-92} cy={-148} r={14} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <circle cx={92} cy={-148} r={14} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <path d="M-60 -100 h120 M-60 -40 h120" stroke={C.crema} strokeWidth={2} />
    {[-40, 0, 40].map((cx) => <path key={cx} d={`M${cx - 12} -70 l 12 -16 l 12 16 l -12 16 Z`} fill={C.purpura} stroke={C.crema} strokeWidth={1.5} />)}
    {fuego > 0.02 && <g transform={`translate(0 -150) scale(${fuego})`}><Fuego f={f} s={0.9} viento={-10} /></g>}
  </g>
);

/** Columna de humo en volutas. */
export const Humo: React.FC<{ x: number; y: number; f: number; alto?: number; o?: number; color?: string }> = ({ x, y, f, alto = 360, o = 0.7, color = C.crema }) => (
  <g opacity={o}>
    {Array.from({ length: 9 }, (_, i) => {
      const t = ((f * 0.6 + i * (alto / 9)) % alto) / alto;
      const cx = x + Math.sin(t * 6 + i) * 30 * t - t * 60, cy = y - t * alto;
      const r = 14 + t * 40;
      return <path key={i} d={`M${cx - r} ${cy} a ${r} ${r * 0.7} 0 1 1 ${r * 2} 0 a ${r * 0.5} ${r * 0.4} 0 1 1 ${-r} 0`} fill="none" stroke={color} strokeWidth={4} opacity={Math.sin(t * Math.PI)} />;
    })}
  </g>
);

/** Nieve que cae sobre la ventana. */
export const Nieve: React.FC<{ f: number; o: number; n?: number; x0?: number; ancho?: number }> = ({ f, o, n = 70, x0 = -140, ancho = 2200 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const y = 120 + ((f * (1.5 + azar(i) * 1.5) + azar(i + 5) * 700) % 700);
      const x = (azar(i + 11) * ancho + Math.sin(f / 20 + i) * 30 - f * 0.8) % ancho;
      return <circle key={i} cx={x0 + ((x + ancho) % ancho)} cy={y} r={2 + azar(i + 2) * 3} fill={C.blanco} />;
    })}
  </g>
);

/** Lluvia en trazos oblicuos. */
export const Lluvia: React.FC<{ f: number; o: number; n?: number; x0?: number; ancho?: number }> = ({ f, o, n = 90, x0 = -200, ancho = 2400 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const y = 120 + ((f * (14 + azar(i) * 6) + azar(i + 5) * 720) % 720);
      const x = x0 + ((azar(i + 11) * ancho - y * 0.25) % ancho + ancho) % ancho;
      return <path key={i} d={`M${x} ${y} l -8 34`} stroke={C.crema} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />;
    })}
  </g>
);

/** Constelación que se dibuja (t: 0→1). */
export const Constelacion: React.FC<{ pts: P[]; t: number }> = ({ pts, t }) => {
  const k = t * (pts.length - 1);
  return (
    <g>
      {pts.slice(1).map((p, i) => {
        const u = Math.max(0, Math.min(1, k - i));
        if (u <= 0) return null;
        const q = lerp(pts[i], p, u);
        return <path key={i} d={`M${pts[i][0]} ${pts[i][1]} L${q[0]} ${q[1]}`} stroke={C.crema} strokeWidth={2} strokeDasharray="6 6" />;
      })}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={6} fill={C.blanco} opacity={Math.max(0, Math.min(1, k - i + 1))} />)}
    </g>
  );
};

/** Balanza de la justicia; `inc` = inclinación en grados. Origen = fiel. Con `mano` se dibuja sin pie (colgando). */
export const Balanza: React.FC<{ x: number; y: number; s?: number; inc?: number; izq?: React.ReactNode; der?: React.ReactNode; mano?: boolean }> = ({ x, y, s = 1, inc = 0, izq, der, mano }) => {
  const r = (inc * Math.PI) / 180, L = 150;
  const pI: P = [-Math.cos(r) * L, -Math.sin(r) * L], pD: P = [Math.cos(r) * L, Math.sin(r) * L];
  const plato = (p: P, hijo: React.ReactNode, k: string) => (
    <g key={k}>
      <path d={`M${p[0]} ${p[1]} L${p[0] - 46} ${p[1] + 100} M${p[0]} ${p[1]} L${p[0] + 46} ${p[1] + 100}`} stroke={C.negro} strokeWidth={2.5} />
      <g transform={`translate(${p[0]} ${p[1] + 100})`}>{hijo}</g>
      <path d={`M${p[0] - 58} ${p[1] + 100} Q ${p[0]} ${p[1] + 132} ${p[0] + 58} ${p[1] + 100} Z`} fill={C.oro} stroke={C.negro} strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {!mano && (
        <>
          <path d="M0 -10 L0 290" stroke={C.negro} strokeWidth={12} />
          <path d="M-60 300 L60 300 L36 284 L-36 284 Z" fill={C.negro} />
        </>
      )}
      <path d={`M${pI[0]} ${pI[1]} L${pD[0]} ${pD[1]}`} stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${pI[0] * 0.8} ${pI[1] * 0.8} L${pD[0] * 0.8} ${pD[1] * 0.8}`} stroke={C.crema} strokeWidth={1.6} strokeDasharray="6 6" />
      <circle r={12} fill={C.oro} stroke={C.negro} strokeWidth={3} />
      {plato(pI, izq, 'i')}
      {plato(pD, der, 'd')}
    </g>
  );
};

/** Buey caminando. Origen = pies, mira a la derecha. */
export const Buey: React.FC<{ x: number; y?: number; s?: number; f: number; anda?: boolean }> = ({ x, y = SUELO, s = 1, f, anda = true }) => {
  const ph = anda ? f * 0.18 : 0;
  const pata = (px: number, fase: number) => {
    const a = Math.sin(ph + fase) * 16;
    const k = desde([px, -110], a, 60), t = desde(k, a * 0.3 - 6, 54);
    return <path key={px + fase} d={miembro([[px, -110], k, t], [26, 16, 12])} fill={C.negro} />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pata(-90, Math.PI)}
      {pata(60, 0)}
      <path d={suave([[-130, -150], [-60, -176], [40, -178], [100, -170], [120, -130], [90, -96], [-20, -92], [-110, -100], [-140, -120]], true)} fill={C.negro} />
      <path d="M-136 -136 C -160 -120, -160 -80, -150 -60" stroke={C.negro} strokeWidth={6} fill="none" />
      <path d={suave([[96, -170], [140, -184], [176, -160], [180, -130], [160, -120], [124, -126]], true)} fill={C.negro} />
      <path d="M130 -184 C 120 -210, 140 -220, 150 -214 M146 -184 C 156 -206, 176 -210, 182 -198" stroke={C.negro} strokeWidth={6} fill="none" />
      <circle cx={158} cy={-160} r={3.5} fill={C.crema} />
      <Inc d={suave([[-90, -164], [-20, -168], [60, -164]])} w={1.6} />
      <Inc d={suave([[96, -160], [104, -130], [96, -104]])} w={1.6} />
      {[-60, -20, 20].map((dx) => <Inc key={dx} d={`M${dx} -150 q 8 20 0 40`} w={1.3} />)}
      <Borde d="M110 -176 L118 -128" w={8} />
      {pata(-70, 0)}
      {pata(80, Math.PI)}
    </g>
  );
};

/** Arado de madera. Origen = punta de la reja en el suelo. */
export const Arado: React.FC<{ x: number; y?: number; s?: number }> = ({ x, y = SUELO, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 L60 -16 L230 -130" stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M40 -10 L-40 -220 L-64 -230" stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M0 0 L40 -4 L30 -18 Z" fill={PLATA} stroke={C.negro} strokeWidth={2} />
  </g>
);

/** Fresno alto cuyo tronco se abre (abre 0→1) y deja salir luz de bronce. Origen = base. */
export const Fresno: React.FC<{ x: number; y?: number; s?: number; f: number; abre?: number }> = ({ x, y = SUELO, s = 1, f, abre = 0 }) => {
  const g = abre * 46;
  const mitad = (sg: number) => (
    <g transform={`translate(${sg * g} 0) rotate(${sg * abre * 4} 0 0)`}>
      <path d={sg < 0 ? 'M-46 0 C -40 -120, -34 -260, -30 -420 L 0 -430 L 0 0 Z' : 'M46 0 C 40 -120, 34 -260, 30 -420 L 0 -430 L 0 0 Z'} fill={C.negro} />
      {[0, 1, 2].map((i) => <Inc key={i} d={`M${sg * (10 + i * 10)} -20 C ${sg * (14 + i * 8)} -160, ${sg * (8 + i * 8)} -280, ${sg * (6 + i * 6)} -400`} w={1.3} />)}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {abre > 0 && <ellipse cx={0} cy={-200} rx={40 + abre * 80} ry={240} fill="url(#halo)" opacity={abre} style={{ mixBlendMode: 'screen' }} />}
      {abre > 0 && <path d={`M${-g * 0.6} 0 Q 0 -230 ${-g * 0.4} -420 L ${g * 0.4} -420 Q 0 -230 ${g * 0.6} 0 Z`} fill={BRONCE} opacity={0.8 * abre} />}
      {mitad(-1)}
      {mitad(1)}
      {/* copa: ramas finas con hojas compuestas de fresno */}
      <path d="M-20 -400 C -80 -440, -140 -470, -190 -470 M20 -400 C 80 -440, 150 -460, 200 -450 M0 -420 C -10 -480, -20 -520, -50 -560 M0 -420 C 20 -480, 40 -520, 70 -550" stroke={C.negro} strokeWidth={12} fill="none" strokeLinecap="round" />
      {[[-190, -470], [200, -450], [-50, -560], [70, -550], [-110, -500], [120, -500], [0, -520]].map(([cx, cy], c) =>
        Array.from({ length: 5 }, (_, i) => {
          const a = -60 + i * 30 + Math.sin(f / 20 + c) * 5;
          const p = desde([cx, cy], 180 + a, 40);
          return (
            <g key={`${c}-${i}`}>
              <path d={`M${cx} ${cy} L${p[0]} ${p[1]}`} stroke={C.negro} strokeWidth={3} />
              {[0.4, 0.7, 1].map((t) => { const q = lerp([cx, cy], p, t); return <ellipse key={t} cx={q[0]} cy={q[1]} rx={5} ry={12} fill={i === 2 && t === 1 ? C.purpura : C.negro} transform={`rotate(${a + 90} ${q[0]} ${q[1]})`} />; })}
            </g>
          );
        }))}
    </g>
  );
};

/** Estela funeraria lisa, sin nombre. */
export const Estela: React.FC<{ x: number; y?: number; s?: number; o?: number; rot?: number }> = ({ x, y = SUELO, s = 1, o = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`} opacity={o}>
    <path d="M-60 0 C -50 -26, 50 -26, 60 0 Z" fill={C.negro} />
    <path d="M-28 -16 L-24 -190 L24 -190 L28 -16 Z" fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <path d="M-34 -190 C -30 -230, 30 -230, 34 -190 Z" fill={C.negro} />
    <path d="M-20 -206 q 20 -20 40 0" stroke={C.purpura} strokeWidth={5} fill="none" />
    <rect x={-14} y={-170} width={28} height={110} fill="none" stroke={C.crema} strokeWidth={1.3} strokeDasharray="4 6" opacity={0.6} />
  </g>
);

/** Boca del reino de Hades: cueva negra con escalones que bajan. Origen = base. */
export const BocaHades: React.FC<{ x: number; y?: number; s?: number; f: number }> = ({ x, y = SUELO, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-340 0 C -330 -220, -200 -380, 0 -390 C 200 -380, 330 -220, 340 0 Z" fill="#2A120A" />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 + r }, (_, i) => {
      const yy = -320 + r * 60, w = 120 + r * 44, cx = -w + ((i + 0.5) * 2 * w) / (4 + r);
      return <path key={`${r}-${i}`} d={`M${cx - 22} ${yy} a 22 14 0 0 1 44 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.6} />;
    }))}
    <path d="M-170 0 C -170 -150, -90 -230, 0 -232 C 90 -230, 170 -150, 170 0 Z" fill={C.noche} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-150 + i * 22} ${-i * 26} L${150 - i * 22} ${-i * 26}`} stroke={C.purpura} strokeWidth={5} opacity={0.6} />)}
    <circle cx={0} cy={-90} r={110} fill="url(#halo)" opacity={0.12 + Math.sin(f / 9) * 0.04} />
    <Borde d="M-176 -6 C -176 -156, -92 -238, 0 -240 C 92 -238, 176 -156, 176 -6" w={9} />
  </g>
);

/** Muralla con torres y puertas (Tebas, Troya). Origen = extremo izquierdo de la base. */
export const Muralla: React.FC<{ x: number; y?: number; ancho: number; alto?: number; puertas?: number; color?: string; lumbre?: number; f?: number }> = ({ x, y = SUELO, ancho, alto = 300, puertas = 3, color = C.negro, lumbre = 0, f = 0 }) => {
  const torres = puertas + 1, paso = ancho / puertas;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-alto} width={ancho} height={alto} fill={color} />
      {Array.from({ length: Math.floor(ancho / 40) }, (_, i) => <rect key={i} x={i * 40 + 6} y={-alto - 22} width={24} height={22} fill={color} />)}
      {Array.from({ length: Math.floor(alto / 40) }, (_, r) => <path key={r} d={`M0 ${-alto + 40 + r * 40} H${ancho}`} stroke={C.crema} strokeWidth={1} opacity={0.25} />)}
      {Array.from({ length: torres }, (_, i) => (
        <g key={i} transform={`translate(${i * paso} 0)`}>
          <rect x={-40} y={-alto - 70} width={80} height={alto + 70} fill={color} />
          {[-30, -6, 18].map((dx) => <rect key={dx} x={dx} y={-alto - 92} width={14} height={22} fill={color} />)}
          <rect x={-8} y={-alto - 40} width={16} height={26} fill={lumbre ? C.oro : '#2A120A'} opacity={lumbre ? 0.5 + Math.sin(f / 5 + i) * 0.2 : 1} />
        </g>
      ))}
      {Array.from({ length: puertas }, (_, i) => (
        <g key={i} transform={`translate(${(i + 0.5) * paso} 0)`}>
          <path d="M-46 0 L-46 -130 Q 0 -168 46 -130 L46 0 Z" fill="#2A120A" stroke={C.purpura} strokeWidth={6} />
          <Inc d="M0 0 L0 -150" w={2} />
        </g>
      ))}
    </g>
  );
};

/** Barco de guerra griego (casco negro, ojo apotropaico, espolón, remos y vela). Origen = línea de flotación al centro. */
export const Barco: React.FC<{ x: number; y: number; s?: number; f: number; vela?: boolean; voltear?: boolean; remeros?: boolean }> = ({ x, y, s = 1, f, vela = true, voltear, remeros = true }) => {
  const balanceo = Math.sin(f / 16 + x * 0.01) * 2.5;
  const remo = Math.sin(f * 0.25) * 16;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 12 + x) * 5}) rotate(${balanceo}) scale(${voltear ? -s : s} ${s})`}>
      {/* remos */}
      {Array.from({ length: 9 }, (_, i) => {
        const r0: P = [-170 + i * 38, -20], r1 = desde(r0, 30 + remo, 90);
        return <path key={i} d={`M${r0[0]} ${r0[1]} L${r1[0]} ${r1[1]}`} stroke={C.negro} strokeWidth={5} />;
      })}
      {/* casco */}
      <path d="M-260 -60 C -250 -40, -220 -10, -180 0 L 220 0 L 300 6 L 230 -30 L 210 -44 C 230 -70, 250 -90, 260 -120 C 230 -90, 200 -66, 170 -56 L -200 -56 C -220 -70, -240 -100, -250 -130 C -260 -110, -262 -80, -260 -60 Z" fill={C.negro} />
      <Borde d="M-200 -42 L200 -42" w={8} />
      <path d="M216 -36 Q 226 -44 236 -36 Q 226 -28 216 -36 Z" fill={C.blanco} stroke={C.negro} strokeWidth={1.5} />
      <circle cx={226} cy={-36} r={3.5} fill={C.negro} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-170 + i * 38} cy={-20} r={4} fill={C.crema} />)}
      {/* remeros (cabecitas) */}
      {remeros && Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <circle cx={-140 + i * 50} cy={-74 + Math.sin(f * 0.25 + i) * 2} r={11} fill={C.negro} />
          <path d={`M${-150 + i * 50} -82 q 10 -10 22 -2`} stroke={C.purpura} strokeWidth={4} fill="none" />
        </g>
      ))}
      {/* mástil y vela */}
      {vela && (
        <>
          <path d="M0 -56 L0 -330" stroke={C.negro} strokeWidth={8} />
          <path d="M-130 -310 L130 -310" stroke={C.negro} strokeWidth={7} />
          <path d={`M-126 -306 C -120 -230, -126 -160, -120 -110 L 120 -110 C ${126 + Math.sin(f / 10) * 6} -170, ${120 + Math.sin(f / 10) * 8} -240, 126 -306 Z`} fill={C.blanco} stroke={C.negro} strokeWidth={3} />
          {[-80, -30, 20, 70].map((dx) => <path key={dx} d={`M${dx} -306 L${dx + 4} -112`} stroke={C.negro} strokeWidth={2} opacity={0.6} />)}
          <path d="M-120 -170 L 120 -170 M-122 -230 L 122 -230" stroke={C.purpura} strokeWidth={6} />
        </>
      )}
    </g>
  );
};

/** Isla de los Bienaventurados: colina verde-negra con frutales y luz. Origen = centro de la base (al nivel del mar). */
export const Isla: React.FC<{ x: number; y: number; s?: number; f: number; luz?: number; frutos?: number }> = ({ x, y, s = 1, f, luz = 1, frutos = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-200} rx={520} ry={260} fill="url(#halo)" opacity={0.5 * luz} style={{ mixBlendMode: 'screen' }} />
    <path d="M-460 20 C -380 -60, -260 -120, -100 -130 C 80 -140, 280 -100, 460 20 Z" fill={C.negro} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-360 + i * 96} ${-60 - Math.sin((i / 7) * Math.PI) * 50} a 22 12 0 0 1 44 0`} stroke={C.crema} strokeWidth={1.6} fill="none" opacity={0.5} />)}
    <Frutal x={-180} y={-100} s={0.55} f={f} frutos={frutos} tf={1.8} />
    <Frutal x={120} y={-120} s={0.7} f={f + 30} frutos={frutos} tf={1.6} />
    <Frutal x={300} y={-50} s={0.45} f={f + 60} frutos={frutos} tf={2} />
  </g>
);

/** Pico de minero sostenido en la mano (origen = mano), con ángulo. */
export const Pico: React.FC<{ p: P; ang: number; s?: number }> = ({ p, ang, s = 1 }) => (
  <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang}) scale(${s})`}>
    <path d="M0 30 L0 -110" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
    <path d="M-70 -96 C -30 -130, 30 -130, 70 -96 C 30 -112, -30 -112, -70 -96 Z" fill={HIERRO} stroke={C.negro} strokeWidth={4} />
  </g>
);

/** Aro y palito (juguete de los niños griegos). Origen = suelo bajo el aro. */
export const Aro: React.FC<{ x: number; y?: number; r?: number; f: number }> = ({ x, y = SUELO, r = 46, f }) => (
  <g transform={`translate(${x} ${y - r})`}>
    <circle r={r} fill="none" stroke={C.negro} strokeWidth={7} />
    <g transform={`rotate(${f * 8})`}>
      {[0, 90, 180, 270].map((a) => <circle key={a} cx={0} cy={-r} r={4} fill={C.purpura} transform={`rotate(${a})`} />)}
    </g>
  </g>
);

/** Trono con respaldo alto y patas de león. Origen = base del asiento. */
export const Trono: React.FC<{ x: number; y?: number; s?: number; voltear?: boolean }> = ({ x, y = SUELO, s = 1, voltear }) => (
  <g transform={`translate(${x} ${y}) scale(${voltear ? -s : s} ${s})`}>
    <path d="M-80 -150 L-90 -440 L-60 -460 L-50 -150 Z" fill={C.negro} />
    <circle cx={-76} cy={-470} r={16} fill={C.negro} stroke={C.crema} strokeWidth={2} />
    <rect x={-90} y={-170} width={170} height={24} fill={C.negro} />
    <Borde d="M-88 -158 L78 -158" w={8} />
    <path d="M-80 -150 C -90 -80, -70 -40, -84 0 L -60 0 C -54 -50, -60 -100, -54 -150 Z M60 -150 C 50 -80, 70 -40, 56 0 L 80 0 C 84 -50, 76 -100, 80 -150 Z" fill={C.negro} />
    <Inc d="M-74 -420 L-66 -180" w={1.6} />
  </g>
);

/** Veta de mineral brillante en la ladera (oro o hierro). */
export const Veta: React.FC<{ x: number; y: number; t: number; f: number; color?: string }> = ({ x, y, t, f, color = C.oro }) => (
  <g transform={`translate(${x} ${y})`} opacity={t}>
    <circle r={70} fill="url(#halo)" opacity={0.6 + Math.sin(f / 5) * 0.15} style={{ mixBlendMode: 'screen' }} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${(azar(i) - 0.5) * 80} ${(azar(i + 9) - 0.5) * 50} l 10 -14 l 12 6 l -4 16 Z`} fill={i % 2 ? color : C.blanco} stroke={C.negro} strokeWidth={1.5} />)}
  </g>
);

/** Polvo dorado que cae (riqueza que reparten los espíritus). */
export const PolvoOro: React.FC<{ x: number; y: number; f: number; o: number; ancho?: number; alto?: number }> = ({ x, y, f, o, ancho = 90, alto = 160 }) => (
  <g opacity={o}>
    {Array.from({ length: 30 }, (_, i) => {
      const e = (f * 1.6 + i * 9) % alto, a = azar(i + 50);
      return <circle key={i} cx={x + (a - 0.5) * ancho + Math.sin(e / 10 + i) * 8} cy={y + e} r={2 + a * 2.5} fill={i % 3 ? C.oro : C.blanco} opacity={1 - e / alto} />;
    })}
  </g>
);

/** Bancos de niebla que se deslizan (en coordenadas de pantalla). */
export const Niebla: React.FC<{ f: number; o: number; y?: number; n?: number }> = ({ f, o, y = 560, n = 4 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const x = ((f * (0.8 + i * 0.3) + i * 610) % 2600) - 400, yy = y + i * 50;
      return <path key={i} d={`M${x} ${yy} c 60 -24, 140 -24, 200 0 c 60 24, 140 24, 200 0 c 60 -24, 140 -24, 200 0`} stroke={C.blanco} strokeWidth={18 + i * 6} fill="none" strokeLinecap="round" opacity={0.2} />;
    })}
  </g>
);

/** Hogaza de pan. */
export const Pan: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <path d="M-34 0 C -36 -30, 36 -30, 34 0 Z" fill={C.barroOscuro} stroke={C.negro} strokeWidth={3} />
    <Inc d="M-16 -6 L-8 -20 M0 -4 L8 -20 M16 -6 L22 -16" c={C.negro} w={2} />
  </g>
);

/** Espiga de trigo que crece (c 0→1). */
export const Espiga: React.FC<{ x: number; y?: number; c: number; s?: number; color?: string }> = ({ x, y = SUELO, c, s = 1, color = C.oro }) => {
  if (c <= 0) return null;
  const h = 110 * c;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q 6 ${-h * 0.5} 2 ${-h}`} stroke={C.negro} strokeWidth={3} fill="none" />
      {c > 0.5 && Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <ellipse cx={-4} cy={-h + 8 + i * 9} rx={4} ry={7} fill={color} stroke={C.negro} strokeWidth={1.3} transform={`rotate(-25 -4 ${-h + 8 + i * 9})`} />
          <ellipse cx={8} cy={-h + 8 + i * 9} rx={4} ry={7} fill={color} stroke={C.negro} strokeWidth={1.3} transform={`rotate(25 8 ${-h + 8 + i * 9})`} />
        </g>
      ))}
    </g>
  );
};
