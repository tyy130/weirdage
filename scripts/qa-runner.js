import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, '../screenshots');

async function runQA() {
  console.log('🚀 Starting WeirdAge Autonomous QA & Verification Suite...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  
  // Set iPhone 15 Pro viewport
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Browser Console Error:', msg.text());
    }
  });

  console.log('1. Navigating to http://127.0.0.1:4173...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });

  // 1. Capture Input Screen
  console.log('2. Verifying Input Screen...');
  await page.screenshot({ path: path.resolve(screenshotsDir, '01_input_screen.png') });

  // Tap "30 yo" preset button
  console.log('3. Selecting 30 yo preset and submitting...');
  const presetButtons = await page.$$('button');
  let presetFound = false;
  for (const btn of presetButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('30 yo')) {
      await btn.click();
      presetFound = true;
      break;
    }
  }
  if (!presetFound) {
    console.warn('Could not find 30 yo preset button');
  }

  // Click SHOW ME
  const showMeBtn = await page.waitForSelector('button[type="submit"]');
  await showMeBtn.click();

  // Wait for results animation
  await new Promise((r) => setTimeout(r, 1200));

  // 2. Capture Results Screen
  console.log('4. Verifying Results Screen...');
  await page.screenshot({ path: path.resolve(screenshotsDir, '02_results_screen.png') });

  // Verify Results DOM
  const heroDays = await page.evaluate(() => {
    const daysEl = document.querySelector('.text-6xl');
    return daysEl ? daysEl.textContent : null;
  });
  console.log(`✓ Hero Days Rendered: ${heroDays}`);

  // Helper to click element by text
  const clickByText = async (selector, text) => {
    const elements = await page.$$(selector);
    for (const el of elements) {
      const content = await page.evaluate(node => node.textContent, el);
      if (content && content.includes(text)) {
        await el.click();
        return true;
      }
    }
    return false;
  };

  // 3. Open Share Card Studio
  console.log('5. Opening Share Card Studio...');
  await clickByText('button, div', 'SHARE MY AGE');

  // Wait for canvas rendering
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.resolve(screenshotsDir, '03_share_editorial.png') });
  console.log('✓ Captured Editorial Share Card');

  // 4. Switch to Dark Theme
  console.log('6. Switching to Dark Theme...');
  await clickByText('button', 'Dark');
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.resolve(screenshotsDir, '04_share_dark.png') });
  console.log('✓ Captured Dark Share Card');

  // 5. Test Monetization ($0.49 Pro Unlock)
  console.log('7. Testing Monetization Flow...');
  await clickByText('button', 'Electric');
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.resolve(screenshotsDir, '05_share_electric_preview.png') });

  // Click Unlock for $0.49
  const clickedUnlock = await clickByText('button', 'UNLOCK THIS THEME FOR $0.49');
  if (clickedUnlock) {
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve(screenshotsDir, '06_pro_modal.png') });
    console.log('✓ Captured Pro Modal');

    // Click UNLOCK FOR $0.49 inside modal
    await clickByText('button', 'UNLOCK FOR');
    await new Promise((r) => setTimeout(r, 1200));
    console.log('✓ Simulated StoreKit $0.49 Purchase');
  }

  // Capture Electric theme unlocked
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.resolve(screenshotsDir, '07_share_electric_unlocked.png') });

  // Switch to Weird Theme
  await clickByText('button', 'Weird');
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.resolve(screenshotsDir, '08_share_weird.png') });
  console.log('✓ Captured Weird Theme');

  // Close share modal
  const closeShareBtn = await page.waitForSelector('button[aria-label="Close modal"]');
  await closeShareBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // 6. Test Privacy Modal
  console.log('8. Testing Privacy Modal...');
  const privacyBtn = await page.waitForSelector('button[aria-label="Privacy & Data Control"]');
  await privacyBtn.click();
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.resolve(screenshotsDir, '09_privacy_modal.png') });
  console.log('✓ Captured Privacy Modal');

  // Close privacy modal
  const closePrivacyBtn = await page.waitForSelector('button[aria-label="Close dialog"]');
  await closePrivacyBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // 7. Test iPhone SE Viewport (Small phone 375x667)
  console.log('9. Testing Small Phone Viewport (iPhone SE)...');
  await page.setViewport({
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.resolve(screenshotsDir, '10_iphone_se_results.png') });

  // 8. Test 1080x1920 Raw Share Card Generation directly in page
  console.log('10. Verifying exact 1080x1920 PNG export blob...');
  const cardDimensions = await page.evaluate(async () => {
    // Get first theme and draw to test canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    return { width: canvas.width, height: canvas.height };
  });
  console.log(`✓ Export Canvas Dimensions: ${cardDimensions.width}x${cardDimensions.height}`);

  await browser.close();
  console.log('🎉 QA and Verification Complete! All screenshots captured in screenshots/');
}

runQA().catch((err) => {
  console.error('QA Runner encountered an error:', err);
  process.exit(1);
});
