import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { interpolate } from "remotion";
import { Db, Dot, mix, Mono } from "../components/parts";
import type { Pt } from "../components/parts";

/** Scanner start points: the first sits on the axis, the rest come in from the frame edges. */
const SCANNERS: Pt[] = [
  [540, 560],
  [90, 620],
  [990, 650],
  [100, 1440],
  [980, 1420],
];
const TARGET: Pt = [540, 960];
/** How far each scanner's line travels toward the database. The lower two stop short of the port label. */
const REACH = [0.66, 0.66, 0.66, 0.5, 0.5];

/** 2 · Anyone can knock: scanners converge on the open port. */
export const S02Knock: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s2);
  const red = p(0.62, 0.68) * (1 - out);
  const a = at(0.62);
  const bump = interpolate(f, [a, a + 6, a + 12, a + 18, a + 24], [0, 1, 0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Anyone can", "knock"]} enter={at(0.56)} exit={exit} top={L.headTop} size={88} />}>
      {SCANNERS.map((s, i) => {
        const first = i === 0;
        const o = first ? p(0.05, 0.14) : p(0.28 + 0.03 * i, 0.36 + 0.03 * i) * (1 - out);
        const g = (first ? p(0.42, 0.6, ease.precise) : p(0.34 + 0.03 * i, 0.56 + 0.03 * i, ease.precise)) * REACH[i];
        return (
          <g key={i}>
            <line x1={s[0]} y1={s[1]} x2={lerp(s[0], TARGET[0], g)} y2={lerp(s[1], TARGET[1], g)} stroke={color.danger} strokeWidth={3} strokeDasharray="12 12" opacity={0.8 * o * (1 - out)} />
            <Dot at={s} fill={color.danger} opacity={o} />
          </g>
        );
      })}
      <Db y={L.db.centerY} stroke={mix(red, color.technical, color.danger)} sw={5 + 4 * bump} />
      <Mono x={L.cx} y={1130} size={52} fill={color.technical} weight={600} opacity={1 - p(0.62, 0.66)}>
        5432
      </Mono>
      <Mono x={L.cx} y={1130} size={52} fill={color.danger} weight={600} opacity={p(0.64, 0.68) * (1 - out)}>
        5432 OPEN
      </Mono>
    </Stage>
  );
};
