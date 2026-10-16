// Biblioteca del estilo "vasija griega detallada" (figuras negras con incisiones y colores añadidos).
// Todo lo común a los videos vive acá: utilidades de curvas, personajes, guardas, escenario y cámara.
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as cargarGaramond } from '@remotion/google-fonts/EBGaramond';
import { loadFont as cargarCinzel } from '@remotion/google-fonts/Cinzel';
import { GuardasCodice, SueloCodice } from './codice';
import { GuardasPahari, SueloPahari } from './pahari';
import { GuardasKamasan, SueloKamasan } from './kamasan';
import { GuardasMaori, SueloMaori } from './kowhaiwhai';

export const { fontFamily: TEXTO } = cargarGaramond('normal', { weights: ['500'], subsets: ['latin'] });
export const { fontFamily: TITULO } = cargarCinzel('normal', { weights: ['400', '700'], subsets: ['latin'] });

export type P = [number, number];
export const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const C = {
  barro: '#C9682F', barroClaro: '#E08A4C', barroOscuro: '#8C3D18', negro: '#17110E', crema: '#F1DDB4',
  purpura: '#7E2B22', blanco: '#F7EEDB', oro: '#F2C35B', noche: '#0F0B09', mar: '#2E4A5C',
};

// ---------- temas por mitología ----------
// Cada mitología tiene la "piel" de su arte: griega = vasija de figuras negras; nórdica = piedra rúnica
// helada (azules, nieve y rojo de runa). El motor es el mismo; cambian paleta, cielos, guardas y suelo.
export type NombreTema = 'pahari' | 'vasija' | 'runas' | 'papiro' | 'kapa' | 'pintado' | 'codice' | 'kowhaiwhai' | 'kamasan';
type Cielos = Record<'barro' | 'noche' | 'mar' | 'inframundo', [string, string, string]>;
const TEMAS: Record<NombreTema, { C: typeof C; cielos: Cielos; musica: string; ropa?: string; pielH?: string; pielM?: string }> = {
  vasija: {
    C: { ...C },
    cielos: { barro: [C.barroClaro, C.barro, C.barroOscuro], noche: ['#A65A32', '#7A3A1C', '#3A1A0C'], mar: ['#D99A5E', '#B8682F', '#6E3416'], inframundo: ['#5A2A1C', '#2E140C', '#120806'] },
    musica: 'musica/lira-griega.wav',
  },
  runas: {
    C: { barro: '#9DBBD1', barroClaro: '#DCE9F2', barroOscuro: '#5E7F99', negro: '#132233', crema: '#EAF3F9', purpura: '#A8322B', blanco: '#FFFFFF', oro: '#E9C46A', noche: '#08111B', mar: '#2F5D80' },
    cielos: { barro: ['#F2F7FA', '#C3D8E7', '#86A6BF'], noche: ['#2D5274', '#16304A', '#08131F'], mar: ['#E2EDF4', '#A9C4D8', '#5F829F'], inframundo: ['#5C6873', '#2B333B', '#0E1216'] },
    musica: 'musica/nordica.wav',
  },
  papiro: {
    C: { barro: '#D8B878', barroClaro: '#F3E5C2', barroOscuro: '#A57C47', negro: '#1D1712', crema: '#F7EEDC', purpura: '#B4412C', blanco: '#FBF7EE', oro: '#E3B23C', noche: '#0D1A2E', mar: '#2E7A8C' },
    cielos: { barro: ['#FDF4DD', '#EED8A6', '#CDA569'], noche: ['#22406E', '#112448', '#060D1C'], mar: ['#F5E9C9', '#DCC48F', '#9E7D4C'], inframundo: ['#3A2A3C', '#1D1423', '#0A070C'] },
    musica: 'musica/egipcia.wav',
    ropa: '#F4EFE2', pielH: '#A4522F', pielM: '#E2AC52',
  },
  // Hawaiana: tela kapa (corteza) — marrón tierra, negro hollín, rojo ʻalaea, crema; mar turquesa, lava, plumas amarillas.
  kapa: {
    C: { barro: '#E2B680', barroClaro: '#F3DDB4', barroOscuro: '#6B3F1D', negro: '#1A1410', crema: '#F4E6C8', purpura: '#B2331F', blanco: '#FFF7E8', oro: '#E8B81C', noche: '#0B1626', mar: '#1E6E7E' },
    cielos: { barro: ['#FCEBC4', '#F3C98A', '#D9925A'], noche: ['#24406A', '#112241', '#050A16'], mar: ['#D4F0EC', '#86CFCF', '#2C8C96'], inframundo: ['#3A1A12', '#1C0C08', '#080403'] },
    musica: 'musica/hawaiana.wav',
    ropa: '#C99A5B', pielH: '#8A5232', pielM: '#A8693E',
  },
  // Norteamericana: piel pintada (hide painting / ledger art) y bandas de cuentas y púas de puercoespín:
  // fondo de cuero claro, ocre rojo, negro, azul de cuentas, amarillo ocre y blanco. Piel morena natural (nunca roja).
  pintado: {
    C: { barro: '#E4C89A', barroClaro: '#F6E8C8', barroOscuro: '#7A4A28', negro: '#1C1612', crema: '#F6EBD2', purpura: '#B23A24', blanco: '#FCF7EC', oro: '#D9A23A', noche: '#0E1628', mar: '#2F6A8A' },
    cielos: { barro: ['#FCF3DC', '#EED6A6', '#CFA06A'], noche: ['#2A3C66', '#152240', '#070C1A'], mar: ['#EEF4EC', '#B4D6CE', '#5A97A0'], inframundo: ['#3A2418', '#1E120C', '#0A0604'] },
    musica: 'musica/norteamericana.wav',
    ropa: '#B98A55', pielH: '#8E5634', pielM: '#A2673F',
  },
  // Azteca (mexica): pintura de códice (Borgia, Borbónico, Florentino) — crema de piel de venado, ocre rojo,
  // turquesa, azul maya, amarillo y negro; colores planos con contorno negro. Guardas y suelo en ./codice.tsx.
  codice: {
    C: { barro: '#E9D6A6', barroClaro: '#F6EBCB', barroOscuro: '#8A4A22', negro: '#1A1311', crema: '#F3E6C4', purpura: '#B8321F', blanco: '#FBF5E4', oro: '#E6B12E', noche: '#101830', mar: '#2E7F98' },
    cielos: { barro: ['#FBF2D8', '#EFDAA8', '#CC9C5E'], noche: ['#26385F', '#131D3B', '#070B18'], mar: ['#EDF5E6', '#AED8C8', '#4E9C9C'], inframundo: ['#3E2232', '#1E1018', '#0A0608'] },
    musica: 'musica/azteca.wav',
    ropa: '#F3E6C4', pielH: '#A8603A', pielM: '#C98E4E',
  },
  // Hindú: pintura en miniatura rajput y pahari — marfil, ocre, rojo indio, azafrán, lapislázuli, malaquita y oro;
  // cielos en franja con nubes rizadas. Guardas y suelo en ./pahari.tsx.
  pahari: {
    C: { barro: '#E9C77A', barroClaro: '#F7E7BC', barroOscuro: '#8A3B1E', negro: '#1E1410', crema: '#F6ECD2', purpura: '#B3261E', blanco: '#FFF9EC', oro: '#D9A62E', noche: '#16205A', mar: '#2F6FA0' },
    cielos: { barro: ['#FBF0CF', '#F2D58C', '#D9A24A'], noche: ['#2B3A7A', '#16205A', '#080C2A'], mar: ['#EEF4F0', '#BFD9DC', '#6FA3B0'], inframundo: ['#4A1E3A', '#26102A', '#0E0610'] },
    musica: 'musica/hindu.wav',
    ropa: '#F4EEE0', pielH: '#C8875A', pielM: '#E0A878',
  },
  // Maorí: kōwhaiwhai (vigas pintadas) y talla — rojo kōkōwai, negro, blanco y ocre, con acentos de pāua y pounamu.
  // Guardas y suelo en ./kowhaiwhai.tsx.
  kowhaiwhai: {
    C: { barro: '#E6CDA0', barroClaro: '#F5E7C8', barroOscuro: '#6E1610', negro: '#15100E', crema: '#F3E7CF', purpura: '#A8251B', blanco: '#FAF5EA', oro: '#D9A441', noche: '#0C1424', mar: '#1E6E78' },
    cielos: { barro: ['#FBEFD6', '#EFD3A0', '#C98E4E'], noche: ['#22385E', '#101C36', '#050A16'], mar: ['#E4F2EC', '#9ED0C8', '#2E8A8C'], inframundo: ['#3A1A1C', '#1C0C0E', '#080404'] },
    musica: 'musica/maori.wav',
    ropa: '#B89A5C', pielH: '#8A5434', pielM: '#A36A42',
  },
  // Balinesa: pintura wayang de Kamasan — tela crema, rojo, ocre, índigo, hollín y blanco de hueso; nubes en
  // voluta, llamas y tela poleng. Guardas y suelo en ./kamasan.tsx.
  kamasan: {
    C: { barro: '#E2CC9C', barroClaro: '#F3E7C8', barroOscuro: '#8A5A2E', negro: '#1E1612', crema: '#EFE0BE', purpura: '#B23A26', blanco: '#F8F1DF', oro: '#D9A63A', noche: '#141C36', mar: '#3E5C8A' },
    cielos: { barro: ['#F6EBCF', '#EBD6A6', '#C9A16A'], noche: ['#3A4A78', '#1E2A4E', '#0B1024'], mar: ['#F1EEDD', '#C7D3DE', '#7F95BC'], inframundo: ['#5A2A22', '#2E1410', '#120806'] },
    musica: 'musica/balinesa.wav',
    ropa: '#EFE0BE', pielH: '#C8955E', pielM: '#E2BB86',
  },
};
export const TEMA = { nombre: 'vasija' as NombreTema, cielos: TEMAS.vasija.cielos, musica: TEMAS.vasija.musica, ropa: undefined as string | undefined, pielH: undefined as string | undefined, pielM: undefined as string | undefined };
export const temaDeSerie = (serie?: string): NombreTema => (serie === 'nordicas' ? 'runas' : serie === 'egipcias' ? 'papiro' : serie === 'hawaianas' ? 'kapa' : serie === 'norteamericanas' ? 'pintado' : serie === 'aztecas' ? 'codice' : serie === 'hindues' ? 'pahari' : serie === 'maories' ? 'kowhaiwhai' : serie === 'balinesas' ? 'kamasan' : 'vasija');
/** Nombre de la serie en pantalla (inglés) y en español, por tema. */
export const NOMBRE_SERIE: Record<NombreTema, { en: string; es: string }> = { vasija: { en: 'Greek Mythology', es: 'Mitología griega' }, runas: { en: 'Norse Mythology', es: 'Mitología nórdica' }, papiro: { en: 'Egyptian Mythology', es: 'Mitología egipcia' }, kapa: { en: 'Hawaiian Mythology', es: 'Mitología hawaiana' }, pintado: { en: 'Native American Mythology', es: 'Mitología Norteamericana' }, codice: { en: 'Aztec Mythology', es: 'Mitología Azteca' }, pahari: { en: 'Hindu Mythology', es: 'Mitología Hindú' }, kamasan: { en: 'Balinese Mythology', es: 'Mitología Balinesa' },kowhaiwhai: { en: 'Māori Mythology', es: 'Mitología maorí' } };
/** Cambia la paleta y la piel antes de dibujar (cada render corre en su propia pestaña). */
export function aplicarTema(serie?: string) {
  const n = temaDeSerie(serie);
  if (TEMA.nombre === n) return;
  Object.assign(C, TEMAS[n].C);
  Object.assign(TEMA, { nombre: n, cielos: TEMAS[n].cielos, musica: TEMAS[n].musica, ropa: TEMAS[n].ropa, pielH: TEMAS[n].pielH, pielM: TEMAS[n].pielM });
}

// ---------- tiempo ----------
/** 0→1 desde el frame `a` durante `d` frames, con salida suave. */
export const ap = (f: number, a: number, d = 18) => interpolate(f, [a, a + d], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
export const entre = (f: number, a: number, b: number, v0: number, v1: number, ease = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [v0, v1], { ...cl, easing: ease });
/** Número pseudoaleatorio estable en [0,1). */
export const azar = (n: number) => { const r = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return r - Math.floor(r); };

// ---------- curvas ----------
const f1 = (n: number) => n.toFixed(1);
/** Curva suave (Catmull-Rom → Bézier) por los puntos dados. */
export function suave(pts: P[], cerrado = false, tension = 1): string {
  const n = pts.length;
  const g = (i: number) => (cerrado ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (cerrado ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2), t = tension / 6;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) * t)} ${f1(p1[1] + (p2[1] - p0[1]) * t)} ${f1(p2[0] - (p3[0] - p1[0]) * t)} ${f1(p2[1] - (p3[1] - p1[1]) * t)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return cerrado ? d + 'Z' : d;
}
export const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Miembro con volumen: contorno suave alrededor de una línea con un ancho por punto. */
export function miembro(pts: P[], anchos: number[]): string {
  const izq: P[] = [], der: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = anchos[i] / 2;
    izq.push([p[0] + nx * w, p[1] + ny * w]);
    der.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return suave([...izq, ...der.reverse()], true);
}
const rad = (g: number) => (g * Math.PI) / 180;
/** Punto a distancia `l` de `o`, con ángulo en grados (0 = abajo, 90 = adelante/derecha). */
export const desde = (o: P, ang: number, l: number): P => [o[0] + Math.sin(rad(ang)) * l, o[1] + Math.cos(rad(ang)) * l];
/** Línea de incisión (los detalles grabados en crema de la cerámica). */
export const Inc: React.FC<{ d: string; w?: number; c?: string }> = ({ d, w = 2.2, c = C.crema }) => <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />;
/** Banda con puntitos blancos (borde decorado de telas). */
export const Borde: React.FC<{ d: string; w?: number; color?: string }> = ({ d, w = 8, color = C.purpura }) => (
  <>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />
    <path d={d} stroke={C.blanco} strokeWidth={w * 0.32} strokeDasharray={`1 ${w}`} strokeLinecap="round" fill="none" />
  </>
);

// ---------- cámara y capas ----------
const Cam = createContext({ x: 0, y: 0, z: 1 });
/** Capa con parallax: p = 0 queda fija, p = 1 se mueve con la cámara. */
export const Capa: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => {
  const c = useContext(Cam);
  return <g transform={`translate(${-c.x * p} ${-c.y * p})`}>{children}</g>;
};

/** Render vertical: el Escenario se dibuja con cielo extendido hacia arriba (y −1200…1080), sin guardas ni recorte. */
export const ModoVertical = createContext(false);
export const VERT_ARRIBA = 1200; // cuánto cielo extra se dibuja arriba en modo vertical

export const ARRIBA = 126; // alto de las guardas superiores
export const SUELO = 790; // línea de suelo de la escena
export const ABAJO = SUELO + 40; // inicio del friso inferior

/**
 * Lienzo de una escena: cielo de barro, cámara (x, zoom) animada, textura de arcilla y guardas.
 * camara: lista de [frame, x, zoom] por los que pasa la cámara.
 */
