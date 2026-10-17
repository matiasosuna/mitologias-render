// Hojas de aprobación de los nórdicos secundarios, extras y animales oficiales (elencoNordicoOficial.tsx). Solo stills.
// npx remotion still src/pruebas/secundariosNordicos.tsx hoja out.png --frame=60 --props='{"hoja":0}'
// npx remotion still src/pruebas/secundariosNordicos.tsx cerca out.png --frame=60 --props='{"claves":["sigurd_oficial"]}'
import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { NOMBRE_EN } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
/** Celda: clave[@y] (y = altura en el mundo, para las aves en vuelo y la víbora colgada). */
const solo = (como: string, fondo: string, y?: number, dx = 0): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: como, x: 930 + dx, rotulo: '', ...(y ? { y } : {}) }],
} as Escena);

/** Rótulo de la hoja para los extras sin nombre propio. */
const ROTULO: Record<string, string> = {
  vikingo_nordico_oficial: 'VIKING 1', vikingo_nordico_2_oficial: 'VIKING 2', vikingo_nordico_3_oficial: 'VIKING 3', vikingo_nordico_4_oficial: 'VIKING 4', vikingo_nordico_5_oficial: 'VIKING 5',
  hombre_nordico_oficial: 'FARMER', hombre_nordico_2_oficial: 'FISHERMAN', hombre_nordico_3_oficial: 'COOK', hombre_nordico_4_oficial: 'MAN',
  joven_nordico_oficial: 'YOUTH 1', joven_nordico_2_oficial: 'YOUTH 2', anciano_nordico_oficial: 'OLD MAN', anciano_nordico_2_oficial: 'TRAVELER',
  mujer_nordica_oficial: 'WOMAN 1', mujer_nordica_2_oficial: 'WOMAN 2', mujer_nordica_3_oficial: 'WOMAN 3', criada_nordica_oficial: 'SERVANT',
  anciana_nordica_oficial: 'OLD WOMAN', nino_nordico_oficial: 'BOY', nina_nordica_oficial: 'GIRL', rey_nordico_oficial: 'KING 1', rey_nordico_2_oficial: 'KING 2',
  jotun_nordico_oficial: 'JOTUN 1', jotun_nordico_2_oficial: 'JOTUN 2', jotun_mujer_nordica_oficial: 'GIANTESS', enano_nordico_oficial: 'DWARF 1', enano_nordico_2_oficial: 'DWARF 2',
  valquiria_nordica_oficial: 'VALKYRIE 1', valquiria_nordica_2_oficial: 'VALKYRIE 2', valquiria_nordica_3_oficial: 'VALKYRIE 3',
  norna_nordica_oficial: 'URD', norna_nordica_2_oficial: 'VERDANDI', norna_nordica_3_oficial: 'SKULD', helgi_nino_oficial: 'HELGI (BOY)',
  fafnir_hombre_oficial: 'FAFNIR (MAN)', suttung_aguila_oficial: 'SUTTUNG (EAGLE)', 'serpiente_nordica_oficial@380': 'SNAKE (HANGING)',
};

