// Prueba visual del tema balinés ("kamasan"). Solo para mirar stills sueltos (no se renderiza video).
// npx remotion still src/pruebas/balinesa.tsx b-fondos /tmp/x.png --frame=60
// npx remotion still src/pruebas/balinesa.tsx b-ep-1 /tmp/x.png --frame=60   (cuadrícula 2×2 de escenas congeladas)
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, Freeze, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor, momento } from '../motor/Escena';
import { VideoMotor } from '../motor/VideoMotor';
import { Miniatura } from '../comun/miniatura';
import type { GuionVisual, Timeline, Escena } from '../motor/tipos';
import { GUIONES_BALINESAS } from './balinesasGuiones';

/** Timeline estimado (≈2,3 palabras/s en inglés), igual que motor-revisar sin narración. */
function timelineEstimado(g: GuionVisual, fps = 24): Timeline {
  const fr = (s: number) => Math.round(s * fps);
  let cursor = fr(4);
  const escenas = g.escenas.map((e) => {
    let local = fr(0.7);
    const frases = e.frases.map((t) => { const dur = Math.ceil((0.6 + (t.en ?? t.es).split(/\s+/).length / 2.3) * fps); const it = { texto: t, audio: {}, from: local, dur }; local += dur + fr(0.6); return it; });
    const durationInFrames = local - fr(0.6) + fr(1);
    const r = { id: e.id, from: cursor, durationInFrames, frases };
    cursor += durationInFrames;
    return r;
  });
  return { fps, introFrames: fr(4), outroFrames: fr(12), total: cursor + fr(12), escenas };
}

const FONDOS = ['kahyangan', 'segara', 'dasar_segara', 'gunung_agung', 'danau_batur', 'sawah', 'pura', 'pura_malam', 'puri', 'desa', 'desa_malam', 'setra', 'alas', 'pantai', 'tanah_lot', 'tirta_empul', 'selat'];
const OSCUROS = ['dasar_segara', 'pura_malam', 'desa_malam', 'setra'];
const Fondos: React.FC = () => {
  aplicarTema('balinesas');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient></defs>
        {FONDOS.map((t, i) => (
          <svg key={t} x={(i % 5) * 384} y={Math.floor(i / 5) * 270} width={382} height={266} viewBox="0 0 1920 1080">
            <rect width={1920} height={1080} fill={OSCUROS.includes(t) ? '#1E2A4E' : '#EBD6A6'} />
            <Fondo tipo={t} f={f} />
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={90} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
        <svg x={2 * 384} y={3 * 270} width={382} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EBD6A6" />
          {[['meru', 200], ['candi_bentar', 620], ['padmasana', 1000], ['kulkul', 1300], ['penjor', 1500], ['bale', 1780]].map(([t, x], k) => <ElementoSVG key={k} tipo={t as string} x={x as number} s={0.7} f={f} />)}
        </svg>
        <svg x={3 * 384} y={3 * 270} width={382} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#EBD6A6" />
          {[['beringin', 200], ['kelapa', 520], ['jepun', 760], ['bambu', 960], ['kayonan', 1200], ['tedung', 1420], ['gebogan', 1560], ['canang', 1640], ['abu', 1780]].map(([t, x], k) => <ElementoSVG key={k} tipo={t as string} x={x as number} s={0.7} f={f} />)}
          <ElementoSVG tipo="lontar" x={300} y={1000} s={1.2} f={f} props={{ brillo: true }} />
          <ElementoSVG tipo="genta" x={600} y={1000} s={1.4} f={f} />
          <ElementoSVG tipo="sumur" x={900} y={1000} s={0.8} f={f} props={{ hondo: true }} />
          <ElementoSVG tipo="api" x={1200} y={1000} s={0.8} f={f} />
          <ElementoSVG tipo="batu" x={1500} y={1000} s={0.8} f={f} />
          <ElementoSVG tipo="surya" x={1750} y={300} s={1} f={f} />
        </svg>
        <svg x={4 * 384} y={3 * 270} width={382} height={266} viewBox="0 0 1920 1080">
          <rect width={1920} height={1080} fill="#C7D3DE" />
          <ElementoSVG tipo="garis_air" x={960} y={800} f={f} />
          <ElementoSVG tipo="batu_pura" x={500} y={820} s={0.7} f={f} />
          <ElementoSVG tipo="jukung" x={1300} y={780} s={0.9} f={f} />
          <ElementoSVG tipo="pancuran" x={1300} y={500} s={0.5} f={f} />
          <ElementoSVG tipo="bulan" x={1700} y={250} f={f} props={{ sabit: true }} />
          <ElementoSVG tipo="awan" x={500} y={250} f={f} />
          <ElementoSVG tipo="gunung" x={1000} y={600} s={0.5} f={f} props={{ api: true }} />
        </svg>
      </svg>
    </AbsoluteFill>
  );
};

const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: como, ...extra });
const escPersonas: Escena = {
  id: 'elenco', fondo: 'pura', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    ...['bhatara_pasupati', 'dewi_danu', 'bhatara_indra', 'mayadenawa', 'sidhi_mantra', 'manik_angkeran', 'sri_jaya_pangus', 'kang_cing_wie', 'calon_arang', 'ratna_manggali', 'mpu_bharadah'].map((c, i) => ({ ...N(c, 100 + i * 172), escala: 0.78 })),
    ...['ratu_gede_mecaling', 'kebo_iwa', 'raja_bedahulu_babi', 'gajah_mada', 'nirartha', 'bendesa_beraban', 'prajurit_bali', 'penari_kris', 'pecalang', 'pria_bali', 'wanita_bali', 'murid_leak', 'bhatari_durga', 'prabu_airlangga'].map((c, i) => ({ ...N(c, 120 + i * 140), capa: 'fondo' as const, rotulo: '' })),
  ] as Escena['actores'],
};
const escBestias: Escena = {
  id: 'bestias', fondo: 'alas', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { ...N('rangda', 230), escala: 0.85 }, { ...N('barong', 700), escala: 0.85 }, { ...N('naga_besukih', 1500), escala: 0.7, props: { joya: true } },
    { ...N('celeng', 1100), escala: 0.8 }, { ...N('bojog', 1300), escala: 0.8 }, { ...N('manuk', 1780), escala: 0.9 },
    { ...N('api_leak', 1000), y: 330 }, { ...N('ular_poleng', 1700), y: 330 },
    { ...N('jero_gede', 300), capa: 'fondo', rotulo: '' }, { ...N('jero_luh', 600), capa: 'fondo', rotulo: '' },
  ] as Escena['actores'],
};
const escBestias2: Escena = {
  id: 'bestias2', fondo: 'desa_malam', camara: { de: 0, a: 0, zoom: [1, 1] }, frases: [{ es: 'x', en: 'x' }],
  actores: [
    { ...N('bedawang_nala', 500), escala: 0.75 }, { ...N('ogoh_ogoh', 1400), escala: 0.75 }, { ...N('batu_sakti', 1000), escala: 0.8 }, { ...N('labu', 1800), escala: 0.6 },
  ] as Escena['actores'],
};
const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('balinesas');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};

