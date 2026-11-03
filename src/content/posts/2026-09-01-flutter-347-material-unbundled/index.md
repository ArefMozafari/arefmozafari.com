---
title: Material Design is leaving the Flutter SDK.
date: 2026-09-01
linkedinActivityId: '7500591432827699200'
graphic: ./graphic.png
alt: 'Screenshot of the Flutter 3.47 announcement with a gold circle drawn around the version number'
---

Material Design is leaving the Flutter SDK.

Flutter 3.47 ships material_ui and cupertino_ui as standalone 1.0 packages on pub.dev. They release on their own weekly schedule now, not once a quarter with the SDK. The originals inside the core SDK are scheduled for formal deprecation in the November stable.

After seven years of Flutter, this is the structural change I wanted most. Design systems can move at design speed. The framework core gets leaner. A Material bugfix stops waiting three months for a stable release.

It also means every Flutter app in maintenance has this migration in its future. I'm starting with my smallest package first. Flutter upgrades taught me that the hard way.

Full announcement: [What's new in Flutter 3.47](https://flutter.dev/blog/whats-new-in-flutter-3-47).
