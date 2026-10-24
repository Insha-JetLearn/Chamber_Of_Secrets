import React, { useState } from 'react';
import { Feather, Sparkles, Wand2, Eraser } from 'lucide-react';
import { magicalAudio } from '../utils/audio.ts';

interface JournalEditorProps {
  onSubmit: (entryText: string) => Promise<void>;
  isLoading: boolean;
  authorName?: string;
  hasUnsavedChanges?: boolean;
  onTextChange?: (text: string) => void;
}

const MAX_CHARS = 3000;

export const JournalEditor: React.FC<JournalEditorProps> = ({
  onSubmit,
  isLoading,
  authorName,
  onTextChange,
}) => {
  const [text, setText] = useState('');
  const [isInkAbsorbing, setIsInkAbsorbing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setText(val);
    if (onTextChange) onTextChange(val);
  };

  const handleClear = () => {
    if (!text.trim()) return;
    if (window.confirm('Vanish these words from the parchment?')) {
      setText('');
      if (onTextChange) onTextChange('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading || isInkAbsorbing) return;

    // Trigger ink sink animation and sound
    setIsInkAbsorbing(true);
    magicalAudio.playInkDrop();

    try {
      await onSubmit(text);
      // Clear after successful response
      setText('');
      if (onTextChange) onTextChange('');
    } finally {
      setIsInkAbsorbing(false);
    }
  };

  const characterCount = text.length;
  const isNearLimit = characterCount > MAX_CHARS * 0.9;

  return (
    <div className="relative w-full max-w-3xl mx-auto my-6">
      {/* Antique leather tome outer frame */}
      <div className="relative rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-[#24070D] via-[#1A080E] to-[#120509] border-2 border-[#D4AF63]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Gold filigree decorative corner embellishments */}
        <div className="absolute top-2 left-2 text-[#D4AF63]/60 select-none text-xs font-serif">
          ✦
        </div>
        <div className="absolute top-2 right-2 text-[#D4AF63]/60 select-none text-xs font-serif">
          ✦
        </div>
        <div className="absolute bottom-2 left-2 text-[#D4AF63]/60 select-none text-xs font-serif">
          ✦
        </div>
        <div className="absolute bottom-2 right-2 text-[#D4AF63]/60 select-none text-xs font-serif">
          ✦
        </div>

        {/* Inner parchment leaf */}
        <div className="relative rounded-xl parchment-sheet p-6 sm:p-10 border border-[#4E3016]/30 overflow-hidden transition-all duration-700">
          {/* Subtle watermark seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#D4AF63]/10 pointer-events-none flex items-center justify-center opacity-40">
            <span className="text-8xl text-[#4E3016]/10 select-none font-serif">⚡</span>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col">
            {/* Header section on parchment */}
            <div className="flex items-center justify-between border-b border-[#4E3016]/20 pb-3 mb-4">
              <div>
                <h2 className="font-title text-xl sm:text-2xl text-[#24070D] font-bold tracking-wide flex items-center gap-2">
                  <span>Dear Diary…</span>
                  <Feather className="w-5 h-5 text-[#3B0B17] opacity-80" />
                </h2>
                <p className="text-sm font-parchment italic text-[#4E3016]/80 mt-0.5">
                  Write what weighs upon your mind.
                </p>
              </div>

              {authorName && (
                <div className="text-right hidden sm:block">
                  <span className="text-xs uppercase tracking-widest text-[#4E3016]/60 font-sans">
                    Confidant
                  </span>
                  <p className="font-serif italic text-sm text-[#24070D]">
                    {authorName}
                  </p>
                </div>
              )}
            </div>

            {/* Writing surface / textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={handleChange}
                placeholder="My name is Harry Potter... or confide a secret, a doubt, a longing that you dare not whisper aloud to anyone else..."
                disabled={isLoading || isInkAbsorbing}
                rows={9}
                className={`w-full bg-transparent resize-y min-h-[180px] max-h-[500px] text-base sm:text-lg text-[#1E120B] placeholder:text-[#4E3016]/45 font-parchment leading-relaxed focus:outline-none focus:ring-0 selection:bg-[#3B0B17]/20 transition-all ${
                  isInkAbsorbing ? 'ink-absorbing' : ''
                }`}
                style={{
                  lineHeight: '28px',
                }}
              />
            </div>

            {/* Bottom tools: character count & submit button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-[#4E3016]/20">
              <div className="flex items-center gap-3 text-xs font-serif text-[#4E3016]/80">
                <span className={isNearLimit ? 'text-amber-800 font-bold' : ''}>
                  {characterCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} runes
                </span>

                {text.length > 0 && !isLoading && !isInkAbsorbing && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 text-[#4E3016]/60 hover:text-red-900 transition-colors cursor-pointer"
                    title="Vanish draft"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Reveal button */}
              <button
                type="submit"
                disabled={!text.trim() || isLoading || isInkAbsorbing}
                className="w-full sm:w-auto relative group px-6 py-2.5 rounded-xl font-subhead font-semibold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-300 bg-gradient-to-r from-[#24070D] via-[#3B0B17] to-[#123D2B] text-[#F6E2A0] border border-[#D4AF63] hover:border-[#FFF5DC] hover:shadow-[0_0_20px_rgba(212,175,99,0.5)] active:scale-[0.98]"
              >
                {isLoading || isInkAbsorbing ? (
                  <>
                    <Wand2 className="w-4 h-4 text-[#F6E2A0] animate-spin" />
                    <span>Inscribing into the Shadows…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF63] group-hover:scale-125 transition-transform" />
                    <span>Reveal the Diary’s Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
