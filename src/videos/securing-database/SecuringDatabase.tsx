import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Backdrop } from "../../components/Backdrop";
import { matchCut } from "./components/matchCut";
import type { SceneProps } from "./components/Stage";
import { S01Problem } from "./scenes/S01Problem";
import { S02Knock } from "./scenes/S02Knock";
import { S03Firewall } from "./scenes/S03Firewall";
import { S04NoDoor } from "./scenes/S04NoDoor";
import { S05Tunnel } from "./scenes/S05Tunnel";
import { S06DialsOut } from "./scenes/S06DialsOut";
import { S07Established } from "./scenes/S07Established";
import { S08App } from "./scenes/S08App";
import { S09Ssh } from "./scenes/S09Ssh";
import { S10Nothing } from "./scenes/S10Nothing";
import { S11NotEnough } from "./scenes/S11NotEnough";
import { S12Lock } from "./scenes/S12Lock";
import { S13Outro } from "./scenes/S13Outro";
import { MATCH, SCENE } from "./timeline";
import type { SceneKey } from "./timeline";

export type SceneEntry = { readonly key: SceneKey; readonly id: string; readonly name: string; readonly component: React.FC<SceneProps> };

/** The 13 scenes in order. Root.tsx registers each one as its own composition too. */
export const SCENES: SceneEntry[] = [
  { key: "s1", id: "S01-Problem", name: "1 · The problem", component: S01Problem },
  { key: "s2", id: "S02-AnyoneCanKnock", name: "2 · Anyone can knock", component: S02Knock },
  { key: "s3", id: "S03-FirewallHelps", name: "3 · A firewall helps", component: S03Firewall },
  { key: "s4", id: "S04-NoDoor", name: "4 · What if there was no door?", component: S04NoDoor },
  { key: "s5", id: "S05-CloudflareTunnel", name: "5 · Introduce Cloudflare Tunnel", component: S05Tunnel },
  { key: "s6", id: "S06-DialsOut", name: "6 · It dials out", component: S06DialsOut },
  { key: "s7", id: "S07-TheTunnel", name: "7 · The tunnel", component: S07Established },
  { key: "s8", id: "S08-AppGetsIn", name: "8 · Your app gets in", component: S08App },
  { key: "s9", id: "S09-SshGetsIn", name: "9 · Your SSH gets in", component: S09Ssh },
  { key: "s10", id: "S10-ScannersFindNothing", name: "10 · Scanners find nothing", component: S10Nothing },
  { key: "s11", id: "S11-TunnelNotEnough", name: "11 · But the tunnel isn't enough", component: S11NotEnough },
  { key: "s12", id: "S12-LockTheTunnel", name: "12 · Lock the tunnel too", component: S12Lock },
  { key: "s13", id: "S13-Outro", name: "13 · Outro", component: S13Outro },
];

/** The full vertical explainer: one centred stack, carried through 13 scenes with matched hand-offs. */
export const SecuringDatabase: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.map((scene, i) => {
        const Scene = scene.component;
        return (
          <React.Fragment key={scene.key}>
            {i > 0 ? <TransitionSeries.Transition presentation={matchCut()} timing={linearTiming({ durationInFrames: MATCH })} /> : null}
            <TransitionSeries.Sequence durationInFrames={SCENE[scene.key]} name={scene.name}>
              <Scene withBackdrop={false} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
