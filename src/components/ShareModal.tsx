import React, { useState, useEffect, useRef } from 'react';
import { AgeStatistics, ShareTheme, ThemeConfig } from '../types';
import { renderShareCardToBlob } from '../utils/shareCanvas';
import { audioHaptics } from '../utils/audioHaptics';
import { X, Share2, Download, Copy, Check, Lock, Sparkles, Sliders } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AgeStatistics;
  isPro: boolean;
  onOpenPro: () => void;
}

const THEMES: ThemeConfig[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine typography, warm cream background, terracotta accent',
    isPro: false,
    bg: '#F5F2EB',
    textColor: '#111111',
    accentColor: '#FF3B00',
    secondaryTextColor: '#6E6B65',
    borderColor: '#D5D1C6',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Industrial obsidian, stark white numbers, MTX telemetry',
    isPro: false,
    bg: '#070709',
    textColor: '#FFFFFF',
    accentColor: '#666666',
    secondaryTextColor: '#888888',
    borderColor: '#222226',
  },
  {
    id: 'electric',
    name: 'Electric',
    description: 'Acid neon lime, high-voltage contrast, cyber telemetry',
    isPro: true,
    bg: '#060709',
    textColor: '#FFFFFF',
    accentColor: '#D4FF00',
    secondaryTextColor: '#8E9AA8',
    borderColor: '#D4FF00',
  },
  {
    id: 'weird',
    name: 'Weird',
    description: 'Surreal monochromatic split, inverted brutalist grids',
    isPro: true,
    bg: '#000000',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    secondaryTextColor: '#888888',
    borderColor: '#333333',
  },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  stats,
  isPro,
  onOpenPro,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ShareTheme>('editorial');
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [unbranded, setUnbranded] = useState(isPro);

  const activeThemeConfig = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];
  const isThemeLocked = activeThemeConfig.isPro && !isPro;

  // Generate / update live preview image
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const generatePreview = async () => {
      setIsGenerating(true);
      try {
        const blob = await renderShareCardToBlob({
          stats,
          theme: selectedTheme,
          isUnbranded: isPro && unbranded,
        });
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setPreviewBlobUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
      } catch (err) {
        console.error('Failed to render share preview', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedTheme, isPro, unbranded, stats]);

  // Clean up blob URL on close
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  if (!isOpen) return null;

  const handleShare = async () => {
    audioHaptics.playExportSound();
    setIsGenerating(true);

    try {
      const blob = await renderShareCardToBlob({
        stats,
        theme: selectedTheme,
        isUnbranded: isPro && unbranded,
      });

      const fileName = `weirdage-${stats.days}-days-${selectedTheme}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check for Web Share Level 2 support (file sharing)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `I am ${stats.formattedDays} days old`,
            text: `I've been alive for ${stats.formattedDays} days on Earth. Calculated via WeirdAge.`,
          });
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') return; // User cancelled share sheet
        }
      }

      // Fallback: direct download
      downloadBlob(blob, fileName);
    } catch (e) {
      console.error('Share failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    audioHaptics.playExportSound();
    setIsGenerating(true);
    try {
      const blob = await renderShareCardToBlob({
        stats,
        theme: selectedTheme,
        isUnbranded: isPro && unbranded,
      });
      downloadBlob(blob, `weirdage-${stats.days}-days-${selectedTheme}.png`);
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    audioHaptics.playTapSound();
    try {
      const blob = await renderShareCardToBlob({
        stats,
        theme: selectedTheme,
        isUnbranded: isPro && unbranded,
      });

      if (navigator.clipboard && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Fallback
        downloadBlob(blob, `weirdage-${stats.days}-days-${selectedTheme}.png`);
      }
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Modal Header */}
      <div className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-white">
            SHARE CARD STUDIO
          </span>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
            1080×1920 (9:16)
          </span>
        </div>

        <button
          onClick={() => {
            audioHaptics.playTapSound();
            onClose();
          }}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-xl mx-auto px-4 py-4 flex-1 flex flex-col items-center justify-center">
        {/* Live Card Preview (9:16 Aspect Ratio container) */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center my-2">
          {previewBlobUrl ? (
            <img
              src={previewBlobUrl}
              alt="WeirdAge Share Card Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xs font-mono text-zinc-500 animate-pulse">
              RENDERING 1080×1920...
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-white">
              <Sparkles className="w-4 h-4 animate-spin text-electric-lime mr-2" />
              UPDATING...
            </div>
          )}

          {/* Locked Watermark overlay if Pro theme selected without Pro */}
          {isThemeLocked && (
            <div
              onClick={() => onOpenPro()}
              className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700 text-center cursor-pointer hover:border-electric-lime transition-colors"
            >
              <div className="text-[11px] font-mono font-bold text-electric-lime flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> PRO THEME PREVIEW
              </div>
              <div className="text-[10px] text-zinc-300">
                Tap to unlock all 4 themes for $0.49
              </div>
            </div>
          )}
        </div>

        {/* Theme Picker Selector */}
        <div className="w-full mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>SELECT THEME</span>
            <span className="text-zinc-600">{activeThemeConfig.name}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {THEMES.map((theme) => {
              const active = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    audioHaptics.playTapSound();
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    active
                      ? 'border-white bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/40 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: theme.bg }}
                  >
                    {theme.isPro && (
                      <span className="text-[8px] font-bold text-black">⚡</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-medium truncate">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pro Watermark Removal Toggle */}
        {isPro && (
          <div className="w-full mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-300">
              Remove WeirdAge Footer Branding
            </span>
            <button
              onClick={() => {
                setUnbranded(!unbranded);
                audioHaptics.playTapSound();
              }}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                unbranded ? 'bg-electric-lime' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  unbranded ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="w-full max-w-xl mx-auto p-4 border-t border-zinc-800 bg-black/95">
        {isThemeLocked ? (
          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onOpenPro();
            }}
            className="w-full py-3.5 px-5 rounded-xl bg-electric-lime hover:bg-electric-lime/90 text-black font-sans font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-electric-lime/20"
          >
            <Lock className="w-4 h-4" />
            <span>UNLOCK THIS THEME FOR $0.49</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors flex items-center justify-center"
              title="Copy image to clipboard"
            >
              {isCopied ? <Check className="w-5 h-5 text-electric-lime" /> : <Copy className="w-5 h-5" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors flex items-center justify-center"
              title="Save PNG image directly"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-sans font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-white/5"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>SHARE CARD</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
