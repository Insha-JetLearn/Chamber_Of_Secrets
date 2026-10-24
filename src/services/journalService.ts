import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { JournalEntry } from '../types/journal.ts';

const ENTRIES_COLLECTION = 'entries';

/**
 * Generate a clean ID for Firestore entries
 */
function generateEntryId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `entry_${timestamp}_${randomStr}`;
}

/**
 * Create and persist a new secret journal entry with its AI response to Firestore
 */
export async function saveJournalEntry(
  userId: string,
  entryText: string,
  aiResponse: string
): Promise<string> {
  const entryId = generateEntryId();
  const entryRef = doc(db, ENTRIES_COLLECTION, entryId);

  // Volumetric boundary defense matching blueprint
  const sanitizedText = entryText.trim().slice(0, 10000);
  const sanitizedResponse = aiResponse.trim().slice(0, 10000);

  const payload = {
    userId,
    entryText: sanitizedText,
    aiResponse: sanitizedResponse,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(entryRef, payload);
    return entryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ENTRIES_COLLECTION}/${entryId}`);
  }
}

/**
 * Real-time listener for the user's journal entries, newest first
 */
export function subscribeToUserJournal(
  userId: string,
  onEntries: (entries: JournalEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const entriesQuery = query(
    collection(db, ENTRIES_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const items: JournalEntry[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          entryText: data.entryText || '',
          aiResponse: data.aiResponse || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });

      // Sort client-side by createdAt descending to avoid composite index requirements while server timestamp resolves
      items.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : Date.now());
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : Date.now());
        return timeB - timeA;
      });

      onEntries(items);
    },
    (error) => {
      console.error('Subscription error on journal entries:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, ENTRIES_COLLECTION);
    }
  );
}

/**
 * Erase a journal entry from Firestore
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  const path = `${ENTRIES_COLLECTION}/${entryId}`;
  try {
    await deleteDoc(doc(db, ENTRIES_COLLECTION, entryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
