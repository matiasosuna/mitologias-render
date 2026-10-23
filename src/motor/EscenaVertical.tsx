// Escena montada PARA vertical (9:16), no un recorte ni un zoom del horizontal: un encuadre fijo por escena con
// todos los actores juntos dentro del cuadro (reubicados y a una escala pareja), fondo recompuesto para el formato
// alto y carteles en pantalla. La lógica del encuadre está en puestaVertical.ts.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { rangoFundido } from '../../lib/fundido.mjs';
import { C, SUELO, TITULO, Escenario, Sol, Luna, Nube, Estrellas, TEMA, azar } from '../comun/vasija';
import { ContenidoEscena, Efectos, momento, pistasDeEscena, pistasAjustadas, type PuestaVertical } from './Escena';
export { pistasDeEscena } from './Escena';
import { ELENCO } from './elenco';
import { Fondo, CIELO } from './fondos';
import { KB, SUELO_V, ANCHO, medioElemento, encuadreEscena, mapear, ubicarElemento, limitarRotulo, fondoX, partirLineas, type Pista, type Encuadre, type Medida, type Capa } from './puestaVertical';
import type { Escena as EscenaT, EscenaTL } from './tipos';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const cache = new WeakMap<EscenaT, { tl: EscenaTL; enc: Encuadre }>();
/** Encuadre fijo de la escena (se calcula una vez por escena). */
export function encuadreDeEscena(esc: EscenaT, tl: EscenaTL): Encuadre {
  const c = cache.get(esc);
  if (c && c.tl.durationInFrames === tl.durationInFrames && c.tl.from === tl.from) return c.enc;
  const cam = esc.camara ?? {}, de = cam.de ?? 0, a = cam.a ?? de;
  const enc = encuadreEscena(pistasAjustadas(esc, tl), [Math.min(de, a) - 120, Math.max(de, a) + 1920 + 120]);
  cache.set(esc, { tl, enc });
  return enc;
}

// Lugares sin cielo abierto: no llevan sol, luna ni nubes agregadas.
const INTERIOR = new Set(['abismo', 'aguas_luz', 'salon', 'palacio', 'templo', 'cueva', 'fragua', 'sala_juicio', 'bajo_agua', 'fondo_marino', 'caos', 'nun', 'duat', 'po', 'ginnungagap', 'hel', 'inframundo', 'cielo', 'cielo_nut', 'whare_dentro', 'te_po', 'rarohenga']);

/**
 * Cielo del formato alto (en coordenadas de pantalla): degradé de arriba al horizonte y los elementos propios
 * del tema (sol y nubes de día, luna y estrellas de noche, brasas en el inframundo) donde el horizontal no tenía nada.
 */
const CieloVertical: React.FC<{ esc: EscenaT; f: number; bx: number }> = ({ esc, f, bx }) => {
  const tipo = CIELO[esc.fondo] ?? 'barro', col = TEMA.cielos[tipo];
  const semilla = esc.id.split('').reduce((t, ch) => t + ch.charCodeAt(0), 0);
  const abierto = !INTERIOR.has(esc.fondo);
  const lado = semilla % 2 ? 1 : -1; // el astro a la derecha o a la izquierda según la escena
  const deriva = -bx * 0.04 * KB;
  return (
    <g transform={`translate(960 ${SUELO}) scale(${1 / KB}) translate(${-ANCHO / 2} ${-SUELO_V})`}>
      <defs>
        <linearGradient id="cieloV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col[2]} />
          <stop offset="45%" stopColor={col[1]} />
          <stop offset="100%" stopColor={col[0]} />
        </linearGradient>
      </defs>
      <rect x={-40} y={-40} width={ANCHO + 80} height={2000} fill="url(#cieloV)" />
      {abierto && tipo === 'noche' && <>
        <Estrellas f={f} n={55} area={[0, 230, ANCHO, 560]} seed={semilla % 7} />
        {!esc.sinAstros && <Luna x={540 + lado * 250 + deriva} y={540} r={52} />}
      </>}
      {abierto && (tipo === 'barro' || tipo === 'mar') && <>
        {!esc.sinAstros && <Sol x={540 + lado * 255 + deriva} y={530} r={56} f={f} />}
        {[0, 1, 2].map((i) => {
          const y = 420 + i * 140 + azar(semilla + i) * 40;
          const x = ((azar(semilla * 3 + i) * 1300 + f * (0.25 + i * 0.08) + deriva * (1 + i * 0.4)) % 1500) - 210;
          return <g key={i} opacity={0.92 - i * 0.12}><Nube x={x} y={y} s={0.75 - i * 0.12} f={f + i * 40} /></g>;
        })}
      </>}
      {tipo === 'inframundo' && Array.from({ length: 26 }, (_, i) => {
        const x = azar(i + semilla) * ANCHO, v = 0.6 + azar(i * 5) * 1.2, y = 1250 - ((f * v + azar(i * 9) * 1000) % 1000);
        return <circle key={i} cx={x + Math.sin(f / 20 + i) * 14} cy={y} r={3 + azar(i * 3) * 4} fill="#FF9A3C" opacity={0.25 + 0.2 * Math.sin(f / 9 + i)} />;
      })}
    </g>
  );
};

