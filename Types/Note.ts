export interface Note {
  id: string;
  title: string;
  content: string;
  user_id?: string | null;
  created_at?: string | null; // ISO string
  createdAt?: string | null; // alias for camelCase inputs
}
