#!/usr/bin/env node
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [plate, region] = process.argv.slice(2);
const match = plate?.match(/^([АВЕКМНОРСТУХ])(\d{3})([АВЕКМНОРСТУХ]{2})$/u);
if (!match) { console.error("Invalid Russian plate format."); process.exit(1); }
if (!/^\d{2,3}$/u.test(region ?? "")) { console.error("Invalid region code."); process.exit(1); }

const [, first, digits, last] = match;
const combination = `${first}${digits}${last}`;
const id = `${combination}${region}`;
const outputDir = path.join("plates", id);
fs.mkdirSync(outputDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#e0e0e0"/>
  <rect x="35" y="190" width="430" height="120" rx="7" fill="#fff" stroke="#141414" stroke-width="4"/>
  <line x1="365" y1="190" x2="365" y2="310" stroke="#191919" stroke-width="2"/>
  <text x="200" y="268" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="47" font-weight="700" fill="#000">${combination}</text>
  <text x="415" y="268" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="45" font-weight="600" fill="#000">${region}</text>
  <text x="415" y="296" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="12" font-weight="700" fill="#000">RUS</text>
</svg>`;

const output = path.join(outputDir, `${id}.png`);
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(`Created ${output} (500x500)`);
