"use client";

import { useEffect, useState } from "react";

export type SearchField = "all" | "title" | "content";

interface Props {
  value?: string;
  field?: SearchField;
  onChange?: (query: string, field: SearchField) => void;
}

export default function NotesToolbar({ value = "", field = "all", onChange }: Props) {
  const [q, setQ] = useState(value);
  const [f, setF] = useState<SearchField>(field);

  
  useEffect(() => {
    const t = setTimeout(() => {
      onChange?.(q.trim(), f);
    }, 250);
    return () => clearTimeout(t);
  }, [q, f]);

  useEffect(() => setQ(value), [value]);
  useEffect(() => setF(field), [field]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
        />
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🜜</span>
        <select
          value={f}
          onChange={(e) => setF(e.target.value as SearchField)}
          className="w-40 appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-8 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
        >
          <option value="all">All Fields</option>
          <option value="title">Title</option>
          <option value="content">Content</option>
        </select>
      </div>
    </div>
  );
}
