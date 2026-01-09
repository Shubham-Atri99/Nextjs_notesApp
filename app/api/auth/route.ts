import { NextResponse } from "next/server";
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!firebaseApiKey) {
      console.error("Missing Firebase API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseApiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data?.error?.message || "Failed to send reset email";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Password reset email sent" }, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
