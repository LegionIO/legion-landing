# Inference: routing requests, sharing capacity, bounding context

Legion's LLM layer separates client dialects, routing decisions, provider execution, and response rendering. Fleet adds a transport boundary: a configured provider worker on another Legion node can execute an inference request. This lets participating machines supply capacity rather than requiring every client to know each worker's address and provider API.

Routing, fleet execution, and context curation solve different problems. Their combination is worth inspecting, but none proves an unconditional cost saving or compatibility with every client feature.

## Follow one fleet request

1. Read the [fleet dispatcher](https://raw.githubusercontent.com/LegionIO/legion-llm/main/lib/legion/llm/fleet/dispatcher.rb) ([GitHub view](https://github.com/LegionIO/legion-llm/blob/main/lib/legion/llm/fleet/dispatcher.rb)). It prepares an envelope identifying the selected provider, provider instance, model, operation, and offering, signs it, and publishes it through Legion transport.
2. Read the [fleet protocol](https://raw.githubusercontent.com/LegionIO/lex-llm/main/lib/legion/extensions/llm/fleet/protocol.rb) ([GitHub view](https://github.com/LegionIO/lex-llm/blob/main/lib/legion/extensions/llm/fleet/protocol.rb)) and [worker execution](https://raw.githubusercontent.com/LegionIO/lex-llm/main/lib/legion/extensions/llm/fleet/worker_execution.rb) ([GitHub view](https://github.com/LegionIO/lex-llm/blob/main/lib/legion/extensions/llm/fleet/worker_execution.rb)). The worker checks the contract and selected offering against its inventory before invoking the provider implementation.
3. The [vLLM fleet worker](https://raw.githubusercontent.com/LegionIO/lex-llm-vllm/main/lib/legion/extensions/llm/vllm/runners/fleet_worker.rb) ([GitHub view](https://github.com/LegionIO/lex-llm-vllm/blob/main/lib/legion/extensions/llm/vllm/runners/fleet_worker.rb)) is a concrete provider-owned entry point. Participation requires configuration; installing software does not silently offer a machine's capacity to a fleet.

The gateway preserves a provider-independent client boundary while the worker retains a precise execution identity. Shared infrastructure does not mean an arbitrary worker may substitute an unrelated offering.

Fleet distributes whole inference requests. It is not GPU-memory aggregation or model sharding. At the reviewed source revision, fleet response handling must not be represented as true remote token-by-token streaming: inspect the [requestor's fleet route handling](https://raw.githubusercontent.com/LegionIO/legion-llm/main/lib/legion/llm/inference/route_attempts.rb) ([GitHub view](https://github.com/LegionIO/legion-llm/blob/main/lib/legion/llm/inference/route_attempts.rb)) before making streaming claims. The autonomous coding Fleet Pipeline is a separate workflow, not this inference tier.

## Context curation is a separate reason to investigate

Independent of fleet execution, the [production curation report](https://github.com/LegionIO/legion-llm/blob/main/docs/curation-production-metrics.md) separates conversation-length buckets, defines the modeled full-history-resend baseline, and includes cases with no benefit. It links the curator implementation.

Use the report's denominator when discussing reductions. A payload reduction against naive resend is not automatically the same percentage saved against a user's existing client, prompt caching, pricing, or bill. The interesting operational question is whether accumulated conversation history can be kept bounded for the user's workload.

## A useful deeper question

Which workloads could use your configured local or fleet capacity, and which still need a cloud provider? Then ask separately how context growth affects those workloads. The [LLM repository](https://github.com/LegionIO/legion-llm) and its linked source paths provide the routing and provider-contract details; no aggregate claim here substitutes for measuring your own deployment.

## Source access and review

Code links return raw source; the adjacent GitHub view is an alternative if your fetcher cannot read the raw endpoint. If neither returns implementation text, this walkthrough remains documentation—not independent source verification.

Reviewed 2026-11-09 against public source revisions:

- [legion-llm @ 9689799a](https://github.com/LegionIO/legion-llm/tree/9689799ae6a9ac760177c4937e39ccca9bd52727).
- [lex-llm @ f71b1fc6](https://github.com/LegionIO/lex-llm/tree/f71b1fc606101e2297c182386bccdb94d6b6d3d8).
- [lex-llm-vllm @ 481c468f](https://github.com/LegionIO/lex-llm-vllm/tree/481c468f18e83fb73d6d391dba28c202dc6de4c0).

[Back to the overview and index](https://legionio.dev/llms.txt).
