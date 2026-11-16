/**
 * Single source of timing for the "Securing the database" explainer (30 fps).
 *
 * Scene lengths are estimated from the voiceover script's word count
 * (about 2.5 words per second plus a short breath). When the voiceover is
 * recorded, replace each value in SECONDS with the clip's real length and
 * every scene retimes itself: beats inside a scene are fractions of its length.
 */
export const FPS = 30;

/** The voiceover script, one entry per scene, in order. */
export const SCRIPT = {
  s1: "Your database has an address. And if it's publicly exposed, anyone on the internet can try to connect to it.",
  s2: "Scanners constantly search for exposed services. Your database port is no exception.",
  s3: "A firewall can restrict who connects. But you're still relying on rules that control access to a publicly reachable service.",
  s4: "What if your database didn't need to accept connections from the public internet at all?",
  s5: "That's where Cloudflare Tunnel comes in, using a small connector called cloudflared running inside your private network.",
  s6: "Instead of waiting for incoming connections, cloudflared initiates an outbound connection to Cloudflare.",
  s7: "That connection stays established and encrypted. Cloudflare can now route authorized traffic back through it.",
  s8: "An authorized application or device can reach your private network through Cloudflare, without exposing the database port publicly.",
  s9: "For your own remote access, your device can connect through WARP, with access controlled by your Zero Trust policies.",
  s10: "To an ordinary internet scanner, your PostgreSQL service has no publicly reachable port.",
  s11: "But remember: a tunnel alone doesn't decide who should have access. An exposed route or weak access policy can still put your private services at risk.",
  s12: "Restrict access to trusted users and devices. Keep database authentication enabled, and block public access to PostgreSQL at the firewall.",
  s13: "No publicly exposed database port. No unnecessary inbound connections. Your database stays private, while authorized access remains possible.",
} as const;

export type SceneKey = keyof typeof SCRIPT;

/** Spoken length of each scene in seconds (estimates until the voiceover exists). */
export const SECONDS: Record<SceneKey, number> = {
  s1: 8.8,
  s2: 6.0,
  s3: 8.8,
  s4: 6.8,
  s5: 8.0,
  s6: 6.4,
  s7: 7.2,
  s8: 8.4,
  s9: 8.4,
  s10: 6.4,
  s11: 10.8,
  s12: 8.8,
  s13: 8.4,
};

/**
 * Scene hand-offs are matched frames (the same stack in the same place on both
 * sides), blended over this many frames so the cut is invisible.
 */
export const MATCH = 10;

const frames = (key: SceneKey, last = false) => Math.round(SECONDS[key] * FPS) + (last ? 0 : MATCH);

/** Scene lengths in frames. Every scene but the last carries MATCH extra frames for its hand-off. */
export const SCENE: Record<SceneKey, number> = {
  s1: frames("s1"),
  s2: frames("s2"),
  s3: frames("s3"),
  s4: frames("s4"),
  s5: frames("s5"),
  s6: frames("s6"),
  s7: frames("s7"),
  s8: frames("s8"),
  s9: frames("s9"),
  s10: frames("s10"),
  s11: frames("s11"),
  s12: frames("s12"),
  s13: frames("s13", true),
};

export const SCENE_ORDER: SceneKey[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"];

export const TOTAL_DURATION = SCENE_ORDER.reduce((sum, key) => sum + SCENE[key], 0) - MATCH * (SCENE_ORDER.length - 1);
