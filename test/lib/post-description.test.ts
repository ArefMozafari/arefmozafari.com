import { describe, expect, it } from 'vitest';
import { describePost } from '../../src/lib/post-description';

describe('describePost', () => {
  it('should return the first paragraph of the body', () => {
    const body = '\nFirst paragraph here.\n\nSecond paragraph.\n';

    expect(describePost(body)).toBe('First paragraph here.');
  });

  it('should replace markdown links with their text', () => {
    const body = 'Repo: [ArefMozafari/pr-evidence](https://github.com/ArefMozafari/pr-evidence).';

    expect(describePost(body)).toBe('Repo: ArefMozafari/pr-evidence.');
  });

  it('should keep whole sentences up to the length limit', () => {
    const sentence = 'A sentence of some length that fills the line.';
    const body = `${sentence} ${sentence} ${sentence} ${sentence} ${sentence}`;

    expect(describePost(body)).toBe(`${sentence} ${sentence} ${sentence}`);
  });

  it('should keep a single sentence that is over the limit', () => {
    const long = `${'word '.repeat(40).trim()}.`;

    expect(describePost(long)).toBe(long);
  });
});
