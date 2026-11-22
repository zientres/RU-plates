#!/usr/bin/env node
/**
 * Generate RU Plates artwork matching the original В206РС12 reference.
 * Usage: node generate-plate-image.mjs "Т767ОР" "53"
 * Output: plates/<PLATE><REGION>/<PLATE><REGION>.png
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [plate, region] = process.argv.slice(2);
const match = plate?.match(/^([АВЕКМНОРСТУХ])(\d{3})([АВЕКМНОРСТУХ]{2})$/u);
if (!match) {
  console.error('Plate must use Russian format: one allowed letter, three digits, two allowed letters (e.g. Т767ОР).');
  process.exit(1);
}
if (!/^\d{2,3}$/u.test(region ?? "")) {
  console.error("Region must contain 2 or 3 digits.");
  process.exit(1);
}

const [, first, digits, last] = match;
const combination = `${first}${digits}${last}`;
const id = `${combination}${region}`;
const outputDir = path.join("plates", id);
fs.mkdirSync(outputDir, { recursive: true });

const W = 500, H = 500;
const plateX = 35, plateY = 204, plateW = 430, plateH = 92;
const separatorX = plateX + 330;
const rightCenter = separatorX + (plateX + plateW - separatorX) / 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#cacaca"/>
  <rect x="${plateX}" y="${plateY}" width="${plateW}" height="${plateH}" rx="5" fill="#fff" stroke="#111" stroke-width="4"/>
  <text x="${plateX + 164}" y="${plateY + 62}" text-anchor="middle" font-family="Arial, DejaVu Sans, sans-serif" font-size="43" font-weight="700" fill="#000">${combination}</text>
  <line x1="${separatorX}" y1="${plateY + 4}" x2="${separatorX}" y2="${plateY + plateH - 4}" stroke="#111" stroke-width="2"/>
  <text x="${rightCenter}" y="${plateY + 62}" text-anchor="middle" font-family="Arial, DejaVu Sans, sans-serif" font-size="36" font-weight="700" fill="#000">${region}</text>
  <text x="${rightCenter}" y="${plateY + 81}" text-anchor="middle" font-family="Arial, DejaVu Sans, sans-serif" font-size="10" font-weight="700" fill="#000">RUS</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, `${id}.png`));
console.log(`Created ${path.join(outputDir, `${id}.png`)} (500x500)`);
