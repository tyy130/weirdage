export interface BirthDateInput {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface AgeStatistics {
  // Core metrics
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeks: number;
  birthdays: number;
  sundays: number;
  weekends: number;

  // Formatted representations
  formattedDays: string;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
  formattedWeeks: string;
  formattedBirthdays: string;
  formattedSundays: string;

  // Compact / editorial labels
  compactSeconds: string; // e.g. "1.31 BILLION"
  compactMinutes: string; // e.g. "21.9 MILLION"
  compactHours: string;   // e.g. "365.2 THOUSAND"

  // Perspective & Weird stats
  sunsets: number;
  lunarCycles: number;
  heartbeatsEst: number;
  breathsEst: number;
  sleepHoursEst: number;
  sleepYearsEst: number;
  solarKmTraveled: number;     // Earth orbit around sun (~107,226 km/h)
  galacticKmTraveled: number;  // Solar system in Milky Way (~828,000 km/h)
  redBloodCellCycles: number;  // Full turnover ~120 days

  // Next milestone
  daysUntilNextBirthday: number;
  nextBirthdayAge: number;
  nextDayMilestone: {
    targetDays: number;
    daysRemaining: number;
  };

  // Date metadata
  birthDateString: string;
  dayOfWeekBorn: string;
  isLeapYearBaby: boolean;
}

export interface PerspectiveItem {
  id: string;
  title: string;
  metric: string;
  subtitle: string;
  note?: string;
  category: 'cosmic' | 'biological' | 'time' | 'curiosity';
  isPro?: boolean;
}

export type ShareTheme = 'editorial' | 'dark' | 'electric' | 'weird';

export interface ThemeConfig {
  id: ShareTheme;
  name: string;
  description: string;
  isPro: boolean;
  bg: string;
  textColor: string;
  accentColor: string;
  secondaryTextColor: string;
  borderColor: string;
}
