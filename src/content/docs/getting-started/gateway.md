---
title: "Connect an AI client"
description: "Install the LLM pack, inspect provider configuration, and use the supported proxy setup command."
section: "Getting Started"
order: 11
sources: ["setup-cli", "scaffold", "config-cli", "llm-readme"]
special: none
---

## Install the LLM pack

The setup CLI defines an LLM feature pack. Inspect the available packs, then install the LLM layer:

```bash
legion setup packs
legion setup llm
```

The pack adds the routing and provider integration gems defined in the setup source. Provider credentials and usable model availability are separate from installing those gems.

## Configure a provider

Generate the subsystem configuration files and inspect the settings paths:

```bash
legion config scaffold
legion config path
```

Use the generated settings and your chosen provider adapter's configuration documentation. The [AI & LLM catalog](/docs/ecosystem/#catalog-browser) links to each adapter. A cloud adapter needs its provider credentials; a local adapter needs a running, reachable model service. Do not assume a model named in an example is available to your account.

Validate the resulting configuration:

```bash
legion config validate
legion check
```

## Configure proxy mode

With the daemon running and the provider configured:

```bash
legion setup proxy-mode
```

This command writes the Codex provider/profile configuration, shell helper functions, and a proxy-mode installation marker. It skips existing configuration unless explicitly forced. The implementation currently leaves the direct Claude Code configuration writer disabled and prints manual guidance instead.

For Codex, the setup command prints:

```bash
codex --profile legionio
```

Use the command's output for the configured endpoint. If your API uses a different host or port, inspect the supported options first:

```bash
legion setup help proxy-mode
```

## Verify a real request

Send a small request through the configured client. Confirm that your chosen provider receives it and inspect the routing result or error. A running HTTP listener alone does not establish a working inference path.

The [routing walkthrough](/docs/flows/routing/) explains selection and retry behavior. The [generated router defaults](/docs/reference/router/) describe the pinned implementation; your installed release and local overrides determine runtime behavior.
