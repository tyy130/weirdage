import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const svgPath = path.resolve(publicDir, 'icon.svg');

const sizes = [192, 512, 1024];

for (const size of sizes) {
  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: ${size}px; height: ${size}px; overflow: hidden; background: #000000; }
      img { width: ${size}px; height: ${size}px; display: block; }
    </style>
  </head>
  <body>
    <img src="file://${svgPath}" />
  </body>
</html>`;
  const tempHtml = path.resolve(publicDir, `temp-${size}.html`);
  fs.writeFileSync(tempHtml, htmlContent);

  const outPng = path.resolve(publicDir, `icon-${size}.png`);
  execSync(`google-chrome --headless --no-sandbox --disable-gpu --window-size=${size},${size} --screenshot="${outPng}" --hide-scrollbars "file://${tempHtml}"`);
  fs.unlinkSync(tempHtml);
  console.log(`Generated ${outPng} (${size}x${size})`);
}
