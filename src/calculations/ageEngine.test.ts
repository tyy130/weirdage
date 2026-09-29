import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getDaysInMonth,
  isValidDate,
  calculateAgeStatistics,
  formatCompact,
  formatNumber,
} from './ageEngine';

describe('ageEngine calculation logic', () => {
  it('correctly determines leap years according to Gregorian calendar', () => {
    expect(isLeapYear(2000)).toBe(true);  // div by 400
    expect(isLeapYear(1900)).toBe(false); // div by 100 but not 400
    expect(isLeapYear(2024)).toBe(true);  // div by 4
    expect(isLeapYear(2023)).toBe(false); // standard year
    expect(isLeapYear(2020)).toBe(true);
  });

  it('accurately reports days in each month including leap February', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2023, 2)).toBe(28);
    expect(getDaysInMonth(2024, 4)).toBe(30);
    expect(getDaysInMonth(2024, 1)).toBe(31);
    expect(getDaysInMonth(2024, 12)).toBe(31);
  });

  it('validates dates correctly and rejects invalid or future dates', () => {
    expect(isValidDate({ year: 1995, month: 6, day: 15 })).toBe(true);
    expect(isValidDate({ year: 2000, month: 2, day: 29 })).toBe(true);
    expect(isValidDate({ year: 2001, month: 2, day: 29 })).toBe(false); // Not a leap year
    expect(isValidDate({ year: 1990, month: 13, day: 1 })).toBe(false); // Invalid month
    expect(isValidDate({ year: 2099, month: 1, day: 1 })).toBe(false);  // Future date
  });

  it('formats large numbers into punchy compact strings', () => {
    expect(formatCompact(1_314_748_800)).toBe('1.31 BILLION');
    expect(formatCompact(21_912_480)).toBe('21.9 MILLION');
    expect(formatCompact(365_208)).toBe('365.2 THOUSAND');
    expect(formatNumber(15217)).toBe('15,217');
  });

  it('calculates exact age stats for a known reference date', () => {
    // Reference date: 2026-09-29 12:00:00 local time
    const ref = new Date(2026, 8, 29, 12, 0, 0, 0); // month index 8 is September
    // Birthdate: 2000-09-29
    const stats = calculateAgeStatistics({ year: 2000, month: 9, day: 29 }, ref);

    expect(stats.birthdays).toBe(26);
    expect(stats.days).toBeGreaterThan(9490);
    expect(stats.weeks).toBe(Math.floor(stats.days / 7));
    expect(stats.sundays).toBeGreaterThan(1300);
    expect(stats.hours).toBe(stats.days * 24 + 12);
  });

  it('handles leap day baby (Feb 29) gracefully', () => {
    const ref = new Date(2024, 2, 1, 12, 0, 0); // March 1, 2024
    const stats = calculateAgeStatistics({ year: 2000, month: 2, day: 29 }, ref);
    expect(stats.isLeapYearBaby).toBe(true);
    expect(stats.birthdays).toBe(24);
  });

  it('handles born yesterday and born today cleanly', () => {
    const today = new Date(2026, 8, 29, 14, 0, 0);
    const todayStats = calculateAgeStatistics({ year: 2026, month: 9, day: 29 }, today);
    expect(todayStats.days).toBe(0);
    expect(todayStats.birthdays).toBe(0);

    const yesterdayStats = calculateAgeStatistics({ year: 2026, month: 9, day: 28 }, today);
    expect(yesterdayStats.days).toBe(1);
    expect(yesterdayStats.hours).toBe(38); // 24 hrs + 14 hrs
  });
});
