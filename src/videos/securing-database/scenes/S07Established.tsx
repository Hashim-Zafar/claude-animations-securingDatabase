import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing } from "remotion";
import { mix, Mono, Packet, Stack } from "../components/parts";

/** 7 · The tunnel: the connection stays open and encrypted, and traffic can route back through it. */
export const S07Established: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s7);
  const cool = p(0.02, 0.18);
  const q = p(0.72, 0.88, Easing.linear);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["The tunnel", "stays open"]} enter={at(0.66)} exit={exit} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        edge={{ stroke: mix(cool, color.text, color.technical) }}
        tunnel={{ stroke: mix(cool, color.emphasis, color.technical), split: p(0.3, 0.48, ease.precise), flow: f >= at(0.3), arrow: 1 - cool }}
        under={<Packet at={[L.cx, lerp(L.tunnel.top, L.tunnel.bottom, q)]} fill={color.success} opacity={Math.min(1, q * 10, (1 - q) * 10)} />}
      >
        <Mono x={640} y={935} size={34} fill={color.textMuted} anchor="start" opacity={p(0.42, 0.5) * (1 - p(0.68, 0.74))}>
          encrypted
        </Mono>
        <Mono x={640} y={935} size={34} fill={color.success} anchor="start" opacity={p(0.74, 0.8) * (1 - out)}>
          authorized
        </Mono>
      </Stack>
    </Stage>
  );
};
