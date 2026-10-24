import React from 'react';
import { Sparkles, BookOpen, Lock, Feather, ArrowRight, Shield } from 'lucide-react';
import { magicalAudio } from '../utils/audio.ts';

interface WelcomePageProps {
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onOpenLore: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onOpenAuth, onOpenLore }) => {
  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Decorative center crest */}
      <div className="relative mb-6 group cursor-pointer" onClick={() => onOpenAuth('signin')}>
        {/* Mystic pulsing rings */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D4AF63]/20 via-[#3B0B17]/40 to-[#123D2B]/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-700 animate-pulse" />

        {/* Tome Icon Card */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#24070D] via-[#1A0A0F] to-[#123D2B] border-2 border-[#D4AF63] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(212,175,99,0.3)] group-hover:scale-105 group-hover:border-[#FFF5DC] transition-all duration-500">
          <span className="text-4xl sm:text-5xl select-none" role="img" aria-label="ancient diary">
            📖
          </span>
          <div className="mt-1 flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#D4AF63]">
            <span>Enchanted</span>
          </div>
        </div>
      </div>

      {/* Main Titles */}
      <h2 className="font-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#F6E2A0] gold-glow tracking-wider max-w-3xl leading-tight mb-3">
        CHAMBER OF SECRETS
      </h2>

      <p className="font-subhead text-sm sm:text-base text-[#D4AF63] tracking-widest uppercase mb-4">
        An enchanted journal that listens
      </p>

      <p className="font-parchment italic text-base sm:text-lg text-[#E8D8B5]/85 max-w-xl mx-auto leading-relaxed mb-8">
        "I was once a student like you, harboring secrets too perilous to speak aloud. Inscribe your thoughts into my pages, and see what the shadows answer."
      </p>

      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
        <button
          onClick={() => {
            magicalAudio.playEnchantedChime();
            onOpenAuth('register');
          }}
          type="button"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-subhead font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all duration-300 bg-gradient-to-r from-[#24070D] via-[#3B0B17] to-[#123D2B] text-[#F6E2A0] border border-[#D4AF63] hover:border-[#FFF5DC] hover:shadow-[0_0_25px_rgba(212,175,99,0.45)] hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF63]" />
          <span>Open Your Journal</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF63]" />
        </button>

        <button
          onClick={() => {
            magicalAudio.playParchmentTurn();
            onOpenAuth('signin');
          }}
          type="button"
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-subhead font-semibold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 bg-[#1A0A0F]/80 text-[#E8D8B5] border border-[#D4AF63]/40 hover:border-[#D4AF63] hover:text-[#F6E2A0] hover:bg-[#24070D]"
        >
          <Lock className="w-4 h-4 text-[#D4AF63]" />
          <span>Sign In to Your Diary</span>
        </button>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full text-left">
        <div className="p-5 rounded-2xl bg-[#180A0F]/80 border border-[#D4AF63]/30 shadow-lg hover:border-[#D4AF63]/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#24070D] border border-[#D4AF63]/40 flex items-center justify-center mb-3 text-[#D4AF63]">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-title text-sm sm:text-base text-[#F6E2A0] font-bold mb-1">
            Enchanted Response
          </h3>
          <p className="text-xs font-parchment text-[#E8D8B5]/75 leading-relaxed">
            Powered by Google Gemini AI, the diary awakens to read your thoughts and inscribe intelligent, warm, reflective, and poetic replies in shimmering ink.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#180A0F]/80 border border-[#D4AF63]/30 shadow-lg hover:border-[#D4AF63]/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#24070D] border border-[#D4AF63]/40 flex items-center justify-center mb-3 text-[#D4AF63]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-title text-sm sm:text-base text-[#F6E2A0] font-bold mb-1">
            Firebase Sealed
          </h3>
          <p className="text-xs font-parchment text-[#E8D8B5]/75 leading-relaxed">
            Secured via Firebase Authentication and Firestore Zero-Trust rules. Only you can read, review, or burn your confidential confessions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#180A0F]/80 border border-[#D4AF63]/30 shadow-lg hover:border-[#D4AF63]/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#24070D] border border-[#D4AF63]/40 flex items-center justify-center mb-3 text-[#D4AF63]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-title text-sm sm:text-base text-[#F6E2A0] font-bold mb-1">
            Living Archives
          </h3>
          <p className="text-xs font-parchment text-[#E8D8B5]/75 leading-relaxed">
            Revisit past entries in an ancient parchment book interface, complete with search, date stamps, typewriter playback, and flame disposal.
          </p>
        </div>
      </div>
    </div>
  );
};
