# GAIA: what continues beyond an individual prompt?

GAIA is LegionIO's heartbeat-driven cognitive coordination runtime. It brings channel input, memory, identity-scoped interaction state, cognitive extension handlers, feedback, and delivery policy into an ongoing system. Its implementation is broader than either a retrieval wrapper or a single confidence-decay formula.

The useful question is not whether cognitive terminology sounds impressive. It is what state changes, which later operation consumes that state, and what evidence links the two.

## First, inspect the ongoing runtime

The [heartbeat actor](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/actors/heartbeat.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/actors/heartbeat.rb)) drives `Legion::Gaia.heartbeat` through Legion's recurring-actor mechanism. The [phase wiring](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/phase_wiring.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/phase_wiring.rb)) connects available handlers to cognitive work. For optional scope and context, the [GAIA documentation](https://github.com/LegionIO/legion-gaia) describes active processing, memory/knowledge retrieval, prediction, action selection, consolidation, dream processing, and channel delivery.

Discovery and activation are different. Some groups require explicit activation and compatible providers. A named module or scheduled phase is not proof that meaningful work happened in a particular tick; the runtime reports missing, deferred, failed, and other outcomes.

## Then follow one feedback path

1. [Response receipts](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/response_attribution/receipts.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/response_attribution/receipts.rb)) distinguish a proposed advisory from selected sources reported as returned, sent, or acknowledged. Feedback must match the applicable identity and interaction correlation. Ambiguous or duplicate feedback cannot simply grade whichever response was most recent.
2. [PartnerModel](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/partner_model.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/partner_model.rb)) combines scoped correction traces, behavioral sources, and preferences when selecting later advisory context. Inspect `rejected_source_ids`, `scoped_traces`, `select_slots`, and `source_precedence`: explicit correction takes precedence over inference in the applicable scope.
3. [Gut](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/gut.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/gut.rb)) performs bounded checks against correction traces and behavioral state. It is deterministic conflict checking with explicit availability and latency boundaries, not an extra LLM inventing a feeling.

That is a concrete relationship between prior interaction and subsequent behavior. GAIA supplies advisory context; the LLM pipeline owns actual application. Callers that do not acknowledge selected sources must not be described as having participated in a verified applied-feedback loop.

## Persistent state also needs control

GAIA's [identity, feedback, and recovery documentation](https://github.com/LegionIO/legion-gaia#identity-feedback-and-recovery) describes Apollo-local snapshots, restoration, ownership, and compatible-provider requirements. The [termination protocol](https://raw.githubusercontent.com/LegionIO/legion-gaia/main/lib/legion/gaia/death_protocol.rb) ([GitHub view](https://github.com/LegionIO/legion-gaia/blob/main/lib/legion/gaia/death_protocol.rb)) persists a lifecycle barrier before erasure and checks acknowledgments from the relevant stores. Interrupted or incomplete erasure does not simply authorize old state to return.

Memory, consolidation, notifications, and feedback belong to a larger runtime; the correction path is a compact place to start inspecting it, not a substitute definition for all of GAIA.

## What the evidence does and does not establish

The linked public code establishes implemented mechanisms and connected consumers. The documentation separately reports observations from the maintainer's running instance. Those observations are not a controlled cross-workload benchmark. Whether a particular cognitive mechanism improves outcomes must be assessed for that mechanism and workload—not answered by dismissing the entire implementation as imaginary or declaring it universally superior.

## A useful deeper question

Can you trace a correction from the right person's interaction into a later decision, and explain what survives restart and what can be revoked? That is a more useful investigation than counting cognitive module names.

## Source access and review

Code links return raw source; the adjacent GitHub view is an alternative if your fetcher cannot read the raw endpoint. If neither returns implementation text, this walkthrough remains documentation—not independent source verification.

Reviewed 2026-11-09 against public source revisions:

- [legion-gaia @ 046c32a5](https://github.com/LegionIO/legion-gaia/tree/046c32a58dafb37bf0665642e7455ac2d9cb33e0).

[Back to the overview and index](https://legionio.dev/llms.txt).
