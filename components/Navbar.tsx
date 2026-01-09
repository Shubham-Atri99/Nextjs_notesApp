"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let unsub = () => {};

    const init = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;
        if (user.displayName) {
          setName(user.displayName);
          return;
        }
        try {
          const d = await getDoc(doc(db, "Users", user.uid));
          if (d.exists()) {
            const data: any = d.data();
            setName(data?.name || null);
          }
        } catch (e) {
          console.warn("Failed to read user profile:", e);
        }
      }

      unsub = auth.onAuthStateChanged(async (u) => {
        if (!u) {
          setName(null);
          return;
        }
        if (u.displayName) {
          setName(u.displayName);
          return;
        }
        try {
          const d = await getDoc(doc(db, "Users", u.uid));
          if (d.exists()) {
            const data: any = d.data();
            setName(data?.name || null);
          } else {
            setName(null);
          }
        } catch (e) {
          console.warn("Failed to read user profile:", e);
        }
      });
    };

    init();

    return () => {
      try {
        unsub();
      } catch {}
    };
  }, []);

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
        📘 NotesApp
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
          👤
        </div>
        <span className="text-sm font-medium text-gray-700">{name || "Guest"}</span>
      </div>
    </header>
  );
}
