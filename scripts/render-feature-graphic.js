import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public');

const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html {
        width: 1024px;
        height: 500px;
        overflow: hidden;
        background-color: #070709;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #ffffff;
      }
      .container {
        position: relative;
        width: 1024px;
        height: 500px;
        padding: 50px 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: radial-gradient(circle at 80% 20%, rgba(212, 255, 0, 0.12) 0%, transparent 60%),
                    linear-gradient(180deg, #09090C 0%, #000000 100%);
        border: 2px solid #222226;
      }
      .top-tag {
        font-family: monospace;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: #D4FF00;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .hero {
        margin-top: 10px;
      }
      .hero-sub {
        font-family: monospace;
        font-size: 14px;
        letter-spacing: 0.2em;
        color: #888888;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .hero-num {
        font-family: monospace;
        font-size: 96px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #FFFFFF;
      }
      .hero-label {
        font-size: 36px;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #D4FF00;
        margin-top: 4px;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-top: 1px solid #222226;
        padding-top: 16px;
      }
      .brand {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
      .brand span {
        color: #D4FF00;
      }
      .tagline {
        font-family: monospace;
        font-size: 13px;
        color: #888888;
        letter-spacing: 0.1em;
      }
      .pills {
        display: flex;
        gap: 12px;
      }
      .pill {
        font-family: monospace;
        font-size: 12px;
        padding: 6px 12px;
        background: #141418;
        border: 1px solid #27272E;
        border-radius: 4px;
        color: #CCCCCC;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="top-tag">
        <span>⚡ VISCERAL CHRONOMETRIC INTELLIGENCE</span>
      </div>

      <div class="hero">
        <div class="hero-sub">// EXACT DAYS LIVED</div>
        <div class="hero-num">15,217</div>
        <div class="hero-label">DAYS OLD.</div>
      </div>

      <div class="footer">
        <div>
          <div class="brand">WEIRD<span>AGE</span></div>
          <div class="tagline">STOP COUNTING BIRTHDAYS. COUNT DAYS.</div>
        </div>

        <div class="pills">
          <div class="pill">365,208 HOURS</div>
          <div class="pill">1.31B SECONDS</div>
          <div class="pill">1080×1920 SHARE CARDS</div>
        </div>
      </div>
    </div>
  </body>
</html>`;

const tempHtml = path.resolve(outDir, 'temp-feature.html');
fs.writeFileSync(tempHtml, htmlContent);

const outPng = path.resolve(outDir, 'playstore-feature-graphic.png');
execSync(`google-chrome --headless --no-sandbox --disable-gpu --window-size=1024,500 --screenshot="${outPng}" "file://${tempHtml}"`);
fs.unlinkSync(tempHtml);

console.log(`✓ Generated Google Play Feature Graphic (1024x500): ${outPng}`);
