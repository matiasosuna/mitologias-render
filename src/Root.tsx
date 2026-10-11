import React from 'react';
import { Composition } from 'remotion';
import { Video, Timeline } from './comun/Video';
import guionGriegas01 from './griegas/01-origen/guion.json';
import tlGriegas01 from './griegas/01-origen/timeline.json';
import { ESCENAS as escGriegas01 } from './griegas/01-origen/escenas';
import { Pleyades } from './imagenes/Pleyades';

// Cada video nuevo se suma acá: guion + timeline (de `npm run narrar`) + escenas + música.
const VIDEOS = [
  { id: 'griegas-01-origen', guion: guionGriegas01, timeline: tlGriegas01 as Timeline, escenas: escGriegas01, musica: 'musica/lira-griega.wav' },
].map((v) => ({ ...v, Comp: () => <Video guion={v.guion} timeline={v.timeline} escenas={v.escenas} musica={v.musica} /> }));

export const Root: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={v.Comp} durationInFrames={v.timeline.total} fps={v.timeline.fps} width={1920} height={1080} />
    ))}
    <Composition id="pleyades" component={Pleyades} durationInFrames={1} fps={30} width={3840} height={2160} />
  </>
);
