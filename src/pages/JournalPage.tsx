import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { JournalEntry } from '../types/journal.ts';
import { JournalEditor } from '../components/JournalEditor.tsx';
import { DiaryResponse } from '../components/DiaryResponse.tsx';
import { MagicalLoader } from '../components/MagicalLoader.tsx';
import { consultDiary } from '../services/geminiService.ts';
import { saveJournalEntry } from '../services/journalService.ts';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { magicalAudio } from '../utils/audio.ts';

interface JournalPageProps {
  user: User;
  entries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  onClearSelectedEntry: () => void;
  onDraftChange: (text: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  user,
  selectedEntry,
  onClearSelectedEntry,
  onDraftChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [currentOriginalEntry, setCurrentOriginalEntry] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEntrySubmit = async (entryText: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Invoke server-side Gemini AI response
      const aiResponse = await consultDiary(entryText, user.displayName || undefined);

      // 2. Persist both entry and response to Firestore
      await saveJournalEntry(user.uid, entryText, aiResponse);

      // 3. Update active view
      setCurrentResponse(aiResponse);
      setCurrentOriginalEntry(entryText);
      showToast('The diary absorbed your secret and inscribed its answer upon the parchment.');
      magicalAudio.playEnchantedChime();
    } catch (err: any) {
      console.error('Failed to submit entry:', err);
      setErrorMessage(
        err?.message ||
          'The diary resisted your words. Check your connection or verify your Gemini API key in Secrets.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteAnother = () => {
    setCurrentResponse(null);
    setCurrentOriginalEntry(null);
    onClearSelectedEntry();
  };

  // If a historical entry is selected from history drawer, display it
  if (selectedEntry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF63]">
            <Sparkles className="w-4 h-4" />
            <span>Reading from Archives</span>
          </div>

          <button
            onClick={handleWriteAnother}
            className="text-xs font-subhead font-semibold text-[#F6E2A0] hover:underline cursor-pointer"
          >
            ← Inscribe New Secret
          </button>
        </div>

        <DiaryResponse
          response={selectedEntry.aiResponse}
          originalEntry={selectedEntry.entryText}
          timestamp={selectedEntry.createdAt}
          onWriteAnother={handleWriteAnother}
          isNewResponse={false}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1A0A0F] border border-[#D4AF63] text-xs text-[#F6E2A0] shadow-2xl animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-xs text-rose-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">Enchanted Disturbance</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <MagicalLoader />}

      {/* Diary response if newly generated and not loading */}
      {!isLoading && currentResponse && (
        <DiaryResponse
          response={currentResponse}
          originalEntry={currentOriginalEntry || undefined}
          timestamp={new Date()}
          onWriteAnother={handleWriteAnother}
          isNewResponse={true}
        />
      )}

      {/* Journal writing panel (shown when not viewing an active response or loading) */}
      {!isLoading && !currentResponse && (
        <JournalEditor
          onSubmit={handleEntrySubmit}
          isLoading={isLoading}
          authorName={user.displayName || undefined}
          onTextChange={onDraftChange}
        />
      )}
    </div>
  );
};
