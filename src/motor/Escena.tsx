// Anima una escena del guion visual: fondo, elementos, actores con sus pasos, efectos y rótulos.
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, SUELO, Escenario, Capa, Fuego, Chispas, Relampago, Rotulo, Estrellas, azar, TITULO } from '../comun/vasija';
import { ELENCO, DibujarActor, Estado, Ficha, NOMBRE_EN } from './elenco';
import { Fondo, ElementoSVG, CIELO } from './fondos';
import type { Escena as EscenaT, EscenaTL, Actor, Efecto, Idioma } from './tipos';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const suaveT = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
/** Para gestos: pequeña anticipación y un leve pasarse antes de asentarse (más natural que lineal). */
const gestoT = (f: number, a: number, b: number) => interpolate(f, [a, Math.max(a + 1, Math.min(b, a + 20))], [0, 1], { ...cl, easing: Easing.inOut(Easing.back(1.3)) });

/** Frame (relativo a la escena) de un momento expresado en frases. */
export const momento = (tl: EscenaTL, n: number): number => {
  const i = Math.floor(n), fr = n - i, fs = tl.frases;
  if (i < 0) return 0;
  if (i >= fs.length) return tl.durationInFrames;
  return fs[i].from + fr * fs[i].dur;
};

const ESCALA_CAPA = { fondo: 0.7, medio: 0.92, frente: 1.12 } as const;
const P_CAPA = { fondo: 0.45, medio: 0.75, frente: 1 } as const;

