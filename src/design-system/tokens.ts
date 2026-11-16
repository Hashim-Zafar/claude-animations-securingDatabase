import { Easing } from "remotion";
import { FONT_FAMILY } from "./fonts";

/** Semantic colour roles. Components use these, never raw hex values. */
export const color = {
  bg: "#202226",
  surface: "#2A2D32",
  line: "#3A3E45",
  text: "#F0EEE8",
  textMuted: "#8B929D",
  technical: "#72B7C5",
  emphasis: "#D6A45D",
  success: "#6DB58A",
  /** Failures only (dropped requests, a downed server). Muted to sit with the palette. */
  danger: "#CF6A5E",
} as const;

export const font = FONT_FAMILY;

/** House easing curves. No bounce anywhere. */
export const ease = {
  /** Text and reveals: fast in, long settle. */
  editorial: Easing.bezier(0.16, 1, 0.3, 1),
  /** Mechanical and camera movement. */
  precise: Easing.bezier(0.65, 0, 0.35, 1),
  /** Pressure building up. */
  accelerate: Easing.bezier(0.55, 0, 0.85, 0.35),
} as const;

export const FPS = 30;

/** Output formats. This video is vertical (Reels / TikTok); landscape is reserved for a later cut. */
export const format = {
  vertical: {
    width: 1080,
    height: 1920,
    /** Keep key content clear of the Reels / TikTok interface. */
    safe: { x: 80, top: 220, bottom: 340 },
  },
  landscape: {
    width: 1920,
    height: 1080,
    safe: { x: 96, top: 80, bottom: 80 },
  },
} as const;

export const vertical = {
  ...format.vertical,
  contentWidth: format.vertical.width - format.vertical.safe.x * 2,
} as const;
