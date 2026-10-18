// Hojas de aprobación de los secundarios griegos oficiales (elencoGriegoOficial.tsx). Solo stills, nunca video.
// npx remotion still src/pruebas/griegosSecundarios.tsx gs-hoja out.png --frame=60 --props='{"n":1}'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
type Item = { k: string; n: string; y?: number; e?: number; dx?: number };
const it = (k: string, n: string, o: Partial<Item> = {}): Item => ({ k, n, ...o });

/** Hojas: máx. 15 por hoja (5 × 3). */
export const HOJAS: Item[][] = [
  // 1: con nombre (dioses y ninfas)
  [it('helios_oficial', 'HELIOS'), it('leto_oficial', 'LETO'), it('temis_oficial', 'THEMIS'), it('asteria_oficial', 'ASTERIA'), it('iris_oficial', 'IRIS'),
    it('ilitia_oficial', 'EILEITHYIA'), it('hebe_oficial', 'HEBE'), it('anfitrite_oficial', 'AMPHITRITE'), it('tetis_oficial', 'THETIS'), it('eurinome_oficial', 'EURYNOME'),
    it('semele_oficial', 'SEMELE'), it('ino_oficial', 'INO'), it('beroe_oficial', 'BEROE'), it('muerte_oficial', 'THANATOS'), it('hefesto_nino_oficial', 'BABY HEPHAESTUS')],
  // 2: con nombre (mortales y criaturas con cuerpo humano)
  [it('cadmo_oficial', 'CADMUS'), it('cecrope_oficial', 'CECROPS', { dx: 40 }), it('licaon_oficial', 'LYCAON'), it('sisifo_oficial', 'SISYPHUS'), it('merope_oficial', 'MEROPE'),
    it('aquiles_oficial', 'ACHILLES'), it('penelope_oficial', 'PENELOPE'), it('medea_oficial', 'MEDEA'), it('talos_oficial', 'TALOS'), it('pitia_oficial', 'PYTHIA'),
    it('deucalion_oficial', 'DEUCALION'), it('pirra_oficial', 'PYRRHA'), it('homero_oficial', 'HOMER'), it('demodoco_oficial', 'DEMODOCUS'), it('maron_oficial', 'MARON')],
  // 3: con nombre (Odisea, Dioniso, sátiros) + criaturas
  [it('acetes_oficial', 'ACOETES'), it('lotofago_oficial', 'LOTUS-EATER'), it('lotofaga_oficial', 'LOTUS-EATER'), it('marsias_oficial', 'MARSYAS'), it('aegipan_oficial', 'AEGIPAN'),
    it('delfine_oficial', 'DELPHYNE', { dx: 50 }), it('piton_oficial', 'PYTHON', { e: 0.55, dx: 40 }), it('cerbero_oficial', 'CERBERUS', { e: 0.7 }), it('pegaso_oficial', 'PEGASUS', { e: 0.8 }), it('licaon_lobo_oficial', 'LYCAON (WOLF)'),
    it('dioniso_cabrito_oficial', 'DIONYSUS (KID)'), it('dioniso_leon_oficial', 'DIONYSUS (LION)', { e: 0.85 }), it('sisifo_roca_oficial', 'SISYPHUS (BOULDER)', { dx: -70 })],
  // 4: animales de tierra
  [it('caballo_griego_oficial', 'HORSE', { e: 0.85 }), it('mula_griega_oficial', 'MULE', { e: 0.85 }), it('buey_griego_oficial', 'OX', { e: 0.85 }), it('vaca_griega_oficial', 'COW', { e: 0.85 }), it('toro_griego_oficial', 'BULL', { e: 0.85 }),
    it('oveja_griega_oficial', 'SHEEP'), it('carnero_griego_oficial', 'RAM'), it('cabra_griega_oficial', 'GOAT'), it('ciervo_griego_oficial', 'DEER', { e: 0.9 }), it('perro_griego_oficial', 'DOG'),
    it('lobo_griego_oficial', 'WOLF'), it('leon_griego_oficial', 'LION', { e: 0.85 }), it('oso_griego_oficial', 'BEAR', { e: 0.85 }), it('tortuga_griega_oficial', 'TORTOISE', { e: 1.3 }), it('serpiente_griega_oficial', 'SNAKE', { dx: 120 })],
  // 5: aves y mar
  [it('aguila_griega_oficial', 'EAGLE', { y: 560, dx: 20 }), it('paloma_griega_oficial', 'DOVE', { y: 600 }), it('cisne_griego_oficial', 'SWAN', { y: 600, dx: -40 }), it('pavo_real_griego_oficial', 'PEACOCK', { dx: 20 }), it('buho_griego_oficial', 'OWL'),
    it('delfin_griego_oficial', 'DOLPHIN', { y: 680 })],
  // 6–8: extras (gente común)
  [it('hombre_griego_oficial', 'MAN · A'), it('hombre_griego_2_oficial', 'MAN · B'), it('hombre_griego_3_oficial', 'MAN · C'), it('joven_griego_oficial', 'YOUTH · A'), it('joven_griego_2_oficial', 'YOUTH · B'),
    it('mujer_griega_oficial', 'WOMAN · A'), it('mujer_griega_2_oficial', 'WOMAN · B'), it('mujer_griega_3_oficial', 'WOMAN · C'), it('anciano_griego_oficial', 'OLD MAN · A'), it('anciano_griego_2_oficial', 'OLD MAN · B'),
    it('anciana_griega_oficial', 'OLD WOMAN'), it('nino_griego_oficial', 'BOY'), it('nina_griega_oficial', 'GIRL'), it('pastor_griego_oficial', 'SHEPHERD · A'), it('pastor_griego_2_oficial', 'SHEPHERD · B')],
  [it('ninfa_oficial', 'NYMPH · A'), it('ninfa_2_oficial', 'NYMPH · B'), it('ninfa_3_oficial', 'NYMPH · C'), it('gracia_oficial', 'GRACE'), it('hora_oficial', 'HORA (SEASON)'),
    it('musa_oficial', 'MUSE · A'), it('musa_2_oficial', 'MUSE · B'), it('musa_3_oficial', 'MUSE · C'), it('sacerdote_griego_oficial', 'PRIEST'), it('sacerdotisa_griega_oficial', 'PRIESTESS · A'),
    it('sacerdotisa_griega_2_oficial', 'PRIESTESS · B'), it('rey_griego_oficial', 'KING · A'), it('rey_griego_2_oficial', 'KING · B'), it('reina_griega_oficial', 'QUEEN · A'), it('reina_griega_2_oficial', 'QUEEN · B')],
  [it('guerrero_griego_oficial', 'WARRIOR · A'), it('guerrero_griego_2_oficial', 'WARRIOR · B'), it('persa_oficial', 'PERSIAN'), it('gigante_griego_oficial', 'GIANT · A'), it('gigante_griego_2_oficial', 'GIANT · B'),
    it('marinero_griego_oficial', 'SAILOR · A'), it('marinero_griego_2_oficial', 'SAILOR · B'), it('pirata_oficial', 'PIRATE · A'), it('pirata_2_oficial', 'PIRATE · B'), it('doncella_oro_oficial', 'GOLDEN MAIDEN')],
  // 9–10: los 17 que faltaban (2026-10-18) → griegos-faltantes-1..2
  [it('atlas_oficial', 'ATLAS', { e: 0.8 }), it('caronte_oficial', 'CHARON'), it('eos_oficial', 'EOS'), it('eros_oficial', 'EROS'), it('euridice_oficial', 'EURYDICE'),
    it('furia_oficial', 'FURY (ERINYS)'), it('hector_oficial', 'HECTOR'), it('helena_oficial', 'HELEN'), it('minos_oficial', 'MINOS'), it('nix_oficial', 'NYX'),
    it('orfeo_oficial', 'ORPHEUS'), it('selene_oficial', 'SELENE')],
  [it('hidra_oficial', 'HYDRA', { dx: 60 }), it('quimera_oficial', 'CHIMERA', { dx: -80 }), it('dragon_oficial', 'DRAGON', { dx: 20 }),
    it('arpia_oficial', 'HARPY', { y: 560 }), it('pez_griego_oficial', 'FISH', { y: 640, e: 1.4 })],
];

