---
title: GitHub has no API for attaching an image to a pull request.
date: 2026-09-26
linkedinActivityId: '7509697354250383360'
graphic: ./graphic.png
alt: 'Code card showing the pr-evidence skill file and its install command'
---

The drag-and-drop upload is browser-session only, so gh can't reach it. An agent that opens the PR for you opens one with no screenshots in it.

There's a second trap behind it: GitHub proxies images through a cache. Replace a screenshot at a path that has already rendered, and reviewers keep seeing the old one.

Today I published the way around both as an open-source agent skill, pr-evidence.

Capture the before on the base branch. Push images to a branch that never merges, fresh path every capture. One snippet for anything that isn't UI. Six sections in the body.

MIT. Runs in Claude Code, Codex, Gemini CLI, Copilot and Cursor.

Repo: [ArefMozafari/pr-evidence](https://github.com/ArefMozafari/pr-evidence).
