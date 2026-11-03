# arefmozafari.com — project instructions

Personal site of Aref Mozafari. Static Astro site plus a small Flutter web demo.
Read `docs/superpowers/specs/2026-11-03-personal-site-design.md` before changing anything
visible: it holds the design decisions and the content rules.

## Project slots

- **Verify command (the one that must pass):** `npm run verify`
  (`astro check`, `vitest run`, `astro build`). The Flutter demo has its own:
  `cd demo && flutter analyze && flutter test`.
- **Default branch:** `main`. **Merge style:** squash. Work on `feature/<kebab-description>`
  branches cut from `main`.
- **Design system:** `src/styles/tokens.css`. Components never carry a raw colour, size, radius
  or duration.
- **Locales:** none. The site is English; the Persian name is the one `lang="fa"` element.
- **Run target:** `GITHUB_TOKEN="$(gh auth token)" astro dev --background` (manage with
  `astro dev stop`, `astro dev status`, `astro dev logs`), then `http://localhost:4321`. The
  token lifts GitHub's anonymous rate limit of 60 calls an hour; without it the upstream pull
  request's row loses its live state once the limit is hit. Each remote is fetched once per
  process (`src/lib/memo.ts`). The demo phone needs `npm run build:demo` once so
  `public/demo/` exists.
- **Deploy:** GitHub Actions builds and deploys to Cloudflare Pages on push to `main`;
  pull requests get a preview deploy. See `README.md` for the one-time hand-off steps.
- **Issues:** GitHub issues on this repo, `[TASK]:` / `[BUG]:` titles, `roadmap` and
  `tech-debt` labels.

## Content rules that are enforced by review, not by code

- No internal metric on the homepage, and no counts at all. The only numbers are the computed
  years and the footer year; the one fetched value is the upstream pull request's state, and
  a failed fetch leaves the plain note.
- Every claim links to where a stranger can check it.
- Nothing unbuilt is reachable in a production build. `tools/check-assets.mjs` fails a CI
  build when a required image is missing.

## Conventions

- Tests live under `test/` mirroring `src/`; one test file per source file; descriptions in
  the imperative (`should …`); every test inside a `describe` naming the function or
  component under test.
- Full-word identifiers, comments above the line they describe, helpers defined above their
  callers.
- Posts: one folder per post under `src/content/posts/<yyyy-mm-dd-slug>/` with `index.md` and
  the graphic beside it. Frontmatter is hand-written (see `src/content/schemas.ts`).
