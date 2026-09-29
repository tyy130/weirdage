import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../screenshots/cards');
fs.mkdirSync(outDir, { recursive: true });

async function exportFullCards() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });

  const themes = ['editorial', 'dark', 'electric', 'weird'];

  for (const theme of themes) {
    const base64Data = await page.evaluate(async (themeName) => {
      // 15,217 days reference: born May 15, 1985
      const stats = window.calculateAgeStatistics(
        { year: 1985, month: 5, day: 15 },
        new Date(2027, 0, 15) // Reference date giving ~15,220 days
      );

      const blob = await window.renderShareCardToBlob({
        stats,
        theme: themeName,
        isUnbranded: false,
      });

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result;
          resolve(res.replace(/^data:image\/png;base64,/, ''));
        };
        reader.readAsDataURL(blob);
      });
    }, theme);

    const outPath = path.resolve(outDir, `weirdage-1080x1920-${theme}.png`);
    fs.writeFileSync(outPath, base64Data, 'base64');
    console.log(`✓ Exported 1080x1920 ${theme} card to ${outPath}`);
  }

  await browser.close();
  console.log('🎉 Successfully generated all 1080x1920 cards!');
}

exportFullCards().catch(console.error);
