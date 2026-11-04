import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';
const font = opentype.parse(readFileSync(process.argv[2]).buffer);
// Canvas 128, tile radius 16 (an eighth, the card radius ratio), letter 62% of the tile.
const SIZE = 128,
  RADIUS = 16,
  LETTER = 80,
  DOT = 22,
  RULE = 3;
const glyph = font.charToGlyph('A');
const scale = LETTER / font.unitsPerEm;
const width = glyph.advanceWidth * scale;
const box = glyph.getPath(0, 0, LETTER).getBoundingBox();
const capHeight = box.y2 - box.y1;
// The letter and the dot sit as one mark, centred on the tile.
const gap = 8;
const markWidth = box.x2 - box.x1 + gap + DOT;
const x = (SIZE - markWidth) / 2 - box.x1;
const baseline = (SIZE + capHeight) / 2;
const letter = glyph.getPath(x, baseline, LETTER).toPathData(2);
const dotX = x + box.x2 + gap + DOT / 2;
const dotY = baseline - DOT / 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <!-- A work block in miniature: charcoal tile, cream initial, the gold dot that signs the page. -->
  <rect x="${RULE / 2}" y="${RULE / 2}" width="${SIZE - RULE}" height="${SIZE - RULE}" rx="${RADIUS}" fill="#1a160f" stroke="rgba(245,241,232,0.25)" stroke-width="${RULE}"/>
  <path fill="#f5f1e8" d="${letter}"/>
  <circle cx="${dotX.toFixed(2)}" cy="${dotY.toFixed(2)}" r="${DOT / 2}" fill="#e0b95c"/>
</svg>
`;
writeFileSync(process.argv[3], svg);
console.log({
  width: width.toFixed(1),
  capHeight: capHeight.toFixed(1),
  markWidth: markWidth.toFixed(1),
});