const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (i: Item, x: number): Escena => ({
  id: 's' + i.k, fondo: 'campo', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: i.k, x, rotulo: '', ...(i.y !== undefined ? { y: i.y } : {}), ...(i.e !== undefined ? { escala: i.e } : {}) }],
} as Escena);

/** Celda: un actor solo en su escena, recortado alrededor de él, con su nombre abajo. */
const Celda: React.FC<{ i: Item; left: number; top: number; w: number; h: number; k: number }> = ({ i, left, top, w, h, k }) => {
  const yMundo = 830 + 40 - (h - 4) / k;
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <Motor esc={solo(i, 960 + (i.dx ?? -20))} />
      </div>
      <div style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 24, letterSpacing: 1.5, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 6px ${C.negro}` }}>{i.n}</div>
    </div>
  );
};

const Hoja: React.FC<{ n: number; k?: number; cols?: number }> = ({ n, k: k0, cols = 5 }) => {
  const k = k0 ?? (n === 8 ? 0.52 : 0.6);
  aplicarTema('griegas');
  const items = HOJAS[n - 1] ?? [], W = 1920 / cols, H = 1080 / Math.ceil(15 / cols);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {items.map((i, j) => <Celda key={i.k + j} i={i} left={(j % cols) * W + 2} top={Math.floor(j / cols) * H + 2} w={W - 4} h={H - 4} k={k} />)}
    </AbsoluteFill>
  );
};

/** Zoom: cabeza y manos de unos pocos. */
const Zoom: React.FC<{ claves: string[]; k?: number; y?: number; x?: number; ya?: number }> = ({ claves, k = 1.5, y = 380, x = 990, ya }) => {
  aplicarTema('griegas');
  const cols = claves.length, W = 1920 / cols;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, j) => (
        <div key={c + j} style={{ position: 'absolute', left: j * W + 2, top: 2, width: W - 4, height: 1076, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: (W - 4) / 2 - x * k, top: -y * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <Motor esc={solo({ k: c, n: '', y: ya }, 960)} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="gs-hoja" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ n: 1, k: 0.6 }} />
    <Composition id="griegos-faltantes-1" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ n: 9, k: 0.6 }} />
    <Composition id="griegos-faltantes-2" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ n: 10, k: 0.5, cols: 3 }} />
    <Composition id="gs-zoom" component={Zoom} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ claves: ['helios_oficial'], k: 1.5, y: 380 }} />
  </>
));
