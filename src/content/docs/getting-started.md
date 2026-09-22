---
title: "Run your first node"
description: "Install LegionIO and evaluate the job engine in lite mode before adding external services."
section: "Getting Started"
order: 10
sources: ["core-readme", "core-gemspec", "cli"]
special: none
---

## Install

Use Ruby 3.4 or newer. The gem installation is the direct path for an existing Ruby environment:

```bash
gem install legionio
```

The homepage also provides a Homebrew installation:

```bash
brew tap LegionIO/tap
brew install legionio
```

## Start in lite mode

```bash
LEGION_MODE=lite legion start
```

Lite mode runs the task engine in process without RabbitMQ, Redis, or a database service. It is a useful starting point for evaluating the framework locally. It does not provide model inference by itself: an LLM workload still needs a configured provider or local model.

Keep the process running. In a second terminal, inspect your installation and run its startup checks:

```bash
legion version
legion check
legion status
```

`check` validates whether Legion can start; `status` reports service status. A successful daemon start is not proof that every optional integration has working credentials.

## Add only the layers you need

- **AI clients and model routing:** continue to [Connect an AI client](/docs/getting-started/gateway/).
- **Tasks and integrations:** learn how [inputs reach runners](/docs/flows/tasks/) and choose gems from the [ecosystem](/docs/ecosystem/).
- **Deployment configuration:** inspect [settings and their owners](/docs/configuration/) before adding RabbitMQ or other services.

## If startup fails

Read the error from `legion check` and inspect the commands supported by your installed version with `legion help`. Confirm your Ruby version and the settings paths before troubleshooting an optional service. The [CLI reference](/docs/reference/cli/) is generated from a pinned source revision, so a different installed release may expose different commands.
