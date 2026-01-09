import { NextResponse } from "next/server";
import { admin, adminInitialized } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    if (!adminInitialized) {
      return NextResponse.json({ error: "Server not configured for admin operations." }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    const idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const expiresIn = 24 * 60 * 60 * 1000; // 1 day
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const secure = process.env.NODE_ENV === "production";
    const cookie = `session=${sessionCookie}; Max-Age=${Math.floor(expiresIn / 1000)}; Path=/; HttpOnly; ${
      secure ? "Secure;" : ""
    } SameSite=Lax`;

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err: any) {
    console.error("POST /api/auth/session error", err);
    return NextResponse.json({ error: String(err) || "Failed to create session" }, { status: 500 });
  }
}
