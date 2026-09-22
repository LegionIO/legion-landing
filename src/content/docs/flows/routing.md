---
title: "How a model is selected"
description: "Inspect the current router\u2019s decision path and explore successful, retryable, and terminal outcomes."
section: "Flows"
order: 41
sources: ["router", "ranking", "outcomes", "router-defaults"]
special: routing
---

## One router per request

The router computes request-derived facts at construction: trusted pins, required capabilities, input and output bounds, and the attempt budget. Inventory is read again for each selection decision. A previous snapshot is not treated as permanent truth.

## Eligible comes before preferred

The router evaluates operation compatibility, pins, policy, capabilities, context, dimensions, availability, exclusions, fleet constraints, and weight state. The ranking module prefers eligible lanes whose configured context band contains the budget, then uses effective weight and deterministic tie-breaking.

The tier names remain part of the configuration and inventory taxonomy. They are not enough to predict a particular request's winner. The current ranking source is the authority; the older “always try the cheapest tier first” description omits this selection model.

## Attempts have boundaries

A selected target is consumed before dispatch and cannot be selected again during that request. Retryable outcomes may cause a new decision against fresh inventory. A terminal outcome ends the path. The interactive example above illustrates those distinctions without simulating the ranking algorithm.
