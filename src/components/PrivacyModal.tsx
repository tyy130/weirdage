import React, { useState } from 'react';
import { clearSavedData } from '../storage/storage';
import { audioHaptics } from '../utils/audioHaptics';
import { X, ShieldCheck, Trash2, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onDataCleared,
}) => {
  const [cleared, setCleared] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    audioHaptics.playTapSound();
    clearSavedData();
    setCleared(true);
    setTimeout(() => {
      onDataCleared();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative space-y-4">
        <button
          onClick={() => {
            audioHaptics.playTapSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-electric-lime">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-xl font-sans font-bold text-white tracking-tight">
            Zero-Knowledge Privacy
          </h3>
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          WeirdAge is designed with radical privacy at its foundation.
        </p>

        <div className="space-y-2.5 py-2 border-y border-zinc-900 text-xs font-sans text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-electric-lime">✓</span>
            <span><strong>100% Client-Side:</strong> All calculations run entirely inside your device processor.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-electric-lime">✓</span>
            <span><strong>Zero Network Calls:</strong> Your birthday is never uploaded to any server or cloud API.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-electric-lime">✓</span>
            <span><strong>No Tracking or Trackers:</strong> No advertising IDs, no invasive telemetry scripts, no third-party trackers.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-electric-lime">✓</span>
            <span><strong>Local Only:</strong> If you choose, your birthday is stored locally only to save time when opening the app.</span>
          </div>
        </div>

        {/* Clear Data Button */}
        <div className="pt-2">
          <button
            onClick={handleClear}
            disabled={cleared}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-red-950/60 text-zinc-300 hover:text-red-300 border border-zinc-800 hover:border-red-800 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {cleared ? (
              <>
                <Check className="w-4 h-4 text-electric-lime" />
                <span>All Local Data Erased</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Erase Saved Birthday from Device</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
