// Imágenes del canal "Myths on Clay": foto de perfil y banner.
import React from 'react';
import { registerRoot, Composition, AbsoluteFill } from 'remotion';
import { C, TITULO, TEXTO, Personaje, Lenguetas, Meandro, FrisoPalmetas, suave, Borde, aplicarTema, TEMA, TextoRunico } from '../comun/vasija';
import { Miniatura } from '../comun/miniatura';
import { PortadaIG } from '../comun/portadaIG';


const Anfora: React.FC = () => (
  <g>
    <path d={suave([[-70, -330], [70, -330], [56, -270], [190, -190], [210, -40], [120, 110], [96, 150], [-96, 150], [-120, 110], [-210, -40], [-190, -190], [-56, -270]], true)} fill={C.negro} />
    <path d="M-56 -300 C -170 -300, -190 -200, -150 -160 M56 -300 C 170 -300, 190 -200, 150 -160" stroke={C.negro} strokeWidth={22} fill="none" />
    <Borde d="M-196 -150 L 196 -150" w={14} />
    <rect x={-150} y={-120} width={300} height={170} fill={C.barro} />
    <g transform="translate(0 46) scale(0.42)"><Personaje x={-60} y={0} accion="correr" fase={1} objeto="cana" barba capa={C.purpura} tocado="cinta" /></g>
    <Borde d="M-180 70 L 180 70" w={12} />
  </g>
);

const Perfil: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.barro }}>
    <svg viewBox="-400 -400 800 800" width="100%" height="100%">
      <defs><radialGradient id="pf" cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
      <rect x={-400} y={-400} width={800} height={800} fill="url(#pf)" />
      <circle r={360} fill="none" stroke={C.negro} strokeWidth={16} />
      <circle r={330} fill="none" stroke={C.negro} strokeWidth={4} strokeDasharray="14 10" />
      <g transform="translate(0 60) scale(0.95)"><Anfora /></g>
    </svg>
  </AbsoluteFill>
);

const Banner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.barro }}>
    <svg viewBox="0 0 2560 1440" width="100%" height="100%">
      <defs><radialGradient id="bn" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor={C.barroClaro} /><stop offset="100%" stopColor={C.barroOscuro} /></radialGradient></defs>
      <rect width={2560} height={1440} fill="url(#bn)" />
      <g transform="translate(0 512)"><Lenguetas y={0} desplaz={0} /></g><g transform="translate(2112 512)"><Lenguetas y={0} desplaz={0} /></g><g transform="translate(0 562) scale(1.4 0.7)"><Meandro y={8} desplaz={0} /></g>
      <g transform="translate(0 850) scale(1.2 0.75)"><FrisoPalmetas y={0} desplaz={0} /></g><line x1={0} x2={2560} y1={846} y2={846} stroke={C.negro} strokeWidth={5} />
      <g transform="translate(0 0)">
        <Personaje x={430} y={846} s={0.66} accion="caminar" fase={0.8} objeto="rayo" tocado="corona" capa={C.purpura} />
        <Personaje x={600} y={846} s={0.66} mujer objeto="lanza" tocado="casco" escudo />
        <Personaje x={1960} y={846} s={0.66} voltear objeto="tridente" barba />
        <Personaje x={2130} y={846} s={0.66} voltear accion="correr" fase={2} alas tocado="petaso" objeto="caduceo" barba={false} />
      </g>
    </svg>
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: C.crema, textShadow: `0 5px 0 ${C.negro}` }}>
      <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 120, letterSpacing: 14, marginTop: 40 }}>MYTHS ON CLAY</div>
      <div style={{ fontFamily: TEXTO, fontSize: 44, marginTop: 0 }}>Ancient myths, painted and animated like Greek vases</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// Miniatura de cada episodio: título grande + escena de vasija.
registerRoot(() => (
  <>
    <Composition id="perfil" component={Perfil} durationInFrames={1} fps={24} width={800} height={800} />
    <Composition id="banner" component={Banner} durationInFrames={1} fps={24} width={2560} height={1440} />
    <Composition id="portada-ig" component={PortadaIG as unknown as React.FC<Record<string, unknown>>} durationInFrames={1} fps={24} width={1080} height={1350} defaultProps={{ titulo: "THE ORIGIN OF THE WORLD", numero: "1", temporada: "SEASON 1 · ORIGINS", heroe: "zeus", rival: "cronos", serie: "griegas" }} />
    <Composition id="miniatura" component={Miniatura as unknown as React.FC<Record<string, unknown>>} durationInFrames={1} fps={24} width={1280} height={720} defaultProps={{ titulo: 'THE ORIGIN OF THE WORLD', numero: '1', heroe: { objeto: 'rayo', tocado: 'corona', capa: C.purpura, brazo: [115, 35] }, rival: { objeto: 'hoz', tocado: 'corona', canas: true, gigante: true } }} />
  </>
));
