export interface JournalEntry {
  id: string;
  userId: string;
  entryText: string;
  aiResponse: string;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  userId: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: any;
}

export type ViewMode = 'write' | 'reading' | 'history';
