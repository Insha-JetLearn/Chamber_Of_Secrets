import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth.ts';
import { JournalEntry } from './types/journal.ts';
import { subscribeToUserJournal } from './services/journalService.ts';
import { MagicalBackground } from './components/MagicalBackground.tsx';
import { Header } from './components/Header.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { JournalHistory } from './components/JournalHistory.tsx';
import { LoreModal } from './components/LoreModal.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';
import { JournalPage } from './pages/JournalPage.tsx';
import { Wand2 } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeDraft, setActiveDraft] = useState('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loreOpen, setLoreOpen] = useState(false);

  // Subscribe to real-time entries when authenticated
  useEffect(() => {
    if (!user) {
      setEntries([]);
      setSelectedEntry(null);
      return;
    }

    const unsubscribe = subscribeToUserJournal(
      user.uid,
      (newEntries) => {
        setEntries(newEntries);
      },
      (error) => {
        console.error('Error in journal subscription:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleOpenAuth = (mode: 'signin' | 'register' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10080B] flex flex-col items-center justify-center text-[#F6E2A0] gap-4">
        <MagicalBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#24070D] border border-[#D4AF63] flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <Wand2 className="w-7 h-7 text-[#D4AF63]" />
          </div>
          <h2 className="mt-4 font-title text-lg tracking-widest gold-glow">
            Unlocking the Chamber…
          </h2>
          <p className="font-parchment italic text-xs text-[#E8D8B5]/60 mt-1">
            Listening for the ancient incantation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#10080B] text-[#F3E9D5] relative overflow-x-hidden">
      {/* Magical Floating Particle Canvas */}
      <MagicalBackground />

      {/* Main Header */}
      <Header
        user={user}
        onOpenAuth={() => handleOpenAuth('signin')}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenLore={() => setLoreOpen(true)}
        entryCount={entries.length}
      />

      {/* Page Content */}
      <main className="flex-1 relative z-10">
        {user ? (
          <JournalPage
            user={user}
            entries={entries}
            selectedEntry={selectedEntry}
            onClearSelectedEntry={() => setSelectedEntry(null)}
            onDraftChange={(text) => setActiveDraft(text)}
          />
        ) : (
          <WelcomePage
            onOpenAuth={handleOpenAuth}
            onOpenLore={() => setLoreOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#D4AF63]/20 bg-[#12070A]/90 py-5 px-4 text-center text-xs font-parchment text-[#E8D8B5]/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">⚡</span>
            <span>Chamber of Secrets AI Journal</span>
            <span>•</span>
            <span className="italic">Powered by Google Gemini & Firebase</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-serif">
            <button
              onClick={() => setLoreOpen(true)}
              className="text-[#D4AF63] hover:underline cursor-pointer"
            >
              Enchanted Lore
            </button>
            <span>•</span>
            <span>Strict Zero-Trust Privacy</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <JournalHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        entries={entries}
        onSelectEntry={(entry) => setSelectedEntry(entry)}
        currentDraftLength={activeDraft.length}
      />

      <LoreModal
        isOpen={loreOpen}
        onClose={() => setLoreOpen(false)}
      />
    </div>
  );
}
