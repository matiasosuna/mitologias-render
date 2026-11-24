// Personajes v7 (v6 + mejoras del muñeco del tarot, src/munecos2 de hermes-videos): v6 arriba y v7 abajo.
// Láminas en la nube: gh workflow run laminas.yml -R matiasosuna/mitologias-render -f ids='v7.tsx:v7-nordicos,v7.tsx:v7-griegos,v7.tsx:v7-egipcios,v7.tsx:v7-varios,v7.tsx:v7-poses,v7.tsx:v7-caras,v7.tsx:v7-andar'
//   v7-nordicos / v7-griegos / v7-egipcios = seis oficiales (el último caminando) · v7-caras = caras de cerca · v7-andar = ciclo de paso de Odín
import React from 'react';
import { Composition, registerRoot, useCurrentFrame, AbsoluteFill } from 'remotion';
import { aplicarTema, CalidadHD, EstiloPJ, TEMA, TITULO, type EstiloPersonaje } from '../comun/vasija';
import { ELENCO, DibujarActor, type Estado } from '../motor/elenco';

const estado = (x: number, y: number, s: number, extra: Partial<Estado> = {}): Estado => ({
  x, y, s, voltear: false, opacity: 1, accion: 'parado', volando: false, boca: false, rot: 0, brillo: 0, objeto: undefined, temblor: 0, ...extra,
});
const anda = (andado: number): Partial<Estado> => ({ accion: 'caminar', paso: { andado, d: 60, marcha: 1 } });

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="halo"><stop offset="0%" stopColor="#FFD27A" stopOpacity={0.85} /><stop offset="45%" stopColor="#FF9A3C" stopOpacity={0.3} /><stop offset="100%" stopColor="#FF9A3C" stopOpacity={0} /></radialGradient>
    <radialGradient id="haloBlanco"><stop offset="0%" stopColor="#FFF6DD" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF6DD" stopOpacity={0} /></radialGradient>
  </defs>
);
const Rotulo: React.FC<{ y: number; t: string }> = ({ y, t }) => <text x={24} y={y} fontFamily={TITULO} fontWeight={700} fontSize={34} fill="#FFF" stroke="#000" strokeWidth={5} style={{ paintOrder: 'stroke' }}>{t}</text>;

const Fila: React.FC<{ estilo: EstiloPersonaje; ids: string[]; y: number; f: number; caminaUltimo?: boolean }> = ({ estilo, ids, y, f, caminaUltimo }) => (
  <EstiloPJ.Provider value={estilo}>
    {ids.map((id, i) => {
      const ficha = ELENCO[id];
      if (!ficha) return <text key={id} x={160 + i * 320} y={y - 200} fontSize={30} fill="red">{`falta ${id}`}</text>;
      const e = estado(170 + i * 316, y, 0.98, caminaUltimo && i === ids.length - 1 ? anda(48 + f * 2) : {});
      return <g key={id}><DibujarActor ficha={ficha} e={e} f={f} /><text x={170 + i * 316} y={y + 34} textAnchor="middle" fontSize={24} fill="#FFF" stroke="#000" strokeWidth={4} style={{ paintOrder: 'stroke' }}>{id}</text></g>;
    })}
  </EstiloPJ.Provider>
);

const Comparacion: React.FC<{ serie: string; ids: string[] }> = ({ serie, ids }) => {
  aplicarTema(serie);
  const f = useCurrentFrame(), [c0, c1, c2] = TEMA.cielos.barro;
  return (
    <AbsoluteFill>
      <CalidadHD.Provider value={true}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Defs />
          <rect width={1920} height={540} fill={c1} /><rect y={540} width={1920} height={540} fill={c0} />
          <rect y={496} width={1920} height={8} fill={c2} /><rect y={1036} width={1920} height={8} fill={c2} />
          <Fila estilo="v6" ids={ids} y={500} f={f} caminaUltimo />
          <Fila estilo="v7" ids={ids} y={1040} f={f} caminaUltimo />
          <Rotulo y={44} t="v6 (antes)" /><Rotulo y={584} t="v7" />
        </svg>
      </CalidadHD.Provider>
    </AbsoluteFill>
  );
};

/** Caras de cerca: cada personaje recortado a la cabeza y el pecho (v6 arriba, v7 abajo). */
const Caras: React.FC = () => {
  aplicarTema('nordicas');
  const f = useCurrentFrame();
  const ids = ['odin_oficial', 'thor_oficial', 'freya_oficial', 'zeus_oficial', 'isis_oficial'];
  const w = 1920 / ids.length;
  return (
    <AbsoluteFill style={{ backgroundColor: '#D9CBB0' }}>
      <CalidadHD.Provider value={true}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Defs />
          {(['v6', 'v7'] as EstiloPersonaje[]).map((est, r) => ids.map((id, i) => (
            <svg key={est + id} x={i * w + 4} y={r * 540 + 4} width={w - 8} height={532} viewBox="-130 -470 260 340">
              <rect x={-130} y={-470} width={260} height={340} fill={r ? '#EFE6D2' : '#E3D6BC'} />
              <EstiloPJ.Provider value={est}>{ELENCO[id] && <DibujarActor ficha={ELENCO[id]} e={estado(0, 0, 1, est === 'v7' ? { boca: true, bocaK: 0.7, hablando: true } : {})} f={f} />}</EstiloPJ.Provider>
              <text x={-122} y={-446} fontSize={16} fill="#000">{`${est === 'v6' ? 'v6' : 'v7'} · ${id}`}</text>
            </svg>
          )))}
        </svg>
      </CalidadHD.Provider>
    </AbsoluteFill>
  );
};