export const Escenario: React.FC<{ dur: number; camara?: [number, number, number][]; cielo?: 'barro' | 'noche' | 'mar' | 'inframundo'; children: React.ReactNode; guardas?: boolean;
  /** Solo puesta vertical nativa: viewBox propio [x, y, ancho, alto] y capa transparente (sin cielo ni texturas). */
  vista?: [number, number, number, number]; transparente?: boolean }> = ({ dur, camara = [[0, 0, 1]], cielo = 'barro', children, guardas = true, vista, transparente }) => {
  const f = useCurrentFrame();
  const ks = camara.map((c) => c[0]);
  const x = camara.length > 1 ? interpolate(f, ks, camara.map((c) => c[1]), { ...cl, easing: Easing.inOut(Easing.sin) }) : camara[0][1];
  const z = camara.length > 1 ? interpolate(f, ks, camara.map((c) => c[2]), { ...cl, easing: Easing.inOut(Easing.sin) }) : camara[0][2];
  const fade = Math.min(ap(f, 0, 10), interpolate(f, [dur - 8, dur], [1, 0], cl));
  const fondos = TEMA.cielos[cielo];
  const vert = useContext(ModoVertical);
  return (
    <AbsoluteFill style={transparente ? { opacity: fade } : { backgroundColor: C.negro, opacity: fade }}>
      <svg viewBox={vista ? vista.join(' ') : vert ? `0 ${-VERT_ARRIBA} 1920 ${1080 + VERT_ARRIBA}` : '0 0 1920 1080'} width="100%" height="100%">
        <defs>
          <radialGradient id="cielo" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor={fondos[0]} />
            <stop offset="55%" stopColor={fondos[1]} />
            <stop offset="100%" stopColor={fondos[2]} />
          </radialGradient>
          <radialGradient id="halo">
            <stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} />
            <stop offset="45%" stopColor="#FF9A3C" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="haloBlanco">
            <stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} />
          </radialGradient>
          <clipPath id="ventana">
            {vista ? <rect x={-6000} y={-6000} width={14000} height={14000} /> : vert ? <rect x={-2000} y={-VERT_ARRIBA} width={6000} height={1080 + VERT_ARRIBA} /> : <rect x={0} y={ARRIBA - 4} width={1920} height={ABAJO - ARRIBA + 4} />}
          </clipPath>
        </defs>
        <FiltrosHD />
        <g clipPath={vista ? undefined : 'url(#ventana)'}>
          {transparente ? null : vista ? <rect x={vista[0] - 10} y={vista[1] - 10} width={vista[2] + 20} height={vista[3] + 20} fill="url(#cielo)" /> : vert ? <rect x={-2000} y={-VERT_ARRIBA} width={6000} height={1080 + VERT_ARRIBA} fill="url(#cielo)" /> : <rect width={1920} height={1080} fill="url(#cielo)" />}
          {!transparente && TEMA.nombre === 'runas' && cielo === 'noche' && <Aurora f={f} />}
          <g transform={`translate(960 ${SUELO}) scale(${z}) translate(-960 ${-SUELO})`}>
            <Cam.Provider value={{ x, y: 0, z }}>{children}</Cam.Provider>
          </g>
        </g>
        {guardas && !vert && <Guardas desplaz={x * 0.2} />}
      </svg>
      {!transparente && <Img src={staticFile('texturas/manchas.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.35 }} />}
      {!transparente && <Img src={staticFile('texturas/grano.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: 0.22 }} />}
    </AbsoluteFill>
  );
};

// ---------- guardas ornamentales ----------
export const Lenguetas: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => (
  <g transform={`translate(${-(desplaz % 96)} ${y})`}>
    <rect x={0} y={0} width={2100} height={34} fill={C.negro} />
    {Array.from({ length: 44 }, (_, i) => (
      <path key={i} d={`M${i * 48 + 6} 0 L${i * 48 + 42} 0 L${i * 48 + 40} 14 Q${i * 48 + 24} 40 ${i * 48 + 8} 14 Z`} fill={i % 2 ? C.purpura : C.barro} stroke={C.negro} strokeWidth={2} />
    ))}
  </g>
);

export const Meandro: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => {
  const u = 12, ancho = u * 9;
  const greca = `M0 ${u * 4} V0 H${u * 4} V${u * 3} H${u} V${u} H${u * 3} V${u * 2} H${u * 2}`;
  return (
    <g transform={`translate(${-(desplaz % ancho)} ${y})`}>
      {Array.from({ length: 20 }, (_, i) => (
        <g key={i} transform={`translate(${i * ancho} 0)`}>
          <path d={greca} stroke={C.negro} strokeWidth={6} fill="none" />
          <line x1={u * 4} y1={u * 4} x2={u * 5} y2={u * 4} stroke={C.negro} strokeWidth={6} />
          <rect x={u * 5 + 6} y={4} width={u * 4 - 12} height={u * 4 - 8} fill="none" stroke={C.negro} strokeWidth={4} />
          <path d={`M${u * 5 + 10} 8 L${u * 9 - 10} ${u * 4 - 8} M${u * 9 - 10} 8 L${u * 5 + 10} ${u * 4 - 8}`} stroke={C.negro} strokeWidth={3} />
        </g>
      ))}
      <line x1={0} x2={2400} y1={-8} y2={-8} stroke={C.negro} strokeWidth={4} />
      <line x1={0} x2={2400} y1={u * 4 + 8} y2={u * 4 + 8} stroke={C.negro} strokeWidth={4} />
    </g>
  );
};

const Palmeta: React.FC<{ x: number; y: number; arriba: boolean }> = ({ x, y, arriba }) => (
  <g transform={`translate(${x} ${y}) scale(1 ${arriba ? 1 : -1})`}>
    {Array.from({ length: 9 }, (_, i) => (
      <ellipse key={i} cx={0} cy={-28} rx={6} ry={22} fill={i % 2 ? C.purpura : C.negro} transform={`rotate(${-70 + i * 17.5} 0 0) translate(0 -6)`} />
    ))}
    <circle cx={0} cy={0} r={9} fill={C.negro} />
    <path d="M-9 4 C -30 14, -40 0, -30 -8 M9 4 C 30 14, 40 0, 30 -8" stroke={C.negro} strokeWidth={4} fill="none" />
  </g>
);
export const FrisoPalmetas: React.FC<{ y: number; desplaz: number }> = ({ y, desplaz }) => (
  <g transform={`translate(${-(desplaz % 220)} ${y})`}>
    <path d={Array.from({ length: 12 }, (_, i) => `M${i * 220} 45 C ${i * 220 + 55} -5, ${i * 220 + 55} 95, ${i * 220 + 110} 45 S ${i * 220 + 165} -5, ${i * 220 + 220} 45`).join(' ')} stroke={C.negro} strokeWidth={4} fill="none" />
    {Array.from({ length: 12 }, (_, i) => (
      <g key={i}>
        <Palmeta x={i * 220 + 55} y={36} arriba />
        <Palmeta x={i * 220 + 165} y={56} arriba={false} />
      </g>
    ))}
  </g>
);

/** Guardas fijas del marco: lengüetas + meandro arriba, palmetas abajo y franja negra de subtítulos. */
export const Guardas: React.FC<{ desplaz: number }> = ({ desplaz }) => TEMA.nombre === 'kamasan' ? <GuardasKamasan desplaz={desplaz} /> : TEMA.nombre ==='kowhaiwhai' ? <GuardasMaori desplaz={desplaz} /> : TEMA.nombre === 'pahari' ? <GuardasPahari desplaz={desplaz} /> : TEMA.nombre === 'codice' ? <GuardasCodice desplaz={desplaz} /> : TEMA.nombre === 'runas' ? <GuardasRunas desplaz={desplaz} /> : TEMA.nombre === 'papiro' ? <GuardasPapiro desplaz={desplaz} /> : TEMA.nombre === 'kapa' ? <GuardasKapa desplaz={desplaz} /> : TEMA.nombre === 'pintado' ? <GuardasPintado desplaz={desplaz} /> : (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={C.barro} />
    <Lenguetas y={0} desplaz={desplaz} />
    <Meandro y={54} desplaz={desplaz} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={C.barro} />
    <line x1={0} x2={1920} y1={ABAJO} y2={ABAJO} stroke={C.negro} strokeWidth={5} />
    <FrisoPalmetas y={ABAJO + 18} desplaz={desplaz} />
    <line x1={0} x2={1920} y1={ABAJO + 120} y2={ABAJO + 120} stroke={C.negro} strokeWidth={5} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={C.negro} />
  </>
);

// ---------- personajes ----------
export type Objeto = 'rayo' | 'tridente' | 'lanza' | 'cetro' | 'antorcha' | 'hoz' | 'caduceo' | 'copa' | 'arco' | 'espada' | 'tirso' | 'martillo' | 'lira' | 'cana' | 'mjolnir' | 'hacha' | 'cuerno' | 'manzana' | 'ankh' | 'was' | 'cayado' | 'pluma' | 'anzuelo' | 'hoe' | 'batidor' | 'semillas' | 'maiz' | 'palo' | 'tambor' | 'asta' | 'mjolnir_corto' | 'gungnir' | null;
export type Ropa = 'corta' | 'larga' | 'armadura' | 'desnudo' | 'tunica'; // tunica = túnica recta a media pierna
export type Tocado = 'cinta' | 'corona' | 'casco' | 'diadema' | 'velo' | 'petaso' | 'laurel' | 'yelmo' | 'yelmoAlas' | 'sombrero'
  | 'doble' | 'blanca' | 'roja' | 'atef' | 'disco' | 'cuernosDisco' | 'trono' | 'pluma' | 'nemes' | 'plumas' | 'peluca' | 'haku' | 'mahiole'
  | 'gustoweh' | 'plumaAtras' | 'cintaTejida' | 'sombreroCesteria' | 'roach' | 'tocadoPlumas' | null;
export type Accion = 'parado' | 'caminar' | 'correr';

export type PersonajeProps = {
  /** Posición de los pies en el mundo y escala (1 ≈ 360 px de alto). */
  x: number; y?: number; s?: number;
  voltear?: boolean;
  accion?: Accion;
  /** Fase del ciclo de paso (si no se da, avanza sola con el tiempo). */
  fase?: number;
  /** Brazo de adelante: [ángulo del hombro, ángulo del codo] (0 = abajo, 90 = al frente, 180 = arriba). */
  brazo?: [number, number];
  /** Brazo de atrás (si no se da, se balancea al caminar). */
  brazoAtras?: [number, number];
  mujer?: boolean;
  barba?: boolean;
  canas?: boolean; // barba/pelo blancos (ancianos)
  ropa?: Ropa;
  capa?: string | null; // color de la capa, o null
  tocado?: Tocado;
  objeto?: Objeto;
  escudo?: boolean; // escudo redondo en el brazo de atrás
  emblema?: 'gorgona' | 'leon' | 'pulpo' | 'trisquel' | 'valknut' | 'nudo';
  /** Color de pelo y barba (Thor pelirrojo, etc.). */
  pelo?: string;
  /** Le falta un ojo (Odín): parche en vez de ojo. */
  tuerto?: boolean;
  /** Cíclope: un solo ojo grande en medio de la frente (dibujado en la cabeza, la sigue al arrodillarse o girar). */
  ciclope?: boolean;
  /** Cabeza de animal (dioses egipcios). */
  cabezaAnimal?: 'halcon' | 'chacal' | 'ibis' | 'leona' | 'set' | 'cocodrilo' | 'carnero' | 'vaca';
  /** Barba postiza de faraón/dios. */
  barbaPostiza?: boolean;
  /** Collar ancho (usekh); por defecto sí en el tema egipcio. */
  collar?: boolean;
  /** Cuerpo cubierto de estrellas (Nut). */
  estrellado?: boolean;
  alas?: boolean; // alas en los pies (Hermes, Perseo)
  inclinar?: number; // inclinación del cuerpo en grados
  cabeza?: number; // giro de cabeza arriba/abajo
  boca?: boolean; // boca abierta (gritando, hablando)
  ojosCerrados?: boolean;
  /** Borde claro para fondos oscuros. */
  contorno?: boolean;
  opacity?: number;
  /** Color del cuerpo (negro por defecto; las mujeres llevan piel blanca como en la cerámica). */
  piel?: string;
  gigante?: boolean; // proporciones más anchas
  /** Cara: enojo, tristeza, sorpresa, alegría (cejas, ojo y boca). */
  expresion?: 'neutral' | 'enojo' | 'tristeza' | 'sorpresa' | 'alegria';
  /** Giro de la cabeza para decir que no (0–1, se achica de costado). */
  cabezaGiro?: number;
  /** Silueta: viejo (encorvado, canoso), niño (cabezón y chico), gordo, flaco. */
  cuerpo?: 'normal' | 'viejo' | 'nino' | 'gordo' | 'flaco';
  /** Sin la sombra/luz en los bordes (solo contorno). Prueba. */
  sinSombraBorde?: boolean;
  /** Brazos de curva suave (codo redondeado, bíceps y antebrazo con forma). Prueba. */
  brazoSuave?: boolean;
  /** Mechón de la juventud (Horus niño, príncipes egipcios). */
  trenza?: boolean;
  /** Dos trenzas largas que caen por delante del hombro (tema norteamericano: por defecto en mujeres). */
  trenzas?: boolean;
  /** Gustoweh haudenosaunee: cómo van las plumas según la nación (mohawk 3 arriba, oneida 2 arriba y 1 abajo, onondaga 1 arriba y 1 abajo, cayuga 1 inclinada, seneca 1 arriba, tuscarora sin plumas). */
  nacion?: 'mohawk' | 'oneida' | 'onondaga' | 'cayuga' | 'seneca' | 'tuscarora';
  /** Color del vestido/túnica (si no, el del tema). */
  ropaColor?: string;
  /** Arrodillado (0–1): una rodilla en el piso. */
  arrodillado?: number;
  /** Sentado (0–1): muslos al frente, como en un trono. */
  sentado?: number;
  /** Calidad mejorada: volumen (luz y sombra), contorno, grano, sombra en el piso y movimiento secundario. */
  hd?: boolean;
  /** Piezas propias en coordenadas del cuerpo (tocados, pintura de cara, pectorales, escudos…): cada tema o
   * elenco las arma sin tocar el Personaje. detras = antes de todo; cuerpo = sobre el torso; cabeza = en la
   * cabeza (de perfil, mirando a la derecha); pie = en el tobillo de adelante; mano/manoAtras = en cada mano. */
  adornos?: Adornos;
  /** Guantes (color): las manos y un puño de metal en la muñeca (Járngreipr, los guantes de hierro de Thor). */
  guante?: string;
  /** Pantalón (color) con vendas cruzadas en la canilla: piernas de tela en vez de piel (hombres nórdicos). */
  pantalon?: string;
  /** Pelo corto: sin los mechones largos de la nuca, sin las rayas del pelo ni la oreja (el pelo del adorno los tapa). */
  peloCorto?: boolean;
  /** Botas (color): pie y caña hasta media canilla. */
  botas?: string;
  /** Color del ribete de la túnica (borde de abajo); si no, el rojo del tema. */
  ribete?: string;
  /** Le falta la mano de adelante (Týr): el brazo termina en un muñón vendado. */
  manoCortada?: boolean;
  /** La cabeza la dibuja entera adornos.cabeza (cabezas de animal oficiales): no se dibuja la humana. */
  cabezaPropia?: boolean;
  /** Oreja chica y simple (forma de C en color piel con contorno); por defecto sí desde 2026-10-15. false = el espiral viejo de la vasija. */
  orejaSimple?: boolean;
};
export type Adornos = { detras?: React.ReactNode; cuerpo?: React.ReactNode; cabeza?: React.ReactNode; pie?: React.ReactNode; mano?: React.ReactNode; manoAtras?: React.ReactNode; pieAtras?: React.ReactNode }; // pieAtras = en el tobillo de atrás

/** Activa la calidad mejorada para todos los personajes de adentro (salvo que un personaje diga hd={false}). */
export const CalidadHD = createContext(false);

/** Filtros de la calidad mejorada: volumen del cuerpo entero y de las partes que se superponen. */
export const FiltrosHD: React.FC = () => (
  <defs>
    <filter id="volumenHD" x="-25%" y="-12%" width="150%" height="124%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b" />
      <feOffset in="b" dx="13" dy="-9" result="bs" />
      <feComposite in="SourceAlpha" in2="bs" operator="out" result="zs" />
      <feFlood floodColor="#2A1206" floodOpacity="0.38" />
      <feComposite in2="zs" operator="in" result="sombra" />
      <feOffset in="b" dx="-5" dy="4" result="bl" />
      <feComposite in="SourceAlpha" in2="bl" operator="out" result="zl" />
      <feFlood floodColor="#FFF4DC" floodOpacity="0.45" />
      <feComposite in2="zl" operator="in" result="luz" />
      <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="dil" />
      <feFlood floodColor="#140A04" />
      <feComposite in2="dil" operator="in" result="borde" />
      <feMerge><feMergeNode in="borde" /><feMergeNode in="SourceGraphic" /><feMergeNode in="sombra" /><feMergeNode in="luz" /></feMerge>
    </filter>
    <filter id="parteHD" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="b" />
      <feOffset in="b" dx="8" dy="-5" result="bs" />
      <feComposite in="SourceAlpha" in2="bs" operator="out" result="zs" />
      <feFlood floodColor="#2A1206" floodOpacity="0.34" />
      <feComposite in2="zs" operator="in" result="sombra" />
      <feOffset in="b" dx="-3.5" dy="3" result="bl" />
      <feComposite in="SourceAlpha" in2="bl" operator="out" result="zl" />
      <feFlood floodColor="#FFF4DC" floodOpacity="0.42" />
      <feComposite in2="zl" operator="in" result="luz" />
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="dil" />
      <feFlood floodColor="#140A04" />
      <feComposite in2="dil" operator="in" result="borde" />
      <feMerge><feMergeNode in="borde" /><feMergeNode in="SourceGraphic" /><feMergeNode in="sombra" /><feMergeNode in="luz" /></feMerge>
    </filter>
    <filter id="contornoHD" x="-25%" y="-12%" width="150%" height="124%" colorInterpolationFilters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="dil" />
      <feFlood floodColor="#140A04" />
      <feComposite in2="dil" operator="in" result="borde" />
      <feMerge><feMergeNode in="borde" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="contornoParteHD" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="dil" />
      <feFlood floodColor="#140A04" />
      <feComposite in2="dil" operator="in" result="borde" />
      <feMerge><feMergeNode in="borde" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="sombraPisoHD" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="6" /></filter>
  </defs>
);

const LP = 88;
/** pose: [cuánto (0–1), 'frente' = muslo al frente y canilla vertical, 'apoyada' = rodilla en el piso y canilla hacia atrás]. */
function pierna(cadera: P, fase: number, accion: Accion, ancho: number, pose?: [number, 'frente' | 'apoyada']) {
  const amp = accion === 'correr' ? 34 : accion === 'caminar' ? 20 : 0;
  const flex = accion === 'correr' ? 62 : accion === 'caminar' ? 30 : 0;
  let muslo = amp * Math.sin(fase) + (accion === 'correr' ? 8 : 2);
  let rodilla = (accion === 'parado' ? 4 : 10) + flex * Math.max(0, Math.sin(fase + 1.9));
  if (pose && pose[0] > 0) {
    const r = pose[0];
    const [m1, r1] = pose[1] === 'frente' ? [88, 88] : [-6, 84];
    muslo = muslo + (m1 - muslo) * r; rodilla = rodilla + (r1 - rodilla) * r;
  }
  const k = desde(cadera, muslo, LP);
  const tob = desde(k, muslo - rodilla, LP);
  const punta = desde(tob, muslo - rodilla * 0.55 + 90, 34);
  return {
    k, tob,
    path: miembro([cadera, lerp(cadera, k, 0.45), k, lerp(k, tob, 0.3), lerp(k, tob, 0.7), tob], [34 * ancho, 31 * ancho, 19 * ancho, 23 * ancho, 14 * ancho, 11 * ancho]),
    pie: suave([[tob[0] - 6, tob[1] - 7], lerp(tob, punta, 0.5), punta, [punta[0] - 2, punta[1] + 6], [tob[0] - 4, tob[1] + 8]], true),
  };
}

const ObjetoMano: React.FC<{ tipo: Objeto; f: number; ang?: number }> = ({ tipo, f, ang = 50 }) => {
  switch (tipo) {
    case 'rayo':
      return (
        <g transform="rotate(-10)">
          <circle cx={0} cy={-60} r={70} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.6 + Math.sin(f / 3) * 0.2} />
          <path d="M-4 -150 L22 -148 L6 -84 L30 -84 L-6 10 L4 -56 L-22 -56 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />
          <path d="M-4 40 L22 42 L6 -24" fill={C.oro} stroke={C.negro} strokeWidth={3} />
        </g>
      );
    case 'tridente':
      return (
        <g>
          <path d="M0 110 L0 -170" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
          <path d="M-32 -214 C -34 -180, -20 -166, 0 -166 C 20 -166, 34 -180, 32 -214 M0 -226 V-166" stroke={C.negro} strokeWidth={8} fill="none" />
          <path d="M-32 -214 l-8 14 M32 -214 l8 14 M0 -226 l-7 12 M0 -226 l7 12" stroke={C.negro} strokeWidth={6} />
        </g>
      );
    case 'lanza':
      return (
        <g>
          <path d="M0 140 L0 -190" stroke={C.negro} strokeWidth={7} strokeLinecap="round" />
          <path d="M0 -236 C 10 -212, 10 -200, 0 -188 C -10 -200, -10 -212, 0 -236 Z" fill={C.negro} />
        </g>
      );
    case 'cetro':
      return (
        <g>
          <path d="M0 150 L0 -150" stroke={C.negro} strokeWidth={7} strokeLinecap="round" />
          <circle cx={0} cy={-160} r={12} fill={C.negro} />
          <path d="M-14 -176 C -6 -196, 6 -196, 14 -176" stroke={C.negro} strokeWidth={5} fill="none" />
        </g>
      );
    case 'antorcha':
    case 'cana':
      // En el tema egipcio es la caña y la paleta del escriba (Thoth), no la caña con fuego de Prometeo.
      if (tipo === 'cana' && TEMA.nombre === 'papiro') return (
        <g transform="rotate(-25)">
          <rect x={-9} y={-70} width={18} height={92} rx={3} fill="#D9C08A" stroke={C.negro} strokeWidth={2.5} />
          <circle cx={0} cy={-56} r={4.5} fill={C.negro} /><circle cx={0} cy={-42} r={4.5} fill="#B8331C" />
          <path d="M-3 -30 V 14" stroke={C.negro} strokeWidth={1.5} />
          <path d="M14 30 L 34 -96" stroke={C.negro} strokeWidth={4} strokeLinecap="round" />
        </g>
      );
      return (
        <g>
          <path d={tipo === 'cana' ? 'M0 10 C 20 -40, 40 -70, 60 -120' : 'M0 40 L0 -90'} stroke={C.negro} strokeWidth={8} strokeLinecap="round" fill="none" />
          <g transform={tipo === 'cana' ? 'translate(60 -118) scale(0.55)' : 'translate(0 -92) scale(0.6)'}>
            <Fuego f={f} />
          </g>
        </g>
      );
    case 'hoz':
      return (
        <g>
          <path d="M0 40 L0 -60" stroke={C.negro} strokeWidth={9} strokeLinecap="round" />
          <path d="M0 -60 C 10 -150, 120 -160, 140 -80 C 110 -120, 40 -115, 6 -50 Z" fill="#DCD6C8" stroke={C.negro} strokeWidth={4} />
        </g>
      );
    case 'caduceo':
      return (
        <g>
          <path d="M0 80 L0 -120" stroke={C.negro} strokeWidth={6} />
          <path d="M0 -120 C -30 -130, -30 -160, -6 -164 M0 -120 C 30 -130, 30 -160, 6 -164 M-14 -60 C 14 -70, 14 -90, -14 -100 C 14 -110, 14 -120, 0 -120" stroke={C.negro} strokeWidth={5} fill="none" />
        </g>
      );
    case 'copa':
      return <path d="M-44 -34 Q0 12 44 -34 Z M-4 -16 V8 M-20 10 H20 M-44 -34 q -16 4 -12 16 M44 -34 q 16 4 12 16" fill={C.negro} stroke={C.negro} strokeWidth={6} />;
    case 'arco':
      return (
        <g>
          <path d="M0 -110 C 60 -60, 60 60, 0 110" stroke={C.negro} strokeWidth={8} fill="none" />
          <path d="M0 -110 L0 110" stroke={C.crema} strokeWidth={2} />
        </g>
      );
    case 'espada':
      return (
        <g>
          <path d="M0 0 L0 -150 L8 -164 L16 -150 L16 0 Z" fill="#D9D3C4" stroke={C.negro} strokeWidth={3} transform="translate(-8 0)" />
          <path d="M-22 0 H22" stroke={C.negro} strokeWidth={8} />
          <path d="M0 0 V24" stroke={C.negro} strokeWidth={8} />
        </g>
      );
    case 'tirso':
      return (
        <g>
          <path d="M0 120 L0 -150" stroke={C.negro} strokeWidth={6} />
          <ellipse cx={0} cy={-170} rx={16} ry={28} fill={C.negro} />
          {[0, 1, 2].map((i) => <path key={i} d={`M-12 ${-186 + i * 14} L12 ${-178 + i * 14}`} stroke={C.crema} strokeWidth={2} />)}
          <path d="M0 -150 C 20 -130, 30 -110, 14 -90" stroke={C.purpura} strokeWidth={5} fill="none" />
        </g>
      );
    case 'martillo':
      return (
        <g>
          <path d="M0 40 L0 -90" stroke={C.negro} strokeWidth={8} />
          <rect x={-30} y={-110} width={60} height={28} rx={4} fill={C.negro} />
        </g>
      );
    case 'mjolnir':
      return (
        <g>
          <path d="M0 50 L0 -40" stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
          <path d="M-46 -90 H 46 L 40 -34 H -40 Z" fill={C.negro} stroke={C.crema} strokeWidth={2.5} />
          <path d="M-30 -80 H 30 M-28 -44 H 28" stroke={C.crema} strokeWidth={2} />
          <circle cx={0} cy={-62} r={8} fill="none" stroke={C.purpura} strokeWidth={3} />
          <circle cx={0} cy={56} r={6} fill={C.purpura} />
        </g>
      );
    case 'mjolnir_corto': { // Mjölnir de las Eddas: cabeza ancha de puntas abiertas y mango corto (Brokkr se distrajo por la mosca de Loki)
      // Sigue al antebrazo: con el brazo abajo cuelga al costado, cabeza al piso; al levantarlo gira hasta quedar arriba.
      const t = Math.min(1, Math.max(0, (ang - 20) / 100)), giro = 175 * (1 - t * t * (3 - 2 * t));
      return (
        <g transform={`rotate(${giro.toFixed(1)}) scale(0.86)`}>
          <rect x={-6.5} y={-44} width={13} height={66} rx={4} fill="#6B4A2E" stroke={C.negro} strokeWidth={2.5} />
          {[-36, -28, 10, 18].map((yy) => <path key={yy} d={`M-6 ${yy} l 12 -5`} stroke="#3E2A18" strokeWidth={2} />)}
          <circle cx={0} cy={26} r={8} fill="#9AA6B2" stroke={C.negro} strokeWidth={2.5} />
          <path d="M-30 -78 L 30 -78 L 48 -88 Q 54 -62 48 -36 L 30 -46 L -30 -46 L -48 -36 Q -54 -62 -48 -88 Z" fill="#7F8C99" stroke={C.negro} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M30 -78 L 48 -88 Q 54 -62 48 -36 L 30 -46 Z M-30 -78 L -48 -88 Q -54 -62 -48 -36 L -30 -46 Z" fill="#5C6875" stroke={C.negro} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-12 -78 V -46 M12 -78 V -46" stroke="#5C6875" strokeWidth={2.4} />
          <path d="M-12 -62 L 0 -72 L 12 -62 L 0 -52 Z" fill="none" stroke={C.purpura} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-28 -74 L 28 -74" stroke="#C9D3DC" strokeWidth={2} />
        </g>
      );
    }
    case 'gungnir': // lanza de Odín: asta de fresno, hoja con runas y collar de oro
      return (
        <g>
          <path d="M0 150 L0 -226" stroke={C.negro} strokeWidth={11} strokeLinecap="round" />
          <path d="M0 147 L0 -224" stroke="#B88A55" strokeWidth={6} strokeLinecap="round" />
          <path d="M-7 -226 H 7 V -240 H -7 Z" fill={C.oro} stroke={C.negro} strokeWidth={2.5} />
          <path d="M0 -322 C 14 -296, 16 -262, 6 -240 H -6 C -16 -262, -14 -296, 0 -322 Z" fill="#D5DEE6" stroke={C.negro} strokeWidth={3} strokeLinejoin="round" />
          <path d="M0 -306 V -246 M-4 -290 L 3 -284 M-4 -270 L 4 -276 M-3 -258 L 3 -262" stroke={C.purpura} strokeWidth={2.2} />
        </g>
      );
    case 'hacha':
      return (
        <g>
          <path d="M0 70 L0 -130" stroke={C.negro} strokeWidth={8} strokeLinecap="round" />
          <path d="M2 -126 C 40 -150, 70 -130, 72 -90 C 50 -100, 30 -96, 2 -88 Z" fill="#D7DEE4" stroke={C.negro} strokeWidth={3} />
        </g>
      );
    case 'cuerno':
      return (
        <g transform="rotate(-30)">
          <path d="M-6 0 C -10 -60, 20 -110, 70 -120 L 74 -96 C 36 -86, 14 -50, 10 0 Z" fill={C.blanco} stroke={C.negro} strokeWidth={3} />
          <path d="M-6 -20 L 12 -20 M2 -60 L 26 -54 M30 -96 L 44 -78" stroke={C.purpura} strokeWidth={5} />
        </g>
      );
    case 'ankh':
      return <g><path d="M0 -20 C -18 -30, -18 -62, 0 -62 C 18 -62, 18 -30, 0 -20 Z M-22 -18 H 22 M0 -18 V 40" stroke={C.oro} strokeWidth={8} fill="none" strokeLinejoin="round" /><path d="M0 -20 C -18 -30, -18 -62, 0 -62 C 18 -62, 18 -30, 0 -20 Z M-22 -18 H 22 M0 -18 V 40" stroke={C.negro} strokeWidth={1.5} fill="none" /></g>;
    case 'was':
      return <g><path d="M0 130 L0 -150 M0 -150 C 6 -170, 26 -172, 30 -160 L 18 -156" stroke={C.negro} strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M0 130 l -8 14 M0 130 l 8 14" stroke={C.negro} strokeWidth={6} /></g>;
    case 'cayado':
      return <g><path d="M-6 50 L 2 -70 C 4 -100, 34 -100, 34 -76" stroke={C.oro} strokeWidth={10} fill="none" strokeLinecap="round" /><path d="M-6 50 L 2 -70 C 4 -100, 34 -100, 34 -76" stroke={'#2E5FA8'} strokeWidth={4} strokeDasharray="6 8" fill="none" /><path d="M10 40 L 24 -60 M24 -60 l 22 30 M24 -60 l 30 22 M24 -60 l 34 10" stroke={C.negro} strokeWidth={5} fill="none" /></g>;
    case 'anzuelo': // Manaiakalani, el anzuelo mágico de Māui (hueso y nácar) con su cuerda
      return <g transform="rotate(-15)"><path d="M0 0 L 0 -90 C 0 -128, 44 -128, 44 -90 C 44 -64, 22 -60, 18 -76" stroke="#EDE3C8" strokeWidth={12} fill="none" strokeLinecap="round" /><path d="M0 0 L 0 -90 C 0 -128, 44 -128, 44 -90 C 44 -64, 22 -60, 18 -76" stroke={C.negro} strokeWidth={2} fill="none" /><path d="M18 -76 l -6 12" stroke={C.negro} strokeWidth={4} /><path d="M0 4 C -30 30, -60 20, -90 50" stroke="#8C6B3A" strokeWidth={3} fill="none" /></g>;
    case 'hoe': // remo
      return <g><path d="M0 60 L 0 -110" stroke={C.barroOscuro} strokeWidth={8} strokeLinecap="round" /><path d="M0 60 C -18 80, -16 130, 0 150 C 16 130, 18 80, 0 60 Z" fill={C.barroOscuro} stroke={C.negro} strokeWidth={2.5} /></g>;
    case 'batidor': // ʻie kuku, batidor de kapa
      return <g><path d="M0 20 L 0 -40" stroke={C.barroOscuro} strokeWidth={9} strokeLinecap="round" /><rect x={-11} y={-110} width={22} height={74} rx={3} fill={C.barroOscuro} stroke={C.negro} strokeWidth={2.5} />{[-96, -82, -68, -54].map((yy) => <path key={yy} d={`M-11 ${yy} h 22`} stroke={C.negro} strokeWidth={1.5} />)}</g>;
    case 'semillas': // puñado de semillas y una ramita (lo que Sky Woman agarra al caer)
      return <g transform="translate(4 -6)"><path d="M0 0 C -4 -20, -2 -36, 6 -50" stroke="#3E6B35" strokeWidth={3} fill="none" /><ellipse cx={-8} cy={-30} rx={9} ry={5} fill="#4C8A3E" stroke={C.negro} strokeWidth={1.4} transform="rotate(-30 -8 -30)" /><ellipse cx={14} cy={-40} rx={9} ry={5} fill="#4C8A3E" stroke={C.negro} strokeWidth={1.4} transform="rotate(25 14 -40)" /><circle cx={6} cy={-52} r={5} fill="#C8321E" stroke={C.negro} strokeWidth={1.2} />{[[-6, -4, '#E8C46A'], [4, -8, '#7A4A28'], [10, 0, '#F2EEE4'], [-2, 4, '#B23A24']].map(([cx, cy, c], i) => <circle key={i} cx={cx as number} cy={cy as number} r={4.5} fill={c as string} stroke={C.negro} strokeWidth={1.2} />)}</g>;
    case 'maiz': // mazorca con chala
      return <g transform="rotate(-20)"><path d="M-2 4 C -16 -20, -16 -60, -4 -84 L 0 -40 Z M2 4 C 16 -20, 16 -60, 6 -84 L 0 -40 Z" fill="#6E9A3E" stroke={C.negro} strokeWidth={1.6} /><ellipse cx={0} cy={-44} rx={11} ry={34} fill="#E8B83A" stroke={C.negro} strokeWidth={2} />{[-64, -54, -44, -34, -24].map((yy) => <path key={yy} d={`M-10 ${yy} H 10`} stroke="#B07A1E" strokeWidth={1.3} />)}<path d="M-4 -76 V -14 M4 -76 V -14" stroke="#B07A1E" strokeWidth={1.2} /></g>;
    case 'asta': // asta de ciervo caída (la que usa Brote en la pelea)
      return <g transform="rotate(-20)"><path d="M0 20 C -4 -30, 6 -80, 30 -120 M2 -30 C -20 -50, -30 -70, -28 -92 M10 -70 C 30 -80, 44 -84, 56 -100 M22 -100 C 10 -114, 4 -128, 6 -142" stroke="#E2D2B0" strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M0 20 C -4 -30, 6 -80, 30 -120 M2 -30 C -20 -50, -30 -70, -28 -92 M10 -70 C 30 -80, 44 -84, 56 -100 M22 -100 C 10 -114, 4 -128, 6 -142" stroke={C.negro} strokeWidth={1.6} fill="none" /></g>;
    case 'palo': // palo de cavar
      return <path d="M-4 70 L 4 -120" stroke="#7A4A28" strokeWidth={8} strokeLinecap="round" />;
    case 'tambor': // tambor de mano de cuero
      return <g transform="translate(14 -10)"><ellipse cx={0} cy={0} rx={14} ry={40} fill="#7A4A28" stroke={C.negro} strokeWidth={2} /><ellipse cx={4} cy={0} rx={10} ry={38} fill="#EBD6AA" stroke={C.negro} strokeWidth={2} /><ellipse cx={4} cy={0} rx={4} ry={14} fill="none" stroke={C.purpura} strokeWidth={2.5} /></g>;
    case 'pluma':
      return <path d="M0 10 C -4 -40, 4 -80, 14 -110 C 24 -80, 18 -40, 6 10 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />;
    case 'manzana':
      return <g><circle cx={0} cy={-14} r={16} fill={C.oro} stroke={C.negro} strokeWidth={3} /><path d="M0 -30 q 4 -10 12 -12" stroke={C.negro} strokeWidth={3} fill="none" /></g>;
    case 'lira':
      return (
        <g transform="translate(0 -30)">
          <path d="M-30 -60 C -50 -20, -30 20, -14 30 L14 30 C 30 20, 50 -20, 30 -60" stroke={C.negro} strokeWidth={8} fill="none" />
          <path d="M-36 -54 H36" stroke={C.negro} strokeWidth={6} />
          <ellipse cx={0} cy={30} rx={22} ry={12} fill={C.negro} />
          {[-12, -4, 4, 12].map((x) => <path key={x} d={`M${x} -54 V24`} stroke={C.crema} strokeWidth={1.5} />)}
        </g>
      );
    default:
      return null;
  }
};

const EMBLEMAS: Record<string, string> = {
  gorgona: 'M-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M-8 -5 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M2 -5 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M-8 6 h16 M-2 6 v6 h4 v-6 M-14 -10 q-10 -6 -6 -16 M14 -10 q10 -6 6 -16 M-16 4 q-12 2 -14 -6 M16 4 q12 2 14 -6 M-10 12 q-6 10 -16 8 M10 12 q6 10 16 8 M0 -14 q-4 -10 2 -16',
  leon: 'M-20 10 C -20 -16, 20 -16, 20 10 M-10 -2 h3 M7 -2 h3 M-6 8 q6 4 12 0',
  pulpo: 'M0 -14 a10 10 0 1 1 0.1 0 M-10 -4 q-10 20 -16 18 M-4 -2 q-4 22 -6 22 M4 -2 q4 22 6 22 M10 -4 q10 20 16 18',
  trisquel: 'M0 0 C 0 -20, 20 -20, 20 0 M0 0 C 18 10, 8 28, -8 20 M0 0 C -18 10, -26 -10, -10 -18',
  valknut: 'M-18 10 L0 -20 L18 10 Z M-10 16 L8 -14 L26 16 Z M-26 16 L-8 -14 L10 16 Z',
  nudo: 'M-18 0 C -18 -24, 18 -24, 18 0 C 18 24, -18 24, -18 0 M0 -18 C 24 -18, 24 18, 0 18 C -24 18, -24 -18, 0 -18',
};

/** Ala de diosa egipcia (Isis, Neftis, Maat) pegada al brazo: hombro, codo, mano y ángulo del antebrazo. */
const AlaDiosa: React.FC<{ h: P; c: P; m: P; ang: number; f: number }> = ({ h, c, m, ang, f }) => {
  const punta = desde(m, ang, 80);
  const arriba = [h, c, m, punta];
  const d = [punta[0] - h[0], punta[1] - h[1]], n = Math.hypot(d[0], d[1]) || 1;
  const perp: P = [-d[1] / n, d[0] / n]; // hacia atrás/abajo del brazo
  const largos = [24, 64, 104, 116];
  const borde = (k: number) => arriba.map((p, i) => [p[0] + perp[0] * largos[i] * k + Math.sin(f / 9 + i) * k * 2, p[1] + perp[1] * largos[i] * k] as P);
  const capa = (k: number) => suave([...arriba, ...borde(k).reverse()], true, 0.6);
  return (
    <g>
      <path d={capa(1)} fill="#2E5FA8" stroke={C.negro} strokeWidth={2.5} />
      <path d={capa(0.62)} fill="#2E8B6E" stroke={C.negro} strokeWidth={2} />
      <path d={capa(0.3)} fill={C.purpura} stroke={C.negro} strokeWidth={2} />
      {[0.25, 0.42, 0.58, 0.74, 0.9].map((t) => {
        const i = Math.min(2, Math.floor(t * 3)), u = t * 3 - i;
        const a = lerp(arriba[i], arriba[i + 1], u), b = lerp(borde(1)[i], borde(1)[i + 1], u), mid = lerp(a, b, 0.62);
        return <path key={t} d={`M${f1(mid[0])} ${f1(mid[1])} L ${f1(b[0])} ${f1(b[1])}`} stroke={C.negro} strokeWidth={1.6} />;
      })}
    </g>
  );
};

/** Mano de muñequito, orientada según el antebrazo (ángulo del motor: 0 = abajo). 2026-10-13: la palma alargada con
 * pulgar se leía fálica (comentarios en IG) → mano abierta, más ancha que larga, con cuatro dedos cortos separados,
 * pulgar hacia afuera y puño de manga en la muñeca. Nunca volver a una forma de tubo con punta redondeada. */
const Mano: React.FC<{ m: P; ang: number; piel: string; k: number; guante?: string }> = ({ m, ang, piel: pielM, k, guante }) => {
  const piel = guante ?? pielM;
  const borde = piel === C.negro ? 'none' : C.negro;
  const dedos: [number, number][] = [[-6.2, -12], [-2.2, -4], [1.8, 4], [5.8, 12]]; // x de cada dedo y su abanico (grados)
  return (
    <g transform={`translate(${f1(m[0])} ${f1(m[1])}) rotate(${f1(-ang)}) scale(${k})`}>
      {dedos.map(([x, g]) => (
        <rect key={x} x={x - 1.7} y={4} width={3.4} height={12} rx={1.7} fill={piel} stroke={borde} strokeWidth={1.4} transform={`rotate(${g} ${x} 6)`} />
      ))}
      <path d="M7 1 L 15 4 C 17 5, 16 8, 14 8 L 7 6 Z" fill={piel} stroke={borde} strokeWidth={1.4} strokeLinejoin="round" />
      <rect x={-8.5} y={-3} width={17} height={11} rx={4} fill={piel} stroke={borde} strokeWidth={1.8} />
      <path d="M-8 -3 L 8 -3" stroke={borde === 'none' ? C.crema : borde} strokeWidth={2.4} strokeLinecap="round" />
      {guante && <><rect x={-11} y={-17} width={22} height={15} rx={3} fill={guante} stroke={C.negro} strokeWidth={1.8} /><path d="M-11 -11 H 11" stroke={C.negro} strokeWidth={1.2} opacity={0.6} />{[-6, 0, 6].map((xx) => <circle key={xx} cx={xx} cy={-6} r={1.4} fill={C.negro} />)}</>}
    </g>
  );
};

/** Vendas cruzadas (winingas) sobre la canilla del pantalón, de la rodilla al tobillo. */
const Vendas: React.FC<{ k: P; tob: P }> = ({ k, tob }) => (
  <g>{[0.25, 0.45, 0.65, 0.85].map((t, i) => { const a = lerp(k, tob, t), b = lerp(k, tob, t + 0.12); return <path key={i} d={`M${f1(a[0] - 9)} ${f1(a[1])} L ${f1(b[0] + 9)} ${f1(b[1])} M${f1(a[0] + 9)} ${f1(a[1])} L ${f1(b[0] - 9)} ${f1(b[1])}`} stroke={C.crema} strokeWidth={1.8} opacity={0.75} />; })}</g>
);

/** Caña de bota desde media canilla hasta el tobillo. */
const Bota: React.FC<{ k: P; tob: P; c: string; ancho: number }> = ({ k, tob, c, ancho }) => (
  <path d={miembro([lerp(k, tob, 0.45), lerp(k, tob, 0.75), tob], [22 * ancho, 18 * ancho, 15 * ancho])} fill={c} stroke={c === C.negro ? 'none' : C.negro} strokeWidth={2} />
);

/** Brazo: tubo de 3 puntos (clásico) o curva suave con codo redondeado y músculos (brazoSuave). */
const brazoD = (h: P, c: P, m: P, w: number, suaveB?: boolean) => suaveB
  ? miembro([h, lerp(h, c, 0.5), lerp(h, c, 0.9), lerp(c, m, 0.12), lerp(c, m, 0.6), m], [w, w * 0.8, w * 0.64, w * 0.62, w * 0.5, w * 0.36])
  : miembro([h, c, m], [w, w * 0.66, w * 0.46]);

/** Personaje de vasija, de perfil mirando a la derecha. Origen = pies. */
export const Personaje: React.FC<PersonajeProps> = (props) => {
  const fr = useCurrentFrame();
  const egipcio = TEMA.nombre === 'papiro';
  const hawaiano = TEMA.nombre === 'kapa';
  const nativo = TEMA.nombre === 'pintado';
  const { x, y = SUELO, s = 1, voltear, accion = 'parado', mujer, barba = !props.mujer && !egipcio && !hawaiano && !nativo, canas = props.cuerpo === 'viejo', ropa = props.mujer ? 'larga' : 'corta', capa = null, tocado = egipcio ? 'peluca' : hawaiano ? (props.mujer ? 'haku' : null) : nativo ? null : props.mujer ? 'diadema' : 'cinta', objeto = null, escudo, emblema = 'gorgona', alas, inclinar = accion === 'correr' ? 6 : props.cuerpo === 'viejo' ? 9 : 0, cabeza = props.cuerpo === 'viejo' ? -5 : 0, boca, ojosCerrados, contorno, opacity = 1, gigante } = props;
  const hdCtx = useContext(CalidadHD);
  const hd = props.hd ?? hdCtx;
  // Aprobado 2026-10-09: con calidad HD van brazos suaves con mano y sin sombra en los bordes (solo contorno).
  props = { ...props, brazoSuave: props.brazoSuave ?? hd, sinSombraBorde: props.sinSombraBorde ?? hd };
  const fase = props.fase ?? fr * (accion === 'correr' ? 0.34 : accion === 'caminar' ? 0.2 : 0);
  // Vida en reposo: respiración, leve cabeceo y parpadeo (desfasados por posición para que no se muevan todos igual).
  const semilla = Math.abs(Math.round(x * 0.37 + y * 0.11)) % 97;
  const respira = accion === 'parado' ? Math.sin((fr + semilla * 7) / 22) * 1.6 : 0;
  const cabeceo = accion === 'parado' ? Math.sin((fr + semilla * 5) / 41) * 2.2 : 0;
  const cicloOjo = (fr + semilla * 13) % 96;
  const parpadea = hd ? cicloOjo === 1 || cicloOjo === 2 : cicloOjo < 3;
  const entornado = hd && (cicloOjo === 0 || cicloOjo === 3 || props.expresion === 'enojo' || props.expresion === 'tristeza'); // medio parpadeo, o enojo/tristeza
  // Movimiento secundario (hd): balanceo de peso, brazos que siguen con retraso, torso que acompaña el paso.
  const peso = hd && accion === 'parado' ? Math.sin((fr + semilla * 3) / 34) : 0;
  const sigue = (lag: number) => hd ? (accion === 'parado' ? Math.sin((fr + semilla * 3) / 34 - lag) * 5 : Math.sin(fase + Math.PI - lag) * 9) : 0;
  const piel = props.piel ?? ((egipcio || hawaiano || nativo) && TEMA.pielH ? (mujer ? TEMA.pielM! : TEMA.pielH!) : mujer ? C.blanco : C.negro); // egipcios y hawaianos: piel morena del tema
  const lin = piel === C.negro ? C.crema : C.negro; // color de las incisiones sobre la piel
  const ropaColor = props.ropaColor ?? TEMA.ropa ?? C.negro;
  const trenzas = props.trenzas ?? (nativo && !!mujer);
  const vestido = nativo && !!mujer && ropa !== 'desnudo' && ropa !== 'armadura'; // vestido de cuero entero (cubre el torso)
  const linRopa = ropaColor === C.negro ? C.crema : C.negro;
  const animal = props.cabezaAnimal;
  const cuerpoT = props.cuerpo ?? 'normal', nino = cuerpoT === 'nino';
  const ancho = gigante ? 1.35 : cuerpoT === 'gordo' ? 1.3 : cuerpoT === 'flaco' ? 0.8 : mujer ? 0.92 : 1;
  const expr = props.expresion ?? 'neutral';
  const CEJA = { neutral: 'M8 -14 Q 18 -20 28 -13', enojo: 'M7 -20 Q 18 -16 29 -9', tristeza: 'M8 -11 Q 18 -13 27 -21', sorpresa: 'M8 -19 Q 18 -28 28 -19', alegria: 'M8 -16 Q 18 -23 28 -16' } as const;
  const BOCA = { neutral: '', enojo: '', tristeza: '', sorpresa: '', alegria: '' } as const; // sin bocas dibujadas (solo cejas y ojo)
  const bote = accion === 'correr' ? -Math.abs(Math.cos(fase)) * 10 : accion === 'caminar' ? -Math.abs(Math.cos(fase)) * 4 : 0;
  const cadera: P = [0, -176];
  const arr = props.arrodillado ?? 0, sen = props.sentado ?? 0;
  const baja = 88 * Math.max(arr, sen); // cuánto baja el cuerpo al arrodillarse o sentarse
  const pD = pierna(cadera, fase, accion, ancho, sen ? [sen, 'frente'] : arr ? [arr, 'frente'] : undefined);
  const pT = pierna([-4, -176], fase + Math.PI, accion, ancho, sen ? [sen, 'frente'] : arr ? [arr, 'apoyada'] : undefined);
  const hT: P = [-4, -292], hD: P = [14, -292];
  const balanceo = accion === 'parado' ? 0 : Math.sin(fase + Math.PI) * (accion === 'correr' ? 34 : 20);
  const [bTh0, bTc0] = props.brazoAtras ?? [-20 + balanceo, -40 + balanceo];
  const bTh = bTh0 - sigue(0.3) * 0.6, bTc = bTc0 - sigue(0.9);
  const cT = desde(hT, bTh, 66), mT = desde(cT, bTh + bTc + 40, 60);
  const [bDh0, bDc0] = props.brazo ?? [accion === 'parado' ? 20 : 20 - balanceo, accion === 'parado' ? 30 : 40 - balanceo];
  const bDh = bDh0 + sigue(0.2) * 0.6, bDc = bDc0 + sigue(0.8);
  const cD = desde(hD, bDh, 66), mD = desde(cD, bDh + bDc, 60);
  const ondea = (i: number) => Math.sin(fr * 0.3 - i * 0.9) * (accion === 'parado' ? 2 + i : 6 + i * 5);
  const vuelo = accion === 'parado' ? Math.sin(fr / 20) * 2 : Math.sin(fase * 2) * 6;
  const torso: P[] = [[-20 * ancho, -300], [18 * ancho, -304], [34 * ancho, -282], [30 * ancho, -248], [22 * ancho, -212], [-22 * ancho, -208], [-30 * ancho, -250], [-30 * ancho, -284]];
  const faldaCorta: P[] = [[-27, -214], [24, -216], [38, -184], [52 + vuelo, -148], [16, -142], [-26, -146 - vuelo], [-46 - vuelo, -158]];
  const faldaLarga: P[] = [[-27, -214], [24, -216], [36, -150], [50 + vuelo, -40], [58 + vuelo, -6], [-44, -6], [-46 - vuelo, -60], [-36, -150]];
  const faldaTunica: P[] = [[-27, -214], [24, -216], [30, -184], [34 + vuelo * 0.3, -128], [0, -125], [-32 - vuelo * 0.3, -127], [-33, -180]];
  const tunica = ropa === 'tunica';
  const larga = ropa === 'larga';
  const pelo = props.pelo ?? (canas ? C.blanco : C.negro);
  return (
    <g transform={`translate(${x} ${y + (bote + respira) * s}) scale(${(voltear ? -s : s) * (nino ? 0.62 : 1)} ${s * (nino ? 0.62 : 1)})`} opacity={opacity}>
      {hd && <FiltrosHD />}
      {hd && <ellipse cx={4} cy={-(bote + respira) + 2} rx={(64 + bote * 1.2) * ancho} ry={13} fill="#120802" opacity={0.45 + bote * 0.01} filter="url(#sombraPisoHD)" />}
      <g filter={contorno ? 'url(#contornoV)' : undefined}><g filter={hd ? (props.sinSombraBorde ? 'url(#contornoHD)' : 'url(#volumenHD)') : undefined}>
      <defs>
        <filter id="contornoV" x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d" />
          <feFlood floodColor={C.crema} floodOpacity="0.9" />
          <feComposite in2="d" operator="in" result="c" />
          <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g transform={`translate(0 ${baja}) rotate(${inclinar + (hd ? (accion === 'parado' ? peso * 1.2 : Math.sin(fase * 2) * 1.4) : 0)} 0 -176)`}>
        {props.adornos?.detras}
        {capa && (() => {
          const arriba: P[] = Array.from({ length: 7 }, (_, i) => [-6 - i * (accion === 'parado' ? 14 : 34), -300 + i * (accion === 'parado' ? 34 : 9) + ondea(i)] as P);
          const abajo: P[] = Array.from({ length: 7 }, (_, i) => [-20 - i * (accion === 'parado' ? 8 : 32), -230 + i * (accion === 'parado' ? 30 : 2) + ondea(i) * 1.3] as P).reverse();
          return (
            <>
              <path d={suave([...arriba, ...abajo], true)} fill={capa} stroke={C.negro} strokeWidth={3} />
              <path d={suave(abajo.slice().reverse())} stroke={C.blanco} strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" transform="translate(0 -8)" />
            </>
          );
        })()}
        {egipcio && alas && <AlaDiosa h={hT} c={cT} m={mT} ang={bTh + bTc + 40} f={fr} />}
        {/* brazo y escudo de atrás */}
        <path d={brazoD(hT, cT, mT, 24 * ancho, props.brazoSuave)} fill={piel} stroke={piel === C.negro ? 'none' : C.negro} strokeWidth={2} />
        {props.brazoSuave ? <Mano m={mT} ang={bTh + bTc + 40} piel={piel} k={0.85} guante={props.guante} /> : <circle cx={mT[0]} cy={mT[1]} r={8} fill={props.guante ?? piel} />}
        {props.adornos?.manoAtras && <g transform={`translate(${f1(mT[0])} ${f1(mT[1])})`}>{props.adornos.manoAtras}</g>}
        {/* pierna de atrás */}
        {!larga && <path d={pT.path} fill={props.pantalon ?? piel} stroke={(props.pantalon ?? piel) === C.negro ? 'none' : C.negro} strokeWidth={2} />}
        {!larga && props.pantalon && !props.botas && <Vendas k={pT.k} tob={pT.tob} />}
        {!larga && props.botas && <Bota k={pT.k} tob={pT.tob} c={props.botas} ancho={ancho} />}
        <path d={pT.pie} fill={props.botas ?? piel} stroke={(props.botas ?? piel) === C.negro ? 'none' : C.negro} strokeWidth={2} />
        {props.adornos?.pieAtras && <g transform={`translate(${f1(pT.tob[0])} ${f1(pT.tob[1])})`}>{props.adornos.pieAtras}</g>}
        {alas && !egipcio && <path d={`M${pT.tob[0] - 6} ${pT.tob[1] - 10} l -26 -16 l 6 12 l -14 -4 l 12 12 Z`} fill={C.purpura} stroke={C.negro} strokeWidth={2} />}
        {/* falda / túnica */}
        {ropa !== 'desnudo' && (
          <g transform={larga && baja ? `translate(0 -214) scale(1 ${f1(1 - baja / 208)}) translate(0 214)` : undefined}>
            <path d={suave(larga ? faldaLarga : tunica ? faldaTunica : faldaCorta, true, tunica ? 0.5 : 1)} fill={ropaColor} stroke={ropaColor === C.negro ? 'none' : C.negro} strokeWidth={2} opacity={egipcio && larga ? 0.92 : 1} />
            {(larga
              ? [[-16, -206, -34, -14], [-2, -208, -8, -12], [12, -208, 18, -12], [24, -206, 44, -14]]
              : tunica ? [[-16, -206, -20, -134], [0, -208, 0, -130], [16, -208, 20, -132]]
              : [[-14, -206, -26, -150], [0, -208, 2, -144], [14, -208, 28, -146], [22, -206, 42, -156]]
            ).map(([a, b, c, d], i) => <Inc key={i} d={suave([[a, b], [(a + c) / 2 + (i - 1.5) * 2, (b + d) / 2], [c + vuelo * 0.5, d]])} w={egipcio ? 1.2 : 1.8} c={linRopa} />)}
            <Borde d={larga ? suave([[-44 - vuelo, -12], [0, -8], [56 + vuelo, -10]]) : tunica ? suave([[-31 - vuelo * 0.3, -131], [0, -129], [33 + vuelo * 0.3, -132]]) : suave([[-44 - vuelo, -160], [-26, -150 - vuelo], [16, -146], [50 + vuelo, -152]])} w={9} color={props.ribete} />
            {larga && <Borde d={suave([[-38, -120], [0, -118], [40, -122]])} w={6} />}
            {nativo && Array.from({ length: 9 }, (_, i) => { const t = i / 8, bx = larga ? -42 - vuelo + t * (98 + vuelo * 2) : -42 - vuelo + t * (90 + vuelo * 2), by = larga ? -10 : -152 + Math.sin(t * Math.PI) * 6; return <path key={`fl${i}`} d={`M${f1(bx)} ${f1(by)} l ${f1(Math.sin(fr / 9 + i) * 2)} 13`} stroke={linRopa === C.crema ? C.crema : C.barroOscuro} strokeWidth={2.4} strokeLinecap="round" />; })}
          </g>
        )}
        {/* cadera (cuando no hay túnica que la tape) */}
        {ropa === 'desnudo' && <path d={suave([[-27 * ancho, -216], [24 * ancho, -218], [30 * ancho, -180], [4, -160], [-30 * ancho, -172]], true)} fill={piel} />}
        {/* torso */}
        <path d={suave(torso, true)} fill={ropa === 'desnudo' ? piel : ropa === 'armadura' ? C.negro : vestido ? ropaColor : piel} stroke={piel !== C.negro && ropa !== 'armadura' ? C.negro : 'none'} strokeWidth={2} />
        {vestido && <><Borde d={suave([[-26, -286], [4, -270], [32, -280]])} w={7} /><path d="M-28 -278 L -40 -262 M34 -276 L 44 -262" stroke={C.barroOscuro} strokeWidth={2} /></>}
        {cuerpoT === 'gordo' && <ellipse cx={22} cy={-236} rx={30} ry={34} fill={ropa === 'armadura' ? C.negro : piel} stroke={piel !== C.negro ? C.negro : 'none'} strokeWidth={2} />}
        {ropa === 'armadura' ? (
          <>
            <Inc d={suave([[-20, -290], [6, -296], [26, -286]])} w={2.5} />
            <Inc d={suave([[-24, -258], [0, -250], [28, -258]])} />
            <Inc d={suave([[-24, -232], [0, -226], [24, -232]])} />
            {[-18, -6, 6, 18].map((dx) => <path key={dx} d={`M${dx - 5} -210 h10 v26 h-10 Z`} fill={C.negro} stroke={C.crema} strokeWidth={1.5} />)}
          </>
        ) : (
          <>
            <Inc d={suave([[-4, -292], [10, -284], [26, -286]])} c={lin} />
            {!mujer && <Inc d={suave([[12, -276], [28, -264], [22, -246]])} c={lin} />}
            {mujer && !vestido && <Inc d={suave([[6, -270], [22, -262], [26, -250]])} c={lin} w={1.6} />}
          </>
        )}
        {ropa !== 'desnudo' && <Borde d="M-28 -216 L 26 -218" w={8} />}
        {props.estrellado && Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-24 + (i * 37) % 50} ${-296 + (i * 53) % 280} l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0 Z`} fill={C.oro} />)}
        {hawaiano && (props.collar ?? true) && ropa !== 'armadura' && Array.from({ length: 9 }, (_, i) => { const t = i / 8, cx = -24 + t * 58, cy = -300 + Math.sin(t * Math.PI) * 22; return <g key={`lei${i}`}><circle cx={cx} cy={cy} r={6.5} fill={['#E8724B', C.oro, '#F7EEDB', '#C2185B'][i % 4]} stroke={C.negro} strokeWidth={1.5} /><circle cx={cx} cy={cy} r={2} fill={C.purpura} /></g>; })}
        {nativo && (props.collar ?? true) && ropa !== 'armadura' && Array.from({ length: 7 }, (_, i) => { const t = i / 6, cx = -18 + t * 44, cy = -298 + Math.sin(t * Math.PI) * 10; return <circle key={`cu${i}`} cx={cx} cy={cy} r={3.6} fill={['#2F5D8A', C.blanco, C.purpura, C.oro][i % 4]} stroke={C.negro} strokeWidth={1} />; })}
        {props.adornos?.cuerpo}
        {(props.collar ?? egipcio) && !hawaiano && !nativo && ropa !== 'armadura' && [0, 1, 2].map((k) => <path key={k} d={`M${-24 + k * 2} ${-300 + k * 7} Q ${4} ${-276 + k * 9} ${34 - k * 2} ${-296 + k * 6}`} stroke={['#2E5FA8', '#2E8B6E', C.purpura][k]} strokeWidth={6} fill="none" strokeLinecap="round" />)}
        {/* pierna de adelante */}
        {!larga && (
          <>
            <path d={pD.path} fill={props.pantalon ?? piel} stroke={(props.pantalon ?? piel) === C.negro ? 'none' : C.negro} strokeWidth={2} />
            {props.pantalon && !props.botas && <Vendas k={pD.k} tob={pD.tob} />}
            {props.botas && <Bota k={pD.k} tob={pD.tob} c={props.botas} ancho={ancho} />}
            <Inc d={suave([lerp(cadera, pD.k, 0.4), lerp(cadera, pD.k, 0.85)])} w={1.6} c={lin} />
            <Inc d={`M${f1(pD.k[0] - 6)} ${f1(pD.k[1] - 4)} q 8 6 14 0`} w={1.8} c={lin} />
            <Inc d={suave([lerp(pD.k, pD.tob, 0.12), lerp(pD.k, pD.tob, 0.5)])} w={1.6} c={lin} />
          </>
        )}
        <path d={pD.pie} fill={props.botas ?? piel} stroke={(props.botas ?? piel) === C.negro ? 'none' : C.negro} strokeWidth={2} />
        {props.adornos?.pie && <g transform={`translate(${f1(pD.tob[0])} ${f1(pD.tob[1])})`}>{props.adornos.pie}</g>}
        {alas && !egipcio && <path d={`M${pD.tob[0] - 6} ${pD.tob[1] - 10} l -26 -16 l 6 12 l -14 -4 l 12 12 Z`} fill={C.purpura} stroke={C.negro} strokeWidth={2} />}
        {/* cabeza */}
        <g transform={`translate(${20 * ancho} -334) rotate(${-6 - cabeza + cabeceo + (hd ? -peso * 1.5 : 0)}) scale(${(nino ? 1.4 : 1) * (1 - 0.3 * (props.cabezaGiro ?? 0))} ${nino ? 1.4 : 1})`} filter={hd ? (props.sinSombraBorde ? 'url(#contornoParteHD)' : 'url(#parteHD)') : undefined}>
          {props.cabezaPropia ? null : animal ? <CabezaAnimal tipo={animal} piel={piel} /> : <>
          {(mujer || !barba) && tocado !== 'casco' && !trenzas && !props.peloCorto && [0, 1, 2].map((i) => <path key={i} d={suave([[-22 + i * 6, 6], [-30 + i * 4, 30 + ondea(i) * 0.3], [-26 + i * 5, 54 + ondea(i + 1) * 0.4], [-32 + i * 6, mujer ? 90 : 70]])} stroke={pelo} strokeWidth={mujer ? 11 : 9} fill="none" strokeLinecap="round" />)}
          {!mujer && barba && tocado !== 'casco' && !props.peloCorto && [0, 1, 2].map((i) => <path key={i} d={suave([[-22 + i * 6, 6], [-30 + i * 4, 30 + ondea(i) * 0.3], [-26 + i * 5, 54], [-32 + i * 6, 66]])} stroke={pelo} strokeWidth={9} fill="none" strokeLinecap="round" />)}
          <path d={suave([[-30, 2], [-22, -26], [0, -36], [20, -30], [28, -14], [30, -6], [mujer ? 37 : 41, 6], [32, 10], [34, 15], [boca ? 26 : 31, 20], [26, 26], [8, 32], [4, 46], [-16, 46], [-24, 22]], true, 0.9)} fill={piel} stroke={piel === C.negro ? 'none' : C.negro} strokeWidth={2} />
          {/* pelo sobre la cabeza */}
          <path d={suave([[-31, 4], [-26, -24], [-2, -38], [22, -32], [26, -20], [10, -22], [-8, -16], [-16, 0], [-22, 22]], true)} fill={pelo} />
          {barba && (
            <>
              <path d={suave([[4, 14], [26, 22], [36, 44], [30, 62], [12, 40], [0, 30]], true)} fill={pelo} />
              {[0, 1, 2, 3].map((i) => <Inc key={i} d={suave([[8 + i * 5, 24], [16 + i * 5, 40], [22 + i * 3, 54]])} w={1.5} c={canas ? C.negro : C.crema} />)}
            </>
          )}
          {boca && <path d="M24 18 L 34 24 L 26 26 Z" fill={C.negro} />}
          {/* ojo, ceja, oreja */}
          {props.ciclope ? (<g>
            <ellipse cx={16} cy={-6} rx={11} ry={9} fill={(ojosCerrados || parpadea) ? piel : C.blanco} stroke={C.negro} strokeWidth={2} />
            {!(ojosCerrados || parpadea) && <><circle cx={19} cy={-6} r={5.5} fill="#3A2312" /><circle cx={19.5} cy={-6} r={3} fill={C.negro} /><circle cx={21} cy={-8} r={1.2} fill={C.blanco} /></>}
            {(ojosCerrados || parpadea) && <Inc d="M5 -6 Q 16 0 27 -6" c={lin} w={2.4} />}
          </g>) : props.tuerto ? (<><ellipse cx={18} cy={-6} rx={9} ry={7} fill={C.negro} stroke={lin} strokeWidth={1.5} /><Inc d="M-26 -16 L 12 -12" c={lin} w={2} /></>) : expr === 'alegria' ? <Inc d="M9 -4 Q 18 -13 27 -4" c={lin} w={2.6} /> : (ojosCerrados || parpadea) ? <Inc d="M10 -6 Q 18 -2 26 -6" c={lin} w={2.2} /> : (
            hd ? (
              <g transform={expr === 'sorpresa' ? 'translate(18 -6) scale(1.3) translate(-18 6)' : undefined}>
                <path d={entornado ? 'M9 -5 Q 18 -9 27 -5 Q 18 -1 9 -5 Z' : 'M9 -6 Q 18 -14 27 -6 Q 18 0 9 -6 Z'} fill={piel === C.negro ? C.crema : C.blanco} stroke={C.negro} strokeWidth={1.6} />
                <circle cx={20} cy={-6} r={entornado ? 2.6 : 3.6} fill="#3A2312" />
                <circle cx={20.4} cy={-6} r={entornado ? 1.4 : 2} fill={C.negro} />
                <circle cx={21.6} cy={-7.6} r={0.9} fill={C.blanco} />
                <path d={entornado ? 'M8 -5 Q 18 -10 28 -5' : 'M8 -6 Q 18 -15 28 -6'} stroke={C.negro} strokeWidth={2.6} fill="none" strokeLinecap="round" />
              </g>
            ) : (
            <>
              <path d="M10 -6 Q 18 -12 26 -6 Q 18 -2 10 -6 Z" fill={piel === C.negro ? C.crema : C.blanco} stroke={piel === C.negro ? 'none' : C.negro} strokeWidth={1.5} />
              <circle cx={19} cy={-6} r={2.6} fill={C.negro} />
            </>)
          )}
          <Inc d={CEJA[expr]} w={expr === 'neutral' ? 2 : 2.8} c={lin} />
          {BOCA[expr] && !boca && <Inc d={BOCA[expr]} w={2.2} c={lin} />}
          {expr === 'sorpresa' && !boca && <ellipse cx={29} cy={21} rx={3} ry={4} fill={C.negro} stroke={lin} strokeWidth={1.2} />}
          {!mujer && !props.peloCorto && ((props.orejaSimple ?? true) ? <g><path d="M-3 -9 C -13 -11, -16 6, -6 9 C -2 8, -1 -6, -3 -9 Z" fill={piel} stroke={piel === C.negro ? lin : C.negro} strokeWidth={1.6} strokeLinejoin="round" /><path d="M-5 -4 C -10 -4, -11 3, -6 4" stroke={piel === C.negro ? lin : C.negro} strokeWidth={1.1} fill="none" opacity={0.55} /></g> : <Inc d="M-6 -4 C -14 -10, -14 8, -4 6 C 0 4, -2 -2, -6 0" w={1.8} />)}
          {!props.peloCorto && piel === C.negro && [0, 1, 2].map((i) => <Inc key={i} d={suave([[-22 + i * 5, 10], [-26 + i * 4, 30], [-22 + i * 5, 46]])} w={1.3} c={canas ? C.negro : C.crema} />)}
          {egipcio && !mujer && <path d="M8 -6 L 30 -2" stroke={C.negro} strokeWidth={2.5} />}
          {props.barbaPostiza && <path d="M14 30 L 24 30 L 26 58 L 12 54 Z" fill={C.negro} />}
          {trenzas && [0, 1].map((k) => { const pts: P[] = [[-14 - k * 8, 4], [-12 - k * 6, 40 + ondea(k) * 0.2], [-4 - k * 4, 80], [0 - k * 3, 112]]; return <g key={`tr${k}`} opacity={k ? 0.85 : 1}>
            <path d={suave(pts)} stroke={pelo} strokeWidth={11} fill="none" strokeLinecap="round" />
            {[18, 32, 46, 60, 74, 88, 100].map((yy, j) => { const p0 = pts[0], t = yy / 112, px = p0[0] + (pts[3][0] - p0[0]) * t + Math.sin(t * Math.PI) * 4; return <path key={j} d={`M${f1(px - 5)} ${yy - 3} l 10 6`} stroke={lin === C.crema ? '#5A4636' : C.crema} strokeWidth={1.3} opacity={0.55} />; })}
            <rect x={pts[3][0] - 7} y={96} width={14} height={8} rx={2} fill={C.purpura} stroke={C.negro} strokeWidth={1.2} />
          </g>; })}
          {props.trenza && <path d={suave([[-24, -8], [-36, 14], [-34, 40 + ondea(1) * 0.3], [-22, 50], [-16, 40]])} stroke={C.negro} strokeWidth={9} fill="none" strokeLinecap="round" />}
          </>}
          {/* tocados */}
          {tocado === 'cinta' && <Borde d={suave([[-30, -2], [-16, -22], [8, -30], [26, -24]])} w={7} />}
          {tocado === 'diadema' && <Borde d={suave([[-28, -10], [-12, -30], [10, -36], [24, -28]])} w={9} color={C.oro} />}
          {tocado === 'laurel' && Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={-24 + i * 7} cy={-24 - Math.sin(i / 2) * 10} rx={4} ry={9} fill={C.negro} stroke={C.crema} strokeWidth={1.2} transform={`rotate(${-50 + i * 15} ${-24 + i * 7} ${-24 - Math.sin(i / 2) * 10})`} />)}
          {tocado === 'corona' && <path d="M-26 -22 L-22 -54 L-12 -34 L-2 -60 L8 -34 L18 -54 L24 -24 Z" fill={C.oro} stroke={C.negro} strokeWidth={3} />}
          {tocado === 'velo' && <path d={suave([[-34, 0], [-28, -32], [0, -44], [24, -36], [6, -24], [-20, -4], [-30, 40], [-46, 90]], true)} fill={C.purpura} stroke={C.negro} strokeWidth={2} />}
          {tocado === 'petaso' && <path d="M-46 -20 C -30 -40, 30 -40, 46 -20 C 20 -26, -20 -26, -46 -20 Z M-18 -28 C -14 -52, 14 -52, 18 -28 Z" fill={C.negro} stroke={C.crema} strokeWidth={2} />}
          {(tocado === 'yelmo' || tocado === 'yelmoAlas') && (
            <g>
              <path d="M-32 6 C -36 -40, 30 -50, 34 0 Z" fill={C.negro} stroke={C.crema} strokeWidth={2.5} />
              <path d="M-33 0 L 34 0" stroke={C.purpura} strokeWidth={7} />
              <path d="M-2 -40 V -2 M-18 -30 L -20 -2 M14 -30 L 16 -2" stroke={C.crema} strokeWidth={1.6} />
              <path d="M26 -2 L 30 26 L 34 26 L 34 -2 Z" fill={C.negro} stroke={C.crema} strokeWidth={1.5} />
              {tocado === 'yelmoAlas' && [-1, 1].map((k) => <path key={k} d={`M${k < 0 ? -26 : 20} -24 C ${k < 0 ? -60 : 40} -60, ${k < 0 ? -80 : 30} -70, ${k < 0 ? -90 : 26} -80 C ${k < 0 ? -64 : 34} -50, ${k < 0 ? -54 : 30} -40, ${k < 0 ? -20 : 14} -14 Z`} fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />)}
            </g>
          )}
          {tocado === 'haku' && Array.from({ length: 8 }, (_, i) => { const a = -2.6 + i * 0.36, cx = Math.cos(a) * 30 - 2, cy = Math.sin(a) * 30 - 6; return <g key={i}><circle cx={cx} cy={cy} r={6} fill={['#E8724B', C.oro, '#F7EEDB', '#C2185B'][i % 4]} stroke={C.negro} strokeWidth={1.5} /><circle cx={cx} cy={cy} r={2} fill={C.purpura} /></g>; })}
          {tocado === 'mahiole' && (
            <g>
              <path d="M-32 6 C -36 -40, 30 -48, 34 0 Z" fill={C.purpura} stroke={C.negro} strokeWidth={2.5} />
              <path d="M-30 -22 C -20 -70, 20 -72, 30 -24 C 18 -46, -16 -46, -30 -22 Z" fill={C.oro} stroke={C.negro} strokeWidth={2.5} />
              {[-18, -6, 6, 18].map((dx) => <path key={dx} d={`M${dx} -40 v 10`} stroke={C.negro} strokeWidth={1.5} />)}
            </g>
          )}
          {tocado === 'sombrero' && <path d="M-56 -14 C -30 -30, 34 -32, 60 -16 C 30 -20, -24 -20, -56 -14 Z M-28 -20 C -26 -60, 22 -64, 26 -20 Z" fill={C.negro} stroke={C.crema} strokeWidth={2} />}
          <TocadoEgipcio t={tocado} mujer={!!mujer} />
          <TocadoNativo t={tocado} nacion={props.nacion} f={fr} />
          {props.adornos?.cabeza}
          {tocado === 'casco' && (
            <g>
              <path d="M-34 10 C -44 -50, 36 -60, 38 -2 L 38 40 L 16 40 L 16 6 L -2 6 L -2 44 L -30 44 Z" fill={C.negro} stroke={C.crema} strokeWidth={2.5} />
              <path d="M-26 -38 C -10 -84, 40 -80, 56 -40" stroke={C.purpura} strokeWidth={16} fill="none" strokeLinecap="round" />
              <path d="M-26 -38 C -10 -84, 40 -80, 56 -40" stroke={C.negro} strokeWidth={2} strokeDasharray="3 5" fill="none" />
            </g>
          )}
        </g>
        {egipcio && alas && <AlaDiosa h={hD} c={cD} m={mD} ang={bDh + bDc} f={fr + 4} />}
        {/* brazo de adelante y objeto */}
        <g filter={hd ? (props.sinSombraBorde ? 'url(#contornoParteHD)' : 'url(#parteHD)') : undefined}>
        <path d={brazoD(hD, cD, mD, 26 * ancho, props.brazoSuave)} fill={piel} stroke={piel === C.negro ? 'none' : C.negro} strokeWidth={2} />
        <Inc d={suave([lerp(hD, cD, 0.3), lerp(hD, cD, 0.8)])} w={1.6} c={lin} />
        </g>
        <g transform={`translate(${mD[0]} ${mD[1]})`}>
          <ObjetoMano tipo={objeto} f={fr} ang={bDh + bDc} />
          {props.adornos?.mano}
        </g>
        {props.manoCortada ? <g transform={`translate(${f1(mD[0])} ${f1(mD[1])}) rotate(${f1(-(bDh + bDc))})`}><path d="M-6.5 -8 L -6.5 -1 Q 0 6 6.5 -1 L 6.5 -8 Z" fill={piel} stroke={C.negro} strokeWidth={1.8} /><rect x={-8.5} y={-17} width={17} height={10} rx={3} fill="#6B4A2E" stroke={C.negro} strokeWidth={1.6} /></g> : props.brazoSuave ? <Mano m={mD} ang={bDh + bDc} piel={piel} k={1} guante={props.guante} /> : <circle cx={mD[0]} cy={mD[1]} r={10} fill={props.guante ?? piel} stroke={piel === C.negro ? 'none' : C.negro} strokeWidth={2} />}
        {escudo && (
          <g transform={`translate(${cT[0] - 10} ${cT[1] + 10})`}>
            <circle r={66} fill={C.negro} stroke={C.purpura} strokeWidth={8} />
            <circle r={58} fill="none" stroke={C.blanco} strokeWidth={2} strokeDasharray="2 8" />
            <path d={EMBLEMAS[emblema]} stroke={C.blanco} strokeWidth={4} fill="none" transform="scale(1.6)" />
          </g>
        )}
      </g>
      </g></g>
    </g>
  );
};

// ---------- fuego, luz, naturaleza ----------
const llama = (w: number, h: number, ladeo: number, ruido: number): P[] => {
  const lado = (sg: number) => Array.from({ length: 10 }, (_, i) => {
    const t = i / 9, a = w * Math.sin(Math.PI * Math.pow(1 - t, 1.5)) * (1 + Math.sin(t * 9 + ruido * sg) * 0.08);
    return [sg * a + ladeo * t * t, -h * t] as P;
  });
  return [...lado(1), ...lado(-1).reverse()];
};
/** Fuego en capas que titila (origen = base). */
export const Fuego: React.FC<{ f: number; s?: number; viento?: number }> = ({ f, s = 1, viento = -30 }) => {
  const n = (k: number) => Math.sin(f * 0.5 + k) * 0.5 + Math.sin(f * 0.83 + k * 2) * 0.5;
  return (
    <g transform={`scale(${s})`}>
      <circle r={130} cy={-40} fill="url(#halo)" style={{ mixBlendMode: 'screen' }} opacity={0.75 + n(1) * 0.15} />
      <path d={suave(llama(40, 120 + n(2) * 14, viento + n(3) * 14, f * 0.3), true)} fill="#B8331C" stroke={C.negro} strokeWidth={3} />
      <path d={suave(llama(28, 88 + n(4) * 10, viento * 0.75 + n(5) * 10, f * 0.4), true)} fill="#EE7A2A" />
      <path d={suave(llama(16, 54 + n(6) * 8, viento * 0.45 + n(7) * 8, f * 0.5), true)} fill={C.oro} />
      <path d={suave(llama(7, 26 + n(8) * 5, viento * 0.2, f * 0.6), true)} fill={C.blanco} />
    </g>
  );
};

/** Chispas que suben desde un punto. */
export const Chispas: React.FC<{ x: number; y: number; n?: number; f: number; viento?: number }> = ({ x, y, n = 24, f, viento = -1.5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const ciclo = 70 + (i % 5) * 10, edad = (f + i * 13) % ciclo, a = azar(i + 3);
      return <circle key={i} cx={x + edad * viento * (0.5 + a) + Math.sin(edad / 6 + i) * 6} cy={y - edad * (1.2 + a)} r={Math.max(0.5, 3.5 - edad * 0.04)} fill={a > 0.5 ? C.oro : '#FF9A3C'} opacity={Math.max(0, 1 - edad / ciclo)} />;
    })}
  </g>
);

export const Estrellas: React.FC<{ n?: number; f: number; area?: [number, number, number, number]; seed?: number }> = ({ n = 30, f, area = [0, 140, 1920, 360], seed = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={area[0] + azar(i * 3 + seed) * area[2]} cy={area[1] + azar(i * 7 + seed) * area[3]} r={1.5 + azar(i + seed) * 2.5} fill={C.blanco} opacity={0.45 + 0.5 * Math.sin(f / 9 + i)} />
    ))}
  </g>
);

export const Luna: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 46 }) => <path d={`M${x} ${y - r} a ${r} ${r} 0 1 0 ${r * 0.65} ${r * 1.75} a ${r * 0.8} ${r * 0.8} 0 1 1 ${-r * 0.65} ${-r * 1.75} Z`} fill={C.blanco} />;

export const Sol: React.FC<{ x: number; y: number; r?: number; f: number }> = ({ x, y, r = 60, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.4} fill="url(#halo)" opacity={0.7} />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M0 ${-r - 8} L6 ${-r - 30} L-6 ${-r - 30} Z`} fill={C.oro} transform={`rotate(${i * 22.5 + f * 0.2})`} />)}
    <circle r={r} fill={C.oro} stroke={C.negro} strokeWidth={4} />
  </g>
);

export const Olivo: React.FC<{ x: number; y?: number; s?: number; f: number; color?: string }> = ({ x, y = SUELO, s = 1, f, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 0 C -20 -60, 10 -90, -6 -150 C -14 -180, 10 -200, 4 -230 L 18 -230 C 26 -196, 4 -180, 14 -150 C 30 -100, 0 -60, 14 0 Z" fill={color} />
    <path d="M0 -150 C -40 -170, -70 -200, -110 -205 M6 -180 C 40 -200, 80 -230, 120 -232 M8 -215 C 0 -250, -30 -270, -50 -290 M10 -225 C 20 -250, 30 -260, 40 -275 M-20 -160 C -60 -160, -110 -160, -140 -170 M30 -170 C 80 -180, 120 -190, 150 -195 M4 -230 C 2 -260, 0 -290, 0 -310" stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
    {[[-110, -205], [120, -232], [-50, -290], [40, -275], [-140, -170], [150, -195], [0, -310]].map(([cx, cy], c) =>
      Array.from({ length: 26 }, (_, i) => {
        const u = azar(c * 31 + i), v = azar(c * 17 + i + 100);
        const lx = cx + Math.cos(u * 6.28) * v * 62, ly = cy + Math.sin(u * 6.28) * v * 34;
        return <ellipse key={`${c}-${i}`} cx={lx} cy={ly} rx={4.5} ry={15} fill={i % 9 === 0 ? C.purpura : color} transform={`rotate(${u * 360 + Math.sin(f / 18 + i + c) * 7} ${lx} ${ly})`} />;
      }))}
  </g>
);

/** Montaña estilizada con escamas (como en las vasijas). */
export const Monte: React.FC<{ x: number; base?: number; ancho?: number; alto?: number; color?: string; o?: number; templo?: boolean }> = ({ x, base = SUELO, ancho = 700, alto = 460, color = C.barroOscuro, o = 0.6, templo }) => {
  const cima = base - alto;
  return (
    <g opacity={o}>
      <path d={`M${x - ancho} ${base} C ${x - ancho * 0.55} ${base - alto * 0.3}, ${x - ancho * 0.25} ${cima + 30}, ${x} ${cima} C ${x + ancho * 0.25} ${cima + 30}, ${x + ancho * 0.55} ${base - alto * 0.3}, ${x + ancho} ${base} Z`} fill={color} />
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 + r * 2 }, (_, i) => {
        const yy = cima + 40 + r * (alto / 7), w = (r + 1) * (ancho / 8);
        const cx = x - w + (i + 0.5) * ((w * 2) / (3 + r * 2));
        return <path key={`${r}-${i}`} d={`M${cx - 20} ${yy} a 20 14 0 0 1 40 0`} stroke={C.negro} strokeWidth={2.5} fill="none" opacity={0.35} />;
      }))}
      {templo && <Templo x={x} y={cima + 6} s={0.5} />}
    </g>
  );
};

