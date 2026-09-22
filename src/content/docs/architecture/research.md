---
title: "The experimental layer"
description: "Understand the boundary between implemented mechanics and demonstrated outcomes."
section: "Architecture"
order: 21
sources: ["gaia-readme", "core-readme"]
special: none
---

## What is experimental

The GAIA and agentic extensions explore coordination, memory, and adaptive behavior on top of the job engine. Their underlying mechanics are scheduled jobs and state updates. Terms such as “tick,” “dream,” and “cognitive” name parts of that design; they do not establish human-like cognition.

The core README labels this layer experimental. You can evaluate the task engine or gateway without using it.

## What the evidence supports

The GAIA README reports observations from the maintainer's development instance and distinguishes implemented mechanisms from those with accumulated data. Read that report for its measurement window and limitations. Do not turn those observations into a general benchmark or a claim of production reliability.

## How to evaluate it

1. Identify the behavior you expect to improve and define a baseline.
2. Inspect the responsible extension's runners, actors, and tests.
3. Collect results from your own workload, including failures and unchanged outcomes.
4. Compare those results with the baseline before adopting the behavior operationally.

The [Evidence section](/docs/evidence/) makes the same distinction for gateway curation: measured payload reductions in one workload are useful evidence, with a specific denominator and scope.
