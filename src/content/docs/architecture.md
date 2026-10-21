---
title: "A modular system"
description: "The task engine, model gateway, and extensions are separate layers with explicit responsibilities."
section: "Architecture"
order: 20
sources: ["core-readme", "core-gemspec", "llm-gemspec", "mcp-gemspec", "discovery"]
special: pipeline
---

## The job engine

LegionIO accepts work from CLI commands, HTTP entry points, subscriptions, and scheduled actors. Ingress normalizes a payload, checks the target and applicable access controls, and dispatches the runner. Runner results can participate in task relationships and chains.

Lite mode uses an in-process execution environment. Distributed deployments use the transport layer and RabbitMQ to move work between nodes. See [the task flow](/docs/flows/tasks/) for the boundary between ingress and runner execution.

## The LLM gateway

`lex-llm` provides shared provider contracts and inventory records. `legion-llm` owns request orchestration, context handling, and routing. Provider adapter gems implement the backend-specific behavior.

The current router reads the live inventory for each decision, filters eligible lanes, and ranks the survivors. A lane represents a concrete provider instance, model, and operation surface. [Routing in detail](/docs/flows/routing/) shows where exclusions and the attempt budget apply.

## Extension runners and tools

An extension packages service-specific behavior in runner methods. The MCP discovery implementation consults registered metadata, checks exposure and dependencies, and constructs tools for eligible functions. Installing an extension and exposing a runner are distinct steps.

The [generated catalog](/docs/ecosystem/) describes code that exists. Runtime availability depends on installed gems, credentials, settings, and exposure policy.

## Optional layers

| Layer | Responsibility | Source of the contract |
| --- | --- | --- |
| `legion-mcp` | MCP server and tool discovery | Its gemspec and discovery implementation |
| `legion-apollo` | Knowledge storage and retrieval | Activated through the appropriate extensions |
| `legion-rbac` | Access policy enforcement | Core ingress invokes it when available |
| `lex-llm-ledger` | Per-request metering and audit records | Extension runners and ledger tables |
| `legion-gaia` | Experimental cognitive coordination | The research layer's own implementation and evidence |

Dependencies are declared in gemspecs. Consult them when composing a deployment instead of inferring dependencies from the names in this diagram.

## The inference pipeline

The following stages are extracted from the executor constants. They describe the declared pipeline; a request's profile can skip stages. They are not a live execution trace.
