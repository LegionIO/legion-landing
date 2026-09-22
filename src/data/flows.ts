import type { SourceId } from './reference';
type Step = { title: string; label: string; detail: string; source: SourceId; needle: string };
export const flows: Record<string, { title: string; steps: Step[] }> = {
  routing: { title: 'Request → selection → outcome', steps: [
    { title: 'Read the request', label: 'Constraints', detail: 'One Router instance captures trusted pins, required capabilities, context bounds, and the attempt budget. Untrusted body-model hints are governed by settings.', source: 'router', needle: 'def initialize(request:' },
    { title: 'Read live inventory', label: 'Inventory', detail: 'Each decision reads Inventory::Registry.snapshot. Provider inventory can change between attempts; the request does not freeze it at construction.', source: 'router', needle: 'def current_inventory' },
    { title: 'Evaluate candidates', label: 'Eligibility', detail: 'The router evaluates every lane against operation, pins, policy, capabilities, context, dimensions, availability, exclusions, fleet requirements, and weight state.', source: 'router', needle: 'def evaluate_lane' },
    { title: 'Rank eligible lanes', label: 'Selection', detail: 'Prefer lanes in the configured context band when present. Choose the greatest effective weight, then use the rendezvous score and lane identity to break ties.', source: 'ranking', needle: 'def rank(lanes:' },
    { title: 'Consume and dispatch', label: 'Attempt', detail: 'The target is consumed before external dispatch. The request increments its attempt count and excludes that exact target from subsequent selections.', source: 'router', needle: 'def consume!' },
    { title: 'Classify the result', label: 'Outcome', detail: 'Success completes the request. A retryable outcome can trigger another selection; a terminal outcome stops the request. Attempt exhaustion is a typed rejection.', source: 'outcomes', needle: 'def classify_outcome' },
  ] },
  tasks: { title: 'Input → ingress → runner', steps: [
    { title: 'Receive an input', label: 'Input', detail: 'CLI, HTTP, and AMQP entry points can send a hash or JSON payload through the shared ingress boundary.', source: 'ingress', needle: 'def normalize' },
    { title: 'Normalize the message', label: 'Normalize', detail: 'Parse the payload, check serialized size when JSON is available, then attach runner, function, source, and timestamps.', source: 'ingress', needle: 'def normalize' },
    { title: 'Validate the target', label: 'Validate', detail: 'Runner class and function names must pass their patterns. An extension that is quiescing can block new work.', source: 'ingress', needle: 'def run(payload:' },
    { title: 'Apply access controls', label: 'Authorize', detail: 'When loaded, worker registration is validated before permission. RBAC authorizes execution using the supplied principal or the local-admin default.', source: 'ingress', needle: '# RAI invariant' },
    { title: 'Choose the execution path', label: 'Dispatch', detail: 'Registered local tasks short-circuit to a direct runner call in task context. Other tasks proceed through Legion::Runner.run.', source: 'ingress', needle: 'if local_runner?(rc)' },
    { title: 'Return the runner result', label: 'Result', detail: 'The managed runner path receives generate_task and check_subtask flags. Downstream task recording and chains belong to that path, not every direct local invocation.', source: 'ingress', needle: 'runner_block = lambda' },
  ] },
  context: { title: 'Earlier turns → curation → next request', steps: [
    { title: 'Finish the current turn', label: 'Turn ends', detail: 'curate_turn checks whether curation is enabled, then schedules work on the executor’s async pool.', source: 'curator', needle: 'def curate_turn' },
    { title: 'Protect recent context', label: 'Preserve', detail: 'The current turn is excluded from distillation. The configured recent-turn window determines which earlier messages remain intact.', source: 'curator', needle: 'preserve_turns = setting' },
    { title: 'Curate older messages', label: 'Transform', detail: 'Older messages are passed through curate_message. Tool-result distillation, thinking removal, and other methods have their own conditions and settings.', source: 'curator', needle: 'curated = older.map' },
    { title: 'Store curated summaries', label: 'Store', detail: 'The curator stores the transformed messages and clears its cached view. This lets a later read see the updated summaries.', source: 'curator', needle: 'store_curated(@conversation_id' },
    { title: 'Build the next context', label: 'Reuse', detail: 'curated_messages loads stored summaries when enabled. The executor uses available curated history, with a raw-history fallback.', source: 'executor', needle: 'history = if curated' },
    { title: 'Gate archival separately', label: 'Archive', detail: 'drop_and_archive only removes older history after successful archival. When disabled, below the target, or unable to archive, it returns the original messages.', source: 'curator', needle: 'def drop_and_archive' },
  ] },
};
