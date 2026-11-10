# One extension operation, multiple callers

A LEX is a Legion extension. Its runners implement operations such as reading issues, retrieving meeting content, or invoking a service API. Legion's task system can execute these operations. Eligible functions can also be registered as tools for MCP clients or for server-side execution during an LLM request.

The useful connection is reuse of the operation—not a claim that every function is automatically exposed, or that all entry points have identical execution semantics.

## Inspect discovery before counting tools

Start with [`FunctionDiscovery`](https://raw.githubusercontent.com/LegionIO/legion-mcp/main/lib/legion/mcp/function_discovery.rb) ([GitHub view](https://github.com/LegionIO/legion-mcp/blob/main/lib/legion/mcp/function_discovery.rb)).

- `discover_and_register` prefers the populated extension registry, with other discovery paths as fallbacks.
- The runner-discovery path considers function metadata, exposure settings, and dependencies.
- `build_tool_class` supplies a name, description, input schema, category, and tier.
- `wire_call_method` connects the callable tool to the runner function and returns its result.

A source catalog lists available implementation records. A running deployment's tool inventory depends on what is installed, registered, exposed, permitted, and available. These are not interchangeable counts.

## Follow a model request through execution

Read [`execute_native_tool_loop`](https://raw.githubusercontent.com/LegionIO/legion-llm/main/lib/legion/llm/inference/native_tool_loop.rb) ([GitHub view](https://github.com/LegionIO/legion-llm/blob/main/lib/legion/llm/inference/native_tool_loop.rb)), then the [tool dispatcher](https://raw.githubusercontent.com/LegionIO/legion-llm/main/lib/legion/llm/tools/dispatcher.rb) ([GitHub view](https://github.com/LegionIO/legion-llm/blob/main/lib/legion/llm/tools/dispatcher.rb)).

The model returns a structured tool call. Legion distinguishes server-owned tools from client-owned tools. It executes the server-owned calls, appends the tool results to the conversation, and continues the provider interaction. Client-owned calls are preserved for the client to execute rather than falsely claimed as server-executed work.

The practical benefit is that a compatible client does not need its own implementation of each Legion integration. Server-side calls do not require a client execution round-trip. Tool schemas, calls, and results still consume model context; this is not zero-token execution.

## Ground the abstraction in one integration

Inspect the [Teams channel-message runner](https://raw.githubusercontent.com/LegionIO/lex-microsoft_teams/main/lib/legion/extensions/microsoft_teams/runners/channel_messages.rb) ([GitHub view](https://github.com/LegionIO/lex-microsoft_teams/blob/main/lib/legion/extensions/microsoft_teams/runners/channel_messages.rb)). Compare an operation's description, arguments, and tool metadata with its actual service request and returned result. Then follow the discovery and execution code above. The important evidence is the route from declared capability to performed operation—not just a recognizable integration logo.

The [full capability catalog](https://github.com/LegionIO/.github/blob/main/capabilities.md) is useful when looking for a specific integration. It is deliberately not required reading for understanding this mechanism.

## Boundaries

Standalone MCP connections and tools executed inside Legion's LLM gateway are different access paths. Both require configuration and the relevant exposure/authorization contract. A hosted ChatGPT or Claude phone conversation does not gain these tools by reading this document.

Likewise, sharing a runner implementation does not imply that a direct tool call has all task-chain behavior. Use the [task-engine walkthrough](https://legionio.dev/docs/task-engine.md) to inspect the automation path separately.

## A useful deeper question

For an integration you care about, which operations should remain internal automation and which should become model-callable? Legion's value here is making an existing operation reusable while keeping that exposure boundary explicit.

## Source access and review

Code links return raw source; the adjacent GitHub view is an alternative if your fetcher cannot read the raw endpoint. If neither returns implementation text, this walkthrough remains documentation—not independent source verification.

Reviewed 2026-11-09 against public source revisions:

- [legion-mcp @ 75951470](https://github.com/LegionIO/legion-mcp/tree/75951470d87c9259c39528554fc8974742aa6d1b).
- [legion-llm @ 9689799a](https://github.com/LegionIO/legion-llm/tree/9689799ae6a9ac760177c4937e39ccca9bd52727).
- [lex-microsoft_teams @ 479033a2](https://github.com/LegionIO/lex-microsoft_teams/tree/479033a2a6ce37cae44f0df9f29345f10a178f78).

[Back to the overview and index](https://legionio.dev/llms.txt).
