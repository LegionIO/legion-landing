---
title: "How context is curated"
description: "Follow older conversation turns through curation and into a later request."
section: "Flows"
order: 43
sources: ["curator", "executor", "metrics"]
special: context
---

## Curation happens between turns

After a turn completes, the curator schedules work on the executor's asynchronous pool. It identifies earlier messages and protects recent turns before storing curated summaries. The next request can use those summaries when available; otherwise it can use raw history.

## Strategies are conditional

The implementation contains methods for thinking removal, tool-result distillation, resolved-exchange folding, superseded-read eviction, similarity deduplication, and archival. This does not mean every strategy runs on every message. Settings, content, size, and the call path determine which transformations apply.

Tool distillation can use an explicitly configured model, with a heuristic fallback. It is not accurate to describe every possible curation path as model-free.

## Archiving is a separate gate

`drop_and_archive` checks whether archival is enabled, whether the context target is exceeded, and whether there is older history to remove. It returns the original messages if archival fails. Curation and archival counters can overlap; do not add them to estimate end-to-end savings.

The [published measurements](/docs/evidence/) compare actual payloads with a modeled full-history baseline.
