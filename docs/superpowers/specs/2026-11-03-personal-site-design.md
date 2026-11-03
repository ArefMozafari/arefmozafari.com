# arefmozafari.com — design

Date: 2026-11-03. Status: approved in conversation, pending builder check.

## Intent

A personal site for Aref Mozafari, Senior Mobile Engineer (Flutter, iOS and Android),
whose one job is to make a recruiter or hiring manager want to book a call. The visitor
arrives from LinkedIn or the résumé, reads for under a minute, and leaves with contact
details and the feeling that everything they saw can be checked.

The explicit anti-goal is the AI-template look: gradient hero with a glowing blob, two pill
buttons, three-column icon features, a skills wall of logos, animated counters, dark mode by
default. None of that ships.

## Goals, non-goals, anti-goals

Goals

- Answer three things in five seconds: who, what shipped, available for remote roles.
- Every claim on the homepage links to where a stranger can verify it.
- Show craft with the site itself: the owner's open-source Flutter widget runs live on the page.
- Carry the owner's existing visual identity (gold on charcoal, outlined-glyph language) so
  LinkedIn and the site read as one person.
- Stay fast, static and cheap to maintain: posts are a folder, numbers are fetched at build.

Non-goals

- A blog that needs weekly feeding. Posts mirror what he already writes on LinkedIn.
- A Persian edition. Decided against for the first build; a single `/fa` page may follow later
  if analytics show Persian-speaking traffic.
- Testimonials, a skills wall, a "uses" page, a contact form (email link is the contact).

Anti-goals (failure even if it technically works)

- Any internal, unverifiable metric on the homepage ("+30% adoption", "700% faster").
- A block whose image is a stock-looking phone or a placeholder.
- Decorative motion: fade-in heroes, scroll reveals, parallax, counters.
- Reading as a template export. The footer says "Built by hand" and links to the source.

## Audience and tone

Recruiters and hiring managers for remote mobile roles worldwide. Tone: plain, specific,
first person, short sentences. No "Hi, I'm Aref 👋", no "passionate", no "crafting digital
experiences".

## Visual direction: "Case file" (direction C, iterated to v4)

Decided over two alternatives (A "Paper": editorial serif index; B "Charcoal": the LinkedIn
poster palette as a spec sheet). Chosen because it is unique among mobile-engineer sites and
carries the most personality; the risks (needs strong images, heavy type forgives nothing,
sticky column has no good mobile collapse) are addressed below.

### Tokens

Canvas `#EFE9DC` (warm cream). Ink `#15120C`. Muted ink `#5A5244`. Deep gold `#8A6F3C`
(links, the only accent on cream). Block charcoal `#1A160F` with halftone dots in gold
`rgba(224,185,92,.55)` or cream `rgba(245,241,232,.35)`, 9px grid. Block ink `#F5F1E8`,
block kicker gold `#E0B95C`. Availability green `#3F8A4C`. Hairline `rgba(21,18,12,.2)`,
strong rule `1.5px #15120C`. These come from the owner's LinkedIn brand system; the cream
canvas is the inversion of its charcoal canvas, chosen so the site is not another dark page.

Every colour, size, radius and spacing lives in one token file. No raw values in components.

### Type

- Display and body: Bricolage Grotesque (Google Fonts, self-hosted at build), weights 400,
  500, 800. Name at 800, 72px desktop, letter-spacing −0.04em, line-height .9.
- Mono labels and ids: SF Mono / Menlo system stack. Uppercase mono with letter-spacing for
  section labels only; package ids in mono, normal case.
- Persian: used for one element, the Persian name under the Latin name, at weight 800.
  Default is Vazirmatn 800 (SIL Open Font Licence, Google provider, self-hosted by the
  build). IranSansX ExtraBold was the first choice, but its licence (fontiran.com, read
  2026-11-03) states that placing the font file on a server for a website requires a
  registered web licence on fontiran.com in addition to the purchase; the owner's copy covers
  personal installation. If the owner registers that licence, the swap is one font entry in
  `astro.config.mjs` and one token.

### Layout

Desktop (≥ 1024px): two columns. Left column 320px, sticky to the viewport: Latin name,
Persian name (`lang="fa" dir="rtl"`, gold), portrait, role line, availability pill,
vertical nav (Work, Open source, Posts, Contact), contact links pinned to the bottom. Right
column scrolls. Active nav item follows the section in view.

Phone (< 768px): the column collapses to a compact header (small square portrait, status
text, menu), then the name large, role, pill, and the same sections stacked. A fixed bottom
bar holds "Email me" and "Résumé". Tablet between the two: single column, no bottom bar.

### Homepage sections, in order

1. Lead: "Three things I shipped that you can open right now." Sub-line states the rule:
   "No internal metrics on this page. Every claim links to a store listing, a repository, or
   a published package. If you can't check it, it isn't here."
