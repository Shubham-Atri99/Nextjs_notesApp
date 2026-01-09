"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateNote from "@/components/CreateNote";
import NotesGrid from "@/components/NotesGrid";
import NotesToolbar from "@/components/NotesToolbar";

export default function DashboardPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] =
    useState<"all" | "title" | "content">("all");

  const fetchNotes = async (user: any) => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data?.notes)) {
        setNotes(data.notes);
      } else {
        console.warn("Fetch notes failed:", data);
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      const { auth } = await import("@/lib/firebase");

      unsub = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }

        setAuthLoading(false);
        await fetchNotes(user);
      });
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-500 animate-pulse">
          Loading your dashboard…
        </div>
      </div>
    );
  }

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (searchField === "title")
      return (n.title || "").toLowerCase().includes(q);
    if (searchField === "content")
      return (n.content || "").toLowerCase().includes(q);
    return (
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
        <CreateNote onAdd={() => fetchNotes({ getIdToken: async () => {
          const { auth } = await import("@/lib/firebase");
          return auth.currentUser!.getIdToken();
        } })} />

        <NotesToolbar
          value={searchQuery}
          field={searchField}
          onChange={(q, f) => {
            setSearchQuery(q);
            setSearchField(f);
          }}
        />

        {loading ? (
          <div className="text-sm text-gray-500">Loading notes…</div>
        ) : (
          <NotesGrid notes={filteredNotes} onDelete={() => {
            const { auth } = require("@/lib/firebase");
            fetchNotes(auth.currentUser);
          }} />
        )}
      </main>
    </div>
  );
}
