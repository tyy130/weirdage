import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';
import { getAudioMuted, setAudioMuted } from '../storage/storage';
import { audioHaptics } from '../utils/audioHaptics';

interface HeaderProps {
  isPro: boolean;
  onOpenPro: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isPro, onOpenPro, onOpenPrivacy }) => {
  const [muted, setMuted] = useState(getAudioMuted());
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toTimeString().split(' ')[0]
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    audioHaptics.playTapSound();
  };

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slughouse-border bg-black/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center space-x-2">
        <span className="font-mono font-bold text-lg tracking-tight text-white flex items-center">
          WEIRD<span className="text-electric-lime">AGE</span>
        </span>
        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
          SYS {timeString}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Pro Button or Badge */}
        {isPro ? (
          <span className="text-[11px] font-mono font-bold text-black bg-electric-lime px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-[0_0_10px_rgba(212,255,0,0.3)]">
            <Zap className="w-3 h-3 fill-black" /> PRO
          </span>
        ) : (
          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onOpenPro();
            }}
            className="text-[11px] font-mono font-bold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 px-2 py-1 rounded-sm transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-electric-lime" /> $0.49 PRO
          </button>
        )}

        {/* Audio Mute */}
        <button
          onClick={toggleSound}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-electric-lime" />}
        </button>

        {/* Privacy */}
        <button
          onClick={() => {
            audioHaptics.playTapSound();
            onOpenPrivacy();
          }}
          aria-label="Privacy & Data Control"
          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