2. Three case blocks. Each: a 320px halftone block with a small gold kicker, the product
   name as the big word, one real artifact (phone screenshot, desktop screenshot, or the live
   demo), then a caption row: number, name, two-sentence description, and the receipts
   column of links. Order:
   - 01 CorePass. Kicker "Blockchain identity & wallet". Tag "Live on both stores". Phone
     frame with a real App Store / Play screenshot. Receipts: App Store, Google Play,
     corepass.net.
   - 02 Ring. Kicker "Mobile Engineer, 2026 –". Tag "Classifieds · Iran". Desktop or store
     screenshot. Receipts: Cafe Bazaar, Myket, ring.ir.
   - 03 Flutter Password Validator. Kicker "Open source · pub.dev". Big word "Password /
     Validator" on two lines. The phone frame holds the real widget compiled to web, with a
     focused input and no label on the block; the caption carries one bold sentence: "The
     phone is the real widget compiled to web. Type in it." Receipts: pub.dev, GitHub,
     password_rules.
3. "Also shipped": a hairline index of earlier work with a link where one exists (Ting &
   Heyo, Bfrest, Foxhole artillery calculator) and "internal" where none does (Fediverse
   video app). No numbers.
4. "Open source": repo rows with description and a live count (GitHub stars and forks,
   pub.dev points) fetched at build time, plus the upstream contribution to
   flutter/agent-plugins linking to the PR.
5. "Posts": two-column grid of the owner's LinkedIn posts: the real graphic, the hook line,
   the month, a link to the LinkedIn original. Source is a folder of markdown entries with
   the graphic beside each; the owner's existing `posts/YYYY-MM-DD-slug/` folders convert
   with a one-off script. Each post also gets its own URL on the site.
6. Contact: "Let's talk." then email, LinkedIn, GitHub, résumé PDF as large underlined links.
7. Footer: "Aref Mozafari · {year}" and "Built by hand · source on GitHub".

### Case-study pages

Same shell. Main column: back link, product title at 84px, one-line tagline, a four-cell
fact row (Role, Period, Stack, Stores), one hero block, then Problem / What I did / Result /
Check it. Result may carry team-measured numbers, phrased as such ("the team measured …").
Short: readable in a minute. Next-project link at the bottom. Ships for the three homepage
products; the builder may ship the homepage first with case-study links disabled in dev
builds only (never a dead link in production).

### Portrait

