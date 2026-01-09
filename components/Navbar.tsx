"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

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

  const logout = async () => {
    try {
      await signOut(auth);
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {
        console.warn("Failed to call /api/auth/logout:", e);
      }
      setName(null);
    } catch (e) {
      console.error("Failed to sign out:", e);
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between border-b bg-white px-4 sm:px-8 py-3 sm:py-4">
      <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-blue-600">
        📘 NotesApp
      </Link>

      <div className="flex items-center gap-3">
        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">👤</div>
          <span className="text-sm font-medium text-gray-700">{name || "Guest"}</span>
          {auth.currentUser ? (
            <button
              onClick={logout}
              className="ml-3 rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          ) : null}
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <button aria-label="Open menu" onClick={() => setMenuOpen((s) => !s)} className="rounded p-2 bg-gray-100">
            {menuOpen ? "✕" : "☰"}
          </button>

          {menuOpen && (
            <div className="absolute right-4 top-full mt-2 w-48 rounded-md bg-white shadow-md p-2 z-50">
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">👤</div>
                <div className="text-sm font-medium text-gray-800">{name || "Guest"}</div>
              </div>

              {auth.currentUser ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="mt-2 w-full text-left rounded bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2 block rounded px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
