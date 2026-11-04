const POST_DATE = /\/posts\/(\d{4}-\d{2}-\d{2})-/;

/// The sitemap's lastmod for a page: a post's date, read from its slug, or the build date.
export function lastModified(url: string, built: Date): string {
  return url.match(POST_DATE)?.[1] ?? built.toISOString().slice(0, 10);
}
