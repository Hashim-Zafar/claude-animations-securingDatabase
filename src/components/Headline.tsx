import React from "react";
import { useCurrentFrame } from "remotion";
import { color, ease, font, vertical } from "../design-system/tokens";
import { progress } from "../lib/motion";

type HeadlineProps = {
  /** One string per line. Wrap words in *asterisks* to colour them with `accent`. */
  readonly lines: string[];
  /** Frame the first word starts rising. */
  readonly enter: number;
  /** Optional explicit start frame for each word, in reading order (overrides `stagger`). */
  readonly wordTimes?: number[];
  readonly stagger?: number;
  readonly exit?: number;
  /** Top of the text block in px (1080 × 1920 frame). */
  readonly top: number;
  readonly size?: number;
  readonly family?: string;
  readonly weight?: number;
  readonly fill?: string;
  readonly accent?: string;
  readonly letterSpacing?: string;
};

type Segment = { readonly text: string; readonly accent: boolean };
type Word = { readonly key: string; readonly segments: Segment[] };

/** Splits a line into words; `*…*` marks accented text and may cover part of a word (e.g. `LIVE*.*`). */
const parseLine = (line: string): Word[] => {
  let accent = false;
  return line
    .split(" ")
    .filter((w) => w.length > 0)
    .map((raw) => {
      const segments: Segment[] = [];
      raw.split("*").forEach((part, i) => {
        if (i > 0) {
          accent = !accent;
        }
        if (part.length > 0) {
          segments.push({ text: part, accent });
        }
      });
      return { key: raw, segments };
    });
};

/**
 * Centred editorial headline. Each word rises out of its own mask; the block lifts
 * away on exit. No underlines or decorative rules: emphasis comes from timing,
 * masking and colour only.
 */
export const Headline: React.FC<HeadlineProps> = ({
  lines,
  enter,
  wordTimes,
  stagger = 4,
  exit,
  top,
  size = 92,
  family = font.display,
  weight = 700,
  fill = color.text,
  accent = color.emphasis,
  letterSpacing = "-0.01em",
}) => {
  const frame = useCurrentFrame();
  if (frame < enter) {
    return null;
  }
  const out = exit === undefined ? 0 : progress(frame, exit, exit + 12, ease.precise);
  if (out >= 1) {
    return null;
  }

  let index = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: vertical.safe.x,
        top,
        width: vertical.contentWidth,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 1 - out,
        translate: `0px ${-32 * out}px`,
      }}
    >
      {lines.map((line) => (
        <div key={line} style={{ display: "flex", gap: "0.26em", fontSize: size, lineHeight: 1.04 }}>
          {parseLine(line).map((word) => {
            const i = index++;
            const start = wordTimes?.[i] ?? enter + i * stagger;
            const p = progress(frame, start, start + 16);
            return (
              <div key={`${word.key}-${i}`} style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
                <div
                  style={{
                    translate: `0px ${(1 - p) * 110}%`,
                    fontFamily: family,
                    fontWeight: weight,
                    letterSpacing,
                    color: fill,
                    whiteSpace: "nowrap",
                  }}
                >
                  {word.segments.map((s, si) => (
                    <span key={si} style={s.accent ? { color: accent } : undefined}>
                      {s.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
