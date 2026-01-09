import { NextResponse } from "next/server";
import { admin, adminInitialized } from "@/lib/firebaseAdmin";

async function verifyAuth(req: Request) {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    console.warn("Failed to verify ID token:", e?.toString?.() ?? e);
    return null;
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    if (!adminInitialized) {
      return NextResponse.json(
        { error: "Server not configured for admin operations. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars (check key format and newlines)." },
        { status: 500 }
      );
    }

    const uid = await verifyAuth(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const firestore = admin.firestore();
    const docRef = firestore.doc(`notes/${id}`);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = snapshot.data();

    // ensure the requesting user owns the note
    if (data?.user_id !== uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // convert timestamp to ISO if needed
    let created_at: string | null = null;
    if (data?.created_at && typeof data.created_at.toDate === "function") {
      created_at = data.created_at.toDate().toISOString();
    } else if (data?.created_at && data.created_at._seconds) {
      created_at = new Date(data.created_at._seconds * 1000).toISOString();
    } else if (typeof data?.created_at === "string") {
      created_at = data.created_at;
    }

    return NextResponse.json({ success: true, note: { id: snapshot.id, title: data?.title, content: data?.content, user_id: data?.user_id || null, created_at } }, { status: 200 });
  } catch (err) {
    console.error(`GET /api/notes/${id} error`, err);
    return NextResponse.json({ error: String(err) || "Failed to fetch note" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    if (!admin.apps.length) {
      return NextResponse.json(
        { error: "Server not configured for admin operations. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars." },
        { status: 500 }
      );
    }

    const uid = await verifyAuth(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const firestore = admin.firestore();
    const docRef = firestore.doc(`notes/${id}`);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = snapshot.data();
    if (data?.user_id !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await docRef.delete();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(`DELETE /api/notes/${id} error`, err);
    return NextResponse.json({ error: String(err) || "Failed to delete note" }, { status: 500 });
  }
}
