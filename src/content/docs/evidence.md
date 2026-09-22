---
title: "Measurements, with context"
description: "Inspect the published curation results and the assumptions behind them."
section: "Evidence"
order: 60
sources: ["metrics", "curator", "gaia-readme"]
special: metrics
---

## What was measured

The production curation report aggregates requests from one LegionIO deployment, bucketed by conversation length. The source is an export from `lex-llm-ledger`. These are the author's workload measurements, not independent benchmarks or a live dashboard.

## Read the denominator

The baseline models resending the entire accumulated conversation on every turn, without client-side trimming. Reduction compares that modeled payload with the payload actually sent. A client that already manages context can see smaller differences.

The chart above uses the report's published reduction row. Per-turn token averages are rounded separately, so recomputing the percentage from them can produce a small rounding difference.

## Limits of the evidence

- Single deployment and single author's workload.
- Modeled baseline, not an A/B test.
- Provider prompt caching was off during the reported window.
- Tool definitions were not curated in that window.
- Curation and archival stage counters overlap and must not be added.
- Payload reduction alone does not measure answer quality or guarantee a billing reduction.

## Reproduce the comparison

Install and configure the ledger extension for your deployment. Record a measurement window and group requests by conversation length. Compare actual sent tokens with an explicitly defined full-history baseline, retaining short conversations and failed or unchanged outcomes in your accounting.

The report identifies the ledger as the measurement source but does not publish a complete runnable SQL query or raw dataset. Inspect the ledger schema before constructing your own query. Keep your baseline and provider caching policy alongside the results.
