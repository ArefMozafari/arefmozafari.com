# arefmozafari.com

Personal site of Aref Mozafari, Senior Mobile Engineer. Static Astro site with a live
Flutter web demo of [flutter_pw_validator](https://pub.dev/packages/flutter_pw_validator).

## Run it

```sh
npm install
GITHUB_TOKEN="$(gh auth token)" npm run dev
```

The token is optional. Without it GitHub's anonymous rate limit can run out during a long dev
session, and the upstream pull request's row loses its live state until the next build.

The demo phone on the homepage embeds `public/demo/`, which is a Flutter web build. Build it
once with a Flutter SDK installed:

```sh
npm run build:demo
```

The build step also prunes the renderers and symbol maps the demo never requests, which
keeps the deploy small. The page starts the demo only once its block nears the viewport, so
its bundle never competes with the first screens.

## Verify

```sh
npm run verify
```

Runs `astro check`, `prettier --check`, the Vitest suite and a production build. In CI (`CI=true`) the build also
fails when a required image or document is missing, so a placeholder never ships. The demo has
its own check:

```sh
cd demo && flutter analyze && flutter test
```

## Structure

- `src/content/` holds the content: works, posts, open-source rows, earlier work.
- `src/styles/tokens.css` holds every visual value.
- `src/lib/` holds the build-time logic: computed years, the pull request state, a per-process
  memo so each remote is asked once per build, the post description and sitemap dates.
- `src/scripts/` holds the little that runs in the browser: the years correction, the active
  section in the nav, the scheme switch, the demo start button, the phone menu.
- `demo/` is the Flutter app behind the phone frame.
- `tools/og/` renders the Open Graph card; `tools/check-assets.mjs` is the production asset gate.
- `docs/superpowers/` holds the design spec and the implementation plan.

## What is live, and what is not

Computed or fetched on every build, and refreshed by the weekly scheduled run: years of
experience, the upstream pull request's state, the footer year. GitHub pauses scheduled workflows after 60 days without a push; a
commit, or "Run workflow" on the Actions tab, turns the weekly refresh back on. Hand-maintained by design: the status row, the role line, the
work descriptions, and new posts (one folder each under `src/content/posts/`).

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds the demo and the site on every push to
`main`, every pull request (preview), every Monday (fresh pull request state and years), and
on demand, then deploys with `cloudflare/wrangler-action`.

### One-time hand-off

1. Create the Pages project, once, from a machine logged in to Cloudflare:

   ```sh
   npx wrangler login
   npx wrangler pages project create arefmozafari-com --production-branch=main
   ```

2. Add two repository secrets under Settings → Secrets and variables → Actions:
   `CLOUDFLARE_ACCOUNT_ID` (Cloudflare dashboard → account home, right column) and
   `CLOUDFLARE_API_TOKEN` (My Profile → API Tokens → Create Token, permission
   **Cloudflare Pages: Edit** on this account).
3. In the Cloudflare dashboard open Workers & Pages → `arefmozafari-com` → Custom domains and
   add `arefmozafari.com` and `www.arefmozafari.com`. The nameservers are already on
   Cloudflare, so the records are created in place. Do not touch the MX records; mail stays
   on iCloud.
4. Send `www` to the apex with a redirect rule, since a Pages `_redirects` file cannot match a
   hostname: in the dashboard open the `arefmozafari.com` zone → Rules → Redirect Rules →
   Create rule → template "Redirect from WWW to Root", status 301, preserve the path and query
   string. The `www` record stays proxied, so the rule answers before Pages does.
5. Push `main`. The first run creates the production deployment; pull requests appear at
   `<branch>.arefmozafari-com.pages.dev`.

### Refreshing the static captures

`public/og.png` is rendered from `tools/og/og.html` (serve the folder over http, open it at
1200×630, screenshot). `public/demo-fallback.png` is a 340×660 capture of the built demo at
`/demo/index.html`. Re-capture either when its source changes.

`public/favicon.svg` is a work block in miniature: the initial in Bricolage Grotesque ExtraBold
as outlines, with the gold dot. `tools/favicon/build.mjs` regenerates it from the font's static
ExtraBold TTF (from the Bricolage repository, not committed) with `opentype.js` installed
alongside; `public/favicon-32.png` and `public/apple-touch-icon.png` are renders of it at 32 and
180 pixels.
