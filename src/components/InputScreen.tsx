import React, { useState, useRef } from 'react';
import { BirthDateInput } from '../types';
import { isValidDate } from '../calculations/ageEngine';
import { audioHaptics } from '../utils/audioHaptics';
import { CalendarPickerModal } from './CalendarPickerModal';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';

interface InputScreenProps {
  initialValue?: BirthDateInput | null;
  onCalculate: (input: BirthDateInput) => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({ initialValue, onCalculate }) => {
  const currentYear = new Date().getFullYear();

  // Default to 25 years ago if no initial value provided
  const defaultYear = initialValue ? initialValue.year : currentYear - 25;
  const defaultMonth = initialValue ? initialValue.month : 6;
  const defaultDay = initialValue ? initialValue.day : 15;

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number>(defaultMonth);
  const [day, setDay] = useState<number>(defaultDay);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Native date string for <input type="date">
  const toDateString = (y: number, m: number, d: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${y}-${pad(m)}-${pad(d)}`;
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      setYear(y);
      setMonth(m);
      setDay(d);
      setError(null);
      audioHaptics.playTapSound();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const candidate: BirthDateInput = { year, month, day };
    if (!isValidDate(candidate)) {
      setError('Please choose a valid past date.');
      audioHaptics.triggerHaptic([40, 40]);
      return;
    }
    setError(null);
    audioHaptics.playRevealSound();
    onCalculate(candidate);
  };

  const setPresetAge = (targetAge: number) => {
    const now = new Date();
    const y = now.getFullYear() - targetAge;
    const m = now.getMonth() + 1;
    const d = now.getDate();
    setYear(y);
    setMonth(m);
    setDay(d);
    setError(null);
    audioHaptics.playTapSound();
  };

  const handleDateSelected = (y: number, m: number, d: number) => {
    setYear(y);
    setMonth(m);
    setDay(d);
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-5 py-8 flex flex-col justify-between min-h-[calc(100vh-65px)]">
      {/* Hero Header */}
      <div className="space-y-4 pt-4 sm:pt-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-electric-lime" />
          <span>ZERO SCIENTIFIC FLUFF // PURE CHRONOMETRY</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white leading-[1.08]">
          How old are you, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            really?
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg font-sans max-w-md leading-relaxed">
          Find out in days, hours, minutes, seconds... and a few weirder ways.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="my-8 space-y-6">
        {/* Large Interactive Date Picker Box */}
        <div
          onClick={() => {
            audioHaptics.playTapSound();
            setIsCalendarOpen(true);
          }}
          className="bg-zinc-950/80 border-2 border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors relative group focus-within:border-electric-lime cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="birthdate-picker" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider cursor-pointer">
              Select Date of Birth
            </label>
            <span className="text-[10px] font-mono text-electric-lime bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              TAP TO OPEN CALENDAR
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {new Date(year, month - 1, day).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioHaptics.playTapSound();
                setIsCalendarOpen(true);
              }}
              aria-label="Open interactive calendar"
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-electric-lime hover:text-electric-lime transition-colors border border-zinc-800"
            >
              <Calendar className="w-6 h-6" />
            </button>
          </div>

          {/* Native hidden date input for browser autofill & fallback */}
          <input
            ref={dateInputRef}
            id="birthdate-picker"
            type="date"
            value={toDateString(year, month, day)}
            max={toDateString(currentYear, new Date().getMonth() + 1, new Date().getDate())}
            min="1900-01-01"
            onChange={handleNativeChange}
            className="sr-only"
            aria-label="Enter your date of birth"
          />
        </div>

        {/* Quick Presets for Rapid Frictionless Exploration */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
            <span>Quick Explorer</span>
            <span className="text-zinc-600">Tap to test</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {[18, 21, 25, 30, 40, 50].map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => setPresetAge(age)}
                className="py-2 px-1 text-center font-mono text-xs rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-colors"
              >
                {age} yo
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-sans font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-lg shadow-white/5"
        >
          <span>SHOW ME</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </form>

      {/* Trust & Privacy Micro-Footer */}
      <div className="pt-4 border-t border-zinc-900 text-center">
        <p className="text-[11px] font-mono text-zinc-600">
          🔒 100% OFFLINE // ZERO NETWORK CALLS // NO ACCOUNTS
        </p>
      </div>

      {/* Interactive Calendar Picker Modal */}
      <CalendarPickerModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedYear={year}
        selectedMonth={month}
        selectedDay={day}
        onSelectDate={handleDateSelected}
      />
    </div>
  );
};
