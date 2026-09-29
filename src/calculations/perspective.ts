import { AgeStatistics, PerspectiveItem } from '../types';
import { formatNumber } from './ageEngine';

export function generatePerspectiveItems(stats: AgeStatistics): PerspectiveItem[] {
  const billionSolarKm = (stats.solarKmTraveled / 1_000_000_000).toFixed(2);
  const billionGalacticKm = (stats.galacticKmTraveled / 1_000_000_000).toFixed(1);
  const millionBreaths = (stats.breathsEst / 1_000_000).toFixed(1);
  const billionHeartbeats = (stats.heartbeatsEst / 1_000_000_000).toFixed(2);

  return [
    {
      id: 'sunsets',
      title: 'SOLAR PASSAGES',
      metric: `${stats.formattedDays} SUNSETS`,
      subtitle: `You have ridden Earth through ${stats.formattedDays} full planetary rotations.`,
      note: 'Exactly 1 rotation cycle per calendar day lived.',
      category: 'time',
      isPro: false,
    },
    {
      id: 'heartbeats',
      title: 'BIOLOGICAL TELEMETRY',
      metric: `${stats.heartbeatsEst >= 1_000_000_000 ? `${billionHeartbeats} BILLION` : `${(stats.heartbeatsEst / 1_000_000).toFixed(1)}M`} BEATS`,
      subtitle: 'Your cardiac pump has contracted continuously without a single system reboot.',
      note: 'Derived from human baseline average of ~75 bpm at rest.',
      category: 'biological',
      isPro: false,
    },
    {
      id: 'breaths',
      title: 'ATMOSPHERE INTAKE',
      metric: `${millionBreaths} MILLION BREATHS`,
      subtitle: 'Tidal cycles of nitrogen, oxygen, and argon processed through your lungs.',
      note: 'Derived from healthy adult baseline average of ~15 breaths/min.',
      category: 'biological',
      isPro: false,
    },
    {
      id: 'lunar',
      title: 'LUNAR CYCLES',
      metric: `${stats.lunarCycles} MOONS`,
      subtitle: 'Full synodic lunar orbit cycles (waxing to waning) since your birth.',
      note: 'Derived using mean synodic lunar month length of 29.530588 days.',
      category: 'cosmic',
      isPro: false,
    },
    {
      id: 'sleep',
      title: 'THE UNCONSCIOUS VOID',
      metric: `${stats.sleepYearsEst} YEARS ASLEEP`,
      subtitle: `Roughly ${formatNumber(stats.sleepHoursEst)} hours spent in deep restorative sleep and REM dream states.`,
      note: 'Assumes standard human biology ratio of ~8 hours per 24-hour cycle.',
      category: 'biological',
      isPro: false,
    },
    {
      id: 'solar-voyage',
      title: 'SOLAR ORBITAL FLIGHT',
      metric: `${billionSolarKm}B KM`,
      subtitle: "Kilometers you've hurtled through space hitched to Earth's orbital velocity around the Sun (~107,226 km/h).",
      note: 'Calculated from Earth heliocentric orbital velocity.',
      category: 'cosmic',
      isPro: true,
    },
    {
      id: 'galactic-drift',
      title: 'GALACTIC DRIFT',
      metric: `${billionGalacticKm}B KM`,
      subtitle: "Distance traveled through the Milky Way galaxy as our entire solar system circles the galactic center (~828,000 km/h).",
      note: 'Calculated from solar system galactic rotation velocity.',
      category: 'cosmic',
      isPro: true,
    },
    {
      id: 'cellular-rebuild',
      title: 'CELLULAR TURNOVER',
      metric: `${stats.redBloodCellCycles} GENERATIONS`,
      subtitle: 'Times your body has manufactured and replaced its entire red blood cell population from scratch.',
      note: 'Based on human erythrocyte lifespan average of 120 days.',
      category: 'biological',
      isPro: true,
    },
    {
      id: 'sundays',
      title: 'SUNDAY RITUALS',
      metric: `${stats.formattedSundays} SUNDAYS`,
      subtitle: `You have survived ${stats.formattedSundays} Sunday evenings and ${formatNumber(stats.weekends)} total weekend days.`,
      note: 'Mathematically exact day-of-week occurrence count.',
      category: 'time',
      isPro: false,
    },
  ];
}
