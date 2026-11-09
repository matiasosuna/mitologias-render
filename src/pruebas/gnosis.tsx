// Prueba visual de Gnosis (serie `gnosticas`, tema "gnosis"). Solo stills sueltos (no se renderiza video).
// Láminas en la nube: gh workflow run laminas.yml -R matiasosuna/mitologias-render -f ids='gnosis.tsx:gn-fondos,gnosis.tsx:gn-luz'
//   gn-fondos  = los 12 fondos · gn-pleroma = los seres de luz · gn-gobernantes = Yaldabaoth y los siete reyes
//   gn-humanos = Adán, Eva, Juan… · gn-caras = las caras de los gobernantes · gn-escena = toma de ejemplo · gn-piezas = miniatura y portada IG
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, C, Guardas, Personaje } from '../comun/vasija';
import { Fondo, ElementoSVG } from '../motor/fondos';
import { EscenaMotor } from '../motor/Escena';
import { FONDOS_GNOSIS, ELEMENTOS_GNOSIS } from '../motor/fondosGnosis';
import { CabezaArconte, CARAS_ARCONTE } from '../motor/elencoGnosis';
import type { Escena } from '../motor/tipos';
import { Miniatura } from '../comun/miniatura';
import { PortadaIG } from '../comun/portadaIG';

