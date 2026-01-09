import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK using service account env vars with robust error handling
let adminInitialized = false;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

  if (projectId && clientEmail && privateKey) {
    try {
      // Wrap initialization to catch crypto/decoding issues (common when private key format is wrong)
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      adminInitialized = true;
    } catch (e: any) {
      // Helpful debugging message without printing secret key material
      console.error("Failed to initialize Firebase Admin SDK:", e?.message || e);
      console.error(
        "Likely cause: malformed FIREBASE_PRIVATE_KEY or unsupported key format. Ensure the private key is the full PEM string from the Firebase service account JSON and that newlines are preserved (replace literal `\\n` with actual newlines when loading from .env)."
      );
    }
  } else {
    // Do not throw here; allow routes to return a clear 500 response explaining missing configuration.
    console.warn(
      "Firebase Admin not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables to enable server-side Firestore operations."
    );
  }
} else {
  adminInitialized = true;
}

export { admin, adminInitialized };
