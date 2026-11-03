---
title: Writing code got fast. Reviewing it didn't.
date: 2026-08-10
linkedinActivityId: '7495185184930209793'
graphic: ./graphic.png
alt: 'Portrait flow card: how PR-Agent reviews a pull request in five steps'
---

An agent ships a diff in minutes. A human still reads it line by line.

So I put an AI reviewer on the other side: PR-Agent. Open source, MIT, donated by Qodo to the community. It runs as a comment on the PR: `/review` for findings, security issues and whether the change actually came with tests; `/describe` for a title, summary, walkthrough and labels; `/improve` for concrete code suggestions; `/ask` for free-text questions about the diff.

Not GitHub-only either: GitLab, Bitbucket, Azure DevOps and Gitea. Self-host it and point it at whatever model you want.

It doesn't replace my review. It just means I open the PR already knowing where to look.

Repo: [The-PR-Agent/pr-agent](https://github.com/The-PR-Agent/pr-agent).
