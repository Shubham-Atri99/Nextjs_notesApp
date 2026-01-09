import NotesCard from "./NotesCard";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  userId: string;
}

interface Props {
  notes: Note[];
}

export default function NotesGrid({ notes }: Props) {
  return (
    <section>
      <h3 className="mb-5 text-lg font-semibold text-gray-900">
        Your Notes ({notes.length})
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NotesCard key={note.id} note={note} />
        ))}
      </div>
    </section>
  );
}
