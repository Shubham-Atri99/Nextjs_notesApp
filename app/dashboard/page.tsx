import Navbar from "@/components/Navbar";
import CreateNote from "@/components/CreateNote";
import NotesGrid from "@/components/NotesGrid";
import NotesToolbar from "@/components/NotesToolbar";

const mockNotes = [
  {
    id: "1",
    title: "Project Ideas",
    content: "Build a full-stack notes app with React...",
    createdAt: { seconds: Date.now() / 1000 },
    userId: "123",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
        <CreateNote />
        <NotesToolbar />
        <NotesGrid notes={mockNotes} />
      </main>
    </div>
  );
}
