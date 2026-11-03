# arefmozafari.com, unit 1 (homepage, posts, demo, deploy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the homepage of arefmozafari.com as a static Astro site with the live Flutter Password Validator demo, posts from a content folder, build-time GitHub and pub.dev counts, and a GitHub Actions deploy to Cloudflare Pages.

**Architecture:** Astro 7 static output with content collections (`posts`, `works`, `repos`, `alsoShipped`); every visual value in `src/styles/tokens.css`; three tiny `src/lib` modules hold the only logic (years, GitHub fetch, pub.dev fetch) and are unit-tested with Vitest; components are rendered in Container tests for the behaviours the spec pins. The Flutter demo is a separate Flutter app under `demo/`, built to `public/demo/` and embedded in an iframe. CI builds demo then site and deploys with `cloudflare/wrangler-action`.

**Tech Stack:** Astro 7.4, `@astrojs/sitemap`, `@astrojs/check`, TypeScript, Vitest, Prettier with `prettier-plugin-astro`, `sharp` (Astro images), Flutter 3.47 stable with `flutter_pw_validator ^2.0.0`, GitHub Actions, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-11-03-personal-site-design.md`

## Global Constraints

- No raw colour, size, radius, spacing or duration in a component: tokens live in `src/styles/tokens.css` only.
- No internal metric on the homepage. The only numbers rendered are computed (years) or fetched (GitHub, pub.dev). A failed fetch renders the row without a number and never fails the build.
- Every external claim is a link to its receipt (store listing, repo, package page, LinkedIn post).
- Copy fixed by the spec is used verbatim: lead "Three things I shipped that you can open right now."; sub-line "No internal metrics on this page. Every claim links to a store listing, a repository, or a published package. If you can't check it, it isn't here."; role line "Senior Mobile Engineer. Flutter, iOS & Android. {N} years: wallets, call SDKs, marketplaces."; pill "Open to remote roles"; demo hint "The phone is the real widget compiled to web. Type in it."; contact heading "Let's talk."; footer "Built by hand · source on GitHub".
- Years: `round((now − 2018-12-01) / 365.25 days)`, computed at build, corrected on the client.
- Tokens from the spec: canvas `#EFE9DC`, ink `#15120C`, muted `#5A5244`, deep gold `#8A6F3C`, block `#1A160F`, block ink `#F5F1E8`, block gold `#E0B95C`, green `#3F8A4C`, hairline `rgba(21,18,12,.2)`, strong rule `1.5px #15120C`, halftone dot gold `rgba(224,185,92,.55)` / cream `rgba(245,241,232,.35)` on a 9px grid.
- Type: Bricolage Grotesque 400/500/800 (Google provider, self-hosted by Astro's fonts API); mono stack `"SF Mono", Menlo, monospace`; Persian name in Vazirmatn 800 (Google provider, `cssVariable: '--font-fa'`), element marked `lang="fa" dir="rtl"`. IranSansX is not shipped: its licence requires a registered web licence for server hosting (spec, Type section).
- Motion: none on load or scroll; `prefers-reduced-motion` disables the two allowed transitions (nav colour, link underline).
- Breakpoints: phone `< 768px`, desktop `>= 1024px`, tablet between (single column, no bottom bar).
- Case-study pages are unit 2: work block titles are plain text in unit 1, never a dead link.
- No AI attribution anywhere. Commits small, imperative, conventional-commit prefixes (the repo has no history to match; the owner's default applies).
- Identifiers are full words; comments sit above the line they describe; private helpers defined above their callers.
- Verify command for the whole repo: `npm run verify` (`astro check`, `vitest run`, `astro build`). Flutter demo: `flutter analyze && flutter test` inside `demo/`.

## Review Focus

1. GitHub API rate-limited or offline during a build: the open-source row renders the repo name and link with no count, and `astro build` exits 0. (Task 4 tests the fetcher's null path and the row's rendering of `null`.)
2. Production build with the portrait or a work screenshot missing: the build must fail loudly, not ship a placeholder; dev builds may run without them. (Task 8 adds `tools/check-assets.mjs` and its test.)
3. A visitor with JavaScript disabled: nav anchors still jump to sections, the years number is the build-time value, the demo phone shows the static screenshot. (Task 5 tests anchors and the rendered number; Task 6 tests the `<noscript>`/fallback image.)
4. A post whose graphic is portrait 4:5 or landscape: the card must show the whole graphic, no crop. (Task 7 tests that the rendered `<img>` carries the graphic's own width and height and no fixed aspect class.)
5. Years at the rounding boundary and across a stale build: `2027-05-31` renders 8, `2027-06-02` renders 9; the client script replaces the number only when it differs. (Task 2 tests both dates and the client function's no-op path.)

---

## File structure

```
arefmozafari.com/
├── AGENTS.md                         project instructions: verify command, slots, conventions
├── README.md                         what it is, how to run, deploy hand-off (secrets, domain)
├── package.json                      scripts: dev, build, preview, check, test, verify, build:demo, check:assets
├── astro.config.mjs                  site URL, sitemap, fonts (Bricolage via google, IRANSansX local)
├── tsconfig.json · vitest.config.ts · .prettierrc · .gitignore
├── src/
│   ├── site.ts                       SITE constants (name, email, links, careerStart, domain)
│   ├── styles/tokens.css             every token
│   ├── styles/global.css             reset, base type, sign classes, reduced-motion
│   ├── content.config.ts             collections wired to schemas
│   ├── content/schemas.ts            zod schemas (testable without astro:content)
│   ├── content/works/<slug>.md       3 blocks: corepass, ring, flutter-password-validator (+ screenshots)
│   ├── content/posts/<slug>/index.md 1 folder per post with graphic beside it
│   ├── content/repos.json · content/also-shipped.json
│   ├── lib/years.ts · lib/github.ts · lib/pubdev.ts
│   ├── layouts/Base.astro            head: meta, OG, JSON-LD, fonts, tokens; body: Shell
│   ├── components/Shell.astro        two-column grid, MobileHeader, BottomBar
│   ├── components/Sidebar.astro      name, fa name, portrait, role, pill, nav, contact
│   ├── components/MobileHeader.astro · components/BottomBar.astro
│   ├── components/Lead.astro · WorkBlock.astro · PhoneFrame.astro · DesktopFrame.astro · DemoFrame.astro
│   ├── components/AlsoShipped.astro · OpenSource.astro · PostCard.astro · Posts.astro · Contact.astro · Footer.astro
│   ├── scripts/active-nav.ts         IntersectionObserver → aria-current on nav
│   ├── scripts/years-client.ts       client correction
│   └── pages/index.astro · pages/posts/[slug].astro · pages/robots.txt.ts
├── public/fonts (none; fonts API handles) · public/demo/ (gitignored build output) · public/og.png · public/cv.pdf
├── tools/check-assets.mjs            fails production build on missing portrait/screenshots
├── tools/og/og.html + render-og.mjs  one-off OG image render
├── demo/                             Flutter web app (flutter create, web only)
├── test/                             mirrors src: test/lib/*.test.ts, test/components/*.test.ts, test/tools/check-assets.test.ts
└── .github/workflows/deploy.yml
```

---

### Task 1: Scaffold, tokens, verify command

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.prettierrc`, `.gitignore`, `AGENTS.md`, `README.md`, `src/site.ts`, `src/styles/tokens.css`, `src/styles/global.css`, `src/pages/index.astro` (placeholder "Aref Mozafari" h1 only), `test/lib/.gitkeep`

**Interfaces:**
- Produces: `SITE` in `src/site.ts`:
  `export const SITE = { name: 'Aref Mozafari', domain: 'https://arefmozafari.com', email: 'me@arefmozafari.com', linkedin: 'https://www.linkedin.com/in/aref-mozafari', github: 'https://github.com/arefmozafari', repo: 'https://github.com/ArefMozafari/arefmozafari.com', careerStart: new Date('2018-12-01'), title: 'Senior Mobile Engineer' } as const`
- Produces: CSS custom properties in `tokens.css`, named `--color-canvas`, `--color-ink`, `--color-ink-muted`, `--color-gold-deep`, `--color-block`, `--color-block-ink`, `--color-block-gold`, `--color-green`, `--hairline`, `--rule-strong`, `--halftone-gold`, `--halftone-cream`, `--halftone-size: 9px`, `--font-display` (from Astro `cssVariable`), `--font-mono`, `--font-fa`, type scale `--text-name: 72px` … , spacing `--space-1..8`, `--radius-pill`, `--motion-fast: 150ms`, breakpoints as documented comments (CSS cannot hold them in vars).

- [ ] **Step 1: `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict`, then `npm install astro@^7.4 @astrojs/sitemap @astrojs/check typescript vitest prettier prettier-plugin-astro sharp -D` as appropriate (astro, sitemap, sharp as deps; the rest dev).**
- [ ] **Step 2: Write `astro.config.mjs`** with `site: 'https://arefmozafari.com'`, `integrations: [sitemap()]`, `fonts: [{ provider: fontProviders.google(), name: 'Bricolage Grotesque', cssVariable: '--font-display', weights: [400, 500, 800] }, { provider: fontProviders.google(), name: 'Vazirmatn', cssVariable: '--font-fa', weights: [800], subsets: ['arabic'] }]`.
- [ ] **Step 3: Write `package.json` scripts:** `dev`, `build`, `preview`, `check: astro check`, `test: vitest run`, `verify: npm run check && npm run test && npm run build`, `format: prettier --write .`. `vitest.config.ts` uses `getViteConfig({ test: { include: ['test/**/*.test.ts'] } })`.
- [ ] **Step 4: Write `tokens.css` and `global.css`** (reset, `body { background: var(--color-canvas); color: var(--color-ink); font-family: var(--font-display) }`, `@media (prefers-reduced-motion: reduce) { * { transition: none !important } }`).
- [ ] **Step 5: Write `AGENTS.md`**: verify command, default branch `main`, merge style squash, no locales, design tokens file, test tree mirrors `src`, Flutter demo verify command, "read the spec and plan under docs/superpowers first".
- [ ] **Step 6: Run `npm run verify`.** Expected: check 0 errors, vitest "no test files found" exits 0 (set `passWithNoTests: true`), build writes `dist/index.html`.
- [ ] **Step 7: Commit** `chore: scaffold astro site with tokens and verify command` (include the spec and plan docs in this first commit).

---

### Task 2: Years since career start

**Files:**
- Create: `src/lib/years.ts`, `src/scripts/years-client.ts`
- Test: `test/lib/years.test.ts`, `test/scripts/years-client.test.ts`

**Interfaces:**
- Produces: `export function yearsSince(start: Date, now: Date): number` (rounded to nearest whole year using 365.25-day years).
- Produces: `export function correctYears(element: { textContent: string | null }, start: Date, now: Date): boolean` returns `true` only when it changed the text. `years-client.ts` also has a default side effect: on `DOMContentLoaded` it finds `[data-years][data-career-start]` and calls `correctYears` with the ISO date from the attribute.

- [ ] **Step 1: Write the failing tests**

```ts
describe('yearsSince', () => {
  const start = new Date('2018-12-01');
  it('should round down before the half year', () => { expect(yearsSince(start, new Date('2026-11-03'))).toBe(8); expect(yearsSince(start, new Date('2027-05-31'))).toBe(8); });
  it('should round up after the half year', () => { expect(yearsSince(start, new Date('2027-06-02'))).toBe(9); });
  it('should return zero inside the first half year', () => { expect(yearsSince(start, new Date('2019-03-01'))).toBe(0); });
});
describe('correctYears', () => {
  it('should replace the text when the build-time value is stale', () => { const element = { textContent: '7' }; expect(correctYears(element, new Date('2018-12-01'), new Date('2026-11-03'))).toBe(true); expect(element.textContent).toBe('8'); });
  it('should leave the text alone when it already matches', () => { const element = { textContent: '8' }; expect(correctYears(element, new Date('2018-12-01'), new Date('2026-11-03'))).toBe(false); });
});
```

- [ ] **Step 2: Run `npx vitest run test/lib/years.test.ts test/scripts/years-client.test.ts`.** Expected: FAIL, module not found.
- [ ] **Step 3: Implement both functions.** Years: `Math.round((now.getTime() - start.getTime()) / (365.25 * 24 * 3600 * 1000))`.
- [ ] **Step 4: Run the two test files.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: compute years of experience from the career start date`.

---

### Task 3: Content schemas and seed content

**Files:**
- Create: `src/content/schemas.ts`, `src/content.config.ts`, `src/content/works/{corepass,ring,flutter-password-validator}.md`, `src/content/repos.json`, `src/content/also-shipped.json`, `src/content/posts/<slug>/index.md` + graphic for each shipped post, `src/assets/works/` screenshots (staged per Task 8)
- Test: `test/content/schemas.test.ts`

**Interfaces:**
- Produces, in `schemas.ts` (all take `image` from `SchemaContext` where noted):
  - `workSchema({ image })`: `{ name: string, order: number, kicker: string, tag?: string, word: string[] (1–2 lines), artifact: { kind: 'phone' | 'desktop' | 'demo', image?: image(), alt: string }, receipts: { label: string, url: string.url() }[] (min 1), hint?: string }`; body = description.
  - `postSchema({ image })`: `{ title: string, date: coerce.date, linkedinActivityId: string.regex(/^\d{19}$/), graphic: image(), alt: string }`; body = post text. Add `export function linkedinUrl(activityId: string): string` → `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`.
  - `repoSchema`: `{ id: string, name: string, description: string, url: string.url(), github?: string (owner/repo), pub?: string, note?: string }`.
  - `alsoShippedSchema`: `{ id: string, name: string, note: string, url?: string.url() }`.
- Collections in `content.config.ts`: `works` glob `src/content/works/*.md`, `posts` glob `src/content/posts/*/index.md`, `repos` file `src/content/repos.json`, `alsoShipped` file `src/content/also-shipped.json`.

- [ ] **Step 1: Write the failing tests** (use a stub `image` that returns `z.any()`):

```ts
describe('workSchema', () => {
  it('should reject a work with no receipts', () => expect(() => parse(workSchema, { ...validWork, receipts: [] })).toThrow());
  it('should reject a receipt whose url is not absolute', () => expect(() => parse(workSchema, { ...validWork, receipts: [{ label: 'x', url: '/local' }] })).toThrow());
  it('should accept the demo kind without an image', () => expect(parse(workSchema, { ...validWork, artifact: { kind: 'demo', alt: 'a' } }).artifact.kind).toBe('demo'));
});
describe('postSchema', () => {
  it('should reject an activity id that is not nineteen digits', () => expect(() => parse(postSchema, { ...validPost, linkedinActivityId: '123' })).toThrow());
});
describe('linkedinUrl', () => {
  it('should build the feed update url from the activity id', () => expect(linkedinUrl('7486157038834782208')).toBe('https://www.linkedin.com/feed/update/urn:li:activity:7486157038834782208'));
});
```

- [ ] **Step 2: Run `npx vitest run test/content/schemas.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement the schemas and `linkedinUrl`; wire `content.config.ts`.**
- [ ] **Step 4: Write the seed content.** Works, with the receipts verified in the spec's builder-check section; `flutter-password-validator` has `artifact.kind: demo`, `word: ['Password', 'Validator']`, `hint` = the demo sentence. `repos.json`: the seven rows from the spec (`github` for the six ArefMozafari repos, `pub` for `flutter_pw_validator` and `password_rules`, the `dart-lang/ai` row with `url: 'https://github.com/dart-lang/ai/pull/731'` and `note: 'PR #731 · in review'`). `also-shipped.json`: Ting & Heyo, Bfrest, Foxhole (url), Fediverse video app (no url). Posts: one folder per published post the owner confirmed, graphic copied from `~/Desktop/Aref Mozafari - LinkedIn/posts/<folder>/graphic.png`, body = the text under "COPY BELOW THIS LINE", `title` = first line.
- [ ] **Step 5: Run `npx vitest run test/content/schemas.test.ts` then `npx astro sync && npx astro check`.** Expected: PASS, 0 errors (sync validates the seed content against the schemas).
- [ ] **Step 6: Commit** in two: `feat: define content schemas for works, posts and repos` then `content: seed works, repos and published posts`.

---

### Task 4: Build-time counts from GitHub and pub.dev

**Files:**
- Create: `src/lib/github.ts`, `src/lib/pubdev.ts`, `src/components/OpenSource.astro`
- Test: `test/lib/github.test.ts`, `test/lib/pubdev.test.ts`, `test/components/OpenSource.test.ts`

**Interfaces:**
- `export type RepoCounts = { stars: number; forks: number }`; `export async function fetchRepoCounts(fullName: string, fetchImplementation: typeof fetch = fetch, token: string | undefined = process.env.GITHUB_TOKEN): Promise<RepoCounts | null>`; GET `https://api.github.com/repos/${fullName}`, header `Accept: application/vnd.github+json`, `Authorization: Bearer ${token}` when set; `null` on non-2xx or thrown error (never throws).
- `export type PackageScore = { points: number; likes: number; downloads30Days: number }`; `export async function fetchPackageScore(name: string, fetchImplementation: typeof fetch = fetch): Promise<PackageScore | null>`; GET `https://pub.dev/api/packages/${name}/score`, maps `grantedPoints`, `likeCount`, `downloadCount30Days`.
- `OpenSource.astro` props: `{ rows: { name: string; description: string; url: string; counts: RepoCounts | null; score: PackageScore | null; note?: string }[] }`. Renders the count cell as `"{stars} ★ · {forks} forks"`, or `"{likes} likes · {points} pts"` when only `score`, or `note`, or nothing.

- [ ] **Step 1: Write the failing tests**

```ts
describe('fetchRepoCounts', () => {
  it('should map stargazers and forks from the repo payload', async () => { const fetchStub = async () => new Response(JSON.stringify({ stargazers_count: 33, forks_count: 46 }), { status: 200 }); expect(await fetchRepoCounts('ArefMozafari/flutter_pw_validator', fetchStub as typeof fetch, undefined)).toEqual({ stars: 33, forks: 46 }); });
  it('should return null when the API answers with an error status', async () => { const fetchStub = async () => new Response('rate limited', { status: 403 }); expect(await fetchRepoCounts('a/b', fetchStub as typeof fetch, undefined)).toBeNull(); });
  it('should return null when the network throws', async () => { const fetchStub = async () => { throw new Error('offline'); }; expect(await fetchRepoCounts('a/b', fetchStub as typeof fetch, undefined)).toBeNull(); });
  it('should send the bearer token when one is given', async () => { let seenAuthorization = ''; const fetchStub = async (_url: string, init?: RequestInit) => { seenAuthorization = new Headers(init?.headers).get('authorization') ?? ''; return new Response('{}', { status: 200 }); }; await fetchRepoCounts('a/b', fetchStub as typeof fetch, 'token'); expect(seenAuthorization).toBe('Bearer token'); });
});
describe('fetchPackageScore', () => {
  it('should map points, likes and downloads from the score payload', async () => { const fetchStub = async () => new Response(JSON.stringify({ grantedPoints: 160, likeCount: 176, downloadCount30Days: 2864 }), { status: 200 }); expect(await fetchPackageScore('flutter_pw_validator', fetchStub as typeof fetch)).toEqual({ points: 160, likes: 176, downloads30Days: 2864 }); });
  it('should return null when pub.dev is unreachable', async () => { const fetchStub = async () => { throw new Error('blocked'); }; expect(await fetchPackageScore('x', fetchStub as typeof fetch)).toBeNull(); });
});
describe('OpenSource', () => {
  it('should render the repo link without a count when both sources are null', async () => { const html = await container.renderToString(OpenSource, { props: { rows: [{ name: 'pr-evidence', description: 'd', url: 'https://github.com/ArefMozafari/pr-evidence', counts: null, score: null }] } }); expect(html).toContain('href="https://github.com/ArefMozafari/pr-evidence"'); expect(html).not.toMatch(/★|likes/); });
  it('should prefer GitHub counts over the pub.dev score', async () => { const html = await container.renderToString(OpenSource, { props: { rows: [{ name: 'n', description: 'd', url: 'https://x.y', counts: { stars: 33, forks: 46 }, score: { points: 160, likes: 176, downloads30Days: 1 } }] } }); expect(html).toContain('33 ★ · 46 forks'); });
});
```

- [ ] **Step 2: Run the three test files.** Expected: FAIL.
- [ ] **Step 3: Implement the two fetchers and the component** (rows as hairline grid per spec; count cell in mono).
- [ ] **Step 4: Run the three test files.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: fetch GitHub and pub.dev counts at build with link-only fallback`.

---

### Task 5: Shell, sidebar, mobile header, base layout

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Shell.astro`, `src/components/Sidebar.astro`, `src/components/MobileHeader.astro`, `src/components/BottomBar.astro`, `src/scripts/active-nav.ts`, `src/assets/portrait.jpg` (owner-supplied; dev placeholder allowed, see Task 8)
- Modify: `src/pages/index.astro` (use Base + Shell)
- Test: `test/components/Sidebar.test.ts`, `test/layouts/Base.test.ts`

**Interfaces:**
- `Base.astro` props: `{ title: string; description: string; ogImage?: string }`; emits `<title>`, meta description, canonical from `Astro.url`, OG + Twitter card tags, JSON-LD `Person` `{ name: SITE.name, jobTitle: SITE.title, url: SITE.domain, sameAs: [SITE.linkedin, SITE.github] }`, `<Font cssVariable="--font-display" preload />`, `<Font cssVariable="--font-fa" />`, imports tokens and global CSS.
- `Shell.astro`: renders `<MobileHeader />`, `<aside><Sidebar /></aside>`, `<main><slot /></main>`, `<BottomBar />`; grid `320px 1fr` at `>= 1024px`, single column below.
- `Sidebar.astro` props: `{ years: number; sections: { id: string; label: string }[] }`; nav items are `<a href="#id">`; years rendered as `<span data-years data-career-start="2018-12-01">{years}</span>`; Persian name `<p lang="fa" dir="rtl" class="name-fa">عارف مظفری</p>`; portrait `<Image>` with alt `"Aref Mozafari"` wrapped in `.portrait` (duotone via CSS `filter: grayscale(1) contrast(1.1)` + gold `mix-blend-mode` overlay, builder's exact recipe); pill text "Open to remote roles"; contact links from `SITE`.
- `active-nav.ts`: observes `main section[id]`, sets `aria-current="true"` on the matching sidebar anchor; no-op when `IntersectionObserver` is undefined.
- `BottomBar.astro`: two links, `mailto:${SITE.email}` labelled "Email me" and `/cv.pdf` labelled "Résumé"; shown only `< 768px`.

- [ ] **Step 1: Write the failing tests**

```ts
describe('Sidebar', () => {
  it('should mark the Persian name as right-to-left Persian', async () => { const html = await render(Sidebar, { years: 8, sections }); expect(html).toMatch(/<p[^>]*lang="fa"[^>]*dir="rtl"/); expect(html).toContain('عارف مظفری'); });
  it('should render the role line with the computed years', async () => { const html = await render(Sidebar, { years: 8, sections }); expect(html).toContain('data-career-start="2018-12-01"'); expect(html).toMatch(/8<\/span> years: wallets, call SDKs, marketplaces\./); });
  it('should link every section with a plain anchor', async () => { const html = await render(Sidebar, { years: 8, sections }); for (const section of sections) expect(html).toContain(`href="#${section.id}"`); });
  it('should never say relocation', async () => { expect(await render(Sidebar, { years: 8, sections })).not.toMatch(/relocat/i); });
});
describe('Base', () => {
  it('should emit a Person JSON-LD block with the LinkedIn and GitHub profiles', async () => { const html = await render(Base, { title: 't', description: 'd' }); expect(html).toContain('"@type":"Person"'); expect(html).toContain(SITE.linkedin); });
  it('should emit exactly one h1 across the page', async () => { const html = await render(IndexPage); expect(html.match(/<h1\b/g)?.length).toBe(1); });
});
```

- [ ] **Step 2: Run the two test files.** Expected: FAIL.
- [ ] **Step 3: Implement the layout and components; the `h1` is the Latin name in `Sidebar`.** Add the client scripts via `<script src>` in `Base.astro` (`years-client.ts`, `active-nav.ts`).
- [ ] **Step 4: Run the tests, then `npm run dev` and look at `/` at 1280px and at 390px in the browser pane.** Expected: PASS; sticky column on desktop, compact header and bottom bar on phone, no horizontal scroll at 390px.
- [ ] **Step 5: Commit** `feat: add base layout, sticky sidebar and phone header`.

---

### Task 6: Lead, work blocks, phone and demo frames, also-shipped

**Files:**
- Create: `src/components/Lead.astro`, `WorkBlock.astro`, `PhoneFrame.astro`, `DesktopFrame.astro`, `DemoFrame.astro`, `AlsoShipped.astro`; sign classes in `global.css`
- Modify: `src/pages/index.astro`
- Test: `test/components/WorkBlock.test.ts`, `test/components/DemoFrame.test.ts`, `test/components/AlsoShipped.test.ts`

**Interfaces:**
- `WorkBlock.astro` props: `{ work: CollectionEntry<'works'>; index: number }`; renders the halftone block (`.block`, modifier `.block--cream` for the demo), kicker, optional tag, big word lines, the artifact by kind (`PhoneFrame` with `<Image>`, `DesktopFrame` with `<Image>`, or `DemoFrame`), then the caption row: zero-padded number, name as plain text (no link in unit 1), rendered body, optional `<b>` hint, receipts column of `<a target="_blank" rel="noopener">` links.
- `DemoFrame.astro` props: `{ fallbackAlt: string }`; renders `<iframe src="/demo/" title="Flutter Password Validator demo" loading="lazy">` inside the phone chrome plus `<noscript><img src="/demo-fallback.png" alt=...></noscript>`; the iframe gets `data-demo` so a later task can swap in the static image when `/demo/` 404s.
- `Lead.astro`: the two spec sentences; the underline sign on "check it" via `<u class="sign-underline">`.
- `AlsoShipped.astro` props: `{ items: CollectionEntry<'alsoShipped'>[] }`; row right cell is a link when `url` exists, otherwise the mono text `internal`.

- [ ] **Step 1: Write the failing tests**

```ts
describe('WorkBlock', () => {
  it('should render every receipt as an external link', async () => { const html = await render(WorkBlock, { work: corepassEntry, index: 0 }); for (const receipt of corepassEntry.data.receipts) expect(html).toContain(`href="${receipt.url}"`); expect(html).toMatch(/rel="noopener/); });
  it('should not link the work title in unit 1', async () => { const html = await render(WorkBlock, { work: corepassEntry, index: 0 }); expect(html).not.toMatch(/<a[^>]*>CorePass<\/a>/); });
  it('should zero-pad the index', async () => { expect(await render(WorkBlock, { work: corepassEntry, index: 0 })).toContain('>01<'); });
});
describe('DemoFrame', () => {
  it('should lazy-load the demo iframe and keep a noscript image', async () => { const html = await render(DemoFrame, { fallbackAlt: 'a' }); expect(html).toContain('src="/demo/"'); expect(html).toContain('loading="lazy"'); expect(html).toMatch(/<noscript>[\s\S]*<img/); });
});
describe('AlsoShipped', () => {
  it('should render internal for a row without a url', async () => { const html = await render(AlsoShipped, { items: [{ data: { id: 'f', name: 'Fediverse video app', note: 'n' } }] }); expect(html).toContain('internal'); expect(html).not.toMatch(/<a /); });
});
```

- [ ] **Step 2: Run the three test files.** Expected: FAIL.
- [ ] **Step 3: Implement.** `index.astro` reads `works` sorted by `order`, `alsoShipped`, and renders Lead → three WorkBlocks → AlsoShipped inside `<section id="work">`.
- [ ] **Step 4: Run tests; view `/` in the browser pane at 1280px and 390px.** Expected: PASS; the three blocks match the v4 mockup; no internal numbers anywhere on the page (`grep -c '%' dist/index.html` equals 0 after `npm run build`).
- [ ] **Step 5: Commit** `feat: add lead, work blocks and also-shipped index`.

---

### Task 7: Posts grid and post pages

**Files:**
- Create: `src/components/PostCard.astro`, `src/components/Posts.astro`, `src/pages/posts/[slug].astro`
- Modify: `src/pages/index.astro`
- Test: `test/components/PostCard.test.ts`

**Interfaces:**
- `PostCard.astro` props: `{ post: CollectionEntry<'posts'> }`; renders `<Image src={graphic} alt={alt} widths=[480, 960]>` with no aspect-ratio class (intrinsic size from metadata), the title, the month `format(date, 'MMM yyyy')` via `Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })`, a link to `/posts/${post.id}` on the title and a link "on LinkedIn ↗" to `linkedinUrl(activityId)`.
- `Posts.astro` props: `{ posts: CollectionEntry<'posts'>[] }`, newest first, two columns `>= 768px`.
- `/posts/[slug]`: `getStaticPaths` from the collection; page shows the graphic, rendered body, date, LinkedIn link; `Base` title = post title, canonical = site URL.

- [ ] **Step 1: Write the failing tests**

```ts
describe('PostCard', () => {
  it('should link to the LinkedIn original by activity id', async () => { const html = await render(PostCard, { post: postEntry }); expect(html).toContain('href="https://www.linkedin.com/feed/update/urn:li:activity:7486157038834782208"'); });
  it('should keep the graphic at its own aspect ratio', async () => { const html = await render(PostCard, { post: portraitPostEntry }); expect(html).toMatch(/<img[^>]*width="\d+"[^>]*height="\d+"/); expect(html).not.toContain('aspect-ratio'); });
  it('should show the month and year only', async () => { expect(await render(PostCard, { post: postEntry })).toContain('Jul 2026'); });
});
```

- [ ] **Step 2: Run the test.** Expected: FAIL.
- [ ] **Step 3: Implement; add `<section id="posts">` to `index.astro`; add the post page.**
- [ ] **Step 4: Run the test, then `npm run build` and open `dist/posts/<slug>/index.html` in the browser pane.** Expected: PASS; one page per post; graphics uncropped in the grid.
- [ ] **Step 5: Commit** `feat: add posts grid and per-post pages`.

---

### Task 8: Contact, footer, OG image, asset gate, SEO files

**Files:**
- Create: `src/components/Contact.astro`, `src/components/Footer.astro`, `src/pages/robots.txt.ts`, `tools/check-assets.mjs`, `tools/og/og.html`, `tools/og/render-og.mjs`, `public/og.png`, `public/cv.pdf`, `src/assets/works/*.png` (staged store screenshots), `public/demo-fallback.png`
- Modify: `package.json` (`prebuild: node tools/check-assets.mjs`), `src/pages/index.astro`
- Test: `test/tools/check-assets.test.ts`, `test/components/Footer.test.ts`

**Interfaces:**
- `tools/check-assets.mjs`: `export function missingAssets(rootDirectory: string, requiredPaths: string[], existsImplementation = fs.existsSync): string[]`; CLI entry exits 1 listing missing paths when `process.env.NODE_ENV === 'production' || process.env.CI === 'true'`, otherwise prints a warning. Required: `src/assets/portrait.jpg`, `src/assets/works/corepass.png`, `src/assets/works/ring.png`, `public/og.png`, `public/cv.pdf`, `public/demo-fallback.png`.
- `Footer.astro`: `"Aref Mozafari · {new Date().getFullYear()}"` and a link to `SITE.repo` labelled "Built by hand · source on GitHub".
- `Contact.astro`: heading "Let's talk.", links to `mailto:`, LinkedIn, GitHub, `/cv.pdf` labelled "Résumé, one page, PDF".
- OG: `tools/og/og.html` is a 1200×630 block-style card (name, role, domain) rendered once with the owner's `render-any.sh` recipe or Playwright to `public/og.png`; committed.
- `robots.txt.ts` returns `User-agent: *\nAllow: /\nSitemap: https://arefmozafari.com/sitemap-index.xml`.

- [ ] **Step 1: Write the failing tests**

```ts
describe('missingAssets', () => {
  it('should list only the paths that do not exist', () => { const exists = (path: string) => path.endsWith('og.png'); expect(missingAssets('/r', ['public/og.png', 'src/assets/portrait.jpg'], exists)).toEqual(['src/assets/portrait.jpg']); });
  it('should return an empty list when every asset exists', () => { expect(missingAssets('/r', ['a', 'b'], () => true)).toEqual([]); });
});
describe('Footer', () => {
  it('should link the source repository', async () => { expect(await render(Footer)).toContain(`href="${SITE.repo}"`); });
  it('should carry no attribution to any tool', async () => { expect(await render(Footer)).not.toMatch(/claude|anthropic|generated/i); });
});
```

- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Implement.** Stage the store screenshots from the public App Store and Cafe Bazaar listings with headless Chrome (the owner's `shot-url.sh` pattern: real UA, exact crop, no cookie banners). Portrait: the owner's file; until it arrives, `check-assets` reports it missing and `npm run build` still passes locally (not in CI).
- [ ] **Step 4: Run tests; `CI=true npm run build` with the portrait absent.** Expected: tests PASS; the CI-mode build fails listing `src/assets/portrait.jpg`; a plain `npm run build` passes with a warning.
- [ ] **Step 5: Commit** in two: `feat: add contact, footer, robots and OG image` then `build: fail production builds on missing portrait or screenshots`.

---

### Task 9: Flutter web demo

**Files:**
- Create: `demo/` via `flutter create --platforms=web --project-name validator_demo --org com.arefmozafari demo`, then `demo/lib/main.dart`, `demo/lib/demo_theme.dart`, `demo/test/main_test.dart`, `demo/analysis_options.yaml` (flutter_lints)
- Modify: `package.json` (`build:demo` script), `.gitignore` (`public/demo/`)

**Interfaces:**
- `demo/lib/main.dart`: `void main() => runApp(const DemoApp())`; `DemoApp` is a `MaterialApp` with `theme: demoTheme` (cream `0xFFF5F1E8` background, ink `0xFF15120C` text, gold `0xFFE0B95C` as the bar colour, green `0xFF3F8A4C` as success; constants in `demo_theme.dart`), `debugShowCheckedModeBanner: false`, home `DemoPage`.
- `DemoPage`: a `TextField` (autofocus, obscureText false so the visitor sees what they type, label "Password") and `FlutterPwValidator(controller: controller, rules: const PasswordRules(minLength: 8, uppercase: 1, digits: 1, special: 1, custom: [CommonPasswordsRule()]))`. Nothing else: no buttons, no app bar.
- `npm run build:demo`: `cd demo && flutter build web --release --base-href=/demo/ --no-web-resources-cdn && rm -rf ../public/demo && cp -r build/web ../public/demo`.

- [ ] **Step 1: Write the failing widget test** (`demo/test/main_test.dart`):

```dart
group('DemoPage', () {
  testWidgets('should show the five rules under the field', (tester) async { await tester.pumpWidget(const DemoApp()); expect(find.byType(FlutterPwValidator), findsOneWidget); expect(find.byType(TextField), findsOneWidget); });
  testWidgets('should mark the length rule met after eight characters', (tester) async { await tester.pumpWidget(const DemoApp()); await tester.enterText(find.byType(TextField), 'Tr0ub4do'); await tester.pumpAndSettle(); expect(find.textContaining('8'), findsWidgets); });
});
```

- [ ] **Step 2: Run `cd demo && flutter test`.** Expected: FAIL (no `DemoApp`).
- [ ] **Step 3: Implement `main.dart` and `demo_theme.dart`; add `flutter_pw_validator: ^2.0.0` to `demo/pubspec.yaml`.**
- [ ] **Step 4: Run `flutter analyze && flutter test` in `demo/`, then `npm run build:demo && npm run dev` and type into the phone on `/` in the browser pane.** Expected: clean analyze, tests PASS, rules tick as you type, the block's static fallback is hidden once the iframe loads.
- [ ] **Step 5: Commit** `feat: add the Flutter web demo of flutter_pw_validator`.

---

### Task 10: CI build and Cloudflare Pages deploy

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (hand-off section: secrets, Pages project name `arefmozafari-com`, custom-domain step, preview URLs)

**Interfaces:**
- Workflow `deploy`: triggers `push` to `main` and `pull_request`. Jobs: one job, `ubuntu-latest`, steps: checkout; `subosito/flutter-action@v2` (`channel: stable`, `cache: true`); `actions/setup-node@v4` (`node-version: 22`, `cache: npm`); `npm ci`; `npm run build:demo`; `npm run verify` with `CI=true` and `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`; `cloudflare/wrangler-action@v4` with `apiToken`, `accountId`, `gitHubToken`, and `command: pages deploy dist --project-name=arefmozafari-com --branch=${{ github.head_ref || github.ref_name }}`. Permissions `contents: read`, `deployments: write`.

- [ ] **Step 1: Write the workflow.**
- [ ] **Step 2: Validate it:** `npx action-validator .github/workflows/deploy.yml` or `actionlint` if installed; otherwise `node -e "require('yaml').parse(...)"`. Expected: no errors.
- [ ] **Step 3: Write the README hand-off**: create the Pages project once (`npx wrangler pages project create arefmozafari-com --production-branch=main`), add the two secrets, attach the custom domain in the dashboard, note that DNS is already on Cloudflare and MX must not change.
- [ ] **Step 4: Commit** `ci: build the demo and site and deploy to Cloudflare Pages`.
- [ ] **Step 5: STOP.** Report what was verified; wait for the owner's word before creating the GitHub repo, pushing, or opening a PR.

---

## Self-review notes

- Spec coverage: lead, blocks, also-shipped, open source, posts, contact, footer (Tasks 6–8); sidebar, phone header, bottom bar, active nav, years (Tasks 2, 5); tokens, fonts, Persian mark (Tasks 1, 5); demo (Task 9); SEO files, OG, JSON-LD, sitemap, robots (Tasks 5, 8); CI and deploy (Task 10); asset gate for "no placeholder in production" (Task 8); roaming sign: underline in Lead (Task 6), corner spark on block 01 and a gutter dot on the Posts label are CSS classes in `global.css` applied in Tasks 6–7. Reduced motion in Task 1's global CSS. Unit 2 (case studies) is out of scope by design.
- Names used consistently: `yearsSince`, `correctYears`, `fetchRepoCounts`, `fetchPackageScore`, `linkedinUrl`, `missingAssets`, `SITE`, collection names `works`, `posts`, `repos`, `alsoShipped`.
- Open content inputs (owner): portrait, September/October LinkedIn ids, Ting/Heyo/Bfrest URLs, licence confirmation for IranSansX, the posts list. None blocks Tasks 1–7 or 9–10; Task 8's gate makes the portrait a hard requirement only for CI builds.
