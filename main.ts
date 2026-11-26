// Archipelago Run — entrypoint (Node 22, standard library only).
//
// The grader runs `node /bot/main.ts` with MAKEFUN_OUTPUT_DIR set to an
// empty writable directory (fallback "/output"). This copies the playable
// game (game/) and its screenshots into the output so the game can be
// served as static files: game/index.html opens in desktop Chrome and
// plays with no network request.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
