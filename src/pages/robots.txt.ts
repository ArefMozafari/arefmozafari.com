import type { APIRoute } from 'astro';
import { SITE } from '../site';

// The demo bundle is a Flutter build behind a noindex page; crawlers have no use for it.
const body = `User-agent: *
Allow: /
Disallow: /demo/

Sitemap: ${SITE.domain}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
