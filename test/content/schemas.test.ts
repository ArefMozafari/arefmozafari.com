import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { linkedinUrl, postSchema, workSchema } from '../../src/content/schemas';

// Stands in for Astro's image() helper, which only exists inside a build.
const imageStub = () => z.any();

const validWork = {
  name: 'CorePass',
  order: 1,
  kicker: 'Blockchain identity & wallet',
  word: ['CorePass'],
  artifact: { kind: 'phone', image: 'corepass.png', alt: 'CorePass on an iPhone' },
  receipts: [{ label: 'App Store ↗', url: 'https://apps.apple.com/app/corepass-id/id1644928641' }],
};

const validPost = {
  title: 'I made hashing in one of my Flutter apps 700% faster.',
  date: '2026-07-30',
  linkedinActivityId: '7486157038834782208',
  graphic: 'graphic.png',
  alt: 'Post graphic',
};

describe('workSchema', () => {
  const schema = workSchema({ image: imageStub } as never);

  it('should reject a work with no receipts', () => {
    expect(() => schema.parse({ ...validWork, receipts: [] })).toThrow();
  });

  it('should reject a receipt whose url is not absolute', () => {
    expect(() =>
      schema.parse({ ...validWork, receipts: [{ label: 'x', url: '/local' }] }),
    ).toThrow();
  });

  it('should accept the demo kind without an image', () => {
    const parsed = schema.parse({ ...validWork, artifact: { kind: 'demo', alt: 'a' } });

    expect(parsed.artifact.kind).toBe('demo');
  });
});

describe('postSchema', () => {
  const schema = postSchema({ image: imageStub } as never);

  it('should reject an activity id that is not nineteen digits', () => {
    expect(() => schema.parse({ ...validPost, linkedinActivityId: '123' })).toThrow();
  });

  it('should coerce the date string to a Date', () => {
    expect(schema.parse(validPost).date).toBeInstanceOf(Date);
  });
});

describe('linkedinUrl', () => {
  it('should build the feed update url from the activity id', () => {
    expect(linkedinUrl('7486157038834782208')).toBe(
      'https://www.linkedin.com/feed/update/urn:li:activity:7486157038834782208',
    );
  });
});
