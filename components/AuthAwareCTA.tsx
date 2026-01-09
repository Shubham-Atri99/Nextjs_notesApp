"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AuthAwareCTA() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(Boolean(auth.currentUser));
    const unsub = auth.onAuthStateChanged((u) => setIsAuthed(Boolean(u)));

    (async () => {
      if (!auth.currentUser) {
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const d = await res.json();
            if (d?.loggedIn) setIsAuthed(true);
          }
        } catch (e) {
          // ignore
        }
      }
    })();

    return () => unsub();
  }, []);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isAuthed) router.push("/dashboard");
      else router.push("/register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`group flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-medium text-white shadow-lg transition ${
        loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
      }`}
    >
      {isAuthed ? "Go to Dashboard" : "Start Taking Notes"}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}