/** Calcula el estado de un actor en el frame f aplicando sus pasos en orden. */
export function estadoActor(a: Actor, tl: EscenaTL, f: number, ficha: Ficha): { e: Estado; como: string } {
  const capa = a.capa ?? 'frente';
  const pasos = [...(a.pasos ?? [])].sort((p, q) => p.en - q.en);
  // Oculto al principio si su primera entrada/salida es una entrada (aunque antes haya otros pasos).
  const primero = pasos.find((p) => ['aparece', 'entra', 'desaparece', 'sale'].includes(p.hace))?.hace;
  const oculto = a.visible === false || primero === 'aparece' || primero === 'entra';
  const volador = ficha.tipo === 'ave' || ficha.tipo === 'ojo';
  const e: Estado = {
    x: a.x, y: a.y ?? (volador ? 360 : SUELO), s: (a.escala ?? 1) * ESCALA_CAPA[capa], voltear: a.mira === 'izq',
    opacity: oculto ? 0 : 1, accion: 'parado', volando: volador, boca: false, rot: 0, brillo: 0, objeto: undefined, temblor: 0,
  };
  let como = a.como ?? a.id;
  pasos.forEach((p, idx) => {
    const t0 = momento(tl, p.en);
    if (f < t0) return;
    const sig = pasos[idx + 1] ? momento(tl, pasos[idx + 1].en) : tl.durationInFrames;
    const t1 = p.dur !== undefined ? momento(tl, p.en + p.dur) : Math.min(sig, t0 + Math.max(24, momento(tl, Math.floor(p.en) + 1) - t0));
    const k = suaveT(f, t0, t1), mov = f < t1;
    const dirA = (destino: number) => (destino < e.x ? true : destino > e.x ? false : e.voltear);
    switch (p.hace) {
      case 'aparece': e.opacity = interpolate(f, [t0, t0 + (p.con ? 8 : 14)], [0, 1], cl); if (p.con) e.aparicion = { con: p.con, t0, sale: false }; break;
      case 'desaparece': e.opacity *= 1 - interpolate(f, [t0 + (p.con ? 6 : 0), t0 + 14], [0, 1], cl); if (p.con) e.aparicion = { con: p.con, t0, sale: true }; break;
      // Caras: solo un momento (≈1,5 s o lo que diga dur) y vuelve a la cara de siempre.
      case 'enoja': case 'entristece': case 'sorprende': case 'alegra': {
        const fin = p.dur !== undefined ? momento(tl, p.en + p.dur) : t0 + 36;
        if (f <= fin) e.expresion = ({ enoja: 'enojo', entristece: 'tristeza', sorprende: 'sorpresa', alegra: 'alegria' } as const)[p.hace];
        else if (e.expresion !== undefined) e.expresion = undefined;
        if (p.hace === 'sorprende') e.inclinar = (e.inclinar ?? 0) - 5 * (1 - suaveT(f, t0 + 6, t0 + 30));
        break;
      }
      case 'neutral': e.expresion = 'neutral'; break;
      case 'asiente': { const d = f - t0; if (d < 36) e.cabeza = (e.cabeza ?? 0) - Math.sin(d / 3) * 9 * (1 - d / 36); break; }
      case 'niega': { const d = f - t0; if (d < 36) e.cabezaGiro = Math.abs(Math.sin(d / 3.2)) * (1 - d / 36); break; }
      case 'mira': if (typeof p.a === 'number') e.voltear = p.a < e.x; break;
      case 'salta': {
        const d = f - t0; // agacharse, saltar, caer
        if (d < 8) e.y += 10 * Math.sin((d / 8) * Math.PI / 2);
        else if (d < 30) e.y -= 110 * e.s * Math.sin(((d - 8) / 22) * Math.PI);
        else if (d < 38) e.y += 8 * Math.sin(((d - 30) / 8) * Math.PI);
        break;
      }
      case 'entra': {
        const destino = typeof p.a === 'number' ? p.a : e.x;
        const desde = destino + (e.voltear ? 900 : -900);
        e.opacity = 1; e.voltear = destino < desde;
        e.x = desde + (destino - desde) * k; if (mov) e.accion = 'caminar';
        break;
      }
      case 'sale': {
        const destino = e.x + (e.voltear ? -1000 : 1000);
        e.x = e.x + (destino - e.x) * k; if (mov) e.accion = 'caminar';
        e.opacity *= 1 - interpolate(f, [t1 - 10, t1], [0, 1], cl);
        break;
      }
      case 'camina': case 'corre': case 'nada': {
        const destino = typeof p.a === 'number' ? p.a : e.x;
        e.voltear = dirA(destino);
        e.x = e.x + (destino - e.x) * k;
        if (mov && p.hace !== 'nada') e.accion = p.hace === 'corre' ? 'correr' : 'caminar';
        break;
      }
      case 'vuela': {
        const [dx, dy] = Array.isArray(p.a) ? p.a : [typeof p.a === 'number' ? p.a : e.x, e.y];
        e.voltear = dirA(dx); e.volando = true;
        e.x = e.x + (dx - e.x) * k; e.y = e.y + (dy - e.y) * k;
        break;
      }
      case 'levanta': { const g = gestoT(f, t0, t1); e.brazo = [30 + 135 * g, 30 - 25 * g]; break; }
      case 'baja': e.brazo = undefined; e.brazoAtras = undefined; break;
      case 'senala': { const g = gestoT(f, t0, t1); e.brazo = [30 + 62 * g, 30 - 30 * g]; break; }
      case 'ofrece': { const g = gestoT(f, t0, t1); e.brazo = [30 + 40 * g, 30 - 5 * g]; break; }
      case 'abraza': e.brazo = [80, 95]; e.brazoAtras = [80, 95]; break;
      case 'reza': e.brazo = [130, 30]; e.brazoAtras = [130, 30]; break;
      case 'lamenta': e.brazo = [150, 125]; e.brazoAtras = [150, 125]; break;
      // Golpe y lanzamiento con anticipación: se echa para atrás, descarga hacia adelante y se acomoda.
      case 'golpea': {
        const ks = [t0, t0 + 9, t0 + 13, t0 + 24];
        e.brazo = [interpolate(f, ks, [30, 178, 40, 62], cl), interpolate(f, ks, [30, 20, 0, 10], cl)];
        e.inclinar = (e.inclinar ?? 0) + interpolate(f, ks, [0, -9, 11, 0], cl);
        break;
      }
      case 'lanza': {
        const ks = [t0, t0 + 10, t0 + 14, t0 + 26];
        e.brazo = [interpolate(f, ks, [30, 185, 55, 60], cl), interpolate(f, ks, [30, 30, 0, 5], cl)];
        e.inclinar = (e.inclinar ?? 0) + interpolate(f, ks, [0, -11, 12, 2], cl);
        if (f > t0 + 12) e.objeto = null;
        break;
      }
      case 'cae': e.rot = (e.voltear ? 1 : -1) * 82 * suaveT(f, t0, t0 + 16); break;
      case 'arrodilla': if (ficha.tipo === 'persona') e.arrodillado = suaveT(f, t0, t0 + 14); else e.y += 70 * e.s * suaveT(f, t0, t0 + 12); break;
      case 'sienta': e.sentado = suaveT(f, t0, t0 + 14); break;
      case 'levantarse': { const q = 1 - suaveT(f, t0, t0 + 14); e.rot = e.rot * q; e.arrodillado = (e.arrodillado ?? 0) * q; e.sentado = (e.sentado ?? 0) * q; e.y = (a.y ?? SUELO); break; }
      case 'tiembla': e.temblor = mov ? 1 : 0; break;
      case 'habla': e.boca = mov ? Math.floor(f / 5) % 2 === 0 : false; e.hablando = mov; break;
      case 'calla': e.boca = false; break;
      case 'gira': e.voltear = !e.voltear; break;
      case 'crece': case 'encoge': e.s = e.s + ((p.escala ?? (p.hace === 'crece' ? 1.6 : 0.5)) * ESCALA_CAPA[capa] - e.s) * k; break;
      case 'toma': e.objeto = p.objeto ?? null; break;
      case 'suelta': e.objeto = null; break;
      case 'brilla': e.brillo = interpolate(f, [t0, t0 + 12, Math.max(t1, t0 + 12.5), Math.max(t1, t0 + 12.5) + 12], [0, 0.9, 0.9, 0], cl); break; // brillo corto (Shorts): nunca se cruza
      case 'transforma': {
        if (f > t0 + 8 && p.en_que) como = p.en_que;
        e.brillo = Math.max(e.brillo, interpolate(f, [t0, t0 + 8, t0 + 24], [0, 1, 0], cl));
        break;
      }
    }
  });
  if (e.volando && ficha.tipo === 'persona') e.y += Math.sin(f / 10) * 6;
  // Gestos al hablar: si no hay otro gesto, las manos acompañan lo que dice.
  if (e.hablando && ficha.tipo === 'persona' && !e.brazo) {
    const g = (k: number) => Math.sin(f / 7 + k) * 0.6 + Math.sin(f / 4.3 + k * 2) * 0.4;
    e.brazo = [42 + 22 * g(a.x * 0.01), 48 + 30 * g(a.x * 0.01 + 1.3)];
  }
  return { e, como };
}

