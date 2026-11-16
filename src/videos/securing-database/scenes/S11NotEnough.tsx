import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing } from "remotion";
import { along, mix, Mono, Packet, Stack, typed } from "../components/parts";
import type { ClientState, Pt } from "../components/parts";

/** Unknown device → edge → down the tunnel → cloudflared → database. */
const ROUTE: Pt[] = [
  [710, 610],
  [610, 720],
  [540, 820],
  [540, 1050],
  [540, 1140],
  [540, 1190],
];
/** Fractions of ROUTE at which the packet enters the tunnel, cloudflared and the database. */
const ENTER = { tunnel: 0.42, cfd: 0.78, db: 0.92 };

/** 11 · But the tunnel isn't enough: with a weak policy, an unknown device is routed straight in. */
export const S11NotEnough: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit, out } = useBeat(SCENE.s11);
  const up = p(0.02, 0.12);
  const ask = p(0.08, 0.24, Easing.linear);
  const flip = p(0.36, 0.42);
  const u = p(0.4, 0.52);
  const q = p(0.66, 0.86, ease.precise);
  const label = flip >= 0.5 ? "POLICY: ALLOW ALL" : ask < 0.5 ? typed("CLOUDFLARE EDGE", 1 - 2 * ask) : typed("WHO IS ALLOWED?", 2 * ask - 1);
  const laptop: ClientState =
    f < at(0.3)
      ? { label: "LAPTOP", stroke: color.success, opacity: 1 - up }
      : { label: "UNKNOWN", stroke: color.danger, opacity: u, dy: -(1 - u) * 40, line: p(0.46, 0.56) };
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["But the tunnel", "isn’t enough"]} enter={at(0.6)} exit={exit} top={L.headTop} size={84} />}>
      <Stack
        frame={f}
        opacity={lerp(0.3, 1, up)}
        edge={{ stroke: mix(flip, mix(ask, color.technical, color.emphasis), color.danger), label, labelOpacity: Math.abs(1 - 2 * flip) }}
        tunnel={{ stroke: mix((q - ENTER.tunnel) / 0.1, color.technical, color.danger) }}
        cfd={{ stroke: mix((q - ENTER.cfd) / 0.08, color.technical, color.danger) }}
        db={{ stroke: mix((q - ENTER.db) / 0.08, color.technical, color.danger) }}
        app={{ label: "APP", stroke: color.textMuted, opacity: lerp(0.4, 0.3, up) }}
        laptop={laptop}
        under={<Packet at={along(ROUTE, q)} fill={color.danger} opacity={Math.min(1, q * 12, (1 - q) * 12)} />}
      >
        <Mono x={L.cx} y={L.labelY} size={40} fill={color.danger} weight={600} opacity={p(0.88, 0.94) * (1 - out)}>
          at risk
        </Mono>
      </Stack>
    </Stage>
  );
};
