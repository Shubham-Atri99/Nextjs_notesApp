import { NextResponse } from "next/server";
import { admin, adminInitialized } from "@/lib/firebaseAdmin";

function parseSessionCookie(header: string | null) {
  if (!header) return null;
  const match = header.split(/; */).find((c) => c.trim().startsWith("session="));
  if (!match) return null;
  return match.split("=")[1];
}

export async function GET(req: Request) {
  try {
    if (!adminInitialized) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    const header = req.headers.get("cookie") || req.headers.get("Cookie") || null;
    const sessionCookie = parseSessionCookie(header);
    if (!sessionCookie) return NextResponse.json({ loggedIn: false }, { status: 200 });

    try {
      const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
      return NextResponse.json({ loggedIn: true, uid: decoded?.sub || null, email: decoded?.email || null }, { status: 200 });
    } catch (e) {
      console.warn("Failed to verify session cookie:", e);
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }
  } catch (err) {
    console.error("GET /api/auth/me error", err);
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
