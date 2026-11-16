import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, vertical } from "./design-system/tokens";
import { SCENES, SecuringDatabase } from "./videos/securing-database/SecuringDatabase";
import { SCENE, TOTAL_DURATION } from "./videos/securing-database/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* The full video, listed first so Studio opens on it. */}
      <Composition id="SecuringDatabase" component={SecuringDatabase} durationInFrames={TOTAL_DURATION} fps={FPS} width={vertical.width} height={vertical.height} />
      {/* Each scene on its own, for previewing and retiming in isolation. */}
      <Folder name="SecuringDatabase-Scenes">
        {SCENES.map((scene) => (
          <Composition
            key={scene.id}
            id={scene.id}
            component={scene.component}
            durationInFrames={SCENE[scene.key]}
            fps={FPS}
            width={vertical.width}
            height={vertical.height}
            defaultProps={{ withBackdrop: true }}
          />
        ))}
      </Folder>
    </>
  );
};
