import { AgeStatistics, ShareTheme } from '../types';

export interface RenderCardOptions {
  stats: AgeStatistics;
  theme: ShareTheme;
  isUnbranded?: boolean;
}

export async function renderShareCardToBlob(options: RenderCardOptions): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Ensure fonts are loaded before drawing
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Continue anyway
    }
  }

  const { stats, theme, isUnbranded } = options;

  switch (theme) {
    case 'editorial':
      drawEditorialTheme(ctx, stats, isUnbranded);
      break;
    case 'electric':
      drawElectricTheme(ctx, stats, isUnbranded);
      break;
    case 'weird':
      drawWeirdTheme(ctx, stats, isUnbranded);
      break;
    case 'dark':
    default:
      drawDarkTheme(ctx, stats, isUnbranded);
      break;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      },
      'image/png',
      1.0
    );
  });
}

function drawDarkTheme(
  ctx: CanvasRenderingContext2D,
  stats: AgeStatistics,
  isUnbranded?: boolean
) {
  const W = 1080;
  const H = 1920;

  // Background
  ctx.fillStyle = '#070709';
  ctx.fillRect(0, 0, W, H);

  // Subtle Scanline Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let y = 0; y < H; y += 8) {
    ctx.fillRect(0, y, W, 2);
  }

  // Top Accent Bar & Telemetry
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(90, 110, 48, 4);

  ctx.fillStyle = '#666666';
  ctx.font = '600 24px "Fira Code", monospace';
  ctx.fillText('SYS.LOC // SOLAR CYCLE TELEMETRY', 156, 120);

  ctx.fillStyle = '#444444';
  ctx.font = '500 20px "Fira Code", monospace';
  ctx.fillText(`BIRTH: ${stats.birthDateString.toUpperCase()}`, 90, 190);

  // Hero Lead
  ctx.fillStyle = '#888888';
  ctx.font = '700 44px "Space Grotesk", sans-serif';
  ctx.fillText('I AM EXACTLY', 90, 420);

  // Hero Big Number
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 170px "Fira Code", monospace';
  ctx.fillText(stats.formattedDays, 90, 580);

  // Hero Label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 64px "Space Grotesk", sans-serif';
  ctx.fillText('DAYS OLD.', 90, 670);

  // Divider Line
  ctx.strokeStyle = '#222226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 750);
  ctx.lineTo(W - 90, 750);
  ctx.stroke();

  // MTX Data-Block (Lower-Left Metadata Stack as mandated by COLTER.md)
  ctx.fillStyle = '#666666';
  ctx.font = '700 22px "Fira Code", monospace';
  ctx.fillText('[CHRONO_MTX_STACK]', 90, 830);

  const mtxItems = [
    { tag: '01_HOURS', val: `${stats.formattedHours} HOURS` },
    { tag: '02_MINUTES', val: `${stats.formattedMinutes} MINUTES` },
    { tag: '03_SECONDS', val: `${stats.formattedSeconds} SECONDS` },
    { tag: '04_SUNDAYS', val: `${stats.formattedSundays} SUNDAYS SURVIVED` },
    { tag: '05_SOLAR', val: `${stats.formattedBirthdays} ORBITS (BIRTHDAYS)` },
  ];

  let startY = 880;
  for (const item of mtxItems) {
    // Tag box
    ctx.fillStyle = '#141416';
    ctx.fillRect(90, startY - 26, 160, 36);

    ctx.fillStyle = '#888888';
    ctx.font = '600 18px "Fira Code", monospace';
    ctx.fillText(`[${item.tag}]`, 104, startY - 2);

    // Value
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 32px "Fira Code", monospace';
    ctx.fillText(item.val, 280, startY);

    startY += 72;
  }

  // Perspective Callout Card
  const boxY = 1320;
  ctx.fillStyle = '#0F0F12';
  ctx.strokeStyle = '#26262B';
  ctx.lineWidth = 2;
  ctx.fillRect(90, boxY, W - 180, 280);
  ctx.strokeRect(90, boxY, W - 180, 280);

  ctx.fillStyle = '#888888';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('// PERSPECTIVE TELEMETRY', 130, boxY + 54);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 34px "Space Grotesk", sans-serif';
  const perspectiveText = `${stats.formattedDays} planetary sunsets witnessed.`;
  ctx.fillText(perspectiveText, 130, boxY + 115);

  ctx.fillStyle = '#999999';
  ctx.font = '400 24px "Space Grotesk", sans-serif';
  ctx.fillText(`Approx. ${(stats.breathsEst / 1_000_000).toFixed(1)}M breaths taken of Earth's atmosphere.`, 130, boxY + 165);
  ctx.fillText(`Approx. ${(stats.heartbeatsEst / 1_000_000).toFixed(0)}M uninterrupted cardiac contractions.`, 130, boxY + 205);

  // Footer Branding (Subtle or omitted if unbranded)
  if (!isUnbranded) {
    ctx.fillStyle = '#444444';
    ctx.font = '700 20px "Fira Code", monospace';
    ctx.fillText('WEIRDAGE // TACTICDEV / SLUGHOUSE', 90, H - 100);

    ctx.textAlign = 'right';
    ctx.fillText('COUNT DAYS, NOT YEARS.', W - 90, H - 100);
    ctx.textAlign = 'left';
  }
}

