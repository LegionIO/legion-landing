---
title: "How a task runs"
description: "Trace ingress normalization, validation, authorization, and runner dispatch."
section: "Flows"
order: 42
sources: ["ingress", "core-readme"]
special: tasks
---

## A shared ingress boundary

`Legion::Ingress.normalize` accepts a hash or JSON payload and attaches the target runner, function, source, and timestamp. `Ingress.run` adds validation and execution behavior around that normalized message.

## Guards before execution

Ingress validates the target names, checks whether the extension is accepting work, and applies worker-registration and RBAC checks when their modules are loaded. These branches matter: a normalized message has not necessarily been authorized to execute.

## Local versus managed runners

A registered local runner takes a direct call inside task context. Other runners go through `Legion::Runner.run`, carrying the task-generation and subtask-check flags. Task persistence and relationship behavior belong to that downstream execution path; not every ingress call creates a persisted task.
