"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CreateNote from "@/components/CreateNote";
import NotesGrid from "@/components/NotesGrid";
import NotesToolbar from "@/components/NotesToolbar";

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  
  const waitForUser = async () => {
    const { auth } = await import("@/lib/firebase");
    if (auth.currentUser) return auth.currentUser;

    return new Promise<any>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((u) => {
        unsubscribe();
        resolve(u);
      });
      
      setTimeout(() => {
        try {
          unsubscribe();
        } catch {}
        resolve(null);
      }, 5000);
    });
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const user = await waitForUser();
      if (!user) {
        setNotes([]);
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data?.notes) setNotes(data.notes as any[]);
      else if (!res.ok) console.warn("Fetch notes failed:", data);
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
      
      unsub = auth.onAuthStateChanged(() => {
        fetchNotes();
      });

      
      await fetchNotes();
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
        <CreateNote onAdd={fetchNotes} />
        <NotesToolbar />
        <NotesGrid notes={notes} onDelete={fetchNotes} />
      </main>
    </div>
  );
}
