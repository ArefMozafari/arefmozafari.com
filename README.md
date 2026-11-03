# arefmozafari.com

Personal site of Aref Mozafari, Senior Mobile Engineer. Static Astro site with a live
Flutter web demo of [flutter_pw_validator](https://pub.dev/packages/flutter_pw_validator).

## Run it

```sh
npm install
GITHUB_TOKEN="$(gh auth token)" npm run dev
```

The token is optional. Without it GitHub's anonymous rate limit runs out quickly and the
open-source rows fall back to links without counts.

The demo phone on the homepage embeds `public/demo/`, which is a Flutter web build. Build it
once with a Flutter SDK installed:

```sh
npm run build:demo
```

## Verify

```sh
npm run verify
```

Runs `astro check`, the Vitest suite and a production build.

## Structure

- `src/content/` holds the content: works, posts, open-source rows, earlier work.
- `src/styles/tokens.css` holds every visual value.
- `src/lib/` holds the only logic: computed years, GitHub and pub.dev counts.
- `demo/` is the Flutter app behind the phone frame.
- `docs/superpowers/` holds the design spec and the implementation plan.