/** Carteles de la escena en pantalla (arriba, debajo de la cabecera), en renglones para que entren enteros. */
const CartelesPantalla: React.FC<{ esc: EscenaT; tl: EscenaTL; f: number }> = ({ esc, tl, f }) => {
  const dur = tl.durationInFrames;
  const vivos = (esc.rotulos ?? []).map((r) => {
    const t0 = momento(tl, r.en);
    const porque = r.estilo === 'porque';
    const t1 = r.hasta !== undefined ? momento(tl, r.hasta) : porque ? Math.min(dur, t0 + 110) : dur;
    const e = porque ? 10 : 12;
    const rango = rangoFundido(t0, t1, e); // nunca se cruza (rótulo más allá del final de la escena → no va)
    const o = rango ? interpolate(f, rango, [0, 1, 1, 0], cl) : 0;
    const txt = (typeof r.texto === 'string' ? r.texto : r.texto.en ?? r.texto.es).toUpperCase();
    return { porque, o, lineas: partirLineas(txt, porque ? 26 : 22) };
  }).filter((r) => r.o > 0).sort((a, b) => Number(b.porque) - Number(a.porque));
  if (!vivos.length) return null;
  let y = 262;
  return (
    <svg width={ANCHO} height={1920} viewBox={`0 0 ${ANCHO} 1920`} style={{ position: 'absolute', inset: 0 }}>
      {vivos.map((r, i) => {
        if (r.porque) {
          const alto = 30 + r.lineas.length * 48, w = Math.min(1000, 90 + Math.max(...r.lineas.map((l) => l.length)) * 27), y0 = y;
          y += alto + 22;
          return (
            <g key={i} opacity={r.o} transform={`translate(${ANCHO / 2} ${y0 - (1 - r.o) * 12})`}>
              <rect x={-w / 2} y={0} width={w} height={alto} rx={8} fill={C.negro} stroke={C.purpura} strokeWidth={5} />
              <rect x={-w / 2 + 9} y={9} width={w - 18} height={alto - 18} rx={4} fill="none" stroke={C.crema} strokeWidth={1.5} strokeDasharray="2 6" />
              {r.lineas.map((l, k) => <text key={k} x={0} y={52 + k * 48} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={38} letterSpacing={3} fill={C.crema}>{l}</text>)}
            </g>
          );
        }
        const y0 = y; y += r.lineas.length * 56 + 18;
        return (
          <g key={i} opacity={r.o}>
            {r.lineas.map((l, k) => <text key={k} x={ANCHO / 2} y={y0 + 46 + k * 56 + (1 - r.o) * 10} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={46} letterSpacing={4} fill={C.crema} stroke={C.negro} strokeWidth={8} style={{ paintOrder: 'stroke' }}>{l}</text>)}
          </g>
        );
      })}
    </svg>
  );
};

/** Escena del episodio montada para vertical: fondo, escenario con todo el grupo (encuadre fijo) y carteles. */
export const EscenaVerticalNativa: React.FC<{ esc: EscenaT; tl: EscenaTL }> = ({ esc, tl }) => {
  const f = useCurrentFrame();
  const dur = tl.durationInFrames;
  const enc = encuadreDeEscena(esc, tl);
  const { K, c, ids, cajas } = enc;
  const bx = fondoX(c);
  const cielo = CIELO[esc.fondo] ?? 'barro';
  const capaEsc = { fondo: 0.7, medio: 0.92, frente: 1.12 } as const;
  const puesta: PuestaVertical = {
    x: (x) => mapear(enc, x),
    ver: (id) => ids.includes(id),
    // elementos con la misma compresión; los que quedarían afuera entran por el costado sin tapar a nadie
    elementoX: (i, x) => {
      const el = (esc.elementos ?? [])[i];
      return ubicarElemento(mapear(enc, x), medioElemento(el?.tipo ?? '', (el?.s ?? 1) * capaEsc[el?.capa ?? 'frente']), K, cajas);
    },
    rotuloX: (vx, ancho) => limitarRotulo(vx, ancho, K),
  };
  const vista = (k: number): [number, number, number, number] => [960 - ANCHO / 2 / k, SUELO - SUELO_V / k, ANCHO / k, 1920 / k];
  return (
    <AbsoluteFill>
      {/* fondo: escala fija y quieto toda la escena */}
      <Escenario dur={dur} entra={!esc.sinEntrada} cielo={cielo} camara={[[0, bx, 1]]} vista={vista(KB)} guardas={false}>
        <CieloVertical esc={esc} f={f} bx={bx} />
        <Efectos ef={esc.efectos ?? []} tl={tl} f={f} fase="fondo" />
        <Fondo tipo={esc.fondo} f={f} astros={false} />
      </Escenario>
      {/* escenario: todos los actores juntos, cámara quieta */}
      <Escenario dur={dur} entra={!esc.sinEntrada} cielo={cielo} vista={vista(K)} transparente guardas={false}>
        <ContenidoEscena esc={esc} tl={tl} idioma="en" puesta={puesta} />
      </Escenario>
      <CartelesPantalla esc={esc} tl={tl} f={f} />
    </AbsoluteFill>
  );
};