export const Templo: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.negro }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 -170 L0 -228 L150 -170 Z" fill={color} />
    <path d="M-90 -180 L0 -214 L90 -180" stroke={C.crema} strokeWidth={3} fill="none" />
    <rect x={-156} y={-170} width={312} height={16} fill={color} />
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={-150 + i * 24} y={-152} width={12} height={10} fill={C.crema} opacity={0.5} />)}
    {[-125, -75, -25, 25, 75, 125].map((cx) => (
      <g key={cx}>
        <rect x={cx - 11} y={-140} width={22} height={122} fill={color} />
        <rect x={cx - 16} y={-146} width={32} height={8} fill={color} />
        <path d={`M${cx - 4} -136 V-22 M${cx + 4} -136 V-22`} stroke={C.crema} strokeWidth={1.2} opacity={0.6} />
      </g>
    ))}
    <rect x={-166} y={-20} width={332} height={10} fill={color} />
    <rect x={-180} y={-10} width={360} height={10} fill={color} />
  </g>
);

/** Olas en el estilo "perro corriendo" de las guardas griegas, animadas. */
export const Olas: React.FC<{ y: number; f: number; color?: string; alto?: number; capas?: number }> = ({ y, f, color = C.negro, alto = 40, capas = 2 }) => (
  <g>
    {Array.from({ length: capas }, (_, c) => {
      const yy = y + c * alto * 1.2, w = 120, off = ((f * (1.2 + c * 0.6)) % w);
      let d = `M${-w - off} ${yy + alto}`;
      for (let i = -1; i < 2400 / w; i++) {
        const x0 = i * w - off;
        d += ` C ${x0 + w * 0.3} ${yy + alto}, ${x0 + w * 0.35} ${yy}, ${x0 + w * 0.6} ${yy} C ${x0 + w * 0.85} ${yy}, ${x0 + w * 0.85} ${yy + alto * 0.5}, ${x0 + w * 0.68} ${yy + alto * 0.5} C ${x0 + w * 0.6} ${yy + alto * 0.5}, ${x0 + w * 0.62} ${yy + alto * 0.8}, ${x0 + w} ${yy + alto}`;
      }
      d += ` L2400 ${yy + 400} L-200 ${yy + 400} Z`;
      return <path key={c} d={d} fill={c === 0 ? color : C.negro} opacity={c === 0 ? 0.85 : 1} />;
    })}
  </g>
);

