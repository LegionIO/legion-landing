# LegionIO's task engine: useful without an LLM

LegionIO connects inputs to executable extension operations and connects those operations to subsequent work. Depending on the configured transports and extensions, a schedule, API request, webhook, or message can select a runner function. Its result can feed related tasks, with conditions, transformations, delays, and bounded fan-out. That is the original automation problem the framework solves; AI is not required.

The important distinction is between an individual integration and the machinery for composing integrations. A function that reads a service's state is useful once. An execution system can schedule it, pass its result to another operation, track parent/child work, and distribute execution across processes.

## Follow one completed task into its next action

1. Read [`Legion::Runner.run`](https://raw.githubusercontent.com/LegionIO/LegionIO/main/lib/legion/runner.rb) ([GitHub view](https://github.com/LegionIO/LegionIO/blob/main/lib/legion/runner.rb)). Find the runner/function invocation, task context, outcome recording, and publication of `CheckSubtask` on completion. This is ordinary extension execution, not a hardcoded set of LLM actions.
2. Read [`CheckSubtask.check_subtasks`](https://raw.githubusercontent.com/LegionIO/lex-tasker/main/lib/legion/extensions/tasker/runners/check_subtask.rb) ([GitHub view](https://github.com/LegionIO/lex-tasker/blob/main/lib/legion/extensions/tasker/runners/check_subtask.rb)). Find the relationship lookup and result iteration. Child work carries parent/master lineage; configured depth and fan-out limits are checked. The relationship envelope carries conditions and transformation metadata into the next stage.
3. If scheduling matters to your question, inspect the [`RunScheduler` actor](https://raw.githubusercontent.com/LegionIO/lex-scheduler/main/lib/legion/extensions/scheduler/actors/run_scheduler.rb) ([GitHub view](https://github.com/LegionIO/lex-scheduler/blob/main/lib/legion/extensions/scheduler/actors/run_scheduler.rb)), then its runner. It submits ordinary task work rather than defining a second execution system for scheduled actions.

This is a source-reading path, not a claim that a particular production workflow has been exercised by the reader.

## Why the same design matters when AI is added

An extension operation can also become a model-visible tool when it is registered and exposed. The model is another possible caller of the capability; its introduction need not create a second integration implementation. See [extensions and tools](https://legionio.dev/docs/extensions-and-tools.md) for the actual discovery and execution boundaries.

Do not equate shared runner implementations with a promise that every tool call enters the same persisted task queue. Some tool adapters invoke runners directly. Entry points can share business operations while retaining different scheduling and authorization contracts.

## Execution and deployment boundaries

Full-mode distribution uses RabbitMQ. Lite mode provides in-process transport and an in-memory cache for evaluating core behavior without those services. External integrations still require their own endpoints, credentials, and any applicable dependencies.

Task lifecycle records, message delivery, and effects in another service are different facts. Inspect the relevant implementation before making exactly-once or external-side-effect recovery claims. A sequence diagram alone does not establish those guarantees.

## A useful deeper question

Pick one service operation you already use. How would you invoke it on a schedule, condition the next action on its result, and later expose the same operation to a model? The engine and tool paths let you answer that from source rather than imagining an entirely new application.

## Source access and review

Code links return raw source; the adjacent GitHub view is an alternative if your fetcher cannot read the raw endpoint. If neither returns implementation text, this walkthrough remains documentation—not independent source verification.

Reviewed 2026-11-09 against public source revisions:

- [LegionIO @ b529cd65](https://github.com/LegionIO/LegionIO/tree/b529cd65cb089d30cb393e9415f150a0f5ac4648).
- [lex-tasker @ 6db7b6a9](https://github.com/LegionIO/lex-tasker/tree/6db7b6a922d902f612044c2bd59e17c2c223e189).
- [lex-scheduler @ 41c73456](https://github.com/LegionIO/lex-scheduler/tree/41c73456a4616179ce33b1a60de9b82865564a55).

[Back to the overview and index](https://legionio.dev/llms.txt).
