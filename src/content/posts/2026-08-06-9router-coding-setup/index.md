---
title: 'I rebuilt my AI coding setup from scratch, and the result surprised me.'
date: 2026-08-06
linkedinActivityId: '7491400809717350400'
graphic: ./graphic.png
alt: 'Portrait card listing the stack: 9Router, CodeGraph, Cline, Hermes'
---

The result: 20 to 40% fewer tokens per request, plus an agent that actually understands my codebase.

The stack, all open source:

- **9Router** auto-compresses each request for 20 to 40% token savings, and falls back across 100+ models when one hits a limit or errors out. No memory wiped, no new chat.
- **CodeGraph** is a local graph of my codebase. The agent grabs the exact symbols and call paths it needs in one query, instead of reading file after file.
- **Cline** is the extension in VS Code or JetBrains, pointed at my local 9Router.
- **Hermes** is a self-improving agent with persistent memory that builds its own skills, layered on top, so the whole thing runs closer to hands-off.

Genuinely changed how I work.

Links: [9Router](https://github.com/decolua/9router), [CodeGraph](https://github.com/colbymchenry/codegraph), [Hermes](https://github.com/nousresearch/hermes-agent).
