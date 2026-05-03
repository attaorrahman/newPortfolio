import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createAdminSession } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  password: z.string().min(1).max(200),
});

/**
 * Resolve the bcrypt hash from env. Prefers ADMIN_PASSWORD_HASH_B64
 * (base64 of the raw bcrypt hash) because dotenv expansion mangles
 * `$` characters in the raw form. Falls back to ADMIN_PASSWORD_HASH.
 */
function resolveHash(): string | null {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64.trim(), "base64").toString("utf8");
      if (/^\$2[aby]\$\d{2}\$.{53}$/.test(decoded)) return decoded;
    } catch {
      /* fall through */
    }
  }
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (raw && /^\$2[aby]\$\d{2}\$.{53}$/.test(raw)) return raw;
  return null;
}

export async function POST(req: NextRequest) {
  const hash = resolveHash();
  if (!hash) {
    return NextResponse.json(
      {
        error:
          "Admin password is not configured. Set ADMIN_PASSWORD_HASH_B64 (base64-encoded bcrypt hash).",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const ok = await bcrypt.compare(parsed.data.password, hash);
  if (!ok) {
    // small constant-ish delay to discourage brute force
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
