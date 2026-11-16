import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, vertical } from "../design-system/tokens";

const { width: W, height: H } = vertical;

/** Graphite environment: slowly drifting measurement grid and a soft vignette. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 240;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bd-minor" width={60} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${drift})`}>
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={color.line} strokeWidth={1} />
          </pattern>
          <pattern id="bd-major" width={240} height={240} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${drift})`}>
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={color.line} strokeWidth={1.5} />
          </pattern>
          <radialGradient id="bd-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="#000000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.55} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#bd-minor)" opacity={0.2} />
        <rect width={W} height={H} fill="url(#bd-major)" opacity={0.34} />
        <rect width={W} height={H} fill="url(#bd-vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
