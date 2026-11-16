import React from "react";
import { interpolateColors } from "remotion";
import { color, font } from "../../../design-system/tokens";
import { EDGE_PORT, L } from "../layout";

export type Pt = readonly [number, number];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Blend two colours: 0 → a, 1 → b. */
export const mix = (p: number, a: string, b: string): string => interpolateColors(clamp01(p), [0, 1], [a, b]);

/** The first part of a string, for typing effects. */
export const typed = (s: string, p: number): string => s.slice(0, Math.round(s.length * clamp01(p)));

/** Cross-swap between two labels: the first fades out, the second fades in. */
export const swap = (w: number, a: string, b: string) => ({
  label: w < 0.5 ? a : b,
  labelOpacity: Math.abs(1 - 2 * clamp01(w)),
  second: w >= 0.5,
});

/** Point at fraction `t` (0–1) along a polyline, by distance. */
export const along = (pts: readonly Pt[], t: number): Pt => {
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let left = clamp01(t) * total;
  for (let i = 0; i < lens.length; i++) {
    if (left <= lens[i] || i === lens.length - 1) {
      const k = lens[i] === 0 ? 0 : Math.min(1, left / lens[i]);
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    left -= lens[i];
  }
  return pts[pts.length - 1];
};

/** 1 while a packet is in the open stretch of the tunnel, fading at both ends. */
export const inTunnel = (y: number): number =>
  clamp01((y - L.tunnel.top - 10) / 30) * clamp01((L.tunnel.bottom - 10 - y) / 30);

/** IBM Plex Mono advance width is 0.6 em. */
const MONO_ADVANCE = 0.6;

type MonoProps = {
  readonly x: number;
  /** Vertical centre of the text. */
  readonly y: number;
  readonly size?: number;
  readonly fill?: string;
  readonly opacity?: number;
  readonly anchor?: "start" | "middle" | "end";
  readonly weight?: number;
  readonly children: React.ReactNode;
};

export const Mono: React.FC<MonoProps> = ({ x, y, size = 34, fill = color.text, opacity = 1, anchor = "middle", weight = 500, children }) =>
  opacity <= 0 ? null : (
    <text x={x} y={y + size * 0.36} textAnchor={anchor} fill={fill} opacity={opacity} style={{ fontFamily: font.mono, fontWeight: weight, fontSize: size }}>
      {children}
    </text>
  );

/** A drawn tick, so it never depends on a font having the glyph. */
export const Check: React.FC<{ readonly x: number; readonly y: number; readonly size: number; readonly stroke: string; readonly opacity?: number }> = ({
  x,
  y,
  size,
  stroke,
  opacity = 1,
}) => (
  <path
    d={`M ${x - size * 0.45} ${y} L ${x - size * 0.12} ${y + size * 0.33} L ${x + size * 0.5} ${y - size * 0.38}`}
    fill="none"
    stroke={stroke}
    strokeWidth={size * 0.16}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={opacity}
  />
);

type LabelBoxProps = {
  readonly cx: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly label: string;
  readonly stroke: string;
  readonly opacity?: number;
  readonly size?: number;
  readonly check?: boolean;
  readonly labelOpacity?: number;
  readonly dx?: number;
  readonly dy?: number;
};

/** A surface box with a centred mono label, optionally followed by a tick. */
export const LabelBox: React.FC<LabelBoxProps> = ({ cx, y, w, h, label, stroke, opacity = 1, size = 32, check = false, labelOpacity = 1, dx = 0, dy = 0 }) => {
  if (opacity <= 0) {
    return null;
  }
  const textW = label.length * MONO_ADVANCE * size;
  const checkW = check ? size * 1.0 : 0;
  const gap = check ? size * 0.45 : 0;
  const x0 = cx - (textW + gap + checkW) / 2;
  return (
    <g opacity={opacity} transform={`translate(${dx} ${dy})`}>
      <rect x={cx - w / 2} y={y} width={w} height={h} rx={14} fill={color.surface} stroke={stroke} strokeWidth={4} />
      <g opacity={labelOpacity}>
        <Mono x={x0} y={y + h / 2} size={size} fill={stroke} anchor="start" weight={600}>
          {label}
        </Mono>
        {check ? <Check x={x0 + textW + gap + checkW / 2} y={y + h / 2} size={size * 0.85} stroke={stroke} /> : null}
      </g>
    </g>
  );
};

type DbProps = {
  /** Top of the cylinder. */
  readonly y: number;
  readonly stroke?: string;
  readonly opacity?: number;
  /** 0 → 1 traces the outline on. */
  readonly draw?: number;
  readonly sw?: number;
};

/** The database: a cylinder on the centre axis. */
export const Db: React.FC<DbProps> = ({ y, stroke = color.technical, opacity = 1, draw = 1, sw = 5 }) => {
  if (opacity <= 0 || draw <= 0) {
    return null;
  }
  const { rx, ry, h } = L.db;
  const x = L.cx;
  const body = `M ${x - rx} ${y} V ${y + h} A ${rx} ${ry} 0 0 0 ${x + rx} ${y + h} V ${y}`;
  const band = (yy: number) => `M ${x - rx} ${yy} A ${rx} ${ry} 0 0 0 ${x + rx} ${yy}`;
  return (
    <g opacity={opacity}>
      <path d={body} fill={color.surface} fillOpacity={draw} stroke={stroke} strokeWidth={sw} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      <path d={band(y + h / 3)} fill="none" stroke={stroke} strokeWidth={3} opacity={0.4 * draw} />
      <path d={band(y + (2 * h) / 3)} fill="none" stroke={stroke} strokeWidth={3} opacity={0.4 * draw} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color.surface} fillOpacity={draw} stroke={stroke} strokeWidth={sw} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    </g>
  );
};

