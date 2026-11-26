// Archipelago Run — entrypoint (Node 22, standard library only).
//
// The grader runs `node /bot/main.ts` with MAKEFUN_OUTPUT_DIR set to an
// empty writable directory (fallback "/output"). This copies the playable
// game (game/) and its screenshots into the output, then builds the
// dossier the scorer verifies: dossier.json must equal what the kit's
// buildDossier writes from game/ and screenshots/, byte for byte.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const root = dirname(fileURLToPath(import.meta.url));

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name), d = join(dst, name);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else cpSync(s, d);
  }
}

const gameSrc = join(root, "game");
const shotsSrc = join(root, "screenshots");
if (!existsSync(gameSrc)) {
  console.error("game/ not found next to main.ts");
  process.exit(1);
}
copyDir(gameSrc, join(out, "game"));
if (existsSync(shotsSrc)) copyDir(shotsSrc, join(out, "screenshots"));
console.log(`game/ -> ${join(out, "game")}`);
console.log(`screenshots/ -> ${join(out, "screenshots")}`);
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(out, "dossier.json"), dossier);
console.log(`dossier.json -> ${join(out, "dossier.json")} (${dossier.length} bytes)`);
