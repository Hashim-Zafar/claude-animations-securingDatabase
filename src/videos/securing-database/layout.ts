/**
 * One centre axis. Every element of the video sits on x = 540 and the stack
 * reads top to bottom: headline, clients, Cloudflare edge, tunnel, cloudflared,
 * database. All values are px in the 1080 × 1920 frame.
 */
export const L = {
  cx: 540,
  headTop: 230,
  client: { y: 520, w: 240, h: 90, appX: 370, laptopX: 710 },
  edge: { y: 720, w: 520, h: 100 },
  tunnel: { top: 820, bottom: 1050 },
  cfd: { y: 1050, w: 380, h: 90 },
  /** Database cylinder: `y` is its resting top inside the private network, `centerY` its top when alone on screen. */
  db: { y: 1220, centerY: 870, rx: 110, ry: 30, h: 150 },
  pv: { x: 240, y: 990, w: 600, h: 550 },
  wallY: 1010,
  /** Status label under the database. */
  labelY: 1452,
} as const;

/** Where each client's line meets the top of the edge box. */
export const EDGE_PORT = { app: [470, L.edge.y], laptop: [610, L.edge.y] } as const;
