import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { interpolate } from "remotion";
import { mix, Mono, Stack } from "../components/parts";

/** 6 · It dials out: one outbound line from cloudflared up to the Cloudflare edge. */
export const S06DialsOut: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s6);
  const edgeO = interpolate(f, [at(0.02), at(0.18), at(0.24), at(0.3)], [0, 0.5, 0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = p(0.66, 0.74);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["It dials", "*out*"]} enter={at(0.62)} exit={exit} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        edge={{ opacity: edgeO, stroke: mix(p(0.62, 0.68), color.textMuted, color.text) }}
        tunnel={{ stroke: color.emphasis, grow: p(0.32, 0.62, ease.precise), split: 0, flow: false, arrow: 1 }}
      >
        <Mono x={lerp(630, 600, tag)} y={935} size={34} fill={color.emphasis} anchor="start" opacity={tag * (1 - out)}>
          outbound
        </Mono>
      </Stack>
    </Stage>
  );
};