One photo, square or 4:5, in the sticky column under the name; small square in the phone
header. Treated as a charcoal-and-gold duotone halftone so it belongs to the block system.
Never a circle, never the LinkedIn Open-To-Work frame. The owner supplies the source file;
the treatment is applied in the build (CSS `mix-blend-mode`/filter or a pre-processed asset,
builder's choice, output must look the same in Safari and Chrome).

### The roaming sign

Carried over from the LinkedIn playbook: exactly one small gold mark per section, in the
outlined-glyph language, a different form each time (underline on one word in the lead,
corner spark on one block, gutter mark in a code panel, and so on). Small; content dominates.

### Motion

Almost none. Allowed: the live widget's own feedback as the visitor types; the active nav
item colour change under 200ms; link underline colour on hover. Everything respects
`prefers-reduced-motion`. Nothing animates on load or on scroll.

## Content rules

- Years of experience is computed, never typed: years since 2018-12-01, rounded to the
  nearest whole year, computed at build with a one-line client correction so a stale build
  still shows the right number.
- Every number on the homepage is fetched or linked. If a source disappears, the row shows
  the link without the number rather than a stale number.
- Role line: "Senior Mobile Engineer. Flutter, iOS & Android. {N} years shipping production
  apps." (Generalised from a list of domains on 2026-11-03 at the owner's request.)
- Availability pill: "Open to remote roles". The owner cannot relocate; never "open to
  relocation".
- Links open the real thing: store listings, pub.dev, GitHub, LinkedIn post. No dead
  controls. Anything unbuilt is hidden in production builds.

## How it is made

- Astro, static output, zero client JavaScript except: the years correction, the active-nav
  observer, and the embedded Flutter demo. Content collections for posts and case studies.
- Build-time data: GitHub REST for stars/forks, pub.dev API for points/likes, cached in the
  build; failures degrade to "link only" and must not fail the build.
- Flutter demo: a small Flutter web app in `demo/` depending on `flutter_pw_validator`
  (published 2.0.0), built with `flutter build web --release` and copied to `public/demo/`
  in CI; the homepage embeds it in an `<iframe>` inside the phone frame, lazy-loaded, with a
  static screenshot as the fallback when the iframe has not loaded or JS is off.
- Fonts self-hosted under `public/fonts/`, preloaded, `font-display: swap`.
- Hosting: Cloudflare Pages, connected to the GitHub repo `ArefMozafari/arefmozafari.com`,
  building on push to `main`, custom domain `arefmozafari.com` (nameservers are already on
  Cloudflare; mail stays on iCloud, do not touch MX). Preview deploys per branch.
- SEO: one `h1`, per-page title and description, Open Graph and Twitter card image (a
  generated 1200×630 in the block style), JSON-LD `Person` with name, job title, sameAs
  (LinkedIn, GitHub), sitemap, robots, canonical URLs, alt text on every graphic, each post
  its own URL. Target query is the owner's name.
- Accessibility: semantic landmarks, visible focus, 4.5:1 contrast on cream (muted ink
  `#5A5244` passes; deep gold `#8A6F3C` on cream is for links with underline, not body text),
  reduced-motion honoured, Persian element marked `lang="fa" dir="rtl"`.
- Repository conventions follow the owner's global working agreement: feature branches
  from `main`, small bisectable commits, no AI attribution, tests first for logic (years
  computation, post loader, data fetch degradation), one combined verify command in
  `package.json` (`npm run verify`: typecheck, lint, test, build).

## Left to the builder

- Exact type scale and spacing tokens below the values given.
- Halftone implementation (CSS radial-gradient vs. SVG pattern) and the portrait duotone.
- Where the demo app's source lives (`demo/` in this repo is the default) and how CI gets
  Flutter (subosito/flutter-action or equivalent on Cloudflare's build, or prebuilt and
  committed under `public/demo/` if Cloudflare's build image cannot run Flutter).
- Open Graph image generation approach.
- Analytics: Cloudflare Web Analytics (no cookie) may be enabled; nothing else.

## Builder-check outcomes (2026-11-03)

Settled by the author after the builder review; marked where the call is the author's.

- **Units.** Unit 1 is the homepage, posts, open-source rows, contact, deploy pipeline and the
  live demo. Case-study pages are unit 2; in unit 1 the block titles are plain text, not
  links, so nothing is dead in production. (Author's call.)
- **Posts.** Only entries whose `post.txt` records a publish are shown; drafts and reskins
  are not. Each shipped post gets hand-written frontmatter (title = hook line, date, LinkedIn
  URL, graphic path, alt text); no parser for the free-form headers. (Author's call.) LinkedIn
  activity ids recovered from the saved profile export for the July 2026 posts:
  700% hashing `7486157038834782208`, Clean Architecture `7488049355980017664`, Ghost in the
  Droid `7488409354807754752`, CorePass shipped `7485338561869799426`, AI tool question
  `7479491437412409344`. URL form: `https://www.linkedin.com/feed/update/urn:li:activity:<id>`.
  September and October post URLs come from the owner.
- **Open-source rows.** flutter_pw_validator, password_rules, pr-evidence, review-findings,
  review-replies, post-merge-cleanup, and the upstream contribution
  `https://github.com/dart-lang/ai/pull/731` ("[skills] Add a link command for local skill
  directories", open and awaiting review as of 2026-11-03; the row says "in review" until it
  merges). The earlier flutter/agent-plugins PR #258 was closed unmerged and is not shown. GitHub counts via the REST API,
  pub.dev counts via `https://pub.dev/api/packages/<name>/score` (grantedPoints, likeCount,
  downloadCount30Days; verified reachable 2026-11-03).
- **Receipts verified live 2026-11-03.** CorePass: `apps.apple.com/app/corepass-id/id1644928641`,
  `play.google.com/store/apps/details?id=net.corepass.app`, `corepass.net`. Ring:
  `cafebazaar.ir/app/com.ads.ring`, `myket.ir/app/com.ads.ring`, `ring.ir`. Foxhole:
  `github.com/ArefMozafari/FoxholeArtillery-mobile`. Ting, Heyo and Bfrest: no listing found by
  search; the owner supplies a URL or the row ships without a link.
- **Contact.** `me@arefmozafari.com`, `linkedin.com/in/aref-mozafari`, `github.com/arefmozafari`,
  résumé PDF supplied by the owner (the Google Doc is the source of truth; the Desktop export
  is a fallback).
- **Store screenshots.** Staged by the builder from the public store listings (same rule as
  the LinkedIn playbook: real artifacts only, captured from public pages).
- **Accounts and deploy.** Both GitHub and Cloudflare accounts are the owner's. The builder
  creates the GitHub repo with the owner's approval. The Flutter demo and the site are built
  in GitHub Actions; deploy uses `cloudflare/wrangler-action` with `pages deploy`, which
  needs two repository secrets the owner creates: `CLOUDFLARE_ACCOUNT_ID` and
  `CLOUDFLARE_API_TOKEN` (Pages Write). Custom-domain attach is a one-time step in the
  Cloudflare dashboard by the owner; documented in the README as a hand-off.
- **Years computation start date:** 2018-12-01, confirmed by the owner 2026-11-03.
- **Owner decisions 2026-11-03:** the Posts grid shows every post that is live on LinkedIn,
  including the July 2026 posts and the 700% hashing post (they link to their originals; the
  site itself makes no claim). Ting & Heyo and Bfrest ship as plain-text rows with no link.
  Execution: the author implements the plan in one session, with one independent review of the
  whole branch at the end.

## Decided against, and why

- Whole site in Flutter web: slow first paint, weak SEO and text selection, contradicts
  "built by hand" for the one visitor who reads the source.
- LinkedIn embed iframes for posts: slow, off-palette, break on phones.
- Internal metrics as hero numbers: unverifiable, discounted by sceptical readers.
- A "running live" label on the demo block: the focus ring and the caption sentence do the
  job without a badge.
- Bilingual site: a second design, not a translation; English posts inside a Persian shell
  look half-finished.
- GitHub Pages: no edge functions, no cookie-free analytics, no per-branch previews.
