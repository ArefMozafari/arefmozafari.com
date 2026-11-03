import { describe, expect, it } from 'vitest';
import { buildOpenSourceRows } from '../../src/lib/open-source-rows';

const openState = async () => 'open' as const;
const unknownState = async () => null;

describe('buildOpenSourceRows', () => {
  it('should append the live pull request state to the note', async () => {
    const [row] = await buildOpenSourceRows(
      [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          pullRequest: 'dart-lang/ai#731',
          note: 'PR #731',
        },
      ],
      openState,
    );

    expect(row.note).toBe('PR #731 · in review');
  });

  it('should keep the plain note when the pull request state is unknown', async () => {
    const [row] = await buildOpenSourceRows(
      [
        {
          name: 'n',
          description: 'd',
          url: 'https://x.y',
          pullRequest: 'dart-lang/ai#731',
          note: 'PR #731',
        },
      ],
      unknownState,
    );

    expect(row.note).toBe('PR #731');
  });

  it('should leave rows without a pull request untouched, in the order given', async () => {
    const rows = await buildOpenSourceRows(
      [
        { name: 'first', description: 'd', url: 'https://x.y' },
        { name: 'second', description: 'd', url: 'https://x.y' },
      ],
      openState,
    );

    expect(rows.map((row) => row.name)).toEqual(['first', 'second']);
    expect(rows[0].note).toBeUndefined();
  });
});