export const Nube: React.FC<{ x: number; y: number; s?: number; color?: string; f?: number }> = ({ x, y, s = 1, color = C.crema, f = 0 }) => (
  <g transform={`translate(${x + Math.sin(f / 40) * 10} ${y}) scale(${s})`}>
    <path d="M-150 30 C -170 0, -130 -30, -100 -20 C -90 -60, -30 -70, -10 -40 C 10 -80, 80 -70, 90 -30 C 130 -40, 170 0, 150 30 Z" fill={color} stroke={C.negro} strokeWidth={3} />
    <path d="M-110 10 C -90 0, -70 0, -50 10 M10 0 C 30 -10, 60 -10, 80 4" stroke={C.negro} strokeWidth={2} fill="none" opacity={0.5} />
  </g>
);

/** Rayo que cae entre dos puntos (aparece en `desde` y destella). */
export const Relampago: React.FC<{ a: P; b: P; f: number; desde: number; dur?: number }> = ({ a, b, f, desde: d0, dur = 14 }) => {
  if (f < d0 || f > d0 + dur) return null;
  const pts: P[] = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7, p = lerp(a, b, t);
    return [p[0] + (i && i < 7 ? (azar(i + d0) - 0.5) * 80 : 0), p[1]] as P;
  });
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  return (
    <g opacity={1 - (f - d0) / dur}>
      <path d={d} stroke={C.oro} strokeWidth={14} fill="none" strokeLinejoin="miter" />
      <path d={d} stroke={C.blanco} strokeWidth={5} fill="none" />
    </g>
  );
};

