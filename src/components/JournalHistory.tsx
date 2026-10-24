import React, { useState } from 'react';
import {
  X,
  Search,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { JournalEntry } from '../types/journal.ts';
import { deleteJournalEntry } from '../services/journalService.ts';
import { magicalAudio } from '../utils/audio.ts';

interface JournalHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  currentDraftLength: number;
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
  currentDraftLength,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.entryText.toLowerCase().includes(q) ||
      e.aiResponse.toLowerCase().includes(q)
    );
  });

  const handleOpenEntry = (entry: JournalEntry) => {
    if (currentDraftLength > 0) {
      const confirmAbandon = window.confirm(
        'You have unsaved words in your active parchment. Opening this previous secret will replace your current view. Continue?'
      );
      if (!confirmAbandon) return;
    }
    magicalAudio.playParchmentTurn();
    onSelectEntry(entry);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteJournalEntry(entryToDelete.id);
      magicalAudio.playInkDrop();
      setEntryToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setDeleteError(err?.message || 'Failed to erase memory.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatEntryDate = (timestamp: any) => {
    try {
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      // ignore
    }
    return 'Ancient Date';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-[#14080D] border-l border-[#D4AF63]/40 shadow-2xl flex flex-col h-full animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF63]/30 bg-[#24070D]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF63]" />
            <h3 className="font-title text-lg text-[#F6E2A0] gold-glow font-bold">
              Enchanted Archives
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#E8D8B5]/70 hover:text-[#F6E2A0] hover:bg-[#3B0B17] transition-all cursor-pointer"
            aria-label="Close Archives"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#D4AF63]/20 bg-[#1A0A0F]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF63]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search through past secrets & responses…"
              className="w-full bg-[#100508] border border-[#D4AF63]/30 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-[#F3E9D5] placeholder:text-[#E8D8B5]/40 focus:outline-none focus:border-[#D4AF63] font-parchment"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#E8D8B5]/50 hover:text-[#F6E2A0]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {entries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#24070D] border border-[#D4AF63]/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D4AF63]/60" />
              </div>
              <h4 className="font-title text-base text-[#F6E2A0] mb-1">
                The Pages Are Blank
              </h4>
              <p className="text-xs font-parchment italic text-[#E8D8B5]/60 max-w-xs mx-auto">
                No secrets have been whispered into this diary yet. Inscribe your first entry to awaken the archives.
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-[#E8D8B5]/60 font-parchment italic text-sm">
              No secrets found matching "{searchQuery}".
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="group relative rounded-xl p-4 bg-gradient-to-br from-[#1C0B11] to-[#250D16] border border-[#D4AF63]/30 hover:border-[#D4AF63] transition-all duration-300 shadow-md hover:shadow-[#D4AF63]/10"
              >
                {/* Date header */}
                <div className="flex items-center justify-between text-xs text-[#D4AF63]/80 font-mono mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatEntryDate(entry.createdAt)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEntryToDelete(entry);
                    }}
                    className="p-1 text-rose-400/60 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                    title="Burn secret from parchment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Entry text preview */}
                <div className="mb-2">
                  <p className="font-serif italic text-sm text-[#F3E9D5] line-clamp-2 leading-relaxed">
                    "{entry.entryText}"
                  </p>
                </div>

                {/* Diary response preview */}
                <div className="pt-2 border-t border-[#D4AF63]/15">
                  <p className="text-xs font-serif text-[#D4AF63]/90 italic line-clamp-2">
                    <span className="font-semibold not-italic text-[11px] uppercase tracking-wider text-[#F6E2A0] mr-1">
                      Diary:
                    </span>
                    {entry.aiResponse}
                  </p>
                </div>

                {/* Open button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleOpenEntry(entry)}
                    className="flex items-center gap-1 text-xs text-[#F6E2A0] hover:text-white font-subhead font-semibold group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Read Full Page</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {entryToDelete && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1A0A0F] border border-[#D4AF63] rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center animate-fadeIn">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-title text-base text-[#F6E2A0] font-bold mb-1">
                Vanish This Secret?
              </h4>
              <p className="text-xs font-parchment italic text-[#E8D8B5]/80 mb-4 leading-relaxed">
                "Words consumed by flame leave no ash upon enchanted parchment." This entry and the diary's answer will be permanently erased.
              </p>

              {deleteError && (
                <p className="text-xs text-rose-400 mb-3 bg-rose-950/40 p-2 rounded border border-rose-800">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setEntryToDelete(null)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#24070D] border border-[#D4AF63]/30 text-xs text-[#E8D8B5] hover:bg-[#3B0B17]"
                >
                  Spare Page
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 px-3 py-2 rounded-lg bg-rose-900/80 border border-rose-500 text-xs text-white font-bold hover:bg-rose-800 disabled:opacity-50"
                >
                  {isDeleting ? 'Burning…' : 'Burn to Ashes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
