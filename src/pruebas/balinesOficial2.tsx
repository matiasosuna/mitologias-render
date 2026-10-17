// Hojas de aprobación de los diseños oficiales balineses de la segunda tanda (secundarios, extras y animales). Solo stills.
// npx remotion still src/pruebas/balinesOficial2.tsx b2-1 out.png --frame=60   (b2-1 … b2-4)
// npx remotion still src/pruebas/balinesOficial2.tsx b2-zoom out.png --frame=60 --props='{"claves":["nirartha_oficial"],"cols":1}'
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, TITULO } from '../comun/vasija';
import { EscenaMotor } from '../motor/Escena';
import { NOMBRE_EN } from '../motor/elenco';
import type { Escena } from '../motor/tipos';

const tl = { id: 'x', from: 0, durationInFrames: 400, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 400 }] };
const Motor: React.FC<{ esc: Escena }> = ({ esc }) => <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
const solo = (como: string, fondo: string): Escena => ({
  id: 's' + como, fondo, camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true,
  actores: [{ id: como, x: 960, rotulo: '' }],
} as Escena);

type Grilla = { fondo: string; claves: string[]; cols: number; k?: number; zoom?: number; y0?: number; dx?: Record<string, number>; dk?: Record<string, number> };
const Cuadricula: React.FC<Grilla> = ({ fondo, claves, cols, k: k0, zoom = 1, y0, dx = {}, dk = {} }) => {
  aplicarTema('balinesas');
  const filas = Math.ceil(claves.length / cols), W = 1920 / cols, H = 1080 / filas, ET = 44;
  const k = (k0 ?? Math.min(0.78, (H - ET) / 545)) * zoom;
  const yMundo = y0 ?? 790 + 22 - (H - ET) / k;
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      {claves.map((c, i) => {
        const left = (i % cols) * W, top = Math.floor(i / cols) * H, kk = k * (dk[c] ?? 1), ym = y0 ?? 790 + 22 - (H - ET) / kk;
        return (
          <div key={c + i} style={{ position: 'absolute', left: left + 2, top: top + 2, width: W - 4, height: H - 4, overflow: 'hidden', background: C.negro }}>
            <div style={{ position: 'absolute', left: (W - 4) / 2 - (960 + (dx[c] ?? 0)) * kk, top: -(y0 ? yMundo : ym) * kk, width: 1920, height: 1080, transform: `scale(${kk})`, transformOrigin: '0 0' }}>
              <Motor esc={solo(c, fondo)} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, height: ET, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.negro, fontFamily: TITULO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: C.crema }}>{(NOMBRE_EN[c] ?? c).replace(/_/g, ' ')}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const o = (l: string[]) => l.map((c) => c + '_oficial');
export const HOJA_1 = o(['bhatara_pasupati', 'bhatara_putrajaya', 'bhatara_genijaya', 'bhatara_indra', 'bhatari_durga', 'sri_jaya_pangus', 'kang_cing_wie', 'prabu_airlangga', 'raja_bedahulu', 'raja_bedahulu_babi', 'ratna_manggali', 'gajah_mada', 'bendesa_beraban', 'nirartha', 'sidhi_mantra']);
export const HOJA_2 = o(['mpu_bharadah', 'mpu_bharadah_libro', 'mpu_kulputih', 'mpu_bahula', 'manik_angkeran', 'manik_angkeran_genta', 'manik_angkeran_joya', 'kebo', 'calon_arang_libro', 'murid_leak', 'pemangku', 'pecalang', 'dewa_bali', 'dewi_bali', 'penari_kris']);
export const HOJA_3 = o(['wanita_bali', 'wanita_bali_2', 'pria_bali', 'pria_bali_2', 'anak_bali', 'anak_bali_nina', 'kakek_bali', 'nenek_bali', 'prajurit_bali', 'prajurit_dewa', 'prajurit_jawa', 'raksasa_bali']);
export const HOJA_4 = o(['naga_besukih', 'naga_besukih_herida', 'naga_basuki', 'naga_anantaboga', 'bedawang_nala', 'jero_gede', 'jero_luh', 'bojog', 'celeng', 'manuk', 'maya', 'ular_poleng']);

const comp = (id: string, g: Grilla) => <Composition key={id} id={id} component={Cuadricula as unknown as React.FC<Record<string, unknown>>} durationInFrames={400} fps={24} width={1920} height={1080} defaultProps={g} />;

registerRoot(() => (
  <>
    {comp('b2-1', { fondo: 'pura', claves: HOJA_1, cols: 5 })}
    {comp('b2-2', { fondo: 'pura', claves: HOJA_2, cols: 5 })}
    {comp('b2-3', { fondo: 'pura', claves: HOJA_3, cols: 6 })}
    {comp('b2-4', { fondo: 'pura', claves: HOJA_4, cols: 4, dk: { jero_gede_oficial: 0.8, jero_luh_oficial: 0.8, naga_besukih_oficial: 0.85, naga_besukih_herida_oficial: 0.85, naga_basuki_oficial: 0.85, naga_anantaboga_oficial: 0.85, bedawang_nala_oficial: 0.85 }, dx: { naga_besukih_oficial: -270, naga_besukih_herida_oficial: -270, naga_basuki_oficial: -270, naga_anantaboga_oficial: -270, bedawang_nala_oficial: -20 } })}
    {comp('b2-zoom', { fondo: 'pura', claves: ['nirartha_oficial'], cols: 1 })}
  </>
));
