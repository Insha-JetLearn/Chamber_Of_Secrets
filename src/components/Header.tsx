import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  BookOpen,
  History,
  Volume2,
  VolumeX,
  HelpCircle,
  LogOut,
  Sparkles,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { magicalAudio } from '../utils/audio.ts';
import { logoutUser } from '../services/authService.ts';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenLore: () => void;
  entryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onOpenHistory,
  onOpenLore,
  entryCount,
}) => {
  const [isMuted, setIsMuted] = useState(magicalAudio.getIsMuted());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleSound = () => {
    const nextMuted = magicalAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      magicalAudio.playEnchantedChime();
    }
  };

  const handleLogout = async () => {
    try {
      setUserDropdownOpen(false);
      await logoutUser();
      magicalAudio.playParchmentTurn();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="relative z-30 w-full border-b border-[#D4AF63]/30 bg-[#14080D]/90 backdrop-blur-md px-4 py-3 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Magical Emblem and Title */}
        <div className="flex items-center gap-3">
          {/* Emblem */}
          <div className="relative group cursor-pointer" onClick={onOpenLore} title="View Diary Lore">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#24070D] to-[#3B0B17] border border-[#D4AF63] flex items-center justify-center shadow-md shadow-[#D4AF63]/20 group-hover:border-[#F6E2A0] group-hover:shadow-[#D4AF63]/40 transition-all">
              <span className="text-xl select-none" role="img" aria-label="enchanted diary">
                🐍
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#123D2B] border border-[#D4AF63]" />
          </div>

          <div>
            <h1 className="font-title text-base sm:text-lg md:text-xl font-bold tracking-wider text-[#F6E2A0] gold-glow flex items-center gap-2">
              CHAMBER OF SECRETS
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF63] hidden sm:inline-block" />
            </h1>
            <p className="text-xs text-[#E8D8B5]/70 italic font-parchment tracking-wide">
              An enchanted journal that listens.
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chimes Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className="p-2 rounded-lg bg-[#24070D]/70 border border-[#D4AF63]/30 text-[#E8D8B5] hover:text-[#F6E2A0] hover:border-[#D4AF63] hover:bg-[#3B0B17] transition-all"
            title={isMuted ? 'Unmute magical sounds' : 'Mute magical sounds'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 opacity-60" /> : <Volume2 className="w-4 h-4 text-[#D4AF63]" />}
          </button>

          {/* Lore Info Button */}
          <button
            onClick={onOpenLore}
            type="button"
            className="p-2 rounded-lg bg-[#24070D]/70 border border-[#D4AF63]/30 text-[#E8D8B5] hover:text-[#F6E2A0] hover:border-[#D4AF63] hover:bg-[#3B0B17] transition-all"
            title="Ancient Lore"
            aria-label="Lore & Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* History / Previous Entries Button */}
          {user && (
            <button
              onClick={() => {
                magicalAudio.playParchmentTurn();
                onOpenHistory();
              }}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#24070D] border border-[#D4AF63]/50 text-[#F6E2A0] hover:border-[#F6E2A0] hover:bg-[#3B0B17] shadow-sm transition-all text-xs sm:text-sm font-subhead"
            >
              <History className="w-4 h-4 text-[#D4AF63]" />
              <span className="hidden sm:inline">Secrets</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#3B0B17] border border-[#D4AF63]/40 text-[11px] font-mono text-[#F6E2A0]">
                {entryCount}
              </span>
            </button>
          )}

          {/* Auth Button or User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                type="button"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#24070D] border border-[#D4AF63]/50 hover:border-[#D4AF63] transition-all text-xs"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-[#D4AF63]/60 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#3B0B17] border border-[#D4AF63]/60 flex items-center justify-center text-[#F6E2A0] font-bold text-xs">
                    {(user.displayName || user.email || 'W')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-[#E8D8B5] hidden md:inline font-parchment">
                  {user.displayName || user.email?.split('@')[0] || 'Wizard'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF63]" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1A0A0F] border border-[#D4AF63] shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-[#D4AF63]/20 mb-1">
                      <p className="font-semibold text-[#F6E2A0] truncate">
                        {user.displayName || 'Enchanted Scribe'}
                      </p>
                      <p className="text-[11px] text-[#E8D8B5]/60 truncate font-mono">
                        {user.email || 'Confidential Scribe'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenHistory();
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#3B0B17] text-[#E8D8B5] flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#D4AF63]" />
                      <span>Review Past Confessions ({entryCount})</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#3B0B17] text-rose-300 flex items-center gap-2 border-t border-[#D4AF63]/10 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Seal Journal & Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              type="button"
              className="gold-button flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-subhead"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
