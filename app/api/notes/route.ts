import { NextResponse } from "next/server";
import { admin, adminInitialized } from "@/lib/firebaseAdmin";

// Verify Firebase ID token from Authorization: Bearer <token> header and return uid or null
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

// Server route uses Admin SDK so it bypasses Firestore security rules
// Collection: `notes` with fields: id, title, content, user_id, created_at

export async function POST(req: Request) {
  try {
    // Use explicit adminInitialized flag so we can provide a clearer error when initialization failed due to bad key format
    // (see lib/firebaseAdmin.ts for details)
    if (!(admin as any).apps?.length || !(admin as any).apps?.length && !(admin as any).app) {
      return NextResponse.json(
        { error: "Server not configured for admin operations. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars." },
        { status: 500 }
      );
    }

    const firestore = admin.firestore();
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Require authentication; server verifies ID token and uses verified UID as user_id
    const uid = await verifyAuth(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Attempt to write the note (server-authoritative user_id)
    const ref = await firestore.collection("notes").add({
      title,
      content,
      user_id: uid,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/notes error", err);

    // Detect decoder/openssl style errors and provide a helpful hint
    const message = String(err?.message || err);
    if (message.includes("DECODER") || message.includes("error:1E08010C") || /unsupported/i.test(message)) {
      return NextResponse.json({
        error:
          "Server-side credential error when creating note. Likely cause: malformed FIREBASE_PRIVATE_KEY or unsupported key format. Ensure you used the service account private_key, preserved newlines (replace \\n sequences), and restarted the server.",
        details: message,
      }, { status: 500 });
    }

    return NextResponse.json({ error: String(err) || "Failed to create note" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    if (!adminInitialized) {
      return NextResponse.json(
        { error: "Server not configured for admin operations. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars (check key format and newlines) (check key format and newlines)." },
        { status: 500 }
      );
    }

    const firestore = admin.firestore();
    // Require authentication for listing notes and limit to the authenticated user's notes
    const uid = await verifyAuth(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Try the efficient indexed query first
    let snap;
    try {
      const ref = firestore.collection("notes").where("user_id", "==", uid).orderBy("created_at", "desc");
      snap = await ref.get();
    } catch (qerr: any) {
      // If Firestore requires a composite index, fall back to an un-ordered query and sort in-memory
      const msg = String(qerr?.message || qerr);
      if (msg.includes("requires an index") || msg.includes("create_composite") || qerr?.code === 9) {
        console.warn("Firestore composite index required for this query. Falling back to non-indexed fetch and in-memory sort. For better performance, create the index shown in the error link.", msg);
        const ref = firestore.collection("notes").where("user_id", "==", uid);
        snap = await ref.get();
      } else {
        throw qerr;
      }
    }

    const notes = snap.docs
      .map((d: any) => {
        const data = d.data();
        let created_at: string | null = null;
        if (data?.created_at && typeof data.created_at.toDate === "function") {
          // Firestore Timestamp -> ISO string
          created_at = data.created_at.toDate().toISOString();
        } else if (data?.created_at && data.created_at._seconds) {
          // possible raw object
          created_at = new Date(data.created_at._seconds * 1000).toISOString();
        } else if (typeof data?.created_at === "string") {
          created_at = data.created_at;
        }

        return {
          id: d.id,
          title: data.title,
          content: data.content,
          user_id: data.user_id || null,
          created_at,
        };
      })
      // If we used the fallback (no server ordering), sort in-memory by created_at desc
      .sort((a: any, b: any) => {
        const ta = a.created_at ? Date.parse(a.created_at) : 0;
        const tb = b.created_at ? Date.parse(b.created_at) : 0;
        return tb - ta;
      });

    return NextResponse.json({ success: true, notes }, { status: 200 });
  } catch (err) {
    console.error("GET /api/notes error", err);
    return NextResponse.json({ error: String(err) || "Failed to fetch notes" }, { status: 500 });
  }
}
