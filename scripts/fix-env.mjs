// Repairs ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET in .env.local so that
// dollar signs are not expanded by dotenv. Wraps both values in single quotes
// (the bulletproof escape-disable form).
//
// Usage:
//   node scripts/fix-env.mjs

import fs from "node:fs";
import path from "node:path";

const file = path.resolve(".env.local");
if (!fs.existsSync(file)) {
  console.error(`No .env.local at ${file}`);
  process.exit(1);
}

let txt = fs.readFileSync(file, "utf8");

// Strip BOM if present
if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);

const fixVar = (name) => {
  const re = new RegExp(`^(${name})=(.*)$`, "m");
  const m = txt.match(re);
  if (!m) {
    console.warn(`! ${name} not found — skipping`);
    return;
  }
  let raw = m[2].trim();
  // Strip surrounding double-quotes (with their content untouched), or single-quotes
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1);
  }
  // Replace the line with a single-quoted form that disables expansion
  const replacement = `${name}='${raw}'`;
  txt = txt.replace(re, replacement);
  console.log(`✓ ${name} rewritten — length ${raw.length}`);
};

fixVar("ADMIN_PASSWORD_HASH");
fixVar("ADMIN_SESSION_SECRET");

fs.writeFileSync(file, txt, { encoding: "utf8" });
console.log(`\nSaved ${file}`);
console.log("Now restart the dev server: Ctrl+C → npm run dev\n");
