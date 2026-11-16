import React from "react";
import { Headline } from "../../../components/Headline";
import { color, ease } from "../../../design-system/tokens";
import { lerp } from "../../../lib/motion";
import { L } from "../layout";
import { SCENE } from "../timeline";
import { Stage, useBeat } from "../components/Stage";
import type { SceneProps } from "../components/Stage";
import { Easing, interpolate } from "remotion";
import { LaptopSlot, mix, Mono, Stack, swap, typed } from "../components/parts";

/** 12 · Lock the tunnel too: three locks, top to bottom — the edge, the database, the firewall. */
export const S12Lock: React.FC<SceneProps> = ({ withBackdrop }) => {
  const { f, at, p, exit } = useBeat(SCENE.s12);
  const trust = p(0.04, 0.16);
  const heal = p(0.1, 0.24);
  const appOn = p(0.08, 0.2);
  const away = p(0.2, 0.32, ease.accelerate);
  const gone = 1 - p(0.24, 0.32);
  const l = p(0.3, 0.42);
  const auth = p(0.4, 0.46);
  const bump = interpolate(f, [at(0.4), at(0.43), at(0.48)], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wall = p(0.7, 0.8);
  const e = swap(trust, "POLICY: ALLOW ALL", "TRUSTED ONLY");
  const pv = swap(wall, "PRIVATE NETWORK", "FIREWALL · 5432 BLOCKED");
  const healed = mix(heal, color.danger, color.technical);
  return (
    <Stage withBackdrop={withBackdrop} headline={<Headline lines={["Lock the", "tunnel too"]} enter={at(0.66)} exit={exit} top={L.headTop} size={88} />}>
      <Stack
        frame={f}
        edge={{ stroke: mix(trust, color.danger, color.success), label: e.label, check: e.second, labelOpacity: e.labelOpacity }}
        tunnel={{ stroke: healed }}
        cfd={{ stroke: healed }}
        db={{ stroke: mix(wall, mix(auth, healed, color.emphasis), color.success), sw: 5 + 3 * bump }}
        pv={{ stroke: mix(wall, color.textMuted, color.success), solid: wall, label: pv.label, labelOpacity: pv.labelOpacity }}
        app={{ label: "APP", stroke: mix(appOn, color.textMuted, color.success), opacity: lerp(0.3, 1, appOn) }}
        laptop={{ label: "LAPTOP", stroke: color.success, opacity: l, dy: -(1 - l) * 40, line: p(0.36, 0.46) }}
      >
        <LaptopSlot state={{ label: "UNKNOWN", stroke: color.danger, opacity: gone, dx: 420 * away }} />
        <Mono x={872 + 420 * away} y={565} size={52} fill={color.danger} weight={600} opacity={p(0.12, 0.16) * gone}>
          ×
        </Mono>
        <Mono x={L.cx} y={L.labelY} size={34} fill={mix(wall, color.emphasis, color.success)}>
          {typed("db auth: on", p(0.44, 0.58, Easing.linear))}
        </Mono>
      </Stack>
    </Stage>
  );
};
