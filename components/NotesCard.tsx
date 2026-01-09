import React, { useState } from "react";
import type { Note as NoteType } from "@/Types/Note";

interface NotesCardProps {
  note: NoteType;
  onDelete?: () => void;
}

export default function NotesCard({ note, onDelete }: NotesCardProps) {
  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt) return "";
    // ISO string (from server)
    if (typeof createdAt === "string") {
      const t = Date.parse(createdAt);
      if (!Number.isNaN(t)) return new Date(t).toLocaleString();
      return createdAt;
    }

    if (typeof createdAt?.toDate === "function") {
      return createdAt.toDate().toLocaleString();
    }

    if (createdAt?.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();

    if (createdAt instanceof Date) return createdAt.toLocaleString();

    return String(createdAt);
  };

  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const MAX_PREVIEW = 400;
  const isLong = (note.content || "").length > MAX_PREVIEW;
  const preview = isLong ? note.content.slice(0, MAX_PREVIEW) + "..." : note.content;

  const handleDelete = async () => {
    if (!confirm("Delete this note?")) return;
    try {
      const { auth } = await import("@/lib/firebase");
      const user = auth.currentUser;
      if (!user) {
        alert("You must be signed in to delete notes.");
        return;
      }

      const token = await user.getIdToken();
      setDeleting(true);

      const res = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data?.error || "Failed to delete note");
        return;
      }

      if (onDelete) onDelete();
    } catch (e) {
      console.error(e);
      alert("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col h-full">
      <h4 className="mb-2 font-semibold text-gray-900">{note.title}</h4>

      
      <p className="mb-3 text-sm text-gray-600 whitespace-pre-wrap break-words max-w-full">
        {expanded ? note.content : preview}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((s) => !s)}
          className="mb-3 text-xs text-blue-500 hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500 justify-between mt-auto">
        <div className="flex items-center gap-2">📅 {formatCreatedAt(note.created_at ?? note.createdAt)}</div>

        <div className="flex items-center">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`text-xs ${deleting ? "text-gray-400" : "text-red-500 hover:underline"}`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
