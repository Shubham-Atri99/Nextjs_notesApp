import NotesCard from "./NotesCard";
import type { Note as NoteType } from "@/Types/Note";

interface Props {
  notes: NoteType[];
  onDelete?: () => void;
}

export default function NotesGrid({ notes, onDelete }: Props) {
  return (
    <section>
      <h3 className="mb-5 text-lg font-semibold text-gray-900">Your Notes ({notes.length})</h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NotesCard key={note.id} note={note} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
