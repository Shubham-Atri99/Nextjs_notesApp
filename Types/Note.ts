export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any; // Firestore Timestamp
  userId: string;
}
