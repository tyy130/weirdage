import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../screenshots/cards');
fs.mkdirSync(outDir, { recursive: true });

async function exportAllCards() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });

  // Unlock Pro first in localStorage so all themes and unbranded toggle are available
  await page.evaluate(() => {
    localStorage.setItem('weirdage_is_pro_unlocked', 'true');
    // Set birthday to 1985-05-15 (15,217 days reference)
    localStorage.setItem('weirdage_saved_birthday', JSON.stringify({ year: 1985, month: 5, day: 15 }));
  });

  await page.reload({ waitUntil: 'networkidle0' });

  // Open Share modal
  await new Promise(r => setTimeout(r, 1000));
  const shareBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const target = btns.find(b => b.textContent && b.textContent.includes('SHARE MY AGE'));
    if (target) { target.click(); return true; }
    return false;
  });

  await new Promise(r => setTimeout(r, 1200));

  const themes = ['editorial', 'dark', 'electric', 'weird'];

  for (const theme of themes) {
    // Click theme button
    await page.evaluate((tName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => b.textContent && b.textContent.toLowerCase().includes(tName));
      if (found) found.click();
    }, theme);

    await new Promise(r => setTimeout(r, 1000));

    // Extract the blob image src from the preview <img> tag
    const dataUrl = await page.evaluate(async () => {
      const img = document.querySelector('img[alt="WeirdAge Share Card Preview"]');
      if (!img) return null;
      
      // Fetch the blob and convert to base64
      const response = await fetch(img.src);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });

    if (dataUrl) {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const filePath = path.resolve(outDir, `weirdage-1080x1920-${theme}.png`);
      fs.writeFileSync(filePath, base64Data, 'base64');
      console.log(`✓ Exported 1080x1920 card: ${filePath}`);
    }
  }

  await browser.close();
  console.log('🎉 All 1080x1920 cards exported successfully!');
}

exportAllCards().catch(console.error);
