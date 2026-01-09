"use client";

import { useState } from "react";

interface CreateNoteProps {
  onAdd?: () => void;
}

export default function CreateNote({ onAdd }: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      // ensure user is signed in and get ID token for server verification
      const { auth } = await import("@/lib/firebase");
      const user = auth.currentUser;
      if (!user) {
        setError("You must be signed in to add notes");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Failed to add note");
        return;
      }

      setTitle("");
      setContent("");
      if (onAdd) await onAdd();
    } catch (err) {
      console.error(err);
      setError("Internal error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Create New Note</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 caret-blue-600 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 caret-blue-600 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition"
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          onClick={handleAdd}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "➕ Add Note"}
        </button>
      </div>
    </section>
  );
}
