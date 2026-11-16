import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing } from "remotion";
import { Db, mix, Mono } from "../components/parts";

const IP = "203.0.113.7:";
const PORT = "5432";

/** 1 · The problem: a lone database at the centre, then its public address. */
export const S01Problem: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { at, p, exit, out } = useBeat(SCENE.s1);
  const c = mix(p(0.6, 0.68) * (1 - out), color.technical, color.emphasis);
  const full = IP + PORT;
  // Types on, then drops the IP at the end so only the port carries into scene 2.
  const shown = full.slice(Math.round(IP.length * out), Math.round(full.length * p(0.3, 0.52, Easing.linear)));
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Your database", "has an *address*"]} enter={at(0.58)} exit={exit} top={L.headTop} size={88} />}>
      <Db y={L.db.centerY} stroke={c} draw={p(0.02, 0.24, ease.precise)} />
      <Mono x={L.cx} y={1130} size={52} fill={c} weight={600}>
        {shown}
      </Mono>
      <Mono x={L.cx} y={1210} size={38} fill={color.textMuted} opacity={p(0.72, 0.8) * (1 - out)}>
        publicly exposed
      </Mono>
    </Stage>
  );
};
