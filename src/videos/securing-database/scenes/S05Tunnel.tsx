import React from "react";
import { Headline } from "../../../components/Headline";
import { color } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { mix, Mono, Stack, Wall } from "../components/parts";

/** 5 · Introduce Cloudflare Tunnel: the private network, then the cloudflared connector. */
export const S05Tunnel: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s5);
  const wake = p(0.04, 0.18);
  const c = p(0.62, 0.72);
  return (
    <Stage
      withBackdrop={withBackdrop}
      headline={<Headline lines={["That’s where", "*Cloudflare Tunnel*", "comes in"]} enter={at(0.3)} exit={exit} top={L.headTop} size={76} accent={color.technical} />}
    >
      <Stack
        frame={f}
        edge={{ opacity: 0 }}
        tunnel={{ grow: 0 }}
        pv={{ opacity: p(0.08, 0.24) }}
        db={{ stroke: mix(wake, color.textMuted, color.technical), opacity: lerp(0.45, 1, wake) }}
        cfd={{ opacity: c, rise: (1 - c) * 40, stroke: mix(1 - out, color.technical, color.emphasis), link: p(0.7, 0.8) }}
      >
        <Mono x={L.cx} y={L.cfd.y - 30} size={30} fill={color.emphasis} opacity={p(0.7, 0.78) * (1 - out)}>
          small connector
        </Mono>
      </Stack>
      <Wall gap={0} opacity={1 - p(0.02, 0.16)} />
    </Stage>
  );
};
