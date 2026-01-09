"use client";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
        📘 NotesApp
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
          👤
        </div>
        <span className="text-sm font-medium text-gray-700">John Doe</span>
      </div>
    </header>
  );
}
