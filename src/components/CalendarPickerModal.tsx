import React, { useState } from 'react';
import { MONTH_NAMES, isLeapYear, getDaysInMonth } from '../calculations/ageEngine';
import { audioHaptics } from '../utils/audioHaptics';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CalendarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
  selectedMonth: number; // 1-12
  selectedDay: number;
  onSelectDate: (year: number, month: number, day: number) => void;
}

export const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
  isOpen,
  onClose,
  selectedYear,
  selectedMonth,
  selectedDay,
  onSelectDate,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  const [viewYear, setViewYear] = useState<number>(selectedYear);
  const [viewMonth, setViewMonth] = useState<number>(selectedMonth);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  // Day of week for 1st of viewMonth: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();

  const handlePrevMonth = () => {
    audioHaptics.playTapSound();
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    audioHaptics.playTapSound();
    // Prevent navigating past current month in current year
    if (viewYear === currentYear && viewMonth >= currentMonth) return;

    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    audioHaptics.playTapSound();
    onSelectDate(viewYear, viewMonth, day);
    onClose();
  };

  // Generate list of years from 1920 to currentYear
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="text-xs font-mono font-bold text-electric-lime uppercase tracking-widest flex items-center gap-1.5">
            <span>// CHRONO CALENDAR</span>
          </div>

          <button
            onClick={() => {
              audioHaptics.playTapSound();
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
            aria-label="Close calendar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month & Year Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Month Selector */}
            <select
              value={viewMonth}
              onChange={(e) => {
                setViewMonth(parseInt(e.target.value, 10));
                audioHaptics.playTapSound();
              }}
              className="bg-zinc-900 border border-zinc-800 text-white font-mono text-xs rounded px-2.5 py-1.5 focus:border-electric-lime outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((name, idx) => {
                const monthNum = idx + 1;
                const isFuture = viewYear === currentYear && monthNum > currentMonth;
                return (
                  <option key={name} value={monthNum} disabled={isFuture}>
                    {name}
                  </option>
                );
              })}
            </select>

            {/* Year Selector */}
            <select
              value={viewYear}
              onChange={(e) => {
                const y = parseInt(e.target.value, 10);
                setViewYear(y);
                if (y === currentYear && viewMonth > currentMonth) {
                  setViewMonth(currentMonth);
                }
                audioHaptics.playTapSound();
              }}
              className="bg-zinc-900 border border-zinc-800 text-white font-mono text-xs rounded px-2.5 py-1.5 focus:border-electric-lime outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={viewYear === currentYear && viewMonth >= currentMonth}
            className={`p-2 rounded border transition-colors ${
              viewYear === currentYear && viewMonth >= currentMonth
                ? 'opacity-30 border-zinc-900 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
            }`}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center border-b border-zinc-900 pb-2">
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d, i) => (
            <div
              key={d}
              className={`text-[10px] font-mono font-bold ${
                i === 0 || i === 6 ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8 w-8" />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected =
              viewYear === selectedYear &&
              viewMonth === selectedMonth &&
              dayNum === selectedDay;

            const isFuture =
              viewYear === currentYear &&
              viewMonth === currentMonth &&
              dayNum > currentDay;

            return (
              <button
                key={dayNum}
                type="button"
                disabled={isFuture}
                onClick={() => handleSelectDay(dayNum)}
                className={`h-9 w-9 mx-auto rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-electric-lime text-black shadow-[0_0_10px_rgba(212,255,0,0.4)] scale-105'
                    : isFuture
                    ? 'opacity-20 text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent hover:border-zinc-800'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Fast Decade Quick Jumps */}
        <div className="pt-2 border-t border-zinc-900">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
            Decade Quick-Jump
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1980, 1990, 1995, 2000, 2005].map((dec) => (
              <button
                key={dec}
                type="button"
                onClick={() => {
                  setViewYear(dec);
                  audioHaptics.playTapSound();
                }}
                className={`py-1 text-[11px] font-mono rounded border transition-colors ${
                  viewYear === dec
                    ? 'bg-zinc-800 text-white border-zinc-600'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {dec}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
