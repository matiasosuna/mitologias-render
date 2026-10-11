// Registra una composición por video del guion visual (índice generado por scripts/motor-narrar.mjs).
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VideoMotor } from './VideoMotor';
import { VideoShort, tramoShort } from './Short';
import { ShortNativo } from './ShortNativo';
import { VideoVertical, CIERRE_VERTICAL, ParteVertical, CARTEL_PARTE } from './VideoVertical';
import { VIDEOS } from './indice';
import { DemoCalidad } from './DemoCalidad';
import { DemoPersonajes2 } from './DemoPersonajes2';
import { DemoBrazos } from './DemoBrazos';
import { DemoActuacion } from './DemoActuacion';
import type { GuionVisual, Timeline, Idioma } from './tipos';

registerRoot(() => (
  <>
    <Composition id="demo-actuacion" component={DemoActuacion} durationInFrames={320} fps={30} width={1920} height={1080} />
    <Composition id="demo-brazos" component={DemoBrazos} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="demo-personajes2" component={DemoPersonajes2} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="demo-calidad" component={DemoCalidad} durationInFrames={150} fps={30} width={1920} height={1080} />
    {VIDEOS.filter(({ guion }) => (guion as GuionVisual).formato === 'short').map(({ guion, timeline }) => (
      <Composition key={(guion as GuionVisual).id} id={(guion as GuionVisual).id} component={ShortNativo as unknown as React.FC<Record<string, unknown>>} durationInFrames={(timeline as Timeline).total} fps={(timeline as Timeline).fps} width={1080} height={1920} defaultProps={{ guion, timeline, idioma: 'en' as Idioma }} />
    ))}
    {VIDEOS.filter(({ guion }) => (guion as GuionVisual).formato !== 'short').map(({ guion, timeline }) => (
      <Composition key={`${(guion as GuionVisual).id}-vertical`} id={`${(guion as GuionVisual).id}-vertical`} component={VideoVertical as unknown as React.FC<Record<string, unknown>>} durationInFrames={(timeline as Timeline).total - (timeline as Timeline).outroFrames + CIERRE_VERTICAL * (timeline as Timeline).fps} fps={(timeline as Timeline).fps} width={1080} height={1920} defaultProps={{ guion, timeline }} />
    ))}
    {VIDEOS.filter(({ guion }) => (guion as GuionVisual).formato !== 'short').map(({ guion, timeline }) => (
      <Composition key={`${(guion as GuionVisual).id}-parte`} id={`${(guion as GuionVisual).id}-parte`} component={ParteVertical as unknown as React.FC<Record<string, unknown>>} durationInFrames={1} fps={(timeline as Timeline).fps} width={1080} height={1920} defaultProps={{ guion, timeline, desde: 0, hasta: 1, n: 1, de: 1 }}
        calculateMetadata={({ props }) => { const p = props as { desde: number; hasta: number; n: number; de: number }; return { durationInFrames: p.hasta - p.desde + (p.n < p.de ? Math.round(CARTEL_PARTE * (timeline as Timeline).fps) : 0) }; }} />
    ))}
    {VIDEOS.filter(({ guion }) => (guion as GuionVisual).formato !== 'short').map(({ guion, timeline }) => (
      <Composition
        key={(guion as GuionVisual).id}
        id={(guion as GuionVisual).id}
        component={VideoMotor as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={(timeline as Timeline).total}
        fps={(timeline as Timeline).fps}
        width={1920}
        height={1080}
        defaultProps={{ guion, timeline, idioma: null as Idioma | null }}
      />
    ))}
    {VIDEOS.flatMap(({ guion, timeline }) => ((guion as GuionVisual).shorts ?? []).map((_, n) => (
      <Composition
        key={`${(guion as GuionVisual).id}-short-${n + 1}`}
        id={`${(guion as GuionVisual).id}-short-${n + 1}`}
        component={VideoShort as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={tramoShort(guion as GuionVisual, timeline as Timeline, n).dur}
        fps={(timeline as Timeline).fps}
        width={1080}
        height={1920}
        defaultProps={{ guion, timeline, n, idioma: 'en' }}
      />
    )))}
  </>
));
