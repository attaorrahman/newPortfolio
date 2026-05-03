// TEMPORARY DEBUG ROUTE — delete after fixing the login issue.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveHash(): { hash: string | null; source: string } {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64.trim(), "base64").toString("utf8");
      if (/^\$2[aby]\$\d{2}\$.{53}$/.test(decoded)) {
        return { hash: decoded, source: "B64" };
      }
      return { hash: decoded, source: "B64-invalid" };
    } catch {
      return { hash: null, source: "B64-decode-failed" };
    }
  }
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
  return { hash: raw || null, source: raw ? "RAW" : "NONE" };
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const { hash, source } = resolveHash();

  let bcryptOk: boolean | string = false;
  try {
    bcryptOk = await bcrypt.compare(password || "", hash || "");
  } catch (e) {
    bcryptOk = `ERROR: ${(e as Error).message}`;
  }

  return NextResponse.json({
    source,
    pwLen: typeof password === "string" ? password.length : null,
    hashLen: hash?.length ?? 0,
    hashStartsWith: hash?.slice(0, 7) ?? "",
    hashEndsWith: hash?.slice(-7) ?? "",
    hashLooksValid: hash ? /^\$2[aby]\$\d{2}\$.{53}$/.test(hash) : false,
    bcryptCompare: bcryptOk,
  });
}
