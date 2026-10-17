// Hojas de aprobación de los secundarios egipcios oficiales (elencoEgipcioOficial.tsx, 2026-10-17). Solo stills.
// npx remotion still src/pruebas/secundariosEgipcios.tsx hoja out.png --frame=60 --props='{"hoja":1}'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO, SUELO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { NOMBRE_EN } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
type Item = { c: string; w?: number; k?: number; y?: number; dx?: number; nombre?: string };
const solo = (it: Item, x: number): Escena => ({
  id: 's' + it.c, fondo: 'nilo', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: it.c, x, rotulo: '', ...(it.y !== undefined ? { y: it.y } : {}) }],
} as Escena);

/** Nombres de la hoja para los extras sin rótulo (en el video no llevan cartel). */
const ETIQUETA: Record<string, string> = {
  aldeano_egipcio_oficial: 'VILLAGER A', aldeano_egipcio_b_oficial: 'VILLAGER B', aldeano_egipcio_c_oficial: 'VILLAGER C',
  aldeana_egipcia_oficial: 'VILLAGER A', aldeana_egipcia_b_oficial: 'VILLAGER B', aldeana_egipcia_c_oficial: 'SERVANT',
  nino_egipcio_oficial: 'BOY', nina_egipcia_oficial: 'GIRL', anciano_egipcio_oficial: 'OLD MAN', anciana_egipcia_oficial: 'OLD WOMAN',
  rey_extranjero_oficial: 'FOREIGN KING', soldado_egipcio_oficial: 'SOLDIER', soldado_egipcio_b_oficial: 'ARCHER',
  halcon_egipcio_oficial: 'FALCON', milano_egipcio_oficial: 'KITE', golondrina_egipcia_oficial: 'SWALLOW', cobra_egipcia_oficial: 'COBRA',
  serpiente_egipcia_oficial: 'SNAKE', cocodrilo_egipcio_oficial: 'CROCODILE', vaca_egipcia_oficial: 'COW', toro_egipcio_oficial: 'BULL',
  perro_egipcio_oficial: 'DOG', caballo_egipcio_oficial: 'HORSE', gacela_oficial: 'GAZELLE', pez_egipcio_oficial: 'FISH',
};