/** Efecto al aparecer o desaparecer un actor: humo, luz, polvo, fuego, agua o sombra. */
const Aparicion: React.FC<{ con: string; t0: number; sale: boolean; f: number; x: number; y: number; s: number }> = ({ con, t0, f, x, y, s }) => {
  const d = f - t0;
  if (d < 0 || d > 30) return null;
  const k = d / 30, o = 1 - k, cy = y - 170 * s;
  switch (con) {
    case 'luz':
      return (
        <g opacity={o}>
          <circle cx={x} cy={cy} r={(120 + 160 * k) * s} fill="url(#haloBlanco)" />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${x} ${cy} l ${Math.cos(i * 0.52) * 260 * s * (0.4 + k)} ${Math.sin(i * 0.52) * 260 * s * (0.4 + k)}`} stroke="#FFF6DD" strokeWidth={6 * s} opacity={0.7} strokeLinecap="round" />)}
        </g>
      );
    case 'humo': case 'sombra':
      return <g opacity={o * 0.85}>{Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = (30 + 90 * k) * s; return <circle key={i} cx={x + Math.cos(a) * r} cy={cy + 40 * s + Math.sin(a) * r * 0.9 - 40 * k * s} r={(40 + 50 * k) * s} fill={con === 'sombra' ? '#120A14' : '#6E6258'} opacity={0.6} />; })}</g>;
    case 'polvo':
      return <g opacity={o * 0.8}>{[-1, 1].map((sg) => [0, 1, 2].map((i) => <ellipse key={`${sg}${i}`} cx={x + sg * (30 + 120 * k + i * 30) * s} cy={y - (10 + i * 12) * s} rx={(30 + 30 * k) * s} ry={(14 + 10 * k) * s} fill={C.barroClaro} />))}</g>;
    case 'fuego':
      return <g opacity={o}><g transform={`translate(${x} ${y})`}><Fuego f={f} s={(1.2 + k) * s} /></g><Chispas x={x} y={y - 60} f={f} /></g>;
    case 'agua':
      return <g opacity={o}>{Array.from({ length: 14 }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * (i / 13)), v = 200 * s; return <circle key={i} cx={x + Math.cos(a) * v * k * (i % 2 ? 1 : -1)} cy={y - Math.sin(a) * v * 1.4 * k + 300 * k * k * s} r={7 * s} fill="#9FD3E6" />; })}</g>;
    default: return null;
  }
};

export const Efectos: React.FC<{ ef: Efecto[]; tl: EscenaTL; f: number; fase: 'fondo' | 'frente'; vert?: boolean }> = ({ ef, tl, f, fase, vert }) => (
  <>
    {ef.map((x, i) => {
      const t0 = momento(tl, x.en), t1 = x.dur !== undefined ? momento(tl, x.en + x.dur) : tl.durationInFrames;
      if (f < t0) return null;
      const vivo = f <= t1, k = interpolate(f, [t0, t0 + 15], [0, 1], cl) * (vivo ? 1 : 1 - interpolate(f, [t1, t1 + 15], [0, 1], cl));
      const cx = x.x ?? 960, cy = x.y ?? SUELO, n = x.intensidad ?? 1;
      if (fase === 'fondo') {
        if (x.tipo === 'estrellas') return <g key={i} opacity={k}><Estrellas f={f} n={40} /></g>;
        return null;
      }
      switch (x.tipo) {
        case 'rayo': return <g key={i}>{[0, 1, 2].map((j) => <Relampago key={j} a={[cx + (j - 1) * 30, 130]} b={[cx + (j - 1) * 60, cy]} f={f} desde={t0 + j * 9} />)}</g>;
        case 'fuego': return <g key={i} transform={`translate(${cx} ${cy})`} opacity={k}><Fuego f={f} s={n} /></g>;
        case 'fogata': return <g key={i} transform={`translate(${cx} ${cy})`} opacity={k}><path d="M-50 0 L 40 -20 M-40 -20 L 50 0" stroke={C.negro} strokeWidth={14} strokeLinecap="round" /><g transform="translate(0 -14)"><Fuego f={f} s={0.8 * n} /></g></g>;
        case 'chispas': return <g key={i} opacity={k}><Chispas x={cx} y={cy} f={f} /></g>;
        case 'humo': return <g key={i} opacity={k * 0.7}>{Array.from({ length: 8 }, (_, j) => { const ed = (f + j * 15) % 120; return <circle key={j} cx={cx + Math.sin(ed / 20 + j) * 30} cy={cy - ed * 3} r={20 + ed * 0.6} fill="#3A2A22" opacity={1 - ed / 120} />; })}</g>;
        case 'polvo': return <g key={i} opacity={k * 0.5}>{Array.from({ length: 6 }, (_, j) => <ellipse key={j} cx={cx + (j - 3) * 70 + Math.sin(f / 10 + j) * 20} cy={cy - 20} rx={90} ry={30} fill={C.barroClaro} />)}</g>;
        case 'luz': return <circle key={i} cx={cx} cy={x.y ?? 400} r={300 * n} fill="url(#haloBlanco)" opacity={k} />;
        case 'niebla': return <g key={i} opacity={k * 0.5}>{Array.from({ length: 6 }, (_, j) => <ellipse key={j} cx={((j * 400 + f * 1.2) % 2400) - 240} cy={SUELO - 60 - (j % 3) * 50} rx={320} ry={50} fill={C.crema} />)}</g>;
        case 'lluvia': return vert
          ? <g key={i} opacity={k * 0.7}>{Array.from({ length: 170 }, (_, j) => { const xx = azar(j) * 2200 - 140, yy = ((azar(j + 50) * 1900 + f * 26) % 1800) - 1000; return <path key={j} d={`M${xx} ${yy} l -10 34`} stroke={C.crema} strokeWidth={2} />; })}</g>
          : <g key={i} opacity={k * 0.7}>{Array.from({ length: 90 }, (_, j) => { const xx = azar(j) * 2200 - 140, yy = ((azar(j + 50) * 900 + f * 26) % 820) + 100; return <path key={j} d={`M${xx} ${yy} l -10 34`} stroke={C.crema} strokeWidth={2} />; })}</g>;
        case 'nieve': return vert
          ? <g key={i} opacity={k}>{Array.from({ length: 130 }, (_, j) => { const xx = azar(j) * 2000 + Math.sin(f / 20 + j) * 20, yy = ((azar(j + 50) * 1900 + f * 3) % 1800) - 1000; return <circle key={j} cx={xx} cy={yy} r={3} fill={C.blanco} />; })}</g>
          : <g key={i} opacity={k}>{Array.from({ length: 70 }, (_, j) => { const xx = azar(j) * 2000 + Math.sin(f / 20 + j) * 20, yy = ((azar(j + 50) * 900 + f * 3) % 760) + 120; return <circle key={j} cx={xx} cy={yy} r={3} fill={C.blanco} />; })}</g>;
        case 'oscurecer': return <rect key={i} x={-2000} y={vert ? -3000 : -500} width={6000} height={vert ? 6000 : 2000} fill={C.noche} opacity={k * 0.55 * n} />;
        case 'aclarar': return <rect key={i} x={-2000} y={vert ? -3000 : -500} width={6000} height={vert ? 6000 : 2000} fill="#FFF3D6" opacity={(1 - interpolate(f, [t0, t0 + 15], [0, 1], cl)) * 0.5} />;
        case 'destello': return <rect key={i} x={-2000} y={vert ? -3000 : -500} width={6000} height={vert ? 6000 : 2000} fill="#FFF6E0" opacity={interpolate(f, [t0, t0 + 4, t0 + 20], [0, 0.9, 0], cl)} />;
        case 'olas-suben': case 'olas-bajan': {
          const nivel = x.tipo === 'olas-suben' ? interpolate(f, [t0, t1], [0, 1], cl) : 1 - interpolate(f, [t0, t1], [0, 1], cl);
          const y0 = SUELO - nivel * 560 * n;
          let d = `M-2000 ${y0}`;
          for (let xx = -2000; xx <= 5000; xx += 60) d += ` L${xx} ${y0 + Math.sin(xx / 70 + f / 8) * 12}`;
          return <path key={i} d={`${d} L5000 1200 L-2000 1200 Z`} fill={x.color === 'rojo' ? '#9E2A1E' : x.color ?? C.mar} opacity={0.85} />;
        }
        case 'sangre': return <g key={i} opacity={k}>{Array.from({ length: 8 }, (_, j) => <circle key={j} cx={cx + (azar(j) - 0.5) * 60} cy={cy + ((f - t0) * 2 + j * 8) % 80} r={4} fill={C.purpura} />)}</g>;
        default: return null;
      }
    })}
  </>
);

/** Cartel "THAT'S WHY…": placa fija arriba al centro, con marco del tema. */
const Placa: React.FC<{ texto: string; o: number }> = ({ texto, o }) => {
  const w = Math.min(1500, 120 + texto.length * 24);
  return (
    <g opacity={o} transform={`translate(960 ${210 - (1 - o) * 12})`}>
      <rect x={-w / 2} y={-38} width={w} height={76} rx={6} fill={C.negro} stroke={C.purpura} strokeWidth={5} />
      <rect x={-w / 2 + 8} y={-30} width={w - 16} height={60} rx={3} fill="none" stroke={C.crema} strokeWidth={1.5} strokeDasharray="2 6" />
      <text x={0} y={12} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={34} letterSpacing={3} fill={C.crema}>{texto}</text>
    </g>
  );
};

/**
 * Puesta vertical nativa (VideoVertical): en lugar de la cámara del horizontal, cada plano reubica las cosas.
 * x: mundo → x virtual del cuadro vertical; ver: qué actores están en el plano; elementoX: x virtual de cada
 * elemento (los que quedaron afuera entran por el costado); rotuloX: nombre entero dentro del cuadro.
 * Con puesta no se dibuja el fondo (va en otra capa) ni los carteles de escena (van en pantalla, arriba).
 */
export type PuestaVertical = {
  x: (x: number) => number;
  ver: (id: string) => boolean;
  elementoX: (i: number, x: number) => number;
  rotuloX: (vx: number, ancho: number) => number;
};

/** Escena animada a partir del guion visual. */
export const EscenaMotor: React.FC<{ esc: EscenaT; tl: EscenaTL; idioma?: Idioma }> = ({ esc, tl, idioma = 'en' }) => {
  const dur = tl.durationInFrames;
  const cam = esc.camara ?? {};
  const z = cam.zoom ?? [1, 1.05];
  return (
    <Escenario dur={dur} cielo={CIELO[esc.fondo] ?? 'barro'} camara={[[0, cam.de ?? 0, z[0]], [dur, cam.a ?? cam.de ?? 0, z[1]]]}>
      <ContenidoEscena esc={esc} tl={tl} idioma={idioma} />
    </Escenario>
  );
};

/** Todo lo que va dentro del Escenario: fondo, elementos, actores, efectos y carteles. */
export const ContenidoEscena: React.FC<{ esc: EscenaT; tl: EscenaTL; idioma?: Idioma; puesta?: PuestaVertical }> = ({ esc, tl, idioma = 'en', puesta }) => {
  const f = useCurrentFrame();
  const dur = tl.durationInFrames;
  const temblores = (esc.efectos ?? []).filter((x) => x.tipo === 'temblor');
  const shake = temblores.reduce((acc, x) => {
    const t0 = momento(tl, x.en), t1 = x.dur !== undefined ? momento(tl, x.en + x.dur) : t0 + 45;
    return acc + (f >= t0 && f <= t1 ? (x.intensidad ?? 1) * 8 : 0);
  }, 0);
  const capas = (['fondo', 'medio', 'frente'] as const);
  const estados: Record<string, { e: Estado; como: string; ficha: Ficha }> = {};
  for (const a of esc.actores ?? []) {
    const fichaBase = ELENCO[a.como ?? a.id] ?? ELENCO.hombre;
    const { e, como } = estadoActor(a, tl, f, fichaBase);
    estados[a.id] = { e, como, ficha: ELENCO[como] ?? fichaBase };
  }
  const efectos = puesta ? (esc.efectos ?? []).map((x) => (x.x !== undefined ? { ...x, x: puesta.x(x.x) } : x)) : esc.efectos ?? [];
  return (
      <g transform={shake ? `translate(${Math.sin(f * 2.1) * shake} ${Math.cos(f * 1.7) * shake * 0.6})` : undefined}>
        {!puesta && <Efectos ef={esc.efectos ?? []} tl={tl} f={f} fase="fondo" />}
        {!puesta && <Fondo tipo={esc.fondo} f={f} astros={!esc.sinAstros} />}
        {capas.map((capa) => (
          <Capa key={capa} p={P_CAPA[capa]}>
            <g opacity={capa === 'fondo' ? 0.75 : 1}>
              {(esc.elementos ?? []).filter((el) => (el.capa ?? 'frente') === capa).map((el, i) => {
                const t0 = el.en !== undefined ? momento(tl, el.en) : 0;
                const o = (el.en !== undefined ? interpolate(f, [t0, t0 + 15], [0, 1], cl) : 1) * (el.hasta !== undefined ? 1 - interpolate(f, [momento(tl, el.hasta), momento(tl, el.hasta) + 15], [0, 1], cl) : 1);
                const dy = el.sube ? el.sube * (1 - interpolate(f, [t0, Math.max(t0 + 1, momento(tl, (el.en ?? 0) + (el.durSube ?? 1)))], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) })) : 0;
                const yOff = capa === 'fondo' ? -50 : capa === 'medio' ? -20 : 0;
                return <g key={i} opacity={o}><ElementoSVG tipo={el.tipo} x={puesta ? puesta.elementoX((esc.elementos ?? []).indexOf(el), el.x) : el.x} y={(el.y !== undefined ? el.y : SUELO + yOff) + dy} s={(el.s ?? 1) * ESCALA_CAPA[capa]} f={f} props={el.props} /></g>;
              })}
              {(esc.actores ?? []).filter((a) => (a.capa ?? 'frente') === capa && (!puesta || puesta.ver(a.id))).map((a) => {
                const { e, como, ficha } = estados[a.id];
                // Escucha: si otro habla, inclina la cabeza hacia él y asiente apenas (sin girarse solo).
                const habla = Object.entries(estados).find(([id, o]) => id !== a.id && o.e.hablando && o.e.opacity > 0.5);
                if (habla && ficha.tipo === 'persona' && !e.hablando && e.opacity > 0.5) {
                  const delante = (habla[1].e.x > e.x) !== e.voltear;
                  e.cabeza = (e.cabeza ?? 0) + (delante ? 3 : -2) + Math.sin(f / 13 + e.x) * 1.5;
                }
                if (capa !== 'frente' && a.y === undefined && ficha.tipo !== 'ave') e.y += capa === 'fondo' ? -50 : -20;
                const griego = a.rotulo ?? (idioma === 'en' ? NOMBRE_EN[como] ?? NOMBRE_EN[a.como ?? a.id] : undefined) ?? ficha.griego;
                const tVis = (a.pasos ?? []).find((p) => p.hace === 'aparece' || p.hace === 'entra');
                const desde = tVis ? momento(tl, tVis.en) + 10 : 6;
                const oR = griego ? interpolate(f, [desde, desde + 12, desde + 100, desde + 115], [0, 1, 1, 0], cl) * e.opacity : 0;
                // Alto real del personaje: coronas altas, orejas de animal, gigantes y escala propia de la ficha.
                const pp = ficha.tipo === 'persona' ? { ...ficha.p, ...(a.props ?? {}) } as Record<string, unknown> : {};
                const CORONA_ALTA: Record<string, number> = { doble: 110, blanca: 110, atef: 120, trono: 90, plumas: 130, cuernosDisco: 110, disco: 90, pluma: 100, corona: 60, yelmoAlas: 70, casco: 70, roja: 80, gustoweh: 90, tocadoPlumas: 90, roach: 50, plumaAtras: 40, sombreroCesteria: 30 };
                const extra = Math.max(CORONA_ALTA[pp.tocado as string] ?? 0, ['chacal', 'set'].includes(pp.cabezaAnimal as string) ? 50 : 0);
                const alto = ficha.tipo === 'persona' ? (400 + extra) * (pp.gigante ? 1.2 : 1) * ((pp.s as number) ?? 1) : ficha.tipo === 'cuadrupedo' ? 260 : 200;
                const ev = puesta ? { ...e, x: puesta.x(e.x) } : e;
                return (
                  <g key={a.id}>
                    <DibujarActor ficha={ficha} e={ev} props={a.props} f={f} />
                    {ev.aparicion && <Aparicion {...ev.aparicion} f={f} x={ev.x} y={ev.y} s={ev.s} />}
                    {oR > 0 && <Rotulo x={puesta ? puesta.rotuloX(ev.x, griego!.length * 30 + 20) : ev.x} y={Math.max(160, ev.y - alto * ev.s)} texto={griego!} o={oR} tam={30} />}
                  </g>
                );
              })}
            </g>
          </Capa>
        ))}
        <Capa p={1}>
          <Efectos ef={efectos} tl={tl} f={f} fase="frente" vert={!!puesta} />
          {!puesta && (esc.rotulos ?? []).map((r, i) => {
            const t0 = momento(tl, r.en), t1 = r.hasta !== undefined ? momento(tl, r.hasta) : dur;
            const fd = Math.max(1, Math.min(12, (t1 - t0) / 2 - 0.5)); // rótulos cortos (Shorts): el fundido se achica, nunca se cruza
            const o = t1 - t0 < 3 ? 0 : interpolate(f, [t0, t0 + fd, t1 - fd, t1], [0, 1, 1, 0], cl);
            const txt = typeof r.texto === 'string' ? r.texto : r.texto[idioma] ?? r.texto.es;
            if (r.estilo === 'porque') return null;
            return o > 0 ? <Rotulo key={i} x={r.x} y={r.y} texto={txt.toUpperCase()} o={o} tam={38} /> : null;
          })}
        </Capa>
        <Capa p={0}>
          {!puesta && (esc.rotulos ?? []).filter((r) => r.estilo === 'porque').map((r, i) => {
            const t0 = momento(tl, r.en), t1 = r.hasta !== undefined ? momento(tl, r.hasta) : Math.min(dur, t0 + 110);
            const fd = Math.max(1, Math.min(10, (t1 - t0) / 2 - 0.5));
            const o = t1 - t0 < 3 ? 0 : interpolate(f, [t0, t0 + fd, t1 - fd, t1], [0, 1, 1, 0], cl);
            const txt = (typeof r.texto === 'string' ? r.texto : r.texto[idioma] ?? r.texto.es).toUpperCase();
            return o > 0 ? <Placa key={i} texto={txt} o={o} /> : null;
          })}
        </Capa>
      </g>
  );
};
