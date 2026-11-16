import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing } from "remotion";
import { along, mix, Mono, Packet, Stack, swap } from "../components/parts";
import type { Pt } from "../components/parts";

const TO_EDGE: Pt[] = [
  [710, 610],
  [610, 720],
];
const fade = (t: number) => Math.min(1, t * 12, (1 - t) * 12);

/** 9 · Your SSH gets in: the laptop connects through WARP and passes the Zero Trust policy. */
export const S09Ssh: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s9);
  const s = p(0.02, 0.16);
  const z = p(0.58, 0.64) * (1 - out);
  const g = p(0.66, 0.74);
  const e = swap(z, "CLOUDFLARE EDGE", "ZERO TRUST POLICY");
  const lap = mix(g, mix(s, color.textMuted, color.emphasis), color.success);
  const warp = p(0.3, 0.38) * (1 - out);
  const q1 = p(0.36, 0.56, ease.precise);
  const q2 = p(0.68, 0.88, Easing.linear);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Your SSH", "gets in"]} enter={at(0.64)} exit={exit} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        edge={{ stroke: mix(z, color.technical, color.success), label: e.label, check: e.second, labelOpacity: e.labelOpacity }}
        cfd={{ stroke: mix(g * (1 - out), color.technical, color.success) }}
        app={{ label: "APP", stroke: mix(s, color.emphasis, color.textMuted), opacity: lerp(1, 0.4, s) }}
        laptop={{ label: "LAPTOP", stroke: lap, opacity: lerp(0.4, 1, s) }}
        under={
          <>
            <Packet at={along(TO_EDGE, q1)} fill={color.emphasis} opacity={fade(q1)} />
            <Packet at={[L.cx, lerp(L.tunnel.top, L.tunnel.bottom, q2)]} fill={color.success} opacity={fade(q2)} label="ssh" />
          </>
        }
      >
        <g opacity={warp} transform={`translate(0 ${(1 - warp) * 16})`}>
          <rect x={757} y={496} width={116} height={48} rx={24} fill={color.bg} stroke={lap} strokeWidth={3} />
          <Mono x={815} y={520} size={26} fill={lap} weight={600}>
            WARP
          </Mono>
        </g>
      </Stack>
    </Stage>
  );
};
