import React, { useState } from 'react';
import { purchaseManager, PRO_PRICE_STRING } from '../purchases/purchaseManager';
import { audioHaptics } from '../utils/audioHaptics';
import { X, Check, Zap, Sparkles, Shield, Palette, Layers, Orbit } from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = async () => {
    audioHaptics.playTapSound();
    setIsProcessing(true);
    setStatusMessage('Connecting to App Store / Google Play...');

    const res = await purchaseManager.purchasePro();
    setIsProcessing(false);

    if (res.success) {
      audioHaptics.playExportSound();
      setStatusMessage('Unlocked! Thank you for supporting independent craft.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } else {
      setStatusMessage(res.error || 'Purchase failed');
    }
  };

  const handleRestore = async () => {
    audioHaptics.playTapSound();
    setIsProcessing(true);
    setStatusMessage('Restoring purchases...');

    const res = await purchaseManager.restorePurchases();
    setIsProcessing(false);

    if (res.success) {
      audioHaptics.playExportSound();
      setStatusMessage('Purchase restored!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } else {
      setStatusMessage('No active purchase found.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
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

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-electric-lime font-bold">
            <Zap className="w-3 h-3 fill-electric-lime" /> ONE-TIME IMPULSE PASS
          </div>
          <h3 className="text-2xl font-sans font-bold text-white tracking-tight">
            WeirdAge Pro Pass
          </h3>
          <p className="text-xs font-sans text-zinc-400">
            No subscriptions. No recurring fees. 49 cents forever.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 py-2 border-y border-zinc-900">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-zinc-900 text-electric-lime mt-0.5">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">
                All 4 High-Res Share Themes
              </div>
              <div className="text-[11px] text-zinc-400">
                Unlock Electric (Acid Neon) & Weird (Inverted Brutalist) 1080×1920 cards.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-zinc-900 text-electric-lime mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">
                Zero Watermarks / Unbranded Export
              </div>
              <div className="text-[11px] text-zinc-400">
                Generate clean, publication-grade cards with no app logos.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-zinc-900 text-electric-lime mt-0.5">
              <Orbit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">
                Cosmic & Deep Biology Telemetry
              </div>
              <div className="text-[11px] text-zinc-400">
                Unlocks Galactic Drift, Solar Orbital Mileage, and Cellular Turnover.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-zinc-900 text-electric-lime mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">
                Future Visual Packs Included
              </div>
              <div className="text-[11px] text-zinc-400">
                Every future card layout and telemetry metric is automatically yours.
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="text-center text-xs font-mono text-electric-lime animate-pulse">
            {statusMessage}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleBuy}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl bg-electric-lime hover:bg-electric-lime/90 text-black font-sans font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-electric-lime/20"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>UNLOCK FOR {PRO_PRICE_STRING}</span>
          </button>

          <button
            onClick={handleRestore}
            disabled={isProcessing}
            className="w-full py-2.5 text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Restore Previous Purchase
          </button>
        </div>
      </div>
    </div>
  );
};
