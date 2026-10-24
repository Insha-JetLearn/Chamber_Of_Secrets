import React from 'react';
import { X, Sparkles, Book, Key, ShieldCheck, Feather } from 'lucide-react';

interface LoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#1C0B12] via-[#14080D] to-[#100508] border-2 border-[#D4AF63] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#E8D8B5]/60 hover:text-[#F6E2A0] hover:bg-[#3B0B17] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[#24070D] to-[#3B0B17] border border-[#D4AF63] flex items-center justify-center text-xl">
            ⚡
          </div>
          <h3 className="font-title text-xl text-[#F6E2A0] gold-glow font-bold">
            The Legend of the Enchanted Journal
          </h3>
          <p className="text-xs font-parchment italic text-[#E8D8B5]/80 mt-1">
            "An ancient artifact found deep within the Chamber of Secrets."
          </p>
        </div>

        <div className="space-y-5 text-xs sm:text-sm font-parchment text-[#E8D8B5] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#24070D]/60 border border-[#D4AF63]/30">
            <h4 className="font-title text-[#F6E2A0] font-semibold text-sm flex items-center gap-2 mb-2">
              <Feather className="w-4 h-4 text-[#D4AF63]" />
              <span>How the Diary Works</span>
            </h4>
            <p>
              When you write your thoughts upon these aged parchment pages and invoke the diary, your words are absorbed into the magical paper. An ancient, intelligent presence stirs within and responds in shimmering ink—listening without judgment, acknowledging your burdens, and offering warm, reflective counsel.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#123D2B]/30 border border-[#D4AF63]/30">
            <h4 className="font-title text-[#F6E2A0] font-semibold text-sm flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF63]" />
              <span>Guarded by Firebase Security</span>
            </h4>
            <p>
              Every entry is cryptographically sealed in Firebase Firestore under strict access control rules. Only you, the authenticated writer, possess the key to read or burn your past memories.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#3B0B17]/40 border border-[#D4AF63]/30">
            <h4 className="font-title text-[#F6E2A0] font-semibold text-sm flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-[#D4AF63]" />
              <span>Gemini AI & Settings Guide</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li>
                <strong>API Key in Secrets:</strong> Obtain your key at{' '}
                <span className="text-[#F6E2A0] font-mono">aistudio.google.com</span> and set{' '}
                <span className="text-[#F6E2A0] font-mono">GEMINI_API_KEY</span> in the AI Studio Settings &gt; Secrets panel.
              </li>
              <li>
                <strong>Server-Side Protection:</strong> All Gemini calls are proxied securely through the backend server (<span className="font-mono text-[#F6E2A0]">/api/diary-response</span>), keeping your secret key completely private.
              </li>
              <li>
                <strong>Firebase Authentication:</strong> Google Sign-In and Email/Password authentication are provisioned for your journal.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl gold-button font-subhead text-xs font-semibold tracking-wider cursor-pointer"
          >
            I Understand the Magic
          </button>
        </div>
      </div>
    </div>
  );
};