function drawEditorialTheme(
  ctx: CanvasRenderingContext2D,
  stats: AgeStatistics,
  isUnbranded?: boolean
) {
  const W = 1080;
  const H = 1920;

  // Background (Editorial cream)
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(0, 0, W, H);

  // Fine double borders
  ctx.strokeStyle = '#D5D1C6';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  // Masthead Header
  ctx.fillStyle = '#111111';
  ctx.font = '700 26px "Fira Code", monospace';
  ctx.fillText('CHRONOMETRIC DOSSIER', 100, 130);

  ctx.fillStyle = '#FF3B00'; // Slughouse international safety orange accent
  ctx.fillRect(W - 130, 110, 30, 30);

  ctx.fillStyle = '#6E6B65';
  ctx.font = '500 20px "Space Grotesk", sans-serif';
  ctx.fillText(`DATE OF RECORD: ${stats.birthDateString.toUpperCase()}`, 100, 175);

  // Big divider
  ctx.fillStyle = '#111111';
  ctx.fillRect(100, 220, W - 200, 4);

  // Lead-in
  ctx.fillStyle = '#111111';
  ctx.font = '700 52px "Space Grotesk", sans-serif';
  ctx.fillText('I HAVE BEEN ALIVE FOR', 100, 420);

  // Massive Number
  ctx.fillStyle = '#111111';
  ctx.font = '700 185px "Fira Code", monospace';
  ctx.fillText(stats.formattedDays, 100, 600);

  // Label with orange dot
  ctx.fillStyle = '#111111';
  ctx.font = '700 72px "Space Grotesk", sans-serif';
  ctx.fillText('DAYS.', 100, 700);

  ctx.fillStyle = '#FF3B00';
  ctx.beginPath();
  ctx.arc(320, 680, 14, 0, Math.PI * 2);
  ctx.fill();

  // Fine line
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 770);
  ctx.lineTo(W - 100, 770);
  ctx.stroke();

  // 2x2 Grid of Editorial Metrics
  const col1 = 100;
  const col2 = 560;

  // Row 1
  ctx.fillStyle = '#6E6B65';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('IN HOURS', col1, 850);
  ctx.fillText('IN MINUTES', col2, 850);

  ctx.fillStyle = '#111111';
  ctx.font = '700 46px "Fira Code", monospace';
  ctx.fillText(stats.formattedHours, col1, 910);
  ctx.fillText(stats.compactMinutes, col2, 910);

  // Row 2
  ctx.fillStyle = '#6E6B65';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('IN SECONDS', col1, 1030);
  ctx.fillText('SUNDAYS WITNESSED', col2, 1030);

  ctx.fillStyle = '#111111';
  ctx.font = '700 46px "Fira Code", monospace';
  ctx.fillText(stats.compactSeconds, col1, 1090);
  ctx.fillText(stats.formattedSundays, col2, 1090);

  // Editorial Perspective Quote Block
  const quoteY = 1260;
  ctx.fillStyle = '#EDE8DE';
  ctx.fillRect(100, quoteY, W - 200, 320);

  ctx.fillStyle = '#FF3B00';
  ctx.fillRect(100, quoteY, 6, 320);

  ctx.fillStyle = '#111111';
  ctx.font = '700 36px "Space Grotesk", sans-serif';
  ctx.fillText('“How old are you, really?”', 140, quoteY + 70);

  ctx.fillStyle = '#44443F';
  ctx.font = '400 26px "Space Grotesk", sans-serif';
  ctx.fillText(`You have survived ${stats.formattedDays} planetary rotations.`, 140, quoteY + 130);
  ctx.fillText(`Your lungs have inhaled approximately ${(stats.breathsEst / 1_000_000).toFixed(1)}M times.`, 140, quoteY + 180);
  ctx.fillText(`You have slept for roughly ${stats.sleepYearsEst} years of your life.`, 140, quoteY + 230);

  // Footer
  if (!isUnbranded) {
    ctx.fillStyle = '#88847C';
    ctx.font = '600 20px "Fira Code", monospace';
    ctx.fillText('WEIRDAGE // EDITORIAL ISSUE NO. 01', 100, H - 120);

    ctx.textAlign = 'right';
    ctx.fillText('HOW OLD ARE YOU REALLY?', W - 100, H - 120);
    ctx.textAlign = 'left';
  }
}

