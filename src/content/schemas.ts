import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

const LINKEDIN_ACTIVITY_ID = /^\d{19}$/;
const LINKEDIN_FEED_UPDATE = 'https://www.linkedin.com/feed/update/urn:li:activity:';

/// A link where a visitor can verify a claim: a store listing, a repository, a package page.
const receiptSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

/// One of the three homepage blocks. The body of the entry is its description.
export const workSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string().min(1),
    order: z.number().int().positive(),
    kicker: z.string().min(1),
    word: z.array(z.string().min(1)).min(1).max(2),
    artifact: z.object({
      kind: z.enum(['phone', 'desktop', 'poster', 'demo']),
      image: image().optional(),
      alt: z.string().min(1),
    }),
    receipts: z.array(receiptSchema).min(1),
    hint: z.string().optional(),
  });

/// A LinkedIn post mirrored on the site. The body of the entry is the post text.
export const postSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    linkedinActivityId: z.string().regex(LINKEDIN_ACTIVITY_ID),
    graphic: image(),
    alt: z.string().min(1),
  });

/// An open-source row: a name, one line on what it is, and a link.
export const repoSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
  /// `owner/repo#number`; the row shows the pull request's live state when set.
  pullRequest: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+#\d+$/)
    .optional(),
  note: z.string().optional(),
});

/// Splits `owner/repo#number` into its parts.
export function parsePullRequest(reference: string): { fullName: string; number: number } {
  const [fullName, number] = reference.split('#');
  return { fullName, number: Number(number) };
}

/// Earlier work listed under "Also shipped". A row without a url renders as plain text.
export const alsoShippedSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  name: z.string().min(1),
  note: z.string().min(1),
  url: z.url().optional(),
});

/// Builds the public URL of a LinkedIn post from its activity id.
export function linkedinUrl(activityId: string): string {
  return `${LINKEDIN_FEED_UPDATE}${activityId}`;
}
