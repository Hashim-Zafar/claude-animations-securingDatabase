import { interpolate } from "remotion";
import { ease } from "../design-system/tokens";

type EasingFn = (t: number) => number;

/** 0 → 1 between two frames, clamped, with a house easing curve. */
export const progress = (
  frame: number,
  start: number,
  end: number,
  easing: EasingFn = ease.editorial,
): number =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Locale-independent thousands separator, so renders are identical on every machine. */
export const formatThousands = (n: number): string =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** SVG camera transform: point `focus` (world) is drawn at `screen`, magnified by `scale`. */
export const cameraTransform = (
  focus: { x: number; y: number },
  screen: { x: number; y: number },
  scale: number,
): string =>
  `translate(${screen.x} ${screen.y}) scale(${scale}) translate(${-focus.x} ${-focus.y})`;
