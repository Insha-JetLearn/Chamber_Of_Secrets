import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../services/authService.ts';
import { magicalAudio } from '../utils/audio.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      magicalAudio.playEnchantedChime();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google portal could not open.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your scroll identifier (email) and secret incantation (password).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        await registerWithEmail(email.trim(), password, displayName.trim());
      } else {
        await loginWithEmail(email.trim(), password);
      }
      magicalAudio.playEnchantedChime();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication spell failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed enchanted backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#1C0B12] via-[#14080D] to-[#100508] border-2 border-[#D4AF63] rounded-2xl shadow-[0_0_50px_rgba(212,175,99,0.25)] p-6 sm:p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#E8D8B5]/60 hover:text-[#F6E2A0] hover:bg-[#3B0B17] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Crest */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#24070D] to-[#3B0B17] border border-[#D4AF63] flex items-center justify-center shadow-lg shadow-[#D4AF63]/20">
            <span className="text-2xl" role="img" aria-label="enchanted key">
              🗝️
            </span>
          </div>
          <h3 className="font-title text-xl text-[#F6E2A0] gold-glow font-bold">
            {mode === 'signin' ? 'Unseal the Diary' : 'Inscribe Your Name'}
          </h3>
          <p className="text-xs font-parchment italic text-[#E8D8B5]/75 mt-1">
            {mode === 'signin'
              ? 'Enter to access your private secrets and revelations.'
              : 'Claim your personal enchanted journal guarded by ancient magic.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-[#100508] p-1 border border-[#D4AF63]/30 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-subhead font-semibold rounded transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#3B0B17] text-[#F6E2A0] border border-[#D4AF63]/50 shadow-sm'
                : 'text-[#E8D8B5]/60 hover:text-[#E8D8B5]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-subhead font-semibold rounded transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#3B0B17] text-[#F6E2A0] border border-[#D4AF63]/50 shadow-sm'
                : 'text-[#E8D8B5]/60 hover:text-[#E8D8B5]'
            }`}
          >
            Inscribe Account
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#24070D] hover:bg-[#320A13] border border-[#D4AF63]/60 text-xs sm:text-sm font-subhead font-semibold text-[#F6E2A0] shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#D4AF63]/25" />
          <span className="text-[11px] font-serif uppercase tracking-widest text-[#D4AF63]/60">
            or use your scroll
          </span>
          <div className="flex-1 h-px bg-[#D4AF63]/25" />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-600/60 flex items-start gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-subhead uppercase tracking-wider text-[#D4AF63] mb-1">
                Your Wizarding Name / Title
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#D4AF63]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Tom Marvolo Riddle"
                  className="w-full bg-[#100508] border border-[#D4AF63]/30 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#F3E9D5] placeholder:text-[#E8D8B5]/35 focus:outline-none focus:border-[#D4AF63]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-subhead uppercase tracking-wider text-[#D4AF63] mb-1">
              Owl Address (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF63]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wizard@hogwarts.edu"
                className="w-full bg-[#100508] border border-[#D4AF63]/30 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#F3E9D5] placeholder:text-[#E8D8B5]/35 focus:outline-none focus:border-[#D4AF63]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-subhead uppercase tracking-wider text-[#D4AF63] mb-1">
              Secret Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF63]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#100508] border border-[#D4AF63]/30 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#F3E9D5] placeholder:text-[#E8D8B5]/35 focus:outline-none focus:border-[#D4AF63]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#24070D] via-[#3B0B17] to-[#123D2B] border border-[#D4AF63] hover:border-[#FFF5DC] text-[#F6E2A0] text-xs sm:text-sm font-subhead font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF63]" />
            <span>
              {loading
                ? 'Speaking Incantation…'
                : mode === 'signin'
                ? 'Open Secret Journal'
                : 'Create Enchanted Journal'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
