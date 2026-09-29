import { BirthDateInput, AgeStatistics } from '../types';

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

export function isValidDate(input: BirthDateInput): boolean {
  if (!input.year || !input.month || !input.day) return false;
  if (input.year < 1900 || input.year > new Date().getFullYear()) return false;
  if (input.month < 1 || input.month > 12) return false;
  const maxDays = getDaysInMonth(input.year, input.month);
  if (input.day < 1 || input.day > maxDays) return false;

  const targetDate = new Date(input.year, input.month - 1, input.day);
  const now = new Date();
  if (targetDate.getTime() > now.getTime()) return false;

  return true;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.floor(num));
}

export function formatCompact(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} BILLION`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)} MILLION`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)} THOUSAND`;
  }
  return num.toString();
}

/**
 * Calculates exact age statistics from a local calendar birth date.
 * Avoids UTC timezone conversion drift by constructing the birth timestamp in local time.
 */
export function calculateAgeStatistics(
  input: BirthDateInput,
  referenceDate: Date = new Date()
): AgeStatistics {
  const birthDate = new Date(input.year, input.month - 1, input.day, 0, 0, 0, 0);
  const now = referenceDate;

  // Exact difference in ms
  const diffMs = Math.max(0, now.getTime() - birthDate.getTime());

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor(diffMs / 1000);
  const weeks = Math.floor(days / 7);

  // Exact Sundays calculation:
  // Day of week of birth: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const birthDayOfWeek = birthDate.getDay();
  const daysUntilFirstSunday = (7 - birthDayOfWeek) % 7;
  let sundays = 0;
  if (days >= daysUntilFirstSunday) {
    sundays = 1 + Math.floor((days - daysUntilFirstSunday) / 7);
  }

  // Weekends: Saturday + Sunday days experienced
  // Count Saturdays similarly
  const daysUntilFirstSaturday = (6 - birthDayOfWeek + 7) % 7;
  let saturdays = 0;
  if (days >= daysUntilFirstSaturday) {
    saturdays = 1 + Math.floor((days - daysUntilFirstSaturday) / 7);
  }
  const weekends = sundays + saturdays;

  // Birthdays (solar years completed)
  const currentYear = now.getFullYear();
  let hasHadBirthdayThisYear = false;
  if (now.getMonth() > birthDate.getMonth()) {
    hasHadBirthdayThisYear = true;
  } else if (now.getMonth() === birthDate.getMonth()) {
    hasHadBirthdayThisYear = now.getDate() >= birthDate.getDate();
  }

  let birthdays = (currentYear - input.year) - (hasHadBirthdayThisYear ? 0 : 1);
  if (birthdays < 0) birthdays = 0;

  // Next birthday calculation
  let nextBirthdayYear = hasHadBirthdayThisYear ? currentYear + 1 : currentYear;
  let nextBirthdayMonth = input.month - 1;
  let nextBirthdayDay = input.day;
  // Handle Feb 29 on non-leap years
  if (input.month === 2 && input.day === 29 && !isLeapYear(nextBirthdayYear)) {
    nextBirthdayDay = 28;
  }
  const nextBirthdayDate = new Date(nextBirthdayYear, nextBirthdayMonth, nextBirthdayDay, 0, 0, 0, 0);
  const msUntilNextBirthday = Math.max(0, nextBirthdayDate.getTime() - now.getTime());
  const daysUntilNextBirthday = Math.ceil(msUntilNextBirthday / (1000 * 60 * 60 * 24));
  const nextBirthdayAge = birthdays + 1;

  // Next 1,000 or 5,000 or 10,000 day milestone
  const milestoneStep = days >= 10000 ? 5000 : 1000;
  const nextMilestoneDays = (Math.floor(days / milestoneStep) + 1) * milestoneStep;
  const daysRemainingToMilestone = nextMilestoneDays - days;

  // Derived perspective calculations
  const sunsets = days; // 1 sunset per calendar day on Earth
  const lunarCycles = Number((days / 29.530588).toFixed(1)); // Synodic lunar month
  const heartbeatsEst = Math.floor(minutes * 75); // Avg 75 bpm resting
  const breathsEst = Math.floor(minutes * 15); // Avg 15 breaths/min resting
  const sleepHoursEst = Math.floor(hours * 0.3333); // 1/3 of life spent sleeping
  const sleepYearsEst = Number((sleepHoursEst / (24 * 365.25)).toFixed(1));

  // Cosmic speeds
  // Earth orbits sun at ~107,226 km/h
  const solarKmTraveled = Math.floor(hours * 107226);
  // Solar system orbits Milky Way at ~828,000 km/h
  const galacticKmTraveled = Math.floor(hours * 828000);
  // Human red blood cell life cycle is ~120 days
  const redBloodCellCycles = Math.floor(days / 120);

  const dayOfWeekBorn = DAYS_OF_WEEK[birthDayOfWeek];
  const isLeapYearBaby = input.month === 2 && input.day === 29;
  const birthDateString = `${MONTH_NAMES[input.month - 1]} ${input.day}, ${input.year}`;

  return {
    days,
    hours,
    minutes,
    seconds,
    weeks,
    birthdays,
    sundays,
    weekends,

    formattedDays: formatNumber(days),
    formattedHours: formatNumber(hours),
    formattedMinutes: formatNumber(minutes),
    formattedSeconds: formatNumber(seconds),
    formattedWeeks: formatNumber(weeks),
    formattedBirthdays: formatNumber(birthdays),
    formattedSundays: formatNumber(sundays),

    compactSeconds: formatCompact(seconds),
    compactMinutes: formatCompact(minutes),
    compactHours: formatCompact(hours),

    sunsets,
    lunarCycles,
    heartbeatsEst,
    breathsEst,
    sleepHoursEst,
    sleepYearsEst,
    solarKmTraveled,
    galacticKmTraveled,
    redBloodCellCycles,

    daysUntilNextBirthday,
    nextBirthdayAge,
    nextDayMilestone: {
      targetDays: nextMilestoneDays,
      daysRemaining: daysRemainingToMilestone,
    },

    birthDateString,
    dayOfWeekBorn,
    isLeapYearBaby,
  };
}
