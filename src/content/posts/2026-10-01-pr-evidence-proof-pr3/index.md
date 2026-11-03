---
title: My agent builds the old version of the app first. Not as a backup. To photograph it.
date: 2026-10-01
linkedinActivityId: '7511429879624527873'
graphic: ./graphic.png
alt: 'Screenshot of an agent session capturing the before state of an app for a pull request'
---

My agent builds the old version of the app first.

Not as a backup. To photograph it.

That's the first rule of pr-evidence, the skill I published last week: capture the before while the base branch is still checked out. Grab it later and you pay for a second build.

Once the change is built, it shoots the after: same screen, same state, same emulator. Both go side by side in the pull request, so the reviewer sees what moved without opening the diff.

A finished pull request made this way: [pr-evidence#3](https://github.com/ArefMozafari/pr-evidence/pull/3). The skill: [ArefMozafari/pr-evidence](https://github.com/ArefMozafari/pr-evidence).
