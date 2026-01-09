import type { Note as NoteType } from "@/Types/Note";

interface NotesCardProps {
  note: NoteType;
}

export default function NotesCard({ note }: NotesCardProps) {
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

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <h4 className="mb-2 font-semibold text-gray-900">{note.title}</h4>
      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
        {note.content}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        📅 {formatCreatedAt(note.created_at ?? note.createdAt)}
      </div>
    </div>
  );
}