/** Ciclo de paso de Odín: seis momentos del paso (v6 arriba, v7 abajo). */
const Andar: React.FC = () => {
  aplicarTema('nordicas');
  const f = useCurrentFrame();
  const fila = (est: EstiloPersonaje, y: number) => (
    <EstiloPJ.Provider value={est}>
      {Array.from({ length: 6 }, (_, i) => <g key={i}><DibujarActor ficha={ELENCO.odin_oficial} e={estado(170 + i * 316, y, 0.98, anda(i * 34))} f={f} /></g>)}
    </EstiloPJ.Provider>
  );
  const [c0, c1, c2] = TEMA.cielos.barro;
  return (
    <AbsoluteFill>
      <CalidadHD.Provider value={true}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Defs />
          <rect width={1920} height={540} fill={c1} /><rect y={540} width={1920} height={540} fill={c0} />
          <rect y={496} width={1920} height={8} fill={c2} /><rect y={1036} width={1920} height={8} fill={c2} />
          {fila('v6', 500)}{fila('v7', 1040)}
          <Rotulo y={44} t="v6 (antes)" /><Rotulo y={584} t="v7" />
        </svg>
      </CalidadHD.Provider>
    </AbsoluteFill>
  );
};

/** Poses: sentados, arrodillado y un niño (v6 arriba, v7 abajo). */
const Poses: React.FC = () => {
  aplicarTema('nordicas');
  const f = useCurrentFrame();
  const P: [string, Partial<Estado>][] = [['freya_oficial', { sentado: 1 }], ['sigurd_oficial', { sentado: 1 }], ['thor_oficial', { arrodillado: 1 }], ['helgi_nino_oficial', {}], ['frigg_oficial', { sentado: 0.5 }], ['loki_oficial', { inclinar: 18 }]];
  const fila = (est: EstiloPersonaje, y: number) => (
    <EstiloPJ.Provider value={est}>
      {P.map(([id, ex], i) => ELENCO[id] ? <g key={id}><DibujarActor ficha={ELENCO[id]} e={estado(170 + i * 316, y, 0.98, ex)} f={f} /><text x={170 + i * 316} y={y + 34} textAnchor="middle" fontSize={24} fill="#FFF" stroke="#000" strokeWidth={4} style={{ paintOrder: 'stroke' }}>{id}</text></g> : <text key={id} x={170 + i * 316} y={y - 200} fontSize={30} fill="red">{`falta ${id}`}</text>)}
    </EstiloPJ.Provider>
  );
  const [c0, c1, c2] = TEMA.cielos.barro;
  return (
    <AbsoluteFill>
      <CalidadHD.Provider value={true}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <Defs />
          <rect width={1920} height={540} fill={c1} /><rect y={540} width={1920} height={540} fill={c0} />
          <rect y={496} width={1920} height={8} fill={c2} /><rect y={1036} width={1920} height={8} fill={c2} />
          {fila('v6', 500)}{fila('v7', 1040)}
          <Rotulo y={44} t="v6 (antes)" /><Rotulo y={584} t="v7" />
        </svg>
      </CalidadHD.Provider>
    </AbsoluteFill>
  );
};

const NORDICOS = ['odin_oficial', 'thor_oficial', 'freya_oficial', 'tyr_oficial', 'baldr_oficial', 'odin_oficial'];
const GRIEGOS = ['zeus_oficial', 'hera_oficial', 'atenea_oficial', 'apolo_oficial', 'hades_oficial', 'poseidon_oficial'];
const EGIPCIOS = ['ra_oficial', 'isis_oficial', 'osiris_oficial', 'anubis_oficial', 'hathor_oficial', 'thoth_oficial'];
/** Piezas detrás de la cabeza (melenas, nimbo, luna, halo, sol): tienen que seguir a la cabeza nueva. */
const VARIOS = ['hel_oficial', 'sofia_oficial', 'hina_oficial', 'coyolxauhqui_oficial', 'kali_oficial', 'sol_oficial'];

registerRoot(() => (
  <>
    <Composition id="v7-nordicos" component={() => <Comparacion serie="nordicas" ids={NORDICOS} />} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-griegos" component={() => <Comparacion serie="griegas" ids={GRIEGOS} />} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-egipcios" component={() => <Comparacion serie="egipcias" ids={EGIPCIOS} />} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-varios" component={() => <Comparacion serie="nordicas" ids={VARIOS} />} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-poses" component={Poses} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-caras" component={Caras} durationInFrames={120} fps={24} width={1920} height={1080} />
    <Composition id="v7-andar" component={Andar} durationInFrames={120} fps={24} width={1920} height={1080} />
  </>
));