/** Suelo de la escena: franja negra con puntitos y piedras (en el tema nórdico, con nieve encima). */
export const Suelo: React.FC<{ desde?: number; hasta?: number; color?: string }> = ({ desde: x0 = -400, hasta = 5000, color = C.negro }) => TEMA.nombre === 'kamasan' ? <SueloKamasan desde={x0} hasta={hasta} color={color} /> : TEMA.nombre ==='kowhaiwhai' ? <SueloMaori desde={x0} hasta={hasta} color={color} /> : TEMA.nombre === 'pahari' ? <SueloPahari desde={x0} hasta={hasta} color={color} /> : TEMA.nombre === 'codice' ? <SueloCodice desde={x0} hasta={hasta} color={color} /> : TEMA.nombre === 'pintado' ? (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={200} fill="#8A5A34" />
    <rect x={x0} y={SUELO} width={hasta - x0} height={6} fill={C.negro} />
    {Array.from({ length: Math.ceil((hasta - x0) / 48) }, (_, i) => <path key={i} d={`M${x0 + i * 48 + 8} ${SUELO + 30} l 16 -12 l 16 12 Z`} fill={i % 2 ? '#2F5D8A' : C.purpura} stroke={C.negro} strokeWidth={1.5} />)}
  </g>
) : TEMA.nombre === 'kapa' ? (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={200} fill={C.barroOscuro} />
    <rect x={x0} y={SUELO} width={hasta - x0} height={6} fill={C.negro} />
    {Array.from({ length: Math.ceil((hasta - x0) / 36) }, (_, i) => <path key={i} d={`M${x0 + i * 36} ${SUELO + 30} l 18 -14 l 18 14 Z`} fill={i % 2 ? C.negro : C.purpura} opacity={0.8} />)}
  </g>
) : TEMA.nombre === 'papiro' ? (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={200} fill={C.barroOscuro} />
    <rect x={x0} y={SUELO} width={hasta - x0} height={8} fill={C.negro} />
    {Array.from({ length: Math.ceil((hasta - x0) / 40) }, (_, i) => <rect key={i} x={x0 + i * 40 + 4} y={SUELO + 12} width={32} height={14} fill={['#2E5FA8', C.purpura, '#2E8B6E'][i % 3]} stroke={C.negro} strokeWidth={2} />)}
  </g>
) : TEMA.nombre === 'runas' ? (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={200} fill={color} />
    <path d={`M${x0} ${SUELO + 4} ` + Array.from({ length: Math.ceil((hasta - x0) / 90) }, (_, i) => `Q ${x0 + i * 90 + 45} ${SUELO - 10 - azar(i) * 8} ${x0 + (i + 1) * 90} ${SUELO + 4}`).join(' ') + ` L${hasta} ${SUELO + 14} L${x0} ${SUELO + 14} Z`} fill={C.blanco} />
    {Array.from({ length: Math.ceil((hasta - x0) / 60) }, (_, i) => <path key={i} d={`M${x0 + i * 60} ${SUELO + 30} l 10 10 l 10 -10`} stroke={C.barro} strokeWidth={3} fill="none" />)}
  </g>
) : (
  <g>
    <rect x={x0} y={SUELO} width={hasta - x0} height={200} fill={color} />
    <path d={`M${x0} ${SUELO} L${hasta} ${SUELO}`} stroke={C.purpura} strokeWidth={6} />
    {Array.from({ length: Math.ceil((hasta - x0) / 50) }, (_, i) => <circle key={i} cx={x0 + i * 50} cy={SUELO + 18} r={4} fill={C.barro} />)}
  </g>
);

