# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers filling remote mobile roles, arriving from LinkedIn or
the résumé, reading for under a minute, deciding whether to book a call.

Secondary, confirmed 2026-11-09: engineers who land on a post or an open-source row, and
Persian-speaking visitors. No Persian edition exists; whether one follows is undecided and
waits on evidence of Persian-speaking traffic.

## Product Purpose

The personal site of Aref Mozafari, Senior Mobile Engineer (Flutter, iOS and Android). It
answers three things in the first five seconds: who this is, what shipped, and whether they
are available. Success is a visitor leaving with the contact details and the feeling that
everything they read can be checked.

## Positioning

Three things a neighbouring portfolio could not truthfully copy:

- Every claim links to where a stranger can verify it: store listings, repositories, pub.dev.
  No internal metrics, no counts.
- The work runs on the page: the owner's own Flutter package, compiled for the web, runs live
  inside the phone frame.
- Numbers are computed or fetched at build, never typed: years of experience, the state of any
  upstream pull request a row names, the footer year.

## Operating Context

Visitors come from a LinkedIn profile or a PDF résumé, often on a phone. Posts mirror what the
owner already publishes on LinkedIn; the site is not fed on a schedule. The site is static,
built by GitHub Actions on push and by a weekly scheduled run that refreshes the computed and
fetched values, and deployed to Cloudflare Pages.

## Capabilities and Constraints

- Content: four works (CorePass, Ring, Foxhole Artillery, Flutter Password Validator), an
  "also shipped" list, open-source rows, posts, earlier work, a résumé PDF, an email link as the
  only contact. No contact form, no testimonials, no skills wall, no "uses" page.
- Availability is a current state, not a positioning fact: "Open to remote roles" is written in
  two places, `src/site.ts` (the description) and `src/components/Sidebar.astro` (the status
  row), and future work should expect it to flip.
- English only. The Persian name is the one `lang="fa"` element.
- Nothing unbuilt is reachable in a production build; `tools/check-assets.mjs` fails CI when a
  required asset is missing.
- The demo phone embeds a Flutter web build of flutter_pw_validator pinned to the Flutter
  version CI uses.
- Terminology: a homepage "block" is one work; its "receipts" are the links that verify it;
  the "kicker" is the strip naming role and years.

## Brand Commitments

- Name: Aref Mozafari, with the Persian name عارف مظفری drawn as an SVG beside it.
- Voice: plain, specific, first person, short sentences. No greeting emoji, no "passionate",
  no "crafting digital experiences".
- The site carries the owner's existing LinkedIn identity (gold on charcoal, outlined-glyph
  language) so the profile and the site read as one person.
- The footer says "Built by hand" and links to the source.

## Evidence on Hand

- Store listings and sites per work, in `src/content/works/*.md` receipts.
- pub.dev packages: flutter_pw_validator, password_rules.
- Repositories under github.com/ArefMozafari.
- Work images in `src/assets/works/` (the products' own cards and a real screenshot), portrait
  in `src/assets/portrait.jpg`, résumé in `public/Aref-Mozafari-Senior-Mobile-Engineer.pdf`.
- Absent, and not to be fabricated: testimonials, customer logos, usage or adoption numbers,
  download counts.

## Product Principles

1. Verifiable over impressive: a claim without a link does not ship.
2. Show, don't describe: the real artifact, the real widget, the real store card.
3. Computed over maintained: anything that changes with time is derived at build.
4. One minute, then the email: the page is done when the visitor knows who, what and how to reach them.
5. Nothing reaches production half-built.
