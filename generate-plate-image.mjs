#!/usr/bin/env node
/**
 * Generate a 500x500 RU license plate image.
 *
 * First-time setup:
 *   npm install sharp
 *
 * Usage:
 *   node generate-plate-image.mjs "Т767ОР" "53"
 *
 * Output:
 *   Т767ОР53.png (repository root)
 */
import sharp from "sharp";

const [plate, region] = process.argv.slice(2);

if (!plate || !region) {
  console.error('Usage: node generate-plate-image.mjs "<PLATE>" "<REGION>"');
  process.exit(1);
}

const match = plate.match(/^([АВЕКМНОРСТУХ])(\d{3})([АВЕКМНОРСТУХ]{2})$/u);
if (!match) {
  console.error("Plate must match Russian format: one letter, three digits, two letters (e.g. Т767ОР).");
  process.exit(1);
}

if (!/^\d{2,3}$/u.test(region)) {
  console.error("Region must contain 2 or 3 digits.");
  process.exit(1);
}

const width = 500;
const height = 500;
const plateWidth = 440;
const plateHeight = 124;
const x = (width - plateWidth) / 2;
const y = (height - plateHeight) / 2;
const [firstLetter, digits, lastLetters] = match;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#e7e9ec"/>
  <rect x="${x}" y="${y}" width="${plateWidth}" height="${plateHeight}" rx="9" fill="#fff" stroke="#252525" stroke-width="4"/>
  <rect x="${x + 7}" y="${y + 7}" width="${plateWidth - 14}" height="${plateHeight - 14}" rx="5" fill="none" stroke="#252525" stroke-width="1.5"/>
  <text x="${x + 18}" y="${y + 87}" font-family="Arial, DejaVu Sans, sans-serif" font-size="76" font-weight="700" fill="#111" letter-spacing="1">${firstLetter}${digits}${lastLetters}</text>
  <line x1="${x + 330}" y1="${y + 12}" x2="${x + 330}" y2="${y + plateHeight - 12}" stroke="#222" stroke-width="2"/>
  <text x="${x + 385}" y="${y + 70}" text-anchor="middle" font-family="Arial, DejaVu Sans, sans-serif" font-size="35" font-weight="700" fill="#111">${region}</text>
  <rect x="${x + 352}" y="${y + 82}" width="66" height="10" fill="#fff"/>
  <rect x="${x + 352}" y="${y + 92}" width="66" height="10" fill="#2456a6"/>
  <rect x="${x + 352}" y="${y + 102}" width="66" height="10" fill="#d52b1e"/>
  <text x="${x + 385}" y="${y + 120}" text-anchor="middle" font-family="Arial, DejaVu Sans, sans-serif" font-size="10" font-weight="700" fill="#111">RUS</text>
</svg>`;

const output = `${plate}${region}.png`;
await sharp(Buffer.from(svg)).png().resize(500, 500).toFile(output);
console.log(`Created ${output} (500x500)`);
