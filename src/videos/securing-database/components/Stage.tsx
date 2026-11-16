import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../../../components/Backdrop";
import { ease, vertical } from "../../../design-system/tokens";
import { progress } from "../../../lib/motion";
import { MATCH } from "../timeline";

export type SceneProps = {
  /** Draw the graphite backdrop. Off inside the full video, which draws it once. */
  readonly withBackdrop?: boolean;
};

type EasingFn = (t: number) => number;

/**
 * Timing helpers for a scene of `duration` frames. Beats are written as
 * fractions (0–1) of the spoken part of the scene, so retiming a scene in
 * timeline.ts moves every beat with it.
 */
export const useBeat = (duration: number) => {
  const f = useCurrentFrame();
  const spoken = duration - MATCH;
  const at = (x: number) => Math.round(x * spoken);
  const p = (a: number, b: number, easing?: EasingFn) => progress(f, at(a), at(b), easing);
  /** Frame the headline lifts away. */
  const exit = spoken - 18;
  /** 0 → 1 just before the hand-off: the scene settles into the next scene's first frame. */
  const out = progress(f, spoken - 16, spoken - 2, ease.precise);
  return { f, at, p, exit, out };
};

/** A scene: optional backdrop, one full-frame SVG for the diagram, and the headline on top. */
export const Stage: React.FC<SceneProps & { readonly headline?: React.ReactNode; readonly children: React.ReactNode }> = ({ withBackdrop, headline, children }) => (
  <AbsoluteFill>
    {withBackdrop ? <Backdrop /> : null}
    <svg width={vertical.width} height={vertical.height} viewBox={`0 0 ${vertical.width} ${vertical.height}`} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
    {headline}
  </AbsoluteFill>
);
