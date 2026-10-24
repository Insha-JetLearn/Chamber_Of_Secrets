import React, { useState, useEffect } from 'react';
import { Sparkles, PenTool, Copy, Check, Clock, Eye, EyeOff } from 'lucide-react';
import { magicalAudio } from '../utils/audio.ts';

interface DiaryResponseProps {
  response: string;
  originalEntry?: string;
  timestamp?: any;
  onWriteAnother: () => void;
  isNewResponse?: boolean;
}

export const DiaryResponse: React.FC<DiaryResponseProps> = ({
  response,
  originalEntry,
  timestamp,
  onWriteAnother,
  isNewResponse = true,
}) => {
  const [displayedText, setDisplayedText] = useState(isNewResponse ? '' : response);
  const [isTyping, setIsTyping] = useState(isNewResponse);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter effect for enchanted reveal
  useEffect(() => {
    if (!isNewResponse) {
      setDisplayedText(response);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let idx = 0;
    const speed = 24; // ms per char
    const interval = setInterval(() => {
      idx++;
      setDisplayedText(response.slice(0, idx));
      if (idx >= response.length) {
        clearInterval(interval);
        setIsTyping(false);
        magicalAudio.playEnchantedChime();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [response, isNewResponse]);

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format timestamp nicely
  const formattedTime = (() => {
    try {
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
      if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        return new Date(timestamp).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
    } catch {
      // fallback
    }
    return new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  })();

  return (
    <div className="relative w-full max-w-3xl mx-auto my-8 animate-fadeIn">
      {/* Outer book frame with dark burgundy glow */}
      <div className="relative rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-[#123D2B]/50 via-[#1A0A0F] to-[#24070D] border-2 border-[#D4AF63]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
        {/* Corner filigree */}
        <div className="absolute top-2 left-2 text-[#D4AF63] text-sm">✧</div>
        <div className="absolute top-2 right-2 text-[#D4AF63] text-sm">✧</div>
        <div className="absolute bottom-2 left-2 text-[#D4AF63] text-sm">✧</div>
        <div className="absolute bottom-2 right-2 text-[#D4AF63] text-sm">✧</div>

        {/* Parchment response sheet */}
        <div className="relative rounded-xl parchment-sheet p-6 sm:p-10 border border-[#4E3016]/40 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#4E3016]/25 pb-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#24070D] text-[#F6E2A0] flex items-center justify-center border border-[#D4AF63] shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-title text-xl sm:text-2xl text-[#24070D] font-bold tracking-wide">
                  The Diary Responds.
                </h3>
                <p className="text-xs font-serif italic text-[#4E3016]/75">
                  Words seeping through the enchanted fibers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-[#4E3016]/70 self-end sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-[#3B0B17]" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Toggle original confession preview if provided */}
          {originalEntry && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#3B0B17]/10 border border-[#4E3016]/20 text-xs text-[#24070D]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-bold uppercase tracking-wider text-[11px] text-[#4E3016]">
                  Your Inscribed Words
                </span>
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  type="button"
                  className="flex items-center gap-1 text-[#3B0B17] hover:underline font-serif"
                >
                  {showOriginal ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> View
                    </>
                  )}
                </button>
              </div>

              {showOriginal && (
                <p className="italic font-parchment text-sm leading-relaxed border-t border-[#4E3016]/15 pt-2 text-[#1E120B]">
                  "{originalEntry}"
                </p>
              )}
            </div>
          )}

          {/* Response Text with typewriter appearance */}
          <div className="relative min-h-[120px] mb-6">
            <div className="text-lg sm:text-xl font-parchment italic leading-relaxed text-[#1E120B] whitespace-pre-wrap selection:bg-[#3B0B17]/20">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2 h-5 bg-[#3B0B17] ml-1 align-middle cursor-flicker" />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#4E3016]/25">
            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B0B17]/10 hover:bg-[#3B0B17]/20 text-xs font-serif text-[#24070D] border border-[#4E3016]/20 transition-all cursor-pointer"
              title="Copy the diary's words"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Preserved to Quill</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Response</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                magicalAudio.playParchmentTurn();
                onWriteAnother();
              }}
              type="button"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#24070D] to-[#3B0B17] text-[#F6E2A0] border border-[#D4AF63] hover:border-[#FFF5DC] font-subhead text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-[#D4AF63]" />
              <span>Inscribe Another Secret</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
