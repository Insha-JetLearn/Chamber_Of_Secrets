import React, { useState, useEffect } from 'react';
import { Sparkles, Feather } from 'lucide-react';

const MESSAGES = [
  'The ink sinks softly into the ancient fibers...',
  'The mysterious consciousness awakens within the pages...',
  'Whispers of old secrets stir in the quiet dark...',
  'Ancient ink is preparing an answer for you...',
];

export const MagicalLoader: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-fadeIn">
      {/* Central magical ink orb and swirling rings */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Outer glowing pulsing aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3B0B17]/60 via-[#D4AF63]/20 to-[#123D2B]/50 blur-xl animate-pulse" />

        {/* Rotating ornamental ring */}
        <div
          className="absolute inset-1 rounded-full border border-dashed border-[#D4AF63]/50 animate-spin"
          style={{ animationDuration: '12s' }}
        />

        {/* Counter-rotating ring */}
        <div
          className="absolute inset-3 rounded-full border border-[#D4AF63]/30 border-t-transparent border-b-transparent animate-spin"
          style={{ animationDuration: '6s', animationDirection: 'reverse' }}
        />

        {/* Center emblem */}
        <div className="relative z-10 w-14 h-14 rounded-full bg-[#1A0A0F] border border-[#D4AF63] flex items-center justify-center shadow-lg shadow-[#D4AF63]/20">
          <Feather className="w-6 h-6 text-[#D4AF63] animate-bounce" style={{ animationDuration: '2s' }} />
        </div>

        {/* Floating sparkles */}
        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#F6E2A0] animate-pulse" />
        <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-[#D4AF63] animate-pulse delay-300" />
      </div>

      <h4 className="font-title text-lg text-[#F6E2A0] gold-glow mb-2 flex items-center gap-2">
        <span>Consulting the Diary</span>
      </h4>

      <p className="text-sm italic text-[#E8D8B5]/80 font-parchment max-w-md transition-all duration-500 ease-in-out min-h-[1.5rem]">
        {MESSAGES[msgIndex]}
      </p>

      {/* Subtle ink droplets progress dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              dot === msgIndex % 4 ? 'bg-[#D4AF63] scale-125 shadow-md shadow-[#D4AF63]' : 'bg-[#D4AF63]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
