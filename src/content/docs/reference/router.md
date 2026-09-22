---
title: "Router defaults"
description: "Default Ruby expressions extracted directly from the router settings module."
section: "Reference"
order: 71
sources: ["router-defaults", "router"]
special: defaults
---

## Settings namespace

The current router reads settings from `Legion::Settings[:llm][:router]`. Each entry below is a method in the owning settings module. The expressions are Ruby source, not a ready-to-paste JSON configuration.

Use [the configuration guide](/docs/configuration/) to locate your effective settings. The default declaration is only the starting value; overlays and per-request trusted constraints can affect behavior.