/** Rótulo en mayúsculas griegas sobre la escena (nombre de personaje o lugar). */
export const Rotulo: React.FC<{ x: number; y: number; texto: string; o: number; tam?: number; color?: string }> = ({ x, y, texto, o, tam = 34, color = C.crema }) => {
  // Nunca por encima del borde ornamental de arriba (la línea base queda al menos un renglón debajo),
  // teniendo en cuenta el zoom de la cámara (que agranda desde el suelo hacia arriba) y los acentos (ā, ʻ).
  const { z } = useContext(Cam);
  const minPantalla = ARRIBA + tam + 30;
  const minMundo = SUELO - (SUELO - minPantalla) / Math.max(1, z);
  return (
  <text x={x} y={Math.max(minMundo, y) + (1 - o) * 10} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={tam} fill={color} opacity={o} letterSpacing={4} style={{ paintOrder: 'stroke' }} stroke={C.negro} strokeWidth={6}>
    {texto}
  </text>
  );
};

// ---------- piel nórdica: runas, nudos y aurora ----------
/** Runas del futhark antiguo como trazos (caja 16×30). */
const RUNAS: Record<string, string> = {
  F: 'M3 0 V30 M3 4 L15 -2 M3 13 L15 7', U: 'M3 30 V0 L14 9 V30', T: 'M8 0 V30 M2 8 L8 0 L14 8', A: 'M3 0 V30 M3 4 L14 11 M3 13 L14 20',
  R: 'M3 30 V0 L13 7 L3 14 L14 30', K: 'M14 0 L3 9 L14 18', G: 'M2 2 L14 28 M14 2 L2 28', W: 'M3 30 V0 L13 7 L3 14',
  H: 'M2 0 V30 M14 0 V30 M2 9 L14 20', N: 'M8 0 V30 M2 11 L14 19', I: 'M8 0 V30', J: 'M3 8 L9 2 L9 14 M7 16 L7 28 L13 22',
  P: 'M3 0 V30 M3 3 L12 9 M3 27 L12 21', Z: 'M8 0 V30 M2 6 L8 13 L14 6', S: 'M12 0 L3 12 L13 18 L4 30', B: 'M3 0 V30 L13 22 L3 15 L13 8 L3 0',
  E: 'M2 30 V0 L8 10 L14 0 V30', M: 'M2 0 V30 M14 0 V30 M2 2 L14 14 M14 2 L2 14', L: 'M3 0 V30 M3 1 L14 9', O: 'M2 30 L14 13 L8 3 L2 13 L14 30',
  D: 'M2 0 V30 M14 0 V30 M2 1 L14 29 M14 1 L2 29', Y: 'M8 0 V30 M2 0 L8 9 L14 0', C: 'M14 0 L3 9 L14 18', Q: 'M14 0 L3 9 L14 18', V: 'M3 30 V0 L14 9 V30', X: 'M2 2 L14 28 M14 2 L2 28',
};
/** Texto latino escrito con runas (ideal para frisos). */
export const TextoRunico: React.FC<{ texto: string; x: number; y: number; esc?: number; color?: string; w?: number }> = ({ texto, x, y, esc = 1, color = C.crema, w = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${esc})`}>
    {[...texto.toUpperCase()].map((ch, i) => (ch === ' ' ? <circle key={i} cx={i * 24 + 8} cy={15} r={2.6} fill={color} /> : RUNAS[ch] ? <path key={i} d={RUNAS[ch]} transform={`translate(${i * 24} 0)`} stroke={color} strokeWidth={w / esc} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null))}
  </g>
);

/** Banda de nudo entrelazado (dos cintas que pasan una por encima de otra). */
export const Entrelazado: React.FC<{ y: number; alto: number; desplaz: number; paso?: number }> = ({ y, alto, desplaz, paso = 120 }) => {
  const A = alto / 2 - 7, cy = alto / 2, k = Math.PI / paso;
  const cinta = (signo: number, x0: number, x1: number) => {
    let d = '';
    for (let xx = x0; xx <= x1; xx += 6) d += `${xx === x0 ? 'M' : 'L'}${xx} ${(cy + signo * A * Math.sin(xx * k)).toFixed(1)} `;
    return d;
  };
  const Cinta: React.FC<{ d: string }> = ({ d }) => (<><path d={d} stroke={C.negro} strokeWidth={15} fill="none" strokeLinecap="butt" /><path d={d} stroke={C.crema} strokeWidth={7} fill="none" /><path d={d} stroke={C.negro} strokeWidth={1.5} fill="none" /></>);
  return (
    <g transform={`translate(${-(desplaz % (paso * 2))} ${y})`}>
      <Cinta d={cinta(1, -paso, 2400)} />
      <Cinta d={cinta(-1, -paso, 2400)} />
      {Array.from({ length: Math.ceil(2400 / paso) + 1 }, (_, i) => i % 2 === 0 ? <Cinta key={i} d={cinta(1, i * paso - 22, i * paso + 22)} /> : <Cinta key={i} d={cinta(-1, i * paso - 22, i * paso + 22)} />)}
    </g>
  );
};

/** Guardas nórdicas: friso de runas + nudo arriba, nudo abajo y franja de subtítulos. */
export const GuardasRunas: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={C.barro} />
    <rect x={0} y={0} width={1920} height={52} fill={C.negro} />
    <g transform={`translate(${-(desplaz % 1680)} 0)`}>
      {[0, 1, 2].map((r) => <TextoRunico key={r} texto="ODIN THOR LOKI FRIGG FREYJA TYR BALDR HEIMDALL " x={r * 1680 + 10} y={11} esc={1} color={C.crema} w={3} />)}
    </g>
    <line x1={0} x2={1920} y1={52} y2={52} stroke={C.purpura} strokeWidth={6} />
    <Entrelazado y={58} alto={62} desplaz={desplaz} />
    <line x1={0} x2={1920} y1={ARRIBA - 2} y2={ARRIBA - 2} stroke={C.negro} strokeWidth={5} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={C.barro} />
    <line x1={0} x2={1920} y1={ABAJO} y2={ABAJO} stroke={C.negro} strokeWidth={5} />
    <line x1={0} x2={1920} y1={ABAJO + 8} y2={ABAJO + 8} stroke={C.purpura} strokeWidth={5} />
    <Entrelazado y={ABAJO + 22} alto={84} desplaz={desplaz} paso={150} />
    <line x1={0} x2={1920} y1={ABAJO + 120} y2={ABAJO + 120} stroke={C.negro} strokeWidth={5} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={C.negro} />
  </>
);

/** Aurora boreal que ondula en el cielo nocturno. */
export const Aurora: React.FC<{ f: number }> = ({ f }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {[0, 1, 2].map((c) => {
      let d = '';
      for (let xx = -100; xx <= 2020; xx += 40) d += `${xx === -100 ? 'M' : 'L'}${xx} ${(250 + c * 40 + Math.sin(xx / 260 + f / 50 + c) * 50 + Math.sin(xx / 90 + f / 30) * 12).toFixed(1)} `;
      return <path key={c} d={d} stroke={['#7FE0C0', '#6FB8E8', '#B9A6F0'][c]} strokeWidth={60 - c * 14} fill="none" opacity={0.18 + 0.06 * Math.sin(f / 40 + c)} strokeLinecap="round" />;
    })}
  </g>
);

// ---------- piel egipcia: cabezas de animal, coronas, guardas ----------
/** Cabeza de animal de perfil mirando a la derecha (coordenadas de la cabeza humana). Lleva peluca tripartita. */
export const CabezaAnimal: React.FC<{ tipo: string; piel: string }> = ({ tipo, piel }) => {
  const os = tipo === 'chacal' || tipo === 'set' ? C.negro : tipo === 'ibis' ? C.negro : tipo === 'cocodrilo' ? '#4E7A3A' : tipo === 'leona' ? '#C8862E' : tipo === 'vaca' ? C.blanco : tipo === 'carnero' ? '#B9A27A' : '#5B4A3A';
  const ojo = (cx: number, cy: number) => <><ellipse cx={cx} cy={cy} rx={6} ry={4} fill={C.blanco} /><circle cx={cx + 1} cy={cy} r={2.5} fill={C.negro} /></>;
  return (
    <g>
      {/* peluca tripartita azul-negra */}
      <path d="M-34 -10 C -40 -40, 10 -46, 20 -26 L 18 60 L -6 66 L -36 50 Z" fill="#1F2E52" stroke={C.negro} strokeWidth={2} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-30 + i * 9} -24 V ${54 - Math.abs(i - 2) * 4}`} stroke="#3B5A94" strokeWidth={2} />)}
      {tipo === 'halcon' && <><path d="M-14 -30 C 10 -40, 34 -26, 34 -6 C 46 -4, 48 8, 38 14 C 34 6, 30 6, 26 10 C 18 22, -4 26, -14 14 Z" fill={os} stroke={C.negro} strokeWidth={2} />{ojo(18, -10)}<path d="M12 -2 Q 18 10 10 22" stroke={C.negro} strokeWidth={3} fill="none" /><path d="M34 -6 C 42 -6, 46 2, 40 10" fill={C.oro} stroke={C.negro} strokeWidth={1.5} /></>}
      {(tipo === 'chacal' || tipo === 'set') && <><path d={tipo === 'set' ? 'M-14 -26 C 4 -34, 22 -24, 28 -14 C 44 -6, 56 6, 60 18 C 44 16, 30 14, 20 18 C 6 24, -10 20, -14 10 Z' : 'M-14 -26 C 4 -34, 20 -24, 26 -14 L 62 4 L 58 14 L 24 16 C 8 22, -10 20, -14 10 Z'} fill={os} stroke={C.oro} strokeWidth={2} />{ojo(14, -10)}{tipo === 'set' ? <path d="M-6 -28 L -10 -70 L 6 -72 L 6 -30 M4 -30 L 8 -68 L 22 -66 L 14 -28" fill={os} stroke={C.oro} strokeWidth={2} /> : <path d="M-8 -28 L -4 -74 L 12 -30 Z" fill={os} stroke={C.oro} strokeWidth={2} />}</>}
      {tipo === 'ibis' && <><path d="M-12 -26 C 6 -34, 22 -24, 24 -10 C 26 4, 10 14, -10 10 Z" fill={os} stroke={C.oro} strokeWidth={2} />{ojo(10, -12)}<path d="M22 -10 C 44 -6, 62 14, 70 40 C 56 20, 40 6, 22 2" fill={C.negro} stroke={C.negro} strokeWidth={4} strokeLinejoin="round" /></>}
      {tipo === 'leona' && <><path d="M-20 -30 C 10 -46, 40 -26, 40 -4 C 52 0, 52 14, 40 18 C 30 30, 0 34, -18 20 Z" fill={os} stroke={C.negro} strokeWidth={2} />{ojo(18, -8)}<path d="M-22 -30 C -34 -10, -30 30, -10 40" stroke="#8A5520" strokeWidth={10} fill="none" /><path d="M40 10 L 32 12" stroke={C.negro} strokeWidth={2} /></>}
      {tipo === 'cocodrilo' && <><path d="M-14 -24 C 4 -34, 20 -24, 26 -14 L 70 0 L 70 10 L 24 14 C 8 22, -10 18, -14 8 Z" fill={os} stroke={C.negro} strokeWidth={2} />{ojo(12, -14)}<path d="M28 4 L 68 6" stroke={C.negro} strokeWidth={2} />{[34, 44, 54, 62].map((x) => <path key={x} d={`M${x} 6 l 3 5 l 3 -5`} fill={C.blanco} />)}</>}
      {tipo === 'carnero' && <><path d="M-14 -26 C 8 -34, 26 -20, 30 -4 C 40 4, 40 16, 30 20 C 16 26, -8 22, -14 10 Z" fill={os} stroke={C.negro} strokeWidth={2} />{ojo(14, -8)}<path d="M-10 -20 C -30 -24, -34 4, -14 6 C -2 6, -4 -10, -14 -8" stroke={C.oro} strokeWidth={7} fill="none" /></>}
      {tipo === 'vaca' && <><path d="M-14 -26 C 8 -34, 26 -20, 32 -2 C 42 6, 40 18, 30 22 C 16 28, -8 22, -14 10 Z" fill={os} stroke={C.negro} strokeWidth={2} />{ojo(14, -8)}<path d="M-6 -26 C -20 -52, 10 -64, 30 -48" stroke={C.negro} strokeWidth={6} fill="none" /></>}
      {/* collar de la peluca */}
      <path d="M-6 30 L 20 30" stroke={C.oro} strokeWidth={4} />
    </g>
  );
};