const GUIONES = GUIONES_BALINESAS as unknown as GuionVisual[];
/** Cuadrícula 2×2 de escenas congeladas en un momento (n.º de episodio, escena, frase). */
type Toma = [number, string, number];
const Cuadricula: React.FC<{ tomas: Toma[] }> = ({ tomas }) => {
  aplicarTema('balinesas');
  const uno = tomas.length === 1; // una sola toma = cuadro completo (con varias, el cielo de la primera tiñe a las demás)
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {tomas.map(([n, escId, t], i) => {
        const g = GUIONES.find((x) => Number(x.numero) === n);
        if (!g) return null;
        const tl = timelineEstimado(g), k = Math.max(0, g.escenas.findIndex((e) => e.id === escId));
        const etl = { ...tl.escenas[k], from: 0 };
        return (
          <div key={i} style={{ position: 'absolute', left: (i % 2) * 960, top: Math.floor(i / 2) * 540, width: uno ? 1920 : 960, height: uno ? 1080 : 540, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: uno ? undefined : 'scale(0.5)', transformOrigin: '0 0' }}>
              <Freeze frame={Math.round(momento(etl, t))}><CalidadHD.Provider value={true}><EscenaMotor esc={g.escenas[k]} tl={etl} /></CalidadHD.Provider></Freeze>
            </div>
            <div style={{ position: 'absolute', left: 8, bottom: 6, color: '#fff', fontSize: 22, textShadow: '0 0 4px #000' }}>{`${n} · ${escId} · ${t}`}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
/** Tomas de cada episodio para revisar: 4 por cuadrícula. */
const TOMAS: Record<string, Toma[]> = {};
for (const g of GUIONES) {
  const n = Number(g.numero), es = g.escenas, paso = Math.max(1, Math.floor(es.length / 4));
  TOMAS[`b-ep-${n}`] = [0, 1, 2, 3].map((k) => [n, es[Math.min(es.length - 1, k * paso + (k ? 1 : 0))].id, 1.6] as Toma);
}

registerRoot(() => (
  <>
    <Composition id="b-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="b-elenco" component={() => <Prueba esc={escPersonas} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="b-bestias" component={() => <Prueba esc={escBestias} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="b-bestias2" component={() => <Prueba esc={escBestias2} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="b-miniatura" component={() => <Miniatura titulo="The Dragon's Jewel" numero="02" heroe="manik_angkeran" rival="sidhi_mantra" serie="balinesas" />} durationInFrames={1} fps={24} width={1280} height={720} />
    {Object.entries(TOMAS).map(([id, tomas]) => <Composition key={id} id={id} component={() => <Cuadricula tomas={tomas} />} durationInFrames={9000} fps={24} width={1920} height={1080} />)}
    <Composition id="b-tomas" component={Cuadricula as unknown as React.FC<Record<string, unknown>>} durationInFrames={9000} fps={24} width={1920} height={1080} defaultProps={{ tomas: [] }} />
    {GUIONES.map((g) => { const tl = timelineEstimado(g); return <Composition key={g.id} id={g.id} component={VideoMotor as unknown as React.FC<Record<string, unknown>>} durationInFrames={tl.total} fps={tl.fps} width={1920} height={1080} defaultProps={{ guion: g, timeline: tl, idioma: null }} />; })}
  </>
));
