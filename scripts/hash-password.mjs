// Usage: node scripts/hash-password.mjs <your-admin-password>

import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}
if (pwd.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
const b64 = Buffer.from(hash, "utf8").toString("base64");

console.log("\n────────────────────────────────────────────────────────────");
console.log("  Add this single line to .env.local (and Vercel env vars):");
console.log("────────────────────────────────────────────────────────────\n");
console.log(`ADMIN_PASSWORD_HASH_B64=${b64}`);
console.log("\n  (Base64-encoded — no `$` issues with dotenv.)\n");
