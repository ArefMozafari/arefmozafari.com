import type { APIRoute } from 'astro';
import { SITE } from '../site';

const body = `User-agent: *
Allow: /

Sitemap: ${SITE.domain}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
