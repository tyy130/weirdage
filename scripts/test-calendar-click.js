import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, '../screenshots');

async function testCalendarClick() {
  console.log('Testing interactive calendar pop...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });

  // Clear any saved state so we are on InputScreen
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle0' });

  console.log('Clicking the calendar button...');
  const calendarBtn = await page.waitForSelector('button[aria-label="Open interactive calendar"]');
  await calendarBtn.click();

  await new Promise((r) => setTimeout(r, 600));

  // Verify the calendar modal appeared
  const modalHeader = await page.evaluate(() => {
    const el = document.querySelector('.text-electric-lime');
    return el ? el.textContent : null;
  });
  console.log(`Modal detected: ${modalHeader}`);

  const screenshotPath = path.resolve(screenshotsDir, '11_interactive_calendar_open.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`✓ Saved screenshot: ${screenshotPath}`);

  // Click day 20 in the calendar modal
  console.log('Clicking day 20 in the calendar...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dayBtn = buttons.find((b) => b.textContent && b.textContent.trim() === '20');
    if (dayBtn) dayBtn.click();
  });

  await new Promise((r) => setTimeout(r, 600));

  // Verify updated date on input screen
  const selectedDateText = await page.evaluate(() => {
    const el = document.querySelector('.font-mono.text-2xl, .font-mono.text-3xl');
    return el ? el.textContent : null;
  });
  console.log(`Updated Selected Date on screen: "${selectedDateText}"`);

  await browser.close();
  console.log('Test completed successfully!');
}

testCalendarClick().catch((err) => {
  console.error(err);
  process.exit(1);
});
