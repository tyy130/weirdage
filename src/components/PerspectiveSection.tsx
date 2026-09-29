import React from 'react';
import { PerspectiveItem } from '../types';
import { Lock, Sparkles, Orbit, Heart, Wind, Moon, BedDouble, Calendar } from 'lucide-react';
import { audioHaptics } from '../utils/audioHaptics';

interface PerspectiveSectionProps {
  items: PerspectiveItem[];
  isPro: boolean;
  onOpenPro: () => void;
}

export const PerspectiveSection: React.FC<PerspectiveSectionProps> = ({
  items,
  isPro,
  onOpenPro,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cosmic':
        return <Orbit className="w-4 h-4 text-electric-cyan" />;
      case 'biological':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'time':
        return <Calendar className="w-4 h-4 text-electric-lime" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-electric-lime uppercase tracking-widest block mb-0.5">
            // TELEMETRIC CONTEXT
          </span>
          <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
            Put That in Perspective
          </h2>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          {items.length} METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const locked = item.isPro && !isPro;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (locked) {
                  audioHaptics.playTapSound();
                  onOpenPro();
                }
              }}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                locked
                  ? 'bg-zinc-950/40 border-zinc-900 cursor-pointer opacity-75 hover:opacity-100 hover:border-zinc-700'
                  : 'bg-zinc-950/90 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  {getCategoryIcon(item.category)}
                  <span className="font-semibold text-zinc-300">{item.title}</span>
                </div>

                {locked ? (
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600">
                    #{idx + 1}
                  </span>
                )}
              </div>

              <div className="font-mono font-bold text-xl sm:text-2xl text-white tracking-tight my-1">
                {item.metric}
              </div>

              <p className="text-xs font-sans text-zinc-400 leading-relaxed mt-1">
                {item.subtitle}
              </p>

              {item.note && (
                <div className="text-[10px] font-mono text-zinc-600 mt-2.5 border-t border-zinc-900/80 pt-2">
                  ℹ {item.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