function drawElectricTheme(
  ctx: CanvasRenderingContext2D,
  stats: AgeStatistics,
  isUnbranded?: boolean
) {
  const W = 1080;
  const H = 1920;

  // Background
  ctx.fillStyle = '#060709';
  ctx.fillRect(0, 0, W, H);

  // Electric Neon Lime Grid & Accents
  ctx.strokeStyle = '#181C26';
  ctx.lineWidth = 1;
  for (let x = 60; x < W; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Header Badge
  ctx.fillStyle = '#D4FF00';
  ctx.fillRect(90, 110, 180, 44);

  ctx.fillStyle = '#000000';
  ctx.font = '700 22px "Fira Code", monospace';
  ctx.fillText('⚡ TELEMETRY', 106, 140);

  ctx.fillStyle = '#00F0FF';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('// HIGH-VOLTAGE CHRONO', 300, 140);

  // Hero Lead
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 48px "Space Grotesk", sans-serif';
  ctx.fillText('I AM ACTIVE FOR', 90, 410);

  // Massive Acid Lime Hero Number
  ctx.fillStyle = '#D4FF00';
  ctx.font = '700 180px "Fira Code", monospace';
  ctx.fillText(stats.formattedDays, 90, 580);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 70px "Space Grotesk", sans-serif';
  ctx.fillText('DAYS ON EARTH.', 90, 680);

  // Electric Neon Block Matrix
  const card1Y = 780;
  // Card 1
  ctx.fillStyle = '#0D0F17';
  ctx.strokeStyle = '#D4FF00';
  ctx.lineWidth = 2;
  ctx.fillRect(90, card1Y, W - 180, 160);
  ctx.strokeRect(90, card1Y, W - 180, 160);

  ctx.fillStyle = '#8E9AA8';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('TOTAL HOURS ELAPSED', 130, card1Y + 50);

  ctx.fillStyle = '#D4FF00';
  ctx.font = '700 52px "Fira Code", monospace';
  ctx.fillText(stats.formattedHours, 130, card1Y + 115);

  // Card 2
  const card2Y = 970;
  ctx.fillStyle = '#0D0F17';
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.fillRect(90, card2Y, W - 180, 160);
  ctx.strokeRect(90, card2Y, W - 180, 160);

  ctx.fillStyle = '#8E9AA8';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('TOTAL SECONDS LIVED', 130, card2Y + 50);

  ctx.fillStyle = '#00F0FF';
  ctx.font = '700 52px "Fira Code", monospace';
  ctx.fillText(stats.compactSeconds, 130, card2Y + 115);

  // Card 3
  const card3Y = 1160;
  ctx.fillStyle = '#0D0F17';
  ctx.strokeStyle = '#272F3E';
  ctx.lineWidth = 2;
  ctx.fillRect(90, card3Y, W - 180, 160);
  ctx.strokeRect(90, card3Y, W - 180, 160);

  ctx.fillStyle = '#8E9AA8';
  ctx.font = '600 20px "Fira Code", monospace';
  ctx.fillText('CARDIAC TELEMETRY', 130, card3Y + 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 52px "Fira Code", monospace';
  ctx.fillText(`${(stats.heartbeatsEst / 1_000_000_000).toFixed(2)}B BEATS`, 130, card3Y + 115);

  // Cosmic travel banner
  const cosmicY = 1370;
  ctx.fillStyle = '#111422';
  ctx.fillRect(90, cosmicY, W - 180, 200);

  ctx.fillStyle = '#D4FF00';
  ctx.font = '700 24px "Fira Code", monospace';
  ctx.fillText('🚀 SOLAR VOYAGE SPEED: ~107,226 KM/H', 130, cosmicY + 60);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 26px "Space Grotesk", sans-serif';
  ctx.fillText(`Distance: ${(stats.solarKmTraveled / 1_000_000_000).toFixed(2)} Billion Kilometers`, 130, cosmicY + 115);
  ctx.fillText('Flown aboard Earth through the solar system.', 130, cosmicY + 155);

  // Footer
  if (!isUnbranded) {
    ctx.fillStyle = '#D4FF00';
    ctx.font = '700 24px "Fira Code", monospace';
    ctx.fillText('⚡ WEIRDAGE // STOP COUNTING BIRTHDAYS', 90, H - 110);
  }
}

function drawWeirdTheme(
  ctx: CanvasRenderingContext2D,
  stats: AgeStatistics,
  isUnbranded?: boolean
) {
  const W = 1080;
  const H = 1920;

  // High-contrast brutalist split
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top black slab
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, 880);

  // ASCII crosshairs & markers
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px "Fira Code", monospace';
  ctx.fillText('+---+---+---+---+---+---+---+---+---+---+---+', 60, 100);
  ctx.fillText('| CHRONOLOGICAL ANOMALY DETECTED           |', 60, 140);
  ctx.fillText('+---+---+---+---+---+---+---+---+---+---+---+', 60, 180);

  // Huge Inverted White on Black
  ctx.fillStyle = '#888888';
  ctx.font = '700 36px "Fira Code", monospace';
  ctx.fillText('YOU ARE EXACTLY', 60, 340);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 195px "Fira Code", monospace';
  ctx.fillText(stats.formattedDays, 60, 520);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 80px "Space Grotesk", sans-serif';
  ctx.fillText('DAYS OLD.', 60, 620);

  ctx.fillStyle = '#AAAAAA';
  ctx.font = '500 28px "Fira Code", monospace';
  ctx.fillText(`[ ${stats.compactMinutes} // ${stats.compactSeconds} ]`, 60, 710);

  // Bottom half (Stark Black on White Brutalism)
  ctx.fillStyle = '#000000';
  ctx.font = '700 48px "Space Grotesk", sans-serif';
  ctx.fillText('STOP COUNTING BIRTHDAYS.', 60, 980);

  ctx.fillStyle = '#555555';
  ctx.font = '700 32px "Fira Code", monospace';
  ctx.fillText('SURVIVAL MATRIX:', 60, 1060);

  // Heavy Brutalist Table
  const rows = [
    { label: 'SUNSETS WITNESSED', val: `${stats.formattedDays}` },
    { label: 'SUNDAYS EXPERIENCED', val: `${stats.formattedSundays}` },
    { label: 'MOON CYCLES (FULL)', val: `${stats.lunarCycles}` },
    { label: 'TOTAL HOURS', val: `${stats.formattedHours}` },
    { label: 'CELL GENERATIONS', val: `${stats.redBloodCellCycles}` },
    { label: 'CARDIAC PULSES', val: `${(stats.heartbeatsEst / 1_000_000).toFixed(0)}M` },
  ];

  let tableY = 1130;
  for (const row of rows) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, tableY - 32);
    ctx.lineTo(W - 60, tableY - 32);
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = '700 24px "Fira Code", monospace';
    ctx.fillText(row.label, 70, tableY);

    ctx.textAlign = 'right';
    ctx.font = '700 30px "Fira Code", monospace';
    ctx.fillText(row.val, W - 70, tableY);
    ctx.textAlign = 'left';

    tableY += 76;
  }

  // Footer ASCII box
  if (!isUnbranded) {
    ctx.fillStyle = '#000000';
    ctx.font = '700 22px "Fira Code", monospace';
    ctx.fillText('WEIRDAGE // DESIGNED FOR THE VISCERAL TRUTH OF TIME', 60, H - 90);
  }
}