/** The firewall: two halves that close around the centre axis. `gap` is the opening in px. */
export const Wall: React.FC<{ readonly gap: number; readonly opacity?: number }> = ({ gap, opacity = 1 }) => {
  const left = L.cx - gap / 2;
  const right = L.cx + gap / 2;
  if (opacity <= 0 || left <= 90) {
    return null;
  }
  return (
    <g opacity={opacity}>
      <rect x={90} y={L.wallY - 12} width={left - 90} height={24} rx={6} fill={color.textMuted} />
      <rect x={right} y={L.wallY - 12} width={990 - right} height={24} rx={6} fill={color.textMuted} />
    </g>
  );
};

/** A scanner, attacker or data packet. */
export const Dot: React.FC<{ readonly at: Pt; readonly fill: string; readonly opacity?: number; readonly r?: number }> = ({ at, fill, opacity = 1, r = 14 }) =>
  opacity <= 0 ? null : <circle cx={at[0]} cy={at[1]} r={r} fill={fill} opacity={opacity} />;

/** A packet travelling down or up the tunnel, with an optional label to its right. */
export const Packet: React.FC<{ readonly at: Pt; readonly fill: string; readonly opacity?: number; readonly label?: string }> = ({ at, fill, opacity = 1, label }) => (
  <g>
    <Dot at={at} fill={fill} opacity={opacity} r={17} />
    {label ? (
      <Mono x={640} y={at[1]} size={32} fill={fill} anchor="start" opacity={opacity * inTunnel(at[1])}>
        {label}
      </Mono>
    ) : null}
  </g>
);

export type ClientState = {
  readonly label: string;
  readonly stroke: string;
  readonly opacity?: number;
  readonly dx?: number;
  readonly dy?: number;
  /** 0 → 1 draws the line from the client down to the edge. */
  readonly line?: number;
};

const clientLine = (x: number, port: Pt, c: ClientState) => {
  const t = c.line ?? 1;
  if (t <= 0) {
    return null;
  }
  const y0 = L.client.y + L.client.h;
  return (
    <line
      x1={x}
      y1={y0}
      x2={x + (port[0] - x) * t}
      y2={y0 + (port[1] - y0) * t}
      stroke={c.stroke}
      strokeWidth={4}
      opacity={c.opacity ?? 1}
      transform={`translate(${c.dx ?? 0} 0)`}
    />
  );
};

const clientBox = (x: number, c: ClientState) => (
  <LabelBox cx={x} y={L.client.y} w={L.client.w} h={L.client.h} label={c.label} stroke={c.stroke} opacity={c.opacity ?? 1} size={30} dx={c.dx} dy={c.dy} />
);

/** A client in the laptop slot, for a second device that shares the slot for a moment. */
export const LaptopSlot: React.FC<{ readonly state: ClientState }> = ({ state }) => (
  <g>
    {clientLine(L.client.laptopX, EDGE_PORT.laptop, state)}
    {clientBox(L.client.laptopX, state)}
  </g>
);

