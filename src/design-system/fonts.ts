import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Touche is a commercial typeface (Indian Type Foundry).
 * Once licensed files are placed in `public/fonts/touche/`, set this to `true`
 * and the display role switches from IBM Plex Sans to Touche everywhere.
 */
export const TOUCHE_ENABLED = false;

type Face = {
  readonly family: string;
  readonly file: string;
  readonly weight: string;
};

const PLEX_FACES: Face[] = [
  { family: "IBM Plex Sans", file: "ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
  { family: "IBM Plex Sans", file: "ibm-plex-sans-latin-500-normal.woff2", weight: "500" },
  { family: "IBM Plex Sans", file: "ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
  { family: "IBM Plex Sans", file: "ibm-plex-sans-latin-700-normal.woff2", weight: "700" },
  { family: "IBM Plex Mono", file: "ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
  { family: "IBM Plex Mono", file: "ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  { family: "IBM Plex Mono", file: "ibm-plex-mono-latin-600-normal.woff2", weight: "600" },
];

// IBM Plex is served from local files (SIL Open Font License, see public/fonts/ibm-plex/OFL.txt)
// so renders work offline and never depend on Google Fonts being reachable.
PLEX_FACES.forEach((face) => {
  void loadFont({
    family: face.family,
    url: staticFile(`fonts/ibm-plex/${face.file}`),
    weight: face.weight,
  });
});

if (TOUCHE_ENABLED) {
  void loadFont({
    family: "Touche",
    url: staticFile("fonts/touche/Touche-Semibold.woff2"),
    weight: "600",
  });
}

export const FONT_FAMILY = {
  display: TOUCHE_ENABLED
    ? '"Touche", "IBM Plex Sans", sans-serif'
    : '"IBM Plex Sans", sans-serif',
  body: '"IBM Plex Sans", sans-serif',
  mono: '"IBM Plex Mono", monospace',
} as const;
