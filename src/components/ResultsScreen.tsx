import React, { useState, useEffect } from 'react';
import { AgeStatistics, PerspectiveItem } from '../types';
import { StatCard } from './StatCard';
import { PerspectiveSection } from './PerspectiveSection';
import { Share2, RefreshCw, Radio, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { audioHaptics } from '../utils/audioHaptics';

interface ResultsScreenProps {
  stats: AgeStatistics;
  perspectiveItems: PerspectiveItem[];
  isPro: boolean;
  onOpenShare: () => void;
  onOpenPro: () => void;
  onReset: () => void;
  onTickSecond?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  stats,
  perspectiveItems,
  isPro,
  onOpenShare,
  onOpenPro,
  onReset,
}) => {
  const [displayDays, setDisplayDays] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);
  const [isLiveTicking, setIsLiveTicking] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(stats.seconds);

  // Animated counting up for hero days
  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayDays(stats.days);
      setRevealComplete(true);
      return;
    }

    const duration = 900; // ms
    const target = stats.days;
    const start = Math.max(0, target - 120);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);
      setDisplayDays(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayDays(target);
        setRevealComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [stats.days]);

  // Live ticking counter
  useEffect(() => {
    setLiveSeconds(stats.seconds);
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveTicking, stats.seconds]);

  return (
    <div className="w-full max-w-xl mx-auto px-5 py-6 pb-28 space-y-8 animate-fadeIn">
      {/* Top Telemetry Breadcrumb */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onReset();
            }}
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>CALCULATE ANOTHER</span>
          </button>
        </div>

        <button
          onClick={() => {
            setIsLiveTicking(!isLiveTicking);
            audioHaptics.playTapSound();
          }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
            isLiveTicking
              ? 'bg-red-950/40 text-red-400 border-red-800 animate-pulse'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>{isLiveTicking ? 'LIVE SECONDS: ON' : 'ENABLE LIVE TICK'}</span>
        </button>
      </div>

      {/* Hero Reveal: "YOU ARE 15,217 DAYS OLD" */}
      <div className="space-y-2 text-left pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-500 uppercase">
            YOU HAVE BEEN ALIVE FOR
          </span>
          <span className="text-[11px] font-mono text-zinc-600 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
            BORN ON A {stats.dayOfWeekBorn.toUpperCase()}
          </span>
        </div>

        {/* Hero Number */}
        <div className="py-2">
          <div className="text-6xl sm:text-7xl md:text-8xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-sm leading-none">
            {new Intl.NumberFormat('en-US').format(displayDays)}
          </div>
        </div>

        {/* Days Old Label */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-zinc-100 uppercase">
            DAYS OLD.
          </h2>
          <div className="h-2 w-2 rounded-full bg-electric-lime animate-ping" />
        </div>

        <p className="text-xs sm:text-sm font-sans text-zinc-400 pt-1">
          Born {stats.birthDateString}. That’s {stats.formattedWeeks} full weeks on Earth.
        </p>
      </div>

      {/* Primary Hero Share Banner Callout */}
      <div
        onClick={() => {
          audioHaptics.playTapSound();
          onOpenShare();
        }}
        className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-zinc-800 hover:border-electric-lime cursor-pointer transition-all flex items-center justify-between group shadow-md"
      >
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-electric-lime uppercase tracking-widest font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> READY TO POST
          </span>
          <div className="font-sans font-bold text-white text-base sm:text-lg group-hover:text-electric-lime transition-colors">
            Generate 1080×1920 Share Card
          </div>
          <div className="text-xs text-zinc-400">
            Instagram Stories, TikTok, Snapchat, Messages formatted
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-white group-hover:bg-electric-lime text-black transition-colors">
          <Share2 className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>

      {/* Core Secondary Statistics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            // CHRONOMETRIC BREAKDOWN
          </span>
          <span className="text-xs font-mono text-zinc-500">6 METRICS</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            tag="HRS"
            label="Total Hours"
            value={stats.formattedHours}
            unit="hours elapsed"
            index={0}
          />
          <StatCard
            tag="MIN"
            label="Total Minutes"
            value={stats.compactMinutes}
            sublabel={`Exact: ${stats.formattedMinutes}`}
            unit="minutes lived"
            index={1}
          />
          <StatCard
            tag="SEC"
            label="Total Seconds"
            value={isLiveTicking ? new Intl.NumberFormat('en-US').format(liveSeconds) : stats.compactSeconds}
            sublabel={isLiveTicking ? 'Ticking live...' : `Exact: ${stats.formattedSeconds}`}
            unit="seconds recorded"
            index={2}
          />
          <StatCard
            tag="WKS"
            label="Total Weeks"
            value={stats.formattedWeeks}
            sublabel="Full 7-day calendar weeks"
            unit="weeks alive"
            index={3}
          />
          <StatCard
            tag="SUN"
            label="Sundays Experienced"
            value={stats.formattedSundays}
            sublabel="Exact count of calendar Sundays"
            unit="Sundays survived"
            index={4}
          />
          <StatCard
            tag="ORB"
            label="Solar Earth Orbits"
            value={stats.formattedBirthdays}
            sublabel="Annual trips around the Sun"
            unit="Birthdays celebrated"
            index={5}
          />
        </div>
      </div>

      {/* Next Milestone Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            NEXT DAY MILESTONE
          </div>
          <div className="font-mono font-bold text-xl text-white">
            {new Intl.NumberFormat('en-US').format(stats.nextDayMilestone.targetDays)} Days
          </div>
          <div className="text-xs text-zinc-400">
            Arrives in <span className="text-white font-mono font-semibold">{stats.nextDayMilestone.daysRemaining} days</span> (Next birthday in {stats.daysUntilNextBirthday} days)
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            TARGET #{stats.nextBirthdayAge}
          </span>
        </div>
      </div>

      {/* Perspective Telemetry Section */}
      <PerspectiveSection
        items={perspectiveItems}
        isPro={isPro}
        onOpenPro={onOpenPro}
      />

      {/* Sticky Bottom Floating Share Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-md border-t border-zinc-800/80 z-30">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onReset();
            }}
            className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            aria-label="Calculate another age"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onOpenShare();
            }}
            className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-sans font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>SHARE MY AGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