type StackProps = {
  /** Current frame, for the flowing tunnel dashes. */
  readonly frame: number;
  readonly opacity?: number;
  readonly edge?: { readonly opacity?: number; readonly stroke?: string; readonly label?: string; readonly check?: boolean; readonly labelOpacity?: number };
  readonly tunnel?: { readonly stroke?: string; readonly grow?: number; readonly split?: number; readonly flow?: boolean; readonly arrow?: number };
  readonly cfd?: { readonly opacity?: number; readonly stroke?: string; readonly rise?: number; readonly link?: number };
  readonly db?: { readonly stroke?: string; readonly opacity?: number; readonly sw?: number };
  readonly pv?: { readonly opacity?: number; readonly stroke?: string; readonly label?: string; readonly labelOpacity?: number; readonly solid?: number };
  readonly app?: ClientState;
  readonly laptop?: ClientState;
  /** Packets: drawn under the boxes so they pass behind them. */
  readonly under?: React.ReactNode;
  readonly children?: React.ReactNode;
};

const TUNNEL_OFFSETS = [-54, -18, 18, 54];

/**
 * The whole centred stack: clients, Cloudflare edge, tunnel, cloudflared and
 * the database inside its private network. Scenes only change colours, labels
 * and which part has focus; nothing ever moves off the axis.
 */
export const Stack: React.FC<StackProps> = ({ frame, opacity = 1, edge = {}, tunnel = {}, cfd = {}, db = {}, pv = {}, app, laptop, under, children }) => {
  const tStroke = tunnel.stroke ?? color.technical;
  const grow = tunnel.grow ?? 1;
  const split = tunnel.split ?? 1;
  const flow = tunnel.flow ?? true;
  const yTop = L.tunnel.bottom - (L.tunnel.bottom - L.tunnel.top) * grow;
  const cStroke = cfd.stroke ?? color.technical;
  const cOpacity = cfd.opacity ?? 1;
  const link = cfd.link ?? 1;
  const pStroke = pv.stroke ?? color.textMuted;
  const solid = pv.solid ?? 0;
  const cfdBottom = L.cfd.y + L.cfd.h;
  const dbTop = L.db.y - L.db.ry;
  return (
    <g opacity={opacity}>
      <g opacity={pv.opacity ?? 1}>
        <rect x={L.pv.x} y={L.pv.y} width={L.pv.w} height={L.pv.h} rx={24} fill="none" stroke={pStroke} strokeWidth={4} strokeDasharray="18 14" opacity={1 - solid} />
        <rect x={L.pv.x} y={L.pv.y} width={L.pv.w} height={L.pv.h} rx={24} fill="none" stroke={pStroke} strokeWidth={5} opacity={solid} />
        <Mono x={L.cx} y={L.pv.y + L.pv.h - 38} size={28} fill={pStroke} opacity={pv.labelOpacity ?? 1} weight={600}>
          {pv.label ?? "PRIVATE NETWORK"}
        </Mono>
      </g>
      {grow > 0
        ? TUNNEL_OFFSETS.map((o) => (
            <line
              key={o}
              x1={L.cx + o * split}
              y1={yTop}
              x2={L.cx + o * split}
              y2={L.tunnel.bottom}
              stroke={tStroke}
              strokeWidth={5}
              strokeDasharray={flow ? "22 14" : undefined}
              strokeDashoffset={flow ? -frame * 2.4 : 0}
            />
          ))
        : null}
      {grow > 0 && (tunnel.arrow ?? 0) > 0 ? (
        <path d={`M ${L.cx - 22} ${yTop + 30} L ${L.cx} ${yTop + 4} L ${L.cx + 22} ${yTop + 30}`} fill="none" stroke={tStroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={tunnel.arrow} />
      ) : null}
      {app ? clientLine(L.client.appX, EDGE_PORT.app, app) : null}
      {laptop ? clientLine(L.client.laptopX, EDGE_PORT.laptop, laptop) : null}
      {link > 0 ? <line x1={L.cx} y1={cfdBottom} x2={L.cx} y2={cfdBottom + (dbTop - cfdBottom) * link} stroke={cStroke} strokeWidth={4} opacity={cOpacity} /> : null}
      {under}
      <LabelBox cx={L.cx} y={L.edge.y} w={L.edge.w} h={L.edge.h} label={edge.label ?? "CLOUDFLARE EDGE"} stroke={edge.stroke ?? color.technical} opacity={edge.opacity ?? 1} check={edge.check} labelOpacity={edge.labelOpacity} size={32} />
      <LabelBox cx={L.cx} y={L.cfd.y} w={L.cfd.w} h={L.cfd.h} label="cloudflared" stroke={cStroke} opacity={cOpacity} dy={cfd.rise ?? 0} size={36} />
      <Db y={L.db.y} stroke={db.stroke} opacity={db.opacity} sw={db.sw} />
      {app ? clientBox(L.client.appX, app) : null}
      {laptop ? clientBox(L.client.laptopX, laptop) : null}
      {children}
    </g>
  );
};
