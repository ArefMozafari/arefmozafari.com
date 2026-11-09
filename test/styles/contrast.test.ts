import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const TOKENS = readFileSync('src/styles/tokens.css', 'utf8');
/** WCAG 1.4.3: body text against its background. */
const BODY_TEXT_MINIMUM = 4.5;

/** The relative luminance of a six-digit hex colour, per WCAG. */
function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** The WCAG contrast ratio between two hex colours. */
function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

/** The light and dark halves of a `--name: light-dark(#…, #…)` token. */
function schemePair(name: string): { light: string; dark: string } {
  const match = TOKENS.match(
    new RegExp(`${name}:\\s*light-dark\\((#[0-9a-f]{6}),\\s*(#[0-9a-f]{6})\\)`),
  );
  if (!match) {
    throw new Error(`${name} is not a light-dark() token in tokens.css`);
  }
  return { light: match[1], dark: match[2] };
}

describe('design tokens', () => {
  it('should keep the block gold readable as small text on the block in both schemes', () => {
    const gold = schemePair('--color-block-gold');
    const block = schemePair('--color-block');

    expect(contrast(gold.light, block.light)).toBeGreaterThanOrEqual(BODY_TEXT_MINIMUM);
    expect(contrast(gold.dark, block.dark)).toBeGreaterThanOrEqual(BODY_TEXT_MINIMUM);
  });

  it('should keep the block ink readable on the block in both schemes', () => {
    const ink = schemePair('--color-block-ink');
    const block = schemePair('--color-block');

    expect(contrast(ink.light, block.light)).toBeGreaterThanOrEqual(BODY_TEXT_MINIMUM);
    expect(contrast(ink.dark, block.dark)).toBeGreaterThanOrEqual(BODY_TEXT_MINIMUM);
  });
});
