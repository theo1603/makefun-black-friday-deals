// Lantern Deals — a Black Friday deal finder for make.fun's
// black-friday-deal-finder-01 bounty (Node 22, standard library only).
//
// The site lives in app/: plain static files, no build step, no network
// loads. index.html opens in a browser, main.js boots it, deals.js holds
// the 33 deals the builder checked at their stores on 27 Nov 2026, and
// prices.js / filters.js / render.js each do one job.
//
// This program hands the entry in. It copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there
// with buildDossier from the vendored make.fun library. Leave
// vendor/makefun-frontend.ts untouched: the scorer rebuilds the dossier
// with its own copy and compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots, each at most 256 KiB;
// at most 993 files and directories in app/, 16 MiB of app files in all.
// text_max_bytes caps the dossier text at 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