/** Los 12 fondos del tema en una grilla 4×3. */
const Fondos: React.FC = () => {
  aplicarTema('gnosticas');
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {FONDOS_GNOSIS.map((t, i) => (
          <svg key={t} x={(i % 4) * 480} y={Math.floor(i / 4) * 360} width={476} height={356} viewBox="0 60 1920 1020" preserveAspectRatio="xMidYMid slice">
            <Fondo tipo={t} f={f} />
            <Guardas desplaz={0} />
            <text x={40} y={1040} fontSize={80} fill="#FFF" stroke="#000" strokeWidth={4}>{t}</text>
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Los elementos sueltos del tema, en una grilla sobre papiro. */
const Elementos: React.FC = () => {
  aplicarTema('gnosticas');
  const f = useCurrentFrame();
  const cols = 7, w = 1920 / cols, h = 1080 / 4;
  return (
    <AbsoluteFill style={{ backgroundColor: '#3A3426' }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {ELEMENTOS_GNOSIS.map((t, i) => (
          <svg key={t} x={(i % cols) * w} y={Math.floor(i / cols) * h} width={w - 4} height={h - 4} viewBox="-500 -40 1000 1000" preserveAspectRatio="xMidYMid meet">
            <rect x={-500} y={-40} width={1000} height={1000} fill={i % 2 ? '#1E2352' : '#2A2E2A'} />
            <g transform="translate(-960 0)"><ElementoSVG {...{ tipo: t, x: 960, y: ['luz_espiritu', 'luz_divina', 'esfera_eon', 'chispa', 'estrellas_oro'].includes(t) ? 420 : ['rayos_luz', 'cadena', 'lluvia_gnosis'].includes(t) ? 40 : 820, s: ['templo', 'anillo_cielo', 'monte_gnosis'].includes(t) ? 0.5 : ['luz_espiritu', 'luz_divina'].includes(t) ? 0.6 : 0.8, f, props: {} }} /></g>
            <text x={-480} y={940} fontSize={64} fill="#FFF" stroke="#000" strokeWidth={3}>{t}</text>
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Prueba: React.FC<{ esc: Escena }> = ({ esc }) => {
  aplicarTema('gnosticas');
  const tl = { id: esc.id, from: 0, durationInFrames: 200, frases: [{ texto: { es: 'x' }, audio: {}, from: 0, dur: 200 }] };
  return <CalidadHD.Provider value={true}><EscenaMotor esc={esc} tl={tl} /></CalidadHD.Provider>;
};
const N = (como: string, x: number, extra: Record<string, unknown> = {}) => ({ id: como + x, como, x, rotulo: '', ...extra });
const quieta = { camara: { de: 0, a: 0, zoom: [1, 1] as [number, number] }, frases: [{ es: 'x', en: 'x' }], sinAstros: true };

/** Arriba: el Espíritu (solo luz), Barbelo, el Autógeno, las cuatro luces, Sofía (y apagada), el Salvador y la Epinoia. */
const escPleroma: Escena = {
  id: 'pleroma', fondo: 'pleroma', ...quieta,
  actores: [
    { ...N('espiritu_invisible', 960), y: 250, escala: 0.55 },
    N('barbelo_oficial', 130), N('autogeno_oficial', 330), N('harmozel_oficial', 530), N('oroiael_oficial', 700), N('daveithai_oficial', 1220), N('eleleth_oficial', 1390),
    N('sofia_oficial', 1580), { ...N('sofia_apagada_oficial', 1780), mira: 'izq' },
    { ...N('salvador_oficial', 880), escala: 0.9 }, { ...N('epinoia_oficial', 1050), escala: 0.9, mira: 'izq' },
  ] as Escena['actores'],
};
/** Las formas del Salvador ante Juan: niño, anciano, servidor, y el águila de luz. */
const escSalvador: Escena = {
  id: 'salvador', fondo: 'monte_desierto', ...quieta,
  actores: [
    N('juan_apostol_oficial', 220), { ...N('salvador_nino_oficial', 560), mira: 'izq' }, { ...N('salvador_anciano_oficial', 860), mira: 'izq' }, { ...N('salvador_servidor_oficial', 1160), mira: 'izq' },
    { ...N('salvador_oficial', 1460), mira: 'izq' }, { ...N('aguila_luz', 1720), y: 330, escala: 0.6, mira: 'izq' },
  ] as Escena['actores'],
};
/** Abajo: Yaldabaoth en su trono y los siete reyes con su cara de animal. */
const escGobernantes: Escena = {
  id: 'gobernantes', fondo: 'cielos', ...quieta,
  actores: [
    { ...N('yaldabaoth_oficial', 960), escala: 0.95, pasos: [{ en: 0, hace: 'habla' }] },
    N('athoth_oficial', 110), N('eloaiou_oficial', 280), N('astaphaios_oficial', 450), N('yao_oficial', 620),
    { ...N('sabaoth_oficial', 1330), mira: 'izq' }, { ...N('adonin_oficial', 1520), mira: 'izq' }, { ...N('sabbede_oficial', 1710), mira: 'izq' },
    { ...N('arconte', 1860), mira: 'izq', capa: 'fondo', props: { cara: 'oso', corona: true } },
  ] as Escena['actores'],
};
/** Los humanos: Adán en sus tres estados, Eva, Set, Noé, Juan, Arimanios y la serpiente del paraíso. */
const escHumanos: Escena = {
  id: 'humanos', fondo: 'paraiso_falso', ...quieta,
  actores: [
    N('adan_gnosis_oficial', 120), N('adan_gnosis_luz_oficial', 310), N('adan_gnosis_tierra_oficial', 500), { ...N('eva_gnosis_oficial', 680), mira: 'izq' },
    N('set_gnosis_oficial', 860), N('noe_gnosis_oficial', 1040), N('juan_apostol_oficial', 1220), { ...N('arimanios_oficial', 1400), mira: 'izq' },
    N('hombre_gnosis', 1570), { ...N('mujer_gnosis', 1730), mira: 'izq' }, { ...N('serpiente_paraiso', 1500), capa: 'fondo', escala: 0.6, mira: 'izq' },
  ] as Escena['actores'],
};
/** Toma de ejemplo: Sofía, avergonzada, esconde a Yaldabaoth en la nube luminosa con el trono. */
const escEjemplo: Escena = {
  id: 'ejemplo', fondo: 'nube_luz', camara: { de: 0, a: 0, zoom: [1, 1.04] }, frases: [{ es: 'x', en: 'x' }],
  elementos: [{ tipo: 'niebla', x: 960, y: 760 }],
  actores: [
    { ...N('yaldabaoth_oficial', 1060), escala: 0.85, props: { trono: false }, mira: 'izq' },
    { ...N('sofia_apagada_oficial', 420), pasos: [{ en: 0, hace: 'entristece' }] },
  ] as Escena['actores'],
};

/** Las caras de los gobernantes, en grande, sobre papiro. */
const Caras: React.FC = () => {
  aplicarTema('gnosticas');
  return (
    <AbsoluteFill style={{ backgroundColor: '#E8D9B0' }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {CARAS_ARCONTE.map((c, i) => (
          <g key={c} transform={`translate(${170 + (i % 6) * 316} ${Math.floor(i / 6) * 520 + 260}) scale(3)`}>
            <CabezaArconte cara={c} corona={i % 2 === 0} boca={i === 8} />
            <text x={-30} y={80} fontSize={18} fill="#1B1410">{c}</text>
          </g>
        ))}
        <Personaje x={1800} y={1060} s={0.9} piel="#6E6152" ropa="larga" lisa ropaColor="#3A2A26" tocado={null} peloCorto barba={false} collar={false} cabezaPropia adornos={{ cabeza: <CabezaArconte cara="leon" corona /> }} />
      </svg>
    </AbsoluteFill>
  );
};

/** Piezas de la serie: miniatura y portada de Instagram. */
const Piezas: React.FC = () => {
  const caja = (left: number, top: number, w: number, h: number, k: number, hijo: React.ReactNode) => <div style={{ position: 'absolute', left, top, width: w * k, height: h * k, overflow: 'hidden' }}><div style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative' }}>{hijo}</div></div>;
  return (
    <AbsoluteFill style={{ backgroundColor: '#222' }}>
      {caja(0, 0, 1280, 720, 0.75, <Miniatura titulo="THE SECRET BOOK OF JOHN" numero="1" heroe="sofia_oficial" rival="yaldabaoth_oficial" serie="gnosticas" />)}
      {caja(980, 0, 1080, 1350, 0.4, <PortadaIG titulo="The Secret Book of John" numero="1" temporada="SEASON 1" heroe="salvador_oficial" rival="juan_apostol_oficial" serie="gnosticas" />)}
      {caja(0, 560, 1280, 720, 0.4, <Miniatura titulo="YALDABAOTH" numero="4" heroe="yaldabaoth_oficial" serie="gnosticas" />)}
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <>
    <Composition id="gn-fondos" component={Fondos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="gn-elementos" component={Elementos} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="gn-pleroma" component={() => <Prueba esc={escPleroma} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="gn-salvador" component={() => <Prueba esc={escSalvador} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="gn-gobernantes" component={() => <Prueba esc={escGobernantes} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="gn-humanos" component={() => <Prueba esc={escHumanos} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="gn-escena" component={() => <Prueba esc={escEjemplo} />} durationInFrames={200} fps={24} width={1920} height={1080} />
    <Composition id="gn-caras" component={Caras} durationInFrames={10} fps={24} width={1920} height={1080} />
    <Composition id="gn-piezas" component={Piezas} durationInFrames={10} fps={24} width={1920} height={1080} />
  </>
));
