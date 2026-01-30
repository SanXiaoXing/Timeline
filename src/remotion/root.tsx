import React from 'react';
import { Composition } from 'remotion';
import { AppleIntro } from './scenes/AppleIntro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppleIntro"
        component={AppleIntro}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          projectName: 'Timeline',
          author: 'SanXiaoXing'
        }}
      />
    </>
  );
};

