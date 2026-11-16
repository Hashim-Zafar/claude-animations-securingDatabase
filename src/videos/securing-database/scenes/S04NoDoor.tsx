import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { interpolate } from "remotion";
import { Db, Dot, mix, Mono, Wall } from "../components/parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 4 · What if there was no door? The gap seals and everything bounces off. */
export const S04NoDoor: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s4);
  const dim = p(0.66, 0.74);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["What if there", "was no door?"]} enter={at(0.64)} exit={exit} top={L.headTop} size={88} />}>
      <Db y={L.db.y} stroke={mix(dim, color.technical, color.textMuted)} opacity={lerp(1, 0.45, dim)} />
      <Wall gap={lerp(120, 0, p(0.02, 0.14, ease.precise))} />
      {[360, 540, 720].map((x, i) => {
        const a = 0.3 + 0.05 * i;
        const y = interpolate(f, [at(a), at(a + 0.12), at(a + 0.2)], [600, 975, 870], clamp);
        const gone = 1 - p(a + 0.2, a + 0.26);
        return (
          <g key={x}>
            <Dot at={[x, y]} fill={color.danger} opacity={p(a - 0.04, a) * gone} />
            <Mono x={x + 46} y={L.wallY - 44} size={48} fill={color.danger} opacity={p(a + 0.12, a + 0.14) * gone}>
              ×
            </Mono>
          </g>
        );
      })}
      <Mono x={L.cx} y={L.labelY} size={44} fill={color.success} weight={600} opacity={p(0.7, 0.78) * (1 - out)}>
        0 INBOUND PORTS
      </Mono>
    </Stage>
  );
};
