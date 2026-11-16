import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { ease } from "../../../design-system/tokens";

type MatchCutProps = Record<string, never>;

/**
 * Joins two scenes whose last and first frames show the same stack in the same
 * place. The hand-off is a short blend between matching frames, so the video
 * reads as one continuous shot rather than a series of dissolves.
 */
const MatchCut: React.FC<TransitionPresentationComponentProps<MatchCutProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const p = ease.precise(presentationProgress);
  const opacity = presentationDirection === "entering" ? p : 1 - p;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const matchCut = (): TransitionPresentation<MatchCutProps> => ({
  component: MatchCut,
  props: {},
});
