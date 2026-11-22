#!/usr/bin/env node
/**
 * Generate RU Plates artwork matching the original В206РС12 reference.
 * 500x500 square canvas, flat grey background and a straight white plate.
 * No flag, gradients, perspective, shadows or extra decoration.
 *
 * Usage: node generate-plate-image.mjs "Т767ОР" "53"
 */
import sharp from "sharp";

const [plate, region] = process.argv.slice(2);
const allowed = "АВЕКМНОРСТУХ";
const match = plate?.match(/^([АВЕКМНОРСТУХ])(\\d{3})([АВЕКМНОРСТУХ]{2})$/u);

if (!match) {
  console.error('Plate must use Russian format: one letter, three digits, two letters (e.g. Т767ОР).');
  process.exit(1);
}
if (!/^\\d{2,3}$/u.test(region ?? "")) {
  console.error("Region must contain 2 or 3 digits.");
  process.exit(1);
}

const W = 500;
const H = 500;
const plateX = 35;
const plateY = 204;
const plateW = 430;
const plateH = 92;
const separatorX = plateX + 330;
const [, first, digits, last] = match;
const combination = `${first}${digits}${last}`;
const rightCenter = separatorX + (plateX + plateW - separatorX) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#cacaca"/>
  <rect x="${plateX}" y="${plateY}" width="${plateW}" height="${plateH}" rx="5"
        fill="#fff" stroke="#111" stroke-width="4"/>
  <text x="${plateX + 164}" y="${plateY + 62}" text-anchor="middle"
        font-family="Arial, DejaVu Sans, sans-serif" font-size="43"
        font-weight="700" fill="#000">${combination}</text>
  <line x1="${separatorX}" y1="${plateY + 4}" x2="${separatorX}" y2="${plateY + plateH - 4}"
        stroke="#111" stroke-width="2"/>
  <text x="${rightCenter}" y="${plateY + 62}" text-anchor="middle"
        font-family="Arial, DejaVu Sans, sans-serif" font-size="36"
        font-weight="700" fill="#000">${region}</text>
  <text x="${rightCenter}" y="${plateY + 81}" text-anchor="middle"
        font-family="Arial, DejaVu Sans, sans-serif" font-size="10"
        font-weight="700" fill="#000">RUS</text>
</svg>`;

const output = `${combination}${region}.png`;
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(`Created ${output} (500x500)`);
