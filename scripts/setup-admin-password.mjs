// Generates a base64-encoded bcrypt hash AND writes it directly to .env.local.
// Removes any existing ADMIN_PASSWORD_HASH or ADMIN_PASSWORD_HASH_B64 line first.
//
// Usage:
//   node scripts/setup-admin-password.mjs <password>

import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const pwd = process.argv[2];
if (!pwd) {
  console.error("Usage: node scripts/setup-admin-password.mjs <password>");
  process.exit(1);
}
if (pwd.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
const b64 = Buffer.from(hash, "utf8").toString("base64");

const file = path.resolve(".env.local");
let txt = "";
if (fs.existsSync(file)) {
  txt = fs.readFileSync(file, "utf8");
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
}

// Strip any existing variants (with or without quotes)
txt = txt.replace(/^ADMIN_PASSWORD_HASH(_B64)?=.*$\r?\n?/gm, "");

// Append the new line
if (txt.length && !txt.endsWith("\n")) txt += "\n";
txt += `ADMIN_PASSWORD_HASH_B64=${b64}\n`;

fs.writeFileSync(file, txt, { encoding: "utf8" });

console.log("\n✓ Wrote ADMIN_PASSWORD_HASH_B64 to .env.local");
console.log(`  Hash length:   ${hash.length}`);
console.log(`  Base64 length: ${b64.length}`);
console.log("\nNow restart dev server:  Ctrl+C  →  Remove-Item -Recurse -Force .next  →  npm run dev\n");
