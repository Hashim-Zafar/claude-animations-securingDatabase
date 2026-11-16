import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Dot, Mono, Stack } from "../components/parts";
import type { Pt } from "../components/parts";

const SCANNERS: Pt[] = [
  [90, 560],
  [990, 600],
  [100, 1480],
  [980, 1450],
];
const TARGET: Pt = [540, 1000];
/** The scanners' lines stop well short of the stack: there is nothing to reach. */
const REACH = 0.2;

/** 10 · Scanners find nothing: the stack fades back and the scanners from scene 2 come up empty. */
export const S10Nothing: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s10);
  const note = p(0.72, 0.8) * (1 - out);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Scanners find", "*nothing*"]} enter={at(0.64)} exit={exit} top={L.headTop} size={88} accent={color.success} />}>
      <Stack frame={f} opacity={lerp(1, 0.3, p(0.02, 0.16))} app={{ label: "APP", stroke: color.textMuted, opacity: 0.4 }} laptop={{ label: "LAPTOP", stroke: color.success }} />
      {SCANNERS.map((s, i) => {
        const o = p(0.1 + 0.03 * i, 0.18 + 0.03 * i) * (1 - out);
        const g = p(0.3 + 0.03 * i, 0.55 + 0.03 * i, ease.precise) * REACH;
        const lost = p(0.68 + 0.02 * i, 0.74 + 0.02 * i);
        const end: Pt = [lerp(s[0], TARGET[0], g), lerp(s[1], TARGET[1], g)];
        const len = Math.hypot(TARGET[0] - s[0], TARGET[1] - s[1]);
        const mark: Pt = [end[0] + ((TARGET[0] - s[0]) / len) * 30, end[1] + ((TARGET[1] - s[1]) / len) * 30];
        return (
          <g key={i}>
            <line x1={s[0]} y1={s[1]} x2={end[0]} y2={end[1]} stroke={color.danger} strokeWidth={3} strokeDasharray="12 12" opacity={0.8 * o} />
            <Dot at={s} fill={color.danger} opacity={o * lerp(1, 0.5, lost)} />
            <Mono x={mark[0]} y={mark[1]} size={48} fill={color.danger} weight={600} opacity={lost * (1 - out)}>
              ?
            </Mono>
          </g>
        );
      })}
      <rect x={230} y={903} width={620} height={64} rx={12} fill={color.bg} opacity={0.9 * note} />
      <Mono x={L.cx} y={935} size={34} fill={color.success} weight={600} opacity={note}>
        PostgreSQL · no public port
      </Mono>
    </Stage>
  );
};
