import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(__dirname, '../public/icon.svg');
const resDir = path.resolve(__dirname, '../android/app/src/main/res');

const iconSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

for (const { dir, size } of iconSizes) {
  const targetFolder = path.resolve(resDir, dir);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

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
  const tempHtml = path.resolve(targetFolder, `temp.html`);
  fs.writeFileSync(tempHtml, htmlContent);

  const launcherPng = path.resolve(targetFolder, 'ic_launcher.png');
  const launcherRoundPng = path.resolve(targetFolder, 'ic_launcher_round.png');
  const launcherForePng = path.resolve(targetFolder, 'ic_launcher_foreground.png');

  execSync(`google-chrome --headless --no-sandbox --disable-gpu --window-size=${size},${size} --screenshot="${launcherPng}" "file://${tempHtml}"`);
  fs.copyFileSync(launcherPng, launcherRoundPng);
  fs.copyFileSync(launcherPng, launcherForePng);
  fs.unlinkSync(tempHtml);

  console.log(`✓ Generated ${dir} (${size}x${size})`);
}

console.log('All Android icons updated!');
