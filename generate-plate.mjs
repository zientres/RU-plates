#!/usr/bin/env node
/**
 * Generate RU Plates standard NFT metadata from the existing collection template.
 * Usage:
 *   node generate-plate.mjs "В206РС" "12" "https://raw.githubusercontent.com/zientres/RU-plates/main/В206РС12.png"
 * Output: plates/В206РС12.json
 */
import fs from "node:fs";
import path from "node:path";

const [plate, region, imageUrl] = process.argv.slice(2);
if (!plate || !region || !imageUrl) {
  console.error('Usage: node generate-plate.mjs "<PLATE>" "<REGION>" "<IMAGE_URL>"');
  process.exit(1);
}
const match = plate.match(/^([\p{L}]+)(\d+)([\p{L}]+)$/u);
if (!match) {
  console.error("Plate must contain letters-number-letters (e.g. В206РС).");
  process.exit(1);
}
const [, firstLetters, numbers, lastLetters] = match;
const metadata = {
  name: plate,
  description: `A digital collectible ${plate}. Part of the RU Plates collection.`,
  image: imageUrl,
  attributes: [
    { trait_type: "Region", value: String(region) },
    { trait_type: "Letter Combination", value: firstLetters + lastLetters },
    { trait_type: "Number Combination", value: numbers }
  ]
};
const outDir = path.join("plates");
fs.mkdirSync(outDir, { recursive: true });
const output = path.join(outDir, `${plate}${region}.json`);
fs.writeFileSync(output, JSON.stringify(metadata, null, 2) + "\n", "utf8");
console.log(`Created ${output}`);
