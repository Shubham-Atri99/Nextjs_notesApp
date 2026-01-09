# NotesApp — Full‑Stack Notes Application 📘

A professional, full‑stack Notes application built with Next.js (App Router), Firebase Authentication, Firestore, and Tailwind CSS. The app demonstrates secure authentication, auth‑protected API routes, and CRUD notes scoped to the authenticated user.

---

## Project Overview

NotesApp is a minimal yet production‑focused note‑taking app that showcases:
- Secure user authentication (register & login)
- Auth‑protected dashboard and API routes
- Create, read, and delete notes stored in Firestore and scoped to the authenticated user
- Server‑side session cookies using Firebase Admin SDK (1 day expiry)
- Responsive UI with Tailwind CSS

---

## Features ✅

- User authentication — register & login (Firebase Auth)
- Auth‑protected dashboard where users manage notes
- Create, read, and delete notes (notes belong to their owners only)
- Server‑side session cookie (1 day) to support secure SSR and server checks
- Secure API routes using Firebase Admin SDK
- Search notes by title and content
- Clean, accessible, responsive UI (Tailwind)

---
## Installation & Setup ⚙️

1. Clone the repository:

```bash
git clone <repo-url>
cd notes_app
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Add environment variables (see next section).

4. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment Variables 🔐

Create a `.env.local` in the project root and add:

Client Firebase config (required):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Server Firebase Admin (required for sessions & secure server ops):
```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
> Note: Preserve the newline characters in `FIREBASE_PRIVATE_KEY` — replace literal `\\n` sequences with real newlines when setting the variable.

Optional:
- `NODE_ENV=production` — sets cookies as `Secure` in production

---

## Running the Project ▶️

- Development:

```bash
npm run dev
```

- Build & Start:

```bash
npm run build
npm start
```

- Lint / Type check (if configured):

```bash
npm run lint
npm run type-check
```

---

## Folder Structure 📁

```
app/
  page.tsx                 # Landing page
  dashboard/page.tsx       # Auth-protected dashboard
  
  api/
    auth/
      session/route.ts     # Create session cookie
      logout/route.ts      # Clear session cookie
      me/route.ts          # Check session cookie
    notes/
      route.ts             # Create/list notes
      [id]/route.ts        # GET/DELETE note
      
components/
  Navbar.tsx
  NotesGrid.tsx
  NotesCard.tsx
  AuthAwareCTA.tsx
lib/
  firebase.ts              # Client Firebase init
  firebaseAdmin.ts         # Server Firebase Admin init

```

---

## Security Notes 🔒

- The server must be configured with valid Firebase Admin credentials to create/verify session cookies.
- Session cookie (`session`) is HttpOnly and `SameSite=Lax`; `Secure` is set in production.
- API routes validate that the requesting user owns the note before returning/updating/deleting it.
- Never commit `.env` files. Store secrets in your deployment platform's secret manager.

---

## Firestore Indexes (Performance) ⚡

Queries that combine `where("user_id", "==", uid)` and `orderBy("created_at", "desc")` may require a composite index. Create the index via Firebase Console or add it to your `firestore.indexes.json` and deploy.

---

## Future Improvements ✨

- Add edit note inline/modal with optimistic updates
- Pagination / infinite scroll for large note sets
- Note sharing, tags, and notebooks
- Autosave & conflict resolution
- Tests (unit & integration) and CI workflow
- Accessibility audit and ARIA improvements

---

## Contributing

1. Fork → create a feature branch → open a PR
2. Keep changes small and focused
3. Add tests and update docs for nontrivial changes

---

## License & Contact

- MIT License
- Questions / Hiring: contact [your-email@example.com]

---

If you'd like, I can add a `CONTRIBUTING.md`, a `.env.example`, and a GitHub Actions workflow for linting and type checks — tell me which you want next.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
