// Demo de los diseños oficiales aztecas (elencoAztecaOficial.tsx) y norteamericanos (elencoNorteOficial.tsx).
// Solo stills, nunca video.
// npx remotion still src/pruebas/americasOficial.tsx am-aztecas out.png --frame=60
// npx remotion still src/pruebas/americasOficial.tsx am-norte out.png --frame=60
// npx remotion still src/pruebas/americasOficial.tsx am-grilla out.png --frame=60 --props='{"serie":"aztecas","fondo":"valle","claves":["tlaloc"]}'
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;

type Item = { clave: string; nombre: string; sub?: string; escala?: number; props?: Record<string, unknown> };
type GrillaProps = { serie: string; fondo: string; items: Item[]; porFila?: number; xActor?: number };

/** Grilla 16:9: todos los personajes parados en el mismo fondo de la serie, con su nombre debajo. */
const Grilla: React.FC<GrillaProps> = ({ serie, fondo, items, porFila = 5, xActor = 960 }) => {
  aplicarTema(serie);
  const filas = Math.ceil(items.length / porFila);
  const H = 1080 / filas, W = 1920 / porFila;
  const k = filas === 1 ? 1.25 : 0.86; // zoom del mundo dentro de cada celda
  const ETQ = 74; // alto de la franja del nombre
  const ySuelo = 790; // SUELO
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {items.map((it, i) => {
        const col = i % porFila, fila = Math.floor(i / porFila);
        const left = col * W, top = fila * H, h = H - 4, w = W - 4;
        const yMundo = ySuelo + 26 - (h - ETQ) / k; // el suelo queda justo arriba de la franja del nombre
        const esc = { id: 'g' + it.clave, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true, actores: [{ id: it.clave, x: xActor, rotulo: '', escala: it.escala ?? 1, props: it.props }] } as Escena;
        return (
          <div key={it.clave + i} style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: w / 2 - xActor * k, top: -yMundo * k, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0' }}>
              <Motor esc={esc} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, height: ETQ, width: '100%', background: C.negro, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: it.nombre.length > 14 ? 21 : 26, letterSpacing: 3, color: C.crema }}>{it.nombre}</div>
              {it.sub && <div style={{ fontFamily: TITULO, fontWeight: 400, fontSize: 16, letterSpacing: 2, color: C.oro, marginTop: 2 }}>{it.sub}</div>}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const AZTECAS: Item[] = [
  { clave: 'quetzalcoatl_oficial', nombre: 'QUETZALCOATL', sub: 'Feathered Serpent' },
  { clave: 'tezcatlipoca_oficial', nombre: 'TEZCATLIPOCA', sub: 'Smoking Mirror' },
  { clave: 'huitzilopochtli_oficial', nombre: 'HUITZILOPOCHTLI', sub: 'Hummingbird of the South' },
  { clave: 'tlaloc_oficial', nombre: 'TLALOC', sub: 'Lord of Rain' },
  { clave: 'coatlicue_oficial', nombre: 'COATLICUE', sub: 'Serpent Skirt' },
  { clave: 'coyolxauhqui_oficial', nombre: 'COYOLXAUHQUI', sub: 'The Moon' },
  { clave: 'xolotl_oficial', nombre: 'XOLOTL', sub: 'Dog of the Underworld' },
  { clave: 'mictlantecuhtli_oficial', nombre: 'MICTLANTECUHTLI', sub: 'Lord of the Dead' },
  { clave: 'tonatiuh_oficial', nombre: 'TONATIUH', sub: 'The Fifth Sun' },
  { clave: 'nanahuatzin_oficial', nombre: 'NANAHUATZIN', sub: 'The Humble One' },
];
const NORTE: Item[] = [
  { clave: 'mujer_cielo_oficial', nombre: 'SKY WOMAN', sub: 'Haudenosaunee' },
  { clave: 'gran_tortuga_oficial', nombre: 'GREAT TURTLE', sub: 'Haudenosaunee', escala: 0.92 },
  { clave: 'rata_almizclera_oficial', nombre: 'MUSKRAT', sub: 'Haudenosaunee · Anishinaabe', escala: 1.25 },
  { clave: 'brote_oficial', nombre: 'SAPLING', sub: 'Haudenosaunee' },
  { clave: 'pedernal_oficial', nombre: 'FLINT', sub: 'Haudenosaunee' },
  { clave: 'escarabajo_agua_oficial', nombre: 'WATER BEETLE', sub: 'Cherokee', escala: 0.85 },
  { clave: 'sol_oficial', nombre: 'THE SUN', sub: 'Cherokee' },
  { clave: 'nanabozho_oficial', nombre: 'NANABOZHO', sub: 'Anishinaabe' },
  { clave: 'cuervo_oficial', nombre: 'RAVEN', sub: 'Tlingit', escala: 1.2 },
  { clave: 'coyote_oficial', nombre: 'COYOTE', sub: 'Wasco · Nimiipuu', escala: 1.05 },
];

registerRoot(() => (
  <>
    <Composition id="am-aztecas" component={Grilla} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'aztecas', fondo: 'valle', items: AZTECAS, xActor: 1250 } as GrillaProps} />
    <Composition id="am-norte" component={Grilla} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'norteamericanas', fondo: 'lago', items: NORTE } as GrillaProps} />
    <Composition id="am-grilla" component={Grilla} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={{ serie: 'aztecas', fondo: 'valle', items: AZTECAS, porFila: 5 } as GrillaProps} />
  </>
));
