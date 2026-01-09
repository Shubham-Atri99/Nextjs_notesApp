import { NextResponse } from "next/server";
import { admin, adminInitialized } from "@/lib/firebaseAdmin";

function parseSessionCookie(header: string | null) {
  if (!header) return null;
  const match = header.split(/; */).find((c) => c.trim().startsWith("session="));
  if (!match) return null;
  return match.split("=")[1];
}

export async function POST(req: Request) {
  try {
    if (!adminInitialized) {
      return NextResponse.json({ error: "Server not configured for admin operations." }, { status: 500 });
    }

    const header = req.headers.get("cookie") || req.headers.get("Cookie") || null;
    const sessionCookie = parseSessionCookie(header);

    if (sessionCookie) {
      try {
        const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (decoded && decoded.sub) {
          await admin.auth().revokeRefreshTokens(decoded.sub);
        }
      } catch (e) {
        console.warn("Failed to verify/revoke session cookie:", e);
      }
    }

    const secure = process.env.NODE_ENV === "production";
    const clearCookie = `session=; Max-Age=0; Path=/; HttpOnly; ${secure ? "Secure;" : ""} SameSite=Lax`;

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set("Set-Cookie", clearCookie);
    return res;
  } catch (err: any) {
    console.error("POST /api/auth/logout error", err);
    return NextResponse.json({ error: String(err) || "Failed to logout" }, { status: 500 });
  }
}