const Celda: React.FC<{ it: Item; left: number; top: number; w: number; h: number; k: number }> = ({ it, left, top, w, h, k }) => (
  <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -(SUELO + 56 - h / k) * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
      <CalidadHD.Provider value={true}><EscenaMotor esc={solo(it, 960 + (it.dx ?? 0))} tl={tl} /></CalidadHD.Provider>
    </div>
    <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: (it.nombre ?? NOMBRE_EN[it.c] ?? ETIQUETA[it.c] ?? it.c).length > 12 && w < 260 ? 21 : 26, letterSpacing: 2, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 8px ${C.negro}, 0 0 3px ${C.negro}` }}>{it.nombre ?? NOMBRE_EN[it.c] ?? ETIQUETA[it.c] ?? it.c}</div>
  </div>
);

const o = (c: string) => c + '_oficial';
export const HOJAS: Item[][][] = [
  // 1: dioses menores
  [['shu', 'tefnut', 'atum', 'neftis', 'maat', 'khnum', 'khonsu', 'khepri'].map((c) => ({ c: o(c) })), ['sokar', 'sia', 'heh', 'nun', 'iah', 'neit', 'serqet'].map((c) => ({ c: o(c) }))],
  // 2: más dioses, criaturas con nombre
  [[{ c: o('isis_anciana') }, { c: o('nemty') }, { c: o('horus_nino') }, { c: o('bennu'), w: 1.2 }, { c: o('ammit'), w: 2 }, { c: o('mehen'), w: 1.6 }], [{ c: o('apofis'), w: 3, k: 0.62, dx: 230 }, { c: o('tefen'), w: 1 }, { c: o('befen'), w: 1 }, { c: o('mestet'), w: 1 }, { c: o('mestetef'), w: 1 }]],
  // 3: mortales con nombre (I)
  [['bata', 'anubis_hermano', 'imhotep', 'asclepio_imhotep', 'setne', 'inaros', 'nanef', 'ahwere'].map((c) => ({ c: o(c) })), ['merib', 'tabubu', 'djedi', 'hordedef', 'sinuhe', 'sinuhe_viejo', 'amunenshi'].map((c) => ({ c: o(c) }))],
  // 4: mortales con nombre (II) + los otros tres escorpiones
  [[{ c: o('campeon_retenu'), dx: -30 }, ...['djehuty', 'ramses', 'djoser', 'snefru', 'senusret', 'rey_biblos', 'aso'].map((c) => ({ c: o(c) }))], [...['bakhtan', 'bentresh', 'hitita'].map((c) => ({ c: o(c) })), { c: o('petet') }, { c: o('thetet') }, { c: o('matet') }]],
  // 5: extras (I)
  [['aldeano_egipcio', 'aldeano_egipcio_b', 'aldeano_egipcio_c', 'aldeana_egipcia', 'aldeana_egipcia_b', 'aldeana_egipcia_c', 'nino_egipcio', 'nina_egipcia'].map((c) => ({ c: o(c) })), ['anciano_egipcio', 'anciana_egipcia', 'sacerdote_egipcio', 'sacerdote_egipcio_b', 'escriba', 'escriba_b', 'momia'].map((c) => ({ c: o(c) }))],
  // 6: extras (II) + aves
  [['faraon', 'faraon_b', 'reina_egipcia', 'reina_egipcia_b', 'rey_extranjero', 'soldado_egipcio', 'soldado_egipcio_b'].map((c) => ({ c: o(c) })), [{ c: o('halcon_egipcio') }, { c: o('halcon_egipcio'), y: 520, nombre: 'FALCON (FLYING)', w: 1.3 }, { c: o('milano_egipcio') }, { c: o('milano_egipcio'), y: 520, nombre: 'KITE (FLYING)', w: 1.3 }, { c: o('golondrina_egipcia') }, { c: o('ganso_egipcio') }, { c: o('ojo_ra'), w: 1.2 }]],
  // 7: animales
  [[{ c: o('cobra_egipcia'), w: 1.2 }, { c: o('serpiente_egipcia'), w: 1.3 }, { c: o('cocodrilo_egipcio'), w: 2.2 }, { c: o('hipopotamo_egipcio'), w: 1.8 }, { c: o('escorpion_egipcio') }], [{ c: o('vaca_egipcia'), w: 1.6 }, { c: o('toro_egipcio'), w: 1.6 }, { c: o('perro_egipcio'), w: 1.2 }, { c: o('caballo_egipcio'), w: 2.1, dx: -40 }, { c: o('gacela'), w: 1.2 }, { c: o('pez_egipcio') }]],
];

const Hoja: React.FC<{ hoja: number; filas?: Item[][]; k?: number }> = ({ hoja, filas, k }) => {
  aplicarTema('egipcias');
  const rows = filas ?? HOJAS[hoja - 1], H = 1080 / rows.length, kk = k ?? (rows.length === 1 ? 1.6 : 0.88);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {rows.map((fila, r) => {
        const total = fila.reduce((a, it) => a + (it.w ?? 1), 0), unidad = Math.min(1920 / total, 1920 / 7.6);
        let x = (1920 - unidad * total) / 2;
        return fila.map((it, j) => { const w = unidad * (it.w ?? 1), el = <Celda key={`${r}-${j}`} it={it} left={x + 2} top={r * H + 2} w={w - 4} h={H - 4} k={it.k ?? kk} />; x += w; return el; });
      })}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition id="hoja" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ hoja: 1 } as { hoja: number; filas?: Item[][]; k?: number }} />
));
