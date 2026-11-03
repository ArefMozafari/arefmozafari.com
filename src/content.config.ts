import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { alsoShippedSchema, postSchema, repoSchema, workSchema } from './content/schemas';

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '*.md' }),
  schema: workSchema,
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '*/index.md' }),
  schema: postSchema,
});

const repos = defineCollection({
  loader: file('./src/content/repos.json'),
  schema: repoSchema,
});

const alsoShipped = defineCollection({
  loader: file('./src/content/also-shipped.json'),
  schema: alsoShippedSchema,
});

export const collections = { works, posts, repos, alsoShipped };
