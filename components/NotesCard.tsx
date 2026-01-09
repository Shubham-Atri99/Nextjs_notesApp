import type { Note as NoteType } from "@/Types/Note";

interface NotesCardProps {
  note: NoteType;
}

export default function NotesCard({ note }: NotesCardProps) {
  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt) return "";
    if (typeof createdAt?.toDate === "function")
      return createdAt.toDate().toLocaleDateString();
    if (createdAt?.seconds)
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    if (createdAt instanceof Date) return createdAt.toLocaleDateString();
    return String(createdAt);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <h4 className="mb-2 font-semibold text-gray-900">{note.title}</h4>
      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
        {note.content}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        📅 {formatCreatedAt(note.createdAt)}
      </div>
    </div>
  );
}