const HOJAS: string[][] = [
  // Sigurd y los Gjúkungos · Helgi
  ['sigurd_oficial', 'regin_oficial', 'fafnir_hombre_oficial', 'hreidmar_oficial', 'andvari_oficial', 'brynhild_oficial', 'gudrun_oficial', 'grimhild_oficial', 'gjuki_oficial', 'gunnar_oficial', 'guttorm_oficial', 'helgi_oficial', 'helgi_nino_oficial', 'sigrun_oficial', 'hunding_oficial'],
  // Helgi (fin) · Hervor · Grotti
  ['hodbrodd_oficial', 'dag_oficial', 'hervor_oficial', 'angantyr_oficial', 'arngrim_oficial', 'svafrlami_oficial', 'eyfura_oficial', 'svafa_oficial', 'durin_oficial', 'dvalin_oficial', 'hjalmar_oficial', 'odd_oficial', 'frodi_oficial', 'fjolnir_oficial', 'fenja_oficial'],
  // Grotti (fin) · Starkad · Shorts
  ['menja_oficial', 'mysing_oficial', 'starkad_oficial', 'vikar_oficial', 'hather_oficial', 'volund_oficial', 'hrossharsgrani_oficial', 'hodr_oficial', 'hoenir_oficial', 'mimir_oficial', 'vanir_oficial', 'skadi_oficial', 'sigyn_oficial', 'ran_oficial', 'elli_oficial'],
  // Shorts (fin) · gigantes · enanos · niños
  ['thjalfi_oficial', 'brokkr_oficial', 'gunnlod_oficial', 'suttung_oficial', 'utgarda_loki_oficial', 'hrym_oficial', 'jotun_nordico_oficial', 'jotun_nordico_2_oficial', 'jotun_mujer_nordica_oficial', 'enano_nordico_oficial', 'enano_nordico_2_oficial', 'nino_nordico_oficial', 'nina_nordica_oficial', 'skald_nordico_oficial'],
  // Extras: hombres
  ['vikingo_nordico_oficial', 'vikingo_nordico_2_oficial', 'vikingo_nordico_3_oficial', 'vikingo_nordico_4_oficial', 'vikingo_nordico_5_oficial', 'hombre_nordico_oficial', 'hombre_nordico_2_oficial', 'hombre_nordico_3_oficial', 'hombre_nordico_4_oficial', 'joven_nordico_oficial', 'joven_nordico_2_oficial', 'anciano_nordico_oficial', 'anciano_nordico_2_oficial'],
  // Extras: mujeres, reyes, valquirias y nornas
  ['mujer_nordica_oficial', 'mujer_nordica_2_oficial', 'mujer_nordica_3_oficial', 'criada_nordica_oficial', 'princesa_nordica_oficial', 'anciana_nordica_oficial', 'reina_nordica_oficial', 'rey_nordico_oficial', 'rey_nordico_2_oficial', 'valquiria_nordica_oficial', 'valquiria_nordica_2_oficial', 'valquiria_nordica_3_oficial', 'norna_nordica_oficial', 'norna_nordica_2_oficial', 'norna_nordica_3_oficial'],
  // Animales
  ['fafnir_oficial', 'fenrir_oficial', 'grani_oficial', 'otr_oficial', 'caballo_nordico_oficial', 'caballo_nordico_2_oficial', 'lobo_nordico_oficial', 'ciervo_nordico_oficial'],
  ['cabra_nordica_oficial', 'cabra_nordica_2_oficial', 'serpiente_nordica_oficial', 'serpiente_nordica_oficial@380', 'pez_nordico_oficial@700', 'cuervo_nordico_oficial@560', 'cuco_nordico_oficial@560', 'gaviota_nordica_oficial@560', 'aguila_nordica_oficial@560', 'suttung_aguila_oficial@560'],
];
/** Corrimiento en x para centrar los animales largos en su celda. */
const CORRER: Record<string, number> = { fafnir_oficial: 20, fenrir_oficial: -10, grani_oficial: -30, caballo_nordico_oficial: -30, caballo_nordico_2_oficial: -30, ciervo_nordico_oficial: -20, aguila_nordica_oficial: 40, suttung_aguila_oficial: 50, cuervo_nordico_oficial: 20, cuco_nordico_oficial: 20, gaviota_nordica_oficial: 20 };

const Celda: React.FC<{ clave: string; left: number; top: number; w: number; h: number; k: number; fondo: string }> = ({ clave, left, top, w, h, k, fondo }) => {
  const [como, yS] = clave.split('@'), y = yS ? Number(yS) : undefined;
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: w / 2 - 960 * k, top: -(790 + 56 - h / k) * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <CalidadHD.Provider value={true}><EscenaMotor esc={solo(como, fondo, y, CORRER[como])} tl={tl} /></CalidadHD.Provider>
      </div>
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: w < 260 ? 22 : 28, letterSpacing: 2, color: C.crema, textShadow: `0 2px 0 ${C.negro}, 0 0 8px ${C.negro}, 0 0 3px ${C.negro}` }}>{ROTULO[clave] ?? ROTULO[como] ?? NOMBRE_EN[como] ?? como}</div>
    </div>
  );
};

const Hoja: React.FC<{ hoja?: number; claves?: string[]; k?: number }> = ({ hoja = 0, claves, k }) => {
  aplicarTema('nordicas');
  const lista = claves ?? HOJAS[hoja];
  const filas = lista.length > 4 ? 2 : 1, porFila = Math.ceil(lista.length / filas);
  const W = 1920 / porFila, H = 1080 / filas;
  const animales = !claves && hoja >= 6;
  const kk = k ?? (filas === 1 ? (lista.length === 1 ? 1.7 : 1.2) : animales ? (hoja === 6 ? 0.6 : 0.72) : 0.8);
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {lista.map((c, i) => {
        const r = Math.floor(i / porFila), j = i % porFila, n = r === filas - 1 ? lista.length - r * porFila : porFila;
        const x0 = (1920 - n * W) / 2;
        return <Celda key={c + i} clave={c} left={x0 + j * W + 2} top={r * H + 2} w={W - 4} h={H - 4} k={kk} fondo="nieve" />;
      })}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="hoja" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ hoja: 0 }} />
    <Composition id="cerca" component={Hoja} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ claves: ['sigurd_oficial'] }} />
  </>
));