/** Coronas y tocados egipcios (coordenadas de la cabeza). */
/** Pluma de águila (blanca con punta oscura), de base a punta hacia arriba; ang en grados (0 = arriba). */
export const PlumaAguila: React.FC<{ x: number; y: number; ang?: number; l?: number }> = ({ x, y, ang = 0, l = 70 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <path d={`M-2 0 C -9 ${-l * 0.3}, -9 ${-l * 0.78}, 0 ${-l} C 9 ${-l * 0.78}, 9 ${-l * 0.3}, 2 0 Z`} fill="#F4EEE2" stroke={C.negro} strokeWidth={1.6} />
    <path d={`M-7.6 ${-l * 0.68} C -7 ${-l * 0.84}, -4 ${-l * 0.95}, 0 ${-l} C 4 ${-l * 0.95}, 7 ${-l * 0.84}, 7.6 ${-l * 0.68} Z`} fill="#2A211B" />
    <path d={`M0 2 V ${-l * 0.9}`} stroke={C.negro} strokeWidth={1} opacity={0.6} />
    <path d="M-3 2 h 6 v -8 h -6 Z" fill={C.purpura} />
  </g>
);
/** Tocados del tema norteamericano (en coordenadas de la cabeza, de perfil mirando a la derecha). */
export const TocadoNativo: React.FC<{ t: Tocado | undefined; nacion?: PersonajeProps['nacion']; f: number }> = ({ t, nacion = 'mohawk', f }) => {
  const mece = Math.sin(f / 14) * 2;
  switch (t) {
    case 'gustoweh': { // gorro haudenosaunee de tiras de fresno, plumas chicas y plumas de águila según la nación
      const arriba = (dx: number, ang: number, i: number) => <PlumaAguila key={`a${i}`} x={dx} y={-40} ang={ang + mece} l={66} />;
      const abajo = (i: number) => <PlumaAguila key={`b${i}`} x={-22} y={-26} ang={-118 + mece} l={58} />;
      const plumas = nacion === 'mohawk' ? [arriba(-8, -12, 0), arriba(0, 0, 1), arriba(8, 12, 2)]
        : nacion === 'oneida' ? [arriba(-4, -8, 0), arriba(5, 8, 1), abajo(0)]
        : nacion === 'onondaga' ? [arriba(0, 0, 0), abajo(0)]
        : nacion === 'cayuga' ? [<PlumaAguila key="c" x={-6} y={-38} ang={-45 + mece} l={66} />]
        : nacion === 'seneca' ? [arriba(0, 0, 0)] : [];
      return (
        <g>
          {plumas}
          <path d="M-32 4 C -38 -40, 26 -50, 32 -14 L 27 -8 C 10 -18, -12 -14, -32 4 Z" fill="#EAE3D3" stroke={C.negro} strokeWidth={2.2} />
          {[-22, -10, 2, 14].map((dx, i) => <path key={i} d={`M${dx} ${-28 - (i % 2) * 4} q 6 -6 12 0`} stroke="#9A8E7A" strokeWidth={1.6} fill="none" />)}
          <path d="M-31 2 C -16 -12, 8 -18, 30 -12" stroke={C.purpura} strokeWidth={7} fill="none" />
          <path d="M-31 2 C -16 -12, 8 -18, 30 -12" stroke={C.blanco} strokeWidth={2.4} strokeDasharray="1 7" strokeLinecap="round" fill="none" />
        </g>
      );
    }
    case 'plumaAtras':
      return <g><PlumaAguila x={-24} y={-16} ang={-38 + mece} l={64} /><path d="M-30 0 C -16 -16, 8 -22, 28 -16" stroke={C.purpura} strokeWidth={5} fill="none" /></g>;
    case 'cintaTejida':
      return <g><path d="M-31 -2 C -16 -18, 8 -26, 29 -20" stroke={C.purpura} strokeWidth={9} fill="none" />{[-24, -12, 0, 12, 22].map((dx, i) => <path key={i} d={`M${dx} ${-10 - i * 2.4} l 4 -4 l 4 4 l -4 4 Z`} fill={i % 2 ? C.oro : '#2F5D8A'} />)}</g>;
    case 'sombreroCesteria': // sombrero tejido de raíz de abeto (costa noroeste), con bandas pintadas
      return (
        <g>
          <path d="M-58 -6 C -30 -2, 30 -6, 58 -12 L 26 -54 C 10 -60, -14 -60, -26 -52 Z" fill="#C9A46A" stroke={C.negro} strokeWidth={2.4} />
          {[-16, -28, -40].map((yy, i) => <path key={i} d={`M${-50 + i * 12} ${yy + 6} C -20 ${yy + 9}, 20 ${yy + 6}, ${50 - i * 12} ${yy + 2}`} stroke="#8A6A3A" strokeWidth={1.6} fill="none" />)}
          <path d="M-20 -30 C -12 -40, 4 -40, 10 -30 C 4 -24, -12 -24, -20 -30 Z" fill={C.negro} /><circle cx={-5} cy={-31} r={3.5} fill="#E9DFC6" />
          <path d="M16 -24 C 22 -32, 34 -30, 36 -22" stroke={C.purpura} strokeWidth={4} fill="none" />
          <path d="M-24 -52 C -10 -60, 12 -60, 26 -54 L 22 -60 C 8 -66, -10 -66, -20 -60 Z" fill="#A8844A" stroke={C.negro} strokeWidth={1.6} />
        </g>
      );
    case 'roach': // cresta de pelo de puercoespín y ciervo
      return <g>{Array.from({ length: 11 }, (_, i) => { const a = -150 + i * 11, r = (a * Math.PI) / 180, bx = Math.cos(r) * 26 - 2, by = Math.sin(r) * 26 - 8; return <path key={i} d={`M${f1(bx)} ${f1(by)} l ${f1(Math.cos(r) * 22)} ${f1(Math.sin(r) * 26 - 8)}`} stroke={i % 3 === 1 ? '#2A211B' : C.purpura} strokeWidth={6} strokeLinecap="round" />; })}<PlumaAguila x={-2} y={-34} ang={-20 + mece} l={46} /></g>;
    case 'tocadoPlumas': // tocado de plumas de las naciones de las Llanuras (solo para quienes corresponde)
      return (
        <g>
          {Array.from({ length: 11 }, (_, i) => <PlumaAguila key={i} x={-4 - i * 2.2} y={-22 + i * 1.5} ang={-52 - i * 9 + mece * (i % 2 ? 1 : -1) * 0.5} l={78} />)}
          <path d="M-32 6 C -30 -20, -12 -36, 10 -36 C 22 -34, 30 -24, 30 -16" stroke={C.negro} strokeWidth={4} fill="none" />
          <path d="M-31 2 C -16 -14, 8 -20, 30 -14" stroke={C.blanco} strokeWidth={9} fill="none" />
          {[-24, -12, 0, 12, 22].map((dx, i) => <path key={i} d={`M${dx} ${-8 - i * 2.4} l 4 -4 l 4 4 l -4 4 Z`} fill={i % 2 ? C.purpura : '#2F5D8A'} />)}
          <circle cx={30} cy={-6} r={6} fill={C.purpura} stroke={C.negro} strokeWidth={1.5} />
        </g>
      );
    default: return null;
  }
};
export const TocadoEgipcio: React.FC<{ t: Tocado | undefined; mujer: boolean }> = ({ t, mujer }) => {
  if (!t) return null;
  const blanca = <path d="M-22 -18 C -24 -50, -14 -80, 0 -96 C 14 -80, 22 -50, 20 -18 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2.5} />;
  const roja = <path d="M-30 -14 L -30 -60 L -18 -60 L -16 -34 L 26 -34 L 26 -14 Z" fill={C.purpura} stroke={C.negro} strokeWidth={2.5} />;
  const ureo = <path d="M24 -24 C 30 -40, 40 -36, 36 -28 C 34 -24, 30 -26, 30 -22" stroke={C.oro} strokeWidth={4} fill="none" />;
  switch (t) {
    case 'peluca': return <path d={mujer ? 'M-34 -6 C -40 -44, 26 -50, 28 -20 L 10 -22 L -10 -12 L -20 70 L -44 66 Z' : 'M-34 -4 C -38 -44, 24 -48, 26 -20 L 8 -22 L -12 -12 L -18 30 L -38 28 Z'} fill={C.negro} />;
    case 'blanca': return <g>{blanca}{ureo}</g>;
    case 'roja': return <g>{roja}{ureo}</g>;
    case 'doble': return <g>{roja}<g transform="translate(-2 -10) scale(0.8)">{blanca}</g><path d="M-18 -60 C -24 -76, -10 -84, -4 -76" stroke={C.oro} strokeWidth={3} fill="none" />{ureo}</g>;
    case 'atef': return <g>{blanca}<path d="M-26 -20 C -40 -50, -40 -80, -30 -100 C -24 -80, -22 -50, -18 -20 Z M18 -20 C 26 -50, 30 -80, 22 -100 C 16 -80, 12 -50, 10 -20 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2} /><path d="M-30 -12 L 30 -16" stroke={C.oro} strokeWidth={6} /></g>;
    case 'disco': return <g><circle cx={0} cy={-64} r={30} fill={C.purpura} stroke={C.oro} strokeWidth={5} /><path d="M-24 -40 C -14 -30, 12 -30, 24 -40" stroke={C.oro} strokeWidth={5} fill="none" /><path d="M18 -36 C 30 -54, 40 -48, 32 -40" stroke={C.oro} strokeWidth={4} fill="none" /></g>;
    case 'cuernosDisco': return <g><path d="M-36 -20 C -50 -60, -30 -96, 0 -100 M36 -20 C 50 -60, 30 -96, 0 -100" stroke={C.negro} strokeWidth={6} fill="none" /><circle cx={0} cy={-62} r={26} fill={C.purpura} stroke={C.oro} strokeWidth={4} /></g>;
    case 'trono': return <path d="M-14 -24 L -14 -76 L 2 -76 L 2 -52 L 16 -52 L 16 -24 Z" fill={'#2E5FA8'} stroke={C.oro} strokeWidth={3} />;
    case 'pluma': return <path d="M0 -24 C 10 -50, 18 -80, 10 -110 C 2 -80, -4 -50, -6 -24 Z" fill={C.blanco} stroke={C.negro} strokeWidth={2.5} transform="rotate(-10)" />;
    case 'plumas': return <g><path d="M-10 -24 L -12 -120 L 2 -120 L 0 -24 Z M2 -24 L 4 -120 L 18 -120 L 14 -24 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} /><path d="M-12 -90 H 2 M4 -90 H 18 M-12 -60 H 2 M4 -60 H 18" stroke={C.negro} strokeWidth={2} /></g>;
    case 'nemes': return <g><path d="M-36 -2 C -40 -40, 24 -48, 28 -22 L 26 0 L 14 -4 L 4 40 L -30 46 L -40 20 Z" fill={C.oro} stroke={C.negro} strokeWidth={2} />{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-34 + i * 2} ${-26 + i * 12} L ${20 - i * 3} ${-30 + i * 12}`} stroke={'#2E5FA8'} strokeWidth={4} />)}{ureo}</g>;
    default: return null;
  }
};

const JEROGLIFOS = [
  'M0 22 C -9 17, -9 2, 0 2 C 9 2, 9 17, 0 22 Z M-10 22 H 10 M0 22 V 40', // ankh
  'M-10 20 A 10 10 0 1 0 10 20 A 10 10 0 1 0 -10 20 M-2 20 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0', // sol
  'M-12 12 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4 M-12 22 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4', // agua
  'M-12 20 Q 0 10 12 20 Q 0 28 -12 20 Z M-2 20 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M-4 26 L -8 38 M2 26 Q 8 34 4 38', // ojo
  'M0 38 C -6 20, -2 8, 6 2 C 10 14, 8 26, 0 38 Z', // pluma
  'M-8 38 L -8 14 C -8 4, 8 4, 8 14 L 8 38', // junco
  'M-10 38 L -6 26 L -10 14 C -4 6, 6 6, 10 12 L 4 18 L 8 38 M10 12 L 16 12', // pájaro
];
/** Fila de jeroglíficos decorativos. */
export const Jeroglificos: React.FC<{ x: number; y: number; n: number; color?: string; paso?: number }> = ({ x, y, n, color = C.negro, paso = 34 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => <path key={i} d={JEROGLIFOS[(i * 5 + (i >> 2)) % JEROGLIFOS.length]} transform={`translate(${i * paso} 0)`} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
  </g>
);

/** Banda de bloques de color (borde típico de las tumbas). */
export const Bloques: React.FC<{ y: number; alto: number; desplaz?: number }> = ({ y, alto, desplaz = 0 }) => (
  <g transform={`translate(${-(desplaz % 96)} ${y})`}>
    {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 96} y={0} width={96} height={alto} fill={['#2E5FA8', C.purpura, '#2E8B6E', C.oro][i % 4]} stroke={C.negro} strokeWidth={3} />)}
    {Array.from({ length: 22 }, (_, i) => <rect key={`b${i}`} x={i * 96 + 40} y={0} width={16} height={alto} fill={C.crema} stroke={C.negro} strokeWidth={2} />)}
  </g>
);

/** Guardas egipcias: bloques + jeroglíficos arriba, friso kheker y agua abajo. */
/** Franja de kapa: triángulos, rombos y líneas como los sellos de bambú (ʻohe kāpala). */
export const FranjaKapa: React.FC<{ y: number; alto: number; desplaz: number; tipo: 'triangulos' | 'rombos' | 'zigzag' }> = ({ y, alto, desplaz, tipo }) => {
  const paso = tipo === 'rombos' ? 44 : 32;
  return (
    <g transform={`translate(${-(desplaz % (paso * 2))} ${y})`}>
      {Array.from({ length: Math.ceil(2100 / paso) + 2 }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'triangulos') return <path key={i} d={`M${x0} ${alto} L ${x0 + paso / 2} 0 L ${x0 + paso} ${alto} Z`} fill={i % 2 ? C.negro : C.purpura} />;
        if (tipo === 'rombos') return <g key={i}><path d={`M${x0 + paso / 2} 2 L ${x0 + paso - 4} ${alto / 2} L ${x0 + paso / 2} ${alto - 2} L ${x0 + 4} ${alto / 2} Z`} fill={C.negro} /><circle cx={x0 + paso / 2} cy={alto / 2} r={3} fill={C.crema} /></g>;
        return <path key={i} d={`M${x0} ${alto - 3} L ${x0 + paso / 2} 3 L ${x0 + paso} ${alto - 3}`} stroke={C.barroOscuro} strokeWidth={4} fill="none" />;
      })}
    </g>
  );
};
export const GuardasKapa: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={C.crema} />
    <FranjaKapa y={8} alto={30} desplaz={desplaz} tipo="triangulos" />
    <rect x={0} y={44} width={1920} height={5} fill={C.negro} />
    <FranjaKapa y={56} alto={34} desplaz={desplaz * 0.7} tipo="rombos" />
    <rect x={0} y={96} width={1920} height={4} fill={C.purpura} />
    <FranjaKapa y={104} alto={16} desplaz={desplaz * 1.3} tipo="zigzag" />
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={C.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={C.crema} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={C.negro} />
    <FranjaKapa y={ABAJO + 14} alto={20} desplaz={desplaz} tipo="zigzag" />
    <FranjaKapa y={ABAJO + 42} alto={36} desplaz={desplaz * 0.8} tipo="rombos" />
    <FranjaKapa y={ABAJO + 86} alto={28} desplaz={desplaz * 1.2} tipo="triangulos" />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={C.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={C.negro} />
  </>
);

/** Banda de cuentas y púas (bordado de las Llanuras y los Bosques): escalones, rombos o franjas de púas. */
export const FranjaCuentas: React.FC<{ y: number; alto: number; desplaz: number; tipo: 'escalones' | 'rombos' | 'puas' }> = ({ y, alto, desplaz, tipo }) => {
  const paso = tipo === 'puas' ? 20 : tipo === 'rombos' ? 56 : 72;
  const n = Math.ceil(2200 / paso) + 2;
  const AZUL = '#2F5D8A';
  return (
    <g transform={`translate(${-(desplaz % (paso * 2))} ${y})`}>
      <rect x={0} y={0} width={n * paso} height={alto} fill={tipo === 'puas' ? C.negro : '#F4EEDF'} />
      {Array.from({ length: n }, (_, i) => {
        const x0 = i * paso;
        if (tipo === 'escalones') {
          const c = i % 2 ? AZUL : C.purpura, st = alto / 4, w = paso * 0.8, cx = x0 + paso / 2;
          return <g key={i}>
            <path d={`M${cx - w / 2} ${alto} V ${alto - st} H ${cx - w * 0.32} V ${alto - st * 2} H ${cx - w * 0.16} V ${alto - st * 3} H ${cx + w * 0.16} V ${alto - st * 2} H ${cx + w * 0.32} V ${alto - st} H ${cx + w / 2} V ${alto} Z`} fill={c} stroke={C.negro} strokeWidth={1.5} />
            <rect x={cx - w * 0.08} y={alto - st * 2.6} width={w * 0.16} height={st * 1.2} fill={C.oro} />
          </g>;
        }
        if (tipo === 'rombos') return <g key={i}>
          <path d={`M${x0} ${alto / 2} H ${x0 + paso}`} stroke={C.negro} strokeWidth={2} />
          <path d={`M${x0 + paso / 2} 3 L ${x0 + paso - 8} ${alto / 2} L ${x0 + paso / 2} ${alto - 3} L ${x0 + 8} ${alto / 2} Z`} fill={i % 2 ? C.purpura : AZUL} stroke={C.negro} strokeWidth={1.5} />
          <path d={`M${x0 + paso / 2} ${alto * 0.3} L ${x0 + paso / 2 + 8} ${alto / 2} L ${x0 + paso / 2} ${alto * 0.7} L ${x0 + paso / 2 - 8} ${alto / 2} Z`} fill={i % 2 ? C.oro : C.blanco} />
        </g>;
        return <g key={i}>{[0, 1, 2, 3].map((k) => <rect key={k} x={x0 + 1} y={k * alto / 4 + 1} width={paso - 2} height={alto / 4 - 2} fill={[C.purpura, C.oro, C.blanco, i % 3 ? C.purpura : AZUL][k]} />)}</g>;
      })}
    </g>
  );
};
export const GuardasPintado: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={C.crema} />
    <FranjaCuentas y={8} alto={38} desplaz={desplaz} tipo="escalones" />
    <rect x={0} y={48} width={1920} height={4} fill={C.negro} />
    <FranjaCuentas y={56} alto={20} desplaz={desplaz * 1.3} tipo="puas" />
    <rect x={0} y={78} width={1920} height={4} fill={C.negro} />
    <FranjaCuentas y={84} alto={34} desplaz={desplaz * 0.7} tipo="rombos" />
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={C.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={C.crema} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={C.negro} />
    <FranjaCuentas y={ABAJO + 12} alto={30} desplaz={desplaz * 0.8} tipo="rombos" />
    <FranjaCuentas y={ABAJO + 48} alto={20} desplaz={desplaz * 1.2} tipo="puas" />
    <FranjaCuentas y={ABAJO + 74} alto={40} desplaz={desplaz} tipo="escalones" />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={C.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={C.negro} />
  </>
);

export const GuardasPapiro: React.FC<{ desplaz: number }> = ({ desplaz }) => (
  <>
    <rect x={0} y={0} width={1920} height={ARRIBA} fill={C.barroClaro} />
    <Bloques y={0} alto={22} desplaz={desplaz} />
    <g transform={`translate(${-(desplaz % 238)} 0)`}><Jeroglificos x={24} y={30} n={64} color={C.negro} paso={34} /></g>
    <rect x={0} y={74} width={1920} height={6} fill={C.negro} />
    <g transform={`translate(${-(desplaz % 48)} 80)`}>
      {Array.from({ length: 44 }, (_, i) => <path key={i} d={`M${i * 48 + 8} 40 L ${i * 48 + 8} 12 C ${i * 48 + 8} 0, ${i * 48 + 40} 0, ${i * 48 + 40} 12 L ${i * 48 + 40} 40 Z`} fill={i % 2 ? '#2E8B6E' : C.purpura} stroke={C.negro} strokeWidth={2.5} />)}
    </g>
    <rect x={0} y={ARRIBA - 4} width={1920} height={5} fill={C.negro} />
    <rect x={0} y={ABAJO} width={1920} height={130} fill={C.barroClaro} />
    <rect x={0} y={ABAJO} width={1920} height={6} fill={C.negro} />
    <g transform={`translate(${-(desplaz % 60)} ${ABAJO + 18})`}>
      {[0, 1, 2].map((r) => <path key={r} d={Array.from({ length: 70 }, (_, i) => `${i ? 'L' : 'M'}${i * 30} ${r * 22 + (i % 2 ? 0 : 14)}`).join(' ')} stroke="#2E5FA8" strokeWidth={5} fill="none" />)}
    </g>
    <Bloques y={ABAJO + 92} alto={26} desplaz={desplaz} />
    <rect x={0} y={ABAJO + 120} width={1920} height={6} fill={C.negro} />
    <rect x={0} y={ABAJO + 126} width={1920} height={200} fill={C.negro} />
  </>
);
