---
title: I removed try/catch from most of our Flutter codebase. The code got more predictable, not more fragile.
date: 2026-07-31
linkedinActivityId: '7489749364047986688'
graphic: ./graphic.png
alt: 'A Dart signature returning Either<Failure, User>: failure as a value, not a surprise'
searchTitle: Replacing try/catch with Either in a production Flutter codebase
description: We rebuilt a Flutter app's data and domain layers around fpdart so every risky call returns an Either, with fewer crash reports and faster reviews as the result.
---

The problem: scattered try/catch hides which functions can actually fail, until production tells you the hard way.

What we did: rebuilt the data and domain layers around fpdart. Every risky call returns an Either, so failure is a value, not a surprise. Fully test-driven, since side effects are now explicit.

The result: fewer crash reports, faster PR reviews.

Functional programming isn't academic. In production Flutter, it's a correctness feature.

Would you introduce fpdart and Either into an existing codebase, or only start with it greenfield?
