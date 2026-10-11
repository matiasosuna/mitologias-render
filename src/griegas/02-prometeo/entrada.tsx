import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VideoVasija } from './video';
import guion from './guion.json';
import tl from './timeline.json';
import { ESCENAS } from './escenas';
const Comp = () => <VideoVasija guion={guion} timeline={tl as any} escenas={ESCENAS} numero="02" />;
registerRoot(() => <Composition id="griegas-02-prometeo" component={Comp} durationInFrames={tl.total} fps={30} width={1920} height={1080} />);
