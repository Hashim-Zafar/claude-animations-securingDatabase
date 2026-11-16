import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { interpolate } from "remotion";
import { along, mix, Mono, Packet, Stack, swap } from "../components/parts";
import type { Pt } from "../components/parts";

/** App → edge → down the tunnel → cloudflared → database. */
const ROUTE: Pt[] = [
  [370, 610],
  [470, 720],
  [540, 820],
  [540, 1050],
  [540, 1140],
  [540, 1190],
];
const fade = (t: number) => Math.min(1, t * 12, (1 - t) * 12);

/** 8 · Your app gets in: an authorized query rides down the tunnel and rows ride back. */
export const S08App: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s8);
  const a = p(0.04, 0.18);
  const auth = p(0.36, 0.4) * (1 - p(0.58, 0.64));
  const e = swap(auth, "CLOUDFLARE EDGE", "AUTHORIZED");
  const q = p(0.34, 0.62, ease.precise);
  const r = p(0.68, 0.9, ease.precise);
  const blink = interpolate(f, [at(0.62), at(0.65), at(0.7)], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Your app", "gets in"]} enter={at(0.64)} exit={exit} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        edge={{ stroke: mix(auth, color.technical, color.success), label: e.label, check: e.second, labelOpacity: e.labelOpacity }}
        db={{ stroke: mix(blink, color.technical, color.text), sw: 5 + 3 * blink }}
        app={{ label: "APP", stroke: color.emphasis, opacity: a, dy: -(1 - a) * 40, line: p(0.1, 0.22) }}
        laptop={{ label: "LAPTOP", stroke: color.textMuted, opacity: 0.4 * p(0.12, 0.26) }}
        under={
          <>
            <Packet at={along(ROUTE, q)} fill={color.emphasis} opacity={fade(q)} label="query" />
            <Packet at={along(ROUTE, 1 - r)} fill={color.success} opacity={fade(r)} label="rows" />
          </>
        }
      >
        <Mono x={L.cx} y={L.labelY} size={34} fill={color.success} opacity={p(0.74, 0.82) * (1 - out)}>
          5432 not public
        </Mono>
      </Stack>
    </Stage>
  );
};
