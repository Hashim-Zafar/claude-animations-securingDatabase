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

/** 3 · A firewall helps: the wall closes around the axis but leaves one allowed gap. */
export const S03Firewall: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s3);
  const dbY = lerp(L.db.centerY, L.db.y, p(0, 0.16, ease.precise));
  const gap = interpolate(f, [at(0.08), at(0.3), at(0.36), at(0.5)], [900, 360, 360, 120], { ...clamp, easing: ease.precise });
  const mark = p(0.5, 0.58) * (1 - out);
  const sideO = p(0.34, 0.4) * (1 - p(0.6, 0.66));
  const sideY = interpolate(f, [at(0.42), at(0.52), at(0.6)], [700, 975, 880], clamp);
  const crossO = p(0.52, 0.55) * (1 - p(0.6, 0.66));
  const down = p(0.68, 0.8, ease.precise);
  const probeY = lerp(560, 900, down) + (f > at(0.8) ? 6 * Math.sin((f - at(0.8)) / 5) : 0);
  const amber = p(0.72, 0.8) * (1 - out);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["A firewall helps", "but the door stays"]} enter={at(0.66)} exit={exit} top={L.headTop} size={80} />}>
      <Db y={dbY} stroke={mix(amber, color.technical, color.emphasis)} />
      <Wall gap={gap} opacity={p(0.08, 0.12)} />
      <rect x={L.cx - 60} y={L.wallY - 18} width={120} height={36} rx={6} fill="none" stroke={color.emphasis} strokeWidth={4} opacity={mark} />
      <Mono x={L.cx} y={L.wallY + 58} size={32} fill={color.emphasis} opacity={mark}>
        allow rule
      </Mono>
      {[240, 840].map((x) => (
        <g key={x}>
          <Dot at={[x, sideY]} fill={color.danger} opacity={sideO} />
          <Mono x={x + 46} y={L.wallY - 44} size={48} fill={color.danger} opacity={crossO}>
            ×
          </Mono>
        </g>
      ))}
      <line x1={L.cx} y1={probeY + 14} x2={L.cx} y2={L.wallY - 18} stroke={color.danger} strokeWidth={3} strokeDasharray="12 12" opacity={p(0.78, 0.84) * (1 - out)} />
      <Dot at={[L.cx, probeY]} fill={color.danger} opacity={1 - out} />
      <Mono x={L.cx} y={L.labelY} size={34} fill={color.emphasis} opacity={p(0.76, 0.84) * (1 - out)}>
        still publicly reachable
      </Mono>
    </Stage>
  );
};
