import React from "react";
import { Headline } from "../../../components/Headline";
import { color } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing } from "remotion";
import { Check, Mono, Stack } from "../components/parts";

const LINES: readonly (readonly [string, number])[] = [
  ["public db port: none", 0.3],
  ["inbound connections: 0", 0.46],
  ["authorized access: ok", 0.62],
];
const TERM = { x: 110, y: 700, w: 860, h: 420 };

/** 13 · Outro: the terminal confirms each claim, then one amber statement. */
export const S13Outro: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p } = useBeat(SCENE.s13);
  const o = p(0.08, 0.18);
  const big = p(0.76, 0.86);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Private.", "Still reachable."]} enter={at(0.72)} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        opacity={1 - p(0.02, 0.12)}
        edge={{ stroke: color.success, label: "TRUSTED ONLY", check: true }}
        db={{ stroke: color.success }}
        pv={{ stroke: color.success, solid: 1, label: "FIREWALL · 5432 BLOCKED" }}
        app={{ label: "APP", stroke: color.success }}
        laptop={{ label: "LAPTOP", stroke: color.success }}
      >
        <Mono x={L.cx} y={L.labelY} size={34} fill={color.success}>
          db auth: on
        </Mono>
      </Stack>
      <g opacity={o * lerp(1, 0.4, p(0.74, 0.82))} transform={`translate(0 ${(1 - o) * 40})`}>
        <rect x={TERM.x} y={TERM.y} width={TERM.w} height={TERM.h} rx={24} fill={color.surface} stroke={color.line} strokeWidth={3} />
        <Mono x={TERM.x + 56} y={TERM.y + 90} size={38} anchor="start">
          {"$ " + "cloudflared tunnel run".slice(0, Math.round(22 * p(0.12, 0.26, Easing.linear)))}
        </Mono>
        {LINES.map(([text, t], i) => {
          const y = TERM.y + 190 + i * 72;
          const on = p(t, t + 0.05);
          return (
            <g key={text} opacity={on} transform={`translate(${(1 - on) * -16} 0)`}>
              <Check x={TERM.x + 74} y={y} size={30} stroke={color.success} />
              <Mono x={TERM.x + 116} y={y} size={36} fill={color.success} anchor="start">
                {text}
              </Mono>
            </g>
          );
        })}
      </g>
      <Mono x={L.cx} y={1320 + (1 - big) * 40} size={88} fill={color.emphasis} weight={600} opacity={big}>
        0 PUBLIC PORTS
      </Mono>
    </Stage>
  );
};
