#!/usr/bin/env node
/**
 * Generate metadata for an RU Plates NFT.
 * Usage: node generate-plate.mjs "Т767ОР" "53"
 * Output: plates/Т767ОР53/Т767ОР53.json
 */
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

const [, first, numbers, last] = match;
const id = `${plate}${region}`;
const folder = path.join("plates", id);
fs.mkdirSync(folder, { recursive: true });
const imageUrl = `https://raw.githubusercontent.com/zientres/RU-plates/main/plates/${encodeURIComponent(id)}/${encodeURIComponent(id)}.png`;
const metadata = {
  name: plate,
  description: `A digital collectible ${plate}. Part of the RU Plates collection.`,
  image: imageUrl,
  attributes: [
    { trait_type: "Region", value: String(region) },
    { trait_type: "Letter Combination", value: first + last },
    { trait_type: "Number Combination", value: numbers }
  ]
};
const output = path.join(folder, `${id}.json`);
fs.writeFileSync(output, JSON.stringify(metadata, null, 2) + "\n", "utf8");
console.log(`Created ${output}`);
