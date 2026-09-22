---
title: "Follow the work"
description: "Interactive source walkthroughs of the decisions that turn an input into an output."
section: "Flows"
order: 40
sources: ["router", "ingress", "curator"]
special: none
---

## Model routing

[Follow an LLM request →](/docs/flows/routing/)

See how request constraints, live inventory, candidate filtering, and ranking produce a dispatch target. Switch between success, a retryable timeout, and a terminal policy outcome.

## Task execution

[Follow a task →](/docs/flows/tasks/)

Trace the ingress boundary: normalize a payload, validate the runner and function, apply applicable authorization, and dispatch. Inspect where local runner execution branches from the task engine.

## Context curation

[Follow conversation history →](/docs/flows/context/)

Distinguish asynchronous curation of earlier turns from the context used in the next request. Inspect the archival gate that protects history when archival fails.

## Reading these diagrams

Each node opens an explanation and a link to the implementing source. The diagrams simplify control flow for learning; they do not execute Ruby, model provider availability, or report a live trace. Actual behavior depends on the installed revision, active profile, settings, and request.
